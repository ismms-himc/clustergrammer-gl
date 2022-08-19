var run_hide_tooltip = require("./../tooltip/runHideTooltip");

module.exports = function single_clicking(params, external_model) {
  params.ani.last_click = params.ani.time;
  params.int.manual_update_cats = false;

  var cgm = this;

  run_hide_tooltip(params, true);

  // debugger

  if (params.tooltip.tooltip_type.includes("-dendro")) {
    if (params.tooltip.permanent_tooltip === false) {
      require("./../tooltip/runShowTooltip")(cgm, external_model);
      params.tooltip.permanent_tooltip = true;
    }
  }

  if (params.is_widget) {
    cgm.widget_callback(external_model);
  }
};
