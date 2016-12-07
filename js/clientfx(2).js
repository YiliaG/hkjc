/*
Name:	HongKong Jockey Club JCBW Javascript Common Framework
Target:	Solve Javascript multi-browser compitability, improve HKJC client logic expansibility, implement some common function such as auto refresh / HTTP POLL
Create:	rivers.j.zhao
Date:	05/01/2010
*/

/*
Goal: Multi-Browser Compatible, BOM/DOM Element finding, client function extention
1. Basic extend methods, independent browser:
a. Global method/property, such as: object extend, for each object list, for try each object list, for each function execution
b. JSON support.
2. Browser extend:
a. DOM element select
b. DOM property visit
c. Browser event visit
e. Document load resource
f. AJAX

*/

(function() {
	var $name = "HKJC Client Framework";
	var $version = 0.68;
	var $oldfx = window.$$;
	if (window.$$ && (window.$$.version >= $version))
		return;

	function $extend() {
		var obj = arguments[0] || {};
		for (var i = 1; i < arguments.length; i++) {
			var ext = arguments[i];
			var extType = typeof ext;
			if (extType == 'object' || extType == 'function') {
				for (var attrName in ext) {
					obj[attrName] = ext[attrName];
				}
			}
		}
		return obj;
	}

	var $$ = function(expr, context) {
		return new $fn.init(expr, context);
	};

	var NodeType = { Element: 1, Attribute: 2, Text: 3, Comments: 8, Document: 9 };
	var XmlReadyState = { Uninitialized: 0, Loading: 1, Loaded: 2, Interactive: 3, Completed: 4 };

	$extend($$, {
		name: $name,
		version: $version,
		oldfx: $oldfx,
		extend: $extend,
		ticker: (function() {
			var count = 0;
			return function times() {
				return count++;
			}
		})(),
		extendfn: function(fn, extfn___) {
			var list = [];
			$$.mergeArray(arguments);
			list.unshift($fn);
			$$.extend.apply(null, list);
		},
		typeOf: function(fn) {
			if (typeof fn == 'function') {
				var matched = fn.toString().match(/function\s+(\w*)\(/);
				return matched ? matched[1] : "";
			}
		},
		isNullOrUndefined: function(obj) {
			return (typeof obj == 'undefined') || obj == null;
		},
		forEach: function(objList, func, params) {
			params = params instanceof Array ? params : [params];
			if ($$.hasAttr(objList, "length")) {
				for (var i = 0; i < objList.length; i++) {
					var obj = objList[i];
					params.push(i);
					func.apply(obj, params);
					params.pop();
				}
			}
			else {
				for (var name in objList) {
					var obj = objList[name];
					params.push(name);
					func.apply(obj, params);
					params.pop(name);
				}
			}
		},
		tryEach: function(objList, func, params) {
			params = params instanceof Array ? params : [params];
			for (var i = 0; i < objList.length; i++) {
				var obj = objList[i];
				try {
					var result = func.apply(obj, params);
					if (result) {
						return result;
					}
				}
				catch (ex) {
				}
			}
		},
		tryFunc: function(functions___, parameterArray) {
			var fnList = [];
			var params = [];
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (typeof arg == 'function')
					fnList.push(arg);
				else
					params = $$.mergeArray(arg);
			}
			for (var i = 0; i < fnList.length; i++) {
				var fn = fnList[i];
				var succ;
				try {
					succ = fn.apply(null, params);
					if (succ)
						return succ;
				} catch (ex) { }
			}
		},
		format: (function() {
			var rplfn = {};
			return function() {
				var ret = arguments[0];
				for (var i = 1; i < arguments.length; i++) {
					if (!rplfn[i]) {
						var s = "return ret.replace(/\\{" + (i - 1) + "\\}/ig, val)";
						rplfn[i] = new Function("ret", "val", s);
					}
					ret = rplfn[i](ret, arguments[i]);
				}
				return ret;
			}
		})(),
		trim: function(str) {
			var result = (typeof str == 'string')
				? str.replace(/(^\s*)|(\s*$)/g, "")
				: str;
			return result;
		},
		contain: function(cmpObj, params__) {
			var params = [];
			for (var i = 1; i < arguments.length; i++) {
				params.push(arguments[i]);
			}
			collection = $$.mergeArray.apply(null, params);
			for (var i = 0; i < collection.length; i++) {
				if (cmpObj == collection[i])
					return true;
			}
			return false;
		},
		math: (function() {
			return {
				P: function(n) {
					var result = 1;
					for (var i = 1; i <= n; i++) {
						result *= i;
					}
					return result;
				},
				C: function(m, n) {
					if (m < n)
					{ var t = m; m = n; n = t; }
					var result = 1;
					for (var i = n; i < m; i++)
						result *= i;
					return result;
				},
				max: function() {
					var pmax = arguments[0];
					for (var i = 1; i < arguments.length; i++) {
						if (pmax < arguments[i])
							pmax = arguments[i];
					}
				},
				min: function() {
					var pmin = arguments[0];
					for (var i = 1; i < arguments.length; i++) {
						if (pmin > arguments[i])
							pmin = arguments[i];
					}
				}
			};
		})(),
		mergeArray: function() {
			var arr = [];
			for (var i = 0; i < arguments.length; i++) {
				var args = arguments[i];
				if (args.length > 0) {
					for (var j = 0; j < args.length; j++) {
						arr.push(args[j]);
					}
				}
				else {
					arr.push(args);
				}
			}
			return arr;
		},
		QueueRun: function(delay, justOnceInDelay) {
			var self = this;
			self.items = [];
			self.delay = delay > 0 ? delay : 200;
			self.justOnceInDelay = justOnceInDelay || false;
			self.timer = null;
			self.runner = function() {
				self.timer = setTimeout(function() {
					var item = self.items.shift();
					if (item) {
						item.fn.apply(null, item.params);
						if (self.justOnceInDelay) {
							self.items.length = 0;
						}
						self.runner();
					}
					else {
						self.timer = null;
					}
				}, self.delay);
			};
			self.exec = function(fn, params___) {
				var params = $$.mergeArray(arguments);
				params.shift();
				var item = {
					fn: fn,
					params: params
				};
				self.items[self.items.length] = item;
				if (self.timer == null) {
					self.runner();
				}
			};
			self.clear = function() {
				self.items.length = 0;
			}
		},
		asyncExec: function(beginFn, endFn, arrBeginFnParams) {
			var callbackName = "ansycFunction_" + $$.ticker();
			var ansycObj = {
				endExecName: "$$.ansycExec." + callbackName,
				endExec: function(endFnParams___) {
					var args = $$.mergeArray(arguments);
					delete $$.ansycExec[callbackName];
					endFn.apply(ansycObj, args);
				}
			};
			var args = $$.mergeArray(arrBeginFnParams, ansycObj);
			$$.ansycExec[callbackName] = ansycObj.endExec;
			beginFn.apply(ansycObj, args);
		},
		testExec: function(testFn, succFn, failFn, delay, timeout) {
			var delay = delay > 0 ? delay : 200;
			var timeout = timeout > delay ? timeout : delay * 60;
			var timer = null;
			timer = setInterval(function() {
				timeout -= delay;
				var succ = false;
				try {
					succ = testFn();
				}
				catch (ex) { }
				if (succ) {
					clearInterval(timer);
					if (succFn)
						succFn();
				}
				else if (timeout < 0) {
					clearInterval(timer);
					if (failFn)
						failFn();
				}
			}, delay);
		},
		json: function(src, deep) {
			function parseJson(obj, deep) {
				var ret = "";
				if (deep > 0) {
					for (var name in obj) {
						var type = typeof obj[name];
						var val = "";
						if ($$.isNullOrUndefined(obj[name])) {
							val = "'null'";
						}
						else if (obj[name] instanceof Date) {
							val = "\"" + obj[name].toString() + "\"";
						}
						else if (type == 'number') {
							val = obj[name];
						}
						else if (type == 'string')
							val = "\"" + obj[name] + "\"";
						else if (type == 'boolean')
							val = obj[name] ? "true" : "false";
						else if (type == 'function')
						/* val = "\"[FUNCTION]\""; */
							val = "null";
						else if (type == 'undefined')
							val = "undefined";
						else if (type == "object") {
							val = arguments.callee(obj[name], deep - 1);
						}

						var sepChar = (ret != "") ? ',' : '';
						if (obj instanceof Array) {
							ret += $$.format("{0}{1}", sepChar, val);
						}
						else {
							ret += $$.format("{0}{1}:{2}", sepChar, name, val);
						}
					}
				}
				ret = obj instanceof Array
					? "[" + ret + "]"
					: "{" + ret + "}";
				return ret;
			}

			var type = typeof src;
			if (type == 'string') {
				try {
					var foo = new Function("str", "return " + src);
					return foo();
				}
				catch (ex) {
					throw new Error("JSON FORMAT ERROR: " + ex.message + "\n" + src);
				}
			}
			else if (type == 'object' || type == 'function') {
				var ret = parseJson(src, deep > 0 ? deep : 3);
				return ret;
			}
		},
		LangDictionary: function() {
			this.lang = "";
			this.dics = {};
			this.items = [];
			this.getText = function(key, lang) {
				var dic =
					this.dics[lang]
					|| this.dics[this.lang];
				/*|| (function() { for (var name in this.dics) return dics[name]; })();*/
				if (dic) {
					return dic[key];
				}
			};
			this.add = function(lang, key, text) {
				if (!this.dics[lang]) {
					this.dics[lang] = {};
				}
				this.dics[lang][key] = text;
			};
			this.importLang = function(lang, pkgLang) {
				for (var name in pkgLang) {
					this.add(lang, name, pkgLang[name]);
				}
			};
			this.assign = function(control, key, handler) {
				this.items.push({ key: key, control: $$(control), handler: handler });
			};
			this.setLang = function(lang) {
				this.lang = lang;
				for (var i = 0; i < this.items.length; i++) {
					var key = this.items[i].key;
					var text = this.getText(key);
					var handler = this.items[i].handler;
					var control = this.items[i].control;
					if (control.items.length > 0) {
						if (typeof handler == 'function') {
							$$.forEach(control.items, function() {
								handler.apply(this, [this, lang, key, text]);
							});
						}
						else {
							var text = this.getText(key, lang);
							control.value(text);
						}
					}
				}
			};
		},
		LazyObjectPool: function() {
			return {
				items: {},
				exist: function(key) { return !$$.isNullOrUndefined(this.items[key]); },
				add: function(key, refObj) { this.items[key] = refObj; },
				remove: function(key) { this.items[key] = undefined; },
				fetch: function(key) {
					if (typeof this.items[key] == 'function') {
						var loadData = this.items[key];
						this.items[key] = loadData();
					}
					return this.items[key];
				}
			};
		},
		event: function() {
			if (window.event)
				return window.event;
			func = arguments.callee;
			while (func != null) {
				var arg0 = func.arguments[0];
				if (arg0) {
					if (arg0.constructor == Event
						|| arg0.constructor == MouseEvent
						|| (typeof arg0 == "object" && arg0.preventDefault && arg0.stopPropagation)
						)
					{ return arg0; }
				}
				func = func.caller;
			}
			return null;
		},
		attachEvent: function(obj, eventName, eventFunc) {
			if (obj.attachEvent) {	// msie
				obj.attachEvent(eventName, eventFunc);
			}
			else if (obj.addEventListener) {	// firefox, safari etc.
				var evtName = eventName.replace(/^on/ig, "");
				obj.addEventListener(evtName, eventFunc, false);
			}
			else {
				var oldEvent = obj[eventName];
				obj[eventName] = function() {
					if (typeof oldEvent == 'function')
						oldEvent.apply(this);
					if (typeof eventFunc == 'function')
						eventFunc.apply(this);
				}
			}
		},
		load: function(src, context, allowRepeat) {
			var data = {};
			if (typeof src == "string") {
				$$.extend(data, {
					tagname: "script",
					id: src.replace(/\/|:|\./ig, "_"),
					type: "text/javascript",
					language: "javascript",
					src: src
				});
			}
			else {
				$$.extend(data, src);
			}
			var script = $$.$(data.id);
			if (!script || (script && allowRepeat)) {
				var element = document.createElement(data.tagname);
				for (var i in data)
					if (i != "tagname")
					element[i] = data[i];
				var host = context || $$.tryFunc(
					function() { return $$.$tag("head")[0]; },
					function() { return $$.$tag("body")[0]; });
				if (host) {
					host.appendChild(element);
					return element;
				}
			}
			return null;
		},
		queryString: function(url) {
			if ($$.isNullOrUndefined(url)) {
				url = location.href;
			}
			if (typeof url == 'string') {
				var result = {};
				try {
					var s = url.split("?")[1] || url;
					var rows = $$.split(s, "&", "=");
					for (var i = 0; i < rows.length; i++) {
						var item = rows[i];
						var name = item[0].toLowerCase();
						var value = $$.isNullOrUndefined(item[1]) ? "" : item[1];
						result[name] = value;
					}
				}
				catch (e) {
				}
				return result;
			}
			else if (typeof url == 'object') {
				var querystr = "";
				for (var name in url) {
					querystr += $$.format("{0}{1}={2}", querystr.length == 0 ? "" : "&", name, url[name]);
				}
				return querystr;
			}
		},
		cookie: function(name, value, expireDate, domain) {
			if ($$.isNullOrUndefined(value) == false) {
				document.cookie =
					$$.format("{0}={1}{2}{3}"
					, name, value
					, (domain ? ";domain=" + domain : "")
					, (expireDate ? ";expires=" + expireDate.toGMTString() : "")
					);
				return value;
			}
			else {
				index = document.cookie.indexOf(name);
				if (index != -1) {
					var countbegin = (document.cookie.indexOf("=", index) + 1);
					var countend = document.cookie.indexOf(";", index);
					if (countend == -1) {
						countend = document.cookie.length;
					}
					return document.cookie.substring(countbegin, countend);
				}
			}
		},
		browser: (function() {
			var brwList = ["msie", "firefox", "chrome", "safari", "opera"];
			var brw = { userAgent: '', name: '', version: '' };
			var userAgent = brw["userAgent"] = window.navigator.userAgent.toLowerCase();
			(function() {
				for (var i in brwList) {
					var brwName = brwList[i];
					brw[brwName] = userAgent.indexOf(brwName) != -1;
					if (brw[brwName] == true) {
						brw["name"] = brwName;
					}
				}
				if (brw.chrome && brw.safari) {
					brw["name"] = "chrome";
					brw["safari"] = false;
				}
			})();
			brw["version"] = (function() {
				reg = {
					msie: function(brwName) {
						brwName = brwName || "msie";
						var getReg = new Function("userAgent", "var reg=/" + brw["name"] + "[ \\/]+([0-9\.]+)/ig; return reg;");
						return getReg();
					},
					firefox: function() { return reg.msie("firefox"); },
					chrome: function() { return reg.msie("chrome"); },
					safari: function(brwName) {
						var getReg = new Function("userAgent", "var reg=/version[ \\/]+([0-9\.]+)/ig; return reg;");
						return getReg();
					},
					opera: function() { return reg.safari(); }
				};
				return ((reg[brw.name] || reg["msie"])().exec(userAgent) || [""])[1];
			})();
			return brw;
		})(),
		wl: function(msg, context) {
			if (typeof arguments.callee.appendDiv == 'undefined')
				arguments.callee.appendDiv = true;
			var ctx = context || arguments.callee.context || null;
			var html = ctx && (typeof arguments.callee.appendTag == 'undefined' || arguments.callee.appendTag == true)
				? "<div style='border-bottom:solid 1px gray;'>" + msg + "</div>\n"
				: msg + "\n";
			if (ctx) {
				var host = typeof ctx == 'object' ? ctx : $$(ctx);
				var val = host.value();
				host.value(val + html);
			}
			else {
				document.writeln(html);
			}
		},
		output: function(msg, times) {
			var ca = arguments.callee;
			var succWnd = false;
			try {
				succWnd = ca.wnd != null && ca.wnd.closed != true;
			} catch (ex) { }
			if (!succWnd) {
				var html = 'javascript: document.domain="' + document.domain + '";return "";';
				ca.wnd = window.open(html, "",
					"width=320,height=240,toolbar=0,menubar=0,location=0,resizable=1,scrollbars=1");
			}
			try {
				var html = $$.format("<div>{0}<div>", msg);
				ca.wnd.document.writeln(html);
				ca.wnd.document.title = msg;
				ca.wnd.scroll(0, 999999);
			} catch (ex) { }
		},
		hasAttr: function(element, name) {
			return typeof element[name] != 'undefined';
		},
		$: function(id, context) {
			context = context && context.getElementById ? context : document;
			var result =
				typeof id == 'string'
				? context.getElementById(id)
				: id;
			return result;
		},
		$tag: function(name, context) {
			context = context && context.getElementsByTagName ? context : document;
			var result = [];
			var ret = context.getElementsByTagName(name);
			for (var i = 0; i < ret.length; i++) {
				result[result.length] = ret[i];
			}
			return result;
		},
		$name: function(name, context) {
			/* Notice: getElementsByName() just can fetch FORM element */
			context = context && context.getElementsByName ? context : document;
			var ret = context.getElementsByName(name);
			var result = [];
			if (ret) {
				for (var i = 0; i < ret.length; i++)
					result.push(ret[i]);
			}
			return result;
		},
		$filter: function(filter, context) {
			function filt(result, attr, val, element, deep) {
				if (element && deep > 0) {
					if (element.getAttribute) {
						var val1 = element[attr] || element.getAttribute(attr);
						if ((val && val1 == val) || (!val && val1)) {
							result.push(element);
						}
					}
					if (element.childNodes && element.childNodes.length > 0) {
						for (var i = 0; i < element.childNodes.length; i++) {
							var child = element.childNodes[i];
							arguments.callee(result, attr, val, child, deep - 1);
						}
					}
				}
			}

			var context = context || document.documentElement;
			var result = [];
			var fltList = filter.split('=');
			if (fltList.length > 0) {
				var attr = $$.trim(fltList[0]);
				var val = $$.trim(fltList[1]);
				try {
					filt(result, attr, val, context, 256);
				}
				catch (e) {
				}
			}
			return result;
		},
		$parent: function(id) {
			var context = window;
			context = context.parent;
			var result =
				typeof id == 'string'
				? context.document.getElementById(id)
				: id;
			return result;
		},
		$frame: function(id) {
			var context = window;
			var result = $$.tryFunc(
				function findFromChildFrames() {
					var childFrames = context.frames;
					for (var i = 0; i < childFrames.length; i++) {
						var frame = childFrames[i];
						try {
							var result = $$.$(id, frame.document);
							if (result)
								return result;
						} catch (ex) { }
					}
				},
				function findFromParent() {
					return $$.$parent(id, context);
				},
				function findFromParentFrames() {
					var childFrames = context.parent.frames;
					for (var i = 0; i < childFrames.length; i++) {
						var frame = childFrames[i];
						if (frame != window) {
							try {
								var result = $$.$(id, frame.document);
								if (result)
									return result;
							} catch (ex) { }
						}
					}
				},
				function findFromCurrentWindow() {
					return $$.$(id, context);
				}
			);
			return result;
		},
		split: function(expr, lineSplit, itemSplit) {
			/* example: var cmdObj = $expr("name:div1 tag:DIV id1 filter:className=css1", /\s/ig, /\:/ig, );  //will generate a object: var cmdObj = { name:"div1", tag:"div", di1: "", filter: "className=css1" } */
			lineSplit = lineSplit || /\s+/ig;
			itemSplit = itemSplit || /\:/ig;
			var result = [];
			var lines = expr.split(lineSplit);
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				var item = line.split(itemSplit);
				result.push(item);
			}
			return result;
		}
	});

	var $fn = {
		init: function(expr, context) {
			this.expr = expr = expr || [];
			this.context = context = context || document;
			this.items = [];

			if (this.expr instanceof Array) {
				for (var i = 0; i < this.expr.length; i++) {
					var element = this.expr[i];
					if (element) {
						this.items.push(element);
					}
				}
			}
			else if (expr instanceof $fn.init) {
				this.items = $$.mergeArray(expr.items);
			}
			else if (typeof this.expr == "object") {
				this.items.push(this.expr);
			}
			else {
				var arrExpr = $$.split(this.expr, /\s/ig, ":");
				for (var i = 0; i < arrExpr.length; i++) {
					var exp = arrExpr[i];
					var cmd = exp.length == 1 ? "$" : "$" + exp[0];
					var param = exp.length == 1 ? exp[0] : exp[1];
					var result = $$[cmd] ? $$[cmd](param, this.context) : null;
					if (result) {
						if (result instanceof Array) {
							for (var k = 0; k < result.length; k++)
								this.items.push(result[k]);
						}
						else {
							this.items.push(result);
						}
					}
				}
			}
		},
		firstElement: function() {
			return this.items[0];
		},
		alter: function(step) {
			step = typeof step == 'number' && step > 0 ? step : 2;
			var alt = [];
			for (var i = 0; i < this.items.length; i += step) {
				alt[alt.length] = this.items[i];
			}
			return $$(alt);
		},
		first: function() {
			return $$(this.items[0]);
		},
		last: function() {
			return $$(this.items[this.items.length - 1]);
		},
		parent: function() {
			return $$(this.items[0].parentNode);
			var result = [];
			$$.forEach(this.items, function() {
				if (this.parentNode)
					result.push(this.parentNode);
			});
			return $$(result);
		},
		select: function(expr) {
			var result = [];
			$$.forEach(this.items, function() {
				var sub = $$(expr, this);
				result = result.concat(sub.items);
			});
			return $$(result);
		},
		nextSibling: function() {
			var nodes = [];
			$$.forEach(this.items, function() {
				var cur = this;
				do {
					cur = cur.nextSibling;
					if (cur && cur.nodeType == NodeType.Element) {
						nodes.push(cur);
						break;
					}
				} while (cur);
			});
			return $$(nodes);
		},
		previousSibling: function() {
			var nodes = [];
			$$.forEach(this.items, function() {
				var cur = this;
				do {
					cur = cur.previousSibling;
					if (cur && cur.nodeType == NodeType.Element) {
						nodes.push(cur);
						break;
					}
				} while (cur);
			});
			return $$(nodes);
		},
		firstChild: function() {
			var childs = [];
			$$.forEach(this.items, function() {
				if (this.childNodes) {
					for (var i = 0; i < this.childNodes.length; i++) {
						var node = this.childNodes[i];
						if (node && node.nodeType == NodeType.Element) {
							childs.push(node);
							break;
						}
					}
				}
			});
			return $$(childs);
		},
		lastChild: function() {
			var childs = [];
			$$.forEach(this.items, function() {
				if (this.childNodes) {
					for (var i = this.childNodes.length - 1; i >= 0; i--) {
						var node = this.childNodes[i];
						if (node && node.nodeType == NodeType.Element) {
							childs.push(node);
							break;
						}
					}
				}
			});
			return $$(childs);
		},
		allChilds: function() {
			var childs = [];
			$$.forEach(this.items, function() {
				if (this.childNodes) {
					$$.forEach(this.childNodes, function() {
						if (this.nodeType == NodeType.Element)
							childs.push(this);
					});
				}
			});
			return $$(childs);
		},
		childAt: function(position) {
			var childs = [];
			$$.forEach(this.items, function() {
				if (this.childNodes && this.childNodes.length > 0) {
					var count = 0;
					var cur = this.childNodes[0];
					while (cur) {
						if (cur.nodeType == NodeType.Element) {
							if (count == position) {
								childs.push(cur);
								break;
							}
							count++;
						}
						cur = cur.nextSibling;
					};
				}
			});
			return $$(childs);
		},
		attr: function(name, value) {
			if (!$$.isNullOrUndefined(value)) {
				$$.forEach(this.items, function() { this.setAttribute(name, value); });
			}
			var ret = $$.isNullOrUndefined(value)
				? $$.tryEach(this.items, function() { return this.getAttribute(name); })
				: value;
			return ret;
		},
		html: function(str) {
			if ($$.isNullOrUndefined(str) == false) {
				$$.forEach(this.items, function() {
					this.innerHTML = str;
				});
			}
		},
		value: function(value) {
			if ($$.isNullOrUndefined(value) == false) {
				$$.forEach(this.items, function(val) {
					if ($$.hasAttr(this, "value")) {
						this.value = val;
					}
					else {
						try {
							this.innerHTML = val;
						}
						catch (ex) {
							// element can't support change innerHTML or "val" format error
						}
					}
				}, value);
			}
			else {
				var vals = [];
				$$.forEach(this.items, function() {
					var val =
						$$.hasAttr(this, "value")
						? this.value
						: this.innerHTML;
					if (typeof val != 'undefined')
						vals.push(val);
				});
				return vals.toString();
			}
		},
		className: function(cssName) {
			$$.forEach(this.items, function() { this.className = cssName; });
			var ret = cssName
				? cssName
				: $$.tryEach(this, items, function() { return this.className; });
			return ret;
		},
		style: function(style) {
			var symbol = {};
			if (typeof style == "string") {
				var styleList = style.split(";");
				for (var i = 0; i < styleList.length; i++) {
					var keyval = styleList[i].split(":");
					if (keyval.length == 2) {
						var key = $$.trim(keyval[0]);
						var val = $$.trim(keyval[1]);
						symbol[key] = val;
					}
				}
			}
			else if (typeof style == "object") {
				symbol = style;
			}
			$$.forEach(this.items, function() {
				for (var key in symbol) {
					this.style[key] = symbol[key];
				}
			});
			return symbol;
		},
		display: function(show) {
			if ($$.isNullOrUndefined(show)) {
				var isDisplayAll = true;
				$$.forEach(this.items, function() {
					var isDisplay = false;
					try {
						isDisplay = this.style.display == 'none' ? false : true;
					}
					catch (ex) {
					}
					isDisplayAll = isDisplayAll && isDisplay;
				});
				return isDisplayAll;
			}
			else {
				this.style({ display: $$.format("{0}", show == true ? '' : 'none') });
				return show;
			}
		},
		width: function(value) {
			var hasValue = typeof value == 'number';
			if (hasValue) {
				$$.forEach(this.items, function() {
					this.style.width = value + "px";
				});
			}
			var ret = hasValue ? value
				: $$.tryEach(this.items, function() { return parseInt(this.offsetWidth); });
			return ret;
		},
		height: function(value) {
			var hasValue = typeof value == 'number';
			if (hasValue) {
				$$.forEach(this.items, function() {
					this.style.width = value + "px";
				});
			}
			var ret = hasValue ? value : $$.tryEach(this.items, function() { return parseInt(this.offsetHeight); });
			return ret;
		},
		offset: function() {
			var offsetList = [];
			for (var i = 0; i < this.items.length; i++) {
				var clip = { width: 0, height: 0, top: 0, left: 0 };
				cnt = this.items[i];
				var p = cnt;
				while (p) {
					clip.top += p.offsetTop > 0 ? p.offsetTop : 0;
					clip.left += p.offsetLeft > 0 ? p.offsetLeft : 0;
					p = p.parent;
				}
				clip.width = cnt.offsetWidth;
				clip.height = cnt.offsetHeight;

				offsetList[offsetList.length] = clip;
			}
			return offsetList;
		},
		attachEvent: function(evtName, func) {
			$$.forEach(this.items, function() {
				$$.attachEvent(this, evtName, func);
			});
		},
		clearEvent: function(evtName) {
			$$.forEach(this.items, function() {
				this[evtName] = null;
			});
		}
	};

	/*(function enhanceEvent() {
	var eventList = ['onload', 'onfocus', 'onblur', 
	'onkeydown', 'onkeypress', 'onkeyup', 
	'onclick', 'ondblclick',  
	'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel'
	];
	for (var i = 0; i < eventList.length; i++) {
	var evtName = eventList[i];
	$fn[evtName] = function (func) {
	var name = arguments.callee["eventName"];
	this.attachEvent(name, func);
	};
	$fn[evtName]["eventName"] = evtName;
	}
	})();*/

	$fn.init.prototype = $fn;
	window.$$ = $$;
	//window.$ = window.$ || $$.$;

})();


/*$$.extend($$, {
ajax: {
errorList: {
100: "Continue",
101: "Switching protocols",
200: "OK",
201: "Created",
202: "Accepted",
203: "Non-Authoritative Information",
204: "No Content",
205: "Reset Content",
206: "Partial Content",
300: "Multiple Choices",
301: "Moved Permanently",
302: "Found",
303: "See Other",
304: "Not Modified",
305: "Use Proxy",
307: "Temporary Redirect",
400: "Bad Request",
401: "Unauthorized",
402: "Payment Required",
403: "Forbidden",
404: "Not Found",
405: "Method Not Allowed",
406: "Not Acceptable",
407: "Proxy Authentication Required",
408: "Request Timeout",
409: "Conflict",
410: "Gone",
411: "Length Required",
412: "Precondition Failed",
413: "Request Entity Too Large",
414: "Request-URI Too Long",
415: "Unsupported Media Type",
416: "Requested Range Not Suitable",
417: "Expectation Failed",
500: "Internal Server Error",
501: "Not Implemented",
502: "Bad Gateway",
503: "Service Unavailable",
504: "Gateway Timeout",
505: "HTTP Version Not Supported"
},
xhr: function() {
var xhr = $$.browser.msie
? new ActiveXObject("Microsoft.XMLHTTP")
: new XMLHttpRequest();
return xhr;
},
send: function(url, rspFunc, isAsync) {
isAsync = typeof isAsync == 'undefined' ? true : isAsync;
var xhr = this.xhr();
xhr.open("get", url,isAsync);
xhr.onreadystatechange = function () {
if (xhr.readyState == 4) { 
rspFunc(xhr);
}
};
try {
xhr.send();
}
catch (ex) {
throw ex;
}
return xhr;
}
}
});*/

