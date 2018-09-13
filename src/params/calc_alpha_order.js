var utils = require('./../utils/utils_clust');
module.exports = function calc_alpha_order(network){

  // add alphabetical ordering to network nodes
  console.log('Adding alphabetical ordering\n-----------------------------------')

  // network_data.row_nodes_names = utils.pluck(config.network_data.row_nodes, 'name');

  var node_names;
  var tmp_names;
  _.each(['row', 'col'], function(inst_axis){

    // console.log(inst_axis)

    inst_nodes = network[inst_axis + '_nodes'];
    // console.log(inst_nodes)
    node_names = utils.pluck(inst_nodes, 'name');

    network[inst_axis + '_node_names'] = node_names;

    tmp_names = node_names.sort();

    // console.log(tmp_names)

    var alpha_index = _.map(tmp_names, function(d, i){

      var inst_alpha = node_names.indexOf(d);

      network[inst_axis + '_nodes'][i].alpha = inst_alpha

      // console.log(d, inst_alpha)
      // return node_names.indexOf(d);
    });


    // console.log(alpha_index)

  })

  return network;
}