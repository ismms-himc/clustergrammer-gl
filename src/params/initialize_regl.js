module.exports = function initialize_regl(canvas_container){

  var canvas_container = this.canvas_container;

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: canvas_container,
    // pixelRatio: window.devicePixelRatio/10
  });

  this.regl = regl;
};