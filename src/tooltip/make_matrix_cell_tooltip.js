calc_cat_cluster_breakdown = require('./../cats/calc_cat_cluster_breakdown');

module.exports = function make_matrix_cell_tooltip(params){

  // console.log('make_matrix_cell_tooltip')
    var tooltip_dim = {};
    tooltip_dim.height = 25;
    tooltip_dim.width = 150;

    var tooltip_buffer = {};
    tooltip_buffer.x = 2;
    tooltip_buffer.y = 2;

    var text_offset = {};
    text_offset.x = 10;
    text_offset.y = 20;

    var mouseover = params.interact.mouseover;
    var tooltip_lines = [];

    // console.log(params.tooltip.tooltip_type)

    if (params.tooltip.tooltip_type === 'matrix-cell'){
      tooltip_lines[0] = mouseover.row.name + ' and ' + mouseover.col.name;
      tooltip_lines[1] = 'value: ' + mouseover.value.toFixed(3);
    }  else if (params.tooltip.tooltip_type.indexOf('row') >=0 && params.tooltip.tooltip_type != 'row-dendro'){
      tooltip_lines[0] = mouseover.row.name;
      _.each(mouseover.row.cats, function(inst_cat){
        tooltip_lines.push(inst_cat);
      });
    } else if (params.tooltip.tooltip_type.indexOf('col') >=0 && params.tooltip.tooltip_type != 'col-dendro'){
      tooltip_lines[0] = mouseover.col.name;
      _.each(mouseover.col.cats, function(inst_cat){
        tooltip_lines.push(inst_cat);
      });
    } else if (params.tooltip.tooltip_type === 'row-dendro'){
      // tooltip_lines[0] = 'row-dendro';
      _.each(mouseover.row.dendro.all_names, function(inst_name){
        tooltip_lines.push(inst_name)
      });

      calc_cat_cluster_breakdown(params, mouseover.row.dendro, 'row');

    } else if (params.tooltip.tooltip_type === 'col-dendro'){
      tooltip_lines[0] = 'col-dendro';
      _.each(mouseover.col.dendro.all_names, function(inst_name){
        tooltip_lines.push(inst_name)
      });
    }
    // console.log(tooltip_lines)

    var pos_y = params.zoom_data.y.cursor_position - tooltip_lines.length * tooltip_dim.height - tooltip_buffer.y;
    var pos_x = params.zoom_data.x.cursor_position - tooltip_dim.width  - tooltip_buffer.x;

    var svg_tooltip_container = d3.select(params.root + ' .canvas-container')
      .append('svg')
      .style('height', function(){
        var inst_height = tooltip_lines.length * tooltip_dim.height + tooltip_buffer.y;
        return  inst_height + 'px'
      })
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
      .style('height', function(){
        var inst_height = tooltip_lines.length * tooltip_dim.height + tooltip_buffer.y;
        return  inst_height + 'px'
      })
      .style('width', tooltip_dim.width + 'px')
      .style('fill', 'black')
      .classed('tooltip-background', true)
      .style('opacity', 0.85)

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
      .text(function(d, inst_index){
        d3.select(this).classed('tooltip-text-line-' + String(inst_index), true)
        return d;
      });

    // debugger;

    var inst_line_width;

    // make sure background is large enough for text
    //////////////////////////////////////////////////
    var text_width = d3.select('.tooltip-text').node().getBBox().width;

    _.each(tooltip_lines, function(d, i){
      inst_line_width = d3.select('.tooltip-text-line-' + String(i)).node().getBBox().width;
      if (inst_line_width > text_width){
        text_width = inst_line_width;
        // console.log('increased width')
      }
    })

    var num_offsets = 4;

    if (text_width > tooltip_dim.width || params.tooltip.tooltip_type === 'row-label'){

      d3.select(params.root + ' .svg-tooltip')
        .style('width',function(){
          inst_line_width = text_width + num_offsets * text_offset.x;
          return inst_line_width + 'px';
        })
        .style('left', function(){
          var inst_pos_x = params.zoom_data.x.cursor_position - text_width - (num_offsets) * text_offset.x;
          return inst_pos_x;
        })

      d3.select(params.root + ' .tooltip-background')
        .style('width',function(){
          inst_line_width = text_width + num_offsets * text_offset.x;
          return inst_line_width + 'px';
        });

    }


    // make sure the height is sufficient

};