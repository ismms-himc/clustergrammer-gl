let draw_webgl_layers = require('./../draws/draw_webgl_layers')

module.exports = function update_all_cats(cgm, axis, cat_title, new_cat_dict){

  // make test new_cat_dict
  // new_cat_dict = {}
  // cgm.params.network.col_nodes.forEach(x => { new_cat_dict[x.name.split(': ')[1]] = x['cat-0'].split(': ')[1]})

  params = cgm.params
  regl = cgm.regl


  // manually updated categories in network
  cgm.params.network[axis + '_nodes']
     .map(x => {

       inst_name = x.name

       if ( inst_name.includes(': ') ){
         inst_name = inst_name.split(': ')[1]
       }

       let new_cat = new_cat_dict[inst_name]
       let full_cat = cat_title + ': ' + new_cat
       x['cat-0'] = full_cat

     })

  // update manual_cat_dict (will be synced to widget back-end)
  cgm.params.network[axis + '_node_names'].forEach((inst_name) => {
    let new_cat = new_cat_dict[inst_name]
    params.cat_data.manual_cat_dict[axis][cat_title][inst_name] = new_cat
  })

  // params.cat_data.manual_cat_dict[axis]

  // generate an ordred labels list
  require('./../matrix_labels/gen_ordered_labels')(cgm);
  require('./../params/generate_cat_args_arrs')(regl, params);
  draw_webgl_layers(cgm)

}