const baboon = require('baboon-image');

module.exports = function draw_baboon(regl, params){

var zoom_function = params.zoom_data.zoom_function;

  regl({


    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    uniform mat4 zoom;
    void main () {
      uv = position;
      gl_Position = zoom * vec4(1.0 - 2.0 * position, 0, 1);
    }`,

    frag: `
    precision mediump float;
    uniform sampler2D texture;
    varying vec2 uv;
    void main () {
      gl_FragColor = texture2D(texture, uv, 0.);
    }`,


    attributes: {
      position: [
        -2,  0,
         0,  -2,
         2,   2]
    },

    uniforms: {
      texture: regl.texture(baboon),
      zoom: zoom_function,
    },

    count: 3
  })()

};