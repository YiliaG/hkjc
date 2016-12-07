<!--
function openBetPage(theURL){
	
		if (top.info){		
			if(getDomain(document.referrer) === document.domain){
				top.info.location.href = theURL;			
			}else{				
				var msg = "top.info.location.href = '" + rel2absPath(theURL) + "';";								
				if(top.info.postMessage)
					top.info.postMessage(msg,"*");
			}
		} else {			
			window.open(theURL);
		}	
	
}

function getDomain(str){
	var tmp = str.substr(7) ;
	SERVER_NAME = tmp.substr(0, tmp.indexOf("/")) ;
	return SERVER_NAME.substr(SERVER_NAME.indexOf(".")+1) ;
}

function rel2absPath(path){
	if(path.indexOf("/") == 0)
		return  window.location.protocol + "//" + window.location.host + path;
	else
		return path;
}
-->
