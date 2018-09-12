var build_single_dendro_slider = require('./build_single_dendro_slider');

module.exports = function build_dendrogram_sliders(cgm){

  console.log('build_dendrogram_sliders')

  // Add sliders on top of the canvas
  /////////////////////////////////////
  var slider_length = 130;
  var col_slider_container = d3.select(cgm.params.canvas_container)
    .append('svg')
    .style('height', slider_length + 'px')
    .style('width', '40px')
    .style('position', 'absolute')
    .style('top', 400 + 'px')
    .style('left', 1000 - 15 + 'px')
    .attr('id', 'dendro_slider_svg')

  col_slider_container
    .append('rect')
    .style('height', slider_length + 'px')
    .style('width', '50px')
    .style('fill', 'white')
    // .style('opacity', 0.5)
    .on('click', function(){
      console.log('clicking the red slider')
    })

  build_single_dendro_slider(cgm, 'row', cgm.params.canvas_container);

}