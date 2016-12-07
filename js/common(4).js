<!--
var isIE = true;
if (navigator.appName.indexOf("Microsoft") > -1) {
	isIE = true;
} else {
	isIE = false;
}

function start()
{
	var tmp = window.location.href.substr(7) ;
	SERVER_NAME = tmp.substr(0, tmp.indexOf("/")) ;
	domainName = SERVER_NAME.substr(SERVER_NAME.indexOf(".")+1) ;
	//if (isIE)	document.domain = domainName;
	document.domain = domainName;
}

function GetParam(name)
{
	var start=location.search.indexOf("?"+name+"=");
	if (start<0) start=location.search.indexOf("&"+name+"=");
 	if (start<0) return '';
 	start += name.length+2;
 	var end=location.search.indexOf("&",start)-1;
 	if (end<0) end=location.search.length;
 	var result=location.search.substring(start,end);
 	var result='';
 	for(var i=start;i<=end;i++)
 	{
 		var c=location.search.charAt(i);
 		result=result+(c=='+'?' ':c);
 	}
 	//alert(unescape(result));
 	return unescape(result);
}


function NewWindow(mypage, myname, w, h, scroll,resizable) {
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+','
	win = window.open(mypage, myname, winprops)
	win.self.focus()
	if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

function MM_jumpMenu(targ,selObj,restore){ //v3.0
  eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
  if (restore) selObj.selectedIndex=0;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function genFlash(file, width, height, id, vars) {
	var tempHtml = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="'+width+'" height="'+height+'" id="'+id+'" name="'+id+'">';
	tempHtml += '<param name="movie" value="'+file+'">';
	tempHtml += '<param name="quality" value="high">';
	tempHtml += '<param name="menu" value="false">';
	tempHtml += '<param name="wmode" value="opaque">';
	tempHtml += '<param name="scale" value="noscale">';
	tempHtml += '<param name="salign" value="TL">';
	
	if (vars != null) {
		tempHtml += '<param name="flashVars" value="'+vars+'">';
		tempHtml += '<embed src="'+file+'" flashVars="'+vars+'" salign="TL" quality="high" scale="noscale" wmode="opaque" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+width+'" height="'+height+'" id="'+id+'" name="'+id+'"></embed>';
	} else {
		tempHtml += '<embed src="'+file+'" salign="TL" quality="high" scale="noscale" wmode="opaque" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+width+'" height="'+height+'" id="'+id+'" name="'+id+'"></embed>';
	}
	
	tempHtml += '</object>';
	
	document.write(tempHtml);
}


var popUpPage2;

function popupFlash(file, w, h, name, vars) {
 //alert(popUpPage2);
 if (popUpPage2)	popUpPage2.close();
 
 popUpPage2 = window.open('', ''+name+'', 'width='+w+',height='+h+',left=0,top=0,screenX=0,screenY=0,scrollbars=0,resizable=0');
 popUpPage2.document.open();
 popUpPage2.document.write('<html>');
 popUpPage2.document.write('<head><title>香港賽馬會</title></head>');
 popUpPage2.document.write('<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">');
 popUpPage2.document.write('	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="'+w+'" height="'+h+'" id="'+name+'" name="'+name+'">');
 popUpPage2.document.write('	<param name="allowScriptAccess" value="always">');
 popUpPage2.document.write('	<param name="movie" value="'+file+'">');
 popUpPage2.document.write('	<param name="quality" value="high">');
 popUpPage2.document.write('	<param name="menu" value="false">');
	
	if (vars != null) {
 		popUpPage2.document.write('	<param name="flashVars" value="'+vars+'">');
 		popUpPage2.document.write('	<embed src="'+file+'" allowScriptAccess="always" flashVars="'+vars+'" quality="high" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+w+'" height="'+h+'" id="'+name+'" name="'+name+'"></embed>');
	} else {
 		popUpPage2.document.write('	<embed src="'+file+'" allowScriptAccess="always" quality="high" scale="noscale" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+w+'" height="'+h+'" id="'+name+'" name="'+name+'"></embed>');
	}
	
 popUpPage2.document.write('	</object>');
 popUpPage2.document.write('</body>');
 popUpPage2.document.write('</html>');
 popUpPage2.document.close();
 popUpPage2.focus();
}


var btnSection = "match";
//document.getElementById(('btn_'+btnSection)).src = '/football/info/ch/images/btn_'+btnSection+'_on.gif';

function btnClick(i) {
	var btn = document.getElementById(('btn_'+i));
	var btn1 = document.getElementById(('btn_'+btnSection));
	var div = document.getElementById(('div_'+i));
	var div1 = document.getElementById(('div_'+btnSection));
	
	if (btnSection != i) {
		btn1.src = '/football/info/ch/images/btn_'+btnSection+'_off.gif';
		div1.style.visibility = 'hidden';
		div.style.visibility = 'visible';
		btnSection = i;
	}
}


function btnOver(i, over) {
	var btn = document.getElementById(('btn_'+i));
	
	if (over) {
		if (btnSection != i)	btn.src = '/football/info/ch/images/btn_'+i+'_on.gif';
	} else {
		if (btnSection != i)	btn.src = '/football/info/ch/images/btn_'+i+'_off.gif';
	}
}


var target;

function initsize(i) { 
	var tmp = window.location.href.substr(7) ;
	SERVER_NAME = tmp.substr(0, tmp.indexOf("/")) ;
	domainName = SERVER_NAME.substr(SERVER_NAME.indexOf(".")+1) ;
	//if (isIE) document.domain = domainName;
	document.domain = domainName;
	
	target = i;
	updateSize();
}

function updateSize() {
	try
	{
		if (parent)
		{
			document.body.style.display = "block";
			
			window.parent.document.getElementById(target).height = document.body.scrollHeight;
		}
	}
	catch (e) {
		setTimeout("updateSize()", 500);
	}
}


var crazyAdvFile = null;

function crazyAdv(file)
{
	var width = 770;
	var height = 600;
	var id = 'crazyFlash';
	var vars = '';
	if (!crazyAdvFile)	crazyAdvFile = file;
//	var file = '/racing/info/ch/images/swf/crazy_adv.swf';
	var tempHtml;
	
	try
	{
		if (parent)
		{
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
			tempHtml += '<embed src="'+crazyAdvFile+'" allowScriptAccess="always" flashVars="'+vars+'" salign="TL" quality="high" scale="noscale" wmode="transparent" menu="false" allowScriptAccess="sameDomain" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+width+'" height="'+height+'" id="'+id+'" name="'+id+'"></embed>';
			
			tempHtml += '</object>';
			tempHtml += '</div>';
			
			var objBody = parent.window.document.getElementsByTagName("body").item(0);
			if (parent.window.document.getElementById("crazyAdvDiv"))	objBody.removeChild(objBody.lastChild);
			//var objOverlay = parent.window.document.createElement("div");
			var objOverlay = parent.window.document.createElement("span");
			//objOverlay.setAttribute('id','crazyAdvSpan');
			//var objOverlay = parent.window.document.createElement("div");
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
	crazyAdv (args);
}


function genSubMenu(sect, array)
{
	var tempHtml = '';
	var section = eval(sect+"Sect");
	
	tempHtml += '<table border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '	<tr valign="bottom">';
	
	for (var i=0; i<array.length; i++)
	{
		if (section == (i+1))
		{
			var tempClass = sect+'BtnOver';
			var tempClass1 = sect+'BotLineOver';
		}
		else
		{
			var tempClass = sect+'Btn';
			var tempClass1 = sect+'BotLine';
		}
		tempHtml += '<td class="'+tempClass1+'" id="subMenuBg_'+sect+'_'+(i+1)+'">';
		tempHtml += '<table border="0" cellspacing="0" cellpadding="0">';
		tempHtml += '	<tr>';
		
		tempHtml += '<td class="'+tempClass+'" onClick="SubMenuClick('+(i+1)+', \''+sect+'\');" onMouseOver="SubMenuOver('+(i+1)+', \''+sect+'\', 1);" onMouseOut="SubMenuOver('+(i+1)+', \''+sect+'\', 0);" id="subMenu_'+sect+'_'+(i+1)+'" nowrap>'+array[i]+'</td>';
		
		tempHtml += '	</tr>';
		tempHtml += '</table>';
		tempHtml += '</td>';
		
		if ( i >= (array.length-1) ) break;
		tempHtml += '<td width="2" class="'+sect+'BotLine"><img src="/info/include/images/spacer.gif" width="2" height="1"></td>';
	}
	
	tempHtml += '<td width="100%" class="'+sect+'BotLine"><img src="/info/include/images/spacer.gif" width="2" height="1"></td>';
	
	tempHtml += '	</tr>';
	tempHtml += '</table>';
	
	document.write(tempHtml);
}


function SubMenuOver(i, sect, over)
{
	var btn = document.getElementById('subMenu_'+sect+'_'+i);
	var bg = document.getElementById('subMenuBg_'+sect+'_'+i);
	var section = eval(sect+"Sect");
	
	if (over)
	{
		if (i != section)
		{
			btn.className = sect+'BtnOver';
			bg.className = sect+'BotLineOver';
		}
	}
	else
	{
		if (i != section)
		{
			btn.className = sect+'Btn';
			bg.className = sect+'BotLine';
		}
	}
}


function SubMenuClick(i, sect)
{
	var btn = document.getElementById('subMenu_'+sect+'_'+i);
	var bg = document.getElementById('subMenuBg_'+sect+'_'+i);
	var table = document.getElementById('div_'+i);
	var section = eval(sect+"Sect");
	var btn1 = document.getElementById('subMenu_'+sect+'_'+section);
	var bg1 = document.getElementById('subMenuBg_'+sect+'_'+section);
	var table1 = document.getElementById('div_'+section);
	
	if (i == section)	return;
	
	btn.className = sect+'BtnOver';
	btn1.className = sect+'Btn';
	
	bg.className = sect+'BotLineOver';
	bg1.className = sect+'BotLine';
	
	table.style.visibility = 'visible';
	table1.style.visibility = 'hidden';
	
	switch (sect)
	{
		case "racing":	
			racingSect = i;
			break;
		case "football":
			footballSect = i;
			break;
		case "marksix":
			marksixSect = i;
			break;
	}
}

//Football
betTypesArray = [
{name:"即場投注", id:"", link:"bettypes_inplay.asp", target:"_self"},
{name:"主客和", id:"", link:"bettypes.asp", target:"_self"},
{name:"半場主客和", id:"", link:"bettypes_fhhad.asp", target:"_self"},
{name:"讓球主客和", id:"", link:"bettypes_hhad.asp", target:"_self"},	
{name:"讓球", id:"", link:"bettypes_hdc.asp", target:"_self"},
{name:"入球大細", id:"", link:"bettypes_hilo.asp", target:"_self"},
{name:"波膽", id:"", link:"bettypes_crs.asp", target:"_self"},
{name:"半全場", id:"", link:"bettypes_hft.asp", target:"_self"},
{name:"總入球", id:"", link:"bettypes_ttg.asp", target:"_self"},
{name:"入球單雙", id:"", link:"bettypes_ooe.asp", target:"_self"},
{name:"首名入球", id:"", link:"bettypes_fgs.asp", target:"_self"},
{name:"孖寶半全膽", id:"", link:"bettypes_dhcp.asp", target:"_self"},
{name:"6寶半全場", id:"", link:"bettypes_hfmp.asp", target:"_self"},
{name:"冠軍", id:"", link:"bettypes_chp.asp", target:"_self"},
{name:"小組首名", id:"", link:"bettypes_groupwinner.asp", target:"_self"},
{name:"小組一二名", id:"", link:"bettypes_groupforecast.asp", target:"_self"},
{name:"神射手", id:"", link:"bettypes_topscorer.asp", target:"_self"}


];


function genSelect()
{
	var obj = betTypesArray;
	var total = obj.length;
	var id;
	var tempHtml = "";
	
	var tmpPath = location.href.toString();
	for (var i=0; i<obj.length; i++)
	{
		if (tmpPath.indexOf("/" + obj[i].link) > -1)
		{
			id = i;
			break;
		}
	}
	
	tempHtml += '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
	tempHtml += '	<tr>';
	tempHtml += '		<td align="right" class="content2">投注種類：';
	tempHtml += '			<select name="menu1" onChange="MM_jumpMenu(\'parent\',this,0)" class="select">';
	
	for (var i=0; i<obj.length; i++)
	{
		var tempStr = '';
		if (id == i)	tempStr = 'selected';
		tempHtml += '<option value="'+obj[i].link+'" '+tempStr+'>'+obj[i].name+'</option>';
	}
	
	tempHtml += '			</select>';
	tempHtml += '		</td>';
	tempHtml += '	</tr>';
	tempHtml += '</table>';
	
	document.write(tempHtml);
}


function genSelect2()
{
	var obj = betTypesArray;
	var total = obj.length;
	var id;
	var row = 8;
	var tempHtml = "";
	
	var tmpPath = location.href.toString();
	for (var i=0; i<obj.length; i++)
	{
		if (tmpPath.indexOf("/" + obj[i].link) > -1)
		{
			id = i;
			break;
		}
	}
	
	//tempHtml += '<div style="position:absolute; top:11px;" id="leftNav">';
	tempHtml += '<div id="leftNav">';
	tempHtml += '<table border="0" cellpadding="0" cellspacing="0">';
	
	//tempHtml += '		<tr>';
	//tempHtml += '			<td class="title" colspan="3" style="padding:7px 0px 7px 3px;">&nbsp;</td>';
	//tempHtml += '		</tr>';
	
	for (var i=0; i<obj.length; i++)
	{
		var tempStr = '';
		if (id == i)
		{
			var isSect = 1;
			tempStr = 'leftNavOver';
		}
		else
		{
			var isSect = 0;
			tempStr = 'leftNav';
		}
		
		/*tempHtml += '<tr>';
		//if (i%row == 0)	tempHtml += '<tr valign="top">';
		tempHtml += '<td style="padding:5px 5px 0px 5px;"><img src="../images/arrow.gif"></td>';
		tempHtml += '<td style="padding:0px 20px 0px 0px;"><a href="'+obj[i].link+'" target="'+obj[i].target+'">'+obj[i].name+'</a></td>';
		//if (i%row == (obj.length - 1))	tempHtml += '</tr>';
		tempHtml += '<tr>';*/
		
		tempHtml += '<tr>';
		tempHtml += '<td colspan="3" onMouseOver="leftOver('+i+', 1, '+isSect+');" onMouseOut="leftOver('+i+', 0, '+isSect+');" onClick="location.href=\''+genLink(obj[i].link)+'\'" style="cursor:pointer;">';
		tempHtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
		
		tempHtml += '<tr valign="top">';
		tempHtml += '	<td class="leftNavArrow" style="padding-top:12px;"><img src="../images/arrow.gif" width="4" height="5"></td>';
		
		tempHtml += '	<td width="100%" class="leftNav"><a href="'+genLink(obj[i].link)+'" target="'+obj[i].target+'" id="leftTxt_'+i+'" class="'+tempStr+'">'+obj[i].name+'</a></td>';
		
		tempHtml += '</tr>';
		tempHtml += '</table>';
		
		tempHtml += '</td>';
		tempHtml += '</tr>';
	}
	
	tempHtml += '</tr>';
	tempHtml += '</table>';
	tempHtml += '</div>';
	
	document.write(tempHtml);
}


function leftOver(i, over, isSect) {
	var leftTxt = document.getElementById(('leftTxt_'+i));
	
	if (over) {
		if (!isSect)	leftTxt.className = 'leftNavOver';
	} else {
		if (!isSect)	leftTxt.className = 'leftNav';
	}
}


function genLink(i) {
	if (i.indexOf('http') > -1) {
		var link = i;
	} else if (i.indexOf('javascript') > -1) {
		var link = i;
	} else {
		var link = i;
	}
	
	return link;
}


function popupWin (mypage, w, h)
{
	var myname = 'win02';
	var scroll = 1;
	var resizable = 1;
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+','
	
	winWin = window.open(mypage, myname, winprops);
	winWin.self.focus();
	//if (parseInt(navigator.appVersion) >= 4) { winWin.window.focus(); }
}

function setWinSize()
{
	var b = document.getElementsByTagName("table")[0];
	
	var w = b.offsetWidth + 10;
	var h = b.offsetHeight + 60;
	
	if (isIE)
	{
		var tempV1 = Number(navigator.appVersion.indexOf('MSIE ')) + 5;
		var tempV2 = Number(navigator.appVersion.substring(tempV1, (tempV1+1)));
		if (tempV2 >= 7)	h += 24;
	}
//	alert(w + "  :  " + h);
	window.resizeTo(w, h);
	window.focus();
}


-->