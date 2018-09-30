module.exports = function generate_interact_params(params){

  params.interact = {};
  params.interact.total = 0;
  params.interact.still_interacting = false;
  params.interact.still_mouseover = false;
  params.interact.mouseover = {};

  _.each(['row', 'col'], function(inst_axis){
    params.interact.mouseover[inst_axis] = {};
    params.interact.mouseover[inst_axis].name = null;
    params.interact.mouseover[inst_axis].cats = {};
  })

  params.interact.mouseover.text_triangles = {};
  params.interact.enable_viz_interact = true;

};