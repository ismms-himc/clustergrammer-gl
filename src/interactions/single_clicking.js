module.exports = function single_clicking(params){
  params.ani.last_click = params.ani.time;

  if (params.tooltip.tooltip_type.includes('-dendro')){

    console.log('single clicking dendrogram')
    params.tooltip.permanent_tooltip = true;
  }

}