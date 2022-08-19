export default (function draw_static_components(regl, params) {
  params.cameras.static.draw(() => {
    const args = params.spillover_args;
    const triangles = params.spillover_triangles;
    regl(args.mat_sides)(triangles.mat_sides);
    regl(args.cats)(triangles.cats);
    regl(args.mat_corners)(triangles.mat_corners);
    regl(args.label_corners)(triangles.label_corners);
    /* was drawing col text triangle args */
  });
});
