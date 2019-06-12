var make_tooltip_text = require('./make_tooltip_text');
var remove_lost_tooltips = require('./remove_lost_tooltips');
var position_tooltip = require('./position_tooltip');

module.exports = function show_d3_tip(params){

  console.log('showing d3_tip')

  remove_lost_tooltips(params);

  make_tooltip_text(params);

  position_tooltip(params);
}