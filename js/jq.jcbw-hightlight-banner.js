var winDomain = window.location.protocol + '//' + window.location.host;
var bannerBig  = new Array();


function jumpPageTop(url) {
    top.location.href=url;
}

function setBanner(var0, var1, var2, var3, var4){

    var banner_pri = var0;
    var tempStart  = new Date(var3);
    var tempEnd    = new Date(var4);
    
    if ((tempStart < banner_time) && (tempEnd > banner_time)){
    	bannerBig[bannerBig.length] = new Array (var0, var1, var2, tempStart, tempEnd, replaceAll(var1))	
		// bannerBig[bannerBig.length] = new Array (var0, var1, var2, tempStart, tempEnd, replaceAll("530x180","80x50",var1))				
    }

}

function MM_openBrWindow(theURL,winName,features) { //v2.0
    window.open(theURL,winName,features);
}

function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function sortBanner() {
	bannerBig.sort(function(a, b) { 
		if (a[0] < b[0]) return -1;
		if (a[0] > b[0]) return 1;
		if (a[3] > b[3]) return -1;
		if (a[3] < b[3]) return 1;
		return 0;
	});
}

