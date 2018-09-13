module.exports = function generate_cat_data(params, inst_axis){

  var title_sep = ': ';
  current_cats = {};

  var cat_data = [];
  var check_node = params.network[ inst_axis + '_nodes'][0];
  var node_keys = _.keys(check_node);
  var current_cats = {};
  var tmp_cat;
  var tmp_title;
  var cat_index;
  _.each(node_keys, function(inst_prop){

    if (inst_prop.indexOf('cat-') >= 0){

      // generate titles from cat info
      tmp_cat = check_node[inst_prop];

      cat_index = parseInt(inst_prop.split('cat-')[1], 10);

      // use given title
      if (tmp_cat.indexOf(title_sep) >=0){
        tmp_title = tmp_cat.split(title_sep)[0];
      } else {
        tmp_title = inst_prop;
      }

      // current_cats.push(tmp_title);

      current_cats[cat_index] = tmp_title;
    }

  });

  var all_index = _.keys(current_cats).sort();

  var inst_data;
  _.each(all_index, function(inst_index){

    inst_data = {};
    inst_data.cat_title = current_cats[inst_index];
    inst_data.cats = [];

    cat_data.push(inst_data);
  });


  return cat_data;

};