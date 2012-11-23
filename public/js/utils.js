function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

(function($) {
  var o = $({});
  $.sub = function() {
    o.on.apply(o, arguments);
  };
  $.unsub = function() {
    o.off.apply(o, arguments);
  };
  $.pub = function() {
    o.trigger.apply(o, arguments);
  };
}(jQuery));

Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}