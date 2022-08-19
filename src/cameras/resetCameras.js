import ini_zoom_data from "../zoom/iniZoomData";
import make_cameras from "./makeCameras";

export default (function reset_cameras(regl, params) {
  params.reset_cameras = false;
  params.zoom_data = ini_zoom_data();
  make_cameras(regl, params);
  params.labels.draw_labels = false;
  params.ani.ini_viz = true;
  params.int.total = 0;
});
