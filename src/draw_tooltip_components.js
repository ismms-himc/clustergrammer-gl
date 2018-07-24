var calc_tooltip_triangles = require('./calc_tooltip_triangles');
var calc_row_text_triangles = require('./calc_row_text_triangles');
var make_row_text_triangle_args = require('./make_row_text_triangle_args');

module.exports = function draw_tooltip_components(regl, params){

  // console.log('draw tooltip components');

  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    // var args = params.spillover_args.mat_corners;
    var args = params.tooltip_args;

    // var triangles = params.spillover_triangles.mat_corners;

    var triangles = calc_tooltip_triangles(regl, params);

    // tooltip background
    ////////////////////////////
    regl(args)(triangles);


    // tooltip text
    //////////////////
    // make the arguments for the draw command
    var text_triangle_args = make_row_text_triangle_args(regl, params,
                                                         params.zoom_function);

    params.row_text_triangles = calc_row_text_triangles(params);
    regl(text_triangle_args)(params.row_text_triangles);


    // var text_triangle_args = params.mouseover.text_triangle_args;
    // regl(text_triangle_args)(params.mouseover.row_triangles);
    // regl(args)(text_triangle_args);


  });
};