//  desc:   service handler class
//  prereq: jquery.js, datastore_func.js
var svc = new svcHdlr();

//use popupSvc in popup window only
var popupSvc = new popupSvcHdlr();
function popupSvcHdlr() {
  return {
    init: function(errorMsgFunc) {
      svc.init(errorMsgFunc);
      //release lock for seq_no sensitive request
      window.onunload = function() {
        svc.UnmarkBusy();
      }
    },
    //for external use
    sendReqSeqNo2: function(methodKey, dataParam, callback, callbackFail, timeoutInSec, needSndSeqNoAdv) {
      return popupSvc.sendReqCore(methodKey, dataParam, callback, callbackFail, timeoutInSec, needSndSeqNoAdv);
    },
    //for external use
    sendReq: function(methodKey, dataParam, callback, callbackFail, timeoutInSec) {
      return popupSvc.sendReqCore(methodKey, dataParam, callback, callbackFail, timeoutInSec);
    },
    //for internal use
    //return val: true - successfully send svc requset
    sendReqCore: function(methodKey, dataParam, callback, callbackFail, timeoutInSec, needSndSeqNoAdv) {

      try {

        if (needSndSeqNoAdv != undefined) {
          var nextSeqNo = svc.GetNextSeqNo();
          dataParam.seqNo = nextSeqNo;
          if (needSndSeqNoAdv) {
            dataParam.seqNo2 = parseInt(nextSeqNo, 10) + 1;
          } else {
            dataParam.seqNo2 = parseInt(nextSeqNo, 10);
          }
        }

        return svc.sendReq(methodKey, dataParam,
          callback,
          callbackFail,
          timeoutInSec);

      } catch (ex) {
        svc.UnmarkBusy(methodKey);
        return false;
      }

      return true;
    }
  }
}

function svcHdlr() {
  return {
    init: function(errorMsgFunc) {
      svc.ErrorMsgFunc = errorMsgFunc;
    },
    clearSession: function() {
      RemoveDataStorePrefix('svc.');
    },
    //return val: true - successfully send svc requset
    sendReq: function(methodKey, dataParam, callback, callbackFail, timeoutInSec) {
      //check isBusy first and prompt user
      if (svc.CheckAndMarkBusy(methodKey)) {
        //system busy
        if (!this.supportedSvcs[methodKey].noBusyAlert)
          alert(svc.ErrorMsgFunc('SYSTEM BUSY, PLS TRY LATER'));
        else
          callbackFail(svc.ErrorMsgFunc('SYSTEM BUSY, PLS TRY LATER'));

        return false;
      }

      try {

        var resultKey = this.supportedSvcs[methodKey].resultKey;

        if (this.supportedSvcs[methodKey].sessionParaKeys) {
          for (var sessionKey in this.supportedSvcs[methodKey].sessionParaKeys) {
            var value = GetDataStore(this.supportedSvcs[methodKey].sessionParaKeys[sessionKey]);
            dataParam[sessionKey] = value;
          }
        }

        //update seqNo only when supported seqNo and not assigned seqNo yet
        if (this.supportedSvcs[methodKey].seqNo_Key && dataParam[this.supportedSvcs[methodKey].seqNo_Key] === undefined)
          dataParam[this.supportedSvcs[methodKey].seqNo_Key] = this.GetNextSeqNo();

        //deep clone for fix JSON.stringify return undefined in some case
        var cloneData = jQuery.extend(true, {}, dataParam);

        var dataString = JSON.stringify(cloneData);

        //deduced timeout value
        var timeoutValue = svc.defaultTimeoutInSec * 1000;
        if (typeof timeoutInSec != 'undefined') {
          try {
            timeoutValue = timeoutInSec * 1000;
          } catch (ex) {
          }
        }

        jQuery.ajax({
          type: 'POST',
          url: this.supportedSvcs[methodKey].endPt,
          data: dataString,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          timeout: timeoutValue,
          processdata: true,
          success: function(msg) {
            svc.UnmarkBusy(methodKey);

            if (svc.supportedSvcs[methodKey].preEvent) {
              svc.supportedSvcs[methodKey].preEvent();
            }

            var retObj = {};

            if (msg && msg[resultKey]) {
              jQuery.each(msg[resultKey], function(idx, value) {
                retObj[value.Key] = value.Value;
              });
            }

            //update seqNo
            if (retObj[svc.ResultSeqNoKey] != undefined)
              SetDataStore('svc.seqNo', retObj[svc.ResultSeqNoKey]);

            //save session storage
            if (svc.supportedSvcs[methodKey].saveResultValue) {
              jQuery.each(svc.supportedSvcs[methodKey].saveResultValue, function(idx, value) {
                if (retObj[idx] != undefined) {
                  SetDataStore(value, retObj[idx]);
                }
              });
            }

            //translate error msg, assumpt GetError exist
            if (svc.ErrorMsgFunc != undefined && svc.supportedSvcs[methodKey].errorMsgKey != undefined) {
              var errorMsg = retObj[svc.supportedSvcs[methodKey].errorMsgKey];
              retObj[svc.supportedSvcs[methodKey].errorMsgKey] = svc.ErrorMsgFunc(errorMsg);
            }

            if (svc.supportedSvcs[methodKey].postEvent) {
              svc.supportedSvcs[methodKey].postEvent(dataParam, retObj, true);
            }

            callback(retObj);

          },
          error: function(request, status, error) {
            svc.UnmarkBusy(methodKey);

            if (svc.supportedSvcs[methodKey].postEvent) {
              svc.supportedSvcs[methodKey].postEvent(dataParam, request.responseText, false);
            }

            // callbackFail(request.responseText);
            if (svc.supportedSvcs[methodKey].detectErrorStatus) {
                callbackFail({"response" : request.responseText, "status" : status});
            } else {
                callbackFail(request.responseText);
            }

          }
        });

      } catch (ex) {
        svc.UnmarkBusy(methodKey);
        return false;
      }

      return true;
    },
    defaultTimeoutInSec: 15,
    hasInitiationError: false,
    ErrorMsgFunc: function(value) { return value; },
    SID: function() {
      return GetDataStore('svc.SID');
    },
    GUID: function() {
      return GetDataStore('svc.GUID');
    },
    SeqNo: function() {
      return GetDataStore('svc.seqNo');
    },
    setSeqNo: function(seqNo) {
      SetDataStore("svc.seqNo", seqNo);
    },
    GetNextSeqNo: function() {
      var seq_no = parseInt(GetDataStore("svc.seqNo"), 10);
      SetDataStore("svc.seqNo", (seq_no + 1));
      return (seq_no + 1);
    },
    ResultSeqNoKey: 'seq_no',
    // ==== for send req control start
    IsSeqNoSensitiveSvc: function(methodKey) {
      return svc.supportedSvcs[methodKey].seqNo_Key != undefined;
    },
    CheckAndMarkBusy: function(methodKey) {
      if (svc.IsSeqNoSensitiveSvc(methodKey)) {
        if (svc.IsBusy() || !svc.IsExpectedMedthod(methodKey)) {
          return true;
        } else {
          SetDataStore('svc.IsBusy', '1');
          return false;
        }
      }
      return false;
    },
    IsBusy: function() {
      var isBusy = GetDataStore('svc.IsBusy');
      return isBusy == '1';
    },
    IsExpectedMedthod: function(methodKey) {
      var expectedMethod = GetDataStore('svc.nextMethodName');
      if (expectedMethod && expectedMethod != '') {
        return expectedMethod == methodKey;
      }
      return true;
    },
    UnmarkBusy: function(methodKey) {
      if (methodKey == undefined || svc.IsSeqNoSensitiveSvc(methodKey)) {
        SetDataStore('svc.IsBusy', '0');
      }
    },
    // ==== for send req control end
    supportedSvcs: {
      //Sid.svc
      'SID_DoGetSID': {
        endPt: 'services/Sid.svc/DoGetSID',
        paraKeys: [],
        resultKey: 'DoGetSIDResult',
        preEvent: function() {
          svc.clearSession();
        },
        saveResultValue: {
          session_id: 'svc.SID',
          gu_id: 'svc.GUID'
        },
        detectErrorStatus: true
      },
      //Login.svc
      'LOGIN_DoAuthentAccPwd': {
        endPt: 'services/Login.svc/DoAuthentAccPwd',
        paraKeys: ['lang', 'acc', 'pass', 'toVerifyPassword'],
        resultKey: 'DoAuthentAccPwdResult',
        errorMsgKey: 'login_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID'
        },
        saveResultValue: {
          account: 'svc.account',
          webID: 'svc.webID',
          sso_guid: 'svc.sso_guid',
          sso_web_id: 'svc.sso_web_id',
          hWebID: 'svc.hWebID'
        }
      },
      'LOGIN_DoAuthentAccSSO': {
        endPt: 'services/Login.svc/DoAuthentAccSSO',
        paraKeys: ['lang', 'acc', 'pass', 'knownSSOGUID', 'toVerifyPassword'],
        resultKey: 'DoAuthentAccSSOResult',
        errorMsgKey: 'login_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID'
        },
        saveResultValue: {
          account: 'svc.account',
          webID: 'svc.webID',
          sso_guid: 'svc.sso_guid',
          sso_web_id: 'svc.sso_web_id',
          hWebID: 'svc.hWebID'
        }
      },
      //LoginEkba.svc
      'LOGINEKBA_DoAuthentEKBA': {
        endPt: 'services/LoginEkba.svc/DoAuthentEKBA',
        paraKeys: ['lang', 'answer', 'os', 'ekbaLang', 'ekbaId'],
        resultKey: 'DoAuthentEKBAResult',
        errorMsgKey: 'login_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          webId: 'svc.webID',
          knownSSOGUID: 'svc.sso_guid',
          hWebId: 'svc.hWebID'
        },
        seqNo_Key: 'seq',
        saveResultValue: {
          sso_guid: 'svc.sso_guid',
          sso_web_id: 'svc.sso_web_id'
        }
      },
      //DDA.svc
      'DDA_DoDDARequestOperation': {
        endPt: 'services/DDA.svc/DoDDARequestOperation',
        paraKeys: ['lang', 'amount', 'bankShortCode', 'password'],
        resultKey: 'DoDDARequestOperationResult',
        errorMsgKey: 'dda_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          webId: 'svc.webID',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        seqNo_Key: 'seqNo'
      },
      'DDA_GetDDARecordsOperation': {
        endPt: 'services/DDA.svc/GetDDARecordsOperation',
        paraKeys: ['lang', 'startDate', 'endDate'],
        resultKey: 'GetDDARecordsOperationResult',
        errorMsgKey: 'dda_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          webId: 'svc.webID',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        seqNo_Key: 'seqNo'
      },
      'DDA_GetDDATxnParaOperation': {
        endPt: 'services/DDA.svc/GetDDATxnParaOperation',
        paraKeys: ['lang', 'shortBankCode'],
        resultKey: 'GetDDATxnParaOperationResult',
        errorMsgKey: 'dda_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          webId: 'svc.webID',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        seqNo_Key: 'seqNo'
      },
      //EFT.svc
      'EFT_DoEFTOperation': {
        endPt: 'services/EFT.svc/DoEFTOperation',
        paraKeys: ['lang', 'amount', 'seqNo2', 'PIN', 'eftType', 'showBal', 'withdrawType', 'nbaIndicator', 'password'],
        resultKey: 'DoEFTOperationResult',
        errorMsgKey: 'eft_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        postEvent: function(inputData, resultData, isSuccess) {
          //update seqNo2 as seqNo
          if (inputData.seqNo2 != undefined) {
            SetDataStore('svc.seqNo', inputData.seqNo2);
          }
        },
        seqNo_Key: 'seqNo'
      },
      //Logout.svc
      'LOGOUT_DoLogout': {
        endPt: 'services/Logout.svc/DoLogout',
        paraKeys: [],
        resultKey: 'DoLogoutResult',
        errorMsgKey: 'logout_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account'
        }
      },
      'LOGOUT_DoLogoutSSOOnly': {
        endPt: 'services/Logout.svc/DoLogoutSSOOnly',
        paraKeys: [],
        resultKey: 'DoLogoutSSOOnlyResult',
        errorMsgKey: 'logout_error'
      },
      'LOGOUT_DoLogoutASOnly': {
        endPt: 'services/Logout.svc/DoLogoutASOnly',
        paraKeys: [],
        resultKey: 'DoLogoutASOnlyResult',
        errorMsgKey: 'logout_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account'
        }
      },
      //PPS.svc
      'PPS_requestPPSDO': {
        endPt: 'services/PPS.svc/requestPPSDO',
        paraKeys: ['amount', 'lang'],
        resultKey: 'requestPPSDOResult',
        errorMsgKey: 'ppsdo_error',
        sessionParaKeys: {
          sessionID: 'svc.SID',
          guid: 'svc.GUID',
          account: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        seqNo_Key: 'seqNo'
      },
      'PPS_submitPPSDRNew': {
        endPt: 'services/PPS.svc/submitPPSDRNew',
        paraKeys: ['dr', 'rejectMsg'],
        resultKey: 'submitPPSDRNewResult'
      },
      'PPS_enquirePPSStatus': {
        endPt: 'services/PPS.svc/enquirePPSStatus',
        paraKeys: ['refNos'],
        resultKey: 'enquirePPSStatusResult'
      },
      //Recall.svc
      'RECALL_DoRecall': {
        endPt: 'services/Recall.svc/DoRecall',
        paraKeys: ['lang', 'lastTxnNo'],
        resultKey: 'DoRecallResult',
        errorMsgKey: 'recall_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        seqNo_Key: 'seqNo'
      },
      //SendBet.svc
      'SENDBET_DoSendBet': {
        endPt: 'services/SendBet.svc/DoSendBet',
        paraKeys: ['betlines', 'lang', 'delayReq', 'password'],
        resultKey: 'DoSendBetResult',
        errorMsgKey: 'sendbet_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        postEvent: function(inputData, resultData, isSuccess) {
          if (inputData.delayReq != undefined && inputData.delayReq == 0 && inputData.betlines.indexOf(' I$') > 0) {
            //set next expected method for inplay delay
            SetDataStore('svc.nextMethodName', 'SENDBET_DoSendBet');
          } else {
            SetDataStore('svc.nextMethodName', '');
          }
        },
        seqNo_Key: 'seqNo'
      },
      //SSOService.svc
      'SSO_DoCheckSSOSignInStatus': {
        endPt: 'services/SSOService.svc/DoCheckSSOSignInStatus',
        paraKeys: [],
        resultKey: 'DoCheckSSOSignInStatusResult',
        sessionParaKeys: {
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        }
      },
      'SSO_DoTicketExtend': {
        endPt: 'services/SSOService.svc/DoTicketExtend',
        paraKeys: [],
        resultKey: 'DoTicketExtendResult',
        sessionParaKeys: {
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        }
      },
      'SSO_DoLowLevelTicketExtend': {
        endPt: 'services/SSOService.svc/DoLowLevelTicketExtend',
        paraKeys: [],
        resultKey: 'DoLowLevelTicketExtendResult'
      },
      //Statement.svc
      'STATEMENT_DoStatementSearch': {
        endPt: 'services/Statement.svc/DoStatementSearch',
        paraKeys: ['lang', 'reqCount', 'curDate', 'endDate',
                            'lastStatReq', 'incompleteSeg', 'txnType', 'betType'],
        resultKey: 'DoStatementSearchResult',
        errorMsgKey: 'stmt_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        seqNo_Key: 'seqNo'
      },
      //Balance.svc
      'BALANCE_DoBalance': {
        endPt: 'services/Balance.svc/DoBalance',
        paraKeys: [],
        resultKey: 'DoBalanceResult',
        errorMsgKey: 'balance_error',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        },
        postEvent: function(inputData, resultData, isSuccess) {
          //update balance
          if (resultData.balance_status == '0' && resultData.ac_balance != undefined) {
            SetDataStore('balance', resultData.ac_balance);
          }
        },
        seqNo_Key: 'seqNo',
        noBusyAlert: true
      },
      // Para.svc
      'PARA_GetEnterPSStatus': {
        endPt: 'services/Para.svc/GetEnterPSStatus',
        paraKeys: [],
        resultKey: 'GetEnterPSStatusResult',
        sessionParaKeys: {
          sid: 'svc.SID',
          guid: 'svc.GUID',
          acc: 'svc.account',
          knownSSOGUID: 'svc.sso_guid',
          knownWebID: 'svc.sso_web_id'
        }
      },
      // Session.svc
      'SESSION_ExtendSession': {
        endPt: 'services/Session.svc/ExtendSession',
        resultKey: 'ExtendSessionResult',
        sessionParaKeys: {
          acc: 'svc.account'
        },
        seqNo_Key: 'seqNo'
      },
      'SESSION_ForceLogout': {
        endPt: 'services/Session.svc/ForceLogout',
        resultKey: 'ForceLogoutResult',
        sessionParaKeys: {
          acc: 'svc.account',
          guid: 'svc.GUID'
        }
      }
    }
  };
}