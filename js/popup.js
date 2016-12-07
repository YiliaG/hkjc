var popMsgCh = '請於瀏覽器設定刪除剔選“阻擋彈出式視窗”以開啟此功能';
var popMsgEn = 'Please disable "Block pop-up windows" at browser preferences to access this function';

var popupSessionKeys = {
  acctStmt: 'is_logon,datetime_offset,account,session_id,balance,sso_guid,sso_web_id,webID',
  recall: 'is_logon,datetime_offset,account,session_id,balance,sso_guid,sso_web_id',
  eft: 'is_logon,account,session_id,save_password,seq_no,sso_guid,sso_web_id,primarynba_status,primarynba_bankcode,primarynba_bankacno,primarynba_activation,secondarynba_status,secondarynba_bankcode,secondarynba_bankacno,secondarynba_activation,hasValidAutopayDepositAcc,dda_shortBankCode,webID'
};

function PopupPlugin(needRedirect, redirectFrame) {
  return {
    needRedirect: needRedirect,
    redirectFrame: redirectFrame,
    exec: function(funcName, data, callback, formatter, source) {
      var isSuccess = false;
      var content = {};
      switch (funcName) {
        case 'Open':
          if (data.Name && popupSessionKeys[data.Name]) {
            proxy.sendMessage('SESSION_STORE', 'GetValue', { Keys: popupSessionKeys[data.Name] }, function(msg) {
              SetDataStoreObj(msg.content);
              OpenPopup(data.PopupIdx, data.Url, data.Features);
            });
          } else {
            OpenPopup(data.PopupIdx, data.Url, data.Features);
          }
          isSuccess = true;
          break;
        case 'Close':
          oPopup[data.PopupIdx].close();
          isSuccess = true;
          break;
        case 'CloseAllPopup':
          CloseAllPopup();
          isSuccess = true;
          break;
        default:
          content = 'unreconginsed command.';
      }

      if (callback)
        callback(formatter(isSuccess, content), source);
    },
    para: function() {
      return {
        Close: ['PopupIdx'],
        Open: ['PopupIdx', 'Url', 'Features']
      };
    }
  };
}