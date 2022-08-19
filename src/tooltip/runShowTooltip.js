var make_tooltip_text = require("./makeTooltipText");
var remove_lost_tooltips = require("./removeLostTooltips");
var display_and_position_tooltip = require("./displayAndPositionTooltip");

module.exports = function run_show_tooltip(cgm, external_model) {
  let params = cgm.params;

  if (params.tooltip.permanent_tooltip === false) {
    remove_lost_tooltips();

    make_tooltip_text(cgm, external_model);

    display_and_position_tooltip(params);
  }
};
