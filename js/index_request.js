var requestTimer;
var requestTimeoutInSec;
var isRequestTimeout;

var proxyFrameLoaded = false;
var sendSidParam = {
  count: 0,
  retryMax: 5,
  retryInterval: 5000
};

function sendSidRequest() {
  if (proxyFrameLoaded) {
      var lang = GetLanguage();
      //set HTTPS frame language
      proxy.sendMessage('SESSION_STORE', 'SetValue', { Key: 'language', Value: lang }, proxy.NO_CALLBACK);
      
      proxy.sendMessage("SVC", "SID_DoGetSID", {},
      function(msg) {
        if (msg.result == proxy.CONST_SUCCESS) {

          traceFunc += 'F';
          bwId = GetDataStore("bw_id");
          //alert(GetDataStore('session_id'));

          //branch here to deal with login using acc/pwd or using acc/ticket                
          if (isSSOSignedIn()) {
            ProcessAccountSSO();
          } else {
            ProcessAccountPassword();
          }

        } else {
          // for error case

          var content = msg.content;

          if (content.status == "timeout") {
            showSysLoginTimeoutError();
          } else {
            showSysDateTimeError();
          }
        
        }

      },
      requestTimeoutInSec
    );    
  } else {
    //test proxy frame readiness
    if (sendSidParam.count >= sendSidParam.retryMax) {
      showSysDateTimeError();
      sendSidParam.count = 0;
    } else {
      sendSidParam.count++;
      setTimeout(sendSidRequest, sendSidParam.retryInterval);
    }
    
  }
}

function showSysDateTimeError() {
  traceFunc += 'T';
  disabledField(false);
  EnableAccInfo(true);
  EnableAddBetline(true);
  ShowError(2, GetError('system_datetime'), true, 60000);
}

function showSysLoginTimeoutError() {
  traceFunc += 'T';
  disabledField(false);
  EnableAccInfo(true);
  EnableAddBetline(true);
  ShowError(2, GetError('SYSTEM LOGIN TIMEOUT'), true, 60000);
}

function sendAuthentAccPwdRequest(account, password, toVerifyPassword) {

  proxy.sendMessage("SVC", "LOGIN_DoAuthentAccPwd", { lang: GetLanguage(), acc: account, pass: password, toVerifyPassword: toVerifyPassword },
            function(msg) {
                if (msg.result == proxy.CONST_SUCCESS) {
                    traceFunc += 'F';
                    ProcessLogin(msg.content);
                    document.body.style.cursor = 'auto';

                } else {
                    traceFunc += 'T';
                    disabledField(false);
                    EnableAccInfo(true);
                    EnableAddBetline(true);
                    ShowError(2, GetError('system_busy'), true, 60000);
                }

            }
        );
    
}

function sendAuthentEKBARequest(answer) {    
    //var hWebId = GetDataStore("hWebID");
    var osVersion = navigator.userAgent;

    document.body.style.cursor = 'progress';

    proxy.sendMessage("SVC", "LOGINEKBA_DoAuthentEKBA",
        { lang: GetLanguage(),                  
            answer: answer.answer,
            os: osVersion,          
            ekbaLang: answer.lang,
            ekbaId: answer.id
        }, function(msg) {
            if (msg.result == proxy.CONST_SUCCESS) {
                ProcessAuthentEKBAResult();
            } else {
                ProcessAuthentEKBATimeout();
            }
        }, requestTimeoutInSec);
}

function ProcessAuthentEKBAResult() {
  traceFunc += 'F';
  asId = GetDataStore("as_id");
  var loginStatus = GetDataStore('login_status');
  if (loginStatus == 0 || loginStatus == 9) {
    isNowLogon = true;
    setCustomerSegment();
    SetDataStore('is_logon', 1);
    ShowEKBA(false);
    ShowDisclaimer(true);
    ProcessLoginEKBA();
    loadPara(GetDataStore('channelPara'));
    writeCookie();
    proxy.sendMessage("SESSION_STORE", "SET_VALUE", { Key: "account", Value: GetDataStore("account") }, function(msg) { });
    proxy.sendMessage("SESSION_STORE", "SET_VALUE", { Key: "gu_id", Value: GetDataStore("gu_id") }, function(msg) { });    
    WATrackLoginPassword();
  }
  else if (loginStatus < 400) {
    var loginError = GetDataStore('login_error');
    ShowEKBA(false);
    disabledField(false);
    EnableAccInfo(true);
    EnableAddBetline(true);
    isInEKBA(false);
    $j('#password').val('');    

    // Support SSO
    var ssoLoginStatus = GetDataStore('sso_login_status');
    var ssoLoginError = GetDataStore('sso_login_error');
    if (!isSSOSignedIn()) {
        ShowAccInfoDefault();
    }
    else {
        ShowAccInfoSSO(GetDataStore('sso_web_id'));
    }
    if (loginStatus != -2) {
        ShowError(2, GetErrorByCode(loginStatus, loginError), true, 60000);
    }
    else {
        if (ssoLoginStatus == -1) {
            if (ssoLoginError == "SSO_SIGN_OUT_PASSIVE") {
                alert(GetError(ssoLoginError));
            }
            else if (ssoLoginError == "SSO_SIGN_IN_USER_CHANGED") {
                alert(GetError(ssoLoginError));
            }
            else {
                ShowError(2, GetErrorByCode(ssoLoginStatus, ssoLoginError), true, 60000);
            }
        }
        else {
            ShowError(2, GetErrorByCode(ssoLoginStatus, ssoLoginError), true, 60000);
        }
    }
  }
  else {
    var loginError = GetDataStore('login_error');
    var failCount = GetDataStore('retryCount');
    var totalCount = GetDataStore('totalRetryCount');

    EnableAccInfo(true);
    $j('#ekbaDivError').html(GetErrorByCode(loginStatus, loginError).replace('###', failCount).replace('@@@', totalCount));    
    $j('#ekbaSeqQuestion').html(GetDataStore('ekbaQ'));

    focusField($j('#ekbaDivInput'));    
  }
  document.body.style.cursor = 'auto';
}

function ProcessAuthentEKBATimeout() {
  traceFunc += 'T';
  ShowEKBA(false);
  disabledField(false);
  EnableAccInfo(true);
  EnableAddBetline(true);
  isInEKBA(false);
  ShowError(2, GetError('system_busy'), true, 60000);
}

function sendLogoutRequest() {
    proxy.sendMessage("SVC", "LOGOUT_DoLogout", { acc: GetDataStore("account") }, ProcessLogoutResult, requestTimeoutInSec);
}

function forceLogout() {
  sendForceLogoutRequest(); // send request to remove hashed ps from IW and logout from as

  eraseCookie(); // to ensure customer segment cookie is removed
  
  //helpFrame.location = BetSlipIBPath + "forcelogout.aspx" + "?a=" + GetDataStore("account") + "&g=" + GetDataStore("gu_id");
  //window.open(BetSlipIBPath + "forcelogout.aspx", '_blank', "left=1,top=1,width=30,height=30");
}

function ProcessLogoutResult() {
  var is_new_acc = GetDataStore('is_new_acc');
  var is_idle_logout = GetDataStore('is_idle_logout');
  
  // Support SSO
  var ssoEnabled = GetDataStore('sso_enabled');
  var ssoGUID = GetDataStore('sso_guid');
  var ssoWebID = GetDataStore('sso_web_id');
  var ssoSignInLevel = GetDataStore('sso_sign_in_level');       

  cancelEdit();
  ClearDataStore();
  InitDataStore();

  proxy.sendMessage('SESSION_STORE', 'SetValue', { Key: 'doneLogout', Value: 'true' }, proxy.NO_CALLBACK);
  
  DeleteAllAllUpBetlines();
  ResetAllAllUpButtons();
  LoadAllUpFormula();
  DrawAddAllUpButton();
  DeleteAllBetlines();
  EnableAccInfo(true);
  EnableAddBetline(true);
  CloseIdleAlert();
  HideAllError();
  CloseAllPopup(true);
  if (isNowLogon) {
    OpenLogoutPopup(is_new_acc);
  }
  bwId = '00';
  asId = '00';
  isNowLogon = false;
  customerSegment = '';
  eraseCookie();
  SetDataStore('is_logon', 0);
  isClientActionTaken(false);

  // Support SSO
  SetDataStore('sso_enabled', ssoEnabled);
  SetDataStore('sso_guid', ssoGUID);
  SetDataStore('sso_web_id', ssoWebID);
  SetDataStore('sso_sign_in_level', ssoSignInLevel);

  multiSlipPanel.resetPanel();
  
  AccInfoProcessLogout();
  SlipProcessLogout();

  //show idle logout popup window
  logoutTimeStr = formatTime(new Date());
  if (is_idle_logout == '1') {      
      SetDataStore("idleAlertType", "1");
      SetDataStore("idleAlertLogoutTime", logoutTimeStr);      
      OpenPopup(0, "idleAlert.aspx?lang=" + GetLanguage(), 320, 210, 0, 1);
  }
}

// Support SSO
var skipSSOTicketExtendError = false;

function sendBalanceRequest(skipHandleExtendError) {
  // Support SSO
  skipSSOTicketExtendError = skipHandleExtendError;
  var account = GetDataStore('account');

  proxy.sendMessage('SVC', 'BALANCE_DoBalance', { acc: account }, ProcessBalanceResult, balTimeoutInSec);
}

function ProcessBalanceResult(msg) {
  var balance_status = msg.content.balance_status;

  // Support SSO
  if (balance_status == "-2") {
    if (!skipSSOTicketExtendError) {
      skipSSOTicketExtendError = false;
      processSSOTicketExtendResult();
    }
    return;
  }
  skipSSOTicketExtendError = false;
    
	if (balance_status == "0") {
	  var ac_balance = msg.content.ac_balance;
		SetDataStore("balance", ac_balance);
		ShowAccountBalance(ac_balance);
  }
  else {
    ShowAccountBalance(unknownAmount);
	}

	raiseXEvent(4);
	setXsellTimeout();
}

function ProcessSendBetResult() {
	ProcessSendBetResult();
}

function ProcessDelayReplyResult() {
	ProcessSendBetResult();
}

function GetNextSeqNo() {
	var seq_no = parseInt(GetDataStore("seq_no"), 10);
	SetDataStore("seq_no", (seq_no + 1));
	return (seq_no + 1);
}

function setCustomerSegment() {
    var priority = GetDataStore('priority_card') == '' ? '0' : GetDataStore('priority_card');
    var cbp = GetDataStore('cbp_seg');
    if (cbp == '')
      cbp = '00000';
    else if (cbp.length < 5)
      cbp = new Array(6 - cbp.length).join('0') + cbp;
    var racing = GetDataStore('racing_part') == '' ? 'N' : GetDataStore('racing_part');
    var football = GetDataStore('football_part') == '' ? 'N' : GetDataStore('football_part');
    var marksix = GetDataStore('m6_part') == '' ? 'N' : GetDataStore('m6_part');
    var member = GetDataStore('member_type') == '' ? '0' : GetDataStore('member_type');
    var ageGroup = GetDataStore('age_group') == '' ? '00' : GetDataStore('age_group');
    var gender = GetDataStore('gender') == '' ? '0' : GetDataStore('gender');
    var bettingAC = GetDataStore('betting_ac_ind') == '' ? 'N' : GetDataStore('betting_ac_ind');
    var speedbet = GetDataStore('speedbet_cust') == '' ? '0' : GetDataStore('speedbet_cust');
    var footballLive = GetDataStore('football_live_ind') == '' ? 'N' : GetDataStore('football_live_ind');                    
    customerSegment = priority + cbp + racing + football
                    + marksix + member + ageGroup + gender
                    + bettingAC + '0' + speedbet + footballLive;
}

function writeCookie() {
    var date = new Date();
    date.setTime(date.getTime() + (60 * 60 * 1000));

    var priority = GetDataStore('priority_card') == '' ? '0' : GetDataStore('priority_card');
    var cbp = GetDataStore('cbp_seg');
    if (cbp == '')
      cbp = '00000';
    else if ( cbp.length < 5 )
      cbp = new Array(6 - cbp.length).join('0') + cbp;
    var racing = GetDataStore('racing_part') == '' ? 'N' : GetDataStore('racing_part');
    var football = GetDataStore('football_part') == '' ? 'N' : GetDataStore('football_part');
    var marksix = GetDataStore('m6_part') == '' ? 'N' : GetDataStore('m6_part');
    var member = GetDataStore('member_type') == '' ? '0' : GetDataStore('member_type');
    var ageGroup = GetDataStore('age_group') == '' ? '00' : GetDataStore('age_group');
    var gender = GetDataStore('gender') == '' ? '0' : GetDataStore('gender');
    var bettingAC = GetDataStore('betting_ac_ind') == '' ? 'N' : GetDataStore('betting_ac_ind');
    var speedbet = GetDataStore('speedbet_cust') == '' ? '0' : GetDataStore('speedbet_cust');
    var footballLive = GetDataStore('football_live_ind') == '' ? 'N' : GetDataStore('football_live_ind');
    var customerSeg = priority + cbp + racing + football
                    + marksix + member + ageGroup + gender
                    + bettingAC + '0' + speedbet + footballLive;

    var cookie;
    cookie = [
        '', '', '', '', '', '', customerSeg, ''
    ].join(':');
    document.cookie = ['custProInBet', '=', cookie, '; expires=', date.toGMTString(), '; path=/; domain=' + document.domain].join('');
}

function eraseCookie() {
    document.cookie = "custProInBet=; path=/; domain=" + document.domain;
}

// support SSO
function sendCheckSSOSignInStatusRequest(normalCallBack, errorCallBack) {
    isInSSOChecking(true);

    sendCheckSSOSignInStatusRequest.NormalCallBack = normalCallBack;
    sendCheckSSOSignInStatusRequest.ErrorCallBack = errorCallBack;

    proxy.sendMessage('SVC', 'SSO_DoCheckSSOSignInStatus', {},
    function(msg) {
      if (msg.result == proxy.CONST_SUCCESS) {
        processCheckSSOSignInStatusResult();
      } else {
        processCheckSSOSignInStatusTimeout(msg.content);
      }
    }, requestTimeoutInSec);
}

// support SSO
function processCheckSSOSignInStatusResult() {
    traceFunc += 'F';
    sendCheckSSOSignInStatusRequest.NormalCallBack();
    isInSSOChecking(false);
    sendCheckSSOSignInStatusRequest.NormalCallBack = null;
}

// Support SSO
function processCheckSSOSignInStatusTimeout(errMsg) {
    traceFunc += 'T';
    sendCheckSSOSignInStatusRequest.ErrorCallBack();
    isInSSOChecking(false);
    sendCheckSSOSignInStatusRequest.ErrorCallBack = null;
    ShowError(2, GetError(errMsg), true, 60000);
    //alert(errMsg);
}

// Support SSO
// (1) check statue when click Next button
// checking request returned normally
//      if detected logged in user is not changed (i.e. webid is still the same as initial checking), continue login process
//      if detected logged in user is changed, stop login process, alert user changed message and show "Next" button with new detected webid on betslip
//      otherwise, stop login process, alert user signed out message and bring betslip to logout state.
// checking request returned adnormally (e.g. timeout)
//      force to change betslip to logout state
function CheckStatusOnClickNext() {
  sendCheckSSOSignInStatusRequest(
        function() {
          var returnStatus = GetDataStore('sso_check_return_status');
          var signInLevel = GetDataStore('sso_sign_in_level');
          var webID = GetDataStore('sso_web_id');
          var ssoGuid = GetDataStore("sso_guid");
          if (!isLogon() && !isInEKBA()) {
            if (returnStatus == 'SSO_SIGN_IN_NO_CHANGE' || returnStatus == 'SSO_RE_SIGN_IN') {
              // User not changed or user is re-login in from other site
              sendSidRequest(); // start SSO ticket login
            }
            else if (returnStatus == 'SSO_SIGN_IN_USER_CHANGED') {
              // Logged in user is changed
              alert(GetError("SSO_SIGN_IN_USER_CHANGED"));
              ProcessLogoutResult();
            }
            else {
              // other status
              alert(GetError("SSO_SIGN_OUT_PASSIVE"));
              // restore betslip to not logged in state
              ProcessLogoutResult();
            }
          }
        },
        function() {
          traceFunc += 'T';
          ProcessLogoutResult(); // force to change betslip to logout state
          ShowError(2, GetError("system_datetime"), true, 60000);
        }
    );
}

// Support SSO
// (2) check status when change language (user is logged in)
// checking request returned normally
//      if detected logged in user is not changed, ask user to confirm logout,
//          if user confirm to logout, change the language of betslip and JCBW web page
//      if detected logged in user is re-logged in from outside, alert user changed message and force logout, then change the language of betslip and JCBW web page
//      if detected logged in user is changed, alert user changed message and force logout
//      otherwise, alert user signed out message and force logout, then change the language of betslip and JCBW web page
// checking request returned adnormally (e.g. timeout)
//      do as if user is not changed
function CheckStatusOnChangeLanguage() {
    sendCheckSSOSignInStatusRequest(
        function() {
            var returnStatus = GetDataStore('sso_check_return_status');
            var signInLevel = GetDataStore('sso_sign_in_level');
            var webID = GetDataStore('sso_web_id');
            var ssoGuid = GetDataStore("sso_guid");
            var needChangeLang = true;
            if (returnStatus == 'SSO_SIGN_IN_NO_CHANGE') {	// User not changed
                var needLogout = confirm(GetError("SSO_SIGN_OUT_ACTIVE"));
                if (needLogout) {
                    OnClickLogout(true);
                }
                else {
                    needChangeLang = false;
                }
            }
            else if (status == 'SSO_RE_SIGN_IN') { // user is re-login in from other site
                if (tightSSOCheck) {
                    alert(GetError("SSO_SIGN_IN_USER_CHANGED"));
                    ProcessLogoutResult(); // force to change betslip to logout state
                }
                else {
                    var needLogout = confirm(GetError("SSO_SIGN_OUT_ACTIVE"));
                    if (needLogout) {
                        OnClickLogout(true);
                    }
                    else {
                        needChangeLang = false;
                    }
                }
            }
            else if (status == 'SSO_SIGN_IN_USER_CHANGED') { // Logged in user is changed
                alert(GetError("SSO_SIGN_IN_USER_CHANGED"));
                ProcessLogoutResult(); // force to change betslip to logout state
            }
            else if (status == 'SSO_SIGN_OUT') {	// User is logged out from other site
                alert(GetError("SSO_SIGN_OUT_PASSIVE"));
                ProcessLogoutResult(); // force to change betslip to logout state
            }
            else {	// other status or unkown error
                alert(GetError("SSO_SIGN_OUT_PASSIVE"));
                ProcessLogoutResult(); // force to change betslip to logout state
            }

            if (needChangeLang && top.endChgLang) {
                var lang = GetDataStore("tempLang");
                SetDataStore("language", lang);
                ShortenAccInfo(false, true);
                setActiveStyleSheet(self); 
                initAccInfo();
                initSlipFrame();
                multiSlipPanel.resetPanel();
                CloseAllPopup(false);
                top.endChgLang();
            }
        },
        function() {
            var needChangeLang = true;
            var needLogout = confirm(GetError("SSO_SIGN_OUT_ACTIVE"));
            if (needLogout) {
                OnClickLogout(true);
            }
            else {
                needChangeLang = false;
            }

            if (needChangeLang && top.endChgLang) {
                var lang = GetDataStore("tempLang");
                SetDataStore("language", lang);
                ShortenAccInfo(false, true);
                setActiveStyleSheet(self); 
                initAccInfo();
                initSlipFrame();
                multiSlipPanel.resetPanel();
                CloseAllPopup(false);
                top.endChgLang();
            }
        }
    );
}

// Support SSO
// (3) check status when click logout button
// checking request returned normally
//      if detected logged in user is not changed, ask user to confirm logout
//      if detected logged in user is re-logged in from outside, alert user changed message and force logout (clear betlines as well).
//      if detected logged in user is changed, alert user changed message and force logout (clear betlines as well).
//      otherwise, alert user signed out message and force logout (clear betlines as well).
// checking request returned adnormally (e.g. timeout)
//      do as if user is not changed
function CheckStatusOnClickLogout() {
    sendCheckSSOSignInStatusRequest(
        function() {
            var returnStatus = GetDataStore('sso_check_return_status');
            var signInLevel = GetDataStore('sso_sign_in_level');
            var webID = GetDataStore('sso_web_id');
            var ssoGuid = GetDataStore("sso_guid");
            if (isLogon()) {
                if (returnStatus == 'SSO_SIGN_IN_NO_CHANGE') {
                    OnClickLogout();   // ask user confirmation before logout
                }
                else if (returnStatus == 'SSO_RE_SIGN_IN') {
					if (tightSSOCheck) {
						alert(GetError("SSO_SIGN_IN_USER_CHANGED"));
						ProcessLogoutResult(); // force to change betslip to logout state
					}
					else {
						OnClickLogout();   // ask user confirmation before logout
					}
				}
				else if (returnStatus == 'SSO_SIGN_IN_USER_CHANGED') {
                    alert(GetError("SSO_SIGN_IN_USER_CHANGED"));
                    ProcessLogoutResult(); // force to change betslip to logout state
                }
                else {
                    alert(GetError("SSO_SIGN_OUT_PASSIVE"));
                    ProcessLogoutResult(); // force to change betslip to logout state
                }
            }
        },
        function() {
            OnClickLogout();   // ask user confirmation before logout
        }
    );
}

// support SSO
var ignoreError = false;
function sendSSOTicketExtendRequest(toIgnoreError) {
  ignoreError = toIgnoreError;

  if (isSSOEnabled()) {
    proxy.sendMessage('SVC', 'SSO_DoTicketExtend', {},    
    function(msg) {
      if (msg.result == proxy.CONST_SUCCESS) {
        processSSOTicketExtendResult();
      } else {
        processSSOTicketExtendTimeout(msg.content);
      }
    }, requestTimeoutInSec);
    sendExtendSessionRequest();
  }
  else {
    ignoreError = false;
  }
}

// support SSO
function processSSOTicketExtendResult() {
    isClientActionTaken(false);
    if (ignoreError) {
        ignoreError = false;
        ResetIdleTimer(false);
        return;
    }
    var extendResult = GetDataStore("sso_last_extend_status");

    // take action when ticket extend failed
    if (extendResult != "0") {
        CloseAllPopup(true);
        setTimeout(function() {
            var newSSOWebID = GetDataStore("sso_web_id");
            if (newSSOWebID != "") {
                alert(GetError("SSO_SIGN_IN_USER_CHANGED"));
            }
            else {
                alert(GetError("SSO_SIGN_OUT_PASSIVE"));
            }
            ProcessLogoutResult(); // force changing betslip to logout state
        }, 100);
    }
    else {
        ResetIdleTimer(false);
    }
    
    ignoreError = false;
}

// Support SSO
function processSSOTicketExtendTimeout(errMsg) {
    traceFunc += 'T';
    isClientActionTaken(false);
    ignoreError = false;
    //alert(errMsg);
}

// Support SSO
function ReceiveAndProcessTicketExtendResults(lastExtendStatus, lastExtendError, checkStatus, signInLevel, webID, ssoGUID) {
    SetDataStore('sso_last_extend_status', lastExtendStatus);
    SetDataStore('sso_last_extend_error', lastExtendError);
    SetDataStore('sso_check_return_status', checkStatus);
    SetDataStore('sso_sign_in_level', signInLevel);
    SetDataStore('sso_web_id', webID);
    SetDataStore('sso_guid', ssoGUID);
    processSSOTicketExtendResult();
}

// support SSO
function sendAuthentAccSSORequest(account, password, toVerifyPassword) {
  proxy.sendMessage('SVC', 'LOGIN_DoAuthentAccSSO', 
    {lang: GetLanguage(),
      acc: account,
      pass: password,
      toVerifyPassword: toVerifyPassword,
      knownSSOGUID: GetDataStore('sso_web_id')
    },
    ProcessAuthentAccSSOResult, requestTimeoutInSec);       
}

// support SSO
function ProcessAuthentAccSSOResult() {
    traceFunc += 'F';
    ProcessLoginSSO();
    document.body.style.cursor = 'auto';
}

// support SSO
function ProcessAuthentAccSSOTimeout() {
    traceFunc += 'T';
    disabledField(false);
    EnableAccInfo(true);
    EnableAddBetline(true);
    ShowError(2, GetError('system_busy'), true, 60000);
}

// support SSO
function sendLogoutSSOOnlyRequest() {  
  proxy.sendMessage('SVC', 'LOGOUT_DoLogoutSSOOnly', {}, ProcessLogoutResult, requestTimeoutInSec);
}

// support SSO
function sendLogoutASOnlyRequest() {  
  proxy.sendMessage('SVC', 'LOGOUT_DoLogoutASOnly', { acc: GetDataStore('account') }, ProcessLogoutResult, requestTimeoutInSec);
}

function sendExtendSessionRequest() {
  proxy.sendMessage('SVC', "SESSION_ExtendSession", { acc: GetDataStore('account')}, ProcessExtendSessionResult, requestTimeoutInSec);
}

function ProcessExtendSessionResult() {

}

function sendForceLogoutRequest() {
    proxy.sendMessage('SVC', "SESSION_ForceLogout", { acc: GetDataStore('account') }, ProcessForceLogoutResult, requestTimeoutInSec);
}

function ProcessForceLogoutResult() {
}

function sendGetEnterPSStatus(callbackFun) {
    proxy.sendMessage('SVC', "PARA_GetEnterPSStatus", {}, callbackFun, requestTimeoutInSec);
}