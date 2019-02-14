module.exports = function draw_static_components(regl, params){

  params.cameras.static.draw(() => {
    var args = params.spillover_args;
    var triangles = params.spillover_triangles;
    regl(args.mat_sides)(triangles.mat_sides);
    regl(args.cats)(triangles.cats);
    regl(args.mat_corners)(triangles.mat_corners);
    regl(args.label_corners)(triangles.label_corners);

    /* was drawing col text triangle args */
  });
};