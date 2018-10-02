module.exports = function get_mouseover_type(params, cursor_rel_min){

  var viz_dim_heat = params.viz_dim.heat;

  params.tooltip.in_bounds_tooltip = false;
  // matrix cell
  if (cursor_rel_min.x > 0 &&
      cursor_rel_min.x < viz_dim_heat.width &&
      cursor_rel_min.y > 0 &&
      cursor_rel_min.y < viz_dim_heat.height){
    params.tooltip.in_bounds_tooltip = true;
    params.tooltip.tooltip_type = 'matrix-cell';

  // row label
  } else if (cursor_rel_min.x < 0 &&
             cursor_rel_min.y < viz_dim_heat.height){

    params.tooltip.tooltip_type = 'row-label';

  // col label
  } else if (cursor_rel_min.y < 0 &&
             cursor_rel_min.x < viz_dim_heat.width){

    params.tooltip.tooltip_type = 'col-label';

  // row dendro
  } else if (cursor_rel_min.x > viz_dim_heat.width &&
             cursor_rel_min.y > 0 &&
             cursor_rel_min.y < viz_dim_heat.height){

    params.tooltip.tooltip_type = 'row-dendro';

  // col dendro
  } else if (cursor_rel_min.y > viz_dim_heat.height &&
             cursor_rel_min.x > 0 &&
             cursor_rel_min.x < viz_dim_heat.height){

    params.tooltip.tooltip_type = 'col-dendro';

  }

}