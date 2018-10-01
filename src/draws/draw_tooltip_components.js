// const make_tooltip_text_args = require('./../tooltip/make_tooltip_text_args');
// var calc_tooltip_background_triangles = require('./../tooltip/calc_tooltip_background_triangles');

module.exports = function draw_tooltip_components(regl, params){

    var tooltip_dim = {};
    tooltip_dim.height = 75;
    tooltip_dim.width = 150;

    var tooltip_buffer = {};
    tooltip_buffer.x = 2;
    tooltip_buffer.y = 2;

    var text_offset = {};
    text_offset.x = 10;
    text_offset.y = 20;

    var pos_y = params.zoom_data.y.cursor_position - tooltip_dim.height - tooltip_buffer.y;
    var pos_x = params.zoom_data.x.cursor_position - tooltip_dim.width  - tooltip_buffer.x;

    var svg_tooltip_container = d3.select(params.root + ' .canvas-container')
      .append('svg')
      .style('height', tooltip_dim.height + 'px')
      .style('width', tooltip_dim.width + 'px')
      .style('position', 'absolute')
      .style('top', pos_y + 'px')
      .style('left', pos_x + 'px')
      .classed('svg-tooltip', true);

    var svg_tooltip_group = svg_tooltip_container
      .append('g')
      .classed('tooltip-group', true)

    svg_tooltip_group
      .append('rect')
      .style('height', tooltip_dim.height + 'px')
      .style('width', tooltip_dim.width + 'px')
      .style('fill', 'black')
      .classed('tooltip-background', true)
      .style('opacity', 0.85)

    var mouseover = params.interact.mouseover;

    // console.log('here')
    svg_tooltip_group
      .selectAll('text')
      .data(['something', 'something'])
      .enter()
      .append('text')
      .style('fill', 'white')
      .attr('transform', function(d, inst_index){
        console.log(d)
        return 'translate(' + text_offset.x + ', '+ (inst_index +1)* text_offset.y +')';
      })
      .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .style('font-weight',  800)
      .style('font-size', 15)
      .classed('tooltip-text', true)
      .text(function(){
        var inst_text = mouseover.row.name + ' and ' + mouseover.col.name;
        return inst_text;
      });


    // make sure background is large enough for text
    text_width = d3.select('.tooltip-text').node().getBBox().width;

    console.log(text_width)

    var num_offsets = 2;

    d3.select(params.root + ' .svg-tooltip')
      .style('width',function(){
        var inst_width = text_width + num_offsets * text_offset.x;
        return inst_width + 'px';
      })
      .style('left', function(){
        var pos_x = params.zoom_data.x.cursor_position - text_width - (num_offsets) * text_offset.x;
        return pos_x;
      })

    d3.select(params.root + ' .tooltip-background')
      .style('width',function(){
        var inst_width = text_width + num_offsets * text_offset.x;
        return inst_width + 'px';
      });

    console.log(d3.select(params.root + ' .tooltip-background').style('width'));

      // .html(function(d) {
      //   // var inst_name = d.name.replace(/_/g, ' ').split('#')[0];
      //   var inst_name = 'Something';
      //   return "<span>" + inst_name + "</span>";
      // });

  // debugger

  // // Spillover Components (may not need to redraw)
  // params.cameras.static.draw(() => {

  //   // var args = params.spillover_args.mat_corners;
  //   var args = params.tooltip.tooltip_args;

  //   // tooltip background
  //   ////////////////////////////
  //   var background_triangles = calc_tooltip_background_triangles(regl, params);
  //   regl(args)(background_triangles);

  //   // tooltip text
  //   //////////////////
  //   // make the arguments for the draw command
  //   var text_triangle_args;
  //   var line_text_offset;
  //   var inst_triangles

  //   // draw row/col names
  //   line_text_offset = 3.0;
  //   text_triangle_args = make_tooltip_text_args(regl, params, line_text_offset);
  //   inst_triangles = params.interact.mouseover.text_triangles['line-1'];
  //   regl(text_triangle_args)(inst_triangles);

  //   if (params.cat_data.cat_num.col > 0){

  //     line_text_offset = 1.5;
  //     text_triangle_args = make_tooltip_text_args(regl, params, line_text_offset);
  //     inst_triangles = params.interact.mouseover.text_triangles['line-2'];
  //     regl(text_triangle_args)(inst_triangles);

  //   }

  // });

};