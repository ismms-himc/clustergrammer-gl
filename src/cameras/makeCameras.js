import custom_camera_2d from "./customCamera2d";

export default function make_cameras(regl, params) {
  const zoom_data = params.zoom_data;
  const cameras = {};
  const ini_scale = 1.0;
  const zoom_range = {
    xrange: [-ini_scale, ini_scale],
    yrange: [-ini_scale, ini_scale],
  };
  // requiring camera and
  cameras.mat = custom_camera_2d(regl, params, zoom_range, zoom_data, "matrix");
  cameras["row-labels"] = custom_camera_2d(
    regl,
    params,
    zoom_range,
    zoom_data,
    "row-labels"
  );
  cameras["col-labels"] = custom_camera_2d(
    regl,
    params,
    zoom_range,
    zoom_data,
    "col-labels"
  );
  cameras.static = custom_camera_2d(
    regl,
    params,
    zoom_range,
    zoom_data,
    "static"
  );
  params.cameras = cameras;
}
