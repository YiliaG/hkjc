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
mainBetArray = [
{name:"賽馬", id:"racing", link:"/racing/index.asp", target:"_self", color:"#4A8CC1"},
{name:"足智彩", id:"football", link:"/football/index.asp", target:"_self", color:"#65AB3B"},
{name:"六合彩", id:"marksix", link:"/marksix/index.asp", target:"_self", color:"#CC2C2C"}
]
var mainColor = "#FFDE00";


var betToolsArray = new Array();

//Racing
betToolsArray[0] = [

{name:"報名表", id:"", link:"#", target:"_self"},

{name:"排位表", id:"", link:"#", target:"_self"},

{name:"賽期表", id:"", link:"#", target:"_self"},

{name:"參考資料", id:"", link:"#", target:"_self", layerPos:"left", subSection:[
	{name:"更易事項", link:"#", target:"_self"}
]},

{name:"騎師王資料", id:"", link:"#", target:"_self", layerPos:"left", subSection:[
	{name:"騎師王統計", link:"#", target:"_self"},
	{name:"騎師分場表", link:"#", target:"_self"}
]},

{name:"賽果及派彩", id:"", link:"results.asp", target:"_self", layerPos:"left", subSection:[
	{name:"即日賽果及派彩", link:"results.asp", target:"_self"},
	{name:"所有賽果及派彩", link:"#", target:"_self"},
	{name:"回扣計算機", link:"javascript:popupCal('/calculator/rebatecalculator/cal.asp','734', '502');", target:"_self"}
]},

{name:"分析工具", id:"", link:"#", target:"_self", layerPos:"left", subSection:[
	{name:"貼士指數", link:"#", target:"_self"},
	{name:"智易表", link:"#", target:"_self"},
	{name:"速勢系統", link:"#", target:"_self"}
]},

{name:"投注彩池 / 種類", id:"", link:"#", target:"_self", layerPos:"left", subSection:[
	{name:"平分彩金彩池", link:"#", target:"_self"},
	{name:"固定賠率投注種類", link:"#", target:"_self"},
	{name:"注數表", link:"#", target:"_self"}
]},

{name:"回扣", id:"", link:"#", target:"_self", layerPos:"right", subSection:[
	{name:"回扣", link:"#", target:"_self"},
	{name:"回扣計算機", link:"javascript:popupCal('/calculator/rebatecalculator/cal.asp','734', '502');", target:"_self"}
]}

];

//Football
betToolsArray[1] = [

{name:"賽程表", id:"", link:"/football/schedule/schedule.asp", target:"_self", layerPos:"left", subSection:[
	{name:"受注球賽", link:"/football/schedule/schedule.asp", target:"_self"},
	{name:"暫定受注球賽", link:"/football/schedule/pre_schedule.asp", target:"_self"},
	{name:"受注時間", link:"javascript:popupWin('http://jcew.dcthink.com/football/info/ch/bet_sellinghours.asp','734', '532');", target:"_self"}
]},

{name:"賽果 / 派彩", id:"", link:"/football/results/results.asp", target:"_self", layerPos:"left", subSection:[
	{name:"球賽結果", link:"/football/results/results.asp", target:"_self"},
	{name:"孖寶半全膽派彩", link:"/football/results/dhcp_results.asp", target:"_self"},
	{name:"6寶半全場派彩", link:"/football/results/hfmp_results.asp", target:"_self"},
	{name:"首名入球結果", link:"/football/results/fgs_results.asp", target:"_self"},
	{name:"冠軍賽果", link:"/football/results/chpres.asp", target:"_self"},
	{name:"非洲國家盃", link:"/football/results/tournres_africa.asp", target:"_self"},
	{name:"歐洲國家盃外圍賽", link:"/football/results/tournres_euro.asp", target:"_self"},
	{name:"歐洲聯賽冠軍盃", link:"/football/results/tournres_ue.asp", target:"_self"},
	{name:"下一隊入球", link:"/football/results/nts_results.asp", target:"_self"},
	{name:"派彩時間", link:"#", target:"_self"},
	{name:"特別項目結果", link:"/football/results/special_results.asp", target:"_self"}
]},

{name:"過關/計算機", id:"", link:"javascript:popupCal('/football/inc/div_cal.asp','534', '393');", target:"_self", layerPos:"left", subSection:[
	{name:"過關計算機", link:"javascript:popupCal('/football/inc/div_cal.asp','534', '393');", target:"_self"},
	{name:"過關方式及組合", link:"javascript:popupWin('/football/info/ch/betting/bet_six.asp','727', '500');", target:"_self"},
	{name:"投注計算機", link:"javascript:popupCal('/football/info/ch/betting/calulator/invest_calc.asp','803', '269');", target:"_self"}
]},

{name:"足智資料庫", id:"", link:"#", target:"_self", layerPos:"left", subSection:[
	{name:"直播時間表", link:"#", target:"_self"},
	{name:"對賽往績", link:"#", target:"_self"},
	{name:"數據中心", link:"#", target:"_self"},
	{name:"足智新聞", link:"#", target:"_self"},
	{name:"大戰當前", link:"#", target:"_self"}
]},

{name:"投注種類", id:"", link:"javascript:popupWin('http://jcew.dcthink.com/football/info/ch/betting/bettypes.asp','770', '550');", target:"_self", layerPos:"left", subSection:[
	{name:"投注種類", link:"javascript:popupWin('http://jcew.dcthink.com/football/info/ch/betting/bettypes.asp','770', '550');", target:"_self"},
	{name:"博彩規例", link:"javascript:popupWin('http://jcew.dcthink.com/football/info/ch/betting/betrules.asp','770', '500');", target:"_self", target:"_self"}
]}

];


//MarkSix
betToolsArray[2] = [

{name:"核對中獎號碼", id:"", link:"/marksix/checking.asp", target:"_self"},

{name:"過去攪珠結果", id:"", link:"/marksix/results.asp", target:"_self"},

{name:"攪珠日期表", id:"", link:"/marksix/userinfo.asp?file=fixtures.asp", target:"_self"},

{name:"六合彩計算機", id:"", link:"javascript:popupCal('/marksix/info/ch/calculator/calculator_mark6.asp','334', '163');", target:"_self"},

{name:"攪珠結果統計", id:"", link:"/marksix/lotterystat1.asp", target:"_self", layerPos:"left", subSection:[
	{name:"攪珠結果統計", link:"/marksix/lotterystat1.asp", target:"_self"},
	{name:"幸運投注處", link:"/marksix/userinfo.asp?file=lucky_ocbs.asp", target:"_self"}
]},

{name:"六合彩指南", id:"", link:"/marksix/userinfo.asp?file=about_m6.asp", target:"_self", layerPos:"right", subSection:[
	{name:"六合彩簡介", link:"/marksix/userinfo.asp?file=about_m6.asp", target:"_self"},
	{name:"獲獎資格", link:"/marksix/userinfo.asp?file=prize_entitlement.asp", target:"_self"},
	{name:"獎金基金的分配", link:"/marksix/userinfo.asp?file=prizes_fund.asp", target:"_self"},
	{name:"六合彩金多寶攪珠", link:"/marksix/userinfo.asp?file=sb_adv_sales.asp", target:"_self"},
	{name:"注項種類", link:"/marksix/userinfo.asp?file=multiple_banker.asp", target:"_self"},
	{name:"複式/膽拖注數表", link:"/marksix/userinfo.asp?file=chance.asp", target:"_self"},
	{name:"連續多期攪珠", link:"/marksix/userinfo.asp?file=mul_con_draws.asp", target:"_self"},
	{name:"核對獎券彩票機印", link:"/marksix/userinfo.asp?file=ticket_validation.asp", target:"_self"},
	{name:"重要事項", link:"/marksix/userinfo.asp?file=important_notice.asp", target:"_self"},
	{name:"獎券規例", link:"/marksix/userinfo.asp?file=rules.asp", target:"_self"}
]}

];


var betTypesArray = new Array();

//Racing
betTypesArray[0] = [

{name:"賠率", subSection:[
	{name:"過關/<br>混合過關", id:"", link:"/racing/odds_xpool.asp", target:"_self", icon:"<img src='/racing/info/images/ch/rebate.gif' title='回扣' align='absmiddle'>"},
	{name:"獨贏/位置", id:"", link:"/racing/odds_wp.asp", target:"_self", icon:"<img src='/racing/info/images/ch/rebate.gif' title='回扣' align='absmiddle'>"},
	{name:"連贏/位置Q", id:"", link:"/racing/odds_wpq.asp", target:"_self", icon:"<img src='/racing/info/images/ch/rebate.gif' title='回扣' align='absmiddle'>"},
	{name:"三重彩", id:"", link:"/racing/odds_tce.asp", target:"_self", icon:""},
	{name:"單T", id:"", link:"/racing/odds_tri.asp", target:"_self", icon:""},
	{name:"四連環", id:"", link:"/racing/odds_ff.asp", target:"_self", icon:""},
	{name:"孖寶", id:"", link:"/racing/odds_dbl.asp", target:"_self", icon:""},
	{name:"三寶", id:"", link:"/racing/odds_tbl.asp", target:"_self", icon:""},
	{name:"孖T", id:"", link:"/racing/odds_dt.asp", target:"_self", icon:""},
	{name:"三T", id:"", link:"/racing/odds_tt.asp", target:"_self", icon:""},
	{name:"六環彩", id:"", link:"/racing/odds_6up.asp", target:"_self", icon:""},
	{name:"騎師王", id:"", link:"/racing/odds_challenge.asp", target:"_self", icon:"<img src='/racing/info/images/ch/new.gif' title='新' align='absmiddle'>"},
	{name:"騎練配對", id:"", link:"/racing/filtertool.asp", target:"_self", icon:""},
	{name:"獨贏賠率走勢", id:"", link:"/racing/odds_pwin.asp", target:"_self", icon:""},
	{name:"投注額", id:"", link:"/racing/turnover.asp", target:"_self", icon:""}
]}

];

//Football
betTypesArray[1] = [

{name:"賠率", subSection:[
	{name:"即場投注", id:"", link:"/football/odds/odds_inplay.asp", target:"_self", icon:""},
	{name:"即場特別項目", id:"", link:"/football/odds/odds_inplay_special.asp", target:"_self", icon:""},
	{name:"過關/混合過關", id:"", link:"/football/odds/odds_mixallup.asp", target:"_self", icon:""},
	{name:"主客和", id:"", link:"/football/odds/odds_had.asp", target:"_self", icon:""},
	{name:"半場主客和", id:"", link:"/football/odds/odds_fha.asp", target:"_self", icon:""},
	{name:"讓球主客和", id:"", link:"/football/odds/odds_hha.asp", target:"_self", icon:""},
	{name:"讓球", id:"", link:"/football/odds/odds_hdc.asp", target:"_self", icon:""},
	{name:"入球大細", id:"", link:"/football/odds/odds_hil.asp", target:"_self", icon:""},
	{name:"波膽", id:"", link:"/football/odds/odds_crs.asp", target:"_self", icon:""},
	{name:"半全場", id:"", link:"/football/odds/odds_hft.asp", target:"_self", icon:""},
	{name:"總入球", id:"", link:"/football/odds/odds_ttg.asp", target:"_self", icon:""},
	{name:"入球單雙", id:"", link:"/football/odds/odds_ooe.asp", target:"_self", icon:""},
	{name:"首名入球", id:"", link:"/football/odds/odds_fgs.asp", target:"_self", icon:""},
	{name:"特別項目", id:"", link:"/football/odds/odds_special.asp", target:"_self", icon:"<img src='/football/info/images/ch/new.gif' title='新' align='absmiddle'>"},
	{name:"孖寶半全膽", id:"", link:"/football/odds/odds_dhcp.asp", target:"_self", icon:""},
	{name:"6寶半全場", id:"", link:"/football/odds/odds_hfmp.asp", target:"_self", icon:""},
	{name:"歐洲國家盃", id:"", link:"/football/odds/tournament.asp", target:"_self", icon:"<img src='/football/info/images/ch/cup.gif' title='盃賽' align='absmiddle'>"},
	{name:"歐洲聯賽<br>冠軍盃", id:"", link:"/football/odds/tournament_ue.asp", target:"_self", icon:"<img src='/football/info/images/ch/cup.gif' title='盃賽' align='absmiddle'>"},
	{name:"冠軍", id:"", link:"/football/odds/odds_chp.asp", target:"_self", icon:""},
	{name:"小組首名", id:"", link:"#", target:"_self", icon:""},
	{name:"小組一二名", id:"", link:"#", target:"_self", icon:""},
	{name:"神射手", id:"", link:"#", target:"_self", icon:""},
	{name:"晉級隊伍", id:"", link:"/football/odds/odds_qualify.asp", target:"_self", icon:""},
	{name:"所有賠率", id:"", link:"/football/odds/odds_allodds.asp", target:"_self", icon:""}
]}

];

//MarkSix
betTypesArray[2] = [

{name:"下期攪珠 ", subSection:[
	{name:"自選單式", id:"", link:"/marksix/single.asp", target:"_self", icon:""},
	{name:"自選複式", id:"", link:"/marksix/multiple.asp", target:"_self", icon:""},
	{name:"自選膽拖", id:"", link:"/marksix/banker.asp", target:"_self", icon:""},
	{name:"運財號碼", id:"", link:"/marksix/random.asp", target:"_self", icon:""}
]},

{name:"金多寶", subSection:[
	{name:"自選單式", id:"", link:"/marksix/single_snowball.asp", target:"_self", icon:""},
	{name:"自選複式", id:"", link:"/marksix/multiple_snowball.asp", target:"_self", icon:""},
	{name:"自選膽拖", id:"", link:"/marksix/banker_snowball.asp", target:"_self", icon:""},
	{name:"運財號碼", id:"", link:"/marksix/random_snowball.asp", target:"_self", icon:""}
]}

];


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
			if (obj[i].subSection)
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
			
			if (obj[i].subSection)
			{
				var obj1 = obj[i].subSection;
				for (var j=0; j<obj1.length; j++)
				{
					if (obj1[j].link == "#")	continue;
					var temp = obj1[j].link.substring(0, (obj1[j].link.length));
					
					if (tmpPath.indexOf(temp) > -1)
					{
						toolId0 = i;
						break;
					}
				}
			}
		}
	}
//	alert("toolId1: "+toolId1+"  :  toolId2:"+toolId2);
}

getSection();


function genTopMenus() {
	var obj = mainBetArray;
	var total = obj.length;
	tempHtml = '';
	
	tempHtml += '<div id="topMenus">';
	tempHtml += '	<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '		<tr>';
	tempHtml += '			<td style="padding:11px 5px 0px 5px;">';	
	tempHtml += '				<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:url(images/topNav_bg.gif) repeat-x bottom;">';
	tempHtml += '					<tr>';
//	tempHtml += '						<td width="2" style="padding:0px 6px 0px 15px;" class="topMenu"><img src="images/pt_blue.gif" width="2" height="2"></td>';
	tempHtml += '						<td width="43" style="padding:0px 0px 0px 15px;"><a href="#" class="topMenu">English</a></td>';
//	tempHtml += '						<td width="2" style="padding:0px 8px 0px 0px;" class="topMenu"><img src="images/pt_blue.gif" width="2" height="2"></td>';
	tempHtml += '						<td width="45" style="padding:0px 0px 0px 15px;"><a href="#" class="topMenu">主 頁</a></td>';
	tempHtml += '						<td width="107"><a href="#" onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\'corporate\',\'\',\'images/ch/topmenu_corporate_over.gif\',1);"><img src="images/ch/topmenu_corporate_off.gif" name="corporate" width="107" height="28" border="0" title="馬會概況"></a></td>';
	tempHtml += '						<td width="1"><img src="images/topmenu_line_v.gif" width="1" height="11"></td>';
	tempHtml += '						<td width="107"><a href="#" onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\'hrc\',\'\',\'images/ch/topmenu_hrc_over.gif\',1);"><img src="images/ch/topmenu_hrc_off.gif" name="hrc" width="107" height="28" border="0" title="賽馬資訊"></a></td>';
	tempHtml += '						<td width="1"><img src="images/spacer.gif" width="1" height="11"></td>';
	tempHtml += '						<td width="107"><a href="/default.asp" onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\'bet\',\'\',\'images/ch/topmenu_bet_on.gif\',1);"><img src="images/ch/topmenu_bet_on.gif" name="bet" width="107" height="28" border="0" title="博彩娛樂"></a></td>';
	tempHtml += '						<td width="1"><img src="images/spacer.gif" width="1" height="11"></td>';
	tempHtml += '						<td width="107"><a href="#" onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\'charity\',\'\',\'images/ch/topmenu_charity_over.gif\',1);"><img src="images/ch/topmenu_charity_off.gif" name="charity" width="107" height="28" border="0" title="慈善事務"></a></td>';
	tempHtml += '						<td width="1"><img src="images/topmenu_line_v.gif" width="1" height="11"></td>';
	tempHtml += '						<td width="107"><a href="#" onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\'member\',\'\',\'images/ch/topmenu_member_over.gif\',1);"><img src="images/ch/topmenu_member_off.gif" name="member" width="107" height="28" border="0" title="馬會會員"></a></td>';
	tempHtml += '						<td width="1"><img src="images/topmenu_line_v.gif" width="1" height="11"></td>';
	tempHtml += '						<td width="107"><a href="#" onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\'come\',\'\',\'images/ch/topmenu_come_over.gif\',1);"><img src="images/ch/topmenu_come_off.gif" name="come" width="107" height="28" border="0" title="進場觀賽"></a></td>';
	tempHtml += '						<td><img src="images/spacer.gif" width="1" height="1"></td>';
	tempHtml += '					</tr>';
	tempHtml += '				</table>';
	tempHtml += '			</td>';
	tempHtml += '		</tr>';
	tempHtml += '		<tr>';
	tempHtml += '			<td>';
	tempHtml += '				<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '					<tr valign="top">';
	tempHtml += '						<td width="6" style="background:url(images/shadow_l.gif) repeat-y right;"><img src="images/spacer.gif" width="6" height="1"></td>';
	tempHtml += '						<td width="750" bgcolor="#FFFFFF" style="padding:7px;">';
	tempHtml += '							<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '								<tr valign="top">';
	
	
	for (var i=0; i<total; i++) {
		if (i == betId) {
			tempStr1 = '_on';
			tempStr2 = '';
		} else {
			tempStr1 = '_off';
			tempStr2 = 'onMouseOut="MM_swapImgRestore();" onMouseOver="MM_swapImage(\''+obj[i].id+'\',\'\',\'images/ch/btn_'+obj[i].id+'_over.gif\',1);"';
		}
		
		tempHtml += '<td width="70" style="padding-right:1px;"><a href="'+genLink(obj[i].link)+'" target="'+obj[i].target+'" '+tempStr2+'><img src="images/ch/btn_'+obj[i].id+tempStr1+'.gif" title="'+obj[i].name+'" width="70" height="40" border="0" name="'+obj[i].id+'"></a></td>';
	}
	
	tempHtml += '<td align="right"><span class="date">16/11/07 14:00 (五)</span></td>';
	tempHtml += '								</tr>';
	tempHtml += '								<tr>';

	if (betId != null)
	{
		var color = obj[betId].color;
	}
	else
	{
		var color = mainColor;
	}
	
	tempHtml += '<td colspan="4" bgcolor="'+color+'"><img src="images/spacer.gif" width="1" height="3"></td>';
	tempHtml += '								</tr>';
	tempHtml += '							</table>';
	tempHtml += '						</td>';
	tempHtml += '						<td width="6" style="background:url(images/shadow_r.gif) repeat-y right;"><img src="images/spacer.gif" width="6" height="1"></td>';
	tempHtml += '					</tr>';
	tempHtml += '				</table>';
	tempHtml += '			</td>';
	tempHtml += '		</tr>';
	tempHtml += '	</table>';
	tempHtml += '</div>';
	
	document.write(tempHtml);
}


function changeTitle()
{
	try
	{
		var dt = "";
		switch (betSection)
		{
			case "racing":
				dt = "香港馬會賽馬博彩有限公司";
				break;
				
			case "football":
				dt = "香港馬會足球博彩有限公司";
				break;
				
			case "marksix":
				dt = "香港馬會獎券有限公司";
				break;
				
			case null:
				dt = "香港賽馬會";
				break;
		}

		top.document.title = dt;
	}
	catch (e) {
		setTimeout("changeTitle()", 500);
	}
}

/*function genBettingToolbar() {
	tempHtml = '';
	tempHtml += '<div id="bettingToolbar">';
	tempHtml += '</div>';
	document.write(tempHtml);
}*/

function genBettingToolbar() {
	var obj = betToolsArray[betId];
	var total = obj.length;
	
	tempHtml = '';
	tempHtml += '<div id="bettingToolbar">';
	tempHtml += '	<table width="776" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '		<tr>';
	tempHtml += '			<td width="6" class="shadowLeft"><img src="images/spacer.gif" width="6" height="1"></td>';
//	tempHtml += '			<td width="764" style="padding:7px 7px 0px 7px;" bgcolor="#FFFFFF">';
	tempHtml += '			<td width="764" style="padding:0px 7px 0px 7px;" bgcolor="#FFFFFF">';
	tempHtml += '				<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	tempHtml += '					<tr>';
	tempHtml += '						<td class="toolbarLine">';
	tempHtml += '							<table width="100%" border="0" cellspacing="0" cellpadding="0" height="24" class="toolbarBg">';
//	tempHtml += '							<table width="100%" border="0" cellspacing="0" cellpadding="0" height="37" class="toolbarBg">';
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
			tempHtml += '	<div style="width:'+betToolPulldownW+'px; position:absolute; visibility:hidden; top:18px; '+temlStr1+'" id="betToolsMenu_'+i+'" onMouseOver="betToolsMenuOver('+i+', 1);" onMouseOut="betToolsMenuOver('+i+', 0);">';
			tempHtml += '		<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			tempHtml += '			<tr>';
			tempHtml += '				<td class="toolbarPulldown">';
			tempHtml += '					<table width="100%" border="0" cellspacing="0" cellpadding="0">';
			
			for (var j=0; j<obj1.length; j++) {
				tempHtml += '<tr valign="top">';
				tempHtml += '<td class="pulldownArrow"><img src="/'+betSection+'/info/images/arrow.gif" width="4" height="5"></td>';
				tempHtml += '<td width="100%" class="pulldownTxt"><a href="'+genLink(obj1[j].link)+'" target="'+obj1[j].target+'" class="pulldownTxt">'+obj1[j].name+'</a></td>';
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
		tempHtml += '<div align="center" onMouseOver="betToolsMenuOver('+i+', 1);" onMouseOut="betToolsMenuOver('+i+', 0);" style="padding-top:3px;"><a href="'+genLink(obj[i].link)+'" target="'+obj[i].target+'" class="'+tempStr1+'" id="betToolsTxt_'+i+'">'+obj[i].name+'</a></div>';
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
			if (toolId0 != i) {
				txt.className = '';
				txt.style.textDecoration = 'none';
			}
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
			
			tempHtml += '	<td width="100%" class="leftNav" '+tempStr1+'><a href="'+genLink(obj1[j].link)+'" target="'+obj1[j].target+'" class="'+tempStr2+'" id="leftTxt_'+i+'_'+j+'">'+obj1[j].name+'</a>';
			
			if (obj1[j].icon) {
				tempHtml += ' ' + obj1[j].icon;
			}
			tempHtml += '</td>';
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