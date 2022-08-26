import * as _ from "underscore";

export default (function generateCatArray(store, inst_axis) {
  const { network } = store.getState();
  const title_sep = ": ";
  const cat_data = [];
  const check_node = network[inst_axis + "_nodes"][0];
  const node_keys = _.keys(check_node);
  const current_cats = {};
  let tmp_cat;
  let tmp_title;
  let cat_index;
  _.each(node_keys, function (inst_prop) {
    if (inst_prop.indexOf("cat-") >= 0) {
      // generate titles from cat info
      tmp_cat = check_node[inst_prop];
      cat_index = parseInt(inst_prop.split("cat-")[1], 10);
      // use given title
      if (tmp_cat.indexOf(title_sep) >= 0) {
        tmp_title = tmp_cat.split(title_sep)[0];
      } else {
        tmp_title = inst_prop;
      }
      current_cats[cat_index] = tmp_title;
    }
  });
  const all_index = _.keys(current_cats).sort();
  let inst_data;
  _.each(all_index, function (inst_index) {
    inst_data = {};
    inst_data.cat_title = current_cats[inst_index];
    inst_data.cats = [];
    cat_data.push(inst_data);
  });
  return cat_data;
});
