var make_cat_breakdown_graph = require('./../cats/make_cat_breakdown_graph');
var calc_cat_cluster_breakdown = require('./../cats/calc_cat_cluster_breakdown');
var run_hide_tooltip = require('./run_hide_tooltip');

module.exports = function make_dendro_tooltip(params, inst_axis){

  var mouseover = params.int.mouseover;

  params.tooltip_fun.show('tooltip');

  d3.select(params.tooltip_id)
    .append('div')
    .style('text-align', 'right')
    .style('cursor', 'default')
    .on('click', function(){
      console.log('clicking close tooltip')
      params.tooltip.permanent_tooltip = false;
      run_hide_tooltip(params);
    })
    .append('text')
    .text('X')
    .style('font-size', '15px')

  var cat_breakdown = calc_cat_cluster_breakdown(params, mouseover[inst_axis].dendro, inst_axis);
  make_cat_breakdown_graph(params, mouseover[inst_axis].dendro, cat_breakdown);

  d3.select(params.tooltip_id)
    .append('text')
    .text('Selcted ' + inst_axis.replace('row', 'Rows').replace('col', 'Columns'));

  d3.select(params.tooltip_id)
    .append('input')
    .attr('value', function(){
      return cgm.params.dendro.selected_clust_names.join(', ');
    })
    .style('width', '364px')
    .style('display', 'block');


    // .append('div')
    // .style('text-align', 'right')
    // .style('cursor', 'default')
    // .on('click', function(){
    //   console.log('clicking close tooltip')
    //   params.tooltip.permanent_tooltip = false;
    //   run_hide_tooltip(params);
    // })
    // .append('text')
    // .text('X')
    // .style('font-size', '15px')


};