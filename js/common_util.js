// stringbuffer

function $(id) {
  return document.getElementById(id);
}

function focusField(id) {
  if (!isIDevice()) {
    setTimeout(function() { id.focus(); }, 0);
  } else {
    id.focus();
  }
}

function StringBuffer(){ 
   this.data = []; 
}

StringBuffer.prototype.append = function() {
   this.data.push(arguments[0]); 
   return this; 
}

StringBuffer.prototype.toString = function() {
   return this.data.join(""); 
}

StringBuffer.prototype.isEmpty = function() {
  return this.data.length == 0;
}

function BackgroundImageCache() {
  try {
    document.execCommand('BackgroundImageCache', false, true);
  } catch ( ex ) {}
}

// combobox for flexibet

var fPrefix = 'flexiSelect';

function createFlexiDropdown(idx, defaultVal, expand) {
  var buf = new StringBuffer();
  buf.append('<div id="')
     .append(fPrefix).append(idx)
     .append('" class="');

  if ( expand )
    buf.append('ctlSelectExpand');
  else
    buf.append('ctlSelect');

  buf.append('"  onclick="expandDropdown(this, ')
     .append(idx)
     .append(', GetText(\'flexi_opt\'), ')
     .append(expand).append('); event.cancelBubble=true;" onblur="collapseDropdown(')
     .append(idx)
     .append(', GetText(\'flexi_opt\'), ')
     .append(expand).append(');" onMouseOver="betlines[')
     .append(idx).append('].unitHit = true;" onMouseOut="betlines[')
     .append(idx).append('].unitHit = false;" ')
     .append('title=\'').append(GetText('dropdownAlt')[betlines[idx].betMethod]).append('\' ')
     .append('>');
  buf.append('<div id="')
     .append(fPrefix).append(idx).append('Text')
     .append('" class="ctlSelectInput">');
  buf.append('<span>').append(defaultVal).append('</span><span style="padding-left:1px">$').append('</span>');
  buf.append('</div>');
  buf.append('<div id="')
     .append(fPrefix).append(idx).append('Arrow')
     .append('" class="ctlSelectArrow">&#9660;</div>');
  buf.append('</div>');
  buf.append('<div id="').append(fPrefix).append(idx).append('A').append('" style="z-index:10;position:absolute;display:block"></div>');
  return buf.toString();
}

function dropdownOffset(e) {
	var t = e.offsetTop;
	var l = e.offsetLeft;
	var w = e.offsetWidth;
	var h = e.offsetHeight-2;

	while(e=e.offsetParent) {
		t+=e.offsetTop;
		l+=e.offsetLeft;
	}

	return {
		top : t,
		left : l,
		width : w,
		height : h
	}
}
(function() {
	if (typeof window.navigatorType == 'undefined')
	{
		window.navigatorType = {};
		var navigators = ["msie", "firefox", "safari", "chrome", "opera"];
		var userAgent = window.navigator.userAgent.toLowerCase();
		for (var i in navigators) {
			var name = navigators[i];
			navigatorType[name] = userAgent.indexOf(name) != -1;
		}
	}
})();

function getBrowserInfo() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var _browserName = navigator.appName;
    var _fullVersion = '' + parseFloat(navigator.appVersion);
    var _majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        _browserName = "Opera";
        _fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            _fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        _browserName = "Microsoft Internet Explorer";
        _fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        _browserName = "Chrome";
        _fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        _browserName = "Safari";
        _fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            _fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        _browserName = "Firefox";
        _fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        _browserName = nAgt.substring(nameOffset, verOffset);
        _fullVersion = nAgt.substring(verOffset + 1);
        if (_browserName.toLowerCase() == _browserName.toUpperCase()) {
            _browserName = navigator.appName;
        }
    }
    // trim the _fullVersion string at semicolon/space if present
    if ((ix = _fullVersion.indexOf(";")) != -1) _fullVersion = _fullVersion.substring(0, ix);
    if ((ix = _fullVersion.indexOf(" ")) != -1) _fullVersion = _fullVersion.substring(0, ix);

    _majorVersion = parseInt('' + _fullVersion, 10);
    if (isNaN(_majorVersion)) {
        _fullVersion = '' + parseFloat(navigator.appVersion);
        _majorVersion = parseInt(navigator.appVersion, 10);
    }

    return {
        browserName: _browserName,
        fullVersion: _fullVersion,
        majorVersion: _majorVersion
    }
}

function isSafari5_Or_Earlier_On_Mac() {
    var bInfo = getBrowserInfo();
    return getBrowserInfo().browserName == 'Safari' && getBrowserInfo().fullVersion < '6' && navigator.appVersion.indexOf('Mac') >= 0;    
}

function expandDropdown(obj, idx, optionArray, expand) {
  if (!document.getElementById(obj.id + 'Option')) {
    document.getElementById(obj.id + 'Text').className = 'ctlSelectInputHL';
    document.getElementById(obj.id + 'Arrow').className = 'ctlSelectArrowHL';
    var divA = document.getElementById(obj.id + 'A');

    if (isIE == false)
      collapseAllDropdown(optionArray, expand);

    if (expand)
      obj.className = 'ctlSelectExpandHL';
    else
      obj.className = 'ctlSelectHL';

    var offset = dropdownOffset(obj);
    var div = document.createElement('DIV');
    div.setAttribute('id', obj.id + 'Option');
    div.style.position = "absolute";
    div.style.display = "";
    if (isIE)
      div.style.left = 0 - offset.width;
    else
      div.style.left = obj.offsetParent.offsetWidth - (offset.width + 4);
    div.style.top = 0;
    div.style.height = offset.height * optionArray.length;
    div.style.overflow = 'hidden';
    div.className = 'ctlOptions';

    divA.appendChild(div);
    var isIE10 = ((navigator.appName.toUpperCase().indexOf("MICROSOFT") >= 0 && parseInt($$.browser.version, 10) >= 10));    
    if (navigatorType.safari || isIE10) // resolve safari & IE10 pop menu position error problem
    {
      var divBetLayer = document.getElementById('divBetLayer');
      div.style.top = div.offsetTop - divBetLayer.scrollTop;
    }
    for (var i = 0; i < optionArray.length; i++) {
      var div2 = document.createElement("DIV");
      div2.setAttribute('id', div.id + i);
      div2.optionIdx = i;
      div2.style.cursor = "default";
      div2.appendChild(document.createTextNode(optionArray[i]));
      div2.style.height = offset.height;
      div2.className = 'ctlUnSelectOption';
      div.appendChild(div2);

      div2.onmouseover = function() {
        var divObj = document.getElementById(fPrefix + idx + 'Option');
        for (var j = 0; j < divObj.childNodes.length; j++) {
          if (divObj.childNodes[j] == this)
            divObj.childNodes[j].className = 'ctlSelectOption';
          else
            divObj.childNodes[j].className = 'ctlUnSelectOption';
        }
      };

      div2.onmousedown = function() {
        var inputObj = document.getElementById('inputAmount' + idx);
        if (betlines[idx].isFlexiBet() && this.optionIdx == 0 && inputObj != null
          && parseInt(inputObj.value, 10) > MyParseInt(GetPara('MaxBetUnit'), 50000)) {
          ShowError(2, GetError("1208"), true, 60000);
          focusField(inputObj);
        }
        else {
          var divObj = document.getElementById(fPrefix + idx + 'Text');
          var defaultBetMethod = 'flexi_' + (isSlipOpen ? 'l' : 's');
          if (betlines[idx].betMethod != this.optionIdx) betlines[idx].clearRandGen();
          betlines[idx].betMethod = this.optionIdx;
          divObj.innerHTML = '<span>' + GetText(defaultBetMethod)[betlines[idx].betMethod] + '</span><span style="padding-left:1px">$</span>';

          UpdateBetTotal();
        }
        collapseAllDropdown(GetText('flexi_opt'), isSlipOpen);
        RedrawBetlineTable();
      }

      if (navigatorType.msie && !isIE11()) {
        var divBetLayer = document.getElementById('divBetLayer');
        var divBetLayerScrollTop = divBetLayer.scrollTop;
        var divBetLayerHeight = divBetLayer.clientHeight;
        var item = document.getElementById('betTbl').rows[idx];
        var itemHeight = item.offsetHeight;
        var divHeight = document.getElementById(obj.id + 'Option').offsetHeight;
        if (item.offsetTop - divBetLayerScrollTop + itemHeight + divHeight > divBetLayerHeight) {
          divBetLayer.scrollTop = divBetLayer.scrollTop + (item.offsetTop - divBetLayerScrollTop + itemHeight + divHeight - divBetLayerHeight);
        }

      }
    }

  }
  return;
}

function collapseDropdown(idx, optionArray, expand) {
  var div = document.getElementById(fPrefix + idx + 'Option');
  if ( div!=null ) {
    var divA = document.getElementById(fPrefix + idx + 'A');
    document.getElementById(fPrefix + idx + 'Text').className = 'ctlSelectInput';
    document.getElementById(fPrefix + idx + 'Arrow').className = 'ctlSelectArrow';
    if ( expand )
      document.getElementById(fPrefix + idx).className = 'ctlSelectExpand';
    else
      document.getElementById(fPrefix + idx).className = 'ctlSelect';

    for ( var j=0; j<optionArray.length; j++ ) {
      var div2 = document.getElementById(div.id + j + 'Option');
      if ( div2!=null )
        div.removeChild(div2);
    }
    divA.removeChild(div);
  }
}

function collapseAllDropdown(optionArray, expand) {
  for ( var i=0; i<totalBetlines; i++ ) {
    collapseDropdown(i, optionArray, expand);
  }
}

// combobox for marksix unit bet selection

var m6UnitPrefix = 'm6UnitSelect';

function createM6UnitBetDropdown(idx, defaultVal, expand) {
  var optArrSuffix = expand ? 'l' : 's';

  var buf = new StringBuffer();
  buf.append('<div id="')
     .append(m6UnitPrefix).append(idx)
     .append('" class="');

  buf.append('ctlSelect2');

  buf.append('"  onclick="expandM6Dropdown(this, ')
     .append(idx)
     .append(', GetText(\'m6unit_').append(optArrSuffix).append('\'), ')
     .append(expand).append('); event.cancelBubble=true;" onblur="collapseM6Dropdown(')
     .append(idx)
     .append(', GetText(\'m6unit_').append(optArrSuffix).append('\'), ')
     .append(expand).append(');" onMouseOver="betlines[')
     .append(idx).append('].unitHit = true;" onMouseOut="betlines[')
     .append(idx).append('].unitHit = false;" ')
     //.append('title=\'').append('$&nbsp;').append(defaultVal).append('\' ')
     .append('>');
  buf.append('<div id="')
     .append(m6UnitPrefix).append(idx).append('Text')
     .append('" class="ctlSelectInput2">');
  buf.append('<span>').append('$').append(defaultVal).append('</span>');
  buf.append('</div>');
  buf.append('<div id="')
     .append(m6UnitPrefix).append(idx).append('Arrow')
     .append('" class="ctlSelectArrow">&#9660;</div>');
  buf.append('</div>');
  buf.append('<div id="').append(m6UnitPrefix).append(idx).append('A').append('" style="z-index:10;position:absolute;display:block"></div>');
  return buf.toString();
}

function expandM6Dropdown(obj, idx, optionArray, expand) {
  if ( !document.getElementById(obj.id + 'Option') ) {
    document.getElementById(obj.id + 'Text').className = 'ctlSelectInputHL2';
    document.getElementById(obj.id + 'Arrow').className = 'ctlSelectArrowHL';
    var divA = document.getElementById(obj.id + 'A');

    if (isIE == false)
      collapseAllM6Dropdown(optionArray, expand);

    obj.className = 'ctlSelectHL2';

    var offset = dropdownOffset(obj);
    var div = document.createElement('DIV');
    div.setAttribute('id', obj.id + 'Option');
    div.style.position = "absolute";
    div.style.display = "";

    if (isIE) {
      var offset1 = (GetLanguage() == 1) ? -20 : 0;
      var offset2 = expand ? -45 : -5;
      div.style.left = offset1 + offset2 - offset.width;
    }
    else {
      var offset1 = (GetLanguage() == 1) ? -20 : -10;
      var offset2 = expand ? 0 : 40;
      var divWidth = 80 - offset1 - offset2;      
      div.style.width = divWidth;
      divA.style.left = $j(obj).position().left + $j(obj).width() - divWidth;
    }

    div.style.top = 0;
    div.style.height = offset.height * optionArray.length;
    div.style.overflow = 'hidden';
    
    if ( expand )
      div.className = 'ctlOptionsExpand2';
    else
      div.className = 'ctlOptions2';

    divA.appendChild(div);
    if (navigatorType.safari || isIE10()) {
      var divBetLayer = document.getElementById('divBetLayer');
      div.style.top = div.offsetTop - divBetLayer.scrollTop;
    }
    for ( var i=0; i<optionArray.length; i++ ) {
      var div2 = document.createElement("DIV");
      div2.setAttribute('id', div.id + i);
      div2.optionIdx = i;
      div2.style.cursor = "default";
      div2.innerHTML = optionArray[i] + ' $' + GetM6UnitBet(i);
      div2.style.height = offset.height;
      div2.className = 'ctlUnSelectOption2';
      div.appendChild(div2);
  
      div2.onmouseover = function() {
        var divObj = document.getElementById(m6UnitPrefix + idx + 'Option');
        for ( var j=0; j<divObj.childNodes.length; j++ ) {
          if ( divObj.childNodes[j]==this )
            divObj.childNodes[j].className = 'ctlSelectOption2';
          else
            divObj.childNodes[j].className = 'ctlUnSelectOption2';
        }						
      };

      div2.onmousedown = function() {
        var divObj = document.getElementById(m6UnitPrefix + idx + 'Text');
        betlines[idx].m6UnitBetAmountType = this.optionIdx;
        betlines[idx].unitBet = parseInt(GetM6UnitBet(this.optionIdx), 10);
        divObj.innerHTML = '<span>$' + m6DropdownTextPadding(GetM6UnitBet(this.optionIdx)) + '</span>';

        UpdateBetTotal();
        var optArrSuffix = isSlipOpen ? 'l' : 's';
        collapseAllM6Dropdown(GetText('m6unit_' + optArrSuffix), isSlipOpen);
        RedrawBetlineTable();
      }
            
      if (navigatorType.msie && !isIE11()) {
        var divBetLayer = document.getElementById('divBetLayer');
        var divBetLayerScrollTop = divBetLayer.scrollTop;
        var divBetLayerHeight = divBetLayer.clientHeight;
        var item = document.getElementById('betTbl').rows[idx];
        var itemHeight = item.offsetHeight;
        var divHeight = document.getElementById(obj.id + 'Option').offsetHeight;
        if (item.offsetTop - divBetLayerScrollTop + itemHeight + divHeight > divBetLayerHeight) {
          divBetLayer.scrollTop = divBetLayer.scrollTop + (item.offsetTop - divBetLayerScrollTop + itemHeight + divHeight - divBetLayerHeight);
        }
      }
    }

  }
  return;
}

function collapseM6Dropdown(idx, optionArray, expand) {
  var div = document.getElementById(m6UnitPrefix + idx + 'Option');
  if ( div!=null ) {
    var divA = document.getElementById(m6UnitPrefix + idx + 'A');
    document.getElementById(m6UnitPrefix + idx + 'Text').className = 'ctlSelectInput2';
    document.getElementById(m6UnitPrefix + idx + 'Arrow').className = 'ctlSelectArrow';
    document.getElementById(m6UnitPrefix + idx).className = 'ctlSelect2';

    for ( var j=0; j<optionArray.length; j++ ) {
      var div2 = document.getElementById(div.id + j + 'Option');
      if ( div2!=null )
        div.removeChild(div2);
    }
    divA.removeChild(div);
  }
}

function collapseAllM6Dropdown(optionArray, expand) {
  for ( var i=0; i<totalBetlines; i++ ) {
    collapseM6Dropdown(i, optionArray, expand);
  }
}

function m6DropdownTextPadding(iUnitBet) {
  var unit1 = GetM6UnitBet(0).length;
  var unit2 = GetM6UnitBet(1).length;
  var maxUnit = (unit1 < unit2) ? unit2 : unit1;
  var iUnit = iUnitBet.length;
  var oUnitBet = new StringBuffer();
  oUnitBet.append(iUnitBet);
  for ( var i=0; i< maxUnit - iUnit; i++ ) {
    oUnitBet.append('&nbsp;&nbsp;');
  }
  return oUnitBet.toString();
}

function isIE10() {
    return parseInt($$.browser.version, 10) >= 10 && $$.browser.msie;
}