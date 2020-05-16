var d3 = require("d3");
var make_cat_breakdown_graph = require('./../cats/make_cat_breakdown_graph');
var calc_cat_cluster_breakdown = require('./../cats/calc_cat_cluster_breakdown');
var run_hide_tooltip = require('./run_hide_tooltip');
// var run_dendro_crop = require('./../crop/run_dendro_crop');
var manual_category_from_dendro = require('./manual_category_from_dendro')

module.exports = function make_dendro_tooltip(cgm, inst_axis){

  var params = cgm.params;

  var mouseover = params.int.mouseover;

  params.tooltip_fun.show('tooltip');

  d3.select(params.tooltip_id)
    .append('div')
    .style('height', '16px')
    .style('text-align', 'right')
    .style('cursor', 'default')
    .on('click', function(){
      params.tooltip.permanent_tooltip = false;
      run_hide_tooltip(params);
    })
    .append('text')
    .text('x')
    .style('font-size', '15px')

  var cat_breakdown = calc_cat_cluster_breakdown(params, mouseover[inst_axis].dendro, inst_axis);
  make_cat_breakdown_graph(params, mouseover[inst_axis].dendro, cat_breakdown);

  d3.select(params.tooltip_id)
    .append('text')
    .text('Selected ' + inst_axis.replace('row', 'Rows').replace('col', 'Columns'));

  d3.select(params.tooltip_id)
    .append('input')
    .attr('value', function(){
      return params.dendro.selected_clust_names.join(', ');
    })
    .style('width', '364px')
    .style('display', 'block')
    .style('color', 'black');

  manual_category_from_dendro(cgm, inst_axis);

  // d3.select(cgm.params.tooltip_id + ' .custom-cat-input').node().value
  // d3.select(cgm.params.tooltip_id + ' .custom-cat-color').node().value

  // custom_cat_div
  //   .append('input')
  //   .style('placeholder', 'Custom Category')
  //   .style('width', '50px')
  //   .style('display', 'block')
  //   .style('float', 'left')
  //   .style('color', 'black');

  // console.log(params.dendro.selected_clust_names)

  // // working on adding crop functionality
  // /////////////////////////////////////////
  // d3.select(params.tooltip_id)
  //   .append('div')
  //   .style('cursor', 'default')
  //   .style('padding-top', '7px')
  //   .on('click', function(d){
  //     run_dendro_crop(params, d);
  //   })
  //   .append('text')
  //   .text('Crop to Selected Cluster')

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