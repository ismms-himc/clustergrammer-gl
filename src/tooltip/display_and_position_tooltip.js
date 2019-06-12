module.exports = function display_and_position_tooltip(params){

  // Display Tooltip
  ////////////////////////////////
  d3.selectAll('.cgm-tooltip')
    .style('display', 'none');

  // display tooltip
  d3.select(params.tooltip_id)
    .style('display', 'block')
    .style('z-index', 99);

  // Position Tooltip
  ////////////////////////////////
  // this is necessary to offset the tooltip correctly, probably due to the
  // padding in the tooltip or some related paramters
  var magic_x_offset = 22;

  var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                               .style('width')
                               .replace('px',''));

  var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                               .style('height')
                               .replace('px',''));

  params.d3_tip_width = d3_tip_width;

  console.log('position tooltip type', params.tooltip.tooltip_type);

  // debugger;

  // need to set up custom positioning of the tooltip based on the mouseover type
  // upper left if on matrix-cell, upper right if on row label, lower left if on
  // column mouseover. Should be able to check params.tooltip.tooltip_type to
  // find out how to position the tooltip

  // currently hardwiring positions

  if (params.tooltip.tooltip_type === 'matrix-cell'){

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width +
                             magic_x_offset;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
        return total_y_offset + 'px'
      });

  }

  else if (params.tooltip.tooltip_type === 'row-label'){

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = 150;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
        return total_y_offset + 'px'
      });

  }

  else if (params.tooltip.tooltip_type === 'col-label'){

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width +
                             magic_x_offset;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = 125;
        return total_y_offset + 'px'
      });
  }

  else if (params.tooltip.tooltip_type === 'col-dendro'){
    console.log('col-dendro')

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width/2 +
                             magic_x_offset;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        // var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
        // var total_y_offset = params.viz_dim.heat.y.max;
        // console.log(total_y_offset)
        var total_y_offset = 845 - d3_tip_height;
        return total_y_offset + 'px'
      });

  }

  else if (params.tooltip.tooltip_type === 'row-dendro'){

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        // var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width +
        //                      magic_x_offset;

        var total_x_offset = 870 - d3_tip_width;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
        return total_y_offset + 'px'
      });

  }

  else if (params.tooltip.tooltip_type.includes('col-cat-')){
    console.log('col-dendro')

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width +
                             magic_x_offset;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = 125 + params.cat_data.col.length * 12;
        return total_y_offset + 'px'
      });

  }

  else if (params.tooltip.tooltip_type.includes('row-cat-')){

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = 150 + params.cat_data.row.length * 12;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
        return total_y_offset + 'px'
      });

  }

};