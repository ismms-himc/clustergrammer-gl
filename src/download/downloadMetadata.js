import { saveAs } from "file-saver";
import make_meta_string from "./makeMetaString";

export default (function download_metadata(store) {
  const params = store.getState();
  const matrix_string = make_meta_string(params);
  const blob = new Blob([matrix_string], { type: "text/plain;charset=utf-8" });
  const file_type = "csv";
  const meta_type = params.download.meta_type;
  saveAs(blob, "meta_" + meta_type + "." + file_type);
});
