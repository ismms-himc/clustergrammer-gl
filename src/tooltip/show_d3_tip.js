module.exports = function show_d3_tip(cgm){

  cgm.tooltip.show('tooltip', cgm.control_panel_bkg);

  // var inst_bbox = d3.selectAll('.d3-tip').node().getBBox();
  var d3_tip_width = parseFloat(d3.select('#d3-tip')
                               .style('width')
                               .replace('px',''));

  d3.select('#d3-tip')
    .style('margin-left', d3_tip_width + 'px');
}