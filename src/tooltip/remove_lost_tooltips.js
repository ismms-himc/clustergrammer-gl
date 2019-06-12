module.exports = function remove_lost_tooltips(params){
  // remove any other tooltips left behind by another heatmap
  d3.selectAll('.cgm-tooltip').each(
    function(){
    var inst_id = d3.select(this).attr('id').split('_')[1];
    if(d3.select('#'+inst_id).empty()){
      d3.select(this).style('display', 'none')
    }
  });
};