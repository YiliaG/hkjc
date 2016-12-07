var XResponse = {
  /* ==== properties ====*/
  logID: "",

  sendResponse: function(responseType) {  
    var xFrame = top.frames["xsellFrame"];
    if (xFrame) {
      if (xFrame.xagent != undefined) {
        xagent = xFrame.xagent;
        xagent.sendResponseWithResult(responseType, this.logID, this.sendResponseCallback);
      }
    }
  },

  sendResponseCallback: function(responseJson) {
  }

};