///XAgent Functions
// Reference Implementation for XAgent Client System
var regID, xagent;
var appID = "JCBW";
var app = this;
var isXSellReg = false ;
var checkIsXSellRegCount = 0 ;
var tryRegCount = 0;
var xsellframe_loaded = 0 ;

function xrecieveContent(messageHolderID, content){
	try{		
		var targetHolder =  jQuery("#" + messageHolderID, top.frames["info"].document);
		if(targetHolder.length > 0){
			targetHolder.html("");
			targetHolder.show();
			targetHolder.html(content);			
		}		

	}catch(anErr){
		//alert( anErr.description);
	}
}
function tryReg(){
	try{
		if (top.betSlipFrame && top.betSlipFrame.isXSellEnabled() != undefined)
		{
			if (top.betSlipFrame.isXSellEnabled()) // do xsell if enabled		
			{
			  var xFrame = top.frames["xsellFrame"]; //The object path may be different for clients.
			  if( xFrame){
			
				if( xFrame.xagent != undefined){
					xagent = xFrame.xagent;
					if (  xagent.registerApp(appID,  app, msgHolders, xrecieveContent)) {
						clearInterval( regID); 
						isXSellReg = true ;
					}else{
						//alert( "failed registering: " + xagent.error);
					}
				}
				else
				{
					if(xsellframe_loaded == 0 && top.xsellurl != "") //load xsellframe url just once
					{
						top.xsellFrame.location.href = top.xsellurl ;
						xsellframe_loaded = 1 ;
					}
					tryRegCount ++ ;
					if (tryRegCount > 120)
						clearInterval( regID);
				}
			  }			
			}
			else
				clearInterval( regID); 
		}
	}catch(err){
		//alert( err );
	}
	
}
function xsellInit() 
{
		regID = setInterval( tryReg,1000);
}
function xsell_event(eventID)
{
	try{
		if (!isXSellReg && checkIsXSellRegCount < 60)
		{
			checkIsXSellRegCount ++ ;
			eval("setTimeout(\"xsell_event(" + eventID + ")\", 2000);") ;
			return false ;
		}
		var xFrame = top.frames["xsellFrame"]; //The object path may be different for clients.
		if( xFrame){		
			if( xFrame.xagent != undefined){
				if (top.betSlipFrame && top.betSlipFrame.isXSellEnabled())
				{	
					xFrame.xagent.raiseXEvent(eventID) ;
				}
			}	
		}
	}catch(err){}
}

