import { select } from "d3-selection";
import * as _ from "underscore";
import { setVisualizationDimensions } from "../../reducers/visualization/visualizationSlice";
import { store } from "../../store/store";

export default (function calcVizDim(regl, state) {
  const { labels, cat_data } = state;
  const viz_dim = {};
  const options = {
    element: regl._gl.canvas,
  };
  const element = options.element;
  viz_dim.canvas = {};
  _.each(["width", "height"], function (inst_dim) {
    viz_dim.canvas[inst_dim] = Number.parseFloat(
      select(element).style(inst_dim).replace("px", "")
    );
  });
  const label = {};
  label.x = "row";
  label.y = "col";
  const other_label = {};
  other_label.x = "col";
  other_label.y = "row";
  const dim = {};
  dim.x = "width";
  dim.y = "height";
  viz_dim.mat = {};
  viz_dim.heat = {};
  viz_dim.heat_size = {};
  viz_dim.center = {};
  viz_dim.offcenter = {};
  viz_dim.shift_camera = {};
  viz_dim.mat_size = {};
  let inst_label;
  let inst_other_label;
  let inst_dim;
  const offset_heat = {};
  const offcenter_magnitude = 0.075;
  _.each(["x", "y"], function (inst_axis) {
    inst_label = label[inst_axis];
    inst_other_label = other_label[inst_axis];
    inst_dim = dim[inst_axis];
    viz_dim.mat_size[inst_axis] = 0.8;
    viz_dim.heat_size[inst_axis] =
      viz_dim.mat_size[inst_axis] -
      cat_data.cat_room[inst_axis] * cat_data.cat_num[inst_label];
    // square matrix size set by width of canvas
    viz_dim.mat[inst_dim] =
      viz_dim.mat_size[inst_axis] * viz_dim.canvas[inst_dim];
    // min and max position of matrix
    viz_dim.mat[inst_axis] = {};
    viz_dim.mat[inst_axis].min =
      viz_dim.canvas[inst_dim] / 2 - viz_dim.mat[inst_dim] / 2;
    viz_dim.mat[inst_axis].max =
      viz_dim.canvas[inst_dim] / 2 + viz_dim.mat[inst_dim] / 2;
    viz_dim.heat[inst_dim] =
      viz_dim.heat_size[inst_axis] * viz_dim.canvas[inst_dim];
    offset_heat[inst_axis] =
      (viz_dim.mat[inst_dim] - viz_dim.heat[inst_dim]) / 2;
    viz_dim.heat[inst_axis] = {};
    viz_dim.heat[inst_axis].min =
      viz_dim.canvas[inst_dim] / 2 -
      viz_dim.heat[inst_dim] / 2 +
      offset_heat[inst_axis];
    // need to figure out if this is necessary
    if (inst_axis === "x") {
      viz_dim.heat[inst_axis].max =
        viz_dim.canvas[inst_dim] / 2 + viz_dim.heat[inst_dim] / 2; //  + offset_heat.x;
    } else {
      viz_dim.heat[inst_axis].max =
        viz_dim.canvas[inst_dim] / 2 +
        viz_dim.heat[inst_dim] / 2 +
        offset_heat.x;
    }
    viz_dim.center[inst_axis] = 0.5;
    viz_dim["tile_" + inst_dim] =
      viz_dim.heat_size[inst_axis] / 0.5 / labels["num_" + inst_other_label];
    viz_dim.offcenter[inst_axis] = offcenter_magnitude;
    if (inst_axis === "x") {
      viz_dim.shift_camera[inst_axis] = -offcenter_magnitude;
    } else {
      viz_dim.shift_camera[inst_axis] = offcenter_magnitude;
    }
  });

  store.dispatch(setVisualizationDimensions(viz_dim));
});
