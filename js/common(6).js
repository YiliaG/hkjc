<!--
	function changeMenuPos() {
		if (parseInt(navigator.appVersion)>3) {
 			if (navigator.appName=="Netscape") {
 				winW = window.innerWidth;
				var obj;//,args=changeMenuPos.arguments;
				//if ((obj=MM_findObj(args[0]))!=null) {
					obj=MM_findObj("pullMenu");
					//alert(obj.style.left);
					if (winW<772) {
						obj.style.left = 589;
					} else {
						obj.style.left = (winW-772)/2 + 579;
					}
				//}
 			}
			if (navigator.appName.indexOf("Microsoft")!=-1) {
  				winW = document.body.offsetWidth;
  				
				var obj;//,args=changeMenuPos.arguments;
				//if ((obj=MM_findObj(args[0]))!=null) {
					obj=MM_findObj("pullMenu");
					//alert(obj.style.left);
  				
	  			/*if (winW<772) {
			  		pullMenu.style.pixelLeft = 589;
  				} else {
	  				pullMenu.style.pixelLeft = (winW-772)/2 + 579;
  				}*/
			}
		}
		var obj;
		if (winW<772) {
			obj.style.left = 589;
		} else {
			obj.style.left = (winW-772)/2 + 579;
		}
 	}
	

function NewWindow(mypage, myname, w, h, scroll,resizable,toolbar) {
var winl = (screen.width - w) / 2;
var wint = (screen.height - h) / 2;
if (w=="" && h=="")
{
	w = "698";
	h = "440";
	winl = winl - (698/2)
	wint = wint - (440/2)
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+',toolbar=no,'
}
else if ((w=="700" && h=="600") || (w=="720" && h=="600"))
{
	w = "698";
	h = "440";
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+',toolbar=no,'
}
else
{
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+',toolbar='+toolbar+','
}
win = window.open(mypage, myname, winprops)
win.self.focus()
//if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}

function highlight(which,color01,color02){
if (document.all||document.getElementById)
which.style.backgroundColor=color02
which.style.color=color01
}

function highlight(which,color01,color02){
if (document.all||document.getElementById)
which.style.backgroundColor=color02
which.style.color=color01
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

function MM_jumpMenu(targ,selObj,restore){ //v3.0
  eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
  if (restore) selObj.selectedIndex=0;
}

function callDivCal(para,lang) {
if (lang == "E")
	ci = "en-US"
else
	ci = "zh-HK"

if (para != "0") {
	para = removeApos(para);
	para = hexcode(para)
}

a = window.open("http://bet.hkjc.com/football/inc/div_cal.aspx?para=" + para + "&ci=" + ci,"divCalculator",'scrollbars=yes,resizable=yes,width=587,height=410');
}
/*
function callDivCal(para) {
if (para != "0")
	para = hexcode(para)
a = window.open("http://bet.hkjc.com/football/ch/inc/div_cal.asp?para=" + para,"divCalculator",'scrollbars=yes,resizable=yes,width=457,height=310');
}*/

function callDivCal2(para) {

 a = window.open("http://bet.hkjc.com/football/ch/inc/div_cal.asp?para=" + para,"divCalculator",'scrollbars=yes,resizable=yes,width=457,height=310');
}

function hexnib(d) {
  if(d<10) return d; else return String.fromCharCode(65+d-10);
}

function hexbyte(d) {
       return "%"+hexnib((d&240)>>4)+""+hexnib(d&15);
}

function hexcode(url) {
    var result="";
   var hex="";
    for(var i=0;i<url.length; i++) {
            var cc=url.charCodeAt(i);
            if (cc<128) {
                result+=hexbyte(cc);
            } else if((cc>127) && (cc<2048)) {
               result+=  hexbyte((cc>>6)|192)
                       + hexbyte((cc&63)|128);
            } else {
               result+=  hexbyte((cc>>12)|224)
                       + hexbyte(((cc>>6)&63)|128)
                       + hexbyte((cc&63)|128);
            }
    }
   return result;
}

var hex =["%00", "%01", "%02", "%03", "%04", "%05", "%06", "%07",
   "%08", "%09", "%0a", "%0b", "%0c", "%0d", "%0e", "%0f",
   "%10", "%11", "%12", "%13", "%14", "%15", "%16", "%17",
   "%18", "%19", "%1a", "%1b", "%1c", "%1d", "%1e", "%1f",
   "%20", "%21", "%22", "%23", "%24", "%25", "%26", "%27",
   "%28", "%29", "%2a", "%2b", "%2c", "%2d", "%2e", "%2f",
   "%30", "%31", "%32", "%33", "%34", "%35", "%36", "%37",
   "%38", "%39", "%3a", "%3b", "%3c", "%3d", "%3e", "%3f",
   "%40", "%41", "%42", "%43", "%44", "%45", "%46", "%47",
   "%48", "%49", "%4a", "%4b", "%4c", "%4d", "%4e", "%4f",
   "%50", "%51", "%52", "%53", "%54", "%55", "%56", "%57",
   "%58", "%59", "%5a", "%5b", "%5c", "%5d", "%5e", "%5f",
   "%60", "%61", "%62", "%63", "%64", "%65", "%66", "%67",
   "%68", "%69", "%6a", "%6b", "%6c", "%6d", "%6e", "%6f",
   "%70", "%71", "%72", "%73", "%74", "%75", "%76", "%77",
   "%78", "%79", "%7a", "%7b", "%7c", "%7d", "%7e", "%7f",
   "%80", "%81", "%82", "%83", "%84", "%85", "%86", "%87",
   "%88", "%89", "%8a", "%8b", "%8c", "%8d", "%8e", "%8f",
   "%90", "%91", "%92", "%93", "%94", "%95", "%96", "%97",
   "%98", "%99", "%9a", "%9b", "%9c", "%9d", "%9e", "%9f",
   "%a0", "%a1", "%a2", "%a3", "%a4", "%a5", "%a6", "%a7",
   "%a8", "%a9", "%aa", "%ab", "%ac", "%ad", "%ae", "%af",
   "%b0", "%b1", "%b2", "%b3", "%b4", "%b5", "%b6", "%b7",
   "%b8", "%b9", "%ba", "%bb", "%bc", "%bd", "%be", "%bf",
   "%c0", "%c1", "%c2", "%c3", "%c4", "%c5", "%c6", "%c7",
   "%c8", "%c9", "%ca", "%cb", "%cc", "%cd", "%ce", "%cf",
   "%d0", "%d1", "%d2", "%d3", "%d4", "%d5", "%d6", "%d7",
   "%d8", "%d9", "%da", "%db", "%dc", "%dd", "%de", "%df",
   "%e0", "%e1", "%e2", "%e3", "%e4", "%e5", "%e6", "%e7",
   "%e8", "%e9", "%ea", "%eb", "%ec", "%ed", "%ee", "%ef",
   "%f0", "%f1", "%f2", "%f3", "%f4", "%f5", "%f6", "%f7",
   "%f8", "%f9", "%fa", "%fb", "%fc", "%fd", "%fe", "%ff"];

function getChar(chr)
{
     for(var i=0;i<hex.length;i++)
     {
          if(unescape(hex[i])==chr)
          return hex[i];
     }
     return chr;
} 
function convert(str)
{
     str=str.split("");
     var newstr=[];
     for(var i=0;i<str.length;i++)
     {
          newstr[i]=getChar(str[i]);
     }
     return newstr.join("");
} 

function openHTexpress(htid)
{
	NewWindow('/football/info/ch/news/htexpress.asp?nid=' + htid, '', '773', '520', 'yes', 'yes', 'no');
}

function popTourInfo()
{
	MM_openBrWindow('/football/info/ch/misc/match_info.asp','','scrollbars=no,resizable=yes,width=572,height=270')
}

function popTV()
{
	javascript: MM_openBrWindow('/football/info/ch/misc/tv_popup.asp','','scrollbars=no,resizable=yes,width=572,height=270')
}

function setLyr(obj,lyr)
{
	var newX = findPosX(obj);
	var newY = findPosY(obj);
	newY += 10;
	var x = new getObj(lyr);
	x.style.visibility = 'visible';
	x.style.top = newY + 'px';
	x.style.left = newX + 'px';
}

function findPosX(obj)
{
	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;
	var printstring = '';
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			printstring += ' element ' + obj.tagName + ' has ' + obj.offsetTop;
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
//	window.status = printstring;
	return curtop;
}


function getObj(name)
{
 if (document.getElementById)
 {
	   this.obj = document.getElementById(name);
	   this.style = document.getElementById(name).style;
 }
 else if (document.all)
 {
	   this.obj = document.all[name];
	   this.style = document.all[name].style;
 }
 else if (document.layers)
 {
	   if (document.layers[name])
	   {
	   	this.obj = document.layers[name];
	   	this.style = document.layers[name];
	   }
	   else
	   {
	    this.obj = document.layers.testP.layers[name];
	    this.style = document.layers.testP.layers[name];
	   }
 }
}
//-->