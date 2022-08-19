import makeCamera2D from "./customCamera2D";

export default function make_cameras(regl, params) {
  const zoom_data = params.zoom_data;
  const cameras = {};
  const ini_scale = 1.0;
  const zoom_range = {
    xrange: [-ini_scale, ini_scale],
    yrange: [-ini_scale, ini_scale],
  };
  // requiring camera and
  cameras.mat = makeCamera2D(regl, params, zoom_range, zoom_data, "matrix");
  cameras["row-labels"] = makeCamera2D(
    regl,
    params,
    zoom_range,
    zoom_data,
    "row-labels"
  );
  cameras["col-labels"] = makeCamera2D(
    regl,
    params,
    zoom_range,
    zoom_data,
    "col-labels"
  );
  cameras.static = makeCamera2D(regl, params, zoom_range, zoom_data, "static");
  params.cameras = cameras;
}
