var tempHtml;
var tempStr1;
var tempStr2;
var tempStr3;
if (betSection == null)	var betSection = null;
if (betId == null)	var betId = null;
if (toolId0 == null)	var toolId0 = null;
if (toolId1 == null)	var toolId1 = null;
if (toolId2 == null)	var toolId2 = null;
var betToolPulldownW = 130;
var mainBetArray = new Array();
var betToolsArray = new Array();
var betTypesArray = new Array();

function getSection()
{
	var tmpPath = location.href.toString();
	for (var i=0; i<mainBetArray.length; i++)
	{
		if (tmpPath.indexOf("/" + mainBetArray[i].id + "/") > -1)
		{
			betSection = mainBetArray[i].id;
			betId = i;
			break;
		}
	}
	
	if (betSection) {
		var obj = betTypesArray[betId];
		for (var i=0; i<obj.length; i++)
		{
			var obj1 = obj[i].subSection;
			for (var j=0; j<obj1.length; j++)
			{
				if (obj1[j].link == "#")	continue;
				var temp = obj1[j].link.substring(0, (obj1[j].link.length));
			//	var temp = obj1[j].link.substring(0, (obj1[j].link.length-4));
				
				if (tmpPath.indexOf(temp) > -1)
				{
					toolId1 = i;
					toolId2 = j;
					break;
				}
			}
		}
		
		// Added at 12:42 12/2/2008
		var obj = betToolsArray[betId];
		for (var i=0; i<obj.length; i++)
		{
			if (obj[i].link == "#")	continue;
			var temp = obj[i].link.substring(0, (obj[i].link.length));
			
			if (tmpPath.indexOf(temp) > -1)
			{
				toolId0 = i;
				break;
			}
		}
		//alert(toolId0);
	}
//	alert("toolId1: "+toolId1+"  :  toolId2:"+toolId2);
}

getSection();


function genTopMenus() {
}


function changeTitle()
{
}

function genBettingToolbar() {
	var obj = betToolsArray[betId];
	var total = obj.length;
	
	tempHtml = '';
	tempHtml += '<div id="bettingToolbar">';
	tempHtml += '	<table width="776" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '		<tr>';
	tempHtml += '			<td width="6" class="shadowLeft"><img src="images/spacer.gif" width="6" height="1"></td>';
	tempHtml += '			<td width="764" style="padding:7px 7px 0px 7px;" bgcolor="#FFFFFF">';
	tempHtml += '				<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '					<tr>';
	tempHtml += '						<td class="toolbarLine">';
	tempHtml += '							<table width="100%" border="0" cellspacing="0" cellpadding="0" height="37" class="toolbarBg">';
	tempHtml += '								<tr>';
	
	
	for (var i=0; i<total; i++) {
		
		// Pulldown starts
		if (obj[i].subSection) {
			var obj1 = obj[i].subSection;
			
			if (obj[i].layerPos && obj[i].layerPos == "right") {
				temlStr1 = "right:0px; text-align:right;";
				tempHtml += '<td align="right">';
			} else {
				temlStr1 = "left:0px;";
				tempHtml += '<td>';
			}
			
			tempHtml += '<div style="position:relative;">';
			tempHtml += '	<div style="width:'+betToolPulldownW+'px; position:absolute; visibility:hidden; top:15px; '+temlStr1+'" id="betToolsMenu_'+i+'" onMouseOver="betToolsMenuOver('+i+', 1);" onMouseOut="betToolsMenuOver('+i+', 0);">';
			tempHtml += '		<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			tempHtml += '			<tr>';
			tempHtml += '				<td class="toolbarPulldown">';
			tempHtml += '					<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			
			for (var j=0; j<obj1.length; j++) {
				tempHtml += '<tr valign="top">';
				tempHtml += '<td class="pulldownArrow"><img src="/'+betSection+'/info/images/arrow.gif" width="4" height="5"></td>';
				tempHtml += '<td width="100%" class="pulldownTxt"><a href="'+genLink(obj[i].link)+'" target="'+obj[i].target+'" class="pulldownTxt">'+obj1[j].name+'</a></td>';
				tempHtml += '</tr>';
			}
			
			tempHtml += '					</table>';
			tempHtml += '				</td>';
			tempHtml += '			</tr>';
			tempHtml += '		</table>';
			tempHtml += '	</div>';
			tempHtml += '</div>';
		} else {
			tempHtml += '<td>';
		}
		// Pulldown ends
		
		// Added at 12:42 12/2/2008
		if (toolId0 == i) {
			tempStr1 = 'toolbarTxtOn';
		} else {
			tempStr1 = 'toolbarTxt';
		}
		
		// Amended at 12:42 12/2/2008
		tempHtml += '<div align="center" onMouseOver="betToolsMenuOver('+i+', 1);" onMouseOut="betToolsMenuOver('+i+', 0);"><a href="'+genLink(obj[i].link)+'" target="'+obj[i].target+'" class="'+tempStr1+'" id="betToolsTxt_'+i+'">'+obj[i].name+'</a></div>';
		tempHtml += '</td>';
		
		
		if (i < (total - 1))	tempHtml += '<td width="1"><img src="/'+betSection+'/info/images/tool_line_v.gif" width="1" height="14"></td>';
		
	}
	
	
	tempHtml += '								</tr>';
	tempHtml += '							</table>';
	tempHtml += '						</td>';
	tempHtml += '					</tr>';
	tempHtml += '				</table>';
	tempHtml += '			</td>';
	tempHtml += '			<td width="6" class="shadowRight"><img src="images/spacer.gif" width="6" height="1"></td>';
	tempHtml += '		</tr>';
	tempHtml += '	</table>';
	tempHtml += '</div>';
	
	//document.getElementById("bettingToolbar").innerHTML = tempHtml;
	document.write(tempHtml);
}


function betToolsMenuOver(i, over) {
	if (!document.getElementById(('betToolsMenu_'+i)))	return;
	
	var menu = document.getElementById(('betToolsMenu_'+i));
	var txt = document.getElementById(('betToolsTxt_'+i));
	
	if (over) {
		if (menu.style.visibility == 'hidden') {
			menu.style.visibility = 'visible';
			menuHideSelect(menu, true);
			
			//Added at 18:25 14/2/2008
			//if (toolId0 != i) {
				//txt.className = '';				
				txt.style.textDecoration = 'none';
			//}
		}
	} else {
		if (menu.style.visibility == 'visible') {
			menu.style.visibility = 'hidden';
			menuHideSelect(menu, false);
			
			//Added at 18:25 14/2/2008
			if (toolId0 != i) {
				txt.className = 'toolbarTxt';
			}
		}
	}
}

function betToolsMenuOver2(i, over) {
	if (!document.getElementById(('betToolsMenu_'+i)))	return;
	
	var menu = document.getElementById(('betToolsMenu_'+i));
	var txt = document.getElementById(('betToolsTxt_'+i));
	
	if (over) {
		if (menu.style.visibility == 'hidden') {
			menu.style.visibility = 'visible';
			menuHideSelect(menu, true);
			
			//Added at 18:25 14/2/2008
			//if (toolId0 != i) {
				//txt.className = '';				
				txt.style.textDecoration = 'none';
			//}
		}
	} else {	
		if (menu.style.visibility == 'visible') {
			menu.style.visibility = 'hidden';
			menuHideSelect(menu, false);
			
			//Added at 18:25 14/2/2008
			//if (toolId0 != i) {
			//	txt.className = 'toolbarTxt';
			//}
		}		
	}
}

var isIpad = /(iPad)/g.test(navigator.userAgent);
// ios >= 8
var IOSGT8 = false;
if (isIpad) {
	var v = (navigator.userAgent).match(/OS (\d+)_(\d+)_?(\d+)?/);
	v = parseInt(v[1], 10);
	if (v >= 8) {
		IOSGT8 = true;
	}
}
var hid = false;
var mouseDownItem = null;
var blurItem = null;
function betToolsMenuMouseDown(event) {
    if (isIpad && !IOSGT8) {
        return;
    }
    mouseDownItem = $(event.target || event.srcElement).closest("td[bettingmenuitem]").attr("bettingmenuitem");
}

function betToolsMenuClick(event) {
    betToolsMenuFocus(event);
    mouseDownItem = null;
}

function betToolsMenuBlur(event) {
    if (isIpad && !IOSGT8) {
        if (event.type == "blur") {
            blurItem = $(event.target || event.srcElement).closest("td[bettingmenuitem]").attr("bettingmenuitem");
            delayedHideAllBettingMenus();
        }
    } else {
        if ($(event.target || event.srcElement).closest("td[bettingmenuitem]").attr("bettingmenuitem") != mouseDownItem) {
            hideAllBettingMenus();
        }
    }
}

function betToolsMenuFocus(event) {
    var el = $(event.target || event.srcElement);
    el.closest("td[bettingmenuitem]").focus();
    var i = el.closest("td[bettingmenuitem]").attr("bettingmenuitem");
    if (!document.getElementById(('betToolsMenu_' + i))) return;

    var menu = document.getElementById(('betToolsMenu_' + i));
    var txt = document.getElementById(('betToolsTxt_' + i));
    $(txt).addClass("hovered");

    if (menu.style.visibility == 'hidden') {
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.returnValue = false;
        }
        menu.style.visibility = 'visible';
        menuHideSelect(menu, true);
        txt.style.textDecoration = 'none';
    }
}

function delayedHideAllBettingMenus(except) {
    hid = false;
    setTimeout(
		function() {
		    if (!hid) {
		        hideAllBettingMenus(except);
		        hid = true;
		        blurItem = null;
		    }
		},
		500
	);
}

function hideAllBettingMenus(except) {
    var visibleMenus = $("[id^=betToolsMenu_]:visible").filter(function() {
        return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none');
    });

    for (var i = 0; i < visibleMenus.length; ++i) {
        var menu = visibleMenus[i];
        if (typeof except != "undefined" && $(menu).attr("id").split("_")[1] == except) continue;

        menu.style.visibility = 'hidden';
        menuHideSelect(menu, false);

        var txt = $(menu).closest("td[bettingmenuitem]").find("[id^=betToolsTxt_]");
        txt.removeClass("hovered");
    }
}

if (isIpad) {
	var isMove = false;
	document.ontouchmove = function(event) {
		isMove = true;
		hid = true;
		blurItem = null;
	}
	if (IOSGT8)
	{
		document.ontouchend = function(event) {
			var el = $(event.target);
			if (!isMove && el.closest("td[bettingmenuitem]").length == 0) {
				hideAllBettingMenus();
				hid = true;
				blurItem = null;
			} else if (el.closest("td[bettingmenuitem]").length > 0) {
				hid = true;
				blurItem = null;
			}
			isMove = false;
			mouseDownItem = null;
		}
	} else {
		document.ontouchend = function(event) {
			var el = $(event.target);
			if (!isMove && el.closest("td[bettingmenuitem]").length == 0 || el.closest("td[bettingmenuitem]").attr("bettingmenuitem") != blurItem) {
				hideAllBettingMenus();
				hid = true;
				blurItem = null;
			} else if (el.closest("td[bettingmenuitem]").length > 0 && el.closest("td[bettingmenuitem]").attr("bettingmenuitem") == blurItem) {
				hid = true;
				blurItem = null;
			}
			isMove = false;
			mouseDownItem = null;
		}
	}
}

function genLink(i) {
	if (i.indexOf('http') > -1) {
		var link = i;
	} else if (i.indexOf('javascript') > -1) {
		var link = i;
	} else {
		var link = path + i;
	}
	
	return link;
}

/*function genBetType() {
	tempHtml = '';
	tempHtml += '<div id="betTypes">';
	tempHtml += '</div>';
	document.write(tempHtml);
}*/


function genBetType() {
	var obj = betTypesArray[betId];
	var total = obj.length;
	tempHtml = '';
	
	tempHtml += '	<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	
	
	for (var i=0; i<total; i++) {
		tempHtml += '		<tr>';
		tempHtml += '			<td class="title" colspan="3" style="padding:7px 0px 7px 3px;"><strong>'+obj[i].name+'</strong></td>';
		tempHtml += '		</tr>';
		
		var obj1 = obj[i].subSection;
		for (var j=0; j<obj1.length; j++) {
			
			if (obj1[j].icon) {
				tempStr1 = '';
			} else {
				tempStr1 = 'colspan="2"';
			}
			
			if (toolId1 == i && toolId2 == j) {
				tempStr2 = 'leftNavOver';
				tempStr3 = 'class="leftBg"';
			} else {
				tempStr2 = 'leftNav';
				tempStr3 = '';
			}
			
			tempHtml += '<tr>';
			tempHtml += '<td colspan="3" '+tempStr3+' onMouseOver="leftOver('+i+', '+j+', 1)" onMouseOut="leftOver('+i+', '+j+', 0)" onClick="location.href=\''+genLink(obj1[j].link)+'\'" style="cursor:pointer;">';
			tempHtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			
			tempHtml += '<tr valign="top">';
			tempHtml += '	<td class="leftNavArrow"><img src="/'+betSection+'/info/images/arrow.gif" width="4" height="5"></td>';
			
			tempHtml += '	<td width="100%" class="leftNav" '+tempStr1+'><a href="'+genLink(obj1[j].link)+'" target="'+obj1[j].target+'" class="'+tempStr2+'" id="leftTxt_'+i+'_'+j+'">'+obj1[j].name+'</a></td>';
			
			if (obj1[j].icon) {
				tempHtml += '	<td width="1%" align="right" style="padding:8px 5px 0px 0px;">'+obj1[j].icon+'</td>';
			}
			tempHtml += '</tr>';
			tempHtml += '</table>';
			
			tempHtml += '</td>';
			tempHtml += '</tr>';
		}
		
		tempHtml += '		<tr>';
		tempHtml += '			<td colspan="3"><img src="images/spacer.gif" height="10"></td>';
		tempHtml += '		</tr>';
	}
	
	
	tempHtml += '	</table>';
	
	document.write(tempHtml);
//	document.getElementById("betTypes").innerHTML = tempHtml;
}


function leftOver(i, j, over) {
	if (toolId1 == i && toolId2 == j)	return;
	var leftTxt = document.getElementById(('leftTxt_'+i+'_'+j));
	
	if (over) {
		leftTxt.className = 'leftNavOver';
	} else {
		leftTxt.className = 'leftNav';
	}
}


function genToolbarOject(url) {
	changeTitle();
//	setBettingToolbar();
//	setBetType();
}

function changeClass(obj, class_name) {
	var leftTxt = document.getElementById(obj)
	leftTxt.className = class_name
}
