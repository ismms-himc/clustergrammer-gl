var file_saver = require("./fileSaver");
var make_meta_string = require("./makeMetaString");

module.exports = function download_metadata(params) {
  var saveAs = file_saver();

  let matrix_string = make_meta_string(params);

  var blob = new Blob([matrix_string], { type: "text/plain;charset=utf-8" });

  let file_type = "csv";
  let meta_type = params.download.meta_type;
  saveAs(blob, "meta_" + meta_type + "." + file_type);
};
