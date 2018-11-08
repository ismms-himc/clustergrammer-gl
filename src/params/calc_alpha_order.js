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

    _.map(inst_nodes, function(inst_node){

      var inst_alpha = node_names.length -  tmp_names.indexOf(inst_node.name) - 1;

      // save alpha order
      inst_node.alpha = inst_alpha;

      // initialize custom order as alpha order
      inst_node.custom = inst_alpha;

    });

  });

};