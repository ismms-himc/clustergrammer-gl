var calc_tooltip_background_triangles = require('./calc_tooltip_background_triangles');

module.exports = function draw_tooltip_components(regl, params){

  // console.log('draw tooltip components');

  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    // var args = params.spillover_args.mat_corners;
    var args = params.tooltip_args;

    // var triangles = params.spillover_triangles.mat_corners;

    var triangles = calc_tooltip_background_triangles(regl, params);

    // tooltip background
    ////////////////////////////
    regl(args)(triangles);

    // tooltip text
    //////////////////
    // make the arguments for the draw command
    var text_triangle_args = params.mouseover.text_triangle_args;

    // var inst_triangles = params.row_text_triangles[0];
    var inst_triangles = params.mouseover.row_triangles;

    regl(text_triangle_args)(inst_triangles);

    // var text_triangle_args = params.mouseover.text_triangle_args;
    // regl(text_triangle_args)(params.mouseover.row_triangles);
    // regl(args)(text_triangle_args);


  });
};