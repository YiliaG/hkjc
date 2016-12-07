function BetPreviewPlugin(needRedirect, redirectFrame) {
  return {
    needRedirect: needRedirect,
    redirectFrame: redirectFrame,
    exec: function(funcName, data, callback, formatter, source) {

      switch (funcName) {
        case 'InitBetPreview':
          InitBetPreview(data);
          if(callback)
            callback(formatter(true, {}), source);
          break;
        case 'RefreshFrameHeight':
          refreshFrameHeight(data.IsXsell);
          if (callback)
            callback(formatter(true, {}), source);
          break;
      }

    },
    para: function() {
      return {
        InitBetPreview: [SavePassword, JsonBetlinesObj, Language],
        RefreshFrameHeight: [IsXsell]
      };
    }
  };
}