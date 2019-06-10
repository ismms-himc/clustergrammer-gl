var draw_commands = require('./draw_commands');

module.exports = function draw_labels_tooltips_or_dendro(regl, params){

  // turn back on draw_labels
  ///////////////////////////////

  console.log('draw_labels_tooltips_or_dendro')

  draw_commands(regl, params);

  if (params.tooltip.show_tooltip){
    params.tooltip.show_tooltip = false;
  }

  // turn back off draw dendro
  if (params.dendro.update_dendro){
    params.dendro.update_dendro = false;
  }

};