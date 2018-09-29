var build_single_dendro_slider = require('./build_single_dendro_slider');

module.exports = function build_dendrogram_sliders(cgm){

  // Add sliders on top of the canvas
  /////////////////////////////////////
  var slider_length = 130;
  // var col_slider_container = d3.select(cgm.params.canvas_container)
  var col_slider_container = d3.select(cgm.params.root + ' .control-container')
    .append('svg')
    .style('height', slider_length + 'px')
    .style('width', '40px')
    .style('position', 'absolute')
    .style('top', 325 + 'px')
    .style('left', cgm.params.viz_width - 10 + 'px')
    .attr('class', 'dendro_slider_svg')

  col_slider_container
    .append('rect')
    .style('height', slider_length + 'px')
    .style('width', '30px')
    .style('fill', 'white')
    .on('click', function(){
      // console.log('clicking the red slider')
    })

  build_single_dendro_slider(cgm, 'row');

}