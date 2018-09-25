var utils = require('./../utils/utils_clust');
module.exports = function calc_alpha_order(params){

  var network = params.network

  var node_names;
  var tmp_names;
  _.each(['row', 'col'], function(inst_axis){

    var inst_nodes = network[inst_axis + '_nodes'];
    node_names = utils.pluck(inst_nodes, 'name');

    network[inst_axis + '_node_names'] = node_names;

    tmp_names = node_names.sort();

    // console.log(tmp_names)
    // console.log('node names\n------------')
    // console.log(node_names);
    // console.log('tmp names\n------------')
    // console.log(tmp_names);

    _.map(inst_nodes, function(inst_node){

      var inst_alpha = node_names.length -  tmp_names.indexOf(inst_node.name) - 1;

      inst_node.alpha = inst_alpha

    });

  });

  // return network;
}