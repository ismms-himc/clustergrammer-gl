export default (function make_spillover_args(
  regl,
  inst_depth,
  inst_color = [1, 1, 1, 1]
) {
  // fix heatmap bleedthrough with variable opacity categories
  // Spillover Arguments
  // /////////////////////////////
  const args = {
    // In a draw call, we can pass the shader source code to regl
    frag: `
    precision mediump float;
    uniform vec4 color;
    void main () {
      gl_FragColor = color;
    }`,
    vert: `
    precision mediump float;
    attribute vec2 position;
    uniform float inst_depth;
    void main () {
      // positioned further up (matrix is lower at 0.)
      gl_Position = vec4(position, inst_depth, 1);
    }`,
    attributes: {
      position: regl.prop("pos"),
    },
    uniforms: {
      color: inst_color,
      inst_depth: inst_depth,
    },
    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: 1,
        dstRGB: "one minus src alpha",
        dstAlpha: 1,
      },
      equation: {
        rgb: "add",
        alpha: "add",
      },
      color: [0, 0, 0, 0],
    },
    count: 3,
    depth: {
      enable: true,
      mask: true,
      func: "less",
      // func: 'greater',
      range: [0, 1],
    },
  };
  return args;
});
