var bs_error = 0;
var pushAllupFormulaXML = 0; // 0 = not push the xml to betslip yet, 1 = pushed already, dont push again
var pushBonusXML = 0;
var allPushed = 0 // all XML files are pushed to betslip already
var askEwin = 0; //only ask one time for multiple selection

function longFormat(desc) {	
    var v;
    if (jsLang == "CH") {
		while (desc.indexOf('1') >= 0) {
			desc = desc.replace('1', '主');
		}
		while (desc.indexOf('2') >= 0) {
			desc = desc.replace('2', '客');
		}
		while (desc.indexOf('X') >= 0) {
			desc = desc.replace('X', '和');
		}
		while (desc.indexOf('V') >= 0) {
			desc = desc.replace('V', '無效');
		}
	} else {
		while (desc.indexOf('1') >= 0) {
			desc = desc.replace('1', 'HOME');
		}
		while (desc.indexOf('2') >= 0) {
			desc = desc.replace('2', 'AWAY');
		}
		while (desc.indexOf('X') >= 0) {
			desc = desc.replace('X', 'DRAW');
		}
		while (desc.indexOf('V') >= 0) {
			desc = desc.replace('V', 'Z');
		}
		while (desc.indexOf('Z') >= 0) {
			desc = desc.replace('Z', 'VOID');
		}
	}
    return desc
}

function addSlip() {
    //xsell event
    xsell_event(9);
    
	var hfmpArr = new Array();
	var tstr = "";
	var BSreturnVal;
	newset = 0
	bs_error = 0;
	var disabled=true ;
	for(var i=0;i<6;i++){
	    if (!$("input[type=checkbox][name=chk_" + i + "]:eq(0)").attr("disabled")) {
            disabled =false;
        }
    }
    if(disabled){
        return false ;
    }
	for (var i=0;i<6;i++) {							
		if (i>0)
			tstr += "http://bet.hkjc.com/";	
		newset = 0;		
		for (var j=0;j<9;j++) {
		    var obj = $("input[type=checkbox][name=chk_" + i + "]")[j];
			if ((obj.checked || obj.disabled)) {
				if (obj.disabled) {
					tvalue = "V-V";
					j = 9;
				} else						
					tvalue = obj.value;
				if (newset == 0) {
					hfmpArr[i] = [tvalue];	
					tstr += "(" + tvalue + ")"
					newset = 1;
				} else {
					tstr += "+(" + tvalue + ")"
					hfmpArr[i] = hfmpArr[i].concat([tvalue])
				}	
			}
		} // for j
		if (!hfmpArr[i]) {
			alert((jsLang=="CH"?"選擇不正確":"Illegal selection"))
			bs_error = 1;
			return false;					
		}
	}
	
	if (jsLang == "CH") {
		betLine1 = 'FB HFMP6 ' + matchDay1 + ' ' + matchNum1 + '*' + tstr	
		// Q109 format bet line by Linus
		betLine2 = '6寶半全場<BR>' + longweekname(matchDay1) + ' ' + matchNum1 + '<BR>' + removeApos(hTeam1,'b') + ' (主) 對 ' + removeApos(aTeam1,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[0]) + '</span><BR>';
		betLine2 += longweekname(matchDay2) + ' ' + matchNum2 +  '<BR>' + removeApos(hTeam2,'b') + ' (主) 對 ' + removeApos(aTeam2,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[1]) + '</span><BR>';
		betLine2 += longweekname(matchDay3) + ' ' + matchNum3 +  '<BR>' + removeApos(hTeam3,'b') + ' (主) 對 ' + removeApos(aTeam3,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[2]) + '</span><BR>';
		betLine2 += longweekname(matchDay4) + ' ' + matchNum4 +  '<BR>' + removeApos(hTeam4,'b') + ' (主) 對 ' + removeApos(aTeam4,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[3]) + '</span><BR>';
		betLine2 += longweekname(matchDay5) + ' ' + matchNum5 +  '<BR>' + removeApos(hTeam5,'b') + ' (主) 對 ' + removeApos(aTeam5,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[4]) + '</span><BR>';
		betLine2 += longweekname(matchDay6) + ' ' + matchNum6 +  '<BR>' + removeApos(hTeam6,'b') + ' (主) 對 ' + removeApos(aTeam6,'b') + ' (客)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[5]) + '</span>' + '<BR>'+ '<BR>';
		betLine3 = '6寶半全場 ' + longweekname(matchDay1) + ' ' + matchNum1;
		betLine4 = longFormat(tstr);
	} else {
		betLine1 = 'FB HFMP6 ' + matchDay1 + ' ' + matchNum1 + '*' + tstr	
		// Q109 format bet line by Linus
		betLine2 = '6 HaFu<BR>' + longweekname(matchDay1) + ' ' + matchNum1 + '<BR>' + removeApos(hTeam1,'b') + ' (Home) vs ' + removeApos(aTeam1,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[0]) + '</span><BR>';
		betLine2 += longweekname(matchDay2) + ' ' + matchNum2 +  '<BR>' + removeApos(hTeam2,'b') + ' (Home) vs ' + removeApos(aTeam2,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[1]) + '</span><BR>';
		betLine2 += longweekname(matchDay3) + ' ' + matchNum3 +  '<BR>' + removeApos(hTeam3,'b') + ' (Home) vs ' + removeApos(aTeam3,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[2]) + '</span><BR>';
		betLine2 += longweekname(matchDay4) + ' ' + matchNum4 +  '<BR>' + removeApos(hTeam4,'b') + ' (Home) vs ' + removeApos(aTeam4,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[3]) + '</span><BR>';
		betLine2 += longweekname(matchDay5) + ' ' + matchNum5 +  '<BR>' + removeApos(hTeam5,'b') + ' (Home) vs ' + removeApos(aTeam5,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[4]) + '</span><BR>';
		betLine2 += longweekname(matchDay6) + ' ' + matchNum6 +  '<BR>' + removeApos(hTeam6,'b') + ' (Home) vs ' + removeApos(aTeam6,'b') + ' (Away)<BR>' + '<span style="padding-left: 32px">' + longFormat(tstr.split("http://bet.hkjc.com/")[5]) + '</span>' + '<BR>'+ '<BR>'; 
		betLine3 = 'FB HFMP6 ' + matchDay1 + ' ' + matchNum1;
		betLine4 = longFormat(tstr);
	}
	//alert(betLine1 + '\n' + betLine2 + '\n' + betLine3 + '\n' + betLine4)

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
	if (bs_error == 0 && BSreturnVal == 1) {		
		if (allPushed == 0 && askEwin == 0) {
			eWinChecking();					
			askEwin = 1;
        }
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