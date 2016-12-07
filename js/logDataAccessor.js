var logDataAccessor = {
  Init: function() {
    sessionStorage.removeItem('currentSessionRecords');
    sessionStorage.removeItem('enablePPSEnquiry');
    sessionStorage.removeItem('refNos');
  },
  LogRecord: function(reply, totalBetlines, betlines) {
    //used only in SlipBetPreview.aspx
    //reply = [@@@status|||[txnNo|err]|||amount|||maxpay|||flexibet] x N  

    var replyArr = reply.split('@@@');
    if (replyArr.length <= 1)
      return;

    var buf = new StringBuffer();
    for (var j = 0; j < totalBetlines; j++) {
      // create @@@status|||[txnNo|err]|||betType|||betDetails|||leagueCode|||amount
      var dataArr = replyArr[j + 1].split('|||');
      var status = (dataArr[0] == '' || dataArr[0] == ' ') ? 'UNKNOWN' : dataArr[0];
      var txnNo = (status == 'UNKNOWN') ? GetError("901") : dataArr[1];
      var amount = dataArr[2];
      var maxpay = dataArr[3];
      var flexibet = dataArr[4];
      var unitbet = this.FormatCurrency(betlines[j].unitBet);
      var bettype = this.GetDispBetType(betlines[j].type, betlines[j].match, betlines[j].typeDescription);
      var betline = betlines[j].betline;
      var betdetail = betlines[j].description;
      var leagueCode = (betlines[j].league == undefined || betlines[j].league == null) ? '' : betlines[j].league;

      if (betlines[j].m6UnitBetAmountType == 0)
        betdetail += ' (' + GetText('m6unit_name') + ')';

      if (betlines[j].betMethod == 1) {

        var flexiComb = flexibet.split('/');
        if (flexiComb.length > 1)
          betdetail += '<br>' + this.FormatCurrency(flexiComb[0]) + '/' + flexiComb[1];
        else
          betdetail += '<br>';
        var flexiStr = ' (' + GetText('flexibet_name') + ')';
        if (betdetail.indexOf(flexiStr) < 0)
          betdetail += flexiStr;
        if (amount == '')
          amount = betlines[j].unitBet;
      }
      else {
        betdetail += '<br>' + unitbet;

        if (amount == '' && status != 'REJECTED')
          amount = betlines[j].unitBet * betlines[j].numOfSelection;
      }

      if (maxpay != '')
        betdetail += '<br>' + GetText('max_payout') + '&nbsp;' + this.FormatCurrency(maxpay);

      //amount = amount.toString(10);
      //amount = FormatCurrency(amount);

      buf.append('@@@').append(status);
      buf.append('|||').append(txnNo);
      buf.append('|||').append(bettype);
      buf.append('|||').append(betdetail);
      buf.append('|||').append(leagueCode);
      buf.append('|||').append(amount);
    }

    var records = GetDataStore('currentSessionRecords');
    if (records == null)
      records = '';
    SetDataStore('currentSessionRecords', records + buf.toString());
  },
  LogEFTRecord: function(reply) {
    // balance@@@status|||[txnNo|err]|||betType|||betDetails|||leagueCode|||amount
    var replyStr = reply.split('@@@');
    var newBal = replyStr[0];
    if (newBal != '') {
      SetDataStore("balance", newBal);
      proxy.sendMessageFromPopup('REFRESH_BAL', 'RefreshAccBal', { ForceRefresh: 'true' });         
    }
    var records = GetDataStore('currentSessionRecords');
    if (records == null)
      records = '';
    var recordCount = records.split('@@@').length;
    SetDataStore('currentSessionRecords', records + '@@@' + replyStr[1]);
    return recordCount;
  },

  UpdateEFTRecord: function(digitalOrder, reply, ppsEnquire) {
    if (this.isBlankString(digitalOrder))
      return this.LogEFTRecord(reply);

    var replyStr = reply.split('@@@');
    var newBal = replyStr[0];
    if (newBal != '') {
      SetDataStore("balance", newBal);
      proxy.sendMessageFromPopup('REFRESH_BAL', 'RefreshAccBal', { ForceRefresh: 'true' });      
    }
    var records = GetDataStore('currentSessionRecords');
    var recordArr = records.split('@@@');
    var i = 0;
    for (i = 0; i < recordArr.length; i++) {
      if (recordArr[i].indexOf(digitalOrder) >= 0) {
        recordArr[i] = replyStr[1];
        break;
      }
    }
    if (i == recordArr.length)
      this.LogEFTRecord(reply);
    else {
      SetDataStore('currentSessionRecords', recordArr.join('@@@'));
    }

    if (ppsEnquire == 1) {
      SetDataStore('refNos', GetDataStore('refNos') + ',' + digitalOrder);
      SetDataStore('enablePPSEnquiry', '1');
    }
  },
  FormatCurrency: function(amount) {
    if (isNaN(amount)) {
      return amount;
    }
    return "$ " + this.CommaFormatted(this.CurrencyFormatted(amount));
  },
  GetDispBetType: function(betType, match, typeDescription) {
    if (betType.indexOf("ALUP") < 0) {
      if (this.isCWinPool(betType) && typeDescription) {
        return GetText(betType) + " (" + typeDescription + ")";
      }
      return GetText(betType);
    }

    var isXPool = false;
    var last_type = "";
    var dummy = betType.split("|");
    var dummy2 = match.split("|");
    var sub_types = "";
    var typeDescriptions = [];
    if (typeDescription)
    	typeDescriptions = typeDescription.split(";;");
    for (var i = 1; i < dummy.length; i++) {
      if (i == 1) {
        last_type = dummy[i];
      } else if (last_type != dummy[i] && !(this.isCWinPool(last_type) && this.isCWinPool(dummy[i]))) {
        isXPool = true;
      }
      sub_types += "<BR>" + GetText(dummy[i]);
      if (typeDescriptions[i - 1])
      	sub_types += " (" + typeDescriptions[i - 1] + ")";
    }

    if (!isXPool) {
      // Special case for handling cwin allup case
      if ($j.inArray(dummy[1], ["CWA", "CWB", "CWC"]) >= 0) {
    	if (GetLanguage() == cLangENG) {
    	  return (GetText("txt_ALUP") + " " + GetText("CW") + " " + dummy[0].substring(5) + sub_types);
    	} else {
    	  return (GetText("CW") + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
    	}
      }

      if (GetLanguage() == cLangENG) {
        return (GetText("txt_ALUP") + " " + GetText(dummy[1]) + " " + dummy[0].substring(5));
      } else {
        return (GetText(dummy[1]) + GetText("txt_ALUP") + " " + dummy[0].substring(5));
      }
    }
    if (GetLanguage() == cLangENG) {
      return (GetText("txt_cross_pool") + " " + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
    }
    return (GetText("txt_cross_pool") + GetText("txt_ALUP") + " " + dummy[0].substring(5) + sub_types);
  },
  CommaFormatted: function(amount) {
    var delimiter = ","; // replace comma if desired
    var a = amount.split('.', 2)
    var d = a[1];
    var i = parseInt(a[0]);
    if (isNaN(i)) { return ''; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    var n = new String(i);
    var a = [];
    while (n.length > 3) {
      var nn = n.substr(n.length - 3);
      a.unshift(nn);
      n = n.substr(0, n.length - 3);
    }
    if (n.length > 0) { a.unshift(n); }
    n = a.join(delimiter);
    if (d.length < 1) { amount = n; }
    else { amount = n + '.' + d; }
    amount = minus + amount;
    return amount;
  },
  CurrencyFormatted: function(amount) {
    var i = parseFloat(amount);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    s = new String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;
    return s;
  },
  isBlankString: function(str) {
    return (!str || /^\s*$/.test(str));
  },
  isCWinPool: function(betType) {
	if ($j.inArray(betType, ["CWA", "CWB", "CWC"]) >= 0) {
      return true;
    }
    return false;
  }
}