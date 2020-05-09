var d3 = require("d3");
module.exports = function initialize_containers(){

  var base_container = this.args.container;

  // make control panel (needs to appear above canvas)
  d3.select(base_container)
    .append('div')
    .attr('class', 'control-container')
    .style('cursor', 'default');

  // make canvas container
  d3.select(base_container)
    .append('div')
    .attr('class', 'canvas-container')
    .style('position', 'absolute')
    .style('cursor', 'default');

  // console.log('base_container')
  // debugger
  // console.log(base_container)

  // var canvas_container = d3.select(base_container)
  //                          .select('.canvas-container')[0][0];

  // var canvas_container = d3.select('#' + base_container.id + ' .canvas_container');

  var canvas_container = d3.select(base_container)
                           .select('.canvas-container')._groups[0][0];




  var inst_height = this.args.viz_height;
  var inst_width  = this.args.viz_width;

  d3.select(canvas_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  // console.log(canvas_container)
  this.canvas_container = canvas_container;
  // return canvas_container;
};