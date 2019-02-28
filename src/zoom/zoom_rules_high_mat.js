var interactionEvents = require('./../interactions/interaction-events');
var extend = require('xtend/mutable');
var track_interaction_zoom_data = require('./../interactions/track_interaction_zoom_data');
var hide_d3_tip = require('./../tooltip/hide_d3_tip');

var run_reorder = require('./../reorders/run_reorder');

module.exports = function zoom_rules_high_mat(regl, params){

  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});

  var element = options.element;

  /////////////////////////////////////////
  // Original interaction tracking
  /////////////////////////////////////////

  interactionEvents({
    element: element,
  })
  .on('interaction', function(ev){
    track_interaction_zoom_data(regl, params, ev);

    hide_d3_tip(params);

  })
  .on('interactionend', function(){


    if (params.ani.time - params.ani.last_click < params.ani.dblclick_duration){

      // update col custom order
      var full_name;
      if (params.labels.titles.col !== ''){
        full_name = params.labels.titles.col + ': ' +
                    params.int.mouseover.col.name;
      } else {
        full_name = params.int.mouseover.col.name;
      }

      var found_col_index = _.indexOf(params.network.col_node_names, full_name);

      var mat = params.mat_data;
      var tmp_arr = [];

      // row_nodes.forEach(function(node, index) {
      //   tmp_arr.push( mat[index].row_data[inst_col].value);
      // });

      _.each(mat, function(inst_row){
        tmp_arr.push(inst_row[found_col_index]);
        // tmp_arr.push(inst_row[28]);
      });

      // sort the cols
      var tmp_sort = d3.range(tmp_arr.length).sort(function(a, b) {
        return tmp_arr[b] - tmp_arr[a];
      });

      _.map(params.network.row_nodes, function(inst_node, node_index){
        inst_node.custom = params.labels.num_row - tmp_sort[node_index]
      })

      // sort array says which index contains highest lowest values
      // convert to name list
      var ordered_names = [];
      _.map(tmp_sort, function(inst_index){
        ordered_names.push(params.network.row_nodes[inst_index].name);
      })

      params.network.row_nodes.forEach(function(node){
        node.custom = params.labels.num_row - _.indexOf(ordered_names, node.name) - 1;
      })

      run_reorder(regl, params, 'row', 'custom');

    } else {

      params.ani.last_click = params.ani.time;

    }

  });

};