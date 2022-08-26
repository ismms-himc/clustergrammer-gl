import * as _ from "underscore";
import { mutateCatVizState } from "../../reducers/catVizSlice";
import checkIfValueCats from "./checkIfValueCats";

export default (function generate_cat_info(store) {
  const { network } = store.getState();
  const viz = {};
  const super_string = ": ";
  let tmp_super;
  let i_info;
  viz.show_categories = {};
  viz.all_cats = {};
  viz.cat_names = {};
  viz.cat_info = {};
  // this will hold the information for calculating the opacity of the value
  // function
  const ini_val_opacity = {};
  ini_val_opacity.row = null;
  ini_val_opacity.col = null;
  viz.cat_colors = {};
  viz.cat_colors.value_opacity = ini_val_opacity;
  // var num_colors = 0;
  _.each(["row", "col"], function (i_rc) {
    viz.show_categories[i_rc] = false;
    viz.all_cats[i_rc] = [];
    let tmp_keys = _.keys(network[i_rc + "_nodes"][0]);
    tmp_keys = tmp_keys.sort();
    _.each(tmp_keys, function (d) {
      if (d.indexOf("cat-") >= 0) {
        viz.show_categories[i_rc] = true;
        viz.all_cats[i_rc].push(d);
      }
    });
    viz.cat_info[i_rc] = null;
    viz.cat_colors[i_rc] = {};
    viz.cat_info[i_rc] = {};
    viz.cat_names[i_rc] = {};
    _.each(viz.all_cats[i_rc], function (cat_title) {
      const i_node = network[i_rc + "_nodes"][0];
      // look for title of category in category name
      if (typeof i_node[cat_title] === "string") {
        if (i_node[cat_title].indexOf(super_string) > 0) {
          tmp_super = i_node[cat_title].split(super_string)[0];
          viz.cat_names[i_rc][cat_title] = tmp_super;
        } else {
          viz.cat_names[i_rc][cat_title] = cat_title;
        }
      } else {
        viz.cat_names[i_rc][cat_title] = cat_title;
      }
      const cat_instances_titles = _.pluck(network[i_rc + "_nodes"], cat_title);
      const cat_instances = [];
      _.each(cat_instances_titles, function (i_cat) {
        let new_cat;
        if (i_cat.indexOf(": ") > 0) {
          new_cat = i_cat.split(": ")[1];
        } else {
          new_cat = i_cat;
        }
        cat_instances.push(new_cat);
      });
      const cat_states = _.uniq(cat_instances_titles).sort();
      // check whether all the categories are of value type
      i_info = checkIfValueCats(cat_states);
      // add histogram to i_info
      if (i_info.type === "cat_strings") {
        // remove titles from categories in hist
        const cat_hist = _.countBy(cat_instances);
        i_info.cat_hist = cat_hist;
      } else {
        i_info.cat_hist = null;
      }
      // pass info_info object
      viz.cat_info[i_rc][cat_title] = i_info;
      viz.cat_colors[i_rc][cat_title] = {};
    });
    viz.cat_colors[i_rc] = network.cat_colors[i_rc];
  });
  viz.cat_colors.opacity = 0.6;
  viz.cat_colors.active_opacity = 0.9;
  // switching to simpler global cat colors
  viz.global_cat_colors = {};
  const axes = ["row", "col"];
  axes.forEach((axis) => {
    Object.keys(viz.cat_colors[axis]).forEach((cat_index) => {
      Object.keys(viz.cat_colors[axis][cat_index]).forEach((cat_name) => {
        const inst_cat_color = viz.cat_colors[axis][cat_index][cat_name];
        if (cat_name.includes(": ")) {
          cat_name = cat_name.split(": ")[1];
        }
        viz.global_cat_colors[cat_name] = inst_cat_color;
      });
    });
  });

  store.dispatch(mutateCatVizState(viz));
});
