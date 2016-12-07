var xagent = {
    /* ==== properties ====*/
    proxyURL: "",                       //to be set by XAgent.aspx
    isXSellCustomer: true,              //to be updated after sending 1st XSellAction request
    betslipFrameReady: false,
    betslipFrameId: 4,
    betslipID: "BS",
    unprocXSellActionResponses: [],     //array storing sendXSellActionResponse without corresponding MsgHolder
    clientSystems: new Object(),
    msgHolderIndex: new Object(), //use msgbox id as an index to search client system.
    // error message is not internal system disgonis only.
    errorMessages: {
        0: "No XContentHandler is provided or detected",
        1: "betslip is not ready",
        2: "The given handler doesn't belong to app execution context",
        3: "Cross Selling is not enabled currently",
        4: "Current user has not login yet",
        5: "Current user is not xsell customer"
    },

    /* ==== interface functions for JCBW Info and Betslip frame start==== */
    registerApp: function(appID, app, msgHolderIDs, xHandler) {
        //  1.  if appID registered before, remove all related information
        //  2.  save all input parameters with appID as index
        //  3.  check if callback function is defined:
        //          xHandler or recieveXContent
        //  4.  if register appID is betslipID
        //      4.1 update betslipFrameReady = true
        //  5.  if msgHolderIDs contain any saved XSellActionResponse
        //      5.1 call sendXSellActionCallback with saved unprocessed XSellActionResponse
        //      5.2 remove unprocessed XSellActionResponse

        try {
            this.clientSystems[appID] = new Object();
            this.clientSystems[appID].id = appID;
            this.clientSystems[appID].context = app;
            this.clientSystems[appID].msgHolders = msgHolderIDs;

            //remove all messageHolders points the appID
            for (i in this.msgHolderIndex) {
                if (this.msgHolderIndex[i] == appID) {
                    delete this.msgHolderIndex[i];
                }
            }
            //add msgHolderIDs to msgbixIndex
            for (i in msgHolderIDs) {
                this.msgHolderIndex[msgHolderIDs[i]] = appID;
            }

            if (xHandler != undefined && xHandler != null) {
                this.clientSystems[appID].xHandler = xHandler;
            } else if (app.recieveXContent != undefined && app.recieveXContent != null) {
                this.clientSystems[appID].xHandler = app.recieveXContent;
            } else {
                // No XContentHandler error
                this.error = this.errorMessages[0];
                return false;
            }
            if (appID == this.betslipID) {
                this.betslipFrameReady = true;
            }

            if (this.betslipFrameReady) {
                //Try to put the saved content
                for (i in this.unprocXSellActionResponses) {
                    if (this.unprocXSellActionResponses[i] != undefined && this.unprocXSellActionResponses[i] != null) {
                        this.sendXSellActionCallback(this.unprocXSellActionResponses[i]);
                    }
                }
                return true;
            } else {
                this.error = this.errorMessages[1];
                ////trace ( "Error:" +  this.error);
                return false;
            }
        } catch (err) {
            this.error = err.message;
            //trace(err.message);
            return false;
        }
    },

    raiseXEvent: function(eventID) {
        //  1.  if betslip frame exist/ user not login/ xsell is disable(from betslip also)/ isXSellCustomer=false, exit
        //  2.  otherwise
        //      2.1 get betslip sessioninfo
        //      2.2 assembly xsell request Json object
        //      2.3 call sendXSellAction function
        //trace("Received Event, ID:" + eventID);
        /*
        The follow conditions must be met firs
        1). BetSlip is ready and registered
        2).	User has login,
        3). Cross-Selling is enabled currently
        4). this.isXSellCustomer  is true ;// otherwise, it is a not target customer
        */
        try {
            if (!this.betslipFrameReady) {
                this.error = this.errorMessages["1"];
                return false;
            }

            if (!this.isXSellCustomer) {
                this.error = this.errorMessages["5"];
                //this.notifyBetSlip();
                return false;
            }
            var bs = this.clientSystems[this.betslipID].context;

            var sInfo = bs.getSessionInfo();
            // Check session info is empty and it's login
            if (sInfo == null || bs.isLogon() != 1) { //not login
                this.error = this.errorMessages["4"];
                //this.notifyBetSlip();
                return false;
            } else if (!bs.isXSellEnabled()) {
                this.error = this.errorMessages["3"];
                //this.notifyBetSlip();
                return false;
            }
            var eventParam = {
                messageType: 'EventAction',
                messageContent: JSON.stringify({
                    eid: eventID,
                    ac: sInfo.accountNo,
                    ab: sInfo.balance,
                    lc: bs.getLanguage(),
                    pt: sInfo.poolTypes,
                    t: new Date().getTime(),
                    bsd: sInfo.bsd
                })
            };

            this.sendXSellAction(eventParam, this.sendXSellActionCallback);

        } catch (err) {
            //trace(err.message);
            this.error = err.message;
            return false;
        }
    },
    /* ==== interface functions for JCBW Info and Betslip frame end==== */

    //send XSell Event async request to XSell server via jquery
    //this func should be used in testing page
    sendXSellAction: function(XSellEventJson, callbackFunc) {
        $.post(this.proxyURL, XSellEventJson, callbackFunc, "json");
    },

    sendXSellActionCallback: function(JsonResponse) {
        //  1.  if ResultCode == NOT_XSELL_CUSTOMER
        //      1.1 set isXSellCustomer = false and return
        //  2.  if ResultCode == SUCCESS
        //      2.1 find the MsgHolder corresponding frame
        //      2.1.1   if not found, append JsonResponse to unprocXSellActionResponses and exit
        //      2.1.2   otherwise, call corresponding frame's xHandler with MsgHolder IDs and content

        if (JsonResponse.ResultCode == 1) {
            xagent.isXSellCustomer = false;
            return;
        }
        if (JsonResponse.ResultCode == 0) {
            var found = false;
            for (var i = 0; i < JsonResponse.MsgHolders.length; i++) {
                var clientSys = xagent.searchClientByMsgBoxID(JsonResponse.MsgHolders[i]);
                if (clientSys != null) {
                    //found msgholder!
                    var submitResult = clientSys.xHandler.call(clientSys.context, JsonResponse.MsgHolders[i], JsonResponse.Content);
                    if (submitResult == undefined || submitResult) {
                        found = true;
                        // remove the saved content
                        if (JsonResponse.storedIndex != undefined) {
                            delete xagent.unprocXSellActionResponses[JsonResponse.storedIndex];
                        }
                        break;
                    }
                }
            }
            if (!found) {
                //save content
                if (JsonResponse.storedIndex == undefined) {
                    JsonResponse.storedIndex = xagent.unprocXSellActionResponses.push(JsonResponse) - 1;
                }
            }
        }
      },
    
      sendResponseWithResult: function(responseType, logID, callbackFunc) {
        var responseParam = {
          messageType: "ResponseAction",
          messageContent: JSON.stringify({ logID: logID, responseType: responseType })
        };
        
        if (window.XDomainRequest) {
          xdr = new XDomainRequest();
          if (xdr) {
            xdr.open('POST', this.proxyURL);
            xdr.send(JSON.stringify(responseParam));
          }
        } else {     
          jQuery.post(this.proxyURL, responseParam, callbackFunc, "json");
        }
      },


      searchClientByMsgBoxID: function(msgboxID) {
          var targetAppID = this.msgHolderIndex[msgboxID];
          if (targetAppID == undefined) {
              return null;
          } else {
              return this.clientSystems[targetAppID];
          }
      }
};

//for legacy support
function JCBWchangeURL(targeturl, logID) {
    try {
        SendXResp(logID, 2);
        top.info.location.href = targeturl;        
    } catch (ex) {        
    }
}

function XsellOpenNewWindow(targeturl, logID, window_name, window_feature) {
    try {
        SendXResp(logID, 2);
        var newwin = window.open(targeturl, window_name, window_feature);
        newwin.focus();        
    } catch (ex) {        
    }
}

function SendXResp(logID, actID) {
    XResponse.proxyURL = this.xagent.proxyURL;
    XResponse.logID = logID;
    XResponse.sendResponse(actID);
}