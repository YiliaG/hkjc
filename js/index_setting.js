var cookieUseNewValue = 'DefAmtUseNewValue';
var cookiePrefixOld = 'DefAmt';
var cookiePrefixHB = 'DefAmtHB';
var cookiePrefixSB = 'DefAmtSB';
var cookieM6DrawNo = 'M6DrawNo';
var cookieAccInfo = 'AccInfo';
var cookieAlupSetting = 'AlupSetting';
var psHBArray = new Array();
var psSBArray = new Array();

var valueMap = new Array();
valueMap['DISP_NAME'] = 0;
valueMap['DISP_BALANCE'] = 1;

function SettingVO() {
	this.pool = arguments[0];
  this.display = arguments[1];
  this.defAmt = arguments[2];
  this.storedAmt = arguments[2];
  this.minAmt = arguments[3];
  this.oldOrder = arguments[4];
  this.nameEn = arguments[5];
  this.nameCh = arguments[6];

  this.getName = function() {
    return ((GetLanguage()==cLangENG)? this.nameEn : this.nameCh);
  }
}

function initPSObj() {
  // [poolType], [display flag from AT], [default amount], [minimum amount], [old cookies order], [english name], [chinese name]
  psHBArray['WIN']   = new SettingVO('WIN',   IsBetTypeEnabled('WIN'), 10, 10,  0, 'Win',                '獨贏');
  psHBArray['PLA']   = new SettingVO('PLA',   IsBetTypeEnabled('PLA'), 10, 10,  1, 'Place',              '位置');
  psHBArray['W-P']   = new SettingVO('W-P',   IsBetTypeEnabled('W-P'), 10, 10,  2, 'Win - Place',        '獨贏及位置');
  psHBArray['QIN']   = new SettingVO('QIN',   IsBetTypeEnabled('QIN'), 10, 10,  3, 'Quinella',           '連贏');
  psHBArray['QPL']   = new SettingVO('QPL',   IsBetTypeEnabled('QPL'), 10, 10,  4, 'Quinella Place',     '位置Q');
  psHBArray['QQP']	 = new SettingVO('QQP',	  IsBetTypeEnabled('QQP'), 10, 10,  5, 'Quinella - Q Place', '連贏及位置Q');
  psHBArray['CW']	 = new SettingVO("CW",    IsBetTypeEnabled('CW'), 10, 10, -1, 'Composite Win', '組合獨贏');
  psHBArray['CWA']	 = new SettingVO("CWA",	  false, 10, 10, -1, 'Composite Win', '組合獨贏');
  psHBArray['CWB']	 = new SettingVO("CWB",   false, 10, 10, -1, 'Composite Win', '組合獨贏');
  psHBArray['CWC']	 = new SettingVO("CWC",   false, 10, 10, -1, 'Composite Win', '組合獨贏');
  psHBArray['TCE']   = new SettingVO('TCE',   IsBetTypeEnabled('TCE'), 10,  1,  6, 'Tierce',             '三重彩');  
  psHBArray['TRI']   = new SettingVO('TRI',   IsBetTypeEnabled('TRI'), 10,  1,  7, 'Trio',               '單T');
  psHBArray['F-F']   = new SettingVO('F-F',   IsBetTypeEnabled('F-F'), 10,  1, -1, 'First 4',            '四連環');
  psHBArray['QTT']   = new SettingVO('QTT',   IsBetTypeEnabled('QTT'), 10,  1, -1, 'Quartet',            '四重彩');
  psHBArray['DBL']   = new SettingVO('DBL',   IsBetTypeEnabled('DBL'), 10,  1, 10, 'Double',             '孖寶');
  psHBArray['TBL']   = new SettingVO('TBL',   IsBetTypeEnabled('TBL'), 10,  1, 11, 'Treble',             '三寶');
  psHBArray['D-T']   = new SettingVO('D-T',   IsBetTypeEnabled('D-T'), 10,  1,  8, 'Double Trio',        '孖T');
  psHBArray['T-T']   = new SettingVO('T-T',   IsBetTypeEnabled('T-T'), 10,  1,  9, 'Triple Trio',        '三T');
  psHBArray['6UP']   = new SettingVO('6UP',   IsBetTypeEnabled('6UP'), 10,  1, 12, 'Six Up',             '六環彩');
  psHBArray['JKC']   = new SettingVO('JKC',   IsBetTypeEnabled('JKC'), 10, 10, -1, 'Jockey Challenge',   '騎師王');
  psHBArray['ALUPX'] = new SettingVO('ALUPX', true,                    10,  1, 13, 'All Up/Cross Pool All Up',  '過關/混合過關');

  // [poolType], [display flag from AT], [default amount], [minimum amount], [old cookies order], [english name], [chinese name]
  psSBArray['ALUPX'] = new SettingVO('ALUPX', true, 10, 10, 15, 'All Up<br>/Cross Pool All Up', '過關/混合過關');
  psSBArray['HAD'] = new SettingVO('HAD', IsBetTypeEnabled('HAD'), 10, 10, 14, 'Home/Away/Draw', '主客和');
  psSBArray['TQL'] = new SettingVO('TQL', IsBetTypeEnabled('TQL'), 10, 10, 49, 'To Qualify', '晉級隊伍');
  psSBArray['FHAD'] = new SettingVO('FHAD', IsBetTypeEnabled('FHAD'), 10, 10, -1, 'First Half HAD', '半場主客和');
  psSBArray['HHAD'] = new SettingVO('HHAD', IsBetTypeEnabled('HHAD'), 10, 10, 16, 'Handicap HAD', '讓球主客和');
  psSBArray['HDC'] = new SettingVO('HDC', IsBetTypeEnabled('HDC'), 200, 200, 20, 'Handicap', '讓球');
  psSBArray['HILO'] = new SettingVO('HILO', IsBetTypeEnabled('HILO'), 10, 10, 28, 'HiLo', '入球大細');
  psSBArray['FHLO'] = new SettingVO('FHLO', IsBetTypeEnabled('FHLO'), 10, 10, -1, 'First Half HiLo', '半場入球大細');
  psSBArray['CHLO'] = new SettingVO('CHLO', IsBetTypeEnabled('CHLO'), 10, 10, -1, 'Corner HiLo', '角球大細');
  psSBArray['NTS'] = new SettingVO('NTS', IsBetTypeEnabled('NTS'), 10, 10, 49, 'Next Team To Score', '下一隊入球');
  psSBArray['CRS'] = new SettingVO('CRS', IsBetTypeEnabled('CRS'), 10, 10, 22, 'Correct Score', '波膽');
  psSBArray['FCRS'] = new SettingVO('FCRS', IsBetTypeEnabled('FCRS'), 10, 10, -1, 'First Half Correct Score', '半場波膽');
  psSBArray['FTS'] = new SettingVO('FTS', IsBetTypeEnabled('FTS'), 10, 10, 14, 'First Team To Score', '第一隊入球');
  psSBArray['TTG'] = new SettingVO('TTG', IsBetTypeEnabled('TTG'), 10, 10, 24, 'Total Goals', '總入球');
  psSBArray['OOE'] = new SettingVO('OOE', IsBetTypeEnabled('OOE'), 10, 10, 26, 'Odd/Even', '入球單雙');
  psSBArray['FGS'] = new SettingVO('FGS', IsBetTypeEnabled('FGS'), 10, 10, 30, 'First Scorer', '首名入球');
  psSBArray['HFT'] = new SettingVO('HFT', IsBetTypeEnabled('HFT'), 10, 10, 18, 'HaFu', '半全場');
  psSBArray['SPC'] = new SettingVO('SPC', IsBetTypeEnabled('SPC'), 10, 10, 46, 'Specials', '特別項目');
  psSBArray['DHCP'] = new SettingVO('DHCP', IsBetTypeEnabled('DHCP'), 10, 2, 35, 'Double HaFu Score', '孖寶半全膽');
  psSBArray['HFMP6'] = new SettingVO('HFMP6', IsBetTypeEnabled('HFMP6'), 10, 2, 36, '6 HaFu', '6 寶半全場');
  psSBArray['HFMP8'] = new SettingVO('HFMP8', IsBetTypeEnabled('HFMP8'), 10, 10, 37, '8 HaFu', '8 寶半全場');
  psSBArray['GPW'] = new SettingVO('GPW', IsBetTypeEnabled('GPW'), 10, 10, 41, 'Group Winner', '小組首名');
  psSBArray['GPF'] = new SettingVO('GPF', IsBetTypeEnabled('GPF'), 10, 10, 43, 'Group Forecast', '小組一二名');
  psSBArray['TPS'] = new SettingVO('TPS', IsBetTypeEnabled('TPS'), 10, 10, 45, 'Top Scorer', '神射手');
  psSBArray['CHP'] = new SettingVO('CHP', IsBetTypeEnabled('CHP'), 10, 10, 38, 'Champion', '冠軍');
  psSBArray['TOFP'] = new SettingVO('TOFP', IsBetTypeEnabled('TOFP'), 10, 10, 39, 'Tournament<br>Forecast', '冠亞軍');
  psSBArray['ADTP'] = new SettingVO('ADTP', IsBetTypeEnabled('ADTP'), 10, 10, 40, 'Advanced Teams', '晉級球隊');
  psSBArray['ALL'] = new SettingVO('ALL', false, 10, 10, 50, 'All Bet Type', '所有投注類別');   
}

function loadPSValues() {
  var useNewValue = getCookie(cookieUseNewValue);
  if ( useNewValue=='1' )
    loadNewValues();
  else
    loadOldValues();
}

function loadOldValues() {
	var dmtVal = getCookie(cookiePrefixOld);
	var amt;
	if ( dmtVal != '' )
		amt = dmtVal.split(',');

  for ( var i in psHBArray ) {
    if ( amt!=null && psHBArray[i].oldOrder != -1 )
      psHBArray[i].storedAmt = amt[psHBArray[i].oldOrder];
    else {
      loadOldValue(psHBArray[i], cookiePrefixOld + psHBArray[i].pool);
    }
  }

  for ( var i in psSBArray ) {
    if ( amt!=null && psSBArray[i].oldOrder != -1 )
      psSBArray[i].storedAmt = amt[psSBArray[i].oldOrder];
    else {
      loadOldValue(psSBArray[i], cookiePrefixOld + psSBArray[i].pool);
    }
  }
}

function loadNewValues() {
  // get racing units from cookies
  var amtStr = getCookie(cookiePrefixHB);
  var amtArray = amtStr.split(',');
  for ( var i=0; i<amtArray.length; i++ ) {
    var tmp = amtArray[i].split(':');
    if (psHBArray[tmp[0]].minAmt > parseInt(tmp[1], 10))
      psHBArray[tmp[0]].storedAmt = psHBArray[tmp[0]].minAmt;
    else
      psHBArray[tmp[0]].storedAmt = parseInt(tmp[1], 10);
  }

  // get football units from cookies
  var amtStr = getCookie(cookiePrefixSB);
  var amtArray = amtStr.split(',');
  for ( var i=0; i<amtArray.length; i++ ) {
    var tmp = amtArray[i].split(':');
    if (psSBArray[tmp[0]].minAmt > parseInt(tmp[1], 10))
      psSBArray[tmp[0]].storedAmt = psSBArray[tmp[0]].minAmt;
    else
      psSBArray[tmp[0]].storedAmt = parseInt(tmp[1], 10);
  }
}

function loadOldValue(psObj, str) {
  var s = getCookie(str);
  if ( s != '' )
    psObj.storedAmt = s;
}

function getCookie(cookie_name){
	if(document.cookie){
		index = document.cookie.indexOf(cookie_name);
		if (index != -1){
			var countbegin = (document.cookie.indexOf("=", index) + 1);
			var countend = document.cookie.indexOf(";", index);
			if (countend == -1) {
				countend = document.cookie.length;
			}
			return document.cookie.substring(countbegin, countend);
		}
	}
	return "";
}

function GetSetting(type, name, family, m6PartialFlag) {
  switch (type) {
  case "UnitBet" :
    loadPSValues();
    if (family == 'MK6') {
      return GetM6UnitBet(m6PartialFlag);
    }
    else if ( family == 'FB' )
      return psSBArray[name].storedAmt;
    else if ( family == 'HB' )
      return psHBArray[name].storedAmt;
    else
      return 10;
  case "MinBet":
    loadPSValues();
    if (family == 'MK6') {
      return GetM6UnitBet(m6PartialFlag);
    }
    else if ( family == 'FB' )
      return psSBArray[name].minAmt;
    else if ( family == 'HB' )
      return psHBArray[name].minAmt;
    else
      return 10;
  case "AccInfo" :
    return loadAccountInfo(valueMap[name]);
  case "ALUP" :
    return loadAlupSettings();
  case "M6DrawNo" :
    return loadM6DrawNo();
  }
  return null;
}

function loadAccountInfo(idx) {
  var accInfoStr = getCookie(cookieAccInfo) ;
  if ( accInfoStr != '' ) {
    var accInfoArray =  accInfoStr.split(',');
    return accInfoArray[idx];
  }
  return '0';
}

function loadAlupSettings() {
  var settingStr = getCookie(cookieAlupSetting);
  if (settingStr != '')
    return parseInt(settingStr, 10);
  return 0;
}

function loadM6DrawNo() {
  var m6DrawNo = getCookie(cookieM6DrawNo) ;
  if ( m6DrawNo != '' )
    return parseInt(m6DrawNo, 10);
  return '0';
}