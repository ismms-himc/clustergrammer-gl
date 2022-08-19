import _regl from "regl";

export default function initialize_regl(cgm) {
  const canvas_container = cgm.canvas_container;
  const regl = _regl({
    extensions: ["angle_instanced_arrays"],
    container: canvas_container,
  });

  cgm.regl = regl;
  return cgm;
}
