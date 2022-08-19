var d3 = require("d3");
var hzome_functions = require("./../tooltip/hzomeFunctions");
var make_matrix_args = require("./../matrixCells/makeMatrixArgs");
var color_to_rgba = require("./../colors/colorToRgba");

module.exports = function initialize_params(external_model) {
  var cgm = this;
  var args = this.args;
  var canvas_container = this.canvas_container;
  var regl = this.regl;
  var network = this.network;

  // fix initial ordering indexing (will fix in Python on nex release)
  ["row", "col"].forEach((axis) => {
    this.network[axis + "_nodes"].forEach((x) => (x.ini = x.ini - 1));
  });

  cgm.params = {};
  let params = cgm.params;
  params.network = network;

  params.use_hzome = false;

  if ("use_hzome" in cgm.args) {
    params.use_hzome = cgm.args.use_hzome;
  }
  params.norm = {};

  if ("pre_zscore" in params.network) {
    params.norm.initial_status = "zscored";
    params.norm.zscore_status = "zscored";
  } else {
    params.norm.initial_status = "non-zscored";
    params.norm.zscore_status = "non-zscored";
  }

  require("./genAniPar")(params);
  require("./calcAlphaOrder")(params);
  require("./genIntPar")(params);
  require("./genCatPar")(params);
  params.mat_data = params.network.mat;
  require("./generateOrderParams")(params);
  require("./genLabelPar")(cgm);
  var labels = params.labels;

  require("./generateTooltipParams")(regl, params);

  require("./calcVizDim")(regl, params);
  require("./generateCatArgsArrs")(regl, params);
  params.zoom_data = require("./../zoom/iniZoomData")();
  params.canvas_pos = require("./calcRowAndColCanvasPositions")(params);
  params.is_downsampled = false;
  params.viz_aid_tri_args = {};

  _.each(["row", "col"], function (inst_axis) {
    require("./../matrixLabels/calcTextOffsets")(params, inst_axis);
  });

  params.tile_pix_width = params.viz_dim.heat.width / labels.num_col;
  params.tile_pix_height = params.viz_dim.heat.height / labels.num_row;

  require("./genPixToWebgl")(params);
  require("./generateWebglToPix")(params);
  require("./../matrixLabels/makeLabelQueue")(params);
  require("./genTextZoomPar")(params);
  require("./calcVizArea")(params);
  require("./generateTextTriangleParams")(params);

  params.matrix = {};
  params.matrix.distance_metric = "cosine";
  params.matrix.linkage_type = "average";

  params.matrix.opacity_scale = 1.0;

  // initialize control panel in reorder mode
  params.viz.current_panel = "reorder";

  params.matrix.potential_recluster = {};
  params.matrix.potential_recluster.distance_metric =
    params.matrix.distance_metric;
  params.matrix.potential_recluster.linkage_type = params.matrix.linkage_type;

  var min_dim;
  if (labels.num_col < labels.num_row) {
    min_dim = labels.num_col;
  } else {
    min_dim = labels.num_row;
  }

  params.max_zoom = min_dim / 4.0;
  params.zoom_restrict = require("./../zoom/iniZoomRestrict")(params);

  cgm.zoom_rules_high_mat(regl, params, external_model);

  require("./../cameras/makeCameras")(regl, params);

  require("./../params/calcMatArr")(params);

  // matrix color paramters
  let mat_colors = {};

  if ("matrix_colors" in params.network) {
    let pos_color = params.network.matrix_colors.pos;
    let neg_color = params.network.matrix_colors.neg;

    mat_colors.pos_rgb = color_to_rgba(pos_color).slice(0, 3);
    mat_colors.neg_rgb = color_to_rgba(neg_color).slice(0, 3);
  } else {
    mat_colors.pos_rgb = [1, 0, 0];
    mat_colors.neg_rgb = [0, 0, 1];
  }

  params.viz.mat_colors = mat_colors;

  // attach to cgm so it can be run without passing arguments
  cgm.make_matrix_args = make_matrix_args;
  cgm.make_matrix_args();

  require("./genDendroPar")(cgm);
  require("./generateSpilloverParams")(regl, params);

  var allow_factor = d3.scaleLinear().domain([10, 1000]).range([2, 30]);

  params.allow_zoom = {};
  params.allow_zoom.col = allow_factor(labels.num_col);
  params.allow_zoom.row = allow_factor(labels.num_col);
  params.text_scale = {};

  params.hzome = hzome_functions(params);

  params.root = "#" + args.container.id;
  params.canvas_root = params.root + " .canvas-container";
  params.base_container = args.container;
  params.canvas_container = canvas_container;

  params.is_widget = false;
  if (external_model !== null) {
    params.is_widget = true;
    // used to improve widget linking behavior
    // when positive, prevents excessive re-drawing
    params.self_update = false;
  } else {
    // params.widget_model = null;
  }

  let axes = ["col", "row"];
  manual_category = {};

  if ("manual_category" in params.network) {
    // copy from network to cat data

    axes.forEach((axis) => {
      if (axis in params.network.manual_category) {
        manual_category[axis] = params.network.manual_category[axis];

        // make list of cats
        if (axis + "_cats" in params.network.manual_category) {
          manual_category[axis + "_cats"] =
            params.network.manual_category[axis + "_cats"];
        }

        if (axis + "_cats" in params.network.manual_category) {
          color_dict = {};
          if ("color" in params.network.manual_category[axis + "_cats"][0]) {
            manual_category[axis + "_cats"].map(
              (x) => (color_dict[x.name] = x.color)
            );
          }
          manual_category[axis + "_color_dict"] = color_dict;
        }
      }
    });

    // initialize category dictionary
    ///////////////////////////////////
    params.cat_data.manual_cat_dict = {};

    axes.forEach((axis) => {
      if (manual_category[axis]) {
        if (
          axis in cgm.params.cat_data &&
          cgm.params.cat_data[axis].length > 0
        ) {
          if ("cat_title" in cgm.params.cat_data[axis][0]) {
            let cat_title = cgm.params.cat_data[axis][0].cat_title;
            let inst_dict = {};
            inst_dict[cat_title] = {};

            let inst_name;
            params.network[axis + "_nodes"].forEach((x) => {
              if (x.name.includes(": ")) {
                inst_name = x.name.split(": ")[1];
              } else {
                inst_name = x.name;
              }
              inst_dict[cat_title][inst_name] = x["cat-0"].split(": ")[1];
            });

            params.cat_data.manual_cat_dict[axis] = inst_dict;
          }
        }
      }
    });
  } else {
    manual_category.row = false;
    manual_category.col = false;
  }

  params.cat_data.manual_category = manual_category;

  params.search = {};
  params.search.searched_rows = [];

  let download = {};
  // default delimiter
  download.delimiter_name = "csv";

  download.delimiter_key = {};
  download.delimiter_key.csv = ",";
  download.delimiter_key.tsv = "\t";
  download.delimiter_key.tuple = "\t";

  download.meta_type = "col";

  params.download = download;

  this.params = params;
};
