var stateDefault  = 1;
var statePreview  = 2;
var stateMinimize = 3;
var stateDisclaimer = 4;
var stateLogout = 5;
var stateEKBA = 6;

var curState = stateDefault;
var lastState; // remember the state before minized

var isShorten = false;

var initLeft;
var initTop;

var cUpperFrameTopDefault       = 16;
var cUpperFrameLeftDefault      = 0;
var cUpperFrameWidthDefault     = 221;
var cUpperFrameHeightDefault    = 555;    
var cUpperFrameHeight800x600    = 400;    // Q209 Support 1024x600 (433)

var cUpperFrameHeightMinized    = 126;
var cUpperFrameHeightLogon      = 119;
var cUpperFrameHeightLogonShoren = 98;

var cLowerFrameTopDefault       = 119;
var cLowerFrameLeftDefault      = cUpperFrameLeftDefault;
var cLowerFrameWidthDefault     = cUpperFrameWidthDefault;
var cLowerFrameHeightDefault    = 435;

var cLowerFrameWidthPreview     = 500;  
var cLowerFrameHeight800x600    = 285;

var cUpperFrameLeftEKBA         = 108;
var cLowerFrameLeftEKBA         = cUpperFrameLeftEKBA;

var cLowerFrameWidthLogout      = 655;
var cUpperFrameTopLogout600     = 56;
var cLowerFrameTopLogout600     = 159;

var previewTableDefault = 276;
var previewTable800x600 = 126;

var replyTableDefault = 279;
var replyTable800x600 = 129;

var replyTableXsellHeight = 101;

// Q208 Revamp
var btnOpen;
var slip = new Object();
slip.startL = 0;
slip.startW = cLowerFrameWidthDefault;
slip.startTop800x600 = 560;
slip.startTopBSW = 221;
slip.distance = 110;
slip.goSpeed = 1;
var isSlipOpen = false;

function heightReduct() {
  if (screen.height < 768 && !(isMobileIE())) {
    if (768 - screen.height > 150)
      return 150;
    else
      return 768 - screen.height;
  } else {
    return 0;
  }
}

function isResolution800x600() {
  return screen.width < 1024 && screen.height < 768;  // Q209 support 1024x600  
}

function isResolution1024x600() {
  return screen.width >= 1024 && screen.height < 768; // Q209 support 1024x600
}

function init_pos() {
  if (!isMobileUser && isResolution800x600()) {
    OnClickMinimize();
  }
  else
    setBetSlipSize(stateDefault);
}

function setBetSlipSize(state) {
  var retcode; 

  retcode = setMainFrameSize(state);
  if (retcode == false)
    return false;

  retcode = setAccInfoFrameSize(state);
  if (retcode == false)
    return false;
  
  retcode = setSlipFrameSize(state);
  if (retcode == false)
    return false;  

  lastState = curState;
  curState = state;
}

function refreshBetslipSize() {
  setMainFrameSize(curState);
  setAccInfoFrameSize(curState);
  setSlipFrameSize(curState);    
}

function restoreSize() {
  if (curState == stateMinimize)
    setBetSlipSize(lastState);
}

function setMainFrameSize(state) {
  var left = initLeft, top = initTop, width = cUpperFrameWidthDefault + cUpperFrameLeftDefault,
   height = cUpperFrameHeightDefault - heightReduct();   

  switch(state) {
    case statePreview : // share calc height with stateDefault
    case stateDisclaimer :
      left = initLeft - (cLowerFrameWidthPreview - cLowerFrameWidthDefault);
      width = cUpperFrameWidthDefault + (cLowerFrameWidthPreview - cLowerFrameWidthDefault);
      break;
    case stateDefault:
      height = cUpperFrameHeightDefault - heightReduct();
      break;
    case stateMinimize : // minisized and betline counter only
      height = cUpperFrameHeightMinized;
      break;
    case stateLogout :
      left = initLeft - cLowerFrameWidthLogout;
      width = cUpperFrameWidthDefault + cLowerFrameWidthLogout;
      if ( screen.height <= 600 && !isMobileDevice() ){
        top = initTop > cUpperFrameTopLogout600 ? initTop - cUpperFrameTopLogout600 : 0;
        height = height + 33;   // +33 to ensure the betslipframe large enough for the logout box height 430 
      }
      break;
    case stateEKBA:
      left = initLeft - cLowerFrameLeftEKBA;
      width = cLowerFrameWidthDefault + cLowerFrameLeftEKBA;
      break;
    default :
      return false;
  }

  try {
    betslipFrame.style.left = left;
    betslipFrame.style.top = top;
    betslipFrame.style.width = width;
    betslipFrame.style.height = height;
  } catch (e) {
    document.body.style.left = left;
    document.body.style.top = top;
    document.body.style.width = width;
    document.body.style.height = height;
  }  
  
  return true;
}

function setAccInfoFrameSize(state) {
  var left=cUpperFrameLeftDefault, top=0,
    width = cUpperFrameWidthDefault,
    height = cUpperFrameHeightDefault - heightReduct(), display = "block";      
  
  switch(state) {
    case stateDefault :
      if (isNowLogon) {
        if (isShorten)
          height = cUpperFrameHeightLogonShoren;
        else
          height = cUpperFrameHeightLogon;
      }
      break;
    case statePreview :
    case stateDisclaimer :
      left = cLowerFrameWidthPreview - cLowerFrameWidthDefault;
      break;
    case stateMinimize : // minisized and betline counter only
      height = cUpperFrameHeightMinized;
      break;
    case stateLogout :
      left = cLowerFrameWidthLogout;
      if (screen.height <= 600 && !isMobileDevice())
        top = cUpperFrameTopLogout600;
      break;
    case stateEKBA:
      left = cUpperFrameLeftEKBA;
      break;
    default :
      return false;
  }
  
  try {    
      $j('#divAccInfo').css({ left: left, top: top, width: width, heigth: height, display: display });
  } catch (e) {
    //alert("setAccInfoFrameSize(" + state + ") failed");
    return false;
  }
  
  return true;
}

function setSlipFrameSize(state) {
  var left=cLowerFrameLeftDefault, top=cLowerFrameTopDefault, width=cLowerFrameWidthDefault, display="block",
    height = cLowerFrameHeightDefault - heightReduct();
  
  switch(state) {
    case statePreview :        
      $j('#previewFrame').height(height - 17);
    case stateDisclaimer :
      width = cLowerFrameWidthPreview;
    case stateDefault:
      top = cLowerFrameTopDefault;    
      $j('#divSlipDefault').css({ left: 0, width: cLowerFrameWidthDefault });
      break;
    case stateMinimize :
      display = "none";
      break;
    case stateLogout :
      left = cLowerFrameWidthLogout;
      if (screen.height <= 600 && !isMobileDevice())
        top = cLowerFrameTopLogout600;
      break;
    case stateEKBA:
      width = cLowerFrameWidthDefault + cLowerFrameLeftEKBA; ;      
      $j('#divSlipDefault').css({ left: cLowerFrameLeftEKBA, width: cLowerFrameWidthDefault });
      break;
    default :
      return false;
  }
  
  try {
      $j('#divSlip').css({ left: left, top:top,  width: width, heigth:height, display:display });
  } catch (e) {
    //alert("setSlipFrameSize(" + state + ") failed");
    return false;
  }
  return true;
}

function DebugFramesPos() {
  alert(DebugFramePos(betslipFrame) + '\n\n'
      + DebugFramePos($('accInfoFrame')) + '\n\n'
      + DebugFramePos($('slipFrame')));
}

function DebugFramePos(frameObj) {
  var str = "FRAME   : " + frameObj.name      + "\r\n"
      + "LEFT    : " + frameObj.style.left  + "\r\n"
      + "TOP     : " + frameObj.style.top   + "\r\n"
      + "WIDTH   : " + frameObj.style.width + "\r\n"
      + "HEIGHT  : " + frameObj.style.height  + "\r\n"
      + "DISPLAY : " + frameObj.style.display + "\r\n";
  return str;
}


function slipOver(obj, over) {
  btnOpen = obj;
  var btn = (isSlipOpen)?'btn_close':'btn_open';
  btn += (over)?'_on':'';
  btnOpen.src = GetImageURL('pic_' + btn);
}

function slipOpen(obj, noMotion) {
  if ( isInEKBA() )
    return;
  if ( isIdleAlert )
    return;

  btnOpen = obj;

  if (!isSlipOpen) {
    slip.L = slip.startL + slip.distance;
    slip.W = slip.startW + slip.distance;
    slip.BL = (isResolution800x600() && !isMobileUser) ? (slip.startTop800x600 - slip.distance) : (slip.startTopBSL - slip.distance); 
    slip.BW = slip.startTopBSW + slip.distance;
    slip.speed = 3;
    slipMotion(noMotion);

    btnOpen.src = GetImageURL('pic_btn_close');
    isSlipOpen = true;
  } else {
    slip.L = slip.startL;
    slip.W = slip.startW;
    slip.BL = (isResolution800x600() && !isMobileUser) ? slip.startTop800x600 : slip.startTopBSL;
    slip.BW = slip.startTopBSW;
    slip.speed = 2;
    slipMotion(noMotion);

    if ( btnOpen )
      btnOpen.src = GetImageURL('pic_btn_open');

    isSlipOpen = false;

    for ( var j=0; j<totalBetlines; j++ ) {
      betlines[j].descOpen = false;
      betlines[j].betTitle = GetText('alt_details');
    }
  }
}

function slipExpand(noMotion) {
  if ( !isSlipOpen ) {      
      slipOpen($j('#btnOpen')[0], noMotion);
    RedrawBetlineTable();
  }
}

function slipClose(noMotion) {
  if ( isSlipOpen ) {      
      slipOpen($j('#btnOpen')[0], noMotion);
    RedrawBetlineTable();
  }
}

function slipMotion(noMotion) {

  var sfLeft = parseInt(document.getElementById('divAccInfo').style.left, 10);
  var sfWidth = parseInt(document.getElementById('divSlip').style.width, 10);
  var topBSLeft = parseInt(top.document.getElementById('betSlipFrame').style.left, 10);
  var topBSWidth = parseInt(top.document.getElementById('betSlipFrame').style.width, 10);

  slip.tempL = sfLeft;
  slip.goL = Math.round((slip.L - slip.tempL)/slip.speed);

  if (noMotion==null && Math.abs(slip.L - slip.tempL) > 2) {
    slip.tempL += slip.goL;
    sfWidth += slip.goL;
    topBSLeft -= slip.goL;
    topBSWidth += slip.goL;
    slip.timeOut = setTimeout("slipMotion()", slip.goSpeed);
  } else {
    slip.tempL = slip.L;
    sfWidth = slip.W;
    topBSLeft = slip.BL;
    topBSWidth = slip.BW;

    clearTimeout(slip.timeOut);
  }

  top.document.getElementById('betSlipFrame').style.left = topBSLeft;
  top.document.getElementById('betSlipFrame').style.width = topBSWidth;
  document.getElementById('divAccInfo').style.left = slip.tempL;
  document.getElementById('divSlip').style.width = sfWidth;
  $j('#divSlipDefault').css({ width: sfWidth});
  $j('#pulldown_service').css({ left: slip.tempL + 60 });
  $j('#pulldown_registration').css({left: slip.tempL + 10});
}

(function() {
  if (typeof window.navigatorType == 'undefined')
  {
  window.navigatorType = {};
    var navigators = ["msie", "firefox", "safari", "chrome", "opera"];
  var userAgent = window.navigator.userAgent.toLowerCase();
  for (var i in navigators) {
    var name = navigators[i];
    navigatorType[name] = userAgent.indexOf(name) != -1;
  }
  }
})();


function slipNavOver(i, over, callerId) {  

  if (curState == stateDefault || over == 0) {
    var txt = $j('#navTxt')[0];
    var pulldown = $j('#pulldown_' + i)[0];
    var btn = $j('#navBtn_' + i)[0];
    var formulaDropdown = $j('#sel_formula')[0];

    var isPullDownHidden = $j('#pulldown_' + i).css('visibility') == 'hidden';

    if (over) {
      if (isPullDownHidden) {
        txt.style.color = '#003B7F';
        pulldown.style.visibility = 'visible';
        btn.style.visibility = 'visible';
        if (isResolution1024x600() || isResolution800x600())
          formulaDropdown.style.visibility = 'hidden';
        $j('#' + callerId).blur(function() { slipNavOver(i, 0, callerId); }).focus();
      } else {
        $j('#' + callerId).blur();
      }
    } else {
      $j('#' + callerId).unbind('blur');
      setTimeout(function() {
        txt.style.color = '';
        pulldown.style.visibility = 'hidden';
        btn.style.visibility = 'hidden';
        formulaDropdown.style.visibility = 'visible';
      }, 500);
    }
  }
}

function betRowClick(i) {
  if (isEditing()) return;
      
  var btnOpen = $j('#btnOpen')[0];

  if ( !betlines[i].delHit && !betlines[i].alupHit && !betlines[i].unitHit ) {
    if ( !betlines[i].descOpen ) {
      if (!isSlipOpen)  slipOpen(btnOpen);
  
      betlines[i].descOpen = true;

      if ( getBetClickCount()==1 ) {
        betlines[i].betTitle = GetText('alt_brief');
      }
      else {
        for ( var j=0; j<totalBetlines; j++ ) {
          if ( betlines[j].descOpen )
            betlines[j].betTitle = GetText('alt_brief');
        }
      }
    }
    else {
      betlines[i].betTitle = GetText('alt_details');
      betlines[i].descOpen = false;

      if ( getBetClickCount()==1 ) {
        for ( var j=0; j<totalBetlines; j++ ) {
          if ( betlines[j].descOpen )
            betlines[j].betTitle = GetText('alt_brief');
        }
      }
  
      if ( getBetClickCount()==0 ) {
        if (isSlipOpen) slipOpen(btnOpen);
      }
    }

    RedrawBetlineTable();

      //  var tmp = '';
      //  for ( var j=0; j<totalBetlines; j++ ) {
      //    tmp += slipFrame.betTbl.rows[j].offsetHeight + '\n';
       // }
      //  alert(tmp + '\nscroll : ' + slipFrame.divBetLayer.scrollTop + '\ny-axis  : ' + window.event.clientY);
    
    var divBetLayer=$j('#divBetLayer')[0];
    var divBetLayerScrollTop=divBetLayer.scrollTop;
    var divBetLayerHeight=divBetLayer.clientHeight;    
    var betTblTr = $j('#betTbl')[0].getElementsByTagName('tr');
    var item = betTblTr[i];
    var itemHeight=item.offsetHeight;
    if(item.offsetTop-divBetLayerScrollTop+itemHeight > divBetLayerHeight){
    divBetLayer.scrollTop=divBetLayer.scrollTop+(item.offsetTop-divBetLayerScrollTop+itemHeight-divBetLayerHeight);
    }


    //slipFrame.betTbl.rows[i].scrollIntoView(false);
    //slipFrame.divBetLayer.scrollTop = slipFrame.divBetLayer.scrollTop + 30;
  }
}

function isDefaultFrame() {
  return curState == stateDefault;
}

// show Chi HW only in Chi page and EWINAT is set to 1
function ShowHWBtnInSlipFrame() {
    var isShow = MyParseInt(GetPara("ShowChiHandwriting"), 1) == 1 && GetLanguage() == 1;
    var supportHeight = screen.height >= 768;
    ShowHandwritingButton(isShow && supportHeight);
}

function OrientationChanged() {
  slipClose(true);
  refreshBetslipSize();
  refreshSlipSize();
  if (isIdleAlert) {
    slipMotion();
  }
}
