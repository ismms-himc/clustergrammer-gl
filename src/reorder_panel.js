var control = require('control-panel');

module.exports = function reorder_panel(regl, params, control_container, inst_axis){

  var panel_width = 250;

  var inst_panel = control([

    {type: 'select', label: inst_axis + ' Order', options: {'clust':'Cluster', 'rank':'Rank'}, initial: 'option 1', action: function(){
      console.log('something')
      params.animation.run_switch = true;
    }},
    // {type: 'text', label: inst_axis + ' Search', initial: 'my cool setting'},
    // {type: 'multibox', label: 'check many', count: 3, initial: [true, false, true]}
  ],
    {theme: 'light', root:control_container, title: inst_axis + ' Options', width:panel_width}
    // {theme: 'light', position: 'top-left'}
  );

  return inst_panel;

};