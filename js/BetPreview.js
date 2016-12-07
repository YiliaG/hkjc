//BetPreview receiver plugin for catching request from SlipBetPreview.aspx in BetslipIB
function BetPreviewPlugin() {
  return {
    exec: function(funcName, data, callback, formatter, source) {
      var retObj = {};
      switch (funcName) {
        case 'OnClickClosePreview':
          isSuccess = true;
          OnClickClosePreview(data.DeleteBetlineArray);
          break;
        case 'OnClickClose':
          isSuccess = true;
          OnClickClose();
          break;
        case 'OnClickCloseAndRecall':
          isSuccess = true;
          OnClickCloseAndRecall();
          break;
        case 'ReceiveSendBetTicketExtendResults':
          isSuccess = true;
          ReceiveSendBetTicketExtendResults(data.SSOLastExtendStatus, data.SSOLastExtendError, data.SSOCheckReturnStatus, data.SSOSignInLevel, data.SSOWebId, data.SSOGuid);
          break;
        case 'PostSendBetAction':
          isSuccess = true;
          PostSendBetAction(data.LongNewBalance, data.BetReply, data.DeleteBetlineArray, data.ShowUnknownAmount);
        default:
          isSuccess = false;
          retObj = 'unrecongized command.';
      }

      callback(formatter(isSuccess, retObj), source);
    },
    para: function() {
      return {
        OnClickClosePreview: ['DeleteBetlineArray'],
        OnClickClose: [],
        OnClickCloseAndRecall: [],
        ReceiveSendBetTicketExtendResults: ['SSOLastExtendStatus', 'SSOLastExtendError', 'SSOCheckReturnStatus', 'SSOSignInLevel', 'SSOWebId', 'SSOGuid'],
        PostSendBetAction: ['LongNewBalance', 'BetReply', 'DeleteBetlineArray', 'ShowUnknownAmount']
      };
    }
  };
}
