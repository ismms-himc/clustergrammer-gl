// TODO: fix invalid this usage
import { select, selectAll } from "d3-selection";
import * as _ from "underscore";
import buildReorderCatTitles from "../../../cats/functions/buildReorderCatTitles";
import build_opacity_slider from "../../../colors/buildOpacitySlider";
import download_matrix from "../../../download/downloadMatrix";
import download_metadata from "../../../download/downloadMetadata";
import draw_webgl_layers from "../../../draws/drawWebglLayers";
import runReorder from "../../../reorders/runReorder";
import { mutateCatVizState } from "../../../state/reducers/catVizSlice";
import { setDelimiterForFileType } from "../../../state/reducers/downloadSlice";
import { setSearchedRows } from "../../../state/reducers/searchSlice";
import { mutateTooltipState } from "../../../state/reducers/tooltip/tooltipSlice";
import { CONTROL_PANEL_CLASSNAME } from "../../ui.const";
import buildReclusterSection from "./buildReclusterSection";

export default function build_control_panel(
  regl,
  store,
  base_container,
  catArgsManager,
  camerasManager
) {
  const state = store.getState();
  const dispatch = store.dispatch;
  const i_height = 135;
  const control_panel_color = "white";
  const text_color = "#47515b";
  const button_color = "#eee";

  if (select(base_container).select(`.${CONTROL_PANEL_CLASSNAME}`).empty()) {
    // make control panel (needs to appear above canvas)
    select(base_container)
      .insert("div", ":first-child")
      .attr("class", CONTROL_PANEL_CLASSNAME)
      .style("width", "100%")
      .style("cursor", "default");
  }

  const control_svg = select(base_container)
    .select(`.${CONTROL_PANEL_CLASSNAME}`)
    .append("svg")
    .classed("control_svg", true)
    .attr("height", i_height)
    .attr("width", "100%")
    .on("mouseover", function () {
      dispatch(mutateTooltipState({ in_bounds_tooltip: false }));
    });

  control_svg
    .append("rect")
    .attr("height", i_height)
    .attr("width", "100%")
    .attr("position", "absolute")
    .attr("fill", control_panel_color)
    .attr("class", "control-panel-background");

  // control panel border
  const border_height = 1;
  control_svg
    .append("rect")
    .classed("north_border", true)
    .attr("height", "1px")
    .attr("width", "100%")
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

  // Graham cracker logo
  // const cracker_room = 60;
  const cracker_room = 0;
  // control_svg
  //   .append("svg:a")
  //   .append("svg:image")
  //   .classed("cgm-logo", true)
  //   .attr("x", 15)
  //   .attr("y", 55)
  //   .attr("width", 50)
  //   .attr("height", 50)
  //   .attr(
  //     "xlink:href",
  //     "https://raw.githubusercontent.com/ismms-himc/clustergrammer-gl/master/img/graham_cracker_144.png"
  //   )
  //   .on("click", function () {
  //     window.open(
  //       "https://clustergrammer.readthedocs.io/",
  //       "_blank" // <- This is what makes it open in a new window.
  //     );
  //   });
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
      const clickState = store.getState();
      selectAll(
        clickState.visualization.rootElementId + " .panel_button_titles"
      ).attr("opacity", 0.5);
      select(this).attr("opacity", 1.0);
      if (clickState.cat_viz.current_panel === "recluster") {
        dispatch(mutateCatVizState({ current_panel: "reorder" }));
        // modify buttons
        select(
          clickState.visualization.rootElementId + " .panel_button_title"
        ).text("reorder".toUpperCase());
        select(
          clickState.visualization.rootElementId + " .top_button_title"
        ).text("COL");
        select(
          clickState.visualization.rootElementId + " .bottom_button_title"
        ).text("ROW");
        selectAll(
          clickState.visualization.rootElementId + " .reorder_buttons"
        ).style("display", "block");
        select(
          clickState.visualization.rootElementId + " .run_cluster_container"
        ).style("display", "none");
        selectAll(
          clickState.visualization.rootElementId + " .dist_options"
        ).style("display", "none");
        selectAll(
          clickState.visualization.rootElementId + " .link_options_container"
        ).style("display", "none");
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
      .on("click", function (_, d) {
        const clean_order = d.replace("sum", "rank").replace("var", "rankvar");
        if (store.getState().order.inst[i_axis] !== clean_order) {
          /* category order is already calculated */
          runReorder(regl, store, catArgsManager, camerasManager, i_axis, d);
          select(
            store.getState().visualization.rootElementId +
              " ." +
              i_axis +
              "-reorder-buttons"
          )
            .selectAll("rect")
            .attr("stroke", button_color);
          select(this).select("rect").attr("stroke", active_button_color);
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
        if (state.order.inst[i_axis] === d) {
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
  buildReorderCatTitles(regl, store, catArgsManager, camerasManager);
  buildReclusterSection(regl, store, catArgsManager, camerasManager);
  // row search
  // /////////////////
  const search_container = select(
    state.visualization.rootElementId + " .control-container"
  )
    .append("div")
    .classed("row_search_container", true)
    .style("position", "absolute")
    .style("padding-left", "10px")
    .style("padding-right", "10px")
    .style("margin-top", "10px")
    .style("top", "37px")
    .style("left", "375px");
  const root_id = state.visualization.rootElementId.replace("#", "");
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
  const row_names = state.network.row_node_names;
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
      const inst_value = select(
        store.getState().visualization.rootElementId +
          " .control-container .row_search_box"
      ).node().value;
      const searchedRows = inst_value.split(", ");
      dispatch(setSearchedRows(searchedRows));
      draw_webgl_layers(regl, store, catArgsManager, camerasManager);
    });
  // opacity slider
  // //////////////////////////
  build_opacity_slider(regl, store, catArgsManager, camerasManager);
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
      dispatch(setDelimiterForFileType("csv"));
      download_matrix(store);
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
      dispatch(setDelimiterForFileType("tsv"));
      download_matrix(store);
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
      dispatch(setDelimiterForFileType("tuple"));
      download_matrix(store);
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
      dispatch(setDelimiterForFileType("col"));
      download_metadata(store);
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
      dispatch(setDelimiterForFileType("row"));
      download_metadata(store);
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
