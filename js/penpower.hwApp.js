$j = jQuery.noConflict();
(function(d) {
    function v() {
        r = h = 0;
        n.clearRect(0, 0, m.width, m.height);
        null != l && (l.cancel(), l = null);
        e = [];
        0 === e.length && t.call(this)
    }

    function g(b, a) {
        this.x = b;
        this.y = a
    }

    function w(b) {
        var a = "";
        16 > b && (a += "0");
        return a += b.toString(16).toUpperCase()
    }

    function z(b) {
        for (var a = null, k = "", f = 0, c = a = 0, e = 0, c = 0, e = b.length; c < e; c += 1) a = b[c], 0 <= a.x ? (f = w(Math.floor(a.x)), a = w(Math.floor(a.y)), k += f, k += a) : k += "FF";
        return k
    }

    function x() {
        null != l && (l.cancel(), l = null);
        l = d.pplater(1E3, null, function() {
            var b = [],
                a = 0,
                k = 0;
            if (1 === r) {
                h = 0;
                l.cancel();
                l = null;
                a = 0;
                for (k = e.length; a < k; a += 1) b.push(new g(e[a].x, e[a].y));
                
                proxy.sendMessage('PPHW', 'Query', {Url: A, Data: z(b)},
                function(a) {                    
                    a = d.parseJSON(a.content);
                    var b = 0,
                            k = 0,
                            c = [];
                    if ("ok" === a.result) {
                        b = 0;
                        for (k = a.words.length; b < k; b += 1) c.push(a.words.charAt(b));
                        B.call(null, c)
                    }
                });

                /*
                d.ajax({
                url: A,
                type: "post",
                data: {
                DT: z(b)
                },
                success: function (a) {
                a = d.parseJSON(a);
                var b = 0,
                k = 0,
                c = [];
                if ("ok" === a.result) {
                b = 0;
                for (k = a.words.length; b < k; b += 1) c.push(a.words.charAt(b));
                B.call(null, c)
                }
                }
                })*/
            }
        }, [], !0)
    }

    function E() {
        null != l && (l.cancel(), l = null);
        for (var b = 0, a = -1, k = [], f = 0, c = 0, f = 0, c = e.length; f < c; f += 1) 0 > e[e.length - f - 1].x && (b += 1, 2 === b && (a = e.length - f - 1));
        if (0 < a) {
            for (f = 0; f <= a; f += 1) k.push(e[f]);
            e = k
        } else e = [];
        var f = k = a = b = -1,
            h = c = 0;
        n.clearRect(0,
            0, m.width, m.height);
        c = 0;
        for (h = e.length; c < h; c += 1) k = e[c].x, f = e[c].y, 0 <= k ? 0 <= b ? s(new g(b, a), new g(k, f)) : s(new g(k, f), new g(k, f)) : 0 <= b && s(new g(b, a), new g(b, a)), b = k, a = f;
        0 < e.length ? x() : t.call(this)
    }

    function s(b, a) {
        n.strokeStyle = "black";
        n.lineWidth = C;
        n.lineCap = "round";
        n.beginPath();
        n.moveTo(b.x, b.y);
        n.lineTo(a.x, a.y);
        n.stroke();
        n.closePath()
    }

    function D(b, a) {
        null != l && (l.cancel(), l = null);
        0 === h ? (p = b, q = a, h = 1) : 3 === h && (p = b, q = a, h = 4);
        r = 0
    }

    function c(b, a) {
        if (1 === h || 2 === h || 4 === h) {
            r = 0;
            if (b !== p || a !== q) s(new g(p, q),
                new g(b, a)), 1 !== h && 4 !== h || e.push(new g(p, q)), e.push(new g(b, a)), p = b, q = a;
            h = 2;
            x()
        }
    }

    function F(b, a) {
        if (2 === h || 4 === h) {
            if (b !== p || a !== q) e.push(new g(b, a)), s(new g(p, q), new g(b, a));
            e.push(new g(-1, -1));
            p = b;
            q = a;
            h = 3;
            r = 1
        } else h = 0;
        x()
    }

    function y() {
        2 === h && (e.push(new g(-1, -1)), r = 1, h = 3)
    }
    var l = null,
        h = 0,
        r = 0,
        e = [],
        p = 0,
        q = 0,
        m = null,
        n = null,
        C = 0,
        A = "",
        B = null,
        t = null,
        u = {
            init: function(b) {
                b = d.extend({
                    recognizeUrl: "",
                    lineWidth: 3,
                    getCandidates: function() { },
                    inkingEmpty: function() { }
                }, b);
                B = b.getCandidates;
                t = b.inkingEmpty;
                C = b.lineWidth;
                A = b.recognizeUrl;
                m = d(this).get(0);
                "undefined" !== typeof G_vmlCanvasManager && (m = G_vmlCanvasManager.initElement(m));
                n = m.getContext("2d");
                d(this).bind("mousedown", function(a) {
                    a.preventDefault();
                    var b = m.getBoundingClientRect(),
                        c = a.clientX - Math.round(b.left);
                    a = a.clientY - Math.round(b.top);
                    D(c, a)
                }).bind("mousemove", function(a) {
                    a.preventDefault();
                    var b = m.getBoundingClientRect(),
                        f = a.clientX - Math.round(b.left);
                    a = a.clientY - Math.round(b.top);
                    c(f, a)
                }).bind("mouseup", function(a) {
                    a.preventDefault();
                    var b = m.getBoundingClientRect(),
                        c = a.clientX - Math.round(b.left);
                    a = a.clientY - Math.round(b.top);
                    F(c, a)
                }).bind("mouseleave", function(a) {
                    a.preventDefault();
                    y()
                });
                d(this).bind("touchstart", function(a) {
                    a.preventDefault();
                    var b = m.getBoundingClientRect(),
                        c = a.originalEvent.touches[0];
                    a = c.clientX - Math.round(b.left);
                    b = c.clientY - Math.round(b.top);
                    D(a, b)
                }).bind("touchmove", function(a) {
                    a.preventDefault();
                    var b = m.getBoundingClientRect(),
                        f = a.originalEvent.touches[0];
                    a = f.clientX - Math.round(b.left);
                    f = f.clientY - Math.round(b.top);
                    var e = new g(a, f),
                        b =
                            0 > e.x || 0 > e.y || e.x > b.width || e.y > b.height ? !1 : !0;
                    !0 === b ? c(a, f) : y()
                }).bind("touchend", function(a) {
                    a.preventDefault();
                    var b = m.getBoundingClientRect(),
                        c = a.originalEvent.changedTouches[0];
                    a = c.clientX - Math.round(b.left);
                    b = c.clientY - Math.round(b.top);
                    F(a, b)
                });
                return this
            },
            undo: function() {
                E()
            },
            clean: function() {
                v()
            }
        };
    d.fn.pphandwrite = function(b) {
        if (u[b]) return u[b].apply(this, Array.prototype.slice.call(arguments, 1));
        if ("object" !== typeof b && b) d.error("Method " + b + "does not exist on jQuery.ppPalette");
        else return u.init.apply(this,
            arguments)
    };
    d.pplater = function(b, a, c, f, e) {
        b = b || 0;
        a = a || {};
        var h = null,
            l = d.makeArray(f),
            g = f = null,
            h = "string" === typeof c ? a[c] : c;
        if (!h) throw {
            name: "TypeError",
            message: "The function is undefined."
        };
        f = function() {
            h.apply(a, l)
        };
        g = e ? setInterval(f, b) : setTimeout(f, b);
        return {
            id: g,
            interval: e,
            cancel: function() {
                this.interval ? clearInterval(g) : clearTimeout(g)
            }
        }
    }
})(jQuery);
"use strict";
var penpower = penpower || {};
penpower.hwApp = function() {
  var d = null,
        v = null,
        g = null,
        w = "",
        z = 3,
        x = function() {
          $j(".pphw-iconButton").click(function(c) {
            c.preventDefault();
            c = $j(this).attr("id");
            g.call(null, c)
          })
        }, E = function() {
          d = $j("#pphw-canvas").pphandwrite({
            lineWidth: z,
            recognizeUrl: w,
            getCandidates: function(c) {
              for (var g = $j(".pphw-candidate"), d = 0, l = 0, d = 0, l = c.length; d < l; d += 1) d < g.length && $j(g[d]).text(c[d]).removeAttr("disabled");
              $j(".pphw-function").removeAttr("disabled")
            },
            inkingEmpty: function() {
              $j('.pphw-function-hover').attr('class', 'pphw-function');
              $j(".pphw-candidate").text("").attr("disabled", "disabled");
              $j(".pphw-function").attr("disabled", "disabled")
            }
          })
        }, s = function() {
          $j("#undobtn").click(function(c) {
            c.preventDefault();
            d.pphandwrite("undo")
          });
          $j("#rewritebtn").click(function(c) {
            c.preventDefault();
            d.pphandwrite("clean")
          })
        }, D = function() {
          $j(".pphw-candidate").click(function(c) {
            c.preventDefault();
            "undefined" !== typeof v && v.call(null, $j(this).text());
            d.pphandwrite("clean")
          })
        }, R = function(k, v, e, d, p) {
			var t = k + "=" + v;
			if (e) {
				var c = new Date();
				c.setMilliseconds(c.getMilliseconds() + e);
				t += ";expires=" + c.toUTCString();
			}
			if (d) {
				t += ";domain=" + d;
			}
			if (p) {
				t += ";path=" + p;
			}
			document.cookie = t;
		}, G = function(k) {
			if (!k)
				return null;
			var i = document.cookie.split(";");
			for(var j = 0; j < i.length; j++) {
				var e = i[j];
				while (e.charAt(0) == ' ')
					e = e.substring(1, e.length);
				if (e.indexOf(k+"=") == 0)
					return e.substring((k+"=").length, e.length);
			}
			return null;
        };
  return {
    init: function(c) {
      if (!(c && c.select && c.recognizeUrl && c.selector && c.padBtnClick)) throw Error("must pass option");
      w = c.recognizeUrl;
      v = c.select;
      z = c.lineWidth || 3;
      g = c.padBtnClick;
      var d = c.textSetting;
      c = $j(c.selector);
      var y = $j('<div id="pphw-panel"></div>'),
				W = $j('<div id="warning-panel"></div>'),
				I = $j('<p class="msgContent"><img class="msgContent" src="images/notice.jpg"></p>'),
				M = pphwReminderMessage,
                l = $j('<div class="yellowTop"></div>'),
                h = $j('<div class="yellowBottom"></div>'),
                r = $j('<div class="hwBody"></div>'),
                e = $j('<div class="hwBody-left"></div>'),
                p = $j('<div class="hwBody-right"></div>'),
                q = $j('<div class="pphw-productLabel">\u624b\u5beb\u677f</div>'),
                m = $j('<div class="pphw-companyLabel">\u8499\u606c\u79d1\u6280</div>'),
                n = $j('<div class="pphw-canvas-container"></div>'),
                C = $j('<canvas id="pphw-canvas" width="180" height="180" style="width: 100%;height: 100%;"></canvas>'),
                A = $j('<button id="qmarkbtn" class="pphw-iconButton"></button>'),
                B = $j('<button id="xmarkbtn" class="pphw-iconButton"></button>'),
                t = $j('<button id="undobtn" class="pphw-function">\u9084\u539f</button>'),
                u = $j('<button id="rewritebtn" class="pphw-function">\u91cd\u5beb</button>'),
                b = 0,
                a = 0;
      d && d.productLabel && q.text(d.productLabel);
      d && d.companyLabel && m.text(d.companyLabel);
      d && d.undoLabel && t.text(d.undoLabel);
      d && d.rewriteLabel && u.text(d.rewriteLabel);
      b = 0;
      for (a = 6; b < a; b += 1) $j("<button></button>", {
        id: "hwCand" + (b +
                    1),
        "class": "pphw-candidate"
      }).appendTo(e);
      p.append(q).append(m).append(A).append(B).append(t).append(u);
      C.appendTo(n);
      p.append(n);
      r.append(e).append(p);
      W.append(I);
      W.append(M);
      y.append(l).append(h).append(r);
      y.append(W);
      c.append(y);
      x();
      E();
      s();      
      $j(".pphw-candidate, .pphw-function").attr("disabled", "disabled");
      D();
      $j('.pphw-function')
      .mouseenter(function() {
        if (!$j(this).is(':disabled'))
          jQuery(this).attr('class', 'pphw-function-hover');
      })
      .mouseleave(function() {
        if (!$j(this).is(':disabled'))
          jQuery(this).attr('class', 'pphw-function');
      });
      $j("#pphw-panel #warning-panel #continue").off();
      $j("#pphw-panel #warning-panel #clickhere").off();
      $j("#pphw-panel #warning-panel #continue").click(function(e) {
		e.preventDefault();
		R("pphw", "pphw", pphwReminderInterval, pphwCookieDomain, "/");
		$j("#warning-panel").hide();
      });
      $j("#pphw-panel #warning-panel #clickhere").click(function(e) {
		e.preventDefault();
		var width = 790;
		var height = 500;
		var left = (screen.width - width) / 2;
		var top = (screen.height - height) / 2;
		var scrollbar = 1;
		var statusbar = 1;
		var sFeatures = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height
          + ",scrollbars=" + scrollbar + ",status=" + statusbar
          + ",location=0,menubar=0,resizable=0,titlebar=0";
		win = window.open(pphwCookieWarningPath, '_blank', sFeatures);
		win.self.focus();
      });
    },
    showPanel: function(c) {
      if (!G("pphw")) {
		$j("#warning-panel").show();
      } else {
		$j("#warning-panel").hide();
      }
      "block" !== $j("#pphw-panel").css("display") && $j("#pphw-panel").show();
      $j("#pphw-panel").offset({
        left: c.left,
        top: c.top
      });
    },
    hidePanel: function() {
      d.pphandwrite("clean");
      $j("#pphw-panel").offset({
        left: 0,
        top: 0
      }).hide()
    }
  }
} ();