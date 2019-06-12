// var initialize_d3_tip = require('./../tooltip/initialize_d3_tip');
var make_tooltip_text = require('./make_tooltip_text');
var remove_lost_tooltips = require('./remove_lost_tooltips');

module.exports = function show_d3_tip(params){

  console.log('showing d3_tip')

  remove_lost_tooltips(params);

  var tooltip_text = make_tooltip_text(params);

  // position tooltip

  // this is necessary to offset the tooltip correctly, probably due to the
  // padding in the tooltip or some related paramters
  var magic_x_offset = 22;

  var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                               .style('width')
                               .replace('px',''));

  var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                               .style('height')
                               .replace('px',''));

  params.d3_tip_width = d3_tip_width;

  d3.selectAll('.cgm-tooltip')
    .style('display', 'none');

  /* former position of remove lost tooltips */

  // need to set up custom positioning of the tooltip based on the mouseover type
  // upper left if on matrix-cell, upper right if on row label, lower left if on
  // column mouseover. Should be able to check params.tooltip.tooltip_type to
  // find out how to position the tooltip
  d3.select(params.tooltip_id)
    .style('display', 'block')
    .style('z-index', 99);

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
}