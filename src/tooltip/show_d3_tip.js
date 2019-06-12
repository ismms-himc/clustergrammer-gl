var make_dendro_tooltip = require('./make_dendro_tooltip');
// var initialize_d3_tip = require('./../tooltip/initialize_d3_tip');
var make_tooltip_text = require('./make_tooltip_text');

module.exports = function show_d3_tip(params){

  console.log('showing d3_tip')

  var inst_axis;
  var tooltip_text;

  var tooltip_text = make_tooltip_text(params);

  // position tooltip
  var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                               .style('width')
                               .replace('px',''));

  var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                               .style('height')
                               .replace('px',''));

  // this is necessary to offset the tooltip correctly, probably due to the
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

  // need to set up custom positioning of the tooltip based on the mouseover type
  // upper left if on matrix-cell, upper right if on row label, lower left if on
  // column mouseover. Should be able to check params.tooltip.tooltip_type to
  // find out how to position the tooltip
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