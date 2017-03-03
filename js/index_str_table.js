
var cLangENG = 0;
var cLangCHT = 1;

var safari_private_mode_eng = "Please turn off the \"Private\" mode to proceed to Online Betting Service (eWin)";
var safari_private_mode_chi = "請關掉「私密瀏覽」模式以繼續使用網上投注服務「投注區」";

function GetLanguage() {
	var lang = parseInt(GetDataStore("language"));
	if (!isNaN(lang))
		return lang;
	return cLangCHT;
}

function SetLanguage(lang) {
	if (lang != cLangENG && lang != cLangCHT)
		return false;
	if (lang == GetLanguage())
		return false;
	if (isNowLogon) {
		// Support SSO
		if(isSSOEnabled()) {
		  if(isMSIE()){
		    setTimeout(function(){CheckStatusOnChangeLanguage();}, 0);
	    }else{
	      CheckStatusOnChangeLanguage();
	    }
	    SetDataStore("tempLang", lang);	    
	    return false;
		}	else {
     	var needLogout = confirm(GetError("SSO_SIGN_OUT_ACTIVE"));
     	if (needLogout) {
     	  if(isMSIE()){
     		  setTimeout(function(){ OnClickLogout(true);}, 0);
     		} else {
     		  OnClickLogout(true);
     		}
   		}	else {
   		    return false;
   		}
		}
	} else if (totalBetlines > 0 || (typeof multiSlipPanel != 'undefined' && multiSlipPanel.getTotalCount() > 0)) {
		if (!confirm(GetError("1402")))
			return false;
		DeleteAllAllUpBetlines();
		DeleteAllBetlines();
	} else if ( isInEKBA() ) {
	  return false;
	}
	
	SetDataStore("language", lang);
	ShortenAccInfo(false, true);
	setActiveStyleSheet(self); 
	initAccInfo();
	initSlipFrame();
	if (typeof multiSlipPanel != 'undefined') 
		multiSlipPanel.resetPanel();
	CloseAllPopup(false);
	
	return true;
}

function GetText(inval) {
	switch (GetLanguage()) {
		case (cLangENG) :
			if (array_en_name[inval] != undefined)
				return array_en_name[inval];
		case (cLangCHT) :
			if (array_ch_name[inval] != undefined)
				return array_ch_name[inval];
	}
	return inval;
}

function GetError(inval) {
	switch (GetLanguage()) {
		case (cLangENG) :
			if (array_en_error[inval] != undefined)
				return array_en_error[inval];
		case (cLangCHT) :
			if (array_ch_error[inval] != undefined)
				return array_ch_error[inval];
	}
	return inval;
}

function GetErrorByCode(code, defaultError) {
  var result = '';
  if ( code=='1' || code=='-1' ) {
    result = ParseErrorCode(defaultError);
  }
  else {
   	result = GetError(code);
	  if ( result==code )
	    result = defaultError;
  }
	return GetError(result);
}

function ParseErrorCode(as_error) {
	var pos_start = as_error.lastIndexOf("(");
	if (pos_start < 0)
		return as_error;
	var pos_end = as_error.indexOf(")", pos_start);
	if (pos_end < 0)
		return as_error;
	var result = as_error.substring(pos_start + 1, pos_end);
	if (isNaN(result))
		return as_error;
		
	return trim(result);
}

function GetImageURL(inval) {
	var imgUrl =((GetLanguage() == cLangENG) 
		? array_en_name["pic_path"] + array_en_name[inval]
		: array_ch_name["pic_path"] + array_ch_name[inval]);
	imgUrl += window["cacheVersion"];
	return imgUrl;
}

function GetLeagueFlagHTML(leagueShort) {
  if (leagueShort == undefined || leagueShort == null || leagueShort == "" || leagueShort == "0")
    return "";
  var leagueHTML = "<img src='" + JCBWLeagueFlagPath + "/flag_" + leagueShort + ".gif" + window["cacheVersion"] + "' "
           + "width=16 height=16 border=0 style='position:relative;top:1'>";
  return leagueHTML;
}

function setActiveStyleSheet(aFrame) {
  if ( GetLanguage()== cLangCHT ) {
    setActiveStyleSheetByLang(aFrame, "style_ch");
  }
  else {
  	setActiveStyleSheetByLang(aFrame, "style_en");
  }
}

function setActiveStyleSheetByLang(aFrame, title) {
/*  var i, a, main;
  for(i=0; (a = aFrame.document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) a.disabled = false;
    }
  }
*/
  for(var i=0; (a = aFrame.document.getElementsByTagName("link")[i]); i++) {
    var lHref = a.getAttribute('href');
    if ( GetLanguage()== cLangCHT ) {
      lHref = lHref.replace('_en', '_ch');
    }
    else {
      lHref = lHref.replace('_ch', '_en');
    }
    a.setAttribute('href', lHref);
  }
}

var array_en_name = new Array();
var array_ch_name = new Array();
var array_en_error = new Array();
var array_ch_error = new Array();

// ***************************** Image Path **************************************
array_en_name["pic_path"]					= "./images/";
array_ch_name["pic_path"]					= "./images/";

// ***************************** Image **************************************
array_en_name["pic_duelAuthent"]= "betslip_top_en.gif";
array_ch_name["pic_duelAuthent"]= "betslip_top_ch.gif";
array_en_name["pic_help"]				= "icon_help.gif";
array_ch_name["pic_help"]				= "icon_help.gif";
array_en_name["pic_help_on"]			= "guide_e_on.gif";
array_ch_name["pic_help_on"]			= "guide_c_on.gif";
array_en_name["pic_minimize"]			= "minimize.gif";
array_ch_name["pic_minimize"]			= "minimize.gif";
array_en_name["pic_minimize_on"]		= "minimize_on.gif";
array_ch_name["pic_minimize_on"]		= "minimize_on.gif";
array_en_name["pic_logout"]				= "btn_logout_en.gif";
array_ch_name["pic_logout"]				= "btn_logout_ch.gif";
array_en_name["pic_logout_on"]			= "btn_logout_on_en.gif";
array_ch_name["pic_logout_on"]			= "btn_logout_on_ch.gif";
array_en_name["pic_enlarge"]			= "enlarge_ewin_e.gif";
array_ch_name["pic_enlarge"]			= "enlarge_ewin_c.gif";
array_en_name["pic_slip_bg0"]			= "slip_bg0.gif";
array_ch_name["pic_slip_bg0"]			= "slip_bg0.gif";
array_en_name["pic_slip_bg1"]			= "slip_bg.gif";
array_ch_name["pic_slip_bg1"]			= "slip_bg.gif";
array_en_name["pic_btn_open_on"]  = "btn_open_on.gif";
array_ch_name["pic_btn_open_on"]  = "btn_open_on.gif";
array_en_name["pic_btn_open"]     = "btn_open.gif";
array_ch_name["pic_btn_open"]     = "btn_open.gif";
array_en_name["pic_btn_close_on"] = "btn_close_on.gif";
array_ch_name["pic_btn_close_on"] = "btn_close_on.gif";
array_en_name["pic_btn_close"]    = "btn_close.gif";
array_ch_name["pic_btn_close"]    = "btn_close.gif";
array_en_name["pic_btn_error_close"]    = "btn_error_close.gif";
array_ch_name["pic_btn_error_close"]    = "btn_error_close.gif";


array_en_name["pic_popup_open"]        = "btn_popup_open.gif";
array_ch_name["pic_popup_open"]        = "btn_popup_open.gif";
array_en_name["pic_popup_close"]       = "btn_popup_close.gif";
array_ch_name["pic_popup_close"]       = "btn_popup_close.gif";
array_en_name["pic_popup_save"]        = "btn_save_en.gif";
array_ch_name["pic_popup_save"]        = "btn_save_ch.gif";
array_en_name["pic_popup_save_on"]     = "btn_save_on_en.gif";
array_ch_name["pic_popup_save_on"]     = "btn_save_on_ch.gif";
array_en_name["pic_popup_closewin"]    = "btn_close_en.gif";
array_ch_name["pic_popup_closewin"]    = "btn_close_ch.gif";
array_en_name["pic_popup_closewin_on"] = "btn_close_on_en.gif";
array_ch_name["pic_popup_closewin_on"] = "btn_close_on_ch.gif";
array_en_name["pic_popup_default"]     = "btn_default_en.gif";
array_ch_name["pic_popup_default"]     = "btn_default_ch.gif";
array_en_name["pic_popup_default_on"]  = "btn_default_on_en.gif";
array_ch_name["pic_popup_default_on"]  = "btn_default_on_ch.gif";

/************ edit button  *********************/
array_en_name["pic_edit"]="btn_edit_e.gif";
array_ch_name["pic_edit"]="btn_edit_c.gif";
array_en_name["pic_editing"]="btn_editing_e.gif";
array_ch_name["pic_editing"]="btn_editing_c.gif";

array_en_name["alt_popup_open"]   = "Click Open/Close";
array_ch_name["alt_popup_open"]   = "按此開關";
array_en_name["alt_popup_closewin"]   = "Close";
array_ch_name["alt_popup_closewin"]   = "關閉";
array_en_name["alt_popup_default"]   = "Restore Default";
array_ch_name["alt_popup_default"]   = "還原預設值";
array_en_name["alt_popup_save"]   = "Save";
array_ch_name["alt_popup_save"]   = "儲存";

array_en_name["alt_click_open_close"] = "Click to expand/collapse";
array_ch_name["alt_click_open_close"] = "按此開關";


// no use
array_en_name["pic_ac_info_title"]		= "ac_info_e.gif";  //"en_ac_info_title.gif";
array_ch_name["pic_ac_info_title"]		= "ac_info_c.gif";  //"ch_ac_info_title.gif";
array_en_name["pic_question_mark_on"]	= "guide_e_on.gif";
array_ch_name["pic_question_mark_on"]	= "guide_c_on.gif";
array_en_name["pic_minimize_on"]		= "minimize_on.gif";
array_ch_name["pic_minimize_on"]		= "minimize_on.gif";
array_en_name["pic_maximize_on"]		= "maximize_on.gif";
array_ch_name["pic_maximize_on"]		= "maximize_on.gif";
array_en_name["pic_bs_loaded"]			= "en_bs_loaded.gif";
array_ch_name["pic_bs_loaded"]			= "ch_bs_loaded.gif";

// ***************************** ALT (mouse over) **************************************
array_en_name["alt_duelAuthent"]		= "Dual Authentication";
array_ch_name["alt_duelAuthent"]		= "雙重核對登入";
array_en_name["alt_logout"]			= "Logout";
array_ch_name["alt_logout"]			= "登出";
array_en_name["alt_help"]			= "eWin User Guide";
array_ch_name["alt_help"]			= "「投注區」使用指南";
array_en_name["alt_minimize"]			= "Minimize";
array_ch_name["alt_minimize"]			= "縮小";
array_en_name["alt_restore"]			= "Maximize";
array_ch_name["alt_restore"]			= "放大";
array_en_name["alt_no_silverlight"]		= "Click here to download & install Microsoft Silverlight";
array_ch_name["alt_no_silverlight"]		= "請按此下載及安裝 Microsoft Silverlight";


// ***************************** Account Info **************************************
// ***************************** Account Info **************************************
// ***************************** Account Info **************************************
array_en_name["pic_minimize_bg"]	= "minimize_en.gif";
array_ch_name["pic_minimize_bg"]	= "minimize_ch.gif";
array_en_name["pic_minimize_1024_bg"]	= "minimize_1024_en.gif";
array_ch_name["pic_minimize_1024_bg"]	= "minimize_1024_ch.gif";
array_en_name["pic_minimize_d_bg"]	= "minimize_d_en.gif";
array_ch_name["pic_minimize_d_bg"]	= "minimize_d_ch.gif";
array_en_name["pic_minimize_d_1024_bg"]	= "minimize_d_1024_en.gif";
array_ch_name["pic_minimize_d_1024_bg"]	= "minimize_d_1024_ch.gif";

// ***************************** Images **************************************
array_en_name["pic_login"]				= "btn_login_en.gif";
array_ch_name["pic_login"]				= "btn_login_ch.gif";
array_en_name["pic_login_on"]			= "btn_login_on_en.gif";
array_ch_name["pic_login_on"]			= "btn_login_on_ch.gif";
array_en_name["pic_login_dimmed"]			= "btn_login_dimmed_en.gif";
array_ch_name["pic_login_dimmed"]			= "btn_login_dimmed_ch.gif";
array_en_name["pic_confirm"]				= "btn_confirm_en.gif";
array_ch_name["pic_confirm"]				= "btn_confirm_ch.gif";
array_en_name["pic_confirm_on"]			= "btn_confirm_on_en.gif";
array_ch_name["pic_confirm_on"]			= "btn_confirm_on_ch.gif";
array_en_name["pic_refresh_balance"]	= "icon_refresh.gif";
array_ch_name["pic_refresh_balance"]	= "icon_refresh.gif";
array_en_name["pic_shorten"]			= "but_shorten.gif";
array_ch_name["pic_shorten"]			= "but_shorten.gif";
array_en_name["pic_shorten_o"]			= "but_shorten_o.gif";
array_ch_name["pic_shorten_o"]			= "but_shorten_o.gif";
array_en_name["pic_loading"]	        = "icon_loading.gif";
array_ch_name["pic_loading"]	        = "icon_loading.gif";
array_en_name["btn_enter"]	        = "btn_enter_en.gif";
array_ch_name["btn_enter"]	        = "btn_enter_ch.gif";
array_en_name["btn_enter_on"]	        = "btn_enter_on_en.gif";
array_ch_name["btn_enter_on"]	        = "btn_enter_on_ch.gif";


// support SSO
array_en_name["pic_next"]               = "btn_next_en.gif";
array_ch_name["pic_next"]               = "btn_next_ch.gif";
array_en_name["pic_next_on"]            = "btn_next_on_en.gif";
array_ch_name["pic_next_on"]            = "btn_next_on_ch.gif";
array_en_name["pic_next_off"]           = "btn_next_off_en.gif";
array_ch_name["pic_next_off"]           = "btn_next_off_ch.gif";
array_en_name["pic_cancel"]				= "btn_cancel_en.gif";
array_ch_name["pic_cancel"]				= "btn_cancel_ch.gif";
array_en_name["pic_cancel_on"]			= "btn_cancel_on_en.gif";
array_ch_name["pic_cancel_on"]			= "btn_cancel_on_ch.gif";
array_en_name["pic_sso_back"]		    = "btn_short_back_en.gif";
array_ch_name["pic_sso_back"]	    	= "btn_short_back_ch.gif";
array_en_name["pic_sso_back_on"]        = "btn_short_back_on_en.gif";
array_ch_name["pic_sso_back_on"]        = "btn_short_back_on_ch.gif";
array_en_name["pic_sso_back_off"]       = "btn_short_back_off_en.gif";
array_ch_name["pic_sso_back_off"]       = "btn_short_back_off_ch.gif";

// ***************************** Account Info Field Name Before Logon**************************************
// ***************************** Images **************************************
array_en_name["pic_account"]		= "en_ac_no.gif";
array_ch_name["pic_account"]		= "ch_ac_no.gif";
array_en_name["pic_password"]		= "en_password.gif";
array_ch_name["pic_password"]		= "ch_password.gif";	
array_en_name["pic_save_password"]	= "en_save_password.gif";
array_ch_name["pic_save_password"]	= "ch_save_password.gif";


array_en_name["pic_balance"]		= "en_balance.gif" ;
array_ch_name["pic_balance"]		= "ch_balance.gif" ;	

array_en_name["pic_name"]			= "en_name.gif" ;
array_ch_name["pic_name"]			= "ch_name.gif" ;		

// ***************************** Text **************************************
array_en_name["fld_account_no"]		= "Login Name";
array_ch_name["fld_account_no"]		= "登入名稱";

array_en_name["fld_web_password"]		= "Password";
array_ch_name["fld_web_password"]		= "密碼";

array_en_name["fld_save_password"]	= "Enter Password for Each Txn";
array_ch_name["fld_save_password"]	= "每次交易再儲入密碼";

array_en_name["alt_save_password"]	= "" ; //"Save Password for Transactions.";
array_ch_name["alt_save_password"]	= "在此儲存數碼證書密碼後，直至離開「投注區」前，每次傳送注項時便毋須再輸入密碼。";

array_en_name["alt_login"]		= "Login";
array_ch_name["alt_login"]		= "登入";

array_en_name["alt_register"]		= "Register Now";
array_ch_name["alt_register"]		= "新用戶登記";

array_en_name["alt_reg_online"]		= "I already have a betting account";
array_ch_name["alt_reg_online"]		= "我已經持有投注戶口";

array_en_name["alt_reg_apply"]		= "I do not have a betting account";
array_ch_name["alt_reg_apply"]		= "我尚未持有投注戶口";

array_en_name["alt_other_services"]	= "Cannot Login";
array_ch_name["alt_other_services"]	= "無法登入";

array_en_name["alt_forget_webpass"]	= "Forgot your Login Answer?";
array_ch_name["alt_forget_webpass"]	= "忘記登入答案?";

array_en_name["alt_details"]		= "Click to view bet details";
array_ch_name["alt_details"]		= "按此閱覽注項詳情";

array_en_name["alt_brief"]			= "Click to collapse";
array_ch_name["alt_brief"]			= "按此收合";

array_en_name["alt_dtls_brief"]		= "Bet details";
array_ch_name["alt_dtls_brief"]		= "詳細資料";

array_en_name["minimize_bets"]		= "No. of Bets";
array_ch_name["minimize_bets"]		= "總注數";

array_en_name["alt_confirm"]		= "Confirm";
array_ch_name["alt_confirm"]		= "登入";

// Support SSO
array_en_name["alt_next"]		= "Next";
array_ch_name["alt_next"]		= "下一步";

// ***************************** Account Info Field Name After Logon**************************************

array_en_name["alt_pic_transfer"]	= "Funds Transfer";
array_ch_name["alt_pic_transfer"]	= "轉賬服務";

array_en_name["alt_pic_settings"]	= "Settings";
array_ch_name["alt_pic_settings"]	= "設定";

array_en_name["alt_pic_ac_record"]	= "Betting A/C<br>Records";
array_ch_name["alt_pic_ac_record"]	= "戶口紀錄";

array_en_name["alt_pic_refresh_balance"]	= "Refresh balance";
array_ch_name["alt_pic_refresh_balance"]	= "更新結餘";

array_en_name["alt_pic_shorten"]	= "Shorten";
array_ch_name["alt_pic_shorten"]	= "縮短";

array_en_name["alt_pic_shorten_o"]	= "Restore";
array_ch_name["alt_pic_shorten_o"]	= "還原";

array_en_name["accinfo_fld_account_no"]		= "Account No.:";
array_ch_name["accinfo_fld_account_no"]		= "投注戶口號碼:";

array_en_name["accinfo_fld_name"]		= "Name:";
array_ch_name["accinfo_fld_name"]		= "姓名:";

array_en_name["accinfo_fld_balance"]	= "Balance:";
array_ch_name["accinfo_fld_balance"]	= "結餘:";

array_en_name["Not to display"]	= "Not to display";
array_ch_name["Not to display"]	= "設定為不顯示";

// ***************************** Account Logon Info **************************************
array_en_name["acc_logon_header"]		= "Thank you for using eWin!";
array_ch_name["acc_logon_header"]		= "歡迎使用「投注區」";

array_en_name["acc_logon_last_logon"]	= "Last successful login";
array_ch_name["acc_logon_last_logon"]	= "上次成功登入";

array_en_name["acc_logon_date"]			= "Date :";
array_ch_name["acc_logon_date"]			= "日期 :";

array_en_name["acc_logon_time"]			= "Time :";
array_ch_name["acc_logon_time"]			= "時間 :";

array_en_name["acc_logon_hk_remark"]	= "(HKT)";
array_ch_name["acc_logon_hk_remark"]	= "(香港時間)";


// ***************************** Slip **************************************
// ***************************** Slip **************************************
// ***************************** Slip **************************************

// ***************************** DivShortBetline Preview Bet **************************************
// ***************************** Images **************************************
array_en_name["pic_clear"]					= "btn_delbet_en.gif";
array_ch_name["pic_clear"]					= "btn_delbet_ch.gif";
array_en_name["pic_clear_on"]				= "btn_delbet_on_en.gif";
array_ch_name["pic_clear_on"]				= "btn_delbet_on_ch.gif";
array_en_name["pic_preview"]				= "btn_submit_en.gif";
array_ch_name["pic_preview"]				= "btn_submit_ch.gif";
array_en_name["pic_preview_on"]				= "btn_submit_on_en.gif";
array_ch_name["pic_preview_on"]				= "btn_submit_on_ch.gif";
array_en_name["pic_txn_rec"]				= "btn_check_recall_en.gif";
array_ch_name["pic_txn_rec"]				= "btn_check_recall_ch.gif";
array_en_name["pic_txn_rec_on"]				= "btn_check_recall_on_en.gif";
array_ch_name["pic_txn_rec_on"]				= "btn_check_recall_on_ch.gif";
array_en_name["pic_done"]					= "btn_done_en.gif";
array_ch_name["pic_done"]					= "btn_done_ch.gif";
array_en_name["pic_done_on"]				= "btn_done_on_en.gif";
array_ch_name["pic_done_on"]				= "btn_done_on_ch.gif";
array_en_name["pic_formula"]				= "en_formula.gif";
array_ch_name["pic_formula"]				= "ch_formula.gif";
array_en_name["pic_total_no_of_bets"]		= "en_total_bet.gif";
array_ch_name["pic_total_no_of_bets"]		= "ch_total_bet.gif";
array_en_name["pic_total_amount"]			= "en_amount.gif";
array_ch_name["pic_total_amount"]			= "ch_amount.gif";
array_en_name["pic_allup_help"]				= "icon_help.gif";
array_ch_name["pic_allup_help"]				= "icon_help.gif";

array_en_name["pic_betslip_title"]			= "bet_slip_title_e.gif"; // "en_bet_slip_title.gif";
array_ch_name["pic_betslip_title"]			= "bet_slip_title_c.gif"; // "ch_bet_slip_title.gif";

array_en_name["pic_betslip_title_beta"]		= "en_bet_slip_beta.gif";
array_ch_name["pic_betslip_title_beta"]		= "ch_bet_slip_beta.gif";

array_en_name["pic_x"]						= "x.gif";
array_ch_name["pic_x"]						= "x.gif";

array_en_name["pic_x_on"]					= "x_on.gif";
array_ch_name["pic_x_on"]					= "x_on.gif";

array_en_name["pic_btn_allup_disabled"]		= "icon_allup_dim_en.gif";
array_ch_name["pic_btn_allup_disabled"]		= "icon_allup_dim_ch.gif";

array_en_name["pic_btn_allup_off"]			= "icon_allup_en.gif";
array_ch_name["pic_btn_allup_off"]			= "icon_allup_ch.gif";

array_en_name["pic_btn_allup_on"]			= "icon_allup_on_en.gif";
array_ch_name["pic_btn_allup_on"]			= "icon_allup_on_ch.gif";

array_en_name["pic_addnew_all_up"]			= "btn_addslip_en.gif";
array_ch_name["pic_addnew_all_up"]			= "btn_addslip_ch.gif";

array_en_name["pic_addnew_all_up_on"]			= "btn_addslip_on_en.gif";
array_ch_name["pic_addnew_all_up_on"]			= "btn_addslip_on_ch.gif";

array_en_name["pic_no_silverlight"]     = "no_silverlight_en.gif";
array_ch_name["pic_no_silverlight"]     = "no_silverlight_ch.gif";

// ***************************** Images **************************************

// ***************************** TEXT **************************************
// ***************************** TEXT **************************************
array_en_name["txt_confirm"]			= "Confirm";
array_ch_name["txt_confirm"]			= "確定";
array_en_name["alt_clear"]				= "Clear Slip";
array_ch_name["alt_clear"]				= "刪除注項";
array_en_name["alt_preview"]			= "Send Bet";
array_ch_name["alt_preview"]			= "傳送注項";
array_en_name["alt_txn_rec"]			= "Transaction Records";
array_ch_name["alt_txn_rec"]			= "複查已納入彩池及轉賬交易";
array_en_name["alt_done"]				= "Done";
array_ch_name["alt_done"]				= "完成";


array_en_name["txt_bets"]					= "Bets";
array_ch_name["txt_bets"]					= "注";

array_en_name["fld_formula"]				= "Formula";
array_ch_name["fld_formula"]				= "過關方式";

array_en_name["fld_total_no_of_bets"]		= "Total No. of Bets";
array_ch_name["fld_total_no_of_bets"]		= "總注數";

array_en_name["fld_bet_total"]				= "Bet total";
array_ch_name["fld_bet_total"]				= "注項總額";

array_en_name["fld_total_amount"]			= "Total Amount";
array_ch_name["fld_total_amount"]			= "總投注金額";

array_en_name["fld_unit_bet"]				= "Unit Bet";
array_ch_name["fld_unit_bet"]				= "投注金額";

array_en_name["alt_del_bet_row"]			= "Delete Betting Line";
array_ch_name["alt_del_bet_row"]			= "刪除此注項";

array_en_name["alt_pic_allup_help"]			= "All Up betting demo";
array_ch_name["alt_pic_allup_help"]			= "過關投注示範";

array_en_name["alt_pic_record_help"]			= "Betting A/C Records Demo";
array_ch_name["alt_pic_record_help"]			= "戶口紀錄示範";

array_en_name["alt_allup_bonus"]			= "Bonus";
array_ch_name["alt_allup_bonus"]			= "額外彩金";

array_en_name["alt_allup_level"]			= "Level";
array_ch_name["alt_allup_level"]			= "關";

array_en_name["txt_allup_bets"]				= "Combinations: ";
array_ch_name["txt_allup_bets"]				= "過關注數:  ";

array_en_name["alt_addnew_all_up"]			= "Add All Up Bet";
array_ch_name["alt_addnew_all_up"]			= "加入過關注項";

array_en_name["txt_randGen"]    			= "(Random Generation)";
array_ch_name["txt_randGen"]    			= "(運財號碼)";

// **************************************** Setting menu items **************************************************

array_en_name["txt_chg_web_password"]		= "Change Password";
array_ch_name["txt_chg_web_password"]		= "更改密碼";

array_en_name["txt_chg_sec_question"]		= "Change Login Answers";
array_ch_name["txt_chg_sec_question"]		= "更改登入答案";

array_en_name["txt_chg_web_profile"]		= "Change Profile";
array_ch_name["txt_chg_web_profile"]		= "更改個人檔案";

array_en_name["txt_personal_settings"]		= " Personal Settings in eWin";
array_ch_name["txt_personal_settings"]		= "「投注區」個人設定";

array_en_name["txt_football_live"]		= "Football Live";
array_ch_name["txt_football_live"]		= "足智即場睇";

// ***************************** SlipPageDivSendBet Preview Bet **************************************

array_en_name["alt_preview_bet"]	= "Preview Bet";
array_ch_name["alt_preview_bet"]	= "預覽注項";

array_en_name["btn_close"]				= "Close";
array_ch_name["btn_close"]				= "關閉";
array_en_name["btn_icon_close"]		= "icon_close.gif";
array_ch_name["btn_icon_close"]		= "icon_close.gif";

array_en_name["pic_back"]		= "btn_back_en.gif";
array_ch_name["pic_back"]		= "btn_back_ch.gif";
array_en_name["pic_back_on"]  = "btn_back_on_en.gif";
array_ch_name["pic_back_on"]  = "btn_back_on_ch.gif";
array_en_name["pic_back_off"] = "btn_back_off_en.gif";
array_ch_name["pic_back_off"] = "btn_back_off_ch.gif";
array_en_name["alt_back"]		= "Back";
array_ch_name["alt_back"]		= "返回";

array_en_name["pic_delete_bet"]		= "btn_del_en.gif";
array_ch_name["pic_delete_bet"]		= "btn_del_ch.gif";
array_en_name["pic_delete_bet_on"]  = "btn_del_on_en.gif";
array_ch_name["pic_delete_bet_on"]  = "btn_del_on_ch.gif";
array_en_name["pic_delete_bet_off"] = "btn_del_off_en.gif";
array_ch_name["pic_delete_bet_off"] = "btn_del_off_ch.gif";
array_en_name["alt_delete_bet"]		= "Delete";
array_ch_name["alt_delete_bet"]	 	= "刪除";

array_en_name["alt_delete_betline"]	 = "Delete this betline";
array_ch_name["alt_delete_betline"]	 = "刪除此注項";

array_en_name["pic_send_bet"]			= "btn_send_en.gif";
array_ch_name["pic_send_bet"]			= "btn_send_ch.gif";
array_en_name["pic_send_bet_on"]	= "btn_send_on_en.gif";
array_ch_name["pic_send_bet_on"]	= "btn_send_on_ch.gif";
array_en_name["pic_send_bet_off"]	= "btn_send_off_en.gif";
array_ch_name["pic_send_bet_off"]	= "btn_send_off_ch.gif";
array_en_name["alt_send_bet"]			= "Send";
array_ch_name["alt_send_bet"]			= "傳送";

array_en_name["confirm_delete"]		= "Are you sure you want to delete?";
array_ch_name["confirm_delete"]		= "確定刪除注項？";

array_en_name["btn_check_bet"]		= "Transaction Record";
array_ch_name["btn_check_bet"]		= "複查已納入彩池及轉賬交易";

array_en_name["fld_item_no"]			= "Item";
array_ch_name["fld_item_no"]			= "注項";

array_en_name["fld_bet_type"]			= "Bet Type";
array_ch_name["fld_bet_type"]			= "投注類別";

array_en_name["fld_bet_detail"]		= "Transaction Detail";
array_ch_name["fld_bet_detail"]		= "細節";

array_en_name["fld_bet_amount"]		= "Amount";
array_ch_name["fld_bet_amount"]		= "金額";

array_en_name["fld_total"]				= "Total :";
array_ch_name["fld_total"]				= "總額 :";

array_en_name["fld_password"]			= "Password";
array_ch_name["fld_password"]			= "密碼";

array_en_name["alt_allup_enabled"]		= "Click to select betline to compose All Up bet" ;
array_ch_name["alt_allup_enabled"]		= "按此選取這注項作為過關投注" ;

array_en_name["alt_allup_selected"]		= "Click to select betline to compose All Up bet" ;
array_ch_name["alt_allup_selected"]		= "按此選取這注項作為過關投注" ;

array_en_name["alt_allup_disabled"]		= "Bet cannot be combined with bets already selected into an All Up" ;
array_ch_name["alt_allup_disabled"]		= "此注項不能與已選注項組成過關組合" ;

array_en_name["txt_in_play_game"]			= "Your In Play bet is being processed.<br>Please wait.";
array_ch_name["txt_in_play_game"]			= "閣下的「即場投注」注項正在處理中,<br>請稍候.";

array_en_name["txt_football"]				= "Football";
array_ch_name["txt_football"]				= "足球";

array_en_name["txt_marksix"]				= "Mark Six";
array_ch_name["txt_marksix"]				= "六合彩";

array_en_name["text_race"]					= "Racing";
array_ch_name["text_race"]					= "賽馬";

array_en_name["txt_cross_pool"]				= "Cross Pool";
array_ch_name["txt_cross_pool"]				= "混合";

array_en_name["txt_ALUP"]					= "Allup";
array_ch_name["txt_ALUP"]					= "過關";

array_en_name["FB_ALUP"]					= "Football All Up";
array_ch_name["FB_ALUP"]					= "足球過關";

array_en_name["HB_ALUP"]					= "Racing All Up";
array_ch_name["HB_ALUP"]					= "賽馬過關";

array_en_name["txt_password_alt"]			= "If you used a digital certificate to register for eWin, please input digital certificate password; otherwise, please input your eWin password.";
array_ch_name["txt_password_alt"]			= "如以數碼證書登記「投注區」即為數碼證書密碼。否則，即為「投注區」密碼。";

array_en_name["btn_send_bet_alt"]			= "If you do not see the \"BET CONFIRMATION\" screen within 15 seconds after you press \"SEND\", please use \"Transaction Records\" function to confirm whether the transactions with status \"Unknown\" have been accepted.";
array_ch_name["btn_send_bet_alt"]			= "按「傳送」鍵後，若在十五秒內仍未出現「注項紀錄」畫面， 請按「複查已納入彩池及轉賑交易」以確認狀況「不明」之注項是否被接納。";

// ***************************** eKBA Area **************************************

array_en_name["ekba_header"] = "Login Question";
array_ch_name["ekba_header"] = "登入問題";

// Support SSO
array_en_name["alt_cancel"]			= "Cancel";
array_ch_name["alt_cancel"]			= "取消";
array_en_name["alt_sso_back"]		    = "Back";
array_ch_name["alt_sso_back"]		    = "返回";

// ***************************** SlipPageDivReply Preview Bet **************************************

array_en_name["fld_bet_reply"]			= "Bet Confirmation";
array_ch_name["fld_bet_reply"]			= "注項紀錄";

array_en_name["fld_item_no_reply"]		= "No.";
array_ch_name["fld_item_no_reply"]		= "交易";

array_en_name["fld_reply_status"]		= "Status";
array_ch_name["fld_reply_status"]		= "狀況";

array_en_name["fld_reply_ref_no"]		= "Ref. No.";
array_ch_name["fld_reply_ref_no"]		= "交易編號";

array_en_name["UNKNOWN"]				= "Unknown";
array_ch_name["UNKNOWN"]				= "不明";

array_en_name["UNKNOWN_SPECIAL"]		= "Unknown";
array_ch_name["UNKNOWN_SPECIAL"]		= "不明";

array_en_name["INPLAY_UNKNOWN"]			= "Unknown";
array_ch_name["INPLAY_UNKNOWN"]			= "不明";

array_en_name["ACCEPTED"]				= "Accepted";
array_ch_name["ACCEPTED"]				= "接納";

array_en_name["REJECTED"]				= "Rejected";
array_ch_name["REJECTED"]				= "未被接納";

array_en_name["PROCESSING"]				= "Processing";
array_ch_name["PROCESSING"]				= "處理中";

array_en_name["max_payout"]				= "Maximum  Payout: " ;
array_ch_name["max_payout"]				= "注項最高派彩: " ;

// ***************************** Flexibet Text *************************************
array_en_name["flexi_s"]              = new Array("U", "B");
array_ch_name["flexi_s"]              = new Array("注", "總");

array_en_name["flexi_l"]              = new Array("Unit Bet", "Betline");
array_ch_name["flexi_l"]              = new Array("每注金額", "注項總額");

array_en_name["flexi_opt"]            = new Array("Unit Bet (U)", "Betline (B)");
array_ch_name["flexi_opt"]            = new Array("每注金額 (注)", "注項總額 (總)");

array_en_name["disable_flexibet"]     = "FLEXI BET on selected bet type(s) is not available.";
array_ch_name["disable_flexibet"]     = "所選投注種類暫時不能接受靈活玩。";

array_en_name["flexibet_name"]        = "FLEXI BET";
array_ch_name["flexibet_name"]        = "靈活玩";

array_en_name["dropdownAlt"]          = new Array('Unit Bet - specify a unit bet amount for each bet combination', '"Flexi Bet" - specify a total bet amount for the betline');
array_ch_name["dropdownAlt"]          = new Array('每注金額方式 - 指示每注的投注金額', '「靈活玩」- 自訂投注總額');

// ***************************** Marksix Unit bet Selection Text *************************************
array_en_name["m6unit_s"]             = new Array("PU", "U");
array_ch_name["m6unit_s"]             = new Array("部份注", "每注");

array_en_name["m6unit_l"]             = new Array("Partial Unit", "Unit Bet");
array_ch_name["m6unit_l"]             = new Array("部份注項單位", "每注金額");

array_en_name["m6unit_name"]          = "Partial Unit Investment";
array_ch_name["m6unit_name"]          = "部份注項單位";

// ***************************** idle alert message ********************************

array_en_name["idle_alert_msg"]      = "You have not sent any transactions in the past {0} mins. "
									 + "<br>For security reasons, your current session<br><strong class='important'>will be logged out in {1} minute(s).</strong>";
array_ch_name["idle_alert_msg"]      = "過去{0}分鐘，你的帳戶沒有發出任何交易指示。為保安理由，網上投注服務<br>"
                                     + "<strong class='important'>將於{1}分鐘後自動登出。</strong>";

array_en_name["idle_alert_stay"]     = "Continue";
array_ch_name["idle_alert_stay"]     = "繼續瀏覽";

array_en_name["idle_alert_logout"]   = "Logout";
array_ch_name["idle_alert_logout"]   = "登出";

array_en_name["idle_alert_stay_service"]     = "Continue to use Online Betting Service";
array_ch_name["idle_alert_stay_service"]     = "繼續使用網上投注服務";

array_en_name["idle_alert_logout_service"]   = "Logout Service";
array_ch_name["idle_alert_logout_service"]   = "登出系統";

array_en_name["idle_alert_logout_tips"]   = "You have not sent any transactions for an extended period of time.For security reasons, your current session";
array_ch_name["idle_alert_logout_tips"]   = "因閣下於限時內沒有傳送注項或進行轉賬，為保安理由，網上投注服務";

array_en_name["idle_alert_logout_time_tips"]   = "<b>will be logged out in {0} minute(s).</b>";
array_ch_name["idle_alert_logout_time_tips"]   = "<b>將於{0}分鐘後自動登出。</b>";

array_en_name["idle_alert_logouttime"]	= "You can choose to personalise your timeout period";
array_ch_name["idle_alert_logouttime"]	= "你可以選擇自行設定登出時限並繼續使用服務";

array_en_name["idle_alert_savedtime"]	= "Your personal timeout period have been saved";
array_ch_name["idle_alert_savedtime"]	= "你所選擇的登出時限已經儲存";

array_en_name["idle_alert_mins"]	= "mins";
array_ch_name["idle_alert_mins"]	= "分鐘";

array_en_name["idle_alert_save"]	= "Save";
array_ch_name["idle_alert_save"]	= "保存";


// ***************************** Betting Type **************************************

// *************** Mark Six (MK6) ************
array_en_name["MK6"]						= "Mark Six";
array_ch_name["MK6"]						= "六合彩";

// *************** Racing ************
array_en_name["AWN"]						= "All-up Win";
array_ch_name["AWN"]						= "獨贏過關";

array_en_name["APL"]						= "All-up Place";
array_ch_name["APL"]						= "位置過關";

array_en_name["AQF"]						= "All-up Quinella";
array_ch_name["AQF"]						= "連嬴過關";

array_en_name["6UP"]						= "6 up";
array_ch_name["6UP"]						= "六環彩";

array_en_name["TCE"]						= "Tierce";
array_ch_name["TCE"]						= "三重彩";

array_en_name["QTT"]						= "Quartet";
array_ch_name["QTT"]						= "四重彩";

array_en_name["T-T"]						= "Triple Trio";
array_ch_name["T-T"]						= "三Ｔ";

array_en_name["D-T"]						= "Double Trio";
array_ch_name["D-T"]						= "孖T";

array_en_name["QAD"]						= "QAD";
array_ch_name["QAD"]						= "四寶";

array_en_name["TBL"]						= "Treble";
array_ch_name["TBL"]						= "三寶";

array_en_name["DBL"]						= "Double";
array_ch_name["DBL"]						= "孖寶";

array_en_name["D-Q"]						= "Double Quinella";
array_ch_name["D-Q"]						= "孖Ｑ";

array_en_name["FCT"]						= "FCT";
array_ch_name["FCT"]						= "科加士";

array_en_name["QIN"]						= "Quinella";
array_ch_name["QIN"]						= "連贏";

array_en_name["WIN"]						= "Win";
array_ch_name["WIN"]						= "獨贏";

array_en_name["PLA"]						= "Place";
array_ch_name["PLA"]						= "位置";

array_en_name["W-P"]						= "Win-Place";
array_ch_name["W-P"]						= "獨贏及位置";

array_en_name["TRI"]						= "Trio";
array_ch_name["TRI"]						= "單Ｔ";

array_en_name["F-F"]						= "First 4";
array_ch_name["F-F"]						= "四連環";

array_en_name["BW"]							= "Bracket Win";
array_ch_name["BW"]							= "Fun組";

array_en_name["BWA"]						= "Bracket Win A";
array_ch_name["BWA"]						= "Fun組A";

array_en_name["BWB"]						= "Bracket Win B";
array_ch_name["BWB"]						= "Fun組B";

array_en_name["BWC"]						= "Bracket Win C";
array_ch_name["BWC"]						= "Fun組C";

array_en_name["BWD"]						= "Bracket Win D";
array_ch_name["BWD"]						= "Fun組D";

array_en_name["AUT"]						= "All-up Trio";
array_ch_name["AUT"]						= "單Ｔ過關";

array_en_name["QPL"]						= "Quinella Place";
array_ch_name["QPL"]						= "位置Ｑ";

array_en_name["QQP"]						= "Quinella-Quinella Place";
array_ch_name["QQP"]						= "連贏位置Ｑ";

array_en_name["AQP"]						= "All-up Quinella";
array_ch_name["AQP"]						= "連贏過關";

array_en_name["JKC"]						= "Jockey Challenge";
array_ch_name["JKC"]						= "騎師王";

array_en_name["CWA"]                        = "Composite Win CWA";
array_ch_name["CWA"]                        = "組合獨羸 CWA";

array_en_name["CWB"]                        = "Composite Win CWB";
array_ch_name["CWB"]                        = "組合獨羸 CWB";

array_en_name["CWC"]                        = "Composite Win CWC";
array_ch_name["CWC"]                        = "組合獨羸 CWC";

// *************** Football ************
array_en_name["HAD"]						= "HOME/AWAY/DRAW";
array_ch_name["HAD"]						= "主客和";

array_en_name["FHAD"]						= "FIRST HALF HAD";
array_ch_name["FHAD"]						= "半場主客和";

array_en_name["ALUPHAD"]					= "ALL-UP HOME/AWAY/DRAW";
array_ch_name["ALUPHAD"]					= "主客和過關";

array_en_name["HDC"]						= "HANDICAP";
array_ch_name["HDC"]						= "讓球";

array_en_name["HHAD"]						= "HANDICAP HOME/AWAY/DRAW";
array_ch_name["HHAD"]						= "讓球主客和";

//array_en_name["HFT"]						= "HALF TIME/FULL TIME";
array_en_name["HFT"]						= "HaFu";
array_ch_name["HFT"]						= "半全場";

array_en_name["HAFU"]						= array_en_name["HFT"] ;
array_ch_name["HAFU"]						= array_ch_name["HFT"] ;

//array_en_name["HFTP"]						= "HALF TIME/FULL TIME POOL";
array_en_name["HFTP"]						= "HaFu POOL";
array_ch_name["HFTP"]						= "半全場彩池";

//array_en_name["THFP"]						= "TREBLE HALF TIME/FULL TIME";
array_en_name["THFP"]						= "TREBLE HaFu";
array_ch_name["THFP"]						= "三寶半全場";

array_en_name["TQL"]						= "TO QUALIFY";
array_ch_name["TQL"]						= "晉級隊伍";

array_en_name["NTS"]						= "NEXT TEAM TO SCORE";
array_ch_name["NTS"]						= "下一隊入球";

array_en_name["FTS"]						= "FIRST TEAM TO SCORE";
array_ch_name["FTS"]						= "第一隊入球";

array_en_name["FHLO"]						= "FIRST HALF HIGH/LOW";
array_ch_name["FHLO"]						= "半場入球大細";

array_en_name["HFMP"]						= "6 HaFu";
array_ch_name["HFMP"]						= "6寶半全場";

array_en_name["HFMP6"]						= "6 HaFu";
array_ch_name["HFMP6"]						= "6寶半全場";

array_en_name["HFMP8"]						= "8 HaFu";
array_ch_name["HFMP8"]						= "8寶半全場";

array_en_name["CRS"]						= "CORRECT SCORE";
array_ch_name["CRS"]						= "波膽";

array_en_name["FCRS"]						= "FIRST HALF CORRECT SCORE";
array_ch_name["FCRS"]						= "半場波膽";

array_en_name["CRSP"]						= "CORRECT SCORE POOL";
array_ch_name["CRSP"]						= "波膽彩池";

//array_en_name["DHCP"]						= "DOUBLE HALF TIME/FULL TIME SCORE";
array_en_name["DHCP"]						= "DOUBLE HaFu SCORE";
array_ch_name["DHCP"]						= "孖寶半全膽";

//array_en_name["HCSP"]						= "HALF TIME/FULL TIME CORRECT SCORE POOL";
array_en_name["HCSP"]						= "HaFu CORRECT SCORE POOL";
array_ch_name["HCSP"]						= "半全膽";

array_en_name["TTG"]						= "TOTAL GOALS";
array_ch_name["TTG"]						= "總入球";

array_en_name["HILO"]						= "HIGH/LOW";
array_ch_name["HILO"]						= "入球大細";

array_en_name["OOU"]						= array_en_name["HILO"] ;
array_ch_name["OOU"]						= array_ch_name["HILO"] ;

array_en_name["OOE"]						= "ODD/EVEN";
array_ch_name["OOE"]						= "入球單雙";

array_en_name["FGS"]						= "FIRST SCORER";
array_ch_name["FGS"]						= "首名入球";

array_en_name["CHP"]						= "CHAMPION";
array_ch_name["CHP"]						= "冠軍";

array_en_name["CHPP"]						= "TOURNAMENT FORECAST";
array_ch_name["CHPP"]						= "冠亞軍";

array_en_name["TOFP"]						= array_en_name["CHPP"] ;
array_ch_name["TOFP"]						= array_ch_name["CHPP"] ;

array_en_name["ADTP"]						= "ADVANCED TEAMS";
array_ch_name["ADTP"]						= "晉級球隊";

array_en_name["GPF"]						= "GROUP FORECAST";
array_ch_name["GPF"]						= "小組一二名";

array_en_name["GPW"]						= "GROUP WINNER";
array_ch_name["GPW"]						= "小組首名";

array_en_name["TPS"]						= "TOP SCORER";
array_ch_name["TPS"]						= "神射手";

array_en_name["SPC"]						= "SPECIALS";
array_ch_name["SPC"]						= "特別項目";

array_en_name["SPC1"]						= "SPECIALS";
array_ch_name["SPC1"]						= "特別項目";

array_en_name["STB"]						= "SECTION HAD";
array_ch_name["STB"]						= "套餐主客和";

array_en_name["SCB"]						= array_en_name["STB"] ;
array_ch_name["SCB"]						= array_ch_name["STB"] ;

array_en_name["CHLO"]						= "CORNER HILO";
array_ch_name["CHLO"]						= "角球大細";

array_en_name["CHLO_LONG"]					= "CORNER HIGH/LOW";
array_ch_name["CHLO_LONG"]					= "角球大細";

// *************** Football DHCP Selectiong ************

array_en_name["VOID_Match"]					= "VOID";
array_ch_name["VOID_Match"]					= "無效";

array_en_name["FIELD_ALL"]					= "FIELD";
array_ch_name["FIELD_ALL"]					= "全餐";

array_en_name["HO_HomeOthers"]				= "HOME OTHERS";
array_ch_name["HO_HomeOthers"]				= "主其他";

array_en_name["DO_DrawOthers"]				= "DRAW OTHERS";
array_ch_name["DO_DrawOthers"]				= "和其他";

array_en_name["AO_AwayOthers"]				= "AWAY OTHERS";
array_ch_name["AO_AwayOthers"]				= "客其他";

// *************** Football 6寶半全場 Selectiong ************

array_en_name["V-V"]						= "VOID-VOID";
array_ch_name["V-V"]						= "無效-無效";

array_en_name["1-1"]						= "HOME-HOME";
array_ch_name["1-1"]						= "主-主";

array_en_name["1-X"]						= "HOME-DRAW";
array_ch_name["1-X"]						= "主-和";

array_en_name["1-2"]						= "HOME-AWAY";
array_ch_name["1-2"]						= "主-客";

array_en_name["X-1"]						= "DRAW-HOME";
array_ch_name["X-1"]						= "和-主";

array_en_name["X-X"]						= "DRAW-DRAW";
array_ch_name["X-X"]						= "和-和";

array_en_name["X-2"]						= "DRAW-AWAY";
array_ch_name["X-2"]						= "和-客";

array_en_name["2-1"]						= "AWAY-HOME";
array_ch_name["2-1"]						= "客-主";

array_en_name["2-X"]						= "AWAY-DRAW";
array_ch_name["2-X"]						= "客-和";

array_en_name["2-2"]						= "AWAY-AWAY";
array_ch_name["2-2"]						= "客-客";

// *************************************** Current Session Records ***************************************

array_en_name["alt_ac_records"]					= "Account Records";
array_ch_name["alt_ac_records"]					= "戶口紀錄";

array_en_name["alt_30days_ac_records"]			= "Past 30 days Account Records";
array_ch_name["alt_30days_ac_records"]			= "過去30天戶口紀錄";

array_en_name["alt_60days_ac_records"]			= "Past 60 days Account Records";
array_ch_name["alt_60days_ac_records"]			= "過去60天戶口紀錄";

array_en_name["alt_cs_records"]					= "Current Session Records";
array_ch_name["alt_cs_records"]					= "是次交易紀錄";

array_en_name["alt_tran_records"]				= "Transaction Records";
array_ch_name["alt_tran_records"]				= "複查已納入彩池及轉賬交易";

array_en_name["alt_print"]						= "Print";
array_ch_name["alt_print"]						= "列印";

array_en_name["alt_close"]						= "Close";
array_ch_name["alt_close"]						= "關閉";

array_en_name["alt_cs_records_text1"]			= "Current Session Records would be cleared after logging off.";
array_ch_name["alt_cs_records_text1"]			= "複查是次登入之每項交易細節。客戶登出「投注區」後，此處紀錄亦將被清除。";

// array_en_name["alt_cs_records_text2"]			= "Please use <span onclick=\"location.href = '" + BetSlipIBPath + "recall.aspx?lang=0'\" onmouseover=\"change_cursor_hand(this)\" onmouseout=\"change_cursor_default(this)\"><u>Transaction Record</u></span> function to confirm whether the transactions with status <b>Unknown</b> have been accepted.";
// array_ch_name["alt_cs_records_text2"]			= "*如 閣下發現狀況「<b>不明</b>」之交易紀錄，請按此查閱 <span onclick=\"location.href = '" + BetSlipIBPath + "recall.aspx'\"  onmouseover=\"change_cursor_hand(this)\" onmouseout=\"change_cursor_default(this)\"><u>複查已納入彩池及轉賬交易</u></span>。";

array_en_name["alt_no_cs_records"]				= "No records in current session.";
array_ch_name["alt_no_cs_records"]				= "是節未有交易紀錄。";

array_en_name["alt_print_tip"]					= 'Prints only transaction records displayed on this page. Press "Print" on the last page for the full list of records.';
array_ch_name["alt_print_tip"]					= "只列印本頁所顯示的交易紀錄。如要列印全部紀錄，請到最後一頁按列印。";

array_en_name["pic_print"]			= "btn_print_en.gif";
array_ch_name["pic_print"]			= "btn_print_ch.gif";

array_en_name["pic_print_on"]		= "btn_print_on_en.gif";
array_ch_name["pic_print_on"]		= "btn_print_on_ch.gif";

array_en_name["pic_close"]			= "btn_close_en.gif";
array_ch_name["pic_close"]			= "btn_close_ch.gif";

array_en_name["pic_close_on"]		= "btn_close_on_en.gif";
array_ch_name["pic_close_on"]		= "btn_close_on_ch.gif";

array_en_name["alt_account_no"]					= "Account No.: ";
array_ch_name["alt_account_no"]					= "投注戶口: ";

array_en_name["alt_balance"]					= "Balance: ";
array_ch_name["alt_balance"]					= "結餘: ";

array_en_name["alt_time_now"]					= "Time: ";
array_ch_name["alt_time_now"]					= "時間: ";

array_en_name["alt_transfer"]					= "No";
array_ch_name["alt_transfer"]					= "交易";

array_en_name["alt_log_status"]					= "Status";
array_ch_name["alt_log_status"]					= "狀況";

array_en_name["alt_recall_ref_no"]				= "Ref No";
array_ch_name["alt_recall_ref_no"]				= "交易編號";

array_en_name["alt_recall_bet_type"]			= "Bet Type";
array_ch_name["alt_recall_bet_type"]			= "投注類別";

array_en_name["alt_recall_transaction_details"]	= "Transaction Details";
array_ch_name["alt_recall_transaction_details"]	= "細節";

array_en_name["alt_recall_amount"]				= "Amount";
array_ch_name["alt_recall_amount"]				= "金額";

// ***************************** unknown betting page **************************************
array_en_name["fld_trans_time"] = "Trans. Time : ";
array_ch_name["fld_trans_time"] = "時間 : ";

array_en_name["text_unknown_message"] = "Please use <b>Transaction Records</b> function to confirm whether the transactions with status <b>Unknown</b> have been accepted.";
array_ch_name["text_unknown_message"] = "請按「<b>複查已納入彩池及轉賑交易</b>」以確認狀況「<B>不明</b>」之注項是否被接納。";

array_en_name["fld_number"] = "No.";
array_ch_name["fld_number"] = "交易";

array_en_name["fld_status"] = "Status";
array_ch_name["fld_status"] = "狀況";

array_en_name["fld_trans_no"] = "Ref. No.";
array_ch_name["fld_trans_no"] = "交易編號";

array_en_name["fld_bet_type"] = "Bet Type";
array_ch_name["fld_bet_type"] = "投注類別";

array_en_name["fld_betting_line"] = "Transaction Detail";
array_ch_name["fld_betting_line"] = "細節";

array_en_name["fld_amount"] = "Amount";
array_ch_name["fld_amount"] = "金額";

array_en_name["text_unknown"] = "Unknown";
array_ch_name["text_unknown"] = "不明";

array_en_name["fld_total"] = "Total";
array_ch_name["fld_total"] = "總額";

array_en_name["print"] = "Print";
array_ch_name["print"] = "列印";

function disclaimerDetailHeight(){
  if ((!isMobileIE()) && (isResolution800x600() || isResolution1024x600()))
    return isIE? '185px' : '170px';
  else
    return isIE? '330px' : '315px';
}

// ***************************** logout message **************************************
var buf = new StringBuffer();
buf.append('<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #A2A5AA; border-left:1px solid #A2A5AA; border-bottom:1px solid #A2A5AA; background-color:#FFFFFF;">');
buf.append('<tr>');
buf.append('<td height="26" class="titleBlue" style="padding:7px 7px 7px 7px;">');
buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
buf.append('<tr>');
buf.append('<td class="titleBlue" style="padding:0px 0px 7px 13px; border-bottom:1px solid #A2A5AA;"><strong>Terms & Conditions</strong></td>');
buf.append('</tr>');
buf.append('</table>');
buf.append('</td>');
buf.append('</tr>');
buf.append('<tr>');
buf.append('<td valign="top" class="content">');
buf.append('<div id="divDisclaimerDetail" class="scroll1" style="padding:11px 22px 10px 22px;position:relative;width:');
buf.append(isIE? '495px' : '450px');
buf.append(';height:');
buf.append(disclaimerDetailHeight());
buf.append(';overflow-y:scroll; overflow-x:hidden;">');
buf.append('<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Rules of Usage</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">The use of the Online Betting Service (eWin) ("Service") is governed by the Betting Facilities Rules of The Hong Kong Jockey Club ("the Club"), the Horse Race Betting Rules of HKJC Horse Race Betting Limited ("HKJCHRBL"), the Football Betting Rules of HKJC Football Betting Limited ("HKJCFBL") and/or the Lotteries Rules of HKJC Lotteries Limited ("HKJCLL") (collectively "Rules"), as the case may be. Copies of the Rules are available on the Club\'s website (<a href="http://www.hkjc.com/english/" target="_blank">www.hkjc.com</a>) and at the Club\'s Head Office at 1 Sports Road, Happy Valley, Hong Kong Special Administrative Region ("Hong Kong"). They are also available for inspection on request at any of the Club\'s betting locations.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">The Service is only available to a Hong Kong resident who (i) has successfully registered as a user with the Club (“User”); (ii) holds a betting account with the Club (“Betting Account”); and (iii) has duly linked his User login with his/her Betting Account ("Account Holder"). Both the Betting Account and the User login are for the personal use of the relevant Account Holder only. The Account Holder shall be liable for all consequences if he/she allows any person other than himself/herself to use his/her Betting Account and/or the User login information.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Any person who places a bet or conducts a transaction on or through this Service is deemed to have read and accepted the Rules.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.4</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Each Account Holder undertakes and ensures that he/she will not transmit, distribute or otherwise communicate using this Service anything containing any virus or element which may affect the functionality of the Club\'s website or this Service; or cause damage to, interference with, or erode any data or system belonging to the Club, its subsidiaries or any third party.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.5</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">No person below the age of 18 is allowed to place any bet or conduct a transaction on or through this Service.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.6</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">The Club and/or its subsidiaries may at any time refuse to accept any bet placed using the Service without giving any reason to the Account Holder.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.7</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">In downloading any software application for use of the Service, each Account Holder undertakes not to, or allow any third party to: <br/>(i)	make modifications, additions or deletions to or make derivative works of, or<br/>(ii)	reproduce, distribute, make available, resell, sublicense or otherwise tamper with, any part of the whole of the software application.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Local Use</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">The Service is intended and provided for use only in Hong Kong. Access to the Service is granted on the condition that the Account Holder will only access and use the Service in Hong Kong. The Club and its subsidiaries are not responsible for any consequences arising from any use outside Hong Kong. The Account Holder using the Service shall be solely responsible for all and any consequences arising from the use of the Service within or outside Hong Kong by himself/herself, or a third party acting with or without his/her knowledge, consent or authority.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">All bets placed and all transactions conducted on or through this Service are deemed to be made in Hong Kong and subject to the laws of Hong Kong.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Bets made, placed or otherwise originated from the United States or its dependent territories through the internet, telephone or other electronic or wire communication systems are not welcome by the Club.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Security</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">An Account Holder using the Service should keep strictly confidential all information and details in relation to his/her Betting Account, including but not limited to the account number, security code and personal details and security details of User login (such as the login name, password, login questions and login answers) (collectively, the “Confidential Information”). All transactions conducted with the correct Confidential Information will be binding on the Account Holder whether or not such transactions were authorised by the Account Holder.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Without prejudice to the generality of Rule 3.1, each Account Holder shall ensure that the login answers are private, unique and not generally known to any third party. Each Account Holder understands and accepts that the security level will be compromised if the login answers chosen by the Account Holder are known to third parties. The Club and/or its subsidiaries shall not be liable for any loss or damage however arising from any access to any Account Holder\'s Betting Account as a result of any third party being able to provide the login answers correctly. The Club further advises against the use of login questions and/or login answers for any other profiles, logins or accounts where similar questions and answers are called for.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">In the event the Account Holder decides to terminate use of the User login (which is required for access to the Service), the Account Holder must forthwith notify the Club in writing. The Account Holder acknowledges and agrees that until the Club acknowledges receipt and acceptance of the said termination, all instructions given with the relevant User login and transactions conducted thereby shall be deemed binding on the Account Holder.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.4</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Upon notice or suspicion of (i) any Confidential Information being disclosed to any unauthorised person or any unauthorised person being in possession of such information for whatever reason; or (ii) any unauthorised transaction being effected, the Account Holder must immediately notify the Club through the hotline with confirmation in writing to the Club\'s Customer Care Department. Notwithstanding the foregoing and until after the Club has terminated or accepted termination of use of the User login, all transactions completed through the Betting Account and/or User login and/or the Service by any person, whether or not authorised by the Account Holder, shall be binding on the Account Holder.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.5</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Account Holder should beware that there may be bogus sites which attempt to pass off as the Club\'s. Before submitting any personal particulars via the Service, including but not limited to the Confidential Information, the Account Holder must ensure that the relevant service is in fact provided by the Club and/or its subsidiaries. In case of any doubt, the Account Holder should immediately contact the Club and/or its subsidiaries to verify the authenticity of the service. The Club and its subsidiaries shall not be responsible for any consequences following the Account Holder accessing or providing any information to any fake or bogus service provider passing off as and/or claiming to be the Club and/or any of its subsidiaries and/or associated companies.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">4.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Liability</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">4.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Each Account Holder acknowledges and agrees that the Club and its subsidiaries shall not be responsible for:<br/><br/>(i) any loss or damage howsoever arising from or caused by the Service, or any other information on or facilities of this Service, including without limitation, any failure, delays or interruptions in transmission, operation or communication; hacking, distortion or erosion of data or instructions; and any errors or omissions in or from the Service contents;<br/><br/>(ii) any refusal or failure to acknowledge, accept or complete any transaction of the Account Holder using the Service;<br/><br/>(iii) the accuracy, completeness or timeliness of any information or description in relation to products or services provided by a third party; and<br/><br/>(iv) any other loss or damages that may be suffered by an Account Holder for any reason whatsoever in using the Services.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">4.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Each Account Holder using the Service shall indemnify and hold the Club, HKJCHRBL, HKJCFBL and HKJCLL harmless against all claims and damages (including all legal costs) which arise from the breach of any of the Terms and Conditions herein.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">5.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Use of Personal Data for Direct Marketing</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">5.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Where consent is received from an Account Holder or otherwise exempted by the Personal Data (Privacy) Ordinance, the Club and its subsidiaries (together referred to as “the Club” and each a “Club Entity” in the Club\'s Privacy Policy Statement (available on <a href="http://www.hkjc.com/english/corporate/corp_privacy.asp" target="_blank">http://www.hkjc.com/english/corporate/corp_privacy.asp</a> ) may in accordance with the Club\'s Privacy Policy Statement use the name, contact information and demographic information of that Account Holder for sending him/her direct marketing communications regarding facilities, support, events and activities offered or arranged by the Club or a Club Entity or the Club\'s business partners in areas specified in the Direct Marketing Section of the Club\'s Privacy Policy Statement.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">5.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">An Account Holder may change his/her preference via the Club\'s website <a href="https://ssl.hkjc.com/2013-opt-out/2013-opt-out.aspx" target="_blank">https://ssl.hkjc.com/2013-opt-out/2013-opt-out.aspx</a> or by calling the Customer Care Hotline at 1818.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">6.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Termination</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">6.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">The Club may, at anytime and without giving any reason, suspend or close any User login and/or Betting Account or terminate the provision of the Service to any Account Holder.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">6.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Without prejudice to the generality of the foregoing, the Club may conduct periodical reviews and suspend or close any Betting Account where any irregular, money-laundering or illegal activity is suspected.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Amendment</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">The Club shall have the right to add to, delete, amend or vary any of these Terms and Conditions in its absolute discretion.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Notice of any such additions, deletions, amendments or variations and the day upon which such shall become effective shall be deemed to have been duly given to each Account Holder if a notice thereof is posted on the Club\'s website.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Use of the Service on or after the date upon which any such addition, deletion, amendment or variation is expressed to take effect will be deemed to constitute acceptance thereof by the Account Holder without reservation.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">8.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Breach of these Terms and Conditions</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">8.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Upon termination by the Club of an Account Holder\'s right to use the Service as a result of any breach of any of these Terms and Conditions, the Club may, but shall not be obliged to, close his/her Betting Account and/ or terminate his/her User login.</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">9.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">Chinese and English Versions</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">9.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">In the event of any inconsistency between the English and Chinese language versions of these Terms and Conditions, the English language version shall prevail.</td>');
buf.append('</tr>');
buf.append('</tr>');

buf.append('</table>');
buf.append('</div>');
buf.append('</td>');
buf.append('</tr>');
buf.append('<tr>');
buf.append('<td height="31" align="right" style="padding:10px 7px 10px 0px; border-top:1px solid #A2A5AA;"><a href="#" onclick="ShowDisclaimer(false);" onMouseOut=" loadMouseEventImage(\'btn_enter\', \'btn_enter\'); " onMouseOver=" loadMouseEventImage(\'btn_enter\', \'btn_enter_on\'); "><img src="images/btn_enter_en.gif'+ window["cacheVersion"] + '" title="Proceed" name="btn_enter" id="btn_enter" width="71" height="21" border="0"></a></td>');
buf.append('</tr>');
buf.append('</table>');
array_en_name['disclaimer'] = buf.toString();

buf = new StringBuffer();
buf.append('<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #A2A5AA; border-left:1px solid #A2A5AA; border-bottom:1px solid #A2A5AA; background-color:#FFFFFF;">');
buf.append('<tr>');
buf.append('<td height="26" class="titleBlue" style="padding:7px 7px 7px 7px;">');
buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
buf.append('<tr>');
buf.append('<td class="titleBlue" style="padding:0px 0px 7px 13px; border-bottom:1px solid #A2A5AA;"><strong>條款及細則</strong></td>');
buf.append('</tr>');
buf.append('</table>');
buf.append('</td>');
buf.append('</tr>');
buf.append('<tr>');
buf.append('<td valign="top" class="content">');
buf.append('<div id="divDisclaimerDetail" class="scroll1" style="padding:11px 22px 10px 22px;position:relative;width:');
buf.append(isIE? '495px' : '450px');
buf.append(';height:');
buf.append(disclaimerDetailHeight());
buf.append(';overflow-y:scroll; overflow-x:hidden;">');
buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">使用規例</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">使用網上投注服務「投注區」（簡稱「服務」），須受香港賽馬會（簡稱「馬會」）的《博彩設施規例》、香港馬會賽馬博彩有限公司的《賽馬博彩規例》、香港馬會足球博彩有限公司的《足球博彩規例》及/或香港馬會獎券有限公司的《獎券規例》（統稱「規例」）所約制。此等規例可從馬會網站(<a href="http://www.hkjc.com/chinese/" target="_blank">www.hkjc.com</a>)下載，印本亦可在香港特別行政區（簡稱「香港」）跑馬地體育道一號馬會總部及任何投注地點索閱。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">此服務僅供 (i) 成功登記成為本會之用戶（簡稱「用戶」）﹔(ii)持有馬會投注戶口（簡稱「投注戶口」）﹔及(iii)正式把戶口登入連接投注戶口之香港居民使用（簡稱「戶口持有人」）。該投注戶口及戶口登入只供戶口持有人作個人使用。假如戶口持有人容許他人使用其戶口登入資料及/或投注戶口，戶口持有人便須承擔一切後果。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">任何人士如透過此服務進行投注或交易，即視作已閱悉此等規例，且同意受其約束。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.4</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">凡使用此服務的戶口持有人均須承諾，確保傳送、分發或其他經由此服務傳達的任何訊息，不含任何病毒或可能影響馬會網站或此服務運作的元素，又或對馬會、其附屬公司或第三者的資料或系統造成損害、干擾或刪減。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.5</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">凡未滿十八歲的人士，均不得透過此服務進行投注或交易。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.6</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">馬會及/或其附屬公司可隨時拒絕接受任何戶口持有人注項的權利，而毋須給予理由。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">1.7</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">在下載任何軟件以使用服務，戶口持有人須保證不會，亦不會允許第三者, 對部分或整個軟件應用進行：-<br/>(i) 修改，增刪或製作衍生軟件，或<br/>(ii) 複製，分發，提供，出售，再授權或以其它方式篡改。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">本地使用</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">此服務只限在香港使用。戶口持有人首要遵守只在香港境內使用此服務的條件，始會獲准享用此服務。在香港境外使用此服務所引致的任何後果，馬會及其附屬公司均毋須負責。不論戶口持有人或第三者是否在其知情、同意或授權下在本港或以外地方使用此服務，戶口持有人均須對使用此服務所引致的一切後果承擔全部責任。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">所有透過此服務進行的投注及交易，均視為在香港境內進行，並受香港法律約制。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">2.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">馬會概不歡迎自美國或其附屬領土地區以互聯網、電話、其他電子或電線通訊系統方式進行的投注或交易。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">保安</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">使用此服務的戶口持有人，須將有關其投注戶口資料及細節保密，包括（但不僅限於）戶口號碼、保安密碼及個人資料與其戶口登入之保密細節（如登入名稱、密碼、登入問題及登入答案）（統稱「機密資料」）。無論交易有否得到戶口持有人授權，所有使用正確機密資料而進行的交易，對戶口持有人而言，均具約束力。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">在不損害規則3.1的一般適用性，戶口持有人須確保登入答案是屬私人、獨特及不被第三者知悉的。戶口持有人明白及同意，如其所選之登入答案被第三者知悉，有關投注戶口的保安程度將會受到損害。任何因第三者正確地提供有關戶口持有人的登入答案因而能够使用戶口持有人的投注戶口所引起之損失，馬會及/或其附屬公司一概不負責。本會不建議戶口持有人於其他網頁、登入及/或戶口使用相同的登入問題及/登入答案。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">戶口持有人若決定撤銷使用此服務的戶口登入，必須事先致函通知馬會。戶口持有人確認及同意，於馬會確認收到及接納上述撤銷通知函之前，所有透過該戶口登入所作出的指示及進行的交易，均視為對該戶口持有人具約束力的。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.4</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">戶口持有人一經發現或懷疑(i) 任何機密資料遭洩露或由未獲授權人士取得，或 (ii)任何交易在未經授權的情況下進行，須即時致電熱線通知馬會，並致函馬會顧客服務部確證此項通知。儘管如此，在馬會確認收到及接納書面通知之前，所有透過有關投注戶口、戶口登入及／或項服務完成的交易，不論是否經戶口持有人授權，對戶口持有人而言，均絕對具約束力。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">3.5</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">戶口持有人須提防意圖假扮馬會網頁之偽冒網站。戶口持有人於提交任何個人資料（包括但不僅限於機密資料）之前，必須確保該有關服務確實由香港賽馬會或其附屬公司所提供。如有懷疑，戶口持有人應立即與馬會及／或其附屬公司聯絡，以核證該有關服務提供者的真偽。戶口持有人聯絡或向任何虛假或偽冒服務提供者提供任何資料所引致的一切後果，馬會及其附屬公司概不負責。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">4.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">責任</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">4.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">任何戶口持有人確認及同意馬會及其附屬公司對以下並不負責:<br/><br/>(i)本服務、或任何其他資料、服務或設施，如不論何故引致損失或損害，包括（但不僅限於）在傳送、進行操作或通訊時出現失靈、延誤或干擾等情況；資料或指示遭盜取、歪曲或刪減；以及服務內容有任何錯誤或遺漏。<br/><br/>(ii) 任何拒絕或未能確認、接納或完成戶口持有人使用此服務所進行的交易。<br/><br/>(iii) 第三方提供之產品或服務相關的描述或資料，是否準確、完整或合時。<br/><br/>(iv) 當戶口持有人使用服務時，不管任何理由而造成之損失或損害。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">4.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">使用此服務的戶口持有人對任何因其違反此等使用條款及細則所引起對馬會、香港馬會賽馬博彩有限公司、香港馬會足球博彩有限公司及/或香港馬會獎券有限公司的一切索償及損失（包括所有法律費用）均須負責所有賠償責任。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">5.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">使用個人資料作直接促銷</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">5.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">當馬會獲得戶口持有人的同意後或根據《個人資料（私隱）條例》有所豁免的情況下，馬會及其附屬公司（在《私隱政策聲明》中合稱「馬會」，而各自稱「馬會機構」）可根據《私隱政策聲明》（刊登於<a href="http://www.hkjc.com/chinese/corporate/corp_privacy.asp" target="_blank">http://www.hkjc.com/chinese/corporate/corp_privacy.asp</a> ）使用戶口持有人的姓名、聯絡資料和人口統計資料以作促銷由馬會或馬會機構或馬會業務伙伴不時提供或安排在馬會私隱政策聲明內「直接促銷」部分指定種類的設施、服務、支援及相關項目及活動之用。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">5.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">戶口持有人可經由馬會網頁 <a href="https://ssl.hkjc.com/2013-opt-out/2013-opt-out.aspx" target="_blank">https://ssl.hkjc.com/2013-opt-out/2013-opt-out.aspx</a> 或致電顧客服務熱線1818更改有關設定。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">6.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">終止</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">6.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">馬會可隨時通知戶口持有人暫停或終止其戶口登入或/及投注戶口或撤銷向戶口持有人提供此服務，而毋須給予任何理由。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">6.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">在無損前文的一般性下，馬會可不時檢討投注戶口，並可在懷疑有任何不正常、洗黑錢或非法行為時中止或終止有關戶口。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">修訂</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">馬會得全權決定增補、刪除、修訂或更改此等使用條款及細則。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.2</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">馬會網站登出有關此等增刪修改的內容及生效日期的通告，即視為已給予每一戶口持有人充分通知。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">7.3</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">戶口持有人於馬會所公佈此等增刪修改生效日期當日或之後使用此服務，即視為完全接納該等增刪修改。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">8.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">違反此等使用條件</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">8.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">假如馬會因戶口持有人違反此等使用條款及細則而終止其使用此服務的權利，馬會亦可（但不是必須）取消其投注戶口或/及戶口登入。</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">9.</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">中英文版本</td>');
buf.append('</tr>');

buf.append('<tr>');
buf.append('<td valign="top" style="padding:0px 8px 0px 0px;">9.1</td>');
buf.append('<td class="content" style="padding:0px 0px 20px 0px;">如條款及細則的中文譯本於英文原本有任何出入之處，一切條款及細則概以英文原本為準。</td>');
buf.append('</tr>');

buf.append('</table>');

buf.append('</div>');
buf.append('</td>');
buf.append('</tr>');
buf.append('<tr>');
buf.append('<td height="31" align="right" style="padding:10px 7px 10px 0px; border-top:1px solid #A2A5AA;"><a href="#" onclick="ShowDisclaimer(false);" onMouseOut=" loadMouseEventImage(\'btn_enter\', \'btn_enter\'); " onMouseOver=" loadMouseEventImage(\'btn_enter\', \'btn_enter_on\'); "><img src="images/btn_enter_ch.gif' + window["cacheVersion"] + '" title="進入主頁" name="btn_enter" id="btn_enter" width="71" height="21" border="0"></a></td>');
buf.append('</tr>');
buf.append('</table>');
array_ch_name['disclaimer'] = buf.toString();

//*******************************************************************************************************
//*******************************************************************************************************
//*******************************************************************************************************
//*******************************************************************************************************
//*******************************************************************************************************
//*******************************************************************************************************
//**************************************** Error Message Array ******************************************

// ***************************** Error Message **************************************
var traceFunc = "";
array_en_error["system_busy"]					= "SYSTEM BUSY, PLEASE TRY LATER" + ((traceFunc!="") ? (" (" + traceFunc + ")") : "");
array_ch_error["system_busy"]					= "系統繁忙，請稍後再試" + ((traceFunc!="") ? (" (" + traceFunc + ")") : "");

// array_en_error["system_datetime"]			= "Please check your PC's date/time setting and try again." + ((traceFunc!="") ? (" (" + traceFunc + ")") : "");
// array_ch_error["system_datetime"]			= "請檢查電腦日期/時間設定然後再試。" + ((traceFunc!="") ? (" (" + traceFunc + ")") : "");

array_en_error["system_datetime"]			    = "Unsuccessful Login. Please <a href='#' onclick='OnClickLoginTimeout()'>click here</a> to check your browser settings and try again. (415)";
array_ch_error["system_datetime"]			    = "未能成功登入。請<a href='#' onclick='OnClickLoginTimeout()'>按此</a>檢查您的瀏覽器設定後再次嘗試。(415)";

array_en_error["defalut_msg"]					= "SERVICE INACCESSIBLE.  PLEASE CALL 1818" ;
array_ch_error["defalut_msg"]					= "服務未能提供，請致電1818" ;

array_en_error["input_webid"]					= "Please enter Login Name";
array_ch_error["input_webid"]					= "請儲入登入名稱";

array_en_error["wrong_password"]				= "Incorrect Password. Please re-enter again. If you have forgotten your Password, please click <a href='#' onclick='OnClickCannotLogin()'>here</a> for reset.";
array_ch_error["wrong_password"]				= "密碼不正確，請重新儲入。如閣下已忘記密碼，請<a href='#' onclick='OnClickCannotLogin()'>按此</a>重設。";

array_en_error["wrong_password2"]				= "Please enter password";
array_ch_error["wrong_password2"]				= "請儲入密碼";

array_en_error["acc_locked"]					= 'Login access is locked.  Please unlock through the "Change Password / Change Login Answers" function.';
array_ch_error["acc_locked"]					= '登入權限已鎖。請透過「更改密碼/更改登入問題」功能進行重設。';

array_en_error["acc_no_empty"]					= 'Please enter a valid 8-digit Account Number. If your Account Number is 7 digits, please add a "0" at the beginning.';
array_ch_error["acc_no_empty"]					= '請儲入有效的八位數字投注戶口號碼。如你的投注戶口號碼只有七位數字請在前面加"0"。' ;

array_en_error["duplicate_bet_fixed_oddsFB"]	= "Duplicate bet selection not accepted (applicable to fixed odds football betting only)";
array_ch_error["duplicate_bet_fixed_oddsFB"]	= "注項選擇不能重複(只適用於足球固定賠率投注)";

array_en_error["duplicate_bet_fixed_oddsHB"]	= "Duplicate bet selection not accepted (applicable to fixed odds racing betting only)";
array_ch_error["duplicate_bet_fixed_oddsHB"]	= "注項選擇不能重複(只適用於賽馬固定賠率投注)";

array_en_error["duplicate_bet_allup"]			= "Duplicate bet selection not accepted (applicable to all up betting only)";
array_ch_error["duplicate_bet_allup"]			= "注項選擇不能重複(只適用於過關投注)";

array_en_error["duplicate_bet_line"]			= "Duplicate bet selection not accepted.";
array_ch_error["duplicate_bet_line"]			= "注項選擇不能重複。";

array_en_error["system_return21"]				= "Please use the \"Transaction Records\" function to confirm whether the bets you sent have been accepted." ;
array_ch_error["system_return21"]				= "你所傳送的注項狀況未能確認。請使用「複查已納入彩池及轉賬交易」功能鍵去確認你所傳送的注項是否被接受。" ;

array_en_error["change_security_check_code"]	= "Please Change Security Code";
array_ch_error["change_security_check_code"]	= "Please Change Security Code";

array_en_error["change_security_code"]			= "Login cannot continue because you have not changed the default security code of your Betting Account.  Please first change your security code using a Multi-Ticket Betting Terminal at a nearby OCBB, then login again.";
array_ch_error["change_security_code"]			= "因閣下之投注戶口預設密碼尚未更改，所以未能登入。請先於任何場外投注處，使用智財全能投注機更改投注戶口密碼，然後再嘗試登入。";

array_en_error["refresh_warning"]				= "All betlines will be deleted.  Press OK to continue refreshing the web page or Cancel to stay on the current page.";
array_ch_error["refresh_warning"]				= "所有注項將被刪除，確定更新網頁﹖";

array_en_error["Invalid Session"]				= "Invalid Session";
array_ch_error["Invalid Session"]				= "此環節已被終止，請重新登入";

array_en_error["EDIT_SEL_NO_LONGER_AVAILABLE"]  = "The added selection(s) is no longer available, please re-enter.";
array_ch_error["EDIT_SEL_NO_LONGER_AVAILABLE"]	= "已加入的選項已不適用，請重新儲入。";

// Support SSO
array_en_error["SSO_SIGN_OUT_ACTIVE"]           = "All unsent bet will be deleted after logoff. If you are using HKJC Web Services in other browser windows, they will also be logged out. Please close those browser windows if needed.";
array_ch_error["SSO_SIGN_OUT_ACTIVE"]           = "登出後，如有未傳送的注項將被删除。如你正在其他視窗開啟馬會網上服務，該等服務亦會同時被登出，如有需要請關閉該等視窗。";
array_en_error["SSO_SIGN_OUT_PASSIVE"]          = "You have logged out from all HKJC Web Services, all unsent bet has also been deleted. Please login again if needed.";
array_ch_error["SSO_SIGN_OUT_PASSIVE"]          = "你已登出所有馬會網上服務，未傳送的注項亦已同時被删除，如有需要請重新登入。";
array_en_error["SSO_SIGN_IN_USER_CHANGED"]          = "This user session has been logged out. All unsent bet has been deleted. Please use the \"Betting A/C Record\" function to check the bet record.";
array_ch_error["SSO_SIGN_IN_USER_CHANGED"]          = "此用戶環節已被登出，未傳送的注項亦已被删除。請使用\"戶口記錄\"功能查閱注項記錄。";

// ***************************** ERROR MESSAGE FROM TELEBET **************************************
array_en_error["INVALID DRAW OR MEETING"]		= "INVALID DRAW OR MEETING.";
array_ch_error["INVALID DRAW OR MEETING"]		= "賽事或期數選擇錯誤。";

array_en_error["POOL NOT AVAILABLE"]			= "POOL NOT AVAILABLE.";
array_ch_error["POOL NOT AVAILABLE"]			= "彩池選擇錯誤。";

array_en_error["POOL CLOSED"]					= "POOL CLOSED.";
array_ch_error["POOL CLOSED"]					= "彩池截止投注。";

array_en_error["INSUFFICIENT SELECTIONS"]		= "INSUFFICIENT SELECTIONS.";
array_ch_error["INSUFFICIENT SELECTIONS"]		= "馬匹或號碼不足。";

array_en_error["SELECTION OUT OF RANGE"]		= "SELECTION OUT OF RANGE.";
array_ch_error["SELECTION OUT OF RANGE"]		= "所選號碼太大。";

array_en_error["DUPLICATE SELECTION"]			= "DUPLICATE SELECTION.";
array_ch_error["DUPLICATE SELECTION"]			= "不能有重複選擇。";

array_en_error["RACE NO. SEQUENCE ERROR"]		= "RACE NO. SEQUENCE ERROR.";
array_ch_error["RACE NO. SEQUENCE ERROR"]		= "場次次序錯誤。";

array_en_error["INVALID ACCOUNT NUMBER"]		= "INVALID ACCOUNT NUMBER.";
array_ch_error["INVALID ACCOUNT NUMBER"]		= "戶口號碼錯誤。";

array_en_error["OUT OF FIELD"]					= "OUT OF FIELD.";
array_ch_error["OUT OF FIELD"]					= "馬匹或號碼太大。";

array_en_error["AUP FORMULA ERROR"]				= "ALL UP FORMULA ERROR.";
array_ch_error["AUP FORMULA ERROR"]				= "此過關方式不適用。";

array_en_error["INVALID AMOUNT"]				= "INVALID AMOUNT.";
array_ch_error["INVALID AMOUNT"]				= "金額錯誤。";

array_en_error["INSUFFICIENT LEGS"]				= "INSUFFICIENT LEAGUES.";
array_ch_error["INSUFFICIENT LEGS"]				= "關數不足。";

array_en_error["INVALID BANKER"]				= "INVALID BANKER.";
array_ch_error["INVALID BANKER"]				= "膽拖使用錯誤。";

array_en_error["INVALID FIELD"]					= "INVALID FIELD.";
array_ch_error["INVALID FIELD"]					= "選擇方式錯誤。";

array_en_error["POOL CODE ERROR"]				= "POOL CODE ERROR.";
array_ch_error["POOL CODE ERROR"]				= "彩池代號錯誤。";

array_en_error["VALUE TOO BIG"]					= "VALUE TOO BIG.";
array_ch_error["VALUE TOO BIG"]					= "總金額太大。";

array_en_error["ACCOUNT NOT FOR BETTING"]		= "ACCOUNT NOT FOR BETTINGW.";
array_ch_error["ACCOUNT NOT FOR BETTING"]		= "戶口不能提供賽事/足球投注。";

array_en_error["INCORRECT SECURITY CODE"]		= "INCORRECT SECURITY CODE.";
array_ch_error["INCORRECT SECURITY CODE"]		= "電話投注戶口密碼不正確。";

array_en_error["NO SUCH A/C"]					= "NO SUCH A/C.";
array_ch_error["NO SUCH A/C"]					= "戶口號碼錯誤。";

array_en_error["A/C ACTIVE"]					= "A/C ACTIVE.";
array_ch_error["A/C ACTIVE"]					= "戶口操作進行中。";

array_en_error["ACCESS NOT PERMITTED"]			= "ACCESS NOT PERMITTED.";
array_ch_error["ACCESS NOT PERMITTED"]			= "戶口不能使用。";

array_en_error["BALANCE OVERFLOW"]				= "BALANCE OVERFLOW.";
array_ch_error["BALANCE OVERFLOW"]				= "戶口結存超出限額。";

array_en_error["BANK CARD NOT REGISTERED"]		= "BANK CARD NOT REGISTERED.";
array_ch_error["BANK CARD NOT REGISTERED"]		= "銀行咭未登記。";

array_en_error["AMOUNT EXCEED LIMIT"]			= "AMOUNT EXCEED LIMIT.";
array_ch_error["AMOUNT EXCEED LIMIT"]			= "金額超出限額。";

array_en_error["INVALID FORMAT"]				= "INVALID FORMAT.";
array_ch_error["INVALID FORMAT"]				= "資料不正確。";

array_en_error["INSUFFICIENT BALANCE"]			= "INSUFFICIENT BALANCE.";
array_ch_error["INSUFFICIENT BALANCE"]			= "戶口結存不足。";

array_en_error["TOO MANY WITHDRAWALS"]			= "TOO MANY WITHDRAWALS.";
array_ch_error["TOO MANY WITHDRAWALS"]			= "提款次數過多。";

array_en_error["AMOUNT TOO LOW"]				= "AMOUNT TOO LOW.";
array_ch_error["AMOUNT TOO LOW"]				= "少過最低限額。";

array_en_error["INCORRECT BANK PIN"]			= "INCORRECT BANK PIN.";
array_ch_error["INCORRECT BANK PIN"]			= "銀行戶口密碼不正確。";

array_en_error["STATUS UNKNOWN"]				= "STATUS UNKNOWN.";
array_ch_error["STATUS UNKNOWN"]				= "注項情況未明。";

array_en_error["RACE NO. ERROR"]				= "RACE NO. ERROR.";
array_ch_error["RACE NO. ERROR"]				= "場次錯誤。";

array_en_error["TOO MANY SELECTIONS"]			= "TOO MANY SELECTIONS.";
array_ch_error["TOO MANY SELECTIONS"]			= "不能有過多選擇。";

array_en_error["ILLEGAL SELECTIONS"]			= "ILLEGAL SELECTIONS.";
array_ch_error["ILLEGAL SELECTIONS"]			= "選擇不正確。";

array_en_error["RACE SEQUENCE ERROR"]			= "RACE SEQUENCE ERROR.";
array_ch_error["RACE SEQUENCE ERROR"]			= "場次次序錯誤。";

array_en_error["INSUFFICIENT BALANCE INIT"]		= "INSUFFICIENT BALANCE INIT.";
array_ch_error["INSUFFICIENT BALANCE INIT"]		= "戶口結存不足。";

array_en_error["SALES NOT AVAILABLE"]			= "SALES NOT AVAILABLE.";
array_ch_error["SALES NOT AVAILABLE"]			= "尚未接受投注。";

array_en_error["MEETING NOT DEFINED"]			= "MEETING NOT DEFINED.";
array_ch_error["MEETING NOT DEFINED"]			= "賽事尚未設定。";

array_en_error["DEPOSIT NOT READY, TRY LATER"]	= "DEPOSIT NOT READY, TRY LATER.";
array_ch_error["DEPOSIT NOT READY, TRY LATER"]	= "存款後不能即時提款， 請稍後再試。";

// ***************************** ERROR MESSAGE FROM EWIN **************************************
array_en_error["SYSTEM NOT READY"]				= "SYSTEM NOT READY. PLEASE TRY AGAIN LATER";
array_ch_error["SYSTEM NOT READY"]				= "系統將於稍後恢復，請稍後再試。";

array_en_error["A/C INACCESSIBLE"]				= "A/C Inaccessible. Please try again later.";
array_ch_error["A/C INACCESSIBLE"]				= "戶口服務未能提供，請稍候再試。";

array_en_error["FUNCTION NOT AVAILABLE"]		= "FUNCTION NOT AVAILABLE.";
array_ch_error["FUNCTION NOT AVAILABLE"]		= "功能未能使用。";

array_en_error["INVALID MEETING"]				= "INVALID MEETING.";
array_ch_error["INVALID MEETING"]				= "賽事選擇錯誤。";

array_en_error["DATA NOT AVAILABLE"]			= "DATA NOT AVAILABLE.";
array_ch_error["DATA NOT AVAILABLE"]			= "資料未能顯示。";

array_en_error["TELEBET CLOSED"]				= "TELEBET CLOSED.";
array_ch_error["TELEBET CLOSED"]				= "電話投注停止服務。";

array_en_error["SERVICE NOT AVAILABLE"]			= "SERVICE NOT AVAILABLE.  PLEASE TRY AGAIN LATER";
array_ch_error["SERVICE NOT AVAILABLE"]			= "暫停服務，請稍後再試。";

array_en_error["PLEASE DO ESTABLISH ENQUIRY"]	= "PLEASE DO ESTABLISH ENQUIRY.";
array_ch_error["PLEASE DO ESTABLISH ENQUIRY"]	= "請查最新資訊表。";

array_en_error["INVALID ENQUIRY FORMAT"]		= "INVALID ENQUIRY FORMAT.";
array_ch_error["INVALID ENQUIRY FORMAT"]		= "查詢方式不正確。";

array_en_error["BANK ACCOUNT ACTIVE"]			= "BANK ACCOUNT ACTIVE.";
array_ch_error["BANK ACCOUNT ACTIVE"]			= "銀行戶口操作進行中，請稍後再試。";

array_en_error["NO SUCH ACCOUNT"]				= "NO SUCH ACCOUNT.  PLEASE ENTER A VALID BETTING ACCOUNT NUMBER";
array_ch_error["NO SUCH ACCOUNT"]				= "戶口號碼錯誤，請儲入正確投注戶口號碼";

array_en_error["ACCOUNT CLOSED"]				= "ACCOUNT CLOSED.";
array_ch_error["ACCOUNT CLOSED"]				= "投注戶口已取消。";

array_en_error["SYSTEM BUSY, RETRY LATER"]		= "SYSTEM BUSY, RETRY LATER.";
array_ch_error["SYSTEM BUSY, RETRY LATER"]		= "系統繁忙， 請稍後再試。";

array_en_error["YOUR DIGITAL CERTIFICATE HAS BEEN RE-REGISTERED"]	= "YOUR DIGITAL CERTIFICATE HAS BEEN RE-REGISTERED.";
array_ch_error["YOUR DIGITAL CERTIFICATE HAS BEEN RE-REGISTERED"]	= "閣下的數碼証書經已重新註冊。";

array_en_error["SYSTEM BUSY, PLS TRY LATER"]	= "SYSTEM BUSY, PLEASE TRY LATER.";
array_ch_error["SYSTEM BUSY, PLS TRY LATER"]	= "系統繁忙， 請稍後再試。";

array_en_error["SYSTEM LOGIN TIMEOUT"]          = "Unsuccessful Login. Please <a href='#' onclick='OnClickLoginTimeout()'>click here</a> to check your browser settings and try again. (416)";
array_ch_error["SYSTEM LOGIN TIMEOUT"]          = "未能成功登入。請<a href='#' onclick='OnClickLoginTimeout()'>按此</a>檢查您的瀏覽器設定後再次嘗試。(416)";

array_en_error["IW CANNOT ACCESS"]              = "“Enter Password for Each Txn” function is temporarily unavailable. If you would like to continue to use “eWin”, please uncheck the function and login again.";
array_ch_error["IW CANNOT ACCESS"]              = "「每次交易再儲入密碼」功能暫時未能使用。如欲繼續使用「投注區」，請剔除該功能並再次登入。";

// ***************************** 0 **************************************


// ***************************** 100 **************************************

array_en_error["101"]			= "INCORRECT BETTING ACCOUNT NO.  IF YOU HAVE NOT YET REGISTERED, PLEASE SELECT \"REGISTER NOW\" (101)" ;
array_ch_error["101"]			= "投注戶口號碼不正確。如閣下未登記網上投注服務，請再按「新用戶登記」(101)" ;

array_en_error["102"]			= "REGISTRATION IS UNSUCCESSFUL. PLEASE CALL 1818 (102)" ;
array_ch_error["102"]			= "註冊錯誤,請致電1818 (102)" ;

array_en_error["103"]			= "ANOTHER SESSION ALREADY LOGGED ON, PLEASE LOGOUT THIS SESSION (103)" ;
array_ch_error["103"]			= "重複登入，請登出此環節 (103)" ;

array_en_error["104"]			= "DIGITAL CERTIFICATE HAS ALREADY EXPIRED, PLEASE RENEW THE DIGITAL CERTIFICATE AND DO A DIGITAL CERTIFICATE REGISTRATION (104)" ;
array_ch_error["104"]			= "數碼證書經已過期,請重新註冊 (104)" ;

array_en_error["105"]			= "PLEASE CALL 1818 (105)" ;
array_ch_error["105"]			= "請致電1818 (105)" ;

array_en_error["106"]			= "THIS SESSION HAS BEEN DISCONNECTED, PLEASE CLOSE THE WINDOW AND RESTART WITH A NEW SESSION (106)" ;
array_ch_error["106"]			= "此環節已被終止,請重新登入 (106)" ;

array_en_error["107"]			= "PLEASE CALL 1818 (107)" ;
array_ch_error["107"]			= "請致電1818 (107)" ;

array_en_error["108"]			= "A CERTIFICATE HAS NOT BEEN REGISTERED WITH THIS ACCOUNT.  PLEASE TRY WITH A VALID DIGITAL CERTIFICATE. (108)" ;
array_ch_error["108"]			= "此戶口未有數碼證書註冊，請以有效的數碼證書重試 (108)" ;

array_en_error["109"]			= "BETTING ACCOUNT WILL BE READY LATER.  PLEASE TRY AGAIN LATER. (109)" ;
array_ch_error["109"]			= "投注戶口將於稍後啟用，請稍後再試 (109)" ;

array_en_error["110"]			= "PLEASE CALL 1818 (110)" ;
array_ch_error["110"]			= "請致電1818 (110)" ;

array_en_error["111"]			= "ANOTHER SESSION ALREADY LOGGED ON VIA ANOTHER DEVICE, PLEASE LOGOUT THIS SESSION (111)" ;
array_ch_error["111"]			= "於其他裝置重複登入，請登出此環節(111)" ;

array_en_error["112"]			= "DATA TRANSFER ERROR, PLEASE PERFORM LOG ON AGAIN (112)" ;
array_ch_error["112"]			= "資料傳送錯誤，請重新登入 (112)" ;

array_en_error["113"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (113)" ;
array_ch_error["113"]			= "此戶口不被註冊，請致電1818 (113)" ;

array_en_error["114"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (114)" ;
array_ch_error["114"]			= "此戶口不被註冊，請致電1818 (114)" ;

array_en_error["115"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (115)" ;
array_ch_error["115"]			= "此戶口不被註冊，請致電1818 (115)" ;

array_en_error["116"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (116)" ;
array_ch_error["116"]			= "此戶口不被註冊，請致電1818 (116)" ;

array_en_error["117"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (117)" ;
array_ch_error["117"]			= "此戶口不被註冊，請致電1818 (117)" ;

array_en_error["118"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (118)" ;
array_ch_error["118"]			= "此戶口不被註冊，請致電1818 (118)" ;

array_en_error["119"]			= "REGISTRATION IS UNSUCCESSFUL.  PLEASE CALL 1818 (119)" ;
array_ch_error["119"]			= "此戶口不被註冊，請致電1818 (119)" ;

array_en_error["120"]           = "THIS SESSION HAS BEEN DISCONNECTED.  PLEASE PERFORM LOG ON AGAIN" ;
array_ch_error["120"]           = "此環節已被終止，請重新登入" ;
// ****************************** 150 *******************************************
array_en_error["155"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (155)" ;
array_ch_error["155"]			= "服務未能提供，請致電1818 (155)" ;

array_en_error["156"]			= "Transaction in progress, please wait a few moments and check \"Transaction Records\". (156)" ;
array_ch_error["156"]			= "注項處理中，請稍後「複查已納入彩池及轉賬交易」。(156)" ;

array_en_error["159"]			= "Status unknown. Please check \"Transaction Records\". (159)" ;
array_ch_error["159"]			= "狀況不明, 請「複查已納入彩池及轉賬交易」。(159)" ;

array_en_error["161"]			= "We're sorry but the system is very busy. Please use Telebet service (Racing/Mark Six:1883, Football:1889) to place your bets. (161)" ;
array_ch_error["161"]			= "對不起！系統非常繁忙，請使用電話投注服務(賽馬/六合彩:1881,足球:1885)。祝您好運！ (161)" ;

array_en_error["164"]			= "Your Betting Account cannot access this service. Please login through ewin.hkjc.com (164)";
array_ch_error["164"]			= "閣下之投注戶口並不適用於此服務，請使用ewin.hkjc.com登入網上投注服務 (164)";


// ***************************** 200 **************************************
// *********************** Security Server Error **************************

array_en_error["201"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (201)" ;
array_ch_error["201"]			= "服務未能提供，請致電1818 (201)" ;

array_en_error["202"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (202)" ;
array_ch_error["202"]			= "服務未能提供，請致電1818 (202)" ;

array_en_error["203"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (203)" ;
array_ch_error["203"]			= "服務未能提供，請致電1818 (203)" ;

array_en_error["204"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (204)" ;
array_ch_error["204"]			= "服務未能提供，請致電1818 (204)" ;

array_en_error["205"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (205)" ;
array_ch_error["205"]			= "服務未能提供，請致電1818 (205)" ;

array_en_error["206"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (206)" ;
array_ch_error["206"]			= "服務未能提供，請致電1818 (206)" ;

array_en_error["207"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (207)" ;
array_ch_error["207"]			= "服務未能提供，請致電1818 (207)" ;

array_en_error["208"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (208)" ;
array_ch_error["208"]			= "服務未能提供，請致電1818 (208)" ;

array_en_error["209"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (209)" ;
array_ch_error["209"]			= "服務未能提供，請致電1818 (209)" ;

array_en_error["210"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (210)" ;
array_ch_error["210"]			= "服務未能提供，請致電1818 (210)" ;

array_en_error["211"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (211)" ;
array_ch_error["211"]			= "服務未能提供，請致電1818 (211)" ;

array_en_error["212"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (212)" ;
array_ch_error["212"]			= "服務未能提供，請致電1818 (212)" ;

array_en_error["213"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (213)" ;
array_ch_error["213"]			= "服務未能提供，請致電1818 (213)" ;

array_en_error["214"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (214)" ;
array_ch_error["214"]			= "服務未能提供，請致電1818 (214)" ;

array_en_error["215"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (215)" ;
array_ch_error["215"]			= "服務未能提供，請致電1818 (215)" ;

array_en_error["216"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (216)" ;
array_ch_error["216"]			= "服務未能提供，請致電1818 (216)" ;

array_en_error["217"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (217)" ;
array_ch_error["217"]			= "服務未能提供，請致電1818 (217)" ;

array_en_error["218"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (218)" ;
array_ch_error["218"]			= "服務未能提供，請致電1818 (218)" ;

array_en_error["219"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (219)" ;
array_ch_error["219"]			= "服務未能提供，請致電1818 (219)" ;

array_en_error["220"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (220)" ;
array_ch_error["220"]			= "服務未能提供，請致電1818 (220)" ;

array_en_error["221"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (221)" ;
array_ch_error["221"]			= "服務未能提供，請致電1818 (221)" ;

array_en_error["222"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (222)" ;
array_ch_error["222"]			= "服務未能提供，請致電1818 (222)" ;

array_en_error["223"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (223)" ;
array_ch_error["223"]			= "服務未能提供，請致電1818 (223)" ;

array_en_error["224"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (224)" ;
array_ch_error["224"]			= "服務未能提供，請致電1818 (224)" ;

array_en_error["225"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (225)" ;
array_ch_error["225"]			= "服務未能提供，請致電1818 (225)" ;

array_en_error["226"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (226)" ;
array_ch_error["226"]			= "服務未能提供，請致電1818 (226)" ;

array_en_error["227"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (227)" ;
array_ch_error["227"]			= "服務未能提供，請致電1818 (227)" ;

array_en_error["228"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (228)" ;
array_ch_error["228"]			= "服務未能提供，請致電1818 (228)" ;

array_en_error["229"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (229)" ;
array_ch_error["229"]			= "服務未能提供，請致電1818 (229)" ;

array_en_error["230"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (230)" ;
array_ch_error["230"]			= "服務未能提供，請致電1818 (230)" ;

array_en_error["231"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (231)" ;
array_ch_error["231"]			= "服務未能提供，請致電1818 (231)" ;

array_en_error["232"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (232)" ;
array_ch_error["232"]			= "服務未能提供，請致電1818 (232)" ;

array_en_error["233"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (233)" ;
array_ch_error["233"]			= "服務未能提供，請致電1818 (233)" ;

array_en_error["234"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (234)" ;
array_ch_error["234"]			= "服務未能提供，請致電1818 (234)" ;

array_en_error["235"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (235)" ;
array_ch_error["235"]			= "服務未能提供，請致電1818 (235)" ;

array_en_error["236"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (236)" ;
array_ch_error["236"]			= "服務未能提供，請致電1818 (236)" ;

array_en_error["237"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (237)" ;
array_ch_error["237"]			= "服務未能提供，請致電1818 (237)" ;

array_en_error["238"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (238)" ;
array_ch_error["238"]			= "服務未能提供，請致電1818 (238)" ;

array_en_error["239"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (239)" ;
array_ch_error["239"]			= "服務未能提供，請致電1818 (239)" ;

array_en_error["240"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (240)" ;
array_ch_error["240"]			= "服務未能提供，請致電1818 (240)" ;

array_en_error["241"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (241)" ;
array_ch_error["241"]			= "服務未能提供，請致電1818 (241)" ;

array_en_error["242"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (242)" ;
array_ch_error["242"]			= "服務未能提供，請致電1818 (242)" ;

array_en_error["245"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (245)" ;
array_ch_error["245"]			= "服務未能提供，請致電1818 (245)" ;

array_en_error["251"]			= "INCORRECT SECURITY KEY.  PLEASE SELECT CORRECT SECURITY KEY UNDER \"OTHER SERVICES\" (251)" ;
array_ch_error["251"]			= "未能確認保安匙。請於「其他服務」選取正確的保安匙 (251)" ;

array_en_error["252"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (252)" ;
array_ch_error["252"]			= "服務未能提供，請致電1818 (252)" ;

array_en_error["253"]			= "INCORRECT SECURITY KEY.  PLEASE SELECT CORRECT SECURITY KEY UNDER \"OTHER SERVICES\" (253)" ;
array_ch_error["253"]			= "未能確認保安匙。請於「其他服務」選取正確的保安匙 (253)" ;

array_en_error["254"]			= "SERVICE INACCESSIBLE, PLEASE CALL 1818 (254)" ;
array_ch_error["254"]			= "服務未能提供，請致電1818 (254)" ;

// ********************************** 280 ************************************
array_en_error["280"]			= "INVALID HKID/PASSPORT NUMBER. PLEASE INPUT A VALID HKID/PASSPORT NUMBER (280)" ;
array_ch_error["280"]			= "身份證/護照號碼核准錯誤，請輸入正確的身份證/護照號碼 (280)" ;

array_en_error["281"]			= "UNKNOWN DIGITAL CERTIFICATE ISSUER, PLEASE RE-APPLY DIGITAL CERTIFICATE ISSUED BY HONG KONG POST OR DIGI SIGN. (281)" ;
array_ch_error["281"]			= "數碼證書須由認可的核准機構簽發，請重新申請由香港郵政或Digi-Sign簽發的數碼證書 (281)" ;

array_en_error["282"]			= "DIGITAL CERTIFICATE IS MAL-FORMED, PLEASE CHECK WITH YOUR DIGITAL CERTIFICATE ISSUER. (282)" ;
array_ch_error["282"]			= "數碼證書核准錯誤，請與閣下的數碼證書核准機構聯絡 (282)" ;

array_en_error["283"]			= "DIGITAL CERTIFICATE IS REVOKED, PLEASE CHECK WITH YOUR DIGITAL CERTIFICATE ISSUER. (283)" ;
array_ch_error["283"]			= "數碼證書經已無效，請與數碼證書核准機構更新閣下的數碼證書 (283)" ;

array_en_error["284"]			= "DIGITAL CERTIFICATE IS EXPIRED, PLEASE RENEW YOUR DIGITAL CERTIFICATE. (284)" ;
array_ch_error["284"]			= "數碼證書經已過期，請與數碼證書核准機構更新閣下的數碼證書 (284)" ;

array_en_error["285"]			= "DIGITAL CERTIFICATE IS NOT EFFECTIVE, PLEASE CHECK WITH YOUR DIGITAL CERTIFICATE ISSUER. (285)" ;
array_ch_error["285"]			= "數碼證書未生效，請與數碼證書核准機構聯絡 (285)" ;

array_en_error["286"]			= "INCORRECT HKID/PASSPORT NUMBER.  PLEASE INPUT A CORRECT HKID/PASSPORT NUMBER (286)" ;
array_ch_error["286"]			= "身份證/護照號碼核准錯誤，請輸入正確的身份證/護照號碼 (286)" ;

array_en_error["287"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (287)" ;
array_ch_error["287"]			= "服務未能提供，請致電1818 (287)" ;

// ***************************** 300 **************************************
// ****************** Application Server Error ****************************

array_en_error["300"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (300)" ;
array_ch_error["300"]			= "服務未能提供，請致電1818 (300)" ;

array_en_error["301"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (301)" ;
array_ch_error["301"]			= "服務未能提供，請致電1818 (301)" ;

array_en_error["302"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (302)" ;
array_ch_error["302"]			= "服務未能提供，請致電1818 (302)" ;

array_en_error["303"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (303)" ;
array_ch_error["303"]			= "服務未能提供，請致電1818 (303)" ;

array_en_error["304"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (304)" ;
array_ch_error["304"]			= "服務未能提供，請致電1818 (304)" ;

array_en_error["305"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (305)" ;
array_ch_error["305"]			= "服務未能提供，請致電1818 (305)" ;

array_en_error["306"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (306)" ;
array_ch_error["306"]			= "服務未能提供，請致電1818 (306)" ;

array_en_error["307"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (307)" ;
array_ch_error["307"]			= "服務未能提供，請致電1818 (307)" ;

array_en_error["308"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (308)" ;
array_ch_error["308"]			= "服務未能提供，請致電1818 (308)" ;

array_en_error["309"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (309)" ;
array_ch_error["309"]			= "服務未能提供，請致電1818 (309)" ;

array_en_error["310"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (310)" ;
array_ch_error["310"]			= "服務未能提供，請致電1818 (310)" ;

array_en_error["311"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (311)" ;
array_ch_error["311"]			= "服務未能提供，請致電1818 (311)" ;

array_en_error["312"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (312)" ;
array_ch_error["312"]			= "服務未能提供，請致電1818 (312)" ;

array_en_error["313"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (313)" ;
array_ch_error["313"]			= "服務未能提供，請致電1818 (313)" ;

array_en_error["315"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (315)" ;
array_ch_error["315"]			= "服務未能提供，請致電1818 (315)" ;

array_en_error["317"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (317)" ;
array_ch_error["317"]			= "服務未能提供，請致電1818 (317)" ;

array_en_error["318"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (318)" ;
array_ch_error["318"]			= "服務未能提供，請致電1818 (318)" ;

array_en_error["319"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (319)" ;
array_ch_error["319"]			= "服務未能提供，請致電1818 (319)" ;

array_en_error["320"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (320)" ;
array_ch_error["320"]			= "服務未能提供，請致電1818 (320)" ;

array_en_error["321"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (321)" ;
array_ch_error["321"]			= "服務未能提供，請致電1818 (321)" ;

array_en_error["323"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (323)" ;
array_ch_error["323"]			= "服務未能提供，請致電1818 (323)" ;

array_en_error["340"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (340)" ;
array_ch_error["340"]			= "服務未能提供，請致電1818 (340)" ;

array_en_error["341"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (341)" ;
array_ch_error["341"]			= "服務未能提供，請致電1818 (341)" ;

array_en_error["342"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (342)" ;
array_ch_error["342"]			= "服務未能提供，請致電1818 (342)" ;

array_en_error["343"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (343)" ;
array_ch_error["343"]			= "服務未能提供，請致電1818 (343)" ;

array_en_error["350"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (350)" ;
array_ch_error["350"]			= "服務未能提供，請致電1818 (350)" ;

array_en_error["351"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (351)" ;
array_ch_error["351"]			= "服務未能提供，請致電1818 (351)" ;

array_en_error["352"]			= "EFT SERVICE NOT AVAILABLE, PLEASE RETRY LATER (352)" ;	
array_ch_error["352"]			= "轉賬服務暫停,請稍後再試 (352)" ;

array_en_error["353"]			= "EFT SERVICE NOT AVAILABLE, PLEASE RETRY LATER (353)" ;
array_ch_error["353"]			= "轉賬服務暫停,請稍後再試 (353)" ;

array_en_error["354"]			= "EFT SERVICE NOT AVAILABLE, PLEASE RETRY LATER (354)" ;
array_ch_error["354"]			= "轉賬服務暫停,請稍後再試 (354)" ;

array_en_error["355"]			= "EFT SERVICE NOT AVAILABLE, PLEASE RETRY LATER (355)" ;
array_ch_error["355"]			= "轉賬服務暫停,請稍後再試 (355)" ;

array_en_error["356"]			= "EFT SERVICE NOT AVAILABLE, PLEASE RETRY LATER (356)" ;
array_ch_error["356"]			= "轉賬服務暫停,請稍後再試 (356)" ;

array_en_error["389"]			= "THIS SESSION HAS BEEN DISCONNECTED. PLEASE PERFORM LOG ON AGAIN (389)" ;
array_ch_error["389"]			= "此環節已被終止，請重新登入 (389)" ;

// ***************************** 400 **************************************
// LOGIN & EKBA RELATED

array_en_error["401"]			= "Service Inaccessible. Please try again later. (401)" ;
array_ch_error["401"]			= "服務未能提供，請稍候再試。(401)" ;

array_en_error["402"]			= "Service Inaccessible. Please try again later. (402)" ;
array_ch_error["402"]			= "服務未能提供，請稍候再試。(402)" ;

array_en_error["403"]			= "Service Inaccessible. Please try again later. (403)" ;
array_ch_error["403"]			= "服務未能提供，請稍候再試。(403)" ;

array_en_error["404"]			= "Service Inaccessible. Please try again later. (404)" ;
array_ch_error["404"]			= "服務未能提供，請稍候再試。(404)" ;

array_en_error["405"]			= "Service Inaccessible. Please try again later. (405)" ;
array_ch_error["405"]			= "服務未能提供，請稍候再試。(405)" ;

array_en_error["421"]			= "Incorrect login information. Please re-enter.<br>(1) Forgot Password, click <a href='#' onclick='OnClickCannotLogin()'>here</a> to reset.<br>(2) Customer who has not registered for a Login Name, please click <a href='#' onclick='OnClickRegisterNow()'>here</a> to register.";
array_ch_error["421"]			= "登入資料不正確，請重新儲入。<br>(1) 忘記密碼，請<a href='#' onclick='OnClickCannotLogin()'>按此</a>重設。<br>(2) 客戶若未註冊登入名稱，請<a href='#' onclick='OnClickRegisterNow()'>按此</a>註冊。";

array_en_error["422"]			= "Incorrect login information. Please re-enter.<br>(1) Forget Password, click <a href='#' onclick='OnClickCannotLogin()'>here</a> to reset.<br>(2) Customer who has not registered for a Login Name, please click <a href='#' onclick='OnClickRegisterNow()'>here</a> to register.";
array_ch_error["422"]			= "登入資料不正確，請重新儲入。<br>(1) 忘記密碼，請<a href='#' onclick='OnClickCannotLogin()'>按此</a>重設。<br>(2) 客戶若未註冊登入名稱，請<a href='#' onclick='OnClickRegisterNow()'>按此</a>登記。";

array_en_error["423"]			= "Login access is locked.  Please unlock through the \"<a href='#' onclick='OnClickCannotLogin()'>Forget Password/Web Login Answers</a>\" function.";
array_ch_error["423"]			= "登入權限已鎖。請透過「<a href='#' onclick='OnClickCannotLogin()'>忘記密碼/網上登入答案</a>」功能進行重設。" ;

array_en_error["425"]			= "This Login Name is not associated with a Betting Account yet. Please click <a href='#' onclick='OnClickAssociteAccount()'>here</a> for change.";
array_ch_error["425"]			= "此登入名稱並未連繫至投注戶口，請<a href='#' onclick='OnClickAssociteAccount()'>按此</a>更改。" ;

array_en_error["426"]			= "You are not authorized to logon eWin in this website. Please proceed to <a href='#' onclick='top.location.href = \"http://eWin.hkjc.com\"'>eWin.hkjc.com</a> to logon to eWin service."
array_ch_error["426"]			= "你並沒權限在此網站登入「投注區」，請到<a href='#' onclick='top.location.href = \"http://eWin.hkjc.com\"'>eWin.hkjc.com</a>重新登入。"

array_en_error["427"]           = "Incorrect Login Answer. Please re-enter. If you have forgotten the answer, please click <a href='#' onclick='OnClickCannotLogin()'>here</a> to reset. [Attempt ### out of @@@]";
array_ch_error["427"]           = "登入答案不正確，請重新儲入。如閣下已忘記登入答案，請<a href='#' onclick='OnClickCannotLogin()'>按此</a>重設。 [第 ### 次嘗試，共有 @@@ 次機會]";

array_en_error["428"]			= "Login access is locked.  Please unlock through the \"<a href='#' onclick='OnClickCannotLogin()'>Forget Password/Web Login Answers</a>\" function.";
array_ch_error["428"]			= "登入權限已鎖。請透過「<a href='#' onclick='OnClickCannotLogin()'>忘記密碼/登入答案</a>」功能進行重設。" ;

array_en_error["445"]			= "ACCESS NOT PERMITTED.  PLEASE CALL 1818 (445)" ;
array_ch_error["445"]			= "戶口不能使用，請致電1818 (445)" ;

array_en_error["451"]			= "ACCESS NOT PERMITTED.  PLEASE CALL 1818 (451)" ;
array_ch_error["451"]			= "戶口不能使用，請致電1818 (451)" ;

array_en_error["453"]			= "Service Inaccessible. Please try again later. (453)" ;
array_ch_error["453"]			= "服務未能提供，請稍候再試。(453)" ;

array_en_error["456"]			= "Service Inaccessible. Please try again later. (456)" ;
array_ch_error["456"]			= "服務未能提供，請稍候再試。(456)" ;

array_en_error["479"]			= "Incorrect login information. Please re-enter.<br>(1) Forget Password, click <a href='#' onclick='OnClickCannotLogin()'>here</a> to reset.<br>(2) Customer who has not registered for a Login Name, please click <a href='#' onclick='OnClickRegisterNow()'>here</a> to register.";
array_ch_error["479"]			= "登入資料不正確，請重新儲入。<br>(1) 忘記密碼，請<a href='#' onclick='OnClickCannotLogin()'>按此</a>重設。<br>(2) 客戶若未註冊登入名稱，請<a href='#' onclick='OnClickRegisterNow()'>按此</a>登記。";

array_en_error["484"]			= "Service Inaccessible. Please try again later. (484)" ;
array_ch_error["484"]			= "服務未能提供，請稍候再試。(484)" ;

array_en_error["485"]			= "Service Inaccessible. Please try again later. (485)" ;
array_ch_error["485"]			= "服務未能提供，請稍候再試。(485)" ;

array_en_error["499"]			= "Service Inaccessible. Please try again later. (499)" ;
array_ch_error["499"]			= "服務未能提供，請稍候再試。(499)" ;

// ***************************** 800 **************************************
// *********************** SSO Releated Error **************************
array_en_error["801"]			= "Service Inaccessible. Please try again later. (801)" ;
array_ch_error["801"]			= "服務未能提供，請稍候再試。(801)" ;

array_en_error["802"]			= "Service Inaccessible. Please try again later. (802)" ;
array_ch_error["802"]			= "服務未能提供，請稍候再試。(802)" ;

array_en_error["803"]			= "Service Inaccessible. Please try again later. (803)" ;
array_ch_error["803"]			= "服務未能提供，請稍候再試。(803)" ;

array_en_error["804"]			= "Service Inaccessible. Please try again later. (804)" ;
array_ch_error["804"]			= "服務未能提供，請稍候再試。(804)" ;

// ***************************** 900 **************************************
array_en_error["900"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (900)" ;
array_ch_error["900"]			= "服務未能提供，請致電1818 (900)" ;

array_en_error["901"]			= "Transaction status unknown,  please check Transaction Records (901)" ;
array_ch_error["901"]			= "交易狀況不明，請複查注項 (901)" ;

// ***************************** 1000 **************************************

array_en_error["1001"]			= "Invalid browser version. Please upgrade to Internet Explorer 6.0 or above. (1001)";
array_ch_error["1001"]			= "瀏覽器版本不適用。請更新至Internet Explorer 6.0或以上版本。 (1001)";

array_en_error["1002"]			= "Unable to run ActiveX Control. Please first modify your browser settings (1002)";
array_ch_error["1002"]			= "未能啟動「ActiveX 控制」。請先更改瀏覽器設定。 (1002)";

// ***************************** 1100 **************************************

array_en_error["1101"]			= "Available to logged-in users only. Please first login.";
array_ch_error["1101"]			= "只適用於已登入的用戶，請先登入服務。";

array_en_error["1102"]			= "You have successfully logged-on. For security reasons, you have been logged out from your other browser window(s)." ;
array_ch_error["1102"]			= "閣下已成功登入「投注區」。為保安理由，其他登入之視窗 將被登出。" ;


// ***************************** 1200 **************************************

array_en_error["1201"]			= "System is busy......";
array_ch_error["1201"]			= "系統繁忙......";

array_en_error["1202"]			= "Betting on selected bet type(s) is not available.";
array_ch_error["1202"]			= "所選投注種類暫時不能接受投注。";

array_en_error["1203"]			= "Selections are full. Please send bet first.";
array_ch_error["1203"]			= "選擇已滿，請先傳送注項。";

array_en_error["1204"]			= "Please add bet to slip first";
array_ch_error["1204"]			= "請先儲入注項";

array_en_error["1205"]			= "Selections are full. Please send bet first.";
array_ch_error["1205"]			= "選擇已滿，請先傳送注項。";

array_en_error["1206"]			= "Invalid amount input";
array_ch_error["1206"]			= "投注金額錯誤";

array_en_error["1207"]			= "Cannot accept more than 36 selections." ;
array_ch_error["1207"]			= "不接受多於36個選項。" ;

array_en_error["1208"]			= "The entered \"Unit Bet\" amount exceed the allowed limit, please re-enter.";
array_ch_error["1208"]			= "所儲入的\"每注金額\"超出限額，請重新儲入。";

// ***************************** 1300 **************************************

array_en_error["1301"]			= "Unsent bets will be deleted after logoff. (1301)\r\nConfirm logoff?";
array_ch_error["1301"]			= "登出後，未傳送之注項將被删除。 (1301)\r\n確定登出?";

array_en_error["1302A"]			= "Your eWin security key is saved on this computer in the following location:";
array_ch_error["1302A"]			= "你的「投注區」保安匙已儲存在此電腦的以下位置：";
array_en_error["1302B"]			= "If you are currently using a public or shared PC, remember to delete your eWin security key after you logout.";
array_ch_error["1302B"]			= "如你現正使用的電腦為公共或與他人共用的話，請緊記於登出「投注區」後刪除你的保安匙。";

array_en_error["1303"]			= "Confirm to logout from eWin? (1303)";
array_ch_error["1303"]			= "確定登出「投注區」？ (1303)";

array_en_error["1304"]			= "Confirm to delete all bets? (1304)";
array_ch_error["1304"]			= "確定删除所有注項？ (1304)";

// ***************************** 1400 **************************************

array_en_error["1401"]			= "You must logoff before changing language selection. (1401)\r\nConfirm Logoff?";
array_ch_error["1401"]			= "閣下須先登出戶口，才可切換語言。 (1401)\r\n確定登出?";

array_en_error["1402"]			= "Unsent bets will be deleted after language change. (1402)\r\nConfirm Switch?";
array_ch_error["1402"]			= "切換語言後，未傳送之注項將被删除。 (1402)\r\n確定繼續?";

array_en_error["Please click on a bet before delete."]	= "Please click on a bet before delete.";
array_ch_error["Please click on a bet before delete."]	= "請先點擊其中一條注項以作選擇，然後再按刪除。";

// ***************************** PPS message for Current Session Records ****************************

array_ch_name["lbl_pps_deposit"]		= "繳費靈至投注戶口 (參考編號: ###DIGITAL_ORDER###)";
array_en_name["lbl_pps_deposit"]		= "PPS to Betting Account (Ref No: ###DIGITAL_ORDER###)";

array_ch_name["lbl_pps_reject_msg"]		= "繳費靈存款已被拒絕，請參考<a href='#' onclick='onClickOfficialPPSFAQ(@@@)'>常見問題</a>或致電 1818 查詢。(錯誤訊息：@@@)";
array_en_name["lbl_pps_reject_msg"]		= "PPS Deposit has been rejected, please see <a href='#' onclick='onClickOfficialPPSFAQ(@@@)'>FAQ</a> for details or call 1818 (ERROR CODE: @@@)";

array_ch_name["lbl_pps_processing_msg"]		= "此繳費靈存款交易正在處理中，請稍後再查閱。";
array_en_name["lbl_pps_processing_msg"]		= "This PPS Deposit transaction is currently being processed, please check again later.";

array_en_error["602"] = "The daily PPS deposit amount limit has been exceeded.";
array_ch_error["602"] = "已超出繳費靈每日存款金額上限。";

array_en_error["606"] = "Sorry that the deposit instruction has not been accepted by PPS. Please refer to the <a href='#' onclick='onClickOfficialPPSFAQ(##resCode##)'>FAQ</a> at PPS website or call PPS hotline 2311 9876 for enquiry. (Reject code: ##resCode##)";
array_ch_error["606"] = "很抱歉，存款指示未被繳費靈接納，請參閱繳費靈網頁的<a href='#' onclick='onClickOfficialPPSFAQ(##resCode##)'>常見問題</a>或致電繳費靈熱線2311 9876查詢。 (取消編號: ##resCode##)";

array_en_error["607"] = "Sorry that the deposit instruction has not been accepted by PPS. Please refer to the <a href='#' onclick='onClickOfficialPPSFAQ(##resCode##)'>FAQ</a> at PPS website or call PPS hotline 2311 9876 for enquiry. (Reject code: ##resCode##)";
array_ch_error["607"] = "很抱歉，存款指示未被繳費靈接納，請參閱繳費靈網頁的<a href='#' onclick='onClickOfficialPPSFAQ(##resCode##)'>常見問題</a>或致電繳費靈熱線2311 9876查詢。 (取消編號: ##resCode##)";

array_en_error["608"] = "The maximum number of PPS deposit transactions per-day has been exceeded.";
array_ch_error["608"] = "已超出繳費靈每日存款次數上限。";

array_en_error["609"] = "The daily PPS deposit amount limit has been exceeded.";
array_ch_error["609"] = "已超出繳費靈每日存款金額上限。";

array_en_error["610"] = "Deposit instruction has been accepted by PPS. Since the transaction is under process, it has not been credited to your betting account at this moment. Please check the transaction again on the next business day. (610)";
array_ch_error["610"] = "存款指示已被繳費靈接納，因交易正在處理中，而暫時未能存至你的投注戶口。請於下一個工作天覆查交易紀錄。(610)";

array_en_error["612"] = "Transaction is already processed. (612)";
array_ch_error["612"] = "交易已被處理。 (612)";

array_en_error["613"] = "Deposit instruction has been accepted by PPS. The transaction is under process. Please check your betting account balance to confirm the transaction status later on. (613)";
array_ch_error["613"] = "存款指示已被繳費靈接納，交易正在處理中。請稍後覆查投注戶口結存以核實交易狀況。(613)";

array_en_name["615"] = "Transaction timed out. Please check your bank account to confirm the transaction status.<br>1) If transaction was successful, the funds will be credited to your Betting Account on the next day<br>2) If transaction was not successful, please retry";
array_ch_name["615"] = "交易超越時限。請核對你的銀行戶口確認交易是否被接納。<br>1） 如交易已被接納，款項將於明天存入你的投注戶口<br>2） 如交易不被接納，請重新再試。";

// ***************************** Duplicate HR Betline ****************************
array_en_error["duplicateHRBet"] = "Duplicate bet selection not accepted.  Please remove the duplicated bet(s) and send bet again.";
array_ch_error["duplicateHRBet"] = "不接受重複的投注，請刪除重複的投注及重新發送。";

array_en_name["Duplicate Bet"] = "Duplicate Bet";
array_ch_name["Duplicate Bet"] = "重複注項";




//-->