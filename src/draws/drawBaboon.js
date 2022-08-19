module.exports = function draw_baboon(regl, params) {
  const baboon = params.baboon;

  // // overwrite baboon with custom data
  // data_for_texture = [];

  // num_cells = 100000
  // // overwriting data_for_texture
  // for (i = 0; i < num_cells * 4; i++) {

  //   // make rbg
  //   // inst_data = 100;
  //   inst_data = (i/(4*num_cells))*250

  //   if (i%4 === 0 || i%4 === 1){
  //     inst_data = 0;
  //   }

  //   data_for_texture.push(inst_data);

  // }

  // u8a = new Uint8Array(data_for_texture)

  // baboon.data = u8a

  const zoom_function = params.zoom_data.zoom_function;

  regl({
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    uniform mat4 zoom;
    void main () {
      uv = position * 0.5 + 0.5;
      gl_Position = zoom * vec4(-position[0] + 0.0, -position[1] + 0.0, 1, 1.4);
    }`,

    frag: `
    precision mediump float;
    uniform sampler2D texture;
    varying vec2 uv;
    void main () {
      gl_FragColor = texture2D(texture, uv);
    }`,

    // two triangles
    attributes: {
      position: [-1, 1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1],
    },

    uniforms: {
      texture: regl.texture(baboon),
      // texture: regl.texture(typedArrayTexture),
      zoom: zoom_function,
    },
    count: 6,
    depth: {
      enable: false,
    },
  })();
};
