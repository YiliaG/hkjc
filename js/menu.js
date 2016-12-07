var section = 0;
var level1 = "";
var level2 = "";
var level3 = "";
var level4 = "";
var path = "../";
var imgPath = "/info/include/menu/images/";
//var menuImgPath = "/football/info/images/menu/";
//Q109 Content Server
var menuImgPath = "/contentserver/jcbw/userimage/";
var menuTop = "62";
var menuLeft = "233";
var sectionArray = new Array();
var tempHtml;
var tempStr1;
var tempStr2;
var color1 = "#5D92DB";
var color2 = "#0C4D96";
var menuW = 530;
var menuH = 350;

function genNav() {
	var sect = 0;
	var obj = sectionArray;
	var total = obj.length;
	
	tempHtml += '<div id="" style="position:absolute; left:'+menuLeft+'px; top:'+menuTop+'px; width:'+(menuW+6)+'px;">'; // 20080122 remove id
	tempHtml += '<table width="530" cellpadding="0" cellspacing="0" border="0">';
	tempHtml += '<tr>';
	tempHtml += '<td>'; // 20080122 remove menuGo action
	tempHtml += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	
	tempHtml += '<tr>';
	
	for (var i=0; i<total; i++) {
		isSect = 0;
		
		tempStr1 = "";
		
		obj[i].width = (100/total) + "%";
		
		
		tempHtml += '<td width="'+obj[i].width+'" style="padding: 0px 0px 4px 0px;'+tempStr1+'; cursor:pointer;" nowrap class="menu_nav">';
// 20080122 start
		tempHtml += '<div style="position:absolute;">';
		
		
//Added By DCHK 20100709 start
		//tempHtml += '<div style="position:relative; width:'+(menuW/total + 5)+'px; height:30px;" onMouseOver="navOver('+i+', 1, '+isSect+');" onMouseOut="navOver('+i+', 0, '+isSect+'); setTimeout(function() {menuGo(0, 1);}, 200);" onClick="menuGo(1, 1);">';
		var clickAction;
		if (obj[i].link != '#' && obj[i].link != '')
		{
			clickAction = genAllMenuLink(obj[i].link, obj[i].popup, obj[i].target);
			// START Nielsen Online SiteCensus
			clickAction += 'WATrackClickEvent(\'' + obj[i].name.replace(/<\/?[^>]+(>|$)/g, "") + '\')';
			// END Nielsen Online SiteCensus			
		}
		else
		{
			clickAction = 'menuGo(1, 1);';
			// START Nielsen Online SiteCensus
			clickAction += 'WATrackClickEvent(\'' + obj[i].name + '\')';
			// END Nielsen Online SiteCensus			
		}
		tempHtml += '<div style="position:relative; width:'+(menuW/total + 5)+'px; height:30px;" onMouseOver="navOver('+i+', 1, '+isSect+');" onMouseOut="navOver('+i+', 0, '+isSect+'); setTimeout(function() {menuGo(0, 1);}, 200);" onClick="' + clickAction + '">';
//Added By DCHK 20100709 end
		
		
		tempHtml += '<img src="'+imgPath+'spacer.gif" width="'+(menuW/total + 5)+'" height="30">';
		tempHtml += '</div>';
		tempHtml += '</div>';
		
		tempHtml += '<div style="text-align:center; padding-top:5px;" id="navColor_'+i+'">' + obj[i].name + '</div>';
// 20080122 end
		tempHtml += '</td>';
		
		if (i < (total-1))	tempHtml += '<td width="2" rowspan="2" style="padding-bottom:3px;"><img src="'+imgPath+'stroke.gif"></td>';
		
	}
	
	tempHtml += '</tr>';
	
	tempHtml += '<tr>';
	for (var i=0; i<total; i++) {
		tempStr1 = "365F93";
		isSect = 0;
		tempHtml += '<td><img src="'+imgPath+'spacer.gif" width="4" height="3"></td>'; // 20080122 remove onMouseOver
	}
	tempHtml += '</tr>';
	tempHtml += '</table>';
	tempHtml += '</td>';
	tempHtml += '</tr>';
	
// 20080122	start
	tempHtml += '<tr><td style="padding-top:3px;">';
// 20080122 ended
	genMenu();
	tempHtml += '</td></tr>';
	
	
	tempHtml += '</table>';
	tempHtml += '</div>';
	
}


function genMenu() {
	var sect = 0;
	var obj = sectionArray;
	var total = obj.length;
	
	tempHtml += '<div style="position:absolute;">';
	tempHtml += '<div style="position:absolute; overflow:hidden; left:0px; top:0px; width:'+menuW+'px; height:1px;" id="menuMask">';
// 20080122 start
	tempHtml += '<div id="navMenu" style="position:absolute; top:'+(-menuH)+'px; visibility:hidden;" onMouseOver="menuGo(1, 1);" onMouseOut="setTimeout(function() {menuGo(0, 1);}, 100);">';
// 20080122 end
	tempHtml += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	tempHtml += '<tr>';
	tempHtml += '<td style="border:2px #003B7E solid; padding:0px 0px 2px 0px; background-color:#E3E7F0;" id="menuTD">'; // 20080122 add id
	
	tempHtml += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	
	tempHtml += '<tr valign="top">';
	
	for (var i=0; i<total; i++) {
		tempHtml += '<td width="'+obj[i].width+'" id="menuBg_'+i+'" style="padding:5px 2px 5px 2px;" onMouseOver="navOver('+i+', 1, 0);" onMouseOut="navOver('+i+', 0, 0);">';
		
		if (obj[i].subSection) {
			var obj1 = obj[i].subSection;
			tempHtml += '<table width="100%" cellspacing="0" border="0">';
			
			for (var j=0; j<obj1.length; j++) {
				var t = '';
				//if (obj1[j].popup=="0") t = '" target="'+obj1[j].target;
				//if (obj1[j].popup=="0") t = ' target="_self"';
				tempHtml += '<tr>';
				// START Nielsen Online SiteCensus
				//tempHtml += '<td style="padding:2px 1px 4px 1px;" id="menuTxtTd_'+i+'_'+j+'" onMouseOver="menuTxtOver('+i+', '+j+', 1, 0);" onMouseOut="menuTxtOver('+i+', '+j+', 0, 0);">'; // 20080122 padding change
				tempHtml += '<td style="padding:2px 1px 4px 1px;" id="menuTxtTd_'+i+'_'+j+'" onMouseOver="menuTxtOver('+i+', '+j+', 1, 0);" onMouseOut="menuTxtOver('+i+', '+j+', 0, 0);" onClick="WATrackClickEvent(\'' + obj1[j].name + '\');">'; // 20080122 padding change
				// END Nielsen Online SiteCensus
				tempHtml += '<a href="'+genAllMenuLink(obj1[j].link, obj1[j].popup, obj1[j].target)+t+'" class="menu_menuTxt" id="menuTxt_'+i+'_'+j+'">'+obj1[j].name+'</a>';
				tempHtml += '</td>';
				 
				tempHtml += '</tr>';
			}
			
			tempHtml += '</table>';
		}
		
		
		tempHtml += '</td>';
		if (i < (total-1)) {
		    tempHtml += '<td width="1" height="100%" valign="middle" style="padding:8px 0px 0px 1px;" onmouseover="navOver(' + i + ', 1, 0);" onmouseout="navOver(' + i + ', 0, 0);">';
			tempHtml += '<table width="1" height="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:1px dotted #7388A3;">';
			tempHtml += '<tr>';
			tempHtml += '<td><img src="'+imgPath+'spacer.gif" width="1" height="1"></td>';
			tempHtml += '</tr>';
			tempHtml += '</table></td>';
		}
	}
	
	tempHtml += '</tr>';
	tempHtml += '</table>';
	tempHtml += '</td>';
	tempHtml += '</tr>';
	tempHtml += '</table>';
	
	//Promotion
	//tempHtml += '<div style="position:absolute; left:185px; top:176px; width:273px; height:126px; overflow:hidden; visibility:hidden;" id="menuBox" onMouseOver="menuGo(1, 1);">'; // 20080122 change visibility 
	tempHtml += '<div style="position:absolute; right:2px; width:314px; height:126px; overflow:hidden; visibility:hidden;" id="menuBox" onMouseOver="menuGo(1, 1);">'; // 20100726 amended
	tempHtml += '<table width="100%" height="100%" cellpadding="3" cellspacing="0" border="0" bgcolor="#E3E7F0">';// 20080122 change height
	tempHtml += '<tr><td>';
	
	tempHtml += '<table width="100%" height="100%" cellpadding="5" cellspacing="0" border="0" bgcolor="#FAFBFC">';// 20080122 change height
	tempHtml += '<tr valign="top">';
	tempHtml += '<td rowspan="2" style="padding-top:10px;"><img src="'+imgPath+'spacer.gif" id="menuPic"></td>';
	tempHtml += '<td class="menu_gray" id="menuTxt" style="line-height:18px; padding-top:10px;"></td>';
	tempHtml += '</tr>';
	tempHtml += '</table>';
	
	tempHtml += '</td></tr>';
	tempHtml += '</table>';
	tempHtml += '</div>';
	
	tempHtml += '</div>';
	tempHtml += '</div>';
}


var navIsOver = false; // 20080122 added insert value

function navOver(id, over, isSect) {
	var obj = sectionArray;
	
	for (var i=0; i<obj.length; i++) {
		var menuBg = document.getElementById('menuBg_'+i);
		menuBg.style.backgroundColor = '';
		

		var obj1 = obj[i].subSection;
		for (var j=0; j<obj1.length; j++) {
			var menuTxt = document.getElementById('menuTxt_'+i+'_'+j);
			menuTxt.style.color = '#002E65';
		}
		
		var navColor = document.getElementById(('navColor_'+i));
		navColor.style.color = '#999999';
	}
	
	var layer = document.getElementById('navMenu');
	var navColor = document.getElementById(('navColor_'+id));
	
	if (over == 1) {
		navIsOver = true;  // 20080122 declara value
		navColor.style.color = '#003B7F';
		
		var obj1 = obj[id].subSection;
		for (var j=0; j<obj1.length; j++) {
			var menuTxt = document.getElementById('menuTxt_'+id+'_'+j);
			menuTxt.style.color = '#FFFFFF';
		}
		
		var menuBg = document.getElementById('menuBg_'+id);
		menuBg.style.backgroundColor = color1;
		
	} else {
		navIsOver = false; // 20080122 declara value
		navColor.style.color = '#999999';
	}
}


function menuTxtOver(i, j, over, isSect) {
	var obj = sectionArray[i].subSection[j];
	
	var nav = document.getElementById(('menuTxtTd_'+i+'_'+j));
	
	var menuPic = document.getElementById('menuPic');
	var menuTxt = document.getElementById('menuTxt');
	var menuBox = document.getElementById('menuBox');
	
	if (over == 1) {
		if (!isSect)	nav.style.backgroundColor = color2;
		
		if (obj.menuTxt != "") { // 20080122 declare value
			menuPic.src = menuImgPath+'pic_'+obj.id+'.gif';
			menuTxt.innerHTML = '<span class="menu_title">' + obj.name + '</span><br>' + obj.menuTxt;
			menuBox.style.visibility = 'visible';
		} else {
			if (menuBox.style.visibility != 'hidden') {
				menuPic.src = imgPath+'spacer.gif';
				menuTxt.innerHTML = "";
				menuBox.style.visibility = 'hidden';
			}
		}
	} else {
		if (!isSect)	nav.style.backgroundColor = '';
		if (menuBox.style.visibility != 'hidden') {
			menuPic.src = imgPath+'spacer.gif';
			menuTxt.innerHTML = "";
			menuBox.style.visibility = 'hidden';
		}
	}
}


function menuBgOver(id) {
	var obj = sectionArray;
	
	for (var i=0; i<obj.length; i++) {
		var menuBg = document.getElementById('menuBg_'+i);
		menuBg.style.backgroundColor = '';
		
		var obj1 = obj[i].subSection;
		for (var j=0; j<obj1.length; j++) {
			var menuTxt = document.getElementById('menuTxt_'+i+'_'+j);
			menuTxt.style.color = '#002E65';
		}
	}
	
	var obj1 = obj[id].subSection;
	for (var j=0; j<obj1.length; j++) {
		var menuTxt = document.getElementById('menuTxt_'+id+'_'+j);
		menuTxt.style.color = '#FFFFFF';
	}
	
	var menuBg = document.getElementById('menuBg_'+id);
	menuBg.style.backgroundColor = color1;
	
}


var goSpeed = 1;
var speed;
var goStep;
var timeOut;
var objTop;
var tempTop;
var layer;
var menuMask;


function menuGo(over, motion) {
	layer = document.getElementById('navMenu');
	menuMask = document.getElementById('menuMask');
	
	if (over) {
		if (layer)	layer.style.visibility = 'visible';
		
		if (navigator.appName.indexOf("Microsoft") > -1) {
			tempTop = -3;
			speed = 10;
			pulldownMotion();
		} else {
			layer.style.top = -3 + 'px';
		}
		menuMask.style.height = menuH + 'px';
		
		menuHideSelect(layer, true);
	} else {
		if (navIsOver)	return; // 20080122 added condition
		if (navigator.appName.indexOf("Microsoft") > -1) {
			tempTop = -menuH;
			speed = 4;
			timeOut = setTimeout('pulldownMotion();', 200);
		} else {
			layer.style.visibility = 'hidden';
			layer.style.top = -menuH + 'px';
			menuMask.style.height = 1 + 'px';
		}
		
		var menuBox = document.getElementById('menuBox');
		if (menuBox.style.visibility != 'hidden')	menuBox.style.visibility = 'hidden';
		
		menuHideSelect(layer, false);
	}
}


function layerOff() {
	layer.style.visibility = 'hidden';
}


function pulldownMotion() {
	objTop = Number(layer.style.pixelTop);
	
	goStep = (tempTop - objTop)/speed;
	
	if (objTop - tempTop > 1 | objTop - tempTop < -1) {
		objTop += goStep;
		timeOut = setTimeout("pulldownMotion()", goSpeed);
	} else {
		objTop = tempTop;
		clearTimeout(timeOut);
	}
	
	layer.style.pixelTop = objTop;
}


function genTop() {
	tempHtml = '';
	genNav();
	
	document.getElementById("topNav").innerHTML = tempHtml;
}



function genAllMenuLink(i, p, t) {
/*	if (i.indexOf('http') > -1) {
		var link = i;
	} else {
		var link = path + i;
	}*/
	var link = i;
	
	switch (p)
		{
			case "0":
//Added By DCHK 20100719 start
				//link = "javascript:window.parent.location.href = '" + link + "';";
				link = "javascript:goLink(\'" + link + "\');";
//Added By DCHK 20100719 end
				break;
			case "1":
				link = "javascript:NewWindowS(\'" + link + "\',\'" + t + "\',770, 550, 1,0);";
				break;
			case "2":
				link = 'javascript:popupLinkNW(\'' + link + '\',\'' + t +'\');';
				break;
		}
	
	return link;
}


//Added By DCHK 20100719 start
function goLink(link)
{
	window.top.location.href = link;
}
//Added By DCHK 20100719 end


function menu(name, id,link,target,popup,menuTxt,subSection)
{
	this.name = (name)?name:"";
	
	this.id = (id)?id:"";
	this.link = (link)?link:"";
	this.target = (target)?target:"";
	this.popup = (popup)?popup:"0";
	this.menuTxt = (menuTxt)?menuTxt:"";
	this.subSection = (subSection)?subSection:new Object();				
}



	function genMenuObject(url) {	
	 if (document.getElementById)
		{
			var x = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(); 

		}
	if (x)
		{
			x.onreadystatechange = function()
			{
				if (x.readyState == 4 && x.status == 200)
				{			
				
					var root = x.responseXML.getElementsByTagName('nav').item(0);
					var section = root.getElementsByTagName('section');	
					for (var i=0; i< section.length; i++)
						{
						
						var name = section.item(i).getElementsByTagName('sectionName').item(0).firstChild.data;	
						var id = section.item(i).getElementsByTagName('secionId').item(0).firstChild.data;
						var link = section.item(i).getElementsByTagName('sectionLink').item(0).firstChild.data;
						var target=section.item(i).getElementsByTagName('sectionTarget').item(0).firstChild.data;
						var popup=section.item(i).getElementsByTagName('sectionPopup').item(0).firstChild.data;
						
						subSection=section.item(i).getElementsByTagName('subSection');
						var subSectionArray=new Array();							
						for(var j=0;j<subSection.length;j++){
						
							var subSection_tmp = subSection[j];
	
							var subSectionName=subSection_tmp.getElementsByTagName("name")[0].firstChild.data;
						
							var subSectionId=subSection_tmp.getElementsByTagName("id")[0].firstChild.data;
							
							var subSectionLink=subSection_tmp.getElementsByTagName("link")[0].firstChild.data;
							
							var subSectiontarget=subSection_tmp.getElementsByTagName("target")[0].firstChild.data;
							
							var subSectionPopup=subSection_tmp.getElementsByTagName("popup")[0].firstChild.data;
				
							var temp = subSection_tmp.getElementsByTagName("menuTxt")[0].firstChild;
							var subSection_menuTxt = (temp==null)?temp:temp.data;
							
							subSectionArray[j]=new menu(subSectionName,subSectionId,subSectionLink,subSectiontarget,subSectionPopup,subSection_menuTxt, null);
						}
						sectionArray[i]=new menu(name,id,link,target,popup,null,subSectionArray);
					 }
						
				
					genTop();
// 20080122 start					
					var menuTD = document.getElementById('menuTD');
					menuH = menuTD.scrollHeight + 50;
					
					var styles = root.getElementsByTagName('style');
					var attrs = ["left", "top", "height", "width"];
				
					for (var n=0; n< styles.length; n++)
						{
							var nodes = styles[n].childNodes;
							for (var i=0; i<nodes.length; i++)
								{
									var node = nodes[i];
									if (node.nodeName == "#text") continue;
									var sitem = document.getElementById(node.nodeName);
									var temp = "";
									for (var att in attrs)
										{
											sitem.style[attrs[att]] = node.getAttribute(attrs[att]);
										}
								}
						}
					
					var menuBox = document.getElementById('menuBox');
					var tempH;
					if (navigator.appName.indexOf("Microsoft") > -1) {
						tempH = Number(menuBox.style.pixelHeight);
					} else {
						var tempH = menuBox.style.height;
						tempH = Number(tempH.substring(0, (tempH.length-2))) + 5;
					}
					menuBox.style.top =  menuTD.scrollHeight - tempH + "px";
					
				//	mvqPDiv = document.getElementById("navMenu");
				//	mvqPStyle = mvqPDiv.style;
				}
			}
			
			x.open("GET", url, true);
			x.send(null);
			}		
	
	 }

var tempStr = "";

function popupLinkNW(mypage, n) {
	winprops = '';
	win = window.open(mypage, n, winprops);
	win.self.focus();
}

function NewWindowS(mypage, myname, menuW, h, scroll,resizable) {
	var winl = (screen.width - menuW) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+menuW+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable='+resizable+','
	win = window.open(mypage, myname, winprops)
	win.self.focus()
	//if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
}
