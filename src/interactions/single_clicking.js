module.exports = function single_clicking(params){

  params.ani.last_click = params.ani.time;

  if (params.tooltip.tooltip_type.includes('-dendro')){
    if (params.tooltip.permanent_tooltip === false){
      require('./../tooltip/run_show_tooltip')(params);
      params.tooltip.permanent_tooltip = true;
    }
  }

}