import * as _ from "underscore";
import makeCatArgs from "./makeCatArgs";
import makeCatPositionArray from "./makeCatPositionArray";

export default function generate_cat_args_arrs(regl, store) {
  const { cat_data } = store.getState();
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
        cat_arrs[inst_state][inst_axis][cat_index] = makeCatPositionArray(
          store,
          inst_axis
        );
      });
      cat_args[inst_axis][cat_index] = makeCatArgs(
        regl,
        store,
        cat_arrs,
        inst_axis,
        cat_index
      );
    }
  });
  return { cat_args, cat_arrs };
}
