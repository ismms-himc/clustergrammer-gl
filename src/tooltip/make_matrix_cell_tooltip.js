module.exports = function make_matrix_cell_tooltip(params){

    var tooltip_dim = {};
    tooltip_dim.height = 50;
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

    var tooltip_lines = [];
    tooltip_lines[0] = mouseover.row.name + ' and ' + mouseover.col.name;
    tooltip_lines[1] = 'value: ' + mouseover.value.toFixed(3);

    svg_tooltip_group
      .selectAll('text')
      .data(tooltip_lines)
      .enter()
      .append('text')
      .style('fill', 'white')
      .attr('transform', function(d, inst_index){
        return 'translate(' + text_offset.x + ', '+ (inst_index +1)* text_offset.y +')';
      })
      .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .style('font-weight',  800)
      .style('font-size', 15)
      .classed('tooltip-text', true)
      .text(function(d){
        return d;
      });

    // make sure background is large enough for text
    //////////////////////////////////////////////////
    var text_width = d3.select('.tooltip-text').node().getBBox().width;
    var num_offsets = 2;

    d3.select(params.root + ' .svg-tooltip')
      .style('width',function(){
        var inst_width = text_width + num_offsets * text_offset.x;
        return inst_width + 'px';
      })
      .style('left', function(){
        var inst_pos_x = params.zoom_data.x.cursor_position - text_width - (num_offsets) * text_offset.x;
        return inst_pos_x;
      })

    d3.select(params.root + ' .tooltip-background')
      .style('width',function(){
        var inst_width = text_width + num_offsets * text_offset.x;
        return inst_width + 'px';
      });

};