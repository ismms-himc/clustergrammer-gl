import * as _ from "underscore";
import { mutateZoomData } from "../state/reducers/visualization/visualizationSlice";
import getMouseoverType from "./getMouseoverType";

export default function findMouseoverElement(state, dispatch, ev) {
  /*
  
      Need to improve behavior for categories and dendrogram. This info will be
      used to reorder on double click.
  
    */
  const viz_dim_heat = state.visualization.viz_dim.heat;
  const mouseover = state.interaction.mouseover;
  // reset mouseover params
  _.each(["row", "col"], function (inst_axis) {
    mouseover[inst_axis] = {};
    mouseover[inst_axis].name = null;
    mouseover[inst_axis].cats = [];
  });
  mouseover.value = null;
  let inst_cat_name;
  const dim_dict = {};
  dim_dict.x = "width";
  dim_dict.y = "height";
  const cursor_rel_min = {};
  const updatedZoomData = _.clone(state.zoom_data);
  _.each(["x", "y"], function (inst_axis) {
    // try updating mouseover position
    updatedZoomData[inst_axis].cursor_position = ev[inst_axis + "0"];
    // convert offcenter WebGl units to pixel units
    const offcenter =
      (state.visualization.viz_dim.canvas[dim_dict[inst_axis]] *
        state.visualization.viz_dim.offcenter[inst_axis]) /
      2;
    // calculate relative to min position before zooming
    cursor_rel_min[inst_axis] =
      state.visualization.zoom_data[inst_axis].cursor_position -
      viz_dim_heat[inst_axis].min -
      offcenter;
    // reflect zooming and panning in relative to min calculation
    cursor_rel_min[inst_axis] =
      cursor_rel_min[inst_axis] /
        state.visualization.zoom_data[inst_axis].total_zoom -
      state.visualization.zoom_data[inst_axis].total_pan_min;
    // transfer to zoom_data
    updatedZoomData[inst_axis].cursor_rel_min = cursor_rel_min[inst_axis];
  });
  // write zoom data changes
  dispatch(mutateZoomData(updatedZoomData));
  getMouseoverType(state);
  const axis_indices = {};
  if (state.tooltip.in_bounds_tooltip) {
    let axis_index;
    let inst_dims = [];
    if (state.tooltip.tooltip_type === "matrix-cell") {
      inst_dims = ["row", "col"];
    } else if (state.tooltip.tooltip_type.indexOf("row") >= 0) {
      inst_dims = ["row"];
    } else if (state.tooltip.tooltip_type.indexOf("col") >= 0) {
      inst_dims = ["col"];
      // shift found column label to reflect slanted column labels
      // /////////////////////////////////////////////////////////////
      // the shift is equal to the height above the column labels
      // however, this should be dimished based on how far zoomed out the user is
      // only shift if zooming is greater than 1% of total zoom available in x
      if (
        state.visualization.zoom_data.x.total_zoom /
          state.visualization.zoom_restrict.x.max >
        0.01
      ) {
        const y_heat_min = 126;
        const i_pix_y = state.visualization.zoom_data.y.cursor_position;
        const shift_col_label = y_heat_min - i_pix_y;
        if (shift_col_label > 0) {
          cursor_rel_min.x =
            cursor_rel_min.x -
            shift_col_label / state.visualization.zoom_data.x.total_zoom;
        }
      }
    }
    _.each(inst_dims, function (inst_axis) {
      if (inst_axis === "row") {
        axis_index = Math.floor(cursor_rel_min.y / state.tile_pix_height);
        axis_indices[inst_axis] =
          state.labels.ordered_labels[inst_axis + "_indices"][axis_index];
      } else {
        axis_index = Math.floor(cursor_rel_min.x / state.tile_pix_width);
        axis_indices[inst_axis] =
          state.labels.ordered_labels[inst_axis + "_indices"][axis_index];
      }
      mouseover[inst_axis].name =
        state.labels.ordered_labels[inst_axis + "s"][axis_index];
      if (typeof mouseover[inst_axis].name === "string") {
        if (mouseover[inst_axis].name.includes(": ")) {
          mouseover[inst_axis].name = mouseover[inst_axis].name.split(": ")[1];
        }
      }
      // reset cat names
      mouseover[inst_axis].cats = [];
      _.each(state.cat_data[inst_axis], function (d, cat_index) {
        inst_cat_name =
          state.labels.ordered_labels[inst_axis + "_cats-" + cat_index][
            axis_index
          ];
        mouseover[inst_axis].cats[cat_index] = inst_cat_name;
      });
    });
    if (state.tooltip.tooltip_type === "matrix-cell") {
      mouseover.value = state.network.mat[axis_indices.row][axis_indices.col];
      if ("mat_data_iz" in state) {
        mouseover.value_iz =
          state.mat_data_iz[axis_indices.row][axis_indices.col];
      }
    }
  }
  if (state.tooltip.tooltip_type.indexOf("dendro") >= 0) {
    if (state.tooltip.tooltip_type === "row-dendro") {
      _.each(state.dendro.group_info.row, function (i_group) {
        if (i_group.all_names.includes(mouseover.row.name)) {
          mouseover.row.dendro = i_group;
        }
      });
    }
    if (state.tooltip.tooltip_type === "col-dendro") {
      _.each(state.dendro.group_info.col, function (i_group) {
        if (i_group.all_names.includes(mouseover.col.name)) {
          mouseover.col.dendro = i_group;
        }
      });
    }
  }

  return mouseover;
}
