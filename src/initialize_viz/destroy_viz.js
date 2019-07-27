module.exports = function destroy_viz(){

  // console.log('destroy_viz', d3.select(this.params.base_container).empty())
  d3.select(this.params.base_container)
    .selectAll('div')
    .remove()

  this.regl.destroy()

}