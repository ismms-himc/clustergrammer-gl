var make_cat_breakdown_graph = require('./../cats/make_cat_breakdown_graph');
var calc_cat_cluster_breakdown = require('./../cats/calc_cat_cluster_breakdown');

module.exports = function make_dendro_tooltip(params, inst_axis){

  var mouseover = params.interact.mouseover;

  params.tooltip_fun.show('tooltip');
  cat_breakdown = calc_cat_cluster_breakdown(params, mouseover[inst_axis].dendro, inst_axis);
  var group_tooltip_container = d3.select(params.tooltip_id).node();
  make_cat_breakdown_graph(params, mouseover[inst_axis].dendro, cat_breakdown);

  };