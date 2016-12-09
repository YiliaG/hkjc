<!--

//var dataStore = null;
var dataStore = {
  setItem: function(name, value) {
     window.sessionStorage.setItem(name, value);
  },
  getItem: function(name) {
     return window.sessionStorage.getItem(name);
  },
  clear: function(){
    window.sessionStorage.clear();
  }
};

function SetDataStore(name, value) {
  try {
    var ds = opener && opener.dataStore ? opener.dataStore: dataStore;
    ds.setItem(name, value);    
  } catch (e) {
  }
}

function SetDataStoreObj(obj){
  try {
    var ds = opener && opener.dataStore ? opener.dataStore: dataStore;
    for(key in obj){
     ds.setItem(key, obj[key]);    
    }
  } catch (e) {
  }
}

function RemoveDataStorePrefix(prefix){
  try {
    var ds = opener && opener.dataStore ? opener.dataStore: dataStore;
    
     for (var i = 0; i < ds.length; i++) {
        var key = ds.key(i);
        if (key.indexOf(prefix) == 0) {
          ds.removeItem(key);
        }
      }   
  } catch (e) {
  }
}

function GetDataStore(name) {
  try {
    var ds = opener && opener.dataStore ? opener.dataStore: dataStore;
    var val = ds.getItem(name);
      return val != null ? val : "";
  } catch (e) {
  }
  return "";
}

function ClearDataStore(){
   try {
    var ds = opener && opener.dataStore ? opener.dataStore: dataStore;
    var val = ds.clear();      
  } catch (e) {
  }
  return "";
}

function SessionStorePlugin(){
    return {
        exec: function(funcName, data, callback, formatter, source) {
            //log
            //console.debug({obj:"SessionStorePlugin", funcName:funcName, data: data});
            
             var isSuccess = false;
             var content = {};
             switch(funcName){
                case "GetValue":
                    var keys = data.Keys.split(",");
                    for (idx in keys) {
                        content[keys[idx]] = GetDataStore(keys[idx]);
                    }                                                          
                  isSuccess = true;
                  break;
                case "SetValue":
                  SetDataStore(data.Key, data.Value);
                  isSuccess = true;
                  break;
                case "ClearAllValue":
                  ClearDataStore();
                  isSuccess = true;
                  break;
                default:
                  content = "unreconginsed command. Expected command: 'GetValue' and 'SetValue'";  
             }
             
             if(callback)
                callback(formatter(isSuccess, content), source);
        },
        para: function() {
            return { 
                GetValue: ["Keys", "SaveToSessionStorage"],
                SetValue: ["Key", "Value"]
             };
       }
    };
}

function isLogon()	// check is logon 
{
	if (isNaN(parseInt( GetDataStore("is_logon"))))
		{	return 0 ;	}
	else
	{	return parseInt( GetDataStore("is_logon"));	}
}

        // this function gets the cookie, if it exists
        // don't use this, it's weak and does not handle some cases
        // correctly, this is just to maintain legacy information
        function Get_Cookie(name) {
            var start = document.cookie.indexOf(name + "=");
            var len = start + name.length + 1;
            if ((!start) && (name != document.cookie.substring(0, name.length))) {
                return null;
            }
            if (start == -1) return null;
            var end = document.cookie.indexOf(";", len);
            if (end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(len, end));
        }
//-->
