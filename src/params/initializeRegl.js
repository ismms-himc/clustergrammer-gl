import _regl from "regl";

export default function initializeRegl(canvas_container) {
  const regl = _regl({
    extensions: ["angle_instanced_arrays"],
    container: canvas_container,
  });

  return regl;
}
