
/**
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

/**
* Create a cookie with the given name and value and other optional parameters.
*
* @example $.cookie('the_cookie', 'the_value');
* @desc Set the value of a cookie.
* @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
* @desc Create a cookie with all available options.
* @example $.cookie('the_cookie', 'the_value');
* @desc Create a session cookie.
* @example $.cookie('the_cookie', null);
* @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
*       used when the cookie was set.
*
* @param String name The name of the cookie.
* @param String value The value of the cookie.
* @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
* @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
*                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
*                             If set to null or omitted, the cookie will be a session cookie and will not be retained
*                             when the the browser exits.
* @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
* @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
* @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
*                        require a secure protocol (like HTTPS).
* @type undefined
*
* @name $.cookie
* @cat Plugins/Cookie
* @author Klaus Hartl/klaus.hartl@stilbuero.de
*/

/**
* Get the value of a cookie with the given name.
*
* @example $.cookie('the_cookie');
* @desc Get the value of a cookie.
*
* @param String name The name of the cookie.
* @return The value of the cookie.
* @type String
*
* @name $.cookie
* @cat Plugins/Cookie
* @author Klaus Hartl/klaus.hartl@stilbuero.de
*/
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


//preload images
jQuery.preloadImages = function() {
    for (var i = 0; i < arguments.length; i++) {
        jQuery("<img>").attr("src", arguments[i]);
    }
}

//jquery timer
jQuery.fn.extend({
    everyTime: function(interval, label, fn, times, belay) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times, belay);
        });
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.extend({
    timer: {
        guid: 1,
        global: {},
        regex: /^([0-9]+)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseInt(result[1], 10);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function(element, interval, label, fn, times, belay) {
            var counter = 0;

            if (jQuery.isFunction(label)) {
                if (!times)
                    times = fn;
                fn = label;
                label = interval;
            }

            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
                return;

            if (times && times.constructor != Number) {
                belay = !!times;
                times = 0;
            }

            times = times || 0;
            belay = belay || false;

            if (!element.$timers)
                element.$timers = {};

            if (!element.$timers[label])
                element.$timers[label] = {};

            fn.$timerID = fn.$timerID || this.guid++;

            var handler = function() {
                if (belay && this.inProgress)
                    return;
                this.inProgress = true;
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
                this.inProgress = false;
            };

            handler.$timerID = fn.$timerID;

            if (!element.$timers[label][fn.$timerID])
                element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);

            if (!this.global[label])
                this.global[label] = [];
            this.global[label].push(element);

        },
        remove: function(element, label, fn) {
            var timers = element.$timers, ret;

            if (timers) {

                if (!label) {
                    for (label in timers)
                        this.remove(element, label, fn);
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.$timerID) {
                            window.clearInterval(timers[label][fn.$timerID]);
                            delete timers[label][fn.$timerID];
                        }
                    } else {
                        for (var fn in timers[label]) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }

                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label];
                    }
                }

                for (ret in timers) break;
                if (!ret)
                    element.$timers = null;
            }
        }
    }
});

if (jQuery.browser.msie) {
    jQuery(window).one("unload", function() {
        var global = jQuery.timer.global;
        for (var label in global) {
            var els = global[label], i = els.length;
            while (--i)
                jQuery.timer.remove(els[i], label);
        }
    });
}

/*
* jQuery jclock - Clock plugin - v 1.2.0
* http://plugins.jquery.com/project/jclock
*
* Copyright (c) 2007-2008 Doug Sparling <http://www.dougsparling.com>
* Licensed under the MIT License:
*   http://www.opensource.org/licenses/mit-license.php
*/
(function($) {

    $.fn.jclock = function(options) {
        var version = '1.2.0';

        // options
        var opts = $.extend({}, $.fn.jclock.defaults, options);

        return this.each(function() {
            $this = $(this);
            $this.timerID = null;
            $this.running = false;

            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

            $this.timeNotation = o.timeNotation;
            $this.am_pm = o.am_pm;
            $this.utc = o.utc;
            $this.utc_offset = o.utc_offset;
            $this.custom_offset = o.custom_offset;

            $this.css({
                fontFamily: o.fontFamily,
                fontSize: o.fontSize,
                backgroundColor: o.background,
                color: o.foreground
            });

            $.fn.jclock.startClock($this);

        });
    };

    $.fn.jclock.startClock = function(el) {
        $.fn.jclock.stopClock(el);
        $.fn.jclock.displayTime(el);
    }
    $.fn.jclock.stopClock = function(el) {
        if (el.running) {
            clearTimeout(el.timerID);
        }
        el.running = false;
    }
    $.fn.jclock.displayTime = function(el) {
        var time = $.fn.jclock.getTime(el);
        el.html(time);
        el.timerID = setTimeout(function() { $.fn.jclock.displayTime(el) }, 1000);
    }
    $.fn.jclock.getTime = function(el) {
        var now = new Date();
        var hours, minutes, seconds;

        if (el.utc == true) {
            var localTime = now.getTime();
            var localOffset = now.getTimezoneOffset() * 60000;
            var utc = localTime + localOffset;
            var utcTime = utc + (3600000 * el.utc_offset);
            now = new Date(utcTime);
        }

        if (el.custom_offset != 0) {
            var localTime = now.getTime();
            var offsetTime = localTime + (el.custom_offset * 1000);
            now = new Date(offsetTime);
        }

        hours = now.getHours();
        minutes = now.getMinutes();
        seconds = now.getSeconds();

        var am_pm_text = '';
        (hours >= 12) ? am_pm_text = " P.M." : am_pm_text = " A.M.";

        if (el.timeNotation == '12h') {
            hours = ((hours > 12) ? hours - 12 : hours);
        } else if (el.timeNotation == '12hh') {
            hours = ((hours > 12) ? hours - 12 : hours);
            hours = ((hours < 10) ? "0" : "") + hours;
        } else {
            hours = ((hours < 10) ? "0" : "") + hours;
        }

        minutes = ((minutes < 10) ? "0" : "") + minutes;
        seconds = ((seconds < 10) ? "0" : "") + seconds;

        var timeNow = hours + ":" + minutes ;
        if (el.display_sec) {
            timeNow = hours + ":" + minutes + ":" + seconds;
        }
        if ((el.timeNotation == '12h' || el.timeNotation == '12hh') && (el.am_pm == true)) {
            timeNow += am_pm_text;
        }

        return timeNow;
    };

    // plugin defaults
    $.fn.jclock.defaults = {
        timeNotation: '24h',
        am_pm: false,
        utc: false,
        fontFamily: '',
        fontSize: '',
        foreground: '',
        background: '',
        utc_offset: 0,
        custom_offset: 0,
        display_sec: false
    };

})(jQuery);


//check null or empty
jQuery.extend({
    isNullOrEmpty: function(o) {
        if (o == null || o == undefined || o == "") {
            return true;
        }
        return false
    }
});


//check if it's integer
jQuery.extend({
    isInt: function(o) {
        if (o.match(/^\d+$/) == null)
            return false;
        else
            return true;
    }
});

/*

jQuery Browser Plugin
* Version 2.3
* 2008-09-17 19:27:05
* URL: http://jquery.thewikies.com/browser
* Description: jQuery Browser Plugin extends browser detection capabilities and can assign browser selectors to CSS classes.
* Author: Nate Cavanaugh, Minhchau Dang, & Jonathan Neal
* Copyright: Copyright (c) 2008 Jonathan Neal under dual MIT/GPL license.
* JSLint: This javascript file passes JSLint verification.
*/
/*jslint
bitwise: true,
browser: true,
eqeqeq: true,
forin: true,
nomen: true,
plusplus: true,
undef: true,
white: true
*/
/*global
jQuery
*/

(function($) {
    $.browserTest = function(a, z) {
        var u = 'unknown', x = 'X', m = function(r, h) {
            for (var i = 0; i < h.length; i = i + 1) {
                r = r.replace(h[i][0], h[i][1]);
            }

            return r;
        }, c = function(i, a, b, c) {
            var r = {
                name: m((a.exec(i) || [u, u])[1], b)
            };

            r[r.name] = true;

            r.version = (c.exec(i) || [x, x, x, x])[3];

            if (r.name.match(/safari/) && r.version > 400) {
                r.version = '2.0';
            }

            if (r.name === 'presto') {
                r.version = ($.browser.version > 9.27) ? 'futhark' : 'linear_b';
            }
            r.versionNumber = parseFloat(r.version, 10) || 0;
            r.versionX = (r.version !== x) ? (r.version + '').substr(0, 1) : x;
            r.className = r.name + r.versionX;

            return r;
        };

        a = (a.match(/Opera|Navigator|Minefield|KHTML|Chrome/) ? m(a, [
			[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
			['Chrome Safari', 'Chrome'],
			['KHTML', 'Konqueror'],
			['Minefield', 'Firefox'],
			['Navigator', 'Netscape']
		]) : a).toLowerCase();

        $.browser = $.extend((!z) ? $.browser : {}, c(a, /(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/, [], /(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));

        $.layout = c(a, /(gecko|konqueror|msie|opera|webkit)/, [
			['konqueror', 'khtml'],
			['msie', 'trident'],
			['opera', 'presto']
		], /(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);

        $.os = {
            name: (/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris')
        };

        if (!z) {
            $('html').addClass([$.os.name, $.browser.name, $.browser.className, $.layout.name, $.layout.className].join(' '));
        }
    };

    $.browserTest(navigator.userAgent);
})(jQuery);


//timer queue
$.queue = {
    _timer: null,
    _queue: [],
    add: function(fn, context, time, arg) {
        var setTimer = function(time) {
            $.queue._timer = setTimeout(function() {
                time = $.queue.add();
                if ($.queue._queue.length) {
                    setTimer(time);
                }
            }, time || 2);
        }

        if (fn) {
            $.queue._queue.push([fn, context, time, arg]);
            if ($.queue._queue.length == 1) {
                setTimer(time);
            }
            return;
        }

        var next = $.queue._queue.shift();
        if (!next) {
            return 0;
        }
        next[0].call(next[1] || window, next[3]);
        return next[2];
    },
    clear: function() {
        clearTimeout($.queue._timer);
        $.queue._queue = [];
    }
};