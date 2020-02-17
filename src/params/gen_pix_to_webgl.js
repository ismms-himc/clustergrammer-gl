module.exports = function gen_pix_to_webgl(params){

  var pix_to_webgl = {};
  pix_to_webgl.x = d3.scaleLinear();
  pix_to_webgl.x
    .domain([0, params.viz_dim.heat.width])
    .range([-0.5, 0.5]);

  pix_to_webgl.y = d3.scaleLinear();
  pix_to_webgl.y
    .domain([0, params.viz_dim.heat.height])
    .range([0.5, -0.5]);

  params.pix_to_webgl = pix_to_webgl;
};