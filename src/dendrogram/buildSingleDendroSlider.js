var d3 = require("d3");
var change_groups = require("./changeGroups");
let custom_round = require("./../utils/customRound");

module.exports = function build_single_dendro_slider(cgm, axis) {
  let params = cgm.params;

  var slider_length = 100;
  var rect_height = slider_length + 20;
  var rect_width = 20;
  var text_color = "#47515b";

  let round_level;
  if (params.dendro.precalc_linkage) {
    round_level = 3;
  } else {
    round_level = -1;
  }

  var drag = d3
    .drag()
    .on("drag", dragging)
    .on("end", function () {
      change_groups(cgm, axis, params[axis + "_dendro_slider_value"]);
      params.is_slider_drag = false;
    });

  var slider_group = d3
    .select(params.root + " ." + axis + "_dendro_slider_svg")
    .append("g")
    .classed(axis + "_slider_group", true)
    .attr("transform", function () {
      var inst_translation;
      inst_translation =
        "translate(" + rect_width / 2 + ", " + rect_height / 10 + ")";
      return inst_translation;
    });

  slider_group
    .append("rect")
    .classed(axis + "_slider_background", true)
    .attr("height", rect_height + "px")
    .attr("width", rect_width + "px")
    .attr("fill", "red")
    .attr("transform", function () {
      var translate_string = "translate(-10, -5)";
      return translate_string;
    })
    .attr("opacity", 0);

  slider_group
    .append("line")
    .attr("stroke-width", slider_length / 7 + "px")
    .attr("stroke", "black")
    .attr("stroke-linecap", "round")
    .attr("opacity", 0.0)
    .attr("y1", 0)
    .attr("y2", function () {
      return slider_length - 2;
    })
    .on("click", click_dendro_slider);

  var offset_triangle = -slider_length / 40;
  slider_group
    .append("path")
    .attr("fill", "black")
    .attr("transform", "translate(" + offset_triangle + ", 0)")
    .attr("d", function () {
      // up triangle
      var start_x = 0;
      var start_y = 0;

      var mid_x = 0;
      var mid_y = slider_length;

      var final_x = slider_length / 10;
      var final_y = 0;

      var output_string =
        "M" +
        start_x +
        "," +
        start_y +
        " L" +
        mid_x +
        ", " +
        mid_y +
        " L" +
        final_x +
        "," +
        final_y +
        " Z";

      return output_string;
    })
    .attr("opacity", 0.35)
    .on("click", click_dendro_slider);

  var default_opacity = 0.35;
  var high_opacity = 0.6;
  slider_group
    .append("circle")
    .classed(axis + "_group_circle", true)
    .attr("r", slider_length * 0.08)
    .attr("transform", function () {
      return "translate(0, " + slider_length / 2 + ")";
    })
    .attr("fill", "blue")
    .attr("opacity", default_opacity)
    .on("mouseover", function () {
      d3.select(this).attr("opacity", high_opacity);
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", default_opacity);
    })
    .call(drag);

  // add dendrogram level text
  ///////////////////////////////
  if (params.dendro.precalc_linkage) {
    slider_group
      .append("text")
      .classed("dendro_level_text", true)
      .text(params.dendro.default_link_level)
      .attr("transform", "translate(0, 90) rotate(90)")
      .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr("font-weight", 400)
      .attr("font-size", 15)
      .attr("text-anchor", "middle")
      .attr("stroke", text_color)
      .attr("alignment-baseline", "middle")
      .attr("letter-spacing", "2px")
      .attr("cursor", "default");
  }

  // Add Increment Buttons
  if (params.dendro.increment_buttons) {
    // increment up button
    slider_group
      .append("path")
      .attr("d", function () {
        // up triangle
        var start_x = 0;
        var start_y = 10;

        var mid_x = 10;
        var mid_y = 0;

        var final_x = 20;
        var final_y = 10;

        var output_string =
          "M" +
          start_x +
          "," +
          start_y +
          " L" +
          mid_x +
          ", " +
          mid_y +
          " L" +
          final_x +
          "," +
          final_y +
          " Z";

        return output_string;
      })
      .attr("transform", function () {
        return "translate(-10, -13)";
      })
      .attr("fill", "blue")
      .attr("opacity", default_opacity)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", high_opacity);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", default_opacity);
      });

    // increment down button
    slider_group
      .append("path")
      .attr("d", function () {
        // up triangle
        var start_x = 0;
        var start_y = 0;

        var mid_x = 10;
        var mid_y = 10;

        var final_x = 20;
        var final_y = 0;

        var output_string =
          "M" +
          start_x +
          "," +
          start_y +
          " L" +
          mid_x +
          ", " +
          mid_y +
          " L" +
          final_x +
          "," +
          final_y +
          " Z";

        return output_string;
      })
      .attr("transform", function () {
        return "translate(-10, " + slider_length + ")";
      })
      .attr("fill", "blue")
      .attr("opacity", default_opacity)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", high_opacity);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", default_opacity);
      });
  }

  function dragging() {
    params.is_slider_drag = true;

    var slider_pos = d3.event.y;

    if (slider_pos < 0) {
      slider_pos = 0;
    }

    if (slider_pos > slider_length) {
      slider_pos = slider_length;
    }

    if (this.nextSibling) {
      this.parentNode.appendChild(this);
    }

    slider_pos = custom_round(slider_pos, round_level);

    // var slider_value = 10 - slider_pos/10;
    var slider_value = get_slider_value(
      slider_pos,
      params.dendro.precalc_linkage
    );

    d3.select(this).attr("transform", "translate(0, " + slider_pos + ")");

    // changing too quickly for large datasets
    // change_groups(cgm, axis, slider_value);

    params[axis + "_dendro_slider_value"] = slider_value;
  }

  function click_dendro_slider() {
    var clicked_line_position = d3.mouse(this);

    var rel_pos = custom_round(clicked_line_position[1], round_level);

    d3.select(params.root + " ." + axis + "_group_circle").attr(
      "transform",
      "translate(0, " + rel_pos + ")"
    );

    var slider_value = get_slider_value(rel_pos, params.dendro.precalc_linkage);

    params[axis + "_dendro_slider_value"] = slider_value;

    change_groups(cgm, axis, slider_value);
  }

  // convert from position along slider to a value that will be used to set
  // the group level
  function get_slider_value(slider_position, precalc_linkage) {
    let slider_value;
    if (precalc_linkage) {
      slider_value = 1 - slider_position / 100;
    } else {
      slider_value = 10 - slider_position / 10;
    }

    return slider_value;
  }
};
