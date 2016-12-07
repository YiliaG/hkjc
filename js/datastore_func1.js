<!--
function GetDataStoreRef()
{
  if (window.sessionStorage) {
    var o = {
      "SetData" : function(name, value) {
          if(name == 'language' && isMSIE8OrBelow())
            name = 'MAINFRM.language';
          window.sessionStorage.setItem(name, value);
      },
      "GetData" : function(name) {
          if(name == 'language' && isMSIE8OrBelow())
            name = 'MAINFRM.language';
          
          var d = window.sessionStorage.getItem(name);
          if (d == null) {
            return "";
          }
          else {
            return d;
          }
      },
      "Clear" : function() {
          window.sessionStorage.clear();
      },
      "GetLastErrorDetails" : function() {
          return "";
      },
      "TestExist" : function() {},
      "SetDataPersist" : function(name, value) {
        return window.localStorage.setItem(window.sessionStorage.getItem("uid")+name, value);
      },
      "GetDataPersist" : function(name) {
         var d = window.localStorage.getItem(window.sessionStorage.getItem("uid")+name);
         if (d == null) {
           return "";
         }
         else {
           return d;
         }
      },
      "ClearPersist" : function() {
        var storage = window.localStorage;
        var len = storage.length;
        var k;
        var uid = window.sessionStorage.getItem("uid");
        for(var i = len - 1 ; i >= 0 ; i--) {
          k = storage.key(i);
          if(k.indexOf(uid) >= 0) {
            storage.removeItem(k);
          }
        }
      }
    };
    return o;
  }
  else {
    //return document.getElementById("dataStoreActiveX");
    return dataStore;
  }
}

var dataStore = GetDataStoreRef();


//function func_set_dataStore(inval_name, inval_value)
//{
//	dataStore.SetData(inval_name,inval_value) ;
//}

function func_set_dataStore(inval_name, inval_value)
{
	dataStore.Content.SLDataStoreUtil.SetData(inval_name, inval_value);
}

//function func_get_dataStore(inval_name)
//{	
//	return dataStore.GetData(inval_name) ; 
//}

function func_get_dataStore(inval_name)
{	
	return dataStore.Content.SLDataStoreUtil.GetData(inval_name); 
}

//function func_set_dataStore_persist(inval_name, inval_value)
//{
//  if(window.localStorage)
//    dataStore.SetDataPersist(inval_name,inval_value);
//  else
//    dataStore.SetData(inval_name,inval_value);
//}

function func_set_dataStore_persist(inval_name, inval_value)
{
  return dataStore.Content.SLDataStoreUtil.SetData(inval_name, inval_value);
}

//function func_get_dataStore_persist(inval_name)
//{	
//  if(window.localStorage)
//    return dataStore.GetDataPersist(inval_name);
//  else
//    return dataStore.GetData(inval_name);
//}

function func_get_dataStore_persist(inval_name)
{	
  return dataStore.Content.SLDataStoreUtil.GetData(inval_name)
}

function getSessionStorage() {
  return window.sessionStorage;
}

//function isLogon()	// check is logon 
//{
//	if (isNaN(parseInt( func_get_dataStore("is_logon"))))
//		{	return 0 ;	}
//	else
//	{	return parseInt( func_get_dataStore("is_logon"));	}
//}

function isLogon()	// check is logon 
{
	if (isNaN(parseInt( dataStore.GetData("is_logon"))))
		{	return 0 ;	}
	else
	{	return parseInt( dataStore.GetData("is_logon"));	}
}

//function GetLanguage() {
//	var lang = parseInt(func_get_dataStore("language"));
//	if (!isNaN(lang))
//		return lang;
//	return 1;
//}

function GetLanguage(){
    var lang = parseInt(dataStore.GetData("language"));
    if (!isNaN(lang))
        return lang;
    return 1;
}

function SessionStorePlugin(){
    return {
        exec: function(funcName, data, callback, formatter, source) {                        
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
                default:
                  content = "unreconginsed command. Expected command: 'GetValue' and 'SetValue'";  
             }
             
             if(callback)
                callback(formatter(isSuccess, content), source);
        },
        para: function() {
            return { 
                GetValue: ["Keys"],
                SetValue: ["Key", "Value"]
             };
       }
    };
}

//-->
