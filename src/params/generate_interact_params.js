module.exports = function generate_interact_params(params){

  params.interact = {};
  params.interact.total = 0;
  params.interact.still_interacting = false;
  params.interact.still_mouseover = false;
  params.interact.mouseover = {};
  params.interact.mouseover.row_name = null;
  params.interact.mouseover.col_name = null;
  params.interact.mouseover.text_triangles = {};
  params.interact.enable_viz_interact = true;

};