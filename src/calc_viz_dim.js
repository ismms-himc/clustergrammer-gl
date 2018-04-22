var extend = require('xtend/mutable');

module.exports = function calc_viz_dim(regl, params){

  // Set up viz_dim
  ///////////////////////
  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});

  var element = options.element;

  var viz_dim = {};
  viz_dim.canvas = {};
  viz_dim.mat = {};

  _.each(['width', 'height'], function(inst_dim){
    viz_dim.canvas[inst_dim] = Number.parseFloat(d3.select(element)
      .style(inst_dim).replace('px', ''));
  });

  // square matrix size set by width of canvas
  viz_dim.mat.width  = (params.mat_size/0.5) * viz_dim.canvas.width/2;
  viz_dim.mat.height = (params.mat_size/0.5) * viz_dim.canvas.width/2;

  // min and max position of matrix
  viz_dim.mat.x = {};
  viz_dim.mat.x.min = viz_dim.canvas.width/2 - viz_dim.mat.width/2;
  viz_dim.mat.x.max = viz_dim.canvas.width/2 + viz_dim.mat.width/2;

  viz_dim.mat.y = {};
  viz_dim.mat.y.min = viz_dim.canvas.height/2 - viz_dim.mat.height/2;
  viz_dim.mat.y.max = viz_dim.canvas.height/2 + viz_dim.mat.height/2;

  return viz_dim;

};