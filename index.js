var prefix = require('vendor-prefix');
var transformAttr = prefix('transform');
var transformOriginAttr = prefix('transform-origin');

function KenBurnsDOMTrait (container) {
  this.elt = container;
  // At least we need relative
  if (container.style.position !== "absolute") container.style.position = "relative";
  container.style.overflow = "hidden";
  container.style.willChange = "transform"; // already supported by some browsers, also for GPU acceleration
}

KenBurnsDOMTrait.prototype = {
  clamped: true,
  rgb: [0,0,0],

  getViewport: function () {
    return this.elt.getBoundingClientRect();
  },

  abort: function () {
    this.reset();
  },

  _transformForRect: function (rect) {
    var viewport = this.getViewport();
    var scale = viewport.width / rect[2]; // no need to handle the height dimension because ratio is preserved
    var translate = [
      (-rect[0])+"px",
      (-rect[1])+"px"
    ];
    // translateZ for triggering GPU acceleration
    return "scale("+scale+") translate("+translate+") translateZ(0)";
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
      image.style.top = 0;
      image.style.left = 0;
      image.style[transformOriginAttr] = "0% 0%";
      this.image = image;
    }
  },

  _positionImage: function (rect) {
    this.image.style[transformAttr] = this._transformForRect(rect);
  },

  runStart: function (image) {
    this._setImage(image);
  },

  draw: function (image, rect) {
    this._positionImage(rect);
  }

};

module.exports = KenBurnsDOMTrait;
