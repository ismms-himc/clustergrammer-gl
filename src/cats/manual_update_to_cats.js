module.exports = function manual_update_to_cats(inst_axis, new_cat, selected_labels){

  console.log('manual_update_to_cats')

  // simulate manual update to categories
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

  params = this.params
  regl = this.regl

  // generate an ordred labels list
  require('./../matrix_labels/gen_ordered_labels')(params);

  require('./../params/generate_cat_args_arrs')(regl, params);

  var draw_labels = params.labels.draw_labels;
  require('./../draws/draw_matrix_components')(regl, params);
  require('./../draws/draw_axis_components')(regl, params, 'row', draw_labels);
  require('./../draws/draw_axis_components')(regl, params, 'col', draw_labels);
  require('./../draws/draw_static_components')(regl, params);

}