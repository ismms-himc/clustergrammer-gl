module.exports = function draw_commands(regl, params){

  // if mousing over categories initialize all categories to low opacity
  var mousing_over_cat = false;
  if (params.tooltip.tooltip_type){
    if (params.tooltip.tooltip_type.includes('-cat-')){
      // This is required to updated category opacity when mousing over
      require('./../params/generate_cat_args_arrs')(regl, params);
      console.log('generate_cat_args_arrs\n--------------------------')

      params.int.need_reset_cat_opacity = true;
      mousing_over_cat = true;
    }
  }

  if (params.int.need_reset_cat_opacity && mousing_over_cat == false){
    // console.log('\n\n')
    // console.log(mousing_over_cat)
    // console.log(params.tooltip.tooltip_type)
    console.log('reset cat opacity\n==============================')
    require('./../params/generate_cat_args_arrs')(regl, params);
    params.int.need_reset_cat_opacity = false;
  }


  var draw_labels = params.labels.draw_labels;
  require('./draw_matrix_components')(regl, params);
  require('./draw_axis_components')(regl, params, 'row', draw_labels);
  require('./draw_axis_components')(regl, params, 'col', draw_labels);
  require('./draw_static_components')(regl, params);

  var tooltip = params.tooltip;
  if (tooltip.show_tooltip && tooltip.in_bounds_tooltip && tooltip.on_canvas){
    require('./../tooltip/show_d3_tip')(params);
  }
  if (params.labels.draw_labels){
    params.labels.draw_labels = false;
  }
};