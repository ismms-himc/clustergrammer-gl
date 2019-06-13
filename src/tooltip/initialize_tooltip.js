module.exports = function initialize_tooltip(params){

  // artifically initialize tooltip
  /////////////////////////////////////
  var inst_selector = params.root + ' .control-panel-background';
  var control_panel_bkg = d3.select(inst_selector).node();
  params.control_panel_bkg = control_panel_bkg;

  params.tooltip_fun.show('tooltip', params.control_panel_bkg);

  var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                               .style('width')
                               .replace('px',''));


  var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                               .style('height')
                               .replace('px',''));


  params.tooltip_ini_width = d3_tip_width;
  params.tooltip_ini_height = d3_tip_height;

  params.tooltip_fun.hide();

};