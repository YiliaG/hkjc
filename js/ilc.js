function StringBuffer() { this.buffer = []; }
StringBuffer.prototype.append = function(data) {
    this.buffer.push(data);
    return this;
}

StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
}

var ilcMatches; /*store all the matches*/
var poolType = "HAD";
var leagueCode = "ALL";
var hasChannel = "ALL";
var isLiveCast = "ALL";
var hasInplayPool = "ALL";
var pageIndex = 1;
var filteredMatches = new Array(); /*store all the filtered matches,and get the paging data from the array*/
var checkBoxArr = new Array();
var definedPoolArr = new Array();
var selectionCheckBox = new Array();
var isShowSelected = false;
var tips;
var timers = {};
var matchLineStyle = "";
var multipleLinePoolIds = [];
var lineRowCount = [];
var showHideBtn = [1,1];

var oldMainline = [];
var oldOdds = [];

function initialize() {
    document.getElementById("selOddsType").options.length = 0;
    for (var i = 0; i < ilcPagePoolsOrder.length; i++) {
        var pool = pools[ilcPagePoolsOrder[i]];
        document.getElementById("selOddsType")[i] = new Option(pool.name, pool.value);
    }
    document.getElementById("selOddsType").value = pools[ilcPagePoolsOrder[0]].value;

    if (!checkHasMatches()) {
        setPageInfo(false);
    } else {
        setPageInfo(true);
        poolType = $("#selOddsType").val().toUpperCase();
        render();
        updateAllMatchesTime();

        if (enableSelectLeague) {
            $(".selLeague").eq(0).show();
        } else {
            $(".selLeague").eq(0).hide();
        }
    }

    var updatePerformTvVisibility = function() {
    if ($("#linkPerformTv").length > 0 && top.betSlipFrame && typeof (top.betSlipFrame.showWebTVIcon) == "function" && top.betSlipFrame.showWebTVIcon()) {
        $("#linkPerformTv").css("display", "inline");
        } else {
            $("#linkPerformTv").hide();
        }
    }
    if (top.betSlipFrame && typeof (top.betSlipFrame.regWebTVStatusCallback) == "function") {
        top.betSlipFrame.regWebTVStatusCallback(updatePerformTvVisibility);
    }
    updatePerformTvVisibility();
}

//display matches,oddsType:HAD,HIL,CHL,FTS/NTS
function render() {
    $("#divLoading").show();

    closeEventWindow();
    //initialize the pageIndex
    pageIndex = 1;

    definedPoolArr = new Array();
    if (enableSelectLeague) {
        setLeagues(ilcMatches, leagueCode);
    }

    //get the filtered matches
    filteredMatches = filterMatches(ilcMatches, leagueCode, poolType, hasChannel, isLiveCast, hasInplayPool);
    //display the matches
    var $obj = $("#tbMatches");
    $obj.empty();
	showHideBtn = [1,1];
    var displayedMatches = getPagedMatches(filteredMatches, 1, pageSize);
	resetMultipleLine();
	setLineCount(displayedMatches, poolType);
    $obj.html(drawMatchesHtml(displayedMatches, poolType));
    //add betline
    resetBetLineArray();
    createBetLinesForDisplayMatches(displayedMatches, poolType);
    //display the pagers
    $("#divPager").html(drawPagerHtml(pageSize, filteredMatches.matchesCount, pageIndex, buttonCount));
    $("#divPager").show();

    $("#divLoading").hide();
}

//re-render the display, oddsType:HAD,HIL,CHL,FTS/NTS
function reRender() {
    //if event window is open, display the event window
    var mID;
    if ($("#divDetails").length > 0) {
        mID = $("#divDetails").find("input[type=hidden]").eq(0).val();
        closeEventWindow();
    }
    //display the matches
    var $obj = $("#tbMatches");
    $obj.empty();
	showHideBtn = [1,1];

    filteredMatches = filterMatches(ilcMatches, leagueCode, poolType, hasChannel, isLiveCast, hasInplayPool);

    //after refresh,the pageindex maybe > pages
    var pages = filteredMatches.matchesCount % pageSize == 0 ? Math.floor(filteredMatches.matchesCount / pageSize) : Math.floor(filteredMatches.matchesCount / pageSize) + 1;
    if (pageIndex > pages) {
        pageIndex = (pages > 0 ? pages : 1);
    }
    var displayedMatches = getPagedMatches(filteredMatches, pageIndex, pageSize);
	setLineCount(displayedMatches, poolType);
    $obj.html(drawMatchesHtml(displayedMatches, poolType));


    if (enableSelectLeague) {
        setLeagues(ilcMatches, leagueCode);
    }

    //open the event window if the event window is open before render
    if (mID != null) {
        if ($("#rmid" + mID).length > 0) {
            var obj = $("#rmid" + mID).find(".cscore").eq(0);
            var oType = poolType;
            openEventWindow(obj, mID, oType);
        }
    }
    //add betline
    resetBetLineArray();
    createBetLinesForDisplayMatches(displayedMatches, poolType);

    //display the pagers
    $("#divPager").html(drawPagerHtml(pageSize, filteredMatches.matchesCount, pageIndex, buttonCount));
}

//filter matches by poolType,oddsType:HAD,HIL,CHL,FTS/NTS
function filterByOddsType(oddsType) {
    $("#divLoading").show();
    selectionCheckBox = [];
    poolType = oddsType.toUpperCase();
    hasChannel = "ALL";
    isLiveCast = "ALL";
    hasInplayPool = "ALL";
    pageIndex = 1;
	if (oddsRefreshType!="push")
		render();
	else {
		resetMultipleLine();
		doFilterPush();
	}
	closeEventWindow();
}

//filter matches by league
function filterByLeague(lgCode) {
    $("#divLoading").show();
    selectionCheckBox = [];
    leagueCode = lgCode;
    hasChannel = "ALL";
    isLiveCast = "ALL";
    pageIndex = 1;
	if (oddsRefreshType!="push")
		render();
	else
		doFilterPush();
	closeEventWindow();
}

//filter matches,oddsType:HAD,HIL,CHL,FTS/NTS

function filterMatches(matchesArr, leagueCode, oddsType, hasChannel, isLiveCast, hasInplayPool) {
    if (matchesArr == null) return;

    var arr = new Array();
    arr.matchesCount = 0;
    for (var i = 0; i < matchesArr.length; i++) {
        var obj = {};
        obj.name = matchesArr[i].name;
        obj.matches = new Array();
        for (var j = 0; j < matchesArr[i].matches.length; j++) {
            var m = matchesArr[i].matches[j];
            if ($.isNullOrEmpty(m.matchID)) continue;

            if (isShowSelected && hasAnyCheckboxSelected() && !checkBoxArr[m.matchID]) continue;
            
            if (leagueCode.toLowerCase() != "all") {
                if (leagueCode.toLowerCase() == "others") {
                    if (m.league.leagueCode != "CLB" && m.league.leagueCode != "CUP" && m.league.leagueCode != "INT") {
                        continue;
                    }
                } else if (m.league.leagueCode != leagueCode) {
                    continue;
                }
            }
            var pool = getPool(m, oddsType);
            if (pool == null || (pool.poolStatus=='' && pool.itemNum=='') ) {
                continue;
            } else {
                if (checkIsRefundPool(pool.poolStatus)) {
                    continue;
                }
            }

            if (checkIsVoidMatch(m.matchStatus)) {
                continue;
            }

            if (hasChannel.toLowerCase() != "all") {
                var betSlip = top.document.getElementById('betSlipFrame');
				var needWebTVCheck = checkIsLogin() && betSlip && betSlip.contentWindow.GetDataStore('football_live_ind') == "Y";
                if (hasChannel.toLowerCase() == "yes") {
                    if (needWebTVCheck && m.isWebTV) { // not filter out
                    }
                    else if (m.channel.channelCode.length > 0) { // not filter out
                    }
                    else {
                        continue;
                    }
                }
            }
            if (isLiveCast.toLowerCase() != "all") {
                var tmp = isLiveCast.toLowerCase() == "yes";
                if (m.isLiveCast != tmp) {
                    continue;
                }
            }
            if (hasInplayPool.toLowerCase() != "all") {
                var tmp = hasInplayPool.toLowerCase() == "true";
                if (m.hasInplayPool != tmp) {
                    continue;
                }
            }
            if (m.isRemoved || !m.toDisplayIlc) {
                continue;
            }

            obj.matches.push(m);
        }
        arr.push(obj);
        arr.matchesCount = arr.matchesCount + obj.matches.length;
    }
    return arr;
}


//set the header of the table,oddsType:HAD,HIL,CHL,FTS/NTS
function setHeader(oddsType) {
    oddsType = oddsType.toUpperCase();
    var oddsClass = "codds-had";
    var colspan = 3;

    if (oddsType == "HAD") {
        $("#spCol1").html(GetGlobalResources("HomeTeamWin", "js"));
        $("#spCol2").html(GetGlobalResources("DRAW", "js"));
        $("#spCol3").html(GetGlobalResources("AwayTeamWin", "js"));
        colspan = 3;
    } else if (oddsType == "HIL") {
        $("#spCol1").html(GetGlobalResources("Line", "js"));
        $("#spCol2").html(GetGlobalResources("Hight", "js"));
        $("#spCol3").html(GetGlobalResources("Low", "js"));
        oddsClass = "codds-hil";
        colspan = 3;
    } else if (oddsType == "CHL") {
        $("#spCol1").html(GetGlobalResources("CornerLine", "js"));
        $("#spCol2").html(GetGlobalResources("Hight", "js"));
        $("#spCol3").html(GetGlobalResources("Low", "js"));
        oddsClass = "codds-chl";
        colspan = 3;
    } else if (oddsType == "FTS/NTS") {
        $("#spCol1").html(GetGlobalResources("HomeTeam", "js"));
        $("#spCol2").html(GetGlobalResources("NoGoal", "js"));
        $("#spCol3").html(GetGlobalResources("AwayTeam", "js"));
        oddsClass = "codds-nts";
        colspan = 4;
    }
    document.getElementById("tdSelect").colSpan = colspan;

    $("#spCol1").parent().removeClass();
    $("#spCol2").parent().removeClass();
    $("#spCol3").parent().removeClass();
    $("#spCol1").parent().addClass(oddsClass);
    $("#spCol2").parent().addClass(oddsClass);
    $("#spCol3").parent().addClass(oddsClass);
}

//get the html of matches,oddsType:HAD,HIL,CHL,FTS/NTS
function drawMatchesHtml(matchesArr, oddsType) {
    var sb = new StringBuffer();
    var colspan = 15;
    oddsType = oddsType.toUpperCase();
    if (oddsType == "CHL") {
        colspan = 17;
        $("td.ccorner").show();
    } else {
	    if (oddsType == "HIL")
			colspan = 16;
        $("td.ccorner").hide();
    }
    if (oddsType == "FTS/NTS") {
        colspan = 16;
        $("td.cgoal").show();
    } else {
        $("td.cgoal").hide();
    }
    
    for (var i = 0; i < matchesArr.length; i++) {
        if (matchesArr[i].matches.length > 0) {
            sb.append("<tr id=\"tgCou" + i + "\" class=\"rchead rTopBorder\">");
            sb.append("<td class=\"tgCoupon whiteBottomBorder\" onclick=\"tgILC(" + i + ");");
            sb.append("\" colspan=\"" + colspan + "\">");
            sb.append("<span id=\"tgCouBtn" + i + "\" class=\"spBtnMinus\"></span>");
            sb.append(GetGlobalResources(matchesArr[i].name, "js"));

            var hasMultipleLine = hasAnyMultipleLineMatch(matchesArr[i].matches, oddsType);
            if (hasMultipleLine) {
				sb.append("<span id=\"tgAllMLBtn_" + i + "\" style=\"float:right;\" onclick=\"toggleAllMLDisplay(event," + i + ",'"+oddsType+"');\">");
			    if ( multipleLinePoolIds[i + "_ALL"]==1 )
					sb.append(GetGlobalResources("CollapseAll", "js") + "<span class=\"spBtnMinus\"></span></span>");
				else
					sb.append(GetGlobalResources("ExpandAll", "js") + "<span class=\"spBtnPlus\"></span></span>");
            }
            sb.append("</td>");
            sb.append("</tr>");
            for (var j = 0; j < matchesArr[i].matches.length; j++) {
                var m = matchesArr[i].matches[j];
                matchLineStyle = "rAlt" + ((j + 1) % 2) + " tgCou" + (i + 1) + " rcont";
                sb.append(drawHtmlOfMatch(i, m, oddsType, matchLineStyle));
            }
        }
    }
    return sb.toString();
}

function resetMultipleLine() {
    multipleLinePoolIds = [];
	multipleLinePoolIds["0_ALL"] = 0;
	multipleLinePoolIds["1_ALL"] = 0;
}

function setLineCount(matchesArr, oddsType) {
    lineRowCount = [];
    for (var i = 0; i < matchesArr.length; i++) {
		for (var j = 0; j < matchesArr[i].matches.length; j++) {
            var m = matchesArr[i].matches[j];
			var pool = getPool(m, oddsType);
			lineRowCount[i + '_' + m.matchID] = pool.odds.length;
		}
    }
}

function hasAnyMultipleLineMatch(matches, oddsType) {
    if (oddsType == "CHL" || oddsType == "HIL") {
        for (var index in matches) {
             if (isMultipleLineMatch(matches[index], oddsType))
                return true;
        }
    }
    return false;
}

function isMultipleLineMatch(match, oddsType) {
    if (oddsType == "CHL" || oddsType == "HIL") {
        var pool = getPool(match, oddsType);
            if (pool.odds.length > 1)
                return true;
	}
    return false;
}


function updateCBSelect(obj, mId) {
    checkBoxArr[mId] = obj.checked;
}

function hasAnyCheckboxSelected() {
  for ( var b in checkBoxArr ) {
      if (checkBoxArr[b] == true)
          return true;
  }
  return false;
}

//get the html of match,oddsType:HAD,HIL,CHL,FTS/NTS
function drawHtmlOfMatch(coupon, m, oddsType, matchLineStyle) {
    var sb = new StringBuffer();
    definedPoolArr[m.matchID + oddsType] = 1;
	var pool = getPool(m, oddsType);
    sb.append(drawNoramlOddsRow(coupon, m, oddsType, pool, matchLineStyle));
	return sb.toString();
}

function drawNoramlOddsRow(coupon, m, oddsType, pool, matchLineStyle) {
    var sb = new StringBuffer();

    //checkbox
	sb.append("<tr class=\"" + matchLineStyle + "\" id=\"rmid" + m.matchID + "\">");
    sb.append("<td class=\"cselect\"><input type=\"checkbox\" value=\"" + m.matchID + "\"");
    sb.append(checkBoxArr[m.matchID]==true ? " checked " : "");
    sb.append(" onclick=\"updateCBSelect(this, '" + m.matchID + "');\"/>");
    sb.append("<input type=\"hidden\" id=\"" + m.matchID + "_delay\" value=\"" + (pool ? pool.isBettingDelayNeeded : "false") + "\" />");
    sb.append("<input type=\"hidden\" id=\"" + m.matchID + "_isMatchOfDay\" value=\"" + m.isMatchOfDay + "\" />");
    sb.append("<input type=\"hidden\" id=\"" + m.matchID + "_esst\" value=\"" + m.esst + "\" />");
    sb.append("<input type=\"hidden\" id=\"" + m.matchID + "_matchStatus\" value=\"" + m.matchStatus + "\" />");
    var matchStage = m.matchStatus.split("@")[0];
    if (m.hasETSPool || matchStage == "1st-extra" || matchStage == "2nd-extra") {
        matchStage = "extratime";
    }
    sb.append("<input type=\"hidden\" id=\"hsst" + m.matchID + "\" value=\"" + matchStage + "\" />");
    if (oddsType == "FTS/NTS") {
        sb.append("<input type=\"hidden\" id=\"" + m.matchID + "_NTS_isETS\" value=\"" + m.hasETSPool + "\" />");
    }
    sb.append("</td>");
    //match no
    sb.append("<td class=\"cday\">");
    sb.append("<span id=\"" + m.matchID + "_matchNum\">");
    sb.append(getMatchNum(m, oddsType));
    sb.append("</span></td>");
    //esst
    sb.append("<td class=\"cesst\"><span id=\"" + m.matchID + "_status\">");
    if (m.matchStatus.indexOf("delayed") >= 0
          || m.matchStatus.indexOf("intermission") >= 0
          || m.matchStatus.indexOf("suspended") >= 0) {
        sb.append("-");
    }
    else if (m.isStarted) {
        sb.append(formatStatus(m.matchStatus, m.betradarDataIncomplete));
    } else if (!$.isNullOrEmpty(m.esst)) {
        var date = m.esst.split(" ")[0];
        var time = m.esst.split(" ")[1];
        sb.append(date.substring(0, date.length - 5) + " " + time.substring(0, 5));
    }
    sb.append("</span></td>");
    //team
    //sb.append("<td class=\"cteams\"><span id=\"" + m.matchID + "_team\">");
    sb.append(getTeamStr(m));
    //sb.append("</span></td>");
    //score
    sb.append("<td class=\"cscore redColor\">");
    if (m.matchStatus.indexOf("delayed") >= 0
          || m.matchStatus.indexOf("intermission") >= 0
          || m.matchStatus.indexOf("suspended") >= 0) {
        sb.append("<span class=\"pointer\" id=\"" + m.matchID + "_score\">");
        sb.append("-");
        sb.append("</span>");
    }
    else if (m.isStarted) {
        sb.append("<span class=\"pointer\" id=\"" + m.matchID + "_score\"");
        if (!m.isEmergency) {
            sb.append(" onclick=\"openEventWindow(this,'" + m.matchID + "','" + oddsType + "');\"");
        } 
        sb.append(">");
        sb.append(m.score);
        sb.append("</span>");
    } else {
        sb.append("<span class=\"pointer\" id=\"" + m.matchID + "_score\">");
        sb.append("-");
        sb.append("</span>");
    }
    sb.append("</td>");
    //corner
    if (oddsType == "CHL") {
        sb.append("<td class=\"ccorner redColor\">");
        var normalTimeMatchStages = ["1st-half", "mid-event", "2nd-half"];
        var isShow = false;
        for (var i = 0; i < normalTimeMatchStages.length; ++i) {
            if (matchStage == normalTimeMatchStages[i]) {
                isShow = true;
                break;
            }
        }
        if (m.matchStatus.indexOf("delayed") >= 0
          || m.matchStatus.indexOf("intermission") >= 0
          || m.matchStatus.indexOf("suspended") >= 0) {
            sb.append("<span id=\"" + m.matchID + "_corner\">");
            sb.append("-");
            sb.append("</span>");
        }
        else if (
            m.isStarted &&
            isShow
        ) {
            sb.append("<span id=\"" + m.matchID + "_corner\">");
            sb.append(m.ninetyMinsTotalCorner);
            sb.append("</span>");
        } else {
            sb.append("<span id=\"" + m.matchID + "_corner\">");
            sb.append("-");
            sb.append("</span>");
        }
        sb.append("</td>");
    }
    //tv
    sb.append("<td class=\"ctv\"><span class=\"tv\" id=\"" + m.matchID + "_tv" + "\">");
    sb.append(getTvStr(m));
    sb.append("</span></td>");
    //live cast
    sb.append("<td class=\"clive-cast\"><span id=\"" + m.matchID + "_liveCast\">");
    sb.append(getLiveCastStr(m));
    sb.append("</span></td>");
    //goal
    if (oddsType == "FTS/NTS") {
        sb.append("<td class=\"cgoal\"><span id=\"ntspartdisplay_" + m.matchID + "\"");
        if (pool.name=="FTS") {
            sb.append(" onmouseover=\"javascript:openTips(this,'fts');\" onmouseout=\"javascript:closeTips();\">");
            sb.append("F");
        } else if (pool.name=="NTS") {
            sb.append(" onmouseover=\"javascript:openTips(this,'nts')\" onmouseout=\"javascript:closeTips()\">");
            sb.append(pool.itemNum);
        }
        sb.append("</span>");
        if (pool.name=="NTS") {
            sb.append("<span style=\"display:none\" id=\"ntspart_" + m.matchID + "\">").append(cntGoalNumber(pool.itemNum)).append("</span>");
        }
        sb.append("</td>");
    }

    //odds
    sb.append(drawOddsHtml(coupon, m, oddsType, pool));
	sb.append("</tr>");

    return sb.toString();
}

function cntGoalNumber(_intGoal) {
    var intGoal = parseInt(_intGoal);
    var cntGoal = "";
    if (jsLang == "EN") {
        cntGoal = "th";

        if (intGoal < 11 || intGoal > 20) {
            if (intGoal % 10 == 1) {
                cntGoal = "st";
            } else if (intGoal % 10 == 2) {
                cntGoal = "nd";
            } else if (intGoal % 10 == 3) {
                cntGoal = "rd";
            }
        }
    }
    return intGoal + cntGoal;
}

function teamMouseOver(mid) {
    $("#" + mid + "_hteam").addClass("mOver");
    $("#" + mid + "_hteam").css("cursor", "pointer");
    $("#" + mid + "_vs").addClass("mOver");
    $("#" + mid + "_ateam").addClass("mOver");
    $("#" + mid + "_ateam").css("cursor", "pointer");
}

function teamMouseOut(mid) {
    $("#" + mid + "_hteam").removeClass("mOver");
    $("#" + mid + "_hteam").css("cursor", "auto");
    $("#" + mid + "_vs").removeClass("mOver");
    $("#" + mid + "_ateam").removeClass("mOver");
    $("#" + mid + "_ateam").css("cursor", "auto");
}

function genHomeTeamTable(m, aTag) {
    var sb = new StringBuffer();
    sb.append("<td id=\"" + m.matchID + "_hteam\" class=\"teamname\"");
    if (aTag != "") {
        sb.append(" onmouseover=\"teamMouseOver('" + m.matchID + "')\"");
        sb.append(" onmouseout=\"teamMouseOut('" + m.matchID + "')\"");
        sb.append(" onclick=\"" + aTag + "\"");
    }
    sb.append("><span>" + m.homeTeam.teamName + "</span></td>");
    return sb.toString();
}

function genHomeRedCard(m, aTag) {
    var sb = new StringBuffer();
    if (m.homeTeam.redCard > 0) {
        sb.append("<td style=\"width:10px;border-left:none;text-align:right\" id=\"" + m.matchID + "_hred\" class=\"home_red_card\">");
        sb.append("<span><img src=\"" + footImagePath + "redcard_" + m.homeTeam.redCard + ".gif?CV=" + cv + "\"");
        sb.append(" title=\"" + GetGlobalResources("RedCard", "js") + ":" + m.homeTeam.redCard + "\" onerror=\"errImg(this);\" />");
    }
    else {
        sb.append("<td style=\"width:0px;border-left:none\" id=\"" + m.matchID + "_hred\">");
        sb.append("<span><img src=\"" + footImagePath + "spacer.gif\" width=\"0\" height=\"0\" />");
    }
    sb.append("</span></td>");
    return sb.toString();
}

function genVs(m, aTag) {
    var sb = new StringBuffer();
    sb.append("<td style=\"width:14px;border-left:none;text-align:center\" id=\"" + m.matchID + "_vs\" class=\"span_vs\"><span>");
    sb.append(GetGlobalResources("VS", "js"));
    sb.append("</span></td>");
    return sb.toString();
}

function genAwayRedCard(m, aTag) {
    var sb = new StringBuffer();
    if (m.awayTeam.redCard > 0) {
        sb.append("<td style=\"width:10px;border-left:none;text-align:left\" id=\"" + m.matchID + "_ared\" class=\"away_red_card\">");
        sb.append("<span><img src=\"" + footImagePath + "redcard_" + m.awayTeam.redCard + ".gif?CV=" + cv + "\"");
        sb.append(" title=\"" + GetGlobalResources("RedCard", "js") + ":" + m.awayTeam.redCard + "\" onerror=\"errImg(this);\" />");
    }
    else {
        sb.append("<td style=\"width:0px;border-left:none\" id=\"" + m.matchID + "_ared\">");
        sb.append("<span><img src=\"" + footImagePath + "spacer.gif\" width=\"0\" height=\"0\" />");
    }
    sb.append("</span></td>");
    return sb.toString();
}

function genAwayTeamTable(m, aTag) {
    var sb = new StringBuffer();
    sb.append("<td style=\"border-left:none\" id=\"" + m.matchID + "_ateam\" class=\"teamname\"");
    if (aTag != "") {
        sb.append(" onmouseover=\"teamMouseOver('" + m.matchID + "')\"");
        sb.append(" onmouseout=\"teamMouseOut('" + m.matchID + "')\"");
        sb.append(" onclick=\"" + aTag + "\"");
    }
    sb.append("><span>" + m.awayTeam.teamName + "</span></td>");
    return sb.toString();
}

function getNeutralGround(m, aTag) {
    var sb = new StringBuffer();
    if (m.isNeutralGround) {
        var ngText = (m.neutralVenue == '') ? ng : (ng1 + " " + m.neutralVenue + " " + ng2);
        sb.append("<td style=\"width:16px;border-left:none\" id=\"" + m.matchID + "_ng\" class=\"neutral_ground\">");
        sb.append("<span><img class=\"neutral_ground\" src=\"" + footImagePath + "icon_neutral.gif?CV=" + cv + "\" title=\"" + ngText + "\" onerror=\"errImg(this);\" />");
    }
    else {
        sb.append("<td style=\"width:0px;border-left:none\" id=\"" + m.matchID + "_ng\">");
        sb.append("<span><img src=\"" + footImagePath + "spacer.gif\" width=\"0\" height=\"0\" />");
    }
    sb.append("</span></td>");
    return sb.toString();
}

function getTeamStr(m) {
    var sb = new StringBuffer();
    var aTag = "";
    if ( !isMatchFinish(m) )
      aTag = "callMatchInfo('?tdate=" + m.matchDate + "&tday=" + m.matchDay + "&tnum=" + m.matchNum + "')";
    sb.append(genHomeTeamTable(m, aTag));
    sb.append(genHomeRedCard(m, aTag));
    sb.append(genVs(m, aTag));
    sb.append(genAwayRedCard(m, aTag));
    sb.append(genAwayTeamTable(m, aTag));
    sb.append(getNeutralGround(m, aTag));
    return sb.toString();
}

function getTvStr(match) {
    var sb = new StringBuffer();
    if (match != null) {
        try {
            var betSlip = top.document.getElementById('betSlipFrame');
            if (checkIsLogin() && match.isWebTV && betSlip && betSlip.contentWindow.GetDataStore('football_live_ind') == "Y") {
                if (match.isStarted)
                    sb.append("<a href=\"javascript:top.betSlipFrame.openWebTVWindow(" + match.matchID + ");\">");
                else
                    sb.append("<a href=\"javascript:top.betSlipFrame.openWebTVWindow();\">");
                sb.append("<img src=\"" + footImagePath + "tv.gif?CV=" + cv + "\"");
                sb.append("alt=\"\" title=\"" + jsfootballLiveSchedule + "\" onerror='errImg(this);' \>");
                sb.append("</a>");
            } else {
                if (match.channel.channelCode.length > 0) {
                    sb.append("<a href=\"javascript:goTVUrl();\">");
                    sb.append("<img src=\"" + nasImagePath + "icon_tv-" + match.channel.channelCode[0] + ".gif?CV=" + cv + "\"");
                    var txt = "";
                    for (var k = 0; k < match.channel.channelCode.length; k++) {
                        txt = txt + match.channel.channelCode[k] + "-" + match.channel.name[k] + " \n";
                    }
                    sb.append("alt=\"" + txt + "\" title=\"" + txt + "\" onerror='errImg(this);' \>");
                    sb.append("</a>");
                }
            }
        }
        catch (ex) {
        }
    }
    return sb.toString();
}

function getLiveCastStr(match) {
    var sb = new StringBuffer();
    if (match != null && match.isLiveCast) {
        var liveCastPara = "id=249&layoutid=1&matchid=" + match.betradarMatchID + "&language=" + (jsLang == "EN" ? "en" : "zht");
        sb.append("<a href=\"javascript:callLiveCast('?" + liveCastPara + "')\">");
        sb.append("<img src=\"" + footImagePath + "t.gif?CV=" + cv + "\" title=\"\" onerror=\"errImg(this);\"/></a>");
    }
    return sb.toString();
}

//get html of odds,oddsType:HAD,HIL,CHL,FTS,NTS
function drawOddsHtml(coupon, m, oddsType, pool) {
    var sb = new StringBuffer();
    if (pool != null) {
        var isSelling = checkIsSell(pool);
        var isPoolRemoved = pool.isRemoved || pool.isPurged;
        var canFormAllUp = m.matchStatus.indexOf("halted") < 0 //match is not closed
                        && pool.poolStatus == "start-sell" // pool is start sell
                        && !pool.isBettingDelayNeeded // pool is not in-play-ing
                        && (pool.allUp == "true" || pool.allUp == "1");
        if (pool.name == "HAD") {
            sb.append(drawOddsItemHtml(coupon, pool, "H", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
            sb.append(drawOddsItemHtml(coupon, pool, "D", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
            sb.append(drawOddsItemHtml(coupon, pool, "A", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
        } else if (pool.name == "HIL" || pool.name == "CHL") {
			pool.odds.sort(sortMultipleLines);
			var showExpandButton = (pool.odds.length > 1) ? 1 : 0;
			sb.append("<td class=\"cline\">");
			if ( hasMLOddsChange(m.matchID, pool) )
			    multipleLinePoolIds["m"+m.matchID]=1;
            
			checkMainlineChange(m.matchID, pool);

            for ( var i=0; i<5; i++ ) {
				var line = '';
				var mainline = false;
				if ( pool.odds[i]!=null ) {
					line = pool.odds[i].line || "";
					mainline = pool.odds[i].isMainline;
				}
				sb.append("<div class=\"mlMainRow\" id=\"" + m.matchID + "_" + pool.name);
				sb.append("_LINE" + ((i > 0)?'_' + i:"") + "\" style=\"");
				var displayStyle = 'display:none';
				if ( mainline || (multipleLinePoolIds["m"+m.matchID]==1 && i<lineRowCount[coupon + '_' + m.matchID]) )
					displayStyle = '';
				sb.append(displayStyle);
				sb.append("\">");
				sb.append("[").append(line).append("]</div>");
			}

			sb.append("</td>");
			sb.append(drawOddsItemHtml(coupon, pool, "H", 5, m.matchID, isSelling, canFormAllUp, isPoolRemoved, -1));
			sb.append(drawOddsItemHtml(coupon, pool, "L", 5, m.matchID, isSelling, canFormAllUp, isPoolRemoved, showExpandButton));
        } else if (pool.name == "NTS") {
            sb.append(drawOddsItemHtml(coupon, pool, "H", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
            sb.append(drawOddsItemHtml(coupon, pool, "N", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
            sb.append(drawOddsItemHtml(coupon, pool, "A", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
        } else if (pool.name == "FTS") {
            sb.append(drawOddsItemHtml(coupon, pool, "H", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
            sb.append(drawOddsItemHtml(coupon, pool, "N", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
			sb.append(drawOddsItemHtml(coupon, pool, "A", 1, m.matchID, isSelling, canFormAllUp, isPoolRemoved));
        }
    }
    return sb.toString();
}

//draw odds td,betType:HAD,HIL,CHL,FTS,NTS
function drawOddsItemHtml(coupon, pool, itemName, rowCount, matchID, sell, canAllUp, isPoolRemoved, hasExpandButton) {
    var sb = new StringBuffer();
	var betType = pool.name;
    var oddsClass = "codds-had";
    if (betType == "NTS" || betType == "FTS") {
        oddsClass = "codds-nts";
    } else if (betType == "HIL") {
        oddsClass = "codds-hil";
    } else if (betType == "CHL") {
        oddsClass = "codds-chl";
    }
	
    sb.append("<td style=\"white-space:nowrap\" class=\"" + oddsClass + " codds\">");

    for ( var i=0; i<rowCount; i++ ) {
		var isSelling = sell;
		var odds = '';
		var mainline = false;
		var lineNo = 1;
		
		if ( pool.odds[i]!=null ) {
			odds = eval('pool.odds['+i+'].'+itemName);
			if ( betType=="HIL" || betType=="CHL" ) {
				isSelling &= (pool.odds[i].lineStatus==1);
				mainline = pool.odds[i].isMainline;
				lineNo = pool.odds[i].lineNo;
			}
		}
		var boxcheck = isSelling && isSelectionCheckBoxChecked(matchID, betType, itemName + '_' + lineNo);
		var oddsText = (odds && odds.split("@")[1]) ? odds.split("@")[1] : "---";
		var oddsStatus = (odds && odds.split("@")[0]) ? odds.split("@")[0] : "---";
		if (!isSelling || $.isNullOrEmpty(oddsText) || isPoolRemoved) {
			oddsText = "---";
		}
		sb.append("<div id=\"mlId" + matchID + itemName + "_" + i + "\" class=\"mlMainRow" + ((!mainline)?" otherLineRow":"") + (boxcheck ? " checkedOdds" : "") + "\" style=\"");
		var displayStyle = 'display:none';
		if ( (betType!="HIL" && betType!="CHL") || mainline || (multipleLinePoolIds["m"+matchID]==1 && i<lineRowCount[coupon + '_' + matchID]) )
			displayStyle = '';
		sb.append(displayStyle);
		sb.append("\">");
		var chkName = "chk" + betType;
		var chkID = matchID + "_" + betType + "_" + itemName + ((i > 0)?'_' + i:"") + "_c";
		var spanID = matchID + "_" + betType + "_" + itemName + ((i > 0)?'_' + i:"");
		sb.append("<input type=\"checkbox\" name=\"" + chkName + "\" id=\"" + chkID + "\" lineNo=\"" + lineNo + "\" value=\"\" onclick=\"tgTD(this);")
			.append("setSelectionCheckBox('" + matchID + "', '" + betType + "', '" + itemName).append("', this);\"");
		if (!isSelling || oddsText == "RFD" || oddsText == "LSE" || oddsText == "---" || isDisabled(oddsStatus)) {
			sb.append(" disabled=\"disabled\"");
		}
		if (boxcheck) {
			sb.append(" checked");
		}
		sb.append("/>");
		if (canAllUp && oddsText != "---") {
			sb.append("<a class=\"oddsLink\" href=\"javascript:calBet(this,'" + matchID + "','" + betType + "','" + itemName + "','"
			+ ((i > 0)?i:"")
			+ "');\" title=\"" + GetGlobalResources("AllupCalculator", "js") + "\">");
		} else {
			sb.append("<a class=\"oddsLink noUL\">");
		}
		sb.append("<span id=\"" + spanID + "\" ");
		if (oddsStatus.charAt(1) == '1' && oddsText != "---")
			sb.append('class="oupt"');
		sb.append(">");
		if (odds == "RFD") {
			sb.append(jsRFD);
		}
		else if (odds == "LSE") {
			sb.append(jsLSE);
		} else {
			sb.append(oddsText);
			oldOdds[spanID] = oddsText;
		}
		sb.append("</span></a>");
		sb.append("</div>");
	}
	sb.append("</td>");
	if ( hasExpandButton > -1 ) {
		sb.append("<td class='tgIndMl mlinebtn'>");
		sb.append("<span id=\"mlExpandBtn_" + matchID + "\" style=\"cursor:pointer;");
		if ( hasExpandButton <= 0 )
			sb.append("display:none;");
		sb.append("\" class=\"");
		sb.append((multipleLinePoolIds["m"+matchID]==1) ? "spBtnMinus" : "spBtnPlus");
		sb.append("\" onclick=\"toggleMLDisplay(" + coupon + ", '" + matchID + "','" + pool.name + "')\"></span>");
		sb.append("</td>");
	}
    return sb.toString();
}

function tgILC(coupon) {
	if ( showHideBtn[coupon]==1 )
		collapseILC(coupon);
	else
		expandILC(coupon);
}

function expandILC(coupon) {
	showHideBtn[coupon] = 1;
	$('#tgCouBtn'+coupon).addClass("spBtnMinus");
	$('#tgCouBtn'+coupon).removeClass("spBtnPlus");
	for ( var key in lineRowCount ) {
		var tmp = key.split('_');
		if ( coupon==tmp[0] )
			$("#rmid" + tmp[1]).show();
	}
}

function collapseILC(coupon) {
	showHideBtn[coupon] = 0;
	$('#tgCouBtn'+coupon).addClass("spBtnPlus");
	$('#tgCouBtn'+coupon).removeClass("spBtnMinus");
	for ( var key in lineRowCount ) {
		var tmp = key.split('_');
		if ( coupon==tmp[0] )
			$("#rmid" + tmp[1]).hide();
	}
}

function isAllMultipleLineButtonsExpand(coupon) {
    for ( var key in lineRowCount ) {
		if ( lineRowCount[key] <= 1 )
			continue;
	    var tmp = key.split('_');
		if ( coupon==tmp[0] ) {
			if ( multipleLinePoolIds["m"+tmp[1]]!=1 )
				return false;
		}
    }
	return true;
}

function isAllMultipleLineButtonsCollapse(coupon) {
    for ( var key in lineRowCount ) {
		if ( lineRowCount[key] <= 1 )
			continue;
	    var tmp = key.split('_');
		if ( coupon==tmp[0] ) {
			if ( multipleLinePoolIds["m"+tmp[1]]==1 )
				return false;
		}
    }
	return true;
}

function expandLines(coupon, matchId, oddsType) {
	multipleLinePoolIds["m" + matchId] = 1;
	$("#mlExpandBtn_" + matchId).removeClass("spBtnPlus").addClass("spBtnMinus");
	for ( var i=0; i<lineRowCount[coupon + '_' + matchId]; i++ ) {
		$("#" + matchId + "_" + oddsType + "_LINE" + (i>0?"_"+i:"")).show();
		$("#mlId" + matchId + "H" + "_" + i).show();
		$("#mlId" + matchId + "L" + "_" + i).show();
	}
}

function collapseLines(coupon, matchId, oddsType) {
	multipleLinePoolIds["m" + matchId] = 0;
	$("#mlExpandBtn_" + matchId).removeClass("spBtnMinus").addClass("spBtnPlus");
	var match = getMatch(matchId);
	var pool = getPool(match, oddsType);
	for ( var i=0; i<5; i++ ) {
		if ( pool.odds[i] && !pool.odds[i].isMainline ) {
			$("#" + matchId + "_" + oddsType + "_LINE" + (i>0?"_"+i:"")).hide();
			$("#mlId" + matchId + "H" + "_" + i).hide();
			$("#mlId" + matchId + "L" + "_" + i).hide();
		}
	}
}

function toggleMLDisplay(coupon, matchId, oddsType) {
	if ( multipleLinePoolIds["m" + matchId]!=1 ) { // to expand
		expandLines(coupon, matchId, oddsType);
		if ( isAllMultipleLineButtonsExpand(coupon) ) {
		    $("#tgAllMLBtn_" + coupon).html(GetGlobalResources("CollapseAll", "js") + "<span class=\"spBtnMinus\"></span>");
			multipleLinePoolIds[coupon +"_ALL"] = 1;
		}
	}
	else { // to collapse
		collapseLines(coupon, matchId, oddsType);
		//if ( isAllMultipleLineButtonsCollapse(coupon) ) {
		    $("#tgAllMLBtn_" + coupon).html(GetGlobalResources("ExpandAll", "js") + "<span class=\"spBtnPlus\"></span>");
			multipleLinePoolIds[coupon + "_ALL"] = 0;
		//}
	}

}

function toggleAllMLDisplay(e,coupon, oddsType) {
    var event = e || window.event;
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    else{
        e.cancelBubble = true;
    }

	if ( showHideBtn[coupon]!=1 )
		expandILC(coupon);
	if ( multipleLinePoolIds[coupon + "_ALL"] != 1 ) { //expand all
        for (var key in lineRowCount) {
			var tmp = key.split('_');
			if ( coupon==tmp[0] )
				expandLines(coupon, tmp[1], oddsType);
		}
		$("#tgAllMLBtn_" + coupon).html(GetGlobalResources("CollapseAll", "js") + "<span class=\"spBtnMinus\"></span>");
		multipleLinePoolIds[coupon + "_ALL"] = 1;
    }
	else if ( multipleLinePoolIds[coupon + "_ALL"] == 1 ) {
        for (var key in lineRowCount) {
			var tmp = key.split('_');
			if ( coupon==tmp[0] )
				collapseLines(coupon, tmp[1], oddsType);
		}
		$("#tgAllMLBtn_" + coupon).html(GetGlobalResources("ExpandAll", "js") + "<span class=\"spBtnPlus\"></span>");
		multipleLinePoolIds[coupon + "_ALL"] = 0;
	}
}

//display the selected matches
function showSelectedMatches() {
    $("#divLoading").show();
    selectionCheckBox = [];
    isShowSelected = true;
    pageIndex = 1;
	if (oddsRefreshType!="push")
		render();
	else
		doFilterPush();
    closeEventWindow();
}

//display all matches,oddsType:HAD,HIL,CHL,FTS/NTS
function showAllMatches(oddsType) {
    //delete the event window
    selectionCheckBox = [];
    isShowSelected = false;
    oddsType = oddsType.toUpperCase();
    closeEventWindow();
    $(".selLeague select").eq(0).val("all");
    leagueCode = "ALL";
    hasChannel = "ALL";
    isLiveCast = "ALL";
    hasInplayPool = "ALL";
    pageIndex = 1;
	if (oddsRefreshType!="push")
		render();
	else
		doFilterPush();
}

//
function showInplay(oddsType) {
    $("#divLoading").show();
    selectionCheckBox = [];
    hasChannel = "ALL";
    isLiveCast = "ALL";
    hasInplayPool = "true";
    pageIndex = 1;
	if (oddsRefreshType!="push")
		render();
	else
		doFilterPush();
	closeEventWindow();
}

//get the paged matches from filtered matches
function getPagedMatches(matchesArr, pageNo, pageSize) {
    if (matchesArr == null) return;
    var arr = new Array();
    var counter = 0;
    var startIndex = (pageNo - 1) * pageSize;
    var endIndex = pageNo * pageSize - 1;
    for (var i = 0; i < matchesArr.length; i++) {
        var matches = matchesArr[i].matches;
        var obj = {};
        obj.name = matchesArr[i].name;
        obj.matches = new Array();
        var sIndex = startIndex - counter;
        sIndex = sIndex < 0 ? 0 : sIndex;
        var eIndex = endIndex - counter;
        counter = counter + matches.length;
        if ( matches.length==0 ) {
			arr.push(obj);
		} else if ((sIndex + 1) <= matches.length && (eIndex + 1) <= matches.length) {//the startIndex and endIndex are in the same dimension
            obj.matches = matches.slice(sIndex, eIndex + 1);
            arr.push(obj);
            break;
        } else if ((sIndex + 1) <= matches.length && (eIndex + 1) > matches.length) {//the startIndex and endIndex are not in the same dimension
            obj.matches = matches.slice(sIndex);
            arr.push(obj);
            continue;
        } else if ((sIndex + 1) <= (counter - matches.length) && (endIndex + 1) <= matches.length) {//the startIndex and endIndex are not in the same dimension
            obj.matches = matches.slice(endIndex + 1);
            arr.push(obj);
            break;
        }
    }
    return arr;
}

//display the paged matches
function pager(pageNo, pageSize) {
    selectionCheckBox = [];
    $("#divLoading").show();

    pageIndex = pageNo;
    //delete the event window
    closeEventWindow();
    //display the matches
	showHideBtn = [1,1];
    var $obj = $("#tbMatches");
	if (oddsRefreshType!="push") {
		var displayedMatches = getPagedMatches(filteredMatches, pageNo, pageSize);
        resetMultipleLine();
		setLineCount(displayedMatches, poolType);
		$obj.html(drawMatchesHtml(displayedMatches, poolType));
		//add betline
		resetBetLineArray();
		createBetLinesForDisplayMatches(displayedMatches, poolType);
		//display the pagers
		$("#divPager").html(drawPagerHtml(pageSize, filteredMatches.matchesCount, pageNo, buttonCount));
	}
	else
		doFilterPush();

    $("#divLoading").hide();
}

//get the pager
function drawPagerHtml(pageSize, totalRows, pageNo, buttonCount) {
    var sb = new StringBuffer();
    var sbPager = new StringBuffer();
    sb.append("<div class='pager'>");
    if (totalRows > pageSize) {
        sbPager.append("<div class='pageNum'>");
        sbPager.append("&lt;&lt;");
        if (pageNo > 1) {
            sbPager.append("<a href=\"javascript:pager(" + (pageNo - 1) + "," + pageSize + ")\">");
            sbPager.append(GetGlobalResources("Previous", "js"));
            sbPager.append("</a>");
        }
        var pages = totalRows % pageSize == 0 ? Math.floor(totalRows / pageSize) : Math.floor(totalRows / pageSize) + 1;
        var startIndex = 1;
        var toIndex = buttonCount;
        var tmpNum = (Math.floor(pageNo / buttonCount)) * buttonCount;
        if (pages > buttonCount) {
            if (pageNo > buttonCount) {
                if (pageNo > tmpNum) {
                    sbPager.append("<span>|</span>");
                    sbPager.append("<a href=\"javascript:pager(" + tmpNum + "," + pageSize + ")\">");
                    sbPager.append("...");
                    sbPager.append("</a>");
                    startIndex = tmpNum + 1;
                    toIndex = (pages - tmpNum) < buttonCount ? pages : tmpNum + buttonCount;
                } else if (pageNo == tmpNum) {
                    sbPager.append("<span>|</span>");
                    sbPager.append("<a href=\"javascript:pager(" + (pageNo - buttonCount) + "," + pageSize + ")\">");
                    sbPager.append("...");
                    sbPager.append("</a>");
                    startIndex = pageNo - buttonCount + 1;
                    toIndex = pageNo;
                }
            }
        } else {
            toIndex = pages;
        }
        for (var i = startIndex; i <= toIndex; i++) {
            if (pageNo != i) {
                sbPager.append("<a href=\"javascript:pager(" + i + "," + pageSize + ")\">");
                sbPager.append(i);
                sbPager.append("</a>");
            } else {
                sbPager.append("<b>" + i + "</b>");
            }
            sbPager.append("<span>|</span>");
        }
        if (pages > buttonCount) {
            if (pageNo > tmpNum && pageNo <= tmpNum + buttonCount && (tmpNum + buttonCount) < pages) {
                sbPager.append("<a href=\"javascript:pager(" + (tmpNum + buttonCount + 1) + "," + pageSize + ")\">");
                sbPager.append("...");
                sbPager.append("</a>");
            } else if (pageNo == tmpNum) {
                sbPager.append("<a href=\"javascript:pager(" + (pageNo + 1) + "," + pageSize + ")\">");
                sbPager.append("...");
                sbPager.append("</a>");
            }
        }
        if (pageNo < pages) {
            sbPager.append("<a href=\"javascript:pager(" + (pageNo + 1) + "," + pageSize + ")\">");
            sbPager.append(GetGlobalResources("Next", "js"));
            sbPager.append("</a>");
        }
        sbPager.append("&gt;&gt;");
        sbPager.append("</div>");
    }
    var sbPagerInfo = new StringBuffer();
    sbPagerInfo.append("<div class='pageInfo'>");
    sbPagerInfo.append(GetGlobalResources("Pagination1", "js"));
    if (totalRows > 0) {
        sbPagerInfo.append(" ");
        sbPagerInfo.append((pageNo - 1) * pageSize + 1);
        sbPagerInfo.append(" - ");
        sbPagerInfo.append(pageNo * pageSize > totalRows ? totalRows : pageNo * pageSize);
        sbPagerInfo.append(" ");
    } else {
        sbPagerInfo.append("0");
    }
    sbPagerInfo.append(GetGlobalResources("Pagination2", "js"));
    sbPagerInfo.append(totalRows);
    sbPagerInfo.append(GetGlobalResources("Pagination3", "js"));
    sbPagerInfo.append("</div>");
    sb.append(sbPagerInfo.toString());
    sb.append(sbPager.toString());
    sb.append("</div>");

    return sb.toString();
}

//display the dropdownlist
function openDropdown(dropdownObj, contentID, event) {
    var pos = $(dropdownObj).offset();
    var top = pos.top + $(dropdownObj).height();
    $("#" + contentID).css({ position: "absolute", top: top, left: pos.left, zIndex: "1000", backgroundColor: "#DFE9FF", width: "120px", overflow: "hidden" });
    $(".popup").each(function() {
        if ($(this).attr("id") == contentID) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    var e = event ? event : window.event;
    if (window.event) {
        e.cancelBubble = true;
    } else {
        e.stopPropagation();
    }
    $(document).bind("click", function() {
        $(".popup").each(function() {
            $(this).hide();
        });
        $(document).unbind("click");
    });
}

//filter matches by channel / livecast
function filter(val, flag) {
    $("#divLoading").show();
    selectionCheckBox = [];
    if (flag == "channel") {
        hasChannel = val;
        $("#channel-content").hide();
    } else if (flag == "livecast") {
        isLiveCast = val;
        $("#liveCast-content").hide();
    }
    pageIndex = 1;
	if (oddsRefreshType!="push")
		render();
	else
		doFilterPush();
	closeEventWindow();
}

//display the event window,oddsType:HAD,HIL,CHL,FTS,NTS
function openEventWindow(obj, matchID, oddsType) {
    if ($("#divDetails").length > 0) {
        closeEventWindow();
    }
    var match = getMatch(matchID);
    if (match != null && match.isStarted) {
        $("#ilcMatches").append("<div id=\"divDetails\"></div>");
        $("#divDetails").html(drawEventHtml(match, oddsType));
        var pos = $(obj).offset();
        var top = pos.top + $(obj).height();
        $("#divDetails").css({ position: "absolute", top: top, left: (pos.left - 200), width: "456px", zIndex: "1000", backgroundColor: "#fff" });
    }
}

function getMatch(matchID) {
    if (matchID == null) return;
    var match = null;
    if (ilcMatches.length > 0) {
        for (var i = 0; i < ilcMatches.length; i++) {
            for (var j = 0; j < ilcMatches[i].matches.length; j++) {
                var m = ilcMatches[i].matches[j];
                if (parseInt(m.matchID) == parseInt(matchID)) {
                    match = m;
                    break;
                }
            }
            if (match != null) {
                break;
            }
        }
    }
    return match;
}

//draw event html,oddsType:HAD,HIL,CHL,FTS,NTS
function drawEventHtml(match, oddsType) {
    if (match == null) return;

    var sb = new StringBuffer();
    var eventArr = match.event;
    sb.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
    sb.append("<tr><td colspan=\"5\" class=\"crefresh\">");
    sb.append("<input type=\"hidden\" id=\"" + match.matchID + "\" value=\"" + match.matchID + "\" />");
    sb.append("<div>");
    sb.append("<span><a href=\"javascript:closeEventWindow();\"><img src=\"" + footImagePath + "green_closebutton.gif?CV=" + cv + "\" /></a></span>");
    if (oddsRefreshType!="push") {
        sb.append("<span class=\"refresh\"><a href=\"javascript:autoRefreshIlcMatchesByPull('" + match.matchID + "','" + oddsType + "');\">");
        sb.append('<img src="' + commonImagePath + 'icon_refresh.gif?CV=' + cv + '" class="pointer icon" alt="' + GetGlobalResources("Refresh") + '" title="' + GetGlobalResources("Refresh") + '" onerror=\"errImg(this);\" />');
        sb.append("</a></span>");
    }
    sb.append('<span>' + GetGlobalResources("RefreshAt") + ':' + match.lastUpdateTime + '</span>');
    sb.append("</div></td></tr>");
    sb.append("<tr class=\"rhead\"><td colspan=\"2\" class=\"cteam\">");
    sb.append(match.homeTeam.teamName);
    sb.append("</td><td class=\"cmin\">Min</td><td colspan=\"2\" class=\"cteam\">");
    sb.append(match.awayTeam.teamName);
    sb.append("</td></tr>");
    if (!match.betradarDataIncomplete && eventArr.length > 0) {
        //event:[['9','redCard','beckham','Home'],['15','goal','figo','Away'],['25','goal','figo','Away']]
        for (var k = 0; k < eventArr.length; k++) {
            if (k == eventArr.length - 1) {
                sb.append("<tr class=\"rlast\">");
            } else {
                sb.append("<tr class=\"rcont\">");
            }
            var tmpArr = eventArr[k];
            if ((tmpArr[3].toLowerCase() == "away" && tmpArr[1].toLowerCase() != "own-goal")
             || (tmpArr[3].toLowerCase() == "home" && tmpArr[1].toLowerCase() == "own-goal")) {
                sb.append("<td class=\"cevent no-leftBorder\">&nbsp;</td><td class=\"cplayer\">&nbsp;</td>");
                sb.append("<td class=\"cmin\">");
                sb.append((tmpArr[0] != "-1") ? tmpArr[0] : "");
                sb.append("</td>");
                sb.append("<td class=\"cplayer\">");
                sb.append(tmpArr[2]);
                if (tmpArr[1].toLowerCase() == "own-goal")
                    sb.append(" (").append(GetGlobalResources("owngoal", "js")).append(")");
                sb.append("</td>");
            }
            if (tmpArr[3].toLowerCase() == "away") {
                sb.append("<td class=\"cevent\">");
            } else if (tmpArr[3].toLowerCase() == "home") {
                sb.append("<td class=\"cevent no-leftBorder\">");
            }
            if (tmpArr[1].toLowerCase() == "red-card") {
                sb.append("<img src='" + footImagePath + "red_card.gif?CV=" + cv + "' title='' onerror='errImg(this);'/>");
            } else if (tmpArr[1].toLowerCase() == "yellow-card") {
                sb.append("<img src='" + footImagePath + "yellow_card.gif?CV=" + cv + "' title='' onerror='errImg(this);'/>");
            } else {
                sb.append("<img src='" + footImagePath + "icon_ball.gif?CV=" + cv + "' title='' onerror='errImg(this);'/>");
            }
            sb.append("</td>");
            if ((tmpArr[3].toLowerCase() == "home" && tmpArr[1].toLowerCase() != "own-goal")
             || (tmpArr[3].toLowerCase() == "away" && tmpArr[1].toLowerCase() == "own-goal")) {
                sb.append("<td class=\"cplayer\">");
                sb.append(tmpArr[2]);
                if (tmpArr[1].toLowerCase() == "own-goal")
                    sb.append(" (").append(GetGlobalResources("owngoal", "js")).append(")");
                sb.append("</td>");
                sb.append("<td class=\"cmin\">");
                sb.append((tmpArr[0] != "-1") ? tmpArr[0] : "");
                sb.append("</td>");
                sb.append("<td class=\"cplayer\">&nbsp;</td><td class=\"cevent\">&nbsp;</td>");
            }
            sb.append("</tr>");
        }
    }
    sb.append("</table>");

    return sb.toString();
}

//get all new matches to refresh the page,oddsType:HAD,HIL,CHL,FTS/NTS
var enableRefresh = true;
function refreshMatches(oddsType) {
    if (!enableRefresh)
        return;

    enableRefresh = false;
    $("#divLoading").show();
    $.ajax({
        type: "GET",
        url: "../getIlcMatchesString.ashx?lang=" + jsLang,
        success: function(data) {
            eval(data);
            reRender();
            $("#divLoading").hide();
        },
        error: function() {
            $("#divLoading").hide();
        }
    });

    setTimeout(function() { enableRefresh = true }, manualRefreshInterval * 1000);
}

function autoRefreshServerTime() {
    if (oddsRefreshType != "pull")
        return;

    $.ajax({
        type: "GET",
        url: "../getIlcMatchesString.ashx?time=1",
        success: function(data) {
            eval(data);
        },
        error: function() {
        }
    });
}

//refresh the matches by pull,oddsType:HAD,HIL,CHL,FTS,NTS
function autoRefreshIlcMatchesByPull(matchID, oddsType, sortByEsst) {
    if (!enableRefresh)
        return;

    enableRefresh = false;
    $("#divLoading").show();

    $.ajax({
        type: "GET",
        url: "../getIlcMatchesString.ashx?matchID=" + matchID + "&lang=" + jsLang,
        success: function(data) {
            //if match deleted, disable the odds
            if (data == "") {
                var matchIdList = new Array();
                matchIdList.push(matchID);
                deleteFromIlcMatches(matchIdList);
                if (enableSelectLeague) {
                    setLeagues(ilcMatches, leagueCode);
                }
                disableOdds(matchID, oddsType);
                //stop timer
                stopTimer(matchID);
            } else {
                //update data source
                eval("var match = " + data);
                var esst = $("#" + matchID + "_esst").val();
                var isMatchOfDay = $("#" + matchID + "_isMatchOfDay").val() == "true" ? true : false;
                var isRenderNeeded = false;
                var isMatchOfDayChanged = false;
                var sortByEsst = false;
                var isVoidMatch = checkIsVoidMatch(match.matchStatus);
                var isRefund = false;

                if (match.esst != esst) {
                    sortByEsst = true;
                }
                if (match.isMatchOfDay != isMatchOfDay) {
                    isMatchOfDayChanged = true;
                }
                var pool = getPool(match, oddsType);
                if (match.isRemoved || !match.toDisplayIlc || sortByEsst || isMatchOfDayChanged || isVoidMatch || isRefund || pool==null) {
                    isRenderNeeded = true;
                }
                updateIlcMatches(match, isMatchOfDayChanged, sortByEsst, findMatchInIlcMatches(match.matchID));

                if (isRenderNeeded) {//if matchOfDay changed / esst changed, update data source and re-render the display
                    reRender();
                } else {//else update data source and update the display
					var idx = findMatchInFilteredMatches(match.matchID);
                    updateFilteredMatches(match, isMatchOfDayChanged, sortByEsst, idx);
                    updateMatchDisplay(idx.x, match, oddsType);
                    updateBetLine(match, oddsType);
                }
            }
            $("#divLoading").hide();
        },
        error: function() {
            $("#divLoading").hide();
        }
    });

    setTimeout(function() { enableRefresh = true }, manualRefreshInterval * 1000);
}

function checkIsRenderNeeded(match) {
    var isRenderNeeded = false;
    if (ilcMatches != null || match != null) {
        for (var i = 0; i < ilcMatches.length; i++) {
            for (var j = 0; j < ilcMatches[i].matches.length; j++) {
                var m = ilcMatches[i].matches[j];
                if (m.matchID == match.matchID) {
                    if (m.isRemoved != match.isRemoved || m.toDisplayIlc != match.toDisplayIlc/* || m.isEmergency != match.isEmergency*/
                        || m.esst != match.esst || m.isMatchOfDay != match.isMatchOfDay) {
                        isRenderNeeded = true;
                        break;
                    }
                }
            }
            if (isRenderNeeded) {
                break;
            }
        }
    }
    return isRenderNeeded;
}

//check if the ilcMatches has mathces
function checkHasMatches() {
    var hasMatches = false;
    if (ilcMatches != null) {
        for (var i = 0; i < ilcMatches.length; i++) {
            if (ilcMatches[i].matches.length > 0) {
                hasMatches = true;
                break;
            }
        }
    }
    return hasMatches;
}

//close the event window
function closeEventWindow() {
    $("#divDetails").remove();
}

//find the match in data source
function finMatchInDataSource(dataSource, matchID) {
    if (dataSource == null || $.isNullOrEmpty(matchID))
        return;
    var obj = null;
    var exist = false;
    for (var i = 0; i < dataSource.length; i++) {
        for (var j = 0; j < dataSource[i].matches.length; j++) {
            var m = dataSource[i].matches[j];
            if (parseInt(m.matchID) == parseInt(matchID)) {
                exist = true;
                obj = new Object()
                obj.x = i;
                obj.y = j;
                break;
            }
        }
        if (exist) {
            break;
        }
    }
    return obj;
}

//find the match in ilcMatches
function findMatchInIlcMatches(matchID) {
    return finMatchInDataSource(ilcMatches, matchID);
}

//find the match in filteredMatches
function findMatchInFilteredMatches(matchID) {
    return finMatchInDataSource(filteredMatches, matchID);
}

//insert new match into data source
function insertNewMatchIntoIlcMatches(match) {
    if (ilcMatches == null || match == null) return;
    var index = getIndexForMatchToInserted(ilcMatches, match);
    var firstX = index[0];
    var firstY = index[1];

    //add the match
    ilcMatches[firstX].matches.splice(firstY, 0, match);
}

//update the data source
function updateDataSource(dataSource, match, isMatchOfDayChanged, sortByEsst, matchInfoInDataSource) {
    if (dataSource == null || match == null || matchInfoInDataSource == null)
        return;

    var secondX = 0;
    var secondY = 0;
    secondX = matchInfoInDataSource.x;
    secondY = matchInfoInDataSource.y;
    //handler match time, if the source match's status like '1st-half@25/05/2011 10:10:10',
    //but the updated match's status like '1st-half@', then the match time will not be replaced

    var oldMatch = dataSource[secondX].matches[secondY];
    var oldStatus = oldMatch.matchStatus.split("@")[0];
    var newStatus = match.matchStatus.split("@")[0];
    var oldTime = oldMatch.matchStatus.split("@")[1];
    var newTime = match.matchStatus.split("@")[1];
    if (oldStatus == newStatus && (!$.isNullOrEmpty(oldTime) && $.isNullOrEmpty(newTime) || oldTime == newTime)) {
        match.matchTime = oldMatch.matchTime;
        match.matchStatus = oldMatch.matchStatus;
    }
    var isSortNeeded = false;
    //if matchOfDay changed or esst changed, sort will be done
    if (isMatchOfDayChanged || sortByEsst) {
        isSortNeeded = true;
    }
    if (isSortNeeded) {
        var index = getIndexForMatchToInserted(dataSource, match);
        var firstX = index[0];
        var firstY = index[1];

        //add the match into data source
        dataSource[firstX].matches.splice(firstY, 0, match);
        //if match exist,delete the match
        if (firstX == secondX) {
            if (secondY >= firstY) {//the place where the new match will be inserted is before the current place
                dataSource[secondX].matches.splice(secondY + 1, 1);
            } else {//the place where the new match will be inserted is after the current place
                dataSource[secondX].matches.splice(secondY, 1);
            }
        } else {
            dataSource[secondX].matches.splice(secondY, 1);
        }
    } else {
        dataSource[secondX].matches.splice(secondY, 1, match);
    }
}

//find the index for the match will inserted
function getIndexForMatchToInserted(dataSource, match) {
    if (dataSource == null || match == null)
        return;

    var findTheIndex = false;
    var firstX = 0;
    var firstY = 0;
    if (match.isMatchOfDay) {
        firstX = 0;
    } else {
        firstX = 1;
    }

    for (var i = 0; i < dataSource[firstX].matches.length; i++) {
        var m = dataSource[firstX].matches[i];
        //if sort,find the index where the match should be inserted,sort by esst,matchNum
        if (!findTheIndex) {
            var d1 = convertToDateTime(m.esst);
            var d2 = convertToDateTime(match.esst);
            if (d1 != null && d2 != null) {
                var res = compareDateTime(d2, d1);
                if (res != "") {
                    if (res == "<") {
                        findTheIndex = true;
                        firstY = i;
                        break;
                    } else if (res == "==" && parseInt(m.matchNum) > parseInt(match.matchNum)) {
                        findTheIndex = true;
                        firstY = i;
                        break;
                    }
                }
            } else {
                if (parseInt(m.matchNum) > parseInt(match.matchNum)) {
                    findTheIndex = true;
                    firstY = i;
                    break;
                }
            }
        }
    }
    if (!findTheIndex) {
        firstY = dataSource[firstX].matches.length;
    }
    return [firstX, firstY];
}

//update the ilcMatches
function updateIlcMatches(match, isMatchOfDayChanged, sortByEsst, matchInfoInIlcMatches) {
    updateDataSource(ilcMatches, match, isMatchOfDayChanged, sortByEsst, matchInfoInIlcMatches);
}

//update the filteredMatches
function updateFilteredMatches(match, isMatchOfDayChanged, sortByEsst, matchInfoInFilteredMatches) {
    updateDataSource(filteredMatches, match, isMatchOfDayChanged, sortByEsst, matchInfoInFilteredMatches);
}

//delete matches from data source
function deleteFromDataSet(dataSource, matchIdList) {
    if (dataSource == null || matchIdList == null)
        return;
    for (var i = 0; i < matchIdList.length; i++) {
        var x = -1;
        var y = -1;
        for (var j = 0; j < dataSource.length; j++) {
            for (var k = 0; k < dataSource[j].matches.length; k++) {
                var m = dataSource[j].matches[k];
                if (parseInt(matchIdList[i]) == parseInt(m.matchID)) {
                    x = j;
                    y = k;
                    break;
                }
            }
            if (x > -1 && y > -1) {
                break;
            }
        }
        if (x > -1 && y > -1) {
            stopTimer(dataSource[x].matches[y].matchID);
            dataSource[x].matches.splice(y, 1);
        }
    }
}

//delete matches from ilcMatches
function deleteFromIlcMatches(matchIdList) {
    deleteFromDataSet(ilcMatches, matchIdList);
}

//delete matches from filteredMatches
function deleteFromFilteredMatches(matchIdList) {
    deleteFromDataSet(filteredMatches, matchIdList);
}

function checkValueNulltoEmpty(value) {
    if (value == undefined || value == null) {
        return "";
    } else {
        return value;
    }
}

function ConvertToBool(value) {
    var res = false;
    if (value == undefined || value == null || value == "") {
        return false;
    } else {
        if (value == true || value.toLowerCase() == "true") {
            res = true;
        }
    }
    return res;
}

//create a match object
function createMatch(matchArray) {
    var sb = new StringBuffer();
    if (matchArray["MATCH_ID"] != null && matchArray["MATCH_ID"] != "") {
        sb.append("{matchID:\"");
        sb.append(matchArray["MATCH_ID"]);
        sb.append("\", matchNum:\"");
        sb.append(checkValueNulltoEmpty(matchArray["MATCH_NUM"]));
        sb.append("\", matchDate:\"");
        sb.append(checkValueNulltoEmpty(matchArray["MATCH_DATE"]));
        sb.append("\", matchDay:\"");
        sb.append(checkValueNulltoEmpty(matchArray["MATCH_DAY"]));
        sb.append("\", esst:\"");
        sb.append(checkValueNulltoEmpty(matchArray["ESST"]));
        sb.append("\", lastUpdateTime:\"");
        sb.append(checkValueNulltoEmpty(matchArray["LAST_UPDATE_TIME"]));
        sb.append("\", isNeutralGround:");
        sb.append(ConvertToBool(matchArray["IS_NEUTRAL_GROUND"]));
        sb.append(", neutralVenue:\"");
        sb.append(checkValueNulltoEmpty(matchArray["NEUTRAL_VENUE"]));
        sb.append("\", league:{leagueCode:\"");
        sb.append(checkValueNulltoEmpty(matchArray["LEAGUE_CODE"]));
        sb.append("\",leagueName:\"");
        sb.append(checkValueNulltoEmpty(matchArray["LEAGUE_NAME"]));
        sb.append("\",shortName:\"");
        sb.append(checkValueNulltoEmpty(matchArray["LEAGUE_SHORT_NAME"]));
        sb.append("\"},homeTeam:{teamName:\"");
        sb.append(checkValueNulltoEmpty(matchArray["HOME_TEAM_NAME"]));
        sb.append("\",redCard:");
        sb.append(checkValueNulltoEmpty(matchArray["HOME_RED_CARD"]));
        sb.append("},awayTeam:{teamName:\"");
        sb.append(checkValueNulltoEmpty(matchArray["AWAY_TEAM_NAME"]));
        sb.append("\",redCard:");
        sb.append(checkValueNulltoEmpty(matchArray["AWAY_RED_CARD"]));
        sb.append("},matchStatus:\"");
        sb.append(checkValueNulltoEmpty(matchArray["MATCH_STATUS"]));
        sb.append("\",matchTime:\"");
        sb.append("0");
        sb.append("\",score:\"");
        sb.append(checkValueNulltoEmpty(matchArray["SCORE"]));
        sb.append("\",ninetyMinsScore:\"");
        sb.append(checkValueNulltoEmpty(matchArray["NINETY_MINS_SCORE"]));        
        sb.append("\",ninetyMinsTotalCorner:\"");
        sb.append(checkValueNulltoEmpty(matchArray["NINETY_MINS_TOTAL_CORNER"]));
        sb.append("\",etScore:\"");
        sb.append(checkValueNulltoEmpty(matchArray["ET_SCORE"]));
        sb.append("\",pkScore:\"");
        sb.append(checkValueNulltoEmpty(matchArray["PK_SCORE"]));
        sb.append("\", channel:{channelCode:");
        sb.append(matchArray["CHANNEL_CODE"] || []);
        sb.append(",name:");
        sb.append(matchArray["CHANNEL_NAME"] || []);
        sb.append("},isLiveCast:");
        sb.append(ConvertToBool(matchArray["IS_LIVECAST"]));
        sb.append(",isMatchOfDay:");
        sb.append(ConvertToBool(matchArray["IS_MATCHOFDAY"]));
        sb.append(",hasInplayPool:");
        sb.append(ConvertToBool(matchArray["HAS_INPLAYPOOL"]));
        sb.append(",isStarted:");
        sb.append(ConvertToBool(matchArray["IS_STARTED"]));
        sb.append(",isWebTV:");
        sb.append(ConvertToBool(matchArray["IS_WEB_TV"]));
        sb.append(",isEmergency:");
        sb.append(checkValueNulltoEmpty(matchArray["EMERGENCY_CONTROL"]));
        sb.append(",toDisplayIlc:");
        sb.append(ConvertToBool(matchArray["ILC_DISPLAY"]));
        sb.append(",isRemoved:");
        sb.append(ConvertToBool(matchArray["MATCH_IS_REMOVED"]));
        sb.append(",betradarMatchID:\"");
        sb.append(checkValueNulltoEmpty(matchArray["BETRADAR_MATCH_ID"]));
        sb.append("\",hasETSPool:");
        sb.append(checkValueNulltoEmpty(matchArray["ETS_ITEM_NUM"])!='');
        sb.append(",betradarDataIncomplete:");
        sb.append(ConvertToBool(matchArray["BETRADAR_DATA_INCOMPLETE"]));
        sb.append(",event:");
        sb.append(matchArray["EVENT"] || []);
        sb.append(",pools:{");
        var poolArray = new Array();
        if (matchArray["HAD_H"] != null && matchArray["HAD_A"] != null && matchArray["HAD_D"] != null) {
            poolArray.push("HAD");
        }

        for (var i = 1; i <= 5; i++) {
            if (matchArray["HIL_H_" + i] != null && matchArray["HIL_L_" + i] != null && matchArray["HIL_LINE_" + i] != null) {
                poolArray.push("HIL");
                break;
            }
        }
        for (var i = 1; i <= 5; i++) {
            if (matchArray["CHL_H_" + i] != null && matchArray["CHL_L_" + i] != null && matchArray["CHL_LINE_" + i] != null) {
                poolArray.push("CHL");
                break;
            }
        }
        
        if (matchArray["NTS_H"] != null && matchArray["NTS_N"] != null && matchArray["NTS_A"] != null) {
            poolArray.push("NTS");
        }
        if (matchArray["FTS_H"] != null && matchArray["FTS_N"] != null && matchArray["FTS_A"] != null) {
            poolArray.push("FTS");
        }
        if (matchArray["ETS_H"] != null && matchArray["ETS_N"] != null && matchArray["ETS_A"] != null) {
            poolArray.push("ETS");
        }
        if (poolArray.length > 0) {
            for (var i = 0; i < poolArray.length; i++) {
                var odds = getOddsObjStr(matchArray, poolArray[i]);
                if (odds != "") {
                    if (i > 0) {
                        sb.append(",");
                    }
                    sb.append(odds);
                }
            }
        }
        sb.append("},extraTimes:{");
        sb.append(getExtraTimeStr(matchArray));
        sb.append("}}");
    }
    if (sb.toString() != "") {
        var match = null;
        try {
            //alert(sb.toString());
            eval("match = " + sb.toString() + ";");

            //match = sb.toString;
        } catch (e) {
            //alert("Create match error!");
        }
        return match;
    }

    return null;
}

//get the odds string,oddsType:HAD,FTS,NTS
function getOddsObjStr(matchArray, oddsType) {
    var sb = new StringBuffer();
    var sbOdds = new StringBuffer();
    var reg = new RegExp("^(" + oddsType + ")_([HADNL])$", "i");
    var index = 0;
    var exist = false;

    if ( oddsType=='HIL' || oddsType=='CHL' ) {
		for (var i = 1; i <= 5; i++) {
			if (matchArray[oddsType + "_H_" + i] != null
			  && matchArray[oddsType + "_L_" + i] != null
			  && matchArray[oddsType + "_LINE_" + i] != null
			  && (matchArray[oddsType + "_LINESTATUS_" + i]=="1" || matchArray[oddsType + "_LINESTATUS_" + i]=="2" )) {
				if ( exist )
					sbOdds.append(',');
			    sbOdds.append('{lineNo:').append(i);
				sbOdds.append(',line:"').append(matchArray[oddsType + "_LINE_" + i]).append('"');
				sbOdds.append(',isMainline:').append((matchArray[oddsType + "_MAINLINEFLAG_" + i] == "1")?'true':'false');
				sbOdds.append(',lineStatus:').append(matchArray[oddsType + "_LINESTATUS_" + i]);
				sbOdds.append(',lineOrder:').append(matchArray[oddsType + "_SBCLINEORDER_" + i]);
				sbOdds.append(',H:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_H_" + i])).append('"');
				sbOdds.append(',L:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_L_" + i])).append('"}');
				exist = true;
            }
		}
    }
	else if ( oddsType=='HAD' ) {
		if (matchArray[oddsType + "_H"] != null && matchArray[oddsType + "_A"] != null && matchArray[oddsType + "_D"] != null) {
			sbOdds.append('{H:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_H"])).append('"');
			sbOdds.append(',A:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_A"])).append('"');
			sbOdds.append(',D:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_D"])).append('"}');
			exist = true;
		}
	}
	else if ( oddsType=='FTS' || oddsType=='NTS' || oddsType=='ETS' ) {
		if (matchArray[oddsType + "_H"] != null && matchArray[oddsType + "_N"] != null && matchArray[oddsType + "_A"] != null) {
			sbOdds.append('{H:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_H"])).append('"');
			sbOdds.append(',N:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_N"])).append('"');
			sbOdds.append(',A:"').append(checkValueNulltoEmpty(matchArray[oddsType + "_A"])).append('"}');
			exist = true;
		}
	}

    if (exist) {
        sb.append(oddsType.toLowerCase());
        sb.append(":{odds:[");
        sb.append(sbOdds.toString());
        sb.append("],name:\"");
        sb.append((oddsType=="ETS")?"NTS":oddsType);
		sb.append("\",isInplay:");
        sb.append(ConvertToBool(matchArray[oddsType + "_INPLAY"]));
        sb.append(",isSelling:");
        sb.append(ConvertToBool(matchArray[oddsType + "_SELL"]));
        sb.append(",allUp:\"");
        sb.append(checkValueNulltoEmpty(matchArray[oddsType + "_ALLUP"]));
        sb.append("\",itemNum:\"");
        sb.append(checkValueNulltoEmpty(matchArray[oddsType + "_ITEM_NUM"]));
        sb.append("\",isBettingDelayNeeded:");
        sb.append(ConvertToBool(matchArray[oddsType + "_IS_BETTING_DELAY_NEED"]));
        sb.append(",isRemoved:");
        sb.append(ConvertToBool(matchArray[oddsType + "_IS_REMOVED"]));
        sb.append(",poolStatus:\"");
        sb.append(checkValueNulltoEmpty(matchArray[oddsType + "_MATCH_POOL_STATUS"]));
        sb.append("\",Line:\"");
        sb.append(checkValueNulltoEmpty(matchArray[oddsType + "_LINE"]));
        sb.append("\",DefaultLine:\"");
        sb.append(checkValueNulltoEmpty(matchArray[oddsType + "_DEFAULTLINE"]));
        sb.append("\"}");
        return sb.toString();
    } else {
        return "";
    }
}

function getExtraTimeStr(matchArray) {
    var sb = new StringBuffer();
    var delim = false;
    for (var prop in matchArray) {
        if (prop.indexOf("_EXTRA_TIME") > 0) {
            if (delim)
                sb.append(",");
            var poolType = prop.split('_')[0];
            sb.append(poolType).append(":").append(ConvertToBool(matchArray[prop]));
            delim = true;
        }
    }
    return sb.toString();
}

function resetBetLineArray() {
    matchIDArr = new Array();
    betValue = new Array();
    poolSellValue = new Array();
	oldOdds = [];
}

//insert a new betline
function insertNewBetLine(match, oddsType) {
    if (match != null && oddsType != null && oddsType != "") {
        var pool = getPool(match, oddsType);
        if (pool != null) {
            matchIDArr[matchIDArr.length] = match.matchID;
            betValue[betValue.length] = createBetLine(match, oddsType);
            poolSellValue[poolSellValue.length] = checkIsSell(pool) ? "1" : "0";
        }
    }
}

//delete the betline
function deleteBetLines(matchIdList) {
    if (matchIdList != null && matchIdList.length > 0) {
        for (var i = 0; i < matchIdList.length; i++) {
            deleteBetLine(matchIdList[i]);
        }
    }
}

//delete betline
function deleteBetLine(matchID) {
    for (var i = 0; i < betValue.length; i++) {
        var rawBetAttr = betValue[i][0].split(",")[0].split("**");
        var mID = rawBetAttr[rawBetAttr.length - 1];
        if (parseInt(matchID) == parseInt(mID)) {
            betValue.splice(i, 1);
            poolSellValue.splice(i, 1);
            matchIDArr.splice(i, 1);
            break;
        }
    }
}

//update the betline,oddsType:HAD,HIL,CHL,FTS,NTS
function updateBetLine(match, oddsType) {
    if (match == null) return;
    var pool = getPool(match, oddsType);
    if (pool != null) {
        if (betValue != null && betValue.length > 0) {
            for (var i = 0; i<betValue.length; i++) {
                var rawBetAttr = betValue[i][0].split(",")[0].split("**");
                var matchID = rawBetAttr[rawBetAttr.length - 1];
                var poolType = rawBetAttr[1];

                if (parseInt(matchID) == parseInt(match.matchID)) {
                    betValue[i] = createBetLine(match, oddsType);
                    poolSellValue[i] = checkIsSell(pool) ? "1" : "0";
                    break;
                }
            }
        }
    }
}

//get the display matches' betline string,oddsType:HAD,HIL,CHL,FTS/NTS
function createBetLinesForDisplayMatches(displayedMatches, oddsType) {
    if (displayedMatches != null && displayedMatches.length > 0) {
        for (var i = 0; i < displayedMatches.length; i++) {
            for (var j = 0; j < displayedMatches[i].matches.length; j++) {
                var match = displayedMatches[i].matches[j];
                var pool = getPool(match, oddsType);
                if (pool != null) {
                    matchIDArr[matchIDArr.length] = match.matchID;
                    betValue[betValue.length] = createBetLine(match, oddsType);
                    poolSellValue[poolSellValue.length] = checkIsSell(pool) ? "1" : "0";
                }
            }
        }
    }
}

//get a match's betline string,oddsType:HAD,HIL,CHL,FTS,NTS
function createBetLine(match, oddsType) {
    var betlines = [];
    if (match == null)
        return "";

    oddsType = oddsType.toUpperCase();
    var pool = getPool(match, oddsType);
    if (pool == null )
        return "";

    for ( var itemNo=0; itemNo<pool.odds.length; itemNo++ ) {
	    var sbBetLine = new StringBuffer();
        sbBetLine.append("['");
        sbBetLine.append(match.matchDate + match.matchDay + match.matchNum);
        sbBetLine.append("**");
        sbBetLine.append(pool.name);
        sbBetLine.append("**");
		sbBetLine.append(match.homeTeam.teamName.replace("'", "&#39;"));
		sbBetLine.append("**");
		sbBetLine.append(match.awayTeam.teamName.replace("'", "&#39;"));
		sbBetLine.append("**");
		sbBetLine.append((pool.allUp=="true" || pool.allUp=="1")?"1": "0");
		sbBetLine.append("**");
		sbBetLine.append(pool.isBettingDelayNeeded ? "1" : "0");
		if (oddsType == "HAD") {
			sbBetLine.append("**x**x**x**");
		} else if (oddsType == "HIL" || oddsType == "CHL") {
			sbBetLine.append("**");
			sbBetLine.append(pool.odds[itemNo].line);
			sbBetLine.append("**");
			sbBetLine.append(pool.odds[itemNo].line);
			sbBetLine.append("**x**");
		} else if (oddsType == "FTS/NTS") {
			sbBetLine.append("**");
			sbBetLine.append(pool.itemNum);
			sbBetLine.append("**x**x**");
		}
		sbBetLine.append(match.league.shortName);
		sbBetLine.append("**");
		sbBetLine.append(match.matchID);
		sbBetLine.append("','");
		if (oddsType == "HAD") {
			sbBetLine.append(pool.odds[itemNo].H);
			sbBetLine.append("**homecomb**1','");
			sbBetLine.append(pool.odds[itemNo].D);
			sbBetLine.append("**drawcomb**X','");
			sbBetLine.append(pool.odds[itemNo].A);
			sbBetLine.append("**awaycomb**2']");
		} else if (oddsType == "HIL" || oddsType == "CHL") {
			sbBetLine.append(pool.odds[itemNo].H);
			sbBetLine.append("**high**H','");
			sbBetLine.append(pool.odds[itemNo].L);
			sbBetLine.append("**low**L']");
		} else if (oddsType == "FTS/NTS") {
			sbBetLine.append(pool.odds[itemNo].H);
			sbBetLine.append("**homecomb**1','");
			sbBetLine.append(pool.odds[itemNo].N);
			sbBetLine.append("**nogoal**N','");
			sbBetLine.append(pool.odds[itemNo].A);
			sbBetLine.append("**awaycomb**2']");
		}
		betlines.push(sbBetLine.toString());
    }
    return betlines;
}

function getParameter(paramName) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + paramName + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

var page;
var amsValueList = new Array("SERVER_VALUE");
var amsValueSchemaList = new Array("SERVER_TIME");
var matchList = new Array("MATCHES");
var matchSchemaList = new Array("MATCHES");
var matchCompactSchemaList = new Array("MATCH_ID",
										"MATCH_NUM",
										"ESST",
										"LEAGUE_SHORT_NAME",
										"LEAGUE_NAME",
										"MATCH_STATUS",
										"CHANNEL_CODE",
										"IS_MATCHOFDAY",
										"IS_LIVECAST",
										"HAS_INPLAYPOOL",
										"IS_WEB_TV",
										"ILC_DISPLAY",
										"MATCH_IS_REMOVED",
										"NINETY_MINS_TOTAL_CORNER",
										"HAD_MATCH_POOL_STATUS",
										"HIL_MATCH_POOL_STATUS",
										"CHL_MATCH_POOL_STATUS",
										"FTS_MATCH_POOL_STATUS",
										"NTS_MATCH_POOL_STATUS",
										"ETS_MATCH_POOL_STATUS",
										"HIL_LINE_OFFER",
										"CHL_LINE_OFFER");
var matcheDetailSchemaList = new Array("MATCH_ID",
													"MATCH_NUM",
													"MATCH_DATE",
													"MATCH_DAY",
													"ESST",
													"CURRENT_MACHINE",
													"LAST_UPDATE_TIME",
													"IS_NEUTRAL_GROUND",
													"NEUTRAL_VENUE",
													"LEAGUE_CODE",
													"LEAGUE_NAME",
													"LEAGUE_SHORT_NAME",
													"HOME_TEAM_NAME",
													"HOME_RED_CARD",
													"AWAY_TEAM_NAME",
													"AWAY_RED_CARD",
													"MATCH_STATUS",
													"SCORE",
													"NINETY_MINS_SCORE",
													"NINETY_MINS_TOTAL_CORNER",
													"ET_SCORE",
													"PK_SCORE",
													"CHANNEL_CODE",
													"CHANNEL_NAME",
													"IS_MATCHOFDAY",
													"IS_LIVECAST",
													"IS_STARTED",
													"HAS_INPLAYPOOL",
													"IS_WEB_TV",
													"ILC_DISPLAY",
													"EMERGENCY_CONTROL",
													"BETRADAR_DATA_INCOMPLETE",
													"MATCH_IS_REMOVED",
													"BETRADAR_MATCH_ID",
													"EVENT",
													"HAD_ITEM_NUM",
													"HAD_ALLUP",
													"HAD_H",
													"HAD_A",
													"HAD_D",
													"HAD_EXTRA_TIME",
													"HAD_INPLAY",
													"HAD_SELL",
													"HAD_IS_BETTING_DELAY_NEED",
													"HAD_IS_REMOVED",
													"HAD_IS_PURGED",
													"HAD_MATCH_POOL_STATUS",
													"HIL_ITEM_NUM",
													"HIL_ALLUP",
													"HIL_H",
													"HIL_L",
													"HIL_LINE",
													"HIL_DEFAULTLINE",
													"HIL_EXTRA_TIME",
													"HIL_INPLAY",
													"HIL_SELL",
													"HIL_IS_BETTING_DELAY_NEED",
													"HIL_IS_REMOVED",
													"HIL_IS_PURGED",
													"HIL_MATCH_POOL_STATUS",
													"HIL_MAINLINEFLAG_1",
													"HIL_SBCLINEORDER_1",
													"HIL_LINESTATUS_1",
													"HIL_LINE_1",
													"HIL_H_1",
													"HIL_L_1",
													"HIL_MAINLINEFLAG_2",
													"HIL_SBCLINEORDER_2",
													"HIL_LINESTATUS_2",
													"HIL_LINE_2",
													"HIL_H_2",
													"HIL_L_2",
													"HIL_MAINLINEFLAG_3",
													"HIL_SBCLINEORDER_3",
													"HIL_LINESTATUS_3",
													"HIL_LINE_3",
													"HIL_H_3",
													"HIL_L_3",
													"HIL_MAINLINEFLAG_4",
													"HIL_SBCLINEORDER_4",
													"HIL_LINESTATUS_4",
													"HIL_LINE_4",
													"HIL_H_4",
													"HIL_L_4",
													"HIL_MAINLINEFLAG_5",
													"HIL_SBCLINEORDER_5",
													"HIL_LINESTATUS_5",
													"HIL_LINE_5",
													"HIL_H_5",
													"HIL_L_5",
													"CHL_ITEM_NUM",
													"CHL_ALLUP",
													"CHL_H",
													"CHL_L",
													"CHL_LINE",
													"CHL_DEFAULTLINE",
													"CHL_EXTRA_TIME",
													"CHL_INPLAY",
													"CHL_SELL",
													"CHL_IS_BETTING_DELAY_NEED",
													"CHL_IS_REMOVED",
													"CHL_IS_PURGED",
													"CHL_MATCH_POOL_STATUS",
													"CHL_MAINLINEFLAG_1",
													"CHL_SBCLINEORDER_1",
													"CHL_LINESTATUS_1",
													"CHL_LINE_1",
													"CHL_H_1",
													"CHL_L_1",
													"CHL_MAINLINEFLAG_2",
													"CHL_SBCLINEORDER_2",
													"CHL_LINESTATUS_2",
													"CHL_LINE_2",
													"CHL_H_2",
													"CHL_L_2",
													"CHL_MAINLINEFLAG_3",
													"CHL_SBCLINEORDER_3",
													"CHL_LINESTATUS_3",
													"CHL_LINE_3",
													"CHL_H_3",
													"CHL_L_3",
													"CHL_MAINLINEFLAG_4",
													"CHL_SBCLINEORDER_4",
													"CHL_LINESTATUS_4",
													"CHL_LINE_4",
													"CHL_H_4",
													"CHL_L_4",
													"CHL_MAINLINEFLAG_5",
													"CHL_SBCLINEORDER_5",
													"CHL_LINESTATUS_5",
													"CHL_LINE_5",
													"CHL_H_5",
													"CHL_L_5",
													"FTS_ITEM_NUM",
													"FTS_ALLUP",
													"FTS_H",
													"FTS_N",
													"FTS_A",
													"FTS_EXTRA_TIME",
													"FTS_INPLAY",
													"FTS_SELL",
													"FTS_IS_BETTING_DELAY_NEED",
													"FTS_IS_REMOVED",
													"FTS_IS_PURGED",
													"FTS_MATCH_POOL_STATUS",
													"NTS_ITEM_NUM",
													"NTS_ALLUP",
													"NTS_H",
													"NTS_N",
													"NTS_A",
													"NTS_EXTRA_TIME",
													"NTS_INPLAY",
													"NTS_SELL",
													"NTS_IS_BETTING_DELAY_NEED",
													"NTS_IS_REMOVED",
													"NTS_IS_PURGED",
													"NTS_MATCH_POOL_STATUS",
													"ETS_ITEM_NUM",
													"ETS_ALLUP",
													"ETS_H",
													"ETS_N",
													"ETS_A",
													"ETS_EXTRA_TIME",
													"ETS_INPLAY",
													"ETS_SELL",
													"ETS_IS_BETTING_DELAY_NEED",
													"ETS_IS_REMOVED",
													"ETS_IS_PURGED",
													"ETS_MATCH_POOL_STATUS",
													"HHA_EXTRA_TIME",
													"TQL_EXTRA_TIME",
													"CRS_EXTRA_TIME",
													"HFT_EXTRA_TIME");

													
function MatchCompact() {
	this.matchId;
	this.matchNum;
	this.esst;
	this.leagueName;
	this.leagueCode;
	this.matchStatus;
	this.channelCode;
	this.isMatchOfDay;
	this.isLiveCast;
	this.isWebTV;
	this.hasInplay;
	this.ilcDisplay;
	this.isRemoved;
	this.poolStatusHAD;
	this.poolStatusHIL;
	this.poolStatusCHL;
	this.poolStatusFTS;
	this.poolStatusNTS;
	this.poolStatusETS;
	this.lineOfferHIL;
	this.lineOfferCHL;
}

function getMatchCompact(matchId) {
  for ( var i=0; i<matchCompactList.length; i++ ) {
    if ( matchCompactList[i].matchId==matchId ) {
	  return matchCompactList[i];
	}
  }
  return null;
}

var matchCompactList;
var matchCompactLength;
var filterDisplayMatchList = "";
var page;
var engineRef = null;

function onEngineReady(lsEngine) {
    // store the engine reference
    engineRef = lsEngine;

    if (top.matchEmsStatus == 1 && engineRef) {
        engineRef.changeStatus("STREAMING");
    }
}

function onEngineLost() {
    engineRef = null;
}

function autoRefreshIlcMatchesByPush() {
    //var masterWinRef = self.top.frames["push_engine"];
    var masterWinRef = top.document.getElementById('push_engine') ? top.document.getElementById('push_engine').contentWindow : null;
    page = initializePushPage("/info/include/js/commons/custom/", oddsPushIconDisplay, onEngineReady, onEngineLost);
    initializeEngine(page, "/info/include/js/commons/lightstreamer/", null, masterWinRef);

    var matchStatusList = new Array("MATCH_STATUS");
    var matchStatusSchemaList = new Array("EMS_STATUS");
    var pushstatustable = new NonVisualTable(matchStatusList, matchStatusSchemaList, "MERGE");
    pushstatustable.setDataAdapter("MATCH_STATUS");
    pushstatustable.setSnapshotRequired(true);
    pushstatustable.onItemUpdate = function(itemPos, updateInfo) {
        if (updateInfo.getNewValue("EMS_STATUS") == null
            || updateInfo.getNewValue("EMS_STATUS") == 0) {
            top.matchEmsStatus = 0;
            AMS.disconnect();
        }
    };
    page.addTable(pushstatustable, "status");

    var pushtable = new NonVisualTable(matchList, matchSchemaList, "MERGE");
    pushtable.setDataAdapter("MATCHES");
    pushtable.setSnapshotRequired(true);
    pushtable.onItemUpdate = updateMatchIDTable;
    page.addTable(pushtable, "matches");

    var pushtable2 = new NonVisualTable(amsValueList, amsValueSchemaList, "MERGE");
    pushtable2.setDataAdapter("SERVER_VALUE");
    pushtable2.setSnapshotRequired(true);
    pushtable2.onItemUpdate = updateAmsValueTable;
    page.addTable(pushtable2, "amsValue");

    autoSwitchToPoolingMode();
}

function updateAmsValueTable(item, updateInfo) {
    if (updateInfo == null) {
        return;
    }
    if (updateInfo.isValueChanged("SERVER_TIME")) {
        serverTime = updateInfo.getNewValue("SERVER_TIME");
        setLastUpdateTime(serverTime);
	}
}

function updateMatchIDTable(item, updateInfo) {
    if (updateInfo == null) {
        return;
    }
    if (updateInfo.isValueChanged("MATCHES")) {
		matchCompactList = [];
		filterDisplayMatchList = "";

        var tmpMatches = updateInfo.getNewValue("MATCHES");
        if (tmpMatches != null && tmpMatches != "") {
            var matchCompactIds = new Array();
            var matchIdList = tmpMatches.split(",");
			matchCompactLength = matchIdList.length;

            for (var i = 0; i < matchIdList.length; i++) {
                matchCompactIds[i] = "match_id_" + matchIdList[i] + (jsLang.toLowerCase() == "en" ? "_EN" : "_CH");
            }
            if (page.getTable("match_compact") != null) {
                page.removeTable("match_compact");
            }
            var matchCompactTable = new NonVisualTable(matchCompactIds, matchCompactSchemaList, "MERGE");
            matchCompactTable.setDataAdapter("MATCH_DETAIL");
            matchCompactTable.setSnapshotRequired(true);
            matchCompactTable.onItemUpdate = updateMatchCompactTable;
            page.addTable(matchCompactTable, "match_compact");
        }
    }
}

function updateMatchCompactTable(item, updateInfo) {
    if (updateInfo == null) {
        return;
    }

	var mCompact;
    if (updateInfo.isSnapshot()) {
        mCompact = new MatchCompact();
		mCompact.matchId = updateInfo.getNewValue("MATCH_ID");
		matchCompactList.push(mCompact);
    }
    else {
		mCompact = getMatchCompact(updateInfo.getNewValue("MATCH_ID"));
	}
	mCompact.matchNum = checkValueNulltoEmpty(updateInfo.getNewValue("MATCH_NUM"));
	mCompact.esst = checkValueNulltoEmpty(updateInfo.getNewValue("ESST"));
	mCompact.leagueName = checkValueNulltoEmpty(updateInfo.getNewValue("LEAGUE_NAME"));
	mCompact.leagueCode = checkValueNulltoEmpty(updateInfo.getNewValue("LEAGUE_SHORT_NAME"));
	mCompact.matchStatus = checkValueNulltoEmpty(updateInfo.getNewValue("MATCH_STATUS"));
	mCompact.channelCode = checkValueNulltoEmpty(updateInfo.getNewValue("CHANNEL_CODE"));
	mCompact.isMatchOfDay = ConvertToBool(updateInfo.getNewValue("IS_MATCHOFDAY"));
	mCompact.isLiveCast = ConvertToBool(updateInfo.getNewValue("IS_LIVECAST"));
	mCompact.hasInplay = ConvertToBool(updateInfo.getNewValue("HAS_INPLAYPOOL"));
	mCompact.isWebTV = ConvertToBool(updateInfo.getNewValue("IS_WEB_TV"));
	mCompact.ilcDisplay = ConvertToBool(updateInfo.getNewValue("ILC_DISPLAY"));
	mCompact.isRemoved = ConvertToBool(updateInfo.getNewValue("MATCH_IS_REMOVED"));
	mCompact.poolStatusHAD = checkValueNulltoEmpty(updateInfo.getNewValue("HAD_MATCH_POOL_STATUS"));
	mCompact.poolStatusHIL = checkValueNulltoEmpty(updateInfo.getNewValue("HIL_MATCH_POOL_STATUS"));
	mCompact.poolStatusCHL = checkValueNulltoEmpty(updateInfo.getNewValue("CHL_MATCH_POOL_STATUS"));
	mCompact.poolStatusFTS = checkValueNulltoEmpty(updateInfo.getNewValue("FTS_MATCH_POOL_STATUS"));
	mCompact.poolStatusNTS = checkValueNulltoEmpty(updateInfo.getNewValue("NTS_MATCH_POOL_STATUS"));
	mCompact.poolStatusETS = checkValueNulltoEmpty(updateInfo.getNewValue("ETS_MATCH_POOL_STATUS"));
	mCompact.lineOfferHIL = ConvertToBool(updateInfo.getNewValue("HIL_LINE_OFFER"));
	mCompact.lineOfferCHL = ConvertToBool(updateInfo.getNewValue("CHL_LINE_OFFER"));

	if (matchCompactList.length > 0 && matchCompactList.length == matchCompactLength) { // after all match compact are got
		matchCompactList.sort(sortMatchCompact);
		doFilterPush();
	}
}

function doFilterPush() {
	var filterArr = filterMatchesPush(leagueCode, poolType, hasChannel, isLiveCast, hasInplayPool);
	if ( filterArr.length>0 && filterDisplayMatchList != filterArr.join(",") ) {
		filterDisplayMatchList = filterArr.join(",");

		if (page.getTable("match_detail") != null)
			page.removeTable("match_detail");

		resetIlcMatches();
		var matchDetailTable = new NonVisualTable(filterArr, matcheDetailSchemaList, "MERGE");
		matchDetailTable.setDataAdapter("MATCH_DETAIL");
		matchDetailTable.setSnapshotRequired(true);
		matchDetailTable.onItemUpdate = updateMatchDetailsTable;
		page.addTable(matchDetailTable, "match_detail");
	}
	else {
		if ( filterArr.length==0 ) {
			filterDisplayMatchList = "";
			resetIlcMatches();
		}
		reRenderPush(poolType);
	}
}

function sortMatchCompact(a, b) {
	if ( a.isMatchOfDay && !b.isMatchOfDay )
		return -1;
	if ( !a.isMatchOfDay && b.isMatchOfDay )
		return 1;
	var d1 = convertToDateTime(a.esst);
	var d2 = convertToDateTime(b.esst);
	if (d1 != null && d2 != null) {
		var res = compareDateTime(d1, d2);
		if (res == "<")
			return -1;
		if (res == ">")
			return 1;
    }
    var md1 = convertToDateTime(a.matchDate + " 00:00:00");
    var md2 = convertToDateTime(b.matchDate + " 00:00:00");
    if (md1 != null && md2 != null) {
        var res = compareDateTime(md1, md2);
        if (res == "<")
            return -1;
        if (res == ">")
            return 1;
    }
	return parseInt(a.matchNum, 10) - parseInt(b.matchNum, 10);
}

var filterCount;
function filterMatchesPush(lCode, pType, channel, liveCast, hasInplay) {
    var tmpArr = [];
	var startIdx = (pageIndex-1) * pageSize;
	var endIdx = pageIndex * pageSize - 1;
	filterCount = 0;
	
    if ( startIdx >= matchCompactList.length ) { // if page no. exceeds, reset to page 1
		pageIndex = 1;
		startIdx = 0;
		endIdx = pageSize - 1;
	}

    for (var i = 0; i < matchCompactList.length; i++) {
		var m = matchCompactList[i];
		if (isShowSelected && hasAnyCheckboxSelected() && !checkBoxArr[m.matchId]) continue;

		if (checkIsVoidMatch(m.matchStatus))
			continue;

		if (m.isRemoved || !m.ilcDisplay)
			continue;
		
		if (lCode.toLowerCase() != "all") {
			if (lCode.toLowerCase() == "others") {
				if (m.leagueCode != "CLB" && m.leagueCode != "CUP" && m.leagueCode != "INT")
					continue;
			}
			else if (m.leagueCode != lCode)
				continue;
		}

        if (pType == "FTS/NTS"
		    && (m.poolStatusFTS=='' || checkIsRefundPool(m.poolStatusFTS))
			&& (m.poolStatusNTS=='' || checkIsRefundPool(m.poolStatusNTS))
			&& (m.poolStatusETS=='' || checkIsRefundPool(m.poolStatusETS)) )
			continue;
		else if (pType == "HAD" && (m.poolStatusHAD=='' || checkIsRefundPool(m.poolStatusHAD)) )
			continue;
		else if (pType == "HIL" && (m.poolStatusHIL=='' || !m.lineOfferHIL || checkIsRefundPool(m.poolStatusHIL)) )
		    continue;
		else if (pType == "CHL" && (m.poolStatusCHL=='' || !m.lineOfferCHL || checkIsRefundPool(m.poolStatusCHL)) )
		    continue;

		if (channel.toLowerCase() != "all") {
			var betSlip = top.document.getElementById('betSlipFrame');
			var needWebTVCheck = checkIsLogin() && betSlip && betSlip.contentWindow.GetDataStore('football_live_ind') == "Y";
			if (channel.toLowerCase() == "yes") {
				if (needWebTVCheck && m.isWebTV) { // not filter out
				}
				else if (m.channelCode!='[]') { // not filter out
				}
				else
					continue;
			}
		}

		if (liveCast.toLowerCase() != "all") {
			var tmp = liveCast.toLowerCase() == "yes";
			if (m.isLiveCast != tmp)
				continue;
		}

		if (hasInplay.toLowerCase() != "all") {
			var tmp = hasInplay.toLowerCase() == "true";
			if (m.hasInplay != tmp)
				continue;
		}

		if ( startIdx<=filterCount && filterCount<=endIdx ) {
			tmpArr.push("match_id_" + m.matchId + (jsLang.toLowerCase() == "en" ? "_EN" : "_CH"));
		}
		
		filterCount++;
	}
    return tmpArr;
}

function updateMatchDetailsTable(item, updateInfo) {//if insert match into table first, the match's value of isValueChanged() is always 'false'
    if (updateInfo == null)
        return;

	document.getElementById('machineInfo').title = machineId + ' - ' + updateInfo.getNewValue('CURRENT_MACHINE');

	var matchArray = [];
	var isChanged = false;

	for (var x = 0; x < matcheDetailSchemaList.length; x++) {
		matchArray[matcheDetailSchemaList[x]] = updateInfo.getNewValue(matcheDetailSchemaList[x]);
		if (!isChanged) {
			if (updateInfo.isValueChanged(matcheDetailSchemaList[x]))
				isChanged = true;
		}
	}
	
	var match = createMatch(matchArray);
	var oddsType = poolType;

	if (updateInfo.isSnapshot()) {//if matchlist changed,re-render the display when all the matches got
		insertNewMatchIntoIlcMatches(match);
		if (filterDisplayMatchList.split(',').length == ilcMatches[0].matches.length + ilcMatches[1].matches.length) {
			reRenderPush(oddsType);
		}
	}
	else {//if only match info update
		if (isChanged && match!=null) {
			//update data source
			var idx = findMatchInIlcMatches(match.matchID);
			updateIlcMatches(match, false, false, idx);

			//if the updated match has current pool, then update the display
			var pool = getPool(match, oddsType);
			if (pool != null) {
				if ( !IsDefinedPool(match.matchID, oddsType) )
					reRenderPush(oddsType);
				else
					updateMatchDisplay(idx.x, match, oddsType);
			}

			updateBetLine(match, oddsType);
		}
	}
}

//refresh the matches by push,oddsType:HAD,HIL,CHL,FTS/NTS
function reRenderPush(oddsType) {
    $("#divLoading").show();

    //display the matches
    var $obj = $("#tbMatches");
    $obj.empty();
	setLineCount(ilcMatches, oddsType);
    $obj.html(drawMatchesHtml(ilcMatches, oddsType));


	if (enableSelectLeague)
		setLeagues(matchCompactList, leagueCode, true);

	//add betline
	resetBetLineArray();
	createBetLinesForDisplayMatches(ilcMatches, poolType);

	//display the pagers
	$("#divPager").html(drawPagerHtml(pageSize, filterCount, pageIndex, buttonCount));
	$("#divLoading").hide();
}

//get the deleted matchID list
function getDeletedMatchIdList(oldMatches, newMatches) {
    var matchIdList = new Array();
    if (oldMatches != null && oldMatches != "") {
        if (newMatches == null || newMatches == "") {
            matchIdList = oldMatches.split(",");
        } else {
            var tmpOld = oldMatches.split(",");
            var tmpNew = newMatches.split(",");
            for (var i = 0; i < tmpOld.length; i++) {
                var exist = false;
                for (var j = 0; j < tmpNew.length; j++) {
                    if (parseInt(tmpNew[j]) == parseInt(tmpOld[i])) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    matchIdList.push(tmpOld[i]);
                }
            }
        }
    }
    return matchIdList;
}

//reset data source
function resetIlcMatches() {
    definedPoolArr = new Array();
    ilcMatches = new Array();
    ilcMatches = [{ name: "CurrentMatches", matches: [] }, { name: "OtherMatches", matches: []}];
}

//set page info
function setPageInfo(isDisplay) {
    var arr = new Array();
    arr.push($("table.ilcOdds"));
    arr.push($("#ulSubBar"));
    arr.push($("#liShowSelected"));
    arr.push($("#liShowAll"));
    arr.push($("#liShowInplay"));
    for (var i = 0; i < arr.length; i++) {
        if (isDisplay) {
            arr[i].show();
        } else {
            arr[i].hide();
        }
    }
    if (isDisplay) {
        clearNoPoolMsg();
    } else {
        clearNoPoolMsg();
        clearPagerMsg();
        var sb = new StringBuffer();
        sb.append("<div class=\"nopool\"><div class=\"nopoolmsg\">");
        sb.append(GetGlobalResources("NoPoolMsg", "js"));
        sb.append("</div></div>");
        $("#ilcOdds").append(sb.toString());
    }
}

//clear the no pool msg
function clearNoPoolMsg() {
    $("div.nopool").eq(0).remove();
}

//clear the pager msg
function clearPagerMsg() {
    $("#divPager").empty();
}

//set leagues
function setLeagues(matchesArray, currentVal, isPush) {
    var leaguesArr = new Array();
    leaguesArr.push({ leagueCode: "ALL", leagueName: GetGlobalResources("SelectLeague", "js") });
    if (!containsLeague(leaguesArr, currentVal)) {
        var $opt = $(".selLeague select option:selected").eq(0);
        var obj = new Object();
        obj.leagueCode = $opt.val();
        obj.leagueName = $opt.text();
        leaguesArr.push(obj);
    }

    if (matchesArray != null) {
		if ( isPush ) {
			for (var i = 0; i < matchesArray.length; i++) {
			    var m = matchesArray[i];
			    if (checkIsVoidMatch(m.matchStatus))
			        continue;
			    if (m.isRemoved || !m.ilcDisplay)
			        continue;
			    if ((m.poolStatusFTS == '' || checkIsRefundPool(m.poolStatusFTS))
			     && (m.poolStatusNTS == '' || checkIsRefundPool(m.poolStatusNTS))
			     && (m.poolStatusETS == '' || checkIsRefundPool(m.poolStatusETS))
			     && (m.poolStatusHAD == '' || checkIsRefundPool(m.poolStatusHAD))
			     && (m.poolStatusHIL == '' || checkIsRefundPool(m.poolStatusHIL))
			     && (m.poolStatusCHL == '' || checkIsRefundPool(m.poolStatusCHL)))
			        continue;
				if (!containsLeague(leaguesArr, m.leagueCode)) {
					var obj = new Object();
					obj.leagueCode = m.leagueCode;
					obj.leagueName = m.leagueName;
					leaguesArr.push(obj);
				}
			}
		}
		else {
			for (var i = 0; i < matchesArray.length; i++) {
				for (var j = 0; j < matchesArray[i].matches.length; j++) {
				    var m = matchesArray[i].matches[j];
				    if (checkIsVoidMatch(m.matchStatus))
				        continue;
				    if (m.isRemoved || !m.toDisplayIlc)
				        continue;
					if (!containsLeague(leaguesArr, m.league.leagueCode)) {
						var obj = new Object();
						obj.leagueCode = m.league.leagueCode;
						obj.leagueName = m.league.leagueName;
						leaguesArr.push(obj);
					}
				}
			}
        }
    }
    var buf = new StringBuffer();
    buf.append('<select onchange="filterByLeague($(this).val());">');
    var hasAddOthers = false;
    for (var k = 0; k < leaguesArr.length; k++) {
        var league = leaguesArr[k];
        if (league.leagueCode == "CLB" || league.leagueCode == "CUP" || league.leagueCode == "INT") {
            if (!hasAddOthers) {
                if (currentVal == "others") {
                    buf.append("<option selected =\"selected\" value=\"others\">" + GetGlobalResources("Others", "js") + "</option>");
                } else {
                    buf.append("<option value=\"others\">" + GetGlobalResources("Others", "js") + "</option>");
                }
                hasAddOthers = true;
            }
        } else {
            if (currentVal == league.leagueCode) {
                buf.append("<option selected =\"selected\" value=\"" + league.leagueCode + "\">" + league.leagueName + "</option>");
            } else {
            buf.append("<option value=\"" + league.leagueCode + "\">" + league.leagueName + "</option>");
            }
        }
    }
    buf.append('</select>');
    $('#leagueDD').html(buf.toString());
}

function containsLeague(leaguesArr, leagueCode) {
    var exist = false;
    if (leaguesArr != null) {
        for (var i = 0; i < leaguesArr.length; i++) {
            var obj = leaguesArr[i];
            if (obj.leagueCode == leagueCode) {
                exist = true;
                break;
            }
        }
    }
    return exist;
}

//update other match info
function updateMatchDisplay(coupon, match, oddsType) {
    //set last update time
    var res = compareDateTime(convertToDateTime($("#spRefreshTime").text()), convertToDateTime(match.lastUpdateTime));
    if (res == "<") {
        setLastUpdateTime(match.lastUpdateTime);
    }
    if ($("#" + match.matchID + "_matchNum").length < 1) return;
    if (match != null) {
        var pool = getPool(match, oddsType);
		if ( (oddsType == "HIL" || oddsType == "CHL") && pool!=null ) {
			pool.odds.sort(sortMultipleLines);
			lineRowCount[coupon + '_' + match.matchID] = pool.odds.length;
		}
        $("#" + match.matchID + "_matchNum").html(getMatchNum(match, oddsType));
        $("#" + match.matchID + "_delay").attr("value", pool ? pool.isBettingDelayNeeded : false);
        setMatchStage(match);
        if (oddsType == "FTS/NTS") {
            $("#" + match.matchID + "_NTS_isETS").attr("value", match.hasETSPool);
        }

        if (match.matchStatus.indexOf("delayed") >= 0
          || match.matchStatus.indexOf("intermission") >= 0
          || match.matchStatus.indexOf("suspended") >= 0) {
            $("#" + match.matchID + "_status").html("-");
            $("#" + match.matchID + "_matchStatus").val(match.matchStatus);
            $("#" + match.matchID + "_score").html("-");
            $("#" + match.matchID + "_score").unbind("click").removeAttr("onclick");
            $("#" + match.matchID + "_corner").html("-");
        }
        else if (match.isStarted) {
            $("#" + match.matchID + "_score").html(match.score);
            $("#" + match.matchID + "_score").unbind("click").removeAttr("onclick");
            if (!match.isEmergency) {
                $("#" + match.matchID + "_score").bind("click", function () {
                    openEventWindow(this, match.matchID, oddsType);
                });
            }
            var normalTimeMatchStages = ["1st-half", "mid-event", "2nd-half"];
            var isShow = false;
            for (var i = 0; i < normalTimeMatchStages.length; ++i) {
                if (match.matchStatus.indexOf(normalTimeMatchStages[i]) >= 0) {
                    isShow = true;
                    break;
                }
            }
            if (isShow) {
                $("#" + match.matchID + "_corner").html(match.ninetyMinsTotalCorner);
            } else {
                $("#" + match.matchID + "_corner").html("-");
            }
            updateTime(match.matchID, match.matchStatus, match.betradarDataIncomplete);
        } else {
            var date = match.esst.split(" ")[0];
            var time = match.esst.split(" ")[1];
            $("#" + match.matchID + "_status").html(date.substring(0, date.length - 5) + " " + time.substring(0, 5));
            $("#" + match.matchID + "_matchStatus").val(match.matchStatus);
            $("#" + match.matchID + "_score").html("-");
            $("#" + match.matchID + "_corner").html("-");
        }
        var aTag = "";
        if (!isMatchFinish(match))
            aTag = "callMatchInfo('?tdate=" + match.matchDate + "&tday=" + match.matchDay + "&tnum=" + match.matchNum + "')";
        $("#" + match.matchID + "_hteam").find('span').html(match.homeTeam.teamName);
        $("#" + match.matchID + "_hteam").unbind("mouseover").removeAttr("onmouseover");
        $("#" + match.matchID + "_hteam").unbind("mouseout").removeAttr("mouseout");
        $("#" + match.matchID + "_hteam").unbind("click").removeAttr("onclick");
        $("#" + match.matchID + "_ateam").unbind("mouseover").removeAttr("onmouseover");
        $("#" + match.matchID + "_ateam").unbind("mouseout").removeAttr("mouseout");
        $("#" + match.matchID + "_ateam").unbind("click").removeAttr("onclick");
        if (aTag != "") {
            $("#" + match.matchID + "_hteam").bind("mouseover", "teamMouseOver('" + match.matchID + "')");
            $("#" + match.matchID + "_hteam").bind("mouseout", "teamMouseOut('" + match.matchID + "')");
            $("#" + match.matchID + "_hteam").bind("click", aTag);
            $("#" + match.matchID + "_ateam").bind("mouseover", "teamMouseOver('" + match.matchID + "')");
            $("#" + match.matchID + "_ateam").bind("mouseout", "teamMouseOut('" + match.matchID + "')");
            $("#" + match.matchID + "_ateam").bind("click", aTag);
        }

        if (match.homeTeam.redCard > 0) {
            $("#" + match.matchID + "_hred").find('span').html("<img src=\"" + footImagePath + "redcard_" + match.homeTeam.redCard + ".gif?CV=" + cv + "\" title=\"" + GetGlobalResources("RedCard", "js") + ":" + match.homeTeam.redCard + "\" onerror=\"errImg(this);\" />");
            $("#" + match.matchID + "_hred").css("width", "10px");
        }
        if (match.awayTeam.redCard > 0) {
            $("#" + match.matchID + "_ared").find('span').html("<img src=\"" + footImagePath + "redcard_" + match.awayTeam.redCard + ".gif?CV=" + cv + "\" title=\"" + GetGlobalResources("RedCard", "js") + ":" + match.awayTeam.redCard + "\" onerror=\"errImg(this);\" />");
            $("#" + match.matchID + "_ared").css("width", "10px");
        }
        $("#" + match.matchID + "_ateam").find('span').html(match.awayTeam.teamName);
        if (match.isNeutralGround) {
            var ngText = (match.neutralVenue == '') ? ng : (ng1 + " " + match.neutralVenue + " " + ng2);
            $("#" + match.matchID + "_ng").find('span').html("<img class=\"neutral_ground\" src=\"" + footImagePath + "icon_neutral.gif?CV=" + cv + "\" title=\"" + ngText + "\" onerror=\"errImg(this);\" />");
            $("#" + match.matchID + "_ng").css("width", "16px");
        }

        $("#" + match.matchID + "_tv").html(getTvStr(match));
        $("#" + match.matchID + "_liveCast").html(getLiveCastStr(match));

        if (pool != null && !pool.isRemoved && !pool.isPurged) {
            var oPrefix = "#" + match.matchID + "_" + pool.name;
            var oddsSet = new Array();
            var oddsValue = new Array();
            var isSell = checkIsSell(pool);
			var lineSell = [];
			var mlItem = [];

			if (oddsType == "HIL" || oddsType == "CHL") {
				checkMainlineChange(match.matchID, pool);

				for ( var j=0; j<5; j++ ) { // hide all 
					$(oPrefix + "_LINE" + ((j > 0)?'_' + j:"")).hide();
					$("#mlId" + match.matchID + "H" + "_" + j).hide();
					$("#mlId" + match.matchID + "L" + "_" + j).hide();
					var chkObjH = $(oPrefix + "_H" + ((j > 0)?'_' + j:"") + "_c");
					var chkObjL = $(oPrefix + "_L" + ((j > 0)?'_' + j:"") + "_c");
					chkObjH.parent().removeClass("checkedOdds");
					chkObjH.attr("checked", false);
					chkObjL.parent().removeClass("checkedOdds");
					chkObjL.attr("checked", false);
				}
				if ( hasMLOddsChange(match.matchID, pool) ) {
					if ( multipleLinePoolIds['m' + match.matchID]!=1 )
						toggleMLDisplay(coupon, match.matchID, oddsType);
				}
				if ( pool.odds.length > 1 )
					document.getElementById("mlExpandBtn_" + match.matchID).style.display = '';
				else
					document.getElementById("mlExpandBtn_" + match.matchID).style.display = 'none';
			}
            for (var i = 0; i < pool.odds.length; i++) {
                if (oddsType == "HAD") {
                    oddsSet.push(oPrefix + "_H");
                    oddsSet.push(oPrefix + "_A");
                    oddsSet.push(oPrefix + "_D");
                    oddsValue.push(pool.odds[i].H);
                    oddsValue.push(pool.odds[i].A);
                    oddsValue.push(pool.odds[i].D);
					lineSell.push(isSell);
					lineSell.push(isSell);
					lineSell.push(isSell);
					mlItem.push("");
					mlItem.push("");
					mlItem.push("");
                } else if (oddsType == "HIL" || oddsType == "CHL") {
                    oddsSet.push(oPrefix + "_H" + ((i > 0)?'_' + i:""));
                    oddsSet.push(oPrefix + "_L" + ((i > 0)?'_' + i:""));
                    oddsValue.push(pool.odds[i].H);
                    oddsValue.push(pool.odds[i].L);
                    var newValue = pool.odds[i].line.replace(/\.0/g, '');
					lineSell.push(pool.odds[i].lineStatus=='1');
					lineSell.push(pool.odds[i].lineStatus=='1');
					mlItem.push((i > 0)?'' + i:"");
					mlItem.push((i > 0)?'' + i:"");
                    $(oPrefix + "_LINE" + ((i > 0)?'_' + i:"")).html("[" + newValue + "]");
					if ( pool.odds[i].isMainline || multipleLinePoolIds['m' + match.matchID]==1 ) {
						$(oPrefix + "_LINE" + ((i > 0)?'_' + i:"")).show();
						$("#mlId" + match.matchID + "H" + "_" + i).show();
						$("#mlId" + match.matchID + "L" + "_" + i).show();
					}
					
					var chkObjH = $(oPrefix + "_H" + ((i > 0)?'_' + i:"") + "_c");
					chkObjH.attr('lineNo', pool.odds[i].lineNo);
					if ( isSelectionCheckBoxChecked(match.matchID, oddsType, 'H_' + pool.odds[i].lineNo) ) {
						chkObjH.parent().addClass("checkedOdds");
						chkObjH.attr("checked", true);
					}

					var chkObjL = $(oPrefix + "_L" + ((i > 0)?'_' + i:"") + "_c");
					chkObjL.attr('lineNo', pool.odds[i].lineNo);
					if ( isSelectionCheckBoxChecked(match.matchID, oddsType, 'L_' + pool.odds[i].lineNo) ) {
						chkObjL.parent().addClass("checkedOdds");
						chkObjL.attr("checked", true);
					}
                }
                else if (oddsType == "FTS/NTS") {
                    if (pool.name == "NTS") {
                        var ntsExist = $("#" + match.matchID + "_NTS_H_c").length > 0;
                        var ftsExist = false;
                        if (!ntsExist) {
                            ftsExist = $("#" + match.matchID + "_FTS_H_c").length > 0;
                        }
                        if (ftsExist) {
                            $("#" + match.matchID + "_FTS_H").attr("id", match.matchID + "_NTS_H");
                            $("#" + match.matchID + "_FTS_A").attr("id", match.matchID + "_NTS_A");
                            $("#" + match.matchID + "_FTS_N").attr("id", match.matchID + "_NTS_N");
                            $("#" + match.matchID + "_FTS_H_c").attr("id", match.matchID + "_NTS_H_c");
                            $("#" + match.matchID + "_FTS_A_c").attr("id", match.matchID + "_NTS_A_c");
                            $("#" + match.matchID + "_FTS_N_c").attr("id", match.matchID + "_NTS_N_c");
                        }
                        $("#ntspart_" + match.matchID).html(cntGoalNumber(pool.itemNum));
                        $("#ntspartdisplay_" + match.matchID).html(parseInt(pool.itemNum));
                    } else {
                        var ftsExist = $("#" + match.matchID + "FTS_H_c").length > 0;
                        var ntsExist = false;
                        if (!ftsExist) {
                            ntsExist = $("#" + match.matchID + "_NTS_H_c").length > 0;
                        }
                        if (ntsExist) {
                            $("#" + match.matchID + "_NTS_H").attr("id", match.matchID + "_FTS_H");
                            $("#" + match.matchID + "_NTS_A").attr("id", match.matchID + "_FTS_A");
                            $("#" + match.matchID + "_NTS_N").attr("id", match.matchID + "_FTS_N");
                            $("#" + match.matchID + "_NTS_H_c").attr("id", match.matchID + "_FTS_H_c");
                            $("#" + match.matchID + "_NTS_A_c").attr("id", match.matchID + "_FTS_A_c");
                            $("#" + match.matchID + "_NTS_N_c").attr("id", match.matchID + "_FTS_N_c");
                        }
                        $("#ntspartdisplay_" + match.matchID).html("F");
                    }
                    $("#ntspartdisplay_" + match.matchID).unbind("mouseover").removeAttr("onmouseover");
                    $("#ntspartdisplay_" + match.matchID).bind("mouseover", function () {
                        openTips(this, oddsType.toLowerCase());
                    });
                    oddsSet.push(oPrefix + "_H");
                    oddsSet.push(oPrefix + "_A");
                    oddsSet.push(oPrefix + "_N");
                    oddsValue.push(pool.odds[i].H);
                    oddsValue.push(pool.odds[i].A);
                    oddsValue.push(pool.odds[i].N);
					lineSell.push(isSell);
					lineSell.push(isSell);
					lineSell.push(isSell);
					mlItem.push("");
					mlItem.push("");
					mlItem.push("");
                }
            }
            var canFormAllUp = match.matchStatus.indexOf("halted") < 0 //match is not closed
                         && pool.poolStatus == "start-sell" // pool is start sell
                        && !pool.isBettingDelayNeeded // pool is not in-play-ing
                        && (pool.allUp == "true" || pool.allUp == "1");
            updateOdds(oddsSet, oddsValue, isSell, lineSell, canFormAllUp, mlItem);
			
			checkCheckboxStatus();

            if ($("#divDetails").length > 0) {
                var mID = $("#divDetails").find("input[type=hidden]").eq(0).val();
                if (parseInt(mID) == parseInt(match.matchID)) {
                    if (match.isStarted) {
                        $("#divDetails").html(drawEventHtml(match, oddsType));
                    } else {
                        closeEventWindow();
                    }
                }
            }

        } else {
            disableOdds(match.matchID, oddsType);
        }
    }
}

//update odds
function updateOdds(oldOddsSet, newValues, isSell, lineSell, canAllUp, mlItem) {
    if (oldOddsSet == null || newValues == null || isSell == null) return;

    if (oldOddsSet.length == newValues.length) {
        var len = oldOddsSet.length;
        for (var i = 0; i < len; i++) {
            if (newValues[i] == null) continue;

            //old odds value
            var $oldOddsObj = $(oldOddsSet[i]);
            var $chkObj = $(oldOddsSet[i] + "_c");

            if (newValues[i] != null) {
                var newoddsStr = newValues[i].split("@");
                //new status
                var newStatus = newoddsStr[0];
                //new odds value
                var newOdds = newoddsStr[1];

                //only do update when status is updated
                var oldOddsText = $oldOddsObj.text();

                //check if it's changed from stop to start sell
                var isFromStopToStartSell = false;
                if (!$.isNullOrEmpty(oldOddsText)) {
                    isFromStopToStartSell = (oldOddsText.indexOf("--") > -1);
                }

                var tmpArr = oldOddsSet[i].replace("#", "").split("_");
                var matchID = tmpArr[0];
                var oddsType = tmpArr[1];
                var item = tmpArr[2];
                if (isSell && lineSell[i] && canAllUp) {
                    $oldOddsObj.parent().attr("href", "javascript:calBet(this,'" + matchID + "','" + oddsType + "','" + item + "','" + mlItem[i] + "')")
                               .attr("title", GetGlobalResources("AllupCalculator", "js")).removeClass("noUL");
                }
				else {
				     $oldOddsObj.parent().removeAttr("href");
					 $oldOddsObj.parent().addClass("noUL");
				}

                //check selection updated
                var isOddsUpdated = (newStatus.charAt(1) == "1");

                //check whether match is changed from stop sell to start sell
                //and selection disabled
                var isUpdated = (isOddsUpdated || isFromStopToStartSell);
                if (!isSell || !lineSell[i] || newOdds == "RFD" || newOdds == "LSE" || isDisabled(newStatus)) {
                    $chkObj.attr("disabled", true);
                    if ( $chkObj.attr("checked") ) {
                        $chkObj.parent().removeClass("checkedOdds");
                        $chkObj.attr("checked", false);
                    }
					selectionCheckBox[matchID + '_' + oddsType + '_' + item + '_' + $chkObj.attr('lineNo')] = false;
                } else {
                    $chkObj.attr("disabled", false);
                }

                $oldOddsObj.addClass("oupt");
                $oldOddsObj.html(newOdds);
				oldOdds[oldOddsSet[i]] = newOdds;
				
                if (!isSell || !lineSell[i]) {
                    $oldOddsObj.html("---");
                    $oldOddsObj.removeClass("oupt");
                }
                else if (newOdds == "RFD") {
                    $oldOddsObj.html(jsRFD);
                }
                else if (newOdds == "LSE") {
                    $oldOddsObj.html(jsLSE);
                    $oldOddsObj.addClass("cLSE");
                    $chkObj.addClass("cLSE");
                }
                else {
                    $oldOddsObj.removeClass("cLSE");
                    $chkObj.removeClass("cLSE");
                }

                if (!isOddsUpdated) {
                    $oldOddsObj.removeClass("oupt");
                }
            }
        }
    }
}

//disable the checkbox
function disableOdds(matchID, oddsType) {
    if (matchID != null && matchID != "") {
        var m = getMatch(matchID);
		if ( m==null )
			return;
		var p = getPool(m, oddsType);
		if ( p==null )
			return;
        var prefix = matchID + "_" + p.name + "_";
        $("input[type=checkbox][id^=" + prefix + "]").each(function() {
            $(this).attr("disabled", true);
        });
        $("span[id^=" + prefix + "]").each(function() {
            $(this).text("---");
            $(this).parent().removeAttr("href").removeAttr("title").addClass("noUL");
        });
    }
}

//get matchNum
function getMatchNum(match, oddsType) {
    var sb = new StringBuffer();
    if (match != null && oddsType != null && oddsType != "") {
        var pool = getPool(match, oddsType);
        var isInplay = pool ? pool.isInplay : false;
        if (!isMatchFinish(match) && ((match.isStarted && isInplay) || !match.isStarted)) {
            if (!match.isStarted) {
                sb.append("<a href=\"/football/odds/odds_allodds.aspx?");
            } else if (isInplay) {
                sb.append("<a href=\"/football/odds/odds_inplay_all.aspx?");
            }
            sb.append("lang=" + jsLang + "&tmatchid=" + match.matchID + "&tdate=" + match.matchDate + "&tday=" + match.matchDay + "&tnum=" + match.matchNum + "\"");
            sb.append(" title=\"" + GetGlobalResources("AllOdds") + "\">");
        }
        sb.append(GetGlobalResources(match.matchDay));
        sb.append(" " + match.matchNum);
        if (!isMatchFinish(match) && ((match.isStarted && isInplay) || !match.isStarted)) {
            sb.append("</a>");
        }
    }
    return sb.toString();
}

//get the last update time
function getLastUpdateTime(oddsType) {
    if (filteredMatches == null) return;
    var time = null;
    for (var i = 0; i < filteredMatches.length; i++) {
        for (var j = 0; j < filteredMatches[i].matches.length; j++) {
            var match = filteredMatches[i].matches[j];
            var pool = getPool(match, oddsType);
            if (pool != null) {
                if (time == null) {
                    time = match.lastUpdateTime;
                }
                var res = compareDateTime(convertToDateTime(time), convertToDateTime(match.lastUpdateTime))
                if (res == "<") {
                    time = match.lastUpdateTime;
                }
            }
        }
    }
    return time;
}

//set the last update time
function setLastUpdateTime(lastUpdateTime) {
    if (!$.isNullOrEmpty(lastUpdateTime)) {
        $("#spRefreshTime").html(lastUpdateTime);
    }
}

//link to live cast
function callLiveCast(para) {
    MM_openBrWindow(liveCastUrl + para, '', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,top=10,left=0,width=805,height=550');
}

function formatGoal(goalNum) {
    var intGoal = parseInt(goalNum);
    var cntGoal = "";
    if (jsLang == "EN") {
        cntGoal = "<sup>th</sup>";

        if (intGoal < 11 || intGoal > 20) {
            if (intGoal % 10 == 1) {
                cntGoal = "<sup>st</sup>";
            } else if (intGoal % 10 == 2) {
                cntGoal = "<sup>nd</sup>";
            } else if (intGoal % 10 == 3) {
                cntGoal = "<sup>rd</sup>";
            }
        }
        return intGoal + cntGoal + " " + GetGlobalResources("ntslastpart");
    } else {
        return GetGlobalResources("ntsfstpart") + goalNum + GetGlobalResources("ntslastpart");
    }
}

function getMatchTime(matchStatus) {
    var displayTime = -1;
    var status = matchStatus.split("@")[0];
    var tmpDate = convertToDateTime(matchStatus.split("@")[1]);
    if (!$.isNullOrEmpty(tmpDate)) {
        if (status == "1st-half" || status == "2nd-half" || status == "1st-extra" || status == "2nd-extra") {
            var offset = minutesDiff(tmpDate, convertToDateTime(serverTime));
            if (offset < 0) {
                offset = 0;
            }
            if (status == "1st-half") {
                displayTime = offset + 0;
            }
            else if (status == "2nd-half") {
                displayTime = offset + 45;
            }
            else if (status == "1st-extra") {
                displayTime = offset + 90;
            }
            else if (status == "2nd-extra") {
                displayTime = offset + 105;
            }
        }
    }
    return displayTime;
}

function formatStatus(matchStatus, incomplete) {
    var displayTime = getMatchTime(matchStatus);
    var res = "";
    var status = matchStatus.split("@")[0];
    var time = matchStatus.split("@")[1];
    if (status == "1st-half" || status == "2nd-half" || status == "1st-extra" || status == "2nd-extra") {
        if (incomplete || time == "" || time == null || displayTime==-1) {
            if (status == "1st-half") {
                res = GetGlobalResources("IlcFirstHalf");
            } else if (status == "2nd-half") {
                res = GetGlobalResources("IlcSecondHalf");
            } else if (status == "1st-extra" || status == "2nd-extra") {
                res = GetGlobalResources("ET");
            }
        } else {
            var maxTime = 0;
            if (status == "1st-half") {
                maxTime = 45;
            } else if (status == "2nd-half") {
                maxTime = 90;
            } else if (status == "1st-extra") {
                maxTime = 105;
            } else if (status == "2nd-extra") {
                maxTime = 120;
            }
            res = formatTime(displayTime, maxTime);
        }
    } else if (status == "mid-event") {
        res = GetGlobalResources("HT");
    } else if (status == "halted" || status == "fulltime" || status == "await-extra-time") {
        res = GetGlobalResources("FT");
    } else if (status == "await-penalties" || status == "penalty-kicks") {
        res = GetGlobalResources("PK");
    }
    return res;
}

function formatTime(displayTime, maxTime) {
    var res = "";
    if (displayTime > maxTime) {
        res = maxTime + "' + "; //res = maxTime + "' + " + (displayTime - maxTime) + "'"
    } else {
        res = displayTime + "'";
    }
    return res;
}

function updateAllMatchesTime() {
    autoRefreshServerTime();

    if (ilcMatches == null) return;
    for (var i = 0; i < ilcMatches.length; i++) {
        for (var j = 0; j < ilcMatches[i].matches.length; j++) {
            var m = ilcMatches[i].matches[j];
            if ( m.isStarted )
                updateTime(m.matchID, m.matchStatus, m.betradarDataIncomplete);
        }
    }
    setLastUpdateTime(serverTime);
    setTimeout('updateAllMatchesTime()', 60000);
}

function updateTime(matchID, matchStatus, incomplete) {
    var $matchStatus = $("#" + matchID + "_status");
    if ($matchStatus.length > 0) {
        var displayTime = formatStatus(matchStatus, incomplete);
        $matchStatus.text(displayTime);
    }
}

function stopTimerForAllMatches() {
//no use
}

function openTips(parentObj, oddsType) {
    if ($("#divTips").length < 1) {
        var tips = "";
        if (oddsType == "fts") {
            tips = GetGlobalResources("Fts", "js");
        } else {
            tips = formatGoal($(parentObj).text());
        }
        var pos = $(parentObj).offset();
        var top = pos.top + $(parentObj).height();
        $("#ilcMatches").append("<div id=\"divTips\">" + tips + "</div>");
        $("#divTips").css({ position: "absolute", top: top, left: pos.left, zIndex: "1000", backgroundColor: "#fff", border: "solid 1px #000", padding: "2px 5px" });
        $(document).oneTime(5000, "goaltips", function() {
            $("#divTips").remove();
            $(document).stopTime("goaltips");
        });
    }
}

function closeTips() {
    $("#divTips").remove();
    $(document).stopTime("goaltips");
}

function disconnectAMS() {
    if (page != null && page.lsEngine != null) {
        page.lsEngine.changeStatus("DISCONNECTED");
    }
    enableBSinDev = false;
}

//dd/MM/yyyy hh:mm:ss
function isDateTime(str) {
    if (str != "" && str != null) {
        str = str.replace(/^\s+|\s+$/, "");
        var reg = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}) (\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/;
        var result = str.match(reg);
        if (result == null) return false;
        var d = new Date(result[3], result[2] - 1, result[1], result[4], result[5], result[7]);
        if (d.getFullYear() != result[3]) return false;
        if (d.getMonth() != (result[2] - 1)) return false;
        if (d.getDate() != result[1]) return false;
        if (d.getHours() != result[4]) return false;
        if (d.getMinutes() != result[5]) return false;
        if (d.getSeconds() != result[7]) return false;
        return true;
    }
    return false;
}

//convert str with format of dd/MM/yyyy hh:mm:ss to date
function convertToDateTime(str) {
    if (str != "" && str != null) {
        str = str.replace(/^\s+|\s+$/, "");
        if (isDateTime(str)) {
            var tmpArrDate = str.split(" ")[0].split("/");
            var tmpArrTime = str.split(" ")[1].split(":");
            return new Date(tmpArrDate[2], tmpArrDate[1] - 1, tmpArrDate[0], tmpArrTime[0], tmpArrTime[1], tmpArrTime[2]);
        }
    }
    return null;
}

//compare datetime
function compareDateTime(d1, d2) {
    var res = "";
    if ($.isNullOrEmpty(d1) && $.isNullOrEmpty(d2)) {
        res = "==";
    } else if (!$.isNullOrEmpty(d1) && $.isNullOrEmpty(d2)) {
        res = ">";
    } else if ($.isNullOrEmpty(d1) && !$.isNullOrEmpty(d2)) {
        res = "<";
    } else if (d1.constructor == Date && d2.constructor == Date) {
        var t1 = d1.getTime();
        var t2 = d2.getTime();
        if (parseInt(t1) > parseInt(t2)) {
            res = ">";
        } else if (parseInt(t1) == parseInt(t2)) {
            res = "==";
        } else {
            res = "<";
        }
    }
    return res;
}

function minutesDiff(d1, d2) {
    if (!$.isNullOrEmpty(d1) && d1.constructor == Date
        && !$.isNullOrEmpty(d2) && d2.constructor == Date) {
        return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60));
    }
    return 0;
}

function checkIsVoidMatch(matchStatus) {
    var isVoidMatch = false;
    if (!$.isNullOrEmpty(matchStatus)) {
        var tmpStatus = matchStatus.split("@")[0].toLowerCase();
        if (tmpStatus == "void-match") {
            isVoidMatch = true;
        }
    }
    return isVoidMatch;
}

function checkIsRefundPool(matchPoolStatus) {
    if (!$.isNullOrEmpty(matchPoolStatus) && matchPoolStatus.toUpperCase() == "REFUND") {
        return true;
    }
    return false;
}

function getPool(match, oddsType) {
	if ( oddsType.toUpperCase()=="FTS/NTS" ) {
		var pool = match.pools.ets;
		if ( pool==null )
			pool = match.pools.nts;
		if ( pool==null )
			pool = match.pools.fts;
		return pool;
	}
	else
		return eval("match.pools." + oddsType.toLowerCase());
}

function checkIsSell(pool) {
    var isSell = false;
    if (!$.isNullOrEmpty(pool)) {
        isSell = pool.isSelling && pool.poolStatus == "start-sell";
    }
    return isSell;
}

function setMatchStage(m) {
    var matchID = m.matchID;
    var matchStage = m.matchStatus.split("@")[0];
    var tmpStage = "";
    if (!$.isNullOrEmpty(matchStage)) {
        tmpStage = matchStage;
        if (m.hasETSPool || matchStage == "1st-extra" || matchStage == "2nd-extra") {
            tmpStage = "extratime";
        }
    }
    if ($("#hsst" + matchID).length > 0) {
        $("#hsst" + matchID).attr("value", tmpStage);
    }
}

function haveExtraTime(m) {
  for (var key in m.extraTimes) {
      if (m.extraTimes[key])
          return true;
  }
  return false;
}

function isMatchFinish(m) {
    return (m.matchStatus.indexOf("halted") >= 0);
}

function IsDefinedPool(matchId, oddsType) {
    return (definedPoolArr[matchId + oddsType] != null && definedPoolArr[matchId + oddsType]==1);
}

function setSelectionCheckBox(matchId, oddsType, item, obj) {
   selectionCheckBox[matchId + '_' + oddsType + '_' + item + '_' + $(obj).attr('lineNo')] = obj.checked;
}

function isSelectionCheckBoxChecked(matchId, oddsType, item) {
    return selectionCheckBox[matchId + '_' + oddsType + '_' + item]==true;
}

function sortMultipleLines(a, b) {
    if (isMainLineOnTop && a.isMainline)
        return -1;
    if (isMainLineOnTop && b.isMainline)
        return 1;

    var isSplitLineA = a.line.indexOf('/') >= 0;
    var lineA = parseFloat(a.line);
    var isSplitLineB = b.line.indexOf('/') >= 0;
    var lineB = parseFloat(b.line);

    if (lineA < lineB)
        return -1;
    if (lineA > lineB)
        return 1;

    if (!isSplitLineA && isSplitLineB)
        return -1;
    if (isSplitLineA && !isSplitLineB)
        return 1;
    return 0;
}

function hasMLOddsChange(matchID, pool) {
  for ( var i=0; i<pool.odds.length; i++ ) {
    if ( pool.odds[i].isMainline )
	  continue;
	var spanID = "#" + matchID + "_" + pool.name + "_H" + ((i > 0)?'_' + i:"");
	var odds = pool.odds[i].H;
	if ( isSelectionCheckBoxChecked(matchID, pool.name, 'H_' + pool.odds[i].lineNo)
		&& odds.charAt(1)=='1' && oldOdds[spanID] != odds.split('@')[1] )
	  return true;
	spanID = matchID + "_" + pool.name + "_L" + ((i > 0)?'_' + i:"");
    odds = pool.odds[i].L;
	if ( isSelectionCheckBoxChecked(matchID, pool.name, 'L_' + pool.odds[i].lineNo)
		&& odds.charAt(1)=='1' && oldOdds[spanID] != odds.split('@')[1] )
	  return true;	
  }
  return false;
}

function checkMainlineChange(matchID, pool) {
	var mainLineNo = 0;
	for ( var i=0; i<pool.odds.length; i++ ) {
		if ( pool.odds[i].isMainline ) {
			mainLineNo = pool.odds[i].lineNo;
			break;
		}
	}
	if ( oldMainline["m"+matchID]!=mainLineNo && multipleLinePoolIds["m"+matchID]!=1 ) { //reset checkbox
		for ( var i=1; i<=5; i++ ) {
			selectionCheckBox[matchID + '_' + pool.name + '_H_' + i] = false;
			selectionCheckBox[matchID + '_' + pool.name + '_L_' + i] = false;
		}
		oldMainline["m"+matchID] = mainLineNo;
	}
}

function checkCheckboxStatus() {
  for ( var key in selectionCheckBox ) {
    if ( selectionCheckBox[key] ) {
	  var parts = key.split('_');
	  var matchId = parts[0];
	  var oddsType = parts[1];
	  var item = parts[2];
	  var lineNo = parts[3];
	  var m = getMatch(matchId);
	  if ( m==null ) {
	    selectionCheckBox[key] = false;
		continue;
	  }
	  var pool = getPool(m, oddsType);
	  if ( pool==null ) {
	    selectionCheckBox[key] = false;
		continue;
	  }
	  if ( oddsType=='HIL' || oddsType=='CHL' ) {
	    var offered = false;
	    for ( var i=0; i<pool.odds.length; i++ ) {
		  if ( pool.odds[i].lineNo==lineNo ) {
		    offered = true;
			break;
		  }
		}
		if ( !offered )
		  selectionCheckBox[key] = false;
	  }
	}
  }
}