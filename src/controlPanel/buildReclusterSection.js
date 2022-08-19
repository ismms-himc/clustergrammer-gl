var d3 = require("d3");
// var position_tree_icon = require('./positionTreeIcon');
var toggle_menu = require("./toggleMenu");
// var make_tree_menu = require('./makeTreeMenu');
let draw_webgl_layers = require("./../draws/drawWebglLayers");

module.exports = function build_recluster_section(cgm) {
  var slider_length = 40;
  var params = cgm.params;
  var default_opacity = 0.35;
  var high_opacity = 0.6;
  var y_offset_buttons = 47;
  var cracker_room = 65;

  var button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 11;

  var control_panel_color = "white";
  var text_color = "#47515b";
  var button_color = "#eee";
  var active_run_color = "#00FF75";
  let active_button_color = "#008000";

  control_svg = d3.select(params.root + " .control-container svg");

  control_svg
    .append("g")
    .classed("panel_button_titles", true)
    .classed("recluster_button_title", true)
    .on("click", function () {
      // console.log('choose recluster panel')
      d3.selectAll(params.root + " .panel_button_titles").attr("opacity", 0.5);
      d3.select(this).attr("opacity", 1.0);

      if (params.viz.current_panel === "reorder") {
        // console.log('switch to recluster')

        // modify buttons
        d3.select(params.root + " .panel_button_title").text(
          "recluster".toUpperCase()
        );
        d3.select(params.root + " .top_button_title").text("DIST");
        d3.select(params.root + " .bottom_button_title").text("LINK");
        d3.selectAll(params.root + " .reorder_buttons").style(
          "display",
          "none"
        );
        d3.select(params.root + " .run_cluster_container").style(
          "display",
          "block"
        );

        d3.selectAll(params.root + " .dist_options").style("display", "block");
        d3.selectAll(params.root + " .link_options_container").style(
          "display",
          "block"
        );

        params.viz.current_panel = "recluster";
      }
    })
    .attr("transform", function () {
      var x_offset = 200 + cracker_room;
      var y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
      return "translate( " + x_offset + ", " + y_trans + ")";
    })
    .attr("opacity", 0.5)
    .append("text")
    .text("recluster".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default");

  run_cluster_container = d3
    .select(params.root + " .control_svg")
    .append("g")
    .classed("run_cluster_container", true)
    .attr("transform", "translate(" + 350 + ", " + 91 + ")")
    .on("click", function () {
      // console.log('click run button!!!!!!!')

      if (
        params.matrix.potential_recluster.distance_metric !=
          cgm.params.matrix.distance_metric ||
        params.matrix.potential_recluster.linkage_type !=
          cgm.params.matrix.linkage_type
      ) {
        // transfer parameters to cgm object when update is pressed
        cgm.params.matrix.distance_metric =
          params.matrix.potential_recluster.distance_metric;
        cgm.params.matrix.linkage_type =
          params.matrix.potential_recluster.linkage_type;
        cgm.recluster(
          params.matrix.potential_recluster.distance_metric,
          params.matrix.potential_recluster.linkage_type
        );
      }
    })
    .style("display", "none");

  run_cluster_container
    .append("rect")
    .style("height", button_dim.height)
    .style("width", button_dim.width)
    .style("fill", control_panel_color)
    .style("rx", 10)
    .style("ry", 10)
    .style("stroke", active_run_color)
    .style("stroke-width", 2.5);

  run_cluster_container
    .append("text")
    .classed("button-name", true)
    .text("run".toUpperCase())
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .style("font-size", button_dim.fs)
    .style("text-anchor", "middle")
    .style("stroke", text_color)
    .style("alignment-baseline", "middle")
    .style("letter-spacing", "2px")
    .style("cursor", "default")
    // .style('-webkit-user-select', 'none')
    .attr(
      "transform",
      "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
    );

  ///////////////////////////
  // Recluster Options
  ///////////////////////////

  var dist_options = [
    {
      short: "cos",
      full: "cosine",
    },
    {
      short: "corr",
      full: "correlation",
    },
    {
      short: "eucl",
      full: "euclidean",
    },
  ];

  let dist_dict = {};
  dist_dict["cosine"] = "cos";
  dist_dict["correlation"] = "corr";
  dist_dict["euclidean"] = "eucl";

  var cracker_room = 65;
  var shift_x_order_buttons = 65 + cracker_room;
  // button_groups.col.y_trans + button_dim.height + button_dim.buffer;

  let y_offset_top = 47;
  let y_offset_bottom = 91;

  // Distance Options Container
  ////////////////////////////////
  dist_options = d3
    .select(params.root + " .control_svg")
    .append("g")
    .classed("dist_option_container", true)
    .selectAll("g")
    .data(dist_options)
    .enter()
    .append("g")
    .classed("dist_options", true)
    .attr("transform", function (d, i) {
      var x_offset = button_dim.x_trans * i + shift_x_order_buttons;
      return "translate(" + x_offset + ", " + y_offset_top + ")";
    })
    .on("click", function (d) {
      // console.log('clicking distance button', d.full)

      params.matrix.potential_recluster.distance_metric = d.full;

      d3.select(params.root + " .dist_option_container")
        .selectAll("rect")
        .attr("stroke", button_color);

      d3.select(this).select("rect").attr("stroke", active_button_color);
    })
    .style("display", "none");

  dist_options
    .append("rect")
    .style("height", button_dim.height)
    .style("width", button_dim.width)
    .style("fill", control_panel_color)
    .style("rx", 10)
    .style("ry", 10)
    .attr("stroke", function (d) {
      var i_color;
      if (dist_dict[params.matrix.distance_metric] == d.short) {
        i_color = active_button_color;
      } else {
        i_color = button_color;
      }
      return i_color;
    })
    .style("stroke-width", 2.5);

  dist_options
    .append("text")
    .classed("button-name", true)
    .text((d) => d.short.toUpperCase())
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .style("font-size", button_dim.fs)
    .style("text-anchor", "middle")
    .style("stroke", text_color)
    .style("alignment-baseline", "middle")
    .style("letter-spacing", "2px")
    .style("cursor", "default")
    .style("-webkit-user-select", "none")
    .attr(
      "transform",
      "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
    );

  // Linkage Options Container
  ////////////////////////////////
  var link_options = [
    {
      short: "avg",
      full: "average",
    },
    {
      short: "single",
      full: "single",
    },
    {
      short: "cmplt",
      full: "complete",
    },
  ];
  let link_dict = {};
  link_dict["average"] = "avg";
  link_dict["single"] = "single";
  link_dict["complete"] = "cmplt";

  link_options_container = d3
    .select(params.root + " .control_svg")
    .append("g")
    .classed("link_option_container", true)
    .selectAll("g")
    .data(link_options)
    .enter()
    .append("g")
    .classed("link_options_container", true)
    .attr("transform", function (d, i) {
      var x_offset = button_dim.x_trans * i + shift_x_order_buttons;
      return "translate(" + x_offset + ", " + y_offset_bottom + ")";
    })
    .on("click", function (d) {
      // console.log('clicking linkage button', d.full)
      params.matrix.potential_recluster.linkage_type = d.full;

      d3.select(params.root + " .link_option_container")
        .selectAll("rect")
        .attr("stroke", button_color);

      d3.select(this).select("rect").attr("stroke", active_button_color);
    })
    .style("display", "none");

  link_options_container
    .append("rect")
    .style("height", button_dim.height)
    .style("width", button_dim.width)
    .style("fill", control_panel_color)
    .style("rx", 10)
    .style("ry", 10)
    .attr("stroke", function (d) {
      var i_color;
      if (link_dict[params.matrix.linkage_type] == d.short) {
        i_color = active_button_color;
      } else {
        i_color = button_color;
      }
      return i_color;
    })
    .style("stroke-width", 2.5);

  link_options_container
    .append("text")
    .classed("button-name", true)
    .text((d) => d.short.toUpperCase())
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .style("font-size", button_dim.fs)
    .style("text-anchor", "middle")
    .style("stroke", text_color)
    .style("alignment-baseline", "middle")
    .style("letter-spacing", "2px")
    .style("cursor", "default")
    .style("-webkit-user-select", "none")
    .attr(
      "transform",
      "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
    );

  // Normalize Section
  ///////////////////////////////////////////////
  if (params.norm.initial_status === "zscored") {
    control_svg
      .append("g")
      .classed("panel_button_titles", true)
      .classed("normalize_button_title", true)
      .on("click", function () {
        console.log("clicked Z-score Button");

        let params = cgm.params;

        if (params.norm.zscore_status === "non-zscored") {
          params.norm.zscore_status = "zscored";

          d3.select(this).select("text").text("z-scored".toUpperCase());
        } else {
          params.norm.zscore_status = "non-zscored";

          d3.select(this).select("text").text("raw".toUpperCase());
        }

        console.log("zscore_status", params.norm.zscore_status);
        cgm.make_matrix_args();
        draw_webgl_layers(cgm);
      })
      .attr("transform", function () {
        var x_offset = 290 + cracker_room;
        var y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
        return "translate( " + x_offset + ", " + y_trans + ")";
      })
      .attr("opacity", 1.0)
      .append("text")
      .text("z-scored".toUpperCase())
      .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr("font-weight", 400)
      .attr("font-size", button_dim.fs)
      .attr("text-anchor", "middle")
      .attr("stroke", text_color)
      .attr("alignment-baseline", "middle")
      .attr("letter-spacing", "2px")
      .attr("cursor", "default");
  }
};
