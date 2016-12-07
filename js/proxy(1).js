//for cross frame communication using postMessage approach
//pre-req: jQuery

$j = jQuery.noConflict();

/******** PROXY *********/
var proxy = new proxyHdlr();

function proxyHdlr() {
  return {
    //run init(), after this in receiver frame is ready
    init: function(targetRcvr, rcvrPlugIns, sendToDomain, acceptedDomains) {
      if (rcvrPlugIns)
        $j.extend(this.rcvrPlugIns, rcvrPlugIns);

      this.targetRcvr = targetRcvr;

      this.sendToDomain = sendToDomain;
      this.acceptedDomains = acceptedDomains;

      if (window.addEventListener) {
        window.addEventListener('message', this.receiveMessage, false);
      } else if (window.attachEvent) {
        //ie8 support
        window.attachEvent('onmessage', this.receiveMessage);
      }
      this.initiated = true;
    },
    receiveMessage: function(event) {
      //check the origin of the request is expected
      if (!proxy.checkIsAcceptedSubDomainy(event.origin))
        return;

      var para = $j.parseJSON(event.data);

      if (typeof para.needRedirect != 'undefined' && para.needRedirect) {
        //redirect message to desired frame via sender        
        proxy.getReceiver(para.redirectFrame).postMessage(JSON.stringify(para.para), proxy.sendToDomain);
      } else if (typeof para.isCallback != 'undefined' && para.isCallback) {
        // execute pre-callback event
        if (proxy.rcvrPlugIns[para.type] && proxy.rcvrPlugIns[para.type].preExecCallback)
          proxy.rcvrPlugIns[para.type].preExecCallback(para.returnVal);
        // handle response from receiver
        proxy.execCallback(para.callbackId, para.returnVal);
      } else {
        // handle sender's request
        if (typeof proxy.rcvrPlugIns[para.type].needRedirect != 'undefined' && proxy.rcvrPlugIns[para.type].needRedirect) {
          //current frame is not targeted frame, redirect to the sender to desired frame
          var redirectPara = { needRedirect: true,
            redirectFrame: proxy.rcvrPlugIns[para.type].redirectFrame,
            para: para
          };
          proxy.getReceiver().postMessage(JSON.stringify(redirectPara), proxy.sendToDomain);
        } else {
          //noraml return msg
          proxy.rcvrPlugIns[para.type].exec(para.funcName, para.data,
          //return function 
            function(obj, sourceInfo) {
              var retObj = {
                callbackId: para.callbackId,
                returnVal: obj,
                isCallback: true,
                type: para.type,
                funcName: para.funcName
              };
              if (para.callbackId != proxy.NO_CALLBACK_ID) {
                sourceInfo.source.postMessage(JSON.stringify(retObj), sourceInfo.origin);
              }
            }, proxy.formatter, { source: event.source, origin: event.origin });
        }
      }

    },
    sendMessage: function(type, funcName, data, callback) {
      if (this.initiated) {
        var callbackId = proxy.saveCallback(callback);
        var msg = { type: type, funcName: funcName, data: proxy.deepCloneObj(data), callbackId: callbackId };

        proxy.getReceiver().postMessage(JSON.stringify(msg), proxy.sendToDomain);
        return true;
      }
      return false;
    },
    //no callback for popup sender
    sendMessageFromPopup: function(type, funcName, data) {
      if (this.initiated) {
        callback = proxy.NO_CALLBACK;
        var callbackId = proxy.saveCallback(callback);
        var msg = { type: type, funcName: funcName, data: proxy.deepCloneObj(data), callbackId: callbackId };
        if (navigator.appVersion.indexOf("MSIE 8") != -1) {
          //use setTimeout to convey the data msg to receiver for IE8
          setTimeout(function() { proxy.getReceiver().postMessage(JSON.stringify(msg), proxy.sendToDomain); }, 0);
        } else {
          proxy.getReceiver().postMessage(JSON.stringify(msg), proxy.sendToDomain);
        }
        return true;
      }
      return false;
    },
    execCallback: function(callbackId, returnVal) {
      if (this.callbackStore[callbackId])
        this.callbackStore[callbackId](returnVal);
      delete this.callbackStore[callbackId];
    },
    saveCallback: function(callback) {
      if (callback == this.NO_CALLBACK) {
        return this.NO_CALLBACK_ID;
      } else {
        this.callbackStore[this.callbackIdCnt] = callback;
        return this.callbackIdCnt++;
      }
    },
    getSubDomain: function(url) {
      url_parts = url.split('.');
      return url_parts.splice(1, url_parts.length - 1).join('.');
    },
    checkIsAcceptedSubDomainy: function(url) {
      url_subDomain = proxy.getSubDomain(url);
      for (var i = 0; i < proxy.acceptedDomains.length; i++) {
        if (url_subDomain == proxy.getSubDomain(proxy.acceptedDomains[i]))
          return true;
      }

      return false;
    },
    initiated: false,
    sendToDomain: "",
    acceptedDomains: [],
    callbackStore: {},
    callbackIdCnt: 0,
    targetRcvr: undefined,
    rcvrPlugIns: {
      Echo: {
        exec: function(funcName, data, callback, formatter, source) { callback(formatter(true, data.content), source); },
        para: function() { return { msg: ['content'] }; }
      },
      GetParas: {
        exec: function(funcName, data, callback, formatter, source) {
          var retObj = {};
          var isSuccess = false;

          switch (funcName) {
            case 'GetTypeNames':
              isSuccess = true;
              retObj = { TypeNames: [] };

              for (funcName in proxy.rcvrPlugIns)
                retObj.TypeNames.push(funcName);
              break;
            case 'GetFuncNames':
              isSuccess = true;
              retObj = { FuncNames: proxy.rcvrPlugIns[data.TypeName].para() };
              break;
            default:
              isSuccess = false;
              retObj = 'unrecongized command. Expected \'GetFuncNames\'/\'GetParas\'';
          }

          callback(formatter(isSuccess, retObj), source);
        },
        para: function() {
          return {
            GetTypeNames: [],
            GetFuncNames: ['TypeName']
          };
        }
      }
    },
    formatter: function(isSuccess, content) {
      return { result: (isSuccess ? proxy.CONST_SUCCESS : proxy.CONST_FAIL), content: content };
    },
    getReceiver: function(frameExpression) {
      var frameObj;
      if (frameExpression === undefined)
        frameObj = this.targetRcvr;
      else
        frameObj = window.frames[frameExpression];
      return (frameObj.postMessage) ? frameObj : frameObj.contentWindow;
    },
    deepCloneObj: function(obj) {      
      return jQuery.extend({}, obj);
    },
    CONST_SUCCESS: '0',
    CONST_FAIL: '1',
    NO_CALLBACK: function() { },     //dummy function for no callback
    NO_CALLBACK_ID: -1
  };
}