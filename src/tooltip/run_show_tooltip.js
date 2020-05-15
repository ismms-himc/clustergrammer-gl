var make_tooltip_text = require('./make_tooltip_text');
var remove_lost_tooltips = require('./remove_lost_tooltips');
var display_and_position_tooltip = require('./display_and_position_tooltip');

module.exports = function run_show_tooltip(cgm){

  let params = cgm.params;

  if (params.tooltip.permanent_tooltip === false){

    remove_lost_tooltips();

    make_tooltip_text(cgm);

    display_and_position_tooltip(params);

  }

}