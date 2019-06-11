module.exports = function cat_breakdown_bars(params, cat_data, cat_graph_group,
                                             title_height, bars_index, max_bars,
                                             cat_bar_groups){

  var paragraph_string = '<p>';
  var super_string = ': ';

  var bar_width  = params.viz.cat_bar_width;
  var bar_height = params.viz.cat_bar_height;
  var max_len = 25;

  var max_bar_value = cat_data.bar_data[0][bars_index];
  // // only keep the top max_bars categories
  // cat_data.bar_data = cat_data.bar_data.slice(0, max_bars);

  // console.log('cat_data.length', cat_data.bar_data.length)

  var i_title = cat_data.type_name;
  if (i_title.length >= max_len){
    i_title = i_title.slice(0, max_len) + '..';
  }

  // make title
  cat_graph_group
    .append('text')
    .classed('cat_graph_title', true)
    .text(i_title)
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800);

  var line_y = 4;
  cat_graph_group
    .append('line')
    .attr('x1', 0)
    .attr('x2', bar_width)
    .attr('y1', line_y)
    .attr('y2', line_y)
    .attr('stroke', 'blue')
    .attr('stroke-width', 1)
    .attr('opacity', 1.0);

  // bar length is max when all nodes in cluster are of
  // a single cat
  var bar_scale = d3.scale.linear()
                    .domain([0, max_bar_value])
                    .range([0, bar_width]);

  // make bars
  cat_bar_groups
    .append('rect')
    .attr('height', bar_height+'px')
    .attr('width', function(d){
      var i_width = bar_scale(d[bars_index]);
      return i_width +'px';
    })
    .attr('fill', function(d){
      // cat color is stored in the third element
      return d[3];
    })
    .attr('opacity', params.viz.cat_colors.opacity)
    .attr('stroke', 'grey')
    .attr('stroke-width', '0.5px');

  // make bar labels
  cat_bar_groups
    .append('text')
    .classed('bar_labels', true)
    .text(function(d){
      var i_text = d[1];
      if (i_text.indexOf(super_string) > 0){
        i_text = i_text.split(super_string)[1];
      }
      if (i_text.indexOf(paragraph_string) > 0){
        // required for Enrichr category names (needs improvements)
        i_text = i_text.split(paragraph_string)[0];
      }
      // ensure that bar name is not too long
      if (i_text.length >= max_len){
        i_text = i_text.slice(0,max_len) + '..';
      }
      return i_text;
    })
    .attr('transform', function(){
      return 'translate(5, ' + 0.75 * bar_height + ')' ;
    })
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'right');

};