function loadBetSlipXML(xmlname, pushVar) {
    var xmlDocSrc;
    if (window.DOMParser) {
        var parser = new window.DOMParser();
        // xmlDocSrc = document.implementation.createDocument("", "", null);

        xmlDocSrc = parser.parseFromString(arguments[2], "text/xml");
    }
    else {
        xmlDocSrc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDocSrc.async = false;
        xmlDocSrc.loadXML(arguments[2]);
    }
    // xmlDocSrc.load(arguments[2]);
    if (enableBSinDev || top.betSlipFrame.setXMLObject(xmlname, xmlDocSrc)) {
        eval(pushVar + ' = 1');
    }

    if (pooltype == 'STB') {
        if (pushAllupFormulaXML == 1 && pushBonusXML == 1 && pushScbinfoXML == 1) {
            allPushed = 1;
        }
    } else {
        if (pushAllupFormulaXML == 1 && pushBonusXML == 1) {
            allPushed = 1;
        }
    }

}

function eWinChecking() {
    try {     
        if (pushAllupFormulaXML == 0) {
            if (enableBSinDev || top.betSlipFrame.getCurrentEventSequenceNumber("allupformula") == "") {
                //var url='http://' + SERVER_NAME + '/football/getxml.aspx?type=allupformula&cachetime=' + getXMLcache;
                var url;
                if (jsIsReadMmf) {
                    url = 'http://' + SERVER_NAME + '/sbmmfclient/sbmmfclient.asp?querytype=ALLUPFOR';
                }
                else {
                    url = 'http://' + SERVER_NAME + '/xml/' + jsXmlPath + '/sb_allupformula.xml';
                }
                $.ajax({
                    url: url,
                    dataType: "text",
                    success: function(data) {
                        loadBetSlipXML('allupformula', 'pushAllupFormulaXML', data);
                    }
                });
                //			allupformulaSrc = new ActiveXObject("microsoft.xmldom");			
                //			allupformulaSrc.load('http://' + SERVER_NAME + '/football/getxml.aspx?type=allupformula&cachetime=' + getXMLcache);	
                //			loadBetSlipXML('allupformula', 'pushAllupFormulaXML', allupformulaSrc);
            }
        }
    } catch (err) {
    }
    /*  if (pushBonusXML == 0) {
    if (enableBSinDev || top.betSlipFrame.getCurrentEventSequenceNumber("bonus") == "") {
    //var url = 'http://' + SERVER_NAME + '/football/getxml.aspx?type=bonus&cachetime=' + getXMLcache;
    var url;
    if (jsIsReadMmf) {
    url = 'http://' + SERVER_NAME + '/sbmmfclient/sbmmfclient.asp?querytype=BONUS';
    }
    else {
    url = 'http://' + SERVER_NAME + '/xml/' + jsXmlPath + '/sb_bonus.xml';
    }
    $.ajax({
    url: url,
    dataType: "text",
    success: function(data) {
    loadBetSlipXML('bonus', 'pushBonusXML', data);
    }
    });
    //			bonusSrc = new ActiveXObject("microsoft.xmldom");
    //			bonusSrc.load('http://' + SERVER_NAME + '/football/getxml.aspx?type=bonus&cachetime=' + getXMLcache);	
    //			loadBetSlipXML('bonus', 'pushBonusXML', bonusSrc);
    }
    }*/
    //    if (pooltype == 'STB' && pushScbinfoXML == 0) {
    //        if (enableBSinDev || top.betSlipFrame.getCurrentEventSequenceNumber("scbinfo") == "") {
    //            var url = 'http://' + SERVER_NAME + '/football/getxml.aspx?type=scbinfo&cachetime=' + getXMLcache;
    //            $.ajax({
    //                url: url,
    //                success: function(data) {
    //                    //loadBetSlipXML('scbinfo', 'pushScbinfoXML', data);
    //                }
    //            });
    //            //			scbinfoSrc = new ActiveXObject("microsoft.xmldom");
    //            //			scbinfoSrc.load('http://' + SERVER_NAME + '/football/getxml.aspx?type=scbinfo&cachetime=' + getXMLcache);	
    //            //			loadBetSlipXML('scbinfo', 'pushScbinfoXML', scbinfoSrc);
    //        }
    //    }

}