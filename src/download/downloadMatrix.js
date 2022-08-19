import file_saver from "./fileSaver.js";
import make_matrix_string from "./makeMatrixString.js";
export default (function download_matrix(params) {
  var saveAs = file_saver();
  var matrix_string = make_matrix_string(params);
  var blob = new Blob([matrix_string], { type: "text/plain;charset=utf-8" });
  let file_type = params.download.delimiter_name;
  if (file_type === "tuple") {
    file_type = "tsv";
  }
  saveAs(blob, "clustergrammer." + file_type);
});
