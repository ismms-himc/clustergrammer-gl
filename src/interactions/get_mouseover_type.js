module.exports = function get_mouseover_type(params, cursor_rel_min){

  // switch to using absolute cursor position to determine mouseover type


  webgl_pos = {};
  webgl_pos.x = params.pix_to_webgl.x(params.zoom_data.x.cursor_position);
  webgl_pos.y = params.pix_to_webgl.y(params.zoom_data.y.cursor_position);

  // emperically found pixel parameters
  edim = {};
  edim.x = {};
  edim.x.mat_min = 125;
  edim.x.dendro_start = 845;
  edim.x.dendro_end = 860;

  edim.y = {};
  edim.y.mat_min = 125;
  edim.y.dendro_start = 860;
  edim.y.dendro_end = 860;

  console.log(params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)
  // console.log(webgl_pos.x, webgl_pos.y)


  var viz_dim_heat = params.viz_dim.heat;

  var effective_max_width = viz_dim_heat.width + params.zoom_data.x.total_pan_min;
  var effective_max_height = viz_dim_heat.height + params.zoom_data.y.total_pan_min

  params.tooltip.in_bounds_tooltip = false;
  // matrix cell
  if (cursor_rel_min.x > 0 &&
      cursor_rel_min.x < effective_max_width &&
      cursor_rel_min.y > 0 &&
      cursor_rel_min.y < effective_max_height){
    params.tooltip.in_bounds_tooltip = true;
    params.tooltip.tooltip_type = 'matrix-cell';

  // row label
  } else if (cursor_rel_min.x < 0 &&
             cursor_rel_min.y < effective_max_height){

    params.tooltip.tooltip_type = 'row-label';

  // col label
  } else if (cursor_rel_min.y < 0 &&
             cursor_rel_min.x < effective_max_width){

    params.tooltip.tooltip_type = 'col-label';

  // row dendro
  } else if (cursor_rel_min.x > effective_max_width &&
             cursor_rel_min.y > 0 &&
             cursor_rel_min.y < effective_max_height){

    params.tooltip.tooltip_type = 'row-dendro';

  // col dendro
  } else if (cursor_rel_min.y > effective_max_height &&
             cursor_rel_min.x > 0 &&
             cursor_rel_min.x < effective_max_width){

    params.tooltip.tooltip_type = 'col-dendro';

  }


}