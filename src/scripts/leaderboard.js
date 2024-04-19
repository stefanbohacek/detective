"strict";

window.ready = (fn) => {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function(){
  var shiftedEls = document.getElementsByClassName('shifted-short');

  if (shiftedEls.length > 0){
    Array.prototype.forEach.call(shiftedEls, function(el, index) {
      setTimeout(
        function(){
          el.classList.remove('shifted-short');
          el.classList.add('unshifted');
        },
        (200-(10*index))*index);
    });
  }
});
