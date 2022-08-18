var d3 = require("d3");
var extend = require("xtend/mutable");

module.exports = function calc_vd(regl, params) {
  var vd = {};

  var opts = opts || {};
  var options = extend(
    {
      element: opts.element || regl._gl.canvas,
    },
    opts || {}
  );
  var element = options.element;

  vd.canvas = {};
  _.each(["width", "height"], function (inst_dim) {
    vd.canvas[inst_dim] = Number.parseFloat(
      d3.select(element).style(inst_dim).replace("px", "")
    );
  });

  var label = {};
  label.x = "row";
  label.y = "col";
  var other_label = {};
  other_label.x = "col";
  other_label.y = "row";

  var dim = {};
  dim.x = "width";
  dim.y = "height";

  vd.mat = {};
  vd.heat = {};
  vd.heat_size = {};
  vd.center = {};
  vd.offcenter = {};
  vd.shift_camera = {};
  vd.mat_size = {};

  var inst_label;
  var inst_other_label;
  var inst_dim;
  var offset_heat = {};
  var offcenter_magnitude = 0.075;

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
    if (inst_axis == "x") {
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
};
