var control = require('control-panel');

module.exports = function dendro_panel(regl, params, control_container, inst_axis){

  var axis_name;
  if (inst_axis === 'row'){
    axis_name = 'Row';
  } else {
    axis_name = 'Column'
  }

  var panel_width = 250;

  var inst_panel = control([

    {type: 'range', label: 'range slider', min: 0, max: 100, initial: 20},
  ],
    {theme: 'light', root:control_container, title: axis_name + ' Dendrogram', width:panel_width}

  );

  return inst_panel;
}