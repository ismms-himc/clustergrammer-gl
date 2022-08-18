var core = require("mathjs/core");
var math = core.create();
math.import(require("mathjs/lib/type/matrix"));
math.import(require("mathjs/lib/function/matrix/zeros"));

module.exports = function run_dendro_crop(params, inst_data) {
  // console.log('run dendro crop')

  var selected_clust_names = params.dendro.selected_clust_names;
  var ini_all_names = params.network.row_node_names;
  var super_string = ": ";

  var all_names = [];
  if (ini_all_names[0].indexOf(super_string) > 0) {
    _.each(ini_all_names, function (d) {
      all_names.push(d.split(": ")[1]);
    });
  } else {
    all_names = ini_all_names;
  }

  // console.log(selected_clust_names)
  // console.log(all_names)

  var found_index;
  var found_nodes = [];
  var found_node;
  _.each(selected_clust_names, function (d) {
    found_index = all_names.indexOf(d);
    // console.log(found_index)
    found_node = params.network.row_nodes[found_index];
    found_nodes.push(found_node);
  });

  // console.log(found_nodes);
};
