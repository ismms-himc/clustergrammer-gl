module.exports = function initialize_d3_tip(params){

  // artifically initialize tooltip
  /////////////////////////////////////
  var inst_selector = params.root + ' .control-panel-background';
  var control_panel_bkg = d3.select(inst_selector).node();
  params.control_panel_bkg = control_panel_bkg;

  params.tooltip_fun.show('tooltip', params.control_panel_bkg);

  // var inst_bbox = d3.selectAll('.d3-tip').node().getBBox();
  var d3_tip_width = parseFloat(d3.select('#d3-tip')
                               .style('width')
                               .replace('px',''));

  d3.select('#d3-tip')
    .style('margin-left', d3_tip_width + 'px');

  params.tooltip_fun.hide();

};