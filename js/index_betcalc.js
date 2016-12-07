var array_pooldef_leg_d_t = new Array();
var array_pooldef_leg_t_t = new Array();
var array_pooldef_leg_dbl = new Array();
var array_pooldef_leg_tbl = new Array();
var array_pooldef_leg_6up = new Array();

var array_pooldef_fieldsize = new Array(); // array[venue + race] = <size>
var array_scratch_sel = new Array();      // array[venue + race + '_' + runner] = '1'; if scratch
var array_num_of_scratch = new Array();		// array[venue + race] = number of scratched runner in this race

var array_hr_allupFormula = new Array(
		"2X1", "2X3",
		"3X1", "3X3", "3X4", "3X6", "3X7",
		"4X1", "4X4", "4X5", "4X6", "4X10", "4X11", "4X14", "4X15",
		"5X1", "5X5", "5X6", "5X10", "5X15", "5X16", "5X20", "5X25", "5X26", "5X30", "5X31",
		"6X1", "6X6", "6X7", "6X15", "6X20", "6X21", "6X22", "6X35", "6X41", "6X42", "6X50", 
		"6X56", "6X57", "6X62", "6X63",
		"7X1", "7X7", "7X8", "7X21", "7X35", "7X120", "7X127",
		"8X1", "8X8", "8X9", "8X28", "8X56", "8X70", "8X247", "8X255"
);
		
var array_hr_allupEnable = new Array(
	//	Level 1
	new Array (
		false, true,	//	2 Leg
		false, false, false, true, true,	//	3 Leg
		false, false, false, false, true, false, true, true,	//	4 Leg
		false, false, false, false, true, false, false, true, false, true, true,	//	5 Leg
		false, false, false, false, false, true, false, false, true, false, false, true, false, true, true,	//	6 Leg
		false, false, false, false, false, false, true, // 7 leg
		false, false, false, false, false, false, false, true // 8 leg
	),
	//	Level 2
	new Array (
		true, true,	//	2 Leg
		false, true, true, true, true,	//	3 Leg
		false, false, false, true, true, true, true, true,	//	4 Leg
		false, false, false, true, true, false, true, true, true, true, true,	//	5 Leg
		false, false, false, true, false, true, false, true, true, false, true, true, true, true, true,	//	6 Leg
		false, false, false, false, false, true, true, // 7 leg
		false, false, false, false, false, false, true, true // 8 leg
	),
	//	Level 3
	new Array (
		false, false,	//	2 Leg
		true, false, true, false, true,	//	3 Leg
		false, true, true, false, false, true, true, true,	//	4 Leg
		false, false, false, false, false, true, true, true, true, true, true,	//	5 Leg
		false, false, false, false, true, false, false, true, true, true, true, true, true, true, true,	//	6 Leg
		false, false, false, false, false, true, true, // 7 leg
		false, false, false, false, false, false, true, true // 8 leg
	),
	//	Level 4
	new Array (
		false, false,	//	2 Leg
		false, false, false, false, false,	//	3 Leg
		true, false, true, false, false, true, false, true,	//	4 Leg
		false, true, true, false, false, true, false, false, true, true, true,	//	5 Leg
		false, false, false, false, false, false, true, false, false, true, true, true, true, true, true,	//	6 Leg
		false, false, false, false, true, true, true, // 7 leg
		false, false, false, false, false, true, true, true // 8 leg
	),
	//	Level 5
	new Array (
		false, false,	//	2 Leg
		false, false, false, false, false,	//	3 Leg
		false, false, false, false, false, false, false, false,	//	4 Leg
		true, false, true, false, false, true, false, false, true, false, true,	//	5 Leg
		false, true, true, false, false, false, true, false, false, true, false, false, true, true, true,	//	6 Leg
		false, false, false, true, false, true, true, // 7 leg
		false, false, false, false, true, false, true, true // 8 leg
	),
	//	Level 6
	new Array (
		false, false,	//	2 Leg
		false, false, false, false, false,	//	3 Leg
		false, false, false, false, false, false, false, false,	//	4 Leg
		false, false, false, false, false, false, false, false, false, false, false,	//	5 Leg
		true, false, true, false, false, false, true, false, false, true, false, false, true, false, true,	//	6 Leg
		false, true, true, false, false, true, true, // 7 leg
		false, false, false, true, false, false, true, true // 8 leg
	),
	//	Level 7
	new Array (
		false, false,	//	2 Leg
		false, false, false, false, false,	//	3 Leg
		false, false, false, false, false, false, false, false,	//	4 Leg
		false, false, false, false, false, false, false, false, false, false, false,	//	5 Leg
		false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,	//	6 Leg
		true, false, true, false, false, true, true, // 7 leg
		false, true, true, false, false, false, true, true // 8 leg
	),
	//	Level 8
	new Array (
		false, false,	//	2 Leg
		false, false, false, false, false,	//	3 Leg
		false, false, false, false, false, false, false, false,	//	4 Leg
		false, false, false, false, false, false, false, false, false, false, false,	//	5 Leg
		false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,	//	6 Leg
		false, false, false, false, false, false, false, // 7 leg
		true, false, true, false, false, false, true, true // 8 leg
	)
);

function setMultiRacesPoolDefLegs(str) {
  var poolArr = str.split('@@@');
  for ( var i=1; i<poolArr.length; i++ ) {
    var tmp = poolArr[i].split('#');
    switch ( tmp[0] ) {
      case 'DBL':
        array_pooldef_leg_dbl = LoadMultiLeg2(tmp[1], tmp[0]);
        break;
      case 'TBL':
        array_pooldef_leg_tbl = LoadMultiLeg2(tmp[1], tmp[0]);
        break;
      case 'D-T':
        array_pooldef_leg_d_t = LoadMultiLeg2(tmp[1], tmp[0]);
        break;
      case 'T-T':
        array_pooldef_leg_t_t = LoadMultiLeg2(tmp[1], tmp[0]);
        break;
      case '6UP':
        array_pooldef_leg_6up = LoadMultiLeg2(tmp[1], tmp[0]);
        break;
      default:
        break;
    }
  }
}

function setFieldSize(fieldSize) {
  var fields = fieldSize.split(';');
  for ( var i=1; i<fields.length; i++ ) {
    array_pooldef_fieldsize[fields[0]+i] = parseInt(fields[i], 10);
  }
}

function clearScratch(scratchList) {
  var scratchs = scratchList.split(';');
  for ( var i=1; i<=15; i++ ) {
    array_num_of_scratch[scratchs[0]+i] = 0;
    for ( var j=1; j<=array_pooldef_fieldsize[scratchs[0]+i]; j++ )
      array_scratch_sel[scratchs[0] + i + '_' + j] = 0;
  }
}

function setScratch(scratchList) {
  var scratchs = scratchList.split(';');
  for ( var i=1; i<scratchs.length; i++ ) {
    var tmp = scratchs[i].split('#');
    if ( parseInt(tmp[1], 10) <= array_pooldef_fieldsize[scratchs[0]+tmp[0]] ) {
      array_scratch_sel[scratchs[0] + tmp[0] + '_' + tmp[1]] = '1';
    }
  }
}

function func_is_scratch_runner(inval_venue, inval_race_no, inval_runner_no) {
  return array_scratch_sel[inval_venue + inval_race_no + '_' + inval_runner_no]=='1';
}

function func_get_num_of_scratch(inval_venue, inval_race_no) {
  var num_of_scratch;
  try {
  if (isNaN(inval_race_no))
    return 0;
  else
    race_no = parseInt(inval_race_no);
  } catch (e) {
    return 0;
  }
  if (race_no < 1 || race_no > 15)
    return 0;

  var cnt = 0;
  for ( var i=1; i<=array_pooldef_fieldsize[inval_venue+inval_race_no]; i++ ) {
    if ( array_scratch_sel[inval_venue + inval_race_no + '_' + i] == '1' )
      cnt++;
  }
  return cnt;
}

function LoadMultiLeg2(inval_str, inval_pool) {
	var legs = new Array();
	var query = inval_str.split(';');
	for (var i = 1; i < query.length; i++) {
		var tempAry = query[i].split(',');
		legs[legs.length] = tempAry;
	}
	return legs;
}

function func_get_field_size(inval_venue, inval_race_no) {
	var race_no;
	try {
	  if (isNaN(inval_race_no))
	    return 14;
	  else
		race_no = parseInt(inval_race_no);
	} catch (e) {
		return 14;
	}

	if (race_no < 1 || race_no > 15)
		return 14;
	if ( array_pooldef_fieldsize[inval_venue + inval_race_no] == null )
		return 14;

	var num_of_scratch = func_get_num_of_scratch(inval_venue, inval_race_no);
	return array_pooldef_fieldsize[inval_venue + inval_race_no] - num_of_scratch;
}

function func_get_race_no(inval_pool, inval_race_no, inval_leg_index) {
	var i;
	var first_leg_index = 0;
	var out_race_no;
	
	switch (inval_pool) {
		case "DBL" :
			for (i = 0; i < array_pooldef_leg_dbl.length; i++) {
				if (array_pooldef_leg_dbl[i][0] == inval_race_no) {
					first_leg_index = i;
					break;
				}
			}
			if (inval_leg_index < 0 || inval_leg_index > 1)
				out_race_no = 0;
			else
				out_race_no = array_pooldef_leg_dbl[first_leg_index][inval_leg_index];
			break; // DBL
			
		case "TBL" :
			for (i = 0; i < array_pooldef_leg_tbl.length; i++) {
				if (array_pooldef_leg_tbl[i][0] == inval_race_no) {
					first_leg_index = i;
					break;
				}
			}
			if (inval_leg_index < 0 || inval_leg_index > 2)
				out_race_no = 0;
			else
				out_race_no = array_pooldef_leg_tbl[first_leg_index][inval_leg_index];
			break; // TBL
			
		case "6UP" :
			for (i = 0; i < array_pooldef_leg_6up.length; i++) {
				if (array_pooldef_leg_6up[i][0] == inval_race_no) {
					first_leg_index = i;
					break;
				}
			}
			if (inval_leg_index < 0 || inval_leg_index > 5)
				out_race_no = 0;
			else
				out_race_no = array_pooldef_leg_6up[first_leg_index][inval_leg_index];
			break; // 6UP
			
		case "D-T" :
			for (i = 0; i < array_pooldef_leg_d_t.length; i++) {
				if (array_pooldef_leg_d_t[i][0] == inval_race_no) {
					first_leg_index = i;
					break;
				}
			}
			if (inval_leg_index < 0 || inval_leg_index > 1)
				out_race_no = 0;
			else
				out_race_no = array_pooldef_leg_d_t[first_leg_index][inval_leg_index];
			break; // D-T
		
		case "T-T" :
			for (i = 0; i < array_pooldef_leg_t_t.length; i++) {
				if (array_pooldef_leg_t_t[i][0] == inval_race_no) {
					first_leg_index = i;
					break;
				}
			}
			if (inval_leg_index < 0 || inval_leg_index > 2)
				out_race_no = 0;
			else
				out_race_no = array_pooldef_leg_t_t[first_leg_index][inval_leg_index];
			break; // T-T
			
		default :
			out_race_no = 1;
	} // SWITCH
	
	return out_race_no;
}

//////////////////////////////////////////////////////////////////////
// Start bet calculation
//////////////////////////////////////////////////////////////////////

function CalcSelections(family, betType, betline) {
	try {
		switch(family) {
			case "FB" :
				return Math.round(func_calc_fb_num_of_bet(betline, betType));
			case "MK6" :
				return Math.round(BetCalcMK6(betline, betType));
			case "HB" :
				return Math.round(func_calc_rc_num_of_bet(betline, betType));
		}
	} catch (e) {
	}
	return 1;
}

function func_calc_fb_num_of_bet(inval_bet_string , inval_bet_type) 
{
	var parts = inval_bet_string.split(" ");
	switch(inval_bet_type.toUpperCase()) {
		case "HAD":
		case "FTS":
		case "FHLO":
		case "HDC" :
		case "TTG" :
		case "OOE" :
		case "FGS" :
		case "TQL" :
	    case "NTS" :
		case "GPF" :
		case "GPW" :
		case "HILO" :
		case "HHAD":
		case "CHLO":
		case "FHAD" : return func_calc_HAD_bet(parts[3]);
		case "CHP" :
		case "TPS" : return func_calc_HAD_bet(parts[2]);
		case "SPC" :
			if (parts[1].length > 3)
				return func_calc_HAD_bet(parts[3]);
			else
				return func_calc_HAD_bet(parts[4]);
        case "CRS":
		case "FCRS":
		case "HFT" : return func_calc_CRS_bet(parts[3]);
		case "DHCP" : return func_calc_DHCP_bet(parts[3]);
		case "TOFP" : return func_calc_TOFP_bet(parts[2]);
		case "ADTP" : return func_calc_ADTP_bet(parts[3]);
		case "HFMP" :
		case "HFMP6" :
		case "HFMP8" : return func_calc_HFMP_bet(parts[3]);
	}
	return 1;
}

function func_calc_HAD_bet(inval) {
	return inval.split('@').length - 1;
}

function func_calc_CRS_bet(inval)
{		// no odds select ???
	if (inval.indexOf('+')>0)
	{
		return inval.split('+').length ;
	}
	else
	{
		return 1 ;
	}
}

function func_calc_TOFP_bet(inval)	// 'TOFP' , 'CHPP'		///////************ need test (tested in js) **************
{
	var array_temp = inval.split('#') ;
	var int_result = 1 ; // for multiple
	
	for (var i=0 ; i < array_temp.length ; i++)
	{
		int_result *= array_temp[i].split('+').length ;
	}
	return int_result ;
}

function func_calc_ADTP_bet(inval)	///////************ need test (tested in js) **************
{
	var array_temp = inval.split('(') ;
	var int_result = 1 ; // for multiple
	
	for (var i=0 ; i < array_temp.length ; i++)
	{
		if (array_temp[i].indexOf('+') >0)
		{	int_result *= nCr(array_temp[i].split('+').length,2) ;	}
	}
	return int_result ;
}

//***************************************************************************************
function func_calc_HFMP_bet(inval)	// 'HFMP' , 'HFMP6' , 'HFMP8' ///////************ need check **************
{
	var int_result = 1 ;
	var int_index = inval.indexOf('*') ;
	var str_betting = inval.substring(int_index) ;
	var temp_array = str_betting.split('/') ;
	
	for (var i=0; i<temp_array.length; i++)
	{
		if (temp_array[i].indexOf('+') > 0)
		{
			var temp_split = temp_array[i].split('+') ;
			int_result *= temp_split.length ;
		}
	}
	return int_result ;	
}

///////************************************ DHCP ************************************************
function func_calc_DHCP_bet(inval)	
{
	var inval_temp = inval.substring(inval.indexOf('*')+1) ;
	var inval_temp = inval_temp.split('(').join('').split(')').join('') ;
	var array_temp = inval_temp.split('/') ;
	var int_result = 1 ; // for multiple

	for (var i=0 ; i < array_temp.length ; i++) // SPLIT '/' the Match
	{
		int_result *= func_each_match_bet( array_temp[i] ) ;
	}
	return int_result ;
}


function func_each_match_bet( inval )
{
	var string_full_dhcp  =	"1:0+2:0+2:1+3:0+3:1+3:2+4:0+4:1+4:2+5:0+5:1+5:2+HO+" ;
		string_full_dhcp +=	"0:0+1:1+2:2+3:3+DO+" ;
		string_full_dhcp +=	"0:1+0:2+1:2+0:3+1:3+2:3+0:4+1:4+2:4+0:5+1:5+2:5+AO" ;
	
	var int_reslut = 0 ;
	var array_match_half_full = inval.split('#') ;
	if (array_match_half_full[0].toUpperCase() == 'F')
	{	array_match_half_full[0] = string_full_dhcp ;	}
	if (array_match_half_full[1].toUpperCase() == 'F')
	{	array_match_half_full[1] = string_full_dhcp ;	}
	
	var array_match_half_score = array_match_half_full[0].split('+') ;
	var array_match_full_score = array_match_half_full[1].split('+') ;

	for (var half_index=0 ; half_index < array_match_half_score.length ; half_index++)
	{	
		var temp_half_score = '' ;
		if ((array_match_half_score[half_index].toUpperCase() == 'V') ||
			(array_match_half_score[half_index].toUpperCase() == 'HO') ||
			(array_match_half_score[half_index].toUpperCase() == 'DO') ||
			(array_match_half_score[half_index].toUpperCase() == 'AO'))
		{	temp_half_score = '9:9' ;	}
		else
		{	temp_half_score = array_match_half_score[half_index] ;  }

		var array_half_home_away_score = temp_half_score.split(':') ;
		var half_home_score = eval(array_half_home_away_score[0]) ;
		var half_away_score = eval(array_half_home_away_score[1]) ;

		for (var full_index=0 ; full_index < array_match_full_score.length ; full_index++)
		{
			var temp_full_score = '' ;
			if ((array_match_full_score[full_index].toUpperCase() == 'V') ||
				(array_match_full_score[full_index].toUpperCase() == 'HO') ||
				(array_match_full_score[full_index].toUpperCase() == 'DO') ||
				(array_match_full_score[full_index].toUpperCase() == 'AO'))
			{	temp_full_score = '9:9' ;	}
			else
			{	temp_full_score = array_match_full_score[full_index] ;  }

			var array_full_home_away_score = temp_full_score.split(':') ;
			var full_home_score = eval(array_full_home_away_score[0]) ;
			var full_away_score = eval(array_full_home_away_score[1]) ;
			
			if ((full_home_score>=half_home_score)&&(full_away_score>=half_away_score))
			{ int_reslut++;	}
		}
	}
	return int_reslut ;
}
///////*************************** end of DHCP ************************************************


function func_calc_rc_num_of_bet(betline , betType) {
	betline = betline.toUpperCase();
	switch(betType.toUpperCase()) {
		case "WIN" : return func_calc_WIN_bet(betline);
		case "PLA" : return func_calc_WIN_bet(betline);
		case "W-P" : return func_calc_WIN_bet(betline) * 2;
		case "QIN" : return func_calc_QIN_bet(betline);
		case "QPL" : return func_calc_QIN_bet(betline);
		case "QQP" : return func_calc_QIN_bet(betline) * 2;
		case "CWA" : return func_calc_WIN_bet(betline);
		case "CWB" : return func_calc_WIN_bet(betline);
		case "CWC" : return func_calc_WIN_bet(betline);
		case "TRI" : return func_calc_TRI_bet(betline);
		case "F-F" : return func_calc_F_F_bet(betline);
		case "BWA" : 
		case "BWB" : 
		case "BWC" : 
		case "BWD" : return func_calc_BW_bet(betType, betline);
		case "DBL" : return func_calc_MultiLegWIN_bet(betType, betline);
		case "TCE" : return func_calc_TCE_bet(betline);
		case "QTT" : return func_calc_QTT_bet(betline);
		case "D-T" : return func_calc_MultiLegTRI_bet(betType, betline);
		case "T-T" : return func_calc_MultiLegT_T_bet(betType, betline);
		case "TBL" : return func_calc_MultiLegWIN_bet(betType, betline);
		case "6UP" : return func_calc_MultiLegWIN_bet(betType, betline);
		case "JKC" : return func_calc_hb_fixed_odds_num_of_bet(betType, betline);
	}
	if (betType.indexOf("ALUP") == 0)
		return func_calc_HR_ALUP_bet(betline);
	return 1 ;
}

//****************************************************************
//****************************************************************
//****************************************************************

//1*1+2 pass
//1*1+2+3+4+5 pass
//1*F pass
function func_calc_WIN_bet(inval)
{
	var dummy = inval.split(" ");
	inval = dummy[dummy.length - 1];
	
	var ary1 = inval.split("*");
	if (ary1.length != 2)
		return 1;

	if (ary1[1].indexOf("F") >= 0) {
		return func_get_field_size(dummy[0], ary1[0]);
	}
  
	return ary1[1].split("+").length;
}

//1*1+2 pass
//1*1+2+3 pass
//1*F pass
//1*1>2+3+4 pass
//1*4>F pass
function func_calc_QIN_bet(inval)
{
	var dummy = inval.split(" ");
	inval = dummy[dummy.length - 1];
	
  var ary1 = inval.split("*");
  if (ary1.length != 2)
    return 1;
    
  var ary2 = ary1[1].split(">");
  var bankers = null;
  if (ary2.length == 2) {//have banker
    bankers = ary2[0].split("+");
    
    // check banker
    if (bankers.length != 1)
      return 1;  
    if (bankers[0] == "F" || bankers[0] == "f")
      return 1;
  }
  
  var selections = null;
  if (bankers == null)
    selections = ary2[0].split("+");
  else
    selections = ary2[1].split("+");
    
  if (selections == null || selections.length < 1)
    return 1;
    
  if (selections.length == 1) {
    if (selections[0] == "F" || selections[0] == "f") {
      var fieldsize = func_get_field_size(dummy[0], ary1[0]);
      if (bankers == null) {
        return nCr(fieldsize, 2);
      } else {
        return (fieldsize - 1);
      }
    }
  } else {
    if (bankers == null) {
      return nCr(selections.length, 2);
    } else {
      return selections.length;
    }
  }
  
  return 1;
}

//1*1+2+3 pass $10
//1*1+2+3+4+5 pass $100
//1*F pass $3640
//1*1>2+3+4 pass $30
//1*1>2+3+4+5 pass $60
//1*1+2>3+4 pass $20
//1*1+2>3+4+5 pass $30
//1*1>F $780
//1*1+2>F $120
//error case
//1*1+2 pass $10
function func_calc_TRI_bet(inval)
{
	var dummy = inval.split(" ");
	inval = dummy[dummy.length - 1];

  var ary1 = inval.split("*");
  if (ary1.length != 2)
    return 1;

  var ary2 = ary1[1].split(">");
  var n_bankers = 0;
  if (ary2.length == 2) {//have banker
    var bankers = ary2[0].split("+");
    
    // check banker
    if (bankers.length != 1 && bankers.length != 2)
      return 1;
    if (bankers[0] == "F" || bankers[0] == "f")
      return 1;
    n_bankers = bankers.length;
    if (n_bankers > 2)
		return 1;
  }
  
  var selections = null;
  if (n_bankers == 0)
    selections = ary2[0].split("+");
  else
    selections = ary2[1].split("+");
    
  if (selections == null || selections.length < 1)
    return 1;

  var n_selections = selections.length;
  if (selections.length == 1) {
    if (selections[0] == "F" || selections[0] == "f") {
      n_selections = func_get_field_size(dummy[0], ary1[0]) - n_bankers;
    } else {
	  return 1;
	}
  }
  
  if (n_bankers == 0) {
	return nCr(n_selections, 3);
  } else if (n_bankers == 1) {
	return nCr(n_selections, 2);
  } else {
    return n_selections;
  }
  
  return 1;
}

//1*1+2+3+4 pass $10
//1*1+2+3+4+5 pass $50
//1*F pass $10010
//1*1>2+3+4+5 pass $40
//1*1>2+3+4+5+6 pass $100
//1*1+2>3+4+7 pass $30
//1*1+2>3+4+5+8 pass $60
//1*1>F $2860
//1*1+2>F $660
//1*1+2+3>F $110
//error case
//1*1+2 pass $10
//1*1+2+3 pass $10
function func_calc_F_F_bet(inval)
{
	var dummy = inval.split(" ");
	inval = dummy[dummy.length - 1];
	
  var ary1 = inval.split("*");
  if (ary1.length != 2)
    return 1;

  var ary2 = ary1[1].split(">");
  var n_bankers = 0;
  if (ary2.length == 2) {//have banker
    var bankers = ary2[0].split("+");
    
    // check banker
    if (bankers.length != 1 && bankers.length != 2 && bankers.length != 3)
      return 1;
    if (bankers[0] == "F" || bankers[0] == "f")
      return 1;
    n_bankers = bankers.length;
    if (n_bankers > 3)
		return 1;
  }
  
  var selections = null;
  if (n_bankers == 0)
    selections = ary2[0].split("+");
  else
    selections = ary2[1].split("+");
    
  if (selections == null || selections.length < 1)
    return 1;

  var n_selections = selections.length;
  if (selections.length == 1) {
    if (selections[0] == "F" || selections[0] == "f") {
      n_selections = func_get_field_size(dummy[0], ary1[0]) - n_bankers;
    } else {
	  return 1;
	}
  }
  
  if (n_bankers == 0) {
	return nCr(n_selections, 4);
  } else if (n_bankers == 1) {
	return nCr(n_selections, 3);
  } else if (n_bankers == 2) {
	return nCr(n_selections, 2);
  } else {
    return n_selections;
  }
  
  return 1;
}

//1*1+2 pass
//1*1+2+3+4+5 pass
//1*F pass
function func_calc_BW_bet(betType, inval)
{
	var dummy = inval.split(" ");
	inval = dummy[dummy.length - 1];
	
  var ary1 = inval.split("*");
  if (ary1.length != 2)
    return 1;
  
  if (ary1[1].indexOf("F") >= 0) {
    return GetBWinNumOfBracket(dummy[0], ary1[0], betType);
  }
  
  return ary1[1].split("+").length;
}

//1*2/4 pass $10
//1*2/4+6+7 pass $30
//1*2+4/4 pass $20
//1*2+4/4+10+11 pass $60
//1*F/4 pass $140
//1*F/4+5+6 pass $420
//1*4/F pass $140
//1*4+5/F pass $280
//1*F/F pass $1960
function func_calc_MultiLegWIN_bet(inval_pool, inval_betline)
{
	var dummy = inval_betline.split(" ");
	inval_betline = dummy[dummy.length - 1];

	var ary1 = inval_betline.split("*");
	if (ary1.length != 2)
		return 1; // invalid format
		
	var race_no = parseInt(ary1[0]);

	var ary2 = ary1[1].split('/');
	if (	(inval_pool == "DBL" && ary2.length != 2)
		||	(inval_pool == "TBL" && ary2.length != 3)
		||	(inval_pool == "6UP" && ary2.length != 6))
		return 1; // invalid format

	var n_selections = 1;
	var leg_selections;
	for (var i = 0; i < ary2.length; i++) {
		if (ary2[i].indexOf("F") >= 0) {
			var leg_race_no = func_get_race_no(inval_pool, race_no, i);
			leg_selections = func_get_field_size(dummy[0], leg_race_no);
		} else {
			leg_selections = ary2[i].split("+").length;
		}
		n_selections *= leg_selections;
	}
	
	return n_selections;
}

//D-T 1*1+2+3/3+5+6 pass $10
//D-T 1*1+2+3+11+12/3+5+6 pass $100
//D-T 1*1+2+3/3+5+6+11+12+13 pass $200
//D-T 1*1+2+3+11+12/3+5+6+11+12+13 pass $2000
//D-T 1*F/3+5+6 pass $3640
//D-T 1*1+2+3+4/F pass $14,560
//D-T 1*F/F pass $1,324,960
//D-T 1*5>1+2+3+11+12/3+5+6+11+12+13 pass $2000
//D-T 1*5+6>1+2+3+11+12/3+5+6+11+12+13 pass $1000
//D-T 1*1+2+3+11+12/8>3+5+6+11+12+13 pass $1500
//D-T 1*1+2+3+11+12/8+9>3+5+6+11+12+13 pass $600
//D-T 1*5+6>1+2+3+11+12/8+9>3+5+6+11+12+13 pass $300
//D-T 1*5>F/3+5+6+11+12+13 pass $15,600
//D-T 1*3+5+6+11+12+13/5>F pass $15,600
//D-T 1*5+6>F/3+5+6+11+12+13 pass $2400
//D-T 1*3+5+6+11+12+13/5+6>F pass $2400
//D-T 1*5+6>F/5+6>F pass $1440
//D-T 1*5+6>F/F pass $43,680
//D-T 1*F/5+6>F pass $43,680
//D-T 1*4>F/5+6>F pass $9,360
function func_calc_MultiLegTRI_bet(inval_pool, inval_betline)
{
	var dummy = inval_betline.split(" ");
	inval_betline = dummy[dummy.length - 1];

	var ary1 = inval_betline.split("*");
	if (ary1.length != 2)
		return 1; // invalid format
		
	var race_no = parseInt(ary1[0]);

	var ary2 = ary1[1].split('/');
	if (	(inval_pool == "D-T" && ary2.length != 2)
		||	(inval_pool == "T-T" && ary2.length != 3))
		return 1; // invalid format

	var n_selections = 1;
	var leg_bankers;
	var leg_selections;
	var leg_combination;
	for (var i = 0; i < ary2.length; i++) {
		var ary3 = ary2[i].split('>');
		if (ary3.length == 1) { // no bankers
			leg_bankers = 0;
			if (ary3[0].indexOf("F") >= 0) {
				var leg_race_no = func_get_race_no(inval_pool, race_no, i);
				leg_selections = func_get_field_size(dummy[0], leg_race_no);
			} else {
				leg_selections = ary3[0].split("+").length;
			}
		} else if (ary3.length == 2) { // with bankers
			if (ary3[0].indexOf("F") >= 0)
				return 1; // invalid format
			leg_bankers = ary3[0].split("+").length;
			if (leg_bankers > 2)
				return 1; // invalid format
			
			if (ary3[1].indexOf("F") >= 0) {
				var leg_race_no = func_get_race_no(inval_pool, race_no, i);
				leg_selections = func_get_field_size(dummy[0], leg_race_no) - leg_bankers;
			} else {
				leg_selections = ary3[1].split("+").length;
			}
		} else { // invalid format
			return 1;
		}

		leg_combination = nCr(leg_selections, 3 - leg_bankers);
		n_selections *= leg_combination;
	}
	
	return n_selections;
}

function func_calc_MultiLegT_T_bet(inval_pool, inval_betline) {
	var dummy = inval_betline.split("*");
	var tmpHeader = dummy[0];
	var tmpBetlines = dummy[1].split("|");
	var tmpTotal = 0;
	for ( var i=0; i<tmpBetlines.length; i++ ) {
		var tmpBetline = tmpHeader + "*" + tmpBetlines[i];
		tmpTotal += func_calc_MultiLegTRI_bet(inval_pool, tmpBetline);
	}
	return tmpTotal;
}

//S 1*1+2+3 pass $10
//M 1*1+2+3 pass $60
//M 1*1+2+3+4+5 pass $600
//M 1*F pass $21,840
//B 1*1>2+3 pass $20
//B 1*1>2+3+4+5 pass $120
//B 1*1>F pass $1560
//B 1*1+2>11 pass $10 // invalid
//B 1*1+2>11+12 pass $20
//B 1*1+2>10+11+12+13+14 pass $50
//B 1*1+2>F pass $120
//BM 1*1>2+3 $10 // invalid returns $60
//BM 1*1>2+3+4 pass $180
//BM 1*1>2+3+4+5 pass $360
//BM 1*1>F pass $4680
//BM 1*1+2>11 $10 // invalid returns $60
//BM 1*1+2>11+12 pass $120
//BM 1*1+2>10+11+12+13+14 pass $300
//BM 1*1+2>F pass $720
//MB 1*1>2>3 pass $10
//MB 1*1>2>3+4 pass $20
//MB 1*1>2>3+4+5+6 pass $40
//MB 1*1>3+4+5+6>3 pass $30
//MB 1*1>4+5+6>3 pass $30
//MB 1*1>4+5+6+9>3 pass $40
//MB 1*4+5+6+9>4+5+6+9>4+5+6+9 pass $240
//MB 1*4+5+6+9>4+5+6+9>F pass $1440
//MB 1*F>4+5+6+9>F $6240
//MB 1*F>F>F pass $21840
function func_calc_TCE_bet(inval)
{
	var dummy = inval.split(" ");
	inval = dummy[dummy.length - 2] + " " + dummy[dummy.length - 1];
		
	var ary1 = inval.split(' ');
	if (ary1.length != 2)
		return 1; // invalid format
	var tceFormula = ary1[0];
	
	var ary2 = ary1[1].split("*");
	if (ary2.length != 2)
		return 1; // invalid format
	var race_no = parseInt(ary2[0]);
	
	var n_selections = 0;
	var n_bankers = 0;
	var n_combination = 1;
	switch (tceFormula) {
		case "B" :
		case "BM" :
			var ary3 = ary2[1].split('>');
			if (ary3.length == 2) {
				if (ary3[0].indexOf('+') >= 0)
					n_bankers = 2;
				else
					n_bankers = 1;
			} else {
				return 1; // invalid format
			}
			
			if (ary3[1].indexOf('F') >= 0) {
				n_selections = func_get_field_size(dummy[0], race_no) - n_bankers;
			} else {
				n_selections = ary3[1].split('+').length;
			}
			
			if (tceFormula == "B") {
				n_combination = nPr(n_selections, ((n_bankers == 1) ? 2 : 1));
			} else if (tceFormula == "BM") {
				n_combination = nCr(n_selections, ((n_bankers == 1) ? 2 : 1)) * 6;
			}
			break; // B, BM
			
		case "M" :
			if (ary2[1].indexOf('F') >= 0) {
				n_selections = func_get_field_size(dummy[0], race_no);
			} else {
				n_selections = ary2[1].split('+').length;
			}
			n_combination = nPr(n_selections, 3);
			break; // M
			
		case "MB" :
			var aryBankers = new Array();
			var i, j, k, fieldsize;
			for (i = 0; i < 3; i++)
				aryBankers[i] = new Array();
			
			var ary3 = ary2[1].split('>');
			if (ary3.length != 3)
				return 1; // invalid format
			
			for (i = 0; i < ary3.length; i++) {
				if (ary3[i].indexOf('F') >= 0) {
					fieldsize = array_pooldef_fieldsize[dummy[0] + race_no];
					var k = 0;
					for (j = 1; j <= fieldsize; j++) {
						if ( !func_is_scratch_runner(dummy[0], race_no, j) )
  						aryBankers[i][k++] = j;
				  }
					continue;
				}
				
				var ary4 = ary3[i].split('+');
				for (j = 0; j < ary4.length; j++)
					aryBankers[i][j] = ary4[j];
			}
			
			n_combination = 0;
			for (i = 0; i < aryBankers[0].length; i++) {
				for (j = 0; j < aryBankers[1].length; j++) {
					if (aryBankers[0][i] == aryBankers[1][j])
						continue;
					for (k = 0; k < aryBankers[2].length; k++) {
						if (aryBankers[2][k] == aryBankers[0][i] || aryBankers[2][k] == aryBankers[1][j])
							continue;
						else
							n_combination++;
					}
				}
			}
			break; // MB
			
		default :
			n_combination = 1;
	} // SWITCH
	
	return n_combination;
}

//S 1*1+2+3+4 pass 1
//M 1*1+2+3+4 pass 24
//M 1*1+2+3+4+5 pass 120
//M 1*F pass 7920
//B 1*1>2+3+4 pass 6
//B 1*1>2+3+4+5 pass 24
//B 1*1>F pass 720
//B 1*1+2>3+4 pass 2
//B 1*1+2>3+4+5+6+7 pass 20
//B 1*1+2>F pass 72
//B 1*1+2+3>4+5+6 pass 3
//B 1*1+2+3>F pass 8
//BM 1*1>2+3+4+5 pass 96
//BM 1*1>2+3+4+5+6 pass 240
//BM 1*1>F pass 2880
//BM 1*1+2>3+4+5 pass 72
//BM 1*1+2>7+8+9+10+11 pass 240
//BM 1*1+2>F pass 864
//BM 1*1+2+3>4+5 pass 48
//BM 1*1+2+3>4+5+6+7+8 pass 120
//BM 1*1+2+3>F pass 192
//MB 1*1>2>3>4+5 pass 2
//MB 1*1>2>3>4+5+6+7 pass 4
//MB 1*1>4+5+6+7>2>3 pass 4
//MB 1*1>2+3+4+5>2>3 pass 2
//MB 1*1>4+5+6>3>2 pass 3
//MB 1*1>4+5+6+9>3>2 pass 4
//MB 1*4+5+6+9>4+5+6+9>4+5+6+9>4+5+6+9 pass 24
//MB 1*4+5+6+9>4+5+6+9>F>F pass 864
//MB 1*F>4+5+6>F>F pass 2160
//MB 1*F>F>F>F pass 7920
function func_calc_QTT_bet(inval) {
    var dummy = inval.split(" ");
    inval = dummy[dummy.length - 2] + " " + dummy[dummy.length - 1];

    var ary1 = inval.split(' ');
    if (ary1.length != 2)
        return 1; // invalid format
    var qttFormula = ary1[0];

    var ary2 = ary1[1].split("*");
    if (ary2.length != 2)
        return 1; // invalid format
    var race_no = parseInt(ary2[0]);

    var n_selections = 0;
    var n_bankers = 0;
    var n_combination = 1;
    switch (qttFormula) {
        case "B":
        case "BM":
            var ary3 = ary2[1].split('>');
            if (ary3.length == 2) {
                n_bankers = ary3[0].split('+').length;                    
            } else {
                return 1; // invalid format
            }

            if (ary3[1].indexOf('F') >= 0) {
                n_selections = func_get_field_size(dummy[0], race_no) - n_bankers;
            } else {
                n_selections = ary3[1].split('+').length;
            }

            if (qttFormula == "B") {
                n_combination = nPr(n_selections, 4 - n_bankers);
            } else if (qttFormula == "BM") {
                n_combination = nCr(n_selections, 4 - n_bankers) * 24;
            }
            break; // B, BM

        case "M":
            if (ary2[1].indexOf('F') >= 0) {
                n_selections = func_get_field_size(dummy[0], race_no);
            } else {
                n_selections = ary2[1].split('+').length;
            }
            n_combination = nPr(n_selections, 4);
            break; // M

        case "MB":
            var aryBankers = new Array();
            var i, j, k, l, fieldsize;
            for (i = 0; i < 4; i++)
                aryBankers[i] = new Array();

            var ary3 = ary2[1].split('>');
            if (ary3.length != 4)
                return 1; // invalid format

            for (i = 0; i < ary3.length; i++) {
                if (ary3[i].indexOf('F') >= 0) {
                    fieldsize = array_pooldef_fieldsize[dummy[0] + race_no];
                    var k = 0;
                    for (j = 1; j <= fieldsize; j++) {
                        if (!func_is_scratch_runner(dummy[0], race_no, j))
                            aryBankers[i][k++] = j;
                    }
                    continue;
                }

                var ary4 = ary3[i].split('+');
                for (j = 0; j < ary4.length; j++)
                    aryBankers[i][j] = ary4[j];
            }

            n_combination = 0;
            for (i = 0; i < aryBankers[0].length; i++) {
                for (j = 0; j < aryBankers[1].length; j++) {
                    if (aryBankers[0][i] == aryBankers[1][j])
                        continue;
                    for (k = 0; k < aryBankers[2].length; k++) {
                        if (aryBankers[2][k] == aryBankers[0][i] || aryBankers[2][k] == aryBankers[1][j])
                            continue;
                        for (l = 0; l < aryBankers[3].length; l++) {
                            if (aryBankers[3][l] == aryBankers[0][i] || aryBankers[3][l] == aryBankers[1][j] || aryBankers[3][l] == aryBankers[2][k])
                                continue;
                            else
                                n_combination++;
                        }
                    }
                }
            }
            break; // MB

        default:
            n_combination = 1;
    } // SWITCH

    return n_combination;
}

//ALUP 2X1/WIN 1*2+4/WIN 2*5+11 pass $40
//ALUP 2X3/WIN 1*2+4/WIN 2*5+11 pass $80
//ALUP 3X1/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2 pass $80
//ALUP 3X3/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2 pass $120
//ALUP 3X4/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2 pass $200
//ALUP 3X6/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2 pass $180
//ALUP 3X7/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2 pass $260
//ALUP 4X1/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $160
//ALUP 4X4/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $320
//ALUP 4X5/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $480
//ALUP 4X6/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $240
//ALUP 4X10/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $320
//ALUP 4X11/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $720
//ALUP 4X14/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $640
//ALUP 4X15/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $800
//ALUP 5X1/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $320
//ALUP 5X5/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $800
//ALUP 5X6/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $1120
//ALUP 5X10/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $400
//ALUP 5X15/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $500
//ALUP 5X16/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $1920
//ALUP 5X20/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $1200
//ALUP 5X25/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $1300
//ALUP 5X26/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $2320
//ALUP 5X30/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $2100
//ALUP 5X31/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $2420
//ALUP 6X1/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $640
//ALUP 6X6/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $1920
//ALUP 6X7/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $2560
//ALUP 6X15/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $600
//ALUP 6X20/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $1600
//ALUP 6X21/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $720
//ALUP 6X22/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $4960
//ALUP 6X35/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $2200
//ALUP 6X41/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $2320
//ALUP 6X42/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $6560
//ALUP 6X50/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $4600
//ALUP 6X56/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $4720
//ALUP 6X57/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $7160
//ALUP 6X62/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $6640
//ALUP 6X63/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 pass $7280
//ALUP 7X1/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 7X7/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 7X8/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 7X21/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 7X35/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 7X120/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 7X127/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X1/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X8/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X9/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X28/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X56/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X70/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X247/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 8X255/WIN 1*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2/WIN 2*1+2 $
//ALUP 2X1/WIN 1*2+4/WIN 2*5 pass $20
//ALUP 2X3/WIN 1*2+4/WIN 2*5 pass $50
function func_calc_HR_ALUP_bet(inval)
{
	var dummy = inval.split(" ");
	inval = dummy[3];
	for (var i = 4; i < dummy.length; i++)
		inval += " " + dummy[i];

	var ary1 = inval.split('/');
	if (ary1.length < 3)
		return 1; // invalid format
	
	var formula = ary1[0];
	var formulaIndex;
	var i;
	for (i = 0; i < array_hr_allupFormula.length; i++) {
		if (formula == array_hr_allupFormula[i]) {
			formulaIndex = i;
			break;
		}
	}
	
	var n_combinations = new Array();
	for (i = 1; i < ary1.length; i++) {
		var ary2 = ary1[i].split(' ');
		// dummy[0] is the venue
		n_combinations[i - 1] = func_calc_rc_num_of_bet(dummy[0] + ' ' + ary2[1], ary2[0]);
	}

	var n_alup_combination = 0;
	for (i = 0; i < array_hr_allupEnable.length; i++) {
		if (array_hr_allupEnable[i][formulaIndex])
			n_alup_combination += CalAllupCombination(i + 1, ary1.length - 1, n_combinations);
	}
	
	return n_alup_combination;
}

function CalAllupCombination(level, numOfLeg, combNum)
{
	var idx1, idx2, idx3, idx4, idx5, idx6, idx7, idx8;
	var retCombNum = 0;

	if (level > numOfLeg)
		return -1;

	//	level = numOfLeg -> Only 2x1.....8x1 need to be calculated
	if (level == numOfLeg)
	{
		retCombNum = 1;
		for (idx1 = 0; idx1 < numOfLeg; idx1++)
			retCombNum *= combNum[idx1];
		return retCombNum;
	}

	for(idx1 = 0; idx1 < numOfLeg; idx1++){
		if (level == 1) {
			retCombNum += combNum[idx1];
		} else {
			for(idx2 = idx1 + 1; idx2 < numOfLeg; idx2++){
				if (level == 2) {
					retCombNum += combNum[idx1] * combNum[idx2];
				} else {
					for(idx3 = idx2 + 1; idx3 < numOfLeg; idx3++){
						if (level == 3) {
							retCombNum += combNum[idx1] * combNum[idx2] * combNum[idx3];
						} else {
							for(idx4 = idx3 + 1; idx4 < numOfLeg; idx4++){
								if (level == 4) {
									retCombNum += combNum[idx1] * combNum[idx2] * combNum[idx3] * combNum[idx4];
								} else {
									for(idx5 = idx4 + 1; idx5 < numOfLeg; idx5++){
										if (level == 5) {
											retCombNum += combNum[idx1] * combNum[idx2] * combNum[idx3] * combNum[idx4] * combNum[idx5];
										} else {
											for(idx6 = idx5 + 1; idx6 < numOfLeg; idx6++){
												if (level == 6) {
													retCombNum += combNum[idx1] * combNum[idx2] * combNum[idx3] * combNum[idx4]* combNum[idx5] * combNum[idx6];
												} else {
													for(idx7 = idx6 + 1; idx7 < numOfLeg; idx7++){
														if (level == 7) {
															retCombNum += combNum[idx1] * combNum[idx2] * combNum[idx3] * combNum[idx4] * combNum[idx5] * combNum[idx6] * combNum[idx7];
														} else {
															for(idx8 = idx7 + 1; idx8 < numOfLeg; idx8++){
																retCombNum += combNum[idx1] * combNum[idx2] * combNum[idx3] * combNum[idx4] * combNum[idx5] * combNum[idx6] * combNum[idx7] * combNum[idx8];
															}
														} // if (level == 7)
													}
												} // if (level == 6)
											}
										} // if (level == 5)
									}
								} // if (level == 4)
							}
						} // if (level == 3)
					}
				} // if (level == 2)
			}
		} // if (level == 1)
	}

	return retCombNum;
}


//****************************************************************
//****************************************************************
//****************************************************************
function BetCalcMK6(betline, type) {
	var dummy1, dummy2, dummy3;
	var multiDrawDays;
	var selPart;
	var numOfBankers, numOfSelections;
	var maxMarkSixNo = MyParseInt(GetPara("MaxMarkSixNo"), 49);

	dummy1 = betline.split(" ");
	if (dummy1.length >= 3) {
		if (dummy1[1].substring(dummy1[1].length - 1) == "D") {
			multiDrawDays = dummy1[1].substring(0, dummy1[1].length - 1);
			selPart = dummy1[2];
		}
	} else {
		multiDrawDays = 1;
		selPart = dummy1[1];
	}

	numOfBankers = 0;
	if (selPart.indexOf(">") > 0) {
		dummy2 = selPart.split(">");
		numOfBankers = dummy2[0].split("+").length;
		selPart = dummy2[1];
	}

	if (selPart.indexOf("F") >= 0) {
		return (multiDrawDays * nCr(maxMarkSixNo - numOfBankers, 6 - numOfBankers));
	}
	return (multiDrawDays * nCr(selPart.split("+").length, 6 - numOfBankers));
}

function nCr( n , r) {
	return Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
}

function nPr(n, r) {
	return Math.round(factorial(n) / factorial(n - r));
}

function factorial(n) {
    if (n <= 1)
		return 1;
    var ans = 1;
    for (var i = 2; i <= n; i++){
        ans *= i;
    }
    return ans;
}


function func_calc_hb_fixed_odds_num_of_bet(inval_pool, inval_betline) {
	var parts = inval_betline.split(" ");
	switch(inval_pool.toUpperCase()) {
		case "JKC" : return func_calc_hb_fixed_odds_bet(parts[3]);
	}
	return 1;
}

function func_calc_hb_fixed_odds_bet(inval) {
		return inval.split('+').length ;
}

function isSingleM6Bet(betObj) {
  if (betObj.family != 'MK6')
    return false;

  var dummy1, dummy2, dummy3;
  var multiDrawDays;
  var selPart;
  var numOfBankers, numOfSelections;
  var maxMarkSixNo = MyParseInt(GetPara('MaxMarkSixNo'), 49);

  dummy1 = betObj.betline.split(' ');
  if (dummy1.length >= 3) {
    if (dummy1[1].substring(dummy1[1].length - 1) == 'D') {
      multiDrawDays = dummy1[1].substring(0, dummy1[1].length - 1);
      selPart = dummy1[2];
    }
  } else {
    multiDrawDays = 1;
    selPart = dummy1[1];
  }

  numOfBankers = 0;
  if (selPart.indexOf('>') > 0) {
    dummy2 = selPart.split('>');
    numOfBankers = dummy2[0].split('+').length;
    selPart = dummy2[1];
  }

  var betCnt;
  if (selPart.indexOf('F') >= 0)
    betCnt =(nCr(maxMarkSixNo - numOfBankers, 6 - numOfBankers));
  else
    betCnt = (nCr(selPart.split('+').length, 6 - numOfBankers));

  return (betCnt == 1);
}