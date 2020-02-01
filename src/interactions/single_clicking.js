module.exports = function single_clicking(params, external_model){

  params.ani.last_click = params.ani.time;

  if (params.tooltip.tooltip_type.includes('-dendro')){
    if (params.tooltip.permanent_tooltip === false){
      require('./../tooltip/run_show_tooltip')(params);
      params.tooltip.permanent_tooltip = true;
    }
  }

  if (params.is_widget){
    console.log('--> running widget callback on click')
    cgm.widget_callback(external_model);
  }

}