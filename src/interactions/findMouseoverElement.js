import { cloneDeep } from "lodash";
import * as _ from "underscore";
import calcCatClusterBreakdown from "../cats/functions/calcCatClusterBreakdown";
import { setMouseoverInteraction } from "../state/reducers/interaction/interactionSlice";
import { mutateTooltipState } from "../state/reducers/tooltip/tooltipSlice";
import { mutateZoomData } from "../state/reducers/visualization/visualizationSlice";
import getMouseoverType from "./getMouseoverType";

export default function findMouseoverElement(store, ev) {
  const dispatch = store.dispatch;

  /*
  
      Need to improve behavior for categories and dendrogram. This info will be
      used to reorder on double click.
  
    */
  // reset mouseover params
  const mouseover = {
    row: {
      name: null,
      cats: [],
    },
    col: {
      name: null,
      cats: [],
    },
    value: null,
  };
  let inst_cat_name;
  const dim_dict = {};
  dim_dict.x = "width";
  dim_dict.y = "height";
  const cursor_rel_min = {};
  // https://bobbyhadz.com/blog/javascript-cannot-assign-to-read-only-property-of-object
  const updatedZoomData = cloneDeep(store.getState().visualization.zoom_data);
  _.each(["x", "y"], function (inst_axis) {
    const currentVizDim = store.getState().visualization.viz_dim;
    // try updating mouseover position
    updatedZoomData[inst_axis].cursor_position = ev[inst_axis + "0"];
    // convert offcenter WebGl units to pixel units
    const offcenter =
      (currentVizDim.canvas[dim_dict[inst_axis]] *
        currentVizDim.offcenter[inst_axis]) /
      2;
    // calculate relative to min position before zooming
    cursor_rel_min[inst_axis] =
      updatedZoomData[inst_axis].cursor_position -
      currentVizDim.heat[inst_axis].min -
      offcenter;
    // reflect zooming and panning in relative to min calculation
    cursor_rel_min[inst_axis] =
      cursor_rel_min[inst_axis] / updatedZoomData[inst_axis].total_zoom -
      updatedZoomData[inst_axis].total_pan_min;
    // transfer to zoom_data
    updatedZoomData[inst_axis].cursor_rel_min = cursor_rel_min[inst_axis];
  });
  // write zoom data changes
  dispatch(mutateZoomData(updatedZoomData));
  getMouseoverType(store);
  const {
    tooltip: { tooltip_type, in_bounds_tooltip },
  } = store.getState();
  const axis_indices = {};
  if (in_bounds_tooltip) {
    let axis_index;
    let inst_dims = [];
    if (tooltip_type === "matrix-cell") {
      inst_dims = ["row", "col"];
    } else if (tooltip_type.indexOf("row") >= 0) {
      inst_dims = ["row"];
    } else if (tooltip_type.indexOf("col") >= 0) {
      inst_dims = ["col"];
      const newVizData = store.getState().visualization;
      // shift found column label to reflect slanted column labels
      // /////////////////////////////////////////////////////////////
      // the shift is equal to the height above the column labels
      // however, this should be dimished based on how far zoomed out the user is
      // only shift if zooming is greater than 1% of total zoom available in x
      if (
        newVizData.zoom_data.x.total_zoom / newVizData.zoom_restrict.x.max >
        0.01
      ) {
        const y_heat_min = 126;
        const i_pix_y = newVizData.zoom_data.y.cursor_position;
        const shift_col_label = y_heat_min - i_pix_y;
        if (shift_col_label > 0) {
          cursor_rel_min.x =
            cursor_rel_min.x -
            shift_col_label / newVizData.zoom_data.x.total_zoom;
        }
      }
    }
    _.each(inst_dims, function (inst_axis) {
      const {
        visualization: { tile_pix_height, tile_pix_width },
        labels,
        cat_data,
      } = store.getState();
      if (inst_axis === "row") {
        axis_index = Math.floor(cursor_rel_min.y / tile_pix_height);
        axis_indices[inst_axis] =
          labels.ordered_labels[inst_axis + "_indices"][axis_index];
      } else {
        axis_index = Math.floor(cursor_rel_min.x / tile_pix_width);
        axis_indices[inst_axis] =
          labels.ordered_labels[inst_axis + "_indices"][axis_index];
      }
      mouseover[inst_axis].name =
        labels.ordered_labels[inst_axis + "s"][axis_index];
      if (typeof mouseover[inst_axis].name === "string") {
        if (mouseover[inst_axis].name.includes(": ")) {
          mouseover[inst_axis].name = mouseover[inst_axis].name.split(": ")[1];
        }
      }
      // reset cat names
      mouseover[inst_axis].cats = [];
      _.each(cat_data[inst_axis], function (d, cat_index) {
        inst_cat_name =
          labels.ordered_labels[inst_axis + "_cats-" + cat_index][axis_index];
        mouseover[inst_axis].cats[cat_index] = inst_cat_name;
      });
    });
    if (tooltip_type === "matrix-cell") {
      mouseover.value =
        store.getState().network.mat?.[axis_indices.row]?.[axis_indices.col] ||
        NaN;
    }
  }
  const { dendro } = store.getState();
  if (tooltip_type.indexOf("dendro") >= 0) {
    if (tooltip_type === "row-dendro") {
      _.each(dendro.group_info.row, function (i_group) {
        if (i_group.all_names.includes(mouseover.row.name)) {
          mouseover.row.dendro = i_group;
        }
      });
    }
    if (tooltip_type === "col-dendro") {
      _.each(dendro.group_info.col, function (i_group) {
        if (i_group.all_names.includes(mouseover.col.name)) {
          mouseover.col.dendro = i_group;
        }
      });
    }
  }

  // tooltip text for matrix cell only
  setTooltipText(store, mouseover);

  dispatch(setMouseoverInteraction(mouseover));
}

function setTooltipText(store, mouseover) {
  const {
    tooltip: { tooltip_type },
  } = store.getState();
  let tooltip_text = "";
  if (tooltip_type === "matrix-cell") {
    tooltip_text = `Row: ${mouseover.row.name}\nCol: ${
      mouseover.col.name
    }\nValue: ${mouseover.value?.toFixed(3) || "NaN"}${
      mouseover.value_iz
        ? `Original value: ${mouseover.value_iz.toFixed(3)}`
        : ""
    }`;
  } else if (tooltip_type === "row-label") {
    tooltip_text = mouseover.row.name;
  } else if (tooltip_type === "col-label") {
    tooltip_text = mouseover.col.name;
    // TODO: fix dendro tooltips
  } else if (tooltip_type === "col-dendro") {
    // tooltip_text = JSON.stringify(mouseover.col.dendro);
    const { selected_clust_names } = calcCatClusterBreakdown(
      store,
      mouseover.col.dendro,
      "col"
    );
    tooltip_text = selected_clust_names;
  } else if (tooltip_type === "row-dendro") {
    tooltip_text = JSON.stringify(mouseover.row.dendro);
  } else if (tooltip_type.indexOf("-cat-") > 0) {
    // Category Tooltip
    // ///////////////////
    const inst_axis = tooltip_type.split("-")[0];
    const inst_index = tooltip_type.split("-")[2];
    tooltip_text = mouseover[inst_axis].cats[inst_index];
  }
  store.dispatch(mutateTooltipState({ text: tooltip_text }));
}
