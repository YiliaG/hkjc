(function() {
    this.errImg = function(_imgObj) {
        _imgObj.style.display = "none";
    };

    this.indexOfArray = function(arr, obj, start) {
        for (var i = (start || 0), j = arr.length; i < j; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    };

    this.Results = {
        renderMatches: function(labels, matches) {
            var el = $("<table>").attr({
                width: "100%",
                cellspacing: "0",
                cellpadding: "0",
                border: "0"
            }).append(
        $("<tbody>").append(
          $("<tr>").addClass("tblHead").append(
            $("<td>").addClass("matchLeg").attr("rowspan", "2").html(
              labels.find("leg").text()
              ),
            $("<td>").addClass("matchNum").attr("rowspan", "2").html(
              labels.find("matchno").text()
              ),
            $("<td>").addClass("matchLeague").attr("rowspan", "2").html(
              $("<a>").attr("href", "javascript:goFlagUrl();").append(
                $("<img>").attr({
                    "title": labels.find("leagues_and_tournaments").text(),
                    "alt": labels.find("leagues_and_tournaments").text(),
                    "src": labels.find("icon_flag_image_path").text()
                })
                )
              ),
            $("<td>").addClass("center").attr("rowspan", "2").html(
              labels.find("teams").text()
              ),
            $("<td>").addClass("matchDate").attr("rowspan", "2").html(
              labels.find("date").text()
              ),
            $("<td>").addClass("center").attr("colspan", "2").html(
              labels.find("matchresults").text()
              )
            ),
          $("<tr>").addClass("tblHead2").append(
            $("<td>").addClass("resHalf").html(
              labels.find("res_halftime").text()
              ),
            $("<td>").addClass("resFull").html(
              labels.find("res_fulltime").text() + " (" + labels.find("ninety_mins").text() + ")"
              )
            )
          )
        );

            matches.each(function(i, match) {
                el.append(
            $("<tr>").addClass("oddsContent" + (i % 2 == 0 ? "2" : "1")).append(
              $("<td>").addClass("center").html(
                $(match).find("ltrLegs").text()
                ),
              $("<td>").addClass("matchNum").html(
                $(match).find("ltrMatchDay").text()
                ),
              $("<td>").addClass("matchLeague").html(
                $(match).find("ltrLeague").text()
                ),
              $("<td>").addClass("matchTeam").html(
                $(match).find("ltrTeams").text()
                ),
              $("<td>").addClass("matchDate").html(
                $(match).find("ltrDate").text()
                ),
              $("<td>").addClass("center").html(
                $(match).find("tdHalfRes").text()
                ),
              $("<td>").addClass("center").html(
                $(match).find("tdFullRes").text()
                )
              )
            );
            });
            return el;
        },

        renderResult: function(showCloseDate, node) {
            var result = $("<tr>").attr("matchid", node.attr("MatchID")).addClass("MatchTr");
            result.append(
        $("<td>").addClass("space2").append(
          $("<table>").attr({
              width: "100%",
              cellspacing: "0",
              cellpadding: "0",
              border: "0"
          }).append(
            $("<tbody>").append(
              $("<tr>").click(function() { toggleRow(this); }).append(
                $("<td>").addClass("subTitle").append(
                  $("<table>").attr({
                      width: "100%",
                      cellspacing: "0",
                      cellpadding: "0",
                      border: "0"
                  }).append(
                    $("<tbody>").append(
                      $("<tr>").append(
                        $("<td>").append(
                          $("<img>").attr("src", node.find("btn_close_image_path").text()),
                          " " + node.find("title").text()
                          ),
                        $("<td>").addClass("right"),
                        $("<td>").addClass("right").html(
                          showCloseDate ? node.find("closeDate").text() : ""
                          )
                        )
                      )
                    )
                  )
                ),
              $("<tr>").append(
                $("<td>").append(
                  $("<table>").attr({
                      width: "100%",
                      cellspacing: "0",
                      cellpadding: "0",
                      border: "0"
                  }).append(
                    $("<tbody>").append(
                      $("<tr>"),
                      $("<tr>").addClass("yellowBar").append(
                        $("<td>").html(
                          node.find("winComb").text()
                          ),
                        $("<td>").html(
                          node.find("jackpot").text()
                          ),
                        $("<td>").html(
                          node.find("invest").text()
                          ),
                        $("<td>").css("display", node.find("unitDiv").text() == "" ? "none" : "table-cell").html(
                          node.find("unitDiv").text()
                          ),
                        $("<td>").css("display", node.find("winInv").text() == "" ? "none" : "table-cell").html(
                          node.find("winInv").text()
                          )
                        )
                      )
                    )
                  )
                ),
              $("<tr>").append(
                $("<td>").append(
                  this.renderMatches(node.find("labels"), node.find("match"))
                  )
                )
              )
            )
          )
        );
            return result;
        },

        renderPool: function(node) {
            var el = $("<table>").attr({
                border: "0",
                cellspacing: "0",
                cellpadding: "0",
                width: "100%",
                poolKey: node.attr("key")
            }).addClass("tblResults");

            el
        .append(
          $("<tr>").click(function() { toggleRow(this); }).append(
            $("<td>").attr("colspan", node.find("CountTd").text()).addClass("subTitleBar").append(
              $("<table>").attr({
                  border: "0",
                  cellspacing: "0",
                  cellpadding: "0",
                  width: "100%"
              }).addClass("tblResults").append(
                $("<tr>").attr("id", "trClick").append(
                  $("<td>").attr("align", "left").css("width", "14px").append(
                    $("<img>").attr("src", node.find("ImgSrc").text())
                    ),
                  $("<td>").attr("align", "left").attr("valign", "middle").append(
                    $("<span>").css("padding-right", "7px").html("&nbsp;&nbsp;" + node.find("Title").text()),
                    $(node.find("HelpIcon").text())
                    )
                  )
                )
              )
            ),
          $(node.find("WinInfo").text() + node.find("WinOdds").text())
        );

            return el
        },

        render: function(showCloseDate, xml) {
            var self = this;
            $(xml).find("result").each(function() {
                var matchID = parseInt($(this).attr("MatchID"), 10);
                var el = self.renderResult(showCloseDate, $(this));
                var tr = $("tr.MatchTr[matchid=" + matchID + "]");
                if (tr.length > 0) {
                    tr.replaceWith(el);
                } else {
                    var trs = $("tr.MatchTr").filter(function() {
                        return parseInt($(this).attr("matchid"), 10) < matchID;
                    });
                    if (trs.length > 0) {
                        $(trs[0]).before(el);
                    } else {
                        $("tr.MatchTr").after(el);
                    }
                }
            });
        },

        renderLastOdds: function(poolString, xml) {
            var self = this;
            var lastOddsRefreshTime = this.convertDateTime($("#lastOddsRefreshTime").text().replace(/\//g, '-') + ":00")
            $(xml).find("pool").each(function() {
                var poolKey = $(this).attr("key");
                if (poolKey == "NTS") {
                    var tr = $("td.pools > .tblResults[poolKey=NTS] tr[itemKey=" + $(this).attr("itemKey") + "]");
                    if (tr.length > 0) {
                        tr.replaceWith($(this).find("WinOdds").text());
                    }
                } else {
                    var lastOddsRefreshTimes = $(this).find("LastOddsRefreshTime").text().trim().split(";");
                    for (var i = 0; i < lastOddsRefreshTimes.length; ++i) {
                        if (lastOddsRefreshTimes[i].trim() == "") continue;
                        var dateTime = self.convertDateTime(lastOddsRefreshTimes[i].trim());
                        if (dateTime.getTime() > lastOddsRefreshTime.getTime()) {
                            lastOddsRefreshTime = dateTime;
                        }
                    }
                    var el = self.renderPool($(this));
                    var table = $("td.pools > .tblResults[poolKey=" + poolKey + "]");

                    if (table.length > 0) {
                        // just need to update the item in SPC INPLAY
                        if (poolKey == "SPC_INPLAY") {
                            el.find("tr[type='item_header']").each(function() {
                                var itemId = parseInt($(this).attr("item"));
                                if (table.find("tr[type='item_header'][item='" + itemId + "']").length > 0) {
                                    table.find("tr[type='item_ans'][item='" + itemId + "']").remove();
                                    table.find("tr[type='item_odds'][item='" + itemId + "']").remove();
                                    table.find("tr[type='item_header'][item='" + itemId + "']").after(el.find("tr[type='item_odds'][item='" + itemId + "']"));
                                    table.find("tr[type='item_header'][item='" + itemId + "']").after(el.find("tr[type='item_ans'][item='" + itemId + "']"));
                                    table.find("tr[type='item_header'][item='" + itemId + "']").replaceWith(el.find("tr[type='item_header'][item='" + itemId + "']"));
                                } else {
                                    var items = table.find("tr[type='item_header']").filter(function() {
                                        return parseInt($(this).attr("item")) > itemId;
                                    });

                                    if (items.length > 0) {
                                        var targetItem = $(items[0]);
                                        targetItem.before(el.find("tr[type='item_header'][item='" + itemId + "']"));
                                        targetItem.before(el.find("tr[type='item_ans'][item='" + itemId + "']"));
                                        targetItem.before(el.find("tr[type='item_odds'][item='" + itemId + "']"));
                                    } else {
                                        var lastItem = table.find("tr:last");
                                        lastItem.after(el.find("tr[type='item_odds'][item='" + itemId + "']"));
                                        lastItem.after(el.find("tr[type='item_ans'][item='" + itemId + "']"));
                                        lastItem.after(el.find("tr[type='item_header'][item='" + itemId + "']"));
                                    }
                                }
                            });
                        } else {
                            table.replaceWith(el);
                        }
                    } else {
                        var _pools = poolString.split(',');
                        var pools = [];
                        for (var i = 0; i < _pools.length; ++i) {
                            pools.push(_pools[i])
                            if (indexOfArray(["HAD", "TQL", "HHA", "HIL", "CHL", "CRS", "FCS", "HFT", "SPC"], _pools[i]) >= 0) {
                                pools.push(_pools[i] + "_INPLAY")
                            }
                        }

                        var tables = $("td.pools > .tblResults").filter(function() {
                            return indexOfArray(pools, $(this).attr("poolKey")) > indexOfArray(pools, poolKey);
                        });

                        if (tables.length > 0) {
                            $(tables[0]).before(el);
                        } else {
                            $("td.pools > .tblResults:last").after(el);
                        }
                    }
                }
            });

            $("#lastOddsRefreshTime").text(this.leftPad0(lastOddsRefreshTime.getDate()) + "/" + this.leftPad0(lastOddsRefreshTime.getMonth() + 1) + "/" + lastOddsRefreshTime.getFullYear() + " " + this.leftPad0(lastOddsRefreshTime.getHours()) + ":" + this.leftPad0(lastOddsRefreshTime.getMinutes()));
        },

        convertDateTime: function(dateTimeStr) {
            var dateTime = dateTimeStr.split(" ");

            var date = dateTime[0].split("-");
            var yyyy = date[2];
            var mm = date[1] - 1;
            var dd = date[0];

            var time = dateTime[1].split(":");
            var h = time[0];
            var m = time[1];
            var s = parseInt(time[2]); //get rid of that 00.0;

            return new Date(yyyy, mm, dd, h, m, s);
        },

        leftPad0: function(str) {
            str = str + "";
            var pad = "00";
            return pad.substring(0, pad.length - str.length) + str;
        }

    }
}).call(this);