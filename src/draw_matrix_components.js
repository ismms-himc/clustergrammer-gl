// var filter_visible_mat = require('./filter_visible_mat');
var make_matrix_args = require('./make_matrix_args');
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
    // // Filter
    // params.arrs_filt = filter_visible_mat(params.arrs, params.zoom_data);


    /*
    Reordering Matrix Plan
    ------------------------
    I will only re-calculate the matrix_args once for the final position.
    Since matrix reordering happens to entire rows/cols at once, I will calculate
    an offset to shift rows/columns to transition from the initial to the final
    state, then I will replace the current position array with the final
    position array
    */

    // // Regenerate args
    // if (params.animation.time_remain > 0){
    //   params.matrix_args = make_matrix_args(regl, params);
    // }

    regl(params.matrix_args.regl_props.top)({
      interp_prop: interp_fun(params),
      ani_x: params.animation.loop
    });
    regl(params.matrix_args.regl_props.bot)({
      interp_prop: interp_fun(params),
      ani_x: params.animation.loop
    });

  });

};