var make_dendro_tooltip = require('./make_dendro_tooltip');
// var initialize_d3_tip = require('./../tooltip/initialize_d3_tip');

module.exports = function show_d3_tip(params){

  var inst_axis;
  var full_string;
  var mouseover = params.interact.mouseover;

  // // check if tooltip is missing
  // if (d3.select(params.tooltip_id).empty()){
  //   console.log('need to make new tooltip')
  //   initialize_d3_tip(cgm.params);
  // }

  if (params.tooltip.tooltip_type === 'matrix-cell'){

    // Matrix-Cell Tooltip
    ////////////////////////

    // row name
    full_string = mouseover.row.name;

    // _.each(mouseover.row.cats, function(inst_cat){
    //   full_string = full_string + '<br>' + inst_cat
    // });

    full_string = full_string + ' and ';

    // col name
    full_string = full_string + mouseover.col.name;

    // _.each(mouseover.col.cats, function(inst_cat){
    //   full_string = full_string + '<br>' + inst_cat
    // });

    full_string = full_string + ' <br>value: ' + mouseover.value.toFixed(3);

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(full_string);

  } else if (params.tooltip.tooltip_type.indexOf('-label') > 0){

    // Label Tooltip
    //////////////////
    inst_axis = params.tooltip.tooltip_type.split('-')[0];
    full_string = mouseover[inst_axis].name;

    _.each(mouseover[inst_axis].cats, function(inst_cat){
      full_string = full_string + '<br>' + inst_cat
    });

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(full_string);

  } else if (params.tooltip.tooltip_type.indexOf('-dendro') > 0){

    // Dendro Tooltip
    //////////////////
    inst_axis = params.tooltip.tooltip_type.split('-')[0];
    make_dendro_tooltip(params, inst_axis);

  } else if (params.tooltip.tooltip_type.indexOf('-cat-') > 0){

    // Category Tooltip
    /////////////////////
    inst_axis = params.tooltip.tooltip_type.split('-')[0];
    var inst_index = params.tooltip.tooltip_type.split('-')[2];

    full_string = mouseover[inst_axis].cats[inst_index]

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(full_string);

  }


  // position tooltip
  var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                               .style('width')
                               .replace('px',''));

  var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                               .style('height')
                               .replace('px',''));

  // this is necessary to offset hte tooltip correctly, probably due to the
  // padding in the tooltip or some related paramters
  var magic_x_offset = 22;

  params.d3_tip_width = d3_tip_width;

  d3.selectAll('.cgm-tooltip')
    .style('display', 'none');

  // remove any other tooltips left behind by another heatmap
  d3.selectAll('.cgm-tooltip').each(
    function(){
    var inst_id = d3.select(this).attr('id').split('_')[1];
    if(d3.select('#'+inst_id).empty()){
      d3.select(this).style('display', 'none')
    }
  });

  d3.select(params.tooltip_id)
    .style('margin-left', function(){
      var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width +
                           magic_x_offset;
      return total_x_offset + 'px'
    })
    .style('margin-top', function(){
      var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
      return total_y_offset + 'px'
    })
    .style('display', 'block')
    .style('z-index', 99);

}