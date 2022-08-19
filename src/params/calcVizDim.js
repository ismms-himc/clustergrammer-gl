import * as d3 from "d3";
import * as _ from "underscore";

export default (function calc_vd(regl, params) {
  const vd = {};
  const options = {
    element: regl._gl.canvas,
  };
  const element = options.element;
  vd.canvas = {};
  _.each(["width", "height"], function (inst_dim) {
    vd.canvas[inst_dim] = Number.parseFloat(
      d3.select(element).style(inst_dim).replace("px", "")
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
  vd.mat = {};
  vd.heat = {};
  vd.heat_size = {};
  vd.center = {};
  vd.offcenter = {};
  vd.shift_camera = {};
  vd.mat_size = {};
  let inst_label;
  let inst_other_label;
  let inst_dim;
  const offset_heat = {};
  const offcenter_magnitude = 0.075;
  _.each(["x", "y"], function (inst_axis) {
    inst_label = label[inst_axis];
    inst_other_label = other_label[inst_axis];
    inst_dim = dim[inst_axis];
    vd.mat_size[inst_axis] = 0.8;
    vd.heat_size[inst_axis] =
      vd.mat_size[inst_axis] -
      params.cat_data.cat_room[inst_axis] * params.cat_data.cat_num[inst_label];
    // square matrix size set by width of canvas
    vd.mat[inst_dim] = vd.mat_size[inst_axis] * vd.canvas[inst_dim];
    // min and max position of matrix
    vd.mat[inst_axis] = {};
    vd.mat[inst_axis].min = vd.canvas[inst_dim] / 2 - vd.mat[inst_dim] / 2;
    vd.mat[inst_axis].max = vd.canvas[inst_dim] / 2 + vd.mat[inst_dim] / 2;
    vd.heat[inst_dim] = vd.heat_size[inst_axis] * vd.canvas[inst_dim];
    offset_heat[inst_axis] = (vd.mat[inst_dim] - vd.heat[inst_dim]) / 2;
    vd.heat[inst_axis] = {};
    vd.heat[inst_axis].min =
      vd.canvas[inst_dim] / 2 - vd.heat[inst_dim] / 2 + offset_heat[inst_axis];
    // need to figure out if this is necessary
    if (inst_axis === "x") {
      vd.heat[inst_axis].max = vd.canvas[inst_dim] / 2 + vd.heat[inst_dim] / 2; //  + offset_heat.x;
    } else {
      vd.heat[inst_axis].max =
        vd.canvas[inst_dim] / 2 + vd.heat[inst_dim] / 2 + offset_heat.x;
    }
    vd.center[inst_axis] = 0.5;
    vd["tile_" + inst_dim] =
      vd.heat_size[inst_axis] / 0.5 / params.labels["num_" + inst_other_label];
    vd.offcenter[inst_axis] = offcenter_magnitude;
    if (inst_axis === "x") {
      vd.shift_camera[inst_axis] = -offcenter_magnitude;
    } else {
      vd.shift_camera[inst_axis] = offcenter_magnitude;
    }
  });
  params.viz_dim = vd;
});
