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

    // console.log('interacting!')
    hide_d3_tip(params);

  })
  .on('interactionend', function(){

    console.log('clicking')

    if (params.animation.time - params.animation.last_click < params.animation.dblclick_duration){

      console.log('double click',
                   params.interact.mouseover.row.name,
                   params.interact.mouseover.col.name);

      // update col custom order
      var full_name;
      if (params.labels.titles.col !== ''){
        full_name = params.labels.titles.col + ': ' +
                    params.interact.mouseover.col.name;
      }


      var inst_index = _.indexOf(params.network.col_node_names, full_name);

      console.log('full_name', full_name, inst_index);


      mat = params.mat_data;
      tmp_arr = [];
      // row_nodes.forEach(function(node, index) {
      //   tmp_arr.push( mat[index].row_data[inst_col].value);
      // });


      _.each(mat, function(inst_row){
        tmp_arr.push(inst_row[inst_index]);
      })

      console.log('tmp_arr')
      console.log(tmp_arr)

      run_reorder(regl, cgm, 'row', 'custom');

    } else {

      params.animation.last_click = params.animation.time;

    }

  });

};