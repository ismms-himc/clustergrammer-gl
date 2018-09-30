// const vectorizeText = require('vectorize-text');
var restrict_rel_min = require('./restrict_rel_min');

module.exports = function find_mouseover_element(regl, params, ev){

  /*

  Need to use

    params.canvas_pos.x_arr.length
      and
    params.canvas_pos.y_arr.length

  to identify where the user is mousing over

  Also need to take into consideration zooming/panning

  */

  // var vect_text_attrs = {
  //   textAlign: 'right',
  //   textBaseline: 'middle',
  //   triangles:true,
  //   size:params.labels.font_detail,
  //   font:'"Open Sans", verdana, arial, sans-serif'
  // };

  var viz_dim_heat = params.viz_dim.heat;
  var mouseover = params.interact.mouseover;

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

    cursor_rel_min[inst_axis] = restrict_rel_min(cursor_rel_min[inst_axis],
                                  viz_dim_heat[dim_dict[inst_axis]],
                                  params.zoom_data[inst_axis]);

  });

  if (cursor_rel_min.x > 0 &&
      cursor_rel_min.x < viz_dim_heat.width &&
      cursor_rel_min.y > 0 &&
      cursor_rel_min.y < viz_dim_heat.height){
    params.tooltip.in_bounds_tooltip = true;
  } else {
    params.tooltip.in_bounds_tooltip = false;
  }

  if (params.tooltip.in_bounds_tooltip){

    // console.log('in bounds', cursor_rel_min.x, cursor_rel_min.y)

    var axis_index;

    _.each(['row', 'col'], function(inst_axis){

      if (inst_axis === 'row'){
        axis_index = Math.floor(cursor_rel_min.y/params.tile_pix_height);
      } else {
        axis_index = Math.floor(cursor_rel_min.x/params.tile_pix_width);
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

    })

      // mouseover.col_cat = params.labels.ordered_labels['col_cats-0'][col_index]
      // console.log(mouseover.col_cat)

    // if (mouseover.row_name.includes(': ')){
    //   mouseover.row_name = mouseover.row_name.split(': ')[1];
    // }

    // if (mouseover.col_name.includes(': ')){
    //   mouseover.col_name = mouseover.col_name.split(': ')[1];
    // }

    // var mouseover_text;
    // if (params.cat_data.cat_num.col == 0){

    //   // calculate text triangles, they require an offset element
    //   mouseover_text = mouseover.row_name + ' and ' + mouseover.col_name;
    //   mouseover.text_triangles['line-1'] = vectorizeText(mouseover_text, vect_text_attrs);
    //   mouseover.text_triangles['line-1'].offset = [0,0];

    // } else {

    //   // calculate text triangles, they require an offset element
    //   mouseover_text = mouseover.row_name + ' and ' + mouseover.col_name;
    //   mouseover.text_triangles['line-1'] = vectorizeText(mouseover_text, vect_text_attrs);
    //   mouseover.text_triangles['line-1'].offset = [0,0];

    //   mouseover.col_cat = params.labels.ordered_labels['col_cats-0'][col_index];

    //   mouseover_text = mouseover.col_cat;
    //   mouseover.text_triangles['line-2'] = vectorizeText(mouseover_text, vect_text_attrs);
    //   mouseover.text_triangles['line-2'].offset = [0,0];
    // }

  }
};