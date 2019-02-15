module.exports = function find_mouseover_element(regl, params, ev){

  /*

    Need to improve behavior for categories and dendrogram. This info will be
    used to reorder on double click.

  */

  var viz_dim_heat = params.viz_dim.heat;
  var mouseover = params.int.mouseover;

  // reset mouseover params
  _.each(['row', 'col'], function(i_axis){
    params.int.mouseover[i_axis] = {};
    params.int.mouseover[i_axis].name = null;
    params.int.mouseover[i_axis].cats = [];
  });
  params.int.mouseover.value = null;

  var offcenter = {};
  var i_cat_name;
  var cursor_rel_min = {};
  var dim_dict = {};
  dim_dict.x = 'width';
  dim_dict.y = 'height';

  _.each(['x', 'y'], function(i_axis){

    // try updating mouseover position
    params.zoom_data[i_axis].cursor_position = ev[i_axis + '0'];

    // convert offcenter WebGl units to pixel units
    offcenter[i_axis] = (params.viz_dim.canvas[dim_dict[i_axis]] *
                             params.viz_dim.offcenter[i_axis])/2;

    cursor_rel_min[i_axis] = params.zoom_data[i_axis].cursor_position -
                                  viz_dim_heat[i_axis].min - offcenter[i_axis];

    cursor_rel_min[i_axis] = cursor_rel_min[i_axis] / params.zoom_data[i_axis].total_zoom - params.zoom_data[i_axis].total_pan_min;

  });

  require('./get_mouseover_type')(params);

  var axis_indices = {};

  if (params.tooltip.in_bounds_tooltip){

    var axis_index;

    var i_dims = [];
    if (params.tooltip.tooltip_type === 'matrix-cell'){
      i_dims = ['row', 'col'];
    } else if (params.tooltip.tooltip_type.indexOf('row') >= 0){
      i_dims = ['row'];
    } else if (params.tooltip.tooltip_type.indexOf('col') >= 0){
      i_dims = ['col'];

      var y_heat_min = 126;
      var i_pix_y = params.zoom_data.y.cursor_position
      var shift_col_label = y_heat_min - i_pix_y;
      if (shift_col_label > 0){
        cursor_rel_min.x = cursor_rel_min.x - shift_col_label/ params.zoom_data.x.total_zoom;
      }
    }

    _.each(i_dims, function(i_axis){

      if (i_axis === 'row'){
        axis_index = Math.floor(cursor_rel_min.y/params.tile_pix_height);
        axis_indices[i_axis] = params.labels.ordered_labels[i_axis + '_indices'][axis_index];
      } else {
        axis_index = Math.floor(cursor_rel_min.x/params.tile_pix_width);
        axis_indices[i_axis] = params.labels.ordered_labels[i_axis + '_indices'][axis_index];
      }

      mouseover[i_axis].name = params.labels.ordered_labels[i_axis + 's'][axis_index];

      if (typeof mouseover[i_axis].name === 'string'){
        if (mouseover[i_axis].name.includes(': ')){
          mouseover[i_axis].name = mouseover[i_axis].name.split(': ')[1];
        }
      }

      // reset cat names
      mouseover[i_axis].cats = [];
      _.each(params.cat_data[i_axis], function(d, cat_index){
        i_cat_name = params.labels.ordered_labels[i_axis + '_cats-' + cat_index][axis_index];
        mouseover[i_axis].cats[cat_index] = i_cat_name;
      });

    });

    if (params.tooltip.tooltip_type === 'matrix-cell'){
      params.int.mouseover.value = params.mat_data[axis_indices.row][axis_indices.col];
    }

  }

  if (params.tooltip.tooltip_type.indexOf('dendro') >= 0){

    if (params.tooltip.tooltip_type === 'row-dendro'){
      _.each(params.dendro.group_info.row, function(i_group){
        if (i_group.all_names.includes(mouseover.row.name)){
          mouseover.row.dendro = i_group;
        }
      });
    }

    if (params.tooltip.tooltip_type === 'col-dendro'){
      _.each(params.dendro.group_info.col, function(i_group){
        if (i_group.all_names.includes(mouseover.col.name)){
          mouseover.col.dendro = i_group;
        }
      });
    }

  }

};