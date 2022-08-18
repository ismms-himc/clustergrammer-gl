import manual_update_to_cats from "./cats/manual_update_to_cats";
import update_all_cats from "./cats/update_all_cats";
import build_control_panel from "./control_panel/build_control_panel";
import build_dendrogram_sliders from "./dendrogram/build_dendrogram_sliders";
import download_matrix from "./download/download_matrix";
import download_metadata from "./download/download_metadata";
import draw_labels_tooltips_or_dendro from "./draws/draw_labels_tooltips_or_dendro";
import run_viz from "./draws/run_viz";
import destroy_viz from "./initialize_viz/destroy_viz";
import initialize_containers from "./initialize_viz/initialize_containers";
import ini_canvas_mouseover from "./initialize_viz/ini_canvas_mouseover";
import viz_from_network from "./initialize_viz/viz_from_network";
import single_clicking from "./interactions/single_clicking";
import gen_ordered_labels from "./matrix_labels/gen_ordered_labels";
import initialize_params from "./params/initialize_params";
import initialize_regl from "./params/initialize_regl";
import recluster from "./recluster/recluster";
import zoom_rules_high_mat from "./zoom/zoom_rules_high_mat";

function clustergrammer_gl(args, external_model = null) {
  var clustergrammerModel = {};

  // check if container is defined
  if (args.container !== null) {
    clustergrammerModel.args = args;

    clustergrammerModel.initialize_params = initialize_params;
    clustergrammerModel.initialize_regl = initialize_regl;
    clustergrammerModel.initialize_containers = initialize_containers;
    clustergrammerModel.build_dendrogram_sliders = build_dendrogram_sliders;
    clustergrammerModel.build_control_panel = build_control_panel;
    clustergrammerModel.run_viz = run_viz;
    clustergrammerModel.destroy_viz = destroy_viz;
    clustergrammerModel.ini_canvas_mouseover = ini_canvas_mouseover;
    clustergrammerModel.draw_labels_tooltips_or_dendro =
      draw_labels_tooltips_or_dendro;

    clustergrammerModel.single_clicking = single_clicking;
    clustergrammerModel.zoom_rules_high_mat = zoom_rules_high_mat;

    clustergrammerModel.gen_ordered_labels = gen_ordered_labels;

    // initialize network
    clustergrammerModel.network = args.network;

    // going to work on passing in filtered network in place of full network
    // as a quick crop method
    viz_from_network(external_model);

    // copy the cgm object to the external widget model
    if (external_model != null) {
      external_model.cgm = clustergrammerModel;
    }

    clustergrammerModel.recluster = recluster;
    clustergrammerModel.manual_update_to_cats = manual_update_to_cats;
    clustergrammerModel.update_all_cats = update_all_cats;

    clustergrammerModel.download_matrix = download_matrix;
    clustergrammerModel.download_metadata = download_metadata;

    function adjust_opacity(opacity_scale) {
      let cgm = this;
      let params = cgm.params;

      params.matrix.opacity_scale = opacity_scale;
      cgm.make_matrix_args();
      draw_webgl_layers(cgm);
    }

    clustergrammerModel.adjust_opacity = adjust_opacity;

    return clustergrammerModel;
  }
}

export default clustergrammer_gl;
