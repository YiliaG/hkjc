
var int_minimize_flag = 0;
var array_en_name = new Array();
var array_ch_name = new Array();

var int_lang_eng				= 0 ;							// Language Define  ENG = 0
var int_lang_cht				= 1 ;							//					CHT = 1

var styleClass = new Array('tableContent5', 'tableContent6');

var bType4Autopay               = '5';

function invalidSessionWarning() {
  alert(get_display_lang('1101'));
  window.close();
}

function get_next_seq_no()
{
	var d = GetDataStore_persist("seq_no");
	if ( d == "" )
		return 0;
	var i = parseInt(d, 10) + 1;
	SetDataStore_persist("seq_no",i);
	return i;
}

function flag_lang()
{
	var d = GetDataStore("language", true);
	if (d == "")
		return int_lang_cht;
	else
		return parseInt(d);
}

function get_display_lang(inval)
{
	switch (flag_lang())
	{
		case (int_lang_eng) :	return array_en_name[inval] ;
									break ;
									
		case (int_lang_cht) :	return array_ch_name[inval] ;
									break ;
	}
	return '';
}

function func_replace_max_pay(inval)
{
	return inval.replace('MAX PAY' , "<BR>" + get_display_lang("max_payout")) + "&nbsp;" ;
}

function get_image_lang(inval)
{
	switch (flag_lang())
	{
		case (int_lang_eng) :	return array_en_name["pic_path"] + array_en_name[inval] + '?'+ staticCache;
									break ;
									
		case (int_lang_cht) :	return array_ch_name["pic_path"] + array_ch_name[inval] + '?'+ staticCache;
									break ;
	}
	return '';
}

function handle_result(inval)
{
	if( inval.toUpperCase() == "ACCEPTED" )
		return "ACCEPTED";
	if( inval.toUpperCase() == "REJECTED" )
		return "REJECTED";
	if( inval.toUpperCase() == "UNKNOWN" )
		return "UNKNOWN";
	return " ";
}

function formatting_number_to_currency(inval)
{
	if ((inval.toUpperCase() == 'NA')||(inval.toUpperCase() == 'N/A'))
	{	return inval ;	}
	//alert(inval.indexOf("$")) ;
	//if (inval.indexOf("$") > -1)
		inval = inval.split("$").join("") ;
	//if (inval.indexOf(",") > -1)
		inval = inval.split(",").join("") ;
	return '$' + CommaFormatted(CurrencyFormatted(inval)) ;
}


function CurrencyFormatted(amount)
{
	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	var s = new String(i);
	if(s.indexOf('.') < 0) { s += '.00'; }
	if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	s = minus + s;
	return s;
}
// end of function CurrencyFormatted()

function CommaFormatted(amount)
{
	var delimiter = ","; // replace comma if desired
	var a = amount.split('.',2)
	var d = a[1];
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
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
// end of function CommaFormatted()

function change_cursor_hand(inobj)
{	
	inobj.style.color = 'red' ;
	document.body.style.cursor='hand' ;	
}

function change_cursor_default(inobj)
{
	inobj.style.color = 'black' ;
	document.body.style.cursor='default' ;	
}

function initHeader() {
  obj = new Array((chgACTitle?get_display_lang('alt_60days_ac_records'):get_display_lang('alt_30days_ac_records')),
                      get_display_lang('alt_cs_records'),
                      get_display_lang('alt_tran_records'));
  helpUrlObj = get_url_help_obj_lang();                      
  genHeader(get_display_lang('alt_ac_records'));
}

function OnClickType(id) {
  if ( isProcessing )
    return;

  switch (id) {
    case 1: // current session records
      window.location.href = betslipIBUrl + 'log.aspx?lang=' + GetDataStore('language');
      break;
    case 2:
      window.location.href = betslipIBUrl + 'recall.aspx?lang=' + GetDataStore('language');
      break;
    case 0: // account records
    default:
      window.location.href = betslipIBUrl + 'acctstmt.aspx?lang=' + GetDataStore('language');
      break;
  }
  return;
}

function genTableHeader(tableTag) {
  var isAutopay = $('BetType').value == bType4Autopay;
  var buf = new StringBuffer();
  if ( tableTag )
    buf.append('<table id="stmtResultHeader" width="758px" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr>');
  if(!isAutopay){
    buf.append('<td width="8%" align="center" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_ref_no')).append('</td>');
    }
  buf.append('<td width="8%" align="center" class="tableContentHead" style="white-space:nowrap">')
     .append(get_display_lang('alt_acctstmt_date_time')).append('</td>');
  if(!isAutopay){
    buf.append('<td width="11%" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_race_day')).append('</td>');
    buf.append('<td width="8%" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_bet_type')).append('</td>');
    buf.append('<td width="330" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_transaction_details')).append('</td>');
    buf.append('<td width="10%" align="right" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_debit')).append('</td>');
    buf.append('<td width="10%" align="right" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_credit')).append('</td>');
  }else{
    //autopay
    buf.append('<td width="*" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_autopay_records')).append('</td>');
    buf.append('<td width="10%" align="right" class="tableContentHead" style="white-space:nowrap">')
      .append(get_display_lang('alt_acctstmt_amount')).append('</td>'); 
  }
  buf.append('<td class="tableContentHead" style="WIDTH:16px;PADDING-RIGHT:0px;PADDING-LEFT:0px;PADDING-BOTTOM:0px;PADDING-TOP:0px"><img src="images/spacer.gif" width="16" height="1"></td>');
  buf.append('</tr>');
  if ( tableTag )
    buf.append('</table>');
  return buf.toString();
}

function genTableHeaderTxt(tableTag) {
  var isAutopay = $('BetType').value == bType4Autopay;
  var buf = new StringBuffer();
  if(!isAutopay){
    buf.append(get_display_lang('alt_acctstmt_ref_no')).append('\r\n');
  }
  buf.append(get_display_lang('alt_acctstmt_date_time')).append('\r\n');
  if(isAutopay){
    buf.append(get_display_lang('alt_acctstmt_autopay_records')).append('\r\n');
    buf.append(get_display_lang('alt_acctstmt_amount')).append('\r\n****************************************\r\n');
  }else{    
    buf.append(get_display_lang('alt_acctstmt_race_day')).append('\r\n');
    buf.append(get_display_lang('alt_acctstmt_bet_type')).append('\r\n');
    buf.append(get_display_lang('alt_acctstmt_transaction_details')).append('\r\n');
    buf.append(get_display_lang('alt_acctstmt_debit')).append('\r\n');
    buf.append(get_display_lang('alt_acctstmt_credit')).append('\r\n****************************************\r\n');
  }
  return buf.toString();
}

function genPrintHeader() {
  var buf = new StringBuffer();
  buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td class="content">')
     .append(get_display_lang('alt_ac_records'))
     .append(' - ')
     .append(get_display_lang('alt_download'))
     .append('</td>');
  buf.append('<td align="right"><table border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td class="content" style="padding-right:20px;">')
     .append(get_display_lang('alt_from'))
     .append(' ')
     .append(GetDataStore('stmt_startDate'))
     .append(' ')
     .append(get_display_lang('alt_to'))
     .append(' ')
     .append(GetDataStore('stmt_endDate'))
     .append('</td>');
  buf.append('<td class="content" style="padding-right:20px;">')
     .append(get_display_lang('alt_account_no'))
     .append(' ')
     .append(GetDataStore('account'))
     .append('</td>');
  buf.append('<td class="content">')
     .append(get_display_lang('alt_balance'))
     .append(' ')
     .append(formatting_number_to_currency( GetDataStore('balance') ))
     .append('</td>');
	buf.append('</tr></table></td></tr></table>');
	return buf.toString();
}

function genPrintHeaderTxt() {
  var buf = new StringBuffer();
  buf.append(get_display_lang('alt_ac_records'))
     .append(' - ')
     .append(get_display_lang('alt_download'))
     .append('\r\n')
     .append(get_display_lang('alt_from'))
     .append(' ')
     .append(GetDataStore('stmt_startDate'))
     .append(' ')
     .append(get_display_lang('alt_to'))
     .append(' ')
     .append(GetDataStore('stmt_endDate'))
     .append('\r\n')
     .append(get_display_lang('alt_account_no'))
     .append(' ')
     .append(GetDataStore('account'))
     .append('\r\n')
     .append(get_display_lang('alt_balance'))
     .append(' ')
     .append(formatting_number_to_currency( GetDataStore('balance') ))
     .append('\r\n\r\n');
	return buf.toString();
}

function genPrintFooter() {
  var buf = new StringBuffer();
  buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td align="center" class="content">')
     .append(get_display_lang('alt_end'))
     .append('</td></tr></table>');
  return buf.toString();
}

function genPrintFooterTxt() {
  var buf = new StringBuffer();
  buf.append(get_display_lang('alt_end'))
  return buf.toString();
}


function getTotalRecordCount() {
  var dtls = GetDataStore('stored_stmt_dtls');
  var dtlsArr = dtls.split('@@@');
  return dtlsArr.length - 1;
}

function genTableRecords(startPageNo, endPageNo, tableTag) {
  var buf = new StringBuffer();
  var dtls = GetDataStore('stored_stmt_dtls');
  var dtlsArr = dtls.split('@@@');
  var startIdx = ((startPageNo-1) * g_record_per_page) + 1;
  var endIdx =  endPageNo * g_record_per_page;

  if ( tableTag )
    buf.append('<table id="stmtResultTable" border="0" cellspacing="0" cellpadding="0">');
  for ( var i=startIdx; i<=endIdx; i++ ) {
    if ( dtlsArr.length <= i )
      break;
      
    buf.append(genTableRecord(dtlsArr[i], i));
  }
  if ( tableTag )
    buf.append('</table>');
  return buf.toString();
}

function genTableRecordsTxt() {
  var buf = new StringBuffer();
  var dtls = GetDataStore('stored_stmt_dtls');
  var dtlsArr = dtls.split('@@@');
  var startIdx = 1;
  var endIdx = g_max_page_num * g_record_per_page;

  if(g_page_num != g_max_page_num){
    startIdx = (g_page_num - 1) * g_record_per_page + 1;
    endIdx = g_page_num * g_record_per_page;
  } 

  for ( var i=startIdx; i<=endIdx; i++ ) {
    if ( dtlsArr.length <= i )
      break;
      
    buf.append(genTableRecordTxt(dtlsArr[i], i));
  }
  return buf.toString();
}

function genTableRecord(rec, i) {
    if($('BetType').value == bType4Autopay){
        return genTableRecordAutopay(rec, i);
    }else{
        return genTableRecordNorm(rec, i);
    }
}

function genTableRecordAutopay(rec, i) {
  var dtlsArr = rec.split(';;;');
  if ( dtlsArr.length < 6 )
    return '';
  
  var txnType = dtlsArr[0];  
  var txnDate = dtlsArr[1];
  var txnTime = dtlsArr[2];
  var txnAmount = dtlsArr[3];
  var refNo = dtlsArr[4];
  var txnRejMsg = dtlsArr[5];
  
  
  var buf = new StringBuffer();       

  var fmtTxnAmt = formatting_number_to_currency(txnAmount);
  var msg = formatAutopayMsg(txnType, refNo, fmtTxnAmt, txnRejMsg);
  var dateTime = '<span style="white-space:nowrap">' + txnDate + '</sapn><br>' + txnTime;

  buf.append('<tr>');
  buf.append('<td width="8%" valign="top" style="padding:3px 8px;" class="').append(styleClass[i%2]).append('">')
     .append(dateTime).append('</td>');
  buf.append('<td width="440" valign="top" class="').append(styleClass[i%2]).append('">')
     .append(msg).append('</td>');                  
  buf.append(writeTD(i,formatAutopayAmtCol(txnType, txnAmount)));	

  buf.append('</tr>');

  return buf.toString();
}

function genTableRecordNorm(rec, i) {
  var dtlsArr = rec.split(';;;');
  if ( dtlsArr.length < 9 )
    return '';
  
  var txnNo = dtlsArr[0];
  var txnType = dtlsArr[1];
  var txnFlag = dtlsArr[2];
  var txnDate = dtlsArr[3];
  var txnTime = dtlsArr[4];
  var debit = dtlsArr[5];
  var credit = dtlsArr[6];
  var betType = dtlsArr[7];
  var raceDay = dtlsArr[8];
  var txnDtls = dtlsArr[9];

  var buf = new StringBuffer();
 
  if( txnNo=='' )
    return '';

  var str_maxpay = '';
  if ( txnDtls.indexOf('MAX PAY') > 0 ) {
    str_maxpay = txnDtls.substring(txnDtls.indexOf('MAX PAY'));
    str_maxpay = str_maxpay.substring(str_maxpay.indexOf('$'));
    txnDtls = txnDtls.substring(0, txnDtls.indexOf('MAX PAY')-1);
  }   

  var dateTime = '<span style="white-space:nowrap">' + txnDate + '</sapn><br>' + txnTime;

  buf.append('<tr>');
  buf.append('<td width="8%" valign="top" class="').append(styleClass[i%2]).append('">')
     .append(txnNo).append('</td>');
  buf.append('<td width="8%" valign="top" class="').append(styleClass[i%2]).append('">')
     .append(dateTime).append('</td>');
  buf.append('<td width="11%" valign="top" class="').append(styleClass[i%2]).append('">')
     .append(raceDay).append('</td>');
  buf.append('<td width="8%" valign="top" class="').append(styleClass[i%2]).append('">')
     .append(betType).append('</td>');
  buf.append('<td width="330" valign="top" class="').append(styleClass[i%2]).append('">')
     .append(txnDtls);
      
  if ( str_maxpay!='' ) {
    buf.append(get_display_lang('max_payout'));
    buf.append(str_maxpay);
  }

  if( txnFlag=='1' ) {
    buf.append(get_display_lang('alt_transaction_cancel'));
  }
        
  buf.append('</td>');
        
  buf.append(formatDebitTD(i, txnFlag, debit));
	buf.append(formatCreditTD(i, txnType, txnFlag, debit, credit));

  buf.append('</tr>');

  return buf.toString();
}

function genTableRecordTxt(rec, i){
  if($('BetType').value == bType4Autopay){
    return genTableRecordAutopayTxt(rec, i);
  }else{
    return genTableRecordNormTxt(rec, i);
  }
}

function genTableRecordAutopayTxt(rec, i) {
  var dtlsArr = rec.split(';;;');
  if ( dtlsArr.length < 6 )
    return '';
    
  var txnType = dtlsArr[0];  
  var txnDate = dtlsArr[1];
  var txnTime = dtlsArr[2];
  var txnAmount = dtlsArr[3];
  var refNo = dtlsArr[4];
  var txnRejMsg = dtlsArr[5];

  var buf = new StringBuffer();
  
  var dateTime = txnDate + ' ' + txnTime;
  var fmtTxnAmt = formatting_number_to_currency(txnAmount);
  var msg = formatAutopayMsg(txnType, refNo, fmtTxnAmt, txnRejMsg);          
                       
  buf.append(dateTime).append('\r\n');
  buf.append(msg.replace(/<br>/g,"\r\n").replace(/&nbsp;/g, " ")).append('\r\n');
  buf.append(formatAutopayAmtCol(txnType, txnAmount)).append('\r\n');
    
  buf.append('\r\n****************************************\r\n');

  return buf.toString();
}

function formatAutopayMsg(txnType, refNo, txnAmount, txnRejMsg){  
  var msgTemplate = "";
  if(txnType == "Rejected")
    msgTemplate = "acctstmt_autopay_reject_msg";  
  else if(txnType == "Request")
    msgTemplate = "acctstmt_autopay_request_msg";  
  else if(txnType == "Success")
    msgTemplate = "acctstmt_autopay_accept_msg";
  else if(txnType == "Pending")
    msgTemplate = "acctstmt_autopay_pending_msg";
  
  if(msgTemplate != ""){
    return get_display_lang(msgTemplate).replace("##AMOUNT##", txnAmount)
            .replace("##REF_NO##", refNo).replace("##REJ_CODE##", txnRejMsg);
  }else{
    return "";
  }  
}

function formatAutopayAmtCol(txnType, txnAmt){
    var fmtAmt = "0";  //use 0 for non-success txn
    if(txnType == "Success"){
       fmtAmt = txnAmt;       
    }
    return  formatting_number_to_currency(fmtAmt);  
}

function genTableRecordNormTxt(rec, i) {
  var dtlsArr = rec.split(';;;');
  if ( dtlsArr.length < 9 )
    return '';
  
  var txnNo = dtlsArr[0];
  var txnType = dtlsArr[1];
  var txnFlag = dtlsArr[2];
  var txnDate = dtlsArr[3];
  var txnTime = dtlsArr[4];
  var debit = dtlsArr[5];
  var credit = dtlsArr[6];
  var betType = dtlsArr[7];
  var raceDay = dtlsArr[8];
  var txnDtls = dtlsArr[9];

  var buf = new StringBuffer();
 
  if( txnNo=='' )
    return '';

  var str_maxpay = '';
  if ( txnDtls.indexOf('MAX PAY') > 0 ) {
    str_maxpay = txnDtls.substring(txnDtls.indexOf('MAX PAY'));
    str_maxpay = str_maxpay.substring(str_maxpay.indexOf('$'));
    txnDtls = txnDtls.substring(0, txnDtls.indexOf('MAX PAY')-1);
  }   

  var dateTime = txnDate + ' ' + txnTime;

  buf.append(txnNo).append('\r\n');
  buf.append(dateTime).append('\r\n');
  buf.append(raceDay.replace(/<br>/g,"\r\n").replace(/&nbsp;/g, " ")).append('\r\n');
  buf.append(betType.replace(/<br>/g,"\r\n").replace(/&nbsp;/g, " ")).append('\r\n');
  buf.append(txnDtls.replace(/<br>/g,"\r\n").replace(/&nbsp;/g, " "));
      
  if ( str_maxpay!='' ) {
    buf.append(get_display_lang('max_payout'));
    buf.append(str_maxpay);
  }

  if( txnFlag=='1' ) {
    buf.append(get_display_lang('alt_transaction_cancel'));
  }
        
  buf.append('\r\n');
        
  buf.append(formatDebitTD(i, txnFlag, debit, true));
  buf.append('\r\n');
	buf.append(formatCreditTD(i, txnType, txnFlag, debit, credit, true));

  buf.append('\r\n****************************************\r\n');

  return buf.toString();
}

function formatDebitTD(idx, txnFlag, debit, isTxt) {
  var msg = '';
	if( txnFlag == '2' )
    msg = get_display_lang('alt_overflow');
  else if ( txnFlag == '4' )
    msg = get_display_lang('alt_unsuccessful');
  else if ( debit == '$' )
    msg = isTxt ?  ' ' : '&nbsp;';

  if ( msg!='' && (debit=='$' || debit=='$0.00' || debit=='$0' ))
    return (isTxt ? msg : writeTD(idx, msg, ''));
  else {
    if( debit.charAt(debit.length-1)=='-' )
      debit = '-' + debit.substring(0, debit.length-1);

    debit = formatting_number_to_currency(debit);
    return (isTxt ? debit : writeTD(idx, debit, ''));
  }
}

function formatCreditTD(idx, txnType, txnFlag, debit, credit, isTxt) {
  var msg = '';
	if( txnFlag == '2' )
    msg = get_display_lang('alt_overflow');
  else if ( txnFlag == '4' )
    msg = get_display_lang('alt_unsuccessful');
  else if ( credit == '$' )
    msg = isTxt ?  ' ' : '&nbsp;';

  if ( msg!='' && (credit=='$' || credit=='$0.00' || credit=='$0' ))
    return (isTxt ? msg :writeTD(idx, msg, '#000000'));
  else {
    if ( credit.charAt(credit.length-1)=='-' )
      credit = '-' + credit.substring(0, credit.length-1);

    credit = formatting_number_to_currency(credit);

    if ( txnType == 'A8' )
      return (isTxt ? credit : writeTD(idx, credit, '#008800'));
    else if ( debit != '$' && credit != '$' )
      return (isTxt ? credit : writeTD(idx, credit, '#008800'));
    else
      return (isTxt ? credit : writeTD(idx, credit, ''));
  }
}

function writeTD(idx, msg, color) {
  var buf = new StringBuffer();
  if ( color=='' )
    buf.append('<td width="10%" align="right" valign="top" class="')
       .append(styleClass[idx%2])
       .append('" style="white-space:nowrap">')
		   .append(msg)
		   .append('</td>');
  else
    buf.append('<td width="10%" align="right" valign="top" class="')
       .append(styleClass[idx%2])
       .append('" style="color:')
       .append(color)
       .append(';white-space:nowrap">')
		   .append(msg)
		   .append('</td>');
  return buf.toString();
}

function syncTableColumnWidth() {
  try {
    var trs1 = $('stmtResultHeader').getElementsByTagName('tr');
    var trs2 = $('stmtResultTable').getElementsByTagName('tr');
    var tds1 = trs1[0].getElementsByTagName('td');
    var tds2 = trs2[0].getElementsByTagName('td');
    for ( var i=0; i<tds2.length; i++ ) {
      tds1[i].style.width = tds2[i].offsetWidth + 'px';
    }
  }
  catch (e) {}
}

// ***************************** Image **************************************
array_en_name["pic_path"] = "images/";
array_ch_name["pic_path"] = "images/";

array_en_name["pic_ok"]				= "btn_ok_en.gif";
array_ch_name["pic_ok"]				= "btn_ok_ch.gif";

array_en_name["pic_ok_on"]			= "btn_ok_on_en.gif";
array_ch_name["pic_ok_on"]			= "btn_ok_on_ch.gif";

array_en_name["pic_close"]			= "btn_close_en.gif";
array_ch_name["pic_close"]			= "btn_close_ch.gif";

array_en_name["pic_close_on"]		= "btn_close_on_en.gif";
array_ch_name["pic_close_on"]		= "btn_close_on_ch.gif";

array_en_name["pic_search"]			= "btn_search_en.gif";
array_ch_name["pic_search"]			= "btn_search_ch.gif";

array_en_name["pic_search_on"]		= "btn_search_on_en.gif";
array_ch_name["pic_search_on"]		= "btn_search_on_ch.gif";

array_en_name["pic_print"]			= "btn_print_en.gif";
array_ch_name["pic_print"]			= "btn_print_ch.gif";

array_en_name["pic_print_on"]		= "btn_print_on_en.gif";
array_ch_name["pic_print_on"]		= "btn_print_on_ch.gif";

array_en_name["pic_save"]			= "btn_export_en.png";
array_ch_name["pic_save"]			= "btn_export_ch.png";

array_en_name["pic_save_on"]		= "btn_export_on_en.png";
array_ch_name["pic_save_on"]		= "btn_export_on_ch.png";

array_en_name["pic_prev"]			= "btn_prev_en.gif";
array_ch_name["pic_prev"]			= "btn_prev_ch.gif";

array_en_name["pic_prev_on"]		= "btn_prev_on_en.gif";
array_ch_name["pic_prev_on"]		= "btn_prev_on_ch.gif";

array_en_name["pic_prev_off"]		= "btn_prev_off_en.gif";
array_ch_name["pic_prev_off"]		= "btn_prev_off_ch.gif";

array_en_name["pic_next"]			= "btn_next_en.gif";
array_ch_name["pic_next"]			= "btn_next_ch.gif";

array_en_name["pic_next_on"]		= "btn_next_on_en.gif";
array_ch_name["pic_next_on"]		= "btn_next_on_ch.gif";

array_en_name["pic_next_off"]		= "btn_next_off_en.gif";
array_ch_name["pic_next_off"]		= "btn_next_off_ch.gif";

array_en_name["pic_ac_records"]		= "en_ac_records.gif";
array_ch_name["pic_ac_records"]		= "ch_ac_records.gif";

array_en_name["pic_cs_records"]		= "en_current.gif";
array_ch_name["pic_cs_records"]		= "ch_current.gif";

array_en_name["pic_trans_record"]	= "en_trans_record.gif";
array_ch_name["pic_trans_record"]	= "ch_trans_record.gif";

// ***************************** ALT (mouse over) **************************************
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

array_en_name["alt_tran_range_note"]			= "Choose a search period of # days or less within the past 30 days."
array_ch_name["alt_tran_range_note"]			= "每次最多可搜尋過去30天內其中#天。"

array_en_name["alt_previous_page"]				= "Previous";
array_ch_name["alt_previous_page"]				= "上一頁";

array_en_name["alt_next_page"]					= "Next";
array_ch_name["alt_next_page"]					= "下一頁";

array_en_name["alt_search"]						= "New Search";
array_ch_name["alt_search"]						= "重新搜尋";

array_en_name["alt_print"]						= "Print";
array_ch_name["alt_print"]						= "列印";

array_en_name["alt_save"]						= "Export";
array_ch_name["alt_save"]						= "匯出檔案";

array_en_name["alt_close"]						= "Close";
array_ch_name["alt_close"]						= "關閉";

array_en_name["alt_download"]         = "Download version for reference only";
array_ch_name["alt_download"]         = "下載版只供參考";

array_en_name["alt_end"]         = "- End -";
array_ch_name["alt_end"]         = "- 完 -";

array_en_name["alt_cs_records_text1"]			= "Current Session Records would be cleared after logging off.";
array_ch_name["alt_cs_records_text1"]			= "複查是次登入之每項交易細節。客戶登出「投注區」後，此處紀錄亦將被清除。";

array_en_name["alt_cs_records_text2"]			= "Please use <span onclick=\"location.href = 'recall.aspx'\" onmouseover=\"change_cursor_hand(this)\" onmouseout=\"change_cursor_default(this)\"><u>Transaction Record</u></span> function to confirm whether the transactions with status <b>Unknown</b> have been accepted.";
array_ch_name["alt_cs_records_text2"]			= "*如 閣下發現狀況「<b>不明</b>」之交易紀錄，請按此查閱 <span onclick=\"location.href = 'recall.aspx'\"  onmouseover=\"change_cursor_hand(this)\" onmouseout=\"change_cursor_default(this)\"><u>複查已納入彩池及轉賬交易</u></span>。";

array_en_name["alt_no_cs_records"]				= "No records in current session.";
array_ch_name["alt_no_cs_records"]				= "是節未有交易紀錄。";

array_en_name["alt_year"]						= "Year";
array_ch_name["alt_year"]						= "年";

array_en_name["alt_month"]						= "Month";
array_ch_name["alt_month"]						= "月";

array_ch_name["alt_day"]						= "日";
array_en_name["alt_day"]						= "Day";

array_en_name["alt_transfer"]					= "No";
array_ch_name["alt_transfer"]					= "交易";

array_en_name["alt_amount"]						= "Amount";
array_ch_name["alt_amount"]						= "金額";

array_en_name["alt_log_status"]					= "Status";
array_ch_name["alt_log_status"]					= "狀況";

array_en_name["alt_transaction_details"]		= "Transaction Details";
array_ch_name["alt_transaction_details"]		= "細節";

array_en_name["alt_transaction_bet_type"]			= "Bet Type";
array_ch_name["alt_transaction_bet_type"]		= "投注類別";

array_en_name["alt_transaction_status"]			= "Status";
array_ch_name["alt_transaction_status"]			= "狀況";

array_en_name["alt_transaction_ref_no"]			= "Ref No";
array_ch_name["alt_transaction_ref_no"]			= "交易編號";

array_en_name["alt_account_no"]					= "Account No.: ";
array_ch_name["alt_account_no"]					= "投注戶口: ";

array_en_name["alt_balance"]					= "Balance: ";
array_ch_name["alt_balance"]					= "結餘: ";

array_en_name["alt_time_now"]					= "Time: ";
array_ch_name["alt_time_now"]					= "時間: ";

array_en_name["alt_today"]						= "Today Activities";
array_ch_name["alt_today"]						= "今日戶口紀錄";

array_en_name["alt_from"]						= "From";
array_ch_name["alt_from"]						= "由";

array_en_name["alt_to"]							= "To";
array_ch_name["alt_to"]							= "至";

array_en_name["alt_seek_last_day"]				= "Last&nbsp;&nbsp;";
array_ch_name["alt_seek_last_day"]				= "最&nbsp;&nbsp;近";

array_en_name["alt_seek_unit"]				    = "Days";
array_ch_name["alt_seek_unit"]				    = "日";

array_en_name["alt_transaction_type"]			= "Transaction Type";
array_ch_name["alt_transaction_type"]			= "交易種類";

array_en_name["alt_display_type"]				= "Display Type";
array_ch_name["alt_display_type"]				= "顯示種類";

array_en_name["alt_transaction_type_horse"]		= "Horse Racing";
array_ch_name["alt_transaction_type_horse"]		= "賽馬";

array_en_name["alt_transaction_type_sb"]		= "Football";
array_ch_name["alt_transaction_type_sb"]		= "足球";

array_en_name["alt_transaction_type_mk6"]		= "Mark Six";
array_ch_name["alt_transaction_type_mk6"]		= "六合彩";

array_en_name["alt_transaction_type_all"]		= "All Betting Transactions";
array_ch_name["alt_transaction_type_all"]		= "所有投注種類";

array_en_name["alt_transaction_type_autopay"]	= "Autopay Deposit Record";
array_ch_name["alt_transaction_type_autopay"]	= "自動轉賬存款紀錄";

array_en_name["alt_transaction_type_others"]	= "Others";
array_ch_name["alt_transaction_type_others"]	= "其他";

array_en_name["alt_display_type_all"]			= "All";
array_ch_name["alt_display_type_all"]			= "所有";

array_en_name["alt_display_type_dividend"]		= "Transactions With Dividends/Refund/Rebate";
array_ch_name["alt_display_type_dividend"]		= "已派彩/已退款/已回扣之交易";

array_en_name["alt_confirm"]					= "Comfirm";
array_ch_name["alt_confirm"]					= "確定";

array_en_name["alt_reset"]						= "Reset";
array_ch_name["alt_reset"]						= "重新搜尋";

array_en_name["alt_please_wait"]				= "Please wait...";
array_ch_name["alt_please_wait"]				= "請稍候...";

array_en_name["alt_acctstmt_ref_no"]			= "Ref No";
array_ch_name["alt_acctstmt_ref_no"]			= "交易編號";

array_en_name["alt_acctstmt_date_time"]			= "Date/Time";
array_ch_name["alt_acctstmt_date_time"]			= "日期/時間";

array_en_name["alt_acctstmt_race_day"]			= "Race Day";
array_ch_name["alt_acctstmt_race_day"]			= "賽事日";

array_en_name["alt_acctstmt_bet_type"]			= "Bet Type";
array_ch_name["alt_acctstmt_bet_type"]			= "投注類別";

array_en_name["alt_acctstmt_transaction_details"]	= "Transaction Details";
array_ch_name["alt_acctstmt_transaction_details"]	= "細節";

array_en_name["alt_acctstmt_debit"]				= "Debit";
array_ch_name["alt_acctstmt_debit"]				= "支出";

array_en_name["alt_acctstmt_credit"]			= "Credit";
array_ch_name["alt_acctstmt_credit"]			= "存入";

array_en_name["alt_acctstmt_autopay_records"]	= "Autopay Deposit Records";
array_ch_name["alt_acctstmt_autopay_records"]	= "自動轉賬存款紀錄";

array_en_name["alt_acctstmt_amount"]        	= "Amount";
array_ch_name["alt_acctstmt_amount"]	        = "金額";

array_en_name["alt_print_tip"]					= 'Prints only transaction records displayed on this page. Press "Print" on the last page for the full list of records.';
array_ch_name["alt_print_tip"]					= "只列印本頁所顯示的交易紀錄。如要列印全部紀錄，請到最後一頁按列印。";

array_en_name["alt_save_tip"]					= 'Exports only transaction records displayed on this page. Press "Export" on the last page for the full list of records.';
array_ch_name["alt_save_tip"]					= "只匯出本頁所顯示的交易紀錄。如要匯出全部紀錄，請到最後一頁按匯出檔案。";

array_en_name["alt_transaction_cancel"]			= "(CANCELLED)";
array_ch_name["alt_transaction_cancel"]			= "(交易取消)";

array_en_name["alt_overflow"]					= "OVERFLOW";
array_ch_name["alt_overflow"]					= "超額彩金";

array_en_name["alt_unsuccessful"]				= "UNSUCCESSFUL";
array_ch_name["alt_unsuccessful"]				= "交易失敗";

array_en_name["alt_recall_ref_no"]				= "Ref No";
array_ch_name["alt_recall_ref_no"]				= "交易編號";

array_en_name["alt_recall_bet_type"]			= "Bet Type";
array_ch_name["alt_recall_bet_type"]			= "投注類別";

array_en_name["alt_recall_transaction_details"]	= "Transaction Details";
array_ch_name["alt_recall_transaction_details"]	= "細節";

array_en_name["alt_recall_amount"]				= "Amount";
array_ch_name["alt_recall_amount"]				= "金額";

array_en_name["alt_cancel"]						= "(CANCELLED)";
array_ch_name["alt_cancel"]						= "(交易取消)";

array_en_name["ACCEPTED"]						= "Accepted";
array_ch_name["ACCEPTED"]						= "接納";

array_en_name["REJECTED"]						= "Rejected";
array_ch_name["REJECTED"]						= "未被接納";

array_en_name["UNKNOWN"]						= "Unknown";
array_ch_name["UNKNOWN"]						= "不明";

array_en_name["INPLAY_UNKNOWN"]					= "Unknown";
array_ch_name["INPLAY_UNKNOWN"]					= "不明";

array_en_name["CANCELLED"]						= "CANCELLED";
array_ch_name["CANCELLED"]						= "取消";

array_en_name["UNSUCCESSFUL"]					= "UNSUCCESSFUL";
array_ch_name["UNSUCCESSFUL"]					= "未成功";

array_en_name["TERMINATED"]						= "TERMINATED";
array_ch_name["TERMINATED"]						= "交易終止";

array_en_name["alt_page"]						= "Page #";
array_ch_name["alt_page"]						= "第#頁";

array_en_name["alt_last_page"]					= " (Last page)";
array_ch_name["alt_last_page"]					= " (最後一頁)";

array_en_name["max_payout"]						= "Maximum  Payout: ";
array_ch_name["max_payout"]						= "注項最高派彩: ";

array_ch_name["warning_day"]					= "所選擇日期超過 # 日，請縮窄所選的日期為 # 日或少於 # 日，然後再試一次。";
array_en_name["warning_day"]					= "The selected period is more than # days. Please select a date range that is no longer than # days and try again.";

array_en_name["alt_pic_record_help"]			= "Betting A/C Records Demo";
array_ch_name["alt_pic_record_help"]			= "戶口紀錄示範";

array_en_name["acctstmt_autopay_request_msg"]	= "Autopay Deposit Instruction ##AMOUNT## sent to bank (Ref No. ##REF_NO##)";
array_ch_name["acctstmt_autopay_request_msg"]	= "自動轉賬存款指令 ##AMOUNT## 已傳送至銀行 (參考編號: ##REF_NO##)";

array_en_name["acctstmt_autopay_accept_msg"]	= "Autopay Deposit ##AMOUNT## successful (Ref No. ##REF_NO##)";
array_ch_name["acctstmt_autopay_accept_msg"]	= "自動轉賬存款 ##AMOUNT## 接納 (參考編號: ##REF_NO##)";

array_en_name["acctstmt_autopay_reject_msg"]	= "Autopay Deposit ##AMOUNT## unsuccessful (Reject Code: ##REJ_CODE## &nbsp;&nbsp;&nbsp; Ref No. ##REF_NO##)";
array_ch_name["acctstmt_autopay_reject_msg"]	= "自動轉賬存款 ##AMOUNT## 未被接納 (取消編號: ##REJ_CODE## &nbsp;&nbsp;&nbsp; 參考編號: ##REF_NO##)";

array_en_name["acctstmt_autopay_pending_msg"]	= "Autopay Deposit Instruction ##AMOUNT## sent to bank (Ref No. ##REF_NO##)";
array_ch_name["acctstmt_autopay_pending_msg"]	= "自動轉賬存款指令 ##AMOUNT## 已傳送至銀行 (參考編號: ##REF_NO##)";


// ***************************** Error Message **************************************
array_en_name["1101"]			= "Available to logged-in users only. Please first login.";
array_ch_name["1101"]			= "只適用於已登入的用戶，請先登入服務。";

array_en_name["error_msg_invalid_session"]	= "Invalid Session";
array_ch_name["error_msg_invalid_session"]	= "此環節已被終止，請重新登入";

array_en_name["error_msg_389"]				= "THIS SESSION HAS BEEN DISCONNECTED. PLEASE PERFORM LOG ON AGAIN. (389)";
array_ch_name["error_msg_389"]				= "此環節已被終止，請重新登入。 (389)";

array_en_name["error_msg_103a"]				= "ANOTHER SESSION ALREADY LOGGED ON, PLEASE LOGOUT THIS SESSION (103)" ;
array_ch_name["error_msg_103a"]				= "重複登入，請登出此環節 (103)" ;

array_en_name["error_msg_103"]				= "ANOTHER SESSION ALREADY LOGGED ON, PLEASE LOGOUT THIS SESSION (103)" ;
array_ch_name["error_msg_103"]				= "重複登入，請登出此環節 (103)" ;

array_en_name["error_msg_112a"]				= "DATA TRANSFER ERROR, PLEASE PERFORM LOG ON AGAIN (112)" ;
array_ch_name["error_msg_112a"]				= "資料傳送錯誤，請重新登入 (112)" ;

array_en_name["error_msg_112"]				= "DATA TRANSFER ERROR, PLEASE PERFORM LOG ON AGAIN (112)" ;
array_ch_name["error_msg_112"]				= "資料傳送錯誤，請重新登入 (112)" ;

array_en_name["error_msg_system_not_ready"]	= "This service is not available now. Please try again later.";
array_ch_name["error_msg_system_not_ready"]	= "此服務暫時停用，請於稍後再試。";

array_en_name["error_msg_system_busy"]		= "SYSTEM BUSY, PLS TRY LATER";
array_ch_name["error_msg_system_busy"]		= "系統繁忙，請稍後再試";

array_en_name["date_period_exceed"]		= "The selected period is more than # days. Please select a date range that is no longer than # days and try again.";
array_ch_name["date_period_exceed"]		= "所選擇日期超過 # 日，請縮窄所選的日期為 # 日或少於 # 日，然後再試一次。";

array_en_name["export_not_support"]     = "Your current browser does not support the “Export” function for Account Records. Please upgrade the browser for the utmost experience of using Online Betting Service (eWin).";
array_ch_name["export_not_support"]     = "閣下現時使用之瀏覽器並不支援「戶口記錄」中的「匯出檔案」功能。請升級瀏覽器以享受「投注區」的最佳使用體驗。";
//-->



