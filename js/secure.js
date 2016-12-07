document.onkeydown = new Function ("onKeyDown()"); 
document.oncontextmenu=new Function ("return false") ;
document.oncopy=new Function ("document.selection.empty()") ; 
document.onbeforecopy=new Function ("return false") ;


function onKeyDown() {
	if(event.altKey&&(event.keyCode==37)) 
		event.returnValue = false;
	else if((event.altKey) || 
	     	((event.keyCode == 8) && (event.srcElement.type != "text" && event.srcElement.type != "textarea" && event.srcElement.type != "password")) || 
 	     	((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82)) ) ||
	     	(event.keyCode == 116) || 
		(event.keyCode == 18) ) {
         		event.keyCode = 0;
         		event.returnValue = false;
        }
}
