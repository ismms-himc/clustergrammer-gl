var control = require('control-panel');
var make_position_arr = require('./make_position_arr');

module.exports = function reorder_panel(regl, params, control_container, inst_axis){

  var panel_width = 250;

  var panel_1 = control([

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

  panel_1.on('input', function(data){

      console.log('something happening', data)
      params.animation.run_switch = true;
      // params.new_order.row = data['row Order'];
      params.new_order.col = data['col Order'];

      // console.log(params.new_order.row, params.new_order.col)

      params.arrs.position_arr['new'] = make_position_arr(params,
                                      params.new_order.row,
                                      params.new_order.col);

      // var new_pos_arr = params.arrs.position_arr['new']

      params.matrix_args.regl_props.rects.attributes.pos_att_new = {
            buffer: regl.buffer(params.arrs.position_arr['new']),
            divisor: 1
          };

      /*
      Need to calcualte new position array when choosing new order
      */

  })

};