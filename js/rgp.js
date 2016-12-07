<!--
var mainBetArray = new Array();
mainBetArray = [
	{name:"香港賽馬會", id:"", copyright:"香港賽馬會"},
	{name:"賽馬", id:"racing", copyright:"香港馬會賽馬博彩有限公司"},
	{name:"足智彩", id:"football", copyright:"香港馬會足球博彩有限公司"},
	{name:"六合彩", id:"marksix", copyright:"香港馬會獎券有限公司"}
]

function genCopyright() {
	var tempHtml = '<a href="javascript:popupLink(\'http://www.hkjc.com/chinese/copyright.htm\');" class="footer">版權所有 不得轉載</a> &copy; 2006-';
	tempHtml += (new Date()).getFullYear() + " ";
	tempHtml += mainBetArray[betId].copyright;
	document.getElementById('copyright').innerHTML = tempHtml;
}

function start() {
	var tmp = window.location.href.substr(7) ;
	SERVER_NAME = tmp.substr(0, tmp.indexOf("/")) ;
	domainName = SERVER_NAME.substr(SERVER_NAME.indexOf(".")+1) ;
	document.domain = domainName;
}

function initsize(i) { 
	try {
		if (parent)
			parent.document.getElementById(i).height = document.body.scrollHeight;
	}
	catch (e) {
		setTimeout("initsize('" + i + "')", 500);
	}
}

function popupLink(mypage) {
	winprops = '';
	win = window.open(mypage, 'popupPage', winprops);
	win.self.focus();
}
-->