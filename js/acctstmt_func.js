<!--

var parentDataName = ['is_logon', 'datetime_offset', 'account', 'session_id', 'balance', 'sso_guid', 'sso_web_id', 'webID'];
var g_max_page_num = 1;

var acctstmt_worker = undefined;

function DoneGetParentItem(value, name) {
    
      g_DateTime = getServerDateTime();
      g_DateTime_last8=getServerDateTime_lastdays(8);
      g_DateTime_last15=getServerDateTime_lastdays(15);
      g_DateTime_last30=getServerDateTime_lastdays(30);
      g_DateTime_last60=getServerDateTime_lastdays(60);

      g_year = g_DateTime.getFullYear();
      g_month = g_DateTime.getMonth();
      g_day = g_DateTime.getDate();
      g_hours = g_DateTime.getHours();
      g_minutes = g_DateTime.getMinutes();
      
      g_date_string = ((g_day > 9) ? g_day : "0" + g_day) + "/"
				  + (((g_month + 1) > 9) ? (g_month + 1) : "0" + (g_month + 1)) + "/"
				  + g_year + " "
				  + ((g_hours > 9) ? g_hours : "0" + g_hours) + ":"
				  + ((g_minutes > 9) ? g_minutes : "0" + g_minutes);

      $('txtDateTime').innerHTML = get_display_lang('alt_time_now') + g_date_string;

      prepareDayRange();
      var d = new Date(g_year, g_month, g_day);
      addMonthEle(d, $('frm_mm1'));
      addDayEle(d, $('frm_dd1'));
      addMonthEle(d, $('frm_mm2'));
      addDayEle(d, $('frm_dd2'));

      
      if ( isLogon() != 1 || GetDataStore('account')=='' ) {
        invalidSessionWarning();	
      }
      
      $('txtAccNo').innerHTML = get_display_lang('alt_account_no') + GetDataStore('account');
      $('txtAccBal').innerHTML = get_display_lang('alt_balance') + '<strong>' + formatting_number_to_currency( GetDataStore('balance') ) + '</strong>';
      $('stmtMsg').style.display = 'none';
      $('stmtMsg').innerHTML = ''

      //isSilverlightLoaded = true;
      //AcctStmtPageOnload();
      isProcessing = false;
}

function handleEnter (field, event) {
	var keyCode = event.keyCode ? event.keyCode : 
	event.which ? event.which : event.charCode;
	if (keyCode == 13)
		return false;
	else
		return true;
}

function getServerDateTime() {
  return svrDate;
}

function getServerDateTime_lastdays(lastdays) {
	switch(lastdays)
	{
		case 15:
			return last15;
			break;
		case 30:
			return last30;
			break;
		case 60:
			return last60;
			break;
		default:
			return last8;
	}
}

function resetDay(func, ObjNo) {
  var d, o;
  if (func == 1) {
    if (ObjNo == 1) {
      o = $('frm_dd1');
      d = new Date($('frm_yyyy1').value, ($('frm_mm1').value-1), 1);
    } else {
      o = $('frm_dd2');
      d = new Date($('frm_yyyy2').value, ($('frm_mm2').value-1), 1);
    }
    addDayEle(d,o);
  } else {
    if (ObjNo == 1) {
      o = $('frm_mm1');
      d = new Date($('frm_yyyy1').value, ($('frm_mm1').value-1), 1);
    } else {
      o = $('frm_mm2');
      d = new Date($('frm_yyyy2').value, ($('frm_mm2').value-1), 1);
    }
    addMonthEle(d,o);
    resetDay(1,ObjNo);
  }
  $('DateType2').checked = true;
}

function prepareDayRange() {
  var ONEDAY = 60*1000*60*24;
  var d = new Date(g_year, g_month ,g_day);
  var start = d.getTime() - (g_maxAccRange-1) * ONEDAY;
  var startDate = new Date(start);
  var yyyyArr = new Array();

  var cnt=0;
  
  while ( d.getTime() >= startDate.getTime() ) {
    if ( yyyyArr.length == 0 || startDate.getFullYear() != yyyyArr[yyyyArr.length-1] )
      yyyyArr[yyyyArr.length] = startDate.getFullYear();

    var mm = (startDate.getMonth()+1>9) ? (startDate.getMonth()+1).toString() : '0' + (startDate.getMonth()+1).toString();
    var dd = (startDate.getDate()>9) ? startDate.getDate() : '0' + startDate.getDate();

    g_dateRangeArr[cnt++] = startDate.getFullYear() + mm + dd;
    startDate.setTime( startDate.getTime() + ONEDAY );
  }

  var old="";
  $('frm_yyyy1').options[0] = null;
  for ( var i=0; i<yyyyArr.length; i++ ) {
    if ( old != yyyyArr[i] ) {
      $('frm_yyyy1').options[i] = new Option(yyyyArr[i], yyyyArr[i]);
      old = yyyyArr[i];
    }
  }

  old = "";
  $('frm_yyyy2').options[0] = null;
  for( var i=0; i<yyyyArr.length; i++ ) {
    if (old != yyyyArr[i]) {
      $('frm_yyyy2').options[i] = new Option(yyyyArr[i], yyyyArr[i]);
      old = yyyyArr[i];
    }
  }

  $('frm_yyyy1').value = d.getFullYear();
  $('frm_yyyy2').value = d.getFullYear();
}

function addMonthEle(d, Mobj) {

  var yyyy = d.getFullYear().toString();
  var mm = (d.getMonth()+1).toString();
  var old = "";

  while ( Mobj.options.length > 0 )
    Mobj.options[0] = null;

  var idx = 0;
  for ( var i=0; i<g_dateRangeArr.length; i++ ) {
    if ( g_dateRangeArr[i].substring(0,4) == yyyy ) {
      var tmp = g_dateRangeArr[i].substring(4,6);
      if (tmp.charAt(0) == '0') tmp = tmp.substring(1,2);
      if ( old != tmp ) {
        Mobj.options[idx++] = new Option(tmp, tmp);
        old = tmp;
      }
    }
  }

  if ( selOption(mm, Mobj) ) {
    return;
  }

  Mobj.selectedIndex = 0;
}

function addDayEle(d, Dobj){
  var yyyy = d.getFullYear().toString();
  var mm = (d.getMonth()+1).toString();
  if (mm.length == 1) mm = "0" + mm;
  var dd = d.getDate();
  var yyyymm = yyyy+mm;
  var myEle;
  var old = "";

  while ( Dobj.options.length > 0 )
    Dobj.options[0] = null;

  var idx = 0;
  for ( var i=0; i<g_dateRangeArr.length; i++ ) {
    if ( g_dateRangeArr[i].substring(0,6) == yyyymm ) {
      var tmp = g_dateRangeArr[i].substring(6,8);
      if (tmp.charAt(0) == '0') tmp = tmp.substring(1,2);
      if ( old != tmp ) {
        Dobj.options[idx++] = new Option(tmp, tmp);
        old = tmp;
      }
    }
  }

  if ( selOption(dd, Dobj) ) {
    return;
  }

  Dobj.selectedIndex = 0;
}

function selOption(selItem, obj) {
  for ( var i=0; i<obj.options.length; i++ ) {
    if ( parseInt(obj.options[i].value, 10) == parseInt(selItem, 10) ) {
      obj.selectedIndex = i;
      return true;
    }
  }
  return false;
}

function AcctStmtPageOnload(){
  proxy.init(opener.parent,
                {                    
                    SESSION_STORE: new SessionStorePlugin()                    
                },
                'http://<%=ConfigurationManager.AppSettings["FullDomain"]%>',
                ['http://<%=ConfigurationManager.AppSettings["FullDomain"]%>']
            );

    //SetDataStore('language', language);
 
    DoneGetParentItem();
    

  // language specific
  initHeader();
  initAccStmtResultHeader();

 // $('stmtMsg').style.display = 'block';
 // $('stmtMsg').innerHTML = '<strong>' + get_display_lang('alt_please_wait') + '</strong>';
  document.title = get_display_lang('alt_ac_records');

  $('asToday').innerHTML = get_display_lang('alt_today');
  $('asFrom').innerHTML = get_display_lang('alt_from');
  $('asFromDay').innerHTML = get_display_lang('alt_day');
  $('asFromMonth').innerHTML = get_display_lang('alt_month');
  $('asFromYear').innerHTML = get_display_lang('alt_year');
  $('asTo').innerHTML = get_display_lang('alt_to');
  $('asTo_Day').innerHTML = get_display_lang('alt_day');
  $('asToMonth').innerHTML = get_display_lang('alt_month');
  $('asToYear').innerHTML = get_display_lang('alt_year');
  $('seekLastDay').innerHTML = get_display_lang('alt_seek_last_day');
  $('seekUnit').innerHTML = get_display_lang('alt_seek_unit');

  $('asTxnType').innerHTML = get_display_lang('alt_transaction_type');
  $('asDisplayType').innerHTML = get_display_lang('alt_display_type');
  $('asSelDtRange').innerHTML ='('+ get_display_lang('alt_tran_range_note').replace('#', g_select_day_range)+')';

  $('pic_ok').src = get_image_lang('pic_ok');
  $('pic_ok').title = get_display_lang('alt_confirm');
  
  genBetTypeOptions(true);		
  genTransTypeOptions(true);

  if ( navigator.appVersion.indexOf('Mac') >= 0 ) {
    $('accStmtSearchBox').style.padding = '7px 10px 1px 10px';
    $('frm_dd1').style.width = '45px';
    $('frm_dd2').style.width = '45px';
    $('frm_mm1').style.width = '45px';
    $('frm_mm2').style.width = '45px';
  }
  
  if(isIDevice()){
    $('frm_dd1').style.width = '50px';
    $('frm_dd2').style.width = '50px';
    $('frm_mm1').style.width = '50px';
    $('frm_mm2').style.width = '50px';
  }

 	if (!IsProvided60DaysData) {
    $('DateType3').style.display = "none";
    $('seekLastDay').style.display = "none";
    $('last_days').style.display = "none";
    $('seekUnit').style.display = "none";
    $('asSelDtRange').style.display = "inline";
 	}
 	else {
 		$('DateType3').style.display = "inline";
 		$('seekLastDay').style.display = "inline";
 		$('last_days').style.display = "inline";
 		$('seekUnit').style.display = "inline";
 		$('asSelDtRange').style.display = "none";
    if (chgACTitle) {
      $('last_days').options.add(new Option('60', '60'));
    }
  }
  
  popupSvc.init(opener.GetError);   
}


function InitStmt() {
  if ( $('BetType').value=='4' && $('TransType').value=='0')
    return;

  if ( isProcessing )
    return;

  isProcessing = true;
  
  g_max_page_num = 1;

  var dd1, mm1, yyyy1, dd2, mm2, yyyy2;
  var dateType = 0;

  if( $('DateType1').checked ) {
    dd1 = dd2 = g_day;
    mm1 = mm2 = g_month + 1;
    yyyy1 = yyyy2 = g_year;
  }
  else if($('DateType2').checked) {
    dd1 = $('frm_dd1').value;
    mm1 = $('frm_mm1').value;
    yyyy1 = $('frm_yyyy1').value;

    dd2 = $('frm_dd2').value;
    mm2 = $('frm_mm2').value;
    yyyy2 = $('frm_yyyy2').value;

    dateType = 1;
  }
  else{
	var lastdays = parseInt($('last_days').value,10);
	dd2 = g_day;
    mm2 = g_month + 1;
    yyyy2 = g_year;
    switch(lastdays)
    {
		case 15:
			dd1 = g_DateTime_last15.getDate();
			mm1 = g_DateTime_last15.getMonth() + 1;
			yyyy1 = g_DateTime_last15.getFullYear();
			break;
		case 30:
			dd1 = g_DateTime_last30.getDate();
			mm1 = g_DateTime_last30.getMonth() + 1;
			yyyy1 = g_DateTime_last30.getFullYear();
			break;
		case 60:
			dd1 = g_DateTime_last60.getDate();
			mm1 = g_DateTime_last60.getMonth() + 1;
			yyyy1 = g_DateTime_last60.getFullYear();
			break;
		default:
			dd1 = g_DateTime_last8.getDate();
			mm1 = g_DateTime_last8.getMonth() + 1;
			yyyy1 = g_DateTime_last8.getFullYear();
			break;
    }
	dateType = 2;
  }
  
  try {
    //change variable type to string
    dd1 = parseInt(dd1, 10);
    mm1 = parseInt(mm1, 10);
    dd2 = parseInt(dd2, 10);
    mm2 = parseInt(mm2, 10);
    yyyy1 = parseInt(yyyy1, 10);
    yyyy2 = parseInt(yyyy2, 10);

   if(1==dateType)
   {
		var tmpDate1 = new Date(yyyy1, mm1-1, dd1);
		var tmpDate2 = new Date(yyyy2, mm2-1, dd2);
		

		var compare = (tmpDate2.getTime() - tmpDate1.getTime()) / (24*60*60*1000);
		if (g_select_day_range != '')
		  g_select_day_range = parseInt(g_select_day_range);
		else
		  g_select_day_range = 0;

		if ( compare+1 > g_select_day_range || compare < 0 ) {
		  alert(get_display_lang('warning_day').replace(/#/g, g_select_day_range));
		  isProcessing = false;
		  return;
		}
	}
  } catch(e) {
    alert("InitStmt() Err:" + e.number + " " + e.description);
  }

  // send statement confirm WA tagging  
  opener.WATrack('stmtConfirm');

  // append leading zero
  dd1 = dd1 < 10 ? '0' + dd1 : dd1;
  dd2 = dd2 < 10 ? '0' + dd2 : dd2;
  mm1 = mm1 < 10 ? '0' + mm1 : mm1;
  mm2 = mm2 < 10 ? '0' + mm2 : mm2;

  SetDataStore('stmt_startDate', dd1 + DATE_SEPARATOR + mm1 + DATE_SEPARATOR + yyyy1);
  SetDataStore('stmt_curDate', dd1 + DATE_SEPARATOR + mm1 + DATE_SEPARATOR + yyyy1);
  SetDataStore('stmt_endDate', dd2 + DATE_SEPARATOR + mm2 + DATE_SEPARATOR + yyyy2);
  SetDataStore('stmt_lastStatRequest', '');
  SetDataStore('stmt_inSeg', '@@@@@@');
  SetDataStore('stmt_txnType', $('TransType').value);
  SetDataStore('stmt_betType', $('BetType').value);

  curAction = ACTION_SEARCH;
  SetDataStore('stored_stmt_dtls', '');

  // please wait message
  $('stmtHeader').style.display = 'none';
  $('stmtTable').innerHTML = '';
  $('stmtTable').style.overflowY = 'scroll';
  $('accStmtResultButton').style.display = 'none';
  $('stmtMsg').style.display = 'block';
  $('stmtMsg').innerHTML = '<strong>' + get_display_lang('alt_please_wait') + '</strong>'

  SetDataStore('reqCount', g_record_per_page);

  opener.proxy.sendMessageFromPopup('PRE_TXN', 'PRE_TXN', {});
  
  var sendSuccess;
  if($('BetType').value == bType4Autopay){
        sendSuccess = sendGetDDARecordsRequest();
  } else{
        sendSuccess = sendStatementRequest();
  }     
  
  if(!sendSuccess){
    onCancelSearch();
  }
}

function onCancelSearch(){
  isProcessing = false;
  openSearchBox();
  
  document.body.style.cursor = 'auto';
  $('stmtMsg').innerHTML = '';
  $j('#txtPageNum').html('');
}

function sendGetDDARecordsRequest() {     
  isProcessing = true;
  
  var lang = GetDataStore('language');
  var curDate = GetDataStore('stmt_curDate');
  var endDate = GetDataStore('stmt_endDate');
 
  var sendSuccess = popupSvc.sendReq('DDA_GetDDARecordsOperation', 
    {
      lang: lang,
      startDate: curDate,
      endDate: endDate
    }, ProcessGetDDARecordsResult,
    ProcessGetDDARecordsReplyTimeout,
    replyTimeoutInSec
    );  
    
  document.body.style.cursor = 'progress';
  
  return sendSuccess;
}

function ProcessGetDDARecordsResult(msg) {

  if ( msg.dda_status!='0' ) {
    if ( msg.dda_status == '-2') {
        processSSOExtendResult(msg); // Suppot SSO
    }
    ProcessStatementError(msg);
    return;
  }

  var dtls = msg.dda_dtls;
  var stored_dtls = GetDataStore('stored_stmt_dtls');
  SetDataStore('stored_stmt_dtls', stored_dtls + dtls);
  SetDataStore('isLastPage', msg.isLastPage);
  
  displayRecords();
}

function ProcessGetDDARecordsReplyTimeout() {
  $('stmtMsg').style.display = 'block';
  $('stmtMsg').innerHTML = get_display_lang('error_msg_system_busy');
  //$('stmtTable').style.display = 'none';
  $('stmtTable').innerHTML = "";  
  isProcessing = false;
  document.body.style.cursor = 'auto';
}


function sendStatementRequest() {   
  var lang = GetDataStore('language');
  var reqCount = GetDataStore('reqCount');
  var curDate = GetDataStore('stmt_curDate');
  var endDate = GetDataStore('stmt_endDate');
  var lastStatReq = GetDataStore('stmt_lastStatRequest');
  var iSeg = GetDataStore('stmt_inSeg');
  var txnType = GetDataStore('stmt_txnType');
  var betType = GetDataStore('stmt_betType');
   
  var sendSccuess = popupSvc.sendReq('STATEMENT_DoStatementSearch',
    {      
      lang: lang,
      reqCount: reqCount,
      curDate: curDate,
      endDate: endDate,
      lastStatReq: lastStatReq,
      incompleteSeg: iSeg,
      txnType: txnType,
      betType: betType      
    }, ProcessStatmentResult,
      ProcessStatmentTimeout,
      replyTimeoutInSec
    );  
  
    
  document.body.style.cursor = 'progress';
  
  return sendSccuess;
}

function debugForm() {
  alert(''
    + 'Account = ' + arguments[0]
    + '\nSid = ' + arguments[1]
    + '\nSeqNo = ' + arguments[2]
    + '\nLanguage = ' + arguments[3]
    + '\nRecord Count = ' + arguments[4]
    + '\nCurrent Search Date = ' + arguments[5]
    + '\nEnd Search Date = ' + arguments[6]
    + '\nLast Statement Request Details = ' + arguments[7]
    + '\nIncomplete Segment = ' + arguments[8]
    + '\nTransType = ' + arguments[9]
    + '\nBetType = ' + arguments[10]);
}

function ProcessStatmentResult(msg) {

  if ( msg.stmt_status!='0' ) {
    if ( msg.stmt_status == '-3' ) {
      //opener.proxy.sendMessage('SESSION_STORE', 'SetValue', {seq_no: GetDataStore('seq_no')}, opener.proxy.NO_CALLBACK);
      //opener.$post("SetDataStore('seq_no', " + GetDataStore('seq_no') + ")", opener.indexContext);
    }
    else if ( msg.stmt_status == '-2') {
        processSSOExtendResult(msg); // Suppot SSO
    }
    ProcessStatementError(msg);
    return;
  }

  var dtls = msg.stmt_dtls;
  var stored_dtls = GetDataStore('stored_stmt_dtls');
  SetDataStore('stored_stmt_dtls', stored_dtls + dtls);
  
  SetDataStore('stmt_lastStatRequest', msg.stmt_lastStatRequest);
  SetDataStore('stmt_inSeg', msg.stmt_inSeg);
  
  SetDataStore('stmt_curDate', msg.stmt_curDate);
  SetDataStore('stmt_endDate', msg.stmt_endDate);
  
  //opener.$post("SetDataStore('seq_no', " + GetDataStore('seq_no') + ")", opener.indexContext);
  //opener.proxy.sendMessage('SESSION_STORE', 'SetValue', {seq_no: GetDataStore('seq_no')}, opener.proxy.NO_CALLBACK);

//  var self = this;
//  opener.AsyncStart(function() {
//    self.displayRecords();
//  });
  SetDataStore('isLastPage', msg.isLastPage);
  
  displayRecords(msg);
}

function ProcessStatmentTimeout() {
  $('stmtMsg').style.display = 'block';
  $('stmtMsg').innerHTML = get_display_lang('error_msg_system_busy');
  //$('stmtTable').style.display = 'none';
  $('stmtTable').innerHTML = "";
  isProcessing = false;
  document.body.style.cursor = 'auto';
}

function displayRecords(msg) {
  switch ( curAction ) {
    case ACTION_SEARCH:
      g_page_num = 1;
      break;
    case ACTION_NEXT:
      g_page_num++;
      break;
    case ACTION_PREV:
      g_page_num--;
      break;
    case ACTION_SAVE:
      break;
    case ACTION_EXPORT:
      break;
  }

  g_max_page_num = (g_max_page_num < g_page_num) ? g_page_num : g_max_page_num;

  var lastPage = -1;
  isLastPage = GetDataStore('isLastPage')=='True';
  if ( isLastPage )
    lastPage = g_max_page_num;

  var endIdx =  g_page_num * g_record_per_page;
  var totalCnt = getTotalRecordCount();

  showNextPage = (!isLastPage) || (endIdx < totalCnt);

  $('stmtMsg').style.display = 'none';
  $('stmtHeader').innerHTML = genTableHeader(true);
  $('stmtHeader').style.display = '';
  $('stmtTable').innerHTML = genTableRecords(g_page_num, g_page_num, true);
  $('stmtTable').style.display = '';
  $('stmtTable').style.height = '292px';
  $('stmtTable').scrollTop = '0px';
  $('accStmtResultButton').style.display = '';
  $('txtPageNum').innerHTML = get_display_lang('alt_page').replace('#', g_page_num);
  syncTableColumnWidth();
  isProcessing = false;
  initAccStmtResultHeader();
  
  document.body.style.cursor = 'auto';
}

function ProcessStatementError(msg) {
  $('stmtMsg').style.display = 'block';
  
  if(msg.stmt_error)
    $('stmtMsg').innerHTML = msg.stmt_error;
  else
    $('stmtMsg').innerHTML = msg.dda_error;
    
  $('stmtHeader').style.display = 'none';
  $('stmtTable').style.display = 'none';
  isProcessing = false;
  document.body.style.cursor = 'auto';
}

function printPage() {
  curAction = ACTION_PRINT;
  var buf = new StringBuffer();
  buf.append(genPrintHeader());
  buf.append('<table border="0" cellspacing="0" cellpadding="0">');
  buf.append(genTableHeader());
  if(g_max_page_num ==  g_page_num && GetDataStore('isLastPage')=='True') 
    buf.append(genTableRecords(1, g_max_page_num, false));
  else
    buf.append(genTableRecords(g_page_num, g_page_num, false));
  buf.append(genPrintFooter());
  buf.append('</table>');
  
  $("printf").contentWindow.printContent(buf.toString());
  
  $('pic_print').src = get_image_lang('pic_print');
  showDiv('printDiv', 0);
}

function savePage(export_type){
  exportClicked();
  var url = 'AcctStmtExport.aspx'+
            '?lang=' + (flag_lang() == 0 ? "en" : "ch") + 
            '&g_page_num='+ g_page_num + 
            '&g_max_page_num=' + g_max_page_num + 
            '&g_record_per_page=' + g_record_per_page + 
            '&export_type=' + export_type +
            '&account=' + GetDataStore('account') + 
            //'&bet_type=' + $('BetType').value + 
            '&stmt_startDate=' + GetDataStore('stmt_startDate') +
            '&stmt_endDate=' + GetDataStore('stmt_endDate') +
            '&is_last_page=' + GetDataStore('isLastPage');
  
  //window.open(url , '_self');
  window.location.href = url;
}

function fileExport(export_type) {
  
  if (!isFileAPISupported() || !isWindowURLSupported()) {
    displayExportWarningMsg();
    return;
  }
  
  var extension = "html";

  if (export_type == "txt") {
    extension = "txt";
  }
  
  var fileName = "acctstmt." + extension;
  
  var options = {
    lang : (flag_lang() == 0 ? "en" : "ch"),
    g_page_num : g_page_num,
    g_max_page_num : g_max_page_num,
    g_record_per_page : g_record_per_page,
    export_type : export_type,
    account : GetDataStore('account'),
    stmt_startDate : GetDataStore('stmt_startDate'),
    stmt_endDate : GetDataStore('stmt_endDate'),
    is_last_page : GetDataStore('isLastPage'),
    session : {
      statement : GetDataStore("stored_stmt_dtls"),
      balance : GetDataStore("balance"),
      betType : GetDataStore("stmt_betType")
    }
  };
  
  // Way 1: If the browser support web worker, use it to generate the file in a new thread to avoid freezing the page
  if (isWebWorkerSupported()) {
    var acctstmt_worker = new Worker(acctstmtWorkerFilePath);
    
    var data = {
      scripts : [
        acctstmtExportFuncPath,
        acctMomentLibPath
      ],
      options: options
    };
    
    acctstmt_worker.addEventListener('message', function(e) {
      
      var blobObj = e.data;
      
      if (! blobObj) {
        return;
      }
      
      var wURL = window.URL || window.webkitURL;

      var blobURL = wURL.createObjectURL(blobObj);

      // window.open(blobURL, "_blank", "scrollbars=yes, resizable=yes");
      // window.location.href = blobURL;
      saveAs(blobObj, fileName);
      acctstmt_worker.terminate();  
    });
    
    acctstmt_worker.postMessage(data);
    
    return;
  }
  
  // Way 2: if the browser DON'T support web worker, generate the file in current ui thread
  var blobObj = stmt_export.getBlob(options);
  
  var wURL = window.URL || window.webkitURL;

  var blobURL = wURL.createObjectURL(blobObj);

  // window.open(blobURL, "_blank", "scrollbars=yes, resizable=yes");
  
  saveAs(blobObj, fileName);
}

function genSavePageHtml() {
  var buf = new StringBuffer();
  var dt = new Date();

  buf.append('<html>');
  buf.append('<head><title>Account Records #DATETIME#</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></HEAD>');
  
  buf.append('<style type="text/css">\n');
  buf.append('.content { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; }\n');
  buf.append('.tableContentHead { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; padding:5px 1px 5px 1px; background-color:#FFFFFF; border-bottom:1px solid #CCCCCC; border-top:1px solid #CCCCCC; }\n');
  buf.append('.tableContent5 { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; border-right:#FFFFFF 1px solid; padding:3px 1px 3px 1px; background-color:#FFFFFF; }\n');
  buf.append('.tableContent6 { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; border-right:#FFFFFF 1px solid; padding:3px 1px 3px 1px; background-color:#F5F5F5; }\n');
  buf.append('</style>');

  buf.append('<body oncontextmenu="return false" leftMargin="14" topMargin="0">');

  buf.append(genPrintHeader());
  buf.append('<table border="0" cellspacing="0" cellpadding="0">');
  buf.append(genTableHeader());
  if(g_max_page_num ==  g_page_num) 
    buf.append(genTableRecords(1, g_max_page_num, false));
  else
    buf.append(genTableRecords(g_page_num, g_page_num, false));
  buf.append(genPrintFooter());
  buf.append('</table>');
  
  buf.append('</body></html>');

  return buf.toString();
}

function genSavePageTxt() {
  var buf = new StringBuffer();
  var dt = new Date();
  buf.append(genPrintHeaderTxt());
  buf.append(genTableHeaderTxt());
  buf.append(genTableRecordsTxt());
  buf.append(genPrintFooterTxt());
  return buf.toString();
}

function goNextPage() {
  if ( showNextPage && !isProcessing ) {
    isProcessing = true;
    
    var sendSuccess = true;
    
    // send statement next WA tagging  
    opener.WATrack('stmtNext');

    var recordCount = getTotalRecordCount();
    var endIdx = (g_page_num + 1) * g_record_per_page;
    var unreadRecordCount = recordCount - (g_page_num * g_record_per_page);
    if ( isLastPage || unreadRecordCount >= g_record_per_page ) {
      curAction = ACTION_NEXT;
      displayRecords();

    }
    else if ( unreadRecordCount >= 0 ) {
      var preReqCount = GetDataStore('reqCount');
      SetDataStore('reqCount', g_record_per_page - unreadRecordCount);
      curAction = ACTION_NEXT;

      opener.proxy.sendMessageFromPopup('PRE_TXN', 'PRE_TXN', {});
      sendSuccess = sendStatementRequest();
    }
    
    if (!sendSuccess){
      onCancelNext(preReqCount);
    }
  }
}

function onCancelNext(preReqCount){
  isProcessing = false;
  SetDataStore('reqCount', preReqCount);
  document.body.style.cursor = 'auto';
}

function goPrevPage(curPage) {
  if ( g_page_num > 1 && !isProcessing ) {
    isProcessing = true;
    curAction = ACTION_PREV;
    displayRecords();

  }
}

function initAccStmtResultHeader() {
  if ( g_page_num > 0 ) {
    $('stmtTable').style.height = '292px';
    $('accStmtSearchBox').style.display = 'none';
    $('accStmtResultButton').style.display = '';
  }
  else {
    $('stmtTable').style.height = '248px';
    $('accStmtSearchBox').style.display = 'block';
    $('accStmtResultButton').style.display = 'none';
  }

  $('saveDiv').innerHTML = get_display_lang('alt_save_tip');
  $('printDiv').innerHTML = get_display_lang('alt_print_tip');

  $('pic_close').src = get_image_lang('pic_close');
  $('pic_close').title = get_display_lang('alt_close');
  $('pic_search').src = get_image_lang('pic_search');
  $('pic_search').title = get_display_lang('alt_search');
  $('pic_print').src = get_image_lang('pic_print');
  $('pic_print').title = get_display_lang('alt_print');
  $('pic_save').src = get_image_lang('pic_save');
  $('pic_save').title = get_display_lang('alt_save');
  $('pic_help').title = get_display_lang('alt_pic_record_help');

  if ( g_page_num == 1 )
    $('pic_prev').src = get_image_lang('pic_prev_off');
  else
    $('pic_prev').src = get_image_lang('pic_prev');
  $('pic_prev').title = get_display_lang('alt_previous_page');

  if ( showNextPage )
    $('pic_next').src = get_image_lang('pic_next');
  else
    $('pic_next').src = get_image_lang('pic_next_off');
  $('pic_next').title = get_display_lang('alt_next_page');
}

function openSearchBox() {
  $('accStmtSearchBox').style.display = 'block';
  $('stmtTable').style.height = '218px';
}

// Support SSO
function processSSOExtendResult(msg) {
  if(ssoEnabled) {
    if (msg.sso_last_extend_status != undefined && msg.sso_last_extend_status != '') {
//      var command = "ReceiveAndProcessTicketExtendResults('" + GetDataStore('sso_last_extend_status') + "','" + GetDataStore('sso_last_extend_error') + "','" + GetDataStore('sso_check_return_status') + "','" + GetDataStore('sso_sign_in_level') + "','" + GetDataStore('sso_web_id') + "','" + GetDataStore('sso_guid') + "')";
//      opener.AsyncStart(function() {
//        opener.$post(command, opener.indexContext);
      //      });
      opener.proxy.sendMessageFromPopup('SSO', 'ReceiveAndProcessTicketExtendResults', {
        LastExtendStatus: msg.sso_last_extend_status,
        LastExtendError: msg.sso_last_extend_error,
        CheckStatus: msg.sso_check_return_status,
        SignInLevel: msg.sso_sign_in_level,
        SsoWebID: GetDataStore('sso_web_id'),
        SsoGUID: GetDataStore('sso_guid')
      });
    }
  }
}

//-->

function ChangeBetType()
{
	var obj=$('BetType');
	var temp_obj=$('TransType');
	if(obj.value=='4' || obj.value==bType4Autopay){
	    if(temp_obj.options.length > 1)
		    temp_obj.options.remove(0);
	}
	else
	{	
	    genTransTypeOptions(true);
	}
	
	genBetTypeOptions(false);
}

function ChangeTransType()
{
	var obj=$('TransType');
	var temp_obj=$('BetType');
	if(obj.value=='0'){
		temp_obj.options.remove(5);
		temp_obj.options.remove(3);
	}
	else if(obj.value=='1')
	{	
		genBetTypeOptions(true);
	}
	
	genTransTypeOptions(false);
}

function genBetTypeOptions(useDefault){
    var obj=$('BetType');
    var sel_idx = -1;
    if(obj.options.length == 0 || useDefault){
        sel_idx = 4;
    }else{
        if(obj.value == '3')
            sel_idx = 4;
        else if(obj.value == '4')   
            sel_idx = 3;            
        else
            sel_idx = obj.value;
    }

    obj.options[0] = new Option(get_display_lang('alt_transaction_type_horse'), '0');
    obj.options[1] = new Option(get_display_lang('alt_transaction_type_sb'), '1');
    obj.options[2] = new Option(get_display_lang('alt_transaction_type_mk6'), '2');                            
    obj.options[3] = new Option(get_display_lang('alt_transaction_type_others'), '4');
    obj.options[4] = new Option(get_display_lang('alt_transaction_type_all'), '3');
    if(IsEnabledDDA)
        obj.options[5] = new Option(get_display_lang('alt_transaction_type_autopay'), bType4Autopay);    
    
    obj.options[sel_idx].selected = true;
}

function genTransTypeOptions(useDefault){
    var obj=$('TransType');
    var sel_idx = -1;
    if(obj.options.length == 0 || useDefault){
        sel_idx = 1;
    }else{
        sel_idx = obj.value;
    }
    
    obj.options[0] = new Option(get_display_lang('alt_display_type_dividend'), '0');
    obj.options[1] = new Option(get_display_lang('alt_display_type_all'), '1');    
    
    obj.options[sel_idx].selected = true;
}

function exportClicked(){
    // send statement export WA tagging  
    opener.WATrack('stmtExport');
}

function displayExportWarningMsg() {
  alert(get_display_lang("export_not_support"));
}

function sendExtendSessionRequest() {
  popupSvc.sendReq('SESSION_ExtendSession',
    {      
      acc: GetDataStore('account')
    }, ProcessExtendSessionResult,
      ProcessExtendSessionFail,
      replyTimeoutInSec
    );
}

function ProcessExtendSessionResult() {
}

function ProcessExtendSessionFail() {
}