export default (function calc_alpha_order(params) {
  var network = params.network;
  // https://stackoverflow.com/questions/9592740/how-can-you-sort-an-array-without-mutating-the-original-array
  function sort(arr) {
    return arr.concat().sort();
  }
  var node_names;
  var tmp_names;
  _.each(["row", "col"], function (inst_axis) {
    var inst_nodes = network[inst_axis + "_nodes"];
    node_names = inst_nodes.map((x) => {
      let inst_name = x.name;
      if (inst_name.includes(": ")) {
        inst_name = inst_name.split(": ")[1];
      }
      return inst_name;
    });
    network[inst_axis + "_node_names"] = node_names;
    tmp_names = sort(node_names);
    _.map(inst_nodes, function (inst_node) {
      var inst_alpha =
        node_names.length - tmp_names.indexOf(inst_node.name) - 1;
      // save alpha order
      inst_node.alpha = inst_alpha;
      // initialize custom order as alpha order
      inst_node.custom = inst_alpha;
    });
  });
});
