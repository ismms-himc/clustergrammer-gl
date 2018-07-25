module.exports = function make_tooltip_text_args(regl, params, zoom_function){

  var total_zoom = params.zoom_data.y.total_zoom;

  // smaller scale_text -> larger text
  var inst_depth = 0.0001;

  // this reduces the size of text, otherwise text will be on the order of the
  // entire webgl canvas
  var scale_text = 40;

  var offset_x = -1.0 + 2.0*(params.zoom_data.x.cursor_position/params.viz_dim.canvas.width);
  var offset_y =  1.0 - 2.0*(params.zoom_data.y.cursor_position/params.viz_dim.canvas.height);

  console.log('offsets', offset_x, offset_y)

  var vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform float scale_text;
      varying float x_position;
      varying float y_position;
      uniform float inst_depth;
      uniform float offset_x;
      uniform float offset_y;

      void main () {

        // the x position is constant for all row labels
        //-----------------------------------------------
        x_position =  position.x/scale_text + offset_x;

        // the y position varies for all row labels
        //-----------------------------------------------
        y_position = -(position.y - 1.0)/scale_text + offset_y;

        gl_Position =
                      vec4(
                           x_position,
                           y_position,
                           inst_depth,
                           1.0);
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
      scale_text: scale_text,
      inst_depth: inst_depth,
      offset_x: offset_x,
      offset_y: offset_y
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