"strict";
/*
  https://github.com/alicelieutier/smoothScroll
*/
window.smoothScroll = (function(){
if(document.querySelectorAll === void 0 || window.pageYOffset === void 0 || history.pushState === void 0) { return; }
var getTop = function(element) {
    if(element.nodeName === 'HTML'){
      return -window.pageYOffset;
    } 
    return element.getBoundingClientRect().top + window.pageYOffset;
};
var easeInOutCubic = function (t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; };
var position = function(start, end, elapsed, duration) {
    if (elapsed > duration){
      return end;
    } 
    return start + (end - start) * easeInOutCubic(elapsed / duration);
};
var smoothScroll = function(el, duration, callback){
    duration = duration || 500;
    var start = window.pageYOffset,
        end;
    if (typeof el === 'number') {
      end = parseInt(el);
    } else {
      end = getTop(el);
    }
    var clock = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){window.setTimeout(fn, 15);};
    var step = function(){
        var elapsed = Date.now() - clock;
        window.scroll(0, position(start, end, elapsed, duration));
        if (elapsed > duration) {
            if (typeof callback === 'function') {
                callback(el);
            }
        } else {
            requestAnimationFrame(step);
        }
    };
    step();
};
var linkHandler = function(ev) {
    ev.preventDefault();
    smoothScroll(document.getElementById(this.hash.substring(1)), 500, function(el) {
    });
};
document.addEventListener("DOMContentLoaded", function () {
    var internal = document.querySelectorAll('a[href^="#"]'), a;
    for(var i=internal.length; a=internal[--i];){
        a.addEventListener("click", linkHandler, false);
    }
});
return smoothScroll;
})();


window.ready = function(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

//http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

ready(function(){
  var shiftedEls = document.getElementsByClassName('shifted'),
      whatIsThisLink = document.getElementById('what-is-this');

  if (shiftedEls.length > 0){
    Array.prototype.forEach.call(shiftedEls, function(el, index) {
      setTimeout(
        function(){
          el.classList.remove('shifted');
          el.classList.add('unshifted');
        },
        (200-(10*index))*index);
    });
  }


});
