module.exports = function run_hide_tooltip(params, click_on_heatmap=false){

  if (params.tooltip.permanent_tooltip === false){
    params.tooltip_fun.hide();
    ;
  }

   if (click_on_heatmap){
     params.tooltip.permanent_tooltip = false;
     params.tooltip_fun.hide();

   }

   params.cat_data.showing_color_picker = false

}