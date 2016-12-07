function drawList() {
    if (dataArr.length > 1) {
        var tmpArr = formula[dataArr.length];
        listStr = '<select name="selFormula" id="selFormula" class="select" onChange="calDiv()">'
        for (var i = 0; i < tmpArr.length; i++) {
            listStr += '<option value="' + i + '">' + tmpArr[i] + '</option>'
        }
        listStr += '</select>'
    } else {
        listStr = ''
    }
    if (W3C) {
        document.getElementById('listCell').innerHTML = listStr
    } else if (IE4) {
        document.all.item('listCell').innerHTML = listStr
    } else if (NS4) {
        document.layers['listCell'].document.open();
        document.layers['listCell'].document.write(listStr);
        document.layers['listCell'].document.close();
    }
}


function restoreArr() {
    betArr = getCookie("betArr").split(',')
    var tmpdataArr = getCookie("dataArr").split(',')
    dataArr = new Array(tmpdataArr.length / NOOFDATA)
    for (var i = 0; i < dataArr.length; i++) {
        dataArr[i] = [tmpdataArr[i * NOOFDATA + 0], tmpdataArr[i * NOOFDATA + 1], tmpdataArr[i * NOOFDATA + 2], tmpdataArr[i * NOOFDATA + 3], tmpdataArr[i * NOOFDATA + 4], tmpdataArr[i * NOOFDATA + 5], tmpdataArr[i * NOOFDATA + 6], tmpdataArr[i * NOOFDATA + 7], tmpdataArr[i * NOOFDATA + 8], tmpdataArr[i * NOOFDATA + 9], tmpdataArr[i * NOOFDATA + 10], tmpdataArr[i * NOOFDATA + 11]]
    }
    totalOdds = dataArr.length
    document.mainform.bet.value = betArr[0];
}

function chkExisted() {
    for (var i = 0; i < dataArr.length; i++) {
        if ((dataArr[i][0] == tdate) && (dataArr[i][1] == tday) && (dataArr[i][2] == tnum)) {
            if (clientLang == "C")
                errorMsg1 = '所選球賽已在選列中'
            else
                errorMsg1 = 'Selected match has already been in the list.';
            return false;
        }
    }
    return true;
}

function newArr(todds) {
    dataArr[0] = [tdate, tday, tnum, odds, winComb, winComb_bs, hTeam, aTeam, homeHDC, awayHDC, leagueNum, matchID];
    setCookie("dataArr", dataArr, d);
    betArr = new Array();
    betArr = [MINIBET, 1, 1, 1, 1, 1, 1, 1, 1]
    setCookie("betArr", betArr, d);
}

function addArr() {
    var totalDataLength = DATALENGTH;
    if (getCookie("isCrossPool") == "1") {
        if (getCookie("poolname") != '' && getCookie("poolname") != null) {
            var totalPools = getCookie("poolname").split('**').length;
            for (var i = 0; i < totalPools; i++) {
                tmpValue = eval("js" + getCookie("poolname").split('**')[i] + "Legs");
                if (totalDataLength > tmpValue)
                    totalDataLength = tmpValue;
            }
        }

        //Reset to 8 if greater than 8 legs
        if (DATALENGTH == null || DATALENGTH > DATAMAX)
            totalDataLength = DATAMAX;
    }

    if (totalOdds >= totalDataLength) {
        if (clientLang == "C") {
            if (getCookie("isCrossPool") == "1")
                errorMsg1 = '最多可過' + totalDataLength + '關';
            else
                errorMsg1 = getPoolName(getCookie("poolname").split('**')[0]) + '過關 - 最多可過' + totalDataLength + '關';
        } else {
            if (getCookie("isCrossPool") == "1")
                errorMsg1 = 'Up to ' + totalDataLength + ' legs only';
            else
                errorMsg1 = 'All Up ' + getPoolName(getCookie("poolname")) + ' - Up to ' + totalDataLength + ' legs only';
        }

        tpoolname = getCookie("poolname")
        tpoolname = tpoolname.substring(0, tpoolname.length - 5);
        setCookie("poolname", tpoolname, d);

    } else {
        dataArr[totalOdds] = [tdate, tday, tnum, odds, winComb, winComb_bs, hTeam, aTeam, homeHDC, awayHDC, leagueNum, matchID];
        totalOdds += 1;
        setCookie("dataArr", dataArr);

    }
}

function drawTable() {
    tableStr = '<table width="100%" border="0" cellspacing="0" cellpadding="0" valign="top">'
    tableStr += '<tr>'
    if (getCookie("isCrossPool") == "1")
        tableStr += '<td nowrap class="tableContentHead">' + (clientLang == 'C' ? '種類' : 'Type') + '</td>'
    tableStr += '<td width="10%" nowrap class="tableContentHead">' + (clientLang == 'C' ? '球賽編號' : 'Match<br>No.') + '</td>'
    tableStr += '<td class="tableContentHead" align="center">' + (clientLang == 'C' ? '對賽隊伍<br>(主隊 對 客隊)' : 'Teams<br>(Home vs Away)') + '</td>'
    tableStr += '<td class="tableContentHead tableCellLine" align="center" style="display:none;" >' + (clientLang == 'C' ? '球數/角球數' : 'Line') + '</td>'
    tableStr += '<td width="11%" align="center" class="tableContentHead">' + (clientLang == 'C' ? '選擇' : 'Selection') + '</td>'
    tableStr += '<td width="13%" align="center" class="tableContentHead">' + (clientLang == 'C' ? '賠率' : 'Odds') + '</td>'
    if (getCookie("poolname") != null && (getCookie("poolname").indexOf('HDC') >= 0 || getCookie("poolname").indexOf('HIL') >= 0 || getCookie("poolname").indexOf('CHL') >= 0 || getCookie("poolname").indexOf('FHL') >= 0))
        tableStr += '<td width="10%" align="center" class="tableContentHead">' + (clientLang == 'C' ? '結果' : 'Results') + '</td>'
    else
        tableStr += '<td width="10%" align="center" class="tableContentHead">' + (clientLang == 'C' ? '成功<br>過關' : 'All Up Win') + '</td>'
    tableStr += '<td width="10%" align="center" class="tableContentHead">' + (clientLang == 'C' ? '刪除' : 'Delete') + '</td>'
    tableStr += '</tr>'

    var bgcolor;
    var noOfMlPool = 0;
    for (var i = 0; i < totalOdds; i++) {
        if (bgcolor == 'tableContent2')
            bgcolor = 'tableContent1'
        else
            bgcolor = 'tableContent2'

        tableStr += '<tr>'
        if (getCookie("isCrossPool") == "1")
            tableStr += '<td nowrap class="' + bgcolor + '">' + getPoolName(getCookie("poolname").split('**')[i]) + '</td>'
        tableStr += '<td class="' + bgcolor + '" nowrap>' + longWeekName(dataArr[i][1]) + ' ' + dataArr[i][2] + '</td>'
        tableStr += '<td class="' + bgcolor + '">' + dataArr[i][6];
        if (getCookie("poolname").split('**')[i] == "HDC" || getCookie("poolname").split('**')[i] == "HHA")
            tableStr += ' [' + dataArr[i][8] + ']';
        tableStr += ' ' + (clientLang == 'C' ? '對' : 'vs') + ' ' + dataArr[i][7];
        if (getCookie("poolname").split('**')[i] == "HDC" || getCookie("poolname").split('**')[i] == "HHA")
            tableStr += ' [' + dataArr[i][9] + ']';
        tableStr += '</td>'
        if (getCookie("poolname").split('**')[i] == "HIL" || getCookie("poolname").split('**')[i] == "CHL" || getCookie("poolname").split('**')[i] == "FHL") {
            tableStr += '<td align="center" style="display:none;"  class="tableCellLine ' + bgcolor + '">[' + dataArr[i][8] + ']</td>';
            noOfMlPool++;
        } else {
            tableStr += '<td align="center" style="display:none;" class="tableCellLine ' + bgcolor + '">-</td>';
        }
        tableStr += '<td align="center" class="' + bgcolor + '">' + dataArr[i][4] + '</td>'
        tableStr += '<td align="center" class="' + bgcolor + '"><span class="red">' + dataArr[i][3] + '</font>'
        tableStr += '<input type="hidden" name="odds' + i + '" value="' + dataArr[i][3] + '"></td>'
        tableStr += '<td align="center" class="' + bgcolor + '">'
        if (getCookie("poolname").split('**')[i] == 'HDC') {
            tableStr += drawHDCSelect(i)
            tableStr += '<input type="hidden" name="c' + i + '" value="' + betArr[i + 1] + '">'
        } else if (getCookie("poolname").split('**')[i] == 'HIL' || getCookie("poolname").split('**')[i] == 'CHL' || getCookie("poolname").split('**')[i] == 'FHL') {
            tableStr += drawHILSelect(i)
            tableStr += '<input type="hidden" name="c' + i + '" value="' + betArr[i + 1] + '">'
        } else {
            tableStr += '<a href="javascript:changeImg(' + i + ', document.mainform.c' + i + ', document.getElementById(\'h_leg' + i + '\'));">'
            tableStr += '<img src="/football/info/images/ch/calculator/btn_'
            if (betArr[i + 1] == 1)
                tableStr += 'yes'
            else
                tableStr += 'no'
            tableStr += '.gif' + window["cacheVersion"] + '"  width="42" height="16" border="0" id="h_leg' + i + '">'
            tableStr += '</a>'
            tableStr += '<input type="hidden" name="c' + i + '" value="' + betArr[i + 1] + '">'
        }
        tableStr += '</td>'
        tableStr += '<td align="center" class="' + bgcolor + '"><input type="image" src="/football/info/images/' + (clientLang == 'C' ? 'ch' : 'en') + '/btn_allup_delete.gif' + cacheVersion + '" name="Submit" value="' + (clientLang == 'C' ? '刪除' : 'Delete') + '" class="calBtn" style="width:42px; border: 0;" onClick="removeItem(' + i + ')"></td>'
        tableStr += '</tr>'
    }


    if (W3C) {
        document.getElementById('contentCell').innerHTML = tableStr
    } else if (IE4) {
        document.all.item('contentCell').innerHTML = tableStr
    } else if (NS4) {
        document.layers['contentCell'].document.open();
        document.layers['contentCell'].document.write(tableStr);
        document.layers['contentCell'].document.close();
    }

    if (noOfMlPool > 0)
        $('.tableCellLine').show();
}

function getHILcond(tHILstr) {
    if (tHILstr.indexOf('http://bet.hkjc.com/') >= 0) {
        tArr = tHILstr.split('http://bet.hkjc.com/')
        for (var i = 0; i <= 1; i++) {
            if (parseInt(tArr[i]) == tArr[i])
                return parseInt(tArr[i]);
        }
    }
    return parseInt(tHILstr);
}

function drawHILSelect(i) {
    tHILcond = dataArr[i][8]
    absHILcond = getHILcond(dataArr[i][8])
    userChoice = dataArr[i][4]
    tvalue = ""
    tstr = '<select class="sltresult" name="HILcond' + i + '" onchange="changeHILSel(' + i + ')">'
    if (clientLang == "C")
        tstr += '<option value="1">' + absHILcond + '球以上</option>'
    else
        tstr += '<option value="1">Above ' + absHILcond + '</option>';
    if (tHILcond.indexOf('http://bet.hkjc.com/') >= 0 || tHILcond.indexOf('.5') < 0) {
        tstr += '<option value="ttttt">' + absHILcond + (clientLang == "C" ? "球" : ((absHILcond > 1) ? " Goals" : " Goal")) + '</option>';
        if (tHILcond.indexOf('http://bet.hkjc.com/') >= 0) {
            hilDataArr = tHILcond.split('http://bet.hkjc.com/');
            for (var i = 0; i <= 1; i++) {
                if (i == 1) {
                    tvalue += 'http://bet.hkjc.com/';
                }
                if (parseInt(hilDataArr[i]) == hilDataArr[i]) {
                    tvalue += 3;
                } else {
                    if (hilDataArr[i] > absHILcond) {
                        if (userChoice == '大' || userChoice == 'High')
                            tvalue += 2;
                        else
                            tvalue += 1;
                    } else { //hilDataArr[i] < absHILcond
                        if (userChoice == '細' || userChoice == 'Low')
                            tvalue += 2;
                        else
                            tvalue += 1;
                    }
                }
            }
        } else {
            tvalue = "3";
        }
        if (clientLang == "C")
            tstr += '<option value="2">' + absHILcond + '球以下</option>';
        else
            tstr += '<option value="2">Below ' + absHILcond + '</option>';
    } else {
        if (clientLang == "C")
            tstr += '<option value="2">' + absHILcond + '球或以下</option>';
        else
            tstr += '<option value="2">' + absHILcond + ' or Below</option>';
    }
    /*
    if (clientLang == "E")
        tstr += '<option value="2">Low</option>';
        */
    tstr = tstr.replace('ttttt', tvalue);
    tstr += '</select>';
    return tstr;
}

function drawHDCSelect(i) {
    thomeHDC = dataArr[i][8]
    tvalue = ""
    tstr = '<select class="sltresult" name="HDCline' + i + '" onchange="changeHDCSel(' + i + ')">'
    tstr += '<option value="1">' + (clientLang == "C" ? "主" : "H") + '</option>'
    if (thomeHDC.indexOf('http://bet.hkjc.com/') < 0) {
        if (parseInt(thomeHDC) == thomeHDC) // NO decimal pt
            tstr += '<option value="3">' + (clientLang == "C" ? "平手" : "Draw") + '</option>'
    } else {
        tstr += '<option value="ttttt">'
        hdcDataArr = thomeHDC.split('http://bet.hkjc.com/')
        for (var i = 0; i <= 1; i++) {
            if (i == 1) {
                tstr += 'http://bet.hkjc.com/'
                tvalue += 'http://bet.hkjc.com/'
            }
            if (parseInt(hdcDataArr[i]) == hdcDataArr[i]) { // NO decimal pt
                tstr += (clientLang == "C" ? "平手" : "Draw")
                tvalue += 3
            } else if (hdcDataArr[i] > 0) {
                if (i == 1) {
                    tstr += (clientLang == "C" ? "主" : "H")
                    tvalue += 1
                } else {
                    tstr += (clientLang == "C" ? "客" : "A")
                    tvalue += 2
                }
            } else {
                if (i == 1) {
                    tstr += (clientLang == "C" ? "客" : "A")
                    tvalue += 2
                } else {
                    tstr += (clientLang == "C" ? "主" : "H")
                    tvalue = 1
                }
            }
        }

        tstr += '</option>'
    }
    tstr += '<option value="2">' + (clientLang == "C" ? "客" : "A") + '</option>'
    tstr = tstr.replace('ttttt', tvalue)
    tstr += '</select>'
    return tstr
}

function changeHDCSel(t) {
    eval('betArr[t+1] = document.mainform.HDCline' + t + '.value')
    eval('http://common.hkjc.com/maint/generic.html' + t + '.value = betArr[t+1]');
    calDiv();
}

function changeHILSel(t) {
    eval('betArr[t+1] = document.mainform.HILcond' + t + '.value')
    eval('http://common.hkjc.com/maint/generic.html' + t + '.value = betArr[t+1]');
    calDiv();
}

function changeImg(t, obj, obj2) {
    if (obj.value == "0") {
        obj.value = 1;
        obj2.src = "../info/images/ch/calculator/btn_yes.gif" + window["cacheVersion"];
        betArr[t + 1] = 1;
    } else {
        obj.value = 0;
        obj2.src = "../info/images/ch/calculator/btn_no.gif" + window["cacheVersion"];
        betArr[t + 1] = 0;
    }
    calDiv();
}

function deleteAll() {
    deleteCookie("poolname");
    deleteCookie("dataArr");
    deleteCookie("betArr");
    deleteCookie("isCrossPool");
    dataArr = new Array();
    betArr = new Array();
    resetAll()
    totalOdds = 0
}

function resetAll() {
    errorMsg = '';
    errorMsg1 = '';
    displayWarningMsg();
    if (W3C) {
        document.getElementById('totBetNo').innerHTML = "-";
        document.getElementById('totBet').innerHTML = "-";
        document.getElementById('dividend').innerHTML = "-";
        document.getElementById('div2').innerHTML = "-";
        document.getElementById("unitBet").innerHTML = '$' + MINIBET;
    } else if (IE4) {
        document.all.item('totBetNo').innerText = "-";
        document.all.item('totBet').innerText = "-";
        document.all.item('dividend').innerText = "-";
        document.all.item('div2').innerText = "-";
        document.all.item("unitBet").innerText = '$' + MINIBET;
    } else if (NS4) {
        document.layers['totBetNo'].document.open();
        document.layers['totBetNo'].document.write("-");
        document.layers['totBetNo'].document.close();
        document.layers['totBet'].document.open();
        document.layers['totBet'].document.write("-");
        document.layers['totBet'].document.close();
        document.layers['dividend'].document.open();
        document.layers['dividend'].document.write("-");
        document.layers['dividend'].document.close();
        document.layers['div2'].document.open();
        document.layers['div2'].document.write("-");
        document.layers['div2'].document.close();
        document.layers['unitBet'].document.open();
        document.layers['unitBet'].document.write('$' + MINIBET);
        document.layers['unitBet'].document.close();
    } else {
        //alert("Don't recognize this browser");
    }


    if (getCookie("poolname") != null && getCookie("poolname").indexOf('**') > 0 && getCookie("poolname").indexOf('HDC') < 0) { // less than 2 pool
        if (W3C) {
            document.getElementById("winningBetNo").innerHTML = "-";
        } else if (IE4) {
            document.all.item("winningBetNo").innerHTML = "-";
        } else if (NS4) {
            document.layers['winningBetNo'].document.open();
            document.layers['winningBetNo'].document.write('-');
            document.layers['winningBetNo'].document.close();
        }
    }

    document.mainform.bet.value = MINIBET;
}



function calUp(amt) {
    if (isNaN(document.mainform.bet.value) || (document.mainform.bet.value == '')) {
        document.mainform.bet.value = MINIBET
    } else {
        if (parseInt(document.mainform.bet.value) < MAXBET) {
            if (amt == MINIBET)
                document.mainform.bet.value = getnearval_u(parseInt(document.mainform.bet.value), amt)
            else
                document.mainform.bet.value = parseInt(document.mainform.bet.value) + amt
        }
    }
    calDiv();
}

function calDown(amt) {
    if (isNaN(document.mainform.bet.value) || (document.mainform.bet.value == '')) {
        document.mainform.bet.value = MINIBET
    } else {
        if (parseInt(document.mainform.bet.value) > (amt == MINIBET ? MINIBET : amt)) {
            if (amt == MINIBET)
                document.mainform.bet.value = getnearval_d(parseInt(document.mainform.bet.value), amt)
            else
                document.mainform.bet.value = parseInt(document.mainform.bet.value) - amt
        }
    }
    calDiv();
}

function getnearval_u(val, amt) {
    if ((val % amt) != 0) {
        return (val + (amt - (val % amt)))
    }
    else
        return val + amt
    /*
    if ((val % 10) != 0 ) {
    return (val+(10-(val % 10)))
    }
    else
    return val + amt
    */
}

function getnearval_d(val, amt) {
    if ((val % amt) != 0) {
        return (val - (val % amt))
    }
    else
        return val - amt
    /*
    if ((val % 10) != 0 ) {
    return (val-(val % 10))
    }
    else
    return val - amt
    */
}

function longWeekName(sweekname) {
    if (clientLang == "E") {
        return sweekname
    }
    switch (sweekname) {
        case "MON":
            return "星期一"
            break;
        case "TUE":
            return "星期二"
            break;
        case "WED":
            return "星期三"
            break;
        case "THU":
            return "星期四"
            break;
        case 'FRI':
            return "星期五"
            break;
        case "SAT":
            return "星期六"
            break;
        case "SUN":
            return "星期日"
            break;
    }
}

function cvtPoolName(cpoolname) {
    if (cpoolname != null) {
        poolArr = cpoolname.split('**')
        crossPool = false;
        for (i = 0; i < poolArr.length; i++) {
            for (j = i + 1; j < poolArr.length; j++) {
                if (poolArr[i] != poolArr[j]) {
                    crossPool = true;
                    i = poolArr.length;
                    j = poolArr.length;
                }
            }
        }

        if (crossPool)
            cpoolname = null
        else
            cpoolname = poolArr[0]
    } else {
        cpoolname = null
    }

    return getPoolName(cpoolname);

}

function dispAmount(amount) {
    if (clientLang == "E") {
        return amount
    }
    switch (amount) {
        case 1000000:
            return "一百萬";
            break;
        case 2000000:
            return "二百萬";
            break;
        case 5000000:
            return "五百萬";
            break;
        case 10000000:
            return "一千萬";
            break;
        default:
            return amount;
            break;
    }
}

function removeItem(itemno) {
    popOut(itemno)
    drawTable();
    drawList();
    calDiv();

}

function popOut(itemno) {
    var tArray = new Array()
    var tbetArray = new Array()
    tbetArray = tbetArray.concat(betArr[0])
    tpoolname = '';
    poolnameArr = getCookie("poolname").split('**')
    for (j = 0; j < dataArr.length; j++) {
        if (j != itemno) {
            tArray = tArray.concat(dataArr[j])
            tbetArray = tbetArray.concat(betArr[j + 1]);
            if (j != (dataArr.length - 1))
                tpoolname += poolnameArr[j] + '**'
            else
                tpoolname += poolnameArr[j]
        }
    }

    if (tpoolname.substr(tpoolname.length - 2, 2) == '**')
        tpoolname = tpoolname.substring(0, tpoolname.length - 2);

    setCookie("poolname", tpoolname, d);
    if (tArray.length == 0)
        deleteAll();
    else {
        for (k = j; k <= DATALENGTH; k++) {
            tbetArray = tbetArray.concat('1')
        }

        setCookie("dataArr", tArray, d);
        setCookie("betArr", tbetArray, d);
        restoreArr();
    }
}

function FormatNumber(num, decimalNum, bolLeadingZero, bolParens, bolCommas)
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
    var iSign = num < 0 ? -1 : 1; 	// Get sign of number

    // Adjust number so only the specified number of numbers after
    // the decimal point are shown.
    tmpNum *= Math.pow(10, decimalNum);
    tmpNum = Math.round(Math.abs(tmpNum))
    tmpNum /= Math.pow(10, decimalNum);
    //tmpNum *= iSign;					// Readjust for sign


    // Create a string object to do our formatting on
    var tmpNumStr = new String(tmpNum);

    // See if we need to strip out the leading zero or not.
    if (!bolLeadingZero && num < 1 && num > -1 && num != 0)
        if (num > 0)
        tmpNumStr = tmpNumStr.substring(1, tmpNumStr.length);
    //		else
    //			tmpNumStr = "-" + tmpNumStr.substring(2,tmpNumStr.length);

    // See if we need to put in the commas
    if (bolCommas && (num >= 1000 || num <= -1000)) {
        var iStart = tmpNumStr.indexOf(".");
        if (iStart < 0)
            iStart = tmpNumStr.length;

        iStart -= 3;
        while (iStart >= 1) {
            tmpNumStr = tmpNumStr.substring(0, iStart) + "," + tmpNumStr.substring(iStart, tmpNumStr.length)
            iStart -= 3;
        }
    }

    // See if we need to use parenthesis
    if (bolParens && num < 0)
        tmpNumStr = "(" + tmpNumStr.substring(1, tmpNumStr.length) + ")";

    if (iSign == -1) {
        tmpNumStr = "-" + tmpNumStr;
    }
    return tmpNumStr; 	// Return our formatted string!
}

function hilMapping(tvalue) {
    if (tvalue == (clientLang == "C" ? "細" : "Low"))
        return 2
    else
        return 1
}

function hdcMapping(tvalue) {
    if (tvalue == (clientLang == "C" ? "客" : "A"))
        return 2
    else
        return 1
}

function chkCrossPool(tpoolname) {
    var i;

    mayCrossPool = false;
    poolArr = getCookie("poolname").split('**')
    for (i = 0; i < poolArr.length; i++) {
        if (tpoolname != poolArr[i]) {
            mayCrossPool = true;
            i = poolArr.length
        }
    }

    isThisSet = true;
    if (mayCrossPool) {
        for (i = 0; i < CROSSPOOL.length; i++) { // defined in sb_data.js, eg 1 - HAD/HHA/HDC, 2 - HIL/OOE, length == 2
            isThisSet = true;
            for (j = 0; j <= poolArr.length; j++) { //pool selected in calculator
                selection = false;
                for (k = 0; k < CROSSPOOL[i].length; k++) { //pool defined in set 1 --> HAD/HHA/HDC	
                    if (j == poolArr.length) { //check the latest selected pool											
                        if (CROSSPOOL[i][k] == tpoolname) {
                            selection = true;
                            k = CROSSPOOL[i].length;
                        }
                    }
                    else {
                        if (CROSSPOOL[i][k] == poolArr[j]) {
                            selection = true;
                            k = CROSSPOOL[i].length;
                        }
                    }
                }
                if (!selection) {
                    j = poolArr.length + 1;
                    isThisSet = false;
                }
            }
            if (isThisSet) {
                i = CROSSPOOL.length;
            }
        }
    }

    if (mayCrossPool && isThisSet)
        setCookie("isCrossPool", "1", d);

    return isThisSet;

}

function convertPoolName(tpool) {
    switch (tpool) {
        case "HHA":
            return "HHAD";
            break;
        case "HIL":
            return "HILO";
            break;
        case "CHL":
            return "CHLO";
            break;
        case "FHL":
            return "FHLO";
            break;
        case "FHA":
            return "FHAD";
            break;
        case "FCS":
            return "FCRS";
            break;
        default:
            return tpool;
            break;
    }
}
/*
function displayWarningMsg() {
if (errorMsg != '' || errorMsg1 != '') {	
if (errorMsg != '') {
window['warningMsg'].innerHTML = msgTemplate.replace('TEXTHERE',errorMsg);
} else {		
window['warningMsg'].innerHTML = msgTemplate.replace('TEXTHERE',errorMsg1);
}
} else
window['warningMsg'].innerHTML = '';
}
*/

function displayWarningMsg() {
    var finalMsg;
    if (errorMsg != '' || errorMsg1 != '') {
        if (errorMsg != '') {
            finalMsg = msgTemplate.replace('TEXTHERE', errorMsg);
        } else {
            finalMsg = msgTemplate.replace('TEXTHERE', errorMsg1);
        }
    } else {
        finalMsg = '';
    }

    if (W3C) {
        document.getElementById('warningMsg').innerHTML = finalMsg;
    }
    else if (IE4) {
        document.all.item('warningMsg').innerText = finalMsg;
    } else if (NS4) {
        document.layers['warningMsg'].document.open();
        document.layers['warningMsg'].document.write(finalMsg);
        document.layers['warningMsg'].document.close();
    } else {
        //alert("Don't recognize this browser");
    }
}