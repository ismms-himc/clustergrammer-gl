module.exports = function draw_spillover_components(regl, params){
  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    var args = params.spillover_args;
    var triangles = params.spillover_triangles;

    // spillover rects to hide matrix spillover
    regl(args.mat_sides)(triangles.mat);
    regl(args.mat_corners)(triangles.corners);
    regl(args.label_corners)(triangles.corners);

  });
};