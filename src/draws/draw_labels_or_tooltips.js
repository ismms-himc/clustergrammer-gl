var draw_commands = require('./draw_commands');

module.exports = function draw_labels_or_tooltips(regl, params){
  // turn back on draw_labels
  ///////////////////////////////

  // console.log('slow_draw or show_tooltip');
  draw_commands(regl, params);
  params.remove_tooltip_frame = true;

  // set up extra frame specifically to remove old tooltip
  if (params.show_tooltip){
    params.show_tooltip = false;
    // console.log('initialize remove_tooltip_frame')
  }


};