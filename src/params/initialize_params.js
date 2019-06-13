var hzome_functions = require('./../tooltip/hzome_functions')

module.exports = function initialize_params(regl, network){

  var params = {};
  params.network = network;

  require('./gen_ani_par')(params);
  require('./calc_alpha_order')(params)
  require('./gen_int_par')(params);
  params.mat_data = params.network.mat;
  require('./gen_cat_par')(params);
  require('./generate_order_params')(params);
  require('./gen_label_par')(params);
  var labels = params.labels;

  // console.log('generate_tooltip_params')
  require('./generate_tooltip_params')(regl, params);

  require('./calc_viz_dim')(regl, params);
  require('./generate_cat_args_arrs')(regl, params);
  params.zoom_data = require('./../zoom/ini_zoom_data')();
  params.canvas_pos = require('./calc_row_and_col_canvas_positions')(params);
  params.is_downsampled = false;
  params.viz_aid_tri_args = {};

  _.each(['row', 'col'], function(inst_axis){
    require('./../matrix_labels/calc_text_offsets')(params, inst_axis);
  });

  params.tile_pix_width = params.viz_dim.heat.width/labels.num_col;
  params.tile_pix_height = params.viz_dim.heat.height/labels.num_row;

  require('./gen_pix_to_webgl')(params);
  require('./generate_webgl_to_pix')(params);
  require('./../matrix_labels/make_label_queue')(params);
  require('./gen_text_zoom_par')(params);
  require('./calc_viz_area')(params);
  require('./generate_text_triangle_params')(params);

  var min_dim;
  if (labels.num_col < labels.num_row){
    min_dim = labels.num_col;
  } else {
    min_dim = labels.num_row;
  }

  params.max_zoom = min_dim/4.0;
  params.zoom_restrict = require('./../zoom/ini_zoom_restrict')(params);
  require('./../zoom/zoom_rules_high_mat')(regl, params);
  require('./../cameras/make_cameras')(regl, params);

  require('./../params/calc_mat_arr')(params);
  params.matrix_args = require('./../matrix_cells/make_matrix_args')(regl, params);
  require('./gen_dendro_par')(regl, params);
  require('./generate_spillover_params')(regl, params);

  var allow_factor = d3.scale.linear()
    .domain([10, 1000])
    .range([2, 30]);

  params.allow_zoom = {};
  params.allow_zoom.col = allow_factor(labels.num_col);
  params.allow_zoom.row = allow_factor(labels.num_col);
  params.text_scale = {};
  params.cat_colors = params.network.cat_colors;

  params.hzome = hzome_functions(params);

  return params;
};