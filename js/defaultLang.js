// This function aims to 
// 1. load the language preference from cookie
// 2. redirect to the corresponding language default page
function loadLangPreference(){
	var langPreference;
	var langVar = 'lang';			// default value is for Marksix, JCBW main, Racing
	var langValCh = 'ch';			// default value is for Marksix, JCBW main, Racing
	var langValEn = 'en'			// default value is for Marksix, JCBW main, Racing

	langPreference = getCookie('jcbwLangPreference');
	
	if(langPreference != null){
		if(document.location.href.indexOf('football') != -1){		// special handling for football main page
			langVar = 'ci';
			langValCh = 'zh-HK';
			langValEn = 'en-US';
		}
		
		if(langPreference == 0){				// from Chinese to English case
			if(document.location.href.indexOf(langVar) != -1){
				document.location.href = document.location.href.replace(langVar + '=' + langValCh, langVar + '=' + langValEn) + '&langRedirect=true';
			}
			else{
				document.location.href = document.location.href + '?' + langVar + '=' + langValEn + '&langRedirect=true';
			}
		}
		else{									// from English to Chinese case
			if(document.location.href.indexOf(langVar) != -1){
				document.location.href = document.location.href.replace(langVar + '=' + langValEn, langVar + '=' + langValCh) + '&langRedirect=true';
			}
			else{
				document.location.href = document.location.href + '?' + langVar + '=' + langValCh + '&langRedirect=true';
			}
		}
	}
}


// This function aims to save the language preference to cookie
function saveLangPreference(lang) {
    //alert("saveLangPreference | "+  lang);
	try{
		var date = new Date();
		date.setTime(date.getTime()+(999*24*60*60*1000));
          	var tmp = window.location.href.substr(7) ;		
		var SERVER_NAME = tmp.substr(0, tmp.indexOf("/")) ;
		var domainName = SERVER_NAME.substr(SERVER_NAME.indexOf(".")+1) ;
		setCookie('jcbwLangPreference', lang,date,'/',domainName); 
	} catch(e) {};

}


// This function aims to load the cookie content
function getCookie(name) {  
	var arg = name + "=";  
	var alen = arg.length;  
	var clen = document.cookie.length;  
	var i = 0;  
	while (i < clen) {    
		var j = i + alen;    
		if (document.cookie.substring(i, j) == arg)      
			return getCookieVal(j);
		i = document.cookie.indexOf(" ", i) + 1;    
		if (i == 0) break;   
	}  
	return null;
}

// This function aims to save the cookie content
function setCookie(name, value) {  
	var argv = setCookie.arguments;  
	var argc = setCookie.arguments.length;  
	var expires = (argc > 2) ? argv[2] : null;  
	var path = (argc > 3) ? argv[3] : null;  
	var domain = (argc > 4) ? argv[4] : null;  
	var secure = (argc > 5) ? argv[5] : false;  
	document.cookie = name + "=" + escape(value) + 
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + 
	((path == null) ? "" : ("; path=" + path)) +  
	((domain == null) ? "" : ("; domain=" + domain)) +    
	((secure == true) ? "; secure" : "");
}

// This function aims to get the cookie from the corresponding cookie location
function getCookieVal(offset) {  
	var endstr = document.cookie.indexOf (";", offset);  
	if (endstr == -1)    
		endstr = document.cookie.length;  
	return unescape(document.cookie.substring(offset, endstr));
}
