export type Axis = "row" | "col";

export type InteractionEvent = {
  type:
    | "wheel"
    | "mousedown"
    | "mousemove"
    | "touchstart"
    | "pinchstart"
    | "touch"
    | "pinch"
    | "touchend"
    | "pinchend";
  buttons: number;
  mods: Record<string, any>;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  dz: number;
  dsx: number;
  dsy: number;
  dsz: number;
  theta: number;
  dtheta: number;
};
