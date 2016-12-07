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

function isIDevice() {
 if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
   return true;
 }
 else {
   return false;
 }
}

function isMobileDevice() {
  if (navigator.userAgent.match(/android|blackBerry|iphone|ipad|ipod|opera mini|iemobile|touch/i)) {
    return true;
  }
  else {
    return false;
  }
}

function isAndroidDevice() {
  if (navigator.userAgent.match(/android/i)) {
    return true;
  }
  else {
    return false;
  }
}

function isMSIE() {
  if (navigator.userAgent.match(/MSIE/i)) {
    return true;
  }
  else {
    return false;
  }
}

function isMobileIE() {
  return navigator.userAgent.match(/touch/i) && navigator.userAgent.match(/Trident/i);
}

function loadMouseEventImage(targetId, pic_name) {
 if (!isMobileDevice()) {
   var imagePath = get_image_lang(pic_name);
   $j('#' + targetId).attr('src', imagePath);
 }
}

var tempImg = [];
function preloadImages(pic_names) {
  var pic_array = pic_names.split(",");
  for (var x = 0; x < pic_array.length; x++) {
    tempImg[x] = new Image();
    tempImg[x].src = get_image_lang(pic_array[x]);
  }
}

function showDiv(i, isShow) {
  if (isIDevice()) {
    var timeout = 0;
    if (isShow == 0)
      timeout = 1000;
    setTimeout(function() { showDivMain(i, isShow); }, timeout);
  } else {
    showDivMain(i, isShow);
  }
}

function showDivMain(i, isShow) {
  if (isShow)
    $(i).style.display = 'block';
  else
    $(i).style.display = 'none';
}

// check the browser whether it is supporting File API (HTML5 feature)
function isFileAPISupported() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    return true;
  }

  return false;
}

// check the browser whether it is supporting Web browser (HTML5 feature)
function isWebWorkerSupported() {
  if(typeof(Worker) !== "undefined") {
    return true;
  }

  return false;
}

function isWindowURLSupported() {
  if (window.URL || window.webkitURL) {
    return true;
  }

  return false;
}