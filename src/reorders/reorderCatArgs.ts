import { Store } from "@reduxjs/toolkit";
import * as _ from "underscore";
import { CatArgsManager } from "../cats/manager/catArgsManager";
import { RootState } from "../state/store/store";

export default (function reorderCatArgs(
  store: Store<RootState>,
  catArgsManager: CatArgsManager
) {
  const state = store.getState();
  // can make more efficient by only checking which axis needs to be reordered
  _.each(["row", "col"], function (inst_axis) {
    // update cat position arrays
    for (
      let cat_index = 0;
      cat_index < state.cat_data.cat_num[inst_axis];
      cat_index++
    ) {
      catArgsManager.makeNewCatArrs(store, inst_axis, cat_index);
      // update the attribute
      catArgsManager.updateCatArgsAttribute(inst_axis, cat_index);
    }
  });
});
