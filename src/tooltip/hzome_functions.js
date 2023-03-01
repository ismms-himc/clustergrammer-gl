var d3 = require("d3");
var axios = require('axios');
module.exports = function hzome_functions(params){


  function get_request(ini_gene_symbol){

    var gene_symbol;
    if (ini_gene_symbol.indexOf(' ') > 0){
      gene_symbol = ini_gene_symbol.split(' ')[0];
    } else if (ini_gene_symbol.indexOf('_') > 0){
      gene_symbol = ini_gene_symbol.split('_')[0];
    }
    else {
      gene_symbol = ini_gene_symbol;
    }

    // Uniprot fetch
    ///////////////////////////////////////////////

    // get Uniprot Accession Number
    ///////////////////////////////////
    organism = 'human'
    num_matches = 100
    let url_accession = 'https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=' + num_matches + '&exact_gene=' + gene_symbol + '&organism=' + organism ;

    try {
      axios.get(url_accession)
        .then(function (response) {

          var real_protein = response.data
          // has evidence at protein level
          .filter(d => d.proteinExistence === 'Evidence at protein level')
          // has a comments section
          .filter(d => 'comments' in d)

          // // has a FUNCTION section in the comments
          // .filter(d => d.comments.map(c => c.type).includes('FUNCTION'))

          // has gene
          .filter(d => 'gene' in d)
          // matches gene name in first entry (lowercase string)
          .filter(d => d.gene[0].name.value.toLowerCase() === gene_symbol.toLowerCase())
          // has a rank by the number of comments
                  .sort((a, b) => b.comments.length - a.comments.length)

        try {
          var inst_accession = real_protein[0].accession
          let base_url_info = 'https://rest.uniprot.org/uniprotkb/' + inst_accession + '.json' ;

          axios.get(base_url_info)
            .then(function (response) {

              try {
                var full_name = response.data.proteinDescription.recommendedName.fullName.value
                try {
                  var description = response.data.comments[0].texts[0].value
                } catch (error){
                  var description = 'Unable to obtain UniProt description.';
                }

                // handle success
                set_tooltip(ini_gene_symbol, full_name, description);

                // save data for repeated use
                params.hzome.gene_data[gene_symbol] = {}
                params.hzome.gene_data[gene_symbol].name = full_name;
                params.hzome.gene_data[gene_symbol].description = description;

              } catch(error) {
                params.hzome.gene_data[gene_symbol] = {}
                params.hzome.gene_data[gene_symbol].name = '';
                params.hzome.gene_data[gene_symbol].description = 'Unable to obtain UniProt description.';
                set_tooltip(ini_gene_symbol, '', 'Unable to obtain UniProt description.');
              }


            })
            .finally(function () {
              // always executed
            });

          } catch (error){
            // save data for repeated use
            params.hzome.gene_data[gene_symbol] = {}
            params.hzome.gene_data[gene_symbol].name = '';
            params.hzome.gene_data[gene_symbol].description = 'Unable to obtain UniProt description.';
            set_tooltip(ini_gene_symbol, '', 'Unable to obtain UniProt description.');
          }

        })
        // .finally(function () {
        //   // always executed
        // });
    } catch (error) {
      // save data for repeated use
      params.hzome.gene_data[gene_symbol] = {}
      params.hzome.gene_data[gene_symbol].name = '';
      params.hzome.gene_data[gene_symbol].description = 'Unable to obtain UniProt description.';
      set_tooltip(ini_gene_symbol, '', 'Unable to obtain UniProt description.');
    }

  }

  function set_tooltip(gene_symbol, full_name, description){

    if (full_name != undefined){

      // assign html
      d3.select(params.tooltip_id)
        .html(function(){
            var sym_name = gene_symbol + ': ' + full_name;
            var full_html = '<p>' + sym_name + '</p> <p>' +
              description + '</p>';
            return full_html;
        });

      //set width
      d3.select(params.tooltip_id)
        .selectAll('p')
        .style('width', '600px');
    }
  }


  function gene_info(gene_symbol){

    if (_.has(params.hzome.gene_data, gene_symbol)){
      var inst_data = params.hzome.gene_data[gene_symbol];
      set_tooltip(gene_symbol, inst_data.name, inst_data.description);
    } else{
      get_request(gene_symbol);
    }

  }

  var hzome = {}

  hzome.gene_info = gene_info;
  // hzome.gene_data = {};
  hzome.gene_data = params.gene_data;
  hzome.get_request = get_request;

  return hzome;

};
