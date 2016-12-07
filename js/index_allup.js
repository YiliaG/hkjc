var array_allup_formula = new Array();

// ********************** 2 x N ************************
array_allup_formula['2x1']	 = "1+2" ;
//array_allup_formula['2x2']	 = "1,2" ;
array_allup_formula['2x3']	 = array_allup_formula['2x1']  + "," + "1,2" ;

// ********************** 3 x N ************************
array_allup_formula['3x1']	 = "1+2+3" ;
array_allup_formula['3x3']	 = "1+2,1+3,2+3" ;
array_allup_formula['3x4']	 = array_allup_formula['3x1'] + "," + array_allup_formula['3x3'] ;
array_allup_formula['3x6']	 = array_allup_formula['3x3'] + "," + "1,2,3" ;
array_allup_formula['3x7']	 = array_allup_formula['3x1'] + "," + array_allup_formula['3x6'] ;

// ********************** 4 x N ************************
array_allup_formula['4x1']	 = "1+2+3+4" ;
array_allup_formula['4x4']	 = "1+2+3,1+2+4,1+3+4,2+3+4" ;
array_allup_formula['4x5']	 = array_allup_formula['4x1'] + "," + array_allup_formula['4x4'] ;
array_allup_formula['4x6']	 = "1+2,1+3,1+4,2+3,2+4,3+4" ;
array_allup_formula['4x10']  = array_allup_formula['4x6'] + "," + "1,2,3,4" ;
array_allup_formula['4x11']  = array_allup_formula['4x5'] + "," + array_allup_formula['4x6'] ;
array_allup_formula['4x14']  = array_allup_formula['4x4'] + "," + array_allup_formula['4x10'] ;
array_allup_formula['4x15']  = array_allup_formula['4x1'] + "," + array_allup_formula['4x14'] ;

// ********************** 5 x N ************************
var str_5_5_1	=  "1,2,3,4,5" ;
var str_5_10_3  = "1+2+3,1+2+4,1+2+5,1+3+4,1+3+5,1+4+5,2+3+4,2+3+5,2+4+5,3+4+5" ;

array_allup_formula['5x1']	 = "1+2+3+4+5" ;
array_allup_formula['5x5']	 = "1+2+3+4,1+2+3+5,1+3+4+5,1+2+4+5,2+3+4+5" ;
array_allup_formula['5x6']	 = array_allup_formula['5x1'] + "," + array_allup_formula['5x5'] ;
array_allup_formula['5x10']	 = "1+2,1+3,1+4,1+5,2+3,2+4,2+5,3+4,3+5,4+5" ;
array_allup_formula['5x15']  = array_allup_formula['5x10'] + "," + str_5_5_1 ;
array_allup_formula['5x16']  = array_allup_formula['5x6'] + "," + str_5_10_3 ;
array_allup_formula['5x20']  = str_5_10_3 + "," + array_allup_formula['5x10'] ;
array_allup_formula['5x25']  = array_allup_formula['5x20'] + "," + str_5_5_1 ;
array_allup_formula['5x26']  = array_allup_formula['5x6'] + "," + array_allup_formula['5x20'] ;
array_allup_formula['5x30']  = array_allup_formula['5x5'] + "," + array_allup_formula['5x25'] ;
array_allup_formula['5x31']  = array_allup_formula['5x1'] + "," + array_allup_formula['5x30'] ;


// ********************** 6 x N ************************
var str_6_15_4 = "1+2+3+4,1+2+3+5,1+2+3+6,1+2+4+5,1+2+4+6," ;
	str_6_15_4 += "1+2+5+6,1+3+4+5,1+3+4+6,1+3+5+6,1+4+5+6," ;
	str_6_15_4 += "2+3+4+5,2+3+4+6,2+3+5+6,2+4+5+6,3+4+5+6"  ;

array_allup_formula['6x1']	 = "1+2+3+4+5+6" ;
array_allup_formula['6x6']	 = "1+2+3+4+5,1+2+3+4+6,1+2+3+5+6,1+2+4+5+6,1+3+4+5+6,2+3+4+5+6" ;
array_allup_formula['6x7']	 = array_allup_formula['6x1'] + "," + array_allup_formula['6x6'] ;

array_allup_formula['6x15']	 = "1+2,1+3,1+4,1+5,1+6," ;
array_allup_formula['6x15']	+= "2+3,2+4,2+5,2+6,3+4," ;
array_allup_formula['6x15']	+= "3+5,3+6,4+5,4+6,5+6" ;

array_allup_formula['6x20']  = "1+2+3,1+2+4,1+2+5,1+2+6,1+3+4," ;
array_allup_formula['6x20'] += "1+3+5,1+3+6,1+4+5,1+4+6,1+5+6," ;
array_allup_formula['6x20'] += "2+3+4,2+3+5,2+3+6,2+4+5,2+4+6," ;
array_allup_formula['6x20'] += "2+5+6,3+4+5,3+4+6,3+5+6,4+5+6" ;

array_allup_formula['6x21']  = array_allup_formula['6x15'] + "," + "1,2,3,4,5,6" ;
array_allup_formula['6x22']  = array_allup_formula['6x7'] + "," + str_6_15_4 ;
array_allup_formula['6x35']  = array_allup_formula['6x20'] + "," + array_allup_formula['6x15'] ;
array_allup_formula['6x41']  = array_allup_formula['6x20'] + "," + array_allup_formula['6x21'] ;
array_allup_formula['6x42'] = array_allup_formula['6x22'] + "," + array_allup_formula['6x20'] ;

array_allup_formula['6x50'] = str_6_15_4 + "," + array_allup_formula['6x35'] ;
array_allup_formula['6x56'] = str_6_15_4 + "," + array_allup_formula['6x41'] ;
array_allup_formula['6x57'] = array_allup_formula['6x7'] + "," + array_allup_formula['6x50'] ;
array_allup_formula['6x62'] = array_allup_formula['6x6'] + "," + array_allup_formula['6x56'] ;
array_allup_formula['6x63'] = array_allup_formula['6x7'] + "," + array_allup_formula['6x56'] ;

// ********************** 7 x N ************************

var str_7_21_5	 = "1+2+3+4+5,1+2+3+4+6,1+2+3+4+7," ;
	str_7_21_5	+= "1+2+3+5+6,1+2+3+5+7,1+2+3+6+7," ;
	str_7_21_5	+= "1+2+4+5+6,1+2+4+5+7,1+2+4+6+7," ;
	str_7_21_5	+= "1+2+5+6+7,1+3+4+5+6,1+3+4+5+7," ;
	str_7_21_5	+= "1+3+5+6+7,1+4+5+6+7,1+3+4+6+7," ;
	str_7_21_5	+= "2+3+4+5+6,2+3+4+5+7,2+3+4+6+7," ;
	str_7_21_5	+= "2+3+5+6+7,2+4+5+6+7,3+4+5+6+7"  ;

var str_7_35_4	= "1+2+3+4,1+2+3+5,1+2+3+6,1+2+3+7,1+2+4+5," ;
	str_7_35_4 += "1+2+4+6,1+2+4+7,1+2+5+6,1+2+5+7,1+2+6+7," ;
	str_7_35_4 += "1+3+4+5,1+3+4+6,1+3+4+7,1+3+5+6,1+3+5+7," ;
	str_7_35_4 += "1+3+6+7,1+4+5+6,1+4+5+7,1+4+6+7,1+5+6+7," ;
	str_7_35_4 += "2+3+4+5,2+3+4+6,2+3+4+7,2+3+5+6,2+3+5+7," ;
	str_7_35_4 += "2+3+6+7,2+4+5+6,2+4+5+7,2+4+6+7,2+5+6+7," ;
	str_7_35_4 += "3+4+5+6,3+4+5+7,3+4+6+7,3+5+6+7,4+5+6+7" ;
	
var str_7_35_3	= "1+2+3,1+2+4,1+2+5,1+2+6,1+2+7," ;
	str_7_35_3 += "1+3+4,1+3+5,1+3+6,1+3+7,1+4+5," ;
	str_7_35_3 += "1+4+6,1+4+7,1+5+6,1+5+7,1+6+7," ;
	str_7_35_3 += "2+3+4,2+3+5,2+3+6,2+3+7,2+4+5," ;
	str_7_35_3 += "2+4+6,2+4+7,2+5+6,2+5+7,2+6+7," ;
	str_7_35_3 += "3+4+5,3+4+6,3+4+7,3+5+6,3+5+7," ;
	str_7_35_3 += "3+6+7,4+5+6,4+5+7,4+6+7,5+6+7" ; 

var str_7_21_2	= "1+2,1+3,1+4,1+5,1+6,1+7,2+3,2+4,2+5,2+6,2+7,3+4,3+5,3+6,3+7,4+5,4+6,4+7,5+6,5+7,6+7" ;

var str_7_7_1	= "1,2,3,4,5,6,7" ;	

array_allup_formula['7x1']	 = "1+2+3+4+5+6+7" ;

array_allup_formula['7x7']	 = "1+2+3+4+5+6,1+2+3+4+5+7,1+2+3+4+6+7,1+2+3+5+6+7,1+2+4+5+6+7,1+3+4+5+6+7,2+3+4+5+6+7" ;

array_allup_formula['7x8']	 = array_allup_formula['7x1'] + "," + array_allup_formula['7x7'] ;

array_allup_formula['7x21']  = str_7_21_5 ;

array_allup_formula['7x35']  = str_7_35_4 ;

array_allup_formula['7x120']  = array_allup_formula['7x8'] + "," + str_7_21_5 + "," + str_7_35_4 + "," 
array_allup_formula['7x120'] += str_7_35_3 + "," + str_7_21_2 ;

array_allup_formula['7x127'] = array_allup_formula['7x120'] + "," + str_7_7_1 ;



// ********************** 8 x N ************************

var str_8_1_8 = "1+2+3+4+5+6+7+8" ;

var str_8_8_7  = "1+2+3+4+5+6+7,1+2+3+4+5+6+8,1+2+3+4+5+7+8,1+2+3+4+6+7+8,1+2+3+5+6+7+8," ;
	str_8_8_7 += "1+2+4+5+6+7+8,1+3+4+5+6+7+8,2+3+4+5+6+7+8" ;

var str_8_28_6  = "1+2+3+4+5+6,1+2+3+4+5+7,1+2+3+4+5+8,1+2+3+4+6+7,1+2+3+4+6+8," ;
	str_8_28_6 += "1+2+3+4+7+8,1+2+3+5+6+7,1+2+3+5+6+8,1+2+3+5+7+8,1+2+3+6+7+8," ;
	str_8_28_6 += "1+2+4+5+6+7,1+2+4+5+6+8,1+2+4+5+7+8,1+2+4+6+7+8,1+2+5+6+7+8," ;
	str_8_28_6 += "1+3+4+5+6+7,1+3+4+5+6+8,1+3+4+5+7+8,1+3+4+6+7+8,1+3+5+6+7+8," ;
	str_8_28_6 += "1+4+5+6+7+8,2+3+4+5+6+7,2+3+4+5+6+8,2+3+4+5+7+8,2+3+4+6+7+8," ;
	str_8_28_6 += "2+3+5+6+7+8,2+4+5+6+7+8,3+4+5+6+7+8";

var str_8_56_5  = "1+2+3+4+5,1+2+3+4+6,1+2+3+4+7,1+2+3+4+8,1+2+3+5+6," ;
	str_8_56_5 += "1+2+3+5+7,1+2+3+5+8,1+2+3+6+7,1+2+3+6+8,1+2+3+7+8," ;
	str_8_56_5 += "1+2+4+5+6,1+2+4+5+7,1+2+4+5+8,1+2+4+6+7,1+2+4+6+8," ;
	str_8_56_5 += "1+2+4+7+8,1+2+5+6+7,1+2+5+6+8,1+2+5+7+8,1+2+6+7+8," ;
	str_8_56_5 += "1+3+4+5+6,1+3+4+5+7,1+3+4+5+8,1+3+4+6+7,1+3+4+6+8," ;
	str_8_56_5 += "1+3+4+7+8,1+3+5+6+7,1+3+5+6+8,1+3+5+7+8,1+3+6+7+8," ;
	str_8_56_5 += "1+4+5+6+7,1+4+5+6+8,1+4+5+7+8,1+4+6+7+8,1+5+6+7+8," ;
	str_8_56_5 += "2+3+4+5+6,2+3+4+5+7,2+3+4+5+8,2+3+4+6+7,2+3+4+6+8," ;
	str_8_56_5 += "2+3+4+7+8,2+3+5+6+7,2+3+5+6+8,2+3+5+7+8,2+3+6+7+8," ;
	str_8_56_5 += "2+4+5+6+7,2+4+5+6+8,2+4+5+7+8,2+4+6+7+8,2+5+6+7+8," ;
	str_8_56_5 += "3+4+5+6+7,3+4+5+6+8,3+4+5+7+8,3+4+6+7+8,3+5+6+7+8," ;
	str_8_56_5 += "4+5+6+7+8" ;

var str_8_70_4  = "1+2+3+4,1+2+3+5,1+2+3+6,1+2+3+7,1+2+3+8," ;
	str_8_70_4 += "1+2+4+5,1+2+4+6,1+2+4+7,1+2+4+8,1+2+5+6," ;
	str_8_70_4 += "1+2+5+7,1+2+5+8,1+2+6+7,1+2+6+8,1+2+7+8," ;
	str_8_70_4 += "1+3+4+5,1+3+4+6,1+3+4+7,1+3+4+8,1+3+5+6," ;
	str_8_70_4 += "1+3+5+7,1+3+5+8,1+3+6+7,1+3+6+8,1+3+7+8," ;
	str_8_70_4 += "1+4+5+6,1+4+5+7,1+4+5+8,1+4+6+7,1+4+6+8," ;
	str_8_70_4 += "1+4+7+8,1+5+6+7,1+5+6+8,1+5+7+8,1+6+7+8," ;
	str_8_70_4 += "2+3+4+5,2+3+4+6,2+3+4+7,2+3+4+8,2+3+5+6," ;
	str_8_70_4 += "2+3+5+7,2+3+5+8,2+3+6+7,2+3+6+8,2+3+7+8," ;
	str_8_70_4 += "2+4+5+6,2+4+5+7,2+4+5+8,2+4+6+7,2+4+6+8," ;
	str_8_70_4 += "2+4+7+8,2+5+6+7,2+5+6+8,2+5+7+8,2+6+7+8," ;
	str_8_70_4 += "3+4+5+6,3+4+5+7,3+4+5+8,3+4+6+7,3+4+6+8," ;
	str_8_70_4 += "3+4+7+8,3+5+6+7,3+5+6+8,3+5+7+8,3+6+7+8," ;
	str_8_70_4 += "4+5+6+7,4+5+6+8,4+5+7+8,4+6+7+8,5+6+7+8" ;

var str_8_56_3  = "1+2+3,1+2+4,1+2+5,1+2+6,1+2+7," ;
	str_8_56_3 += "1+2+8,1+3+4,1+3+5,1+3+6,1+3+7," ;
	str_8_56_3 += "1+3+8,1+4+5,1+4+6,1+4+7,1+4+8," ;
	str_8_56_3 += "1+5+6,1+5+7,1+5+8,1+6+7,1+6+8," ;
	str_8_56_3 += "1+7+8,2+3+4,2+3+5,2+3+6,2+3+7," ;
	str_8_56_3 += "2+3+8,2+4+5,2+4+6,2+4+7,2+4+8," ;
	str_8_56_3 += "2+5+6,2+5+7,2+5+8,2+6+7,2+6+8," ;
	str_8_56_3 += "2+7+8,3+4+5,3+4+6,3+4+7,3+4+8," ;
	str_8_56_3 += "3+5+6,3+5+7,3+5+8,3+6+7,3+6+8," ;
	str_8_56_3 += "3+7+8,4+5+6,4+5+7,4+5+8,4+6+7," ;
	str_8_56_3 += "4+6+8,4+7+8,5+6+7,5+6+8,5+7+8," ;
	str_8_56_3 += "6+7+8" ;
	
var str_8_28_2  = "1+2,1+3,1+4,1+5,1+6," ;
	str_8_28_2 += "1+7,1+8,2+3,2+4,2+5," ;
	str_8_28_2 += "2+6,2+7,2+8,3+4,3+5," ;
	str_8_28_2 += "3+6,3+7,3+8,4+5,4+6," ;
	str_8_28_2 += "4+7,4+8,5+6,5+7,5+8," ;
	str_8_28_2 += "6+7,6+8,7+8" ;

var str_8_8_1 = "1,2,3,4,5,6,7,8" ;

array_allup_formula['8x1']	  = str_8_1_8 ;

array_allup_formula['8x8']	  = str_8_8_7 ;

array_allup_formula['8x9']	  = array_allup_formula['8x1'] + "," + array_allup_formula['8x8'] ;

array_allup_formula['8x28']	  = str_8_28_6 ;

array_allup_formula['8x56']	  = str_8_56_5 ;

array_allup_formula['8x70']	  = str_8_70_4 ;

array_allup_formula['8x247']  = array_allup_formula['8x9'] + "," + str_8_28_6 + "," ;
array_allup_formula['8x247'] +=  str_8_56_5 + "," + str_8_70_4 + "," + str_8_56_3 + "," + str_8_28_2 ;

array_allup_formula['8x255']  = array_allup_formula['8x247'] + "," + str_8_8_1 ;

// *************************************************
function CalcAllUpCombination() {
	var totalbetnum = 1;
	var temp_allup_string  = sel_formula.options[sel_formula.selectedIndex].text;
	var tmp_allup_array_string = array_allup_formula[temp_allup_string];
	if (tmp_allup_array_string != undefined && tmp_allup_array_string != "") {
		var array_allup_string = tmp_allup_array_string.split(",");
		var int_total_bet_num = 0 ;
		for (var i = 0; i < array_allup_string.length; i++) {
			if (array_allup_string[i].indexOf("+") > 0) {
				var int_total_bet_temp = 1;
				var array_temp = array_allup_string[i].split("+");
				for (var j = 0; j < array_temp.length; j++) {
					int_total_bet_temp *= parseInt(allUpBetlines[parseInt(array_temp[j]) - 1].numOfSelection);
				}
				int_total_bet_num += int_total_bet_temp;
			} else if (array_allup_string[i] != "") {
				int_total_bet_num += parseInt(allUpBetlines[parseInt(array_allup_string[i]) - 1].numOfSelection);
			}
		}
		totalbetnum = int_total_bet_num;
	}
	return totalbetnum;
}

function GetAllUpEnableStateWithBetType(betType) {
	switch(betType) {
		case "HAD" : 
		case "HDC" :
		case "TTG" :
		case "CRS":
		case "FCRS":
		case "HFT" :
		case "OOE" :
		case "HILO" :
		case "FGS" :
		case "HHAD" :
		case "GPF" :
		case "GPW" :
		case "FHAD":
		case "FTS":
		case "FHLO":
		case "NTS":
		case "CHLO":
		  if (GetFBPara("Alup" + betType) == 1) {
		    return cAllUpEnabled;
		  }
		  break;
		case "WIN" :
		case "PLA" :
		case "W-P" :
		case "QIN" :
		case "QPL" :
		case "QQP" :
		case "CWA" :
		case "CWB" :
		case "CWC" :
		case "TRI" :
		case "BWA" :
		case "BWB" :
		case "BWC" :
		case "BWD" :
			return cAllUpEnabled;
	}
	return cAllUpNA;
}

function GetXPoolAllUpEnabled(betType) {
	if (GetFBPara(betType) == "1" && GetFBPara("CrossPool" + betType) == "1" && GetFBPara("CrossPoolBet") == "1") {
		return true;
	} else if (GetPara(betType) == "1" && GetPara("CrossPool" + betType) == "1" && GetPara("HorseRaceCrossPool") == "1") {
		return true;
	} else if (isBracketWin(betType)) {
		if (GetPara("CrossPoolBW") == "1")
			return true;
	}
	return false;
}

function GetAllUpEnableStateForXPool(betType, match) {
	switch(betType) {
		case "HAD" :
		case "HDC" :
		case "TTG" :
		case "CRS":
		case "FCRS":
		case "HFT" :
		case "OOE" :
		case "HILO" :
		case "FGS" :
		case "HHAD" :
		case "FHAD":
		case "FTS":
		case "FHLO":
		case "NTS":
		case "CHLO":
			for (var i = 0; i < totalAllUpBetlines; i++) {
				if (match == allUpBetlines[i].match && betType != allUpBetlines[i].type) {
					return cAllUpDisabled;
				}
			}
			return cAllUpEnabled;

		case "WIN" :
		case "PLA" :
		case "W-P" :
		case "QIN" :
		case "QPL" :
		case "QQP" :
		case "CWA" :
		case "CWB" :
		case "CWC" :
		case "TRI" :
		case "BWA" :
		case "BWB" :
		case "BWC" :
		case "BWD" :
			for (var i = 0; i < totalAllUpBetlines; i++) {
			    if (match == allUpBetlines[i].match ||
				    match.substring(0, 2) != allUpBetlines[i].match.substring(0, 2)) {
					return cAllUpDisabled;
				}
			}
			return cAllUpEnabled;
	}
	return cAllUpDisabled;
}

function GetAllUpEnableStateForSamePool(betType, match) {
	switch(betType) {
		case "HAD" :
		case "HDC" :
		case "TTG" :
		case "CRS":
		case "FCRS":
		case "HFT" :
		case "OOE" :
		case "HILO" :
		case "FGS" :
		case "HHAD" :
		case "FHAD" :
		case "FTS":
		case "FHLO":
		case "NTS":
		case "CHLO":
		    return cAllUpEnabled;
		case "WIN" :
		case "PLA" :
		case "W-P" :
		case "QIN" :
		case "QPL" :
		case "QQP" :
		case "TRI" :
		case "BWA" :
		case "BWB" :
		case "BWC" :
		case "BWD" :
			for (var i = 0; i < totalAllUpBetlines; i++) {
				if (match == allUpBetlines[i].match ||
					match.substring(0, 2) != allUpBetlines[i].match.substring(0, 2)) {
					return cAllUpDisabled;
				}
			}
			return cAllUpEnabled;
		case "CWA" :
		case "CWB" :
		case "CWC" :
			for (var i = 0; i < totalAllUpBetlines; i++) {
				if (! GetXPoolAllUpEnabled(betType))
					return cAllUpDisabled;

				if (match == allUpBetlines[i].match ||
					match.substring(0, 2) != allUpBetlines[i].match.substring(0, 2)) {
					return cAllUpDisabled;
				}
			}
			return cAllUpEnabled;
		case "GPF" :
		case "GPW" :
			if (int_cross_tourn_para == 0) {
				for (var i = 0; i < totalAllUpBetlines; i++) {
					if (betType != allUpBetlines[i].type) { // different bet type -> DISABLED
						return cAllUpDisabled;
					}			    
					var ary_tmp1 = match.split(" ");
					var ary_tmp2 = allUpBetlines[i].match.split(" ");
					if (ary_tmp1.length == 4 && ary_tmp2.length == 4) {
						if (ary_tmp1[2] != ary_tmp2[2]) { // different tourn no -> DISABLED
							return cAllUpDisabled;
						}
					} else { // matc_no invalid format -> DISABLED
						return cAllUpDisabled;
					}
				}
			}
			return cAllUpEnabled;
	}
	return cAllUpDisabled;
}

function GetAllUpEnableStateForDiffPool(betType) {
	switch(betType) {
		case "HAD" :
		case "HDC" :
		case "TTG" :
		case "CRS":
		case "FCRS":
		case "HFT" :
		case "OOE" :
		case "HILO" :
		case "FGS" :
		case "HHAD" :
		case "GPF" :
		case "GPW" :
		case "FHAD" :
		case "WIN" :
		case "PLA" :
		case "W-P" :
		case "QIN" :
		case "QPL" :
		case "QQP" :
		case "CWA" :
		case "CWB" :
		case "CWC" :
		case "TRI" :
		case "BWA" :
		case "BWB" :
		case "BWC" :
		case "BWD" :
		case "FTS":
		case "FHLO":
		case "NTS":
		case "CHLO":
			if (totalAllUpBetlines < 1)	{
				return cAllUpEnabled;
			}
	}
	return cAllUpDisabled;
}

function isBracketWin(type) {
	if (type == "BWA" || type == "BWB" || type == "BWC" || type == "BWD")
		return true;
	return false;
}

function GetDynamicAllUpState(family, betType, match) {
	var result = GetAllUpEnableStateWithBetType(betType);

	if (result != cAllUpNA) {
		if (totalAllUpBetlines > 0) {
			if (GetXPoolAllUpEnabled(allUpBetlines[0].type) && GetXPoolAllUpEnabled(betType)
				&& allUpBetlines[0].family == family) {
				result = GetAllUpEnableStateForXPool(betType, match);
			} else if (allUpBetlines[0].type == betType) {
				result = GetAllUpEnableStateForSamePool(betType, match);
			} else if (isBracketWin(allUpBetlines[0].type) && isBracketWin(betType)) {
				result = GetAllUpEnableStateForSamePool(betType, match);
			} else {
				result = GetAllUpEnableStateForDiffPool(betType);
			}
		}
	}
	
	if (family == "HB") {
		var temp_max_allup = max_allup;
		var bAllTrio = false;
		for (var i = 0; i < totalAllUpBetlines; i++) {
		  if (allUpBetlines[i].type == "TRI") {
		    bAllTrio = true;
			break;
		  }
		}

		if (bAllTrio == true)
		  temp_max_allup = 3;
		else
		  temp_max_allup = 6;

		if (totalAllUpBetlines >= temp_max_allup) {
			if (result == cAllUpEnabled) { // only enabled state need to change for max all up selected
				var flag_control = true;
				for (var i = 0; i < totalAllUpBetlines; i++) { // keep same match and same bet type for select
					if (match == allUpBetlines[i].match && betType == allUpBetlines[i].type) {
						flag_control = false;
						break;
					}
				}
				if (flag_control) { // check all selected all up selection 
					result = cAllUpDisabled;
				} // no same match and no same bet type // change state disabled
			}
		}
	} else if (family == "FB") {
		if (result == cAllUpEnabled) {
			if (GetBetlineCanGroup(betType, match) == -1 && xml_event_seq["allupformula"] != "") {
				var level = totalAllUpBetlines + 1;
				if (level > max_allup) {
					result = cAllUpDisabled;
				} else if (level >= min_allup) {
					var allup_comb = allup_formula[level].split(",");
					result = cAllUpDisabled;
					
					var isXPool = false;
					for (var i = 0; i < totalAllUpBetlines; i++) {
						if (betType != allUpBetlines[i].type) {
							isXPool = true;
							break;
						}
					}
					
					for (var i = 0; i < allup_comb.length; i++) {
						var formula = level + "x" + allup_comb[i];
						if (isXPool) {
							result = cAllUpEnabled;
							for (var j = 0; j < totalAllUpBetlines; j++) {
								if (func_search_allup_xml(allUpBetlines[j].type, formula) == "0") {
									result = cAllUpDisabled;
									break;
								}
							}
						} else {
							if (func_search_allup_xml(betType, formula) == "1") {
								result = cAllUpEnabled;
								break;
							}
						}
					}
				}
			}
		}
	}
	return result;
}

function refreshAllUpBetlines() {
    DeleteAllAllUpBetlines();
    for (var i = 0; i < totalBetlines; i++) {
        if (betlines[i].enableAllUp == cAllUpSelected)
            AddAllUpBetline(i);
    }

    for (var i = 0; i < totalBetlines; i++) {
        if (i == index || betlines[i].enableAllUp == cAllUpSelected || betlines[i].enableAllUp == cAllUpNA)
            continue;
        betlines[i].enableAllUp = GetDynamicAllUpState(betlines[i].family, betlines[i].type, betlines[i].match);
    }
}

function OnClickAllUpButton(index) {
	if (betlines[index].enableAllUp != cAllUpSelected && betlines[index].enableAllUp != cAllUpEnabled)
		return;

	betlines[index].enableAllUp *= -1; // switch enabled & selected state

	refreshAllUpBetlines();
	
	RedrawBetlineTable();
	DrawAddAllUpButton();
	LoadAllUpFormula();

	// Support SSO
	isClientActionTaken(true);
}

function GetIndexOfBetlineCanGroup(index) {
	for (var i = 0; i < totalAllUpBetlines; i++) {
		if (allUpBetlines[i].type == betlines[index].type &&
			allUpBetlines[i].match == betlines[index].match) {
			return i;
		}
	}
	return -1;
}

function GetBetlineCanGroup(betType, match) {
	for (var i = 0; i < totalAllUpBetlines; i++) {
		if (allUpBetlines[i].type == betType && allUpBetlines[i].match == match) {
			return i;
		}
	}
	return -1;
}

function GroupBetline(betType, betline1, betline2) {
	var string_result = betline1.split("*")[0] + "*"; // get the bet line first part (bet type and match no)
	// select bet type, Spical bet type HDC , HHAD (include "+"),  GPW , GPF
	switch(betType) {	
		case "HAD" :
		case "TTG" :
		case "CRS":
		case "FCRS":
		case "HFT" :
		case "OOE" :
		case "FGS" :
		case "GPF" :
		case "GPW" :
		case "FHAD":
		case "FTS":		
		case "NTS":
			string_result += func_merge_bet_line_odds(betline1.split("*")[1], betline2.split("*")[1]);
			break;
		case "HDC" :
		case "HHAD" :
			string_result += func_merge_bet_line_odds_at(betline1.split("*")[1], betline2.split("*")[1]);
			break;
		case "WIN" :
		case "PLA" :
		case "W-P" :
		case "CWA" :
		case "CWB" :
		case "CWC" :
			string_result += func_merge_bet_line_odds(betline1.split("*")[1], betline2.split("*")[1]);
		  break;
		case "QIN" :
		case "QPL" :
		case "QQP" :
		case "TRI" :
			string_result += func_merge_bet_line_banker(betline1.split("*")[1], betline2.split("*")[1], betType);
			break;
		case "HILO":
        case "FHLO":
        case "CHLO":
            string_result += func_merge_bet_line_odds_ml(betline1.split("*")[1], betline2.split("*")[1]);
            break;
	}
	return string_result;
}

// *********** MERGE Bet Line HILO, FHLO and CHLO for Multiple Line include [+] sign  **********************
function func_merge_bet_line_odds_ml(inval_1, inval_2)
{
	var inval = inval_1 + "+" + inval_2 ;
	var array_temp = inval.split("+") ;

	//check for duplicate
	var array_sorted = array_temp.sort(CompareFunc);
	var string_output = array_sorted[0];
	
	for (var i=1; i < array_sorted.length ; i++)
	{
        var compare1 = array_sorted[i-1].split("@")[0].toUpperCase();
        var compare2 = array_sorted[i].split("@")[0].toUpperCase();

        if (compare1 != compare2) {
            string_output += "+" + array_sorted[i];
		}
	}
	
	return  string_output;
}

// *********** MERGE Bet Line HHAD and HDC include [+] sign, using '@' split,  **********************
function func_merge_bet_line_odds_at(inval_1, inval_2)
{
	var inval = inval_1 + "+" + inval_2 ;
	
	var array_temp = inval.split("@") ;
	
	for (var i=1; i < array_temp.length ; i++)
	{
		if (i== array_temp.length-1)
		{	
			array_temp[i-1] = array_temp[i-1] + "@" + array_temp[i] ;	
			array_temp[i]	= "" ;	// clear the last array value to empty
		}
		else
		{
			var int_temp	= array_temp[i].indexOf("+") ;
			array_temp[i-1] = array_temp[i-1] + "@" + array_temp[i].substring(0,int_temp) ;
			array_temp[i]	= array_temp[i].substring(int_temp+1) ;
		}
	}
	
	return  func_return_merge_string(array_temp) ;
}

// ******************************* MERGE Odds Normal Bet Line Using "+" Split ************************
function func_merge_bet_line_odds(inval_string_1, inval_string_2)
{	
	var array_odds = new Array() ;
	// merge odds string
	var inval_string = inval_string_1 + "+" + inval_string_2 ;
	// split string to array for sorting
	var array_temp =  inval_string.split("+") ;
	
	return  func_return_merge_string(array_temp) ;
}

function func_merge_bet_line_banker(inval_string_1, inval_string_2, inval_pooltype)
{
	var ary1 = inval_string_1.split('>');
	var ary2 = inval_string_2.split('>');
	var banker = "";
	if (ary1.length > 1 && ary2.length > 1) {
	  var str1 = ary1[0] + "+" + ary2[0];
	  var ary3 = str1.split("+");
	  ary3 = ary3.sort(CompareFunc);
	  banker = ary3[0];
	  var count = 1;
	  for (var i = 1; i < ary3.length; i++) {
		  if (ary3[i] != ary3[i - 1]) {
		    if ((inval_pooltype == array_str_allup_hr_type[3] || //QIN
		         inval_pooltype == array_str_allup_hr_type[4] || //QPL
		         inval_pooltype == array_str_allup_hr_type[5]) && count >= 1) //QQP
		      break;
		    if (inval_pooltype == array_str_allup_hr_type[6] && count >= 2) // TRI
		      break;
		      
			  banker += '+' + ary3[i];
			}
	  }
	} else if (ary1.length > 1) {
	  banker = ary1[0];
	} else if (ary2.length > 1) {
	  banker = ary2[0];
	}
	
	return banker + ">" + func_merge_bet_line_odds(ary1[ary1.length - 1], ary2[ary2.length - 1]);
}

function CompareFunc(a, b)
{
	if (isNaN(a) || isNaN(b)) {
		if (a > b)
			return 1;
		else
			return -1;
	}
	
	return parseInt(a) - parseInt(b);
}

function CompareFuncML(a, b) {
    if (isNaN(a) || isNaN(b)) {
        var typeA = a.split('[')[0];
        var typeB = b.split('[')[0];
        
        var lineA = a.split('[')[1];
        var lineA2 = 0;

        var lineB = b.split('[')[1];
        var lineB2 = 0;

        if (lineA.indexOf('/') >= 0) {
            lineA2 = lineA.split('/')[1];
            lineA2 = parseFloat(lineA2.split(']')[0]);
            
            lineA = lineA.split('/')[0];
        }
        lineA = parseFloat(lineA.split(']')[0]);

        if (lineB.indexOf('/') >= 0) {
            lineB2 = lineB.split('/')[1];
            lineB2 = parseFloat(lineB2.split(']')[0]);
            
            lineB = lineB.split('/')[0];
        }
        lineB = parseFloat(lineB.split(']')[0]);

        if (lineA < lineB) 
            return -1;
        if (lineA > lineB)
            return 1;
        if (lineA == lineB) {
            if (lineA2 < lineB2)
                return -1;
            if (lineA2 > lineB2)
                return 1;
        }
        
        if (typeA < typeB) 
            return -1;
        if (typeA > typeB) 
            return 1;
        
        return 0;
	}
}

// ******************************* MERGE Array value to string ************************
function func_return_merge_string(inobj)
{
	var string_output = "" ;
	var array_sels = new Array();
	var array_odds = new Array() ;

	// check odds duplicate
	for(var i=0; i < inobj.length; i++)
	{	
		if (inobj[i] != "")
		{
			if (inobj[i].indexOf("[")>=0)
			{
				var split_string = "[" ;
				var type_string = (inobj[i].split(split_string)[0]).toUpperCase() ;
				var value_string = split_string + (inobj[i].split(split_string)[1]).toUpperCase() ;
				
				array_odds[type_string] = value_string ;		
				array_sels[array_sels.length] = type_string;
			}
			else if (inobj[i].indexOf("@")>=0) //  "@"
			{
				var type_string = (inobj[i].split("@")[0]).toUpperCase() ;
				var value_string = "@" + (inobj[i].split("@")[1]).toUpperCase() ;
				
				array_odds[type_string] = value_string ;		
				array_sels[array_sels.length] = type_string;
			} else {
				var type_string = inobj[i];
				array_odds[type_string] = '';
				array_sels[array_sels.length] = type_string;
			}
		}
	}

	array_sels = array_sels.sort(CompareFunc);

	string_output = array_sels[0] + array_odds[array_sels[0]] + "+";
	for (i = 1; i < array_sels.length; i++) {
		if (array_sels[i] != array_sels[i - 1])
			string_output += array_sels[i] + array_odds[array_sels[i]] + "+";
	}
	// return value with out last separate string
	return string_output.substring(0,string_output.length-1) ;	
}

// ******************************* MERGE Long Format ************************************************
function GroupDescription(betType, description1, description2)
{	// long format separate string 
	var string_output = ""  ;

	var array1 = description1.split("<BR>") ;
	var array2 = description2.split("<BR>") ;
	
	var numHeaderParts = 3; // FB by default
	switch (betType) {
		case "WIN" :
		case "PLA" :
		case "W-P" :
		case "QIN" :
		case "QPL" :
		case "QQP" :
		case "TRI" :
			numHeaderParts = 4;
			break;
	}

	// FB first 3 lines [0] date, [1] team , [2] bet type
	// HB first 4 lines [0] venue, [1] day , [2] bet type, [3] race number
	for (var i=0; i < numHeaderParts; i++)
	{	string_output += array1[i] + "<BR>";	}
	
	var temp_inval_string_1 = "" ;
	var temp_inval_string_2 = "" ;
	// odds lines
	for (var i=numHeaderParts; i < array1.length ; i++) {
		if (array1[i].length > 0)
			temp_inval_string_1 += array1[i] + "<BR>";
	}
	
	for (var i=numHeaderParts; i < array2.length ; i++) {
		if (array2[i].length > 0)
			temp_inval_string_2 += array2[i] + "<BR>";
	}

	// merge two odds
	var inval_string = temp_inval_string_1 + "<BR>" + temp_inval_string_2 ;
	// split to array for sorting
	var array_temp =  inval_string.split("<BR>") ;
	
	return string_output + func_return_merge_long_string(betType, array_temp) ;
}

// ******************************* MERGE Array value to string ************************
function func_return_merge_long_string(betType, inobj)
{	
	var string_output = "" ;
	var array_sels = new Array();
	var array_odds = new Array() ;

	// check odds duplicate
	for(var i=0; i < inobj.length; i++)
	{	
		if (inobj[i] != "")
		{
			/*if (inobj[i].indexOf("[")>=0)
			{
				var split_string = "[" ;
				var type_string = (inobj[i].split(split_string)[0]).toUpperCase() ;
				var value_string = split_string + (inobj[i].split(split_string)[1]).toUpperCase() ;
				
				array_odds[type_string] = value_string ;		
				array_sels[array_sels.length] = type_string;
			}
			else */if (inobj[i].indexOf("@")>=0)
			{
				var type_string = (inobj[i].split("@")[0]).toUpperCase() ;
				var value_string = "@" + (inobj[i].split("@")[1]).toUpperCase() ;
				
				array_odds[type_string] = value_string ;	
				array_sels[array_sels.length] = type_string;	
			}
			else {
				var type_string = inobj[i];
				array_odds[type_string] = '';
				array_sels[array_sels.length] = type_string;
			}
		}
	}

    //handle sorting for regular bet and Multiple line
	switch (betType) {
	    case "HILO":
        case "FHLO":
        case "CHLO":
            array_sels = array_sels.sort(CompareFuncML);
            break;
        default:
            array_sels = array_sels.sort(CompareFunc);
	}	
	
	string_output = array_sels[0] + array_odds[array_sels[0]] + "<BR>";
	for (i = 1; i < array_sels.length; i++) {
		if (array_sels[i] != array_sels[i - 1])
			string_output += array_sels[i] + array_odds[array_sels[i]] + "<BR>";
	}
	// return value with out last separate string
	return string_output;
}

function CreateAndAddAllUp() {
	var array_race = new Array();
	var array_ptbl = new Array();
	if (allUpBetlines[0].family == "HB") {
	    for (var i = 0; i < totalAllUpBetlines; i++) {
			var dummy = allUpBetlines[i].betline.split(" ");
			var last_part = dummy[dummy.length - 1];
			dummy = last_part.split("*");
			var idx = array_race.length;
			array_race[idx] = parseInt(dummy[0]);
			array_ptbl[array_race[idx]] = i;
		}
		array_race.sort(CompareFunc);
	}

	var betInfo = new BetlineInfo();
  if ( allUpBetlines[0].family == "HB" && isFlexBetEnabled('ALUP') )
    betInfo.betMethod = 0;

	betInfo.betline = CreateAllUpBetline(array_race, array_ptbl);
	betInfo.family = allUpBetlines[0].family;
	betInfo.type = ParseBetType(betInfo.betline, betInfo.family);
	betInfo.description = CreateAllUpDescription(array_race, array_ptbl, betInfo.type);
	betInfo.league = GetAllUpLeague();
  betInfo.unitBet = GetAllUpUnitBet();
	betInfo.numOfSelection = CalcAllUpCombination();
	betInfo.canFormAllUp = 0;
	betInfo.enableAllUp = cAllUpNA;
	betInfo.isInPlay = GetAllUpInPlay();
	betInfo.match = ParseMatchNumber(betInfo.betline, betInfo.family, betInfo.type);
	betInfo.dispLine1 = GetAllUpDispLine1(betInfo.family);

	if (allUpBetlines[0].family == "HB") {
	    betInfo.dispLine2 = betInfo.betline.substring(betInfo.betline.indexOf('/') + 1);
	    betInfo.venue = betInfo.betline.substring(0, 2);
	    betInfo.typeDescription = GetAllUpTypeDescriptions(array_race, array_ptbl);
	}
	else
	    betInfo.dispLine2 = allUpBetlines[0].dispLine1; //betInfo.betline.substring(betInfo.betline.indexOf('/')+1);

	if (totalBetlines + 1 > cMaxBetlines) {
		alert(GetError("1205"));
		return cRetCodeOverMax;
	}
	
	// check duplicate bet
	if (IsDuplicateBetAllUp(betInfo.family, betInfo.type, betInfo.betline)) {
		alert(GetError("duplicate_bet_fixed_odds" + betInfo.family));
		return cRetCodeFail;
	}
	
	if (GetSetting("ALUP") == "2") {
		var new_betlines = new Array(cMaxBetlines);
		for (var i = 0; i < new_betlines.length; i++) {
			new_betlines[i] = new BetlineInfo();
		}

		var new_total = 0;
		for (var i = 0; i < totalBetlines; i++) {
			if (betlines[i].enableAllUp != cAllUpSelected) {
				new_betlines[new_total++] = betlines[i];
			}
		}
		betlines = new_betlines;
		totalBetlines = new_total;
	}
	
	// check bet buffer size
	if (IsBufferOverflow(betInfo.betline, betInfo.unitBet, betInfo.type, betInfo.isInPlay, 0, 0, betInfo.isXSell(), betInfo.isFlexiBet())) {
		alert(GetError("1203"));
		return;
	}
	
	AppendBetline(betInfo);

	// START Nielsen Online SiteCensus
	WATrackClickEventAllUp();
	// END Nielsen Online SiteCensus

	// Support SSO
	isClientActionTaken(true);

	DeleteAllAllUpBetlines();
	ResetAllAllUpButtons();
	RedrawBetlineTable();
	DrawAddAllUpButton();
	LoadAllUpFormula();
}

function CreateAllUpBetline(array_race, array_ptbl) {
	var result = "";
	if (allUpBetlines[0].family == "FB") {
	    result = "FB ALUP " + sel_formula.options[sel_formula.selectedIndex].text;

		for (var i = 0; i < totalAllUpBetlines; i++) {
			result += "/" + allUpBetlines[i].betline.substring(3);
		}
	} else if (allUpBetlines[0].family == "HB") {
		result = allUpBetlines[0].betline.substring(0, 6) + " ALUP " + sel_formula.options[sel_formula.selectedIndex].text;
		for (var i = 0; i < array_race.length; i++) {
			result += "/" + allUpBetlines[array_ptbl[array_race[i]]].betline.substring(7);
		}
	}
	return result;
}

function CreateAllUpDescription(array_race, array_ptbl, betType) {
	var result = "";
	var pos_1br = 0;
	var tmpBetline = 0;
	if (allUpBetlines[0].family == "FB") {
		result = GetText(allUpBetlines[0].family + '_ALUP') + " " + sel_formula.options[sel_formula.selectedIndex].text + '<BR>';
		for (var i = 0; i < totalAllUpBetlines; i++) {
		    var matchArr = allUpBetlines[i].description.split('<BR>');
		    result += removeImgTag(matchArr[0]) + '<BR>';
			pos_1br = allUpBetlines[i].description.indexOf("<BR>");
			tmpBetline = allUpBetlines[i].description.substring(pos_1br + 4);
			result += removeImgTag(tmpBetline);
		}
	} else if (allUpBetlines[0].family == "HB") {
		var dummy = allUpBetlines[0].description.split("<BR>");
		result = dummy[0] + "<BR>" + GetText(allUpBetlines[0].family + '_ALUP') + " " + sel_formula.options[sel_formula.selectedIndex].text + '<BR>';
		for (var i = 0; i < array_race.length; i++) {
			pos_1br = allUpBetlines[array_ptbl[array_race[i]]].description.indexOf("<BR>");
			tmpBetline = allUpBetlines[array_ptbl[array_race[i]]].description.substring(pos_1br + 4);
			result += tmpBetline;
		}
	}
	return result;
}

function removeImgTag(str) {
  var imgPosSt = str.indexOf("<img");
  if ( imgPosSt>=0 ) {
    var imgPosEd = str.indexOf(">", imgPosSt);
    return str.substring(0, imgPosSt) + str.substring(imgPosEd+1);
  }
  return str;
}

function GetAllUpLeague() {
	for (var i = 1; i < totalAllUpBetlines; i++) {
		if (allUpBetlines[i].league != allUpBetlines[i - 1].league)
			return "";
	}
	return allUpBetlines[0].league;
}

function GetAllUpUnitBet() {    
  var val = $j('#inputAllUp').val();
  val = parseInt(val.replace('$', ''), 10);
  if ( val < psHBArray['ALUPX'].minAmt )
    return psHBArray['ALUPX'].storedAmt;
  return val;
}

function GetAllUpInPlay() {
	for (var i = 0; i < totalAllUpBetlines; i++) {
		if (allUpBetlines[i].isInPlay == 1)
			return 1;
	}
	return 0;
}

function GetAllUpDispLine1(family) {
	var str = GetText(family+'_ALUP') + ' '
			 + sel_formula.options[sel_formula.selectedIndex].text;
	return str;
}

function GetAllUpTypeDescriptions(array_race, array_ptbl) {
	if (allUpBetlines[0].family != "HB") {
		return "";
	}
	var description = "";
	for (var i = 0; i < array_race.length; i++) {
		description += allUpBetlines[array_ptbl[array_race[i]]].typeDescription;
		if (i != (array_race.length - 1)) {
			description += ";;";
		}
	}
	return description;
}