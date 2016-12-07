function chkHiJack() {
	if (self != top) {
		top.location.replace(self.location.href);
	}
}

function setBetSlipClose() {
	try {		
		if (parent.betSlipFrame)
			parent.betSlipFrame.slipClose();
	} catch (ex) {}
}

function addMousedownEvent(frame) {
  try {
    var info = document.getElementById(frame);
    var doc = info.contentWindow || info.window;
    doc = doc.document;
    var oldmousedown = doc.onmosedown;
    doc.onmousedown = function()  //of cause, you can use onclick or other event
    {
        if (oldmousedown)
            oldmousedown();
        setTimeout('setBetSlipClose()', 10);
    }
  }
  catch (ex) {
    //alert(ex);
  }
}
