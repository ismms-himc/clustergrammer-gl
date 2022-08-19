import _regl from "regl";

export default function initialize_regl() {
  var canvas_container = this.canvas_container;
  var regl = _regl({
    extensions: ["angle_instanced_arrays"],
    container: canvas_container,
  });
  this.regl = regl;
}
