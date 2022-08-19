import * as d3 from "d3";
import * as _ from "underscore";
import makeCameras from "../cameras/makeCameras";
import color_to_rgba from "../colors/colorToRgba";
import make_matrix_args from "../matrixCells/makeMatrixArgs";
import calcTextOffsets from "../matrixLabels/calcTextOffsets";
import makeLabelQueue from "../matrixLabels/makeLabelQueue";
import hzome_functions from "../tooltip/hzomeFunctions";
import iniZoomData from "../zoom/iniZoomData";
import iniZoomRestrict from "../zoom/iniZoomRestrict";
import calcAlphaOrder from "./calcAlphaOrder";
import calcMatArr from "./calcMatArr";
import calcRowAndColCanvasPositions from "./calcRowAndColCanvasPositions";
import calcVizArea from "./calcVizArea";
import calcVizDim from "./calcVizDim";
import genAniPar from "./genAniPar";
import genCatPar from "./genCatPar";
import genDendroPar from "./genDendroPar";
import generateCatArgsArrs from "./generateCatArgsArrs";
import generateOrderParams from "./generateOrderParams";
import generateSpilloverParams from "./generateSpilloverParams";
import generateTextTriangleParams from "./generateTextTriangleParams";
import generateTooltipParams from "./generateTooltipParams";
import generateWebglToPix from "./generateWebglToPix";
import genIntPar from "./genIntPar";
import genLabelPar from "./genLabelPar";
import genPixToWebgl from "./genPixToWebgl";
import genTextZoomPar from "./genTextZoomPar";

export default function initialize_params(cgm, external_model) {
  const args = cgm.args;
  const canvas_container = cgm.canvas_container;
  const regl = cgm.regl;
  const network = cgm.network;
  // fix initial ordering indexing (will fix in Python on nex release)
  ["row", "col"].forEach((axis) => {
    cgm.network[axis + "_nodes"].forEach((x) => (x.ini = x.ini - 1));
  });
  cgm.params = {};
  const params = cgm.params;
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
  genAniPar(params);
  calcAlphaOrder(params);
  genIntPar(params);
  genCatPar(params);
  params.mat_data = params.network.mat;
  generateOrderParams(params);
  genLabelPar(params);
  const labels = params.labels;
  generateTooltipParams(regl, params);
  calcVizDim(regl, params);
  generateCatArgsArrs(regl, params);
  params.zoom_data = iniZoomData();
  params.canvas_pos = calcRowAndColCanvasPositions(params);
  params.is_downsampled = false;
  params.viz_aid_tri_args = {};
  _.each(["row", "col"], function (inst_axis) {
    calcTextOffsets(params, inst_axis);
  });
  params.tile_pix_width = params.viz_dim.heat.width / labels.num_col;
  params.tile_pix_height = params.viz_dim.heat.height / labels.num_row;
  genPixToWebgl(params);
  generateWebglToPix(params);
  makeLabelQueue(params);
  genTextZoomPar(params);
  calcVizArea(params);
  generateTextTriangleParams(params);
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
  let min_dim;
  if (labels.num_col < labels.num_row) {
    min_dim = labels.num_col;
  } else {
    min_dim = labels.num_row;
  }
  params.max_zoom = min_dim / 4.0;
  params.zoom_restrict = iniZoomRestrict(params);
  cgm.zoom_rules_high_mat(cgm, external_model);
  makeCameras(regl, params);
  calcMatArr(params);
  // matrix color paramters
  const mat_colors = {};
  if ("matrix_colors" in params.network) {
    const pos_color = params.network.matrix_colors.pos;
    const neg_color = params.network.matrix_colors.neg;
    mat_colors.pos_rgb = color_to_rgba(pos_color).slice(0, 3);
    mat_colors.neg_rgb = color_to_rgba(neg_color).slice(0, 3);
  } else {
    mat_colors.pos_rgb = [1, 0, 0];
    mat_colors.neg_rgb = [0, 0, 1];
  }
  params.viz.mat_colors = mat_colors;
  // attach to cgm so it can be run without passing arguments
  cgm.make_matrix_args = make_matrix_args;
  cgm.make_matrix_args(cgm);
  genDendroPar(cgm);
  generateSpilloverParams(regl, params);
  const allow_factor = d3.scaleLinear().domain([10, 1000]).range([2, 30]);
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
  const axes = ["col", "row"];
  const manual_category = {};
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
          const color_dict = {};
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
    // /////////////////////////////////
    params.cat_data.manual_cat_dict = {};
    axes.forEach((axis) => {
      if (manual_category[axis]) {
        if (
          axis in cgm.params.cat_data &&
          cgm.params.cat_data[axis].length > 0
        ) {
          if ("cat_title" in cgm.params.cat_data[axis][0]) {
            const cat_title = cgm.params.cat_data[axis][0].cat_title;
            const inst_dict = {};
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
  const download = {};
  // default delimiter
  download.delimiter_name = "csv";
  download.delimiter_key = {};
  download.delimiter_key.csv = ",";
  download.delimiter_key.tsv = "\t";
  download.delimiter_key.tuple = "\t";
  download.meta_type = "col";
  params.download = download;
  cgm.params = params;

  return cgm;
}
