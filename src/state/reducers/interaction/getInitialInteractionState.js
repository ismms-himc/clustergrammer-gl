import * as _ from "underscore";

export default function getInitialInteractionState() {
  const interact = {};
  interact.total = 0;
  interact.still_interacting = false;
  interact.still_mouseover = false;
  interact.need_reset_cat_opacity = false;
  interact.mouseover = {};
  _.each(["row", "col"], function (inst_axis) {
    interact.mouseover[inst_axis] = {};
    interact.mouseover[inst_axis].name = null;
    interact.mouseover[inst_axis].cats = [];
  });
  interact.mouseover.value = null;
  interact.enable_viz_interact = true;
  interact.manual_update_cats = false;
  return interact;
}
