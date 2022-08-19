export default (function make_meta_string(params) {
  // metadata will only be a CSV
  const delimiter = ",";
  let meta_string = ",";
  const meta_type = params.download.meta_type;
  const nodes = params.network[meta_type + "_nodes"];
  let inst_name;
  // // write columns
  params.cat_data[meta_type].forEach((x, i) => {
    if (i < params.cat_data[meta_type].length - 1) {
      meta_string = meta_string + x.cat_title + delimiter;
    } else {
      meta_string = meta_string + x.cat_title;
    }
  });
  meta_string = meta_string + "\n";
  // write rows
  let inst_cat;
  nodes.forEach((node, node_index) => {
    inst_name = node.name;
    if (inst_name.includes(": ")) {
      inst_name = inst_name.split(": ")[1];
    }
    // add node name
    meta_string = meta_string + inst_name + delimiter;
    // add node categories
    params.cat_data[meta_type].forEach((tmp, i) => {
      inst_cat = node["cat-" + String(i)];
      if (inst_cat.includes(": ")) {
        inst_cat = inst_cat.split(": ")[1];
      }
      if (i < params.cat_data[meta_type].length - 1) {
        meta_string = meta_string + inst_cat + delimiter;
      } else {
        meta_string = meta_string + inst_cat;
      }
    });
    // move to new line
    meta_string = meta_string + "\n";
  });
  return meta_string;
});
