var custom_camera_2d = require("./customCamera2d");

module.exports = function make_cameras(regl, params) {
  // console.log('---------------------------------------------')
  // console.log('make_cameras total pan x min', params.zoom_data.x.total_pan_max)

  var zoom_data = params.zoom_data;

  const cameras = {};
  var ini_scale = 1.0;
  var zoom_range = {
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
};
