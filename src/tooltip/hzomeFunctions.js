var d3 = require("d3");
var axios = require("axios");
module.exports = function hzome_functions(params) {
  function get_request(ini_gene_symbol) {
    // console.log('get_request');

    var gene_symbol;
    if (ini_gene_symbol.indexOf(" ") > 0) {
      gene_symbol = ini_gene_symbol.split(" ")[0];
    } else if (ini_gene_symbol.indexOf("_") > 0) {
      gene_symbol = ini_gene_symbol.split("_")[0];
    } else {
      gene_symbol = ini_gene_symbol;
    }

    var base_url = "https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/";
    var url = base_url + gene_symbol;

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
      //   console.log(error);
      // })
      .finally(function () {
        // always executed
      });
  }

  function set_tooltip(data, gene_symbol) {
    // console.log('set_tooltip');

    if (data.name != undefined) {
      // assign html
      d3.select(params.tooltip_id).html(function () {
        var sym_name = gene_symbol + ": " + data.name;
        var full_html =
          "<p>" + sym_name + "</p> <p>" + data.description + "</p>";
        return full_html;
      });

      //set width
      d3.select(params.tooltip_id).selectAll("p").style("width", "500px");
    }
  }

  function gene_info(gene_symbol) {
    // console.log('gene_info');

    // var gene_symbol = gene_info.name;

    if (_.has(params.hzome.gene_data, gene_symbol)) {
      // console.log('found in params.hzome.gene_data')
      var inst_data = params.hzome.gene_data[gene_symbol];
      set_tooltip(inst_data, gene_symbol);
    } else {
      // setTimeout(get_request, 250, gene_symbol);
      // console.log('make get request for data')
      get_request(gene_symbol);
    }
  }

  var hzome = {};

  hzome.gene_info = gene_info;
  hzome.gene_data = {};
  hzome.get_request = get_request;

  return hzome;
};
