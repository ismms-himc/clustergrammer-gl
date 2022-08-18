var d3 = require("d3");
var make_cat_breakdown_graph = require("./../cats/make_cat_breakdown_graph");
var calc_cat_cluster_breakdown = require("./../cats/calc_cat_cluster_breakdown");
var run_hide_tooltip = require("./run_hide_tooltip");
// var run_dendro_crop = require('./../crop/run_dendro_crop');
var manual_category_from_dendro = require("./manual_category_from_dendro");

module.exports = function make_dendro_tooltip(cgm, external_model, inst_axis) {
  var params = cgm.params;

  var mouseover = params.int.mouseover;

  params.tooltip_fun.show("tooltip");

  d3.select(params.tooltip_id)
    .append("div")
    .style("height", "16px")
    .style("text-align", "right")
    .style("cursor", "default")
    .on("click", function () {
      params.tooltip.permanent_tooltip = false;
      run_hide_tooltip(params);
    })
    .append("text")
    .text("x")
    .style("font-size", "15px");

  var cat_breakdown = calc_cat_cluster_breakdown(
    params,
    mouseover[inst_axis].dendro,
    inst_axis
  );
  make_cat_breakdown_graph(params, mouseover[inst_axis].dendro, cat_breakdown);

  // title for selected rows input box
  d3.select(params.tooltip_id)
    .append("text")
    .style("display", "inline-block")
    .style("cursor", "default")
    .text(
      "Selected " +
        inst_axis.replace("row", "Rows").replace("col", "Columns") +
        ": "
    );

  // selected output formats
  selected_label_container = d3
    .select(params.tooltip_id)
    .append("div")
    .style("display", "inline-block")
    .classed("selected_label_container", true);

  function make_output_string(d) {
    let label_string;
    if (params.dendro.output_label_format === "list") {
      label_string =
        "[" +
        params.dendro.selected_clust_names.map((x) => ` '${x}'`).join(",") +
        "]";
    } else if (params.dendro.output_label_format === "tsv") {
      label_string = params.dendro.selected_clust_names.join("\t");
    } else if (params.dendro.output_label_format === "csv") {
      label_string = params.dendro.selected_clust_names.join(", ");
    } else if (params.dendro.output_label_format === "new-line") {
      label_string = params.dendro.selected_clust_names.join("<br/>");
    }
    return label_string;
  }

  let selected_color = "#0198E1";
  // 'new-line'
  let format_options = ["list", "csv", "tsv"];
  selected_label_container
    .selectAll("text")
    .data(format_options)
    .enter()
    .append("text")
    .classed("output_format", true)
    .style("margin-left", "2px")
    .style("display", "inline-block")
    .style("cursor", "default")
    .on("click", (d) => {
      // console.log('clicking format')

      params.dendro.output_label_format = d;

      d3.selectAll(
        params.tooltip_id + " .selected_label_container .output_format"
      ).style("color", (d) => {
        let inst_color = "white";
        if (d === params.dendro.output_label_format) {
          inst_color = selected_color;
        }
        return inst_color;
      });

      d3.select(params.tooltip_id + " input").attr("value", make_output_string);
    })
    .text((d, i) => {
      let inst_text = "";
      if (i < format_options.length - 1) {
        inst_text = d + ", ";
      } else {
        inst_text = d;
      }
      return inst_text;
    })
    .style("color", (d) => {
      let inst_color = "white";
      if (d === params.dendro.output_label_format) {
        inst_color = selected_color;
      }
      return inst_color;
    });

  d3.select(params.tooltip_id)
    .append("input")
    // .attr('value', function(){
    //   // return params.dendro.selected_clust_names.join(', ');
    //   let label_string = params.dendro.selected_clust_names
    //   label_string = label_string.map(x => ` '${x}'`).join(',')
    //   return label_string
    // })
    .attr("value", make_output_string)
    .style("width", "364px")
    .style("display", "block")
    .style("color", "black");

  if (params.cat_data.manual_category[inst_axis]) {
    manual_category_from_dendro(cgm, external_model, inst_axis);
  }

  // d3.select(cgm.params.tooltip_id + ' .custom-cat-input').node().value
  // d3.select(cgm.params.tooltip_id + ' .custom-cat-color').node().value

  // custom_cat_div
  //   .append('input')
  //   .style('placeholder', 'Custom Category')
  //   .style('width', '50px')
  //   .style('display', 'block')
  //   .style('float', 'left')
  //   .style('color', 'black');

  // console.log(params.dendro.selected_clust_names)

  // // working on adding crop functionality
  // /////////////////////////////////////////
  // d3.select(params.tooltip_id)
  //   .append('div')
  //   .style('cursor', 'default')
  //   .style('padding-top', '7px')
  //   .on('click', function(d){
  //     run_dendro_crop(params, d);
  //   })
  //   .append('text')
  //   .text('Crop to Selected Cluster')

  // .append('div')
  // .style('text-align', 'right')
  // .style('cursor', 'default')
  // .on('click', function(){
  //   console.log('clicking close tooltip')
  //   params.tooltip.permanent_tooltip = false;
  //   run_hide_tooltip(params);
  // })
  // .append('text')
  // .text('X')
  // .style('font-size', '15px')
};
