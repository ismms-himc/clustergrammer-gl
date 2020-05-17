module.exports = function manual_update_to_cats(cgm, inst_axis, new_cat, selected_labels){

  console.log('manual_update_to_cats')

  params = cgm.params
  regl = cgm.regl

  // manually updated categories in network
  cgm.params.network[inst_axis + '_nodes']
     .map(x => {

       inst_name = x.name

       if ( inst_name.includes(': ') ){
         inst_name = inst_name.split(': ')[1]
       }

       if (selected_labels.includes(inst_name)){
         x['cat-0'] = new_cat
       }

     })

  // // update manual_cat_dict (will be synced to widget back-end)
  // selected_labels.forEach((inst_label) => {
  //   console.log('selected_labels', inst_label)
  // })

  // debugger;

  selected_labels.forEach((x) => console.log('tmp', x))


  params.cat_data.manual_cat_dict[axis]

  // generate an ordred labels list
  require('./../matrix_labels/gen_ordered_labels')(cgm);

  require('./../params/generate_cat_args_arrs')(regl, params);

  var draw_labels = params.labels.draw_labels;
  require('./../draws/draw_matrix_components')(regl, params);
  require('./../draws/draw_axis_components')(regl, params, 'row', draw_labels);
  require('./../draws/draw_axis_components')(regl, params, 'col', draw_labels);
  require('./../draws/draw_static_components')(regl, params);

}