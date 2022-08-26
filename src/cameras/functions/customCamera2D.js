import * as EventEmitter from "event-emitter";
import mat4 from "gl-mat4";
import interactionEvents from "../../interactions/interactionEvents";
import camera_interaction from "./cameraInteraction";

mat4.viewport = function viewport(out, x, y, w, h, n, f) {
  out[0] = w * 0.5;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = h * 0.5;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (f - n) * 0.5;
  out[11] = 0;
  out[12] = x + w * 0.5;
  out[13] = y + h * 0.5;
  out[14] = (f + n) * 0.5;
  out[15] = 1;
  return out;
};

export default function makeCamera2D(
  regl,
  store,
  zoom_range = {},
  viz_component
) {
  const options = {
    element: regl._gl.canvas,
  };
  const element = options.element;
  let dirty = true;
  const getWidth =
    element === window
      ? function () {
          return element.innerWidth;
        }
      : function () {
          return element.offsetWidth;
        };
  const getHeight =
    element === window
      ? function () {
          return element.innerHeight;
        }
      : function () {
          return element.offsetHeight;
        };
  const xrange = zoom_range.xrange === undefined ? [-1, 1] : zoom_range.xrange;
  const yrange = zoom_range.yrange === undefined ? [-1, 1] : zoom_range.yrange;
  const aspectRatio =
    zoom_range.aspectRatio === undefined ? 1 : zoom_range.aspectRatio;
  let width = getWidth();
  let height = getHeight();
  const {
    visualization: { viz_dim },
  } = store.getState();
  const xcen = 0.5 * (xrange[1] + xrange[0]) + viz_dim.shift_camera.x;
  const ycen = 0.5 * (yrange[1] + yrange[0]) + viz_dim.shift_camera.y;
  const xrng = 0.5 * (xrange[1] - xrange[0]);
  const yrng = (xrng / aspectRatio / width) * height;
  const mView = mat4.identity([]);
  mView[0] = 1 / xrng;
  mView[5] = 1 / yrng;
  mView[12] = -xcen / xrng;
  mView[13] = -ycen / yrng;
  const mViewport = mat4.identity([]);
  const mInvViewport = mat4.identity([]);
  function computeViewport() {
    width = getWidth();
    height = getHeight();
    mat4.viewport(mViewport, 0, height, width, -height, 0, 1);
    mat4.invert(mInvViewport, mViewport);
  }
  computeViewport();
  const dViewport = [];
  const emitter = new EventEmitter();
  // ///////////////////////////////////////
  // Original interaction tracking
  // ///////////////////////////////////////
  interactionEvents({
    element: element,
  })
    .on("interactionstart", function (ev) {
      ev.preventDefault();
    })
    .on("interactionend", function (ev) {
      ev.preventDefault();
    })
    .on("interaction", function (ev) {
      if (store.getState().interaction.enable_viz_interact) {
        camera_interaction(
          store,
          ev,
          viz_component,
          mInvViewport,
          mat4,
          mView,
          emitter,
          dViewport,
          mViewport
        );
      }
    });
  const setProps = regl({
    context: {
      view: regl.prop("view"),
    },
  });
  const inst_camera = {
    draw: function (cb) {
      setProps(
        {
          view: mView,
        },
        function () {
          cb({
            dirty: dirty,
          });
        }
      );
      dirty = false;
    },
    on: function (eventName, callback) {
      emitter.on(eventName, callback);
    },
    off: function (eventName, callback) {
      emitter.off(eventName, callback);
    },
    taint: function () {
      dirty = true;
    },
    resize: function () {
      computeViewport();
      // Reapply the aspect ratio:
      mView[5] = (mView[0] * aspectRatio * width) / height;
      dirty = true;
    },
  };
  return inst_camera;
}
