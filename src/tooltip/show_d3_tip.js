module.exports = function show_d3_tip(params){

  params.tooltip_fun.show('tooltip');

  // var inst_bbox = d3.selectAll('.d3-tip').node().getBBox();


  var d3_tip_width = parseFloat(d3.select('#d3-tip')
                               .style('width')
                               .replace('px',''));

var d3_tip_height = parseFloat(d3.select('#d3-tip')
                               .style('height')
                               .replace('px',''));

  d3.select('#d3-tip')
    .style('margin-left', function(){
      var total_x_offset = params.zoom_data.x.cursor_position;
      return total_x_offset + 'px'
    })
    .style('margin-top', function(){
      var total_y_offset = params.zoom_data.y.cursor_position - d3_tip_height;
      return total_y_offset + 'px'
    });


}