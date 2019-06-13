module.exports = function hide_tooltip(params){

  if (params.tooltip.permanent_tooltip === false){
    params.tooltip_fun.hide();
  }

}