var dateArray = new Array;
/*
if (document.domain == "special.hongkongjockeyclub.com") {
	targetServer = "http://bettest.hongkongjockeyclub.com"
} else {
	if (document.domain == "special.qcew.com")
		targetServer = "http://bet.qcew.com"
	else
		targetServer = "http://bet.hkjc.com"
}
*/

  var tmp = window.location.href.substr(7) ;
  var SERVER_NAME = tmp.substr(0, tmp.indexOf("/")) ;
  var domainName = SERVER_NAME.substr(SERVER_NAME.indexOf(".")+1) ;
  document.domain = domainName;

  tmp = top.location.href.substr(7) ;
  targetServer = "http://" + tmp.substr(0, tmp.indexOf("/")) ;

var link = targetServer+'/marksix/Fixtures.aspx?';
var linkTarget = 'info';


function loadXML(url)
{
	var x;
	
	if (window.XMLHttpRequest) // Mozilla, Safari,...
	{
		x = new XMLHttpRequest();
		if (x.overrideMimeType)	x.overrideMimeType('text/xml');
	}
	else if (window.ActiveXObject) // IE
	{
		try
		{
			x = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				x = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)	{}
		}
	}
	
	if (x)
	{
		x.onreadystatechange = function()
		{
			if (x.readyState == 4 && x.status == 200)	genObj(x);
		};
		x.open('GET', url, true);
		x.send(null);
	}
}


function genObj(x)
{
	//Get Expiry Time
	var expiryTime = x.responseXML.getElementsByTagName('expiryTime').item(0);
	var drawTime = expiryTime.attributes.getNamedItem("draw").value;
	var jackpotTime = expiryTime.attributes.getNamedItem("jackpot").value;
	//alert(drawTime + "  :  " + jackpotTime);
	
	var root = x.responseXML.getElementsByTagName('drawDates').item(0);
	var drawYear = root.getElementsByTagName('drawYear');	
	var num = 0;
	
	for (var i=0; i<drawYear.length; i++)
	{
		var year = drawYear.item(i).attributes.getNamedItem("year").value;
		var drawMonth = drawYear.item(i).getElementsByTagName('drawMonth');
		
		for (var j=0; j<drawMonth.length; j++)
		{
			var month = drawMonth.item(j).attributes.getNamedItem("month").value;
			var jackpotTxt = drawMonth.item(j).getElementsByTagName('jackpotTxt')[0].getElementsByTagName("subTitle");
			var jackpotArray = new Array;
			
			for (var k=0; k<jackpotTxt.length; k++)
			{
				if (jackpotTxt[k].firstChild)
				{
					var data = jackpotTxt[k].firstChild.data;
					var dataDate = (data.substring(0, 1) == "0")?data.substring(1, 2):data.substring(0, 2);
					
					jackpotArray[k] = new Array();
					jackpotArray[k].date = dataDate;
					jackpotArray[k].name = data.substring(11, data.length);
				}
			}
			
			var drawDate = drawMonth.item(j).getElementsByTagName('drawDate');
			
			for (var k=0; k<drawDate.length; k++)
			{
				var a = drawDate.item(k).attributes;
				if (a.getNamedItem("draw").value == '1' | a.getNamedItem("jackpot").value == '1')
				{
					var date = a.getNamedItem("date").value;
					
					dateArray[num] = new Array();
					dateArray[num].year = year;
					dateArray[num].month = Number(month) - 1;
					dateArray[num].date = date;
					dateArray[num].jackpot = a.getNamedItem("jackpot").value;
					if (a.getNamedItem("jackpotExpiryTime"))
					{
						dateArray[num].time = a.getNamedItem("jackpotExpiryTime").value;
					}
					else
					{
						dateArray[num].time = (dateArray[num].jackpot == "1")?jackpotTime:drawTime;
					}
					
					for (var m=0; m<jackpotArray.length; m++)
					{
						if (jackpotArray[m].date == date)
						{
							dateArray[num].jackpotName = jackpotArray[m].name;
							continue;
						}
					}
					
					num ++;
				}
			}
		}
	}
	
	genNews();
}


function genNews()
{
	var today = new Date();
	//var today2 = new Date();
	//today.setHours(0);
	//today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);
	var drawDays = new Array();
	var jackpots = new Array();
	//alert(today.getTime() + "  :  " + today2.getTime());
	//var str = '';
	
	for (var i=0; i<dateArray.length; i++)
	{
		var year = dateArray[i].year;
		var month = dateArray[i].month;
		var date = dateArray[i].date;
		
		var time = dateArray[i].time.split(':');
		var tmpDate = new Date(year, month, date, Number(time[0]), (Number(time[1])-1), 0, 0);
		dateArray[i].day = tmpDate.getDay();
		//if (year == 2008 && month == 10)	str += (month+1) + "  :  " + date + "         " + tmpDate.getTime() + "  :  " + today.getTime() + "  :  " + dateArray[i].time + '\n';

		if (tmpDate.getTime() >= today.getTime())
		{
			drawDays.push(dateArray[i]);
			if (dateArray[i].jackpot == '1')	jackpots.push(dateArray[i]);
		}
	}
	//alert (str);
	
	document.getElementById('div_1').innerHTML = genTable(jackpots);	
	document.getElementById('div_2').innerHTML = genTable(drawDays);
	document.getElementById('div_3').innerHTML = gen3rdTable();
	
	checkHeight('div_1');
	checkHeight('div_2');
	checkHeight('div_3');
	
	if (jackpots.length == 0)	SubMenuClick(2, 'marksix');
}


function checkHeight(name)
{	
	var div = document.getElementById(name);
	var tr = div.getElementsByTagName('tr');
	var num = (tr.length - 1);
	//alert(tr.length)
	
	while (div.scrollHeight > div.offsetHeight)
	{
		tr[num].style.display = 'none'
		tr[(num - 1)].style.display = 'none'
		num -= 2;
	}
}


function genTable(obj)
{	
	var dayArray = new Array("日", "一", "二", "三", "四", "五", "六");
	var tempHtml = '';
	var total = obj.length;
	
	if (obj.length == 0)
	{
		tempHtml = '<div style="width:100%; text-align:center; padding-top:50px;" class="marksixlink">暫時沒有資料</div>';
		return tempHtml;
	}
	
	tempHtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	
	for (var i=0; i<total; i++)
	{
		tempHtml += '<tr valign="top">';
		tempHtml += '	<td width="4" style="padding:6px 6px 0px 6px;"><img src="/root/marksix/info/ch/images/iframe_arrow.gif" width="4" height="5"></td>';
		
		var drawLink = link + 'year=' + obj[i].year + '&month=' + obj[i].month + '&date=' + obj[i].date;
//		tempHtml += '	<td class="frameContent"><a href="'+drawLink+'" target="'+linkTarget+'" class="marksixlink" style="line-height:17px;">';
		tempHtml += '	<td class="frameContent"><a onclick="javascript:parent.parent.location.href=\''+drawLink+'\'" class="marksixlink" style="line-height:17px;cursor: pointer;">';
		
		tempHtml += addZero(obj[i].date)+'/'+addZero(Number(obj[i].month)+1)+'/'+obj[i].year+' (星期'+dayArray[obj[i].day]+')';
		
		if (obj[i].jackpotName && obj[i].jackpot == "1")	tempHtml += "<br>" + obj[i].jackpotName;
		
		tempHtml += '</a></td>';
		tempHtml += '</tr>';
		
		if (i < (total-1))
		{
			tempHtml += '<tr>';
			tempHtml += '	<td colspan="2" style="background:url(/root/marksix/info/ch/images/dash2.gif) repeat-x center;"><img src="/root/marksix/info/ch/images/spacer.gif" width="1" height="13"></td>';
			tempHtml += '</tr>';
		}
	}

	tempHtml += '</table>';
	
	return tempHtml;
}


function addZero(num)
{
	if (num < 10)	num = "0" + num;
	
	return num;
}


function gen3rdTable()
{	
	var tempHtml = '';
	var drawLink1 = 'http://campaign.hkjc.com/ch/2016-marksix/index.aspx?b_cid=BW6HSPC_1516M40';
	var drawLink2 = 'http://campaign.hkjc.com/ch/2016-marksix/snowball-40th.aspx?b_cid=BW6HSPC_1516M40_snow';
	var drawLink3 = "javascript:top.frames['info'].location.href='http://bet.hkjc.com/marksix/userinfo.aspx?file=lucky_ocbs.asp'; void(0);";
	var drawLink4 = 'http://campaign.hkjc.com/ch/jctv/index.aspx';
	var linkTarget = '_blank';	

	tempHtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	

		tempHtml += '<tr valign="top">';
		tempHtml += '	<td width="4" style="padding:6px 6px 0px 6px;"><img src="/root/marksix/info/ch/images/iframe_arrow.gif" width="4" height="5"></td>';
		tempHtml += '	<td class="frameContent"><a href="'+drawLink3+'" class="marksixlink" style="line-height:17px;">';
		tempHtml += '	十大幸運投注處';
		tempHtml += '	</a></td>';
		tempHtml += '</tr>';
			tempHtml += '<tr>';
			tempHtml += '	<td colspan="2" style="background:url(/root/marksix/info/ch/images/dash2.gif) repeat-x center;"><img src="/root/marksix/info/ch/images/spacer.gif" width="1" height="13"></td>';
			tempHtml += '</tr>';
		tempHtml += '<tr valign="top">';
		tempHtml += '	<td width="4" style="padding:6px 6px 0px 6px;"><img src="/root/marksix/info/ch/images/iframe_arrow.gif" width="4" height="5"></td>';
		tempHtml += '	<td class="frameContent"><a href="'+drawLink4+'" target="'+linkTarget+'" class="marksixlink" style="line-height:17px;">';
		tempHtml += '	全新手機直播服務';
		tempHtml += '	</a></td>';
		tempHtml += '</tr>';


	tempHtml += '</table>';
	
	return tempHtml;
}
