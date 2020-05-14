var d3 = require("d3");
// var logo_url = require("file-loader!../graham_cracker_70.png");

module.exports = function build_control_panel(){

  var cgm = this;
  var regl = cgm.regl;

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

  // var control_container = d3.select(params.root + ' .control-container')[0][0];
  var control_container = d3.select(params.root + ' .control-container')
                            ._groups[0][0];
  var i_height = 135;
  var i_width = params.viz_width;

  var control_panel_color = 'white';
  var text_color = '#47515b';
  var button_color = '#eee';

  var control_svg = d3.select(control_container)
    .attr('height',i_height + 'px')
    .attr('width',i_width+'px')
    .append('svg')
    .classed('control_svg', true)
    .attr('height',i_height + 'px')
    .attr('width',i_width+'px')
    .on('mouseover', function(){
      params.tooltip.in_bounds_tooltip = false;
    })

  control_svg
    .append('rect')
    .attr('height',i_height + 'px')
    .attr('width',i_width+'px')
    .attr('position', 'absolute')
    .attr('fill', control_panel_color)
    .attr('class', 'control-panel-background')
    .call(tooltip);

  require('./../tooltip/initialize_d3_tip')(params);

  // tooltip style
  //////////////////////////
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
    .attr('height', '1px')
    .attr('width',i_width+'px')
    .attr('position', 'absolute')
    .attr('stroke', '#eee')
    .attr('stroke-width', 3)
    .attr('transform', function(){
      var y_trans = i_height - border_height;
      return 'translate( 0, '+ y_trans +')';
    });

  var button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 11;

  var button_groups = {};
  button_groups.row = {};
  button_groups.col = {};

  var cracker_room = 65;

  // control_svg
  //   .append('image')
  //   .image('https://amp.pharm.mssm.edu/clustergrammer/static/icons/graham_cracker_70.png')

  control_svg
    .append('svg:a')
    // .attr('xlink:href', 'https://clustergrammer.readthedocs.io/clustergrammer2.html')
    // .attr('xlink:target', '_blank')
    .append('svg:image')
    .classed('cgm-logo', true)
    .attr('x', 15)
    .attr('y', 55)
    .attr('width', 50)
    .attr('height', 50)
    // .attr('xlink:href', 'https://amp.pharm.mssm.edu/clustergrammer/static/icons/graham_cracker_70.png')
    .attr('xlink:href', 'https://raw.githubusercontent.com/ismms-himc/clustergrammer-gl/master/img/graham_cracker_144.png')
    .on('click', function(d) {
        window.open(
          'https://clustergrammer.readthedocs.io/',
          '_blank' // <- This is what makes it open in a new window.
        );
      })
    // .attr('cursor', 'pointer');
    // .attr("xlink:href", logo_url)

    // console.log(logo_url)

  var shift_x_order_buttons = 65 + cracker_room;
  button_groups.row.x_trans = shift_x_order_buttons;
  button_groups.col.x_trans = shift_x_order_buttons;

  var y_offset_buttons = 47;
  button_groups.col.y_trans = y_offset_buttons;
  button_groups.row.y_trans = button_groups.col.y_trans + button_dim.height + button_dim.buffer;

  control_svg
    .append('g')
    .classed('panel_button_titles', true)
    .classed('reorder_button_title', true)
    .on('click', function(){
      console.log('choose reordering panel')
      d3.selectAll(params.root + ' .panel_button_titles')
        .attr('opacity', 0.5)
      d3.select(this)
        .attr('opacity', 1.0)

      if (params.viz.current_panel == 'recluster') {

        console.log('switch to reorder')

        params.viz.current_panel = 'reorder'

        // modify buttons
        d3.select(params.root + ' .panel_button_title')
          .text('reorder'.toUpperCase())
        d3.select(params.root + ' .top_button_title')
          .text('COL')
        d3.select(params.root + ' .bottom_button_title')
          .text('ROW')
        d3.selectAll(params.root + ' .reorder_buttons')
          .style('display', 'block');
        d3.select(params.root + ' .run_cluster_container')
          .style('display', 'none')

        d3.selectAll(params.root + ' .dist_options')
          .style('display', 'none')
        d3.selectAll(params.root + ' .link_options_container')
          .style('display', 'none')

        // toggle_menu(cgm, 'tree_menu', 'close');
      }

    })
    .append('text')
    .text('reorder'.toUpperCase())
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('font-size', button_dim.fs)
    .attr('text-anchor', 'middle')
    .attr('stroke', text_color)
    .attr('alignment-baseline', 'middle')
    .attr('letter-spacing', '2px')
    .attr('cursor', 'default')
    .attr('transform', function(){
        var x_offset = 130 + cracker_room;
        var y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
        return 'translate( '+ x_offset +', '+ y_trans +')';
      })


  var order_options = ['clust', 'sum', 'var'];

  control_svg
    .append('rect')
    .attr('height', '1px')
    .attr('width', '220px')
    .attr('position', 'absolute')
    .attr('stroke', '#eee')
    .attr('stroke-width', 2)
    .attr('transform', function(){
      var x_offset = button_dim.x_trans - button_dim.buffer + 1 + cracker_room;
      var y_trans = y_offset_buttons - button_dim.buffer + 2;
      return 'translate( '+ x_offset +', '+ y_trans +')';
    });

  let name_dict = {}
  name_dict['col'] = 'top'
  name_dict['row'] = 'bottom'

  _.each(['row', 'col'], function(i_axis){

    var axis_title = control_svg
      .append('g')
      .classed(name_dict[i_axis] + '_button_title_container', true)
      .attr('transform', function(){
        var x_offset = 0;
        var y_offset = button_groups[i_axis].y_trans;
        return 'translate('+ x_offset  +', '+ y_offset +')';
      })

    var axis_title_offset = 35 + cracker_room;

    axis_title
      .append('text')
      .classed(name_dict[i_axis] + '_button_title', true)
      .text(i_axis.toUpperCase())
      .style('-webkit-user-select', 'none')
      .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr('font-weight', 400)
      .attr('font-size', button_dim.fs)
      .attr('text-anchor', 'middle')
      .attr('stroke', text_color)
      .attr('alignment-baseline', 'middle')
      .attr('letter-spacing', '2px')
      .attr('cursor', 'default')
      .attr('transform', 'translate('+ axis_title_offset +', '+ button_dim.height/2 +')');

    var reorder_buttons = control_svg
      .append('g');

    reorder_buttons
      .classed(i_axis + '-reorder-buttons', true);

    var active_button_color = '#8797ff' // '#0000FF75';

    // generate reorder buttons
    var button_group = reorder_buttons
      .selectAll('g')
      .data(order_options)
      .enter()
      .append('g')
      .classed('reorder_buttons', true)
      .attr('transform', function(d, i){
        var x_offset = button_dim.x_trans * i + button_groups[i_axis].x_trans;
        return 'translate('+ x_offset  +', '+ button_groups[i_axis].y_trans +')';
      })
      .on('click', function(d){

        var clean_order = d.replace('sum', 'rank')
                           .replace('var', 'rankvar')

        if (params.order.inst[i_axis] != clean_order){

          /* category order is already calculated */
          require('./../reorders/run_reorder')(regl, params, i_axis, d);

          d3.select(params.root + ' .' + i_axis + '-reorder-buttons')
            .selectAll('rect')
            .attr('stroke', button_color);

          d3.select(this)
            .select('rect')
            .attr('stroke', active_button_color);

        }
      })

    button_group
      .append('rect')
      .attr('height', button_dim.height)
      .attr('width', button_dim.width)
      .attr('fill', control_panel_color)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('stroke', function(d){
        var i_color;
        if (params.order.inst[i_axis] == d){
          i_color = active_button_color;
        } else {
          i_color = button_color;
        }
        return i_color;
      })
      .attr('stroke-width', 2.5);


    button_group
      .append('text')
      .classed('button-name', true)
      .text(function(d){
        return d.toUpperCase();
      })
      .style('-webkit-user-select', 'none')
      .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr('font-weight', 400)
      .attr('font-size', button_dim.fs)
      .attr('text-anchor', 'middle')
      .attr('stroke', text_color)
      .attr('alignment-baseline', 'middle')
      .attr('letter-spacing', '2px')
      .attr('cursor', 'default')
      .attr('transform', 'translate('+ button_dim.width/2 +', '+ button_dim.height/2 +')');

  })

  require('../cats/build_reorder_cat_titles')(regl, cgm);
  require('./build_tree_icon')(cgm);

  // row search
  var search_container = d3.select(params.root + ' .control-container')
    .append('div')
    // .classed('row',true)
    .classed('gene_search_container',true)
    .style('padding-left','10px')
    .style('padding-right','10px')
    .style('margin-top','10px');

  search_container
    .append('input')
    .classed('form-control',true)
    .classed('gene_search_box',true)
    .classed('sidebar_text', true)
    .attr('type','text')
    .attr('placeholder', 'something')
    .style('height', '20px')
    .style('margin-top', '10px');

  search_container
    .append('div')
    .classed('gene_search_button',true)
    .style('margin-top', '5px')
    .attr('data-toggle','buttons')
    .append('button')
    .classed('sidebar_text', true)
    .html('Search')
    .attr('type','button')
    .classed('btn',true)
    .classed('btn-primary',true)
    .classed('submit_gene_button',true)
    .style('width', '100%')
    .style('font-size', '14px');


};