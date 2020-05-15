var draw_commands = require('./draw_commands');

module.exports = function draw_labels_tooltips_or_dendro(external_model){

  var cgm = this;
  var regl = cgm.regl;
  var params = cgm.params;

  // turn back on draw_labels
  ///////////////////////////////
  draw_commands(cgm);

  if (params.tooltip.show_tooltip){
    params.tooltip.show_tooltip = false;
  }

  // turn back off draw dendro
  if (params.dendro.update_dendro){
    params.dendro.update_dendro = false;
  }

  // if (params.is_widget){
  //   console.log('--> running widget callback on mouseend')
  //   cgm.widget_callback(external_model);
  // }

};