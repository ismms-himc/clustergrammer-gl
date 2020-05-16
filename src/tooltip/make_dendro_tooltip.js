var d3 = require("d3");
var make_cat_breakdown_graph = require('./../cats/make_cat_breakdown_graph');
var calc_cat_cluster_breakdown = require('./../cats/calc_cat_cluster_breakdown');
var run_hide_tooltip = require('./run_hide_tooltip');
// var run_dendro_crop = require('./../crop/run_dendro_crop');
var manual_update_to_cats = require('./../cats/manual_update_to_cats');

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

  // Custom Category
  ////////////////////////////
  d3.select(params.tooltip_id)
    .append('text')
    .text('Custom Category: ');

  // color picker section
  let color_picker_div = d3.select(params.tooltip_id)
    .append('div')
    .classed('color_picker_div', true)
    .style('height', '0px')
    .style('display', 'none')

  colors_array_1 = [
     '#ff4422','#ee1166' ,'#9911bb' ,'#6633bb' ,'#3344bb' ,'#1199ff','#00aaff',
     '#00bbdd','#009988','#44bb44']

  colors_array_2 = ['#88cc44','#ccdd22','#ffee11','#ffcc00',
     '#ff9900','#ff5500', '#775544','#999999','#828080','#444']

  color_picker_div
    .append('div')
    .selectAll('div')
    .data(colors_array_1)
    .enter()
    .append('div')
    .style('width', '30px')
    .style('height', '16px')
    .style('display', 'inline-block')
    .style('margin-left', '5px')
    .style('margin-right', '2px')
    .style('background-color', (d) => d)
    .on('click', (d) => {

      console.log(d)

    })

  color_picker_div
    .append('div')
    .selectAll('div')
    .data(colors_array_2)
    .enter()
    .append('div')
    .style('width', '30px')
    .style('height', '16px')
    .style('display', 'inline-block')
    .style('margin-left', '5px')
    .style('margin-right', '2px')
    .style('background-color', (d) => d)
    .on('click', (d) => {

      console.log(d)

    })

  // custom category input secion
  custom_cat_div = d3.select(params.tooltip_id)
    .append('div')
    .classed('custom_cat_div', true)

  custom_cat_div
    .append('input')
    .classed('custom-cat-input', true)
    .attr('placeholder', 'Category')
    .style('width', '140px')
    .style('display', 'inline-block')
    .style('color', 'black');

  // type color
  custom_cat_div
    .append('input')
    .classed('custom-cat-color', true)
    .attr('placeholder', 'Color')
    .style('width', '80px')
    .style('display', 'inline-block')
    .style('margin-left', '5px')
    .style('color', 'black')
    .on('input', function(d){
      console.log(this.value)

      d3.select(params.tooltip_id + ' .color-preview')
        .style('background-color', this.value)

    })

  let color_picker_height = 40
  // color preview
  custom_cat_div
    .append('div')
    .classed('color-preview', true)
    .style('width', '30px')
    .style('height', '16px')
    .style('display', 'inline-block')
    .style('margin-left', '5px')
    .style('margin-right', '2px')
    .style('background-color', 'white')
    .on('click', (d) => {


      d3.select(params.tooltip_id + ' .color_picker_div')
        .style('height', color_picker_height + 'px')
        .style('display', 'block')

      d3.select(params.tooltip_id)
        .style('margin-top', function(){

          let old_top_margin = d3.select(params.tooltip_id)
                                 .style('margin-top').replace('px')

          let new_top_margin = String(parseInt(old_top_margin) -
                               color_picker_height) + 'px'

          return new_top_margin
        })

    })


  custom_cat_div
    .append('button')
    .style('display', 'inline-block')
    .style('margin-left', '5px')
    .style('padding', '2px 5px')
    .style('background-color', 'dodgerblue')
    .style('border', '1px solid #ddd')
    .style('color', 'white')
    .style('cursor', 'pointer')
    .on('click', d => {
      let inst_cat = d3.select(params.tooltip_id + ' .custom-cat-input').node().value;
      let inst_color = d3.select(params.tooltip_id + ' .custom-cat-color').node().value;

      if (inst_cat != ''){
        console.log('****************************')
        console.log(inst_cat, inst_color)
        let inst_labels = params.dendro.selected_clust_names;

        // Only allowing custom naming of first column
        let cat_title = params.cat_data.col[0].cat_title
        params.network.cat_colors.col['cat-0'][cat_title + ': ' + inst_cat] = inst_color

        manual_update_to_cats(cgm, inst_axis, cat_title + ': ' + inst_cat, inst_labels);
      }

    })
    .append('text')
    .text('Set Category')

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