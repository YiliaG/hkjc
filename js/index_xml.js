var object_label = new Array("allupformula", "bonus", "scbinfo", "pooldef", "scratchrunner", "bwadef");
var xml_event_seq = new Array();
for (var i = 0; i < object_label.length; i++) {
	xml_event_seq[object_label[i]] = "";
}

var ihub_map = new Array();
ihub_map["ADTP"] = "ADT";
ihub_map["DHCP"] = "DHC";
ihub_map["FHAD"] = "FHA";
ihub_map["HCSP"] = "HCS";
ihub_map["HFMP"] = "HFM";
ihub_map["HFMP6"] = "HFM";
ihub_map["HFMP8"] = "HFM";
ihub_map["HHAD"] = "HHA";
ihub_map["HILO"] = "HIL";
ihub_map["THFP"] = "THF";
ihub_map["TOFP"] = "TOF";

function GetIHubMapping(betType) {
	if (ihub_map[betType] != undefined)
		return ihub_map[betType];
	return betType;
}

//********************************************************************************
// allupformula
var AllUpFormula = new Array();
//********************************************************************************
function SetXML_allupformula(label, doc) {
	if (doc == null)
		return false;
	
	try {
	    var browser=navigator.userAgent.toLowerCase();
	    if (browser.indexOf('msie 9') > -1 || browser.indexOf('msie 8') > -1) {
            var query = doc.selectNodes("ALLUP_FORMULA/POOL");
		    for (var i = 0; i < query.length; i++) {
			    var pool = new Array();
			    var type = query[i].selectNodes("@TYPE")[0].text;
			    var xpool = query[i].selectNodes("@XPOOL_BET")[0].text;
			    pool["XPOOL_BET"] = xpool;
			    var query2 = query[i].selectNodes("ALLUP");
			    for (var j = 0; j < query2.length; j++) {
				    var formula = query2[j].selectNodes("@FORMULA")[0].text;
				    pool[formula] = query2[j].text;
			    }
			    AllUpFormula[type] = pool;
			    if (type == "FHL") {
                    AllUpFormula["FHLO"] = pool;
                } else if (type == "FCS") {
                    AllUpFormula["FCRS"] = pool;
                } else if (type == "CHL") {
                    AllUpFormula["CHLO"] = pool;
                }
		    }
		    query = doc.selectSingleNode("ALLUP_FORMULA");
		    xml_event_seq[label] = query.selectSingleNode("@updateDate").text + " "
							     + query.selectSingleNode("@updateTime").text;

	    } else {
	        var query = doc.getElementsByTagName("ALLUP_FORMULA");

	        if (query.length > 0) {
	            var updateDate = query[0].getAttribute("updateDate");
	            var updateTime = query[0].getAttribute("updateTime");
	            xml_event_seq[label] = updateDate + " " + updateTime;

	            var query = doc.getElementsByTagName("POOL");
	            for (var i = 0; i < query.length; i++) {
	                var pool = new Array();
	                var type = query[i].getAttribute("TYPE");
	                var xpool = query[i].getAttribute("XPOOL_BET");
	                pool["XPOOL_BET"] = xpool;
	                var query2 = query[i].getElementsByTagName("ALLUP");
	                for (var j = 0; j < query2.length; j++) {
	                    var formula = query2[j].getAttribute("FORMULA");
	                    pool[formula] = query2[j].textContent;
	                }
	                AllUpFormula[type] = pool;
	                if (type == "FHL") {
	                    AllUpFormula["FHLO"] = pool;
	                } else if (type == "FCS") {
	                    AllUpFormula["FCRS"] = pool;
	                } else if (type == "CHL") {
	                    AllUpFormula["CHLO"] = pool;
	                }
	            }
	        }
	    }
		
		/*
		var query = doc.selectNodes("ALLUP_FORMULA/POOL");
		for (var i = 0; i < query.length; i++) {
			var pool = new Array();
			var type = query[i].selectNodes("@TYPE")[0].text;
			var xpool = query[i].selectNodes("@XPOOL_BET")[0].text;
			pool["XPOOL_BET"] = xpool;
			var query2 = query[i].selectNodes("ALLUP");
			for (var j = 0; j < query2.length; j++) {
				var formula = query2[j].selectNodes("@FORMULA")[0].text;
				pool[formula] = query2[j].text;
			}
			AllUpFormula[type] = pool;
		}
		query = doc.selectSingleNode("ALLUP_FORMULA");
		xml_event_seq[label] = query.selectSingleNode("@updateDate").text + " "
							 + query.selectSingleNode("@updateTime").text;
		*/
	} catch (e) {
		return false;
	}
	return true;
}

function func_search_allup_xml(betType, formula) {
	betType = GetIHubMapping(betType);
	formula = formula.toUpperCase();
	var formulaEnableFlag;
	try {
		formulaEnableFlag = AllUpFormula[betType][formula];
	} catch (e) {
		return 0;
	}
	if (formulaEnableFlag == undefined || formulaEnableFlag == "")
		return 0;
	return formulaEnableFlag;
}

//********************************************************************************
// bonus
var Bonus = new Array();
//********************************************************************************
function SetXML_bonus(label, doc) {
	if (doc == null)
		return false;
	
	try {
		var query = doc.selectNodes("BONUS/POOL");
		var singlePoolBonus = new Array();
		var typeName;
		for (var i = 0; i < query.length; i++) {
			typeName = query[i].selectNodes("@TYPE")[0].text;
			singlePoolBonus[typeName] = query[i].text;
		}
		Bonus[1] = singlePoolBonus;
		
		var query = doc.selectNodes("BONUS/CROSS_POOL/ALLUP");
		var xPoolBonus = new Array();
		var allupLevel, levelValue;
		for (var i = 0; i < query.length; i++) {
			allupLevel = query[i].selectNodes("@EVENT")[0].text;
			xPoolBonus[allupLevel] = query[i].text;
		}
		Bonus["x"] = xPoolBonus;
		
		query = doc.selectNodes("BONUS/ALLUP");
		for (var i = 0; i < query.length; i++) {
			var level = query[i].selectNodes("@EVENT")[0].text;
			level = parseInt(level);
			var query2 = query[i].selectNodes("POOL");
			var levelBonus = new Array();
			var typeName;
			for (var j = 0; j < query2.length; j++) {
				typeName = query2[j].selectNodes("@TYPE")[0].text;
				levelBonus[typeName] = query2[j].text;
			}
			Bonus[level] = levelBonus;
		}

		query = doc.selectSingleNode("BONUS");
		xml_event_seq[label] = query.selectSingleNode("@updateDate").text + " "
							 + query.selectSingleNode("@updateTime").text;
	} catch (e) {
		Bonus = new Array();
		return false;
	}
	return true;
}

function func_search_bonus(betType, level) {
	betType = GetIHubMapping(betType);
	var bonus;
	try {
		if (betType == "x")
			bonus = Bonus[betType][level];
		else
			bonus = Bonus[level][betType];
	} catch (e) {
		return 0;
	}
	if (bonus == undefined || bonus == "")
		return 0;
	return bonus;
}

/********************************************************************************
scbinfo
********************************************************************************/
var array_setcion_4X1			= new Array() ;	// 4X1 Bonus
var array_setcion_8X1			= new Array() ;	// 8X1 Bonus

var string_4X1 = "4X1" ;
var string_8X1 = "8X1" ;

var string_4X1_enable = "" ;
var string_8X1_enable = "" ;

var string_4X1_maxpay = "" ;
var string_8X1_maxpay = "" ;

// **********************************************************
// Set XML obj for section bet bonus
function func_set_xml_section_bet( doc ) 
{
	try
	{
		//	var doc = xmlData.XMLDocument;
		// Set Section Bet Event Sequence Number
		string_sectionbet_cnrevent_seq =  doc.selectSingleNode("/SECTION_BET_INFO/EVENT_SEQ").text ;
		
		// Get the section bet enable
		string_4X1_enable = doc.selectNodes("/SECTION_BET_INFO/BET_LEVEL[@TYPE='"+ string_4X1 +"']")[0].text ;
		string_8X1_enable = doc.selectNodes("/SECTION_BET_INFO/BET_LEVEL[@TYPE='"+ string_8X1 +"']")[0].text ;
		// Get the section bet max payout
		string_4X1_maxpay = doc.selectNodes("/SECTION_BET_INFO/MAX_PAYOUT[@TYPE='"+ string_4X1 +"'][@ENABLE='1']")[0].text ;
		string_8X1_maxpay = doc.selectNodes("/SECTION_BET_INFO/MAX_PAYOUT[@TYPE='"+ string_8X1 +"'][@ENABLE='1']")[0].text ;

		// Set Section num
		query = doc.selectNodes("/SECTION_BET_INFO/SET") ;	
		for(var i=0;i<query.length;i++)
		{
			temp_type = query[i].selectNodes("@NUM")[0].text ;
			// Get the 4X1 Bonus
			var string_temp = doc.selectNodes("/SECTION_BET_INFO/SET[@NUM='"+ temp_type +"']/BONUS[@TYPE='"+ string_4X1 +"'] ")[0].text ;
			array_setcion_4X1[temp_type] = parseInt(string_temp)/100 ;
			// Get the 8X1 Bonus
			var string_temp = doc.selectNodes("/SECTION_BET_INFO/SET[@NUM='"+ temp_type +"']/BONUS[@TYPE='"+ string_8X1 +"'] ")[0].text ;
			array_setcion_8X1[temp_type] = parseInt(string_temp)/100 ;
		}
		return true ;	
	}
	catch (e) { return false ;	}
}

// **********************************************************
// *** Search Section Bet Bonus Value BY Section Bet ID Number  , and Allup 4 or 8 ***
function func_search_section_bet(inval_setcion_num, inval_allup)
{
	var int_return_value = 0 ;			// default no bonus
	
	try
	{	// check is 4X1
		if ((inval_allup).toString() == "4")
		{
			if (string_4X1_enable == "1")	// Bonus is Enable
			{
				if (array_setcion_4X1[inval_setcion_num] != undefined)	// is defined bonus value
				{	int_return_value = array_setcion_4X1[inval_setcion_num] ;	}
			}
		}
		else if ((inval_allup).toString() == "8")	// Check is 8X1
		{
			if (string_8X1_enable == "1")	// Bonus is Enable
			{
				if (array_setcion_8X1[inval_setcion_num] != undefined)	// is defined bonus value
				{	int_return_value = array_setcion_8X1[inval_setcion_num] ;	}
			}
		}	
		return int_return_value ;	
	}
	catch (e)	
	{	return int_return_value ;	}		
}