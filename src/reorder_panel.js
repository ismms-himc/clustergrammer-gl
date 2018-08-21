var control = require('control-panel');

module.exports = function reorder_panel(regl, params, control_container, inst_axis){

  var axis_name;
  if (inst_axis === 'row'){
    axis_name = 'Row';
  } else {
    axis_name = 'Column'
  }

  var panel_width = 250;

  var inst_panel = control([

    {type: 'select', label: inst_axis + ' Order', options: {'clust':'Cluster', 'rank':'Rank'}, initial: 'option 1', action: function(){
      console.log('something')
      params.animation.run_switch = true;
    }},
  ],
    {theme: 'light', root:control_container, title: axis_name + ' Options', width:panel_width}
  );

  return inst_panel;

};