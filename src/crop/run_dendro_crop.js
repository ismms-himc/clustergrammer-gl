var core = require('mathjs/core');
var math = core.create();
math.import(require('mathjs/lib/type/matrix'));
math.import(require('mathjs/lib/function/matrix/zeros'));

module.exports = function run_dendro_crop(params, inst_data){
  console.log('run dendro crop')


      var selected_clust_names = params.dendro.selected_clust_names;
      var all_nodes = params.network.row_node_names;

      var found_index;
      var found_nodes = [];
      _.each(selected_clust_names, function(d){
        found_index = all_nodes.indexOf(d);
        found_node = cgm.params.network.row_nodes[found_index]
        found_nodes.push(found_node);
      });
      console.log(found_nodes.length);
};