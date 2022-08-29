import makeCamera2D from "./customCamera2D";

export default function make_cameras(regl, store) {
  const cameras = {};
  const ini_scale = 1.0;
  const {
    visualization: { viz_dim },
  } = store.getState();
  const zoom_range = {
    xrange: [-ini_scale, ini_scale],
    yrange: [-ini_scale, ini_scale],
    // TODO: canvas or mat?
    aspect: viz_dim.canvas.width / viz_dim.canvas.height,
  };
  // requiring camera and
  cameras.mat = makeCamera2D(regl, store, zoom_range, "matrix");
  cameras["row-labels"] = makeCamera2D(regl, store, zoom_range, "row-labels");
  cameras["col-labels"] = makeCamera2D(regl, store, zoom_range, "col-labels");
  cameras.static = makeCamera2D(regl, store, zoom_range, "static");

  return cameras;
}
