import { select } from "d3-selection";
import manualUpdateToCats from "../cats/functions/manualUpdateToCats";
import { mutateCategoriesState } from "../state/reducers/categoriesSlice";
import { mutateCatVizState } from "../state/reducers/catVizSlice";
import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";

export default function manual_category_from_dendro(
  regl,
  store,
  catArgsManager,
  camerasManager,
  selected_clust_names,
  axis
) {
  const { tooltip, visualization, cat_data } = store.getState();
  const dispatch = store.dispatch;

  // Manual Category
  // //////////////////////////
  select(tooltip.tooltip_id).append("text").text("Manual Category: ");
  // color picker section
  const color_picker_div = select(tooltip.tooltip_id)
    .append("div")
    .classed("color_picker_div", true)
    .style("height", "0px")
    .style("display", "none");
  const colors_array_1 = [
    "#ff4422",
    "#ee1166",
    "#9911bb",
    "#6633bb",
    "#3344bb",
    "#1199ff",
    "#00aaff",
    "#00bbdd",
    "#009988",
    "#44bb44",
  ];
  const colors_array_2 = [
    "#88cc44",
    "#ccdd22",
    "#ffee11",
    "#ffcc00",
    "#ff9900",
    "#ff5500",
    "#775544",
    "#999999",
    "#828080",
    "#444",
  ];
  const select_color_from_pallet = function (inst_color) {
    select(tooltip.tooltip_id + " .custom-cat-color").attr("value", inst_color);
    select(tooltip.tooltip_id + " .color-preview").style(
      "background-color",
      inst_color
    );
  };
  color_picker_div
    .append("div")
    .selectAll("div")
    .data(colors_array_1)
    .enter()
    .append("div")
    .style("width", "30px")
    .style("height", "16px")
    .style("display", "inline-block")
    .style("margin-left", "5px")
    .style("margin-right", "2px")
    .style("background-color", (d) => d)
    .on("click", (d) => {
      select_color_from_pallet(d);
    });
  color_picker_div
    .append("div")
    .selectAll("div")
    .data(colors_array_2)
    .enter()
    .append("div")
    .style("width", "30px")
    .style("height", "16px")
    .style("display", "inline-block")
    .style("margin-left", "5px")
    .style("margin-right", "2px")
    .style("background-color", (d) => d)
    .on("click", (d) => {
      select_color_from_pallet(d);
    });
  // custom category input secion
  const custom_cat_div = select(tooltip.tooltip_id)
    .append("div")
    .classed("custom_cat_div", true);
  const root_id = visualization.rootElementId.replace("#", "");
  custom_cat_div
    .append("input")
    .classed("custom-cat-input", true)
    .attr("placeholder", "Category")
    .attr("list", "preferred_categories_" + root_id)
    .style("width", "140px")
    .style("display", "inline-block")
    .style("color", "black")
    .on("change", () => {
      const changeState = store.getState();
      // if input matches color key, set color to pre-defined cat color
      // /////////////////////////////////////////////////////////////////
      const new_cat = select(
        changeState.tooltip.tooltip_id + " .custom-cat-input"
      )
        .node()
        .value.trim();
      let new_color;
      if (axis + "_color_dict" in changeState.cat_data.manual_category) {
        if (
          new_cat in changeState.cat_data.manual_category[axis + "_color_dict"]
        ) {
          new_color =
            changeState.cat_data.manual_category[axis + "_color_dict"][new_cat];
          select_color_from_pallet(new_color);
        }
      }
    });
  if (axis + "_cats" in cat_data.manual_category) {
    const preferred_cat_list = cat_data.manual_category[axis + "_cats"].map(
      (x) => x.name
    );
    custom_cat_div
      .append("datalist")
      .attr("id", "preferred_categories_" + root_id)
      .selectAll("options")
      .data(preferred_cat_list)
      .enter()
      .append("option")
      .attr("value", (d) => d);
  }
  // type color
  custom_cat_div
    .append("input")
    .classed("custom-cat-color", true)
    .attr("placeholder", "Color")
    .style("width", "80px")
    .style("display", "inline-block")
    .style("margin-left", "5px")
    .style("color", "black")
    .on("input", function () {
      select(store.getState().tooltip.tooltip_id + " .color-preview").style(
        "background-color",
        // TODO: fix this usage here
        // eslint-disable-next-line no-invalid-this
        this.value
      );
    });
  const color_picker_height = 45;
  // color preview
  custom_cat_div
    .append("div")
    .classed("color-preview", true)
    .style("width", "30px")
    .style("height", "16px")
    .style("display", "inline-block")
    .style("margin-left", "5px")
    .style("margin-right", "2px")
    .style("background-color", "white")
    .on("click", () => {
      const state = store.getState();
      if (state.cat_data.showing_color_picker === false) {
        select(state.tooltip.tooltip_id + " .color_picker_div")
          .style("height", color_picker_height + "px")
          .style("display", "block");
        select(state.tooltip.tooltip_id).style("margin-top", function () {
          const old_top_margin = select(state.tooltip.tooltip_id)
            .style("margin-top")
            .replace("px");
          const new_top_margin =
            String(parseInt(old_top_margin) - color_picker_height) + "px";
          return new_top_margin;
        });
        dispatch(mutateCategoriesState({ showing_color_picker: true }));
      }
    });
  // update category button
  // /////////////////////////////
  custom_cat_div
    .append("button")
    .style("display", "inline-block")
    .style("margin-left", "5px")
    .style("padding", "2px 5px")
    .style("background-color", "dodgerblue")
    .style("border", "1px solid #ddd")
    .style("color", "white")
    .style("cursor", "pointer")
    .on("click", () => {
      const state = store.getState();
      const new_cat = select(state.tooltip.tooltip_id + " .custom-cat-input")
        .node()
        .value.trim();
      let inst_color = select(state.tooltip.tooltip_id + " .custom-cat-color")
        .node()
        .value.trim();
      if (new_cat !== "") {
        // save category and color to dictionary
        if (axis + "_color_dict" in state.cat_data.manual_category) {
          state.cat_data.manual_category[axis + "_color_dict"][new_cat] =
            inst_color;
        }
        if (inst_color === "") {
          inst_color = "white";
        }
        const inst_labels = selected_clust_names;
        // Only allowing custom naming of first column
        const cat_title = state.cat_data[axis][0].cat_title;
        dispatch(
          mutateCatVizState({
            global_cat_colors: {
              [new_cat]: inst_color,
            },
          })
        );
        dispatch(
          mutateInteractionState({
            manual_update_cats: true,
          })
        );
        manualUpdateToCats(
          regl,
          store,
          catArgsManager,
          camerasManager,
          axis,
          cat_title,
          new_cat,
          inst_labels
        );
      }
    })
    .append("text")
    .text("Set Category");
}
