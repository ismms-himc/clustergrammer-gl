import * as _ from "underscore";
import make_cat_args from "./makeCatArgs";
import make_cat_position_array from "./makeCatPositionArray";

export default function generate_cat_args_arrs(regl, state) {
  const {
    network,
    cat_data,
    order,
    labels,
    visualization: { viz_dim },
    tooltip,
    interaction,
    cat_viz,
  } = state;
  const cat_args = {};
  cat_args.row = [];
  cat_args.col = [];
  const cat_arrs = {};
  _.each(["inst", "new"], function (inst_state) {
    cat_arrs[inst_state] = {};
    cat_arrs[inst_state].row = {};
    cat_arrs[inst_state].col = {};
  });
  _.each(["row", "col"], function (inst_axis) {
    for (
      let cat_index = 0;
      cat_index < cat_data.cat_num[inst_axis];
      cat_index++
    ) {
      _.each(["inst", "new"], function (inst_state) {
        cat_arrs[inst_state][inst_axis][cat_index] = make_cat_position_array(
          state,
          inst_axis,
          order[inst_state][inst_axis]
        );
      });
      cat_args[inst_axis][cat_index] = make_cat_args(
        regl,
        labels,
        viz_dim,
        tooltip,
        interaction,
        cat_viz,
        network,
        cat_arrs,
        inst_axis,
        cat_index
      );
    }
  });
  return { cat_args, cat_arrs };
}
