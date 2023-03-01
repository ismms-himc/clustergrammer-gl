/*
  clustergrammer-gl version 0.23.0
 */

function clustergrammer_gl(args, external_model=null){

  var d3 = require("d3");

  console.log('#################################');
  console.log('clustergrammer-gl version 0.24.2');
  console.log('#################################');

  var cgm = {};

  // check if container is defined
  if (args.container !=null){

    cgm.args = args;

    cgm.initialize_params = require('./params/initialize_params');
    // cgm.decompress_network = require('./params/decompress_network');
    cgm.initialize_regl = require('./params/initialize_regl');
    cgm.initialize_containers = require('./initialize_viz/initialize_containers');
    cgm.build_dendrogram_sliders = require('./dendrogram/build_dendrogram_sliders');
    cgm.build_control_panel = require('./control_panel/build_control_panel');
    cgm.run_viz = require('./draws/run_viz');
    cgm.destroy_viz = require('./initialize_viz/destroy_viz');
    cgm.ini_canvas_mouseover = require('./initialize_viz/ini_canvas_mouseover')
    cgm.viz_from_network = require('./initialize_viz/viz_from_network');
    cgm.draw_labels_tooltips_or_dendro = require('./draws/draw_labels_tooltips_or_dendro');

    cgm.single_clicking = require('./interactions/single_clicking');
    cgm.zoom_rules_high_mat = require('./zoom/zoom_rules_high_mat');

    cgm.gen_ordered_labels = require('./params/gen_label_par');


    if (typeof args.widget_callback !== 'undefined'){
      console.log('pass widget_callback to cgm  ')
      cgm.widget_callback = args.widget_callback;
    }

    // initialize network
    // cgm.decompress_network(args.network);
    cgm.network = args.network;

    // going to work on passing in filtered network in place of full network
    // as a quick crop method
    cgm.viz_from_network(external_model);

    // copy the cgm object to the external widget model
    if (external_model != null){
      external_model.cgm = cgm;
    }

    cgm.recluster = require('./recluster/recluster');
    cgm.manual_update_to_cats = require('./cats/manual_update_to_cats')
    cgm.update_all_cats = require('./cats/update_all_cats')

    cgm.download_matrix = require('./download/download_matrix')
    cgm.download_metadata = require('./download/download_metadata')

    // this prevents Jupyter from listening to typing on the modal and
    // misinterpreting as keyboard shortcuts
    if (cgm.params.is_widget){

      // tooltip input box
      let tooltip_id = cgm.params.tooltip_id.replace('#', '')
      Jupyter.keyboard_manager
             .register_events(document.getElementById(tooltip_id))

      // control panel search box
      let root_id = cgm.params.root.replace('#', '')
      Jupyter.keyboard_manager
             .register_events(document.getElementById(root_id))

    }

    function adjust_opacity(opacity_scale){
      console.log('adjust_opacity!!!!!!!!!!!!!!')

      let cgm = this
      let params = cgm.params

      params.matrix.opacity_scale = opacity_scale
      cgm.make_matrix_args()
      draw_webgl_layers(cgm)
    }

    cgm.adjust_opacity = adjust_opacity



    // cgm.toggle_zscore = toggle_zscore

    return cgm;

  }
}

// necessary for exporting function
module.exports = clustergrammer_gl;