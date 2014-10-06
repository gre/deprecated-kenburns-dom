var KenBurnsCore = require("kenburns-core");
var Zanimo = require("zanimo");

function KenBurnsDOMTrait (container) {
  this.elt = container;
  // At least we need relative
  if (container.style.position !== "absolute") container.style.position = "relative";
  container.style.overflow = "hidden";
}

KenBurnsDOMTrait.prototype = {
  getViewport: function () {
    return this.elt.getBoundingClientRect();
  },
  abort: function () {
    this.reset();
  },
  _transformForRect: function (rect) {
    var viewport = this.getViewport();
    var scale = [ viewport.width / rect[2], viewport.height / rect[3] ];
    var translate = [ Math.round(-rect[0])+"px", Math.round(-rect[1])+"px" ];
    return "scale("+scale+") translate("+translate+")";
  },
  _reset: function () {
    this.elt.style.backgroundColor = "rgb("+this.rgb.map(function(c){ return 255 * c; })+")";
    this.elt.innerHTML = "";
  },
  _setImage: function (image) {
    if (image !== this.image) {
      this._reset();
      this.elt.appendChild(image);
      image.style.position = "absolute";
      image.style.top = "0";
      image.style.left = "0";
      Zanimo(image, "transform-origin", "0% 0%");
      this.image = image;
    }
    return Zanimo(image);
  },
  _positionImage: function (rect) {
    return Zanimo(this.image, "transform", this._transformForRect(rect));
  },

  runStart: function (image) {
    this._setImage(image);
  },
  draw: function (image, rect) {
    this._positionImage(rect);
  }

  /*,
  // TODO: can we use css transition with Zanimo ?

  _animateImage: function (toRect, duration, easing) {
    var cssEasing = easing && (typeof easing==="string" ? easing : easing.toCSS && easing.toCSS()) || "linear";
    return Zanimo(this.image, "transform", this._transformForRect(toRect), duration, cssEasing);
  },
  one: function (image, crop) {
    var rect = this._getBound(crop, image);
    return self._setImage(image)
      .then(function(){
        return self._positionImage(fromRect);
      });
  },
  run: function () {
    var args = this._runValidation.apply(this, arguments);
    var image = args[0];
    var fromRect = args[1];
    var toRect = args[2];
    var duration = args[3];
    var easing = args[4];
    var self = this;
    return self._setImage(image)
      .then(function(){
        return self._positionImage(fromRect);
      })
      .then(function () {
        return self._animateImage(toRect, duration, easing);
      });
  }
  */
};

module.exports = KenBurnsCore.mixin(KenBurnsDOMTrait);
