var utils = require('./../utils/utils_clust');
module.exports = function calc_alpha_order(network){

  var node_names;
  var tmp_names;
  _.each(['row', 'col'], function(inst_axis){

    var inst_nodes = network[inst_axis + '_nodes'];
    node_names = utils.pluck(inst_nodes, 'name');

    network[inst_axis + '_node_names'] = node_names;

    tmp_names = node_names.sort();

    _.map(tmp_names, function(d, i){

      var inst_alpha = node_names.indexOf(d);

      network[inst_axis + '_nodes'][i].alpha = inst_alpha

    });

  })

  return network;
}