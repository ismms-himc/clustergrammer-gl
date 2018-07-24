// var make_tooltip_args = require('./make_tooltip_args');

module.exports = function find_mouseover_element(params, ev){

  // console.log('still_mouseover', params.still_mouseover)

  /*

  Need to use

    cgm.params.canvas_pos.x_arr.length
      and
    cgm.params.canvas_pos.y_arr.length

  to identify where the user is mousing over

  Also need to take into consideration zooming/panning

  */

  var viz_dim_heat = params.viz_dim.heat;

  // try updating mouseover position
  params.zoom_data.x.cursor_position = ev.x0;
  params.zoom_data.y.cursor_position = ev.y0;

  var inst_x = ev.x0// - cgm.params.viz_dim.heat.x.min
  var inst_y = ev.y0// - cgm.params.viz_dim.heat.y.min

  // console.log('\n------------')
  // console.log(inst_x, inst_y)
  // console.log(params.pix_to_webgl.x(inst_x), params.pix_to_webgl.y(inst_x))
  // console.log(inst_x/params.viz_dim.canvas.width, inst_y/params.viz_dim.canvas.height)

  var cursor_rel_min = {};
  cursor_rel_min.x = ev.x0 - viz_dim_heat.x.min
  cursor_rel_min.y = ev.y0 - viz_dim_heat.y.min

  cursor_rel_min.x = restrict_rel_min(cursor_rel_min.x, viz_dim_heat.width, params.zoom_data.x);
  cursor_rel_min.y = restrict_rel_min(cursor_rel_min.y, viz_dim_heat.height, params.zoom_data.y);


  if (cursor_rel_min.x < viz_dim_heat.width && cursor_rel_min.y < viz_dim_heat.height){

    var row_index = Math.floor(cursor_rel_min.y/params.tile_pix_height);
    var col_index = Math.floor(cursor_rel_min.x/params.tile_pix_width);

    // console.log(params.orderd_labels)
    params.mouseover.row_name = params.ordered_labels.rows[row_index];
    params.mouseover.col_name = params.ordered_labels.cols[col_index];

    params.in_bounds_tooltip = true;
  } else {
    // console.log('OUTSIDE OF MATRIX')
    params.in_bounds_tooltip = false;
  }


function restrict_rel_min(cursor_rel_min, max_pix, zoom_data){

  cursor_rel_min = cursor_rel_min / zoom_data.total_zoom - zoom_data.total_pan_min;

  // console.log(viz_dim_heat.max)
  if (cursor_rel_min < 0){
    cursor_rel_min = 0;
  // } else if (cursor_rel_min > viz_dim_heat.max){
  } else if (cursor_rel_min > max_pix){
    // cursor_rel_min = viz_dim_heat.max;
    cursor_rel_min = max_pix;
  }
  return cursor_rel_min;
}

};