 var d3 = require("d3");
var manual_update_to_cats = require('./../cats/manual_update_to_cats');

module.exports = function manual_category_from_dendro(cgm, external_model, inst_axis){

  let params = cgm.params

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

  colors_array_1 = ['#ff4422','#ee1166' ,'#9911bb' ,'#6633bb' ,'#3344bb' ,
                    '#1199ff','#00aaff', '#00bbdd','#009988','#44bb44']

  colors_array_2 = ['#88cc44','#ccdd22', '#ffee11','#ffcc00', '#ff9900',
                    '#ff5500', '#775544','#999999','#828080', '#444']

  let select_color_from_pallet = function(inst_color){
    d3.select(params.tooltip_id + ' .custom-cat-color')
      .attr('value', inst_color)

    d3.select(params.tooltip_id + ' .color-preview')
      .style('background-color', inst_color)
  }

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
      select_color_from_pallet(d)
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
      select_color_from_pallet(d)
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
      d3.select(params.tooltip_id + ' .color-preview')
        .style('background-color', this.value)
    })

  let color_picker_height = 45
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

      if (params.cat_data.showing_color_picker === false){

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

        params.cat_data.showing_color_picker = true

      }

    })

  // update category button
  ///////////////////////////////
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

      let inst_cat = d3.select(params.tooltip_id + ' .custom-cat-input')
                       .node().value;

      let inst_color = d3.select(params.tooltip_id + ' .custom-cat-color')
                         .node().value;

      if (inst_cat != ''){

        console.log(inst_color)
        if (inst_color === ''){
          inst_color = 'white'
        }

        let inst_labels = params.dendro.selected_clust_names;

        // Only allowing custom naming of first column
        // debugger;

        let cat_title = params.cat_data[inst_axis][0].cat_title


        let full_cat = cat_title + ': ' + inst_cat
        params.network.cat_colors[inst_axis]['cat-0'][full_cat] = inst_color

        manual_update_to_cats(cgm, inst_axis, full_cat, inst_labels);

        if (params.is_widget){
          console.log('--> running widget callback on manual category update')
          cgm.widget_callback(external_model);
        }

      }

    })
    .append('text')
    .text('Set Category')


}