var make_col_text_args = require('./../matrix_labels/make_col_text_args');
var calc_viz_area = require('./../params/calc_viz_area');
var calc_text_triangles = require('./../matrix_labels/calc_text_triangles');
var make_viz_aid_tri_args = require('./../matrix_labels/make_viz_aid_tri_args');
var interp_fun = require('./interp_fun');

module.exports = function draw_col_components(regl, params, calc_text_tri=false){

  /* Column Components */
  params.cameras['col-labels'].draw(() => {

    params.viz_aid_tri_args.col = make_viz_aid_tri_args(regl, params, 'col');

    regl(params.viz_aid_tri_args.col)();

    // drawing the column categories and dendrogram using the same camera as the
    // matrix (no special zooming required)
    _.each(params.cat_args.col, function(inst_cat_arg){
      regl(inst_cat_arg)(
        {
          interp_prop: interp_fun(params),
          run_animation: params.animation.running
        }
      );
    });

    regl(params.dendro_args.col)();

    // make the arguments for the draw command
    var text_triangle_args = make_col_text_args(regl, params,
                                                         params.zoom_function);

    if (calc_text_tri){

      var num_viz_cols = params.num_col/params.zoom_data.x.total_zoom;

      // console.log('num_viz_cols', num_viz_cols)

      if (num_viz_cols < params.max_num_text){

        calc_viz_area(params);

        // draw using text_triangle_args and col_text_triangles
        if (params.num_col > params.max_num_text){
          params.col_text_triangles = calc_text_triangles(params);
        }
        regl(text_triangle_args)(params.col_text_triangles);

      } else {
        // console.log('too many cols to draw');
        // regl(text_triangle_args)(params.col_text_triangles);
      }

    } else {

      /*
        show text triangles if avaialble
      */

      if (params.col_text_triangles != false){
        regl(text_triangle_args)(params.col_text_triangles);
      }
    }

  });

};