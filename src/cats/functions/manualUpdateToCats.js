import draw_webgl_layers from "../../draws/drawWebglLayers";
import genOrderedLabels from "../../matrixLabels/genOrderedLabels";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice";

export default function manualUpdateToCats(
  regl,
  store,
  catArgsManager,
  camerasManager,
  axis,
  cat_title,
  new_cat,
  selected_labels
) {
  const dispatch = store.dispatch;
  // const full_cat = cat_title + ": " + new_cat;
  // manually updated categories in network
  // TODO: I don't think this ever did anything since we were mapping and not assigning
  // const network = {};
  // network[axis + "_nodes"].map((x) => {
  //   let inst_name = x.name;
  //   if (inst_name.includes(": ")) {
  //     inst_name = inst_name.split(": ")[1];
  //   }
  //   if (selected_labels.includes(inst_name)) {
  //     x["cat-0"] = full_cat;
  //   }
  // });
  // generate an ordered labels list
  const ordered_labels = genOrderedLabels(store);
  dispatch(mutateLabelsState({ ordered_labels }));
  catArgsManager.regenerateCatArgsArrs(store);
  draw_webgl_layers(regl, store, catArgsManager, camerasManager);
}
