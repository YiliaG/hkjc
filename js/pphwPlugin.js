function pphwPlugin() {
  var obj = {
    exec: function(funcName, data, callback, formatter, source) {
        switch (funcName) {
          case 'Query':
            $j.ajax({
              url: data.Url,
              type: "post",
              data: {
                DT: data.Data
              },
              success: function(a) {
                if (callback)
                  callback(formatter(true, a), source);
              }
            })           
            break;          
        }
      },
      para: function() {
        var paraList = {
          Query: ['Url', 'Data']
        };
      return paraList;
    }
  };

  return obj;
}