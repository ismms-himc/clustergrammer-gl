import draw_webgl_layers from "../draws/drawWebglLayers";
import genOrderedLabels from "../matrixLabels/genOrderedLabels";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";

export default function manual_update_to_cats(
  regl,
  state,
  dispatch,
  catArgsManager,
  cameras,
  axis,
  cat_title,
  new_cat,
  selected_labels
) {
  const full_cat = cat_title + ": " + new_cat;
  // manually updated categories in network
  const network = {};
  network[axis + "_nodes"].map((x) => {
    let inst_name = x.name;
    if (inst_name.includes(": ")) {
      inst_name = inst_name.split(": ")[1];
    }
    if (selected_labels.includes(inst_name)) {
      x["cat-0"] = full_cat;
    }
  });
  // generate an ordered labels list
  const ordered_labels = genOrderedLabels(state);
  dispatch(mutateLabelsState({ ordered_labels }));
  catArgsManager.regenerateCatArgsArrs(state);
  draw_webgl_layers(regl, state, catArgsManager, cameras);
}
