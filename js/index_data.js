function BetlineInfo() {
	this.betline = "";
	this.description = "";
	this.league = "";
	this.unitBet = 0;
	this.numOfSelection = 0;
	this.canFormAllUp = 0;
	this.enableAllUp = "";
	this.isInPlay = 0;
	this.family = "";  // FB, HB, MK6
	this.type = "";
	this.typeDescription = "";
	this.match = ""; // MK6, HV TUE 1, FB FRI 1
	this.isAdvSB = 0;
	this.isRandGen = 0;
	this.dispLine1 = "";
	this.dispLine2 = "";
	this.xsellLogId = "";
	this.venue = "";
	this.raceNo = "";
	this.betSel = "";

  // for new display
  this.descOpen = false;
  this.betTitle = "";
  this.delHit = false;
  this.alupHit = false;
  this.unitHit = false;

  // Q308
  this.betMethod = -1;    // -1 == disabled, 0 == unitbet, 1 == flexibet

  // Q310
  this.m6UnitBetAmountType = -1;  // -1 == disabled, 1 == Default Unit Bet, 0 == Partial Unit Bet

	this.CopyTo = function(dest) {
		dest.betline = this.betline;
		dest.description = this.description;
		dest.league = this.league;
		dest.unitBet = this.unitBet;
		dest.numOfSelection = this.numOfSelection;
		dest.canFormAllUp = this.canFormAllUp;
		dest.enableAllUp = this.enableAllUp;
		dest.isInPlay = this.isInPlay;
		dest.family = this.family;
		dest.type = this.type;
		dest.typeDescription = this.typeDescription;
		dest.match = this.match;
		dest.isAdvSB = this.isAdvSB;
		dest.isRandGen = this.isRandGen;
		dest.dispLine1 = this.dispLine1;
		dest.dispLine2 = this.dispLine2;
		dest.xsellLogId = this.xsellLogId;
		dest.venue = this.venue;
		dest.raceNo = this.raceNo;
		dest.betSel = this.betSel;

    dest.descOpen = this.descOpen;
    dest.betTitle = this.betTitle;
    dest.delHit = this.delHit;
    dest.alupHit = this.alupHit;
    dest.unitHit = this.unitHit;

    dest.betMethod = this.betMethod;
    dest.m6UnitBetAmountType = this.m6UnitBetAmountType;
	}
	
	this.Clear = function() {
		this.betline = "";
		this.description = "";
		this.league = "";
		this.unitBet = 0;
		this.numOfSelection = 0;
		this.canFormAllUp = 0;
		this.enableAllUp = "";
		this.isInPlay = 0;
		this.family = "";  // FB, HB, MK6
		this.type = "";
		this.typeDescription = "";
		this.match = ""; // MK6, HV TUE 1, FB FRI 1
		this.isAdvSB = 0;
		this.isRandGen = 0;
		this.dispLine1 = "";
		this.dispLine2 = "";
		this.xsellLogId = "";
		this.venue = "";
    this.raceNo = "";
    this.betSel = "";

    this.descOpen = false;
    this.betTitle = "";
    this.delHit = false;
    this.alupHit = false;
    this.unitHit = false;

    this.betMethod = -1;
    this.m6UnitBetAmountType = -1;
	}

  this.isXSell = function() {
    return this.xsellLogId != undefined && this.xsellLogId != null && this.xsellLogId != '';
  }

  this.isFlexiBet = function() {
    return this.betMethod==1;
  }

  this.isPartialUnit = function() {
    return this.m6UnitBetAmountType == 0;
  }

  this.resetHit = function() {
    this.delHit = false;
    this.alupHit = false;
    this.unitHit = false;
  }

  this.debugData = function() {
    return 'this.betline : ' + this.betline + '\n'
        + 'this.description : ' + this.description + '\n'
        + 'this.league : ' + this.league + '\n'
        + 'this.unitBet : ' + this.unitBet + '\n'
        + 'this.numOfSelection : ' + this.numOfSelection + '\n'
        + 'this.canFormAllUp : ' + this.canFormAllUp + '\n'
        + 'this.enableAllUp : ' + this.enableAllUp + '\n'
        + 'this.isInPlay : ' + this.isInPlay + '\n'
        + 'this.family : ' + this.family + '\n'
        + 'this.type : ' + this.type + '\n'
        + 'this.typeDescription' + this.typeDescription + '\n'
        + 'this.match : ' + this.match + '\n'
        + 'this.isAdvSB : ' + this.isAdvSB + '\n'
        + 'this.isRandGen : ' + this.isRandGen + '\n'
        + 'this.dispLine1 : ' + this.dispLine1 + '\n'
        + 'this.dispLine2 : ' + this.dispLine2 + '\n'
        + 'this.xsellLogId : ' + this.xsellLogId + '\n'
        + 'this.venue : ' + this.venue + '\n'
        + 'this.raceNo : ' + this.raceNo + '\n'
        + 'this.betSel : ' + this.betSel + '\n'
        + 'this.descOpen : ' + this.descOpen + '\n'
        + 'this.betTitle : ' + this.betTitle + '\n';
        + 'this.delHit : ' + this.delHit + '\n'
        + 'this.alupHit : ' + this.alupHit + '\n'
        + 'this.unitHit : ' + this.unitHit + '\n'
        + 'this.betMethod : ' + this.betMethod + '\n'
        + 'this.m6UnitBetAmountType : ' + this.m6UnitBetAmountType;
  }

  this.clearRandGen = function() {
    this.isRandGen = 0;
    this.description = this.description.replace(GetText('txt_randGen'), '');
  }  
}

var betlines = new Array(cMaxBetlines);
for (var i = 0; i < betlines.length; i++) {
	betlines[i] = new BetlineInfo();
}

var allUpBetlines = new Array(cMaxBetlines);	// for format allup bet
for (var i = 0; i < allUpBetlines.length; i++) {
	allUpBetlines[i] = new BetlineInfo();
}

var totalBetlines = 0;
var totalAllUpBetlines = 0;

var allup_formula  = new Array(	"2,3,4,5,6,7,8",
								"1",
								"1,3",
								"1,3,4,6,7",
								"1,4,5,6,10,11,14,15",
								"1,5,6,10,15,16,20,25,26,30,31",
								"1,6,7,15,20,21,22,35,41,42,50,56,57,62,63",
								"1,7,8,21,35,120,127",
								"1,8,9,28,56,70,247,255");
var array_allup_level = allup_formula[0].split(","); // split the first array for which allup is vaild
var max_allup = array_allup_level[array_allup_level.length - 1]; // the max allup number
var min_allup = array_allup_level[0]; // the min allup number

// for duplicate bet checking only
var array_str_fb_fixed_odds_type = new Array(	"HAD",	"HHAD",	"TTG",	"OOE",	"HILO",	
												"CRS",	"HFT",	"HDC",	"GPF",	"STB",
												"GPW",	"SPC",	"TPS",	"CHP",	"FGS",
												"FHAD", "TQL", "NTS", "FTS", "FHLO",
												"FCRS", "CHLO");
var array_str_hb_fixed_odds_type = new Array( "JKC" );
// This for old Type//?
var array_str_allup_fb_type = new Array("HFMP",	"HFMP8","CRSP",	"HCSP",	"HILO",	"TOFP",	"STB",	"HAFU");
var array_str_allup_hr_type = new Array("WIN","PLA","W-P","QIN","QPL","QQP","TRI");
var array_str_allup_hr_type_allup = new Array("AWN","APL","AQF","AUT", "AQP");

// Dynamic Selection Allup State
var cAllUpNA	= -1;
var cAllUpDisabled	= 0;
var cAllUpEnabled	= 2;
var cAllUpSelected	= -2;

//Q108A start
var xSellVenueCode = new Array();
xSellVenueCode['ST'] = '01';
xSellVenueCode['HV'] = '02';
xSellVenueCode['X1'] = '03';
xSellVenueCode['X2'] = '04';
xSellVenueCode['S1'] = '05';
xSellVenueCode['S2'] = '06';
xSellVenueCode['S3'] = '07';
xSellVenueCode['S4'] = '08';
xSellVenueCode['S5'] = '09';
xSellVenueCode['S6'] = '10';
xSellVenueCode['S7'] = '11';
xSellVenueCode['S8'] = '12';
xSellVenueCode['S9'] = '13';

/* for future use
0-WINPLA	1-WIN		2-PLA		3-QIN		4-QPL			5-DBL		6-TCE		7-QTT				8-DQN		9-TBL
10-TTR		11-6UP	12-DTR	13-TRIO	14-QINQPL	15-CV		16-MK6	17-Goldball	18-AWP	19-AWN
20-APL		21-AQN	22-AQP	23-ATR	24-AQQP		25-ATC	26-AQT	27-FF				28-BWA	29-BWB
30-BWC		31-BWD	32-ABWA	33-ABWB	34-ABWC		35-ABWD
*/
var xSellTypeCode = new Array();
xSellTypeCode['QIN'] = '03';
xSellTypeCode['QPL'] = '04';
//Q108A end

function IsBufferOverflow(betline, unitBet, type, isInPlay, isRandGen, isAdvSB, isXSell, isFlexiBet) {
	var totalBytes = 0;
	var addon = 0;
	var buffer = cMaxBetBuffer;
	
	for (var i = 0; i < totalBetlines; i++) {
	    addon = 3; // " $" and "\"
	    if (betlines[i].isFlexiBet())
	        addon += 1; //extra "$"
		if ( betlines[i].isXSell() )
		    addon += 2;  // "X "
		if (betlines[i].isInPlay == 1)
			addon += 1;	// I		
		if (betlines[i].isRandGen == 1 && (betlines[i].type == "MK6" || betlines[i].type == "T-T" || betlines[i].type == "QTT"))
			addon += 4; // " (RG)"
		if (betlines[i].isAdvSB == 1 && betlines[i].type == "MK6")
			addon += 1; // S
		
		totalBytes += betlines[i].betline.length + betlines[i].unitBet.toString().length + addon;
	}

	addon = 3;  // " $" and "\"
	if (isFlexiBet)
	    addon += 1; //extra "$"	
	if (isXSell)
		addon += 2; // "X "
	if (isInPlay == 1) 
		addon += 1;	// I	
	if (isRandGen == 1 && (type == "MK6" || type == "T-T" || type == "QTT"))
	    addon += 4; // " (RG)"
	if (isAdvSB == 1 && type == "MK6")
		addon += 1; // S
	
	totalBytes += betline.length + unitBet.toString().length + addon;

	// Q108A Special Handling for DHCP
	if ( type == "DHCP" )
		buffer -= 5;
	for (var i = 0; i < totalBetlines; i++) {
		if ( betlines[i].type == "DHCP" )
			buffer -= 5;
	}

	return (totalBytes > buffer);
}

function IsFixedOddsBetType(type) {
	for (var i = 0; i < array_str_fb_fixed_odds_type.length; i++) {
		if (type == array_str_fb_fixed_odds_type[i] || type == array_str_hb_fixed_odds_type[i] )
			return true;
	}
	return false;
}

function IsDuplicateBet(family, type, betline) {
	for (var i = 0; i < totalBetlines; i++) {
	    if (IsFixedOddsBetType(type) && betline == betlines[i].betline) {
	        if (!editInfo.isEditingLine(i))  //skip editing line
			    return true;
		}
	}
	return false;
}

function IsDuplicateBetAllUp(family, type, betline) {
	if (family == "FB") {
		for (var i = 0; i < totalBetlines; i++) {
			if (betlines[i].type.indexOf("ALUP") == 0) {
				var dummy = betlines[i].type.split("|");
				var isAllFixedOdds = true;
				for (var j = 1; j < dummy.length; j++) {
					if (!IsFixedOddsBetType(dummy[j])) {
						isAllFixedOdds = false;
						break;
					}
				}
				if (isAllFixedOdds && betline == betlines[i].betline) {
					return true;
				}
			}
		}
	}
	return false;
}

function AppendBetline(betInfo) {
	betlines[totalBetlines] = betInfo;
	totalBetlines++;
	multiSlipPanel.updatePanel();
}

function ContainsHRBetline() {
    for (var i = 0; i < totalBetlines; i++) {
        if (betlines[i].family == "HB") return true;
    }
    return false;
}

function CheckAndMarkDuplicateHRBetline() {
    var isDuplicated = false;
    for (var i = 0; i < totalBetlines; i++) {
        betlines[i].isDuplicated = false;
    }
    
    for (var i = 0; i < totalBetlines; i++) {                
        if (betlines[i].family == "HB") {
            for (var j = i + 1; j < totalBetlines; j++) {
                if (betlines[j].family == "HB") {
                    if (betlines[i].betline == betlines[j].betline) {
                        isDuplicated = true;
                        betlines[i].isDuplicated = true;
                        betlines[j].isDuplicated = true;
                    }
                }
            }
        }
    }
    return isDuplicated;
}

//** Adding SaveBetLine function--Sander Wong Oct 21 2011
//
function SaveBetline(betInfo, index) {
    betlines[index] = betInfo;
    multiSlipPanel.updatePanel();
}

function DeleteBetlineWithIndex(index, refreshBetTable) {
    
    for (var i = index; i < totalBetlines; i++) {
        if (i == totalBetlines - 1) {
            betlines[i] = null;
        }
        else {
            betlines[i] = betlines[i + 1];
        }
    }
    
    totalBetlines--;
    if ( getBetClickCount()==0 )
        slipClose();
	if ( refreshBetTable )
	    RedrawBetlineTable();
	
	multiSlipPanel.updatePanel();
}

function DeleteAllBetlines() {
	for (var i = 0; i < totalBetlines; i++)
		betlines[i].Clear();
	totalBetlines = 0;
	
	if (typeof(multiSlipPanel) != 'undefined')
		multiSlipPanel.updatePanel();
}

function DeleteAllAllUpBetlines() {
	for (var i = 0; i < totalAllUpBetlines; i++)
		allUpBetlines[i].Clear();
	totalAllUpBetlines = 0;
}

function ResetAllAllUpButtons() {
	for (var i = 0; i < totalBetlines; i++) {
		if (betlines[i].canFormAllUp == 0)
			betlines[i].enableAllUp = cAllUpNA;
		else
			betlines[i].enableAllUp = GetDynamicAllUpState(betlines[i].family, betlines[i].type, betlines[i].match);
	}
}

function AddAllUpBetline(index) {
	var indexFound = GetIndexOfBetlineCanGroup(index); // get index of betline can group
	if (indexFound < 0) {
		betlines[index].CopyTo(allUpBetlines[totalAllUpBetlines]);
		totalAllUpBetlines++;
	} else {
		allUpBetlines[indexFound].betline = GroupBetline(allUpBetlines[indexFound].type,
			allUpBetlines[indexFound].betline, betlines[index].betline);
		allUpBetlines[indexFound].description = GroupDescription(allUpBetlines[indexFound].type,
			allUpBetlines[indexFound].description, betlines[index].description);
		allUpBetlines[indexFound].numOfSelection = CalcSelections(allUpBetlines[indexFound].family,
			allUpBetlines[indexFound].type, allUpBetlines[indexFound].betline);
		if (betlines[index].unitBet > allUpBetlines[indexFound].unitBet)
			allUpBetlines[indexFound].unitBet = betlines[index].unitBet;
		if (betlines[index].isInPlay != allUpBetlines[indexFound].isInPlay)
			allUpBetlines[indexFound].isInPlay = betlines[index].isInPlay;
	}
}

function GetDispBetType(betType, match) {
    betType = betType.replace(/CHLO/g, 'CHLO_LONG'); //For log.aspx to use long wording for CHLO pool
	if (betType.indexOf("ALUP") < 0) {
		if (isBracketWin(betType)) {
			var dummy = match.split(" ");
			var race_no = dummy[dummy.length - 1];
			return GetText(betType) + "(" + GetBWinCodeName(dummy[0], race_no, betType, GetLanguage()) + ")";
		}
		return GetText(betType);
	}

	var isXPool = false;
	var last_type = "";
	var dummy = betType.split("|");
	var dummy2 = match.split("|");
	var isAllUpBracketWin = true;
	var sub_types = "";
	for (var i = 1; i < dummy.length; i++) {
		if (i == 1) {
			last_type = dummy[i];
		} else if (last_type != dummy[i]) {
			isXPool = true;
		}
		if (isBracketWin(dummy[i])) {
			var dummy3 = dummy2[i].split(" ");
			var race_no = dummy3[dummy3.length - 1];
			sub_types += "<BR>" + GetText(dummy[i]) + "(" + GetBWinCodeName(dunny3[0], race_no, dummy[i], GetLanguage()) + ")";
		} else {
			isAllUpBracketWin = false;
			sub_types += "<BR>" + GetText(dummy[i]);
		}
	}

	if (!isXPool) {
		if (GetLanguage() == cLangENG) {
			if (isAllUpBracketWin)
				return (GetText("txt_ALUP") + " " + GetText("BW") + " " + dummy[0].substring(5) + sub_types);
			return (GetText("txt_ALUP") + " " + GetText(dummy[1]) + " " + dummy[0].substring(5));
		} else {
			if (isAllUpBracketWin)
				return (GetText("BW") + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
			return (GetText(dummy[1]) + GetText("txt_ALUP") + " " + dummy[0].substring(5));
		}
	}
	if (GetLanguage() == cLangENG) {
		if (isAllUpBracketWin)
			return (GetText("txt_ALUP") + " " + GetText("BW") + " " + dummy[0].substring(5) + sub_types);
		return (GetText("txt_cross_pool") + " " + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
	}
	if (isAllUpBracketWin)
		return (GetText("BW") + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
	return (GetText("txt_cross_pool") + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
}

function GetTextWithChecking(str) {
	if (str == null || str == undefined)
		return "";
	return str;
}

//if (isRandGen == null || isRandGen == undefined || isRandGen == '')
function GetNumberWithChecking(str) {
	try {
		if (!isNaN(parseInt(str)))
			return parseInt(str);
	} catch (e) {
	}
	return 0;
}

function ParseBetType(betline, family) {
	var retBetType = null;
	switch (family) {
		case "MK6" :
			retBetType = "MK6";
			break;
		case "HB" :
			var dummy = betline.split(" ");
			if (dummy[2] != "ALUP") {
				retBetType = dummy[2];
			} else {				
				var dummy2 = betline.split("/");
				var dummy3 = dummy2[0].split(" ");
				var retBetType = "ALUP " + dummy3[3];
				for (var i = 1; i < dummy2.length; i++) {
					dummy3 = dummy2[i].split(" ");
					retBetType += "|" + dummy3[0];
				}
			}
			break;
		case "FB" :
			var dummy = betline.split(" ");
			if (dummy[1] != "ALUP") {
				retBetType = ParseSpecialBetTypeFB(dummy[1]);
			} else {
				var dummy2 = betline.split("/");
				var dummy3 = dummy2[0].split(" ");
				var retBetType = "ALUP " + dummy3[2];
				for (var i = 1; i < dummy2.length; i++) {
					var sub1 = dummy2[i];
					for (var j = i + 1; j < dummy2.length; j++) {
						var ch = dummy2[j].substring(0, 1);
						if (!isNaN(ch) || ch == "-" || ch == "+") {
							sub1 += "/" + dummy2[j];
						} else {
							break;
						}
					}
					i = j - 1;
					dummy3 = sub1.split(" ");
					retBetType += "|" + ParseSpecialBetTypeFB(dummy3[0]);
				}
			}
			break;
	} // switch (family)
	return retBetType;
} // ParseBetType

function ParseSpecialBetTypeFB(betType) {
	var map1 = new Array("CHPP", "TOFP", "CHP", "HFMP6", "HFMP8", "HFMP", "HAFU", "ADTP", "GPF", "SPC", "TPS", "GPW", "STB", "OOU");
	var map2 = new Array("TOFP", "TOFP", "CHP", "HFMP6", "HFMP8", "HFMP", "HFT",  "ADTP", "GPF", "SPC", "TPS", "GPW", "STB", "HILO");
	for (var i = 0; i < map1.length; i++) {
		if (betType.indexOf(map1[i]) == 0)
			return map2[i];
	}
	return betType;
}

function ParseMatchNumber(betline, family, betType) {
	var retMatchNum;
	var dummy1, dummy2, dummy3;
	switch(family) {
		case "MK6" :
			retMatchNum = "MK6";
			break;

		case "HB" :
			dummy1 = betline.split(" ");
			if (dummy1[2] != "ALUP") {
				if (dummy1[2] == "JKC") {
					retMatchNum = dummy1[0] + " " + dummy1[1];
					break;
				}
				else if (dummy1[2] == "TCE" || dummy1[2] == "QTT")
					dummy2 = dummy1[4].split("*");
				else
					dummy2 = dummy1[3].split("*");
				retMatchNum = dummy1[0] + " " + dummy1[1] + " " + dummy2[0];
			} else {
				dummy2 = betline.split("/");
				dummy3 = dummy2[0].split(" ");
				retMatchNum = "ALUP " + dummy3[3];
				for (var i = 1; i < dummy2.length; i++) {
					var dummy4 = dummy2[i].split("*");
					var dummy5 = dummy4[0].split(" ");
					retMatchNum += "|" + dummy3[0] + " " + dummy3[1] + " " + dummy5[1];
				}
			}
			break;
		case "FB" :
			if (betType.indexOf("ALUP") == 0) {
				dummy1 = betline.split("/");
  				dummy2 = dummy1[0].split(" ");
  				retMatchNum = "ALUP " + dummy2[2];
  				for (var i = 1; i < dummy1.length; i++) {
  					var sub1 = dummy1[i];
  					for (var j = i + 1; j < dummy1.length; j++) {
  						var ch = dummy1[j].substring(0, 1);
  						if (!isNaN(ch) || ch == "-" || ch == "+") {
  							sub1 += "/" + dummy1[j];
  						} else {
  							break;
  						}
  					}
  					i = j - 1;
  					dummy2 = sub1.split("*");
  					dummy3 = dummy2[0].split(" ");
  					retMatchNum += "|FB " + dummy3[1] + " " + dummy3[2];
  				 }
			} else {
				dummy1 = betline.split(" ");
				switch(betType) {
					case "CHP" :
					case "CHPP" :
					case "TOFP" :
					case "TPS" :
					case "ADTP" :
						retMatchNum = dummy1[0]	+ " " + dummy1[1] + " " + dummy1[2].split("*")[0];
						break;
					case "GPF" :
					case "GPW" :
						retMatchNum = dummy1[0]	+ " " + dummy1[1] + " " + dummy1[2]	+ " " + dummy1[3].split("*")[0];
						break;
					case "SPC" :
						if (dummy1[1].length > 3) {
							retMatchNum = dummy1[0]	+ " " + dummy1[1] + " " + dummy1[2]	+ " " + dummy1[3].split("*")[0];
						} else {
							retMatchNum = dummy1[0]	+ " " + dummy1[1] + " " + dummy1[2]	+ " " + dummy1[3] + " " + dummy1[4].split("*")[0];
						}
						break;
					default :
						retMatchNum = dummy1[0]	+ " " + dummy1[2] + " " + dummy1[3].split("*")[0];				
				} // switch(betType)
			}
			break;

	} // switch (family)
	return retMatchNum;
} // ParseMatchNumber

function recalc_hr_bets() {
	var int_num_of_bet = 1;
	for (var i = 0; i < totalBetlines; i++) {
		if (betlines[i].family == "HB")
			betlines[i].numOfSelection = CalcSelections(betlines[i].family, betlines[i].type, betlines[i].betline);
	}
}

function isAllUpWithSingleBetType(betType, subType) {
	if (betType.indexOf("ALUP") == 0) {
		var dummy = betType.split("|");
		for (var i = 1; i < dummy.length; i++) {
			if (dummy[i] != subType)
				return false;
		}
		return true;
	}
	return false;
}

var isValidUnitBet = false;
function CheckUnitBet(index) {
  inValidUnitBet = false;
  inobj = $j('#inputAmount' + index)[0];
  
	if (index < 0)
		return;

	if (inobj.value == "" || inobj.value == undefined || isNaN(inobj.value) || parseFloat(inobj.value) <= 0 ) {
		ShowError(2, GetError("1206"), true, 60000);
		inobj.value = betlines[index].unitBet;
		focusField(inobj);
		return false;
	}

	var unitBet = Math.round(parseFloat(inobj.value));
  var invalid = false;

    if ( betlines[index].family == 'HB' ) {
      if ( betlines[index].type.indexOf('ALUP') >= 0 ) {
        if (IsLessThanPSMinAmt( unitBet, psHBArray, 'ALUPX') )
          invalid = true;
      }
      else if (betlines[index].type=='JKC') {
      if (IsLessThanPSMinAmt(unitBet * betlines[index].numOfSelection, psHBArray, 'JKC'))
          invalid = true;
      }
      else if ( IsLessThanPSMinAmt( unitBet, psHBArray, betlines[index].type) )
        invalid = true;
    }
    else {
      if (betlines[index].type.indexOf('ALUP') >= 0) {
        if (IsLessThanPSMinAmt(unitBet, psSBArray, 'ALUPX') && IsLessThanPSMinAmt(unitBet * betlines[index].numOfSelection, psSBArray, 'ALUPX')) {
          invalid = true;
        }
      }
      else {
        switch (betlines[index].type) {
          case "DHCP":
          case "HFMP6":
          case "HFMP8":
          case "HFMP":
            if (IsLessThanPSMinAmt(unitBet, psSBArray, betlines[index].type) && (unitBet * betlines[index].numOfSelection) < 100) {
              invalid = true;
            }
            break;
          default:
            if (unitBet < 10 || IsLessThanPSMinAmt(unitBet * betlines[index].numOfSelection, psSBArray, betlines[index].type)) {
              invalid = true;
            }
        } // switch
      }
    }
	
  if ( !betlines[index].isFlexiBet() && unitBet > MyParseInt(GetPara("MaxBetUnit"), 50000))
		invalid = true;

  if (invalid) {
    inValidUnitBet = invalid;
		ShowError(2, GetError("1206"), true, 60000);
		inobj.value = betlines[index].unitBet;
		focusField(inobj);
		return false;
	}
		
	betlines[index].unitBet = unitBet;
	inobj.value = betlines[index].unitBet;
	HideAllError();
	return true;
}

function IsLessThanPSMinAmt(val, psArray, type) {
  if (psArray[type] != undefined && psArray[type].minAmt != undefined) {
    try {
      return val < psArray[type].minAmt;
    } catch (ex) {
      //do nothing
    }
  }

  return false;
}

function CheckAlupBoxUnitBet(inobj) {
	var val = inobj.value.replace('$', '');
	if (val == "" || val <= 0 || isNaN(val) || val > MyParseInt(GetPara("MaxBetUnit"), 50000)) {
	    ShowError(2, GetError("1206"), true, 60000);
	    inobj.value = '$' + GetSetting("UnitBet", "ALUPX", allUpBetlines[0].family);
	    focusField(inobj);
	    return false;
	}
	else if (val < MyParseInt(GetSetting("UnitBet", "ALUPX", allUpBetlines[0].family))) {
	    inobj.value = '$' + GetSetting("UnitBet", "ALUPX", allUpBetlines[0].family);
	}
	else {
	    inobj.value = Math.round(parseFloat(val));
	}
}

function getBetClickCount() {
  var cnt = 0;

  for (var i = 0; i < totalBetlines; i++) {
      if (betlines[i].descOpen)
        cnt++;
}

  return cnt;
}

function createBetObjectString() {
  var buf = new StringBuffer();
  for (var i = 0; i < totalBetlines; i++) {
    buf.append('|||');
    buf.append(JSON.stringify(betlines[i], null));
  }
  return buf.toString();
}

function format()
{
	var ret = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var s = "return ret.replace(/\\{" + (i-1) + "\\}/ig, val)";
		var func = new Function("ret", "val", s);
		ret = func(ret, arguments[i]);
	}
	return ret;
}

//	Multiple Panel support, Rivers Zhao, 2010-07-21
//	Design: Needn't modify old logic flow, just suitably change current active betlines variable and it's pointer.
//	Global var: betlines, totalBetlines
var tmpAllUpValue = '';
function MultiSlipPanel(panels) { this.init(panels); return this; }
MultiSlipPanel.prototype =
{
  panelList: null
	, slipList: new Array()
	, activeSlip: 0
	, init: function(panelList) {
	  this.panelList = panelList;
	  this.activeSlip = 0;
	  for (var i = 0; i < panelList.length; i++) {
	    this.slipList[i] = {
	      betlines: this.buildBetlines(),
	      totalBetlines: 0,
	      allUpBetlines: this.buildBetlines(),
	      totalAllUpBetlines: 0,
	      sel_formula: -1,
	      inputAllUp: "",
	      tmpAllUpValue: ""
	    };
	    var panellbl = String.fromCharCode("A".charCodeAt(0) + i);
	    var betcount = this.slipList[i].totalBetlines;
	    var title = betcount > 0 ? format("{0}({1})", panellbl, betcount) : panellbl; // uncomment to add unit text: var title = format("{0}({1}){2}", String.fromCharCode("A".charCodeAt(0) + i), this.slipList[i].totalBetlines, GetText("txt_bets"));
	    var curPanel = panelList[i];
	    curPanel.innerHTML = title;
	    curPanel["Self"] = this;
	    curPanel["PanelId"] = i;
	    curPanel.onclick = this.updatePanel;
	    curPanel.className = (i == this.activeSlip) ? "activePanel" : "inactivePanel";
	  }
	}
	, sel_formula: null
	, inputAllUp: null
	, updatePanel: function() {
	  var self = this["Self"] || this;
	  var pslip = typeof (this.activeSlip) == "number" ? this.activeSlip : parseInt(this["PanelId"]);
	  var isChangedPanel = typeof this.PanelId != 'undefined' && this.PanelId != self.activeSlip;
	  if (!self.sel_formula || !self.inputAllUp) {
	    self.sel_formula = $$("frame:sel_formula");
	    self.inputAllUp = $$("frame:inputAllUp");
	  }

	  self.slipList[self.activeSlip] = {
	    betlines: betlines,
	    totalBetlines: totalBetlines,
	    allUpBetlines: allUpBetlines,
	    totalAllUpBetlines: totalAllUpBetlines,
	    sel_formula: self.sel_formula.firstElement().selectedIndex,
	    inputAllUp: self.inputAllUp.value(),
	    tmpAllUpValue: tmpAllUpValue
	  };
	  betlines = self.slipList[pslip].betlines;
	  totalBetlines = self.slipList[pslip].totalBetlines;
	  allUpBetlines = self.slipList[pslip].allUpBetlines;
	  totalAllUpBetlines = self.slipList[pslip].totalAllUpBetlines;
	  tmpAllUpValue = self.slipList[pslip].tmpAllUpValue;
	  self.activeSlip = pslip;

	  for (var i = 0; i < self.panelList.length; i++) {
	    var panellbl = String.fromCharCode("A".charCodeAt(0) + i);
	    var betcount = self.slipList[i].totalBetlines;
	    var title = betcount > 0 ? format("{0}({1})", panellbl, betcount) : panellbl; // uncomment to add unit text: var title = format("{0}({1}){2}", String.fromCharCode("A".charCodeAt(0) + i), self.slipList[i].totalBetlines, GetText("txt_bets"));
	    var curPanel = self.panelList[i];
	    curPanel.innerHTML = title;
	    curPanel.className = (i == self.activeSlip) ? "activePanel" : "inactivePanel";
	  }

	  if (isChangedPanel && !isSlipOpen) {
	    for (var i = 0; i < totalBetlines; i++) {
	      betlines[i].descOpen = false;
	      betlines[i].betTitle = GetText('alt_details');
	    }
	    // slipClose(true);
	  }

	  RedrawBetlineTable();
	  DrawAddAllUpButton(true);
	  LoadAllUpFormula();
	  if (self.sel_formula.display() && self.inputAllUp.display()) {
	    self.sel_formula.firstElement().selectedIndex = self.slipList[pslip].sel_formula;
	    self.inputAllUp.value(self.slipList[pslip].inputAllUp);
	  }

	  // todo: tab style control.
	}
	, resetPanel: function() {
	  var self = this["Self"] || this;
	  self.init(self.panelList);
	}
	, buildBetlines: function() {
	  var blines = new Array(cMaxBetlines);
	  for (var i = 0; i < blines.length; i++) {
	    blines[i] = new BetlineInfo();
	  }
	  return blines;
	}
	, getTotalCount: function() {
	  var count = 0;
	  for (var i = 0; i < this.slipList.length; i++) {
	    count += this.slipList[i].totalBetlines;
	  }
	  return count;
	}
}