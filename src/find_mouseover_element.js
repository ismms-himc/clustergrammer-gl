module.exports = function find_mouseover_element(params, ev){

  // console.log('mousemove in find_mouseover_element!!! ',
  //   ev.x0,
  //   params.zoom_data.x.cursor_position,
  //   ev.y0,
  //   params.zoom_data.y.cursor_position);

  var viz_dim_heat = params.viz_dim.heat;

  var cursor_rel_min = {};
  cursor_rel_min.x = ev.x0 - viz_dim_heat.x.min
  cursor_rel_min.y = ev.y0 - viz_dim_heat.y.min

  cursor_rel_min.x = restrict_rel_min(cursor_rel_min.x, viz_dim_heat.width);
  cursor_rel_min.y = restrict_rel_min(cursor_rel_min.y, viz_dim_heat.height);



  if (cursor_rel_min.x < viz_dim_heat.width && cursor_rel_min.y < viz_dim_heat.height){
    console.log('rel min',
                 Math.floor(cursor_rel_min.y/params.tile_pix_height),
                 Math.floor(cursor_rel_min.x/params.tile_pix_width)
                 );
  }

  /*

  Need to use

    cgm.params.canvas_pos.x_arr.length
      and
    cgm.params.canvas_pos.y_arr.length

  to identify where the user is mousing over

  Also need to take into consideration zooming/panning


  */

function restrict_rel_min(cursor_rel_min, max_pix){

  // console.log(viz_dim_heat.max)
  if (cursor_rel_min < 0){
    cursor_rel_min = 0;
  // } else if (cursor_rel_min > viz_dim_heat.max){
  } else if (cursor_rel_min > max_pix){
    // cursor_rel_min = viz_dim_heat.max;
    cursor_rel_min = max_pix;
  }
  return cursor_rel_min;
}

};