export default (function calcAlphaOrder(network) {
  // https://stackoverflow.com/questions/9592740/how-can-you-sort-an-array-without-mutating-the-original-array
  function sort(arr) {
    return arr.concat().sort();
  }

  const updateNodesAndNodeNames = (axis) => {
    const inst_nodes = network[axis + "_nodes"];
    const node_names = inst_nodes.map((x) => {
      let inst_name = x.name;

      if (inst_name.includes(": ")) {
        inst_name = inst_name.split(": ")[1];
      }
      return inst_name;
    });
    const nodes = inst_nodes.map((inst_node) => {
      const tmp_names = sort(node_names);
      const inst_alpha =
        node_names.length - tmp_names.indexOf(inst_node.name) - 1;
      // save alpha order
      inst_node.alpha = inst_alpha;
      // initialize custom order as alpha order
      inst_node.custom = inst_alpha;
      return inst_node;
    });
    return { [`${axis}_node_names`]: node_names, [`${axis}_nodes`]: nodes };
  };

  return {
    ...network,
    ...updateNodesAndNodeNames("row"),
    ...updateNodesAndNodeNames("col"),
  };
});
