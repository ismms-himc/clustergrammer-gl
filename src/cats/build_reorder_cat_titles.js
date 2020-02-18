var d3 = require("d3");
var run_reorder = require('./../reorders/run_reorder');

module.exports = function build_reorder_cat_titles(regl, cgm){

  var params = cgm.params;
  var button_color = '#eee';

  // Column Titles
  var pos_x = 845;
  var pos_y = 125;
  var col_cat_title_group = d3.select(params.root + ' .canvas-container')
    .append('g')
    .style('position', 'absolute')
    .style('top', pos_y + 'px')
    .style('left', pos_x + 'px')
    .classed('col-cat-title-group', true);

  var dim_x = 55;
  var dim_y = 10;

  var col_cat_title_svg = col_cat_title_group
    .append('svg')
    .style('height', function(){
      var svg_height = dim_y * params.cat_data.col.length + 5;
      return svg_height  + 'px'
    })
    .style('width', dim_x + 'px')
    .classed('col-cat-title-svg', true);

  var col_cat_reorder_group = col_cat_title_svg
    .append('g')
    .classed('col-cat-reorder-group', true);

  col_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.col)
    .enter()
    .append('text')
    .text(function(d){
      return d.cat_title;
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .style('font-size', 12)
    .attr('transform', function(d, i){
      var y_trans = (dim_y + 1) * i + 10 ;
      return 'translate( 0, '+ y_trans +')';
    })

  col_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.col)
    .enter()
    .append('rect')
    .style('width', dim_x + 'px')
    .style('height', function(){
      var rect_height = dim_y + 2;
      return rect_height + 'px'
    })
    .style('fill', 'white')
    .style('opacity', 0.0)
    .on('dblclick', function(d, i){

      run_reorder(regl, params, 'col', 'cat_' + String(i) + '_index');

      params.order.inst.col = 'cat_' + String(i) + '_index';

      d3.select(params.root + ' .col-reorder-buttons')
        .selectAll('rect')
        .style('stroke', button_color);

    })
    .attr('transform', function(d, i){
      var y_trans = (dim_y + 2)* i ;
      return 'translate( 0, '+ y_trans +')';
    })
    .style('user-select', 'none');


  // Row Titles
  pos_x = 125;
  // var pos_y = 98; // 60 with no cats, 72 with one cat, 85 with two cats
  pos_y = 62 + 12 * params.cat_data.col.length;
  var row_cat_title_group = d3.select(params.root + ' .canvas-container')
    .append('g')
    .style('position', 'absolute')
    .style('top', pos_y + 'px')
    .style('left', pos_x + 'px')
    .classed('row-cat-title-group', true);

  var row_dim_x = 60;
  var row_dim_y = 10;

  var row_cat_title_svg = row_cat_title_group
    .append('svg')
    .style('width', function(){
      var svg_height = row_dim_y * params.cat_data.row.length + 5;
      return svg_height  + 'px'
    })
    .style('height', row_dim_x + 'px')
    .classed('row-cat-title-svg', true);

  var inst_rotate;
  var row_cat_reorder_group = row_cat_title_svg
    .append('g')
    .classed('row-cat-reorder-group', true)
    .attr('transform', function(){
        inst_rotate = -90;
        return 'translate(0,' + row_dim_x + '), rotate('+ inst_rotate +')';
      });

  row_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.row)
    .enter()
    .append('text')
    .text(function(d){
      return d.cat_title;
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .style('font-size', 12)
    .attr('transform', function(d, i){
      var y_trans = (row_dim_y + 1) * i  + 10 ;
      return 'translate( 0, '+ y_trans +')';
    })

  row_cat_reorder_group
    .selectAll('rect')
    .data(params.cat_data.row)
    .enter()
    .append('rect')
    .style('width', row_dim_x + 'px')
    .style('height', function(){
      var rect_height = row_dim_y + 2;
      return rect_height + 'px'
    })
    .style('fill', 'white')
    .style('opacity', 0.0)
    .on('dblclick', function(d, i){

      run_reorder(regl, params, 'row', 'cat_' + String(i) + '_index');

      params.order.inst.row = 'cat_' + String(i) + '_index';

      d3.select(params.root + ' .row-reorder-buttons')
        .selectAll('rect')
        .style('stroke', button_color);

    })
    .attr('transform', function(d, i){
      var y_trans = (row_dim_y + 2)* i ;
      return 'translate( 0, '+ y_trans +')';
    })
    .style('user-select', 'none');


};