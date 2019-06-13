module.exports = function initialize_containers(args){

  var base_container = args.container;

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

  var canvas_container = d3.select(base_container)
                           .select('.canvas-container')[0][0];

  var inst_height = args.viz_height;
  var inst_width  = args.viz_width;

  d3.select(canvas_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  return canvas_container;
};