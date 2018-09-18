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
    })

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
        if (cgm.params.inst_order[inst_axis] != clean_order && clean_order != 'disp'){

          run_reorder(regl, cgm, inst_axis, d);

          d3.select(cgm.params.root + ' .' + inst_axis + '-reorder-buttons')
            .selectAll('rect')
            .style('stroke', button_color);

          d3.select(this)
            .select('rect')
            .style('stroke', 'red');

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
        if (cgm.params.inst_order[inst_axis] == d){
          inst_color = 'red';
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

};