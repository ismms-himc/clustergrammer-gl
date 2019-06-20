module.exports = function ini_canvas_mouseover(){

  d3.select(this.params.root + ' .canvas-container canvas')
    .on('mouseover', function(){
      this.params.tooltip.on_canvas = true;
    })
    .on('mouseout', function(){
      this.params.tooltip.on_canvas = false;
    });

};