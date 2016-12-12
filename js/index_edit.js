//static var for edit bet
var pageLookup = { //HR bet type
    'WIN': 'odds_wp.aspx', 'PLA': 'odds_wp.aspx', 'W-P': 'odds_wp.aspx',
    'QPL': 'odds_wpq.aspx', 'QQP': 'odds_wpq.aspx', 'QIN': 'odds_wpq.aspx',
    'TCE': 'odds_tce.aspx', 'TRI': 'odds_tri.aspx', 'F-F': 'odds_ff.aspx',
    'DBL': 'odds_dbl.aspx', 'TBL': 'odds_tbl.aspx', 'D-T': 'odds_dt.aspx',
    'T-T': 'odds_tt.aspx', '6UP': 'odds_6up.aspx', 'JKC': 'odds_jkc.aspx',
    'ALUP': 'odds_cross_alup.aspx', 'ALUP-TRI': 'odds_tri_alup.aspx', 'QTT': 'odds_qtt.aspx'
};
var getMeetingsURL = 'http://[host]/racing/getXML.aspx?type=MEETINGS';

/******** for info page access start ******/
var curEditingBetline = '';
var curEditingUnitBet = '';
var curEditingIsFlexiBet = false;

function isEditing() {
    return editInfo.editLine != -1;
}

function enterEditMode() {
    //ack that Info page entered edit mode
    if (isEditing() && editInfo.editMode != EDITING) {
        editInfo.editMode = EDITING;
        editInfo.preeditTimerStop();
    }
}
/******** for info page access end ********/

/************* edit modes *****************/
var NOT_EDITING = 0;
var PRE_EDITING = 1;
var EDITING = 2;

var editInfo = {
    editLine: -1, enableAllUp: 0, isPrevAllUp: false, prevUnitBet: 10,
    editMode: NOT_EDITING, redirectPage: '',
    preeditTimer: null,
    isEditingLine: function(lineNum) {
        try {
            var qLNum = parseInt(lineNum, 10);  //query line num
            var eLNum = parseInt(this.editLine, 10) //editing line num
            return qLNum == eLNum;
        } catch (e) {
            return false;
        }
    },
    isConsistentBetInfo: function(qBetInfo) {
        return betlines[this.editLine].family == qBetInfo.family;   //check if same family
    },

    //preeditTimer functions
    _preeditTimeoutHdlr: function() {
        cancelEdit();
    },
    preeditTimerStart: function() {
        this.preeditTimer = setTimeout(this._preeditTimeoutHdlr, preeditTimeout * 1000);
    },
    preeditTimerStop: function() {
        if(this.preeditTimer)
            clearTimeout(this.preeditTimer);
    }
    //preeditTimer functions end
};

/******** retrive meeting dates start *****/
// var meetings = new Array();

// if (enableEdit.toLowerCase() == 'true') {
// 	getMeetings();
// }

function getMeetings(callbacks) {
    $j.ajax({
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "getMeetingDates",
        url: getMeetingsURL.replace('\[host\]', parent.location.hostname),
        error: function() {
            if (callbacks && callbacks.error)
                callbacks.error();
        },
        success: function(json) {
            var mDate;
            $j.each(json.meetings, function(i, v) {
                if ($j.inArray(v, meetings) == -1)
                    meetings.push(v);
            });
            if (callbacks && callbacks.success)
                callbacks.success();            
        }
    });
}

function getMeetingDate(venue, weekday) {
    var date = null;
    $j.each(meetings, function(i, v){
        if(v.venue == venue && v.weekday == weekday)
            date = v.date;
    });
    return date;    
}
/******** retrive meeting dates end *******/

function blockElement(element, css) {
    if (!css) css = {};

    if (!css.height) css.height = element.height() + 'px';
    if (!css.width) css.width = element.width() + 'px';
    
    css.top = element.position().top + 'px';
    css.left = element.position().left + 'px';

    var div = '<div class="blockElement"></div><div class="blockElementCover"></div>';
    if(element.children('.blockElement').length < 1)
        element.append(div);
    element.children('.blockElement').removeClass('blockElementInAlert');
    element.children('.blockElement').css(css);
}

function unblockElement(element) {
    element.children('.blockElement, .blockElementCover').remove();
}

function unmaskBetslip() {
    if (isEditing()) {
        var editLine = editInfo.editLine;

        editInfo.editLine = -1;
        editInfo.editMode = NOT_EDITING;
        curEditingBetline = '';

        unblockElement($j('#divAccInfoMinimize'));
        unblockElement($j('#editBetMask'));
        unblockElement($j('#divSlipDefault').closest('body'));

        scrollToCell(editLine);
    }
}

function cancelEdit() {
    unmaskBetslip();
    //slipFrame.RedrawBetlineTable();
    RedrawBetlineTable();
}

function editButton(lineNum) {
    var btnHTML = new StringBuffer();
    btnHTML.append('<img style="margin:0px 2px 0px 2px;border:0;" src="').append(GetEditPicture(false))
    .append('" id="editBtn').append(lineNum)
    .append('" onmouseout="pobj.betlines[').append(lineNum).append('].unitHit = false;" ')
    .append('onmouseover="pobj.betlines[').append(lineNum).append('].unitHit = true;" ')
    .append('onclick="pobj.editBet(\'').append(lineNum).append('\');"></img>')    
    
    return btnHTML.toString();
}

function GetEditPicture(isEditing) {
    return GetImageURL(isEditing ? "pic_editing" : "pic_edit");
}

//edit mode entry point
function editBet(lineNum) {
    slipClose(true);

    editInfo.editMode = PRE_EDITING;
    editInfo.editLine = lineNum;
    editInfo.enableAllUp = betlines[lineNum].enableAllUp;
    editInfo.isPrevAllUp = isAlUp(betlines[lineNum].type);
    editInfo.prevUnitBet = betlines[lineNum].unitBet;
    curEditingBetline = betlines[lineNum].betline;
    curEditingUnitBet = betlines[lineNum].unitBet;
    curEditingIsFlexiBet = betlines[lineNum].isFlexiBet();

    //turn on the preedit timer
    editInfo.preeditTimerStart();
    
    //mask betslip
    maskBetslip();

    //get page meta, then redirect to betting page
    getBetPageMeta(betlines[lineNum]);         
}

function maskBetslip() {
    if (isEditing()) {
        slipClose(true);

        if (isResolution800x600()) {
            unblockElement($j('#editBetMask'));
            unblockElement($j('#divSlipDefault').closest('body'));

            OnClickMinimize();
            blockElement($jfind('#divAccInfoMinimize'), null);
        }
        else {

            $j("#editBtn" + editInfo.editLine).attr({ src: GetEditPicture(true) });
            var cell = $j("#betCell" + editInfo.editLine);


            scrollToCell(editInfo.editLine);
                                                                           
            var cellDim = { cellH: cell.height(),
                cellW: cell.width(),
                cellT: cell.position().top,
                cellL: cell.position().left
            };

            var curHeight = $j('#divSlip').height();
            var curWidth = $j('#divSlip').width();

            var bdrUp = cellDim.cellT + 2;
            var bdrDn = curHeight - cellDim.cellT - cellDim.cellH - 2;
            var bdrLf = cellDim.cellL;
            var bdrRt = curWidth - cellDim.cellL - cellDim.cellW;

            var slipFrmCSS = {};
            if (!$$.browser.msie || isIE10()) {
                slipFrmCSS.width = cellDim.cellW;
                slipFrmCSS.height = cellDim.cellH;
                slipFrmCSS.borderWidth = bdrUp + " " + bdrRt + " " + bdrDn + " " + bdrLf;
            } else {
                slipFrmCSS.borderWidth = bdrUp + " " + bdrRt + " " + (bdrDn - 3) + " " + bdrLf;
            }

            blockElement($j('#divSlipDefault').closest('body'), slipFrmCSS);
            blockElement($j('#editBetMask'), null);
        }
    }
}

function editInAlertMode() {
    if (isEditing()) {
        if (isResolution800x600())
            unblockElement($j('#divAccInfoMinimize'));

        blockElement($j('#divSlipDefault').closest('body'), null);
        blockElement($j('#editBetMask'), null);
        $j('#divSlipDefault').closest('body').children('.blockElement').addClass('blockElementInAlert');
        $j('#divSlipDefault').closest('body').children('.blockElement').css({ width: '100%', height: '100%' });
    }
}

function cancelEditInLogout() {
    if (isEditing()) {
        cancelEdit();
        $('#info', window.parent.document).contentWindow.location.reload(true);
    }    
}

function needEditButton(lineNum) {
    return enableEdit.toLowerCase() == "true" &&
		   isHBEditable(betlines[lineNum]) &&
		   $j.inArray(betlines[lineNum].family, editFamily.split(',')) > -1;
}

function redirectBetPage(betInfo, pageMeta) {
    var urlSB = new StringBuffer();
    if (!$$.browser.msie)
        urlSB.append('http://' + parent.location.hostname);       
    
    var lang = GetLanguage() == 0 ? '&lang=en' : '';    
        
    switch (betInfo.family) {        
        case 'HB':                        
            var raceNo = parseInt(betInfo.raceNo, 10);
            if (isNaN(raceNo)) raceNo = '1';
                                                
            var isTriAlupVal = isTriAlup(betInfo.type);
            var pageType = isTriAlupVal ? 'ALUP-TRI' : betInfo.type.split(' ')[0];
            var isSwitchAlupPage = isTriAlupVal ? '&isSwitchAllUpPage=true' : '';

            urlSB.append('/racing/pages/').append(pageLookup[pageType])
            .append('?venue=').append(betInfo.venue)
            .append('&raceno=').append(raceNo).append('&date=').append(pageMeta.meetingDate)
            .append(lang).append(isSwitchAlupPage);
            break;
            
        case 'FB':
            break;
            
        case 'MK6':            
            break;
    }
    editInfo.redirectPage = urlSB.toString();
    $j('#info', window.parent.document).attr('src', urlSB.toString());    
}

function saveEditingBetline(betInfo) {
    //recover prev. allup status only for prev. non-allup bet type
    if (!editInfo.isPrevAllUp)
        betInfo.enableAllUp = editInfo.enableAllUp;

    if (!betInfo.containUnitBet)
        betInfo.unitBet = editInfo.prevUnitBet;
        
    SaveBetline(betInfo, editInfo.editLine);

    refreshAllUpBetlines(); //reconst.allup betline array
}

function isTriAlup(type) {
    return isAlUp(type) && type.indexOf('TRI') > -1;
}

function isHBEditable(betInfo) {
    //match pattern dd+dd+dd/dd+dd+dd/dd+dd+dd|dd+dd+dd/dd+dd+dd/dd+dd+dd
    return !(betInfo.type.split(' ')[0] == 'T-T' && betInfo.betSel.match(/^((([\d]{1,2}\+){2}[\d]{1,2}\/){2}([\d]{1,2}\+){2}[\d]{1,2})\|((([\d]{1,2}\+){2}[\d]{1,2}\/){2}([\d]{1,2}\+){2}[\d]{1,2})$/));
}

function isAlUp(type) {
    return type.indexOf('ALUP') > -1;
}

function getBetPageMeta(betInfo) {
    switch (betInfo.family) {
        case 'HB':
            var venue = betInfo.venue;
            var wDay = betInfo.betline.split(' ')[1];
            var meetingDate = getMeetingDate(venue, wDay);
            if (meetingDate)
                redirectBetPage(betInfo, { meetingDate: meetingDate });
            else {
                //try query meeting date again
                getMeetings({
                    error: function() { alert(GetError("EDIT_SEL_NO_LONGER_AVAILABLE")); cancelEdit(); },
                    success: function() {
                        meetingDate = getMeetingDate(venue, wDay);
                        if (meetingDate)
                            redirectBetPage(betInfo, { meetingDate: meetingDate });
                        else {
                            alert(GetError("EDIT_SEL_NO_LONGER_AVAILABLE")); cancelEdit();
                        }
                    }
                });
            }
            break;
        case 'MK6':
            break;
        case 'FB':
            break;
    }
}

function scrollToCell(editLine) {
    var cellHeight = $j('#betCell0').height();
    $j('#divBetLayer').scrollTop(cellHeight * editLine);
}

