import draw_webgl_layers from "../draws/drawWebglLayers";
import genOrderedLabels from "../matrixLabels/genOrderedLabels";
import generateCatArgsArrs from "../params/generateCatArgsArrs";

export default function manual_update_to_cats(
  regl,
  params,
  axis,
  cat_title,
  new_cat,
  selected_labels
) {
  const full_cat = cat_title + ": " + new_cat;
  // manually updated categories in network
  params.network[axis + "_nodes"].map((x) => {
    let inst_name = x.name;
    if (inst_name.includes(": ")) {
      inst_name = inst_name.split(": ")[1];
    }
    if (selected_labels.includes(inst_name)) {
      x["cat-0"] = full_cat;
    }
  });
  // update manual_cat_dict (will be synced to widget back-end)
  selected_labels.forEach((inst_label) => {
    params.cat_data.manual_cat_dict[axis][cat_title][inst_label] = new_cat;
  });
  // params.cat_data.manual_cat_dict[axis]
  // generate an ordred labels list
  genOrderedLabels(params);
  generateCatArgsArrs(regl, params);
  if (params.is_widget === false) {
    draw_webgl_layers(regl, params);
  }
}
