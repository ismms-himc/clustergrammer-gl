var file_saver = require('./file_saver');
var make_matrix_string = require('./make_matrix_string');

module.exports = function download_matrix(params){

  var saveAs = file_saver();

  var matrix_string = make_matrix_string(params);

  var blob = new Blob(
        [matrix_string],
        {type: 'text/plain;charset=utf-8'}
      )

  let file_type = params.download.delimiter_name
  if (file_type === 'tuple'){
    file_type = 'tsv'
  }
  saveAs(blob, 'clustergrammer.' + file_type);

  console.log('download matrix')

};