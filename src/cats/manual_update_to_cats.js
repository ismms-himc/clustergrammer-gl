module.exports = function manual_update_to_cats(new_cat){
  console.log('manual_update_to_cats')

  // console.log(this.params)

  // simulate manual update to categories
  cgm.params.network['row_nodes'].map(x => x['cat-0'] = new_cat)

  // generate an ordred labels list
  require('./../matrix_labels/gen_ordered_labels')(this.params);

}