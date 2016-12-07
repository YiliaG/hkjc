var bs_error = 0;
var pushAllupFormulaXML = 0; // 0 = not push the xml to betslip yet, 1 = pushed already, dont push again
var pushBonusXML = 0;
var allPushed = 0 // all XML files are pushed to betslip already
var askEwin = 0; //only ask one time for multiple selection
var dhcpSelArr = new Array();
dhcpSelArr = ['1:0','2:0','2:1','3:0','3:1','3:2','4:0','4:1','4:2','5:0','5:1','5:2','10:10','0:0','1:1','2:2','3:3','10:10','0:1','0:2','1:2','0:3','1:3','2:3','0:4','1:4','2:4','0:5','1:5','2:5','10:10'];
var noOfBet1 = 0;
var noOfBet2 = 0;

function calDHCP(){
    var disabled=true ;
    for(var i=0;i<4;i++){
        if(!$("input[type=checkbox][name=chk_"+i+"]:eq(0)").attr("disabled")){
            disabled =false ;
        }
    }
    if(disabled){
        return false ;
    }
    var val = $("input[name=unitBetTxt]:eq(0)").val();
    if(val=="" || isNaN(val) || parseInt(val)<=0){
        return false ;
    }
	var dhcpArr = new Array();
	newset = 0
	noOfBet1 = 0;
	noOfBet2 = 0;
	
	for (var i=0;i<4;i++){
	    newset = 0;		
		for (var j=0;j<32;j++) {
		    var obj = $("input[type=checkbox][name=chk_" + i + "]")[j];
			var tvalue;
			if (($(obj).attr("disabled")) || ($(obj).attr("checked"))) {
			    if ($(obj).attr("disabled")) {
					tvalue = "V";
					j = 32;
					if(i==0 || i == 1)
						noOfBet1 = 1;
					else
						noOfBet2 = 1;
				} else {						
					tvalue = $(obj).val();			
				}
				if ((i == 1 || i == 3)) {
				    if (tvalue == "HO") {
						lvalue = 10;
						rvalue = 10;
					} else if (tvalue == "DO") {
						lvalue = 10;
						rvalue = 10;							
					} else if (tvalue == "AO") {
						lvalue = 10;
						rvalue = 10;
					} else if (tvalue == "F") {
						lvalue = "F";
						rvalue = "F";
					} else if (tvalue == "V") {
						lvalue = "V";
						rvalue = "V";
					} else {
						lvalue = tvalue.split(":")[0];
						rvalue = tvalue.split(":")[1];
					}
					
					if(dhcpArr[i-1] != null){
					    for (var k=0;k<dhcpArr[i-1].length;k++) {	
							if (dhcpArr[i-1][k] == "HO") {
								lvalue2 = 10;
								rvalue2 = 10;
							} else if (dhcpArr[i-1][k] == "DO") {
								lvalue2 = 10;
								rvalue2 = 10;							
							} else if (dhcpArr[i-1][k] == "AO") {
								lvalue2 = 10;
								rvalue2 = 10;
							} else  if (dhcpArr[i-1][k] == "F") {
								lvalue2 = "F";
								rvalue2 = "F";
							} else if (tvalue == "V") {
								lvalue2 = "V";
								rvalue2 = "V";
							} else {
								lvalue2 = dhcpArr[i-1][k].split(":")[0];	
								rvalue2 = dhcpArr[i-1][k].split(":")[1];	
							}	
							
							if (lvalue == "F" || lvalue2 == "F" || rvalue == "F" || rvalue2 == "F")	{							
									if (tvalue == "F") {
										for (var m=0;m<dhcpSelArr.length;m++) {
											lvalue_tmp = dhcpSelArr[m].split(":")[0];
											rvalue_tmp = dhcpSelArr[m].split(":")[1];
											
											if (dhcpArr[i-1][k] == "F") {
												for (var n = 0;n<dhcpSelArr.length;n++) {
													lvalue2_tmp = dhcpSelArr[n].split(":")[0]
													rvalue2_tmp = dhcpSelArr[n].split(":")[1]
													getNoOfBet(i, lvalue_tmp, rvalue_tmp, lvalue2_tmp, rvalue2_tmp);
												}
											} else {
												getNoOfBet(i, lvalue_tmp, rvalue_tmp, lvalue2, rvalue2);
											}
										}
									} else {
										for (var m=0;m<dhcpSelArr.length;m++) {
											lvalue2 = dhcpSelArr[m].split(":")[0];
											rvalue2 = dhcpSelArr[m].split(":")[1];
											if (tvalue == "F") {
												for (var n = 0;n<dhcpSelArr.length;n++) {
													lvalue = dhcpSelArr[n].split(":")[0]
													rvalue = dhcpSelArr[n].split(":")[1]
													getNoOfBet(i, lvalue, rvalue, lvalue2, rvalue2);
												}
											} else {
												getNoOfBet(i, lvalue, rvalue, lvalue2, rvalue2);
											}
										}
									}
								
							} else {
								getNoOfBet(i, lvalue, rvalue, lvalue2, rvalue2);
							}
						}//for k
					}//for dhcpArr[i-1] != null
				}//for i==1 or i==3
				if (newset == 0) {
					dhcpArr[i] = [tvalue];						
					newset = 1;
				} else {						
					dhcpArr[i] = dhcpArr[i].concat(tvalue)
				}	
			}//for obj.disabled or obj.checked
		}//for j
	}//for i
	var v_noOfBet = noOfBet1 * noOfBet2;
	var v_unitBet = $("input[name=unitBetTxt]:eq(0)").val();
	var v_totalInv = (v_noOfBet * parseInt(v_unitBet));
	
	var v_unitBet = "$" + FormatNumber(v_unitBet, 1, false, false, true);
	var v_totalInv = "$" + FormatNumber(v_totalInv, 1, false, false, true)
	
	displayBet(v_noOfBet, v_unitBet, v_totalInv);	
}
function displayBet(noOfBet, unitBet, totalInv) {
    $("div[name=noOfBet]").each(function() {
        $(this).html(noOfBet);
    });
    $("div[name=unitBet]").each(function() {
        $(this).html(unitBet);
    });
    $("div[name=totalInvestment]").each(function() {
        $(this).html(totalInv);
    });
}
function setUnitBet() {
    var val=getDefaultAmount();
    $("input[name=unitBetTxt]").each(function() {
        $(this).val(val);
    });
}
			
function getNoOfBet(i, lv, rv, lv2, rv2, a) {
	if (parseInt(lv2) <= parseInt(lv) && parseInt(rv2) <= parseInt(rv)) {		
		if (i==1) 
			noOfBet1++;
		else 
			noOfBet2++;																
	}
}

function clearDHCP() {
	setUnitBet(getDefaultAmount());
	displayBet("-", "-", "-");
}


function chkAmount(amt1, amt2) {
	var errno = 0;
	if (amt1 == '' || amt2 == '')
		errno = 1;
	
	if (isNaN(amt1) || isNaN(amt2))
		errno = 2;
		
	if ((parseInt(amt1) != amt1) || (parseInt(amt2) != amt2))
		errno = 3;
		
	if (amt1 < 0 || amt2 < 0) 
		errno = 4;
	 
	if (errno > 0)
		return false;
	else
		return true;
}
function addSlip() {
    //xsell event
    xsell_event(9);
    
	var dhcpArr = new Array();
	var tstr = "";
	var BSreturnVal;
	newset = 0
	bs_error = 0;
	var disabled=true ;
    for(var i=0;i<4;i++){
        if(!$("input[type=checkbox][name=chk_"+i+"]")[0].disabled){
            disabled =false;
        }
    }
    if(disabled){
        return false ;
    }
    var val = $("input[name=unitBetTxt]:eq(0)").val();
    var val2 = $("input[name=unitBetTxt]:eq(1)").val();
    
	if (!chkAmount(val,val2)) {
	    alert((jsLang == "CH" ? "投注金額不正確" : "Invalid amount input"))
		return false;
	}
	atLeastOneBetIsCorrect1 = 0;
	atLeastOneBetIsCorrect2 = 0;
	
	
	for (var i=0;i<4;i++) {							
		if (i==1 || i==3)
			tstr += "#";
		if (i==2)
			tstr += "http://bet.hkjc.com/";	
		newset = 0;		
		for (var j=0;j<32;j++) {
		    var obj = $("input[type=checkbox][name=chk_" + i + "]")[j];
		    if (($(obj).attr("disabled")) || ($(obj).attr("checked"))) {
		        if ($(obj).attr("disabled")) {
					tvalue = "V";
					j = 32;
				} else						
					tvalue = $(obj).val();						
				if ((i == 1 || i == 3)) {
					
					if (tvalue == "HO") {
						lvalue = 10;
						rvalue = 10;
					} else if (tvalue == "DO") {
						lvalue = 10;
						rvalue = 10;							
					} else if (tvalue == "AO") {
						lvalue = 10;
						rvalue = 10;
					} else if (tvalue == "F") {
						lvalue = "F";
						rvalue = "F";
					} else if (tvalue == "V") {
						lvalue = "V";
						rvalue = "V";
					} else {
						lvalue = tvalue.split(":")[0];
						rvalue = tvalue.split(":")[1];
					}
					
					for (var k=0;k<dhcpArr[i-1].length;k++) {	
						if (dhcpArr[i-1][k] == "HO") {
							lvalue2 = 10;
							rvalue2 = 10;
						} else if (dhcpArr[i-1][k] == "DO") {
							lvalue2 = 10;
							rvalue2 = 10;							
						} else if (dhcpArr[i-1][k] == "AO") {
							lvalue2 = 10;
							rvalue2 = 10;
						} else  if (dhcpArr[i-1][k] == "F") {
							lvalue2 = "F";
							rvalue2 = "F";
						} else if (tvalue == "V") {
							lvalue2 = "V";
							rvalue2 = "V";
						} else {
							lvalue2 = dhcpArr[i-1][k].split(":")[0];	
							rvalue2 = dhcpArr[i-1][k].split(":")[1];	
						}																		
							
						if (lvalue == "F" || lvalue2 == "F" || rvalue == "F" || rvalue2 == "F")	{
							if (i == 1)
								atLeastOneBetIsCorrect1 = 1;
							else if (i == 3)
								atLeastOneBetIsCorrect2 = 1;
						} else {
							if (lvalue2 > lvalue || rvalue2 > rvalue) {								
								bs_error = 1;								
							} else {
								if (i == 1) {
									atLeastOneBetIsCorrect1 = 1;									
								} else if (i == 3) {
									atLeastOneBetIsCorrect2 = 1;									
								}
							}						
						}
					}							
				}
				if (newset == 0) {
					dhcpArr[i] = [tvalue];	
					if (tvalue == "F")
						tstr += tvalue
					else						
						tstr += "(" + tvalue + ")"
					newset = 1;
				} else {
					if (tvalue == "F")
						tstr += "+" + tvalue
					else
						tstr += "+(" + tvalue + ")"
						
					dhcpArr[i] = dhcpArr[i].concat(tvalue)
				}									
			}
		} // for j
		if (!dhcpArr[i]) {
			alert((jsLang=="CH"?"選擇不正確":"Illegal selection"))
			bs_error = 1;
			return false;					
		}
		
	}
	if (atLeastOneBetIsCorrect1 == 0 || atLeastOneBetIsCorrect2 == 0) {
		alert((jsLang=="CH"?"選擇不正確":"Illegal selection"))
		return false;
	}
	
	comp0 = tstr.split("http://bet.hkjc.com/")[0];
	comp1 = tstr.split("http://bet.hkjc.com/")[1];
	if (jsLang == "CH") {
		while (comp0.indexOf("F") >= 0)
			comp0 = comp0.replace("F", "全餐")
		while (comp1.indexOf("F") >= 0)
			comp1 = comp1.replace("F", "全餐")
		while (comp0.indexOf("HO") >= 0)
			comp0 = comp0.replace("HO", "主 其他")
		while (comp1.indexOf("HO") >= 0)
			comp1 = comp1.replace("HO", "主 其他")	
		while (comp0.indexOf("AO") >= 0)
			comp0 = comp0.replace("AO", "客 其他")
		while (comp1.indexOf("AO") >= 0)
			comp1 = comp1.replace("AO", "客 其他")
		while (comp0.indexOf("DO") >= 0)
			comp0 = comp0.replace("DO", "和 其他")
		while (comp1.indexOf("DO") >= 0)
			comp1 = comp1.replace("DO", "和 其他");

betLine1 = 'FB DHCP ' + matchDay1 + ' ' + matchNum1 + '*' + tstr + ' $' + $("input[name=unitBetTxt]:eq(0)").val();
		// Q109 format bet line by Linus
		betLine2 = '孖寶半全膽<BR>' + longweekname(matchDay1) + ' ' + matchNum1 + '<BR>' + removeApos(hTeam1,'b') + ' (主) 對 ' + removeApos(aTeam1,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + comp0.replace('(V)#(V)', '(無效)#(無效)') + '</span><BR>';
		betLine2 += longweekname(matchDay2) + ' ' + matchNum2 +  '<BR>' + removeApos(hTeam2,'b') + ' (主) 對 ' + removeApos(aTeam2,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + comp1.replace('(V)#(V)', '(無效)#(無效)') + '</span>' + '<BR>' + '<BR>';
		betLine3 = '孖寶半全膽 ' + longweekname(matchDay1) + ' ' + matchNum1		
		betLine4 = comp0.replace('(V)#(V)', '(無效)#(無效)') + "/" + comp1.replace('(V)#(V)', '(無效)#(無效)');				
	} else {
		while (comp0.indexOf("F") >= 0)
			comp0 = comp0.replace("F", "ALL")
		while (comp1.indexOf("F") >= 0)
			comp1 = comp1.replace("F", "ALL")	
		while (comp0.indexOf("ALL") >= 0)
			comp0 = comp0.replace("ALL", "FIELD")
		while (comp1.indexOf("ALL") >= 0)
			comp1 = comp1.replace("ALL", "FIELD")
			
		while (comp0.indexOf("HO") >= 0)
			comp0 = comp0.replace("HO", "HA")
		while (comp1.indexOf("HO") >= 0)
			comp1 = comp1.replace("HO", "HA")
		while (comp0.indexOf("HA") >= 0)
			comp0 = comp0.replace("HA", "HOME OTHERS")
		while (comp1.indexOf("HA") >= 0)
			comp1 = comp1.replace("HA", "HOME OTHERS")
		while (comp0.indexOf("AO") >= 0)
			comp0 = comp0.replace("AO", "AWAY OTHERS")
		while (comp1.indexOf("AO") >= 0)
			comp1 = comp1.replace("AO", "AWAY OTHERS")
		while (comp0.indexOf("DO") >= 0)
			comp0 = comp0.replace("DO", "DRAW OTHERS")
		while (comp1.indexOf("DO") >= 0)
			comp1 = comp1.replace("DO", "DRAW OTHERS")

        betLine1 = 'FB DHCP ' + matchDay1 + ' ' + matchNum1 + '*' + tstr + ' $' + $("input[name=unitBetTxt]:eq(0)").val();
		// Q109 format bet line by Linus
		betLine2 = 'Double HaFu Score<BR>' + longweekname(matchDay1) + ' ' + matchNum1 + '<BR>' + removeApos(hTeam1,'b') + ' (Home) vs ' + removeApos(aTeam1,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + comp0.replace('(V)#(V)', '(VOID)#(VOID)') + '<span><BR>'
		betLine2 += longweekname(matchDay2) + ' ' + matchNum2 +  '<BR>' + removeApos(hTeam2,'b') + ' (Home) vs ' + removeApos(aTeam2,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + comp1.replace('(V)#(V)', '(VOID)#(VOID)') + '</span>' + '<BR>' + '<BR>';
		betLine3 = 'FB DHCP ' + matchDay1 + ' ' + matchNum1;
		betLine4 = comp0.replace('(V)#(V)', '(VOID)#(VOID)') + "/" + comp1.replace('(V)#(V)', '(VOID)#(VOID)');
	}
		
	if (enableBSinDev) {
		alert(betLine1 + '\n' + betLine2 + '\n' + betLine3 + '\n' + betLine4)
		BSreturnVal = 1;
    } else {
        try {
            document.domain = jsDOMAIN;
            BSreturnVal = top.betSlipFrame.addSelEx(betLine1, betLine2, betLine3, betLine4, 0, 0, '', '', '', '');
		} catch (ex) {
			BSreturnVal = 0;
		}
		
	}
	// SQ42743 DHCP handling when bet buffer full
	if (atLeastOneBetIsCorrect1 == 1 && atLeastOneBetIsCorrect2 == 1 && BSreturnVal == 1) {
		if (allPushed == 0 && askEwin == 0) {
			eWinChecking();					
			askEwin = 1;
		}
		
		clearDHCP();
		changeAll();
	}
}

function changeAll() {
    $("input:checked").each(function() {
        $(this).attr("checked", false);
        $(this).parent().removeClass("checkedOdds");
        $(this).parent().prev().removeClass("checkedOdds");
        if ($(this).val() == "F") {
            $(this).parent().siblings().each(function() {
                $(this).removeClass("checkedOdds");
            });
        }
    });
}

function longweekname(shortWeekName) {
	switch (shortWeekName) {
		case "MON":
			return (jsLang=="CH"?"星期一":"MON");
			break;
		case "TUE":
			return (jsLang=="CH"?"星期二":"TUE");
			break;
		case "WED":
			return (jsLang=="CH"?"星期三":"WED");
			break;
		case "THU":
			return (jsLang=="CH"?"星期四":"THU");
			break;
		case "FRI":
			return (jsLang=="CH"?"星期五":"FRI");
			break;
		case "SAT":
			return (jsLang=="CH"?"星期六":"SAT");
			break;
		case "SUN":
			return (jsLang=="CH"?"星期日":"SUN");
			break
	}
}
function resetLogout() {	
	try {
		top.betSlipFrame.resetIdleTimer()
	} catch(ex) {}
	
}

function FormatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas)
/**********************************************************************
	IN:
		NUM - the number to format
		decimalNum - the number of decimal places to format the number to
		bolLeadingZero - true / false - display a leading zero for
										numbers between -1 and 1
		bolParens - true / false - use parenthesis around negative numbers
		bolCommas - put commas as number separators.
 
	RETVAL:
		The formatted number!
 **********************************************************************/
{ 
        if (isNaN(parseInt(num))) return "NaN";

	var tmpNum = num;
	var iSign = num < 0 ? -1 : 1;		// Get sign of number
	
	// Adjust number so only the specified number of numbers after
	// the decimal point are shown.
	tmpNum *= Math.pow(10,decimalNum);
	tmpNum = Math.round(Math.abs(tmpNum))
	tmpNum /= Math.pow(10,decimalNum);
	tmpNum *= iSign;					// Readjust for sign
	
	
	// Create a string object to do our formatting on
	var tmpNumStr = new String(tmpNum);

	// See if we need to strip out the leading zero or not.
	if (!bolLeadingZero && num < 1 && num > -1 && num != 0)
		if (num > 0)
			tmpNumStr = tmpNumStr.substring(1,tmpNumStr.length);
		else
			tmpNumStr = "-" + tmpNumStr.substring(2,tmpNumStr.length);
		
	// See if we need to put in the commas
	if (bolCommas && (num >= 1000 || num <= -1000)) {
		var iStart = tmpNumStr.indexOf(".");
		if (iStart < 0)
			iStart = tmpNumStr.length;

		iStart -= 3;
		while (iStart >= 1) {
			tmpNumStr = tmpNumStr.substring(0,iStart) + "," + tmpNumStr.substring(iStart,tmpNumStr.length)
			iStart -= 3;
		}		
	}

	// See if we need to use parenthesis
	if (bolParens && num < 0)
		tmpNumStr = "(" + tmpNumStr.substring(1,tmpNumStr.length) + ")";

	return tmpNumStr;		// Return our formatted string!
}