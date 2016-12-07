
function lib_bwcheck(){ //Browsercheck (needed)
	this.ver=navigator.appVersion
	this.agent=navigator.userAgent
	this.dom=document.getElementById?1:0
	this.opera5=this.agent.indexOf("Opera 5")>-1
	this.ie5=(this.ver.indexOf("MSIE 5")>-1 && this.dom && !this.opera5)?1:0; 
	this.ie6=(this.ver.indexOf("MSIE 6")>-1 && this.dom && !this.opera5)?1:0;
	this.ie4=(document.all && !this.dom && !this.opera5)?1:0;
	this.ie=this.ie4||this.ie5||this.ie6
	this.mac=this.agent.indexOf("Mac")>-1
	this.ns6=(this.dom && parseInt(this.ver) >= 5) ?1:0; 
	this.ns4=(document.layers && !this.dom)?1:0;
	this.bw=(this.ie6 || this.ie5 || this.ie4 || this.ns4 || this.ns6 || this.opera5)
	return this
}


/********************************************************************************
Object code...Object constructors and functions...
********************************************************************************/
function makeNewsObj(obj,nest,font,size,color,news,fadespeed,betweendelay,slidespeed,works,newsheight){
 nest=(!nest) ? "":'document.'+nest+'.'
 this.css=bw.dom? document.getElementById(obj).style:bw.ie4?document.all[obj].style:bw.ns4?eval(nest+"document.layers." +obj):0;	
 this.writeref=bw.dom? document.getElementById(obj):bw.ie4?document.all[obj]:bw.ns4?eval(nest+"document.layers." +obj+".document"):0;
	if(font){this.color=new Array(); this.color=eval(color); this.news=new Array(); this.news=eval(news)
 this.font=font; this.size=size; this.speed=fadespeed; this.delay=betweendelay; this.newsheight=newsheight;
 this.fadeIn=b_fadeIn;this.fadeOut=b_fadeOut; this.newsWrite=b_newsWrite; this.y=1
 this.slideIn=b_slideIn; this.moveIt=b_moveIt; this.slideSpeed=slidespeed; this.works=works
 if(bw.dom || bw.ie4){this.css.fontFamily=this.font; this.css.fontSize=this.size; this.css.color=this.color[0]}
	}
	this.obj = obj + "Object"; eval(this.obj + "=this"); return this
}
// A unit of measure that will be added when setting the position of a layer.
//var px = bw.ns4||window.opera?"":"px";
var px = "px";
function b_moveIt(x,y){this.x=x; this.y=y; this.css.left=this.x+px; this.css.top=this.y+px;}
function b_newsWrite(num,i){
	if (bw.ns4){
 this.writeref.write("<a href=\"#\" target=\"myTarget\" style=\"text-decoration:none; font-size:"+this.size+"px\">"
 +"<font face=\""+this.font+"\" color=\""+this.color[i]+"\">"+this.news[num]+"</font></a>")
 this.writeref.close()
	}else this.writeref.innerHTML = '<div id="'+this.obj+'link' +'" style="text-decoration:none; font-size:'+this.size+'px; color:'+this.color[i]+'" href="#">'+this.news[num]+'</div>'
}
	
//Slide in
function b_slideIn(num,i){
	if (this.y>0){
 if (i==0){this.moveIt(0,this.newsheight); this.newsWrite(num,this.color.length-1)}
 this.moveIt(this.x,this.y-this.slideSpeed)
 i ++
 setTimeout(this.obj+".slideIn("+num+","+i+");",50)
	}else setTimeout(this.obj+".fadeOut("+num+","+(this.color.length-1)+")",this.delay)
}
//The fade functions
function b_fadeIn(num,i){
	if (i<this.color.length){
 if (i==0 || bw.ns4) this.newsWrite(num,i)
 else{
 obj = bw.ie4?eval(this.obj+"link"):document.getElementById(this.obj+"link")
 obj.style.color = this.color[i]
 }
 i ++
 setTimeout(this.obj+".fadeIn("+num+","+i+")",this.speed)
	}else setTimeout(this.obj+".fadeOut("+num+","+(this.color.length-1)+")",this.delay)
}
function b_fadeOut(num,i){
	if (i>=0){
 if (i==0 || bw.ns4) this.newsWrite(num,i)	
 else{
 obj = bw.ie4?eval(this.obj+"link"):document.getElementById(this.obj+"link")
 obj.style.color = this.color[i]
 }
 i --
 setTimeout(this.obj+".fadeOut("+num+","+i+")",this.speed)
	}else{
 num ++
 if(num==this.news.length) num=0
 works = !this.works?0:this.works==1?1:Math.round(Math.random())
 if(works==0) setTimeout(this.obj+".fadeIn("+num+",0)",500)
 else if (works==1){this.y=1; setTimeout(this.obj+".slideIn("+num+",0)",500)
 }
	}
}
/********************************************************************************************
The init function. Calls the object constructor and set some properties and starts the fade
*********************************************************************************************/
function fadeInit(){
	oNews = new makeNewsObj('divNews','divNewsCont',nFont,nFontsize,"nColor","nNews",nFadespeed,nBetweendelay,nSlidespeed,nWorks,nNewsheight)
	oNewsCont = new makeNewsObj('divNewsCont')
	works = !oNews.works?0:oNews.works==1?1:Math.round(Math.random())
	if (works==0) oNews.fadeIn(0,0)
	else if (works==1) oNews.slideIn(0,0)
	oNewsCont.css.visibility = "visible"
}


function prepareRollingText(lang, tmpNews){
	curLang = lang;
	if (curLang == "C")
		stringLen = 98;
	else
		stringLen = 200;
		
	for (var i=0;i<tmpNews.length;i++) {	
		if (tmpNews[i].length > stringLen) {
			for (j=0;j<tmpNews[i].length;j++) {						
				if (curLang == 'E') {
					tstr = tmpNews[i].substr(j,stringLen);		
					tpos = tstr.lastIndexOf(" ");
					if(tpos < 0)
						tpos = stringLen;
					if (tstr.length < stringLen) {									
						nNews[newsCounter] = tmpNews[i].substr(j,stringLen);				
						j = tmpNews[i].length;
					} else {
						nNews[newsCounter] = tstr.substr(0,tpos);
						j += tpos;
					}
					
				} else {			
					nNews[newsCounter] = tmpNews[i].substr(j,stringLen);				
					j += (stringLen-1);
				}
				newsCounter++;
			}
		} else {
			nNews[newsCounter] = tmpNews[i];
			newsCounter++;
		}
	}
}

function initsize(iframeHeight) {
    if (parent && $('#divNews').text() != "") {
        document.body.style.display = "block";
        try {
            if (navigator.appName.indexOf("Microsoft") > -1) {
                parent.homeSNFrame.resizeTo(document.body.scrollWidth, iframeHeight);
                if (parent.parent.home_promo_top_frame != null) {
                    parent.setFrameSize();
                }
            } else {
                window.parent.document.getElementById('homeSNFrame').height = iframeHeight;
                if (window.parent.parent.document.getElementById('home_promo_top_frame') != null) {
                    parent.setFrameSize();
                }	
            }
        } catch (e) { };

        fadeInit();
    }
    else {
        window.parent.document.getElementById('homeSNFrame').style.display = "none";
    }
}
