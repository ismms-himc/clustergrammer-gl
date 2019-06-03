module.exports = function build_control_panel(regl, cgm){

  var params = cgm.params;
  params.tooltip_id = '#d3-tip_' + params.root.replace('#','');

  var tooltip = require('d3-tip').default()
                   .attr('id', params.tooltip_id.replace('#',''))
                   .attr('class', 'cgm-tooltip')
                   .direction('sw')
                   .html(function(){
                      return '';
                    });

  params.tooltip_fun = tooltip;

  var control_container = d3.select(params.root + ' .control-container')[0][0];
  var i_height = 135;
  var i_width = params.viz_width;

  var control_panel_color = 'white';
  var text_color = '#47515b';
  var button_color = '#eee';

  var control_svg = d3.select(control_container)
    .style('height',i_height + 'px')
    .style('width',i_width+'px')
    .append('svg')
    .style('height',i_height + 'px')
    .style('width',i_width+'px')
    .on('mouseover', function(){
      params.tooltip.in_bounds_tooltip = false;
    })

  control_svg
    .append('rect')
    .style('height',i_height + 'px')
    .style('width',i_width+'px')
    .style('position', 'absolute')
    .style('fill', control_panel_color)
    .attr('class', 'control-panel-background')
    .call(tooltip);

  require('./../tooltip/initialize_d3_tip')(params);

  cgm.show_tooltip = require('./../tooltip/show_d3_tip');
  cgm.hide_tooltip = require('./../tooltip/hide_d3_tip');

  // setting fontsize
  d3.select(params.tooltip_id)
    .style('line-height', 1.5)
    .style('font-weight', 'bold')
    .style('padding', '12px')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', '#fff')
    .style('border-radius', '2px')
    .style('pointer-events', 'none')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-size', '12px');

  // control panel border
  var border_height = 1;
  control_svg
    .append('rect')
    .classed('north_border', true)
    .style('height', '1px')
    .style('width',i_width+'px')
    .style('position', 'absolute')
    .style('stroke', '#eee')
    .style('stroke-width', 3)
    .attr('transform', function(){
      var y_trans = i_height - border_height;
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

  var order_options = ['clust', 'sum', 'var', 'alpha', 'umap'];

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


  _.each(['row', 'col'], function(i_axis){

    var axis_title = control_svg
      .append('g')
      .attr('transform', function(){
        var x_offset = 0;
        var y_offset = button_groups[i_axis].y_trans;
        return 'translate('+ x_offset  +', '+ y_offset +')';
      })

    axis_title
      .append('text')
      .classed('reorder_title', true)
      .text(i_axis.toUpperCase())
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
      .classed(i_axis + '-reorder-buttons', true);

    var active_button_color = '#0000FF75';

    // generate single button
    var button_group = reorder_buttons
      .selectAll('g')
      .data(order_options)
      .enter( )
      .append('g')
      .attr('transform', function(d, i){
        var x_offset = button_dim.x_trans * i + button_groups[i_axis].x_trans;
        return 'translate('+ x_offset  +', '+ button_groups[i_axis].y_trans +')';
      })
      .on('click', function(d){

        var clean_order = d.replace('sum', 'rank')
                           .replace('var', 'rankvar')

        // tmp preventing dispersion reordering from working
        if (params.order.inst[i_axis] != clean_order && clean_order != 'disp'){

          /* category order is already calculated */
          require('./../reorders/run_reorder')(regl, params, i_axis, d);

          d3.select(params.root + ' .' + i_axis + '-reorder-buttons')
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
        var i_color;
        if (params.order.inst[i_axis] == d){
          i_color = active_button_color;
        } else {
          i_color = button_color;
        }
        return i_color;
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

  require('../cats/build_reorder_cat_titles')(regl, cgm);
  require('./build_tree_icon')(cgm);

};