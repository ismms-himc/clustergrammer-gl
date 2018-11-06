var calc_cat_cluster_breakdown = require('./../cats/calc_cat_cluster_breakdown');
var make_cat_breakdown_graph = require('./../cats/make_cat_breakdown_graph');

module.exports = function show_d3_tip(params){

  var mouseover = params.interact.mouseover;

  console.log(params.tooltip.tooltip_type, mouseover.value)

  if (params.tooltip.tooltip_type === 'matrix-cell'){

    params.tooltip_fun.show('tooltip');

    d3.select(params.tooltip_id)
      .html(function(){
        var full_string = mouseover.row.name + ' and ' + mouseover.col.name + ' <br> ' +
                          'value: ' + mouseover.value.toFixed(3);

        return full_string;
      });

  }

  var cat_breakdown;

  if (params.tooltip.tooltip_type === 'col-dendro'){


    params.tooltip_fun.show('tooltip');

    console.log('working on col dendro')

    cat_breakdown = calc_cat_cluster_breakdown(params, mouseover.col.dendro, 'col');

    var group_tooltip_container = d3.select(params.tooltip_id).node();

    make_cat_breakdown_graph(params, mouseover.col.dendro, cat_breakdown, 'col', group_tooltip_container)




  }


    var d3_tip_width = parseFloat(d3.select(params.tooltip_id)
                                 .style('width')
                                 .replace('px',''));

    var d3_tip_height = parseFloat(d3.select(params.tooltip_id)
                                 .style('height')
                                 .replace('px',''));

    // this is necessary to offset hte tooltip correctly, probably due to the
    // padding in the tooltip or some related paramters
    var magic_x_offset = 22;

    params.d3_tip_width = d3_tip_width

    d3.select(params.tooltip_id)
      .style('margin-left', function(){
        var total_x_offset = params.zoom_data.x.cursor_position - d3_tip_width + 22;
        return total_x_offset + 'px'
      })
      .style('margin-top', function(){
        var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
        return total_y_offset + 'px'
      });



}