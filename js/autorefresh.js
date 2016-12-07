var oddsUpStr = " <span class=\"oddsUp\"></span>";
var oddsDownStr = " <span class=\"oddsDown\"></span>";
//auto refresh all
var autorefreshcounter = 0;

function autoRefreshAll(_interval, _inplayInterval, _pagename) {
    var intervaltime = 5000;

    var isIndexPage = (_pagename == "INDEX");
    var isMixAllUpPage = (_pagename == "MIXALLUP" || _pagename == "MIXALLUPSHORTCUT");
    var isInplay = (_pagename.indexOf("INPLAY") > -1);
    var isHalfTime = (_pagename.indexOf("HALFTIME") > -1);
    var isSchedule = (_pagename.indexOf("SCHEDULE") > -1);
    if (isInplay || isHalfTime) {
        if (!$.isNullOrEmpty(_inplayInterval)) {
            intervaltime = _inplayInterval * 1000;
        }
    }
    else {
        if (!$.isNullOrEmpty(_interval)) {
            intervaltime = _interval * 1000;
        }
    }

    if (!isIndexPage && !isSchedule) {
        //refresh recursively
        if (isLoginBetSlip() || enableAutoRefresh) {
            if ($(".hAutoRefreshScript").length > 0) {
                $(document).everyTime(intervaltime, 'autorefresh', function() {
                    $(".hAutoRefreshScript").each(function() {
                        eval($(this).val());
                    });
                }, 0);
            }
        }
    }
}

function autoRefresh(_oddsType, _matchID, _isLiveBetting, _isHalfTime, _isTourn, _tournID, _pageName) {
    if (oddsRefreshType != "pull")
        return;

    oddType_Page = _pageName;
    startday = new Date();
    clockStart = startday.getTime();

    var oddsType = _oddsType;

    if (_oddsType == "inplayall") {
        oddsType = "all";
    }
    var xmlurl = "/football/getXML.aspx?pooltype=" + oddsType + "&isLiveBetting=" + _isLiveBetting;
    if (oddsType == "all" || oddsType == "scall" || oddsType == "CRS" || oddsType == "FCS" || oddsType == "FGS" || oddsType == "HFMP" || oddsType == "DHCP") {
        xmlurl = "/football/getXML.aspx?match=" + _matchID + "&pooltype=" + oddsType + "&isLiveBetting=" + _isLiveBetting;
    }
    if (_isHalfTime) {
        xmlurl = "/football/getXML.aspx?pooltype=" + oddsType + "&isLiveHTBetting=true";
        if (oddsType == "all") {
            xmlurl = "/football/getXML.aspx?match=" + _matchID + "&pooltype=all&isLiveHTBetting=true";
        }
    }

    //tournament
    if (_isTourn) {
        if (oddsType == "all" || oddsType == "TOURN") {
            //all odds type for one tournament
            xmlurl = "/football/getXML.aspx?tourn=" + _tournID + "&pooltype=all&isLiveBetting=false";
        }
        else {
            //one odds type for all tournaments
            xmlurl = "/football/getXML.aspx?pooltype=" + oddsType + "&isLiveBetting=false&tourn=all";
        }
    }

    var _isInplaySPC = (oddsType.toLowerCase() == "spc") && _isLiveBetting;

    //add MSN for getxml
    xmlurl += "&MSN=" + MSN;

    //tmp. will always refresh
    if (oddsType == "DHCP" || oddsType == "HFMP") {
        MSN = "";
    }

    //check pool / match removed during auto refresh
    var checkDisabledMatch = true;

    if (oddsType == "SPC"
        || oddsType == "DHCP" || oddsType == "HFMP" || _isTourn) {
        checkDisabledMatch = false;
    }
    $.ajaxSetup({
        beforeSend: function(xhr) { xhr.setRequestHeader("Cache-Control", "no-cache"); }
    });

    $.ajax({
        type: "GET",
        url: xmlurl,
        dataType: "xml",
        async: true,
        success: function(xml) {
            //temp counter
            //cnt = 0;
            autorefreshcounter++;
            //sss = ssssss;
            var otype = oddsType.toUpperCase();
            var newMSN = ($(xml).children("SB_INFO").attr("NEW_MSN"));
            var isREFRESH_REQUIRED = ($(xml).children("SB_INFO").attr("IS_REFRESH_REQUIRED").toLowerCase() == "true");
            if (isREFRESH_REQUIRED) {
                //change flag (changed class)
                var msnflag = "msn_" + autorefreshcounter; //alert("in ajax " + xmlurl);

                //newMSN replaces old MSN
                MSN = newMSN;
                //$("#autorefreshPanel").html("MSN: " + MSN);

                //no need to refresh if no pools
                if ($(xml).find("POOL").length == 0) {
                    //return;
                    if (otype == "DHCP" || otype == "HFMP") {
                        $("input[type=checkbox]").each(function() {
                            $(this).attr("disabled", true);
                            if ($(this).attr("checked")) {
                                $(this).attr("checked", false);
                                $(this).parent().removeClass("checkedOdds");
                                $(this).parent().siblings().each(function() {
                                    $(this).removeClass("checkedOdds");
                                });
                            }
                        });
                    }
                }

                if (_isTourn) {
                    //alert($(xml).find("POOL").length);
                    var $poolObjs = $(xml).find("POOL");
                    $poolObjs.each(function() {
                        var currentArray = null;
                        var tPoolType = $(this).attr("TYPE");
                        var tournID = $(this).attr("TOURN_ID");
                        var tournNum = $(this).attr("TOURN_NUM");
                        currentArray = new Array();
                        currentArray["MSN_FLAG"] = msnflag;
                        currentArray["TOURN_ID"] = tournID;
                        currentArray["TOURN_NUM"] = tournNum;
                        currentArray["TYPE"] = tPoolType;
                        var tmpIPDelay = $(this).attr("IP_DELAY");
                        //alert("TOURN TYPE=" + tPoolType);
                        $(this).find("GROUP").each(function() {
                            //alert("TOURN TYPE=" + tPoolType + "\n GROUP TOURN_POOL_ID=" + $(this).attr("TOURN_POOL_ID"));
                            var startString = "T" + tournID + "_";
                            var countAttrs = $(this).context.attributes.length;
                            for (var i = 0; i < countAttrs; i++) {
                                var attrName = $(this).context.attributes[i].name;
                                switch (attrName) {
                                    case "TOURN_POOL_ID":
                                        var tmpTournPoolId = $(this).attr(attrName);
                                        currentArray["MATCH_ID"] = tmpTournPoolId;
                                        currentArray["IS_BETTING_DELAY_NEED"] = tmpIPDelay; // FOR CHP IPDELAY
                                        break;
                                    default:
                                        //currentArray[startString + attrName] = $(this).attr(attrName);
                                        currentArray[attrName] = $(this).attr(attrName);
                                        break;
                                }
                            }
                            auto(currentArray, oddType_Page); //alert(tPoolType + " Tourn:auto(currentArray)");
                        })
                    })
                }
                else {
                    //no need to do refresh if no matches
                    if ($(xml).find("MATCH").length == 0) {
                        //return
                        if (_isInplaySPC) {
                            $("tr[class^='rAlt'] a[class*='oddsLink'] span").text("---");
                            $("tr[class^='rAlt']").find("input[type='checkbox']").attr("disabled", true);
                            $("tr[class^='rAlt']").find("input[type='checkbox']").attr("checked", false);
                        }
                    }

                    $(xml).find("MATCH").each(function() {
                        var matchID = $(this).attr("ID");
                        //check which match is removed from autorefresh xml
                        //add flag to indicate if the match exists
                        if (oddsType != "all" && oddsType != "CRS" && oddsType != "FCS" && oddsType != "FGS") {
                            $("#rmid" + matchID).addClass(msnflag); //alert("#rmid" + matchID + ".addClass(" + msnflag + ")");
                        }
                        //test by  20100714 for IPSPC when remove pool
                        var $poolObjs = $(this).find("POOL");
                        if (_isInplaySPC) {
                            if ($poolObjs.length < $("tr[class^='rAlt']:has(input[id^='" + matchID + "_SPC'])").length) {
                                $("tr[class^='rAlt']:has(input[id^='" + matchID + "_SPC'])").each(function() {
                                    var pIN = $(this).find("input[type='checkbox']").eq(0).attr("ID").split("_")[3];
                                    var trHiden = true;
                                    $poolObjs.each(function() {
                                        if ($(this).attr("IN") == pIN) {
                                            trHiden = false;
                                        }
                                    })
                                    if (trHiden) {
                                        $(this).find("input[id^='" + matchID + "_SPC']").attr("disabled", true);
                                        $(this).find("input[id^='" + matchID + "_SPC']").attr("checked", false);
                                        $(this).find("span[id^='" + matchID + "_SPC']").text("---");
                                    }
                                })
                            }
                            $("tr[class^='rAlt']:has(input[id^='" + matchID + "_SPC'])").addClass(msnflag);
                            checkDisabledMatch = true;
                        }

                        var MATCH_ID = $(this).attr("ID");
                        var MATCH_STARTED = $(this).attr("MATCH_STARTED");
                        var STATUS = $(this).attr("STATUS");
                        var VOID = $(this).attr("VOID");
                        var HASRESULT = $(this).attr("HASRESULT");
                        var SCORE = $(this).attr("SCORE");
                        var NTS_ETS_DEFINED = $(this).attr("NTS_ETS_DEFINED");
                        var IS_BETTING_DELAY_NEED = $(this).attr("IS_BETTING_DELAY_NEED");
                        var IS_BETTING_DELAY_NEED_TQL = $(this).attr("IS_BETTING_DELAY_NEED_TQL");
                        var IS_BETTING_DELAY_NEED_SPC = $(this).attr("IS_BETTING_DELAY_NEED_SPC"); //add later
                        var MATCH_STAGE = $(this).attr("MATCH_STAGE");
                        var NINETY_MINS_SCORE = $(this).attr("NINETY_MINS_SCORE");
                        var NINETY_MINS_TOTAL_CORNER = $(this).attr("NINETY_MINS_TOTAL_CORNER");
                        var NTS_DIV = $(this).attr("NTS_DIV");
                        var IsItemStatus = $(this).attr("IsItemStatus");

                        var currentArray = new Array();
                        currentArray["MSN_FLAG"] = msnflag;
                        currentArray["MATCH_ID"] = MATCH_ID;
                        currentArray["MATCH_STARTED"] = MATCH_STARTED;
                        //                        currentArray["STATUS"] = STATUS;
                        //                        currentArray["VOID"] = VOID;
                        //                        currentArray["HASRESULT"] = HASRESULT;
                        currentArray["SCORE"] = SCORE;
                        currentArray["NTS_ETS_DEFINED"] = NTS_ETS_DEFINED;
                        currentArray["IS_BETTING_DELAY_NEED"] = IS_BETTING_DELAY_NEED;
                        currentArray["IS_BETTING_DELAY_NEED_TQL"] = IS_BETTING_DELAY_NEED_TQL;
                        currentArray["IS_BETTING_DELAY_NEED_SPC"] = IS_BETTING_DELAY_NEED_SPC; //add later
                        currentArray["MATCH_STAGE"] = MATCH_STAGE;
                        currentArray["NINETY_MINS_SCORE"] = NINETY_MINS_SCORE;
                        currentArray["NINETY_MINS_TOTAL_CORNER"] = NINETY_MINS_TOTAL_CORNER;
                        currentArray["NTS_DIV"] = NTS_DIV;
                        currentArray["IsItemStatus"] = IsItemStatus;
                        currentArray["IS_LIVEBETTING"] = _isLiveBetting.toString();
                        currentArray["SELL"] = false;
                        currentArray["INPLAY_POOLS"] = $(this).attr("INPLAY_POOLS");

                        $(this).find("POOL").each(function() {

                            if (!currentArray["SELL"] && parseBoolean($(this).attr("SELL"))) {
                                if (MATCH_STAGE.toLowerCase() == "penaltyshootout" || MATCH_STAGE.toLowerCase() == "extratime" || $(this).attr("TYPE") == "HAD") {
                                    currentArray["SELL"] = parseBoolean($(this).attr("SELL"));
                                }
                            }
                            // add 20101029, for jack's auto function

                            //check which match is removed from autorefresh xml
                            //add flag to indicate if the match exists
                            if (_pageName == "MIXALLUP" || _pageName == "MIXALLUPSHORTCUT") {
                                var rmIDPoolType = $(this).attr("TYPE");
                                if ($(this).attr("TYPE") == "FCS")
                                    rmIDPoolType = "CRS";

                                $("#dMix_" + MATCH_ID + "_" + $(this).attr("TYPE") + " tr[class*='rmid" + rmIDPoolType + "']").addClass(msnflag); //dMix_12156_FGS tr[class*='rmidFGS']
                                //alert(MATCH_ID + "_" + $(this).attr("TYPE") + $("#dMix_" + MATCH_ID + "_" + $(this).attr("TYPE") + " tr[class*='rmid" + $(this).attr("TYPE") + "']").size());
                            }
                            else {
                                if (oddsType == "all" || oddsType == "CRS" || oddsType == "FCS" || oddsType == "FGS") {
                                    if ($(this).attr("TYPE") == "ETS") {
                                        $(".rmidNTS").addClass(msnflag);
                                        //alert(".rmidNTS .addClass(" + msnflag + ")");
                                    }
                                    else if ($(this).attr("TYPE") == "SPC") {// for SPC pool will not be disabled
                                        $(".oddsSPC" + MATCH_ID + " tr[class^='rAlt']").addClass(msnflag);
                                    }
                                    else if ($(this).attr("TYPE") == "FCS") {
                                        $(".rmidCRS").addClass(msnflag);
                                    }
                                    else {
                                        $(".rmid" + $(this).attr("TYPE")).addClass(msnflag);
                                        //alert(MATCH_ID + ".rmid" + $(this).attr("TYPE") + ".addClass(" + msnflag + ")");
                                    }
                                }
                            }
                            //currentArray["IN"] = $(this).attr("IN"); //
                            var startString = $(this).attr("TYPE") + "_" + $(this).attr("IN") + "_";

                            if ($(this).attr("TYPE") != "DHCP" && $(this).attr("TYPE") != "HFMP") {
                                var countAttrs = $(this).context.attributes.length;
                                for (var i = 0; i < countAttrs; i++) {
                                    var attrName = $(this).context.attributes[i].name;
                                    if ($(this).attr("TYPE") == "SPC") {
                                        currentArray[startString + attrName] = $(this).attr(attrName);
                                    } else {
                                        currentArray[$(this).attr("TYPE") + "_" + attrName] = $(this).attr(attrName);
                                    }
                                }
                            } else {
                                currentArray["LEG_" + MATCH_ID + "_" + "MATCH_ID"] = MATCH_ID;
                                currentArray["LEG_" + MATCH_ID + "_" + "STATUS"] = STATUS;
                                currentArray["LEG_" + MATCH_ID + "_" + "VOID"] = VOID;
                                currentArray["LEG_" + MATCH_ID + "_" + "HASRESULT"] = HASRESULT;
                                var currentOType = $(this).attr("TYPE");
                                currentArray[currentOType + "_" + "MATCH_POOL_STATUS"] = $(this).attr("MATCH_POOL_STATUS");
                                currentArray[currentOType + "_" + "CLOSE"] = $(this).attr("CLOSE");
                                currentArray[currentOType + "_" + "SELL"] = $(this).attr("SELL");
                                currentArray[currentOType + "_" + "POOL_CLOSED"] = $(this).attr("POOL_CLOSED");
                                $(this).find("LEG").each(function() {
                                    currentArray["LEG_" + $(this).attr("ID") + "_" + "MATCH_ID"] = $(this).attr("ID");
                                    currentArray["LEG_" + $(this).attr("ID") + "_" + "STATUS"] = $(this).attr("STATUS");
                                    currentArray["LEG_" + $(this).attr("ID") + "_" + "VOID"] = $(this).attr("VOID");
                                    currentArray["LEG_" + $(this).attr("ID") + "_" + "HASRESULT"] = $(this).attr("HASRESULT");
                                });
                            }
                        });

                        auto(currentArray, oddType_Page);

                        if (checkDisabledMatch && (_pageName == "MIXALLUP" || _pageName == "MIXALLUPSHORTCUT")) {
                            $("#dMix_" + MATCH_ID + " > div[id^='dMix_" + MATCH_ID + "_'] tr[class*='rmid']:not([class*='" + msnflag + "']) .codds input").each(function() {//dMix_12156
                                $(this).attr("disabled", true);
                                $(this).attr("checked", false);
                            });

                            $("#dMix_" + MATCH_ID + " > div[id^='dMix_" + MATCH_ID + "_'] tr:not([class*='" + msnflag + "']) .codds .oddsLink span").each(function() {
                                $(this).text("---");
                            });
                        }
                    });

                    //disable invalid matches in auto refresh
                    //disable checkboxes
                    if (checkDisabledMatch && (_pageName != "MIXALLUP" && _pageName != "MIXALLUPSHORTCUT")) {
                        $(".tOdds tr:not([class*='" + msnflag + "']) .codds input").each(function() {
                            $(this).attr("disabled", true);
                            $(this).attr("checked", false);
                        });
                        //write dashes to odds

                        $(".tOdds tr:not([class*='" + msnflag + "']) .codds .oddsLink span").each(function() {
                            $(this).text("---");
                        });

                        if (oddsType == "all" || oddsType == "CRS" || oddsType == "FCS" || oddsType == "FGS") {

                            $(".tCRS tr:not([class*='" + msnflag + "']) .codds input").each(function() {
                                $(this).attr("disabled", true);
                                $(this).attr("checked", false);
                            });

                            $(".tFGS tr:not([class*='" + msnflag + "']) .codds input").each(function() {
                                $(this).attr("disabled", true);
                                $(this).attr("checked", false);
                            });
                            if (_isLiveBetting) {
                                $(".tgCoupon .spchkpool").each(function() {
                                    if (!$(this).hasClass(msnflag)) {
                                        $(this).find("label[id*='_plst']").each(function() {
                                            if ($(this).attr("id").indexOf("NTS") == -1) {
                                                $(this).addClass("stUpd");
                                                $(this).text("-" + jsbettingclosed);
                                            }
                                            else {
                                                $(this).text("");
                                            }
                                            $("#ntsstage_" + _matchID).parent().hide();
                                            $("#ntspart_" + _matchID).hide();
                                        });
                                    }
                                });
                            }

                            $(".tFGS tr:not([class*='" + msnflag + "']) .nofgsodds input").each(function() {
                                $(this).attr("disabled", true);
                                $(this).attr("checked", false);
                            });
                            $(".tFGS tr:not([class*='" + msnflag + "']) .codds .oddsLink span").each(function() {
                                $(this).text("---");
                            });
                            $(".tCRS tr:not([class*='" + msnflag + "']) .codds .oddsLink span").each(function() {
                                $(this).text("---");
                            });
                            $(".tFGS tr:not([class*='" + msnflag + "']) .nofgsodds .oddsLink span").each(function() {
                                $(this).text("---");
                            });
                        }
                    }
                }
            }
        }
    });
}
function executeAutoRefreshByPull() {
    if (typeof (refreshOddsPageScript) == "function") {
        refreshOddsPageScript();
    }
}
var pushPage;
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
function executeAutoRefreshByPush() {

    var masterWinRef = top.document.getElementById('push_engine') ? top.document.getElementById('push_engine').contentWindow : null;

    // these two functions are defined in misc.js
    pushPage = initializePushPage("/info/include/js/commons/custom/", oddsPushIconDisplay, onEngineReady, onEngineLost);
    initializeEngine(pushPage, "/info/include/js/commons/lightstreamer/", null, masterWinRef);

    if (typeof (executeAutoRefreshByPushScript) == "function") {
        executeAutoRefreshByPushScript();
    }
}

function autoRefreshByPush(isLiveBetting, oddType_Page) {
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
            MSN = "";
        }
    };
    pushPage.addTable(pushstatustable, "status");

    if ($.isNullOrEmpty(matches)) return;
    var matches_array = matches.split(",");
    var schemas_array = schema.split(",");

    var table = new NonVisualTable(matches_array, schemas_array, "MERGE");
    table.setDataAdapter("MatchDetailsDataAdapter");
    table.setSnapshotRequired(true);

    var lsItemStatus = true;

    table.onItemUpdate = function(itemPos, updateInfo, itemName) {
        if (updateInfo != null) {
            document.getElementById('machineInfo').title = machineId + ' - ' + updateInfo.getNewValue('CURRENT_MACHINE');

            lsItemStatus = true;
            if (updateInfo.getNewValue("lsItemStatus") == "invalid") {
                lsItemStatus = false;
            }

            var matchArray = new Array();
            matchArray["IS_LIVEBETTING"] = isLiveBetting;
            var isChanged = false;
            var reg = /(IS_BETTING_DELAY_NEED)/;
            var hasBettingDelay = false;
            var hasBettingDelayTql = false;

            for (var x = 0; x < schemas_array.length; x++) {
                if (lsItemStatus == true) {
                    if (reg.test(schemas_array[x])) {
                        if (schemas_array[x].indexOf("TQL") == -1) {
                            if (!hasBettingDelay) {
                                matchArray["IS_BETTING_DELAY_NEED"] = updateInfo.getNewValue(schemas_array[x]);
                                hasBettingDelay = true;
                            }
                        } else {
                            if (!hasBettingDelayTql) {
                                matchArray["IS_BETTING_DELAY_NEED_TQL"] = updateInfo.getNewValue("TQL_IS_BETTING_DELAY_NEED");
                                hasBettingDelayTql = true;
                            }
                        }
                    } else {
                        var newKey = schemas_array[x];
                        if (schemas_array[x].indexOf("DHCP_LEG_") >= 0) {
                            var newKey = schemas_array[x].replace("DHCP_LEG_", "LEG_");
                            matchArray[newKey] = updateInfo.getNewValue(schemas_array[x]);
                        }
                        else if (schemas_array[x].indexOf("HFMP_LEG_") >= 0) {
                            var newKey = schemas_array[x].replace("HFMP_LEG_", "LEG_");
                            matchArray[newKey] = updateInfo.getNewValue(schemas_array[x]);
                        }
                        else {
                            var newKey = schemas_array[x];
                            matchArray[newKey] = updateInfo.getNewValue(schemas_array[x]);
                        }
                    }
                    if (!isChanged) {
                        if (updateInfo.isValueChanged(schemas_array[x])) {
                            isChanged = true;
                        }
                    }
                }
            }


            var Match_Status = checkValueNulltoEmpty(updateInfo.getNewValue("MATCH_STAGE"));
            var Wagering_Status = checkValueNulltoEmpty(updateInfo.getNewValue("WAGERING_STATUS"));

            if (Match_Status.indexOf("fulltime") >= 0 && hasPoolWithExtraTimeDefined(matchArray) && Wagering_Status == "full-time-result-final") {
                matchArray["MATCH_STAGE"] = "secondhalfcompleted";
                matchArray["NINETY_MINS_SCORE"] = "";
            }
            if (Match_Status.indexOf("penaltycompleted") > -1) {
                matchArray["MATCH_STAGE"] = "fulltime";
            }
            if (!$.isNullOrEmpty(matchArray["IS_BETTING_DELAY_NEED"])) {
                matchArray["IS_BETTING_DELAY_NEED_TQL"] = matchArray["IS_BETTING_DELAY_NEED"];
            }
            var isSchedule = (oddType_Page.indexOf("SCHEDULE") > -1);
            if (isChanged && !isSchedule) {
                auto(matchArray, oddType_Page);
            }
        }
    }

    pushPage.addTable(table, "odds");
    autoSwitchToPoolingMode();
    // JW: ODDS PUSH EOF
}

function hasPoolWithExtraTimeDefined(matchArray) {
    var extraTimeStr = "_EXTRA_TIME";
    for (var key in matchArray) {
        if (key.indexOf(extraTimeStr) != -1) {
            if (parseBoolean(matchArray[key])) {
                return true;
            }
        }
    }
    return false;
}

function auto(matchArray, oddType_Page) {
    if (matchArray != null && !$.isNullOrEmpty(matchArray["MATCH_ID"])) {
        var isTourn = matchArray["TOURN_ID"] == null ? false : true;

        var msnflag = matchArray["MSN_FLAG"] == null ? "" : matchArray["MSN_FLAG"]; //"msn_" + autorefreshcounter;jack zhang
        if (isTourn) {
            var tPoolType = matchArray["TYPE"];
            var tournID = matchArray["TOURN_ID"];
            var tournNum = matchArray["TOURN_NUM"];
            var tTournPoolID = matchArray["MATCH_ID"];
            var tSell = parseBoolean(matchArray["SELL"]);
            var tPoolStatus = matchArray["MATCH_POOL_STATUS"];

            var tPrefix = "#tourn_" + tPoolType + "_" + tTournPoolID + "_n";
            var tPrefix_IPCHP = "#" + tournID + "_CHP_INPLAY";

            var args = {};
            args.isSell = (tSell && tPoolStatus == "start-sell") ? true : false;
            args.poolStatus = tPoolStatus;
            args.tPrefix_IPCHP = tPrefix_IPCHP;

            switch (tPoolType) {
                case "CHP":
                    var teamcnt = $("input[id*='" + tPoolType + "_" + tTournPoolID + "']").length;
                    // for if the displayed odds's count not equal to the one which get form server ...start
                    var $oddsSpanObjs = $("span[id^='tourn_" + tPoolType + "_" + tTournPoolID + "']");
                    var maxOddsNo = 1;
                    $oddsSpanObjs.each(function() {
                        var currentOddsNo = $(this).attr("id").substr($(this).attr("id").lastIndexOf("_") + 1);
                        if (parseFloat(currentOddsNo) > maxOddsNo)
                            maxOddsNo = parseFloat(currentOddsNo);
                    });
                    teamcnt = maxOddsNo;
                    //end...
                    var arrTPrefix = new Array();
                    var arrGrpAttr = new Array();
                    for (i = 0; i < teamcnt; i++) {
                        var tmpIdx = (i + 1) + "";
                        if (tmpIdx.length < 2) {
                            tmpIdx = "0" + tmpIdx;
                        }
                        arrTPrefix[arrTPrefix.length] = tPrefix + "_" + tmpIdx;
                        arrGrpAttr[arrGrpAttr.length] = matchArray["CHP_1_" + tmpIdx];
                    }
                    args.oddsSet = arrTPrefix;
                    args.newOdds = arrGrpAttr;
                    tmpTorunOddsUpdate[tTournPoolID] = args;
                    var upd = function(arg) {
                        updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, null);

                        // IPCHP case
                        if ($(arg.tPrefix_IPCHP + "_plst").length > 0) { // the object exists leng > 0
                            updateOddsSetIPCHP(arg.oddsSet, arg.newOdds, arg.isSell);

                            //update pool status in inplay all odds page
                            updatePoolStatus($(arg.tPrefix_IPCHP + "_plst"), arg.poolStatus);
                        }

                        if ($("#" + tournID + "_CHP_plst").length > 0) {
                            updateCHPPoolStatus($("#" + tournID + "_CHP_plst"), arg.poolStatus);
                        }

                        if ($("#" + tournID + "_CHP_ALL_plst").length > 0) {
                            updateCHPPoolStatus($("#" + tournID + "_CHP_ALL_plst"), arg.poolStatus);
                        }

                        //                        if (typeof (replaceOddsTable) == "function") {
                        //                            var tempCHPTabid = $("span[id^='tourn_" + tPoolType + "_" + tTournPoolID + "']").eq(0).parent().parent().parent().parent().parent().attr("id");
                        //                            replaceOddsTable(tempCHPTabid);
                        //                        }
                    };
                    if ($("#" + tTournPoolID + "_CHP_delay").length > 0) {
                        //$("#" + tTournPoolID + "_CHP_delay").val(matchArray[tTournPoolID + "_IP_DELAY"]); //IS_BETTING_DELAY_NEED
                        $("#" + tTournPoolID + "_CHP_delay").val(matchArray["IS_BETTING_DELAY_NEED"]);
                    }
                    $.queue.add(upd, this, null, args);
                    break;
                case "GPF":
                    //gpfgroupcounter++;
                    var gpf_tPrefix = "#tourn_" + tPoolType + "_" + tTournPoolID;
                    var arrTPrefix = new Array();
                    var arrGrpAttr = new Array();
                    //4 teams, 12 combinations
                    var teamcnt = 0;
                    if ($("#gpfcnt_" + tTournPoolID).val()) {
                        teamcnt = $("#gpfcnt_" + tTournPoolID).val();
                    }
                    var teamAll = $("input[id^='tourn_" + tPoolType + "_" + tTournPoolID + "']");
                    var grpID = 0;
                    if (teamAll[0])
                        grpID = teamAll[0].id.split("_")[3];

                    for (i = 0; i < teamcnt; i++) {
                        for (j = 0; j < teamcnt; j++) {
                            var tmpIdxX = (i + 1) + "";
                            if (tmpIdxX.length < 2) {
                                tmpIdxX = "0" + tmpIdxX;
                            }
                            var tmpIdxY = (j + 1) + "";
                            if (tmpIdxY.length < 2) {
                                tmpIdxY = "0" + tmpIdxY;
                            }
                            arrTPrefix[arrTPrefix.length] = gpf_tPrefix + "_" + grpID + "_" + tmpIdxX + tmpIdxY;
                            arrGrpAttr[arrGrpAttr.length] = matchArray["GPF_" + grpID + "_" + tmpIdxX + tmpIdxY];
                        }
                    }
                    args.oddsSet = arrTPrefix;
                    args.newOdds = arrGrpAttr;
                    var upd = function(arg) {
                        updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, null);
                        replaceEliminated("gpfHolder");
                    };
                    $.queue.add(upd, this, null, args);
                    break;
                case "TOFP":
                    var arrTPrefix = new Array();
                    var arrGrpAttr = new Array();

                    //                        var arrAttrs = new Array();
                    //                        for (i = 0; i < $grpObj.context.attributes.length; i++) {
                    //                            var attrName = $grpObj.context.attributes[i].name;
                    //                            if (attrName != "SELL" && attrName != "TOURN_POOL_ID") {
                    //                                arrTPrefix[arrTPrefix.length] = tPrefix + "_" + attrName.replace("S", "");
                    //                                arrGrpAttr[arrGrpAttr.length] = $grpObj.attr(attrName);
                    //                            }
                    //                        }
                    var reg = /^TOFP_1_\d{4}/;
                    for (var prop in matchArray) {
                        if (reg.test(prop)) {
                            if (matchArray[prop] != null) {
                                arrGrpAttr.push(matchArray[prop]);
                                arrTPrefix.push(tPrefix + "_" + prop.replace("TOFP_1_", ""));
                            }
                        }
                    }
                    args.oddsSet = arrTPrefix;
                    args.newOdds = arrGrpAttr;
                    var upd = function(arg) {
                        updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, null);
                    };
                    $.queue.add(upd, this, null, args);
                    break;
                case "GPW":
                    var gpw_tPrefix = "#tourn_" + tPoolType + "_" + tTournPoolID;

                    var teamcnt = 0;
                    var teamAll = $("input[id^='tourn_" + tPoolType + "_" + tTournPoolID + "']");
                    var grpID = null;

                    if ($("input[id*='" + tPoolType + "_" + tTournPoolID + "']").length) {
                        teamcnt = $("input[id*='" + tPoolType + "_" + tTournPoolID + "']").length;
                    }
                    if (teamAll[0])
                        grpID = teamAll[0].id.split("_")[3];
                    // for if the displayed odds's count not equal to the one which get form server ...start
                    var $oddsSpanObjs = $("span[id^='tourn_" + tPoolType + "_" + tTournPoolID + "']");
                    var maxOddsNo = 1;
                    $oddsSpanObjs.each(function() {
                        var currentOddsNo = $(this).attr("id").substr($(this).attr("id").lastIndexOf("_") + 1);
                        if (parseInt(currentOddsNo, 10) > maxOddsNo)
                            maxOddsNo = parseInt(currentOddsNo, 10);
                    })
                    teamcnt = maxOddsNo;
                    //end...
                    var arrTPrefix = new Array();
                    var arrGrpAttr = new Array();

                    for (i = 0; i < teamcnt; i++) {
                        var tmpIdx = (i + 1) + "";
                        if (tmpIdx.length < 2) {
                            tmpIdx = "0" + tmpIdx;
                        }
                        arrTPrefix[arrTPrefix.length] = gpw_tPrefix + "_" + grpID + "_" + tmpIdx;
                        arrGrpAttr[arrGrpAttr.length] = matchArray["GPW_" + grpID + "_" + tmpIdx];
                    }
                    args.oddsSet = arrTPrefix;
                    args.newOdds = arrGrpAttr;
                    tmpTorunOddsUpdate[tTournPoolID] = args;
                    var upd = function(arg) {
                        updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, null);
                    };
                    $.queue.add(upd, this, null, args);
                    break;
                case "TPS":
                    var arrTPrefix = new Array();
                    var arrGrpAttr = new Array();
                    //max. 64 players
                    var fType = (!$.isNullOrEmpty(matchArray["FIXTURE_TYPE"]) ? matchArray["FIXTURE_TYPE"] : "1"); // player=1 or team=2
                    arrTPrefix[arrTPrefix.length] = tPrefix + "_" + "00"; // 
                    arrGrpAttr[arrGrpAttr.length] = matchArray["TPS_" + fType + "_" + "00"]; // 
                    for (i = 0; i < 64; i++) {
                        var tmpIdx = (i + 1) + "";
                        if (tmpIdx.length < 2) {
                            tmpIdx = "0" + tmpIdx;
                        }
                        arrTPrefix[arrTPrefix.length] = tPrefix + "_" + tmpIdx;
                        arrGrpAttr[arrGrpAttr.length] = matchArray["TPS_" + fType + "_" + tmpIdx];
                    }
                    args.oddsSet = arrTPrefix;
                    args.newOdds = arrGrpAttr;
                    var upd = function(arg) {
                        updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, null);
                        tmpTorunOddsUpdate[tTournPoolID] = args;
                    };
                    $.queue.add(upd, this, null, args);

                    break;
                case "SPC":
                    tPrefix = "#tourn_" + tPoolType + "_" + tTournPoolID;
                    var spcAll = $("input[id^='tourn_" + tPoolType + "_" + tTournPoolID + "']");
                    if (spcAll.length > 0) {
                        var itemID = spcAll[0].id.split("_")[3];
                        var arrTPrefix = new Array();
                        var arrGrpAttr = new Array();
                        //max. 12 options
                        for (i = 0; i < 12; i++) {
                            var tmpIdx = (i + 1) + "";
                            if (tmpIdx.length < 2) {
                                tmpIdx = "0" + tmpIdx;
                            }
                            arrTPrefix[arrTPrefix.length] = tPrefix + "_" + itemID + "_" + tmpIdx;
                            arrGrpAttr[arrGrpAttr.length] = matchArray["SPC_" + itemID + "_" + tmpIdx];
                        }
                        args.oddsSet = arrTPrefix;
                        args.newOdds = arrGrpAttr;
                        args.spcts_status_id = "#spcts_" + tournID + "_" + itemID;
                        var upd = function(arg) {
                            if (arg.poolStatus != "suspended") {
                                $(arg.spcts_status_id).hide();
                            } else {
                                $(arg.spcts_status_id).show();
                            }
                            updateOddsSet(arg.oddsSet, arg.newOdds, arg.isSell, null);
                        };
                        $.queue.add(upd, this, null, args);
                    }
                    break;
            }
        }
        else {
            var isLiveBetting = parseBoolean(matchArray["IS_LIVEBETTING"]);
            var isHalfTime = false;
            //match status attributes
            var matchID = matchArray["MATCH_ID"];
            var mMATCH_STAGE = matchArray["MATCH_STAGE"]; //extratime, penalty shootout
            var mMATCH_STARTED = matchArray["MATCH_STARTED"];
            var isMatchStarted = parseBoolean(mMATCH_STARTED);
            var mSCORE = matchArray["SCORE"];
            var mNinetyMinsTotalCorner = matchArray["NINETY_MINS_TOTAL_CORNER"];
            var mNTS_DIV = matchArray["NTS_DIV"];
            var mSTATUS = matchArray["STATUS"];
            var mVOID = matchArray["VOID"];
            var mHASRESULT = matchArray["HASRESULT"];
            var mNinetyMinsScore = matchArray["NINETY_MINS_SCORE"];

            //IS_BETTING_DELAY_NEED
            if (isLiveBetting) {
                var bettingDelayNeed = "false";
                var strDelayNeed = matchArray["IS_BETTING_DELAY_NEED"];
                var strDelayNeedTQL = matchArray["IS_BETTING_DELAY_NEED_TQL"];
                if (strDelayNeed != null && strDelayNeed != "") {
                    bettingDelayNeed = strDelayNeed.toLowerCase();
                    $("#" + matchID + "_delay").attr("value", bettingDelayNeed);
                }

                var bettingDelayNeedTQL = "false";
                if (strDelayNeedTQL != null && strDelayNeedTQL != "") {
                    bettingDelayNeedTQL = strDelayNeedTQL.toLowerCase();
                    $("#" + matchID + "_TQL_delay").attr("value", bettingDelayNeedTQL);
                }

                $("#hsst" + matchID).attr("value", mMATCH_STAGE);
            }

            //2010-05-03, NTS scoring information auto refresh fix at QC
            //render nts panel
            if (isLiveBetting && !$.isNullOrEmpty(matchID)) {
                getntsinfo(matchID, matchArray["NTS_DIV"], false);
            }

            //handle the nts pool swith to ets
            if (hasEtsPool(matchArray)) {
                if (pools.indexOf("ETS") == -1) {
                    pools = pools.replace("NTS", "ETS");
                }
            }
            for (var i = 0; i < pools.split(",").length; i++) {

                var oddsType = pools.split(",")[i].toUpperCase();
                var isInplaySPC = (oddsType == "SPC" || oddsType == "INPLAYSPC") && isLiveBetting;

                if (pools.split(",").length == 1 && oddsType != "CRS" && oddsType != "FCS" && oddsType != "FGS") {
                    $("#rmid" + matchID).addClass(msnflag);
                }

                var mIn;
                var key;
                var mSell;
                var mMatchPoolStatus;
                if (oddsType != "SPC" && oddsType != "INPLAYSPC") { // && oddsType != "DHCP" && oddsType != "HFMP") {
                    //mIn = getItemNum(matchArray, oddsType)[0];
                    key = oddsType + "_";
                    mMatchPoolStatus = matchArray[key + "MATCH_POOL_STATUS"];
                    mSell = parseBoolean(matchArray[key + "SELL"]);

                    if (mSell == null) continue;
                }

                var oPrefix = "#" + matchID + "_" + oddsType;
                var isAllOddsPage = (oddType_Page == "ALL" || oddType_Page == "INPLAYALL" || oddType_Page == "HALFTIMEALL" || oddType_Page == "MIXALLUP" || oddType_Page == "MIXALLUPSHORTCUT");
                var isIndexOrAllPage = (oddType_Page == "ALL" || oddType_Page == "INDEX");

                var args = {};
                args.matchID = matchID;


                if (isIndexOrAllPage == true) {
                    args.isMatchSell = parseBoolean(matchArray["SELL"]);
                }
                else {
                    args.isMatchSell = false;
                }

                args.isSell = (mSell && mMatchPoolStatus == "start-sell") ? true : false;
                args.matchPoolStatus = mMatchPoolStatus;
                args.isStarted = parseBoolean(matchArray["MATCH_STARTED"]);
                args.inplay = parseBoolean(matchArray[key + "INPLAY"]);
                args.ht_sell = parseBoolean(matchArray[key + "HT_SELL"]); ;
                args.oddsType = oddsType;
                if (matchArray["INPLAY_POOLS"] == null || matchArray["INPLAY_POOLS"] == "") {
                    args.inplayPools = "HAD";
                }
                else {
                    args.inplayPools = matchArray["INPLAY_POOLS"];
                }

                args.htPools = "HAD";
                args.oddsTypePage = oddType_Page;
                args.matchStage = mMATCH_STAGE;

                //update pool status in all odds page
                if (isAllOddsPage) {
                    args.oPrefix = oPrefix;
                    if (oddsType != "NTS" && oddsType != "ETS") {
                        var upd = function(arg) {
                            updatePoolStatus($(arg.oPrefix + "_plst"), arg.matchPoolStatus);
                        };
                        $.queue.add(upd, this, null, args);
                    }
                }
                if (isLiveBetting) {
                    args.isHalfTime = isHalfTime;
                    args.isMatchStarted = isMatchStarted;
                    args.isInplaySPC = isInplaySPC;
                    args.matchStage = mMATCH_STAGE;
                    args.matchScore = mSCORE;
                    args.ninetyMinsTotalCorner = mNinetyMinsTotalCorner;
                    args.ninetyMinsScore = mNinetyMinsScore;
                    args.oddsTypePage = oddType_Page;
                    var chlPoolClosed = null;
                    if (matchArray["CHL_POOL_CLOSED"] != null) {
                        chlPoolClosed = parseBoolean(matchArray["CHL_POOL_CLOSED"]);
                    }
                    args.chlPoolClosed = chlPoolClosed;
                    //update inplay status
                    var updSt = function(arg) {
                        updateInplayStatus([("#sr" + arg.matchID), ("#sst" + arg.matchID)],
                        [arg.matchScore, arg.matchStage], arg.isSell, arg.ninetyMinsScore, arg.matchID, arg.oddsTypePage, arg.ninetyMinsTotalCorner, arg.oddsType, arg.matchPoolStatus, arg.chlPoolClosed);
                    };
                    $.queue.add(updSt, this, null, args);
                }

                switch (oddsType) {
                    case "HAD": case "FHA": //case "HHA": case "HDC":
                        //update odds set with new values
                        args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_A"), (oPrefix + "_D")];
                        args.newOdds = [matchArray[key + "H"], matchArray[key + "A"], matchArray[key + "D"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_H"], matchArray[key + "PREV_A"], matchArray[key + "PREV_D"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                        } else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "FTS": //case "HHA": case "HDC":
                        //update odds set with new values
                        args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_A"), (oPrefix + "_N")];
                        args.newOdds = [matchArray[key + "H"], matchArray[key + "A"], matchArray[key + "N"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_H"], matchArray[key + "PREV_A"], matchArray[key + "PREV_N"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                        } else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            }
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "HHA":
                        //update odds set with new values
                        args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_A"), (oPrefix + "_D")];
                        args.newOdds = [matchArray[key + "H"], matchArray[key + "A"], matchArray[key + "D"]];
                        args.goalLineOddsSet = [(oPrefix + "_HG"), (oPrefix + "_AG")];
                        args.goalLineNewValue = [matchArray[key + "HG"], matchArray[key + "AG"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_H"], matchArray[key + "PREV_A"], matchArray[key + "PREV_D"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                            //update goal line
                            var updG = function(arg) {
                                updateGoalLine(arg.goalLineOddsSet, arg.goalLineNewValue, "HAG", arg.matchPoolStatus);
                            };
                            $.queue.add(updG, this, null, args);
                        }
                        else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                            //update goal line
                            var updG = function(arg) {
                                updateGoalLine(arg.goalLineOddsSet, arg.goalLineNewValue, "HAG");
                            };
                            $.queue.add(updG, this, null, args);
                        }
                        break;
                    case "HDC":
                        //update odds set with new values
                        args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_A")];
                        args.newOdds = [matchArray[key + "H"], matchArray[key + "A"]];
                        args.goalLineOddsSet = [(oPrefix + "_HG"), (oPrefix + "_AG")];
                        args.goalLineNewValue = [matchArray[key + "HG"], matchArray[key + "AG"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_H"], matchArray[key + "PREV_A"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                            //update goal line
                            var updG = function(arg) {
                                updateGoalLine(arg.goalLineOddsSet, arg.goalLineNewValue, "HAG", arg.matchPoolStatus);
                            };
                            $.queue.add(updG, this, null, args);
                        }
                        else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                            //update goal line
                            var updG = function(arg) {
                                updateGoalLine(arg.goalLineOddsSet, arg.goalLineNewValue, "HAG");
                            };
                            $.queue.add(updG, this, null, args);
                        }
                        break;
                    case "HIL":
                    case "FHL":
                    case "CHL":
                        /* for push - start */
                        if (matchArray[key + "H_1"] != undefined && matchArray[key + "H_1"] != null) {
                            /* find sequence */
                            var lineNoSeq = [];

                            /* lineNoSeq: order, line num, line status, line, h, l, prev_h, prev_l */
                            for (var j = 1; j <= 5; j++) {
                                if (matchArray[key + "H_" + j] != undefined && matchArray[key + "H_" + j] != null && matchArray[key + "LINESTATUS_" + j] != "3" && matchArray[key + "LINESTATUS_" + j] != 3) {
                                    lineNoSeq.push([matchArray[key + "SBCLINEORDER_" + j], j, matchArray[key + "LINESTATUS_" + j], matchArray[key + "LINE_" + j], matchArray[key + "H_" + j], matchArray[key + "L_" + j], matchArray[key + "PREV_H_" + j], matchArray[key + "PREV_L_" + j], j, matchArray[key + "MAINLINEFLAG_" + j]]);
                                }
                            }

                            function sortFunction(a, b) {
                                if (a[3] === b[3]) {
                                    return 0;
                                }
                                else {
                                    if (parseFloat(a[3].split('/')[0]) < parseFloat(b[3].split('/')[0]))
                                        return -1;
                                    else if (parseFloat(a[3].split('/')[0]) > parseFloat(b[3].split('/')[0]))
                                        return 1;
                                    else
                                        return (parseFloat((a[3] + "/0").split('/')[1]) < parseFloat((b[3] + "/0").split('/')[1])) ? -1 : 1;
                                }
                            }

                            lineNoSeq.sort(sortFunction);

                            /* if mainline on top enabled */
                            if (parseBoolean(isMainlineDisplayOnTop)) {
                                for (var j = 0; j < lineNoSeq.length; j++) {
                                    if (lineNoSeq[j][9] == "1") {
                                        var mainlineItem = lineNoSeq[j];
                                        lineNoSeq.splice(j, 1);
                                        //lineNoSeq.unshift([matchArray[key + "SBCLINEORDER_" + j], j, matchArray[key + "LINESTATUS_" + j], matchArray[key + "LINE_" + j], matchArray[key + "H_" + j], matchArray[key + "L_" + j], matchArray[key + "PREV_H_" + j], matchArray[key + "PREV_L_" + j], j, matchArray[key + "MAINLINEFLAG_" + j]]);
                                        lineNoSeq.unshift(mainlineItem);
                                        break;
                                    }
                                }
                            }

                            var lineSequenceUnique = [];
                            $.each(lineNoSeq, function(i, el) {
                                if ($.inArray(el, lineSequenceUnique) === -1) lineSequenceUnique.push(el);
                            });

                            matchArray[key + "H"] = "";
                            matchArray[key + "L"] = "";
                            matchArray[key + "LINE"] = "";
                            matchArray[key + "LINE_STATUS"] = "";
                            matchArray[key + "PREV_H"] = "";
                            matchArray[key + "PREV_L"] = "";
                            matchArray[key + "LINE_NO"] = "";
                            matchArray[key + "MAINLINE_FLAG"] = "";

                            /* lineNoSeq: order, line num, line status, line, h, l, prev_h, prev_l */
                            for (var j = 0; j < lineSequenceUnique.length; j++) {
                                matchArray[key + "H"] += lineSequenceUnique[j][4] + "_";
                                matchArray[key + "L"] += lineSequenceUnique[j][5] + "_";
                                matchArray[key + "LINE"] += lineSequenceUnique[j][3] + "_";
                                matchArray[key + "LINE_STATUS"] += lineSequenceUnique[j][2] + "_";
                                matchArray[key + "PREV_H"] += lineSequenceUnique[j][6] + "_";
                                matchArray[key + "PREV_L"] += lineSequenceUnique[j][7] + "_";
                                matchArray[key + "LINE_NO"] += lineSequenceUnique[j][8] + "_";
                                matchArray[key + "MAINLINE_FLAG"] += lineSequenceUnique[j][9] + "_";
                            }

                            matchArray[key + "H"] = matchArray[key + "H"].substring(0, matchArray[key + "H"].length - 1);
                            matchArray[key + "L"] = matchArray[key + "L"].substring(0, matchArray[key + "L"].length - 1);
                            matchArray[key + "LINE"] = matchArray[key + "LINE"].substring(0, matchArray[key + "LINE"].length - 1);
                            /* true / 1 ? */
                            matchArray[key + "LINE_STATUS"] = matchArray[key + "LINE_STATUS"].substring(0, matchArray[key + "LINE_STATUS"].length - 1);
                            matchArray[key + "PREV_H"] = matchArray[key + "PREV_H"].substring(0, matchArray[key + "PREV_H"].length - 1);
                            matchArray[key + "PREV_L"] = matchArray[key + "PREV_L"].substring(0, matchArray[key + "PREV_L"].length - 1);
                            matchArray[key + "LINE_NO"] = matchArray[key + "LINE_NO"].substring(0, matchArray[key + "LINE_NO"].length - 1);
                            matchArray[key + "MAINLINE_FLAG"] = matchArray[key + "MAINLINE_FLAG"].substring(0, matchArray[key + "MAINLINE_FLAG"].length - 1);

                        }
                        /* for push - end */

                        if (matchArray[key + "H"] != undefined) {
                            var hArray = matchArray[key + "H"].split('_');
                            var lArray = matchArray[key + "L"].split('_');
                            var lineArray = matchArray[key + "LINE"].split('_');
                            var noOfLine = lArray.length;
                            var lineStatusArray = [];
                            var lineNoArray = matchArray[key + "LINE_NO"].split('_');
                            var mainlineFlagArray = matchArray[key + "MAINLINE_FLAG"].split('_');

                            //update odds set with new values

                            args.oddsSet = new Array();
                            args.newOdds = new Array();
                            args.mainlineFlag = new Array();
                            args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_L")];
                            args.newOdds = [hArray[0], lArray[0]];
                            args.goalLineOddsSet = [(oPrefix + "_LINE")];
                            args.goalLineNewValue = [lineArray[0]];
                            args.lineStatusSet = [(oPrefix + "_LINE_STATUS")];
                            args.mainlineFlag = [mainlineFlagArray[0]];
                            var classPrefix = oPrefix.substr(1);
                            args.checkBoxClass = [(classPrefix + "_H_" + lineNoArray[0] + "_c"), (classPrefix + "_L_" + lineNoArray[0] + "_c")];
                            //args.oddsChange = [$('.' + classPrefix + "_H_" + lineNoArray[0] + "_c").parent().find('.oupt').length, $('.' + classPrefix + "_L_" + lineNoArray[0] + "_c").parent().find('.oupt').length];
                            args.displayOdds = [$('.' + classPrefix + "_H_" + lineNoArray[0] + "_c").parent().text(), $('.' + classPrefix + "_L_" + lineNoArray[0] + "_c").parent().text()];
                            if (noOfLine > 1) {
                                lineStatusArray = matchArray[key + "LINE_STATUS"].split('_');
                                if (lineStatusArray[0] == "1" && args.isSell) {
                                    args.lineStatusNewValue = ["true"];
                                } else {
                                    args.lineStatusNewValue = ["false"];
                                }
                            } else {
                                if (args.isSell) {
                                    args.lineStatusNewValue = ["true"];
                                } else {
                                    args.lineStatusNewValue = ["false"];
                                }
                            }
                            for (var j = 1; j < noOfLine; j++) {
                                args.oddsSet.push(oPrefix + "_H_" + j);
                                args.oddsSet.push(oPrefix + "_L_" + j);
                                args.newOdds.push(hArray[j]);
                                args.newOdds.push(lArray[j]);
                                args.goalLineOddsSet.push(oPrefix + "_LINE_" + j);
                                args.goalLineNewValue.push(lineArray[j]);
                                args.lineStatusSet.push(oPrefix + "_LINE_STATUS_" + j);
                                if (lineStatusArray[j] == "1" && args.isSell) {
                                    args.lineStatusNewValue.push("true");
                                } else {
                                    args.lineStatusNewValue.push("false");
                                }
                                args.checkBoxClass.push(classPrefix + "_H_" + lineNoArray[j] + "_c");
                                args.checkBoxClass.push(classPrefix + "_L_" + lineNoArray[j] + "_c");
                                //args.oddsChange.push($('.' + classPrefix + "_H_" + lineNoArray[j] + "_c").parent().find('.oupt').length);
                                //args.oddsChange.push($('.' + classPrefix + "_L_" + lineNoArray[j] + "_c").parent().find('.oupt').length);
                                args.displayOdds.push($('.' + classPrefix + "_H_" + lineNoArray[j] + "_c").parent().text());
                                args.displayOdds.push($('.' + classPrefix + "_L_" + lineNoArray[j] + "_c").parent().text());
                                args.mainlineFlag.push(mainlineFlagArray[j]);
                            }

                            args.oddsType = oddsType;
                            if (isLiveBetting) {
                                var prevHOdds = matchArray[key + "PREV_H"].split("_");
                                var prevLOdds = matchArray[key + "PREV_L"].split("_");
                                args.preNewOdds = [prevHOdds[0], prevLOdds[0]];
                                for (var j = 1; j < noOfLine; j++) {
                                    args.preNewOdds.push(prevHOdds[j]);
                                    args.preNewOdds.push(prevLOdds[j]);
                                }

                                var upd = function(arg) {
                                    // add row or remove row
                                    var removedLine = false;
                                    removedLine = updateMLRowNo(arg.matchID, arg.oddsType, arg.goalLineNewValue.length, arg.checkBoxClass, "all", false);

                                    if (arg.lineStatusNewValue != undefined) {
                                        updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.lineStatusNewValue.join("_"), arg.itemNum, arg.matchPoolStatus,
                                            arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC, arg.checkBoxClass, arg.displayOdds);
                                        updateCheckBoxClass(arg.oddsSet, arg.checkBoxClass, arg.mainlineFlag, arg.lineStatusNewValue);
                                    } else {
                                        updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                            arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC, arg.checkBoxClass, arg.displayOdds);
                                    }

                                    //update goal line
                                    updateGoalLine(arg.goalLineOddsSet, arg.goalLineNewValue, "HLG", arg.matchPoolStatus, arg.mainlineFlag, arg.lineStatusNewValue);
                                    updateBetValue(arg.oddsType, arg.matchID, arg.goalLineNewValue);

                                    if (removedLine) {
                                        getAllCheckedSelections();
                                    }
                                };
                                $.queue.add(upd, this, null, args);
                            }
                            else {
                                var upd = function(arg) {
                                    var removedLine = false;
                                    if (oddType_Page == "HIL" || oddType_Page == "CHL" || oddType_Page == "FHL") {
                                        removedLine = updateMLRowNo(arg.matchID, arg.oddsType, arg.goalLineNewValue.length, arg.checkBoxClass, "single", true);
                                    } else if (oddType_Page == "MIXALLUP" || oddType_Page == "MIXALLUPSHORTCUT") {
                                        removedLine = updateMLRowNo(arg.matchID, arg.oddsType, arg.goalLineNewValue.length, arg.checkBoxClass, "allup", true);
                                    } else {
                                        removedLine = updateMLRowNo(arg.matchID, arg.oddsType, arg.goalLineNewValue.length, arg.checkBoxClass, "all", true);
                                    }
                                    if (arg.lineStatusNewValue != undefined) {
                                        updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.lineStatusNewValue.join("_"), arg.oddsType, arg.inplayPools, arg.htPools,
                                            arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell, arg.displayOdds, arg.checkBoxClass);
                                        updateCheckBoxClass(arg.oddsSet, arg.checkBoxClass, arg.mainlineFlag, arg.lineStatusNewValue);
                                    } else {
                                        updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                            arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell, arg.displayOdds, arg.checkBoxClass);
                                    }

                                    updateGoalLine(arg.goalLineOddsSet, arg.goalLineNewValue, "HLG", null, arg.mainlineFlag);
                                    updateBetValue(arg.oddsType, arg.matchID, arg.goalLineNewValue);

                                    if (removedLine) {
                                        getAllCheckedSelections();
                                    }
                                };
                                $.queue.add(upd, this, null, args);
                            }
                        }
                        break;
                    case "OOE":
                        //update odds set with new values
                        args.oddsSet = [(oPrefix + "_O"), (oPrefix + "_E")];
                        args.newOdds = [matchArray[key + "O"], matchArray[key + "E"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_O"], matchArray[key + "PREV_E"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "HFT":
                        args.oddsSet = [(oPrefix + "_HH"), (oPrefix + "_HD"), (oPrefix + "_HA"),
                           (oPrefix + "_DH"), (oPrefix + "_DD"), (oPrefix + "_DA"),
                           (oPrefix + "_AH"), (oPrefix + "_AD"), (oPrefix + "_AA")];
                        args.newOdds = [matchArray[key + "HH"], matchArray[key + "HD"], matchArray[key + "HA"],
                           matchArray[key + "DH"], matchArray[key + "DD"], matchArray[key + "DA"],
                           matchArray[key + "AH"], matchArray[key + "AD"], matchArray[key + "AA"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_HH"], matchArray[key + "PREV_HD"], matchArray[key + "PREV_HA"],
                               matchArray[key + "PREV_DH"], matchArray[key + "PREV_DD"], matchArray[key + "PREV_DA"],
                               matchArray[key + "PREV_AH"], matchArray[key + "PREV_AD"], matchArray[key + "PREV_AA"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "TTG":
                        args.oddsSet = [(oPrefix + "_0"), (oPrefix + "_1"), (oPrefix + "_2"),
                            (oPrefix + "_3"), (oPrefix + "_4"), (oPrefix + "_5"),
                            (oPrefix + "_6"), (oPrefix + "_-7")];
                        args.newOdds = [matchArray[key + "P0"], matchArray[key + "P1"], matchArray[key + "P2"],
                            matchArray[key + "P3"], matchArray[key + "P4"], matchArray[key + "P5"],
                            matchArray[key + "P6"], matchArray[key + "M7"]];
                        if (isLiveBetting) {
                            //                            updateInplayOrHTOdds([(oPrefix + "_0"), (oPrefix + "_1"), (oPrefix + "_2"),
                            //                                (oPrefix + "_3"), (oPrefix + "_4"), (oPrefix + "_5"),
                            //                                (oPrefix + "_6"), (oPrefix + "_-7")],
                            //                                [matchArray[key+"PREV_P0"], matchArray[key+"PREV_P1"], matchArray[key+"PREV_P2"],
                            //                                matchArray[key+"PREV_P3"], matchArray[key+"PREV_P4"], matchArray[key+"PREV_P5"],
                            //                                matchArray[key+"PREV_P6"], matchArray[key+"PREV_M7"]],
                            //                                [matchArray[key+"P0"], matchArray[key+"P1"], matchArray[key+"P2"],
                            //                                matchArray[key+"P3"], matchArray[key+"P4"], matchArray[key+"P5"],
                            //                                matchArray[key+"P6"], matchArray[key+"M7"]],
                            //                                mSell, mIn, mMatchPoolStatus,
                            //                               isHalfTime, isMatchStarted, isInplaySPC);
                        }
                        else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "CRS":
                    case "FCS":
                        args.oddsSet = [(oPrefix + "_0001"), (oPrefix + "_0000"), (oPrefix + "_0100"),
                           (oPrefix + "_0002"), (oPrefix + "_0101"), (oPrefix + "_0200"),
                           (oPrefix + "_0102"), (oPrefix + "_0202"), (oPrefix + "_0201"),
                           (oPrefix + "_0003"), (oPrefix + "_0303"), (oPrefix + "_0300"),
                           (oPrefix + "_0103"), (oPrefix + "_0301"),
                           (oPrefix + "_0203"), (oPrefix + "_0302"),
                           (oPrefix + "_0004"), (oPrefix + "_0400"),
                           (oPrefix + "_0104"), (oPrefix + "_0401"),
                           (oPrefix + "_0204"), (oPrefix + "_0402"),
                           (oPrefix + "_0005"), (oPrefix + "_0500"),
                           (oPrefix + "_0105"), (oPrefix + "_0501"),
                           (oPrefix + "_0205"), (oPrefix + "_0502"),
                           (oPrefix + "_-1-H"), (oPrefix + "_-1-D"), (oPrefix + "_-1-A")];
                        args.newOdds = [matchArray[key + "S0001"], matchArray[key + "S0000"], matchArray[key + "S0100"],
                           matchArray[key + "S0002"], matchArray[key + "S0101"], matchArray[key + "S0200"],
                           matchArray[key + "S0102"], matchArray[key + "S0202"], matchArray[key + "S0201"],
                           matchArray[key + "S0003"], matchArray[key + "S0303"], matchArray[key + "S0300"],
                           matchArray[key + "S0103"], matchArray[key + "S0301"],
                           matchArray[key + "S0203"], matchArray[key + "S0302"],
                           matchArray[key + "S0004"], matchArray[key + "S0400"],
                           matchArray[key + "S0104"], matchArray[key + "S0401"],
                           matchArray[key + "S0204"], matchArray[key + "S0402"],
                           matchArray[key + "S0005"], matchArray[key + "S0500"],
                           matchArray[key + "S0105"], matchArray[key + "S0501"],
                           matchArray[key + "S0205"], matchArray[key + "S0502"],
                           matchArray[key + "M1MH"], matchArray[key + "M1MD"], matchArray[key + "M1MA"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_0001"], matchArray[key + "PREV_0000"], matchArray[key + "PREV_0100"],
                               matchArray[key + "PREV_0002"], matchArray[key + "PREV_0101"], matchArray[key + "PREV_0200"],
                               matchArray[key + "PREV_0102"], matchArray[key + "PREV_0202"], matchArray[key + "PREV_0201"],
                               matchArray[key + "PREV_0003"], matchArray[key + "PREV_0303"], matchArray[key + "PREV_0300"],
                               matchArray[key + "PREV_0103"], matchArray[key + "PREV_0301"],
                               matchArray[key + "PREV_0203"], matchArray[key + "PREV_0302"],
                               matchArray[key + "PREV_0004"], matchArray[key + "PREV_0400"],
                               matchArray[key + "PREV_0104"], matchArray[key + "PREV_0401"],
                               matchArray[key + "PREV_0204"], matchArray[key + "PREV_0402"],
                               matchArray[key + "PREV_0005"], matchArray[key + "PREV_0500"],
                               matchArray[key + "PREV_0105"], matchArray[key + "PREV_0501"],
                               matchArray[key + "PREV_0205"], matchArray[key + "PREV_0502"],
                               matchArray[key + "PREV_M1MH"], matchArray[key + "PREV_M1MD"], matchArray[key + "PREV_M1MA"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "NTS": case "ETS":
                        if (oddsType == 'ETS' && (matchArray["ETS_IN"] == null || matchArray["ETS_IN"] == ''))
                            break;
                        if (oddsType == 'NTS' && (matchArray["ETS_IN"] != null && matchArray["ETS_IN"] != ''))
                            break;

                        oPrefix = "#" + matchID + "_NTS";
                        args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_A"), (oPrefix + "_N")];
                        args.newOdds = [matchArray[key + "H"], matchArray[key + "A"], matchArray[key + "N"]];
                        if (isLiveBetting) {
                            args.itemNum = matchArray[key + "IN"];
                            args.preNewOdds = [matchArray[key + "PREV_H"], matchArray[key + "PREV_A"], matchArray[key + "PREV_N"]];
                            args.isLiveBetting = isLiveBetting;
                            args.matchArray = matchArray;
                            args.isAllOddsPage = isAllOddsPage;
                            args.oPrefix = oPrefix;
                            args.oddsType = oddsType;
                            args.isInitialOdds = parseBoolean(matchArray[key + "ISINITIAL_ODDS"]);
                            //use NTS as ID even it's ETS
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);

                                //update pool status in all odds page 
                                if (arg.isAllOddsPage) {
                                    var NTSStageID = arg.oPrefix + "_plst";

                                    if (arg.oddsType == "ETS") {
                                        $("#" + arg.matchID + "_NTS_isETS").val(true);
                                        NTSStageID = "#" + arg.matchID + "_NTS_plst";
                                    }
                                    updatePoolStatus($(NTSStageID), arg.matchPoolStatus);
                                    var goalnumber = arg.itemNum;
                                    if (!isNaN(goalnumber))
                                        $("#ntspart_" + arg.matchID).html(cntGoalNumber(goalnumber));
                                    $("#ntspart_" + arg.matchID).parent().show();
                                    if (goalnumber == null || goalnumber == "-" || (arg.isSell && arg.isInitialOdds)) {
                                        $("#ntspart_" + arg.matchID).parent().hide();
                                    }
                                    $("#ntsstage_" + arg.matchID).show();
                                    $("#ntspart_" + arg.matchID).show();
                                    if (arg.oddsType == "ETS") {
                                        $("#ntsstage_" + arg.matchID).html("[" + jsextratime + "]");
                                    }
                                    else {
                                        //$("#ntsstage_" + matchID).html(GetGlobalResources(mMATCH_STAGE, "js"));
                                    }
                                    if (arg.matchPoolStatus == "suspended") {
                                        $("#ntsstage_" + arg.matchID).hide();
                                        $("#ntspart_" + arg.matchID).hide();
                                        $("#ntspart_" + arg.matchID).parent().hide();
                                    }
                                }
                            };
                            $.queue.add(upd, this, null, args);

                            //update inplay status
                            $("#ntsinfo").show();
                        }
                        break;
                    case "SPC": case "INPLAYSPC":
                        var itemNums = getItemNum(matchArray, "SPC");
                        for (var k = 0; k < itemNums.length; k++) {
                            mIn = itemNums[k];
                            key = oddsType + "_" + mIn + "_";
                            mMatchPoolStatus = matchArray[key + "MATCH_POOL_STATUS"];
                            mSell = matchArray[key + "SELL"];
                            var arrOPrefix = new Array();
                            var arrPoolObj = new Array();
                            var arrPrevObj = new Array();
                            //max. 12 opions
                            for (var idx = 0; idx < 12; idx++) {
                                var tmpIdx = (idx + 1) + "";
                                if (tmpIdx.length < 2) {
                                    tmpIdx = "0" + tmpIdx;
                                }
                                arrOPrefix[arrOPrefix.length] = oPrefix + "_" + tmpIdx + "_" + itemNums[k];
                                arrPoolObj[arrPoolObj.length] = matchArray["SPC_" + itemNums[k] + "_S" + tmpIdx];
                                if (isLiveBetting)
                                    arrPrevObj[arrPrevObj.length] = matchArray["SPC_" + itemNums[k] + "_PREV_" + tmpIdx];
                            }
                            args = {};
                            args.isSell = parseBoolean(matchArray[key + "SELL"]);
                            args.isMatchSell = parseBoolean(matchArray["SELL"]);
                            args.oddsSet = arrOPrefix;
                            args.newOdds = arrPoolObj;
                            args.itemNum = mIn;
                            args.matchID = matchID;
                            args.isStarted = parseBoolean(matchArray["MATCH_STARTED"]);
                            args.inplay = parseBoolean(matchArray[key + "INPLAY"]);
                            args.ht_sell = parseBoolean(matchArray[key + "HT_SELL"]); ;
                            args.oddsType = oddsType;
                            args.oddsTypePage = oddType_Page;
                            args.matchStage = mMATCH_STAGE;
                            args.inplayPools = matchArray["INPLAY_POOLS"];
                            args.htPools = "HAD";
                            args.matchPoolStatus = mMatchPoolStatus;
                            if (isLiveBetting) {
                                args.preNewOdds = arrPrevObj;
                                args.isHalfTime = isHalfTime;
                                args.isInplaySPC = isInplaySPC;
                                args.matchScore = mSCORE;
                                var upd = function(arg) {
                                    updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                        arg.isHalfTime, arg.isStarted, arg.isInplaySPC);

                                    var ispc_status_id = "#ispc_" + arg.matchID + "_" + arg.itemNum;
                                    var ispc_pool_status = arg.matchPoolStatus;
                                    updatePoolStatus(ispc_status_id, ispc_pool_status);

                                    //update status for inplay spc
                                    if (arg.isInplaySPC && arg.oddsTypePage != "INPLAYALL") {


                                        // Match Status not update if the match not yet started
                                        if (arg.matchStage.indexOf("InPlayESST_nobr") < 0) {

                                            $("#matchStatusLabel" + arg.matchID).html(GetGlobalResources("matchstatus") + ":");
                                            $("#sst" + arg.matchID).html(GetGlobalResources(arg.matchStage, "js"));

                                            //$("#sr" + matchID).html(mSCORE);
                                            if (arg.matchStage.indexOf("voidmatch") > -1)  //  2010-06-22
                                                $("#sst" + arg.matchID).addClass("oupt voidmatch");
                                            else
                                                $("#sst" + arg.matchID).removeClass("oupt voidmatch");
                                            if (arg.matchScore.indexOf("-1") > -1 || arg.matchScore.indexOf("N/A") > -1) {
                                                $("#sr" + arg.matchID).html(GetGlobalResources("VS", "js"));
                                            }
                                            else {
                                                $("#sr" + arg.matchID).html(arg.matchScore);
                                            }
                                        }
                                    }
                                };
                                $.queue.add(upd, this, null, args);
                            }
                            else {
                                var upd = function(arg) {
                                    updateSPCOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                        arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.itemNum, arg.matchStage, arg.isMatchSell, arg.matchPoolStatus);
                                };
                                $.queue.add(upd, this, null, args);
                            }
                        }
                        break;
                    case "TQL":
                        //update odds set with new values
                        args.oddsSet = [(oPrefix + "_H"), (oPrefix + "_A")];
                        args.newOdds = [matchArray[key + "H"], matchArray[key + "A"]];
                        if (isLiveBetting) {
                            args.preNewOdds = [matchArray[key + "PREV_H"], matchArray[key + "PREV_A"]];
                            var upd = function(arg) {
                                updateInplayOrHTOdds(arg.oddsSet, arg.preNewOdds, arg.newOdds, arg.isSell, arg.itemNum, arg.matchPoolStatus,
                                    arg.isHalfTime, arg.isMatchStarted, arg.isInplaySPC);
                            };
                            $.queue.add(upd, this, null, args);
                        } else {
                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "FGS":
                        if (isLiveBetting) {
                            //N/A
                        }
                        else {
                            var arrOPrefix = new Array();
                            arrOPrefix[arrOPrefix.length] = oPrefix + "_000";
                            var arrPoolObj = new Array();
                            arrPoolObj[arrPoolObj.length] = matchArray[key + "S000"];
                            //max 20 players and no fgs
                            for (var c = 1; c < 3; c++) {
                                for (var j = 0; j < 20; j++) {
                                    var tmpIdx = (j + 1) + "";
                                    if (tmpIdx.length < 2) {
                                        tmpIdx = "0" + tmpIdx;
                                    }
                                    arrOPrefix[arrOPrefix.length] = oPrefix + "_" + c + tmpIdx;
                                    arrPoolObj[arrPoolObj.length] = matchArray[key + "S" + c + tmpIdx];
                                }
                            }
                            args.oddsSet = arrOPrefix;
                            args.newOdds = arrPoolObj;

                            var upd = function(arg) {
                                updateOddsDisplay(arg.matchID, arg.isStarted, arg.inplay, arg.ht_sell, arg.isSell, arg.oddsType, arg.inplayPools, arg.htPools,
                                    arg.oddsSet, arg.newOdds, arg.oddsTypePage, arg.matchStage, arg.isMatchSell);
                            };
                            $.queue.add(upd, this, null, args);
                        }
                        break;
                    case "DHCP": case "HFMP":
                        var legs = new Array();
                        //                        legs[0] = new Object();
                        //                        legs[0].matchID = matchArray["MATCH_ID"];
                        //                        legs[0].status = matchArray["STATUS"];
                        //                        legs[0].isVoid = parseBoolean(matchArray["VOID"]);
                        //                        legs[0].hasResult = parseBoolean(matchArray["HASRESULT"]);

                        var legIDs = new Array();
                        legIDs = getLegIDs(matchArray);
                        for (var j = 0; j < legIDs.length; j++) {
                            legs[j] = new Object();
                            legs[j].matchID = matchArray["LEG_" + legIDs[j] + "_MATCH_ID"];
                            legs[j].status = matchArray["LEG_" + legIDs[j] + "_STATUS"];
                            legs[j].isVoid = parseBoolean(matchArray["LEG_" + legIDs[j] + "_VOID"]);
                            legs[j].hasResult = parseBoolean(matchArray["LEG_" + legIDs[j] + "_HASRESULT"]);
                        }
                        //           var isSelling = parseBoolean(matchArray[oddsType + "_SELL"]); //matchArray[oddsType + "_SELL"] != null && matchArray[oddsType + "_SELL"].toLowerCase() == "true";

                        args.legs = legs;
                        //           args.isSell = isSelling;

                        var upd = function(arg) {
                            updateParimutuel(arg.legs, arg.isSell);
                        };
                        $.queue.add(upd, this, null, args);
                        break;
                }
            }
        }
    }
}

function hasEtsPool(matchArray) {
    var hasEst = false;
    if (matchArray != null) {
        var reg = /^(ETS)_\d+_[a-zA-Z]$/;
        var reg2 = /^(ETS)_[a-zA-Z]$/;
        for (var prop in matchArray) {
            if (reg.test(prop) || reg2.test(prop)) {
                hasEst = true;
                break;
            }
        }
    }
    return hasEst;
}

// [setTimeout, "oddsHTML"]
var removeBoldTimeOut = [];
//update inplay odds
function updateInplayOrHTOdds(_oldOddsSet, _prevValues, _newValues, _sell, _IN, _PoolStatus,
                                _isHalfTime, _isMatchStart, _isInplaySPC, _checkBoxClassName, _displayOdds) {
    if (_oldOddsSet.length == _newValues.length) {
        var len = _oldOddsSet.length;
        var isSuspended = (_PoolStatus != null && _PoolStatus.toUpperCase() == "SUSPENDED");
        var isBettingClosed = (_PoolStatus != null && _PoolStatus.toUpperCase() == "BETTINGCLOSED");

        //alert(_Sell + " " + _IN + " " + _PoolStatus);
        var sellStatus = _sell.toString().split("_");
        var prevOdds_display = [];
        for (var i = 0; i < len; i++) {
            if (_checkBoxClassName == undefined) {
                if (isNaN($(_oldOddsSet[i]).text()))
                    prevOdds_display.push($(_oldOddsSet[i]).text());
                else
                    prevOdds_display.push(parseFloat($(_oldOddsSet[i]).text()));
            } else {
                if (isNaN(_displayOdds[i]))
                    prevOdds_display.push(_displayOdds[i]);
                else
                    prevOdds_display.push(parseFloat(_displayOdds[i]));
            }
        }
        for (var i = 0; i < len; i++) {
            if ($(_oldOddsSet[i]).length < 1 || _newValues[i] == null) continue;
            //old olds value
            var $oldOddsObj = $(_oldOddsSet[i]);

            var prevoddsStr = "";
            //prev status
            var prevStatus = "";
            //prev odds value
            var prevOdds = "";
            //prev odds string
            if (_isHalfTime) {
                prevOdds = parseFloat($(_oldOddsSet[i]).text());
            }
            else {
                if (_prevValues[i] != null) {
                    prevoddsStr = _prevValues[i].split("@");
                    //prev status
                    prevStatus = prevoddsStr[0];
                    //prev odds value
                    prevOdds = prevoddsStr[1];
                }
            }

            //new odds string
            var newoddsStr = "";
            //new status
            var newStatus = "";
            //new odds value
            var newOdds = "";
            var selStopSell = false;
            var selIrrational = false;

            var isLSE = false;
            var isRFD = false;

            if (!$.isNullOrEmpty(_newValues[i])) {
                newoddsStr = _newValues[i].split("@");
                if (newoddsStr.length > 1) {
                    //new status
                    newStatus = newoddsStr[0];
                    //new odds value
                    newOdds = newoddsStr[1];

                    selStopSell = newStatus.charAt(0) == "0";
                    selIrrational = newStatus.charAt(2) == "1";

                    isLSE = newOdds.indexOf("LSE") > -1;
                    isRFD = newOdds.indexOf("RFD") > -1;
                }
            }

            var $chkObj = $(_oldOddsSet[i] + "_c");

            if (isDisabled(newStatus)) {
                if ($chkObj.attr("checked")) {
                    $chkObj.click();
                    removeClassFromClickedCheckBox($chkObj.attr('class'));
                    $chkObj.parent().removeClass('checkedOdds');
                }
                $chkObj.attr("disabled", true);
                $chkObj.attr("checked", false);
            }
            else {
                $chkObj.attr("disabled", false);
            }
            //write dash if pool is suspended

            if (sellStatus.length == 1)
                lineSellStatus = parseBoolean(sellStatus[0]);
            else
                lineSellStatus = parseBoolean(sellStatus[Math.floor(i / 2)]);

            if (isSuspended || isBettingClosed || selStopSell || selIrrational || !lineSellStatus) {
                if (!isLSE && !isRFD)
                    newOdds = "---";
                $chkObj.attr("disabled", true);
                $chkObj.attr("checked", false);
            }

            if (parseBoolean(lineSellStatus)) {
                //is selling
                var _oldOddsText = prevOdds_display[i].toString(); // $oldOddsObj.html();

                //check if it's changed from stop to start sell
                var _isFromStopToStartSell = false;
                if (!$.isNullOrEmpty(_oldOddsText)) {
                    _isFromStopToStartSell = (_oldOddsText.indexOf("--") > -1);
                }

                //turn on checkbox if isSelling and notSuspended
                if (!isSuspended && !isDisabled(newStatus)) {
                    $chkObj.attr("disabled", false);
                }

                //check selection updated
                var _isOddsUpdated = (newStatus.charAt(1) == "1" && prevOdds_display[i] != newOdds);

                //check whether match is changed from stop sell to start sell
                //and selection disabled
                var _isUpdated = (_isOddsUpdated || _isFromStopToStartSell);

                if (_isHalfTime && !_isMatchStart) {
                    if (!isLSE && !isRFD)
                        newOdds = "---";
                    $chkObj.attr("disabled", true);
                    $chkObj.attr("checked", false);
                    _isUpdated = false;
                }

                if (_isUpdated) {

                    //check if the checkbox has to be disabled.
                    if (isDisabled(newStatus)) {
                        $chkObj.attr("disabled", true);
                        $chkObj.attr("checked", false);
                    }
                    else {
                        $chkObj.attr("disabled", false);
                    }

                    //odds drop
                    var odrops = (parseFloat(prevOdds) > parseFloat(newOdds));
                    var oequal = ((parseFloat(prevOdds) == parseFloat(newOdds)) || (newOdds == "---"));
                    if (_isFromStopToStartSell) {
                        $oldOddsObj.addClass("nowrap");
                        $oldOddsObj.html(newOdds);
                    } else if (_isOddsUpdated && !oequal && !isNaN(parseFloat(_oldOddsText))) {
                        //bold the odds if it's updated
                        $oldOddsObj.addClass("oupt nowrap");
                    }
                    //no arrows for halftime
                    if (_isHalfTime) {
                        $oldOddsObj.html(newOdds);
                    }
                    else {
                        if (oequal) {
                            $oldOddsObj.html(newOdds);
                        }
                        else {
                            if (_isOddsUpdated) {
                                if (_checkBoxClassName != undefined) {
                                    timeoutInd = _checkBoxClassName[i];
                                } else {
                                    timeoutInd = _oldOddsSet[i];
                                }
                                if (removeBoldTimeOut[timeoutInd] != undefined && removeBoldTimeOut[timeoutInd] != null) {
                                    clearTimeout(removeBoldTimeOut[timeoutInd][0]);
                                }
                                if (isNaN(parseFloat(_oldOddsText))) {
                                    $oldOddsObj.html(newOdds);
                                    $oldOddsObj.removeClass("oupt");
                                } else if (!_isFromStopToStartSell) {
                                    if (odrops) {
                                        $oldOddsObj.html(newOdds + oddsDownStr);
                                        removeBoldTimeOut[timeoutInd] = [setTimeout(removeBoldText, 2000 * 60, timeoutInd, newOdds), newOdds + oddsDownStr];
                                    }
                                    else {
                                        $oldOddsObj.html(newOdds + oddsUpStr);
                                        removeBoldTimeOut[timeoutInd] = [setTimeout(removeBoldText, 2000 * 60, timeoutInd, newOdds), newOdds + oddsUpStr];
                                    }
                                }
                            }
                        }
                    }
                }

                /*
                // remove arrow and un-bold odds   2010-06-22
                if (!_isOddsUpdated) {
                $(_oldOddsSet[i]).removeClass("oupt nowrap");
                $oldOddsObj.html(newOdds);
                }*/
                // when no odds change but line change
                if (_checkBoxClassName != undefined && !_isOddsUpdated && $(_oldOddsSet[i]).text() != newOdds) {
                    if (removeBoldTimeOut[_checkBoxClassName[i]] != undefined && removeBoldTimeOut[_checkBoxClassName[i]] != null && newOdds != "---") {
                        // move odds and class
                        $oldOddsObj.html(removeBoldTimeOut[_checkBoxClassName[i]][1]);
                        $oldOddsObj.addClass("oupt nowrap");
                    } else {
                        $oldOddsObj.html(newOdds);
                        $oldOddsObj.attr("class", "");
                    }
                }

                //for IPSPC when odds is RFD or LSE
                if (isLSE || isRFD) {
                    $(_oldOddsSet[i]).removeClass("oupt nowrap");
                    $oldOddsObj.html(GetGlobalResources(newOdds.toUpperCase(), "js"));
                    $chkObj.attr("disabled", true);
                    $chkObj.attr("checked", false);
                }
            }
            else {
                //check if the checkbox has to be disabled.
                $chkObj.attr("disabled", true);
                $chkObj.attr("checked", false);
                if (newStatus.charAt(1) == "1") {
                    $oldOddsObj.addClass("oupt nowrap");
                }

                if (isLSE || isRFD) {
                    $(_oldOddsSet[i]).removeClass("oupt nowrap");
                    $oldOddsObj.html(GetGlobalResources(newOdds.toUpperCase(), "js"));
                } else {
                    if (newOdds == "---") {
                        $(_oldOddsSet[i]).removeClass("oupt nowrap");
                    }
                    $oldOddsObj.html(newOdds);
                }

                if (_checkBoxClassName != undefined) {
                    timeoutInd = _checkBoxClassName[i];
                } else {
                    timeoutInd = _oldOddsSet[i];
                }
                if (removeBoldTimeOut[timeoutInd] != undefined && removeBoldTimeOut[timeoutInd] != null) {
                    clearTimeout(removeBoldTimeOut[timeoutInd][0]);
                }
            }
        }
    }
}

function removeBoldText(chkObj, newOdds) {
    // un-bold odds  
    if (chkObj.indexOf('#') >= 0)
        $(chkObj).removeClass("oupt nowrap").text(newOdds);
    else
        $('.' + chkObj).parent().find('a>span').removeClass("oupt nowrap").text(newOdds);
    removeBoldTimeOut[chkObj] = null;
}

//update pool status
function updatePoolStatus(_oldPoolStatusObj, _newPoolStatus) {
    var newSts = "";
    if (!$.isNullOrEmpty(_newPoolStatus) && _newPoolStatus != "start-sell") {
        newSts = "-" + GetGlobalResources(_newPoolStatus, "js");
    }
    $(_oldPoolStatusObj).addClass("stUpd");
    $(_oldPoolStatusObj).html(newSts);
}

//update CHP pool status (only show wording "suspended" when _newPoolStatus == "suspended")
function updateCHPPoolStatus(_oldPoolStatusObj, _newPoolStatus) {
    var newSts = "";
    if (!$.isNullOrEmpty(_newPoolStatus) && _newPoolStatus == "suspended") {
        newSts = "-" + GetGlobalResources(_newPoolStatus, "js");
    }
    $(_oldPoolStatusObj).addClass("stUpd");
    $(_oldPoolStatusObj).html(newSts);
}

//update inplay status
function updateInplayStatus(_oldStatusSet, _newValues, _sell, _ninetyMinsScore, _matchID, oddType_Page, _ninetyMinsTotalCorner, _oddsType, _matchPoolStatus, _chlPoolClosed) {
    if (_oldStatusSet.length == _newValues.length) {
        var len = _oldStatusSet.length;
        if (!$.isNullOrEmpty(_ninetyMinsScore)) {
            $("#sninetyminscore" + _matchID).html("<span class=\"utext\">" + jsNinety_mins + "</span> [" + _ninetyMinsScore + "]");
        }
        if (!$.isNullOrEmpty(_ninetyMinsTotalCorner)) {
            $(".spTotalCorner").html(_ninetyMinsTotalCorner);
        }
        if (_oddsType == "CHL") {
            var normalTimeMatchStages = ["firsthalf", "halftimecompleted", "secondhalf"];
            var isShow = false;
            for (var i = 0; i < normalTimeMatchStages.length; ++i) {
                if (_newValues[1] == normalTimeMatchStages[i]) {
                    isShow = true;
                    break;
                }
            }
            var chlPoolClosed = false;
            if (_chlPoolClosed != null) {
                chlPoolClosed = _chlPoolClosed;
            }
            if (!chlPoolClosed && _matchPoolStatus != undefined && _matchPoolStatus != "" && isShow) {
                $(".spTotalCornerWrapper").show();
            } else {
                $(".spTotalCornerWrapper").hide();
            }
        }

        for (i = 0; i < len; i++) {
            if (_newValues[0] == null) continue;
            var $obj = $(_oldStatusSet[i]);
            var oid = $obj.attr("id");
            var $hiddenStatus = $("#" + oid);
            var ohtml = $obj.html();
            var newValue = _newValues[i];
            if (newValue != null && oid != null) {
                //result
                if (oid.indexOf("sr") >= 0) {
                    if (newValue.indexOf("N/A") < 0 && newValue.indexOf("-1") < 0) {
                        $obj.html(newValue);
                    }
                }
                //match stage
                else if (oid.indexOf("sst") >= 0) {
                    $hiddenStatus.val(newValue);
                    if (newValue.indexOf("InPlayESST_nobr") < 0) {  // cant find InPlayESST_nobr means the match is kickoff

                        // INPLAYALL, HALFTIMEALL : odds_inplay_all, odds_halftime_all
                        // other : odds_inplay, odds_halftime
                        if (oddType_Page == "INPLAYHAD" || oddType_Page == "HALFTIME") {
                            if (newValue.toUpperCase() == "VOIDMATCH") {
                                var voidStr = "<span class='oupt voidmatch'>" + GetGlobalResources(newValue, "js") + "</span>";
                                $obj.html(voidStr);
                            }
                            else
                                $obj.html(GetGlobalResources(newValue, "js"));
                        }
                        else
                            $obj.html(GetGlobalResources("matchstatus") + ": " + GetGlobalResources(newValue, "js"));
                    }
                }
            }
        }
    }
}

//update odds set
function updateOddsSet(_oldOddsSet, _newValues, _sell, _forceUpdate, _displayOdds, _checkBoxClassName) {
    if (_oldOddsSet.length == _newValues.length) {
        var len = _oldOddsSet.length;
        var sellStatus = _sell.toString().split("_");

        var isTOFP = false;
        if (_oldOddsSet.length > 0) {
            isTOFP = (_oldOddsSet[0].indexOf("TOFP") > -1);
        }

        for (var i = 0; i < len; i++) {
            if ($(_oldOddsSet[i]).length < 1 || _newValues[i] == null) continue;

            //old olds value
            var $oldOddsObj = $(_oldOddsSet[i]);
            var $chkObj = $(_oldOddsSet[i] + "_c");
            if (_newValues[i] != null) {
                var newoddsStr = _newValues[i].split("@");
                var newStatus = newoddsStr[0];
                var newOdds = '';
                if (newoddsStr.length > 1)
                    newOdds = newoddsStr[1];
                //disabled checkbox if it's not sell
                var tempSell = true;
                if (sellStatus.length == 1) {
                    tempSell = !(_sell.toString() == "false" || _sell.toString() == "False");
                } else {
                    tempSell = !(sellStatus[Math.floor(i / 2)] == "false" || sellStatus[Math.floor(i / 2)] == "False");
                }

                if (!tempSell || newOdds == "RFD" || newOdds == "LSE" || isDisabled(newStatus)) {
                    if ($chkObj.attr("checked")) {
                        $chkObj.click();
                        removeClassFromClickedCheckBox($chkObj.attr('class'));
                        $chkObj.parent().removeClass('checkedOdds');
                    }
                    $chkObj.attr("checked", false);
                    $chkObj.attr("disabled", true);
                }
                else {
                    $chkObj.attr("disabled", false);
                }

                //TOFP doesn't have update flag, check "isSell"
                if (isTOFP) {
                    var oldOdds = $oldOddsObj.text();
                    var $chkObj = $(_oldOddsSet[i] + "_c");
                    //   if (isSell) {
                    //var newval = parseFloat(_newValues[i].split("@")[1]);
                    var newval = parseFloat(newoddsStr[1]);
                    //no change
                    var hasChg = (parseFloat(oldOdds) != newval);
                    if (hasChg) {
                        $oldOddsObj.removeClass("cLSE");
                        $chkObj.removeClass("cLSE cRFD");
                        $oldOddsObj.addClass("oupt");
                        if (newval == "RFD") {
                            $oldOddsObj.html(jsRFD);
                            $chkObj.addClass("cRFD");
                            if (_oldOddsText == jsRFD)
                                $oldOddsObj.removeClass("oupt");
                        }
                        else if (newval == "LSE") {
                            $oldOddsObj.html(jsLSE);
                            $oldOddsObj.addClass("cLSE");
                            $chkObj.addClass("cLSE");
                            if (_oldOddsText == jsLSE)
                                $oldOddsObj.removeClass("oupt");
                        }
                        else {
                            $oldOddsObj.html(newval.toFixed(2));
                        }
                    }
                    else {
                        $oldOddsObj.removeClass("oupt");
                    }
                    // }
                } else {

                    //only do update when status is updated
                    var _oldOddsText;
                    var mlPool = false;

                    if (_displayOdds != undefined && _displayOdds.length > 0) {
                        _oldOddsText = _displayOdds[i];
                        mlPool = true;
                    }
                    else
                        _oldOddsText = $oldOddsObj.text();

                    //check if it's changed from stop to start sell
                    var _isFromStopToStartSell = false;
                    if (!$.isNullOrEmpty(_oldOddsText)) {
                        _isFromStopToStartSell = (_oldOddsText.indexOf("--") > -1);
                    }

                    //check selection updated
                    var _isOddsUpdated = (newStatus.charAt(1) == "1"); //there is some problem.JACK ZHANG  

                    //check whether match is changed from stop sell to start sell
                    //and selection disabled
                    //var _isUpdated = (_isOddsUpdated || _isFromStopToStartSell || (_forceUpdate == true));
                    //if (_isUpdated) { // && isSell) {
                    //no change
                    var hasChg = (_oldOddsText != "" && (parseFloat(_oldOddsText) != parseFloat(newOdds)));
                    if (hasChg) {
                        $oldOddsObj.removeClass("cLSE");
                        $chkObj.removeClass("cLSE cRFD");
                        $oldOddsObj.addClass("oupt");
                        $oldOddsObj.html(newOdds);
                        if (newOdds == "RFD") {
                            $oldOddsObj.html(jsRFD);
                            $chkObj.addClass("cRFD");
                            if (_oldOddsText == jsRFD)
                                $oldOddsObj.removeClass("oupt");
                        }
                        else if (newOdds == "LSE") {
                            $oldOddsObj.html(jsLSE);
                            $oldOddsObj.addClass("cLSE");
                            $chkObj.addClass("cLSE");
                            if (_oldOddsText == jsLSE.replace("<br />", ""))
                                $oldOddsObj.removeClass("oupt");
                        }
                        // if selected checkbox is collapsed and the odds changed, expand to detail mode
                        var matchID = _oldOddsSet[i].split('_')[0].split('#')[1];
                        if ($chkObj.attr("checked") && isMatchRowCollapse(matchID) && !$oldOddsObj.is(":visible")) {
                            tgIndMl(matchID);
                        }

                        if (_checkBoxClassName != undefined) {
                            timeoutInd = _checkBoxClassName[i];
                            if (removeBoldTimeOut[timeoutInd] != undefined && removeBoldTimeOut[timeoutInd] != null) {
                                clearTimeout(removeBoldTimeOut[timeoutInd][0]);
                            }
                            removeBoldTimeOut[timeoutInd] = [setTimeout(removeBoldText, 2000 * 60, timeoutInd, newOdds), newOdds];
                        }
                    } else if (mlPool) {
                        $oldOddsObj.html(newOdds);
                    }
                    // 2010-06-28
                    if (!_isOddsUpdated) {
                        $oldOddsObj.removeClass("oupt");
                    } else if (_checkBoxClassName != undefined && _checkBoxClassName != null) {
                        if (removeBoldTimeOut[_checkBoxClassName[i]] != undefined && removeBoldTimeOut[_checkBoxClassName[i]] != null && newOdds != "---") {
                            // move odds and class
                            $oldOddsObj.html(removeBoldTimeOut[_checkBoxClassName[i]][1]);
                            $oldOddsObj.addClass("oupt nowrap");
                        } else {
                            $oldOddsObj.html(newOdds);
                            $oldOddsObj.removeClass("oupt");
                        }
                    }
                }
            }
        }
    }
}

function isMatchRowCollapse(matchID) {
    var hidden = false;
    if ($('#rmid' + matchID).length > 0 && $('#rmid' + matchID).find('.mlBtnPlus').length > 0) {
        hidden = true;
    }
    return hidden;
}

function updateCheckBoxClass(_oldOddsSet, _newClassName, _mainlineFlag, _lineStatus) {
    // update chkObjClass
    if (_newClassName != null) {
        var len = _oldOddsSet.length;
        var hidden = isMatchRowCollapse(_newClassName[0].split('_')[0]);
        for (var i = 0; i < len; i++) {
            var $chkObj = $(_oldOddsSet[i] + "_c");
            var $chkObjParent = $chkObj.parent();
            if ($chkObjParent.get(0) != undefined && $chkObjParent.get(0).tagName.toLowerCase() == "span") {
                $chkObjParent = $chkObjParent.parent();
            }
            $chkObj.attr("class", _newClassName[i]);

            if ($.inArray(_newClassName[i], clickedCheckBox) > -1) {
                if (parseBoolean(_lineStatus[Math.floor(i / 2)]) && !$chkObj.attr("disabled")) {
                    $chkObj.attr("checked", true);
                    $chkObjParent.addClass('checkedOdds');
                } else {
                    $chkObj.attr("checked", false);
                    $chkObjParent.removeClass('checkedOdds');
                    removeClassFromClickedCheckBox(_newClassName[i]);
                }
            } else {
                $chkObj.attr("checked", false);
                $chkObjParent.removeClass('checkedOdds');
            }

            // indicate multiple line and other line
            if (_mainlineFlag[Math.floor(i / 2)] == '1' || _mainlineFlag[Math.floor(i / 2)] == 1) {
                $chkObjParent.addClass('mainLineRow');
                $chkObjParent.removeClass('otherLineRow');
                $chkObjParent.show();
            } else {
                $chkObjParent.addClass('otherLineRow');
                $chkObjParent.removeClass('mainLineRow');
                if (hidden) {
                    $chkObjParent.hide();
                }
            }

        }
    }
}

// update odds for inplay CHP
function updateOddsSetIPCHP(_oldOddsSet, _newValues, _sell) {
    if (_oldOddsSet.length == _newValues.length) {
        var len = _oldOddsSet.length;

        for (i = 0; i < len; i++) {
            if (_newValues[i] == null) return;
            var $oldOddsObj = $(_oldOddsSet[i]);
            var selStopSell = _newValues[i].charAt(0) == "0";
            var selIrrational = _newValues[i].charAt(2) == "1";
            if (!_sell || selStopSell || selIrrational) {
                if (_newValues[i].indexOf("LSE") < 0 && _newValues[i].indexOf("RFD") < 0)
                    $oldOddsObj.html("---");
                $oldOddsObj.removeClass("cLSE");
            }
        }
    }
}

//update goal line
function updateGoalLine(_oldObjs, _newValues, _type, _PoolStatus, _mainlineFlag, _lineStatusNewValue) {
    if (_newValues[0] == null) return;
    var isSuspended = false;
    if (!$.isNullOrEmpty(_PoolStatus)) {
        isSuspended = (_PoolStatus.toUpperCase() == "SUSPENDED" || _PoolStatus.toUpperCase() == "BETTINGCLOSED");
    }

    if (_oldObjs.length == _newValues.length) {
        var len = _oldObjs.length;

        if (len > 1 && _type == "HLG") {
            var hidden = isMatchRowCollapse(_oldObjs[0].split('_')[0].split('#')[1]);
            var rowName = '#rmid' + _oldObjs[0].split('_')[0].split('#')[1];
        }

        for (var i = 0; i < len; i++) {
            var oldValue = $(_oldObjs[i]).text();
            var newValue = _newValues[i];

            //write dash if pool is suspended
            if (isSuspended) {
                newValue = "---";
            }
            if (newValue != null) {
                //goal line of HHA and HDC
                if (_type == "HAG") {
                    if (newValue.indexOf("--") == -1) {
                        newValue = "[" + newValue + "]";
                    }

                    if (oldValue != newValue) {
                        $(_oldObjs[i]).html(newValue);
                        $(_oldObjs[i]).addClass("btext");
                    }
                }
                //goal line for Hi Lo
                else if (_type == "HLG") {
                    // indicate multiple line and other line
                    var mainlineChange = false;
                    if (_mainlineFlag[i] == '1' || _mainlineFlag[i] == 1) {
                        if (oldValue != newValue || !$(_oldObjs[i]).parent().hasClass('mainLineRow')) {
                            mainlineChange = true;
                        }
                        $(_oldObjs[i]).parent().addClass('mainLineRow');
                        $(_oldObjs[i]).parent().removeClass('otherLineRow');
                        $(_oldObjs[i]).parent().show();
                    } else {
                        $(_oldObjs[i]).parent().addClass('otherLineRow');
                        $(_oldObjs[i]).parent().removeClass('mainLineRow');
                        if (hidden) {
                            $(_oldObjs[i]).parent().hide();
                        }
                    }
                    if (_lineStatusNewValue != undefined && _lineStatusNewValue != null && _lineStatusNewValue.length > 0 && !parseBoolean(_lineStatusNewValue[i])) {
                        newValue = "---";
                    }

                    if (oldValue != newValue || mainlineChange) { // line value change or main line change
                        $(_oldObjs[i]).html(newValue);
                        if (newValue == "---") {
                            if ($(_oldObjs[i]).parent().text().indexOf("[") >= 0) {
                                $(_oldObjs[i]).parent().html($(_oldObjs[i]).get(0).outerHTML);
                            }
                        }
                        else {
                            if (_lineStatusNewValue != undefined && $(_oldObjs[i]).parent().text().indexOf("[") < 0) {
                                $(_oldObjs[i]).parent().html("[" + $(_oldObjs[i]).get(0).outerHTML + "]");
                            }
                        }
                        // $(_oldObjs[i]).addClass("btext");
                        // uncheck any selected checkboxes if main line’s line value changed in collapse mode
                        if (((_mainlineFlag[i] == '1' || _mainlineFlag[i] == 1) && mainlineChange) && len > 1 && hidden) {
                            var chkBoxObj = $(_oldObjs[0].replace("LINE", "H_c"));
                            if (chkBoxObj.attr('checked')) {
                                chkBoxObj.click();
                                removeClassFromClickedCheckBox(chkBoxObj.attr('class'));
                                chkBoxObj.parent().removeClass('checkedOdds');
                            }
                            chkBoxObj = $(_oldObjs[0].replace("LINE", "L_c"));
                            if (chkBoxObj.attr('checked')) {
                                chkBoxObj.click();
                                removeClassFromClickedCheckBox(chkBoxObj.attr('class'));
                                chkBoxObj.parent().removeClass('checkedOdds');
                            }
                            for (var j = 1; j < len; j++) {
                                chkBoxObj = $(_oldObjs[0].replace("LINE", "H_" + j + "_c"));
                                if (chkBoxObj.attr('checked')) {
                                    chkBoxObj.click();
                                    removeClassFromClickedCheckBox(chkBoxObj.attr('class'));
                                    chkBoxObj.parent().removeClass('checkedOdds');
                                }
                                chkBoxObj = $(_oldObjs[0].replace("LINE", "L_" + j + "_c"));
                                if (chkBoxObj.attr('checked')) {
                                    chkBoxObj.click();
                                    removeClassFromClickedCheckBox(chkBoxObj.attr('class'));
                                    chkBoxObj.parent().removeClass('checkedOdds');
                                }
                            }
                        }
                    }

                }
            }
        }
    }
}

function removeClassFromClickedCheckBox(className) {
    clickedCheckBox = jQuery.grep(clickedCheckBox, function(value) {
        return value != className;
    });
}

function getAllCheckedSelections() {
    clickedCheckBox = [];
    var checkedSelections = $('.codds').find('input:checked');
    for (var i = 0; i < checkedSelections.length; i++) {
        clickedCheckBox.push($(checkedSelections[i]).attr('class'));
    }
}

function updateBetValue(poolType, matchID, goalLineNewValue) {
    for (var i = 0; i < betValue.length; i++) {
        if (betValue[i][0].indexOf(poolType) > -1 && betValue[i][0].indexOf(matchID) > -1) {
            for (var j = 0; j < goalLineNewValue.length; j++) {

                var tempBetValueArray;
                if (j >= betValue[i].length) {
                    tempBetValueArray = betValue[i][0].split("**");
                } else {
                    tempBetValueArray = betValue[i][j].split("**");
                }
                tempBetValueArray[6] = goalLineNewValue[j];
                tempBetValueArray[7] = goalLineNewValue[j];
                betValue[i][j] = tempBetValueArray.join("**");
            }
            break;
        }
    }
}

/*
function updateBetValueMl(poolType, matchID, lineNum, goalLineNewValue) {
for (var i = 0; i < betValueMl.length; i++) {
//for (var j = 0; j < betValueMl[i].length; j++) {
if (betValue[i].indexOf(poolType) > -1 && betValue[i].indexOf(matchID) > -1) {
if (betValueMl[i] != undefined && betValueMl[i].length > lineNum) {
var tempBetValueArray = betValueMl[i][lineNum].split("**");
} else {
var tempBetValueArray = betValue[i].split("**");
}
tempBetValueArray[6] = goalLineNewValue;
tempBetValueArray[7] = goalLineNewValue;
betValueMl[i][lineNum] = tempBetValueArray.join("**");
break;
}
//}
}
}
*/

//update dhcp
function updateParimutuel(legs, isSelling) {
    var matchID = null;
    var hasResult = false;
    var isVoid = false;
    var matchStatus = 0;
    for (var i = 0; i < legs.length; i++) {
        if ($(legs[i]).hasResult) {
            hasResult = true;
            break;
        }
    }
    $(legs).each(function() {
        matchID = this.matchID;
        hasResult = parseBoolean(this.hasResult); //.toLowerCase() == "false" ? false : true;
        isVoid = parseBoolean(this.isVoid); //.toLowerCase() == "false" ? false : true;
        //handle match void
        if (isVoid) {
            //add void label
            if ($("#" + matchID + "_void").length == 0) {
                $("<span id=\"" + matchID + "_void\"><font color=\"red\">" + jsvoidmatch + "</font></span>").insertAfter($("#" + matchID + "_team"));
            }
        } else {
            //remove void label
            if ($("#" + matchID + "_void").length > 0) {
                $("#" + matchID + "_void").remove();
            }
        }
        matchStatus = this.status;
        var matchID = this.matchID;
        var tdID = "td_" + matchID;
        var obj = document.getElementsByName(tdID);
        obj = $(obj);
        if (obj != null && obj.length > 0) {
            if (isSelling && !hasResult && !isVoid && matchStatus != "3") {
                $(obj).each(function() {
                    $(this).find("input[type=checkbox]").attr("disabled", false);
                });

                if (legs.length == 6) {
                    $("#" + matchID + "_11").val("1-1");
                    $("#" + matchID + "_1X").val("1-X");
                    $("#" + matchID + "_12").val("1-2");
                    $("#" + matchID + "_X1").val("X-1");
                    $("#" + matchID + "_XX").val("X-X");
                    $("#" + matchID + "_X2").val("X-2");
                    $("#" + matchID + "_21").val("2-1");
                    $("#" + matchID + "_2X").val("2-X");
                    $("#" + matchID + "_22").val("2-2");

                }
                else if (legs.length == 2) {
                    $("." + matchID + "_10").each(function() { $(this).val("1:0") });
                    $("." + matchID + "_00").each(function() { $(this).val("0:0") });
                    $("." + matchID + "_01").each(function() { $(this).val("0:1") });
                    $("." + matchID + "_20").each(function() { $(this).val("2:0") });
                    $("." + matchID + "_11").each(function() { $(this).val("1:1") });
                    $("." + matchID + "_02").each(function() { $(this).val("0:2") });
                    $("." + matchID + "_21").each(function() { $(this).val("2:1") });
                    $("." + matchID + "_22").each(function() { $(this).val("2:2") });
                    $("." + matchID + "_12").each(function() { $(this).val("1:2") });
                    $("." + matchID + "_30").each(function() { $(this).val("3:0") });
                    $("." + matchID + "_33").each(function() { $(this).val("3:3") });
                    $("." + matchID + "_03").each(function() { $(this).val("0:3") });
                    $("." + matchID + "_31").each(function() { $(this).val("3:1") });
                    $("." + matchID + "_13").each(function() { $(this).val("1:3") });
                    $("." + matchID + "_32").each(function() { $(this).val("3:2") });
                    $("." + matchID + "_23").each(function() { $(this).val("2:3") });
                    $("." + matchID + "_40").each(function() { $(this).val("4:0") });
                    $("." + matchID + "_04").each(function() { $(this).val("0:4") });
                    $("." + matchID + "_41").each(function() { $(this).val("4:1") });
                    $("." + matchID + "_14").each(function() { $(this).val("1:4") });
                    $("." + matchID + "_42").each(function() { $(this).val("4:2") });
                    $("." + matchID + "_24").each(function() { $(this).val("2:4") });
                    $("." + matchID + "_50").each(function() { $(this).val("5:0") });
                    $("." + matchID + "_05").each(function() { $(this).val("0:5") });
                    $("." + matchID + "_51").each(function() { $(this).val("5:1") });
                    $("." + matchID + "_15").each(function() { $(this).val("1:5") });
                    $("." + matchID + "_52").each(function() { $(this).val("5:2") });
                    $("." + matchID + "_25").each(function() { $(this).val("2:5") });
                    $("." + matchID + "_HO").each(function() { $(this).val("HO") });
                    $("." + matchID + "_DO").each(function() { $(this).val("DO") });
                    $("." + matchID + "_AO").each(function() { $(this).val("AO") });
                    $("." + matchID + "_F").each(function() { $(this).val("F") });
                }
            } else {
                $(obj).each(function() {
                    $(this).find("input[type=checkbox]").attr("disabled", true);
                    $(this).find("input[type=checkbox]").attr("checked", false);
                    if (legs.length == 6)
                        $(this).find("input[type=checkbox]").val("V-V");
                    else if (legs.length == 2)
                        $(this).find("input[type=checkbox]").val("V");
                });
            }
        }
    });
}

function getntsinfo(matchID, ntsDiv, isFirstLoad) {
    if (isFirstLoad) {
        var xmlurl = "/football/getXML.aspx?pooltype=all&isLiveBetting=true&match=" + matchID;
        $.ajax({
            type: "GET",
            url: xmlurl,
            //cache: false,
            dataType: "xml",
            async: true,
            success: function(xml) {
                var ntsDiv = $(xml).find("MATCH").eq(0).attr("NTS_DIV");
                setNtsInfo(matchID, ntsDiv);
            }
        });
    } else {
        setNtsInfo(matchID, ntsDiv);
    }
}

function setNtsInfo(matchID, ntsDIVstr) {
    if (betValue.length < 1 || $.isNullOrEmpty(matchID)) return;
    var $ntsinfoObj = $("#ntsinfo");
    var ntsInfoDetails = "";
    var tmpBetline = betValue[0][0].split("**");
    var tmpTeamNamesStr = $("#" + matchID + "_teamname").val();
    var hometeam = "";
    var awayteam = "";
    if (!$.isNullOrEmpty(tmpTeamNamesStr)) {
        var tmpTeamNames = tmpTeamNamesStr.split("**");
        if (tmpTeamNames.length == 2) {
            hometeam = tmpTeamNames[0] + " (" + jsHOME + ")";
            awayteam = tmpTeamNames[1] + " (" + jsAWAY + ")";
        }
    }
    if (!$.isNullOrEmpty(ntsDIVstr)) {
        var NTS_DIV = ntsDIVstr.split(",");

        for (var i = 0; i < NTS_DIV.length; i++) {
            var ntsinfo = NTS_DIV[i].split(":");
            var teamname = "";
            if (ntsinfo[2] == "home") {
                teamname = hometeam;
            } else if (ntsinfo[2] == "away") {
                teamname = awayteam;
            } else if (ntsinfo[2] == "nogoal") {
                teamname = bsnogoal;
            }
            else if (ntsinfo[2] == "RFD") {
                teamname = jsRFD;
            }
            var cntGoal = "";
            var strExtraTimeText = "";
            if (ntsinfo[0] == "ETS") {
                strExtraTimeText = " [" + jsextratime + "]";
            }
            ntsInfoDetails += "<tr><td class='cgoaldiv'>" + jsntsfstpart + cntGoalNumber(parseInt(ntsinfo[1])) + jsntslastpart + strExtraTimeText + "</td><td>" + teamname + "</td></tr>";
        }
    }
    else {
        ntsInfoDetails += "<tr><td colspan='2'>" + jsnotyetgoal + "</td></tr>";
    }

    if ($("#ntsinfo_panel").length == 0) {
        var ntshtml = "<div id='ntsinfo_panel' style='display:none;'><table><tr class='rhead'><td class='cgoal'>" + jsGOAL + "</td><td class='cgoalteam'>" + jsscoreteam + "</td></tr>";
        ntshtml += ntsInfoDetails;
        ntshtml += "</table></div>";
        $ntsinfoObj.append(ntshtml);
    }
    else {
        var newNTSHTML = "<table><tr class='rhead'><td class='cgoal'>" + jsGOAL + "</td><td class='cgoalteam'>" + jsscoreteam + "</td></tr>";
        newNTSHTML += ntsInfoDetails;
        newNTSHTML += "</table>";
        $("#ntsinfo_panel").html(newNTSHTML);
        //$("#ntsinfo_panel").show();
    }
}

//2010-04-30
//show NTS panel
function showNTSPanel() {
    var objPosition = getElementPosition(document.getElementById("ntsinfo"));
    $('#ntsinfo_panel').css({ "left": objPosition.left - 5, "top": objPosition.top - 31 });
    //var left = $("#ntsinfo").offset().left;
    //var top = $("#ntsinfo").offset().top + 20;
    //$('#ntsinfo_panel').css({ "left": left + "px", "top": top + "px" });
    $('#ntsinfo_panel').show();
    $(document).oneTime(3000, 'ntsgoalinfo', function() {
        $("#ntsinfo_panel").hide();
    });

}

//2010-06-11  , for geting ntsinfo_panel position
function getElementPosition(cnt) {
    var clip = { width: 0, height: 0, top: 0, left: 0 };
    cnt = cnt || this[0];
    if (cnt != null) {
        var p = cnt;
        while (p) {
            clip.top += p && p.offsetTop ? p.offsetTop : 0;
            clip.left += p && p.offsetLeft ? p.offsetLeft : 0;
            p = p.parentNode;
        }
    }
    return clip;
}

function cntGoalNumber(_intGoal) {
    var intGoal = parseInt(_intGoal);
    var cntGoal = "";
    if (jsLang == "EN") {
        cntGoal = "<label class=\"lblSup\">th</label>";

        if (intGoal < 11 || intGoal > 20) {
            if (intGoal % 10 == 1) {
                cntGoal = "<label class=\"lblSup\">st</label>";
            } else if (intGoal % 10 == 2) {
                cntGoal = "<label class=\"lblSup\">nd</label>";
            } else if (intGoal % 10 == 3) {
                cntGoal = "<label class=\"lblSup\">rd</label>";
            }
        }
    }
    return intGoal + cntGoal;
}

function getItemNum(matchArray, oddsType) {
    var reg = new RegExp("^(" + oddsType + ")_\\d+_(IN)$", "i");
    //var reg = /^(SPC)_\d+_(IN)$/;
    var arr = new Array();
    for (var prop in matchArray) {
        if (reg.test(prop)) {
            arr.push(matchArray[prop]);
        }
    }
    return arr;
}

function getLegIDs(matchArray) {
    var arr = new Array();
    var reg = /^(LEG_)\d+(_STATUS)$/;
    for (var prop in matchArray) {
        if (reg.test(prop)) {
            arr.push(prop.substring(4, prop.length - 7));
        }
    }
    return arr;
}

//function updateOddsDisplay(_matchID, _isStarted, _inplay, _ht_sell, _sell, _oddsType, _inplayPools, _htPools, _oldOddsSet, _newValues, _oddType_Page) {
function updateOddsDisplay(_matchID, _isStarted, _inplay, _ht_sell, _sell, _oddsType, _inplayPools, _htPools, _oldOddsSet, _newValues, _oddType_Page, _matchStage, _isMatchSell, _displayOdds, _checkBoxClass) {
    var poolsInClock = null;
    var icon_isSell = _sell;
    if (_oddType_Page == "ALL" || _oddType_Page == "INDEX") {
        icon_isSell = _isMatchSell;
    }
    else {
        _inplayPools = _oddsType;
    }

    icon_isSell = parseBoolean(icon_isSell.toString().split('_')[0]);

    var inplayPools = formatInplayOrHTPools(sortInplayPool(getInplayOrHTPools(_inplayPools, jsInplayPools), jsDefaultInplayAllOddsOrder));
    var htPools = formatInplayOrHTPools(sortInplayPool(getInplayOrHTPools(_htPools, jsHalftimePools), jsDefaultInplayAllOddsOrder));
    poolsInClock = $.isNullOrEmpty(inplayPools) ? htPools : inplayPools;


    var inplayinfo = formatInplayInfo(_matchID, _isStarted, _inplay, _ht_sell, icon_isSell, poolsInClock, _oddsType, _matchStage, _oddType_Page);
    if (_oddsType == "CRS" || _oddsType == "FCS" || _oddsType == "FGS") {
        if (inplayinfo.inplayImg != null) {
            $("#spInplay").html(inplayinfo.inplayImg);
        }
    } else if (enableInplayBettingColumn(_oddType_Page)) {
        if (inplayinfo.inplayImg != null) {
            $("#rmid" + _matchID).find("td.cinplay").html(inplayinfo.inplayImg);
        }
    }
    if (_oddsType != "CRS" && _oddsType != "FCS" && _oddsType != "FGS") {
        if (isInplayEnabled(_oddsType) && _isStarted) {
            $("#rmid" + _matchID).find("td.cesst span").html("-");
        }
    }
    if (checkIsDisplayInplayLink(_isStarted, _inplay, _ht_sell, _oddsType)) {
        var inplayLink = inplayinfo.inplayLink ? inplayinfo.inplayLink : "";
        if (_oddType_Page == "ALL") {
            if ($(".nopoolmsg").length > 0) {
                $(".nopoolmsg").eq(0).html(inplayLink);
            } else {
                $("#dContainer" + _matchID).html($("<div class=\"nopool\"></div>").append($("<div class=\"nopoolmsg\"></div>").html(inplayLink)));
            }
        }
        else if (_oddsType == "CRS" || _oddsType == "FCS" || _oddsType == "FGS") {
            $(".t" + _oddsType).remove();
            $(".footerAddslip").remove();
            if ($(".nopoolmsg").length > 0) {
                $(".nopoolmsg").eq(0).html(inplayLink);
            } else {
                $("<div class=\"nopool\"></div>").append($("<div class=\"nopoolmsg\"></div>").html(inplayLink)).appendTo("#divInplayLink");
            }
        } else {
            var colspan = 3;
            if (_oddsType == "HDC" || _oddsType == "OOE" || _oddsType == "TQL") {
                colspan = 2;
            } else if (_oddsType == "TTG") {
                colspan = 8;
            } else if (_oddsType == "HFT") {
                colspan = 9;
            }

            if ($("#rmid" + _matchID).find("td.cInplayLnk").length > 0) {
                $("#rmid" + _matchID).find("td.cInplayLnk").eq(0).html(inplayLink);
                if (_oddsType == "HIL" || _oddsType == "FHL" || _oddsType == "CHL") {
                    $("#rmid" + _matchID).find("td.tgIndMl").html("");
                }
            } else {
                $("#rmid" + _matchID).find("td.codds").remove();
                if (_oddsType == "HIL" || _oddsType == "FHL" || _oddsType == "CHL") {
                    $("#rmid" + _matchID).find("td.cline").remove();
                    $("#rmid" + _matchID).find("td.tgIndMl").html("");
                    $("#rmid" + _matchID).find("td.tgIndMl").remove();
                }
                if (_oddType_Page == "INDEX")
                    $("<td class=\"cInplayLnk\" colspan=\"" + colspan + "\"></td>").html(inplayLink).insertBefore($("#rmid" + _matchID).find("td.cnts"));
                else {
                    if (_oddType_Page == "HIL" || _oddType_Page == "FHL" || _oddType_Page == "CHL")
                        $("<td class=\"cInplayLnk\" colspan=\"" + (colspan + 1) + "\"></td>").html(inplayLink).appendTo($("#rmid" + _matchID));
                    else
                        $("<td class=\"cInplayLnk\" colspan=\"" + colspan + "\"></td>").html(inplayLink).appendTo($("#rmid" + _matchID));
                }
            }
        }
    } else {
        updateOddsSet(_oldOddsSet, _newValues, _sell, null, _displayOdds, _checkBoxClass);
    }
}

function updateSPCOddsDisplay(_matchID, _isStarted, _inplay, _ht_sell, _sell, _oddsType, _inplayPools, _htPools, _oldOddsSet,
    _newValues, _oddType_Page, _itemNum, _matchStage, _isMatchSell, _matchPoolStatus) {
    var poolsInClock = null;
    var icon_isSell = _sell;
    if (_oddType_Page == "ALL" || _oddType_Page == "INDEX") {
        icon_isSell = _isMatchSell;
    }
    else {
        _inplayPools = _oddsType;
    }

    var inplayPools = formatInplayOrHTPools(sortInplayPool(getInplayOrHTPools(_inplayPools, jsInplayPools), jsDefaultInplayAllOddsOrder));
    var htPools = formatInplayOrHTPools(sortInplayPool(getInplayOrHTPools(_htPools, jsHalftimePools), jsDefaultInplayAllOddsOrder));
    poolsInClock = $.isNullOrEmpty(inplayPools) ? htPools : inplayPools;


    var inplayinfo = formatInplayInfo(_matchID, _isStarted, _inplay, _ht_sell, icon_isSell, poolsInClock, _oddsType, _matchStage, _oddType_Page);

    if (enableInplayBettingColumn(_oddType_Page)) {
        if (inplayinfo.inplayImg != null) {
            if ($("#rspc" + _matchID + "_" + _itemNum).find("td.cinplay").length > 0)
                $("#rspc" + _matchID + "_" + _itemNum).find("td.cinplay").html(inplayinfo.inplayImg);
            else if (_inplay && _isStarted) {
                var tmpHtml = inplayinfo.inplayImg + (inplayinfo.inplayLink ? inplayinfo.inplayLink : "");
                var divName = "div_" + _matchID + "_" + _itemNum;
                $("div[name='" + divName + "']").html(tmpHtml);
            }
        }
    }
    if (_oddType_Page == "ALL")
        $("#spInplay").html(inplayinfo.inplayImg);

    if (checkIsDisplayInplayLink(_isStarted, _inplay, _ht_sell, _oddsType)) {
        var colspanM = $("#rspc" + _matchID + "_" + _itemNum).find("td.codds").length;
        var inplayLink = inplayinfo.inplayLink ? inplayinfo.inplayLink : "";
        if ($("#rspc" + _matchID + "_" + _itemNum).find("td.inplayLink").length > 0) {
            $("#rspc" + _matchID + "_" + _itemNum).find("td.inplayLink").eq(0).html(inplayLink);
        } else {
            $("#rspc" + _matchID + "_" + _itemNum).find("td.cesst").remove();
            $("#rspc" + _matchID + "_" + _itemNum).find("td.codds").remove();
            $("<td class=\"inplayLink\" style=\"text-align:left;\" colspan=\"" + (colspanM + 1) + "\"></td>").html(inplayLink).appendTo($("#rspc" + _matchID + "_" + _itemNum));
        }
        if (_oddType_Page == "ALL") {
            if ($(".nopoolmsg").length > 0) {
                $(".nopoolmsg").eq(0).html(inplayLink);
            } else {
                $("#dContainer" + _matchID).html($("<div class=\"nopool\"></div>").append($("<div class=\"nopoolmsg\"></div>").html(inplayLink)));
            }
        }
    } else {
        updateOddsSet(_oldOddsSet, _newValues, _sell, null);
    }

    var ispc_status_id = "#ispc_" + _matchID + "_" + _itemNum;
    if (_matchPoolStatus != "suspended") {
        $(ispc_status_id).hide();
    } else {
        $(ispc_status_id).show();
    }
}

function disableAllOdds(_matchID, _oddsType) {
    $("input[type='checkbox'][id^=']" + (_matchID + "_" + _oddsType) + "'").each(function() {
        $(this).attr("disabled", true);
        $(this).attr("checked", false);
    });
}

function enableInplayBettingColumn(_oddType_Page) {
    if (jsInplayBettingPages.indexOf(_oddType_Page) != -1) {
        return true;
    }
    return false;
}

function getInplayOrHTPools(_inplayPools, _enablePools) {
    if ($.isNullOrEmpty(_inplayPools) || $.isNullOrEmpty(_enablePools)) return;
    var poolsArr = new Array();
    var tmpArr = _inplayPools.split(",");
    for (var i = 0; i < tmpArr.length; i++) {
        if (_enablePools.indexOf(tmpArr[i]) != -1) {
            poolsArr.push(tmpArr[i]);
        }
    }
    return poolsArr.join(",");
}

function formatInplayInfo(_matchID, _isStarted, _inplay, _ht_sell, _sell, _inplayPools, _oddsType, _matchStage, _oddType_Page) {
    var obj = new Object();
    var link = "";
    var txt = "";
    var msg = "";
    var imgPath = footImagePath;
    var poolsArr = !$.isNullOrEmpty(_inplayPools) ? _inplayPools.split(",") : null;

    if (_isStarted) {
        if (_inplay) {
            link = "/football/odds/odds_inplay_all.aspx";
            if (_sell) {
                txt = jsAcceptBet;
                msg = jsAcceptBetNow;
                if (_matchStage.toLowerCase() == "extratime")
                    imgPath += "et_clock.gif";
                else if (_matchStage.toLowerCase() == "penaltyshootout")
                    imgPath += "pk_clock.gif";
                else
                    imgPath += "clock_on.gif";
            } else {
                txt = jsInplayAvailable;
                msg = jsInplayAvailableSoon;
                if (_matchStage.toLowerCase() == "extratime")
                    imgPath += "et_clock_off.gif";
                else if (_matchStage.toLowerCase() == "penaltyshootout")
                    imgPath += "pk_clock_off.gif";
                else
                    imgPath += "clock_off.gif";
            }
        } else if (_ht_sell) {
            link = "/football/odds/odds_halftime_all.aspx";
            if (_sell) {
                txt = jsAcceptBet;
                msg = jsAcceptHalftime;
                imgPath += "clock_half.gif";
            } else {
                txt = jsHalftimeAvailable;
                msg = jsHalftimeAvailable;
                imgPath += "icon_halftime.gif";
            }
        }
        if (_oddsType.toUpperCase() == "SPC" && _oddType_Page.toUpperCase() != "ALL") {
            obj.inplayLink = "<a href=\"/football/odds/odds_ipspc.aspx?lang=" + jsLang + "\">" + txt + "</a>";
        } else {
            obj.inplayLink = "<a href=\"" + link + "?lang=" + jsLang + "&tmatchid=" + _matchID + "\">" + txt + "</a>";
        }
    } else {
        if (_inplay) {
            msg = jsInplayAvailableSoon;
            imgPath += "clock_off.gif";
        } else if (_ht_sell) {
            msg = jsHalftimeAvailable;
            imgPath += "icon_halftime.gif";
        }
    }
    if (_inplay || _ht_sell) {
        if (poolsArr != null) {
            for (var i = 0; i < poolsArr.length; i++) {
                if (msg.indexOf(":") != -1) {
                    msg += ",\n" + poolsArr[i];
                } else {
                    msg += ":\n" + poolsArr[i];
                }
            }
        }
        if (_matchStage.toLowerCase() == "penaltyshootout" || _matchStage.toLowerCase() == "extratime") {
            msg = "";
        }
        if (_oddType_Page.toUpperCase() == "ALL")
            obj.inplayImg = "<img src=\"" + imgPath + "\" alt=\"" + msg + "\" title=\"" + msg + "\" onerror=\"errImg(this);\"/>";
        else
            obj.inplayImg = "<a href=\"javascript:goPTUrl();\"><img src=\"" + imgPath + "\" alt=\"" + msg + "\" title=\"" + msg + "\" onerror=\"errImg(this);\"/></a>";
    }

    return obj;
}

function formatInplayOrHTPools(poolsStr) {
    var arr = new Array();
    if (poolsStr != null) {
        var poolsArr = poolsStr.split(",");
        var hasNTS_ETS = (poolsStr.indexOf("NTS") >= 0 && poolsStr.indexOf("ETS") >= 0);
        for (var i = 0; i < poolsArr.length; i++) {
            var tmpPool = poolsArr[i].toUpperCase();
            var key = tmpPool;
            if (tmpPool == "ETS" && hasNTS_ETS) {
                continue;
            }
            arr.push(GetGlobalResources(key, "js"));
        }
    }
    return arr.join(",");
}

function checkIsDisplayInplayLink(_isStarted, _inplay, _ht_sell, _oddsType) {
    if (isInplayEnabled(_oddsType)) {
        if (_isStarted && (_inplay || _ht_sell)) {
            return true;
        }
    }
    return false;
}

function isInplayEnabled(_oddsType) {
    var inplayPools = jsInplayPools;
    if (inplayPools.indexOf(_oddsType) != -1) {
        return true;
    }
    return false;
}

function parseBoolean(_val) {
    if ($.isNullOrEmpty(_val)) return false;
    else {
        return _val == "true" || _val == "True" || _val == "TRUE" || _val == true;
    }
}

function updateMLRowNo(matchID, oddsType, noOfLine, chkClassName, type, enableCalBet) {
    var removedLine = false;
    if (type == "all" || type == "allup") {
        if (type == "all")
            var targetRow = $($('#d' + oddsType).find('.odds' + oddsType)[0]);
        else
            var targetRow = $('#dMix_' + matchID + '_' + oddsType).find('.odds' + oddsType + matchID);
        var oldLineNo = targetRow.find('.rmid' + oddsType).length;

        if (oldLineNo != noOfLine && oldLineNo > 0) {
            if (noOfLine > oldLineNo) { // new line added
                for (var i = (oldLineNo); i < noOfLine; i++) {
                    var sampleRow = $(targetRow.find('.rmid' + oddsType)[0]).clone();
                    sampleRow.removeClass('rAlt0 rAlt1');

                    var idPrefix = matchID + '_' + oddsType + '_';

                    sampleRow.find('#' + idPrefix + 'LINE').attr('id', idPrefix + 'LINE_' + i);
                    sampleRow.find('#' + idPrefix + 'H_c').attr('id', idPrefix + 'H_' + i + '_c');
                    sampleRow.find('#' + idPrefix + 'H_c').attr('class', chkClassName[i * 2]);
                    sampleRow.find('#' + idPrefix + 'H').attr('id', idPrefix + 'H_' + i);
                    sampleRow.find('#' + idPrefix + 'L_c').attr('id', idPrefix + 'L_' + i + '_c');
                    sampleRow.find('#' + idPrefix + 'L_c').attr('class', chkClassName[i * 2 + 1]);
                    sampleRow.find('#' + idPrefix + 'L').attr('id', idPrefix + 'L_' + i);
                    sampleRow.addClass('rAlt' + i % 2);

                    if (enableCalBet) {
                        $(sampleRow.find('a')[0]).attr('href', 'javascript:calBet(this,"' + matchID + '","' + oddsType + '","H","' + i + '");');
                        $(sampleRow.find('a')[1]).attr('href', 'javascript:calBet(this,"' + matchID + '","' + oddsType + '","L","' + i + '");');
                    }

                    targetRow.find('.tOdds').append(sampleRow);
                }
            } else { // removed line
                for (var i = (noOfLine); i < oldLineNo; i++) {
                    // if clicked checkbox included remove
                    $(targetRow.find('.rmid' + oddsType)[noOfLine]).remove();
                }
                removedLine = true;
            }
        }
    } else {
        var oldLineNo = $('.mlGoalLine' + matchID).find('.mlSubRow').length + 1;
        var targetRow = $('#rmid' + matchID);
        if (oldLineNo != (noOfLine)) {
            if (noOfLine == 1) {
                // hide tgIndMl
                targetRow.find('.tgIndMl').html("");
            } else if (oldLineNo == 1) {
                // show tgIndMl
                // check if mlBtnMinus should be shown and make the lines show
                targetRow.find('.tgIndMl').html('<span onclick="tgIndMl(' + matchID + ')" class="mlBtnPlus"></span>');
            }

            if (noOfLine > oldLineNo) { // new line added
                for (var i = (oldLineNo); i < noOfLine; i++) {
                    // add GoalLine
                    targetRow.find('.cline').find('.mlDetail').append('<div class="mlSubRow">[<span id="' + matchID + '_' + oddsType + '_LINE_' + i + '" class=""></span>]</div>');
                    targetRow.find('.mlLOdds' + matchID).append('<div class="mlSubRow"><input type="checkbox" name="chkHIL" id="' + matchID + '_' + oddsType + '_L_' + i + '_c" value="" onclick="tgTD(this);" class="' + chkClassName[i * 2] + '"><a class="oddsLink" href="javascript:calBet(this,' + matchID + ',\'' + oddsType + '\',\'L\',' + i + ');" title="' + GetGlobalResources("AllupCalculator", "js") + '"><span id="' + matchID + '_' + oddsType + '_L_' + i + '" class=""></span></a></div>');
                    targetRow.find('.mlHOdds' + matchID).append('<div class="mlSubRow"><input type="checkbox" name="chkHIL" id="' + matchID + '_' + oddsType + '_H_' + i + '_c" value="" onclick="tgTD(this);" class="' + chkClassName[i * 2 + 1] + '"><a class="oddsLink" href="javascript:calBet(this,' + matchID + ',\'' + oddsType + '\',\'H\',' + i + ');" title="' + GetGlobalResources("AllupCalculator", "js") + '"><span id="' + matchID + '_' + oddsType + '_H_' + i + '" class=""></span></a></div>');
                }
            } else { // removed line
                for (var i = (oldLineNo - 2); i >= (noOfLine - 1); i--) {
                    $(targetRow.find('.cline').find('.mlSubRow')[i]).remove();
                    $(targetRow.find('.mlLOdds' + matchID).find('.mlSubRow')[i]).remove();
                    $(targetRow.find('.mlHOdds' + matchID).find('.mlSubRow')[i]).remove();
                }
                removedLine = true;
            }
            for (var i = 1; i <= $('div.tgMl').length; i++) {
                var noOfMLAvailable = $(".cou" + i).find(".mlBtnPlus").length;
                if (noOfMLAvailable > 0) {
                    $(".mlHeader" + i).show();
                } else {
                    $(".mlHeader" + i).hide();
                }
            }
        }
    }
    return removedLine;
}
