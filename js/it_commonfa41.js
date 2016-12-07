function printNow(url) {
    window.print();
    /*
    if (url != '') {
        var newWin = window.open(url, "newWin", "top=1000,left=250,width=1,height=1,scrollbars=no,resizable=no,toolbar=no");
        //var newWin= window.open(url,"newWin",""); 
        window.focus()
    }
    */
}

function lastOddsRefresh() {
    dateObj.setSeconds(dateObj.getSeconds() + 1);
    window.setTimeout("lastOddsRefresh()", 1000);
}

function oddsMain() {
    blnPageLoaded = true;
    resetLogout();
}

function refreshPage() {
    if (blnPageLoaded) {
        if (dateObj.valueOf() - dateObj2.valueOf() > (manualRefreshInterval * 1000)) {
            window.oddsTable.style.display = "none";
            window.setTimeout('window.oddsTable.style.display = "block"', 200);
            chkLogin(1);
        }
    }
}


function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function getPoolName(shortPoolName) {
    switch (shortPoolName) {
        case "HAD":
            return (clientLang == "C" ? "主客和" : "Home/Away/Draw");
            break;
        case "FTS":
            return (clientLang == "C" ? "第一隊入球" : "First Team To Score");
            break;
        case "FHA":
            return (clientLang == "C" ? "半場主客和" : "First Half HAD");
            break;
        case "HDC":
            return (clientLang == "C" ? "讓球" : "Handicap");
            break;
        case "HHA":
            return (clientLang == "C" ? "讓球主客和" : "Handicap HAD");
            break;
        case "CRS":
            return (clientLang == "C" ? "波膽" : "Correct Score");
            break;
        case "FCS":
        	return (clientLang == "C" ? "半場波膽" : "First Half CRS");
        case "HIL":
            return (clientLang == "C" ? "入球大細" : "HiLo")
            break;
        case "CHL":
            return (clientLang == "C" ? "角球大細" : "Corner HiLo")
            break;
        case "FHL":
            return (clientLang == "C" ? "半場入球大細" : "First Half HiLo")
            break;
        case "TTG":
            return (clientLang == "C" ? "總入球" : "Total Goals")
            break;
        case "OOE":
            return (clientLang == "C" ? "入球單雙" : "Odd/Even")
            break;
        case "FGS":
            return (clientLang == "C" ? "首名入球" : "First Scorer")
            break;
        case "HFT":
            return (clientLang == "C" ? "半全場" : "HaFu")
            break;
        case "CHP":
            return (clientLang == "C" ? "冠軍" : "Champion")
            break;
        case "GPW":
            return (clientLang == "C" ? "小組首名" : "Group Winner");
            break;
        case "GPF":
            return (clientLang == "C" ? "小組一二名" : "Group Forecast");
            break;
        case "TPS":
            return (clientLang == "C" ? "神射手" : "Top Scorer");
            break;
        case "ADTP":
            return (clientLang == "C" ? "晋級球隊" : "Advanced Teams");
            break;
        case "TOFP":
            return (clientLang == "C" ? "冠亞軍" : "Tournament Forecast");
            break;
        case "SPC":
            return (clientLang == "C" ? "特別項目" : "Specials")
            break;
        case "tournSPC":
            return (clientLang == "C" ? "特別項目" : "Specials");
            break;
        case "TQL":
            return (clientLang == "C" ? "晉級隊伍" : "To Qualify");
            break;
        case "NTS":
            return (clientLang == "C" ? "下一隊入球" : "Next Team To Score");
        case null:
            return ""
            break;
        default:
            return "";
    }
}

function ToDollarsAndCents_calculator(n) {
    n = n + 0.0000001	// For handle 1.005 odds incident KB125056
    var s = "" + Math.round(n * 10) / 10
    var i = s.indexOf('.')
    if (i < 0) return s + ".0"
    var t = s.substring(0, i + 1) + s.substring(i + 1, i + 2)
    if (i + 1 == s.length) t += "0"
    return t
} 

