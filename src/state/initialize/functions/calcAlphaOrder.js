export default (function calcAlphaOrder(network) {
  // https://stackoverflow.com/questions/9592740/how-can-you-sort-an-array-without-mutating-the-original-array
  // function sort(arr) {
  //   return arr.concat().sort();
  // }
  // let node_names;
  // let tmp_names;
  // _.each(["row", "col"], function (inst_axis) {

  //   // tmp_names = sort(node_names);
  //   // TODO: remove, I don't think this actually does anything since it's just a map... did it do something before?
  //   // _.map(inst_nodes, function (inst_node) {
  //   //   const inst_alpha =
  //   //     node_names.length - tmp_names.indexOf(inst_node.name) - 1;
  //   //   // save alpha order
  //   //   inst_node.alpha = inst_alpha;
  //   //   // initialize custom order as alpha order
  //   //   inst_node.custom = inst_alpha;
  //   // });
  // });

  const getAxisNodeNames = (axis) => {
    network[axis + "_node_names"] = network[axis + "_nodes"].map((x) => {
      let inst_name = x.name;
      if (inst_name.includes(": ")) {
        inst_name = inst_name.split(": ")[1];
      }
      return inst_name;
    });
  };

  return {
    ...network,
    col_node_names: getAxisNodeNames("col"),
    row_node_names: getAxisNodeNames("row"),
  };
});
