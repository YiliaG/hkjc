//Crazy Adv Properties
var showCrazyAdv = true;
var file = "http://is.hkjc.com/jcbw/ekba/crazybanner/flash/ch/121123_baoa_fb_c.swf";
var width = 770;
var height = 600;
var startDay = {year:2012, month:12, date:07, hours:17, mins:30};
var endDay = {year:2012, month:12, date:09, hours:21, mins:30};
var cookieName = "crazy_adv_1";
var cookieEnable = true;
var cookieExpiryHour = 120;

// Major version of Flash required
var requiredMajorVersion = 8;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 0;

var JCCookieName = "hkjcbw_crazyAdv";
var crazyAdvFile = null;

function crazyAdvInit()
{
	if (cookieEnable && getCookie(JCCookieName) == cookieName)	return;
	
	function checkTime(date)
	{
		return (new Date(date.year, (date.month-1), date.date, date.hours, date.mins)).getTime();
	}
	
	var startTime = checkTime(startDay);
	var endTime = checkTime(endDay);
	
	if (dateTime < startTime || dateTime > endTime)	return;
	
	if (cookieEnable)
	{
		var expiryDate = new Date();
		expiryDate.setTime(dateTime + (cookieExpiryHour*60*60*1000));
		setCookie(JCCookieName, cookieName, expiryDate, cpath, cdomain);
	}
	
	crazyFlashAction('crazyAdv', file);
}

function crazyAdv(args)
{
	var id = 'crazyFlash';
	var vars = '';
	if (!crazyAdvFile)	crazyAdvFile = args;
	var tempHtml = '';
	var winName = window.top.info;
	
	try
	{
		if (winName)
		{
			tempHtml += '<sc';
			tempHtml += 'ript language="Javascript">\n';
			tempHtml += 'function '+id+'_DoFSCommand(command, args) {\n';
			tempHtml += '	if (command == "crazyAdvShow")\n';
			tempHtml += '		{\n';
			tempHtml += '			crazyAdvShow (args);\n';
			tempHtml += '		}\n';
			tempHtml += '}\n';
			tempHtml += '</sc';
			tempHtml += 'ript>\n';
					
			
			
			tempHtml += '<div id="crazyAdvDiv" style="position:absolute; top:0px; left:0px;">';
			
			tempHtml += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="'+width+'" height="'+height+'" id="'+id+'" name="'+id+'">';
			tempHtml += '<param name="allowScriptAccess" value="always" />';
			tempHtml += '<param name="movie" value="'+crazyAdvFile+'">';
			tempHtml += '<param name="quality" value="high">';
			tempHtml += '<param name="menu" value="false">';
			tempHtml += '<param name="wmode" value="transparent">';
			tempHtml += '<param name="scale" value="noscale">';
			tempHtml += '<param name="salign" value="TL">';
			tempHtml += '<param name="flashVars" value="'+vars+'">';
			tempHtml += '<embed src="'+crazyAdvFile+'" allowScriptAccess="always" flashVars="'+vars+'" salign="TL" quality="high" scale="noscale" wmode="transparent" menu="false" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+width+'" height="'+height+'" id="'+id+'" name="'+id+'"></embed>';
			
			tempHtml += '</object>';
			tempHtml += '</div>';
			
			
			var objBody = winName.document.getElementsByTagName("body").item(0);
			if (winName.document.getElementById("crazyAdvDiv"))	objBody.removeChild(objBody.lastChild);
			//var objOverlay = winName.document.createElement("div");
			var objOverlay = winName.document.createElement("span");
			//objOverlay.setAttribute('id','crazyAdvSpan');
			//var objOverlay = winName.document.createElement("div");
			//objOverlay.setAttribute('style','z-index:100;position:absolute;top:0px;left:0px;');
			objOverlay.innerHTML = tempHtml;
			
			
			objBody.appendChild(objOverlay);
		}
	}
	catch (e) {
		setTimeout("crazyAdv()", 500);
	}
}

function crazyFlashAction(command, args)
{
	crazyAdvFile = args;
	crazyAdv (args);
}

function setCookie(name, value, expires, path, domain, secure)
{
	var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
	  
	//alert(curCookie)
	document.cookie = curCookie;
}

function getCookie(name)
{
	if (document.cookie.indexOf(name) < 0)
	{
		return null;
	}
	else
	{
		var startStr = document.cookie.indexOf(name) + name.length + 1;
		var endStr = document.cookie.indexOf(";", startStr);
		if (endStr == -1)	endStr = document.cookie.length;
		return unescape(document.cookie.substring(startStr, endStr));
	}
}

function crazyAdvShow(isShow)
{
	var crazyAdvDiv = document.getElementById('crazyAdvDiv');
	
	if (!isShow)
	{
		crazyAdvDiv.style.display = 'none';
	}
}

var dateTime = (new Date()).getTime();
var cdomain = (location.domain) ? location.domain : null;
var cpath = "/";


// Flash Player Version Detection - Rev 1.6
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

// Version check based upon the values entered above in "Globals"
var hasReqestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

if (hasReqestedVersion && showCrazyAdv)	crazyAdvInit();

function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}
	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
//			alert("flashVer="+flashVer);
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
    var str = '';
    if (isIE && isWin && !isOpera)
    {
  		str += '<object ';
  		for (var i in objAttrs)
  			str += i + '="' + objAttrs[i] + '" ';
  		for (var i in params)
  			str += '><param name="' + i + '" value="' + params[i] + '" /> ';
  		str += '></object>';
    } else {
  		str += '<embed ';
  		for (var i in embedAttrs)
  			str += i + '="' + embedAttrs[i] + '" ';
  		str += '> </embed>';
    }

    document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "id":
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}