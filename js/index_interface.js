var cRetCodeFail        = 0;
var cRetCodeSuccess     = 1;
var cRetCodeOverMax     = 2;
var cRetCodeBusy        = 3;

function addSel(betLine, longBetLine) {
  return addSelEx(betLine, longBetLine, "", "", 0, 0, 0, 0, 0);
}

function addSelEx(betLine, longBetLine, dispLine1, dispLine2, canFormAllup, isInPlay, leagueShort, isAdvSB,
                                        isRandGen, logID, isFlexibet, isExtraTime, isM6Partial, typeDescription) {

   // alert(betLine + '\n' + longBetLine + '\n' + dispLine1 + '\n' + dispLine2
   //      + '\nisRandGen : ' + isRandGen + '\nisFlexibet : ' + isFlexibet
	//       + '\nisM6Partial : ' + isM6Partial + '\nisAdvSB : ' + isAdvSB);
  if (isIdleAlert)
    return cRetCodeBusy;

  if (!EnableAddBetline()) {
    alert(GetError("1201"));
    return cRetCodeBusy;
  }

  // check number of betlines
  if (totalBetlines + 1 > cMaxBetlines) {
    alert(GetError("1205"));
    return cRetCodeOverMax;
  }

  var betInfo = new BetlineInfo();

  betInfo.betline = "";
  betInfo.description = longBetLine;
  betInfo.league = GetTextWithChecking(leagueShort);
  betInfo.unitBet = 0;
  betInfo.numOfSelection = 0;
  betInfo.canFormAllUp = GetNumberWithChecking(canFormAllup);
  betInfo.enableAllUp = ""; //?
  betInfo.allUpNum = -1; //?
  betInfo.isInPlay = GetNumberWithChecking(isInPlay);
  betInfo.betTitle = GetText('alt_details');
  if (typeDescription)
  	betInfo.typeDescription = typeDescription;
  
  if (betInfo.isInPlay == 1 && GetFBPara('InPlayBetting') != 1) { // index_webpara.js
    //alert(GetError("inplay_disabled"));
    return cRetCodeFail;
  }
  var betline_parts = betLine.split(" ");
  if (betLine.substring(0, 3) == "MK6") {
    betInfo.family = "MK6";
    if (dispLine1 == undefined || dispLine1 == null || dispLine1 == "" ||
      dispLine2 == undefined || dispLine2 == null || dispLine2 == "") {
      return cRetCodeFail;
    }
  } else if (betLine.substring(0, 2) == "FB")
    betInfo.family = "FB";
  else {
    betInfo.family = "HB";
    betInfo.venue = betLine.substring(0, 2);
    var selsIdx = (betline_parts[2] == 'TCE' || betline_parts[2] == 'QTT')  ? 4 : 3;
    var betSels = betline_parts[selsIdx].split("*");
    if ( betSels.length > 1 ) {
      betInfo.raceNo = ((parseInt(betSels[0])<10)?'0':'') + betSels[0];
      betInfo.betSel = betSels[1];
    }
  }

  betInfo.type = ParseBetType(betLine, betInfo.family);
  if (!IsAllUpEnabled(betInfo)) {
    return cRetCodeFail;
  }
  if (!IsBetTypeEnabled(betInfo.type)) {
    return cRetCodeFail;
  }
  if (!IsExtraTimeBetEnabled(isExtraTime)) {
    return cRetCodeFail;
  }
  
  // check flexibet
  if ( (isRandGen!=1 || betInfo.type=='QTT') && !updateFlexbetFlag(betInfo, isFlexibet) )
    return cRetCodeFail;

  // update M6 partial flag
  updateM6PartialUnitFlag(betInfo, isM6Partial);

  betInfo.match = ""; // MK6, HV TUE 1, FB FRI 1
  betInfo.isAdvSB = GetNumberWithChecking(isAdvSB);
    
  if (betInfo.type == "MK6") {
    if (betInfo.isAdvSB == 1 && GetPara("Snowball") != "1")
      return cRetCodeFail;
    if (betLine.split(" ").length > 2 && GetPara("MK6MultiDraw") != "1")
      return cRetCodeFail;
  }

  betInfo.isRandGen = GetNumberWithChecking(isRandGen);
  betInfo.dispLine1 = dispLine1;
  betInfo.dispLine2 = dispLine2;
  betInfo.xsellLogId = GetTextWithChecking(logID);

  // parse unit bet amount, if not available, use unit bet in personal settings
  var pos = betLine.indexOf("$");
  if (pos >= 0 && betInfo.type != "MK6") {
    betInfo.unitBet = betLine.substring(pos + 1);
    betInfo.betline = betLine.substring(0, pos - 1);
    betInfo.containUnitBet = true;
  } else {
    if (betInfo.type.indexOf("ALUP") >= 0)
      betInfo.unitBet = MyParseInt(GetSetting("UnitBet", "ALUPX", betInfo.family), 10);
    else
      betInfo.unitBet = MyParseInt(GetSetting("UnitBet", betInfo.type, betInfo.family, betInfo.m6UnitBetAmountType), 10);
    betInfo.betline = betLine;
    betInfo.containUnitBet = false;
  }   

  // check racing minimum amount
  if ( betInfo.family == 'HB' ) {
    if (betInfo.type.indexOf('ALUP') >= 0) {
      if (!IsAllUpBetlineEnabled(betInfo)) // check racing alup
        return cRetCodeFail;
      if ( parseInt(betInfo.unitBet) < psHBArray['ALUPX'].minAmt )
        betInfo.unitBet = MyParseInt(GetSetting("UnitBet", "ALUPX", betInfo.family), 10);
    }
    else if ( parseInt(betInfo.unitBet) < psHBArray[betInfo.type].minAmt )
      betInfo.unitBet = MyParseInt(GetSetting("UnitBet", betInfo.type, betInfo.family), 10);
  }

  // check unit bet
  if ( !betInfo.isFlexiBet() && betInfo.unitBet > MyParseInt(GetPara("MaxBetUnit"), 50000) ) {
    alert(GetError("1206"));
    return cRetCodeFail;
  }

  // check hdc mini amount
  if (betInfo.type == "HDC" && betInfo.unitBet < 200)
    betInfo.unitBet = 200;

  // check bet buffer size
  if (IsBufferOverflow(betInfo.betline, betInfo.unitBet, betInfo.type, betInfo.isInPlay,
                       betInfo.isRandGen, betInfo.isAdvSB, betInfo.isXSell(), betInfo.isFlexiBet())) {
    alert(GetError("1203"));
    return cRetCodeOverMax;
  }

  // check duplicate bet
  if (IsDuplicateBet(betInfo.family, betInfo.type, betInfo.betline)) {
    alert(GetError("duplicate_bet_fixed_odds" + betInfo.family));
    return cRetCodeFail;
  }

  // parse match number
  betInfo.match = ParseMatchNumber(betInfo.betline, betInfo.family, betInfo.type);

  // calculate number of selection
  betInfo.numOfSelection = CalcSelections(betInfo.family, betInfo.type, betInfo.betline);
  if (betInfo.numOfSelection > 36 && betInfo.type == "FGS") {
    ShowError(1, GetError("1207"), false, 5000);
    return cRetCodeFail;
  }

  // add checking for TTQP
  if ( !isValidTTQP(betInfo, betLine, isRandGen) )
    return cRetCodeFail;
    
  if (betInfo.type == "SPC" && betInfo.isInPlay == 1 && GetFBPara("InPlaySpecial") != "1") {
    //alert(GetError("inplay_special_disabled"));
    return cRetCodeFail;
  }
        
  // **** Delete Long Format Last '<BR>' ****
  if (betInfo.description.substring(betInfo.description.length-4) == "<BR>") {
    betInfo.description = betInfo.description.substring(0, betInfo.description.length-4);
  }
    
  if (betInfo.canFormAllUp == 0)
    betInfo.enableAllUp = cAllUpNA;
  else
    betInfo.enableAllUp = GetDynamicAllUpState(betInfo.family, betInfo.type, betInfo.match);

  var retCode = updateBetlineStore(betInfo);
  if (retCode != cRetCodeSuccess) return retCode;  

  // redraw betline table
  RedrawBetlineTable();

  
  $j('#tdBetlineCount').html(totalBetlines);
  if (totalBetlines > 0) {  
      var betTblTr = $j('#betTbl')[0].getElementsByTagName('tr');      
      var divBetLayer = $j('#divBetLayer')[0];
  	  divBetLayer.scrollTop = divBetLayer.scrollHeight;
   // betTblTr[totalBetlines - 1].scrollIntoView(true);
  }

  // Support SSO
  isClientActionTaken(true);

  if (isEditing()) unmaskBetslip();

  return cRetCodeSuccess;
} // addSelEx

function addAllUpSel(betLine, longBetLine, dispLine1, dispLine2, numOfCombinations, unitBetAmt, isInPlay, leagueShort) {

  //alert(betLine + '\n' + longBetLine + '\n' + dispLine1 + '\n' + dispLine2);

  if ( isIdleAlert )
    return cRetCodeBusy;

  if (!EnableAddBetline()) {
      alert(GetError("1201"));
      return cRetCodeBusy;
  }

  // check number of betlines
  if (totalBetlines + 1 > cMaxBetlines) {
      alert(GetError("1205"));
      return cRetCodeOverMax;
  }
  
  var betInfo = new BetlineInfo();
  
  betInfo.betline = betLine;
  betInfo.description = longBetLine;
  betInfo.league = 0;
  if (leagueShort != '') {
    betInfo.league = GetTextWithChecking(leagueShort);
  }
  betInfo.unitBet = unitBetAmt;
  betInfo.numOfSelection = GetNumberWithChecking(numOfCombinations);
  betInfo.canFormAllUp = 0;
  betInfo.enableAllUp = cAllUpNA;
  betInfo.allUpNum = -1; //?
  betInfo.isInPlay = GetNumberWithChecking(isInPlay);
  betInfo.betTitle = GetText('alt_details');
  if (betInfo.isInPlay == 1 && GetFBPara("InPlayBetting") != "1") { // index_webpara.js
      //alert(GetError("inplay_disabled"));
      return cRetCodeFail;
  }
  var betline_parts = betLine.split(" ");
  if (betLine.substring(0, 3) == "MK6")
      betInfo.family = "MK6";
  else if (betLine.substring(0, 2) == "FB")
      betInfo.family = "FB";
  else
      betInfo.family = "HB";
  betInfo.type = ParseBetType(betLine, betInfo.family);
  if (!IsBetTypeEnabled(betInfo.type)) {
      //alert(GetError("invalid or disabled bettype"));
      return cRetCodeFail;
  }
  if (!IsAllUpBetlineEnabled(betInfo)) {
    return cRetCodeFail;
  }
  if (!IsExtraTimeBetEnabled(0)) {
      return cRetCodeFail;
  }
  betInfo.match = ""; // MK6, HV TUE 1, FB FRI 1
  betInfo.isAdvSB = 0;
  betInfo.isRandGen = 0;
  betInfo.dispLine1 = dispLine1;
  betInfo.dispLine2 = dispLine2;
  betInfo.xsellLogId = "";

  // check unit bet
  if (betInfo.unitBet == 0) {
      betInfo.unitBet = MyParseInt(GetSetting("UnitBet", "ALUPX", betInfo.family), 10);
  }

  if (betInfo.unitBet > MyParseInt(GetPara("MaxBetUnit"), 50000)) {
      alert(GetError("1206"));
      return cRetCodeFail;
  }   
  // check hdc mini amount
  if (betInfo.type == "HDC" && betInfo.unitBet < 200)
      betInfo.unitBet = 200;

  // check bet buffer size
  if (IsBufferOverflow(betInfo.betline, betInfo.unitBet, betInfo.type, betInfo.isInPlay,
                       betInfo.isRandGen, betInfo.isAdvSB, betInfo.isXSell(), betInfo.isFlexiBet())) {
      alert(GetError("1203"));
      return cRetCodeOverMax;
  }
  
  // check duplicate bet
  if (IsDuplicateBetAllUp(betInfo.family, betInfo.type, betInfo.betline)) {
      alert(GetError("duplicate_bet_fixed_odds" + betInfo.family));
      return cRetCodeFail;
  }
  
  // parse match number
  betInfo.match = ParseMatchNumber(betInfo.betline, betInfo.family, betInfo.type);
  
  if (betInfo.description.substring(betInfo.description.length-4) == "<BR>") {
      betInfo.description = betInfo.description.substring(0, betInfo.description.length-4);
  }

  var retCode = updateBetlineStore(betInfo);
  if (retCode != cRetCodeSuccess) return retCode;

//  if (slipFrame.contentWindow.document.readyState == "complete")
      RedrawBetlineTable();
      
      $j('#tdBetlineCount').html(totalBetlines);
  
 // if ( totalBetlines > 0 )
 //   slipFrame.betTbl.rows[totalBetlines - 1].scrollIntoView(true);

  // Support SSO
  isClientActionTaken(true);

  return cRetCodeSuccess;
} // addAllUpSel

function updateBetlineStore(betInfo) {
    if (!isEditing())
        AppendBetline(betInfo);
    else {
        //check consistency prior save the edited bet
        if (editInfo.isConsistentBetInfo(betInfo))
            saveEditingBetline(betInfo);
        else
            return cRetCodeFail;
    }
    return cRetCodeSuccess;
}

function getCurrentEventSequenceNumber(label) {
  return xml_event_seq[label];
}

function setXMLObject(label, xmlDoc) {
    if (typeof(xmlDoc) != "object")
        return false;

    switch (label) {
        case "allupformula" :   return SetXML_allupformula(label, xmlDoc);
        case "bonus" :          return SetXML_bonus(label, xmlDoc);
        case "scbinfo" :        return SetXML_scbinfo(label, xmlDoc);
        case "pooldef" :        return SetXML_pooldef(label, xmlDoc);
        case "scratchrunner" :  return SetXML_scratch(label, xmlDoc);
        case "bwadef" :         return SetXML_bwindef(label, xmlDoc);
    }

    return false;
}

function setXmlData(multiRaceLegStr, fieldSize, scratchList, reserveList) {
  setMultiRacesPoolDefLegs(multiRaceLegStr);
  setFieldSize(fieldSize);
  clearScratch(scratchList);
  setScratch(scratchList);
  setScratch(reserveList);
}

var meetingDt = new Array();

function getMeetingDt(venue) {
	if ( venue=="" )
    return "";  
  return meetingDt[venue];
}

function setMeetingDate(dateList) {
  var str = dateList.split(';');
  for ( var i=0; i<str.length; i++ ) {
    var subStr = str[i].split('@');
    meetingDt[subStr[0]] = subStr[1];
  }
}

// return true of false
function chgLang(lang) {   
 if (SetLanguage(lang) == true) {
    if (document.getElementById('divLogout').style.display == 'block')
        CloseLogoutPopup(curState);
    return 1;
 }
  return 0; 
}

// return true or false
function isLogon() {
  return isNowLogon;
}

function getCustomerSegment() {
    return customerSegment;
}

function resetIdleTimer() {
  ResetIdleTimer(true);
}

function getUnitBetAmount(betType) {
  return GetSetting('UnitBet', betType, 'FB');
}

function getMinimumUnitBetAmount(pools, family) {
  var minVal = 0;
  var pool = pools.split(';');
  for ( var i=0; i<pool.length; i++ ) {
    var s = GetSetting("UnitBet", pool[i], family);
    if ( !isNaN(s) ) {
      if ( minVal == 0 || parseInt(s, 10) < minVal )
        minVal = parseInt(s, 10);
    }
  }
  return minVal;
}

function isFlexBetEnabled(pool) {
  var p = (pool.indexOf('ALUP')>=0) ? 'ALUP' : pool;
  if ( GetFlexiPara('HB') && GetFlexiPara(p) )
    return true;
  return false;
}

function updateFlexbetFlag(betInfo, isFlexibet) {
  if ( isFlexibet!=null && isFlexibet==1 ) {
    if ( isFlexBetEnabled(betInfo.type) )			// JCBW flexibet, BetSlip enable
      betInfo.betMethod = 1;
    else {											// JCBW flexibet, BetSlip disable
      alert(GetText('disable_flexibet'));
      return false;
    }
  }
  else {
    if ( isFlexBetEnabled(betInfo.type) )			// JCBW unitbet, BetSlip enable
      betInfo.betMethod = 0;
  }
  return true;
}

function GetM6UnitBet(idx) {  // 0 = Partial, 1 = Default
  var val = GetPara('Mk6DefaultUnitBetAmount');
  if (idx == 0)
    val = GetPara('Mk6PartialUnitBetAmount');
  if ( isNaN(val) )
    val = 10;
  return val;
}

function isM6MultiDrawEnable() {
  var val = GetPara('MK6MultiDraw');
  if (isNaN(val))
    val = 0;
  return val;
}

function isM6PartialUnitEnabled(pageType) {			// pageType: 0 = Any, 1 = Total Banker Spend, 2 = ByProduct Multiple, 3 = ByProduct Banker
  var type1 = GetPara('Mk6TotalBetSpend') == '1';
  var type2 = GetPara('Mk6ByProdMulti') == '1';
  var type3 = GetPara('Mk6ByProdBanker') == '1';
  if (pageType == 1 && type1)
    return '1';
  if (pageType == 2 && type2)
    return '1';
  if (pageType == 3 && type3)
    return '1';
  if (pageType == 0 && (type1 || type2 || type3))
    return '1';
  return '0';
}

function updateM6PartialUnitFlag(betInfo, isPartial) {
  if (betInfo.family == 'MK6' && isM6PartialUnitEnabled(0)=='1') {
    if (isPartial != null && isPartial == 1)
      betInfo.m6UnitBetAmountType = 0; // Partial Unit Bet
    else
      betInfo.m6UnitBetAmountType = 1; // Default Unit Bet
  }
}

function getM6DrawNo() {
  return GetSetting('M6DrawNo');
}

function setMinBet() {
  try {
    var minbets = top.getMinBetStr().split(';');
    for (var i=1; i<minbets.length; i++ ) {
      var minbetParts = minbets[i].split(':');
      if (minbetParts.length < 2 || minbetParts[1]=='')
        continue;

      var miniAmt = parseInt(minbetParts[1], 10);
      if (minbetParts[0] == 'JKC') {
        psHBArray[minbetParts[0]].minAmt = miniAmt
        if (psHBArray[minbetParts[0]].storedAmt < miniAmt)
          psHBArray[minbetParts[0]].storedAmt = miniAmt;
        if (psHBArray[minbetParts[0]].defAmt < miniAmt)
          psHBArray[minbetParts[0]].defAmt = miniAmt;
      }
      else {
        psSBArray[convertInfohubPoolCode(minbetParts[0])].minAmt = miniAmt;
        if (psSBArray[convertInfohubPoolCode(minbetParts[0])].storedAmt < miniAmt)
          psSBArray[convertInfohubPoolCode(minbetParts[0])].storedAmt = miniAmt;
        if (psSBArray[convertInfohubPoolCode(minbetParts[0])].defAmt < miniAmt)
          psSBArray[convertInfohubPoolCode(minbetParts[0])].defAmt = miniAmt;    
      }
    }
  } catch (e) {}
}

function convertInfohubPoolCode(str) {
  switch (str) {
    case 'FHA': return 'FHAD';
    case 'HHA': return 'HHAD';
    case 'HIL': return 'HILO';
    case 'FHL': return 'FHLO';
    case 'FCS': return 'FCRS';
    case 'DHC': return 'DHCP';
    case 'HFM': return 'HFMP6';
    case 'TOF': return 'TOFP';
    case 'ADT': return 'ADTP';
    case 'CHL': return 'CHLO';
    default: return str;
  }
}

/********************************************************************************
xsell
********************************************************************************/
var xsell_sessionInfo;
var registerAppTimer;

function xsell_addSelEx(gotoPreview, betLineFormat, longBetLineFormat, dispLine1, dispLine2, isAllup,
    isInPlay, leagueShort, isAdvSB, isRandGen, logID) {
  if ( isIdleAlert )
    return;

  if (isReply)
    OnClickClose();

  addSelEx(betLineFormat, longBetLineFormat, dispLine1, dispLine2, isAllup, isInPlay, leagueShort,
           isAdvSB, isRandGen, logID);
    
  if (gotoPreview == true)
    OnClickPreview();
}

function isXSellEnabled() {
    return (GetOnlinePara("XSellOption") != "0");
}

function getSessionInfo() {
    return xsell_sessionInfo;
}

function getLanguage() {
    return GetLanguage();
}

var sisisExist = 1; // Q109 flag to identify whether SISIS existence
function receiveXContent(msgHolderID, content) {
  clearXsellTimeout();
  sisisExist = 1;
  switch (msgHolderID) {
    case 4 :
    case "4" :      
      if (!$('#divBetPreview').is(":visible"))
        return false;
      else
        return receiveXContent(content);
    default :
      return false;
  }
  return false;
}

function xsellAgentExist() {
  clearXsellTimeout();
  sisisExist = 1;
}

var loc = new Array(5, 0, 3, 7, 6, 1, 4, 2);
function rearrange(ac_num) {
    var ary1 = new Array();
    for (i = 0; i < loc.length; i++)
        ary1[loc[i]] = String.fromCharCode(ac_num.charCodeAt(i) | 64);
    return ary1.join("");
}

function createSessionInfo() {
    xsell_sessionInfo = null;
    var accountNo = GetDataStore("account");
    var hashed_ac = rearrange(accountNo);   
    var balance = GetDataStore("balance");
    var poolTypes = new Array();
    var bsd = new Array();

    for (var i = 0; i < totalBetlines; i++) {
        var betType = betlines[i].type;
        if (betlines[i].family == "FB") {
            if (betType.indexOf("ALUP") == 0) {
                var dummy1 = betlines[i].betline.split("/");
                betType = dummy1[0].substring(3);
                for (var j = 1; j < dummy1.length; j++) {
                    var dummy2 = dummy1[j].split("*");
                    betType += "|" + dummy2[0];
                }
            } else {
                if (betType == "CHP" || betType == "CHPP" || betType == "TOFP" || betType == "TPS" ||
                    betType == "ADTP" || betType == "GPF" || betType == "GPW") {
                } else if (betType == "SPC") {
                    if (betlines[i].match.indexOf("SPC ") >= 0) {
                        betType = betlines[i].match.substring(2);
                    }
                } else {
                    betType += " " + betlines[i].match.substring(2);
                }
            }
        }
        if ( isBsdExist(betlines[i]) ) {
          var cat = (betlines[i].family=='FB')?'S':'R';
          bsd[i] = cat + ',' + getXSellBetSelectionDetailId(betlines[i])
                 + ',' + getXSellBetSelectionDetailAscii(betlines[i]);
        }
        else {
          bsd[i] = '##';
        }
        poolTypes[i] = betType + "," + betlines[i].isRandGen + "," + betlines[i].isInPlay + ","
                     + (betlines[i].unitBet * betlines[i].numOfSelection) + "," + betlines[i].xsellLogId;
    }
    
    xsell_sessionInfo = new Object();
    xsell_sessionInfo.accountNo = hashed_ac;
    xsell_sessionInfo.balance = balance;
    xsell_sessionInfo.poolTypes = poolTypes;
    xsell_sessionInfo.bsd = bsd;
}

function raiseXEvent(eventID) {
    try {
        var xFrame = top.frames["xsellFrame"];
        if (xFrame) {
            if (xFrame.xagent != undefined) {
                xagent = xFrame.xagent;
                createSessionInfo();
                xagent.raiseXEvent(eventID, this);
            }
        }
    } catch (err) {
        //alert(err.message);
    }
}

function RegisterXSell() {
    try {
        var xFrame = top.frames["xsellFrame"]; //The object path may be different for clients.
        if (xFrame) {
            if (xFrame.xagent != undefined) {
                clearInterval(registerAppTimer);
                xagent = xFrame.xagent;
                var msgHolders = [4];
                if (!xagent.registerApp("BS", this, msgHolders, receiveXContent)) {
                    //alert(xagent.error);
                }
            }
        }
    } catch (err) {
        //alert(err.message);
    }
}

function getBIdCode(bType) {
    if ( !xSellTypeCode[bType] )
      return '';
  return xSellTypeCode[bType];
}

function getVenueCode(bVenue) {
  return xSellVenueCode[bVenue];
}

function isBsdExist(betInfo) {
  return (getBIdCode(betInfo.type)!='');
}

function getXSellBetSelectionDetailId(betInfo) {
  var dt = getMeetingDt(betInfo.venue);
  dt = dt.substring(8) + dt.substring(3,5) + dt.substring(0,2);
  return dt + getVenueCode(betInfo.venue) + betInfo.raceNo + getBIdCode(betInfo.type);
}

function getXSellBetSelectionDetailAscii(betInfo) {
    var betAscii = '';
  for ( var i=0; i<betInfo.betSel.length; i++ ) {
    var digit = betInfo.betSel.charCodeAt(i)-43;
    betAscii += ((digit<10)?'0':'') + digit;
  }
  return betAscii;
}

function index_onload() {
	try {
		if ($$.browser.firefox || $$.browser.safari) {
			document["readyState"] = "complete";
		}
	}
	catch (e) {
	}
}

//webcast functions
function haveWebcastPermission() {
    var IsEnabledELVA = MyParseInt(GetPara("IsEnabledELVA"), 0) == 1 && enableWebcastAccess;    //both EWINAS and web.config are enable
    var haveELVAAccess = GetDataStore('have_webcast_access') == '' ? 'N' : GetDataStore('have_webcast_access');
    return IsEnabledELVA && haveELVAAccess == 'Y';
}

var webcastWin = null;
function openWebcastPopup() {    
    if (webcastWin != null && !webcastWin.closed)
        webcastWin.close();

    var width = 800;
    var height = 600;    
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    var sFeatures = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height
          + ",scrollbars=0,status=0"
          + ",location=0,menubar=0,resizable=1,titlebar=0";

    webcastWin = window.open(SSOAuthen4WebcastURLArray[GetLanguage()], "_blank", sFeatures);
    webcastWin.focus();
}

//webtv functions for SB page
function showWebTVIcon() {
    var footballLive = GetDataStore('football_live_ind');
    return footballLive == "Y";
}

function openWebTVWindow(matchid) {
    var webcastWin;
    if (!matchid) {
        webcastWin = window.open(fbWebTVURLArray[GetLanguage()], "_newtab");
    }
    else {
        webcastWin = window.open(fbWebTVURLArray[GetLanguage()] + "&matchid=" + matchid, "_newtab");
    }
    webcastWin.focus();       
}

var webTVStatusCallback = null;
function regWebTVStatusCallback(callback) {
    webTVStatusCallback = callback;
}

function updateWebTVStatus() {
    try {
        if (webTVStatusCallback != null && typeof (webTVStatusCallback) == "function") {
            webTVStatusCallback();
        }
    } catch (e) {
    }
}

function isCWinEnabled() {
	return (GetPara("CW") == "1");
}

function isCWinXAllUpEnabled() {
	return (GetPara("CW") == "1" && GetPara("CrossPoolCW") == "1" && GetPara("HorseRaceCrossPool") == "1");
}

