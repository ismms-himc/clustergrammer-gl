import makeCamera2D from "./customCamera2D";

export default function make_cameras(
  regl,
  zoom_data,
  viz_dim,
  enable_viz_interact
) {
  const cameras = {};
  const ini_scale = 1.0;
  const zoom_range = {
    xrange: [-ini_scale, ini_scale],
    yrange: [-ini_scale, ini_scale],
  };
  // requiring camera and
  cameras.mat = makeCamera2D(
    regl,
    zoom_data,
    viz_dim,
    enable_viz_interact,
    zoom_range,
    zoom_data,
    "matrix"
  );
  cameras["row-labels"] = makeCamera2D(
    regl,
    zoom_data,
    viz_dim,
    enable_viz_interact,
    zoom_range,
    "row-labels"
  );
  cameras["col-labels"] = makeCamera2D(
    regl,
    zoom_data,
    viz_dim,
    enable_viz_interact,
    zoom_range,
    "col-labels"
  );
  cameras.static = makeCamera2D(
    regl,
    zoom_data,
    viz_dim,
    enable_viz_interact,
    zoom_range,
    zoom_data,
    "static"
  );

  return cameras;
}
