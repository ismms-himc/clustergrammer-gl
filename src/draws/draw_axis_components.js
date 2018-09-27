var make_col_text_args = require('./../matrix_labels/make_col_text_args');
var make_row_text_args = require('./../matrix_labels/make_row_text_args');
var calc_viz_area = require('./../params/calc_viz_area');
var gather_text_triangles = require('./../matrix_labels/gather_text_triangles');
var make_viz_aid_tri_args = require('./../matrix_labels/make_viz_aid_tri_args');
var interp_fun = require('./interp_fun');

module.exports = function draw_axis_components(regl, params, inst_axis, calc_text_tri=false){

  var axis_dim;
  if (inst_axis === 'col'){
    axis_dim = 'x';
  } else {
    axis_dim = 'y';
  }

  /* Column Components */
  params.cameras[inst_axis + '-labels'].draw(() => {

    params.viz_aid_tri_args[inst_axis] = make_viz_aid_tri_args(regl, params, inst_axis);

    regl(params.viz_aid_tri_args[inst_axis])();

    // drawing the label categories and dendrogram using the same camera as the
    // matrix (no special zooming required)
    _.each(params.cat_args[inst_axis], function(inst_cat_arg){
      regl(inst_cat_arg)(
        {
          interp_prop: interp_fun(params),
          run_animation: params.animation.running
        }
      );
    });

    regl(params.dendro.dendro_args[inst_axis])();

    // make the arguments for the draw command
    var text_triangle_args
    if (inst_axis === 'col'){
      text_triangle_args = make_col_text_args(regl, params, params.zoom_data.zoom_function);
    } else {
      text_triangle_args = make_row_text_args(regl, params, params.zoom_data.zoom_function);
    }

    if (calc_text_tri){

      var num_viz_labels = params.labels['num_' + inst_axis]/params.zoom_data[axis_dim].total_zoom;

      if (num_viz_labels < params.max_num_text){

        calc_viz_area(params);

        // only regather if there are more labels than can be shown at once
        if (params.labels['num_' + inst_axis] > params.max_num_text){

          gather_text_triangles(params, inst_axis);

        }
        regl(text_triangle_args)(params.text_triangles.draw[inst_axis]);

      } else {
        // console.log('too many labels to draw');
      }

    } else {

      /*
        show text triangles if avaialble
      */

      if (params.text_triangles.draw[inst_axis] != false){
        regl(text_triangle_args)(params.text_triangles.draw[inst_axis]);
      }
    }

  });

};