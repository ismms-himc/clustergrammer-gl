let draw_webgl_layers = require('./../draws/draw_webgl_layers')

module.exports = function manual_update_to_cats(cgm, axis, cat_title, new_cat, selected_labels){

  params = cgm.params
  regl = cgm.regl

  let full_cat = cat_title + ': ' + new_cat

  // manually updated categories in network
  cgm.params.network[axis + '_nodes']
     .map(x => {

       inst_name = x.name

       if ( inst_name.includes(': ') ){
         inst_name = inst_name.split(': ')[1]
       }

       if (selected_labels.includes(inst_name)){
         x['cat-0'] = full_cat
       }

     })

  // update manual_cat_dict (will be synced to widget back-end)
  selected_labels.forEach((inst_label) => {
    params.cat_data.manual_cat_dict[axis][cat_title][inst_label] = new_cat
  })

  params.cat_data.manual_cat_dict[axis]

  // generate an ordred labels list
  require('./../matrix_labels/gen_ordered_labels')(cgm);

  require('./../params/generate_cat_args_arrs')(regl, params);

  draw_webgl_layers(cgm)

}