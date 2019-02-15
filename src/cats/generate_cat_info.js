module.exports = function generate_cat_info(params){

  var viz = {}
  var super_string = ': ';
  var tmp_super;
  var i_info;

  viz.show_categories = {};
  viz.all_cats = {};
  viz.cat_names = {};
  viz.cat_info = {};

  viz.cat_bar_width = 180;
  viz.cat_bar_height = 20;

  // this will hold the information for calculating the opacity of the value
  // function
  var ini_val_opacity = {};
  ini_val_opacity.row = null;
  ini_val_opacity.col = null;

  viz.cat_colors = {};
  viz.cat_colors.value_opacity = ini_val_opacity;

  // var num_colors = 0;
  _.each(['row', 'col'], function(i_rc){

    viz.show_categories[i_rc] = false;

    viz.all_cats[i_rc] = [];
    var tmp_keys = _.keys(params.network[i_rc+'_nodes'][0]);

    tmp_keys = tmp_keys.sort();

    _.each( tmp_keys, function(d){
      if (d.indexOf('cat-') >= 0){
        viz.show_categories[i_rc] = true;
        viz.all_cats[i_rc].push(d);
      }
    });

    viz.cat_info[i_rc] = null;
    viz.cat_colors[i_rc] = {};
    viz.cat_info[i_rc] = {};
    viz.cat_names[i_rc] = {};

    _.each( viz.all_cats[i_rc], function(cat_title){

      var i_node = params.network[i_rc+'_nodes'][0];

      // look for title of category in category name
      if (typeof i_node[cat_title] === 'string' ){

        if (i_node[cat_title].indexOf(super_string) > 0){
          tmp_super = i_node[cat_title].split(super_string)[0];
          viz.cat_names[i_rc][cat_title] = tmp_super;
        } else {
          viz.cat_names[i_rc][cat_title] = cat_title;
        }

      } else {
        viz.cat_names[i_rc][cat_title] = cat_title;
      }

      var cat_instances_titles = _.pluck(params.network[i_rc+'_nodes'], cat_title);
      var cat_instances = [];

      _.each(cat_instances_titles, function(i_cat){

        var new_cat;
        if (i_cat.indexOf(': ') >0){
          new_cat = i_cat.split(': ')[1];
        } else {
          new_cat = i_cat;
        }

        cat_instances.push(new_cat);
      });

      var cat_states = _.uniq( cat_instances_titles ).sort();

      // check whether all the categories are of value type
      i_info = require('./check_if_value_cats')(cat_states);

      // add histogram to i_info
      if (i_info.type === 'cat_strings'){
        // remove titles from categories in hist
        var cat_hist = _.countBy(cat_instances);
        i_info.cat_hist = cat_hist;
      } else {
        i_info.cat_hist = null;
      }

      // pass info_info object
      viz.cat_info[i_rc][cat_title] = i_info;
      viz.cat_colors[i_rc][cat_title] = {};

    });

      viz.cat_colors[i_rc] = params.network.cat_colors[i_rc];
  });

  viz.cat_colors.opacity = 0.6;
  viz.cat_colors.active_opacity = 0.9;

  params.viz = viz;

}