var isIE = (navigator.appName.toUpperCase().indexOf("MICROSOFT") >= 0 && parseInt($$.browser.version, 10) < 10);

var hKey = 0;
var para_md5 = 0;
var para_sha1 = 2;

var isPreview = false;
var isReply = false;

function setPreviewReplyState(preview, reply) {
  isPreview = preview;
  isReply = reply;
}

var oPopup = new Array(); 
var oPopupIB = new Array();
var sCurURL = new Array();
function OpenPopup(popupIndex, sURL, width, height, scrollbar, statusbar) {
    if (oPopup[popupIndex] != null && !oPopup[popupIndex].closed) {
        if (sURL == sCurURL[popupIndex]) {
            focusField(oPopup[popupIndex]);
            return;
        } else {
            oPopup[popupIndex].close();
        }
    }
    if (oPopupIB[popupIndex] != null) {
      //$post("oPopup[" + popupIndex + "].close()", popupContext);
      proxy.sendMessage('POPUP', 'Close', { PopupIdx: popupIndex }, proxy.NO_CALLBACK);
    }

  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  var finalHeight = height;
  var finalWidth = width;

  // For safari in Mac OS 10.10, the window height is including the height of the location bar, which
  // is unlike other browsers. For normal browsers, the window height is the innerHeight of window (
  // exclude the location bar), not the outerHeight.
  if (isMacOS() && isSafari()) {
  	finalHeight += 65;
  	finalWidth += 10;
  }
  
  var sFeatures = "left=" + left + ",top=" + top + ",width=" + finalWidth + ",height=" + finalHeight
          + ",scrollbars=" + scrollbar + ",status=" + statusbar
          + ",location=0,menubar=0,resizable=0,titlebar=0";
  oPopup[popupIndex] = window.open(sURL, "_blank", sFeatures);
  sCurURL[popupIndex] = sURL;
}

function OpenPopupIB(popupIndex, sURL, width, height, scrollbar, statusbar, popupName) {
    if (oPopup[popupIndex] != null && !oPopup[popupIndex].closed) {
        oPopup[popupIndex].close();
    }
    
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;

    var finalHeight = height;
    var finalWidth = width;

	// For safari in Mac OS 10.10, the window height is including the height of the location bar, which
	// is unlike other browsers. For normal browsers, the window height is the innerHeight of window (
	// exclude the location bar), not the outerHeight.
	if (isMacOS() && isSafari()) {
		finalHeight += 65;
		finalWidth += 10;
	}    
    
    var sFeatures = "left=" + left + ",top=" + top + ",width=" + finalWidth + ",height=" + finalHeight
          + ",scrollbars=" + scrollbar + ",status=" + statusbar
          + ",location=0,menubar=0,resizable=0,titlebar=0";
    //$post("OpenPopup(" + popupIndex + ", '" + sURL + "', '" + sFeatures + "')", popupContext);
    proxy.sendMessage('POPUP', 'Open', { PopupIdx: popupIndex, Url: sURL, Features: sFeatures, Name: popupName }, proxy.NO_CALLBACK);
    sCurURL[popupIndex] = sURL;
    oPopupIB[popupIndex] = sURL;
}

function InitPopupFrame() {
    $('popupFrame').src = BetSlipIBPath + 'popup.aspx?lang=' + GetLanguage();
}

function ClosePopup(idx) {
    try {
        oPopup[idx].close();
        oPopup[idx] = null;
    } catch (e) {
    }
}

function CloseAllPopup(logonFlag) {
  try {
    for (var i = 0; i < oPopup.length + 1; i++)
      oPopup[i].close();
  } catch (e) {
  }

  if (logonFlag) {
    try {      
      proxy.sendMessage('POPUP', 'CloseAllPopup', {}, proxy.NO_CALLBACK);
    } catch (e) {
    }
  }
}

function OpenLogoutPopup(isNewAcc) {
  $('logoutFrame').src = url_logout[GetLanguage()] + '&new=' + isNewAcc;
  $('logoutCloseDiv').innerHTML = genLogoutDivFooter();
  $('pic_close').src = GetImageURL('pic_popup_closewin');
  setBetSlipSize(stateLogout);
  $('divLogout').style.display = 'block';
  if (screen.height >= 768 && !isMobileDevice())
    $('divLogout').style.top = 107;
  else
    $('divLogout').style.top = 0;

  if ( screen.width > 800 || isMobileDevice() )
    $('divLogout').style.left = 0;
  else
    $('divLogout').style.left = 95;

  //set logout box height for mobile
  if (isMobileDevice()) {
    $j('#divLogout').height(385);
    $j('#divLogoutBorder').height(385);
    $j('#logoutCloseDiv').height(30);
  }

  sel_formula.style.display = 'none';
  
  // START Nielsen Online SiteCensus
  WATrackClickEvent();
  // END Nielsen Online SiteCensus  
}

//if state is undefined/null, only close the divLogout
function CloseLogoutPopup(state) {
  if(state != undefined && state != null)
    setBetSlipSize(state);

  $('divLogout').style.display = 'none';

  if (state != undefined && state != null)    
    $j('#sel_formula').show();
}

function genLogoutDivFooter() {
  var buf = new StringBuffer();
  buf.append('<table style="color: #333333; font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px;padding:0px 10px 0px 10px"')
     .append(' border="0" cellpadding="0" cellspacing="0">');
  buf.append('<tr><td colspan="2"><img src="images/spacer.gif"' + window["cacheVersion"] + ' height="10px"></td></tr>');
  buf.append('<tr>');
  buf.append('<td class="text" width="702" valign="top">');
  buf.append('</td>');
  // START Nielsen Online SiteCensus
  //buf.append('<td width="56" rowspan="3"><a href="javascript:CloseLogoutPopup(stateDefault);" onMouseOut="pic_close.src = GetImageURL(\'pic_popup_closewin\');" onMouseOver="pic_close.src = GetImageURL(\'pic_popup_closewin_on\');"><img id="pic_close" border="0"></a></td>');
  buf.append('<td width="56" rowspan="3"><a href="javascript:WATrackLogoutCloseEvent();CloseLogoutPopup(stateDefault);" onMouseOut="loadMouseEventImage(\'pic_close\', \'pic_popup_closewin\');" onMouseOver="loadMouseEventImage(\'pic_close\', \'pic_popup_closewin_on\');"><img id="pic_close" border="0"></a></td>');
  // END Nielsen Online SiteCensus
  buf.append('</tr>');
  buf.append('</table>');
  return buf.toString();
}

function SetDataStore(name, value) {
  try {
      dataStore.SetData(name, value);
      //dataStore.Content.SLDataStoreUtil.SetData(name, value);      
  } catch (e) {
  }
}

function GetDataStore(name) {
  try {
      return dataStore.GetData(name);
      //return dataStore.Content.SLDataStoreUtil.GetData(name);      
  } catch (e) {
  }
  return "";
}

// Clear all data but keep language
function ClearDataStore() {
  try {
    var lang_flag = GetDataStore("language");
    var isMultipleFlag = GetDataStore("IsMultipleSession");
    dataStore.Clear();
    //also clear betslipib sessionStorage
    proxy.sendMessage('SESSION_STORE', 'ClearAllValue', {}, proxy.NO_CALLBACK); 
    SetDataStore("language", lang_flag);
    SetDataStore("IsMultipleSession", isMultipleFlag);
  } catch(e) {
  }
}

function InitDataStore() {
  SetDataStore("session_id", 0);
  SetDataStore("is_logon", 0);
  SetDataStore("need_refresh_balance_after_eft", 0);
  SetDataStore("bs_loaded", "1");

  // Support SSO
  SetDataStore("sso_guid", "");
  SetDataStore("sso_sign_in_level", "0");
  SetDataStore("sso_web_id", "");
}


function IsSupportBrowser() {
  var appName = navigator.appName.toUpperCase();

  if (appName.indexOf("MICROSOFT") >= 0 || navigator.userAgent.indexOf('MSIE') >= 0 || navigator.userAgent.indexOf('IEMobile') >= 0) {  // IE 6 or above
    var userAgent = navigator.userAgent;
    var verKeyName = userAgent.indexOf("MSIE ", 0) == -1 ? 'IEMobile/' : "MSIE ";
    var start_pos = userAgent.indexOf(verKeyName, 0) + verKeyName.length;
    var end_pos = userAgent.indexOf(";", start_pos);
    var version = userAgent.substring(start_pos, end_pos);
    if (version >= 6)
      return true;
    var cookie_name = "is_ie_6";
    if (GetCookie(cookie_name) == false) {
      alert(GetError("1001") + "\r\n" + GetError("1001"));
      SetCookie(cookie_name, 1);
    }
  }
  else if (appName.indexOf("NETSCAPE") >= 0) {  // Firefox 3 or above, Safari 4 or above, Chrome 3 or above
    var userAgent = navigator.userAgent.split('/');
    var versionStr = userAgent[3].split('.');
    if ( versionStr[0] >= 3 )
      return true;
  }
  
  return false;
}

function func_check_client_os()
{
  var int_others  = 0 ;
  var int_win16 = 1 ;
  var int_win9x = 2 ;
  var int_winnt = 3 ;
  var int_win2k = 4;
  var int_winxp = 5 ;
  var int_vista = 6;
  
  var string_platform_type = int_others ;
  
  var string_agent = navigator.userAgent.toLowerCase() ;
  
  // *** CHECK PLATFORM ***
  if ((string_agent.indexOf("win")!=-1) || (string_agent.indexOf("win16")!=-1) || 
    (string_agent.indexOf("16bit")!=-1) || 
    (string_agent.indexOf("windows 3.1")!=-1) || (string_agent.indexOf("windows 16-bit")!=-1) )
  string_platform_type = int_win16 ;

  if ((string_agent.indexOf("win95")!=-1) || (string_agent.indexOf("windows 95")!=-1) ||
    (string_agent.indexOf("win98")!=-1) || (string_agent.indexOf("windows 98")!=-1) ||
    (string_agent.indexOf("win 9x 4.90")!=-1) )
  string_platform_type = int_win9x ;
  
  if ((string_agent.indexOf("winnt")!=-1) || (string_agent.indexOf("windows nt")!=-1)) 
  string_platform_type = int_winnt ;
  
  if (string_agent.indexOf("windows nt 5.0")!=-1) 
  string_platform_type = int_win2k ;

  if (string_agent.indexOf("windows nt 5.1")!=-1) 
  string_platform_type = int_winxp ;

  if (string_agent.indexOf("windows nt 6.0")!=-1)
  string_platform_type = int_vista ;

  if (string_agent.indexOf("windows nt 6.1")!=-1)  //windows 7
  string_platform_type = int_vista ;

  return string_platform_type ;
}

function trim(s) 
{
if ((s==null)||(s==undefined)||(s==''))
return s ;
s = s.toString() ;
// Remove leading spaces and carriage returns
while ((s.substring(0,1) == ' ') || (s.substring(0,1) == '\n') || (s.substring(0,1) == '\r'))
{ s = s.substring(1,s.length); }

// Remove trailing spaces and carriage returns
while ((s.substring(s.length-1,s.length) == ' ') || (s.substring(s.length-1,s.length) == '\n') || (s.substring(s.length-1,s.length) == '\r'))
{ s = s.substring(0,s.length-1); }

return s;
}


var timeIdError;

function ShowError(containerId, message, isFormated, timeoutMSec) {
  var strHTML;
  
  if (isFormated)
    strHTML = message;
  else
    strHTML = "<table border=1 bordercolor=#000000 width=100% cellspacing=0 cellpadding=0 style='table-layout:fixed'>"
        + "<tr><td align=center style='left:0px;width:100%;word-wrap:break-word'>"
        + "<div style='background-color:#ffff00'>"
        + "<font size=-1 color=blue>" + message + "</font>"
        + "</div>"
        + "</td></tr>"
        + "</table>";

  switch (containerId) {
    case 1 : // accInfoFrame
      $j('#errormsg').html(strHTML);
      $j('#errormsg').css('visibility', 'visible');
      break;
  case 2: // slipFrame
      slipClose(true);      
      $j('#errMsgTxt').html(strHTML);
      $j('#errMsgBlock').css('visibility', 'visible');
      break;
  case 3: // slipFrame preview bet      
      $j('#txtPreviewWrongPassword').html(strHTML);
      $j('#msgColumn').css('visibility', 'visible');
      $j('#passwordErrorTxt').show();
      break;
  }

  timeIdError = setTimeout("HideError(" + containerId + ", true)", timeoutMSec);
}
    
function HideError(containerId, callerIsTimer) {
  if (callerIsTimer)
    clearTimeout(timeIdError);
  
  switch (containerId) {
    case 1: // accInfoFrame
      $j('#errormsg').css({ visibility: 'hidden' });          
      break;
    case 2 : // slipFrame        
      $j('#errMsgBlock').css({ visibility: 'hidden' });
      break;
    case 3: // slipFrame preview bet
      $j('#msgColumn').css({ visibility: 'hidden' });
      $j('#passwordErrorTxt').hide();      
      break;
  }
}

function HideAllError() {
  HideError(1, false);
  HideError(2, false);
}
    
function ShowWelcome() {
  var buf = new StringBuffer();
  buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr>');
  buf.append('<td bgcolor="#FFDE00" style="padding:6px 7px 8px 0px;">');
  buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr valign="top">');
  buf.append('<td width="59" style="padding:0px 7px 0px 0px;"><img src="images/logo_last_login.gif' + window["cacheVersion"] + '"></td>');
  buf.append('<td colspan="2" style="padding:3px 0px 0px 3px;">');
  buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr>');
  buf.append('<td colspan="2" class="brown2"><strong>');
  buf.append(GetText('acc_logon_header')).append('</strong></td>');
  buf.append('</tr>');
  buf.append('<tr>');
  buf.append('<td colspan="2" class="brown3" style="padding:1px 0px 0px 0px;">');
  buf.append(GetText('acc_logon_last_logon')).append('</td>');
  buf.append('</tr>');
  buf.append('<tr>');
  buf.append('<td width="37" class="green" style="padding:1px 0px 0px 0px;">');
  buf.append(GetText('acc_logon_date')).append('</td>');
  buf.append('<td class="green" style="padding:1px 0px 0px 0px;">');
  buf.append(GetDataStore('last_login_date')).append('</td>');
  buf.append('</tr>');
  buf.append('<tr>');
  buf.append('<td class="green" style="padding:1px 0px 0px 0px;">');
  buf.append(GetText('acc_logon_time')).append('</td>');
  buf.append('<td class="green" style="padding:1px 0px 0px 0px;">');
  buf.append(GetDataStore('last_login_time'));
  buf.append(GetText('acc_logon_hk_remark')).append('</td>');
  buf.append('</tr>');
  buf.append('</table>');
  buf.append('</td>');
  buf.append('</tr>');
  buf.append('</table>');
  buf.append('</td>');
  buf.append('</tr>');
  buf.append('</table>');
  ShowError(1, buf.toString(), true, 10000);
  bWelcomeShowing = true;
}


var enableAccInfoButtons = true;
function EnableAccInfo(isEnable) {
  if (isEnable == true || isEnable == false)
    enableAccInfoButtons = isEnable;
  return enableAccInfoButtons;
}

var enableAddBetline = true;
function EnableAddBetline(isEnable) {
  if (isEnable == true || isEnable == false)
    enableAddBetline = isEnable;
  return enableAddBetline;
}

var inEKBA = false;
function isInEKBA(isEnable) {
  if (isEnable == true || isEnable == false)
    inEKBA = isEnable;
  return inEKBA;
}

var warningTimeout = 5;
var sessionIdleTime = 30;
var idleTimer;
var renewFlag = false;

function renewSession() {
  if ( isNowLogon && renewFlag ) {
    helpFrame.location = BetSlipIBPath + "alive.aspx";
    renewFlag = false;
  }
  setTimeout("renewSession()", sessionIdleTime * 60 * 1000);
}

function ResetIdleTimer(loadDummy) {
  CloseIdleAlert();
  if (!isNowLogon)
    return;

  var msecToWarnUser = (sessionIdleTime - warningTimeout) * 60 * 1000 - 10 * 1000;
  // Support SSO
  //idleTimer = setTimeout("PopupIdleAlert()", msecToWarnUser);
  idleTimer = setTimeout("IdleCheck()", msecToWarnUser);
  isClientActionTaken(false);

  if (loadDummy) {
      // Support SSO
      // loadDummy=true means extend the server session, in SSO, SSO ticket has to be extend as well
      // so call a WCF function instead of a dummy page
      // send a parameter, true, so as to ignore failed in ticket extension
      if (isSSOEnabled()) {
          sendSSOTicketExtendRequest(true);
      }
      else {
          helpFrame.location = BetSlipIBPath + "alive.aspx";
          sendExtendSessionRequest();
      }
  }
}

var hWinIdleAlert = null;
function PopupIdleAlert() {
  clearTimeout(idleTimer);
  if ( isPreview )
    OnClickClosePreview();
  if ( isReply )
    OnClickClose();

  if ($j('#divAccInfoMinimize').is(':visible'))
    OnClickRestore();

   document.getElementById('divIdleAlertLogoutTips').innerHTML = GetText('idle_alert_logouttime');
   document.getElementById('divIdleAlertM30').innerHTML = '30' + GetText('idle_alert_mins');
   document.getElementById('divIdleAlertM30').disabled = false;
   document.getElementById('divIdleAlertM60').innerHTML = '60' + GetText('idle_alert_mins');
   document.getElementById('divIdleAlertM60').disabled = false;
   document.getElementById('divIdleAlertSave').innerHTML = GetText('idle_alert_save');
   document.getElementById('btnIdleAlertSave').href = "javascript:pobj.SaveSessionIdleTime();";
   document.getElementById('btnIdleAlertSave').style.color = "";
   
  slipExpand(true);
  idleAlertInit(MyParseInt(GetPara("WarningTimeout"), 5));

  var curTime = new Date();
  var curTimeStr = formatTime(curTime);
  curTime.setMinutes(curTime.getMinutes() + warningTimeout);
  var logoutTimeStr = formatTime(curTime);

  //Set values for Idle Alert Popup
  SetDataStore("idleAlertType", "0");
  SetDataStore("idleAlertLogoutTime", logoutTimeStr);
  SetDataStore("idleAlertCurTime", curTimeStr);
  OpenPopup(0, "idleAlert.aspx?lang=" + GetLanguage(), 320, 210, 0, 1);
}

function formatTime(dateTime) {
    var logoutHours = dateTime.getHours() > 9 ? dateTime.getHours() : '0' + dateTime.getHours().toString();
    var logoutMins = dateTime.getMinutes() > 9 ? dateTime.getMinutes() : '0' + dateTime.getMinutes().toString();
    return logoutHours + ":" + logoutMins;
}

function CloseIdleAlert() {
    clearTimeout(idleTimer);
    idleAlertClose2();
}

function SaveSessionIdleTime() {
	var rTime = document.getElementsByName("idleAlertM");
	var time = rTime[0].checked == true ? rTime[0].value : rTime[1].value;
	sessionIdleTime = parseInt(time);
	$$.cookie("sessionIdleTime", sessionIdleTime);
	
	document.getElementById('divIdleAlertLogoutTips').innerHTML = GetText('idle_alert_savedtime');
	document.getElementById('radIdleAlertM30').disabled = true;
	document.getElementById('radIdleAlertM60').disabled = true;
	document.getElementById('btnIdleAlertSave').href = "javascript:void(0);";
	document.getElementById('btnIdleAlertSave').style.color = "#ccc";
	
}

function IsAllBetsAccepted(betReply) {
  if (!betReply)
    return false;
  else if (betReply == '')
    return false;
  else if ((betReply.indexOf("REJECTED") < 0) && (betReply.indexOf("UNKNOWN") < 0))
    return true;
  else
    return false;
}

var is_xsell_timeout = false;
function xsell_timeout_func() {
  is_xsell_timeout = true;
  sisisExist = 0;
  receiveXContent('');
  document.body.style.cursor = 'default';
}

// Support SSO
function isSSOSignedIn() {    
    return ('' != GetDataStore('sso_sign_in_level') && '0' != GetDataStore('sso_sign_in_level'));
}

// Support SSO
var inSSOChecking = false;
function isInSSOChecking(isEnable) {
    if (isEnable == true || isEnable == false)
        inSSOChecking = isEnable;
    return inSSOChecking;
}

// Support SSO
var clientActionTaken = false;
function isClientActionTaken(isEnable) {
    if (isLogon()) {
        if (isEnable == true || isEnable == false) {
            clientActionTaken = isEnable;
        }
    }
    return clientActionTaken;
}

// Support SSO
function IdleCheck() {
    if (isClientActionTaken()) {
        sendExtendSessionRequest();
        idleTimer = setTimeout("ResetIdleTimer(true)", warningTimeout * 60 * 1000);
    }
    else {
        PopupIdleAlert();
    }
}

function isSSOEnabled() {
    return (GetDataStore('sso_enabled') == 'true');
}

function isRemoveSSOTokenOnTimeOut() {
    return (GetDataStore('sso_remove_token_on_timeout') == 'true');
}

// fix change lang display problem
function closeDislaimer() {
    if (isShowingDisclaimer)
        ShowDisclaimer(false);
}

function isBlankString(str) {
    return (!str || /^\s*$/.test(str));
}


function isMobileDevice() {
  if (navigator.userAgent.match(/android|blackBerry|iphone|ipad|ipod|opera mini|iemobile|touch/i)) {
    return true;
  }
  else {
    return false;
  }
}

function isIDevice() {
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    return true;
  }
  else {
    return false;
  }
}

function isAndroidDevice() {
  return navigator.userAgent.match(/Android/i);
}

function isMobileIE11() {
  return isMobileDevice() && isIE11();
}

function isIE11() {
  return !!navigator.userAgent.match(/Trident\/7\./);
}

function isMobileIE() {
  if (navigator.userAgent.match(/touch/i) && navigator.userAgent.match(/Trident/i)) {
    return true;
  }
  else {
    return false;
  }
}

function loadMouseEventImage(targetId, pic_name) {
  if (!isMobileDevice()) {
    var imagePath = GetImageURL(pic_name);
    $j('#' + targetId).attr('src', imagePath);
  }
}

function isMSIE() {
  if (navigator.userAgent.match(/MSIE/i)) {
    return true;
  }
  else {
    return false;
  }
}

function isMSIE8OrBelow() {
  var userAgent = navigator.userAgent;
  if (userAgent.match(/MSIE/i)) {
    var start_pos = userAgent.indexOf("MSIE ", 0) + 5;
    var end_pos = userAgent.indexOf(";", start_pos);
    var version = userAgent.substring(start_pos, end_pos);
    if (version < 9)
      return true;
  }
   
  return false;
}

function isSafari() {
  return navigator.userAgent.match(/safari/i);
}

function hasSessionStorage() {
  try {
    sessionStorage.setItem('check_session_storage', 'check_session_storage');
  } catch (ex) {
    return false;
  }

  sessionStorage.removeItem('check_session_storage');

  return true;
 }

 function isMacOS() {
	return (window.navigator.platform.toLowerCase().indexOf("mac") >= 0);
}
