var stmt_export = {};

stmt_export.LANG = {
  EN : "en",
  CH : "ch"
};

stmt_export.TYPE = {
  TXT : "txt",
  HTML : "html"
};

stmt_export.BETTYPE = {
  RACING : "0",
  FOOTBALL : "1",
  MARKSIX : "2",
  ALL : "3",
  OTHERS : "4",
  DDA : "5"
};

// Define the constant message in English and Chinese
stmt_export.LOCALE = {
  EN: {
    alt_ac_records: "Account Records",
    alt_download: "Download version for reference only",
    alt_from: "From",
    alt_to: "To",
    alt_account_no: "Account No.: ",
    alt_balance: "Balance: ",
    alt_end: "- End -",
    alt_acctstmt_ref_no: "Ref No",
    alt_acctstmt_date_time: "Date/Time",
    alt_acctstmt_autopay_records: "Autopay Deposit Records",
    alt_acctstmt_amount: "Amount",
    alt_acctstmt_race_day: "Race Day",
    alt_acctstmt_bet_type: "Bet Type",
    alt_acctstmt_transaction_details: "Transaction Details",
    alt_acctstmt_debit: "Debit",
    alt_acctstmt_credit: "Credit",
    max_payout: "Maximum  Payout: ",
    alt_transaction_cancel: "(CANCELLED)",
    alt_overflow: "OVERFLOW",
    alt_unsuccessful: "UNSUCCESSFUL",
    acctstmt_autopay_reject_msg: "Autopay Deposit ##AMOUNT## unsuccessful (Reject Code: ##REJ_CODE## &nbsp;&nbsp;&nbsp; Ref No. ##REF_NO##)",
    acctstmt_autopay_request_msg: "Autopay Deposit Instruction ##AMOUNT## sent to bank (Ref No. ##REF_NO##)",
    acctstmt_autopay_accept_msg: "Autopay Deposit ##AMOUNT## successful (Ref No. ##REF_NO##)",
    acctstmt_autopay_pending_msg: "Autopay Deposit Instruction ##AMOUNT## sent to bank (Ref No. ##REF_NO##)"
  },

  CH: {
    alt_ac_records: "戶口紀錄",
    alt_download: "下載版只供參考",
    alt_from: "由",
    alt_to: "至",
    alt_account_no: "投注戶口: ",
    alt_balance: "結餘: ",
    alt_end: "- 完 -",
    alt_acctstmt_ref_no: "交易編號",
    alt_acctstmt_date_time: "日期/時間",
    alt_acctstmt_autopay_records: "自動轉賬存款紀錄",
    alt_acctstmt_amount: "金額",
    alt_acctstmt_race_day: "賽事日",
    alt_acctstmt_bet_type: "投注類別",
    alt_acctstmt_transaction_details: "細節",
    alt_acctstmt_debit: "支出",
    alt_acctstmt_credit: "存入",
    max_payout: "注項最高派彩: ",
    alt_transaction_cancel: "(交易取消)",
    alt_overflow: "超額彩金",
    alt_unsuccessful: "交易失敗",
    acctstmt_autopay_reject_msg: "自動轉賬存款 ##AMOUNT## 未被接納 (取消編號: ##REJ_CODE## &nbsp;&nbsp;&nbsp; 參考編號: ##REF_NO##)",
    acctstmt_autopay_request_msg: "自動轉賬存款指令 ##AMOUNT## 已傳送至銀行 (參考編號: ##REF_NO##)",
    acctstmt_autopay_accept_msg: "自動轉賬存款 ##AMOUNT## 接納 (參考編號: ##REF_NO##)",
    acctstmt_autopay_pending_msg: "自動轉賬存款指令 ##AMOUNT## 已傳送至銀行 (參考編號: ##REF_NO##)"
  }
};


// END Of Defining the constant message

// Define style classes
stmt_export.STYLECLASS = ["tableContent5", "tableContent6"];
// End of defining style classes

stmt_export.getBlob = function(options) {
  var builder = new stmt_export.FileBuilder(options);
  var content = builder.genContent();

  var mimeType = "text/plain;charset=UTF-8";

  if (options.export_type == "html") {
    // mimeType = "text/html;charset=UTF-8";
    mimeType = "text/html";
  }

  // var myBlob = new Blob([content], { type: "application/octet-stream" });
  var myBlob = new Blob([content], { type: mimeType });

  //var blobURL = window.URL.createObjectURL(myBlob);

  // window.location.href = blobURL;

  // window.open(blobURL, "_blank", "scrollbars=yes, resizable=yes");

  // return blobURL;

  return myBlob;
};

stmt_export.FileBuilder = function(options) {
  this.lang = options.lang || stmt_export.LANG.EN;
  this.type = options.export_type || stmt_export.TYPE.TXT;

  this.g_page_num = options.g_page_num || 0;
  this.g_max_page_num = options.g_max_page_num || 0;
  this.g_record_per_page = options.g_record_per_page || 0;
  this.account = options.account || "";
  this.is_last_page = false;
  
  if (options.is_last_page) {
    var isLastFlag = options.is_last_page.toLowerCase();
    
    if (isLastFlag == "true") {
      this.is_last_page = true;
    } else {
      this.is_last_page = false;
    }
  } else {
    this.is_last_page = false;
  }

  this.stmt_startDate = options.stmt_startDate || "";
  this.stmt_endDate = options.stmt_endDate || "";

  this.sessionData = options.session;
  this.betType = options.session.betType;
  this.balance = options.session.balance;
  this.statement = options.session.statement;

  return this;
};


// Generate the whole file content
stmt_export.FileBuilder.prototype.genContent = function() {
  if (this.betType && this.balance && this.statement) {

    if (this.type == stmt_export.TYPE.HTML) {
      return this.genContentHTML();
    } else {
      return this.genContentTXT();
    }
  } else {
    return "";
  }

};

stmt_export.FileBuilder.prototype.genContentHTML = function() {
  var content = "";

  content += "<html>";
  content += "<head><title>Account Records ";
  content += moment().format('DD-MM-YYYY HH:mm:ss');
  content += "</title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></HEAD>";

  content += "<style type=\"text/css\">\n";
  content += ".content { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; }\n";
  content += ".tableContentHead { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; padding:5px 1px 5px 1px; background-color:#FFFFFF; border-bottom:1px solid #CCCCCC; border-top:1px solid #CCCCCC; }\n";
  content += ".tableContent5 { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; border-right:#FFFFFF 1px solid; padding:3px 1px 3px 1px; background-color:#FFFFFF; }\n";
  content += ".tableContent6 { font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 12px; color: #333333; line-height: 15px; text-decoration: none; border-right:#FFFFFF 1px solid; padding:3px 1px 3px 1px; background-color:#F5F5F5; }\n";
  content += "</style>";
  content += "<body oncontextmenu=\"return false\" leftMargin=\"14\" topMargin=\"0\">";

  content += this.genPrintHeader();
  
  content += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
  
  content += this.genTableHeader();

  content += this.genTableRecords();

  content += this.genPrintFooter();

  content += "</table>";

  content += "</body></html>";

  return content;
};

stmt_export.FileBuilder.prototype.genContentTXT = function() {
  var content = "";

  content += this.genPrintHeader();
  content += this.genTableHeader();
  content += this.genTableRecords();
  content += this.genPrintFooter();

  return content;

};


// Generate the header
stmt_export.FileBuilder.prototype.genPrintHeader = function() {
  if (this.type == stmt_export.TYPE.HTML) {
    return this.genPrintHeaderHTML();
  } else {
    return this.genPrintHeaderTXT();
  }
};

stmt_export.FileBuilder.prototype.genPrintHeaderHTML = function() {
  var header = "";
  
  header += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
  header += "<tr><td class=\"content\">";
  header += this.getString("alt_ac_records");
  header += " - ";
  header += this.getString("alt_download");
  header += "</td>";
  header += "<td align=\"right\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
  header += "<tr><td class=\"content\" style=\"padding-right:20px;\">";
  header += this.getString("alt_from");
  header += " ";
  header += this.stmt_startDate;
  header += " ";
  header += this.getString("alt_to");
  header += " ";
  header += this.stmt_endDate;
  header += "</td>";
  header += "<td class=\"content\" style=\"padding-right:20px;\">";
  header += this.getString("alt_account_no");
  header += " ";
  header += this.account;
  header += "</td>";
  header += "<td class=\"content\">";
  header += this.getString("alt_balance");
  header += " ";
  header += this.formatNoToCurrency(this.balance);
  header += "</td>";
  header += "</tr></table></td></tr></table>";
  return header;
  
};

stmt_export.FileBuilder.prototype.genPrintHeaderTXT = function() {
  var header = "";

  header += this.getString("alt_ac_records");
  header += " - ";
  header += this.getString("alt_download");
  header += "\r\n";
  header += this.getString("alt_from");
  header += " ";
  header += this.stmt_startDate;
  header += " ";
  header += this.getString("alt_to");
  header += " ";
  header += this.stmt_endDate;
  header += "\r\n";
  header += this.getString("alt_account_no");
  header + " "
  header += this.account;
  header += "\r\n";
  header += this.getString("alt_balance");
  header += " ";
  header += this.formatNoToCurrency(this.balance);
  header += "\r\n\r\n";

  return header;
};

// Generate the footer
stmt_export.FileBuilder.prototype.genPrintFooter = function() {
  if (this.type == stmt_export.TYPE.HTML) {
    return this.genPrintFooterHTML();
  } else {
    return this.genPrintFooterTXT();
  }
};

stmt_export.FileBuilder.prototype.genPrintFooterHTML = function() {
  var str = "";
  str += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
  str += "<tr><td align=\"center\" class=\"content\">";
  str += this.getString("alt_end");
  str += "</td></tr></table>";
  return str
};

stmt_export.FileBuilder.prototype.genPrintFooterTXT = function() {
  var str = "";
  str += this.getString("alt_end");
  return str;
};

// Generate record table header
stmt_export.FileBuilder.prototype.genTableHeader = function() {
  if (this.type == stmt_export.TYPE.HTML) {
    return this.genTableHeaderHTML();
  } else {
    return this.genTableHeaderTXT();
  }

};

stmt_export.FileBuilder.prototype.genTableHeaderHTML = function() {
  var str = "";

  str += "<tr>";

  if (this.betType != stmt_export.BETTYPE.DDA) {
    str += "<td width=\"8%\" align=\"center\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_ref_no");
    str += "</td>";
  }

  str += "<td width=\"8%\" align=\"center\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
  str += this.getString("alt_acctstmt_date_time");
  str += "</td>";

  if (this.betType != stmt_export.BETTYPE.DDA) {
    str += "<td width=\"11%\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_race_day");
    str += "</td>";

    str += "<td width=\"8%\" class=\"tableContentHead\" style=\"white-space:nowrap\">"
    str += this.getString("alt_acctstmt_bet_type");
    str += "</td>";

    str += "<td width=\"330\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_transaction_details");
    str += "</td>";

    str += "<td width=\"10%\" align=\"right\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_debit");
    str += "</td>";

    str += "<td width=\"10%\" align=\"right\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_credit");
    str += "</td>";

  } else {
    str += "<td width=\"*\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_autopay_records");
    str += "</td>";

    str += "<td width=\"10%\" align=\"right\" class=\"tableContentHead\" style=\"white-space:nowrap\">";
    str += this.getString("alt_acctstmt_amount");
    str += "</td>";
  }

  str += "<td class=\"tableContentHead\" style=\"WIDTH:16px;PADDING-RIGHT:0px;PADDING-LEFT:0px;PADDING-BOTTOM:0px;PADDING-TOP:0px\"><img src=\"images/spacer.gif\" width=\"16\" height=\"1\"></td>";
  str += "</tr>";

  return str;

};

stmt_export.FileBuilder.prototype.genTableHeaderTXT = function() {
  var str = "";

  if (this.betType != stmt_export.BETTYPE.DDA) {
    str += this.getString("alt_acctstmt_ref_no");
    str += "\r\n";
  }

  str += this.getString("alt_acctstmt_date_time");
  str += "\r\n";

  if (this.betType == stmt_export.BETTYPE.DDA) {
    str += this.getString("alt_acctstmt_autopay_records");
    str += "\r\n";
    str += this.getString("alt_acctstmt_amount");
    str += "\r\n****************************************\r\n";
  } else {
    str += this.getString("alt_acctstmt_race_day");
    str += "\r\n";
    str += this.getString("alt_acctstmt_bet_type");
    str += "\r\n";
    str += this.getString("alt_acctstmt_transaction_details");
    str += "\r\n";
    str += this.getString("alt_acctstmt_debit");
    str += "\r\n";
    str += this.getString("alt_acctstmt_credit");
    str += "\r\n****************************************\r\n";
  }

  return str;

};

// Generate the record tale
stmt_export.FileBuilder.prototype.genTableRecords = function() {

  if (this.type == stmt_export.TYPE.HTML) {
    return this.genTableRecordsHTML();
  } else {
    return this.genTableRecordsTXT();
  }
};

stmt_export.FileBuilder.prototype.genTableRecordsHTML = function() {
  var startPageNo = 1;
  var endPageNo = this.g_max_page_num;

  if (this.g_max_page_num == this.g_page_num && this.is_last_page) {
    startPageNo = 1;
    endPageNo = this.g_max_page_num;
  } else {
    startPageNo = this.g_page_num;
    endPageNo = this.g_page_num;
  }

  if (this.betType != stmt_export.BETTYPE.DDA) {
    return this.genTableRecordsNorHTML(startPageNo, endPageNo);
  } else {
    return this.genTableRecordsAutoPayHTML(startPageNo, endPageNo);
  }

};

stmt_export.FileBuilder.prototype.genTableRecordsNorHTML = function(startPageNo, endPageNo) {
  var str = ""
  var statDtls = this.statement;

  var statArray = statDtls.split("@@@"); // first item should be empty string
  
  var startIdx = ((startPageNo - 1) * this.g_record_per_page) + 1;
  var endIdx = endPageNo * this.g_record_per_page;

  for (var i = startIdx; i <= endIdx; i++) {
    if (statArray.length <= i) {
      break;
    }

    str += this.genSingleTableRecord(statArray[i], i);
  }

  return str;
};

stmt_export.FileBuilder.prototype.genTableRecordsAutoPayHTML = function(startPageNo, endPageNo) {
  var str = ""
  var statDtls = this.statement;

  var statArray = statDtls.split("@@@"); // first item should be empty string
  
  var startIdx = ((startPageNo - 1) * this.g_record_per_page) + 1;
  var endIdx = endPageNo * this.g_record_per_page;

  for (var i = startIdx; i <= endIdx; i++) {
    if (statArray.length <= i) {
      break;
    }

    str += this.genSingleTableRecord(statArray[i], i);
  }

  return str;
};

stmt_export.FileBuilder.prototype.genTableRecordsTXT = function() {

  var startPageNo = 1;
  var endPageNo = this.g_max_page_num;
  
  if (this.g_max_page_num == this.g_page_num && this.is_last_page ) {
    startPageNo = 1;
    endPageNo = this.g_max_page_num;
  } else {
    startPageNo = this.g_page_num;
    endPageNo = this.g_page_num;
  }

  if (this.betType != stmt_export.BETTYPE.DDA) {
    return this.genTableRecordsNorTXT(startPageNo, endPageNo);
  } else {
    return this.genTableRecordsAutoPayTXT(startPageNo, endPageNo);
  }
};

stmt_export.FileBuilder.prototype.genTableRecordsAutoPayTXT = function(startPageNo, endPageNo) {
  var str = ""
  var statDtls = this.statement;

  var statArray = statDtls.split("@@@"); // first item should be empty string

  var startIdx = ((startPageNo - 1) * this.g_record_per_page) + 1;
  var endIdx = endPageNo * this.g_record_per_page;

  for (var i = startIdx; i <= endIdx; i++) {
    if (statArray.length <= i) {
      break;
    }

    str += this.genSingleTableRecord(statArray[i], i);
  }

  return str;

  
  
};

stmt_export.FileBuilder.prototype.genTableRecordsNorTXT = function(startPageNo, endPageNo) {
  var str = ""
  var statDtls = this.statement;

  var statArray = statDtls.split("@@@"); // first item should be empty string

  var startIdx = ((startPageNo - 1) * this.g_record_per_page) + 1;
  var endIdx = endPageNo * this.g_record_per_page;

  for (var i = startIdx; i <= endIdx; i++) {
    if (statArray.length <= i) {
      break;
    }

    str += this.genSingleTableRecord(statArray[i], i);
  }

  return str;

};


// generate the single table record row

stmt_export.FileBuilder.prototype.genSingleTableRecord = function(statDtl, index) {
  if (this.type == stmt_export.TYPE.HTML) {
    if (this.betType != stmt_export.BETTYPE.DDA) {
      return this.genSingleTableRecordNorHTML(statDtl, index);
    } else {
      return this.genSingleTableRecordAutoPayHTML(statDtl, index);
    }
  } else {
    if (this.betType != stmt_export.BETTYPE.DDA) {
      return this.genSingleTableRecordNorTXT(statDtl, index);
    } else {
      return this.genSingleTableRecordAutoPayTXT(statDtl, index);
    }
  }
};

stmt_export.FileBuilder.prototype.genSingleTableRecordNorTXT = function(statDtl, index) {
  var str = "";

  var dtlsArr = statDtl.split(";;;");

  if (dtlsArr.length < 9) {
    return "";
  }

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

  if (txnNo == "") {
    return "";
  }

  var str_maxpay = "";

  if (txnDtls.indexOf("MAX PAY") > 0) {
    str_maxpay = txnDtls.substring(txnDtls.indexOf("MAX PAY"));
    str_maxpay = str_maxpay.substring(str_maxpay.indexOf("$"));
    txnDtls = txnDtls.substr(0, (txnDtls.indexOf("MAX PAY") - 1));
  }

  var dateTime = txnDate + " " + txnTime;

  str += txnNo;
  str += "\r\n";
  str += dateTime;
  str += "\r\n";
  var raceDayStr = raceDay.replace(/<br>/g, "\r\n");
  raceDayStr = raceDayStr.replace(/&nbsp;/g, " ");
  str += raceDayStr;
  str += "\r\n";
  var betTypeStr = betType.replace(/<br>/g, "\r\n");
  betTypeStr = betTypeStr.replace(/&nbsp;/g, " ");
  str += betTypeStr;
  str += "\r\n";
  var txnDtlsStr = txnDtls.replace(/<br>/g, "\r\n");
  txnDtlsStr = txnDtlsStr.replace(/&nbsp;/g, " ");
  str += txnDtlsStr;

  if (str_maxpay != "") {
    str += this.getString("max_payout");
    str += str_maxpay;
  }

  if (txnFlag == "1") {
    str += this.getString("alt_transaction_cancel");
  }

  str += "\r\n";
  str += this.formatDebitTD(index, txnFlag, debit, true);

  str += "\r\n";

  str += this.formatCreditTD(index, txnType, txnFlag, debit, credit, true);

  str += "\r\n****************************************\r\n";

  return str;

};

stmt_export.FileBuilder.prototype.genSingleTableRecordAutoPayTXT = function(statDtl, index) {
  var str = "";
  
  var dtlsArr = statDtl.split(";;;");
  if ( dtlsArr.length < 6 )
    return "";
    
  var txnType = dtlsArr[0];  
  var txnDate = dtlsArr[1];
  var txnTime = dtlsArr[2];
  var txnAmount = dtlsArr[3];
  var refNo = dtlsArr[4];
  var txnRejMsg = dtlsArr[5];

  var dateTime = txnDate + ' ' + txnTime;
  var fmtTxnAmt = this.formatNoToCurrency(txnAmount);
  var msg = this.formatAutopayMsg(txnType, refNo, fmtTxnAmt, txnRejMsg);

  str += dateTime;
  str += "\r\n";
  str += msg.replace(/<br>/g,"\r\n").replace(/&nbsp;/g, " "); 
  str += "\r\n";
  str += this.formatAutopayAmtCol(txnType, txnAmount);
  str += "\r\n";
    
  str += "\r\n****************************************\r\n";

  return str;
};

stmt_export.FileBuilder.prototype.genSingleTableRecordNorHTML = function(statDtl, index) {

  var str = "";

  var dtlsArr = statDtl.split(";;;");

  if (dtlsArr.length < 9)
    return "";

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

  if (txnNo == "")
    return "";

  var str_maxpay = "";
  if (txnDtls.indexOf("MAX PAY") > 0) {
    str_maxpay = txnDtls.substring(txnDtls.indexOf("MAX PAY"));
    str_maxpay = str_maxpay.substring(str_maxpay.indexOf("$"));
    txnDtls = txnDtls.substring(0, txnDtls.indexOf("MAX PAY") - 1);
  }

  var dateTime = "<span style=\"white-space:nowrap\">" + txnDate + "</sapn><br>" + txnTime;

  str += "<tr>";
  str += "<td width=\"8%\" valign=\"top\" class=\"";
  str += stmt_export.STYLECLASS[index % 2];
  str += "\">";
  str += txnNo;
  str += "</td>";
  str += "<td width=\"8%\" valign=\"top\" class=\"";
  str += stmt_export.STYLECLASS[index % 2];
  str += "\">";
  str += dateTime;
  str += "</td>";
  str += "<td width=\"11%\" valign=\"top\" class=\"";
  str += stmt_export.STYLECLASS[index % 2];
  str += "\">";
  str += raceDay;
  str += "</td>";
  str += "<td width=\"8%\" valign=\"top\" class=\"";
  str += stmt_export.STYLECLASS[index % 2];
  str += "\">";
  str += betType;
  str += "</td>";
  str += "<td width=\"330\" valign=\"top\" class=\"";
  str += stmt_export.STYLECLASS[index % 2];
  str += "\">";
  str += txnDtls;

  if (str_maxpay != "") {
    str += this.getString("max_payout");
    str += str_maxpay;
  }

  if (txnFlag == "1") {
    str += this.getString("alt_transaction_cancel");
  }

  str += "</td>";

  str += this.formatDebitTD(index, txnFlag, debit);

  str += this.formatCreditTD(index, txnType, txnFlag, debit, credit);

  str += "</tr>"

  return str;
};

stmt_export.FileBuilder.prototype.genSingleTableRecordAutoPayHTML = function(statDtl, index) {
  var dtlsArr = statDtl.split(";;;");
  if ( dtlsArr.length < 6 )
    return "";
  
  var txnType = dtlsArr[0];  
  var txnDate = dtlsArr[1];
  var txnTime = dtlsArr[2];
  var txnAmount = dtlsArr[3];
  var refNo = dtlsArr[4];
  var txnRejMsg = dtlsArr[5];
  
  
  var str = "";

  var fmtTxnAmt = this.formatNoToCurrency(txnAmount);
  var msg = this.formatAutopayMsg(txnType, refNo, fmtTxnAmt, txnRejMsg);
  var dateTime = "<span style=\"white-space:nowrap\">" + txnDate + "</sapn><br>" + txnTime;

  str += "<tr>";
  str += "<td width=\"8%\" valign=\"top\" style=\"padding:3px 8px;\" class=\"";
  str += stmt_export.STYLECLASS[index % 2]; 
  str += "\">";
  str += dateTime; 
  str += "</td>";
  str += "<td width=\"440\" valign=\"top\" class=\"";
  str += stmt_export.STYLECLASS[index % 2];
  str += "\">";
  str += msg;
  str += "</td>";                  
  str += this.writeTD(index, this.formatAutopayAmtCol(txnType, txnAmount));	

  str += "</tr>";

  return str;
};



// Get localed messages
stmt_export.FileBuilder.prototype.getString = function(key) {
  if (this.lang == stmt_export.LANG.EN) {
    return stmt_export.LOCALE.EN[key] || "";
  } else {
    return stmt_export.LOCALE.CH[key] || "";
  }
};

// Format number to currency
stmt_export.FileBuilder.prototype.formatNoToCurrency = function(inval) {
  if (inval.toUpperCase() == "NA" || inval.toUpperCase() == "N/A") {
    return inval;
  }

  var val = inval;
  val = val.replace(/\$/g, "");
  val = val.replace(/,/g, "");

  return "$" + this.currencyFormatted(parseFloat(val));
};

// Format currency (0 padding at the end)
stmt_export.FileBuilder.prototype.currencyFormatted = function(amount) {
  var number = "0.0";
  
  var number = Math.round(amount * 100) / 100;
  
  if (isNaN(amount)) {
    return number;
  }
  
  number = number.toString();
  
  if (number.indexOf('.') <= 0) {
    number += ".00";
  } else if (number.indexOf('.') == (number.length - 2)) {
    number += "0";
  };
  
  number = number.replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return number;
};

//
stmt_export.FileBuilder.prototype.formatDebitTD = function(idx, txnFlag, debit, isTxt) {
  var str = "";
  if (txnFlag == "2") {
    str = this.getString("alt_overflow");
  } else if (txnFlag == "4") {
    str = this.getString("alt_unsuccessful");
  } else if (debit == "$") {
    str = (isTxt ? " " : "&nbsp;");
  }

  if ( str!="" && (debit=="$" || debit=="$0.00" || debit=="$0" ))
    return (isTxt ? str : this.writeTD(idx, str, ""));
  else {
    if( debit[debit.length-1] == '-' )
      debit = "-" + debit.substr(0, debit.length - 1);

      debit = this.formatNoToCurrency(debit);

      return (isTxt ? debit : this.writeTD(idx, debit, ""));
  }

};

stmt_export.FileBuilder.prototype.formatCreditTD = function(idx, txnType, txnFlag, debit, credit, isTxt) {
  var str = "";

  if (txnFlag == "2")
    str = this.getString("alt_overflow");
  else if (txnFlag == "4")
    str = this.getString("alt_unsuccessful");
  else if (credit == "$")
    str = isTxt ? " " : "&nbsp;";

  if (str != "" && (credit == "$" || credit == "$0.00" || credit == "$0"))
    return (isTxt ? str : this.writeTD(idx, str, "#000000"));
  else {
    if (credit[credit.length - 1] == '-')
      credit = "-" + credit.substr(0, credit.length - 1);

    credit = this.formatNoToCurrency(credit);

    if (txnType == "A8")
      return (isTxt ? credit : this.writeTD(idx, credit, "#008800"));
    else if (debit != "$" && credit != "$")
      return (isTxt ? credit : this.writeTD(idx, credit, "#008800"));
    else
      return (isTxt ? credit : this.writeTD(idx, credit, ""));
  }
};

stmt_export.FileBuilder.prototype.formatAutopayMsg = function(txnType, refNo, txnAmount, txnRejMsg) {
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
    return this.getString(msgTemplate).replace(/##AMOUNT##/g, txnAmount).replace(/##REF_NO##/g, refNo).replace(/##REJ_CODE##/g, txnRejMsg);
  }else{
    return "";
  }  
};

stmt_export.FileBuilder.prototype.formatAutopayAmtCol = function(txnType, txnAmt) {
  var fmtAmt = "0";  //use 0 for non-success txn
  if(txnType == "Success"){
    fmtAmt = txnAmt;       
  }
  return  this.formatNoToCurrency(fmtAmt);  
};

stmt_export.FileBuilder.prototype.writeTD = function(idx, msg, color) {
  var str = "";

  if (color == "") {
    str += "<td width=\"10%\" align=\"right\" valign=\"top\" class=\"";
    str += stmt_export.STYLECLASS[idx % 2];
    str += "\" style=\"white-space:nowrap\">";
    str += msg;
    str += "</td>";
  } else {
    str += "<td width=\"10%\" align=\"right\" valign=\"top\" class=\"";
    str += stmt_export.STYLECLASS[idx % 2];
    str += "\" style=\"color:";
    str += color;
    str += ";white-space:nowrap\">";
    str += msg;
    str += "</td>";
  }
  
  return str;
};
