var build_single_dendro_slider = require('./build_single_dendro_slider');

module.exports = function build_dendrogram_sliders(regl, cgm){

  // Add sliders on top of the canvas
  /////////////////////////////////////
  var slider_length = 130;

  // slider containers

  var axis_slider_container;
  var inst_top;
  var inst_left;
  var inst_rotate;

  // hardwiring dendro slider position
  _.each(['row', 'col'], function(inst_axis){

    if (inst_axis === 'row'){
      inst_top = 150;
      inst_left = cgm.params.viz_width - 25 ;
    } else {
      // inst_top = cgm.params.viz_height - 80;
      inst_top = 795; // cgm.params.viz_height - 80;
      inst_left = 55;
    }

    // axis_slider_container = d3.select(cgm.params.root + ' .control-container')
    axis_slider_container = d3.select(cgm.params.root + ' .canvas-container')
      .append('svg')
      .style('height', slider_length + 'px')
      .style('width', '20px')
      .style('position', 'absolute')
      .style('top', inst_top + 'px')
      .style('left', inst_left + 'px')
      .attr('class', inst_axis + '_dendro_slider_svg')
      .attr('transform', function(){
        if (inst_axis === 'row'){
          inst_rotate = 0;
        } else {
          inst_rotate = -90;
        }
        return 'rotate('+ inst_rotate +')';
      });

    axis_slider_container
      .append('rect')
      .style('height', slider_length + 'px')
      .style('width', '25px')
      .style('fill', 'white');

    build_single_dendro_slider(regl, cgm, inst_axis);
  });

}