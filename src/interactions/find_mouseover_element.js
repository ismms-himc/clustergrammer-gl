module.exports = function find_mouseover_element(regl, params, ev){

  /*

  Need to use

    params.canvas_pos.x_arr.length
      and
    params.canvas_pos.y_arr.length

  to identify where the user is mousing over

  Also need to take into consideration zooming/panning

  */

  var viz_dim_heat = params.viz_dim.heat;
  var mouseover = params.interact.mouseover;

  // reset mouseover params
  _.each(['row', 'col'], function(inst_axis){
    params.interact.mouseover[inst_axis] = {};
    params.interact.mouseover[inst_axis].name = null;
    params.interact.mouseover[inst_axis].cats = [];
  });
  params.interact.mouseover.value = null;

  var offcenter = {};
  var inst_cat_name;
  var cursor_rel_min = {};
  var dim_dict = {};
  dim_dict.x = 'width';
  dim_dict.y = 'height';

  _.each(['x', 'y'], function(inst_axis){

    // try updating mouseover position
    params.zoom_data[inst_axis].cursor_position = ev[inst_axis + '0'];

    // convert offcenter WebGl units to pixel units
    offcenter[inst_axis] = (params.viz_dim.canvas[dim_dict[inst_axis]] *
                             params.viz_dim.offcenter[inst_axis])/2;

    cursor_rel_min[inst_axis] = params.zoom_data[inst_axis].cursor_position -
                                  viz_dim_heat[inst_axis].min - offcenter[inst_axis];

    cursor_rel_min[inst_axis] = cursor_rel_min[inst_axis] / params.zoom_data[inst_axis].total_zoom - params.zoom_data[inst_axis].total_pan_min;

  });

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

  } else if (cursor_rel_min.y < 0 &&
             cursor_rel_min.x < viz_dim_heat.width){

    params.tooltip.tooltip_type = 'col-label';

  }

  console.log(params.tooltip.tooltip_type)

  // params.tooltip.in_bounds_tooltip = true;

  var axis_indices = {};
  if (params.tooltip.in_bounds_tooltip){

    var axis_index;

    _.each(['row', 'col'], function(inst_axis){

      if (inst_axis === 'row'){
        axis_index = Math.floor(cursor_rel_min.y/params.tile_pix_height);
        axis_indices[inst_axis] = params.labels.ordered_labels[inst_axis + '_indices'][axis_index];
      } else {
        axis_index = Math.floor(cursor_rel_min.x/params.tile_pix_width);
        axis_indices[inst_axis] = params.labels.ordered_labels[inst_axis + '_indices'][axis_index];
      }

      mouseover[inst_axis].name = params.labels.ordered_labels[inst_axis + 's'][axis_index];

      if (mouseover[inst_axis].name.includes(': ')){
        mouseover[inst_axis].name = mouseover[inst_axis].name.split(': ')[1];
      }

      // reset cat names
      mouseover[inst_axis].cats = [];
      _.each(params.cat_data[inst_axis], function(d, cat_index){
        inst_cat_name = params.labels.ordered_labels[inst_axis + '_cats-' + cat_index][axis_index];
        mouseover[inst_axis].cats[cat_index] = inst_cat_name;
      });

    });

    // debugger;
    params.interact.mouseover.value = params.mat_data[axis_indices.row][axis_indices.col];

  }
};