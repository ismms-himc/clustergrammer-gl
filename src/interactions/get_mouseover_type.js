module.exports = function get_mouseover_type(params, cursor_rel_min){

  // switch to using absolute cursor position to determine mouseover type


  webgl_pos = {};
  webgl_pos.x = params.pix_to_webgl.x(params.zoom_data.x.cursor_position);
  webgl_pos.y = params.pix_to_webgl.y(params.zoom_data.y.cursor_position);

  // emperically found pixel parameters
  // cats are ~12px wide
  var cat_width = 11;
  edim = {};
  edim.x = {};
  edim.x.heat_min = 125 + cat_width * cgm.params.cat_data.row.length;
  edim.x.dendro_start = 845;
  edim.x.dendro_end = 860;

  edim.y = {};
  edim.y.heat_min = 125 + cat_width * cgm.params.cat_data.col.length;
  edim.y.dendro_start = 845;
  edim.y.dendro_end = 860;

  // console.log(params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)

  var inst_pix = {};
  inst_pix.x = params.zoom_data.x.cursor_position;
  inst_pix.y = params.zoom_data.y.cursor_position;

  // console.log(inst_pix.x, inst_pix.y)

  var viz_dim_heat = params.viz_dim.heat;

  var effective_max_width = viz_dim_heat.width + params.zoom_data.x.total_pan_min;
  var effective_max_height = viz_dim_heat.height + params.zoom_data.y.total_pan_min

  params.tooltip.in_bounds_tooltip = false;
  params.tooltip.tooltip_type = null;

  if (inst_pix.x > edim.x.heat_min &&
      inst_pix.x < edim.x.dendro_start &&
      inst_pix.y > edim.y.heat_min &&
      inst_pix.y < edim.y.dendro_start){

    params.tooltip.in_bounds_tooltip = true;
    params.tooltip.tooltip_type = 'matrix-cell';

  } else if (inst_pix.x <= edim.x.heat_min &&
             inst_pix.y > edim.y.heat_min &&
             inst_pix.y < edim.y.dendro_start){

    console.log(edim.x.heat_min - inst_pix.x)
    params.tooltip.tooltip_type = 'row-label';

  } else if (inst_pix.y <= edim.y.heat_min &&
             inst_pix.x > edim.x.heat_min &&
             inst_pix.x < edim.x.dendro_start){

    console.log(edim.y.heat_min - inst_pix.y)
    params.tooltip.tooltip_type = 'col-label';

  } else if (inst_pix.x >= edim.x.dendro_start &&
             inst_pix.x < edim.x.dendro_end &&
             inst_pix.y > edim.y.heat_min &&
             inst_pix.y < edim.y.dendro_start){

    params.tooltip.tooltip_type = 'row-dendro';

  } else if (inst_pix.y >= edim.y.dendro_start &&
             inst_pix.y < edim.y.dendro_end &&
             inst_pix.x > edim.x.heat_min &&
             inst_pix.x < edim.x.dendro_start){

    params.tooltip.tooltip_type = 'col-dendro';

  }


}