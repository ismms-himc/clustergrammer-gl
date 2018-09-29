const make_tooltip_text_args = require('./../tooltip/make_tooltip_text_args');
var calc_tooltip_background_triangles = require('./../tooltip/calc_tooltip_background_triangles');

module.exports = function draw_tooltip_components(regl, params){

  // Spillover Components (may not need to redraw)
  params.cameras.static.draw(() => {

    // console.log('draw tooltip', params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)

    var inst_y = params.zoom_data.y.cursor_position;
    // testing out d3 svg tooltip
    var svg_tooltip_container = d3.select(params.root + ' .canvas-container')
      .append('svg')
      .style('height', 50 + 'px')
      .style('width', '50px')
      .style('position', 'absolute')
      .style('top', inst_y + 'px')
      .style('left', params.zoom_data.x.cursor_position + 'px')
      .attr('class', 'svg-tooltip');

    svg_tooltip_container
      .append('rect')
      .style('height', 50 + 'px')
      .style('width', '50px')
      .style('fill', 'black');

    // var args = params.spillover_args.mat_corners;
    var args = params.tooltip.tooltip_args;

    // tooltip background
    ////////////////////////////
    var background_triangles = calc_tooltip_background_triangles(regl, params);
    regl(args)(background_triangles);

    // tooltip text
    //////////////////
    // make the arguments for the draw command
    var text_triangle_args;
    var line_offset;
    var inst_triangles

    // draw row/col names
    line_offset = 3.0;
    text_triangle_args = make_tooltip_text_args(regl, params, line_offset);
    inst_triangles = params.interact.mouseover.text_triangles['line-1'];
    regl(text_triangle_args)(inst_triangles);

    if (params.cat_data.cat_num.col > 0){

      line_offset = 1.5;
      text_triangle_args = make_tooltip_text_args(regl, params, line_offset);
      inst_triangles = params.interact.mouseover.text_triangles['line-2'];
      regl(text_triangle_args)(inst_triangles);

    }

  });
};