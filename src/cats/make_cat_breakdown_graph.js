var d3 = require("d3");
module.exports = function make_cat_breakdown_graph(params, dendro_info, cb){

  if (cb.length > 0){

    var width = 370;
    var title_height = 27;
    var bar_offset = 23;

    // these are the indexes where the number-of-nodes and the number of downsampled
    // nodes are stored
    var num_nodes_index = 4;
    var num_nodes_ds_index = 5;

    var is_downsampled = false;
    if (cb[0].bar_data[0][num_nodes_ds_index] !== null){
      width = width + 100;
      is_downsampled = true;
    }

    // the index that will be used to generate the bars (will be different if
    // downsampled)
    var cluster_total = dendro_info.all_names.length;
    var bars_index = num_nodes_index;
    if (is_downsampled){
      bars_index = num_nodes_ds_index;

      // calculate the total number of nodes in downsampled case
      var i_bar_data = cb[0].bar_data;
      cluster_total = 0;
      _.each(i_bar_data, function(tmp_data){
        cluster_total = cluster_total + tmp_data[num_nodes_ds_index];
      });
    }

    // limit on the number of category types shown
    var max_cats = 3;
    // limit the number of bars shown
    var max_bars = 10;

    // calculate height needed for svg based on cb data
    var svg_height = 20;
    _.each(cb.slice(0,max_cats), function(tmp_break){
      var num_bars = tmp_break.bar_data.length;
      if (num_bars > max_bars){
        num_bars = max_bars;
      }
      svg_height = svg_height + title_height * (num_bars + 1);
    });

    var main_dendro_svg = d3.select(params.tooltip_id)
      .append('div')
      .style('margin-top','5px')
      .classed('cat_graph', true)
      .append('svg')
      .style('height', svg_height+'px')
      .style('width', width+'px');

    // make background
    main_dendro_svg
      .append('rect')
      .classed('cat_background', true)
      .attr('height', svg_height+'px')
      .attr('width', width+'px')
      .attr('fill', 'white')
      .attr('opacity', 1);

    // limit the category-types
    cb = cb.slice(0, max_cats);

    // console.log(cb.length)
    // debugger;

    // shift the position of the numbers based on the size of the number
    // offset the count column based on how large the counts are
    var digit_offset = d3.scaleLinear()
                               .domain([0,100000]).range([20, 30]);

    // the total amout to shift down the next category
    var shift_down = title_height;

    _.each(cb, function(cat_data){

      var max_bar_value = cat_data.bar_data[0][bars_index];

      // only keep the top max_bars categories
      cat_data.bar_data = cat_data.bar_data.slice(0, max_bars);

      var count_offset = digit_offset(max_bar_value);

      var cgg = main_dendro_svg
        .append('g')
        .classed('cgg', true)
        .attr('transform', 'translate(10, '+ shift_down + ')');

        var cat_bar_container = cgg
          .append('g')
          .classed('cat_bar_container', true)
          .attr('transform', 'translate(0, 10)');

        // make bar groups (hold bar and text)
        var cat_bar_groups = cat_bar_container
          .selectAll('g')
          .data(cat_data.bar_data)
          .enter()
          .append('g')
          .attr('transform', function(d, i){
            var i_y = i * bar_offset;
            return 'translate(0,'+ i_y +')';
          });

      require('./cat_breakdown_bars')(params, cat_data, cgg,
                                      title_height, bars_index, max_bars,
                                      cat_bar_groups);

      require('./cat_breakdown_values')(params, cgg, cat_bar_groups,
                                        num_nodes_index, is_downsampled,
                                        count_offset, bars_index, cluster_total);

      // shift down based on number of bars
      shift_down = shift_down + title_height * (cat_data.bar_data.length + 1);

    });

  }

};