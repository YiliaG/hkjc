/// <reference path="/info/include/js/jquery132.js" />

var formula_mixallup = new Array();
formula_mixallup[0] = "";
formula_mixallup[1] = "";
//formula_mixallup[2] = ['2X1', '2X3'];
//formula_mixallup[3] = ['3X1', '3X3', '3X4', '3X6', '3X7'];
//formula_mixallup[4] = ['4X1', '4X4', '4X5', '4X6', '4X10', '4X11', '4X14', '4X15'];
//formula_mixallup[5] = ['5X1', '5X5', '5X6', '5X10', '5X15', '5X16', '5X20', '5X25', '5X26', '5X30', '5X31'];
//formula_mixallup[6] = ['6X1', '6X6', '6X7', '6X15', '6X20', '6X21', '6X22', '6X35', '6X41', '6X42', '6X50', '6X56', '6X57', '6X62', '6X63'];
//formula_mixallup[7] = ['7X1', '7X7', '7X8', '7X21', '7X35', '7X120', '7X127'];
//formula_mixallup[8] = ['8X1', '8X8', '8X9', '8X28', '8X56', '8X70', '8X247', '8X255'];

function initMixallup(mixAllUpFormal) {
    for (var i = 0; i < mixAllUpFormal.split("|").length; i++) {
        var curkey = mixAllUpFormal.split("|")[i].split("@")[0];
        var curvalue = mixAllUpFormal.split("|")[i].split("@")[1];
        var tmpArry = new Array();
        for (var j = 0; j < curvalue.split(",").length; j++) {
            tmpArry[tmpArry.length] = curkey + "X" + curvalue.split(",")[j];
        }
        formula_mixallup[parseFloat(curkey)] = tmpArry;
    }
}

var formulaItem = new Array();
formulaItem[0] = "";
formulaItem[1] = "";
formulaItem[2] = ['12', '1#2#12'];
formulaItem[3] = ['123', '12#13#23', '12#13#23#123', '1#2#3#12#13#23', '1#2#3#12#13#23#123'];
formulaItem[4] = ['1234', '123#124#134#234', '123#124#134#234#1234', '12#13#14#23#24#34', '12#13#14#23#24#34#1#2#3#4', '123#124#134#234#1234#12#13#14#23#24#34', '1#2#3#4#123#124#134#234#12#13#14#23#24#34', '1#2#3#4#123#124#134#234#12#13#14#23#24#34#1234'];
formulaItem[5] = ['12345', '1234#1235#1245#1345#2345', '12345#1234#1235#1245#1345#2345', '12#13#14#15#23#24#25#34#35#45', '12#13#14#15#23#24#25#34#35#45#1#2#3#4#5', '12345#1234#1235#1245#1345#2345#123#124#125#134#135#145#234#235#245#345'];
formulaItem[5] = formulaItem[5].concat(['12#13#14#15#23#24#25#34#35#45#123#124#125#134#135#145#234#235#245#345', '1#2#3#4#5#12#13#14#15#23#24#25#34#35#45#123#124#125#134#135#145#234#235#245#345', '12345#1234#1235#1245#1345#2345#123#124#125#134#135#145#234#235#245#345#12#13#14#15#23#24#25#34#35#45']);
formulaItem[5] = formulaItem[5].concat(['1234#1235#1245#1345#2345#123#124#125#134#135#145#234#235#245#345#12#13#14#15#23#24#25#34#35#45#1#2#3#4#5', '12345#1234#1235#1245#1345#2345#123#124#125#134#135#145#234#235#245#345#12#13#14#15#23#24#25#34#35#45#1#2#3#4#5']);
formulaItem[6] = ['123456', '12345#12346#13456#12456#12356#23456', '123456#12345#12346#13456#12456#12356#23456', '12#13#14#15#16#23#24#25#26#34#35#36#45#46#56', '123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456', '12#13#14#15#16#23#24#25#26#34#35#36#45#46#56#1#2#3#4#5#6'];
formulaItem[6] = formulaItem[6].concat(['123456#12345#12346#13456#12456#12356#23456#1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456', '123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56']);
formulaItem[6] = formulaItem[6].concat(['123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56#1#2#3#4#5#6']);
formulaItem[6] = formulaItem[6].concat(['123456#12345#12346#13456#12456#12356#23456#1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456#123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456']);
formulaItem[6] = formulaItem[6].concat(['1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456#123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56']);
formulaItem[6] = formulaItem[6].concat(['1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456#123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56#1#2#3#4#5#6']);
formulaItem[6] = formulaItem[6].concat(['123456#12345#12346#13456#12456#12356#23456#1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456#123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56']);
formulaItem[6] = formulaItem[6].concat(['12345#12346#13456#12456#12356#23456#1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456#123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56#1#2#3#4#5#6']);
formulaItem[6] = formulaItem[6].concat(['123456#12345#12346#13456#12456#12356#23456#1234#1235#1236#1245#1246#1256#1345#1346#1356#1456#2345#2346#2356#2456#3456#123#124#125#126#134#135#136#145#146#156#234#235#236#245#246#256#345#346#356#456#12#13#14#15#16#23#24#25#26#34#35#36#45#46#56#1#2#3#4#5#6']);
formulaItem[7] = ['1234567', '123456#123457#123467#123567#124567#134567#234567', '123456#123457#123467#123567#124567#134567#234567#1234567'];
formulaItem[7] = formulaItem[7].concat(['12345#12346#12347#12356#12357#12367#12456#12457#12467#12567#13456#13457#13467#13567#14567#23456#23457#23467#23567#24567#34567']);
formulaItem[7] = formulaItem[7].concat(['1234#1235#1236#1237#1245#1246#1247#1256#1257#1267#1345#1346#1347#1356#1357#1367#1456#1457#1467#1567#2345#2346#2347#2356#2357#2367#2456#2457#2467#2567#3456#3457#3467#3567#4567']);
formulaItem[7] = formulaItem[7].concat(['12#13#14#15#16#17#23#24#25#26#27#34#35#36#37#45#46#47#56#57#67#123#124#125#126#127#134#135#136#137#145#146#147#156#157#167#234#235#236#237#245#246#247#256#257#267#345#346#347#356#357#367#456#457#467#567#1234#1235#1236#1237#1245#1246#1247#1256#1257#1267#1345#1346#1347#1356#1357#1367#1456#1457#1467#1567#2345#2346#2347#2356#2357#2367#2456#2457#2467#2567#3456#3457#3467#3567#4567#12345#12346#12347#12356#12357#12367#12456#12457#12467#12567#13456#13457#13467#13567#14567#23456#23457#23467#23567#24567#34567#123456#123457#123467#123567#124567#134567#234567#1234567']);
formulaItem[7] = formulaItem[7].concat(['1#2#3#4#5#6#7#12#13#14#15#16#17#23#24#25#26#27#34#35#36#37#45#46#47#56#57#67#123#124#125#126#127#134#135#136#137#145#146#147#156#157#167#234#235#236#237#245#246#247#256#257#267#345#346#347#356#357#367#456#457#467#567#1234#1235#1236#1237#1245#1246#1247#1256#1257#1267#1345#1346#1347#1356#1357#1367#1456#1457#1467#1567#2345#2346#2347#2356#2357#2367#2456#2457#2467#2567#3456#3457#3467#3567#4567#12345#12346#12347#12356#12357#12367#12456#12457#12467#12567#13456#13457#13467#13567#14567#23456#23457#23467#23567#24567#34567#123456#123457#123467#123567#124567#134567#234567#1234567']);
formulaItem[8] = ['12345678', '1234567#1234568#1234578#1234678#1235678#1245678#1345678#2345678', '12345678#1234567#1234568#1234578#1234678#1235678#1245678#1345678#2345678', '123456#123457#123458#123467#123468#123478#123567#123568#123578#123678#124567#124568#124578#124678#125678#134567#134568#134578#134678#135678#145678#234567#234568#234578#234678#235678#245678#345678'];
formulaItem[8] = formulaItem[8].concat(['12345#12346#12347#12348#12356#12357#12358#12367#12368#12378#12456#12457#12458#12467#12468#12478#12567#12568#12578#12678#13456#13457#13458#13467#13468#13478#13567#13568#13578#13678#14567#14568#14578#14678#15678#23456#23457#23458#23467#23468#23478#23567#23568#23578#23678#24567#24568#24578#24678#25678#34567#34568#34578#34678#35678#45678', '1234#1235#1236#1237#1238#1245#1246#1247#1248#1256#1257#1258#1267#1268#1278#1345#1346#1347#1348#1356#1357#1358#1367#1368#1378#1456#1457#1458#1467#1468#1478#1567#1568#1578#1678#2345#2346#2347#2348#2356#2357#2358#2367#2368#2378#2456#2457#2458#2467#2468#2478#2567#2568#2578#2678#3456#3457#3458#3467#3468#3478#3567#3568#3578#3678#4567#4568#4578#4678#5678']);
formulaItem[8] = formulaItem[8].concat(['12#13#14#15#16#17#18#23#24#25#26#27#28#34#35#36#37#38#45#46#47#48#56#57#58#67#68#78#123#124#125#126#127#128#134#135#136#137#138#145#146#147#148#156#157#158#167#168#178#234#235#236#237#238#245#246#247#248#256#257#258#267#268#278#345#346#347#348#356#357#358#367#368#378#456#457#458#467#468#478#567#568#578#678#12345#12346#12347#12348#12356#12357#12358#12367#12368#12378#12456#12457#12458#12467#12468#12478#12567#12568#12578#12678#13456#13457#13458#13467#13468#13478#13567#13568#13578#13678#14567#14568#14578#14678#15678#23456#23457#23458#23467#23468#23478#23567#23568#23578#23678#24567#24568#24578#24678#25678#34567#34568#34578#34678#35678#45678#1234#1235#1236#1237#1238#1245#1246#1247#1248#1256#1257#1258#1267#1268#1278#1345#1346#1347#1348#1356#1357#1358#1367#1368#1378#1456#1457#1458#1467#1468#1478#1567#1568#1578#1678#2345#2346#2347#2348#2356#2357#2358#2367#2368#2378#2456#2457#2458#2467#2468#2478#2567#2568#2578#2678#3456#3457#3458#3467#3468#3478#3567#3568#3578#3678#4567#4568#4578#4678#5678#12345678#1234567#1234568#1234578#1234678#1235678#1245678#1345678#2345678#123456#123457#123458#123467#123468#123478#123567#123568#123578#123678#124567#124568#124578#124678#125678#134567#134568#134578#134678#135678#145678#234567#234568#234578#234678#235678#245678#345678']);
formulaItem[8] = formulaItem[8].concat(['1#2#3#4#5#6#7#8#12#13#14#15#16#17#18#23#24#25#26#27#28#34#35#36#37#38#45#46#47#48#56#57#58#67#68#78#123#124#125#126#127#128#134#135#136#137#138#145#146#147#148#156#157#158#167#168#178#234#235#236#237#238#245#246#247#248#256#257#258#267#268#278#345#346#347#348#356#357#358#367#368#378#456#457#458#467#468#478#567#568#578#678#12345#12346#12347#12348#12356#12357#12358#12367#12368#12378#12456#12457#12458#12467#12468#12478#12567#12568#12578#12678#13456#13457#13458#13467#13468#13478#13567#13568#13578#13678#14567#14568#14578#14678#15678#23456#23457#23458#23467#23468#23478#23567#23568#23578#23678#24567#24568#24578#24678#25678#34567#34568#34578#34678#35678#45678#1234#1235#1236#1237#1238#1245#1246#1247#1248#1256#1257#1258#1267#1268#1278#1345#1346#1347#1348#1356#1357#1358#1367#1368#1378#1456#1457#1458#1467#1468#1478#1567#1568#1578#1678#2345#2346#2347#2348#2356#2357#2358#2367#2368#2378#2456#2457#2458#2467#2468#2478#2567#2568#2578#2678#3456#3457#3458#3467#3468#3478#3567#3568#3578#3678#4567#4568#4578#4678#5678#12345678#1234567#1234568#1234578#1234678#1235678#1245678#1345678#2345678#123456#123457#123458#123467#123468#123478#123567#123568#123578#123678#124567#124568#124578#124678#125678#134567#134568#134578#134678#135678#145678#234567#234568#234578#234678#235678#245678#345678']);





//check all selected matches for mix all up
function mix_nextstep(ev) {
    cancelPropagation(ev);

    var $chkobjs = $("input[name='chksel']:checked");
    var selectedMatches = "";
    $chkobjs.each(function() {
        selectedMatches += $(this).attr("value") + ",";
    });

    if ($chkobjs.length > 1) {
        if ($chkobjs.length > 8) {
            alert(jsMixallOver8);
            return false;
        }
        else {
            selectedMatches = selectedMatches.substring(0, selectedMatches.length - 1);
            url = "odds_mixallup_all.aspx?lang=" + jsLang + "&matchidstr=" + selectedMatches;
            location.href = url;
        }
    }
    else {
        alert(jsMixallNoSelction);
        return false;
    }
}

//load default odds selection for mix all up
function loadDefaultOdds() {
    $.ajaxSetup({
        beforeSend: function(xhr) { xhr.setRequestHeader("Cache-Control", "no-cache"); }
    });
    $("#divLoadMix").show();
    var chkMixallup = $.cookie("chkMixallup");

    var mIDs = tmatchids.split(",");

    if (mIDs.length > 0) {
        for (var i = 0; i < mIDs.length; i++) {
            var matchid = mIDs[i];

            if (chkMixallup != "" && chkMixallup != null) {
                var chkOdds = chkMixallup.split(",");
                for (j = 0; j < chkOdds.length; j++) {
                    $("input[id ='chksel" + chkOdds[j] + "']").attr("checked", true);
                    LoadOddsContent(matchid, chkOdds[j]);
                }
            }
            else {
                $("#chkselHAD").attr("checked", true);
                LoadOddsContent(matchid, "HAD");
            }
        }
    }
    $("#divLoadMix").hide();
}

function loadShortCutDefaultOdds(noOfMatches) {
    $.ajaxSetup({
        beforeSend: function(xhr) { xhr.setRequestHeader("Cache-Control", "no-cache"); }
    });

    var mIDs = tmatchids.split(",");

    if (mIDs.length > 0) {
        if (noOfMatches < 0)
            noOfMatches = 0;
        /*
        for (var i = 0; (i < mIDs.length && i < noOfMatches); i++) {
        LoadShortCutOddsContent(mIDs[i], betTypes);
        }                */
        for (var i = noOfMatches; i < mIDs.length; i++) {
            tgDay(mIDs[i], betTypes);
        }
        LoadShortCutOddsContent(mIDs.splice(0, noOfMatches).toString(), betTypes);
        /*
        LoadShortCutOddsContent(mIDs[0], betTypes);
        for (var i = 1; i < mIDs.length; i++) {
        tgDay(mIDs[i], betTypes);
        }    */
    }
}

//toggle odds content for mix all up
function toggleMixContent() {
    $("#divLoadMix").show();
    var upd = function() {
        var mIDs = tmatchids.split(",");
        var checkedOTypes = new Array();
        if (mIDs.length > 0) {
            for (var i = 0; i < mIDs.length; i++) {
                var matchid = mIDs[i];
                var $chkobjs = $("input[name='chkoddsel']:checked");
                $chkobjs.each(function() {
                    var otype = $(this).attr("value");
                    if ($("." + matchid + "_inplay").length > 1) {
                        //no need to load inplay panel again
                        $("#divLoadMix").hide();
                    }
                    else {
                        LoadOddsContent(matchid, otype);
                    }
                });
                var $unchkobjs = $("input[name='chkoddsel']:not(:checked)");
                $unchkobjs.each(function() {
                    var otype = $(this).attr("value");

                    var $dobj = $("#dMix_" + matchid + "_" + otype);

                    //uncheck the checked odds
                    $dobj.find(".codds input:checked").each(function() {
                        $(this).click();
                    });

                    if ($dobj.html() != "") {
                        $dobj.hide();
                    }
                });
            }
        }
        //add to checked odds type array
        $("input[name='chkoddsel']:checked").each(function() {
            var otype = $(this).attr("value");
            checkedOTypes[checkedOTypes.length] = otype;
        });

        //save checked odds types in cookie
        $.cookie("chkMixallup", checkedOTypes);
        if (checkedOTypes.length <= 0) {
            $("#divLoadMix").hide();
        }
    };
    $.queue.add(upd, this, 10);
}

//load odds content
function LoadOddsContent(tmatchid, toddstype) {

    var contentid = "#dMix_" + tmatchid + "_" + toddstype;
    var ourl = "display_odds.aspx?tmatchid=" + tmatchid + "&lang=" + jsLang + "&oddsTypeToShow=" + toddstype;

    var $dobj = $(contentid);

    if ($dobj.html() != "") {
        $dobj.show();
    }
    else {
        $dobj.load(ourl, function() {
            if ($("." + tmatchid + "_inplay").length > 0) {
                var $objs = $("div[id*='dMix_" + tmatchid + "_']");
                $objs.hide();
                var $objInplay = $("div[id*='dMix_" + tmatchid + "_Inplay']");
                $objInplay.show();
                $objInplay.html($objs.find(":nth-child(1)").html());
            }
        });
    }
    $("#divLoadMix").hide();
}

function LoadShortCutOddsContent(tmatchid, toddstype) {
    var arrtoddstype = toddstype.split(',');
    var arrtmatchid = tmatchid.toString().split(',');
    var contentid = [];
    var checkID = [];
    var ourl = "display_odds_sc.aspx?tmatchid=" + tmatchid + "&lang=" + jsLang + "&oddsTypeToShow=" + toddstype;
    for (var i = 0; i < arrtmatchid.length; i++) {
        contentid[i] = "#dMix_" + arrtmatchid[i];
        checkID[i] = "#dMix_" + arrtmatchid[i] + "_" + arrtoddstype[0];
    }

    var $dobj = $(contentid[0]);


    if ($('dMix_' + arrtmatchid[0] + '_Inplay').html() != "" && $(checkID[0]).length > 0) {
        $dobj.show();
    } else {
        $dobj.hide();
        $dobj.load(ourl, function() {
            $('.tgCoupon .spBtnMinus').remove();
            $('.tgCoupon').attr('onclick', '').unbind('click');
            $('[id=dContainer]').remove();

            for (var j = 0; j < arrtmatchid.length; j++) {
                if ($("." + arrtmatchid[j] + "_inplay").length > 0) {
                    var $objs = $("div[id*='dMix_" + arrtmatchid[j] + "_']");
                    $objs.hide();
                    var $objInplay = $("div[id*='dMix_" + arrtmatchid[j] + "_Inplay']");
                    $objInplay.show();
                    $objInplay.html($objs.find(":nth-child(1)").html());
                } else {
                    for (var i = 0; i < arrtoddstype.length; i++) {
                        $('#dContainer' + arrtmatchid[j]).find('#d' + arrtoddstype[i]).wrap('<div id="dMix_' + arrtmatchid[j] + '_' + arrtoddstype[i] + '"><div id="dContainer' + arrtmatchid[j] + '"></div></div>');
                        var targetObj = $('#dContainer' + arrtmatchid[j]).find('#dMix_' + arrtmatchid[j] + '_' + arrtoddstype[i]);
                        $('#dMix_' + arrtmatchid[j]).append(targetObj);
                    }
                }
                if (j > 0) {
                    var targetMatchObj = $('#dMix' + arrtmatchid[j]);
                    $(contentid[j]).append(targetMatchObj);
                    $('#dMix_' + arrtmatchid[j] + '_Inplay').append($('#dContainer' + arrtmatchid[j]));
                } else {
                    $('#dContainer' + arrtmatchid[j]).wrap('<div id="dMix_' + arrtmatchid[j] + '_Inplay"></div>');
                }
                if ($("." + arrtmatchid[j] + "_inplay").length == 0) {
                    $('#dMix_' + arrtmatchid[j] + '_Inplay').hide().html('');
                }
            }
            $dobj.show();
        });
    }
}

//toggle selected mixallup
function toggleMix(_this, _cellclass) {
    var $chkObj = $(_this);

    if ($chkObj.attr("checked")) {
        $chkObj.parent().siblings("." + _cellclass).each(function() {
            $chkObj.parent().css("background-color", cellhighlightColor);
            $(this).css("background-color", cellhighlightColor);
            //$chkObj.parent().hide();
        });
    }
    else {
        $chkObj.parent().siblings("." + _cellclass).each(function() {
            $chkObj.parent().css("background-color", "");
            $(this).css("background-color", "");
        });
    }
}

//toggle mixall up formula
function mixFormula(_chkObj, _matchID, _oddsType, _oddsOption) {
    //alert(_matchID + " " + _oddsType + " " + _oddsOption);
    var selectedMatches = new Array();
    var selectedFormula = $("#selFormulaTop").val();
    $("#dMixMatches .dOdds input:checked").each(function() {
        var idStr = $(this).attr("id").split("_");
        var matchID = idStr[0];
        var oType = idStr[1];
        var optionKey = idStr[2];

        //add selected matches
        if ($.inArray(matchID, selectedMatches) == -1) {
            selectedMatches[selectedMatches.length] = matchID;
        }
    });

    //uncheck other selections of the same match
    uncheckElementOfSameOddsType(_chkObj, _matchID, _oddsType);
    if (selectedMatches.length > 1) {
        //only render if selected matches are different from no. of legs
        if (selectedFormula != null) {
            if (selectedFormula.toLowerCase().split("x")[0] != selectedMatches.length) {
                renderMixDropDown(selectedMatches.length);
            }
        } else {
            renderMixDropDown(selectedMatches.length);
        }
    }
    else {
        $("#selFormulaTop").children().remove();
        $("#selFormulaBottom").children().remove();
    }
}

//uncheck other selections of the same match
function uncheckElementOfSameOddsType(_selfObj, _matchID, _oddsType) {
    if ($(_selfObj).attr("checked")) {
        $("div[id *='dMix_" + _matchID + "'] input:checked").each(function() {
            if ($(_selfObj).attr("id") != $(this).attr("id")) {
                var idStr = $(this).attr("id").split("_");
                var matchID = idStr[0];
                var oType = idStr[1];
                var optionKey = idStr[2];

                if (oType != _oddsType) { // || oType == "HIL" || oType == "CHL" || oType == "FHL") {
                    if ($(this).attr("checked")) {
                        $(this).attr("checked", false);
                        if (oType == "CRS" || oType == "FCS" || oType == "FGS") {
                            $(this).parent().removeClass("checkedOdds");
                            $(this).parent().css("background-color", "");
                            var divId = "dMix_" + matchID + "_" + oType;

                            var $goalParent = $("#s" + _matchID + "_" + (oType != "FCS" ? optionKey : (optionKey + "_FCS"))).parent();
                            $goalParent.removeClass("checkedOdds");
                            $goalParent.css("background-color", "");
                        }
                        else {
                            $(this).parent().parent().removeClass("checkedOdds");
                        }
                        var toBeRemove = $(this).attr('class');
                        clickedCheckBox = jQuery.grep(clickedCheckBox, function(value) {
                            return value != toBeRemove;
                        });
                    }
                }
            }
        });
    }
}

//render formula dropdown
function renderMixDropDown(_noOfMatches) {
    var formulaObj = formula_mixallup[_noOfMatches];
    var $selFormulaTop = $("#selFormulaTop");
    var $selFormulaBottom = $("#selFormulaBottom");

    $selFormulaTop.children().remove();
    $selFormulaBottom.children().remove();

    $.each(formulaObj, function(val, text) {
        $selFormulaTop.append($('<option></option>').val(text).html(text));
        $selFormulaBottom.append($('<option></option>').val(text).html(text));
    });
}

//reset
function resetDivCal(_type, ev) {
    cancelPropagation(ev);
    $("#mcBetTop").html("-");
    $("#mcUnitBetTop").html("-");
    $("#mcTotInvTop").html("-");
    $("#mcDividTop").html("-");
    $("#mcNetRtnTop").html("-");

    $("#mcBetBottom").html("-");
    $("#mcUnitBetBottom").html("-");
    $("#mcTotInvBottom").html("-");
    $("#mcDividBottom").html("-");
    $("#mcNetRtnBottom").html("-");
    //$("#txtUnitbetTop").val("10");
    //get betslip unit bet amount
    $("#txtUnitbetTop").val(getDefaultAmount("ALUPX"));
    $("#txtUnitbetBottom").val(getDefaultAmount("ALUPX"));
}

//valid unitbet
function calculateBet(_type, ev, _updateCal) {
    cancelPropagation(ev);
    //show cal when calculate button is pressed
    if (!$.isNullOrEmpty(ev)) {
        $("#dMixCalValue" + _type).show();
        $("#dMixCal" + _type + " span.spMixBtn").addClass("spMixBtnMinus");
        $("#dMixCal" + _type + " span.spMixBtn").removeClass("spMixBtnPlus");
    }
    var $inputObj = $("#txtUnitbet" + _type);
    var $selFormulaTopObj = $("#selFormulaTop");

    if (_type == "Top") {
        $("#txtUnitbetBottom").val($inputObj.val());
    } else if (_type == "Bottom") {
        $("#txtUnitbetTop").val($inputObj.val());
    }

    //only check integers and unibet >= $10
    if ($.isInt($inputObj.val()) && parseInt($inputObj.val()) >= 10) {

        if (!$.isNullOrEmpty($selFormulaTopObj.val())) {

            //get formula item
            var formulaItem = null;
            for (i = 0; i < formula_mixallup.length; i++) {
                if (formula_mixallup[i].toString().indexOf($selFormulaTopObj.val()) > -1) {
                    formulaItem = formula_mixallup[i];
                }
            }

            //get checked odds
            var oddsObjs = $("input:checked");
            var betLineObjs = new Array();

            for (i = 0; i < oddsObjs.length; i++) {
                oddsValue = $(oddsObjs[i]).siblings(".oddsLink").html();
                if (oddsValue != null) {
                    var idStr = $(oddsObjs[i]).attr("id").split("_");
                    var isTournament = (idStr[0] == "tourn");

                    if (!isTournament) {
                        var matchID = idStr[0];
                        var oType = idStr[1];
                        var optionKey = idStr[2];
                        var itemNo = "";
                        if (oType == "SPC") {
                            itemNo = idStr[3];
                        }

                        var betLine = new BetLine(matchID, oType, optionKey, itemNo, null, false);
                        betLineObjs[betLineObjs.length] = betLine;
                    }
                }
            }

            //group betlines by matchobjs
            var matchOddsObjs = GroupBetLineObjsByType(betLineObjs, "MATCH");

            //get no selection Array
            var noSelArr = new Array();
            var maxOddsArr = new Array();
            var minOddsArr = new Array();

            for (i = 0; i < matchOddsObjs.length; i++) {
                noSelArr[noSelArr.length] = matchOddsObjs[i].length - 1;

                var maxodds = parseFloat(matchOddsObjs[i][1].ODDS);
                var minodds = parseFloat(matchOddsObjs[i][1].ODDS);
                for (j = 1; j < matchOddsObjs[i].length; j++) {
                    if (parseFloat(matchOddsObjs[i][j].ODDS) > maxodds) {
                        maxodds = parseFloat(matchOddsObjs[i][j].ODDS);
                    }
                    if (parseFloat(matchOddsObjs[i][j].ODDS) < minodds) {
                        minodds = parseFloat(matchOddsObjs[i][j].ODDS);
                    }
                }
                maxOddsArr[maxOddsArr.length] = maxodds;
                minOddsArr[minOddsArr.length] = minodds;
            }

            //call multi sel and update values
            calMultiSel(noSelArr, maxOddsArr, minOddsArr, $selFormulaTopObj.val().toLowerCase(), parseInt($inputObj.val()), _updateCal);
        }
    }
    else {
        alert(jsunitbeterror);
    }
}

function calculateBet2(_type, _updateCal) {
    var $inputObj = $("#txtUnitbet" + _type);
    var $selFormulaTopObj = $("#selFormulaTop");

    if (_type == "Top") {
        $("#txtUnitbetBottom").val($inputObj.val());
    } else if (_type == "Bottom") {
        $("#txtUnitbetTop").val($inputObj.val());
    }

    //only check integers and unibet >= $10
    if ($.isInt($inputObj.val()) && parseInt($inputObj.val()) >= 10) {

        if (!$.isNullOrEmpty($selFormulaTopObj.val())) {

            //get formula item
            var formulaItem = null;
            for (var i = 0; i < formula_mixallup.length; i++) {
                if (formula_mixallup[i].toString().indexOf($selFormulaTopObj.val()) > -1) {
                    formulaItem = formula_mixallup[i];
                }
            }

            //get checked odds
            var oddsObjs = $("input:checked");
            var betLineObjs = new Array();

            for (var i = 0; i < oddsObjs.length; i++) {
                oddsValue = $(oddsObjs[i]).siblings(".oddsLink").html();
                if (oddsValue != null) {
                    var idStr = $(oddsObjs[i]).attr("id").split("_");
                    var isTournament = (idStr[0] == "tourn");

                    if (!isTournament) {
                        var matchID = idStr[0];
                        var oType = idStr[1];
                        var optionKey = idStr[2];
                        var itemNo = "";
                        if (oType == "SPC" || ((oType == "HIL" || oType == "CHL" || oType == "FHL") && idStr.length > 4)) {
                            itemNo = idStr[3];
                        }

                        var betLine = new BetLine(matchID, oType, optionKey, itemNo, null, false);
                        betLineObjs[betLineObjs.length] = betLine;
                    }
                }
            }

            //group betlines by matchobjs
            var matchOddsObjs = GroupBetLineObjsByType(betLineObjs, "MATCH");

            //get no selection Array
            var noSelArr = new Array();
            var maxOddsArr = new Array();
            var minOddsArr = new Array();

            for (var i = 0; i < matchOddsObjs.length; i++) {
                noSelArr[noSelArr.length] = matchOddsObjs[i].length - 1;

                if (matchOddsObjs[i][1].PoolTypeKey != "HIL" && matchOddsObjs[i][1].PoolTypeKey != "CHL" && matchOddsObjs[i][1].PoolTypeKey != "FHL") {
                    var maxodds = parseFloat(matchOddsObjs[i][1].ODDS);
                    var minodds = parseFloat(matchOddsObjs[i][1].ODDS);
                    for (var j = 1; j < matchOddsObjs[i].length; j++) {
                        if (parseFloat(matchOddsObjs[i][j].ODDS) > maxodds) {
                            maxodds = parseFloat(matchOddsObjs[i][j].ODDS);
                        }
                        if (parseFloat(matchOddsObjs[i][j].ODDS) < minodds) {
                            minodds = parseFloat(matchOddsObjs[i][j].ODDS);
                        }
                    }
                } else {
                    // sort goalline
                    tmpMatchOddsObj = matchOddsObjs[i].concat();
                    tmpMatchOddsObj.shift();
                    tmpMatchOddsObj.sort(function(a, b) {
                        if (a.GOALLINE == b.GOALLINE)
                            return 0;
                        else {
                            if (parseFloat(a.GOALLINE.split('http://bet.hkjc.com/')[0]) < parseFloat(b.GOALLINE.split('http://bet.hkjc.com/')[0]))
                                return -1;
                            else if (parseFloat(a.GOALLINE.split('http://bet.hkjc.com/')[0]) > parseFloat(b.GOALLINE.split('http://bet.hkjc.com/')[0]))
                                return 1;
                            else
                                return (parseFloat((a.GOALLINE + "/0").split('http://bet.hkjc.com/')[1]) < parseFloat((b.GOALLINE + "/0").split('http://bet.hkjc.com/')[1])) ? -1 : 1;
                        }
                    });

                    // find all possible sum of odds, only H>L
                    var maxodds = parseFloat(matchOddsObjs[i][1].ODDS);
                    var minodds = parseFloat(matchOddsObjs[i][1].ODDS);

                    // all Low odds
                    var lOdds = 0;
                    for (var j = 0; j < tmpMatchOddsObj.length; j++) {
                        if (tmpMatchOddsObj[j].OptionKey == "L")
                            lOdds += parseFloat(tmpMatchOddsObj[j].ODDS);
                    }

                    maxodds = lOdds;

                    // cross
                    var hOdds = 0;
                    for (var j = 0; j < tmpMatchOddsObj.length; j++) {
                        if (tmpMatchOddsObj[j].OptionKey == "H") {
                            hOdds += parseFloat(tmpMatchOddsObj[j].ODDS);
                        }
                        var tmpOdds = 0;
                        for (var k = j + 1; k < tmpMatchOddsObj.length; k++) {
                            if (tmpMatchOddsObj[k].GOALLINE != tmpMatchOddsObj[j].GOALLINE && tmpMatchOddsObj[k].OptionKey == "L") {
                                tmpOdds += parseFloat(tmpMatchOddsObj[k].ODDS);
                            }
                        }
                        if ((hOdds + tmpOdds) > maxodds)
                            maxodds = hOdds + tmpOdds;
                    }
                }
                maxOddsArr[maxOddsArr.length] = maxodds;
                minOddsArr[minOddsArr.length] = minodds;
            }

            //call multi sel and update values
            calMultiSel(noSelArr, maxOddsArr, minOddsArr, $selFormulaTopObj.val().toLowerCase(), parseInt($inputObj.val()), _updateCal);
        } else {
            $("#mcBetTop").html("-");
            $("#mcTotInvTop").html("-");
            $("#mcDividTop").html("-");
            $("#mcNetRtnTop").html("-");

            $("#mcBetBottom").html("-");
            $("#mcTotInvBottom").html("-");
            $("#mcDividBottom").html("-");
            $("#mcNetRtnBottom").html("-");
        }
    }
    else {
        alert(jsunitbeterror);
        return false;
    }
    return true;
}

var mixallupselections = 0;

function calMultiSel(noOfSelArr, maxOddsArr, minOddsArr, allupFormula, tmpUnitBet, _updateDivCal) {
    var noofLeg = allupFormula.split("x")[0];
    var selIdx = parseInt($("#selFormulaTop").attr("selectedIndex"));
    var allSelection = formulaItem[noofLeg][selIdx];

    var totalSel = 0;
    var tmpSel = 0;
    var tmpMaxDiv = 0;
    var estMaxDiv = 0;
    var tmpMinDiv = 0;
    var estMinDiv = 0;

    for (var i = 0; i < allSelection.split("#").length; i++) {    //allSelection == 1#2#3#12#13#23#123
        tmpSel = 1;
        tmpMaxDiv = 1;
        tmpMinDiv = 1;
        tvalue = allSelection.split("#")[i];  //tvalue == 1, tvalue == 2, tvalue == 3, tvalue == 12

        if (tvalue.length == 1) {
            tmpSel = noOfSelArr[tvalue - 1];
            tmpMaxDiv = maxOddsArr[tvalue - 1];
            tmpMinDiv = minOddsArr[tvalue - 1];
        } else {
            for (var j = 0; j < tvalue.length; j++) {
                tmpSel *= noOfSelArr[tvalue.substr(j, 1) - 1];
                tmpMaxDiv *= maxOddsArr[tvalue.substr(j, 1) - 1];
                tmpMinDiv *= minOddsArr[tvalue.substr(j, 1) - 1];
            }
        }
        totalSel += tmpSel;
        estMaxDiv += tmpMaxDiv;
        estMinDiv += tmpMinDiv;
    }

    estMaxDiv *= tmpUnitBet;
    estMinDiv *= tmpUnitBet;

    //alert(FormatNumber);
    mixallupselections = totalSel;

    if (_updateDivCal) {
        $("#mcBetTop").html(totalSel);
        $("#mcUnitBetTop").html("$" + tmpUnitBet);
        $("#mcTotInvTop").html("$" + tmpUnitBet * totalSel);
        $("#mcDividTop").html("$" + FormatNumber(estMaxDiv, 1, false, false, true));
        var netRtn = Math.round(estMaxDiv * 10) / 10 - tmpUnitBet * totalSel;
        $("#mcNetRtnTop").html("$" + FormatNumber(netRtn, 1, false, false, true));

        $("#mcBetBottom").html(totalSel);
        $("#mcUnitBetBottom").html("$" + tmpUnitBet);
        $("#mcTotInvBottom").html("$" + tmpUnitBet * totalSel);
        $("#mcDividBottom").html("$" + FormatNumber(estMaxDiv, 1, false, false, true));
        $("#mcNetRtnBottom").html("$" + FormatNumber(netRtn, 1, false, false, true));
    }
}


function updateSelFormula(_type) {
    var topSelVal = $("#selFormulaTop").val();
    var bottomSelVal = $("#selFormulaBottom").val();

    if (_type == "Top") {
        $("#selFormulaTop").val(bottomSelVal);
    } else if (_type == "Bottom") {
        $("#selFormulaBottom").val(topSelVal);
    }
}