
module.exports = function make_draw_cells_buffers(regl, position_arr, opacity_arr){

  // // Make Buffers
  // ///////////////////////////

  // const opacity_buffer = regl.buffer({
  //   type: 'float',
  //   usage: 'dynamic'
  // });

  // opacity_buffer(opacity_arr);

  var buffers = {};
  // buffers.opacity_buffer = opacity_buffer;

  var position_buffer = regl.buffer(position_arr);
  buffers.position_buffer = position_buffer;

  return buffers;
};