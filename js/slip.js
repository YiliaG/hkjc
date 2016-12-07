var cBetlineTableHeightDefault = 292;
var cBetlineTableHeight800x600 = 144;	
    
var cNumberOfBetlineShownDefault = 5;
var cNumberOfBetlineShown800x600 = 8;

var getDelayReplyOnce = false;

var previewDeleteMultipleBets = false;
var isProcessing = false;

function refreshSlipSize() {
  $j('#divBetLayer').height(cBetlineTableHeightDefault - heightReduct() - ((enableMultiSlipPanel == 'true') ? 18 : 0));
  $j('#divDisclaimer').height(cLowerFrameHeightDefault - heightReduct());
  if ($j('#previewFrame').is(":visible")) {
    if (showingXSellBanner) {
      $j('#previewFrame').height((cLowerFrameHeightDefault - heightReduct() - replyTableXsellHeight - 17) + 'px');
      proxy.sendMessage('BET_PREVIEW', 'RefreshFrameHeight', { IsXsell: true }, proxy.NO_CALLBACK);
    }
    else {
      $j('#previewFrame').height((cLowerFrameHeightDefault - heightReduct() - 17) + 'px');
      proxy.sendMessage('BET_PREVIEW', 'RefreshFrameHeight', { IsXsell: false }, proxy.NO_CALLBACK);
    }
  }
  $j('#divDisclaimerDetail').height(disclaimerDetailHeight());
}

function initSlipFrame() {
  //setActiveStyleSheet(this);

  // default static
  $('pic_clear').src = GetImageURL('pic_clear');
  $('pic_clear').title = GetText('alt_clear');
  $('pic_preview').src = GetImageURL('pic_preview');
  $('pic_preview').title = GetText('alt_preview');
  $('btnAddAlupSlip').src = GetImageURL('pic_addnew_all_up');
  $('btnAddAlupSlip').title = GetText('alt_addnew_all_up');
  $('pic_allup_help').src = GetImageURL('pic_allup_help');
  $('pic_allup_help').title = GetText('alt_pic_allup_help');
  $('slipOpenRod').title = GetText('alt_click_open_close');
  refreshSlipSize();

  $('ekbaDivTitle').innerHTML = GetText('ekba_header');
  $('pic_confirm').src = GetImageURL('pic_confirm');
  $('pic_confirm').title = GetText('txt_confirm');

  fldFormula.innerHTML = GetText('fld_formula');
  fldTotalNoOfBets.innerHTML = GetText('fld_total_no_of_bets');
  fldTotalAmount.innerHTML = GetText('fld_total_amount');

  if ( navigator.appVersion.indexOf('Mac') >= 0 ) {
    $('sel_formula').style.width = '60px';
    $('inputAllUp').style.width = '45px';
  }

  // other menu
  txtChgWebPassword.innerHTML = GetText('txt_chg_web_password');
  txtChgSecQuestion.innerHTML = GetText('txt_chg_sec_question');
  txtChgWebProfile.innerHTML = GetText('txt_chg_web_profile');
  txtPersonalSettings.innerHTML = GetText('txt_personal_settings');
  txtFootballLive.innerHTML = GetText('txt_football_live');

  // Support SSO
  $('pic_cancel').src = GetImageURL('pic_cancel');
  $('pic_cancel').title = GetText('alt_cancel');
  $('pic_backSSO').src = GetImageURL('pic_sso_back');
  $('pic_backSSO').title = GetText('alt_sso_back');
  $('pic_logoutSSO').src = GetImageURL('pic_logout');
  $('pic_logoutSSO').title = GetText('alt_logout');
  $('pic_confirmSSO').src = GetImageURL('pic_confirm');
  $('pic_confirmSSO').title = GetText('txt_confirm');

  $('pic_btn_error_close').src = GetImageURL('pic_btn_error_close');
  $('pic_btn_error_close').title = GetText('btn_close');

  $('txtForgetWebPass').innerHTML = GetText('alt_forget_webpass');
  $('txtForgetWebPass').style.fontSize = (GetLanguage() == 1) ? '12px' : '10px';
  $('txtForgetWebPass2').innerHTML = GetText('alt_forget_webpass');
  $('txtForgetWebPass2').style.fontSize = (GetLanguage() == 1) ? '12px' : '10px';

  ResetBetlineTable();
}

function SlipProcessLogout() {
  $('divSlipDefault').style.display = 'block';
  $('ekbaDivInput').value = '';
  idleAlertClose();
  RedrawBetlineTable();
  updateWebTVStatus();
}

function OnClickAllupHelp() {
  OpenPopup(1, url_allup_faq[GetLanguage()], 770, 550, 1, 1);
}

function ShowAllupBonus(isShow) {
  if (totalAllUpBetlines < 2)
    return;
    
  if (allUpBetlines[0].family != "FB")
    return;

  if (!isShow) {
    spanallupbonus.style.visibility="hidden";
    return;
  }
  
  var tmp_bonus;
  var string_bonus = "";
  var dummy = sel_formula.value.split("x");
  if (dummy[1] == "1") {
    tmp_bonus = func_get_allup_bonus(totalAllUpBetlines);
    if (parseInt(tmp_bonus, 10) > 0)
      string_bonus += totalAllUpBetlines.toString(); + " " + GetText("alt_allup_level") + tmp_bonus + "%<br>";
  } else {
    for (var i = 2; i <= totalAllUpBetlines; i++) {
      tmp_bonus = func_get_allup_bonus(i);
      if (!isNaN(tmp_bonus) && tmp_bonus != 0) {
        tmp_bonus = parseInt(tmp_bonus, 10);
        tmp_bonus = tmp_bonus / 100;
        string_bonus += i.toString() + " " + GetText("alt_allup_level") + tmp_bonus + "%<br>";
      } 
    }
  }
  if (string_bonus == "")
    return;
  
  var strHTML = "<table border=1 bordercolor=#000000 width=100% cellspacing=0 cellpadding=0 style='table-layout:fixed'>"
        + "<tr>"
        + "<td align=center style='left:0px;width:100%;word-wrap:break-word'>"
        + "<div style='background-color:#ffff00'>"
        + GetText("alt_allup_bonus") + " :<br>"
        + string_bonus + "</div></td></tr></table>";
  spanallupbonus.innerHTML = strHTML;
  spanallupbonus.style.visibility="visible";
}

function func_get_allup_bonus(allup_level) {
  var bet_type;
  if (check_is_cross_pool()) {
    bet_type = "x";
  } else {
    bet_type = allUpBetlines[0].type;
  }
  return func_search_bonus(bet_type , allup_level);
}

function check_is_cross_pool() {
  for (var i = 0 ; i < totalAllUpBetlines; i++) {
    for (var j = 0 ; j < i; j ++) {
      if (allUpBetlines[i].type != allUpBetlines[j].type)
        return true;
    }
  }
  return false;
}

function OnClickClose() {
  ResetBetlineTable();
  setBetSlipSize(stateDefault);
  $('divSlipDefault').style.display = 'block';
  //$('divBetPreview').style.display = 'none';
  $('divBetPreview').style.height = "1px";
  $('divBetPreview').style.width = "1px";
  $('divBetPreviewTable').style.width = "1px";
  $('divMsgholder').innerHTML = '';
  raiseXEvent(3);
  var xsell_timeout = MyParseInt(GetOnlinePara("XSellTimeout"), 5);
  setXsellTimeout();
  EnableAccInfo(true);
  EnableAddBetline(true);

  setPreviewReplyState(false, false);
}

function OnClickReset() {
  if ( isIdleAlert )
    return;

  if (totalBetlines < 1)
    return;

  if (!confirm(GetError("1304"))) {
    return;
  }
  ResetBetlineTable();

  // Support SSO
  isClientActionTaken(true);
}

function ResetBetlineTable() {
  DeleteAllAllUpBetlines();
  DeleteAllBetlines();
  RedrawBetlineTable();
  DrawAddAllUpButton();
  LoadAllUpFormula();
}

function OnClickPreview() {
  if (window['inValidUnitBet']) {
    window['inValidUnitBet'] = false;
    return;
  }

  showingXSellBanner = false;

    if (isIdleAlert)
        return;

    if (totalBetlines < 1) {
        alert(GetError("1204"));
        return;
    }

    if (!isNowLogon) {
        alert(GetError("1101"));
        return;
    }

    
        
    slipClose(true);
    //ResetIdleTimer(false);
    isClientActionTaken(true);

    HideAllError();
    DeleteAllAllUpBetlines();
    ResetAllAllUpButtons();
    LoadAllUpFormula();
    DrawAddAllUpButton();

    var jsonBetlinesObj = createBetObjectString();
    var save_password = GetDataStore('save_password');
    
    $('divMsgholder').innerHTML = '';
    //$('previewFrame').src = betSlipIBPath + "SlipBetPreview.aspx?lang=" + GetLanguage();
    proxy.sendMessage('BET_PREVIEW', 'InitBetPreview', { JsonBetlinesObj: createBetObjectString(), SavePassword: save_password, Language: GetLanguage() }, proxy.NO_CALLBACK);
    setBetSlipSize(statePreview);
    $('divSlipDefault').style.display = 'none';
//    $('divBetPreview').style.display = 'block';
    $('divBetPreview').style.height = divBetPreviewHeight;
    $('divBetPreview').style.width = divBetPreviewWidth;
    $('divBetPreviewTable').style.width = "500px";
    selectedBetLine = -1;
    isProcessing = false;

    EnableAccInfo(false);
    EnableAddBetline(false);

    setPreviewReplyState(true, false);
	
	// START Nielsen Online SiteCensus
	WATrackSendBetPreviewEvent();
	// END Nielsen Online SiteCensus
}

function ShowEKBA(isShow) {
  if (isShow) {
    //$('previewFrame').src = betSlipIBPath + "SlipBetPreview.aspx?lang=" + GetLanguage();
    //InitPopupFrame();
    HideAllError();
    //if (!navigatorType.safari || getBrowserInfo().fullVersion >= '5.1' || navigator.appVersion.indexOf('Mac') < 0) {
      setBetSlipSize(stateEKBA);
      $('txtForgetWebPass').style.display = '';
      $('txtForgetWebPass2').style.display = 'none';
    //}
    //else {
    //  $('txtForgetWebPass').style.display = 'none';
    //  $('txtForgetWebPass2').style.display = '';
    //}
    $('ekbaSeqQuestion').innerHTML = GetDataStore('ekbaQ');
    $('ekbaDivInput').value = '';

    // Support SSO
    if (!isSSOSignedIn()) {
        $('divEKBADefaultButton').style.display = 'block';
        $('divEKBASSOButton').style.display = 'none';
    }
    else {
        $('divEKBADefaultButton').style.display = 'none';
        $('divEKBASSOButton').style.display = 'block';
    }
    
    $('divEKBA').style.display = 'block';
    $('ekbaDivError').innerHTML = '';
    focusField($('ekbaDivInput'));
  } else {
    $('divEKBA').style.display = 'none';
    $('ekbaDivError').innerHTML = '';
    setBetSlipSize(stateDefault);
  }
}

var divBetPreviewHeight;
var divBetPreviewWidth;
var isShowingDisclaimer = false;
function ShowDisclaimer(isShow) {
  isShowingDisclaimer = isShow;
  if (isShow) {
    //      $('previewFrame').src = betSlipIBPath + "SlipBetPreview.aspx?lang=" + GetLanguage();    
    //      $('proxy').src = betSlipIBPath + "proxy.aspx";
    HideAllError();
    $('pulldown_service').style.visibility = 'hidden';
    setBetSlipSize(stateDisclaimer);
    $('divSlipDefault').style.display = 'none';
    $('tdText').innerHTML = GetText('disclaimer');    
    $('divDisclaimer').style.display = 'block';    
    refreshSlipSize();

    divBetPreviewHeight = $('divBetPreview').style.height;
    divBetPreviewWidth = $('divBetPreview').style.width;
    $('divBetPreview').style.height = "1px";
    $('divBetPreview').style.width = "1px";
    $('divBetPreviewTable').style.width = "1px";
    $('divBetPreview').style.display = 'block';

    setPreviewReplyState(false, false);
  } else {
    $('divDisclaimer').style.display = 'none';

    setBetSlipSize(stateDefault);
    ResetIdleTimer(false);
    ShowWelcome();
    sisisExist = 1;
    raiseXEvent(1);
    var xsell_timeout = MyParseInt(GetOnlinePara('XSellTimeout'), 5);
    setXsellTimeout();

    $('divSlipDefault').style.display = 'block';
  }
  EnableAccInfo(!isShow);
  EnableAddBetline(!isShow);
  checkFootballLiveDisplay();
  updateWebTVStatus();  
}

function OnClickClosePreview(deleteBetlineArray) {
	if ( isProcessing )
	  return;

if (deleteBetlineArray != "") {
    var aryDeleteBetLineIndex = deleteBetlineArray.split("|||");
    for (var i = 0; i < aryDeleteBetLineIndex.length; i++) {
        DeleteBetlineWithIndex(parseInt(aryDeleteBetLineIndex[i], 10), false);
    }
}

  HideAllError();
  setBetSlipSize(stateDefault);
  RedrawBetlineTable();
//  $('divBetPreview').style.display = 'none';
  $('divBetPreview').style.height = "1px";
  $('divBetPreview').style.width = "1px";
  $('divBetPreviewTable').style.width = "1px";
  $('divSlipDefault').style.display = '';
  $('divMsgholder').innerHTML = '';
  // $('previewFrame').src = '';
  EnableAccInfo(true);
  EnableAddBetline(true);

  setPreviewReplyState(false, false);
}

function OnClickCloseAndRecall() {
  OnClickClose();
  OnClickRecall();
}

function PostSendBetAction(long_new_balance, betReply, deleteBetlineArray, showUnknownAmount) {
  if (showUnknownAmount)
    ShowAccountBalance(unknownAmount);
  else if (long_new_balance >= 0)
    ShowAccountBalance(long_new_balance);

  if (deleteBetlineArray != "") {
    var aryDeleteBetLineIndex = deleteBetlineArray.split("|||");
    for (var i = 0; i < aryDeleteBetLineIndex.length; i++) {
      DeleteBetlineWithIndex(parseInt(aryDeleteBetLineIndex[i], 10), false);
    }
  }

  var iData = betReply;
  if (typeof iData == "undefined") {
    iData = '';
  }
  
  setPreviewReplyState(false, true);
  if (IsAllBetsAccepted(iData)) {
    switch (GetOnlinePara("XSellOption")) {
      case "1":
        is_xsell_timeout = false;
        var xsell_timeout = MyParseInt(GetOnlinePara("XSellTimeout"), 5);
        xsell_timer = setTimeout("xsell_timeout_func()", xsell_timeout * 1000);
        document.body.style.cursor = "wait";
        raiseXEvent(2);
        //if (sisisExist == 1)
        break;
      case "2":
        raiseXEvent(2);
        break;
      default:
    }
  }  
}

function disablePreviewButton() {
  frmPreview.pic_back.src = GetImageURL('pic_back_off');
  frmPreview.pic_send_bet.src  = GetImageURL('pic_send_bet_off');
  frmPreview.pic_del_bet.src  = GetImageURL('pic_delete_bet_off');
}

var showingXSellBanner = false;
function receiveXContent(id, content) {
  if (GetOnlinePara("XSellOption") == "0")
    return false;

  if (GetOnlinePara("XSellOption") == "1") {
    if (is_xsell_timeout == true)
      return false;

    document.body.style.cursor = "default";
  }

  if (isReply) {     
      $j('#divMsgholder').html(content);
  }

  if (isReply && content != '') {
    showingXSellBanner = true;
    refreshSlipSize();    
    proxy.sendMessage('BET_PREVIEW', 'RefreshFrameHeight', {IsXsell:true}, proxy.NO_CALLBACK);
  }
  return true;
}

function CheckRefreshUnitbet(index) {
  CheckUnitBet(index);
  refreshUnitBet(index);
}

function RedrawBetlineTable() {
  var bufHtml = new StringBuffer();
  var bgcolors = new Array('#F8F8F8', '#DFDFDF');
  var hlColors = '#FFFADC';

  var flag_select_display = true ;    // flag for display betline include space or not
                          // if bet type include GPW GPF, then do not show space
  if (totalBetlines >= 7) { // todo: for 1024 only?
    for (var i = 0; i < totalBetlines; i++) {
      if (betlines[i].family == "FB") {
        flag_select_display = false;
        break;
      }
    }                     
  }

  bufHtml.append('<table id="betTbl" border="0" width="100%" height="100%" cellspacing="0" cellpadding="0" style="padding:1px 0px 2px 0px;">');

  for ( var i=0; i<totalBetlines; i++ ) {
    var colspan = 4;

    // ALL UP IMAGES
    var allUpImage;
    if ( betlines[i].enableAllUp == cAllUpEnabled )
      allUpImage = GetImageURL('pic_btn_allup_off');
    else if ( betlines[i].enableAllUp == cAllUpSelected )
      allUpImage = GetImageURL('pic_btn_allup_on');
    else if ( betlines[i].enableAllUp == cAllUpDisabled )
      allUpImage = GetImageURL('pic_btn_allup_disabled');

    var allUpImageHtml = new StringBuffer();
    if ( betlines[i].enableAllUp != cAllUpNA ) {
    	allUpImageHtml.append('<img src="').append(allUpImage).append('" border="0" style="position:relative;top:1" ');
      allUpImageHtml.append('onclick="OnClickAllUpButton(').append(i).append(');" onMouseOver="betlines[')
                    .append(i).append('].alupHit = true;" onMouseOut="betlines[')
                    .append(i).append('].alupHit = false;" ');
      if ( betlines[i].enableAllUp == cAllUpEnabled && GetText('alt_allup_enabled') != '' )
        allUpImageHtml.append('title="').append(GetText('alt_allup_enabled')).append('"');
      else if (betlines[i].enableAllUp == cAllUpSelected && GetText('alt_allup_selected') != '' )
        allUpImageHtml.append('title="').append(GetText('alt_allup_selected')).append('"');
      else if (betlines[i].enableAllUp == cAllUpDisabled && GetText('alt_allup_disabled') != '' )
        allUpImageHtml.append('title="').append(GetText('alt_allup_disabled')).append('"');
      allUpImageHtml.append('>');
      colspan++;
    }

    bufHtml.append('<tr><td height="1%" style="cursor:pointer;border-bottom:1px solid #CCCCCC;background-color:')
           .append(bgcolors[i%2]).append('" title="')
           .append(betlines[i].betTitle).append('" onMouseOver="this.style.backgroundColor=\'')
           .append(hlColors).append('\'" onMouseOut="this.style.backgroundColor=\'')
           .append(bgcolors[i % 2]).append('\';if(isIDevice()){CheckRefreshUnitbet(') 
           .append(i).append(');}betlines[')
           .append(i).append('].resetHit();" onclick="betRowClick(\'').append(i).append('\');" id="betCell')
           .append(i).append('">');
    bufHtml.append('<table width="100%" border="0" cellspacing="0" cellpadding="2">');

    // LINE 1 NUMBER
    bufHtml.append('<tr><td width="10px" valign="top" class="content" style="padding-left:2px;">').append(i+1).append('.</td>');
    // LINE 1 UPPER DISPLAY LINE
    bufHtml.append('<td class="content" colspan="').append(colspan + 1).append('" style="width:100%;max-width:250px;word-wrap:break-word">');
    bufHtml.append('<div style="float:left;');
    if (betlines[i].descOpen) {
      bufHtml.append('width=200px;max-width:200px;">');
      bufHtml.append(betlines[i].description.replace(/\[flag\]/g, GetLeagueFlagHTML(betlines[i].league)));

      if (betlines[i].isPartialUnit())
        bufHtml.append(' (').append(GetText('m6unit_name')).append(')');

      if ( betlines[i].isFlexiBet() )
        bufHtml.append('<br>').append(GetText('fld_bet_total')).append(' ').append(FormatCurrency(betlines[i].unitBet)).append(' (').append(GetText('flexibet_name')).append(')');
      else
        bufHtml.append('<br>').append(GetText('fld_bet_total')).append(' ').append(FormatCurrency(betlines[i].unitBet * betlines[i].numOfSelection));
    }
    else
      bufHtml.append('">').append(betlines[i].dispLine1);
      bufHtml.append('</div>');        
    // LINE 1 EDIT BUTTON
    /****************************** Begin [added for edit buttton added by kevin in 20011-10-27] ******************************************/  
    bufHtml.append('<div style="float:right; vertical-align:top;">');
    // LINE 1 DUPLICATE INDICATOR
    if (true == betlines[i].isDuplicated) {
        bufHtml.append('<span style="color:red;margin:0px 2px;border:0;vertical-align:top">').append(GetText('Duplicate Bet')).append('</span>');
    }     
    if (needEditButton(i)) bufHtml.append(editButton(i));
    /****************************** End [added for edit buttton added by kevin in 20011-10-27] ******************************************/    
    // LINE 1 DELETE BUTTON
    if (betlines[i].enableAllUp != cAllUpSelected) {
        bufHtml.append('<img src="images/icon_del.gif' + window["cacheVersion"] + '" border="0" onclick="if ( !isIdleAlert ){DeleteBetlineWithIndex(')
             .append(i).append(', true); isClientActionTaken(true);} event.cancelBubble=true;" onMouseOver="betlines[')
             .append(i).append('].delHit = true;" onMouseOut="betlines[')
             .append(i).append('].delHit = false;" id="betDel')
             .append(i).append('" title="')
             .append(GetText('alt_delete_betline')).append('">');
    }
    bufHtml.append('</div">');    
    bufHtml.append('</td></tr>');

    // LINE 2 LOWER DISPLAY LINE
    var line2 = betlines[i].dispLine2;
    if (betlines[i].family == "MK6") {
      if (betlines[i].dispLine2.length > 11)
        line2 = betlines[i].dispLine2.substring(0, 9) + "...";
    }
    else if ( betlines[i].family == 'HB' && totalBetlines < 7 ) {
      if (betlines[i].dispLine2.length > 10)
		if (betlines[i].dispLine2.substring(0, 3) == "CWA" ||
			betlines[i].dispLine2.substring(0, 3) == "CWB" ||
			betlines[i].dispLine2.substring(0, 3) == "CWC") {
			line2 = betlines[i].dispLine2.substring(0, 9) + "...";
		} else {
			line2 = betlines[i].dispLine2.substring(0, 8) + "...";
        }
    }
    else {
      if (betlines[i].dispLine2.length > 8)
        line2 = betlines[i].dispLine2.substring(0, 6) + "...";
    }

    bufHtml.append('<tr><td></td>');
    var alup = allUpImageHtml.toString();
    if ( alup != '' )
      bufHtml.append('<td width="1%" align="left">').append(alup).append('</td>');

    bufHtml.append('<td width="1%" align="left">');
    if ( !betlines[i].descOpen )
      bufHtml.append(GetLeagueFlagHTML(betlines[i].league));
    bufHtml.append('</td>');

    if ( !betlines[i].descOpen )
      bufHtml.append('<td align="left">').append(line2).append('</td>');
    else
      bufHtml.append('<td align="left"></td>');

    if (betlines[i].m6UnitBetAmountType > -1 && !isSingleM6Bet(betlines[i])) {
      bufHtml.append('<td class="content" align="right" colspan="3">');
      bufHtml.append(createM6UnitBetDropdown(i, m6DropdownTextPadding(betlines[i].unitBet.toString()), isSlipOpen));
      bufHtml.append('</td>');
    }
    else {
      // LINE 2 FLEXIBET OR UNITBET
      bufHtml.append('<td class="content" align="right" colspan="3" style="padding:2px 0px;">');
      bufHtml.append('<table style="border-spacing:0"><tr>');
      bufHtml.append('<td align="right" style="padding: 0px 2px;">');
      if ( betlines[i].betMethod==-1 )
        bufHtml.append('$');
      else {
        var defaultBetMethod = 'flexi_' + (isSlipOpen ? 'l' : 's');
        bufHtml.append(createFlexiDropdown(i, GetText(defaultBetMethod)[betlines[i].betMethod], isSlipOpen));
      }

      bufHtml.append('</td>');

      // LINE 2 UNIT BET INPUT BOX
      bufHtml.append('<td align="right" style="padding: 0px 1px;" width="35px">');

      bufHtml.append('<input id="inputAmount')
             .append(i).append('" type="text" maxlength="7" value="')
             .append(betlines[i].unitBet)
             .append('" class="inputField2" onFocus="betlines[')
             .append(i).append('].unitHit = true;" onMouseOver="betlines[')
             .append(i).append('].unitHit = true;" onMouseOut="betlines[')
             .append(i).append('].unitHit = false;"');

      if (betlines[i].family == "MK6")
        bufHtml.append(' disabled');
      else {
        bufHtml.append(' onblur="CheckRefreshUnitbet(')               
               .append(i).append(');"');
      }
      bufHtml.append('>');
      bufHtml.append('</td></tr></table>');                  
      bufHtml.append('</td>');
    }

    // POST
    bufHtml.append('</tr></table></td></tr>');
  }

  // display empty lines
  bufHtml.append('<tr><td colspan="4" style="background:url(')
          .append(GetImageURL('pic_slip_bg' + totalBetlines%2))
          .append(') top #FFFFFF;"><img src="images/spacer.gif' + window["cacheVersion"] + '"></td></tr>')
          .append('</table>');

  $('divBetLayer').innerHTML = bufHtml.toString();  
  UpdateBetTotal();
  
 }

function UpdateBetTotal() {
  var totalSelections = 0;
  var totalBetAmount = 0;
  for (var i = 0; i < totalBetlines; i++) {
    totalSelections += betlines[i].numOfSelection;
    if ( betlines[i].isFlexiBet() )  // flexibet
      totalBetAmount += parseInt(betlines[i].unitBet, 10);
    else
      totalBetAmount += betlines[i].numOfSelection * betlines[i].unitBet;
  }
  $('total_no_of_bets').innerHTML = totalSelections + "&nbsp;&nbsp;";
  $('fld_total_bet_amount').innerHTML = FormatCurrency(totalBetAmount) + "&nbsp;&nbsp;";
}

// input sample :
// 5+6+7+8+9+10+45+46+47+48
// 1+2+4>5+6+7+8+9+10+45+46+47+48
function get_split_mk6_betline_pos(str_mk6) {
  var num_of_picks_in_first_line = 3;
  var temp_count = 0;
  for (var i = 0; i < str_mk6.length; i++) {
    if (str_mk6.charAt(i) == '+' || str_mk6.charAt(i) == '>')
      temp_count++;
    if (temp_count >= num_of_picks_in_first_line)
      break;
  }
  return i;
}

function func_get_second_display_line(inval) {
  if (inval.length > 8) {
    return inval.substring(0,6) + '...';
  } else {
    return inval;
  }
}

function func_get_second_display_line_MK6(inval) {
  if (inval.length > 11) {
    return inval.substring(0,9) + '...';
  } else {
    return inval;
  }
}

function FormatCurrency(amount) {
  if (isNaN(amount)) {
    return amount;
  }
  return "$ " + CommaFormatted(CurrencyFormatted(amount));
}

function CurrencyFormatted(amount) {
  var i = parseFloat(amount);
  if(isNaN(i)) { i = 0.00; }
  var minus = '';
  if(i < 0) { minus = '-'; }
  i = Math.abs(i);
  i = parseInt((i + .005) * 100);
  i = i / 100;
  s = new String(i);
  if(s.indexOf('.') < 0) { s += '.00'; }
  if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
  s = minus + s;
  return s;
}

function CommaFormatted(amount)
{
  var delimiter = ","; // replace comma if desired
  var a = amount.split('.',2)
  var d = a[1];
  var i = parseInt(a[0]);
  var j = parseFloat(amount);
  if(isNaN(i) || isNaN(j)) { return ''; }
  var minus = '';
  if(j < 0) { minus = '-'; }
  i = Math.abs(i);
  var n = new String(i);
  var a = [];
  while(n.length > 3)
  {
    var nn = n.substr(n.length-3);
    a.unshift(nn);
    n = n.substr(0,n.length-3);
  }
  if(n.length > 0) { a.unshift(n); }
  n = a.join(delimiter);
  if(d.length < 1) { amount = n; }
  else { amount = n + '.' + d; }
  amount = minus + amount;
  return amount;
}

function DrawAddAllUpButton(isChgSlip) {
  if (totalAllUpBetlines > 1) {
    $('btnAddAlupSlip').style.display = 'block';
    $('inputAllUp').disabled = false;
    $('inputAllUp').style.color = '#000000';
    if (tmpAllUpValue != '') {
      $('inputAllUp').value = tmpAllUpValue;
      tmpAllUpValue = '';
    }
    else if ($('inputAllUp').value == '') {
      $('inputAllUp').value = '$' + GetSetting("UnitBet", "ALUPX", allUpBetlines[0].family);
      tmpAllUpValue = '';
    }
  } else {
    $('btnAddAlupSlip').style.display = 'none';
    $('inputAllUp').disabled = true;
    if (totalAllUpBetlines == 0)
      tmpAllUpValue = '';
    else if (!isChgSlip && totalAllUpBetlines == 1)
      tmpAllUpValue = $('inputAllUp').value;
    $('inputAllUp').value = '';
  }
}

function LoadAllUpFormula() {
  for (var i = 0; i < sel_formula.length; i++) {
    sel_formula.options[i] = null;
  }
  sel_formula.length = 0;
  sel_formula.disabled = true;
  
  if (totalAllUpBetlines >= min_allup && totalAllUpBetlines <= max_allup) {
    _LoadAllUpFormula(totalAllUpBetlines);
  }
}

function _LoadAllUpFormula(level) {
  var allup_flag = array_allup_level;
  for (var i = 0; i < allup_flag.length; i++) {
    if (level == allup_flag[i]) {
      var allup_comb = allup_formula[level].split(",");
      var pos = 0;
      for (var j = 0; j < allup_comb.length; j++) {
        var formula = level + "x" + allup_comb[j];
        var bAddAllup = true;
        
        if (allUpBetlines[0].family == "FB" && xml_event_seq["allupformula"] != "") {
          for (var k = 0; k < totalAllUpBetlines; k++) {
            if (func_search_allup_xml(allUpBetlines[k].type, formula) == "0") {
              bAddAllup = false;
              break;
            }
          }
        }
        
        if (bAddAllup) {
          sel_formula.options[pos] = new Option(formula, allup_comb[j]);
          if (j == 0)
            sel_formula.options[pos].selected = true;
          pos++;
        }
      }
      break;
    }
  }
  sel_formula.disabled = (sel_formula.length < 1);
}
/********************************************************************************
button handler
********************************************************************************/

/********************************************************************************
xsell
********************************************************************************/

function change_color_mouse_over(inobj) {
  inobj.style.backgroundColor='#c3c3c3';
  inobj.style.cursor = "hand";
}

function change_color_mouse_oout(inobj) {
  inobj.style.backgroundColor='#e8e8e8';
  inobj.style.cursor = "default";
}

function refreshUnitBet(index) {
  UpdateBetTotal();
  betlines[index].unitHit = false;
}

function inputAllUpValueChanged(i) {
  if ( !inputAllUp.disabled ) {
    var allUpVal = inputAllUp.value.replace('$', '');
    if ( parseInt(allUpVal, 10)+i > 0 )
      inputAllUp.value = '$' + (parseInt(allUpVal, 10)+i);
  }
}

function selectPreviewRow(obj) {
	if ( isProcessing )
	  return;

  if ( !obj.clicked && !previewDeleteMultipleBets )
    resetPreviewRow();

  frmPreview.pic_del_bet.src = GetImageURL('pic_delete_bet_off');
  var tds = obj.getElementsByTagName('td');
  for ( var i=0; i<tds.length; i++ ) {
		if ( !obj.clicked )
			tds[i].style.backgroundColor = '#FFFADC';
    else
      tds[i].style.backgroundColor = '';
  }
  obj.clicked = !obj.clicked;

  if ( getSelectedRowCount() > 0 )
    frmPreview.pic_del_bet.src = GetImageURL('pic_delete_bet');
}

function resetPreviewRow() {
  var obj = document.getElementById('previewBetTb');
  var trs = obj.getElementsByTagName('tr');
  for ( var i=0; i<trs.length; i++ ) {
    var tds = trs[i].getElementsByTagName('td');
    for ( var j=0; j<tds.length; j++ ) {
      tds[j].style.backgroundColor = '';
    }
    trs[i].clicked = false
  }
}

function getSelectedRowCount() {
  var cnt = 0;
  var obj = document.getElementById('previewBetTb');
  var trs = obj.getElementsByTagName('tr');
  for ( var i=0; i<trs.length; i++ ) {
		if ( trs[i].clicked )
			cnt++;
  }
  return cnt;
}

var idleAlertTimer;
var isIdleAlert = false;
function idleAlertInit(timeout) {
  if ( timeout==0 ) {
    idleAlertLogout(true);
    return;
  }

  restoreSize();

  
  $$("divIdleAlertLogoutTips").html(GetText("idle_alert_logout_tips"));
  $$("divIdleAlertLogoutTimeTips").html($$.format(GetText("idle_alert_logout_time_tips"), timeout));
  $('divIdleAlertStay').innerHTML = GetText('idle_alert_stay_service');
  $('divIdleAlertLogout').innerHTML = GetText('idle_alert_logout_service');
  $('divIdleAlert').style.display = 'block';

  editInAlertMode();
  
  //disbale sound for iOS devices
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (iOS == false) {
      SoundAlert();
  }

  var idleAlertM = document.getElementsByName('idleAlertM');
  idleAlertM[sessionIdleTime == 60 ? 1 : 0].checked = true;
  
  isIdleAlert = true;

  idleAlertTimer = setTimeout('idleAlertInit(' + (timeout-1) + ')', 60*1000);  
}

function SoundAlert() {
    $("divIdleAlertSound").innerHTML = "";
    $("divIdleAlertSound").innerHTML = "<EMBED SRC='" + idleAlertSoundPath + "' HEIGHT=1 WIDTH=1 />";
}

function idleAlertClose() {
  ResetIdleTimer(true);
  clearTimeout(idleAlertTimer);
  $('divIdleAlert').style.display = 'none';
  $("divIdleAlertSound").innerHTML = '';
  isIdleAlert = false;
  ClosePopup(0);   //Close popup idle alert reminder
  maskBetslip();
}

function idleAlertClose2() {
    clearTimeout(idleAlertTimer);
    $('divIdleAlert').style.display = 'none';
    $("divIdleAlertSound").innerHTML = '';
    isIdleAlert = false;
    ClosePopup(0);     //Close popup idle alert reminder    
}

function idleAlertLogout(forceLogout) {    
    if (forceLogout) {
        SetDataStore('is_idle_logout', '1');
		if (isRemoveSSOTokenOnTimeOut()) {
			OnClickLogout(true);
		}
		else {
			sendLogoutASOnlyRequest();
		}
        clearTimeout(idleAlertTimer);
        $('divIdleAlert').style.display = 'none';
        $("divIdleAlertSound").innerHTML = '';
        isIdleAlert = false;
        slipClose(true);
        EnableAccInfo(false);
        multiSlipPanel.resetPanel();        
    }
    else {
        // Support SSO
        SetDataStore('is_idle_logout', '0');
        buttonLogout();
    }
}

function buttonLogout() {
  if (EnableAccInfo()) {
    // Support SSO
    if (isSSOEnabled()) {
      if (isInSSOChecking()) {
        return;
      }
      CheckStatusOnClickLogout();
    }
    else {
      OnClickLogout(false);
    }
    clearTimeout(idleAlertTimer);
    $('divIdleAlert').style.display = 'none';
    $("divIdleAlertSound").innerHTML = '';
    isIdleAlert = false;
    slipClose(true);
    cancelEdit();
  }
}

function OnClickChgWebPassword() {
  //setTimeout(function() {
    top.location = url_chg_web_pass[GetLanguage()];
  //}, 500);
}

function OnClickChgSecQuestion() {
  //setTimeout(function() {
    top.location = url_chg_sec_question[GetLanguage()];
  //}, 500);
}

function OnClickChgWebProfile() {
  //setTimeout(function() {
    top.location = url_chg_web_profile[GetLanguage()];
  //}, 500);
}

//function OnClickPersonalSettings() {
//  OnClickPersonalSettings();
//}

var xsell_timer;
function setXsellTimeout(funcStr, timeoutVal) {
  var xsell_timeout = MyParseInt(GetOnlinePara("XSellTimeout"), 5);
  xsell_timer = setTimeout("xsell_timeout_func2()", xsell_timeout * 1000);
}

function clearXsellTimeout() {
  clearTimeout(xsell_timer);
}

function xsell_timeout_func2() {
  sisisExist = 0;
}

// support SSO
function OnClickLoginEKBACancel() {
    $('ekbaDivError').innerHTML = '';
    ShowEKBA(false);
    isInEKBA(false);

    ProcessLogoutResult();
}

// support SSO
function OnClickLoginEKBALogout() {
    $('ekbaDivError').innerHTML = '';
    ShowEKBA(false);
    isInEKBA(false);

    sendLogoutSSOOnlyRequest();
}

// support SSO
function OnClickLoginEKBABack() {
    $('ekbaDivError').innerHTML = '';
    ShowEKBA(false);
    isInEKBA(false);
//    if (!isSSOSignedIn()) {
//        alert(GetError("SSO_SIGN_OUT_PASSIVE"));
//    }
    ProcessLogoutResult();
}

// Support SSO
function ReceiveSendBetTicketExtendResults(lastExtendStatus, lastExtendError, checkStatus, signInLevel, webID, ssoGUID) {
    SetDataStore('sso_last_extend_status', lastExtendStatus);
    SetDataStore('sso_last_extend_error', lastExtendError);
    SetDataStore('sso_check_return_status', checkStatus);
    SetDataStore('sso_sign_in_level', signInLevel);
    SetDataStore('sso_web_id', webID);
    SetDataStore('sso_guid', ssoGUID);
    processSSOTicketExtendResult();
}

// support chi handwriting button show/hide
function ShowHandwritingButton(isShow) {
    if (isShow) {
        //add a button if not created yet
        if ($('pphw_btn_ekba') == null) {
          //$j('#ekbaDivInput').after(PenPower.createPenButton('ekbaInputPPHWDiv', 'ekbaDivInput', 'pphw_btn_ekba'));
          $j('#ekbaDivInput').after('<input type="button" id="pphw_btn_ekba" class="pp_pen_btn_closed" />');

          $j("#pphw_btn_ekba").click(function(event) {
            $j("#pphw_btn_ekba").toggleClass("pp_pen_btn_opened");
            event.preventDefault();

            var btnPos = $j(this).offset();
            var btnHeight = $j(this).height();
            var pos = {
              //left: Math.round(btnPos.left),
              left: 0,
              top: (Math.round(btnPos.top) + btnHeight)
            };
            if ($j("#pphw_btn_ekba").hasClass("pp_pen_btn_opened")) {
              pphwApp.showPanel(pos);
              WATrackChiHW();
            }
            else
              pphwApp.hidePanel(pos);
          });
         
        }
    } else {
        //remove the button if created
        if ($('pphw_btn_ekba') != null)
            $j('#pphw_btn_ekba').remove();
    }
}
