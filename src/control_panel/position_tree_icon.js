var d3 = require("d3");
module.exports = function position_tree_icon(cgm){

  // var viz = cgm.params.viz;
  var tmp_left;
  var tmp_top;

  // keep slider near clustergram
  // var max_room = 100; // viz.svg_dim.width - 3 * viz.uni_margin;

  // position close to row dendrogram trapezoids
  tmp_left = 850; // viz.clust.margin.left + viz.clust.dim.width + 5.25  * viz.dendro_room.row;

  // if (tmp_left > max_room){
  //   tmp_left = max_room;
  // }

  // tmp_top =  viz.clust.margin.top + 3 * viz.uni_margin - 50;
  tmp_top =  100; // viz.clust.margin.top + 3 * viz.uni_margin + 90;

  // reposition tree icon
  d3.select(cgm.params.root + ' .tree_icon')
    .attr('transform', function() {
      var inst_translation;
      tmp_top = tmp_top - 75;
      inst_translation = 'translate(' + tmp_left + ',' + 65 + ')';
      return inst_translation;
    })
    .style('opacity', 1);
};