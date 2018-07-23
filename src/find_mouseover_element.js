var draw_tooltip = require('./draw_tooltip');

module.exports = function find_mouseover_element(params, ev){

  /*

  Need to use

    cgm.params.canvas_pos.x_arr.length
      and
    cgm.params.canvas_pos.y_arr.length

  to identify where the user is mousing over

  Also need to take into consideration zooming/panning

  */

  var viz_dim_heat = params.viz_dim.heat;

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

    // console.log('rel min', cursor_rel_min.x, cursor_rel_min.y, inst_row, inst_col);
    draw_tooltip(params);

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