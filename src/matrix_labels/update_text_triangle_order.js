module.exports = function update_text_triangle_order(params, inst_axis){

  var inst_order = params.inst_order[inst_axis];
  var new_order = params.new_order[inst_axis];

  var inst_labels = cgm.params.text_triangles.draw[inst_axis];

  _.each(inst_labels, function(inst_label){
    console.log(inst_label)
  });

  return inst_labels

}