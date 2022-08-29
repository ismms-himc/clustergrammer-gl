import generateSpilloverParams from "./spillover/generateSpilloverParams";

export default (function draw_static_components(regl, store, cameras) {
  const state = store.getState();
  cameras.static.draw(() => {
    const { spillover_triangles, spillover_args } = generateSpilloverParams(
      regl,
      state
    );
    regl(spillover_args.mat_sides)(spillover_triangles.mat_sides);
    regl(spillover_args.cats)(spillover_triangles.cats);
    regl(spillover_args.mat_corners)(spillover_triangles.mat_corners);
    regl(spillover_args.label_corners)(spillover_triangles.label_corners);
    /* was drawing col text triangle args */
  });
});
