/**
 * @type function
 */
function clustergrammer_gl(args, external_model = null) {
  var cgm = {};

  // check if container is defined
  if (args.container !== null) {
    cgm.args = args;

    // always do these
    cgm.initialize_params = require("./params/initializeParams");
    cgm.initialize_regl = require("./params/initializeRegl");
    cgm.initialize_containers = require("./initializeViz/initializeContainers");
    cgm.initialize_tooltip = require("./tooltip/initializeD3Tip");

    // maybe do these
    cgm.build_dendrogram_sliders = require("./dendrogram/buildDendrogramSliders");
    if (!args.showControlPanel) {
      cgm.build_control_panel = () => {};
    } else {
      cgm.build_control_panel = require("./controlPanel/buildControlPanel");
    }
    cgm.run_viz = require("./draws/runViz");
    cgm.destroy_viz = require("./initializeViz/destroyViz");
    cgm.ini_canvas_mouseover = require("./initializeViz/iniCanvasMouseover");
    cgm.viz_from_network = require("./initializeViz/vizFromNetwork");
    cgm.draw_labels_tooltips_or_dendro = require("./draws/drawLabelsTooltipsOrDendro");

    cgm.single_clicking = require("./interactions/singleClicking");
    cgm.zoom_rules_high_mat = require("./zoom/zoomRulesHighMat");

    cgm.gen_ordered_labels = require("./params/genLabelPar");

    if (typeof args.widget_callback !== "undefined") {
      cgm.widget_callback = args.widget_callback;
    }

    // initialize network
    cgm.network = args.network;

    // going to work on passing in filtered network in place of full network
    // as a quick crop method
    cgm.viz_from_network(external_model);

    // copy the cgm object to the external widget model
    if (external_model != null) {
      external_model.cgm = cgm;
    }

    cgm.recluster = require("./recluster/recluster");
    cgm.manual_update_to_cats = require("./cats/manualUpdateToCats");
    cgm.update_all_cats = require("./cats/updateAllCats");

    cgm.download_matrix = require("./download/downloadMatrix");
    cgm.download_metadata = require("./download/downloadMetadata");

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

// necessary for exporting function
module.exports = clustergrammer_gl;
