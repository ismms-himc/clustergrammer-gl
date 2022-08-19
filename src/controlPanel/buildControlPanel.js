/* eslint-disable no-invalid-this */
import * as d3 from "d3";
import d3Tip from "d3-tip";
import buildReorderCatTitles from "../cats/buildReorderCatTitles";
import build_opacity_slider from "../colors/buildOpacitySlider";
import download_matrix from "../download/downloadMatrix";
import download_metadata from "../download/downloadMetadata";
import draw_webgl_layers from "../draws/drawWebglLayers";
import runReorder from "../reorders/runReorder";
import initializeD3Tip from "../tooltip/initializeD3Tip";
import buildReclusterSection from "./buildReclusterSection";

export default function build_control_panel(cgm) {
  const regl = cgm.regl;
  const params = cgm.params;
  params.tooltip_id = "#d3-tip_" + params.root.replace("#", "");
  const tooltip = d3Tip
    .default()
    .attr("id", params.tooltip_id.replace("#", ""))
    .attr("class", "cgm-tooltip")
    .direction("sw")
    .html(function () {
      return "";
    });
  params.tooltip_fun = tooltip;
  const control_container = d3.select(params.root + " .control-container")
    ._groups[0][0];
  const i_height = 135;
  const i_width = params.viz_width;
  const control_panel_color = "white";
  const text_color = "#47515b";
  const button_color = "#eee";
  const control_svg = d3
    .select(control_container)
    .attr("height", i_height + "px")
    .attr("width", i_width + "px")
    .append("svg")
    .classed("control_svg", true)
    .attr("height", i_height + "px")
    .attr("width", i_width + "px")
    .on("mouseover", function () {
      params.tooltip.in_bounds_tooltip = false;
    });
  control_svg
    .append("rect")
    .attr("height", i_height + "px")
    .attr("width", i_width + "px")
    .attr("position", "absolute")
    .attr("fill", control_panel_color)
    .attr("class", "control-panel-background")
    .call(tooltip);
  initializeD3Tip(params);
  // tooltip style
  // ////////////////////////
  d3.select(params.tooltip_id)
    .style("line-height", 1.5)
    .style("font-weight", "bold")
    .style("padding-top", "3px")
    .style("padding-bottom", "7px")
    .style("padding-left", "10px")
    .style("padding-right", "10px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border-radius", "2px")
    .style("pointer-events", "none")
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-size", "12px");
  // control panel border
  const border_height = 1;
  control_svg
    .append("rect")
    .classed("north_border", true)
    .attr("height", "1px")
    .attr("width", i_width + "px")
    .attr("position", "absolute")
    .attr("stroke", "#eee")
    .attr("stroke-width", 3)
    .attr("transform", function () {
      const y_trans = i_height - border_height;
      return "translate( 0, " + y_trans + ")";
    });
  const button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 11;
  const button_groups = {};
  button_groups.row = {};
  button_groups.col = {};
  const cracker_room = 60;
  control_svg
    .append("svg:a")
    .append("svg:image")
    .classed("cgm-logo", true)
    .attr("x", 15)
    .attr("y", 55)
    .attr("width", 50)
    .attr("height", 50)
    .attr(
      "xlink:href",
      "https://raw.githubusercontent.com/ismms-himc/clustergrammer-gl/master/img/graham_cracker_144.png"
    )
    .on("click", function () {
      window.open(
        "https://clustergrammer.readthedocs.io/",
        "_blank" // <- This is what makes it open in a new window.
      );
    });
  const shift_x_order_buttons = 65 + cracker_room;
  button_groups.row.x_trans = shift_x_order_buttons;
  button_groups.col.x_trans = shift_x_order_buttons;
  const y_offset_buttons = 47;
  button_groups.col.y_trans = y_offset_buttons;
  button_groups.row.y_trans =
    button_groups.col.y_trans + button_dim.height + button_dim.buffer;
  control_svg
    .append("g")
    .classed("panel_button_titles", true)
    .classed("reorder_button_title", true)
    .on("click", function () {
      d3.selectAll(params.root + " .panel_button_titles").attr("opacity", 0.5);
      d3.select(this).attr("opacity", 1.0);
      if (params.viz.current_panel == "recluster") {
        params.viz.current_panel = "reorder";
        // modify buttons
        d3.select(params.root + " .panel_button_title").text(
          "reorder".toUpperCase()
        );
        d3.select(params.root + " .top_button_title").text("COL");
        d3.select(params.root + " .bottom_button_title").text("ROW");
        d3.selectAll(params.root + " .reorder_buttons").style(
          "display",
          "block"
        );
        d3.select(params.root + " .run_cluster_container").style(
          "display",
          "none"
        );
        d3.selectAll(params.root + " .dist_options").style("display", "none");
        d3.selectAll(params.root + " .link_options_container").style(
          "display",
          "none"
        );
      }
    })
    .append("text")
    .text("reorder".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = 110 + cracker_room;
      const y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  // dropped alpha, will probably replace with ini
  const order_options = ["clust", "sum", "var", "ini"];
  control_svg
    .append("rect")
    .attr("height", "1px")
    .attr("width", "290px")
    .attr("position", "absolute")
    .attr("stroke", "#eee")
    .attr("stroke-width", 2)
    .attr("transform", function () {
      const x_offset =
        button_dim.x_trans - button_dim.buffer + 1 + cracker_room;
      const y_trans = y_offset_buttons - button_dim.buffer + 2;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  const name_dict = {};
  name_dict["col"] = "top";
  name_dict["row"] = "bottom";
  _.each(["row", "col"], function (i_axis) {
    const axis_title = control_svg
      .append("g")
      .classed(name_dict[i_axis] + "_button_title_container", true)
      .attr("transform", function () {
        const x_offset = 0;
        const y_offset = button_groups[i_axis].y_trans;
        return "translate(" + x_offset + ", " + y_offset + ")";
      });
    const axis_title_offset = 35 + cracker_room;
    axis_title
      .append("text")
      .classed(name_dict[i_axis] + "_button_title", true)
      .text(i_axis.toUpperCase())
      .style("-webkit-user-select", "none")
      .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr("font-weight", 400)
      .attr("font-size", button_dim.fs)
      .attr("text-anchor", "middle")
      .attr("stroke", text_color)
      .attr("alignment-baseline", "middle")
      .attr("letter-spacing", "2px")
      .attr("cursor", "default")
      .attr(
        "transform",
        "translate(" + axis_title_offset + ", " + button_dim.height / 2 + ")"
      );
    const reorder_buttons = control_svg.append("g");
    reorder_buttons.classed(i_axis + "-reorder-buttons", true);
    const active_button_color = "#8797ff"; // '#0000FF75';
    // generate reorder buttons
    const button_group = reorder_buttons
      .selectAll("g")
      .data(order_options)
      .enter()
      .append("g")
      .classed("reorder_buttons", true)
      .attr("transform", function (d, i) {
        const x_offset = button_dim.x_trans * i + button_groups[i_axis].x_trans;
        return (
          "translate(" + x_offset + ", " + button_groups[i_axis].y_trans + ")"
        );
      })
      .on("click", function (d) {
        const clean_order = d.replace("sum", "rank").replace("var", "rankvar");
        if (params.order.inst[i_axis] != clean_order) {
          /* category order is already calculated */
          runReorder(regl, params, i_axis, d);
          d3.select(params.root + " ." + i_axis + "-reorder-buttons")
            .selectAll("rect")
            .attr("stroke", button_color);
          d3.select(this).select("rect").attr("stroke", active_button_color);
        }
      });
    button_group
      .append("rect")
      .attr("height", button_dim.height)
      .attr("width", button_dim.width)
      .attr("fill", control_panel_color)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("stroke", function (d) {
        let i_color;
        if (params.order.inst[i_axis] == d) {
          i_color = active_button_color;
        } else {
          i_color = button_color;
        }
        return i_color;
      })
      .attr("stroke-width", 2.5);
    button_group
      .append("text")
      .classed("button-name", true)
      .text(function (d) {
        return d.toUpperCase();
      })
      .style("-webkit-user-select", "none")
      .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr("font-weight", 400)
      .attr("font-size", button_dim.fs)
      .attr("text-anchor", "middle")
      .attr("stroke", text_color)
      .attr("alignment-baseline", "middle")
      .attr("letter-spacing", "2px")
      .attr("cursor", "default")
      .attr(
        "transform",
        "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
      );
  });
  buildReorderCatTitles(regl, cgm);
  buildReclusterSection(cgm);
  // row search
  // /////////////////
  const search_container = d3
    .select(params.root + " .control-container")
    .append("div")
    .classed("row_search_container", true)
    .style("position", "absolute")
    .style("padding-left", "10px")
    .style("padding-right", "10px")
    .style("margin-top", "10px")
    .style("top", "37px")
    .style("left", "440px");
  const root_id = cgm.params.root.replace("#", "");
  search_container
    .append("input")
    .classed("form-control", true)
    .classed("row_search_box", true)
    .classed("sidebar_text", true)
    .attr("type", "text")
    .attr("placeholder", "row names")
    .attr("list", "row_names_" + root_id)
    .style("width", "100px")
    .style("height", "20px")
    .style("margin-top", "5px")
    .style("display", "inline-block")
    .style("padding", "1pt 2pt");
  const row_names = params.network.row_node_names;
  search_container
    .append("datalist")
    .attr("id", "row_names_" + root_id)
    .selectAll("options")
    .data(row_names)
    .enter()
    .append("option")
    .attr("value", (d) => d);
  search_container
    .append("div")
    .classed("row_search_button", true)
    .style("margin-top", "5px")
    .style("margin-left", "5px")
    .style("display", "inline-block")
    .attr("data-toggle", "buttons")
    .append("button")
    .classed("sidebar_text", true)
    .html("Find")
    .attr("type", "button")
    .classed("btn", true)
    .classed("btn-primary", true)
    .classed("submit_gene_button", true)
    .style("width", "100%")
    .style("font-size", "14px")
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .on("click", () => {
      const inst_value = d3
        .select(params.root + " .control-container .row_search_box")
        .node().value;
      params.search.searched_rows = inst_value.split(", ");
      draw_webgl_layers(cgm);
    });
  // opacity slider
  // //////////////////////////
  build_opacity_slider(cgm);
  // download buttons
  control_svg
    .append("text")
    .classed("download_section_title", true)
    .text("download".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 715;
      const y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  // download section border
  control_svg
    .append("rect")
    .classed("download_section_border", true)
    .attr("height", "1px")
    .attr("width", "145px")
    .attr("position", "absolute")
    .attr("stroke", "#eee")
    .attr("stroke-width", 2)
    .attr("transform", function () {
      const x_offset = cracker_room + 645;
      const y_trans = y_offset_buttons - button_dim.buffer + 2;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("g")
    .on("click", () => {
      params.download.delimiter_name = "csv";
      download_matrix(params);
    })
    .append("text")
    .classed("download_section_type", true)
    .text("csv".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", "blue")
    .attr("opacity", 0.75)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 610 + 55;
      const y_trans = 63;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("g")
    .on("click", () => {
      params.download.delimiter_name = "tsv";
      download_matrix(params);
    })
    .append("text")
    .classed("download_section_type", true)
    .text("tsv".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", "blue")
    .attr("opacity", 0.75)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 610 + 55 + 40;
      const y_trans = 63;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("g")
    .on("click", () => {
      params.download.delimiter_name = "tuple";
      download_matrix(params);
    })
    .append("text")
    .classed("download_section_type", true)
    .text("tuple".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", "blue")
    .attr("opacity", 0.75)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 610 + 55 + 90;
      const y_trans = 63;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("text")
    .classed("download_section_type", true)
    .text("matrix".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 615;
      const y_trans = 63;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("text")
    .classed("download_section_type", true)
    .text("meta".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 615;
      const y_trans = 107;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("g")
    .on("click", () => {
      params.download.meta_type = "col";
      download_metadata(params);
    })
    .append("text")
    .classed("download_section_type", true)
    .text("col".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", "blue")
    .attr("opacity", 0.75)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 610 + 55;
      const y_trans = 107;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
  control_svg
    .append("g")
    .on("click", () => {
      params.download.meta_type = "row";
      download_metadata(params);
    })
    .append("text")
    .classed("download_section_type", true)
    .text("row".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", "blue")
    .attr("opacity", 0.75)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", function () {
      const x_offset = cracker_room + 610 + 55 + 40;
      const y_trans = 107;
      return "translate( " + x_offset + ", " + y_trans + ")";
    });
}
