var make_col_cat_title_args = require('../matrix_labels/make_col_cat_title_args');

module.exports = function draw_static_components(regl, params){

  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    var args = params.spillover_args;
    var triangles = params.spillover_triangles;

    // spillover rects to hide matrix spillover
    regl(args.mat_sides)(triangles.mat_sides);
    regl(args.cats)(triangles.cats);
    regl(args.mat_corners)(triangles.mat_corners);
    regl(args.label_corners)(triangles.label_corners);

    // need to make text_triangle_args (make_col_cat_title_args) and
    // generate the text triangles (using vectorize_labels)
    text_triangle_args = make_col_cat_title_args(regl, params, params.zoom_data.zoom_function);

    // draw row labels twice!
    regl(text_triangle_args)(params.text_triangles.draw['row']);

  });
};