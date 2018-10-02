module.exports = function get_mouseover_type(params){

  // switch to using absolute cursor position to determine mouseover type
  // emperically found pixel parameters
  // cats are ~12px wide
  var cat_width = 12  ;
  var edim = {};
  edim.x = {};
  edim.x.heat_min = 125 + cat_width * params.cat_data.row.length;
  edim.x.dendro_start = 845;
  edim.x.dendro_end = 860;

  edim.y = {};
  // extra pixel prevents error *********** look into
  edim.y.heat_min = 126 + cat_width * params.cat_data.col.length;
  edim.y.dendro_start = 845;
  edim.y.dendro_end = 860;

  // console.log(params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)

  var inst_pix = {};
  inst_pix.x = params.zoom_data.x.cursor_position;
  inst_pix.y = params.zoom_data.y.cursor_position;

  // console.log(inst_pix.y)

  var viz_dim_heat = params.viz_dim.heat;

  var effective_max_width = viz_dim_heat.width + params.zoom_data.x.total_pan_min;
  var effective_max_height = viz_dim_heat.height + params.zoom_data.y.total_pan_min

  var cat_index;

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

    params.tooltip.in_bounds_tooltip = true;
    if (params.cat_data.row.length > 0){

      cat_index = Math.floor( ((edim.x.heat_min - inst_pix.x)/cat_width) );

      if (cat_index + 1 <= params.cat_data.row.length){
        params.tooltip.tooltip_type = 'row-cat-' + String(params.cat_data.row.length - cat_index - 1);
      } else {
        params.tooltip.tooltip_type = 'row-label';
      }

    } else {
      params.tooltip.tooltip_type = 'row-label';
    }


  } else if (inst_pix.y <= edim.y.heat_min &&
             inst_pix.x > edim.x.heat_min &&
             inst_pix.x < edim.x.dendro_start){

    // // console.log(edim.y.heat_min - inst_pix.y)
    // console.log( Math.floor( ((edim.y.heat_min - inst_pix.y)/cat_width) ))
    // params.tooltip.tooltip_type = 'col-label';

    params.tooltip.in_bounds_tooltip = true;
    if (params.cat_data.col.length > 0){

      cat_index = Math.floor( ((edim.y.heat_min - inst_pix.y)/cat_width) );

      if (cat_index + 1 <= params.cat_data.col.length){
        params.tooltip.tooltip_type = 'col-cat-' + String(params.cat_data.col.length - cat_index - 1);
      } else {
        params.tooltip.tooltip_type = 'col-label';
      }

    } else {
      params.tooltip.tooltip_type = 'col-label';
    }

  } else if (inst_pix.x >= edim.x.dendro_start &&
             inst_pix.x < edim.x.dendro_end &&
             inst_pix.y > edim.y.heat_min &&
             inst_pix.y < edim.y.dendro_start){

    params.tooltip.tooltip_type = 'row-dendro';
    params.tooltip.in_bounds_tooltip = true;

  } else if (inst_pix.y >= edim.y.dendro_start &&
             inst_pix.y < edim.y.dendro_end &&
             inst_pix.x > edim.x.heat_min &&
             inst_pix.x < edim.x.dendro_start){

    params.tooltip.tooltip_type = 'col-dendro';
    params.tooltip.in_bounds_tooltip = true;

  }


}