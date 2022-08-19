import * as axios from "axios";
import * as d3 from "d3";
import * as _ from "underscore";

export default (function hzome_functions(params) {
  function get_request(ini_gene_symbol) {
    let gene_symbol;
    if (ini_gene_symbol.indexOf(" ") > 0) {
      gene_symbol = ini_gene_symbol.split(" ")[0];
    } else if (ini_gene_symbol.indexOf("_") > 0) {
      gene_symbol = ini_gene_symbol.split("_")[0];
    } else {
      gene_symbol = ini_gene_symbol;
    }
    const base_url = "https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/";
    const url = base_url + gene_symbol;
    // // get request using Jquery
    // $.get(url, function(data) {
    //   data = JSON.parse(data);
    //   set_tooltip(data, ini_gene_symbol);
    //   return data;
    // });
    axios
      .get(url)
      .then(function (response) {
        // handle success
        set_tooltip(response.data, ini_gene_symbol);
        // save data for repeated use
        params.hzome.gene_data[gene_symbol] = {};
        params.hzome.gene_data[gene_symbol].name = response.data.name;
        params.hzome.gene_data[gene_symbol].description =
          response.data.description;
      })
      // .catch(function (error) {
      //   // handle error
      // })
      .finally(function () {
        // always executed
      });
  }
  function set_tooltip(data, gene_symbol) {
    if (data.name !== undefined) {
      // assign html
      d3.select(params.tooltip_id).html(function () {
        const sym_name = gene_symbol + ": " + data.name;
        const full_html =
          "<p>" + sym_name + "</p> <p>" + data.description + "</p>";
        return full_html;
      });
      // set width
      d3.select(params.tooltip_id).selectAll("p").style("width", "500px");
    }
  }
  function gene_info(gene_symbol) {
    // var gene_symbol = gene_info.name;
    if (_.has(params.hzome.gene_data, gene_symbol)) {
      const inst_data = params.hzome.gene_data[gene_symbol];
      set_tooltip(inst_data, gene_symbol);
    } else {
      // setTimeout(get_request, 250, gene_symbol);
      get_request(gene_symbol);
    }
  }
  const hzome = {};
  hzome.gene_info = gene_info;
  hzome.gene_data = {};
  hzome.get_request = get_request;
  return hzome;
});
