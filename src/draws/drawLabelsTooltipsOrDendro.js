import draw_commands from "./drawCommands";

export default function draw_labels_tooltips_or_dendro(cgm, external_model) {
  const params = cgm.params;
  // turn back on draw_labels
  // /////////////////////////////
  draw_commands(cgm, external_model);
  if (params.tooltip.show_tooltip) {
    params.tooltip.show_tooltip = false;
  }
  // turn back off draw dendro
  if (params.dendro.update_dendro) {
    params.dendro.update_dendro = false;
  }
}
