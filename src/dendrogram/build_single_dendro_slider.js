var d3 = require("d3");
var change_groups = require('./change_groups');
// var position_dendro_slider = require('./position_dendro_slider');

module.exports = function build_single_dendro_slider(regl, params, inst_axis){

  // n is the number of decimal points to round to
  function custom_round(x, n) {
    return n == null ? Math.round(x) : Math.round(x * (n = Math.pow(10, n))) / n;
  }

  var slider_length = 100;
  var rect_height = slider_length + 20;
  var rect_width = 20;

  var drag = d3.drag()
      .on('drag', dragging)
      .on('end', function(){
        params.is_slider_drag = false;
      });

  var slider_group = d3.select(params.root + ' .'+ inst_axis +'_dendro_slider_svg')
      .append('g')
      .classed( inst_axis + '_slider_group', true)
      .attr('transform', function(){
        var inst_translation;
        inst_translation = 'translate(' + rect_width/2 + ', '+ rect_height/10 +')';
        return inst_translation;
      })

  slider_group
    .append('rect')
    .classed(inst_axis+'_slider_background', true)
    .attr('height', rect_height+'px')
    .attr('width', rect_width+'px')
    .attr('fill', 'red')
    .attr('transform', function(){
      var translate_string = 'translate(-10, -5)';
      return translate_string;
    })
    .style('opacity', 0);

  slider_group
    .append('line')
    .style('stroke-width', slider_length/7+'px')
    .style('stroke', 'black')
    .style('stroke-linecap', 'round')
    .style('opacity', 0.0)
    .attr('y1', 0)
    .attr('y2', function(){
      return slider_length-2;
    })
    .on('click', click_dendro_slider);

  var offset_triangle = -slider_length/40;
  slider_group
    .append('path')
    .style('fill', 'black')
    .attr('transform', 'translate('+offset_triangle+', 0)')
    .attr('d', function() {

      // up triangle
      var start_x = 0 ;
      var start_y = 0;

      var mid_x = 0;
      var mid_y = slider_length;

      var final_x = slider_length/10;
      var final_y = 0;

      var output_string = 'M' + start_x + ',' + start_y + ' L' +
      mid_x + ', ' + mid_y + ' L' +
      final_x + ','+ final_y +' Z';

      return output_string;
    })
    .style('opacity', 0.35)
    .on('click', click_dendro_slider);


  var default_opacity = 0.35;
  var high_opacity = 0.6;
  slider_group
    .append('circle')
    .classed(inst_axis+'_group_circle', true)
    .attr('r', slider_length * 0.08)
    .attr('transform', function(){
      return 'translate(0, '+slider_length/2+')';
    })
    .style('fill', 'blue')
    .style('opacity', default_opacity)
    .on('mouseover', function(){
      d3.select(this).style('opacity', high_opacity);
    })
    .on('mouseout', function(){
      d3.select(this).style('opacity', default_opacity);
    })
    .call(drag);

  function dragging() {

    params.is_slider_drag = true;

    var slider_pos = d3.event.y;

    console.log('\n\n-------------------------------')
    console.log('initial', slider_pos)

    if (slider_pos < 0){
      slider_pos = 0;
    }

    if (slider_pos > slider_length){
      slider_pos = slider_length;
    }

    if (this.nextSibling) {
      this.parentNode.appendChild(this);
    }

    console.log('pre-round', slider_pos)
    slider_pos = custom_round(slider_pos, -1);
    console.log('post-round', slider_pos)

    // var slider_value = 10 - slider_pos/10;
    var slider_value = get_slider_value(slider_pos, 'ten_slices')

    d3.select(this).attr('transform', 'translate(0, ' + slider_pos + ')');

    change_groups(regl, params, inst_axis, slider_value);

  }

  function click_dendro_slider(){

    var clicked_line_position = d3.mouse(this);


    console.log('clicked_line_position', clicked_line_position)

    var rel_pos = custom_round(clicked_line_position[1], -1);

    d3.select(params.root+ ' .'+inst_axis+'_group_circle')
      .attr('transform', 'translate(0, '+ rel_pos + ')');

    // var slider_value = 10 - rel_pos/10;
    var slider_value = get_slider_value(rel_pos, 'ten_slices')

    change_groups(regl, params, inst_axis, slider_value);

  }

  // convert from position along slider to a value that will be used to set
  // the group level
  function get_slider_value(slider_position, slider_type='ten_slices'){

    let slider_value
    if (slider_type === 'ten_slices'){
      slider_value = 10 - slider_position/10
    } else if (slider_type === 'custom_slices'){
      slider_value = 10 - slider_position/10
    }

    console.log('slider_value', slider_value)

    return slider_value
  }

};