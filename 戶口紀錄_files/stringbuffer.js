// ****************************
// Block backspace onKeyDown
// ***************************
function onKeyDown(evt) {
  var event = window.event || evt;
  var srcElement = event.srcElement ? event.srcElement : event.target;
  var isIEFlag = (navigator.appVersion.indexOf('MSIE') >= 0);
  try {
    if (event.altKey && event.keyCode == 37) { // Alt + LeftArrow (history go back)
      if (isIEFlag) {
        event.keyCode = 0;
        event.returnValue = false;
      }
      return false;
    } else if (event.keyCode == 13) { // Enter
      if (isIEFlag) {
        event.keyCode = 0;
        event.returnValue = false;
      }
      return false;
    } else if ((event.altKey) || // Alt (select IE menu)

				((event.keyCode == 8) && // Backspace (history go back, backspace allowed only when inputing values)
					(srcElement.type != "text" &&
					srcElement.type != "textarea" &&
					srcElement.type != "password")
				) ||

				((event.keyCode == 27) && // Escape (stop downloading a page, Escape allowed only when inputing values)
					(srcElement.type != "text" &&
					srcElement.type != "textarea" &&
					srcElement.type != "password")
				) ||

				((event.ctrlKey) &&
					((event.keyCode == 78) || // Ctl + N (new a window)
					(event.keyCode == 82) // Ctrl + R (page refresh)
					)
				) ||

				(event.keyCode == 116) || // F5 (page refresh)

				(event.keyCode == 18) // Alt (select IE menu)

        || ((event.keyCode == 9) && (srcElement.type != "text" &&
					srcElement.type != "password"))// Tab
				) {
      if (isIEFlag) {
        event.keyCode = 0;
        event.returnValue = false;
      }
      return false;
    }
  } catch (exception1) {
  }
  return true;
}

function $(id) {
  return document.getElementById(id);
}

function StringBuffer(){ 
   this.data = []; 
}

StringBuffer.prototype.append = function() {
   this.data.push(arguments[0]); 
   return this; 
}

StringBuffer.prototype.toString = function() {
   return this.data.join(""); 
}

StringBuffer.prototype.isEmpty = function() {
  return this.data.length == 0;
}

//require isIDevice() function
function ReEnterPwdField(fieldId, language) {
  var id = fieldId;
  var lang = language;
  var digit1ID = id + '1';
  var digit2ID = id + '2';
  var digit3ID = id + '3';
  var digit4ID = id + '4';

  var cellWidth = new Array();
  cellWidth['0'] = new Array(58, 25, 58, 48, 42, 50);
  cellWidth['1'] = new Array(42, 57, 43, 42, 57, 43);

  var label = new Array();
  label['0'] = new Array('First 2 char', 'Last 2 char');
  label['1'] = new Array('頭兩位', '尾兩位');

  this.validate = function() {
    var a1 = $(digit1ID).value;
    var a2 = $(digit2ID).value;
    var a3 = $(digit3ID).value;
    var a4 = $(digit4ID).value;
    return isValid = a1 != '' && a2 != '' && a3 != '' && a4 != '';
  }

  this.getInput = function() {
    var a1 = $(digit1ID).value;
    var a2 = $(digit2ID).value;
    var a3 = $(digit3ID).value;
    var a4 = $(digit4ID).value;
    return a1.toString() + a2.toString() + a3.toString() + a4.toString();
  }

  this.disableBoxes = function(val) {
    $(digit1ID).disabled = val;
    $(digit2ID).disabled = val;
    $(digit3ID).disabled = val;
    $(digit4ID).disabled = val;
  }

  this.clearInput = function() {
    $(digit1ID).value = '';
    $(digit2ID).value = '';
    $(digit3ID).value = '';
    $(digit4ID).value = '';
  }

  var iDeviceStyle = 'style="box-sizing:border-box;padding:1px;"';
  var pwdBoxStyle = isIDevice() ? iDeviceStyle : "";

  this.genHtml = function(lang1) {
    var buf = new StringBuffer();

    if (lang1 != undefined)
      lang = lang1;

    buf.append('<table border="0" cellspacing="0" cellpadding="0" style="width:142px">');
    buf.append('<tr>');
    buf.append('<td align="right" style="width:').append(cellWidth[lang][0]).append('px">')
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append(label[lang][0])
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append('</td>');
    buf.append('<td style="width:').append(cellWidth[lang][1]).append('px"></td>');
    buf.append('<td style="width:').append(cellWidth[lang][2]).append('px">')
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append(label[lang][1])
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append('</td>');
    buf.append('</tr>');
    buf.append('</table>');
    buf.append('<table border="0" cellspacing="0" cellpadding="0" style="width:142px">');
    buf.append('<tr>');
    buf.append('<td align="right" style="width:').append(cellWidth[lang][3]).append('px;">')
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append('<input type="password" id="').append(digit1ID).append('" name="')
       .append(digit1ID).append('" class="inputField3" maxlength="1" ').append(pwdBoxStyle).append('>')
       .append('<img src="images/spacer.gif" width="5" height="1">')
       .append('<input type="password" id="').append(digit2ID).append('" name="')
       .append(digit2ID).append('" class="inputField3" maxlength="1" ').append(pwdBoxStyle).append('>')
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append('</td>');
    buf.append('<td style="width:').append(cellWidth[lang][4]).append('px">')
       .append('<img src="images/pwd_dotx6_').append((('1' == lang) ? 'ch' : 'en')).append('.gif">')
       .append('</td>');
    buf.append('<td style="width:').append(cellWidth[lang][5]).append('px">')
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append('<input type="password" id="').append(digit3ID).append('" name="')
       .append(digit3ID).append('" class="inputField3" maxlength="1" ').append(pwdBoxStyle).append('>')
       .append('<img src="images/spacer.gif" width="5" height="1">')
       .append('<input type="password" id="').append(digit4ID).append('" name="')
       .append(digit4ID).append('" class="inputField3" maxlength="1" ').append(pwdBoxStyle).append('>')
       .append('<img src="images/spacer.gif" width="2" height="1">')
       .append('</td>');
    buf.append('</tr>');
    buf.append('</table>');
    return buf.toString();
  }
}

var obj;
var helpUrlObj;

function genHeader(header) {
  var buf = new StringBuffer();
  buf.append('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td class="topTitleBar"><table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td width="1" style="padding-right:10px;"><img src="images/stroke_yellow.gif"></td>');
  buf.append('<td class="titleWhite" id="asTitle" nowrap>');
  buf.append(header);
  buf.append('</td></tr>');
  buf.append('</table></td></tr>');
  buf.append('</table></td>');
  buf.append('<tr><td style="padding:2px 0px 4px 0px"><table width="100%" border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr><td style="border-top:1px solid #E8E9EA; background-color:#FFFFFF;"><img src="images/spacer.gif" width="1" height="1"></td></tr>');
  buf.append('<tr><td height="30" style="background:url(images/popup_nav_bg.gif) repeat-x;">');
  buf.append(genNav());
  buf.append('</td></tr>');
  buf.append('<tr><td style="border-bottom:1px solid #E8E9EA; background-color:#FFFFFF;"><img src="images/spacer.gif" width="1" height="1"></td></tr>');
  buf.append('</table></td></tr></table>');
  $('popupHeader').innerHTML = buf.toString();
}

function genNav() {
  var buf = new StringBuffer();

  buf.append('<table border="0" cellspacing="0" cellpadding="0">');
  buf.append('<tr>');
  for (var i = 0; i < obj.length; i++) {
    var boldStyle = '';
    var helpIcon = '';
    if (i == secId) {
        boldStyle = 'font-weight:bold;';
        helpIcon = '<a href="javascript:;" style="cursor:help;"><img src="images/icon_help.gif" id="pic_help" onclick="OnClickHelp('+i+')" hspace="3" border="0" align="absmiddle" style="margin-bottom:3px;"></a>';
    }

    if (i > 0)
      buf.append('<td width="1"><img src="images/popuo_stroke_gray.gif" width="1" height="14"></td>');

    buf.append('<td align="center" style="padding:0px 16px 0px 16px; ')
       .append(boldStyle)
       .append('"><a href="javascript:OnClickType(')
       .append(i)
       .append(');" class="popupNav">')
       .append(obj[i]).append('</a>').append(helpIcon).append('</td>');
  }
  buf.append('</tr>');
  buf.append('</table>');

  return buf.toString();
}

function OnClickHelp(id) {
    var width = 770;
    var height = 550;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    var sFeatures = 'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height
          + ',scrollbars=1,status=1'
          + ',location=0,menubar=0,resizable=0,titlebar=0';
    window.open(helpUrlObj[id], '_blank', sFeatures)
}

function get_url_help_obj_lang() {
    switch (parseInt(GetDataStore('language'))) {
        case (0): return helpUrlEn;
            break;
        case (1): return helpUrlCh;
            break;
        default: return helpUrlCh;
            break;
    }
}