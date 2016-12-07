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
	if (isIE)	document.domain = domainName;
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


function changeLanguage() {
	var target = 'en';
	var nowL = 'ch';
	var url = location.href.replace((nowL+'/'), (target+'/'));
	location.href = url;
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


function popupLink(mypage) {
	winprops = '';
	win = window.open(mypage, 'popupPage', winprops);
	win.self.focus();
//	if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}

function popupLinkWithTarget(mypage, target) {
	var winprops = '';
/*	if ((typeof(window.opener)!="undefined")
	&& (typeof(window.opener.location)!="unknown"))
		{
			window.opener.focus();
		}
	else
		{
			win = window.open(mypage, target, winprops);
			win.self.focus();
		}*/
	
	if (window.opener) {
		window.opener.location.href = mypage;
		window.opener.focus();
	} else {
		var win = window.open(mypage, target, winprops);
		win.self.focus();
	}
//	if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}

function openRow(row, btn, picPath, isOpen) {
	var row1 = document.getElementById(row);
	var btn1 = document.getElementById(btn);
	
	if (!(row)) return;
	
	if (!row1.clicked) {
		btn1.src = picPath + 'btn_close.gif';
		row1.style.display = (isIE)?'block':'table';
		row1.clicked = true;
	} else {
		if (!isOpen) {
			btn1.src = picPath + 'btn_open.gif';
			row1.style.display = 'none';
			row1.clicked = false;
		}
	}
}


var iconHit = false;

function closeRow(row, btn, picPath, isOpen) {
	if (iconHit)	return;
	
	var row1 = document.getElementById(row);
	var btn1 = document.getElementById(btn);
	
	if (!(row)) return;
	
	if (!row1.clicked) {
		btn1.src = picPath + 'btn_open.gif';
		row1.style.display = 'none';
		row1.clicked = true;
	} else {
		if (!isOpen) {
			btn1.src = picPath + 'btn_close.gif';
			row1.style.display = 'table-row-group';
			row1.clicked = false;
		}
	}
}

function iconOver(over) {
	if (over) {
		iconHit = true;
	} else {
		iconHit = false;
	}
}


function changeTDColor() {
	var args = changeTDColor.arguments;					
	for (var i=1; i<args.length; i++)
	{		
		var td = document.getElementById(args[i]);
		if (!td.clicked && args[0].checked == true) {		
			td.c = td.style.backgroundColor = '#FFF4B0';
			//td.c = td.style.backgroundColor = 'blue';
			td.clicked = true;
		} else {
			td.style.backgroundColor = '';
			td.clicked = false;
		}
		
	}
}

function changeAllTDColor(exceptionObj) {
//	var args = changeAllTDColor.arguments;	
//	if (args.length > 0)
		//exceptionObj 
	var allTD = document.getElementsByTagName("TD")			
	for (var i = 0;i<allTD.length;i++) {
		if (allTD[i].id.substring(0,3) == "td_") {			
			if ((exceptionObj == undefined) || (exceptionObj != undefined && exceptionObj != 'undefined' && allTD[i].id.indexOf(exceptionObj) < 0))
				allTD[i].style.backgroundColor = '';
				allTD[i].clicked = false;
		}
			
	}
}

function changeAllSPCColor() {
	var allTD = document.getElementsByTagName("TD")		
	for (var i = 0;i<allTD.length;i++) {
		if (allTD[i].id.substring(0,7) == "td_spc_") {						
			allTD[i].style.backgroundColor = '';
			allTD[i].clicked = false;
		}	
	}
}

function removeTDColor() {
	var args = removeTDColor.arguments;					
	for (var i=0; i<args.length; i++)
	{		
		var td = document.getElementById(args[i]);
		td.style.backgroundColor = '';
		td.clicked = false;
	}
}

function changeRadioColor(name, num, total) {
	for (var i=1; i<=total; i++)
	{
		var td = document.getElementById((name + i));
		
		if (td.clicked) {
			td.style.fontWeight = '';
			td.style.backgroundColor = '';
			td.clicked = false;
		}
	}
	
	var td = document.getElementById((name + num));
	
	if (!td.clicked) {
		td.style.fontWeight = 'bold';
		td.style.backgroundColor = '#FFF4B0';
		td.clicked = true;
	}
}


function startRadioColor(name, num) {
	var td = document.getElementById((name + num));
	
	if (!td.clicked) {
		td.c = td.style.backgroundColor = '#FFF4B0';
		td.clicked = true;
	}
}


function setRadio(name) {
	var obj = document.getElementById((name));
	
	if (!obj.checked) {
		obj.checked = true;
	}
}



function changeRadio() {
	var args = changeRadio.arguments;
	
	for (var i=0; i<args.length; i+=2)
	{
		var mc = document.getElementById(args[i]);
		
		mc.style.display = args[(i+1)];
	}
}


var mvqTimeout = 125;
var mvqPDiv, mvqPStyle;

function hideComponent(f)
{
	mvqPHideEleByX(f);
}

function mvqPHideEleByX(boolHide)
{
    window.setTimeout("mvqPHideEleByX1('OBJECT'," +  boolHide + ")", mvqTimeout);
    window.setTimeout("mvqPHideEleByX1('SELECT'," +  boolHide + ")", mvqTimeout+1);
}

function mvqPVerifyOverlapByX(x, overlapElm)
{
    var p1 = new mvqPDimension(overlapElm);
		return (p1.left>x);
}

function mvqPHideEleByX1(el, boolShowHide)
{
    var objects = document.getElementsByTagName(el);
    if(objects.length == 0) return;
    for(var i=0; i < objects.length; i++)
    {
        var obj = objects.item(i);
            if(boolShowHide && mvqPVerifyOverlapByX(655, obj))
            {
                obj.style.visibility = "hidden";
            }
            else
            {
                if(obj.style.visibility == "hidden") obj.style.visibility = "visible";
						}
    }
}


function menuHideSelect(name, boolHide)
{
	var selectHide = true;
	if (navigator.appName.indexOf("Microsoft") > -1) {
		var tempV1 = Number(navigator.appVersion.indexOf('MSIE ')) + 5;
		var tempV2 = Number(navigator.appVersion.substring(tempV1, (tempV1+1)));
		if (tempV2 >= 7)	selectHide = false;
	//	alert(selectHide);
	} else {
		selectHide = false;
	}
	if (selectHide) {
		mvqPDiv = name;
		mvqPStyle = mvqPDiv.style;
	    mvqPHideEle(boolHide);
	}
}

function mvqPHideEle(boolHide)
{
    window.setTimeout("mvqPHideEle1('OBJECT'," +  boolHide + ")", mvqTimeout);
    window.setTimeout("mvqPHideEle1('SELECT'," +  boolHide + ")", mvqTimeout+1);
}

function mvqPHideEle1(el, boolShowHide)
{
    var objects = document.getElementsByTagName(el);
    if(objects.length == 0) return;
    for(var i=0; i < objects.length; i++)
    {
        var obj = objects.item(i);
        elm = mvqPDiv.firstChild;
		//alert(elm);
        if(elm)
        {
            if(boolShowHide && mvqPVerifyOverlap(elm, obj))
            {
                obj.style.visibility = "hidden";
            }
            else
            {
                if(obj.style.visibility == "hidden") obj.style.visibility = "visible";
            }
        }
    }
}

function mvqPDimension(elm)
{
    var top = 0;
    var height = 0;
    var width = 0;
    var left = 0;
    if(elm)
    {
        this.height = elm.offsetHeight;
        this.width = elm.offsetWidth;
        while(elm)
        {
            left += elm.offsetLeft;
            top += elm.offsetTop;
            elm = elm.offsetParent;
        }
        this.left = left;
        this.top = top;
    }
}

function mvqPVerifyOverlap(tbl, overlapElm)
{
    var p1 = new mvqPDimension(overlapElm);
    var p = new mvqPDimension(tbl);
    return ( ((p.left + p.width) > p1.left) && (p.left < (p1.left + p1.width)) && (p.top < (p1.top - overlapElm.offsetTop + p1.height)) && ((p.top + p.height) > (p1.top - overlapElm.offsetTop)) );
}

function checkNum(mc, theClass)
{
	var td = document.getElementsByTagName('td');
	
	if (td.length == 0) return;
	for (var i=0; i<td.length; i++)
	{
		var obj = td.item(i);
		if (obj.className == theClass)
		{
			if (mc.checked)
			{
				obj.style.display = (isIE)?'block':'table-cell';
			}
			else
			{
				obj.style.display = 'none';
			}
		}
	}
	
	var staticTxt = document.getElementById('staticTxt');
	
	if (document.getElementById('statCheckbox1').checked == false && document.getElementById('statCheckbox2').checked == false)
	{
		staticTxt.style.display = 'none';
	}
	else
	{
		staticTxt.style.display = (isIE)?'block':'table-cell';
	}
}

var calWin;
var winWin;

function popupCal (mypage, w, h)
{	
	var myname = 'popupCal';
	var scroll = 0;
	var resizable = 0;
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+','

	calWin = window.open(mypage, myname, winprops);
	//calWin.self.focus();
	//if (parseInt(navigator.appVersion) >= 4) { calWin.window.focus(); }
	
	/*//alert(calWin)
	w = (Number(w)+6-15);
	h = (Number(h)+60);
	//if (calWin)	setTimeout(function() {setSize (calWin, w, h);}, 500);
	try {
	setSize (calWin, w, h);
	}
	catch (e)
	{
	//alert(e);
	setSize (calWin, w, h);
	}*/
}


function popupWin (mypage, w, h)
{
	var myname = 'popupWin';
	var scroll = 1;
	var resizable = 1;
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+','
	
	winWin = window.open(mypage, myname, winprops);
	winWin.self.focus();
	//if (parseInt(navigator.appVersion) >= 4) { winWin.window.focus(); }
}

function isMobile() {
    return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|Touch/i) != null;
}

function Mobile_MM_swapImage() {
	if (!isMobile()) {
		MM_swapImage.apply(null, arguments);
	}
}

function Mobile_MM_swapImgRestore() {
	if (!isMobile()) {
		MM_swapImgRestore.apply(null, arguments);
	}
}

-->

