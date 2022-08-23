export default (function make_full_name(params, inst_node, inst_rc) {
  let cat_name;
  let inst_name = inst_node.name;
  const num_cats = params.cat_viz.all_cats[inst_rc].length;
  // make tuple if necessary
  if (num_cats > 0) {
    inst_name = "('" + inst_name + "'";
    for (let cat_index = 0; cat_index < num_cats; cat_index++) {
      cat_name = "cat-" + String(cat_index);
      inst_name = inst_name + ", '" + String(inst_node[cat_name]) + "'";
    }
    inst_name = inst_name + ")";
  } else {
    // always make names strings
    inst_name = String(inst_name);
  }
  return inst_name;
});
