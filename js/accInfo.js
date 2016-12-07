//<!--

function initAccInfo() {
  //setActiveStyleSheet(this);

  //$('pic_duelAuthent').src = GetImageURL('pic_duelAuthent');
  //$('pic_duelAuthent').title = GetText('alt_duelAuthent');
    $j('#pic_duelAuthent').attr({ src: GetImageURL('pic_duelAuthent'), title: GetText('alt_duelAuthent') });
  
  //$('pic_help').src = GetImageURL('pic_help');
  //$('pic_help').title = GetText('alt_help');
    $j('#pic_help').attr({ src: GetImageURL('pic_help'), title: GetText('alt_help') });
  
  $('pic_login').src = GetImageURL('pic_login');
  $('pic_login').title = GetText('alt_login');
  $('pic_minimize').title = GetText('alt_minimize');
  $('tableMiniMize').title = GetText('alt_restore');
  
  resetInput();

  $('savePasswordTxt').innerHTML = GetText('fld_save_password');
  $('txtBetlineCount').innerHTML = GetText('minimize_bets') + ' : ';
	$('tdBetlineCount').innerText = totalBetlines;

  $('pic_help_login').src = GetImageURL('pic_help');
  $('pic_help_login').title = GetText('alt_help');
  $('pic_logout').src = GetImageURL('pic_logout');
  $('pic_logout').title = GetText('alt_logout');

  $('txtRegister').innerHTML = GetText('alt_register');
  // registration dropdown menu
  $('regOnline').innerHTML = GetText('alt_reg_online');
  $('regApply').innerHTML = GetText('alt_reg_apply');
  
  $('txtAccInfoPersonalSettings').innerHTML = GetText('alt_pic_settings');
  $('txtOtherServices').innerHTML = GetText('alt_other_services');

  $('txtAccStatLogin').innerHTML = GetText('alt_pic_ac_record');
  $('txtAccInfoPersonalSettingsLogin').innerHTML = GetText('alt_pic_settings');
  $('txtFundTransferLogin').innerHTML = GetText('alt_pic_transfer');

//  $('tableMiniMize').className = (screen.width < 1024) ? 'minimizeBg' : 'minimize1024Bg';
  $('tableMiniMize').style.backgroundImage = 'url("' + ((screen.width < 1024) ? GetImageURL('pic_minimize_bg') : GetImageURL('pic_minimize_1024_bg')) + '")';
  $('tableMiniMize').style.backgroundRepeat = 'no-repeat';
  
  // support SSO
  $('savePasswordTxtSSO').innerHTML = GetText('fld_save_password');
  $('pic_nextSSO').src = GetImageURL('pic_next');
  $('pic_nextSSO').title = GetText('alt_next');


  if (!isSSOSignedIn()) {
      ShowAccInfoDefault();
  } else {
      ShowAccInfoSSO(GetDataStore('sso_web_id'));
  }

  if (!isEnableToEnterPS()) {
      $('savePassRow').style.visibility = 'hidden';
  }

  initPassword();
  initAccountTxt();
}

function initAccountTxt() {
  $j('#account').focus(function() {
    if (this.value == GetText('fld_account_no')) {
      this.value = '';      
    }
    if (isMobileIE11()) {
      this.setSelectionRange(this.selectionStart, this.selectionEnd);
    }
  });
  $j('#account').blur(function() {
    if (this.value == '') {
      this.value = GetText('fld_account_no');
    }
  });
}

function initPassword() {
  if (isIDevice()) {
    //use onclick and remove tab idx to prevent passwordbox not enterable
    $j('#passwordInput1').click(function() {
      $j(this).hide();
      $j('#password').show();
      $j('#password').focus();
    });
    $j('#passwordInput1').attr("tabindex", -1);
    $j('#password').focus(function() {
      $j('#account').attr("readonly", "readonly");
    });
    $j('#password').blur(function() {
      $j('#account').removeAttr("readonly", "readonly");
    });
  } else {
    $j('#passwordInput1').focus(function() {
      $j(this).hide();
      $j('#password').show();
      $j('#password').focus();
    });
  }
}

function resetInput() {
  $('account').value = GetText('fld_account_no');
  $('passwordInput1').value = GetText('fld_web_password');
  $('passwordInput1').style.display = 'block';
  $('password').value = '';
  $('password').style.display = 'none';
  $('save_password').checked = false;
  
  // Support SSO
  $('save_passwordSSO').checked = false;
}

function disabledField(flag) {
    
    if (!isSSOSignedIn()) {
            $('account').disabled = flag;
            $('passwordInput1').disabled = flag;
            $('password').disabled = flag;
            $('save_password').disabled = flag;
            $('pic_login').src = GetImageURL(flag ? 'pic_login_dimmed' : 'pic_login');
        } else {
            // Support SSO
            $('account').disabled = true;
            $('passwordInput1').disabled = (flag || !$('save_passwordSSO').checked);
            $('password').disabled = (flag || !$('save_passwordSSO').checked);
            $('save_passwordSSO').disabled = flag;
            $('pic_nextSSO').src = GetImageURL(flag ? 'pic_next_off' : 'pic_next');
        }
    
}

function ShowAccInfoError(message) {
	ShowError(2, message, true, 60000);
}

var unknownAmount = '<span style="color:#FF0000;font-weight:bold">$ ---</span>';
function ShowAccountBalance(balance1) {
  if (GetSetting('AccInfo', 'DISP_BALANCE') == '0') {
		$('valueAccBal').innerHTML = FormatCurrency(balance1);
		$('refresh_balance').innerHTML = '<a href="javascript:;" onclick="OnClickRefreshBalance();return false;"><img border="0" align="absmiddle" '
			+ 'src="' + GetImageURL('pic_refresh_balance') + '" '
			+ 'alt="' + GetText('alt_pic_refresh_balance') + '" '
			+ '></a>';
	} else {
	    $('valueAccBal').innerHTML = GetText('Not to display');
	    $('refresh_balance').innerHTML = "";
	}
}

var oTrName = null;
var oTrMenu = null;
function ShortenAccInfo(shorten, isForce) {
	if (!EnableAccInfo() && isForce == false)
		return;

	if (isShorten == shorten)
		return;

	var tBody = tblAccInfo.children(0);
	var tBodyMenu = tblAccInfoWithMenu.children(0);
	if (shorten) {
		oTrName = tBody.children(1);
		tBody.removeChild(oTrName);
		oTrMenu = tBodyMenu.children(1);
		tBodyMenu.removeChild(oTrMenu);
		pic_shorten_acct_info.onclick = function(){ShortenAccInfo(false, false)};
		pic_shorten_acct_info.src = GetImageURL("pic_shorten_o");
		pic_shorten_acct_info.alt = GetText("alt_pic_shorten_o");
	} else {
		var row2 = tBody.children(1);
		tBody.insertBefore(oTrName, row2);
		tBodyMenu.appendChild(oTrMenu);
		pic_shorten_acct_info.onclick = function(){ShortenAccInfo(true, false)};
		pic_shorten_acct_info.src = GetImageURL("pic_shorten");
		pic_shorten_acct_info.alt = GetText("alt_pic_shorten");
	}
	isShorten = shorten;
	setBetSlipSize(stateDefault);
}

function ShowServerId(obj) {
	obj.title = bwId + "-" + asId;
}

// Topbar Buttons
//-----------------------------------------------------------------------------
function OnClickHelp() {
  if ( isIdleAlert )
    return;
  if (!EnableAccInfo())
    return;
  OpenPopup(1, url_faq[GetLanguage()], 770, 550, 1, 1);
}

function OnClickMinimize() {
  if ( isInEKBA() )
    return;
  if ( isIdleAlert )
    return;

  if (!EnableAccInfo())
    return;
  setBetSlipSize(stateMinimize);
  if (isNowLogon)
    $('divAccInfoLogin').style.display = 'none';
  else
    $('divAccInfoDefault').style.display = 'none';

  $('divAccInfoTop').style.display = 'none';
  $('divAccInfoMinimize').style.display = 'block';
  $('tdBetlineCount').innerHTML = multiSlipPanel.getTotalCount();
}

function OnClickRestore() {
	restoreSize();
	$('divAccInfoMinimize').style.display = 'none';
	$('divAccInfoTop').style.display = 'block';
	if (isNowLogon) {
		$('divAccInfoLogin').style.display = 'block';
	} else {
		$('divAccInfoDefault').style.display = 'block';
	}
}

// Other Account Information Buttons
//-----------------------------------------------------------------------------
var enableRefreshBal = true;
function OnClickRefreshBalance(forceRefresh) {
  if (!enableRefreshBal)
    return;

  if ( !forceRefresh && isIdleAlert )
    return;

	if ( !forceRefresh && !EnableAccInfo() )
		return;

    //var seqNo = GetNextSeqNo();

    showBalLoading();
    
    // Support SSO
    if(forceRefresh)
        sendBalanceRequest(true);
	else
	    sendBalanceRequest(false);
	
	ResetIdleTimer(false);
	enableRefreshBal = false;
	setTimeout('reEnableRefreshBal()', refreshBalInterval * 1000);
}

function reEnableRefreshBal() {
  enableRefreshBal = true;
}

function showBalLoading() {
    if (GetSetting('AccInfo', 'DISP_BALANCE') == '0') {
        $('valueAccBal').innerHTML = unknownAmount;
        $('refresh_balance').innerHTML = '<img border="0" align="absmiddle" '
			+ 'src="' + GetImageURL('pic_loading') + '" '
			+ '>';
    }    
}

function OnClickRegisterNow() {
	if (!EnableAccInfo())
		return;
	top.location = url_register[GetLanguage()];
}

function OnClickRegisterNow2(over) {
	
	if (!EnableAccInfo())
		return;
	
	if (curState == stateDefault || over == 0) {
    var pulldown = $j('#pulldown_registration')[0];
    //var btn = $j('#navBtn_registration')[0];

    var isPullDownHidden = $j('#pulldown_registration').css('visibility') == 'hidden';

    if (over) {
      if (isPullDownHidden) {
      	pulldown.style.visibility = 'visible';
      	$j("#reg_link").blur(function() {
      		OnClickRegisterNow2(0);
      	});
      	$j("#reg_link").focus();
      	WATrackRegNow();
      } else {
		$j("#reg_link").blur();
      }
     } else {
		$j("#reg_link").unbind("blur");
		setTimeout(function() {
			pulldown.style.visibility = 'hidden';
			//btn.style.visibility = 'hidden';
		}, 500);
    }
  }
  
 }

function onClickRegonline() {
	if (!EnableAccInfo())
		return;
	WATrackRegOnline();
	top.location = url_regonline[GetLanguage()];
}

function onClickApplybet() { 
	if (!EnableAccInfo())
		return;
	WATrackRegApplybet();
	top.location = url_applybet[GetLanguage()];
}

/*
  GET SID
*/
var sidTimeout;
function OnClickLogin() {
  //check safari private mode
  if ((isIDevice() || isSafari()) && !hasSessionStorage()) {
    alert(safari_private_mode_chi + '\n' + safari_private_mode_eng);
    return;
  }

    if (isInSSOChecking() || !EnableAccInfo() || isInEKBA())
		return;

  traceFunc = 'L11';

  slipClose(true);
  CloseLogoutPopup(stateDefault);

  EnableAccInfo(false);
	EnableAddBetline(false);

  // check empty web id / password
  var acc = $('account').value;
  if ( acc=='' || acc==GetText('fld_account_no') ) {
    ShowAccInfoError(GetError('421'));
		$('pic_login').src = GetImageURL('pic_login');
 	  EnableAccInfo(true);
 	  EnableAddBetline(true);
    return;
  }

  var pwd = $('password').value;
	if ( pwd=='' || pwd.length < 4 ) {
		ShowAccInfoError(GetError('421'));
		$('pic_login').src = GetImageURL('pic_login');
		EnableAccInfo(true);
		EnableAddBetline(true);
		return;
	}

  $('pic_login').src = GetImageURL('pic_login_dimmed');

  sendSidRequest();

  ShowHWBtnInSlipFrame();
} // OnClickLogin(), then go to index_request.js sendSidRequest()

/*
  Authenticate Web ID/Account and Password
*/
function ProcessAccountPassword() {
  traceFunc = 'L13';

  clearTimeout(sidTimeout);
  disabledField(true);

  var accountId;
  var password;
  var sessionId;
  var toVerifyPassword;
  try {
    sessionId = GetDataStore("session_id");
    if ( sessionId=='0' )
      return;  

    accountId = $('account').value;
    password  = $('password').value;

    if ($('save_password').checked) {
      //Need to enter password
      //hashPasswordBySL(password);      
      SetDataStore("save_password", "1");
      toVerifyPassword = true
    } else {
      SetDataStore("save_password", "0");
      toVerifyPassword = false;
    }
  } 
  catch (e) 
  {
     $('password').value = '';
     disabledField(false);
     EnableAccInfo(true);
     EnableAddBetline(true);
     return;
  }

  //sendAuthentAccPwdRequest(accountId, hashSHA1(password));
    //TODO: server side does the hashing and stores the hased value
  sendAuthentAccPwdRequest(accountId, password, toVerifyPassword);	
} // ProcessAccountPassword(), then go to index_request.js sendAuthentAccPwdRequest

/*
  Success Authenticate Web ID and Password
*/

function ProcessLogin(loginResult) {
    var loginStatus = loginResult.login_status; //GetDataStore('login_status');
    if (loginStatus != '0') { // authentAccPwd fail
        var loginError = loginResult.login_error; //GetDataStore('login_error');
        if (loginError == 'PLEASE CHANGE SECURITY CODE')
            ShowAccInfoError(GetError('change_security_code'));
        else if (loginError == 'IW CANNOT ACCESS')
            ShowAccInfoError(GetError('IW CANNOT ACCESS'));
        else
            ShowAccInfoError(GetErrorByCode(loginStatus, loginError));
        SetDataStore('account', '');
        SetDataStore('login_status', '');
        SetDataStore('login_error', '');
        $('password').value = '';
        disabledField(false);
        EnableAccInfo(true);
        EnableAddBetline(true);
    } else {
        isInEKBA(true);
        EnableAccInfo(true);
        ShowEKBA(true);
    }
}

/*
  Authenticate Sec Answer
*/
function OnClickLoginEKBA() {
  traceFunc = 'L14';

  $('ekbaDivError').innerHTML = '';

  if (!EnableAccInfo())
    return;

  EnableAccInfo(false);
	EnableAddBetline(false);
  sendAuthentEKBARequest(formattedSecurityAnswer());
}

function formattedSecurityAnswer() {
  var lang = GetDataStore('ekbaLang');
  var id = GetDataStore('ekbaID');  
  var answer = $j('#ekbaDivInput').val();  
  return { lang: lang, id: id, answer: answer };
}

function ProcessLoginEKBA() {
  $('txtAccNo').innerHTML = GetText('accinfo_fld_account_no');
  $('txtAccName').innerHTML = GetText('accinfo_fld_name');
  $('txtAccBal').innerHTML = GetText('accinfo_fld_balance');

  $('valueAccNo').innerHTML = GetDataStore('account');

  if (GetSetting('AccInfo', 'DISP_NAME') == "0") {
    var acc_name = GetDataStore('acc_name');
    if (acc_name.length < 15)
      $('valueAccName').innerHTML = acc_name;
    else
      $('valueAccName').innerHTML = acc_name.substring(0, 12) + "...";
  } else {
    $('valueAccName').innerHTML = GetText('Not to display');
  }
	
  ShowAccountBalance(GetDataStore('balance'));

  try {
    SetDataStore('datetime_offset', top.getOffsetTime());
  } catch (e) {
    SetDataStore('datetime_offset', 0);
  }
	
  $('divAccInfoDefault').style.display = 'none';
  $('divAccInfoLogin').style.display = 'block';

  resetInput();

  // Q307 special handle for speedbet after login redirect page
  var speedbetPage = GetDataStore('speedbet_after');
  if ( speedbetPage != '' ) {
    if ( GetLanguage()==0 )
      speedbetPage += '?lang=en';
	
	if (top.info.location) {
		top.info.location = speedbetPage;
	}
	else {
		top.info.src = speedbetPage;
	}
  }
  isInEKBA(false);
  
} // ProcessLoginEKBA()

function OnClickLogout(isForce) {
  if (isForce != true) {
      if (!EnableAccInfo()) {
          closeDislaimer();
          return;
      }
      if (!confirm(GetError("SSO_SIGN_OUT_ACTIVE"))) {
          return;
      }
  }

  closeDislaimer();

  //close preview page
  if (curState == statePreview) {
    if (isPreview)
      OnClickClosePreview('');
    else
      OnClickClose();
  }

  if (!EnableAccInfo())
    return;

  EnableAccInfo(false);
  sendLogoutRequest();
  // get enter pass paramter from server
  var currThis = this;
  sendGetEnterPSStatus((function(result) {
      if (result) {
          var results = result.content;
          if (results) {
              var reply = results["value"];

              var isEnabled = isEnableToEnterPS(reply);

              if (!isEnabled) {
                  $('savePassRow').style.visibility = 'hidden';
              }
          }
      }

  }).bind(this));
  multiSlipPanel.resetPanel();
}

function AccInfoProcessLogout() {
  traceFunc = '';
  // Support SSO
    
    if (isSSOSignedIn()) {
            ShowAccInfoSSO(GetDataStore('sso_web_id'));
        } else {
            ShowAccInfoDefault();
        }
        $('divAccInfoTop').style.display = 'block';
        $('divAccInfoDefault').style.display = 'block';
        $('divAccInfoLogin').style.display = 'none';
        $('divAccInfoMinimize').style.display = 'none';
        EnableAccInfo(true);
    
}

function OnClickPersonalSettings() {
  if ( isIdleAlert )
    return;
  if (!isDefaultFrame())
    return;
  if (!EnableAccInfo())
    return;
  OpenPopup(0, "settings.aspx?lang=" + GetLanguage(), 640, 420, 0, 1);
}

function OnClickSettings() {
  ShowOtherServiceMenu();
}

function OnClickCannotLogin() {
  if (!EnableAccInfo())
    return;
  top.location = url_cannotlogin[GetLanguage()];
}

function OnClickLoginTimeout() {
  if (!EnableAccInfo())
    return;
  top.location = url_login_timeout[GetLanguage()];
}

function OnClickAssociteAccount() {
  if (!EnableAccInfo())
    return;
  top.location = url_associate_account[GetLanguage()];
}

function OnClickAccountRecord() {
  if ( isIdleAlert )
    return;
  if (!isDefaultFrame())
    return;
  if (!EnableAccInfo())
    return;
  if (!isNowLogon) {
    alert(GetError("1101"));
    return;
  }
  //OnClickRefreshBalance();
  OnClickRefreshBalance(true);  // Support SSO
  OpenPopupIB(0, BetSlipIBPath + "acctstmt.aspx?lang=" + GetLanguage(), 790, 500, 0, 1, 'acctStmt');
  ResetIdleTimer(false);
}

function OnClickRecall() {
  OnClickRefreshBalance(true);
  OpenPopupIB(0, BetSlipIBPath + "recall.aspx?lang=" + GetLanguage(), 790, 500, 0, 1, 'recall');
  ResetIdleTimer(false);
}

function OnClickFundTransfer() {
  if ( isIdleAlert )
    return;

  if (!isDefaultFrame())
    return;
  if (!EnableAccInfo())
    return;
  if (!isNowLogon) {
    alert(GetError("1101"));
    return;
  }
  var enableScrollbar = 0;
  if (screen.height < 650)
    enableScrollbar = 1;
  OpenPopupIB(0, BetSlipIBPath + "eft.aspx?lang=" + GetLanguage(), 640, 550, 0, 1, 'eft');
  ResetIdleTimer(false);
}

// support SSO
// Called when Next button is clicked
function OnClickNext() {
    if (isInSSOChecking() || !EnableAccInfo() || isInEKBA())
        return;

    slipClose(true);
    CloseLogoutPopup(stateDefault);

    EnableAccInfo(false);
    EnableAddBetline(false);

    // check empty web id / password
    var acc = $('account').value;
    if (acc == '' || acc == GetText('fld_account_no')) {
        ShowAccInfoError(GetError('421'));
        $('pic_nextSSO').src = GetImageURL('pic_next');
        EnableAccInfo(true);
        EnableAddBetline(true);
        return;
    }

    // only check password if save password checkbox is ticked
    var pwd = ''
    var savePassword = $('save_passwordSSO').value;
    if (savePassword) {
        pwd = $('password').value;
        if (pwd == '' || pwd.length < 4) {
            ShowAccInfoError(GetError('421'));
            $('pic_nextSSO').src = GetImageURL('pic_next');
            EnableAccInfo(true);
            EnableAddBetline(true);
            return;
        }
    }

    $('pic_nextSSO').src = GetImageURL('pic_next_off');

    sendSidRequest();

    ShowHWBtnInSlipFrame();
    //CheckStatusOnClickNext();
} // OnClickNext(), then go to index_request.js sendCheckSSOSignInStatusRequest()

// support SSO
// called when save password checkbox is clicked
function OnClickSavePasswordSSO() {
    var savePassword = $('save_passwordSSO').checked;
    if (savePassword) {
        $('passwordInput1').value = GetText('fld_password');
        $('passwordInput1').disabled = false;
        $('passwordInput1').style.display = 'block';
        $('password').value = '';
        $('password').disabled = false;
        $('password').style.display = 'none';
    }
    else {
        $('passwordInput1').disable = true;
        $('passwordInput1').style.display = 'none';
        $('password').value = '********';
        $('password').disabled = true;
        $('password').style.display = 'block';
    }
}

// support SSO
// called after sid request success
function ProcessAccountSSO() {
  traceFunc = 'L12';

    clearTimeout(sidTimeout);
    disabledField(true);

    var accountId;
    var password;
    var sessionId;
    var toVerifyPwd = false;
    //var hashedPassword;
    try {
        sessionId = GetDataStore("session_id");
        if (sessionId == '0')
            return;

        accountId = GetDataStore("sso_web_id");
        password = $('password').value;


        SetDataStore("save_password", "0");
        toVerifyPwd = false;
        password = "";

    }
    catch (e) {
        $('password').value = '';
        disabledField(false);
        EnableAccInfo(true);
        EnableAddBetline(true);
        return;
    }

    sendAuthentAccSSORequest(accountId, password, toVerifyPwd);
} // ProcessAccountSSO(), then go to index_request.js sendAuthentAccSSORequest

// support SSO
function ProcessLoginSSO() {
    var loginStatus = GetDataStore('login_status');
    if (loginStatus != '0') {  // authentAccSSO fail
        if (loginStatus == '-2') {
            var ssoLoginStatus = GetDataStore('sso_login_status');
            var ssoLoginError = GetDataStore('sso_login_error');
            if (ssoLoginError == "SSO_SIGN_OUT_PASSIVE") {
                alert(GetError(ssoLoginError));
                ShowAccInfoDefault();
            }
            else if (ssoLoginError == "SSO_SIGN_IN_USER_CHANGED") {
                alert(GetError(ssoLoginError));
                ShowAccInfoSSO(GetDataStore('sso_web_id'));
            }
            else {
                ShowAccInfoError(GetErrorByCode(ssoLoginStatus, ssoLoginError));
                
                if (!isSSOSignedIn()) {
                        ShowAccInfoDefault();
                    }
                    else {
                        ShowAccInfoSSO(GetDataStore('sso_web_id'));
                    }                
            }
        }
        else {
            var loginError = GetDataStore('login_error');
            if (loginError == 'PLEASE CHANGE SECURITY CODE')
                ShowAccInfoError(GetError('change_security_code'));
            else
                ShowAccInfoError(GetErrorByCode(loginStatus, loginError));

            
            if (!isSSOSignedIn()) {
                    ShowAccInfoDefault();
                }
                else {
                    ShowAccInfoSSO(GetDataStore('sso_web_id'));
                }
            
        }
        SetDataStore('account', '');
        SetDataStore('login_status', '');
        SetDataStore('login_error', '');
        disabledField(false);
        EnableAccInfo(true);
        EnableAddBetline(true);
    }
    else {
        isInEKBA(true);
        EnableAccInfo(true);
        ShowEKBA(true);
    }
}

// support SSO
function ShowAccInfoDefault() {
    $('txtAccNo').innerHTML = '';
    $('txtAccName').innerHTML = '';
    $('txtAccBal').innerHTML = '';

    disabledField(false);

    $('account').className = 'inputField1';
    $('password').className = 'inputField1';

    $('account').value = GetText('fld_account_no');

    $('passwordInput1').value = GetText('fld_password');
    $('passwordInput1').style.display = 'block'

    $('password').value = '';
    $('password').style.display = 'none';

    $('divAccInfoDefaultLoginButton').style.display = 'inline';

    $('divAccInfoSSONextButton').style.display = 'none';

    $('divAccInfoDefaultSavePassword').style.display = 'inline';
    $('divAccInfoSSOSavePassword').style.display = 'none';

    $('divAccInfoDefaultRgisterLink').style.display = 'inline';
    
    //$j('#previewFrame').attr('src', '');
    $j('#divBetPreview').hide();    
}

// support SSO
function ShowAccInfoSSO(webIDToShow) {
    $('txtAccNo').innerHTML = '';
    $('txtAccName').innerHTML = '';
    $('txtAccBal').innerHTML = '';

    disabledField(false);

    $('account').className = 'inputField1_disabled';
    $('password').className = 'inputField1_disabled';

    if (webIDToShow != '') {
        $('account').value = webIDToShow;
    }

    $('passwordInput1').value = GetText('fld_password');
    $('passwordInput1').style.display = 'none'

    $('password').value = '********';
    $('password').style.display = 'block';

    $('divAccInfoDefaultLoginButton').style.display = 'none';

    $('divAccInfoSSONextButton').style.display = 'inline';

    $('divAccInfoDefaultSavePassword').style.display = 'none';
    $('divAccInfoSSOSavePassword').style.display = 'inline';

    $('divAccInfoDefaultRgisterLink').style.display = 'none';

    //$j('#previewFrame').attr('src', '');
    $j('#divBetPreview').hide();
}

// Enter password enable
function isEnableToEnterPS(setValue) {
    // var flag = GetOnlinePara("EnterPassword");

    if ((typeof setValue) != "undefined") {
        channelArray[pmapO["EnterPassword"]] = setValue;
    }
    
    var flag = GetOnlinePara("EnterPassword");
    
    if (flag) {
        if (flag == "0") {
            return false;
        } else {
            return true
        }
    }
    

    return true;
}

//-->
