<!--

// ****************************
// disable keys onKeyDown
// ***************************
function onKeyDown(evt, ignoreEnter, frameName) {
  var event = window.event || evt;
  var srcElement = event.srcElement ? event.srcElement : event.target;
  var isIEFlag = (navigator.appVersion.indexOf('MSIE') >= 0);
	try {
		if (event.altKey && event.keyCode == 37) { // Alt + LeftArrow (history go back)
		  if ( isIEFlag ) {
		    event.keyCode = 0;
		    event.returnValue = false;
		  }
			return false;
		} else if (ignoreEnter == true && event.keyCode == 13) { // Enter
      if (frameName == 'accInfo' && !isNowLogon ) {
		    OnClickLogin();
		    return true;
		  }
		  else if ( frameName =='slip' && isInEKBA() ) {
		    OnClickLoginEKBA();
		    return true;
		  }
		  if ( isIEFlag ) {
		    event.keyCode = 0;
		    event.returnValue = false;
		  }
			return false;
		} else if ((event.altKey) || // Alt (select IE menu)
		
				((event.keyCode == 8) && // Backspace (history go back, backspace allowed only when inputing values)
					(srcElement.type != "text" &&
					srcElement.type != "textarea" &&
					srcElement.type != "password")
				) ||
				   
				((event.keyCode == 27) && // Escape (stop downloading a page, Escape allowed only when inputing values)
					(srcElement.type != "text" &&
					srcElement.type != "textarea" &&
					srcElement.type != "password")
				) ||
				   
				((event.ctrlKey) &&
					((event.keyCode == 78) || // Ctl + N (new a window)
					(event.keyCode == 82) // Ctrl + R (page refresh)
					)
				) ||
				   
				(event.keyCode == 116) || // F5 (page refresh)
				   
				(event.keyCode == 18) // Alt (select IE menu)

        || ((event.keyCode == 9) && (srcElement.type != "text" &&
					srcElement.type != "password"))// Tab
				)
		{
  	  if ( isIEFlag ) {
		    event.keyCode = 0;
		    event.returnValue = false;
		  }
			return false;
		}
    } catch (exception1) {
    }
  return true;
}

//-->