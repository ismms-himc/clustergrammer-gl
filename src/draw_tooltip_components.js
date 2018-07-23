module.exports = function draw_tooltip_components(regl, params){

  console.log('draw tooltip components')

  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    // var args = params.spillover_args;
    // var triangles = params.spillover_triangles;

    // // spillover rects to hide matrix spillover
    // regl(args.mat_sides)(triangles.mat_sides);
    // regl(args.cats)(triangles.cats);
    // regl(args.mat_corners)(triangles.mat_corners);
    // regl(args.label_corners)(triangles.label_corners);

  });
};