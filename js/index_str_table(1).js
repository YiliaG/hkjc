<!--
var isIE = navigator.appName.toUpperCase().indexOf("MICROSOFT") >= 0;

var cLangENG = 0;
var cLangCHT = 1;

function GetLanguage() {
	var lang = parseInt(GetDataStore("language"));
	if (!isNaN(lang))
		return lang;
	return cLangCHT;
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

function GetImageURL(inval) {
	return ((GetLanguage() == cLangENG) ? array_en_name["pic_path"] + array_en_name[inval] + staticCache
										: array_ch_name["pic_path"] + array_ch_name[inval]) + staticCache;
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
  var i, a, main;
  for(i=0; (a = aFrame.document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) a.disabled = false;
    }
  }
}

var array_en_name = new Array();
var array_ch_name = new Array();
var array_en_error = new Array();
var array_ch_error = new Array();

// ***************************** Image Path **************************************
array_en_name["pic_path"]					= "./images/";
array_ch_name["pic_path"]					= "./images/";

// ***************************** DivShortBetline Preview Bet **************************************
// ***************************** Images **************************************
array_en_name["pic_txn_rec"]				= "btn_check_recall_en.gif";
array_ch_name["pic_txn_rec"]				= "btn_check_recall_ch.gif";
array_en_name["pic_txn_rec_on"]				= "btn_check_recall_on_en.gif";
array_ch_name["pic_txn_rec_on"]				= "btn_check_recall_on_ch.gif";
array_en_name["pic_done"]					= "btn_done_en.gif";
array_ch_name["pic_done"]					= "btn_done_ch.gif";
array_en_name["pic_done_on"]				= "btn_done_on_en.gif";
array_ch_name["pic_done_on"]				= "btn_done_on_ch.gif";
array_en_name["pic_del_bet"]				= "btn_del_en.gif";
array_ch_name["pic_del_bet"]				= "btn_del_ch.gif";
array_en_name["pic_del_bet_on"]				= "btn_del_on_en.gif";
array_ch_name["pic_del_bet_on"]				= "btn_del_on_ch.gif";

// ***************************** TEXT **************************************
array_en_name["acc_logon_time"]			= "Time :";
array_ch_name["acc_logon_time"]			= "時間 :";
array_en_name["alt_txn_rec"]			= "Transaction Records";
array_ch_name["alt_txn_rec"]			= "複查已納入彩池及轉賬交易";
array_en_name["alt_done"]				= "Done";
array_ch_name["alt_done"]				= "完成";

// ***************************** SlipPageDivSendBet Preview Bet **************************************

array_en_name["alt_preview_bet"]	= "Preview Bet";
array_ch_name["alt_preview_bet"]	= "預覽注項";

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

array_en_name["pic_send_bet"]			= "btn_send2_en.gif";
array_ch_name["pic_send_bet"]			= "btn_send2_ch.gif";
array_en_name["pic_send_bet_on"]	= "btn_send2_on_en.gif";
array_ch_name["pic_send_bet_on"]	= "btn_send2_on_ch.gif";
array_en_name["pic_send_bet_off"]	= "btn_send_off_en.gif";
array_ch_name["pic_send_bet_off"]	= "btn_send_off_ch.gif";
array_en_name["alt_send_bet"]			= "Send";
array_ch_name["alt_send_bet"]			= "傳送";

array_en_name["confirm_delete"]		= "Are you sure you want to delete?";
array_ch_name["confirm_delete"]		= "確定刪除注項？";

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

array_en_name["btn_send_bet_alt"]			= "If you do not see the \"BET CONFIRMATION\" screen within 15 seconds after you press \"SEND\", please use \"Transaction Records\" function to confirm whether the transactions with status \"Unknown\" have been accepted.";
array_ch_name["btn_send_bet_alt"]			= "按「傳送」鍵後，若在十五秒內仍未出現「注項紀錄」畫面， 請按「複查已納入彩池及轉賑交易」以確認狀況「不明」之注項是否被接納。";

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

array_en_name["max_payout"]				= "Maximum  Payout: " ;
array_ch_name["max_payout"]				= "注項最高派彩: " ;

array_en_name["BET_ACCEPTED"]			= "BET ACCEPTED";
array_ch_name["BET_ACCEPTED"]			= "注項已被接納";

array_en_name["BET_REJECTED"]			= "BET REJECTED";
array_ch_name["BET_REJECTED"]			= "注項未被接納";

array_en_name["BET_UNKNOWN"]			= "UNKNOWN";
array_ch_name["BET_UNKNOWN"]			= "注項狀況不明";

// ***************************** Flexibet Text *************************************
array_en_name["flexibet_name"]        = "FLEXI BET";
array_ch_name["flexibet_name"]        = "靈活玩";


// ***************************** Marksix Unit bet Selection Text *************************************
array_en_name["m6unit_name"]          = "Partial Unit Investment";
array_ch_name["m6unit_name"]          = "部份注項單位";

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

array_en_name["CW"]							= "Composite Win";
array_ch_name["CW"]							= "組合獨羸";

array_en_name["CWA"]						= "Composite Win CWA";
array_ch_name["CWA"]						= "組合獨羸 CWA";

array_en_name["CWB"]						= "Composite Win CWB";
array_ch_name["CWB"]						= "組合獨羸 CWB";

array_en_name["CWC"]						= "Composite Win CWC";
array_ch_name["CWC"]						= "組合獨羸 CWC"

// *************** Football ************
array_en_name["HAD"]						= "HOME / AWAY / DRAW";
array_ch_name["HAD"]						= "主客和";

array_en_name["FHAD"]						= "FIRST HALF HAD";
array_ch_name["FHAD"]						= "半場主客和";

array_en_name["ALUPHAD"]					= "ALL-UP HOME/AWAY/DRAW";
array_ch_name["ALUPHAD"]					= "主客和過關";

array_en_name["HDC"]						= "HANDICAP";
array_ch_name["HDC"]						= "讓球";

array_en_name["HHAD"]						= "HANDICAP HOME / AWAY / DRAW";
array_ch_name["HHAD"]						= "讓球主客和";

array_en_name["HFT"]						= "HaFu";
array_ch_name["HFT"]						= "半全場";

array_en_name["HAFU"]						= array_en_name["HFT"] ;
array_ch_name["HAFU"]						= array_ch_name["HFT"] ;

array_en_name["HFTP"]						= "HaFu POOL";
array_ch_name["HFTP"]						= "半全場彩池";

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

array_en_name["FCRS"]						= "FIRST HALF CORRECT SCORE";
array_ch_name["FCRS"]						= "半場波膽";

array_en_name["CRS"]						= "CORRECT SCORE";
array_ch_name["CRS"]						= "波膽";


array_en_name["CRSP"]						= "CORRECT SCORE POOL";
array_ch_name["CRSP"]						= "波膽彩池";

array_en_name["DHCP"]						= "DOUBLE HaFu SCORE";
array_ch_name["DHCP"]						= "孖寶半全膽";

array_en_name["HCSP"]						= "HaFu CORRECT SCORE POOL";
array_ch_name["HCSP"]						= "半全膽";

array_en_name["TTG"]						= "TOTAL GOALS";
array_ch_name["TTG"]						= "總入球";

array_en_name["HILO"]						= "HIGH/LOW";
array_ch_name["HILO"]						= "入球大細";

array_en_name["OOU"]						= array_en_name["HILO"] ;
array_ch_name["OOU"]						= array_ch_name["HILO"] ;

array_en_name["CHLO"]						= "CORNER HIGH/LOW";
array_ch_name["CHLO"]						= "角球大細";

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

// ***************************************Title Message Array***************************************

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

//**************************************** Error Message Array ******************************************

// ***************************** Error Message **************************************
array_en_error["system_busy"]					= "SYSTEM BUSY, PLEASE TRY LATER";
array_ch_error["system_busy"]					= "系統繁忙，請稍後再試";

array_en_error["defalut_msg"]					= "SERVICE INACCESSIBLE.  PLEASE CALL 1818" ;
array_ch_error["defalut_msg"]					= "服務未能提供，請致電1818" ;

array_en_error["wrong_password"]				= "Wrong Password. Please try again.";
array_ch_error["wrong_password"]				= "密碼錯誤，請重新儲入。";

array_en_error["wrong_password2"]				= "Please enter password";
array_ch_error["wrong_password2"]				= "請儲入密碼";

array_en_error["acc_no_empty"]					= 'Please enter a valid 8-digit Account Number. If your Account Number is 7 digits, please add a "0" at the beginning.';
array_ch_error["acc_no_empty"]					= '請儲入有效的八位數字投注戶口號碼。如你的投注戶口號碼只有七位數字請在前面加"0"。' ;

array_en_error["tnss_token_not_present"]		= "Smart card inserted is not of the selected type";
array_ch_error["tnss_token_not_present"]		= "智能卡與所選類別不符";

array_en_error["tnss_pin_expired"]				= "Smart card password expired. Please contact card issuer.";
array_ch_error["tnss_pin_expired"]				= "智能卡密碼已過期。請聯絡發卡機構。";

array_en_error["tnss_pin_locked"]				= "Smart card blocked. Please contact card issuer.";
array_ch_error["tnss_pin_locked"]				= "智能卡已被鎖上。請聯絡發卡機構。";

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

array_en_error["duplicate_login"]				= "ANOTHER SESSION ALREADY LOGGED ON, PLEASE LOGOUT THIS SESSION";
array_ch_error["duplicate_login"]				= "重複登入，請登出此環節";


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

array_en_error["A/C INACCESSIBLE"]				= "A/C INACCESSIBLE. PLEASE CALL 1818.";
array_ch_error["A/C INACCESSIBLE"]				= "戶口不適用，請致電互動服務熱線1818。";

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


// ***************************** PPS message for Current Session Records ****************************
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


// ***************************** 900 **************************************
array_en_error["900"]			= "SERVICE INACCESSIBLE.  PLEASE CALL 1818 (900)" ;
array_ch_error["900"]			= "服務未能提供，請致電1818 (900)" ;

array_en_error["901"]			= "Transaction status unknown,  please check Transaction Records (901)" ;
array_ch_error["901"]			= "交易狀況不明，請複查注項 (901)" ;

// ***************************** 1400 **************************************

array_en_error["Please click on a bet before delete."]	= "Please click on a bet before delete.";
array_ch_error["Please click on a bet before delete."]	= "請先點擊其中一條注項以作選擇，然後再按刪除。";

//-->