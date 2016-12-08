// <reference path="/info/include/js/jquery132.js" />
var cellhighlightColor = "#fff4b0";
var menuhighlighColor = "#4d822d";

//init scripts in body onload
function init() {

    //adjust width for EN
    if (jsLang.toUpperCase() == "EN") {
        //topMenu_width = $("#topMenu").width();
        fb_promo_top_width = $("#fb_promo_top").width();
        fb_promo_rgp_width = $("#fb_promo_rgp").width();
        fb_promo_bottom_width = $("#fb_promo_bottom").width();

        /*$("#topMenu").width(topMenu_width+3);
        $("#fb_promo_top").width(fb_promo_top_width+3);
        $("#fb_promo_rgp").width(fb_promo_rgp_width+3);
        $("#fb_promo_bottom").width(fb_promo_bottom_width+3);*/
    }

    //init clock
    initRefreshTime();

    //prevent odds checkbox is still checked on reload
    $(".codds input").attr("checked", false);

    if (typeof checkboxClickable == "boolean") {
        checkboxClickable = true;
    }

    // override jQuery.fn.hide to focus the browser to re-render after hide()
    overrideJQueryHide();
}

function overrideJQueryHide() {
    var originalHide = jQuery.fn.hide;
    jQuery.fn.hide = function() {
        var emptyDiv = $("<div>").addClass("emptyDiv").css("display", "none");
        if (this.find("div.emptyDiv").length == 0) {
            this.append(emptyDiv);
        } else {
            this.find("div.emptyDiv").replaceWith(emptyDiv);
        }

        return originalHide.apply(this, arguments);
    };
}

//the scripts to be run at the end of the page
function onFinishLoading() {
    //highlight selected left nav
    highlightLeftNav();

    //preselect match dropdown
    matchddlselect();

    //hide header icon when no data
    hideHeaderIcons();

    //fix odds header width
    fixOddsHeaderWidth();

    //fix browser specific style
    BrowserStyleFix();
}

//init clock
function initRefreshTime() {
    if ($("#sRefreshTime").length) {
        $("#sRefreshTime").jclock({ custom_offset: jsOffsetTime });
    }
}

//fix ref odds header width
function fixOddsHeaderWidth() {
    if ($(".refheader").length) {
        $(".refheader .cTitle").width(470);
    }
    if (jsLang == "EN") {

        $(".normalheader .cTitle").width(370);
    }
}

//hide error image
function errImg(_imgObj) {
    $(_imgObj).hide();
}

//remove header icon if there're no pools / matches / data
function hideHeaderIcons() {
    //    var $objNoPoolMsg = $(".nopool");
    //    var $oddsSubHeader = $(".spoddsheader");
    //    var $couponObj = $(".tgCoupon");
    //    if ($objNoPoolMsg.length && ($oddsSubHeader.length==0 || $couponObj.length==0)) {
    //        $(".cActions a").hide();
    //        $(".addslip").hide();
    //    }
    var $oddsCheckboxobj = $("input[type=checkbox]");
    if ($oddsCheckboxobj.length == 0 && $('#selFormulaTop').length == 0) {
        $(".cActions a").hide();
        $(".addslip").hide();
        if ($(".tSCHEDULE").length > 0) {
            $(".cActions a").show();
        }
        if (location.href.toLowerCase().indexOf("football/index.aspx") > -1) {// added by turober,for print and refresh button should be shown in index page
            $(".cActions a").show();
        }
    }
}

function callDivCal(_para, _langCode) {
    var calUrl = "/football/cal/allup_cal/div_cal.aspx?para=" + _para + "&lang=" + jsLang;
    divCalWindow = window.open(calUrl, "divCalculator", 'top=100,left=100,scrollbars=yes,resizable=yes,width=734,height=393');
}

function callInvestCal(_langCode) {
    var calUrl = "/football/cal/invest_cal/invest_calc2.aspx?lang=" + jsLang;
    divCalWindow = window.open(calUrl, "divCalculator", 'top=0,left=20,scrollbars=no,resizable=yes,width=680,height=452');
}

function callAllUpComb(_langCode) {
    var calUrl = "/football/cal/invest_cal/bet_six.aspx?lang=" + jsLang;
    divCalWindow = window.open(calUrl, "divCalculator", 'top=20,left=20,scrollbars=no,resizable=yes,width=770,height=550');
}

//check login betslip
function isLoginBetSlip() {

    //    if (top.betSlipFrame) {
    //        return top.betSlipFrame.isLogon();
    //    }
    if (top.document.getElementById('betSlipFrame')) {
        return top.document.getElementById('betSlipFrame').contentWindow.isLogon();
    }
    return false;
}

//refresh odds content
function refreshOddsContent() {
    $("#footballmaincontent").hide();
    $(".hAutoRefreshScript").each(function() {
        eval($(this).val());
    });
    window.setTimeout('$("#footballmaincontent").show();', 200);
}

//refresh odds page
function refreshOddsPage(_isIndexPage) {
    if (blnPageLoaded) {
        if (dateObj.valueOf() - dateObj2.valueOf() > (manualRefreshInterval * 1000)) {
            if (_isIndexPage) {
                location.href = "/football/index.aspx?lang=" + jsLang + "&oddsRefreshAtFbLding=true";
            }
            else {
                refreshOddsContent();
            }
        }
        //refresh in debug mode without checking refresh time limit
        if (enableBSinDev) {
            refreshOddsContent();
        }
    }
}

//preselect / remove selected item match dropdown
function matchddlselect() {
    var $ddlObj = $(".ddlAllMatches:first");
    var ddlObjWidth = $ddlObj.width();
    if (ddlObjWidth > 340) {
        ddlObjWidth = 340;
    }
    //alert(ddlObjWidth);

    if ($ddlObj.length) {
        var matchID = "";
        if (matchIDArr.length > 0) {
            matchID = matchIDArr[0];
        }
        else {
            matchID = $("#hHeaderMatchID").val();
        }

        if (!$.isNullOrEmpty(matchID)) {
            var $selectedObj = $(".ddlAllMatches:first option[value*='" + matchID + "']:first");
            var selectedIndex = $(".ddlAllMatches:first option[value*='" + matchID + "']:first").val();
            //alert(selectedIndex);
            $selectedObj.remove();
            $ddlObj.width(ddlObjWidth);

            var optiontext = "";
            var optionindex = 0;

            //removes the coupon that contains no matches
            var $options = $("option", $ddlObj);
            var $couponItemToRemove = null;
            for (var i = 0; i < $options.length - 1; i++) {
                var curOptionVal = ($options[i].value);
                var nextOptionVal = ($options[i + 1].value);

                if (curOptionVal.indexOf("--coupon") > -1 && nextOptionVal.indexOf("--coupon") > -1) {
                    //alert("delete coupon " + curOptionVal);
                    $couponItemToRemove = ($options[i]);
                }
            }
            if ($options[$options.length - 1].value.indexOf("--coupon") > -1) {
                $couponItemToRemove = ($options[$options.length - 1]);
            }

            //alert("delete coupon " + $couponItemToRemove.value);
            if ($couponItemToRemove != null) {
                $("option", $ddlObj).each(function() {
                    if ($(this).val().indexOf($couponItemToRemove.value) > -1) {
                        $(this).remove();
                    }
                });
            }
        }
    }
}

//check null or empty
jQuery.extend({
    isNullOrEmpty: function(o) {
        if (o == null || o == undefined || o == "") {
            return true;
        }
        return false
    }
});

//get current page name
function getCurrentPagename() {
    var currentUrl = location.href.toLowerCase();
    var endIdx = currentUrl.indexOf('?');
    if (endIdx < 0) {
        endIdx = currentUrl.length;
    }

    var curPagename = currentUrl.substring(currentUrl.lastIndexOf('/') + 1, endIdx);

    return curPagename;
}

//browser specific look and feel fix

function BrowserStyleFix() {
    var isBrowserIE = (jQuery.browser.className.indexOf("msie") > -1);
    var isBrowserFF = (jQuery.browser.className.indexOf("firefox") > -1);
    var isBrowserSafari = (jQuery.browser.className.indexOf("safari") > -1);
    var isBrowserChrome = (jQuery.browser.className.indexOf("chrome") > -1);
    if (!isBrowserIE) {
        if (isBrowserFF) {
            //fix header
            $(".tblHeader .normalheader .cTitle").width(290);
            $(".tblHeader .normalheader .cActions").width(255);
        }
        else if (isBrowserSafari) {
            //fix header
            $(".tblHeader .normalheader .cTitle").width(290);
            $(".tblHeader .normalheader .cActions").width(255);

            //fix coupon expand / collapse icon
            //            $(".spBtnMinus").css("position", "relative");
            //            $(".spBtnMinus").css("top", "-2px");
            //            $(".spBtnPlus").css("position", "relative");
            //            $(".spBtnPlus").css("top", "-2px");
        }
    }

    //    if (parent != null) {
    //        var parentFrame = $("#info", parent.document.body);
    //    } 
}

//highlight selected left nav
function highlightLeftNav() {
    var currentUrl = location.href.toLowerCase();
    var curPagename = "/odds/" + getCurrentPagename();
    var toBeHighlightedItems = [];
    $(".leftNav").each(function() {
        var targeturl = ($(this).attr("onClick")) + "";
        if (targeturl != null && targeturl != "undefined") {
            var tmatchid = getParameterByName("tmatchid");
            var tournid = getParameterByName("tournid");
            if (currentUrl.indexOf("sbf") == -1) {
                if (!$.isNullOrEmpty(tmatchid)) {
                    var tmatchidStr = "tmatchid=" + getParameterByName("tmatchid");
                    if (targeturl.indexOf(curPagename) > -1 && targeturl.indexOf(tmatchidStr) > -1) {
                        toBeHighlightedItems.push(this);
                    }
                } else if (!$.isNullOrEmpty(tournid)) {
                    var tournidStr = "tournid=" + getParameterByName("tournid");
                    if (targeturl.indexOf(curPagename) > -1 && targeturl.indexOf(tournidStr) > -1) {
                        toBeHighlightedItems.push(this);
                    }
                }
                if (
                    targeturl.indexOf("tmatchid=") < 0 &&
                    targeturl.indexOf("tournid=") < 0 &&
                    (
                        targeturl.indexOf(curPagename) > -1 ||
                        (curPagename.indexOf("odds_mixallup_all.aspx") > -1 && targeturl.indexOf("odds_mixallup") > -1 && targeturl.indexOf("odds_mixallup_shortcut") < 0) ||
                        (curPagename.indexOf("odds_inplay_all.aspx") > -1 && targeturl.indexOf("odds_inplay") > -1) ||
                        (curPagename.indexOf("odds_allodds.aspx") > -1 && targeturl.indexOf("odds_allodds") > -1) ||
                        (curPagename.indexOf("odds_halftime_all.aspx") > -1 && targeturl.indexOf("halftime") > -1)
                    )
                ) {
                    toBeHighlightedItems.push(this);
                }
            }
        }
    });
    if (toBeHighlightedItems.length > 0) {
        if (curPagename.indexOf("odds_mixallup_shortcut.aspx") > -1) {
            $(toBeHighlightedItems).parent().addClass("oddsHighlight");
            $(toBeHighlightedItems).children("a").css("color", menuhighlighColor);
        } else {
            $(toBeHighlightedItems[0]).parent().addClass("oddsHighlight");
            $(toBeHighlightedItems[0]).children("a").css("color", menuhighlighColor);

        }
    }
}

//load special web
function loadSpecialWeb(isIndexPage) {
    if (isIndexPage == '1') {
        //        $("#fb_promo_top").height(200); 
        //        $("#fb_promo_rgp").height(140);
        //        $("#fb_promo_bottom").height(100);
        //        $("#homeSNFrame").height(39);
    } else {
        $("#fb_promo_top").height(0);
        //        $("#fb_promo_rgp").height(140);
    }
}

//open in new window
function MM_openBrWindow(theURL, winName, features) { //v2.0
    window.open(theURL, winName, features);
}

//flag description 
function goFlagUrl() {
    MM_openBrWindow(jsSpecialURL + 'football/info/' + jsLang + '/match_info.asp', '', 'scrollbars=yes,resizable=no,width=572,height=270')
}

//pool type description 
function goPTUrl() { //pool type
    MM_openBrWindow(jsSpecialURL + 'football/info/' + jsLang + '/misc/icons_popup.asp', 'PoolType', 'scrollbars=yes,resizable=yes,width=750,height=350');
}

//tv description 
function goTVUrl() { //TV
    MM_openBrWindow(jsSpecialURL + 'football/info/' + jsLang + '/misc/tv_popup.asp', 'TV', 'scrollbars=yes,resizable=yes,width=750,height=500')
}

//match info head to head
function callMatchInfo(para) {
    MM_openBrWindow(jsMIURL + (jsLang.toLowerCase() == "ch" ? "chinese" : "english") + '/head-to-head/recent-form.aspx' + para, '', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,top=10,left=0,width=805,height=550')
}

//open bet type
function callBetTypes(filename, ev) {
    cancelPropagation(ev);
    MM_openBrWindow(jsISURL + 'football/info/' + jsLang + '/betting/' + filename, 'BetTypes', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10,left=0,width=770,height=500')
}

//open focus match inplay / HT
function openFocusMatch(_url) {
    if (top != null && top.info != null) {
        top.info.location.href = _url;
    }
    else {
        location.href = _url;
    }
}

//cancel event propagation in onclick event
function cancelPropagation(ev) {
    if (ev != null) {
        ev = ev || window.event;
        if (ev.preventDefault) {
            ev.preventDefault();
            ev.stopPropagation();

        } else if ('cancelBubble' in ev) {
            ev.cancelBubble = true;
        }
    }
}

//print content
function printNow(url) {
    window.print();
    /*
    if (url != '') {
    var newWin = window.open(url, "newWin", "top=1000,left=250,width=1,height=1,scrollbars=no,resizable=no,toolbar=no");
    window.focus();
    }
    */
}


//switch match in dropdown
function switchMatch(_selObj, _oddsType) {
    var selectedObj = $(_selObj).children("option:selected");
    var pagename = "odds_" + _oddsType + ".aspx";
    if (_oddsType.toLowerCase() == "fcs")
        pagename = "odds_fcs.aspx";
    if (_oddsType == "all") {
        pagename = "odds_allodds.aspx";
    }
    else if (_oddsType == "inplayall") {
        pagename = "odds_inplay_all.aspx";
    }
    else if (_oddsType == "halftimeall") {
        pagename = "odds_halftime_all.aspx";
    }
    if (selectedObj.val().indexOf("--") == -1) {
        location.href = pagename.toLowerCase() + selectedObj.val();
    }
}

//toggle multiple line
function tgIndMl(_matchIdx) {
    var _obj = $("#rmid" + _matchIdx);
    var isHidden = $(_obj).children(".tgIndMl").children("span").hasClass("mlBtnPlus");
    if (isHidden) {
        $(_obj).children(".tgIndMl").children("span.mlBtnPlus").addClass("mlBtnMinus");
        $(_obj).children(".tgIndMl").children("span.mlBtnPlus").removeClass("mlBtnPlus");
        $(_obj).find(".otherLineRow").show();
    }
    else {
        $(_obj).children(".tgIndMl").children("span.mlBtnMinus").addClass("mlBtnPlus");
        $(_obj).children(".tgIndMl").children("span.mlBtnMinus").removeClass("mlBtnMinus");
        $(_obj).find(".otherLineRow").hide();
    }
    for (var i = 1; i <= $('.tgCoupon').length; i++) {
        if (_obj.hasClass('.tgCou' + i)) {
            if ((isHidden && $('.tgCou' + i).find('.mlBtnPlus').length == 0) || !isHidden) {
                var _obj2 = $(".mlHeader" + i);
                if (isHidden) {
                    $(_obj2).children("span.mlBtnPlus").addClass("mlBtnMinus");
                    $(_obj2).children("span.mlBtnPlus").removeClass("mlBtnPlus");
                    $(_obj2).children("span.mlLblExpand").hide();
                    $(_obj2).children("span.mlLblCollapse").show();
                }
                else {
                    $(_obj2).children("span.mlBtnMinus").addClass("mlBtnPlus");
                    $(_obj2).children("span.mlBtnMinus").removeClass("mlBtnMinus");
                    $(_obj2).children("span.mlLblCollapse").hide();
                    $(_obj2).children("span.mlLblExpand").show();
                }
            }
            break;
        }
    }
}

function tgMl(_obj, _couIdx) {
    var isCouponHidden = $(_obj).parent().children("span").hasClass("spBtnPlus");
    if (isCouponHidden) {
        tgCoupon($(_obj).parent(), _couIdx);
    }
    var isHidden = $(_obj).children("span").hasClass("mlBtnPlus");
    if (isHidden) {
        $(_obj).children("span.mlBtnPlus").addClass("mlBtnMinus");
        $(_obj).children("span.mlBtnPlus").removeClass("mlBtnPlus");
        $(_obj).children("span.mlLblExpand").hide();
        $(_obj).children("span.mlLblCollapse").show();
    }
    else {
        $(_obj).children("span.mlBtnMinus").addClass("mlBtnPlus");
        $(_obj).children("span.mlBtnMinus").removeClass("mlBtnMinus");
        $(_obj).children("span.mlLblCollapse").hide();
        $(_obj).children("span.mlLblExpand").show();
    }
    $("." + _couIdx + "").each(function() {
        var isIndHidden = $(this).children(".tgIndMl").children("span").hasClass("mlBtnPlus");
        if (isIndHidden || $(this).children(".tgIndMl").children("span").hasClass("mlBtnMinus")) {
            if (isHidden == isIndHidden) {
                if (isHidden) {
                    $(this).children(".tgIndMl").children("span.mlBtnPlus").addClass("mlBtnMinus");
                    $(this).children(".tgIndMl").children("span.mlBtnPlus").removeClass("mlBtnPlus");
                    $(this).find(".otherLineRow").show();
                }
                else {
                    $(this).children(".tgIndMl").children("span.mlBtnMinus").addClass("mlBtnPlus");
                    $(this).children(".tgIndMl").children("span.mlBtnMinus").removeClass("mlBtnMinus");
                    $(this).find(".otherLineRow").hide();
                }
            }
        }
    });
}

//toggle coupon show / hide
function tgDay(_matchID, _allupPools) {
    var _obj = $('#tg' + _matchID);
    var isHidden = $(_obj).children().children("span").hasClass("spBtnPlus");
    if (isHidden) {                    
        LoadShortCutOddsContent(_matchID, _allupPools);
        $(_obj).children().children("span.spBtnPlus").addClass("spBtnMinus");
        $(_obj).children().children("span.spBtnPlus").removeClass("spBtnPlus");
    }
    else {
        $(_obj).children().children("span.spBtnMinus").addClass("spBtnPlus");
        $(_obj).children().children("span.spBtnMinus").removeClass("spBtnMinus");
    }

    if (isHidden) {
        $("#dMix_" + _matchID).show();
    }
    else {
        $("#dMix_" + _matchID).hide();
    }
}

//toggle coupon show / hide
function tgCoupon(_obj, _couIdx) {
    var isHidden = $(_obj).children("span").hasClass("spBtnPlus");
    if (isHidden) {
        $(_obj).children("span.spBtnPlus").addClass("spBtnMinus");
        $(_obj).children("span.spBtnPlus").removeClass("spBtnPlus");
    }
    else {
        $(_obj).children("span.spBtnMinus").addClass("spBtnPlus");
        $(_obj).children("span.spBtnMinus").removeClass("spBtnMinus");
    }
    $("." + _couIdx + "").each(function() {
        if (isHidden) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

//toggle coupon show / hide

function tgCoupon2(_obj, _couIdx) {
    var isHidden = $(_obj).children("span").hasClass("spBtnPlus");
    if (isHidden) {
        $(_obj).children("span.spBtnPlus").addClass("spBtnMinus");
        $(_obj).children("span.spBtnPlus").removeClass("spBtnPlus");
    }
    else {
        $(_obj).children("span.spBtnMinus").addClass("spBtnPlus");
        $(_obj).children("span.spBtnMinus").removeClass("spBtnMinus");
    }

    $("." + _couIdx + "").each(function() {
        if (isHidden) {
            if ($(this).attr("class").indexOf("hidden") == -1) {
                $(this).show();
            }
        }
        else {
            $(this).hide();
        }
    });
}


//toggle mix cal show / hide
function tgMixCal(_obj, _calID) {
    var containerID = _calID.replace("Value", "");
    var isHidden = $("#" + containerID + " span.spMixBtn").hasClass("spMixBtnPlus");
    if (isHidden) {
        $("#" + containerID + " span.spMixBtn").addClass("spMixBtnMinus");
        $("#" + containerID + " span.spMixBtn").removeClass("spMixBtnPlus");
    }
    else {
        $("#" + containerID + " span.spMixBtn").addClass("spMixBtnPlus");
        $("#" + containerID + " span.spMixBtn").removeClass("spMixBtnMinus");
    }

    if (isHidden) {
        $("#" + _calID).show();
    }
    else {
        $("#" + _calID).hide();
    }
}

//toggle checked odds
var clickedCheckBox = [];
function tgTD(_obj, _isSingleMatch, _goalID) {
    if (typeof checkboxClickable == "boolean" && !checkboxClickable) {
        $(_obj).attr("checked", false);
        return false;
    }
    if ($(_obj).attr("checked")) {
        if ($(_obj).attr('class') != "") {
            clickedCheckBox.push($(_obj).attr('class'));
        }
        if (_isSingleMatch) {
            $(_obj).parent().addClass("checkedOdds");
            $(_obj).parent().siblings(".delim").addClass("checkedOdds");
            $("#" + _goalID).parent().addClass("checkedOdds");
            $("#" + _goalID).parent().css("background-color", cellhighlightColor);
        }
        else {
            if ($(_obj).parent().hasClass("mlSubRow") || $(_obj).parent().hasClass("mlMainRow")) {
                $(_obj).parent().addClass("checkedOdds");
            } else {
                $(_obj).parent().parent().addClass("checkedOdds");
            }
        }
    }
    else {
        if ($(_obj).attr('class') != "") {
            clickedCheckBox = jQuery.grep(clickedCheckBox, function(value) {
                return value != $(_obj).attr('class');
            });
        }
        if (_isSingleMatch) {
            $(_obj).parent().removeClass("checkedOdds");
            $(_obj).parent().siblings(".delim").removeClass("checkedOdds");
            $("#" + _goalID).parent().removeClass("checkedOdds");
            $("#" + _goalID).parent().css("background-color", "");
        }
        else {
            if ($(_obj).parent().hasClass("mlSubRow") || $(_obj).parent().hasClass("mlMainRow")) {
                $(_obj).parent().removeClass("checkedOdds");
            } else {
                $(_obj).parent().parent().removeClass("checkedOdds");
            }
        }
    }
}

//toggle checked odds for handling CRS, FCS and FGS in IE9 on window Vista
function tgTDForVIE9(_obj, _isSingleMatch, _goalID) {
    if (typeof checkboxClickable == "boolean" && !checkboxClickable) {
        $(_obj).attr("checked", false);
        return false;
    }
    if ($(_obj).attr("checked")) {
        if (_isSingleMatch) {
            $(_obj).parent().parent().addClass("checkedOdds");
            $(_obj).parent().parent().siblings(".delim").addClass("checkedOdds");
            $("#" + _goalID).parent().addClass("checkedOdds");
            $("#" + _goalID).parent().css("background-color", cellhighlightColor);
        }
        else {
            $(_obj).parent().parent().parent().addClass("checkedOdds");
        }
    }
    else {
        if (_isSingleMatch) {
            $(_obj).parent().parent().removeClass("checkedOdds");
            $(_obj).parent().parent().siblings(".delim").removeClass("checkedOdds");
            $("#" + _goalID).parent().removeClass("checkedOdds");
            $("#" + _goalID).parent().css("background-color", "");
        }
        else {
            $(_obj).parent().parent().parent().removeClass("checkedOdds");
        }
    }
}

//toggle checked odds in tournament
function tgTTD(_obj, _teamID) {
    if (typeof checkboxClickable == "boolean" && !checkboxClickable) {
        $(_obj).attr("checked", false);
        return false;
    }
    if ($(_obj).attr("checked")) {
        $("#" + _teamID).parent().parent().css("background-color", cellhighlightColor);
        $(_obj).parent().parent().addClass("checkedOdds");
    }
    else {

        $("#" + _teamID).parent().parent().removeClass("checkedOdds");
        $("#" + _teamID).parent().parent().css("background-color", "");
        $(_obj).parent().parent().removeClass("checkedOdds");
    }
}

//get js text
function GetGlobalResources(_key, _type) {
    try {
        var type = "js";
        if (_type != null && _type != "" && _type != undefined) {
            type = _type;
        }
        var text = eval(type + _key);
        if (text == "" || text == undefined || text == null) {
            return _key;
        }
        return text;
    }
    catch (e) {
        return _key;
    }
}

//go back to index
function gotoIndex() {
    location.href = "/football/index.aspx?lang=" + jsLang;
}

//assign class for alternate rows in mix all and tournament
function assignAltClasses(_pagename) {
    //assign class
    if (_pagename == "MIXALLUP") {
        $(".tblMix tr:even").addClass("rAlt0");
        $(".tblMix tr:odd").addClass("rAlt1");
        //append dummy cells if it's an odd number
        //        $(".tblMix tr:even").each(function() {
        //            if ($(this).children("td").length < 10) {
        //                $(this).append("<td colspan='5'></td>");
        //            }
        //        });
        $(".tblMix tr").each(function() {
            if ($(this).children("td").length < 10) {
                $(this).append("<td colspan='5'></td>");
            }
        });
    }
    else if (_pagename == "TOURN") {
        //chp
        $(".tblCHP").each(function() {
            $(this).find("tr:odd").addClass("rAlt1");
            $(this).find("tr:even").addClass("rAlt0");

            var teamscount = $(this).find(".cteams").length;
            var cteamsExtra = teamscount <= 2 ? " c2teams" : "";

            $(this).find(".cteams").attr("class", "cteams cteams1" + cteamsExtra);
            $(this).find("td:nth-child(2)").attr("class", "cteams cteams0" + cteamsExtra);
            var $lastrowObj = $(this).find("tr:last");
            var $firstItem = $lastrowObj.find("td:nth-child(2)");
            if ($firstItem.hasClass("cteams1")) {
                $firstItem.removeClass("cteam1");
                $firstItem.addClass("cteams0");
            }

            if (teamscount > 2) {
                //append dummy cells if it's not complete
                if ($lastrowObj.find(".tourn_dummy").length == 0 && $lastrowObj.find("td").length < 12) {
                    var colspanCounter = 12 - $lastrowObj.find("td").length;
                    if ($(this).find("tr").length > 1) {// amend 110607
                        $lastrowObj.append("<td class='tourn_dummy' colspan='" + (colspanCounter) + "'></td>");
                    }
                    else {
                        $lastrowObj.append("<td class='tourn_dummy'></td>");
                    }
                    if (teamscount == 2) {
                        $lastrowObj.children(".tourn_dummy").width("50%");
                    }
                    else if (teamscount < 4) {
                        $lastrowObj.children(".tourn_dummy").width(colspanCounter * 61); //  78   modified by kevin
                    }
                }
            } else if (teamscount == 1) {
                $lastrowObj.append("<td class='tourn_dummy' width='50%'></td>");
            }
        });

        //hide empty groups for GPW       
        $(".tblGPW td").each(function() {
            if ($(this).html() == "-") {
                $(this).hide();
            }
        });
        var gpwgroupCnt = parseInt($("#hgpwgrpcnt").val());
        var gpwOddsGroupCnt = $(".tblGPW .cmid").length / 2;
        if (gpwOddsGroupCnt < gpwgroupCnt) {
            gpwgroupCnt = gpwOddsGroupCnt;
        }
        if (gpwgroupCnt > 0 && gpwgroupCnt < 4) {
            var newwidth = 156 * gpwgroupCnt;
            $(".tblGPW").width(newwidth);
            $(".oddsGPW").css("text-align", "left");
        }
        //hide div if no options
        if (gpwgroupCnt == 0) {
            $(".oddsGPWHeader").hide();
        }

        //fix gpf width if it has more than 4 teams
        // fix has been moved to server side
        /*
        $(".tblGPF").each(function() {
        var gpfteamCnt = $(this).find(".ncodds").length;
        $(this).find(".rhead .cteams").width(480 / gpfteamCnt);
        });
        */

        $(".tblGPF").each(function() {
            $(this).css("table-layout", "fixed");

            var rHeaderCount = $(this).find(".cRightBorder").length;

            if (rHeaderCount > 0) {
                var blkCount = $(this).find(".cRightBorder .blk1").length;

                if (blkCount > 0) {

                    if (typeof (document.documentMode) != 'undefined') {
                        var dMode = document.documentMode;

                        var imageUrl = $(this).find(".cRightBorder").css("background-image");
                        var imageUrlPattern = /url\((.*)\)/g;

                        var urlResult = imageUrlPattern.exec(imageUrl);

                        if (urlResult) {
                            imageUrl = urlResult[1];
                        } else {
                            imageUrl = "";
                        }

                        if (dMode <= 8) {
                            $(this).find(".gpf12.cRightBorder").css("position", "relative");
                            $(this).find(".gpf12.cRightBorder").css(
								"filter",
								"progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + imageUrl + ", sizingMethod='scale');");
                        }
                    }

                    // var headerWidth = $(this).find(".cRightBorder .blk1").width();
                    // $(this).find(".cRightBorder .blk1").css("left", (headerWidth - 50) + "px");

                    var winnerWording = $(this).find(".cRightBorder .blk1");
                    winnerWording.css("left", "0px");
                    winnerWording.css("text-align", "right");
                    winnerWording.css("padding-right", "5px");

                    var runnerupWording = $(this).find(".cRightBorder .blk2");
                    runnerupWording.css("top", "8px");
                    runnerupWording.css("left", "0px");
                    runnerupWording.css("padding-left", "2px")
                }
            }
        });

        //add alternate row color for GPW
        $(".tblGPW tr.tournrows:even").addClass("rAlt0");
        $(".tblGPW tr.tournrows:odd").addClass("rAlt1");
        //add alternate row color for ADTP
        $(".tblADTP tr.tournrows:even").addClass("rAlt0");
        $(".tblADTP tr.tournrows:odd").addClass("rAlt1");
        //add alternate row color for TOFP
        $(".tblTOFPTeam tr:odd").addClass("rAlt0");
        $(".tblTOFPTeam tr:even").addClass("rAlt1");
        $(".tblTOFPOdds tr:odd").addClass("rAlt0");
        $(".tblTOFPOdds tr:even").addClass("rAlt1");


        $(".tblTPS").each(function() {
            //add alternate row color for TPS
            $(this).find("tr:even").addClass("rAlt0");
            $(this).find("tr:odd").addClass("rAlt1");


            var teamscount = $(this).find(".cteams").length;
            $(this).find("tr:last").each(function() {
                //remove extra left border of last row
                var $firstItem = $(this).children("td:nth-child(2)");

                if ($firstItem.hasClass("cteams1")) {
                    $firstItem.removeClass("cteam1");
                    $firstItem.addClass("cteams0");

                }
                //append dummy cells if it's an odd number

                if ($(this).find(".tourn_dummy").length == 0 && $(this).children("td").length < 12) {
                    var colspanCounter = 12 - $(this).children("td").length;
                    $(this).append("<td class='tourn_dummy' colspan='" + (colspanCounter) + "'></td>");
                    if (teamscount < 4) {
                        $(this).children(".tourn_dummy").width(78 * colspanCounter);
                    }
                }
            });
        });

        //hide SPC header if no content
        if ($(".tblSPC").length == 0) {
            $(".oddsSPCHeader").hide();
        }
    }
}

//create by jack
function toggleRow(obj) {
    var img = $(obj).find("img").eq(0);
    var imgSrc = $(img).attr("src");
    var isHidden = imgSrc.indexOf("close") != -1 ? false : true;
    if (isHidden) {
        $(obj).siblings().each(function() {
            $(this).show();
        });
        $(img).attr("src", imgSrc.replace("open", "close"));
    } else {
        $(obj).siblings().each(function() {
            $(this).hide();
        });
        $(img).attr("src", imgSrc.replace("close", "open"));
    }
}
function stop(id, event) {
    if ($("#" + id).css("display") != "none") {
        cancelPropagation(event);
    }
}
function removeApos(team, f) {
    return team;
}
//toggle checked odds
function toggleCheckBox(obj, betType) {
    if ($(obj).attr("checked")) {
        $(obj).parent().addClass("checkedOdds");
        if (betType == "DHCP") {
            $(obj).parent().prev().addClass("checkedOdds");

            if ($(obj).val() == "F") {
                $("input[type=checkbox][name=" + $(obj).attr("name") + "]:checked").each(function() {
                    if ($(this).val() != "F") {
                        $(this).attr("checked", false);
                        $(this).parent().removeClass("checkedOdds");
                        $(this).parent().prev().removeClass("checkedOdds");
                    }
                });
                $(obj).parent().siblings().each(function() {
                    $(this).addClass("checkedOdds");
                });
            }
            else {
                $("input[type=checkbox][name=" + $(obj).attr("name") + "]:checked").each(function() {
                    if ($(this).val() == "F") {
                        $(this).attr("checked", false);
                        $(this).parent().removeClass("checkedOdds");
                        $(this).parent().siblings().each(function() {
                            $(this).removeClass("checkedOdds");
                        });
                    }
                });
            }
        }
    } else {
        $(obj).parent().removeClass("checkedOdds");
        if (betType == "DHCP") {
            if ($(obj).val() == "F") {
                $(obj).parent().prevAll().removeClass("checkedOdds");
                $(obj).parent().nextAll().removeClass("checkedOdds");
            } else {
                $(obj).parent().prev().removeClass("checkedOdds");
            }
        }
    }
}

//format div cal parameters js

function hexnib(d) {
    if (d < 10) return d; else return String.fromCharCode(65 + d - 10);
}

function hexbyte(d) {
    return "%" + hexnib((d & 240) >> 4) + "" + hexnib(d & 15);
}

function hexcode(url) {
    var result = "";
    var hex = "";
    for (var i = 0; i < url.length; i++) {
        var cc = url.charCodeAt(i);
        if (cc < 128) {
            result += hexbyte(cc);
        } else if ((cc > 127) && (cc < 2048)) {
            result += hexbyte((cc >> 6) | 192)
                       + hexbyte((cc & 63) | 128);
        } else {
            result += hexbyte((cc >> 12) | 224)
                       + hexbyte(((cc >> 6) & 63) | 128)
                       + hexbyte((cc & 63) | 128);
        }
    }
    return result;
}

var hex = ["%00", "%01", "%02", "%03", "%04", "%05", "%06", "%07",
   "%08", "%09", "%0a", "%0b", "%0c", "%0d", "%0e", "%0f",
   "%10", "%11", "%12", "%13", "%14", "%15", "%16", "%17",
   "%18", "%19", "%1a", "%1b", "%1c", "%1d", "%1e", "%1f",
   "%20", "%21", "%22", "%23", "%24", "%25", "%26", "%27",
   "%28", "%29", "%2a", "%2b", "%2c", "%2d", "%2e", "%2f",
   "%30", "%31", "%32", "%33", "%34", "%35", "%36", "%37",
   "%38", "%39", "%3a", "%3b", "%3c", "%3d", "%3e", "%3f",
   "%40", "%41", "%42", "%43", "%44", "%45", "%46", "%47",
   "%48", "%49", "%4a", "%4b", "%4c", "%4d", "%4e", "%4f",
   "%50", "%51", "%52", "%53", "%54", "%55", "%56", "%57",
   "%58", "%59", "%5a", "%5b", "%5c", "%5d", "%5e", "%5f",
   "%60", "%61", "%62", "%63", "%64", "%65", "%66", "%67",
   "%68", "%69", "%6a", "%6b", "%6c", "%6d", "%6e", "%6f",
   "%70", "%71", "%72", "%73", "%74", "%75", "%76", "%77",
   "%78", "%79", "%7a", "%7b", "%7c", "%7d", "%7e", "%7f",
   "%80", "%81", "%82", "%83", "%84", "%85", "%86", "%87",
   "%88", "%89", "%8a", "%8b", "%8c", "%8d", "%8e", "%8f",
   "%90", "%91", "%92", "%93", "%94", "%95", "%96", "%97",
   "%98", "%99", "%9a", "%9b", "%9c", "%9d", "%9e", "%9f",
   "%a0", "%a1", "%a2", "%a3", "%a4", "%a5", "%a6", "%a7",
   "%a8", "%a9", "%aa", "%ab", "%ac", "%ad", "%ae", "%af",
   "%b0", "%b1", "%b2", "%b3", "%b4", "%b5", "%b6", "%b7",
   "%b8", "%b9", "%ba", "%bb", "%bc", "%bd", "%be", "%bf",
   "%c0", "%c1", "%c2", "%c3", "%c4", "%c5", "%c6", "%c7",
   "%c8", "%c9", "%ca", "%cb", "%cc", "%cd", "%ce", "%cf",
   "%d0", "%d1", "%d2", "%d3", "%d4", "%d5", "%d6", "%d7",
   "%d8", "%d9", "%da", "%db", "%dc", "%dd", "%de", "%df",
   "%e0", "%e1", "%e2", "%e3", "%e4", "%e5", "%e6", "%e7",
   "%e8", "%e9", "%ea", "%eb", "%ec", "%ed", "%ee", "%ef",
   "%f0", "%f1", "%f2", "%f3", "%f4", "%f5", "%f6", "%f7",
   "%f8", "%f9", "%fa", "%fb", "%fc", "%fd", "%fe", "%ff"];

function getChar(chr) {
    for (var i = 0; i < hex.length; i++) {
        if (unescape(hex[i]) == chr)
            return hex[i];
    }
    return chr;
}
function convert(str) {
    str = str.split("");
    var newstr = [];
    for (var i = 0; i < str.length; i++) {
        newstr[i] = getChar(str[i]);
    }
    return newstr.join("");
}

function removeDivCalApos(tstr, ctype) {
    if (ctype == 'b') {
        while (tstr.indexOf("&#39;") >= 0) {
            tstr = tstr.replace("&#39;", "'");
        }
    } else {
        while (tstr.indexOf("&#39;") >= 0) {
            tstr = tstr.replace("&#39;", "\'");
        }
        while (tstr.indexOf(",") >= 0) {
            tstr = tstr.replace(",", " ");
        }
    }
    return tstr;

}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

function removeLeadingZero(instr) {
    return instr.replace(/^[0]+/g, "");
}

function toggleImage(obj) {
    var imgSrc = $(obj).attr("src");
    if (imgSrc.indexOf("on.") == -1) {
        $(obj).attr("src", imgSrc.replace(".", "_on."));
    } else {
        $(obj).attr("src", imgSrc.replace("_on.", "."));
    }
}

function mobileToggleImage(obj) {
    if (!isMobile()) {
        var imgSrc = $(obj).attr("src");
        if (imgSrc.indexOf("on.") == -1) {
            $(obj).attr("src", imgSrc.replace(".", "_on."));
        } else {
            $(obj).attr("src", imgSrc.replace("_on.", "."));
        }
    }
}

function scroll() {
    var obj = $("#btn_search");
    var docH = $(window).height();
    var top = $(obj).offset().top;
    var to = top - docH + $(obj).outerHeight() + 200;
    //$(window).scrollTop(to);

    window.scrollTo(0, to);
}

function SearchEvent(obj, url, FromDate, ToDate) {
    var para = "srchtype=";
    var srchtype;
    $("#" + obj).find("input[type=radio]").each(function() {
        if ($(this).attr("checked") == true) {
            srchtype = $(this).attr("value");
        }
    })
    if (srchtype != null)
        para += srchtype + "&fdate=" + FromDate + "&tdate=" + ToDate;

    if (url.indexOf("?") != -1) {
        url += "&" + para;
    }
    else {
        url += "?" + para;
    }
    window.location = url;
}

function SelChecked(obj) {
    $("#" + obj).find("input[type=radio]").each(function() {
        if ($(this).attr("value") == "2") {
            $(this).attr("checked", true);
        }
    })
}

function checkIsInt(val) {
    var reg = /\d+/;
    if (reg.test(val)) {
        return true;
    }
    return false;
}

function chkDate(year, month, day) {
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        return false;
    }
    if (month == 2) {
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            return false;
        }
    }
    return true;
}

function getDefaultAmount(type) {
    try {
        var amt = top.betSlipFrame.getUnitBetAmount(type)
        if (amt == "" || amt == 'undefined' || isNaN(amt))
            return "10";
        else
            return amt;
    } catch (e) {
        return "10";
    }
}

function NewNormalWindow(mypage, myname, w, h, scroll, resizable) {
    var winl = (screen.width - w) / 2;
    var wint = (screen.height - h) / 2;
    winprops = 'height=' + h + ',width=' + w + ',top=0,left=0,scrollbars=' + scroll + ',resizable=' + resizable + ',toolbar=yes,location=yes'
    win = window.open(mypage, myname, winprops)
    win.self.focus()
}

/***************************** for tournament CHP,TPS,GPW handle selling only. start ****************************************/

function handleSellingDisplay(handleId, tabObj) {
    if ($("#" + tabObj).find("input[type='checkbox']").length == 0) {
        $("#" + handleId).hide();
    }
}

var chpTableAllContent = new Array(), tpsTableAllContent = new Array(), gpwTableAllContent = new Array();
var tmpTorunOddsUpdate = new Array();

function replaceOddsTable(tabObj) {
    if (!$.isNullOrEmpty(tabObj)) {
        if (tabObj.indexOf("CHP") > -1) {
            for (var i = 0; i < chpTableAllContent.length; i++) {
                if (chpTableAllContent[i].id == tabObj) {
                    chpTableAllContent[i].content = $("#" + tabObj).find("tbody").html();
                }
            }
        }
        else if (tabObj.indexOf("TPS") > -1) {
            for (var i = 0; i < tpsTableAllContent.length; i++) {
                if (tpsTableAllContent[i].id == tabObj) {
                    tpsTableAllContent[i].content = $("#" + tabObj).find("tbody").html();
                }
            }
        }
    }
}

function saveTableAllContent(tabObj, tableArray) {
    var hasAdd = false;
    var foundTable;
    for (var i = 0; i < tableArray.length; i++) {
        if (tableArray[i].id == tabObj) {
            hasAdd = true;
            foundTable = tableArray[i];
        }
    }
    if (!hasAdd) {
        var obj = new Object();
        obj.id = tabObj;
        obj.content = $("#" + tabObj).find("tbody").html();
        tableArray.push(obj);
    } else {
        foundTable.content = $("#" + tabObj).find("tbody").html();
    }
}

function handleSelling(obj, tabObj) {
    //debugger;
    if ($("#" + tabObj).length == 0) {
        if ($.find("table[id^='" + tabObj + "']").length > 0) {
            tabObj = $.find("table[id^='" + tabObj + "']")[0].id;
        }
    }

    var isGPW = tabObj.indexOf("GPW") > -1;
    var isCHP = tabObj.indexOf("CHP") > -1;
    var isTPS = tabObj.indexOf("TPS") > -1;
    var isIpCHP = $('label[id$=CHP_INPLAY_plst]').length > 0;

    //if ($("#" + obj).val() == jsSellingOnly) {
    if ($("#" + obj).attr("src").indexOf("_sellonly") > -1) {
        //$("#" + obj).val(jsTournShowAll);
        $("#" + obj).attr("src", $("#" + obj).attr("src").replace("_sellonly", "_showall"));

        if (isCHP)
            saveTableAllContent(tabObj, chpTableAllContent);
        else if (isTPS)
            saveTableAllContent(tabObj, tpsTableAllContent);
        else if (isGPW)
            saveTableAllContent(tabObj, gpwTableAllContent);

        var handleCls = isIpCHP ? '.cLSE,.cRFD' : '.cLSE'; //hide RFD class also for CHP inplay
        var hasHandleCls = false;

        $("#" + tabObj).find("input" + handleCls + "[type='checkbox']").each(function() {
            hasHandleCls = true;
            var tmpId = $(this).attr("id").substr(0, $(this).attr("id").lastIndexOf("_"));
            $(this).parent().parent().hide();
            $("#s_" + tmpId).parent().parent().hide();
        });
        if (hasHandleCls) {
            var checkBoxStatus = getCheckedSelection(tabObj);
            if (isGPW)
                sortGpwTable(tabObj);
            else
                sortTable(tabObj);
            updateCheckBox(checkBoxStatus, tabObj);
        }
    }
    else {
        //$("#" + obj).val(jsSellingOnly);
        $("#" + obj).attr("src", $("#" + obj).attr("src").replace("_showall", "_sellonly"));
        var tableContents = new Array();
        if (isCHP)
            tableContents = chpTableAllContent;
        else if (isGPW)
            tableContents = gpwTableAllContent;
        else if (isTPS)
            tableContents = tpsTableAllContent;

        for (var i = 0; i < tableContents.length; i++) {
            if (tableContents[i].id == tabObj) {
                var currentOddsList = getCurrentOdds(tabObj);
                var checkBoxStatus = getCheckedSelection(tabObj);
                $("#" + tabObj + " tbody").html(tableContents[i].content);
                updateOldOdds(tabObj, currentOddsList);
                updateCheckBox(checkBoxStatus, tabObj);
            }
        }
    }

    updateHandleSellingHeader(tabObj);
    //assignAltClasses("TOURN");
}

function updateHandleSellingHeader(objId) {
    var isCHP = objId.indexOf("CHP") > -1;
    if (isCHP) {
        var selTable = $("#" + objId);
        var show2Col = selTable.find("td[class*=cteams]").length <= 2;
        var header = selTable.prev().prev();
        if (show2Col) {
            header.find("td[class*=cteams]").each(function(index) {
                $(this).addClass(index < 2 ? "c2teams" : "c2teamsInv");
            });
            header.find("td[class*=codds]").each(function(index) {
                $(this).addClass(index < 2 ? "c2odds" : "c2oddsInv");
            });
        } else {
            header.find("td[class*=cteams]").removeClass("c2teams c2teamsInv");
            header.find("td[class*=codds]").removeClass("c2odds c2oddsInv");
        }
    }
}

function handleSellingForTps(objId) {
    //if ($("input[type='button'][id^='" + objId + "']").eq(0).val() == jsSellingOnly) {
    if ($("img[id^='" + objId + "']").length > 0) {
        if ($("img[id^='" + objId + "']").eq(0).attr("src").indexOf("_sellonly") > -1) {
            //$("input[type='button'][id^='" + objId + "']").val(jsTournShowAll);
            $("img[id^='" + objId + "']").attr("src", $("img[id^='" + objId + "']").eq(0).attr("src").replace("_sellonly", "_showall"));
            var tpsObj; // = new Object();
            $("table[id^='" + objId + "']").each(function() {
                tpsObj = new Object();
                tpsObj.id = $(this).attr("id");
                tpsObj.content = $(this).find("tbody").html()
                tpsTableAllContent.push(tpsObj);
                $(this).find("input[type='checkbox'][class='cLSE']").each(function() {
                    var tmpId = $(this).attr("id").substr(0, $(this).attr("id").lastIndexOf("_"));
                    $(this).parent().parent().hide();
                    $("#s_" + tmpId).parent().parent().hide();
                });
                if ($(this).find("input[type='checkbox'][class='cLSE']").length > 0) {
                    sortTable($(this).attr("id"));
                }
            });
        }
        else {
            //$("input[type='button'][id^='" + objId + "']").val(jsSellingOnly);
            $("img[id^='" + objId + "']").attr("src", $("img[id^='" + objId + "']").eq(0).attr("src").replace("_showall", "_sellonly"));
            $("table[id^='" + objId + "']").each(function() {
                for (var i = 0; i < tpsTableAllContent.length; i++) {
                    if (tpsTableAllContent[i].id == $(this).attr("id")) {
                        var currentOddsList = getCurrentOdds($(this).attr("id"));
                        $(this).find("tbody").html(tpsTableAllContent[i].content);
                        updateOldOdds(currentOddsList);
                    }
                }
            });
        }
    }
    //formatStyle(objId);
    //assignAltClasses("TOURN");
}

function sortGpwTable(tabId) {
    var itemPerRow = 4;
    var tabObj = $("#" + tabId);
    var tournRows = $("#" + tabId).find("tr[class*='tournrows0']");

    for (var rowNo = 0; tournRows.length > 0; tournRows = tabObj.find("tr[class*='tournrows" + (++rowNo) + "']")) {
        var sortedTdsArray = new Array();

        //move the LSE <td>s to the bottom and append an spaced <td>\
        for (var itemNo = 0; itemNo < itemPerRow; itemNo++) {
            var tdsArray = new Array();
            var hiddenTdsArray = new Array();
            tournRows.each(function() {
                var gpwObj = new Object();
                var oddObj = $(this).find("td[class*='codds" + +itemNo + "']");

                gpwObj.team = $(this).find("td[class*='cteams" + itemNo + "']").clone().wrap('<p>').parent().html();
                gpwObj.odds = oddObj.clone().wrap('<p>').parent().html();

                if (oddObj.find("input[type='checkbox'][class='cLSE']").length > 0) {
                    gpwObj.team += "<td style=\"height:0px;background-color:#fff;\" colspan=\"2\" class=\"cteams" + itemNo + "\"></td>";
                    hiddenTdsArray.push(gpwObj);
                }
                else
                    tdsArray.push(gpwObj);
            });
            sortedTdsArray.push(tdsArray.concat(hiddenTdsArray));
        }

        //update the <tr>
        tournRows.each(function(trIdx) {
            var innerHTML = "";
            $.each(sortedTdsArray, function(tdIdx, tdItem) {
                innerHTML += nullToEmptyStr(tdItem[trIdx].team) + nullToEmptyStr(tdItem[trIdx].odds);
            });
            $(this).html(innerHTML);
        });
    }
}

function nullToEmptyStr(obj) {
    if (obj == null) return "";
    return obj;
}

function sortTable(tabId) {
    var tabArray = new Array();
    $("#" + tabId).find("tbody tr").each(function() {
        var tmpTeamArray = new Array();
        var tmpOddsArray = new Array();
        var rowArray = new Array();
        $(this).find("td[class^='cteams']").each(function() {
            tmpTeamArray[tmpTeamArray.length] = $(this);
        });
        $(this).find("td[class^='codds']").each(function() {
            tmpOddsArray[tmpOddsArray.length] = $(this);
        });

        for (var i = 0; i < tmpTeamArray.length; i++) {
            var item = { team: tmpTeamArray[i], odds: tmpOddsArray[i] };
            rowArray[rowArray.length] = item;
        }
        tabArray[tabArray.length] = rowArray;
    });

    var listArray = new Array();
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < tabArray.length; i++) {
            if (tabArray[i][j] && tabArray[i][j].team.css("display") != "none") {
                listArray[listArray.length] = tabArray[i][j];
            }
        }
    }
    var noBeenAdd = "";
    var tabString = "";
    var endRow = "";
    var tmpAboveRowArray = new Array();
    var tmpEndRowArray = new Array();
    var res1 = listArray.length % 4;
    var nowCountRow = parseInt(listArray.length / 4); //2
    var tmpCount = nowCountRow;

    //special handle for <= 2 CHP items
    var isCHP = tabId.indexOf("CHP") > -1;
    var cteamsExtra = listArray.length <= 2 && isCHP ? " c2teams" : "";
    var coddsExtra = listArray.length <= 2 && isCHP ? " c2odds" : "";

    if (res1 > 0) {
        tmpCount++;
        for (var index = 0; index < listArray.length; index++) {
            if ((index + 1) % tmpCount == 0) {
                if (tmpEndRowArray.length < res1) {
                    tmpEndRowArray.push(listArray[index]);
                }
                else {
                    tmpAboveRowArray.push(listArray[index]);
                }
            }
            else {
                tmpAboveRowArray.push(listArray[index]);
            }
        }
        endRow += "<tr class='rAlt" + nowCountRow % 2 + "'>";
        for (var i = 0; i < tmpEndRowArray.length; i++) {
            endRow += "<td> </td>" + "<td class='cteams cteams" + i + cteamsExtra + "'>" + tmpEndRowArray[i].team.html() + "</td>";
            endRow += "<td class='codds" + coddsExtra + "'>" + tmpEndRowArray[i].odds.html() + "</td>";
        }
        endRow += "</tr>";
    }
    else {
        tmpAboveRowArray = listArray;
    }

    for (var i = 0; i < nowCountRow; i++) {
        tabString += "<tr class='rAlt" + i % 2 + "'>";
        for (var j = 0; j < 4; j++) {
            if (j * nowCountRow + i < tmpAboveRowArray.length) {
                tabString += "<td> </td>" + "<td class='cteams cteams" + j + cteamsExtra + "'>" + tmpAboveRowArray[j * nowCountRow + i].team.html() + "</td>";
                tabString += "<td class='codds" + coddsExtra + "'>" + tmpAboveRowArray[j * nowCountRow + i].odds.html() + "</td>";
            }
        }
        tabString += "</tr>";
    }
    $("#" + tabId + " tbody").html(tabString + endRow);
}

function getTournPoolId(tabId) {
    var ids = [];
    $("#" + tabId + " .oddsLink").each(function() {
        if ($(this) != null && $(this).attr("id") != null) {
            var id = $(this).attr("id").split('_')[2];
            if ($.inArray(id, ids) == -1)
                ids.push(id);
        }
    });

    return ids;
}

function getCurrentOdds(tabId) {
    var oddsList = new Array();
    $("#" + tabId + " .oddsLink").each(function() {
        var oddsObj = { id: $(this).attr("id"), odds: $(this).html() };
        oddsList.push(oddsObj);
    });
    return oddsList;
}

function getCheckedSelection(tabId) {
    var checkList = new Array();
    $("#" + tabId + " input[type='checkbox']").each(function() {
        if ($(this).attr("checked")) {
            checkList.push($(this).attr("id"));
        }
    });
    return checkList;
}

function updateOldOdds(tabId, oddsList) {
    var tournPoolIds = getTournPoolId(tabId);
    $.each(tournPoolIds, function(idx, val) {
        var arg = tmpTorunOddsUpdate[val];
        if (arg != null) {
            updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, true);
            if ($(arg.tPrefix_IPCHP + "_plst").length > 0) { // the object exists leng > 0
                updateOddsSetIPCHP(arg.oddsSet, arg.newOdds, arg.isSell);

                //update pool status in inplay all odds page
                updatePoolStatus($(arg.tPrefix_IPCHP + "_plst"), arg.poolStatus);
            }
        }
        else {
            for (var i = 0; i < oddsList.length; i++) {
                $("#" + oddsList[i].id).html(oddsList[i].odds);
            }
        }
    });

}

function updateCheckBox(checkBoxList, tabId) {
    //remove checked status first
    $("#" + tabId + " input[type='checkbox']").each(function() {
        $(this).attr("checked", false);
        $(this).parent().parent().removeClass("checkedOdds");
        if ($(this).parent().parent().is(':visible'))
            $(this).parent().parent().prev("td").css("background-color", "");
    });
    //update checked status
    for (var j = 0; j < checkBoxList.length; j++) {
        //$("#" + checkBoxList[j]).click();
        $("#" + checkBoxList[j]).attr("checked", true);
        $("#" + checkBoxList[j]).parent().parent().addClass("checkedOdds");
        $("#" + checkBoxList[j]).parent().parent().prev("td").css("background-color", "rgb(255, 244, 176)");
    }
}

function tgCoupon3(_obj, _couIdx, btnObj, tabObj, prev) {
    var isHidden = $(_obj).hasClass("spBtnPlus");
    if (prev) {
        isHidden = true;
    }
    var curBtnObj;
    //    if ($(_obj).next("span").find("input[type='button']").length > 0) {
    //        curBtnObj = $(_obj).next("span").find("input[type='button']");
    //    } else {
    //        curBtnObj = $(_obj).next("span").next("span").find("input[type='button']");
    //    }
    if ($(_obj).next("span").find("img[id*='handleBtn']").length > 0) {
        curBtnObj = $(_obj).next("span").find("img[id*='handleBtn']");
    } else {
        curBtnObj = $(_obj).next("span").next("span").find("img[id*='handleBtn']");
    }
    if (isHidden && curBtnObj.attr("src").indexOf("_sellonly") > -1) {
        var btnId = curBtnObj.attr("id");
        var tableId = $("table[id^='" + btnId.substr(0, btnId.lastIndexOf("_")) + "']").attr("id");
        handleSelling(btnId, tableId);
        assignAltClasses("TOURN");
    }
    tgCoupon($(_obj).parent(), _couIdx);
}

function replaceEliminated(obj) {
    $("#" + obj).find("span [class^='oddsLink']").each(function() {
        if ($(this).hasClass("cLSE")) {
            $(this).html("---");
        }
    })
}

function imgOnOff(img, action) {
    if (action == "on") {
        $(img).attr("src", $(img).attr("src").replace("_off", "_on"));
    }
    else if (action == "off") {
        $(img).attr("src", $(img).attr("src").replace("_on", "_off"));
    }
}

function mobileImgOnOff(img, action) {
    if (!isMobile()) {
        if (action == "on") {
            $(img).attr("src", $(img).attr("src").replace("_off", "_on"));
        }
        else if (action == "off") {
            $(img).attr("src", $(img).attr("src").replace("_on", "_off"));
        }
    }
}
/***************************** for tournament CHP,TPS,GPW handle selling only. end ****************************************/

var AMS = {
    connect: function() {
        top.status = "push";
        var engine_frame = top.document.getElementById('div_engine');
        if (engine_frame != null && engine_frame.innerHTML == "") {
            engine_frame.innerHTML = "<iframe src=\"engine_container.html\" id=\"push_engine\" style=\"display:none\" /></iframe>";
        }
    },
    disconnect: function() {
        var engine_frame = top.document.getElementById('div_engine');
        if (engine_frame != null && engine_frame.innerHTML != "") {
            if (top.document.getElementById('betSlipFrame')) {
                top.document.getElementById('betSlipFrame').contentWindow.CloseLogoutPopup();
            }
            top.status = "poll";
            //engine_frame.innerHTML = "";
            //window.location.href = window.location.href;
            if (engineRef) {
                engineRef.changeStatus("DISCONNECTED");
            }
        }
    }
}

//check odds status whether it's disabled
function isDisabled(_status) {
    isSelling = _status.charAt(0);
    isIrrational = _status.charAt(2);
    return (isSelling == "0" || isIrrational == "1");
}

var tournidMapping = new Array();
var tournNumMapping = new Array();
function tournIdMapping(tournStr) {
    var tmpArr1 = tournStr.split(';');
    for (var i = 1; i < tmpArr1.length; i++) {
        var tmpArr2 = tmpArr1[i].split('#');
        var tmpPoolIds = tmpArr2[0].split(',');
        var tmpTournIdNum = tmpArr2[1].split('_');
        for (var j = 1; j < tmpPoolIds.length; j++) {
            tournidMapping[tmpPoolIds[j]] = tmpTournIdNum[0];
            tournNumMapping[tmpPoolIds[j]] = tmpTournIdNum[1];
        }
    }
}

function sortInplayPool(poolListStr, defaultOrderStr) {
    var sortedPool = new Array();
    try {
        var poolList = poolListStr.toUpperCase().split(',');
    } catch (e) {
        return;
    }

    if (defaultOrderStr) {
        var defaultOrders = defaultOrderStr.toUpperCase().split(',');

        //move chp to last pos, if chp exists
        var chpPos = $.inArray("CHP", defaultOrders);
        if (chpPos > -1) {
            defaultOrders.splice(chpPos, 1);
            defaultOrders.push("CHP");
        }

        $.each(defaultOrders, function(idx, val) {
            if ($.inArray(val, poolList) > -1)
                sortedPool.push(val);
        });
    }

    return sortedPool.join(",");
}