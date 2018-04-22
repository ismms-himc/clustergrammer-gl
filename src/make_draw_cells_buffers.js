
module.exports = function make_draw_cells_buffers(regl, position_arr, opacity_arr){

  // Make Buffers
  ///////////////////////////
  var position_buffer = regl.buffer(position_arr);

  const opacity_buffer = regl.buffer({
    // length: opacity_arr.length,
    type: 'float',
    usage: 'dynamic'
  });

  opacity_buffer(opacity_arr);

  var buffers = {};
  buffers.opacity_buffer = opacity_buffer;
  buffers.position_buffer = position_buffer;

  return buffers;
};