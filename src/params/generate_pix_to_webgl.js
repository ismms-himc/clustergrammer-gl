module.exports = function generate_pix_to_webgl(params){

  var pix_to_webgl = {};
  pix_to_webgl.x = d3.scale.linear();
  pix_to_webgl.x
    .domain([0, params.viz_dim.heat.width])
    .range([-0.5, 0.5])
    .clamp(true);

  pix_to_webgl.y = d3.scale.linear();
  pix_to_webgl.y
    .domain([0, params.viz_dim.heat.height])
    .range([0.5, -0.5])
    .clamp(true);

  params.pix_to_webgl = pix_to_webgl;

};