var interp_fun = require('./interp_fun');

module.exports = function draw_matrix_components(regl, params){

  /* Matrix */
  params.cameras.mat.draw(() => {

    /*
      Disabling this, prevents the screen from flashing when working with very
      large datasets
    */
    // regl.clear({color: [0, 0, 0, 0]});

    /*
      Filter and regenerate args is slow
    */

    /*
    Reordering Matrix Plan
    ------------------------
    I will only re-calculate the matrix_args once for the final position.
    Since matrix reordering happens to entire rows/cols at once, I will calculate
    an offset to shift rows/columns to transition from the initial to the final
    state, then I will replace the current position array with the final
    position array
    */

    regl(params.matrix_args.regl_props.rects)({
      interp_prop: interp_fun(params),
      run_animation: params.animation.running
    });

  });

};