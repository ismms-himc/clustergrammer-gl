var build_single_dendro_slider = require('./build_single_dendro_slider');

module.exports = function build_dendrogram_sliders(regl, cgm){

  // Add sliders on top of the canvas
  /////////////////////////////////////
  var slider_length = 130;

  // slider containers

  var axis_slider_container;
  var inst_top;
  var inst_left;

  _.each(['row', 'col'], function(inst_axis){

    if (inst_axis === 'row'){
      inst_top = 325;
      inst_left = cgm.params.viz_width - 10;
    } else {
      inst_top = 500;
      inst_left = cgm.params.viz_width - 10;
    }


    axis_slider_container = d3.select(cgm.params.root + ' .control-container')
      .append('svg')
      .style('height', slider_length + 'px')
      .style('width', '40px')
      .style('position', 'absolute')
      .style('top', inst_top + 'px')
      .style('left', inst_left + 'px')
      .attr('class', inst_axis + '_dendro_slider_svg')

    axis_slider_container
      .append('rect')
      .style('height', slider_length + 'px')
      .style('width', '30px')
      .style('fill', 'white');

    build_single_dendro_slider(regl, cgm, inst_axis);
  });





}