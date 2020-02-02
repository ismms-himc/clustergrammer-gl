module.exports = function run_hide_tooltip(params, click_on_heatmap=false){

  if (params.tooltip.permanent_tooltip === false){
    params.tooltip_fun.hide();
    ;
  }

   if (click_on_heatmap){
     params.tooltip.permanent_tooltip = false;
     params.tooltip_fun.hide();

   }

}