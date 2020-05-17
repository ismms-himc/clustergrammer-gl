module.exports = function gen_int_par(params){

  var interact = {};
  interact.total = 0;
  interact.still_interacting = false;
  interact.still_mouseover = false;
  interact.need_reset_cat_opacity = false;
  interact.mouseover = {};

  _.each(['row', 'col'], function(inst_axis){
    interact.mouseover[inst_axis] = {};
    interact.mouseover[inst_axis].name = null;
    interact.mouseover[inst_axis].cats = [];
  });

  interact.mouseover.value = null;
  interact.enable_viz_interact = true;
  // interact.wait_time_final_interact = 50;

  interact.manual_update_cats = false;

  params.int = interact;
};