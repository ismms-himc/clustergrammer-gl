var make_col_text_triangle_args = require('./make_col_text_triangle_args');
var calc_viz_area = require('./calc_viz_area');
var calc_col_text_triangles = require('./calc_col_text_triangles');

module.exports = function draw_col_components(regl, params, slow_draw=false){

  // drawing the colum viz aid triangles using their own special camera since
  // they require special behavior, e.g. zooming but constant positioning
  params.cameras['col-viz-aid'].draw(() => {
    regl(params.viz_aid_tri_args.col)();
  });

  /* Column Components */
  params.cameras['col-labels'].draw(() => {

    // drawing the column categories and dendrogram using the same camera as the
    // matrix (no special zooming required)
    _.each(params.cat_args.col, function(inst_cat_arg){
      regl(inst_cat_arg)();
    });

    regl(params.dendro_args.col)();

    // make the arguments for the draw command
    var text_triangle_args = make_col_text_triangle_args(regl, params,
                                                         params.zoom_function);

    // // draw using text_triangle_args and col_text_triangles
    // regl(text_triangle_args)(params.col_text_triangles);

    if (slow_draw){

      var num_viz_rows = params.num_row/params.zoom_data.y.total_zoom;

      if (num_viz_rows < params.max_num_text){

        calc_viz_area(params);

        // draw using text_triangle_args and col_text_triangles
        params.col_text_triangles = calc_col_text_triangles(params);
        regl(text_triangle_args)(params.col_text_triangles);


      } else {
        // console.log('too many rows to draw');
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