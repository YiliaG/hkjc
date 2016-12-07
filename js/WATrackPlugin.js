function WATrackPlugin() {
  var plugin = {
    exec: function(funcName, data, callback, formatter, source) {
      var isSuccess = false;
      var content = {};
      switch (funcName) {
        case "stmtConfirm":
          WATrackStmtConfirm();
          isSuccess = true;
          break;
        case "stmtNext":
          WATrackStmtNext();
          isSuccess = true;
          break;
        case "stmtExport":
          WATrackStmtExport();
          isSuccess = true;
          break;
        default:
          content = "unreconginsed command.";
      }

      if (callback)
        callback(formatter(isSuccess, content), source);
    },
    para: function() {
      return {
        stmtConfirm: [],
        stmtNext: [],
        stmtExport: []
      };
    }
  };
  return plugin;
}