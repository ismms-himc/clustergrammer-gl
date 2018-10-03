var run_reorder = require('./../reorders/run_reorder');
// var img = require('./../../img/graham_cracker_144.png');

module.exports = function build_control_panel(regl, cgm){

  // Add control panel to the top
  ///////////////////////////////////////

  // var control_container = d3.select(cgm.params.container).select(' .control-container')[0][0];
  var control_container = d3.select(cgm.params.root + ' .control-container')[0][0];
  var inst_height = 135;
  var inst_width = cgm.params.viz_width;

  // light panel color '#bbc3cc'
  // light button color '#e3e7ea'
  // var control_panel_color = '#eee';
  // dark text color
  // var text_color = '#2f363d';
  // button_color = text_color;
  var control_panel_color = 'white';
  var text_color = '#47515b';
  var button_color = '#eee';

  // // experimenting in different color pallets
  // control_panel_color = '#2f363d'
  // var button_color = '#e3e7ea';
  // var text_color = '#e3e7ea';

  var control_svg = d3.select(control_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .append('svg')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  control_svg
    .append('rect')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .style('position', 'absolute')
    .style('fill', control_panel_color)
    .attr('class', 'control-panel-background');

  // control panel border
  var border_height = 1;
  control_svg
    .append('rect')
    .style('height', '1px')
    .style('width',inst_width+'px')
    .style('position', 'absolute')
    .style('stroke', '#eee')
    .style('stroke-width', 3)
    .attr('transform', function(){
      var y_trans = inst_height - border_height;
      return 'translate( 0, '+ y_trans +')';
    });

  var button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 12;

  var button_groups = {};
  button_groups.row = {};
  button_groups.col = {};

  var shift_x_order_buttons = 65;
  button_groups.row.x_trans = shift_x_order_buttons;
  button_groups.col.x_trans = shift_x_order_buttons;

  var y_offset_buttons = 47;
  button_groups.col.y_trans = y_offset_buttons;
  button_groups.row.y_trans = button_groups.col.y_trans + button_dim.height + button_dim.buffer;

  var order_options = ['clust', 'sum', 'var', 'disp', 'alpha'];

  // make reorder title

  control_svg
  .append('text')
  .classed('reorder_title', true)
  .text('reorder'.toUpperCase())
  .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
  .style('font-weight', 400)
  .style('font-size', button_dim.fs)
  .style('text-anchor', 'middle')
  .style('stroke', text_color)
  .style('alignment-baseline', 'middle')
  .style('letter-spacing', '2px')
  .style('cursor', 'default')
  .style('-webkit-user-select', 'none')
      .attr('transform', function(){
      var x_offset = 247;
      var y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
      return 'translate( '+ x_offset +', '+ y_trans +')';
    })

  control_svg
    .append('rect')
    .style('height', '1px')
    .style('width', function(){
      var tmp_width = (order_options.length  + 1) * button_dim.width - button_dim.buffer;
      return tmp_width;
    })
    .style('position', 'absolute')
    .style('stroke', '#eee')
    .style('stroke-width', 2)
    .attr('transform', function(){
      var x_offset = button_dim.x_trans - button_dim.buffer + 1;
      var y_trans = y_offset_buttons - button_dim.buffer + 2;
      return 'translate( '+ x_offset +', '+ y_trans +')';
    });


  _.each(['row', 'col'], function(inst_axis){

    var axis_title = control_svg
      .append('g')
      .attr('transform', function(){
        var x_offset = 0;
        var y_offset = button_groups[inst_axis].y_trans;
        return 'translate('+ x_offset  +', '+ y_offset +')';
      })

    axis_title
      .append('text')
      .classed('reorder_title', true)
      .text(inst_axis.toUpperCase())
      .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .style('font-weight', 400)
      .style('font-size', button_dim.fs)
      .style('text-anchor', 'middle')
      .style('stroke', text_color)
      .style('alignment-baseline', 'middle')
      .style('letter-spacing', '2px')
      .style('cursor', 'default')
      .style('-webkit-user-select', 'none')
      .attr('transform', 'translate('+ 30 +', '+ button_dim.height/2 +')');

    var reorder_buttons = control_svg
      .append('g');

    reorder_buttons
      .classed(inst_axis + '-reorder-buttons', true);

    var active_button_color = '#0000FF75';

    // generate single button
    var button_group = reorder_buttons
      .selectAll('g')
      .data(order_options)
      .enter( )
      .append('g')
      .attr('transform', function(d, i){
        var x_offset = button_dim.x_trans * i + button_groups[inst_axis].x_trans;
        return 'translate('+ x_offset  +', '+ button_groups[inst_axis].y_trans +')';
      })
      .on('click', function(d){

        var clean_order = d.replace('sum', 'rank')
                           .replace('var', 'rankvar')

        // tmp preventing dispersion reordering from working
        if (cgm.params.order.inst[inst_axis] != clean_order && clean_order != 'disp'){

          /* category order is already calculated */
          // d = d.replace('alpha', 'cat_1_index')
          run_reorder(regl, cgm, inst_axis, d);

          d3.select(cgm.params.root + ' .' + inst_axis + '-reorder-buttons')
            .selectAll('rect')
            .style('stroke', button_color);

          d3.select(this)
            .select('rect')
            .style('stroke', active_button_color);

        }
      })

    button_group
      .append('rect')
      .style('height', button_dim.height)
      .style('width', button_dim.width)
      .style('fill', control_panel_color)
      .style('rx', 10)
      .style('ry', 10)
      .style('stroke', function(d){
        var inst_color;
        if (cgm.params.order.inst[inst_axis] == d){
          inst_color = active_button_color;
        } else {
          inst_color = button_color;
        }
        return inst_color;
      })
      .style('stroke-width', 2.5);


    button_group
      .append('text')
      .classed('button-name', true)
      .text(function(d){
        return d.toUpperCase();
      })
      .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .style('font-weight', 400)
      .style('font-size', button_dim.fs)
      .style('text-anchor', 'middle')
      .style('stroke', text_color)
      .style('alignment-baseline', 'middle')
      .style('letter-spacing', '2px')
      .style('cursor', 'default')
      .style('-webkit-user-select', 'none')
      .attr('transform', 'translate('+ button_dim.width/2 +', '+ button_dim.height/2 +')');

  })

  // control_svg.append('svg:image')
  // .attr('x', 16)
  // .attr('y', 5)
  // .attr('width', 27)
  // .attr('height', 27)
  // .attr('xlink:href', img)
  // .classed('clustergrammer-logo', true)
  // // .on('click', function(){
  // //   console.log('clicking logo')
  // // });

  /*
  Make Column Reorder titles
      d3.select(viz.viz_svg)
      .selectAll()
      .data(viz.all_cats.col)
      .enter()
      .append('text')
      .classed('col_cat_super', true)
      .style('font-size', cat_text_size+'px')
      .style('opacity', cat_super_opacity)
      .style('cursor','default')
      .attr('transform', function(d){
        var inst_cat = parseInt( d.split('-')[1], 10);
        var inst_y = y_offset + extra_y_room * viz.cat_room.symbol_width
          * inst_cat;
        return 'translate('+x_offset+','+inst_y+')';
      })
      .text(function(d){
        return get_cat_title(viz, d, 'col');
      });
  */

  var params = cgm.params;

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
    // .style('width', dim_x + 'px')
    // .style('height', dim_y + 'px')
    // .style('fill', 'black')
    // .on('dblclick', function(d, i){
    //   run_reorder(regl, cgm, 'col', 'cat_' + String(i) + '_index');
    // })
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
      run_reorder(regl, cgm, 'col', 'cat_' + String(i) + '_index');
    })
    .attr('transform', function(d, i){
      var y_trans = (dim_y + 2)* i ;
      return 'translate( 0, '+ y_trans +')';
    })
    .style('user-select', none);

};