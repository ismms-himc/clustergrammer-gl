var make_row_text_args = require('./../matrix_labels/make_row_text_args');
var calc_viz_area = require('./../params/calc_viz_area');
var calc_row_text_triangles = require('./../matrix_labels/calc_row_text_triangles');
var interp_fun = require('./../draws/interp_fun');
var make_viz_aid_tri_args = require('./../matrix_labels/make_viz_aid_tri_args');

module.exports = function draw_row_components(regl, params, calc_text_tri=false){

  /* Row Components */
  params.cameras['row-labels'].draw(() => {

    params.viz_aid_tri_args.row = make_viz_aid_tri_args(regl, params, 'row');

    regl(params.viz_aid_tri_args.row)(
      // {
      //   interp_prop: interp_fun(params),
      //   run_animation: params.animation.running
      // }
    );

    _.each(params.cat_args.row, function(inst_cat_arg){
      regl(inst_cat_arg)(
        {
          interp_prop: interp_fun(params),
          run_animation: params.animation.running
        }
        );
    });

    regl(params.dendro_args.row)();

    // make the arguments for the draw command
    var text_triangle_args = make_row_text_args(regl, params,
                                                         params.zoom_function);

    if (calc_text_tri){

      // console.log('calc row text triangles')

      var num_viz_rows = params.num_row/params.zoom_data.y.total_zoom;

      if (num_viz_rows < params.max_num_text){

        calc_viz_area(params);

        // draw using text_triangle_args and row_text_triangles
        if (params.num_row > params.max_num_text){
          params.row_text_triangles = calc_row_text_triangles(params);
        }
        regl(text_triangle_args)(params.row_text_triangles);


      } else {
        // console.log('too many rows to draw');
        // regl(text_triangle_args)(params.row_text_triangles);
      }

    } else {

      /*
        show text triangles if avaialble
      */

      if (params.row_text_triangles != false){
        regl(text_triangle_args)(params.row_text_triangles);
      }
    }

  });

};