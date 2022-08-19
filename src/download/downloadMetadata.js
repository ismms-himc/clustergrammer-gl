import { saveAs } from "file-saver";
import make_meta_string from "./makeMetaString.js";

export default (function download_metadata(params) {
  let matrix_string = make_meta_string(params);
  var blob = new Blob([matrix_string], { type: "text/plain;charset=utf-8" });
  let file_type = "csv";
  let meta_type = params.download.meta_type;
  saveAs(blob, "meta_" + meta_type + "." + file_type);
});
