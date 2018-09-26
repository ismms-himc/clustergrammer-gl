module.exports = function generate_order_params(params){

  params.order = {};
  _.each(['inst', 'new'], function(inst_state){

    params.order[inst_state] = {};
    params.order[inst_state].row = 'clust';
    params.order[inst_state].col = 'clust';

  });

};