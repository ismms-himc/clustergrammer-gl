import * as eventEmitter from "event-emitter";
import mouseChange from "mouse-change";
import * as mouse from "mouse-event";
import eventOffset from "mouse-event-offset";
import extend from "util-extend";

function Finger() {
  this.position = [0, 0];
  this.touch = null;
}

// can pass in callback as second argument
function interactionEvents(opts = {}) {
  const options = extend(
    {
      element: window,
      constrainZoom: false,
    },
    opts
  );
  const emitter = eventEmitter({});
  const element = options.element;
  let enabled = false;
  // var mouseDown = false;
  // var wheelSpeed = 0.01;
  let pPos = [null, null];
  const fingers = [null, null];
  let ended = false;
  let activeCount = 0;
  let xprev;
  let yprev;
  const ev = {};
  let buttons = 0;
  let mods = {};
  const changeListener = mouseChange(
    element,
    function (pbuttons, px, py, pmods) {
      buttons = pbuttons;
      mods = pmods;
    }
  );
  function forward(evOut, evIn) {
    evOut.preventDefault = evIn.preventDefault.bind(evIn);
    evOut.stopPropagation = evIn.stopPropagation.bind(evIn);
    return evOut;
  }
  function onWheel(event) {
    // var dx, dy, dz, x0, y0;
    /*
        Working on improving behavior for offset canvas
        */
    // TODO: fix invalid this
    // eslint-disable-next-line no-invalid-this
    const canvas_rect = this.getBoundingClientRect();
    ev.type = "wheel";
    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = event.x - canvas_rect.left;
    ev.y0 = event.y - canvas_rect.top;
    ev.dx = event.deltaX;
    ev.dy = event.deltaY;
    ev.dz = event.deltaZ;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    emitter.emit("interaction", forward(ev, event));
  }
  function onMouseDown(event) {
    xprev = mouse.x(event);
    yprev = mouse.y(event);
    ev.type = "mousedown";
    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = xprev;
    ev.y0 = yprev;
    ev.dx = 0;
    ev.dy = 0;
    ev.dz = 0;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    emitter.emit("interactionend", forward(ev, event));
  }
  function onMouseMove(event) {
    const x = mouse.x(event);
    const y = mouse.y(event);
    ev.type = "mousemove";
    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = x;
    ev.y0 = y;
    ev.dx = x - xprev;
    ev.dy = y - yprev;
    ev.dz = 0;
    ev.dsx = 1;
    ev.dsy = 1;
    ev.dsz = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    xprev = x;
    yprev = y;
    emitter.emit("interaction", forward(ev, event));
  }
  function indexOfTouch(touch) {
    const id = touch.identifier;
    for (let i = 0; i < fingers.length; i++) {
      if (
        fingers[i] &&
        fingers[i].touch &&
        fingers[i].touch.identifier === id
      ) {
        return i;
      }
    }
    return -1;
  }
  function onTouchStart(event) {
    pPos = [null, null];
    for (let i = 0; i < event.changedTouches.length; i++) {
      const newTouch = event.changedTouches[i];
      const id = newTouch.identifier;
      const idx = indexOfTouch(id);
      if (idx === -1 && activeCount < 2) {
        const first = activeCount === 0;
        // newest and previous finger (previous may be undefined)
        const newIndex = fingers[0] ? 1 : 0;
        const newFinger = new Finger();
        // add to stack
        fingers[newIndex] = newFinger;
        // activeCount++
        activeCount = activeCount + 1;
        // update touch event & position
        newFinger.touch = newTouch;
        eventOffset(newTouch, element, newFinger.position);
        if (!first) {
          ended = false;
        }
      }
    }
    if (activeCount > 0) {
      ev.type = activeCount === 1 ? "touchstart" : "pinchstart";
      ev.buttons = 0;
      ev.mods = {};
      ev.x0 = 0;
      ev.y0 = 0;
      ev.dx = 0;
      ev.dy = 0;
      ev.dz = 0;
      ev.dsx = 1;
      ev.dsy = 1;
      ev.dsz = 1;
      ev.theta = 0;
      ev.dtheta = 0;
      emitter.emit("interactionstart", forward(ev, event));
    }
  }
  function onTouchMove(event) {
    let idx;
    let changed = false;
    for (let i = 0; i < event.changedTouches.length; i++) {
      const movedTouch = event.changedTouches[i];
      idx = indexOfTouch(movedTouch);
      if (idx !== -1) {
        changed = true;
        fingers[idx].touch = movedTouch; // avoid caching touches
        eventOffset(movedTouch, element, fingers[idx].position);
      }
    }
    if (changed) {
      if (activeCount === 1) {
        for (idx = 0; idx < fingers.length; idx++) {
          if (fingers[idx]) {
            break;
          }
        }
        if (fingers[idx] && pPos[idx]) {
          const x = fingers[idx].position[0];
          const y = fingers[idx].position[1];
          const dx = x - pPos[idx][0];
          const dy = y - pPos[idx][1];
          ev.type = "touch";
          ev.buttons = 0;
          ev.mods = {};
          ev.x0 = x;
          ev.y0 = y;
          ev.dx = dx;
          ev.dy = dy;
          ev.dz = 0;
          ev.dsx = 1;
          ev.dsy = 1;
          ev.dsz = 1;
          ev.theta = 0;
          ev.dtheta = 0;
          emitter.emit("interaction", forward(ev, event));
        }
      } else if (activeCount === 2) {
        if (pPos[0] && pPos[1]) {
          // Previous two-finger vector:
          const pos0A = pPos[0];
          const pos0B = pPos[1];
          const dx0 = pos0B[0] - pos0A[0];
          const dy0 = pos0B[1] - pos0A[1];
          // Current two-finger vector:
          const pos1A = fingers[0].position;
          const pos1B = fingers[1].position;
          const dx1 = pos1B[0] - pos1A[0];
          const dy1 = pos1B[1] - pos1A[1];
          // r, theta for the previous two-finger touch:
          const r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
          const theta0 = Math.atan2(dy0, dx0);
          // r, theta for the current two-finger touch:
          const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          const theta1 = Math.atan2(dy1, dx1);
          const x0 = (pos0B[0] + pos0A[0]) * 0.5;
          const y0 = (pos0B[1] + pos0A[1]) * 0.5;
          const dx = 0.5 * (pos1B[0] + pos1A[0] - pos0A[0] - pos0B[0]);
          const dy = 0.5 * (pos1B[1] + pos1A[1] - pos0A[1] - pos0B[1]);
          const dr = r1 / r0;
          const dtheta = theta1 - theta0;
          ev.type = "pinch";
          ev.buttons = 0;
          ev.mods = {};
          ev.x0 = x0;
          ev.y0 = y0;
          ev.dx = dx;
          ev.dy = dy;
          ev.dz = 0;
          ev.dsx = dr;
          ev.dsy = dr;
          ev.dsz = 1;
          ev.theta = theta1;
          ev.dtheta = dtheta;
          emitter.emit("interaction", forward(ev, event));
        }
      }
    }
    if (fingers[0]) {
      pPos[0] = fingers[0].position.slice();
    }
    if (fingers[1]) {
      pPos[1] = fingers[1].position.slice();
    }
  }
  function onTouchRemoved(event) {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const removed = event.changedTouches[i];
      const idx = indexOfTouch(removed);
      if (idx !== -1) {
        fingers[idx] = null;
        activeCount = activeCount - 1;
      }
    }
    if (!ended && activeCount !== 2) {
      ended = true;
    }
    if (activeCount < 2) {
      ev.type = activeCount === 0 ? "touchend" : "pinchend";
      ev.buttons = 0;
      ev.mods = {};
      ev.x0 = 0;
      ev.y0 = 0;
      ev.dx = 0;
      ev.dy = 0;
      ev.dz = 0;
      ev.dsx = 1;
      ev.dsy = 1;
      ev.dsz = 1;
      ev.theta = 0;
      ev.dtheta = 0;
      emitter.emit("interactionend", forward(ev, event));
    }
  }
  function enable() {
    if (enabled) {
      return;
    }
    enabled = true;
    changeListener.enabled = true;
    element.addEventListener("wheel", onWheel, false);
    element.addEventListener("mousedown", onMouseDown, false);
    element.addEventListener("mousemove", onMouseMove, false);
    element.addEventListener("touchstart", onTouchStart, false);
    element.addEventListener("touchmove", onTouchMove, false);
    element.addEventListener("touchend", onTouchRemoved, false);
    element.addEventListener("touchcancel", onTouchRemoved, false);
  }
  function disable() {
    if (!enabled) {
      return;
    }
    enabled = false;
    changeListener.enabled = false;
    element.removeEventListener("wheel", onWheel, false);
    element.removeEventListener("mousedown", onMouseDown, false);
    element.removeEventListener("mousemove", onMouseMove, false);
    element.removeEventListener("touchstart", onTouchStart, false);
    element.removeEventListener("touchmove", onTouchMove, false);
    element.removeEventListener("touchend", onTouchRemoved, false);
    element.removeEventListener("touchcancel", onTouchRemoved, false);
  }
  enable();
  emitter.enable = enable;
  emitter.disable = disable;
  return emitter;
}

export default interactionEvents;
