import manual_update_to_cats from "./cats/manualUpdateToCats";
import update_all_cats from "./cats/updateAllCats";
import build_control_panel from "./controlPanel/buildControlPanel";
import build_dendrogram_sliders from "./dendrogram/buildDendrogramSliders";
import download_matrix from "./download/downloadMatrix";
import download_metadata from "./download/downloadMetadata";
import draw_labels_tooltips_or_dendro from "./draws/drawLabelsTooltipsOrDendro";
import run_viz from "./draws/runViz";
import destroy_viz from "./initializeViz/destroyViz";
import ini_canvas_mouseover from "./initializeViz/iniCanvasMouseover";
import initialize_containers from "./initializeViz/initializeContainers";
import viz_from_network from "./initializeViz/vizFromNetwork";
import single_clicking from "./interactions/singleClicking";
import gen_ordered_labels from "./params/genLabelPar";
import initialize_params from "./params/initializeParams";
import initialize_regl from "./params/initializeRegl";
import recluster from "./recluster/recluster";
import initialize_tooltip from "./tooltip/initializeD3Tip";
import zoom_rules_high_mat from "./zoom/zoomRulesHighMat";

/**
 * @type function
 */
function clustergrammer_gl(args, external_model = null) {
  var cgm = {};
  // check if container is defined
  if (args.container !== null) {
    cgm.args = args;
    // always do these
    cgm.initialize_params = initialize_params;
    cgm.initialize_regl = initialize_regl;
    cgm.initialize_containers = initialize_containers;
    cgm.initialize_tooltip = initialize_tooltip;
    // maybe do these
    cgm.build_dendrogram_sliders = build_dendrogram_sliders;
    if (!args.showControlPanel) {
      cgm.build_control_panel = build_control_panel;
    } else {
      cgm.build_control_panel = build_control_panel;
    }
    cgm.run_viz = run_viz;
    cgm.destroy_viz = destroy_viz;
    cgm.ini_canvas_mouseover = ini_canvas_mouseover;
    cgm.viz_from_network = viz_from_network;
    cgm.draw_labels_tooltips_or_dendro = draw_labels_tooltips_or_dendro;
    cgm.single_clicking = single_clicking;
    cgm.zoom_rules_high_mat = zoom_rules_high_mat;
    cgm.gen_ordered_labels = gen_ordered_labels;
    if (typeof args.widget_callback !== "undefined") {
      cgm.widget_callback = widget_callback;
    }
    // initialize network
    cgm.network = network;
    // going to work on passing in filtered network in place of full network
    // as a quick crop method
    cgm.viz_from_network(external_model);
    // copy the cgm object to the external widget model
    if (external_model != null) {
      external_model.cgm = cgm;
    }
    cgm.recluster = recluster;
    cgm.manual_update_to_cats = manual_update_to_cats;
    cgm.update_all_cats = update_all_cats;
    cgm.download_matrix = download_matrix;
    cgm.download_metadata = download_metadata;
    // this prevents Jupyter from listening to typing on the modal and
    // misinterpreting as keyboard shortcuts
    if (cgm.params.is_widget) {
      // tooltip input box
      let tooltip_id = cgm.params.tooltip_id.replace("#", "");
      Jupyter.keyboard_manager.register_events(
        document.getElementById(tooltip_id)
      );
      // control panel search box
      let root_id = cgm.params.root.replace("#", "");
      Jupyter.keyboard_manager.register_events(
        document.getElementById(root_id)
      );
    }
    function adjust_opacity(opacity_scale) {
      let cgm = this;
      let params = cgm.params;
      params.matrix.opacity_scale = opacity_scale;
      cgm.make_matrix_args();
      draw_webgl_layers(cgm);
    }
    cgm.adjust_opacity = adjust_opacity;
    return cgm;
  }
}
export default clustergrammer_gl;
