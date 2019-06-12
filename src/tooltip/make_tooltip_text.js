var make_dendro_tooltip = require('./make_dendro_tooltip');
var hzome_functions = require('./hzome_functions')

module.exports = function make_tooltip_text(params){

  var hzome = hzome_functions(params);

  var inst_axis;
  var tooltip_text;
  var mouseover = params.int.mouseover;

  if (params.tooltip.tooltip_type === 'matrix-cell'){

    // Matrix-Cell Tooltip
    ////////////////////////

    // row name
    tooltip_text = mouseover.row.name;
    tooltip_text = tooltip_text + ' and ';

    // col name
    tooltip_text = tooltip_text + mouseover.col.name;
    tooltip_text = tooltip_text + ' <br>value: ' + mouseover.value.toFixed(3);

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(tooltip_text);

  } else if (params.tooltip.tooltip_type.indexOf('-label') > 0){

    // Label Tooltip
    //////////////////
    inst_axis = params.tooltip.tooltip_type.split('-')[0];
    tooltip_text = mouseover[inst_axis].name;

    _.each(mouseover[inst_axis].cats, function(inst_cat){
      tooltip_text = tooltip_text + '<br>' + inst_cat
    });

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(tooltip_text);


    hzome.get_request('tmp', mouseover[inst_axis].name);

  } else if (params.tooltip.tooltip_type.indexOf('-dendro') > 0){

    // Dendro Tooltip
    //////////////////
    inst_axis = params.tooltip.tooltip_type.split('-')[0];
    make_dendro_tooltip(params, inst_axis);

  } else if (params.tooltip.tooltip_type.indexOf('-cat-') > 0){

    // Category Tooltip
    /////////////////////
    inst_axis = params.tooltip.tooltip_type.split('-')[0];
    var inst_index = params.tooltip.tooltip_type.split('-')[2];

    tooltip_text = mouseover[inst_axis].cats[inst_index]

    params.tooltip_fun.show('tooltip');
    d3.select(params.tooltip_id)
      .html(tooltip_text);

  }

};