var scrollUtil = {
  init: function(scrollClass) {
    this.scrollClass = scrollClass;
    if ("ontouchstart" in document.documentElement) {
      var handleMove = function(e) {
        e.preventDefault();
        var scrollObj = jQuery(e.target).closest(scrollUtil.scrollClass);
        if (scrollObj.length > 0) {
          var delta = e.touches[0].pageY - scrollUtil.touch_pos_y;
          scrollUtil.totalDelta += delta;
          scrollUtil.touch_pos_y = e.changedTouches[0].clientY;
          scrollUtil.scroll(scrollObj, delta);
        }
        scrollUtil.touch_pos_y = e.touches[0].pageY;
      }
      var handleMoveStart = function(e) {
        scrollUtil.touch_pos_y = e.touches[0].pageY;
        scrollUtil.totalDelta = 0;
        if (scrollUtil.timer != null) {
          clearInterval(scrollUtil.timer);
          scrollUtil.timer = null;
        }
      }
      var handleMoveEnd = function(e) {
      /*
        //if distance more than 10px, do extended scroll
        if (scrollUtil.totalDelta * scrollUtil.totalDelta > 100) {
          var scrollObj = jQuery(e.target).closest(scrollUtil.scrollClass);
          scrollUtil.step = 0;
          scrollUtil.timer = setInterval(function() {
            scrollUtil.step += 1;
            if (scrollUtil.step <= 10) {
              scrollUtil.scroll(scrollObj, scrollUtil.totalDelta / ( scrollUtil.step + 1));
            } else {
              clearInterval(scrollUtil.timer);
              scrollUtil.timer = null;
            }
          }, 10);
          
        }
        */
      }
      document.addEventListener('touchmove', handleMove, true);
      document.addEventListener('touchstart', handleMoveStart, true);
      document.addEventListener('touchend', handleMoveEnd, true);
    };
  },

  timer: null,

  totalDelta: 0,

  touch_pos_y: undefined,

  step: 0,

  scrollClass: undefined,

  scroll: function(scrollObj, delta) {
    var scroll_y = scrollUtil.clip(scrollObj.scrollTop() - delta, 0, scrollObj[0].scrollHeight - scrollObj.innerHeight() - 1);
    scrollObj.scrollTop(scroll_y);
  },

  clip: function(value, lower, upper) {
    if (value < lower)
      return lower;
    if (value > upper)
      return upper;
    return value;
  }
};