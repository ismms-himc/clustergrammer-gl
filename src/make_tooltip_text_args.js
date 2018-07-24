var m3 = require('./mat3_transform');

module.exports = function make_tooltip_text_args(regl, params, zoom_function){

  // prevent text from getting too large when zooming
  params.text_scale.row = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  var total_zoom = params.zoom_data.y.total_zoom;

  // smaller scale_text -> larger text
  var limited_scaling = params.text_scale.row(total_zoom);
  var scale_text = params.text_zoom.row.scaled_num * params.text_scale.row(total_zoom);

  // scale_text is applying a zoom to x and y
  // needs to be scaled by scale_text
  var mat_rotate = m3.rotation(Math.PI/2);

  var vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 offset;
      uniform float x_offset;
      uniform float scale_text;
      uniform float total_zoom;
      uniform mat3 mat_rotate;
      uniform float heat_size;
      varying float x_position;
      varying float y_position;
      varying float shift_text;
      uniform float shift_heat;
      uniform float limited_scaling;

      // vec3 tmp = vec3(1,1,1);

      // last value is a sort-of zoom
      void main () {

        // reverse y position to get words to be upright

        shift_text = -1.0;

        // the x position is constant for all row labels
        //-----------------------------------------------
        // total_zoom stretches out row labels horizontally
        // then text is offset to the left side of the heatmap
        x_position = position.x * total_zoom +
                     x_offset * scale_text +
                     // limited_scaling used to be total_zoom
                     shift_text * limited_scaling;

        // the y position varies for all row labels
        //-----------------------------------------------
        y_position = -position.y + 2.0 * offset[1] * scale_text * heat_size - shift_heat * scale_text ;

        gl_Position = zoom *
                      vec4(
                           x_position,
                           y_position,
                           // depth
                           0.50,
                           // zoom
                           scale_text);
      }`;

  var frag_arg =  `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;

  var args = {
    vert: vert_arg,
    frag: frag_arg,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells'),
    uniforms: {
      zoom: zoom_function,
      offset: regl.prop('offset'),
      scale_text: scale_text,
      limited_scaling: limited_scaling,
      x_offset: -params.mat_size.x,
      heat_size: params.heat_size.y,
      shift_heat: params.mat_size.y - params.heat_size.y,
      total_zoom: total_zoom,
      mat_rotate: mat_rotate
    },
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      // func: 'greater',
      range: [0, 1]
    },
  };

  return args;

};