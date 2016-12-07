/// <reference path="/info/include/js/jquery132.js" />



//betslip object
//start
function BetLine(_matchID, _poolType, _optionKey, _SPCItemNo, _tournObj, _isSBF, _checkboxID) {
    this.PoolType = _poolType;
    this.MatchID = _matchID;
    this.OptionKey = _optionKey;
    this.CHECKBOXID = "";
    if (!$.isNullOrEmpty(_checkboxID)) {
        this.CHECKBOXID = _checkboxID;
    }

    this.PoolTypeKey = _poolType;
    if (!$.isNullOrEmpty(_SPCItemNo) && (_poolType != "HIL" && _poolType != "CHL" && _poolType != "FHL")) {
        this.PoolTypeKey = _poolType + "_" + _SPCItemNo;
    }

    var _isTourn = false;
    //is tournament
    var $tournObj = $(_tournObj);
    if ($tournObj != null && $tournObj != undefined) {
        if ($tournObj.attr("id") != null && $tournObj.attr("id") != null) {
            _isTourn = true;
        }
    }

    this.IsTournament = _isTourn;

    //get raw betline from arrays
    function GetRawBetLine() {
        if (_isTourn) { return ""; }
        try {
            //handle SPC, betline doesn't contain matchID, find from matchIDArr
            if (_poolType == "SPC") {
                var matchIdx = -1;

                // for (var i = 0; i < matchIDArr.length; i++) {
                for (var i = 0; i < betValue.length; i++) {
                    if (betValue[i][0].indexOf(_matchID) > -1 && betValue[i][0].indexOf(_poolType) > -1) {
                        //search in all betlines to retrieve the corresponding item key

                        if (betValue[i][0].split("**").length > 6) {
                            var tempItemNo = betValue[i][0].split("**")[6];
                            if (removeLeadingZero(tempItemNo) == removeLeadingZero(_SPCItemNo)) {
                                matchIdx = i;
                                break;
                            }
                        }
                    }
                }
                if (matchIdx != -1) {
                    return betValue[matchIdx][0];
                }

            }
            else {
                //handle other pool types
                for (var i = 0; i < betValue.length; i++) {
                    if (betValue[i][0].indexOf(_poolType) > -1 && betValue[i][0].indexOf(_matchID) > -1) {
                        if ((_poolType == "HIL" || _poolType == "CHL" || _poolType == "FHL") && _SPCItemNo != "") {
                            return betValue[i][parseInt(_SPCItemNo)];
                        } else {
                            return betValue[i][0];
                        }
                    }
                }
            }
        }
        catch (e) {
            //alert("GetRawBetLine : " + e.message);
        }
        return "";
    }

    var rawBetLine = GetRawBetLine();

    this.RawBetLine = rawBetLine;

    //get raw bet item from raw bet line
    function GetRawBetItem() {
        if (_isTourn) { return ""; }
        try {
            var rawBetLineItems = rawBetLine.split(",");
            switch (_poolType) {
                case "HAD": case "FHA": case "HHA":
                    if (_optionKey == "H") {
                        return rawBetLineItems[1];
                    }
                    if (_optionKey == "D") {
                        return rawBetLineItems[2];
                    }
                    if (_optionKey == "A") {
                        return rawBetLineItems[3];
                    }
                    break;
                case "FTS": // case "FTS":
                    if (_optionKey == "H") {
                        return rawBetLineItems[1];
                    }
                    if (_optionKey == "N") {
                        return rawBetLineItems[2];
                    }
                    if (_optionKey == "A") {
                        return rawBetLineItems[3];
                    }
                    break;
                case "HDC": case "TQL":
                    if (_optionKey == "H") {
                        return rawBetLineItems[1];
                    }
                    if (_optionKey == "A") {
                        return rawBetLineItems[2];
                    }
                    break;
                case "HIL":
                case "CHL":
                case "FHL":
                    if (_optionKey == "H") {
                        return rawBetLineItems[1];
                    }
                    if (_optionKey == "L") {
                        return rawBetLineItems[2];
                    }
                    break;
                case "OOE":
                    if (_optionKey == "O") {
                        return rawBetLineItems[1];
                    }
                    if (_optionKey == "E") {
                        return rawBetLineItems[2];
                    }
                    break;
                case "HFT":
                    if (_optionKey == "HH") {
                        return rawBetLineItems[1];
                    } else if (_optionKey == "HD") {
                        return rawBetLineItems[2];
                    } else if (_optionKey == "HA") {
                        return rawBetLineItems[3];
                    } else if (_optionKey == "DH") {
                        return rawBetLineItems[4];
                    } else if (_optionKey == "DD") {
                        return rawBetLineItems[5];
                    } else if (_optionKey == "DA") {
                        return rawBetLineItems[6];
                    } else if (_optionKey == "AH") {
                        return rawBetLineItems[7];
                    } else if (_optionKey == "AD") {
                        return rawBetLineItems[8];
                    } else if (_optionKey == "AA") {
                        return rawBetLineItems[9];
                    }
                    break;
                case "TTG":
                    if (_optionKey == "0") {
                        return rawBetLineItems[1];
                    } else if (_optionKey == "1") {
                        return rawBetLineItems[2];
                    } else if (_optionKey == "2") {
                        return rawBetLineItems[3];
                    } else if (_optionKey == "3") {
                        return rawBetLineItems[4];
                    } else if (_optionKey == "4") {
                        return rawBetLineItems[5];
                    } else if (_optionKey == "5") {
                        return rawBetLineItems[6];
                    } else if (_optionKey == "6") {
                        return rawBetLineItems[7];
                    } else if (_optionKey == "-7") {
                        return rawBetLineItems[8];
                    }
                    break;
                case "CRS":
                case "FCS": // ADDED BY KEVIN
                    //others
                    if (_optionKey == "-1-A") {
                        return rawBetLineItems[1];
                    } else if (_optionKey == "-1-D") {
                        return rawBetLineItems[2];
                    } else if (_optionKey == "-1-H") {
                        return rawBetLineItems[3];
                    }
                    //start with 00
                    else if (_optionKey == "0000") {
                        return rawBetLineItems[4];
                    } else if (_optionKey == "0001") {
                        return rawBetLineItems[5];
                    } else if (_optionKey == "0002") {
                        return rawBetLineItems[6];
                    } else if (_optionKey == "0003") {
                        return rawBetLineItems[7];
                    } else if (_optionKey == "0004") {
                        return rawBetLineItems[8];
                    } else if (_optionKey == "0005") {
                        return rawBetLineItems[9];
                    }
                    //start with 01
                    else if (_optionKey == "0100") {
                        return rawBetLineItems[10];
                    } else if (_optionKey == "0101") {
                        return rawBetLineItems[11];
                    } else if (_optionKey == "0102") {
                        return rawBetLineItems[12];
                    } else if (_optionKey == "0103") {
                        return rawBetLineItems[13];
                    } else if (_optionKey == "0104") {
                        return rawBetLineItems[14];
                    } else if (_optionKey == "0105") {
                        return rawBetLineItems[15];
                    }
                    //start with 02
                    else if (_optionKey == "0200") {
                        return rawBetLineItems[16];
                    } else if (_optionKey == "0201") {
                        return rawBetLineItems[17];
                    } else if (_optionKey == "0202") {
                        return rawBetLineItems[18];
                    } else if (_optionKey == "0203") {
                        return rawBetLineItems[19];
                    } else if (_optionKey == "0204") {
                        return rawBetLineItems[20];
                    } else if (_optionKey == "0205") {
                        return rawBetLineItems[21];
                    }
                    //start with 03
                    else if (_optionKey == "0300") {
                        return rawBetLineItems[22];
                    } else if (_optionKey == "0301") {
                        return rawBetLineItems[23];
                    } else if (_optionKey == "0302") {
                        return rawBetLineItems[24];
                    } else if (_optionKey == "0303") {
                        return rawBetLineItems[25];
                    }
                    //start with 04
                    else if (_optionKey == "0400") {
                        return rawBetLineItems[26];
                    } else if (_optionKey == "0401") {
                        return rawBetLineItems[27];
                    } else if (_optionKey == "0402") {
                        return rawBetLineItems[28];
                    }
                    //start with 05
                    else if (_optionKey == "0500") {
                        return rawBetLineItems[29];
                    } else if (_optionKey == "0501") {
                        return rawBetLineItems[30];
                    } else if (_optionKey == "0502") {
                        return rawBetLineItems[31];
                    }
                    break;
                case "FGS":
                    //no fgs
                    if (_optionKey == "000") {
                        return rawBetLineItems[1];
                    }
                    for (var i = 1; i < rawBetLineItems.length; i++) {
                        var fgskey = "**" + _optionKey;
                        if (rawBetLineItems[i].indexOf(fgskey) > -1) {
                            return rawBetLineItems[i];
                        }
                    }
                    break;
                case "SPC":
                    for (var i = 1; i < rawBetLineItems.length; i++) {
                        var tmpOptionKey = rawBetLineItems[i].split("**")[2];
                        if (removeLeadingZero(tmpOptionKey) == removeLeadingZero(_optionKey)) {
                            return rawBetLineItems[i];
                        }
                    }
                    break;
                case "NTS": case "ETS":
                    if (_optionKey == "H") {
                        return rawBetLineItems[1];
                    }
                    if (_optionKey == "N") {
                        return rawBetLineItems[2];
                    }
                    if (_optionKey == "A") {
                        return rawBetLineItems[3];
                    }
                    break;
            }
        }
        catch (e) {
            //alert("GetRawBetItem : " + e.message);
        }
        return "";
    }

    var rawBetItem = GetRawBetItem();
    this.RawBetItem = rawBetItem;

    //get attributes from raw bet items
    function GetBetAttributes(_key) {
        if (_isTourn) { return ""; }
        try {

            var betAttr = rawBetItem.split("**");
            switch (_key.toUpperCase()) {
                case "ODDS":
                    if (_isSBF) {
                        return eval("odds_" + _optionKey);
                    }
                    var objID = "#" + _matchID + "_" + _poolType + "_" + _optionKey;
                    if (_poolType == "SPC" || ((_poolType == "HIL" || _poolType == "CHL" || _poolType == "FHL") && _SPCItemNo != "")) {
                        objID = "#" + _matchID + "_" + _poolType + "_" + _optionKey + "_" + _SPCItemNo;
                    }
                    var $oddsObj = $(objID);
                    return jQuery.trim($oddsObj.text());
                case "SELECTION":
                    if (_poolType == "SPC") {
                        objID = "#ans_" + _matchID + "_" + _poolType + "_" + _optionKey + "_" + _SPCItemNo;
                        var $oddsObj = $(objID);
                        var anstext = jQuery.trim($oddsObj.text());
                        return "(" + removeLeadingZero(_optionKey) + ")" + anstext;
                    }
                    if (betAttr.length > 1) {
                        if (_poolType == "CRS" || _poolType == "FCS") {
                            if (_optionKey != "-1-H" && _optionKey != "-1-A" && _optionKey != "-1-D") {
                                return betAttr[1];
                            }
                        }
                        if (_poolType == "FGS") {
                            if (_optionKey == "000") {
                                return "00 " + GetGlobalResources(betAttr[1].split(" ")[1], "bs");
                            } else if (_optionKey == "120") {
                                return "120 " + GetGlobalResources(betAttr[1], "bs");
                            } else if (_optionKey == "220") {
                                return "220 " + GetGlobalResources(betAttr[1], "bs");
                            } else {
                                return betAttr[1];
                            }
                        }
                        return GetGlobalResources(betAttr[1], "bs");
                    }

                case "SELECTIONKEY":
                    if (betAttr.length > 2) {
                        return betAttr[2].replace("'", "").replace("]", "");
                    }
            }
        }
        catch (e) {
            //alert("GetBetAttributes : " + e.message);
        }
        return "";
    }

    this.ODDS = GetBetAttributes("ODDS");
    this.SELECTION = GetBetAttributes("SELECTION");
    this.SELECTIONKEY = GetBetAttributes("SELECTIONKEY");

    //Get Match Attributes
    function GetMatchAttributes(_key) {
        if (_isTourn) { return ""; }
        try {
            var rawBetAttr = rawBetLine.split(",")[0].split("**");
            switch (_key.toUpperCase()) {
                case "DATESTR":
                    if (rawBetAttr.length > 0) {
                        return rawBetAttr[0].replace("'", "").replace("[", "");
                    }
                case "DAY":
                    if (rawBetAttr.length > 0) {
                        var tDateStr = rawBetAttr[0].replace("'", "").replace("[", "");
                        return tDateStr.substring(10, 13);
                    }
                    break;
                case "NUM":
                    if (rawBetAttr.length > 0) {
                        var tDateStr = rawBetAttr[0].replace("'", "").replace("[", "");
                        return tDateStr.substring(13, tDateStr.length);
                    }
                    break;
                case "POOLTEXT":
                    if (rawBetAttr.length > 1) {
                        return rawBetAttr[1];
                    }
                case "HOMETEAM":
                    if (rawBetAttr.length > 2) {
                        return rawBetAttr[2];
                    }
                case "AWAYTEAM":
                    if (rawBetAttr.length > 3) {
                        return rawBetAttr[3];
                    }
                case "ALLUP":
                    if (rawBetAttr.length > 4) {
                        return rawBetAttr[4];
                    }
                case "DELAYBETTINGFLAG":
                    var $delayObj = $("#" + _matchID + "_delay");

                    if ($delayObj.length) {
                        return ($delayObj.val().toLowerCase() == "true") ? 1 : 0;
                    }
                    return "0";
                case "DELAYBETTINGFLAGTQL":
                    var $delayObj = $("#" + _matchID + "_TQL_delay");

                    if ($delayObj.length) {
                        return ($delayObj.val().toLowerCase() == "true") ? 1 : 0;
                    }
                    return "0";
                case "GOALLINE":
                    //HILO
                    switch (_poolType) {
                        case "HHA": case "HDC":
                            var $glObj = $("#" + _matchID + "_" + _poolType + "_" + _optionKey + "G");
                            if (_optionKey == "D") {
                                $glObj = $("#" + _matchID + "_" + _poolType + "_HG");
                            }
                            return $glObj.text().replace("]", "").replace("[", "");
                            break;
                        case "HIL": case "CHL": case "FHL":
                            if (_isSBF) {
                                return goalLine;
                            }
                            else {
                                var hlLineID = "#" + _matchID + "_" + _poolType + "_" + "LINE";
                                if ((_poolType == "HIL" || _poolType == "CHL" || _poolType == "FHL") && _SPCItemNo != "") {
                                    hlLineID += "_" + _SPCItemNo;
                                }

                                var $glObj = $(hlLineID);
                                return $glObj.text();
                            }
                            break;
                    }
                    return "";
                case "LEAGUENAME":
                    if (rawBetAttr.length > 9) {
                        var $flagObj = $(".cf" + rawBetAttr[9] + ":first");
                        if ($flagObj.length > 0) {
                            return $flagObj.attr("title");
                        }
                        return rawBetAttr[9];
                    }
                case "LEAGUESHORTNAME":
                    if (rawBetAttr.length > 9) {
                        return rawBetAttr[9].replace("'", "");
                    }
                case "LEAGUEFLAGIMG":
                    if (rawBetAttr.length > 9) {
                        var leagueshortname = rawBetAttr[9].replace("'", "");
                        if ($.isNullOrEmpty(leagueshortname)) {
                            leagueshortname = "trans";
                        }
                        //return "<img src=\"" + jsNAS_IMAGES_PATH_FULL + "flag_" + leagueshortname + ".gif\" />";
                        return jsBSFlagTag;
                    }
                case "HANDIHOME":
                    if (rawBetAttr.length > 6) {
                        return rawBetAttr[6];
                    }
                case "HANDIAWAY":
                    if (rawBetAttr.length > 7) {
                        return rawBetAttr[7];
                    }
                case "SPCITEM":
                    if (rawBetAttr.length > 7) {
                        if (_poolType == "SPC") {
                            return rawBetAttr[7];
                        }
                    }
                    return "";
                case "INPLAYSTAGE":
                    var stagemsg = $("#hsst" + _matchID).val();
                    if ($.isNullOrEmpty(stagemsg)) {
                        return "";
                    }
                    return stagemsg;
                case "NTSITEMNO":
                    var ntsItemNo = $("#ntspart_" + _matchID).text();

                    if ($.isNullOrEmpty(ntsItemNo)) {
                        return "";
                    }
                    return ntsItemNo;

                    return "";
            }
        }
        catch (e) {
            //alert("GetMatchAttributes : " + e.message);
        }
        return "";
    }

    this.POOLTEXT = GetMatchAttributes("POOLTEXT");
    this.HOMETEAM = GetMatchAttributes("HOMETEAM");
    this.AWAYTEAM = GetMatchAttributes("AWAYTEAM");
    this.LEAGUENAME = GetMatchAttributes("LEAGUENAME");
    this.HANDIHOME = GetMatchAttributes("HANDIHOME");
    this.HANDIAWAY = GetMatchAttributes("HANDIAWAY");
    this.LEAGUESHORTNAME = GetMatchAttributes("LEAGUESHORTNAME");
    this.GOALLINE = GetMatchAttributes("GOALLINE");
    if ((this.PoolTypeKey == "HIL" || this.PoolTypeKey == "CHL" || this.PoolTypeKey == "FHL") && this.GOALLINE.indexOf("[") >= 0) {
        this.GOALLINE = this.GOALLINE.substring(1, this.GOALLINE.length - 1);        
    }
    this.SPCITEM = GetMatchAttributes("SPCITEM");
    this.INPLAYSTAGE = GetMatchAttributes("INPLAYSTAGE");
    this.LEAGUEFLAGIMG = GetMatchAttributes("LEAGUEFLAGIMG");
    this.ALLUP = GetMatchAttributes("ALLUP");
    this.DELAYBETTINGFLAG = GetMatchAttributes("DELAYBETTINGFLAG");
    this.DELAYBETTINGFLAGTQL = GetMatchAttributes("DELAYBETTINGFLAGTQL");
    this.NTSITEMNO = GetMatchAttributes("NTSITEMNO");

    //get DivCal Bet Line
    function GetDivCalBetLine() {
        if (_isTourn) { return ""; }
        var divCalStr = "";
        try {
            divCalStr = GetMatchAttributes("DATESTR") + "**" + _poolType + "**";
            divCalStr += GetBetAttributes("ODDS") + "**" + GetBetAttributes("SELECTION") + "|" + GetBetAttributes("SELECTIONKEY") + "**";
            divCalStr += GetMatchAttributes("HOMETEAM") + "**" + GetMatchAttributes("AWAYTEAM") + "**";
            if (_poolType == "HHA" || _poolType == "HDC") {
                divCalStr += $("#" + _matchID + "_" + _poolType + "_HG").text().replace("[", "").replace("]", "") + "**" + $("#" + _matchID + "_" + _poolType + "_AG").text().replace("[", "").replace("]", "") + "**";
                //divCalStr += GetMatchAttributes("HANDIHOME") + "**" + GetMatchAttributes("HANDIAWAY") + "**";
            }
            else {
                divCalStr += GetMatchAttributes("HANDIHOME") + "**" + GetMatchAttributes("HANDIAWAY") + "**";
            }
            divCalStr += GetMatchAttributes("LEAGUESHORTNAME") + "**" + _matchID;

        }
        catch (e) {
            //alert("GetDivCalBetLine : " + e.message);
        }
        //format character codes
        divCalStr = removeApos(divCalStr);
        divCalStr = hexcode(divCalStr)
        return divCalStr;
    }

    this.DIVCALBETLINE = GetDivCalBetLine();

    //betline for tournament    
    var _tournID = "";
    var _tournNum = "";
    var _tournPoolType = "";
    var _tournOptionKey = "";
    var _tournPoolGrpID = "";
    var _tournExtraInfo = "";
    var _tournOdds = "";

    //is tournament
    if (_isTourn) {
        var idStr = $(_tournObj).attr("id").split("_");

        _tournID = idStr[1];
        _tournNum = idStr[2];
        _tournPoolType = idStr[1];
        _tournOptionKey = idStr[idStr.length - 2];
        _tournPoolGrpID = idStr[2];
        _tournExtraInfo = idStr[3];

        _tournID = tournidMapping[_tournPoolGrpID];
        _tournNum = tournNumMapping[_tournPoolGrpID];
        _tournOdds = $(_tournObj).siblings(".oddsLink").html();
    }

    this.IsTournament = _isTourn;
    this.TournID = _tournID;
    this.TournNum = _tournNum;
    this.TournPoolType = _tournPoolType;
    this.TournOptionKey = _tournOptionKey;
    this.TournPoolGrpID = _tournPoolGrpID;
    this.TournExtraInfo = _tournExtraInfo;
    this.TournOdds = _tournOdds;
    this.IsInplayCHP == (_isTourn && _tournPoolType.toUpperCase() == "CHP");

    //retrieve attributes from tournament betline
    function GetTournBetlineAttr(_itemPos) {
        for (var i = 0; i < betValue.length; i++) {
            if (betValue[i][0] != undefined) {
                var splittedBetlineValue = betValue[i][0].split("**");
                var tmpTournNum = splittedBetlineValue[0].replace("['", "").replace("'", "");
                var tmpTournPool = splittedBetlineValue[1];
                if (tmpTournNum == _tournNum && tmpTournPool == _tournPoolType) {
                    return splittedBetlineValue[_itemPos];
                }
            }
        }
        return "";
    }

    //get tournament attributes
    function GetTournAttributes(_key) {
        switch (_key) {
            case "TOURNLEAGUECODE":
                //get league code from betline
                tournLeagueCode = GetTournBetlineAttr(2);
                return tournLeagueCode;
            case "TOURNNAME":
                //get tourn name from betline
                return GetTournBetlineAttr(3);
            case "TOURNBETTYPEFLAG":
                //get bet type code from object
                var bflag = $("#htps_" + _tournPoolGrpID).val();
                if (!$.isNullOrEmpty(bflag)) {
                    return (bflag == "1") ? "2" : "1";
                }
                return "1";

            case "TOURNFLAGIMG":
                var tournFlag = GetTournAttributes("TOURNLEAGUECODE");
                if (tournFlag == "") {
                    tournFlag = "trans";
                }
                //return "<img src=\"" + jsNAS_IMAGES_PATH_FULL + "flag_" + tournFlag + ".gif\" />";
                return jsBSFlagTag;
                break;
            case "TOURNSELECTION":
                var tid = "s_" + $(_tournObj).attr("id").replace("_c", "");
                var $obj = $("#" + tid);
                return $obj.html();
                break;
            case "TOURNGROUPNAME":
                for (var i = 0; i < betValue.length; i++) {
                    var splittedBetline = betValue[i][0].split("**");
                    var tmpTournNum = splittedBetline[0].replace("['", "");
                    var tmpTournPool = splittedBetline[1];
                    var tmpTournGroupNo = splittedBetline[4];

                    if (tmpTournNum == _tournNum && tmpTournPool == _tournPoolType && tmpTournGroupNo == _tournExtraInfo) {
                        return splittedBetline[5];
                    }
                }
                break;
            case "TOURNGPFSELECTION":
                var tid = "com_" + $(_tournObj).attr("id").replace("_c", "");
                var $obj = $("#" + tid);
                return $obj.val();
                break;
            case "TOURNTOFPSELECTION":
                var tkey = _tournOptionKey.split("");
                var firstteam = $("#tofpteam" + removeLeadingZero(tkey[0] + tkey[1])).html();
                var secondteam = $("#tofpteam" + removeLeadingZero(tkey[2] + tkey[3])).html();

                return firstteam + " - " + secondteam;
                break;
            case "TOURNSPCSELECTION":
                var tid = "ans_" + $(_tournObj).attr("id").replace("_c", "");
                var $obj = $("#" + tid);
                return jQuery.trim($obj.val());
                break;
            case "ALLUP":
                return GetTournBetlineAttr(6);
        }
        return "";
    }

    this.TOURNFLAGIMG = GetTournAttributes("TOURNFLAGIMG");

    if (_isTourn) {
        this.ALLUP = GetTournAttributes("ALLUP");
        this.LEAGUESHORTNAME = GetTournAttributes("TOURNLEAGUECODE");
        this.SPCKEY = _tournID + "_" + _tournExtraInfo;
    }
    else {
        this.SPCKEY = _matchID + "_" + _SPCItemNo;
    }

    //generate send bet information
    function GenSendBet(_type, _content) {
        //betline 
        var sendbetheader = "";
        var sendbetcontent = "";

        //expanded betline
        var betlinelongheader = "";
        var betlinelongcontent = "";

        //short betline
        var betlineshortheader = "";
        var betlineshortcontent = "";

        try {
            if (_isTourn) {

                //betline
                sendbetheader = _tournPoolType + _tournNum + " " + GetTournAttributes("TOURNLEAGUECODE");

                //betline long desc
                betlinelongheader = GetTournAttributes("TOURNFLAGIMG") + " " + GetTournAttributes("TOURNNAME") + "<BR>" + GetGlobalResources(_tournPoolType) + "<BR>";

                //betline short
                betlineshortheader = GetGlobalResources(_tournPoolType) + " " + GetTournAttributes("TOURNLEAGUECODE");

                if (jsLang.toUpperCase() == "EN") {
                    var poolName = _tournPoolType;

                    betlineshortheader = "FB " + poolName + " " + GetTournAttributes("TOURNLEAGUECODE");
                }

                switch (_tournPoolType) {
                    case "CHP":
                        //betline
                        sendbetheader += "*";
                        sendbetcontent = removeLeadingZero(_tournOptionKey) + "@" + _tournOdds;

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetTournAttributes("TOURNSELECTION") + "@" + _tournOdds) + "<BR>";

                        //betline short
                        betlineshortcontent = GetTournAttributes("TOURNSELECTION") + "@" + _tournOdds + "**";
                        break;
                    case "GPF":
                        var tkey = _tournOptionKey.split("");
                        var tmpOptionKey = removeLeadingZero(tkey[0] + tkey[1]) + "#" + removeLeadingZero(tkey[2] + tkey[3]);
                        //betline
                        sendbetcontent += " G" + _tournExtraInfo + "*" + tmpOptionKey + "@" + _tournOdds;

                        //betline long desc
                        betlinelongheader += GetTournAttributes("TOURNGROUPNAME") + "<BR>";
                        betlinelongcontent = formatLongDescSel(GetTournAttributes("TOURNGPFSELECTION") + "@" + _tournOdds) + "<BR>";

                        //betline short
                        betlineshortcontent = GetTournAttributes("TOURNGPFSELECTION") + "@" + _tournOdds + "**";
                        break;
                    case "TOFP":
                        var tkey = _tournOptionKey.split("");
                        var tmpOptionKey = removeLeadingZero(tkey[0] + tkey[1]) + "#" + removeLeadingZero(tkey[2] + tkey[3]);
                        //betline
                        sendbetheader += "*";
                        sendbetcontent = tmpOptionKey + "@" + _tournOdds;

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetTournAttributes("TOURNTOFPSELECTION") + "@" + _tournOdds) + "<BR>";

                        //betline short
                        betlineshortcontent = GetTournAttributes("TOURNTOFPSELECTION") + "@" + _tournOdds + "**";
                        break;
                    case "GPW":
                        //betline
                        sendbetheader += " G" + _tournExtraInfo + "*";
                        sendbetcontent = removeLeadingZero(_tournOptionKey) + "@" + _tournOdds;

                        //betline long desc
                        betlinelongheader += GetTournAttributes("TOURNGROUPNAME") + "<BR>";
                        betlinelongcontent = formatLongDescSel(GetTournAttributes("TOURNSELECTION") + "@" + _tournOdds) + "<BR>";

                        //betline short
                        betlineshortcontent = GetTournAttributes("TOURNSELECTION") + "@" + _tournOdds + "**";
                        break;
                    case "ADTP":
                        //handle ADTP Betline seperately
                        var adtpFlag = GetTournAttributes("TOURNBETTYPEFLAG");
                        //betline
                        sendbetheader = _tournPoolType + _tournNum + adtpFlag + " " + tournLeagueCode + "*";
                        sendbetcontent = ADTPBetline;

                        //betline long desc
                        betlinelongheader = GetTournAttributes("TOURNFLAGIMG") + " " + GetTournAttributes("TOURNNAME") + "<BR>";
                        betlinelongheader += GetTournAttributes("TOURNGROUPNAME") + "<BR>" + GetGlobalResources(_tournPoolType) + "<BR>";
                        betlinelongcontent = ADTPBetlinelongdesc;

                        //betling short
                        betlineshortcontent = ADTPBetlineshort;
                        break;
                    case "TPS":
                        //TPS11??
                        var tpsFlag = GetTournAttributes("TOURNBETTYPEFLAG");
                        //betline
                        sendbetheader = _tournPoolType + _tournNum + tpsFlag + " " + tournLeagueCode + "*";
                        sendbetcontent = removeLeadingZero(_tournOptionKey) + "@" + _tournOdds;

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetTournAttributes("TOURNSELECTION") + "@" + _tournOdds) + "<BR>";

                        //betline short
                        betlineshortcontent = GetTournAttributes("TOURNSELECTION") + "@" + _tournOdds + "**";
                        break;
                    case "SPC":
                        //betline
                        sendbetcontent += " I" + _tournExtraInfo + "*" + removeLeadingZero(_tournOptionKey) + "@" + _tournOdds;

                        //betline long desc
                        //betlinelongheader += "<BR>" + _tournExtraInfo + " - "  + GetTournAttributes("TOURNGROUPNAME") + "<BR>";

                        var spcQuestion = $("#spcq" + _tournID + "_" + _tournExtraInfo).html();
                        betlinelongheader += "<BR>" + _tournExtraInfo + " - " + spcQuestion + "<BR>";

                        betlinelongcontent = formatLongDescSel(GetTournAttributes("TOURNSPCSELECTION") + "@" + _tournOdds) + "<BR>";

                        //betline short
                        betlineshortcontent = GetTournAttributes("TOURNSPCSELECTION") + "@" + _tournOdds + "**";
                        break;
                }
            }
            else {

                //betline
                var betlinePoolType = _poolType;
                var betlinePoolName = GetGlobalResources(GetMatchAttributes("POOLTEXT"));
                if (jsLang.toUpperCase() == "EN") {
                    var poolName = GetMatchAttributes("POOLTEXT");

                    if (poolName == "FHA" || poolName == "HHA") {
                        poolName += "D";
                    } else if (poolName == "HIL") {
                        poolName = "HILO";
                    } else if (poolName == "CHL") {
                        poolName = "CHLO";
                    } else if (poolName == "FHL") {
                        poolName = "FHLO";
                    } else if (poolName == "FCS") {
                        poolName = "FCRS";
                    }
                    betlinePoolName = "FB " + poolName;
                }
                if (betlinePoolType == "ETS") {
                    betlinePoolType = "NTS";
                    //betlinePoolName += "(" + jsextratime + ")";
                }
                sendbetheader = betlinePoolType + " " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM");

                //betline long desc
                betlinelongheader = GetGlobalResources(GetMatchAttributes("DAY")) + " " + GetMatchAttributes("NUM");
                betlinelongheader += "<BR>" + GetMatchAttributes("LEAGUEFLAGIMG") + " ";
                betlinelongheader += GetMatchAttributes("HOMETEAM") + "(" + GetGlobalResources("HOME") + ")";
                betlinelongheader += " " + GetGlobalResources(jsVS) + " ";
                betlinelongheader += GetMatchAttributes("AWAYTEAM") + "(" + GetGlobalResources("AWAY") + ")";
                betlinelongheader += "<BR>" + GetGlobalResources(GetMatchAttributes("POOLTEXT")) + "<BR>";

                //betline short desc
                betlineshortheader = betlinePoolName + " ";
                betlineshortheader += GetGlobalResources(GetMatchAttributes("DAY")) + " " + GetMatchAttributes("NUM");

                switch (_poolType) {
                    case "HAD": case "CRS": case "HFT": case "TTG": case "OOE": case "FGS": case "TQL": case "FTS": //case "TQL":case "FTS": 
                        //betline
                        sendbetheader += "*";
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "FCS":
                        sendbetheader = "FCRS " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM") + "*";
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "FHA":
                        //betline
                        sendbetheader = "FHAD " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM") + "*";
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "HHA":
                        //betline
                        sendbetheader = "HHAD " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM") + "*";
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + "[" + GetMatchAttributes("GOALLINE") + "]@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "[" + GetMatchAttributes("GOALLINE") + "]@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "HDC":
                        //betline
                        sendbetheader += "*";
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + "[" + GetMatchAttributes("GOALLINE") + "]@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "[" + GetMatchAttributes("GOALLINE") + "]@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "HIL":
                        //betline
                        sendbetheader = "HILO " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM") + "*";
                        var betGoalline = GetMatchAttributes("GOALLINE");
                        if (betGoalline.indexOf("[") == -1) {
                            betGoalline = "[" + betGoalline + "]";
                        }
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + betGoalline + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + betGoalline + "@<nobr>" + GetBetAttributes("ODDS")) + "</nobr><BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + betGoalline + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "CHL":
                        //betline
                        sendbetheader = "CHLO " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM") + "*";
                        var betGoalline = GetMatchAttributes("GOALLINE");
                        if (betGoalline.indexOf("[") == -1) {
                            betGoalline = "[" + betGoalline + "]";
                        }
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + betGoalline + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + betGoalline + "@<nobr>" + GetBetAttributes("ODDS")) + "</nobr><BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + betGoalline + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "FHL":
                        //betline
                        sendbetheader = "FHLO " + GetMatchAttributes("DAY") + " " + GetMatchAttributes("NUM") + "*";
                        var betGoalline = GetMatchAttributes("GOALLINE");
                        if (betGoalline.indexOf("[") == -1) {
                            betGoalline = "[" + betGoalline + "]";
                        }
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + betGoalline + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + betGoalline + "@<nobr>" + GetBetAttributes("ODDS")) + "</nobr><BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + betGoalline + "@" + GetBetAttributes("ODDS") + "**";

                        break;
                    case "SPC":
                        //betline
                        sendbetheader += " I" + _SPCItemNo + "*";
                        sendbetcontent = removeLeadingZero(_optionKey) + "@" + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongheader += _SPCItemNo + " - " + GetMatchAttributes("SPCITEM") + "<BR>";
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;
                    case "NTS": case "ETS":
                        //betline
                        var isETS = ($("#" + _matchID + "_NTS_isETS").val().toLowerCase() == "true");

                        var ntsItemNo = GetMatchAttributes("NTSITEMNO");
                        //remove number th, st, nd, rd and trim
                        var ntsBetItemNo = ntsItemNo.replace("th", "").replace("st", "").replace("nd", "").replace("rd", "").replace(" ", "");
                        var ntsBetItemStr = "(#" + ntsBetItemNo + ")@";
                        var ntsHeaderStr = betlinePoolName + "(" + jsntsfstpart + ntsItemNo + jsntslastpart + ")";

                        if (isETS) {
                            ntsBetItemStr = "(ET#" + ntsBetItemNo + ")@";
                            ntsHeaderStr = betlinePoolName + "(" + jsntsfstpart + ntsItemNo + jsntslastpart + "[" + jsextratime + "])";
                        }


                        //betline long desc
                        betlinelongheader = GetGlobalResources(GetMatchAttributes("DAY")) + " " + GetMatchAttributes("NUM");
                        betlinelongheader += "<BR>" + GetMatchAttributes("LEAGUEFLAGIMG") + " ";
                        betlinelongheader += GetMatchAttributes("HOMETEAM") + "(" + GetGlobalResources("HOME") + ")";
                        betlinelongheader += " " + GetGlobalResources(jsVS) + " ";
                        betlinelongheader += GetMatchAttributes("AWAYTEAM") + "(" + GetGlobalResources("AWAY") + ")";
                        betlinelongheader += "<BR>" + ntsHeaderStr + "<BR>";

                        //betline short desc
                        betlineshortheader = ntsHeaderStr + " ";
                        betlineshortheader += GetGlobalResources(GetMatchAttributes("DAY")) + " " + GetMatchAttributes("NUM");

                        sendbetheader += "*";
                        sendbetcontent = GetBetAttributes("SELECTIONKEY") + ntsBetItemStr + GetBetAttributes("ODDS");

                        //betline long desc
                        betlinelongcontent = formatLongDescSel(GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS")) + "<BR>";

                        //betline short desc
                        betlineshortcontent = GetBetAttributes("SELECTION") + "@" + GetBetAttributes("ODDS") + "**";
                        break;

                }
            }
        }
        catch (e) {
            //alert("GenSendBetBasic : " + e.message);
        }

        if (_type == "simple") {
            if (_content == "header") {
                return sendbetheader;
            } else if (_content == "text") {
                return sendbetcontent;
            }
            return sendbetheader + sendbetcontent;
        } else if (_type == "longdesc") {
            if (_content == "header") {
                return betlinelongheader;
            } else if (_content == "text") {
                return betlinelongcontent;
            }
            return betlineexpheader + betlineexpcontent;
        } else if (_type == "shortdesc") {
            if (_content == "header") {
                return betlineshortheader;
            } else if (_content == "text") {
                return betlineshortcontent;
            }
            return betlineshortheader + betlineshortcontent;
        }

        return "";
    }

    this.BETLINEHEADER = GenSendBet("simple", "header");
    this.BETLINECONTENT = GenSendBet("simple", "text");

    this.BETLINELONGHEADER = GenSendBet("longdesc", "header");
    this.BETLINELONGCONTENT = GenSendBet("longdesc", "text");

    this.BETLINESHORTHEADER = GenSendBet("shortdesc", "header");
    this.BETLINESHORTCONTENT = GenSendBet("shortdesc", "text");
}

//end

//write spc answer
function writeByItemAnswer() {
    $(".spcans").each(function() {
        var idStr = $(this).attr("id").split("_");
        var matchID = idStr[1];
        var oType = idStr[2];
        var optionKey = removeLeadingZero(idStr[3]);
        var itemNo = idStr[4];
        var anstext = jQuery.trim($(this).html());
        //anstext = anstext.substring(1, anstext.length - 1);
        $("#spcans_" + itemNo + "_" + optionKey).html(anstext);

        /********** begin, added by kevin *****************/
        var tempobj = $("#spcansRef_" + itemNo + "_" + optionKey);
        if (null != tempobj && undefined != tempobj)
            tempobj.html(anstext);
        /********** end, added by kevin *******************/

    });
}

function calBet(_thisObj, _matchID, _oType, _optionKey, _itemNo) {
    var $oddsObj = $(_thisObj);

    var betLine = new BetLine(_matchID, _oType, _optionKey, _itemNo, null, false);

    var calUrl = "/football/cal/allup_cal/div_cal.aspx?para=" + betLine.DIVCALBETLINE + "&lang=" + jsLang;
    divCalWindow = window.open(calUrl, "divCalculator", 'top=100,left=100,scrollbars=yes,resizable=yes,width=734,height=393');
}

//check adtp selection
var ADTPBetline = "", ADTPBetlinelongdesc = "", ADTPBetlineshort = "", ADTPValid = true;
function validateAndGenerateADTP() {
    //check MaxGrpSell, MinGrpSell and BetMinSell
    if ($("#hADTPInfo117").length) {
        var hADTPInfo = $("#hADTPInfo117").val();
        var hMaxGrpSell = hADTPInfo.split(";")[0];
        var hMinGrpSell = hADTPInfo.split(";")[1];
        var hBetMinSell = hADTPInfo.split(";")[2];
        var hGrpCnt = hADTPInfo.split(";")[3];
        var hasSelection = false;
        var adtpOK = true;
        for (var i = 0; i < hGrpCnt; i++) {
            var checkedgrp = 0;
            var hasgroup = false;
            var grpno = 0;
            var grpChecked = $(".tblADTP .tournrows .adtpgrp" + (i + 1) + " input:checked").length;
            if (grpChecked > 0) {
                hasSelection = true;
            }
            if (!(grpChecked >= hMinGrpSell && grpChecked <= hMaxGrpSell)) {
                adtpOK = false;
            }
        }
        if (!adtpOK && hasSelection) {
            alert(GetGlobalResources("ADTPSELECTIONERROR", "bs"));
            ADTPBetline = "";
            ADTPBetlinelongdesc = "";
            ADTPBetlineshort = "";
            ADTPValid = false;
        }
        else {
            //format ADTP Betline
            ADTPBetline = "";
            ADTPBetlinelongdesc = "";
            ADTPBetlineshort = "";
            ADTPValid = true;
            for (var i = 0; i < hGrpCnt; i++) {
                ADTPBetline += "G" + (i + 1);
                ADTPBetlinelongdesc += $(".adtpgrp" + (i + 1) + ":first").html() + "<BR>";
                var selStr = "(";
                var selTeams = "";
                var shortTeams = "";
                $(".tblADTP .tournrows .adtpgrp" + (i + 1) + " input:checked").each(function() {
                    var idStr = $(this).attr("id");
                    var grpSel = idStr.split("_")[6];

                    selStr += grpSel + "+";
                    var teamtext = $("#s_" + idStr.replace("_c", "")).html();
                    selTeams += formatLongDescSel(teamtext) + "<BR>";
                    shortTeams += teamtext + "**";
                });
                selStr = selStr.substring(0, selStr.length - 1);
                selStr += ")";
                ADTPBetline += selStr;
                ADTPBetlinelongdesc += selTeams;
                ADTPBetlineshort += shortTeams;
            }
            ADTPBetline += ")";
        }
    }
}

//add slip
var hasMixCRS = false, hasMixFGS = false, hasMixHFT = false;
function addslip() {

    //xsell event
    var curPagename = getCurrentPagename();
    if (curPagename.toLowerCase().indexOf("home_inc.aspx") == -1) {
        //no xsell in focus match
        xsell_event(9);
    }

    var objs = $(".codds input:checked");
    var betLineObjs = new Array();
    var matchIDObjs = new Array();
    var matchObjs = new Array();

    //valid ADTP (if any) selections
    validateAndGenerateADTP();

    for (i = 0; i < objs.length; i++) {
        oddsValue = $(objs[i]).siblings(".oddsLink").html();
        // handle the case of checkbox which is wrapped by label in Vista's IE9
        if ($(objs[i]).parent().is("label") && $(objs[i]).parent().hasClass("labelWrapper")) {
            oddsValue = $(objs[i]).parent().siblings(".oddsLink").html();
        }
        if (oddsValue != null) {
            var idStr = $(objs[i]).attr("id").split("_");
            var isTournament = (idStr[0] == "tourn");

            if (isTournament) {

                var idStr = $(objs[i]).attr("id").split("_");

                var tournPoolType = idStr[1];
                var tournOptionKey = idStr[idStr.length - 2];
                var tournPoolGrpID = idStr[2];
                var tournExtraInfo = idStr[3];

                var tournID = tournidMapping[tournPoolGrpID];
                var tournNum = tournNumMapping[tournPoolGrpID];

                var betLine = new BetLine("", "", "", "", $(objs[i]), false, $(objs[i]).attr("id"));
                betLineObjs[betLineObjs.length] = betLine;

            }
            else {
                //                hasMixCRS = false;
                //                hasMixFGS = false;
                //                hasMixHFT = false;
                var matchID = idStr[0];
                var oType = idStr[1];
                var validBetline = true;

                var optionKey = idStr[2];
                var itemNo = "";
                if (oType == "SPC") {
                    itemNo = idStr[3];
                } else if (oType == "HIL" || oType == "CHL" || oType == "FHL") { // multiline pool
                    if ($(objs[i]).parent().hasClass('otherLineRow'))
                        validBetline = $(objs[i]).is(":visible");
                    if (idStr[3] != undefined && idStr[3] == parseInt(idStr[3], 10)) {
                        itemNo = idStr[3];
                    }
                }

                if (oType == "CRS" || oType == "FCS") {
                    hasMixCRS = true;
                }
                if (oType == "HFT") {
                    hasMixHFT = true;
                }
                if (oType == "FGS") {
                    hasMixFGS = true;
                }

                if (oType == "ETS") {
                    oType = "NTS";
                }

                if (validBetline) {
                    var betLine = new BetLine(matchID, oType, optionKey, itemNo, null, false, $(objs[i]).attr("id"));
                    betLineObjs[betLineObjs.length] = betLine;
                }
            }
        }
    }

    //send bet by betline objects
    sendBet(betLineObjs, false);

}

function addSBFSlip(_oType) {
    //xsell event
    xsell_event(9);

    var betLineObjs = new Array();
    if (sbfPoolType == "HAD" || sbfPoolType == "HIL") {
        var matchID = matchIDArr[0];
        var optionKey = $("#sbf_selected_bet").val();
        var betLine = new BetLine(matchID, _oType, optionKey, "", null, true);
        betLineObjs[betLineObjs.length] = betLine;
    }
    else if (sbfPoolType == "CHP") {
        //<td class="codds"><span><input id="tourn_117_1_CHP_472_n_06_c" />
        //<span class="oddsLink oupt" id="tourn_117_1_CHP_472_n_06">1.00</span></span></td>
        //<span id="s_tourn_117_1_CHP_472_n_06">6 TEAMNAME</span>
        //create an odds object which is similar to chp all page
        var selectedNameKey = $("#sbf_selected_bet").val();
        var chpObjOdds = getSBFCHPSelection(selectedNameKey, "odds");
        var chpObjSelection = getSBFCHPSelection(selectedNameKey, "optionkey");
        var chpObjTeamname = getSBFCHPSelection(selectedNameKey, "teamname");
        var chpObjID = "tourn_" + tournid + "_" + tournnum + "_CHP_" + tournpoolid + "_n_" + chpObjSelection;
        var chpHTML = "<div style='display:none;'><input type=\"checkbox\" id=\"" + chpObjID + "_c\" checked />";
        chpHTML += "<span class=\"oddsLink oupt\" id=\"" + chpObjID + "\">" + chpObjOdds + "</span>"
        chpHTML += "<span id=\"s_" + chpObjID + "\">" + removeLeadingZero(chpObjSelection) + " " + chpObjTeamname + "</span></div>";
        var $chpObj = $(chpHTML);
        $("#sbfCHPBetObj").append($chpObj);
        var $checkedObj = $chpObj.find("input:first");

        var betLine = new BetLine("", "", "", "", $checkedObj, false);
        betLineObjs[betLineObjs.length] = betLine;
    }
    sendBet(betLineObjs, true);
    //clear obj
    if ($("#sbfCHPBetObj").length) {
        $("#sbfCHPBetObj").html("");
    }
}

function getSBFCHPSelection(_selectedKey, _type) {
    var teamNameListArray = teamNameList.split(",");
    var teamSelCodeListArray = teamSelCodeList.split(",");
    var teamFullNameListArray = teamFullNameList.split(",");
    var tmpIdx = -1;
    var chpSelection = "";
    var selectedTeamname = "";
    var selectedOdds = "";
    for (var i = 0; i < teamNameListArray.length; i++) {
        if (teamNameListArray[i] == _selectedKey) {
            tmpIdx = i;
            break;
        }
    }

    if (tmpIdx != -1) {
        chpSelection = teamSelCodeListArray[tmpIdx];
        selectedTeamname = teamFullNameListArray[tmpIdx];
        selectedOdds = $("#odds_" + chpSelection).text();
    }

    switch (_type) {
        case "optionkey":
            return chpSelection;
        case "odds":
            return selectedOdds;
        case "teamname":
            return selectedTeamname;
    }
    return "";
}

// START Nielsen Online SiteCensus
var addBetSuccess = false;
// END Nielsen Online SiteCensus

function sendBet(_betLineObjs, _isSBF) {
    // START Nielsen Online SiteCensus
    addBetSuccess = false;
    // END Nielsen Online SiteCensus

    //get page info
    var currentPageName = "";
    var hPageInfoValue = $("#hHeaderInfo").val();
    if (!$.isNullOrEmpty(hPageInfoValue)) {
        currentPageName = hPageInfoValue.split(",")[1];
    }
    var isMixAllup = false;
    var intAllup = 1, intInPlay = 0;

    var validBet = true;

    if (!ADTPValid) {
        validBet = false;
    }

    var groupBetLineObjs = GroupBetLineObjsByType(_betLineObjs, "MATCH");

    if (currentPageName == "SPC" || currentPageName == "INPLAYSPC") {
        //spc page
        //        if (currentPageName == "INPLAYSPC") {
        //            intInPlay = 1;
        //        }
        groupBetLineObjs = GroupBetLineObjsByType(_betLineObjs, "SPCITEM");
    } else if (currentPageName == "ALL" || currentPageName == "INPLAYALL" || currentPageName == "HALFTIMEALL") {
        //all odds
        //        if (currentPageName == "INPLAYALL") {
        //            intInPlay = 1;
        //        }
        groupBetLineObjs = GroupBetLineObjsByType(_betLineObjs, "POOLTYPE");
    } else if (currentPageName == "TOURN") {
        //all tournaments
        intAllup = 0;
        groupBetLineObjs = GroupBetLineObjsByType(_betLineObjs, "TOURNPOOLGROUP");

    } else if (currentPageName == "CHP") {
        //champion
        intAllup = 0;
        groupBetLineObjs = GroupBetLineObjsByType(_betLineObjs, "TOURN");
    } else if (currentPageName == "MIXALLUP" || currentPageName == "MIXALLUPSHORTCUT") {
        //mix all up
        isMixAllup = true;
    }
    //    else if (currentPageName == "INPLAYHAD") {
    //        intInPlay = 1;
    //    }

    var mixallupBetLine = "";
    var mixallupLongDesc = "";
    var mixallupShort = "";

    //validate for mixallup
    if (isMixAllup) {
        var cntCheckedOdds = 0;
        var checkedPoolType = new Array();
        if (tmatchids != null) {
            var objMatchIDs = tmatchids.split(",");
            for (var i = 0; i < objMatchIDs.length; i++) {
                $("#dMix_" + objMatchIDs[i] + " input:checked").each(function() {
                    var idStr = $(this).attr("id").split("_");
                    var otype = idStr[1];
                    checkedPoolType[cntCheckedOdds] = otype;
                    cntCheckedOdds++;
                    //break the loop
                    return false;
                });
            }
        }

        //min. 2 selections
        if (cntCheckedOdds < 2) {
            validBet = false;
        }

        //check max. selection for each pool type
        for (var i = 0; i < checkedPoolType.length; i++) {
            var legsLimit = eval("js" + checkedPoolType[i] + "Legs");
            if (!$.isNullOrEmpty(legsLimit)) {
                if (cntCheckedOdds > legsLimit) {
                    alert(jsmixallupNsel.replace("{0}", legsLimit));
                    validBet = false;
                    break;
                }
            }
        }
    }
    if (validBet) {
        var showFlag = true;
        for (var i = 1; i < groupBetLineObjs.length; ++i) {
            showFlag = showFlag && groupBetLineObjs[i][1].LEAGUESHORTNAME == groupBetLineObjs[0][1].LEAGUESHORTNAME;
        }
        for (var i = 0; i < groupBetLineObjs.length; i++) {
            //betline
            var sendbetHeader = "FB " + groupBetLineObjs[i][1].BETLINEHEADER;
            var sendbetContent = "";

            //betline long desc
            var sendbetlongHeader = groupBetLineObjs[i][1].BETLINELONGHEADER;
            var sendbetlongContent = "";

            //betline short desc
            var sendbetshortHeader = groupBetLineObjs[i][1].BETLINESHORTHEADER;
            var sendbetshortContent = "";

            var hasADTPBetline = false;
            for (j = 1; j < groupBetLineObjs[i].length; j++) {
                //betline
                sendbetContent += groupBetLineObjs[i][j].BETLINECONTENT + "+";

                //betline long desc
                sendbetlongContent += groupBetLineObjs[i][j].BETLINELONGCONTENT;

                //betline short desc
                sendbetshortContent += groupBetLineObjs[i][j].BETLINESHORTCONTENT + " ";


                //remove extra group, item in tournament
                if (groupBetLineObjs[i][j].IsTournament &&
                (groupBetLineObjs[i][j].TournPoolType == "GPW"
                || groupBetLineObjs[i][j].TournPoolType == "GPF"
                || groupBetLineObjs[i][j].TournPoolType == "SPC")) {

                    var extraGrpStr = "+ G" + groupBetLineObjs[i][j].TournExtraInfo + "*";
                    var extraSPCItemStr = "+ I" + groupBetLineObjs[i][j].TournExtraInfo + "*";

                    sendbetContent = sendbetContent.replace(extraGrpStr, "+");
                    sendbetContent = sendbetContent.replace(extraSPCItemStr, "+");
                }
                else if (groupBetLineObjs[i][j].TournPoolType == "ADTP") {
                    if (ADTPBetline != "") {
                        sendbetContent = groupBetLineObjs[i][j].BETLINECONTENT;
                        sendbetlongContent = groupBetLineObjs[i][j].BETLINELONGCONTENT;
                        sendbetshortContent = groupBetLineObjs[i][j].BETLINESHORTCONTENT;
                    }
                }
            }
            //only retrive last item of sendbetshortContent
            var shortContentItems = sendbetshortContent.split("**");

            //remove last + sign
            var betLine1 = sendbetHeader + sendbetContent.substring(0, sendbetContent.length - 1);
            var betLine2 = sendbetlongHeader + sendbetlongContent + "<BR>";
            var betLine3 = sendbetshortHeader;
            var betLine4 = shortContentItems[shortContentItems.length - 2];
            if (isMixAllup) {
                mixallupBetLine += betLine1.replace("FB ", "") + "/";
                var regex = new RegExp('<img[^><]*>|<.img[^><]*>', 'g')
                var longdescNoFlag = sendbetlongHeader.replace(regex, "");

                mixallupLongDesc += longdescNoFlag + sendbetlongContent;
                mixallupShort += "";
            } else {
                var otherinfo = "";
                var selectedMatchID = groupBetLineObjs[i][1].MatchID;
                var selectedLeagueShortName = groupBetLineObjs[i][1].LEAGUESHORTNAME;
                //tournament GPW and GPF
                var selectedTournPoolType = groupBetLineObjs[i][1].TournPoolType;
                if (selectedTournPoolType == "GPW" || selectedTournPoolType == "GPF") {
                    intAllup = 1;
                }
                var selectedPoolType = groupBetLineObjs[i][1].PoolType;
                //TQL has no all up
                if (selectedPoolType == "TQL") {
                    intAllup = 0;
                    intInPlay = groupBetLineObjs[i][1].DELAYBETTINGFLAGTQL;
                    //ALL up can be disabled in normal pools
                } else {
                    if (currentPageName != "TOURN"
                    && currentPageName != "CHP") {
                        intAllup = groupBetLineObjs[i][1].ALLUP;
                        var IsInplayCHP = (groupBetLineObjs[i][1].TournPoolType == "CHP" && currentPageName == "INPLAYALL");

                        if (IsInplayCHP) {
                            intAllup = 0;
                            var $tmpDelay = $("input[id*='_TQL_delay']:first");
                            intInPlay = ($tmpDelay.val() == "true") ? 1 : 0;
                        }
                        else {
                            intInPlay = groupBetLineObjs[i][1].DELAYBETTINGFLAG;
                        }
                    }
                    else if (currentPageName == "CHP" || groupBetLineObjs[i][1].TournPoolType == "CHP") {
                        var $tmpDelay = $("input[id*='" + groupBetLineObjs[i][1].TournPoolGrpID + "_CHP_delay']");
                        intInPlay = ($tmpDelay.val() == "true") ? 1 : 0;
                    }
                }
                intAllup = groupBetLineObjs[i][1].ALLUP;
                var intIsExtraTime = (groupBetLineObjs[i][1].INPLAYSTAGE == "extratime") ? 1 : 0;
                otherinfo += "Allup: " + intAllup + "\n";
                otherinfo += "Inplay: " + intInPlay + "\n";
                otherinfo += "LeagueNUM: " + selectedLeagueShortName + "\n";
                otherinfo += "MatchID: " + selectedMatchID + "\n";
                otherinfo += "isExtraTime: " + intIsExtraTime + "\n";
                var msg = (betLine1 + "\n" + betLine2 + "\n" + betLine3 + "\n" + betLine4 + "\n" + otherinfo);

                try {
                    if (enableBSinDev) {
                        alert(msg);
                        $(".codds input:checked").each(function() {
                            $(this).click();
                            $(this).blur();
                        });

                        //redirect to confirmation page for SBF
                        if (_isSBF) {
                            location.href = jsSBFConfirmURL;
                        }
                    }
                    else {
                        document.domain = jsDOMAIN;
                        //alert(msg);

                        if (_isSBF) {
                            var sbfBetValue = $("#betamount").val();
                            betLine1 += " $" + sbfBetValue;
                        }
                        var addedBet = top.betSlipFrame.addSelEx(betLine1, betLine2, betLine3, betLine4, intAllup, intInPlay, selectedLeagueShortName, "", "", "") //leagueNum, isMK6Snowball, isRandGen, logID

                    }

                    if (addedBet == 1) {
                        //clear checkbox
                        clearCheckbox(groupBetLineObjs[i]);

                        //clear caculator
                        clearCaculator($(".tblMixCal"));

                        // START Nielsen Online SiteCensus
                        addBetSuccess = true;
                        // END Nielsen Online SiteCensus

                        //redirect to confirmation page for SBF
                        if (_isSBF) {
                            location.href = jsSBFConfirmURL;
                        }
                    }
                    else {
                        // START Nielsen Online SiteCensus
                        addBetSuccess = false;
                        // END Nielsen Online SiteCensus

                        return false;
                    }
                } catch (ex) {
                }
            }
        }
        if (isMixAllup) {
            mixallupBetLine = mixallupBetLine.substring(0, mixallupBetLine.length - 1);
            var selformatVal = $("#selFormulaTop").val().toLowerCase();
            var mbetLine1 = "FB ALUP " + selformatVal + "/" + mixallupBetLine;
            var mbetLine2 = jsallupheader + " " + selformatVal + "<BR>" + mixallupLongDesc + "<BR>";
            var mbetLine3 = jsallupheader + " " + selformatVal;
            var mbetLine4 = groupBetLineObjs[0][1].BETLINESHORTHEADER; //sendbetshortHeader; //""//first selection pool + day + num;

            var otherinfo = "";
            otherinfo += "Allup: " + intAllup + "\n";
            otherinfo += "Inplay: " + intInPlay + "\n";
            otherinfo += "LeagueNUM:\n";
            //get no of selection from mixallup.js
            if (!calculateBet2('Top', false)) {
                return false;
            }
            //unitbet value
            var unitbetvalue = $("#txtUnitbetTop").val();
            otherinfo += "NoOfSelection:" + mixallupselections + "\n";
            otherinfo += "UnitBetValue:$" + unitbetvalue + "\n";

            var msg = (mbetLine1 + "\n" + mbetLine2 + "\n" + mbetLine3 + "\n" + mbetLine4 + "\n" + otherinfo);

            try {
                if (enableBSinDev) {
                    alert(msg);
                    $(".codds input:checked").each(function() {
                        $(this).click();
                        $(this).blur();
                    });

                    clearCaculator($(".tblMixCal")); //alert("line:1430");
                }
                else {
                    document.domain = jsDOMAIN;
                    //alert(msg);
                    var addedBet = top.betSlipFrame.addAllUpSel(mbetLine1, mbetLine2, mbetLine3, mbetLine4, mixallupselections, unitbetvalue, "0", (showFlag ? groupBetLineObjs[0][1].LEAGUESHORTNAME : ""));
                    if (addedBet == 1) {
                        //clear checkbox
                        $(".codds input:checked").each(function() {
                            $(this).click();
                            $(this).blur();
                        });

                        clearCaculator($(".tblMixCal")); //alert("line:1433");

                        // START Nielsen Online SiteCensus
                        addBetSuccess = true;
                        // END Nielsen Online SiteCensus 						
                    }
                    else {
                        // START Nielsen Online SiteCensus
                        addBetSuccess = false;
                        // END Nielsen Online SiteCensus 

                        return false;
                    }
                }
            } catch (ex) {
            }
        }
    }
}

//clear checkbox after adding to bet slip
function clearCheckbox(_betlineObj) {
    try {
        for (var i = 1; i < _betlineObj.length; i++) {
            var checkboxID = (_betlineObj[i].CHECKBOXID)
            if (!$.isNullOrEmpty(checkboxID)) {
                $("#" + checkboxID).click();
            }
        }
    }
    catch (e) {
        $(".codds input:checked").each(function() {
            $(this).click();
            $(this).blur();
        });
    }
}

// clear the Investment Calculator value, for page odds_mixallup_all.aspx
function clearCaculator(caculatorObj) {
    //var calcuText = $(".tblMixCal");
    if (caculatorObj != null && caculatorObj != 'undefined') {
        caculatorObj.find("span").each(function() {
            //alert($(this).text());
            $(this).text("-");
        })
    }
}

//push betline array into objects
//objects[i][0] = type
//objects[i][1..n] = Betline objects

function GroupBetLineObjsByType(_betLineObjs, _type) {
    //add match IDs and associated odds to array
    var typeObjs = new Array();

    for (i = 0; i < _betLineObjs.length; i++) {
        switch (_type) {
            case "MATCH":
                if ($.inArray(_betLineObjs[i].MatchID, typeObjs) == -1) {
                    typeObjs[typeObjs.length] = _betLineObjs[i].MatchID;
                }
                break;
            case "SPCITEM":

                if ($.inArray(_betLineObjs[i].SPCKEY, typeObjs) == -1) {
                    typeObjs[typeObjs.length] = _betLineObjs[i].SPCKEY;
                }
                break;
            case "POOLTYPE":
                if ($.inArray(_betLineObjs[i].PoolTypeKey, typeObjs) == -1) {
                    typeObjs[typeObjs.length] = _betLineObjs[i].PoolTypeKey;
                }
                break;
            case "TOURN":
                if ($.inArray(_betLineObjs[i].TournID, typeObjs) == -1) {
                    typeObjs[typeObjs.length] = _betLineObjs[i].TournID;
                }
                break;
            case "TOURNPOOLGROUP":
                if ($.inArray(_betLineObjs[i].TournPoolGrpID, typeObjs) == -1) {
                    typeObjs[typeObjs.length] = _betLineObjs[i].TournPoolGrpID;
                }
                break;
        }
    }

    //sort according to pool group ID
    if (_type == "TOURNPOOLGROUP") {
        typeObjs.sort();
    }

    var arrObjs = new Array();
    for (i = 0; i < typeObjs.length; i++) {
        arrObjs[i] = new Array();
        var cntBetLine = 1;
        for (j = 0; j < _betLineObjs.length; j++) {
            switch (_type) {
                case "MATCH":
                    if (typeObjs[i] == _betLineObjs[j].MatchID) {
                        arrObjs[i][0] = typeObjs[i];
                        arrObjs[i][cntBetLine++] = _betLineObjs[j];
                    }
                    break;
                case "SPCITEM":
                    if (typeObjs[i] == _betLineObjs[j].SPCKEY) {
                        arrObjs[i][0] = typeObjs[i];
                        arrObjs[i][cntBetLine++] = _betLineObjs[j];
                    }
                    break;
                case "POOLTYPE":
                    if (typeObjs[i] == _betLineObjs[j].PoolTypeKey) {
                        arrObjs[i][0] = typeObjs[i];
                        arrObjs[i][cntBetLine++] = _betLineObjs[j];
                    }
                    break;
                case "TOURN":
                    if (typeObjs[i] == _betLineObjs[j].TournID) {
                        arrObjs[i][0] = typeObjs[i];
                        arrObjs[i][cntBetLine++] = _betLineObjs[j];
                    }
                    break;
                case "TOURNPOOLGROUP":
                    if (typeObjs[i] == _betLineObjs[j].TournPoolGrpID) {
                        arrObjs[i][0] = typeObjs[i];
                        arrObjs[i][cntBetLine++] = _betLineObjs[j];
                    }
                    break;
            }
        }
    }

    for (var i = 0; i < arrObjs.length; i++) {
        if (arrObjs[i][1].PoolType == "HIL" || arrObjs[i][1].PoolType == "CHL" || arrObjs[i][1].PoolType == "FHL") {
            var tempArrObjs = [];
            for (var j = 1; j < arrObjs[i].length; j++) {
                tempArrObjs.push(arrObjs[i][j]);
            }

            tempArrObjs.sort(function(a, b) {
                if (a.GOALLINE == b.GOALLINE)
                    return 0;
                else {
                    if (parseFloat(a.GOALLINE.split('/')[0]) < parseFloat(b.GOALLINE.split('/')[0]))
                        return -1;
                    else if (parseFloat(a.GOALLINE.split('/')[0]) > parseFloat(b.GOALLINE.split('/')[0]))
                        return 1;
                    else
                        return (parseFloat((a.GOALLINE + "/0").split('/')[1]) < parseFloat((b.GOALLINE + "/0").split('/')[1])) ? -1 : 1;
                }
            });

            for (var j = 1; j < arrObjs[i].length; j++) {
                arrObjs[i][j] = tempArrObjs[j - 1];
            }
        }
    }

    return arrObjs;
}

//format long desc selection
function formatLongDescSel(_text) {
    return "<span style=\"padding-left:16px\">" + _text + "</span>";
}