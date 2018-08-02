// The MIT License (MIT) Copyright (c) 2018 Ricky Reusser

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Original license:
// Touch handling in this module is heavily based on code from the MIT-licensed touch-pinch module.

// The MIT License (MIT) Copyright (c) 2015 Jam3

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// 'use strict';

'use strict';

console.log('using custom normalized-interaction-events')

module.exports = normalizedInteractionEvents;

var mouseChange = require('mouse-change');
var eventOffset = require('mouse-event-offset');
var eventEmitter = require('event-emitter');

function normalizedInteractionEvents (element) {
  element = element || window;

  // debugger
  // console.log('normalized-interaction-events', element)

  // nick change
  element = element.element

  var emitter = eventEmitter();
  var previousPosition = [null, null];
  var previousFingerPosition = [null, null];
  var currentPosition = [null, null];
  var fingers = [null, null];
  var activeTouchCount = 0;
  var ev = {};


  var width, height;

  var getSize = element === window ? function () {
    width = window.innerWidth;
    height = window.innerHeight;
  } : function () {
    width = element.clientWidth;
    height = element.clientHeight;
  }

  var buttons = 0;
  var mouseX;
  var mouseY;
  var mods = {};
  var changeListener = mouseChange(element, function(pbuttons, px, py, pmods) {
    mouseX = px;
    mouseY = py;
    buttons = pbuttons;
    mods = pmods;
  });

  function onWheel (event) {
    eventOffset(event, element, currentPosition);
    getSize();

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = ev.x = ev.x1 = 2 * currentPosition[0] / width - 1;
    ev.y0 = ev.y = ev.y1 = 1 - 2 * currentPosition[1] / height;
    ev.x2 = null;
    ev.y2 = null;
    ev.dx = 2 * event.deltaX / width;
    ev.dy = -2 * event.deltaY / height;
    ev.dz = 2 * event.deltaZ / width;
    ev.active = 1;
    ev.zoomx = 1;
    ev.zoomy = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('wheel', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  var x0 = null;
  var y0 = null;
  var active = 0;

  function onMouseUp (event) {
    eventOffset(event, element, currentPosition);
    active = 0;
    getSize();

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x = ev.x1 = 2 * currentPosition[0] / width - 1;
    ev.y = ev.y1 = 1 - 2 * currentPosition[1] / height;
    ev.x2 = null;
    ev.y2 = null;
    ev.active = active;
    ev.x0 = 2 * x0 / width - 1;
    ev.y0 = 1 - 2 * y0 / height;
    ev.dx = 0;
    ev.dy = 0;
    ev.dz = 0;
    ev.zoomx = 1;
    ev.zoomy = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('mouseup', ev);

    x0 = y0 = null;

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function onMouseDown (event) {
    eventOffset(event, element, currentPosition);
    active = 1;
    getSize();

    x0 = mouseX;
    y0 = mouseY;

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x = ev.x0 = ev.x1 = 2 * currentPosition[0] / width - 1;
    ev.y = ev.y0 = ev.y1 = 1 - 2 * currentPosition[1] / height;
    ev.x2 = null;
    ev.y2 = null;
    ev.active = active;
    ev.dx = 0;
    ev.dy = 0;
    ev.dz = 0;
    ev.zoomx = 1;
    ev.zoomy = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('mousedown', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function onMouseMove (event) {
    eventOffset(event, element, currentPosition);
    getSize();

    ev.buttons = buttons;
    ev.mods = mods;
    ev.x0 = 2 * x0 / width - 1;
    ev.y0 = 1 - 2 * y0 / height;
    ev.x = ev.x1 = 2 * currentPosition[0] / width - 1;
    ev.y = ev.y1 = 1 - 2 * currentPosition[1] / height;
    ev.x2 = null;
    ev.y2 = null;
    ev.dx = 2 * (currentPosition[0] - previousPosition[0]) / width;
    ev.dy = -2 * (currentPosition[1] - previousPosition[1]) / height;
    ev.active = active;
    ev.dz = 0;
    ev.zoomx = 1;
    ev.zoomy = 1;
    ev.theta = 0;
    ev.dtheta = 0;
    ev.originalEvent = event;

    emitter.emit('mousemove', ev);

    previousPosition[0] = currentPosition[0];
    previousPosition[1] = currentPosition[1];
  }

  function indexOfTouch (touch) {
    var id = touch.identifier
    for (var i = 0; i < fingers.length; i++) {
      if (fingers[i] &&
        fingers[i].touch &&
        fingers[i].touch.identifier === id) {
        return i
      }
    }
    return -1
  }

  function onTouchStart (event) {
    previousFingerPosition[0] = null;
    previousFingerPosition[1] = null;

    for (var i = 0; i < event.changedTouches.length; i++) {
      var newTouch = event.changedTouches[i]
      var id = newTouch.identifier
      var idx = indexOfTouch(id)

      if (idx === -1 && activeTouchCount < 2) {
        var first = activeTouchCount === 0

        // newest and previous finger (previous may be undefined)
        var newIndex = fingers[0] ? 1 : 0
        var oldIndex = fingers[0] ? 0 : 1
        var newFinger = {
          position: [0, 0],
          touch: null
        };

        // add to stack
        fingers[newIndex] = newFinger
        activeTouchCount++

        // update touch event & position
        newFinger.touch = newTouch
        eventOffset(newTouch, element, newFinger.position)

        var oldTouch = fingers[oldIndex] ? fingers[oldIndex].touch : undefined
      }
    }

    var xavg = 0;
    var yavg = 0;
    var fingerCount = 0;
    for (var i = 0; i < fingers.length; i++) {
      if (!fingers[i]) continue;
      xavg += fingers[i].position[0];
      yavg += fingers[i].position[1];
      fingerCount++;
    }
    xavg /= fingerCount;
    yavg /= fingerCount;


    if (activeTouchCount > 0) {
      ev.theta = 0;

      if (fingerCount > 1) {
        var dx = fingers[1].position[0] - fingers[0].position[0];
        var dy = (fingers[0].position[1] - fingers[1].position[1]) * width / height;
        ev.theta = Math.atan2(dy, dx);
      }

      getSize();
      ev.buttons = 0;
      ev.mods = {};
      ev.active = activeTouchCount;
      x0 = xavg;
      y0 = yavg;
      ev.x0 = 2 * x0 / width - 1;
      ev.y0 = 1 - 2 * y0 / height;
      ev.x = 2 * xavg / width - 1;
      ev.y = 1 - 2 * yavg / height;
      ev.x1 = 2 * fingers[0].position[0] / width - 1;
      ev.y1 = 1 - 2 * fingers[0].position[1] / height;
      if (activeTouchCount > 1) {
        ev.x2 = 2 * fingers[1].position[0] / width - 1;
        ev.y2 = 1 - 2 * fingers[1].position[1] / height;
      }
      ev.active = activeTouchCount;
      ev.dx = 0;
      ev.dy = 0;
      ev.dz = 0;
      ev.zoomx = 1;
      ev.zoomy = 1;
      ev.dtheta = 0;
      ev.originalEvent = event;
      emitter.emit(activeTouchCount === 1 ? 'touchstart' : 'pinchstart', ev);
    }
  }

  function onTouchMove (event) {
    var idx;
    var changed = false
    for (var i = 0; i < event.changedTouches.length; i++) {
      var movedTouch = event.changedTouches[i]
      idx = indexOfTouch(movedTouch)

      if (idx !== -1) {
        changed = true
        fingers[idx].touch = movedTouch // avoid caching touches
        eventOffset(movedTouch, element, fingers[idx].position)
      }
    }

    if (changed) {
      if (activeTouchCount === 1) {
        for (idx = 0; idx < fingers.length; idx++) {
          if (fingers[idx]) break;
        }

        if (fingers[idx] && previousFingerPosition[idx]) {
          var x = fingers[idx].position[0];
          var y = fingers[idx].position[1];

          var dx = x - previousFingerPosition[idx][0];
          var dy = y - previousFingerPosition[idx][1];

          ev.buttons = 0;
          ev.mods = {};
          ev.active = activeTouchCount;
          ev.x = ev.x1 = 2 * x / width - 1;
          ev.y = ev.y1 = 1 - 2 * y / height;
          ev.x2 = null;
          ev.y2 = null;
          ev.x0 = 2 * x0 / width - 1;
          ev.y0 = 1 - 2 * y0 / height;
          ev.dx = 2 * dx / width;
          ev.dy = -2 * dy / height;
          ev.dz = 0;
          ev.zoomx = 1;
          ev.zoomy = 1;
          ev.theta = 0;
          ev.dtheta = 0;
          ev.originalEvent = event;

          emitter.emit('touchmove', ev);
        }
      } else if (activeTouchCount === 2) {
        if (previousFingerPosition[0] && previousFingerPosition[1]) {
          // Previous two-finger vector:
          var pos0A = previousFingerPosition[0];
          var pos0B = previousFingerPosition[1];
          var dx0 = pos0B[0] - pos0A[0];
          var dy0 = (pos0B[1] - pos0A[1]) * width / height;

          // Current two-finger vector:
          var pos1A = fingers[0].position;
          var pos1B = fingers[1].position;
          var dx1 = pos1B[0] - pos1A[0];
          var dy1 = (pos1A[1] - pos1B[1]) * width / height;

          // r, theta for the previous two-finger touch:
          var r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) * 0.5;
          var theta0 = Math.atan2(dy0, dx0);

          // r, theta for the current two-finger touch:
          var r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) * 0.5;
          var theta1 = Math.atan2(dy1, dx1);

          var xavg = (pos0B[0] + pos0A[0]) * 0.5;
          var yavg = (pos0B[1] + pos0A[1]) * 0.5;
          var dx = 0.5 * (pos1B[0] + pos1A[0] - pos0A[0] - pos0B[0]);
          var dy = 0.5 * (pos1B[1] + pos1A[1] - pos0A[1] - pos0B[1]);

          var dr = r1 / r0;
          var dtheta = theta1 - theta0;

          ev.buttons = 0;
          ev.mods = mods;
          ev.active = activeTouchCount;
          ev.x = 2 * xavg / width - 1;
          ev.y = 1 - 2 * yavg / height;
          ev.x0 = 2 * x0 / width - 1;
          ev.y0 = 1 - 2 * y0 / height;
          ev.x1 = 2 * pos1A[0] / width - 1;
          ev.y1 = 1 - 2 * pos1A[1] / height;
          ev.x2 = 2 * pos1B[0] / width - 1;
          ev.y2 = 1 - 2 * pos1B[1] / height;
          ev.dx = 2 * dx / width;
          ev.dy = -2 * dy / height;
          ev.dz = 0;
          ev.zoomx = dr;
          ev.zoomy = dr;
          ev.theta = theta1;
          ev.dtheta = dtheta;
          ev.originalEvent = event;

          emitter.emit('pinchmove', ev);
        }
      }
    }

    if (fingers[0]) {
      previousFingerPosition[0] = fingers[0].position.slice();
    }

    if (fingers[1]) {
      previousFingerPosition[1] = fingers[1].position.slice();
    }
  }

  function onTouchRemoved (event) {
    var lastFinger;
    for (var i = 0; i < event.changedTouches.length; i++) {
      var removed = event.changedTouches[i]
      var idx = indexOfTouch(removed)

      if (idx !== -1) {
        lastFinger = fingers[idx];
        fingers[idx] = null
        activeTouchCount--
        var otherIdx = idx === 0 ? 1 : 0
        var otherTouch = fingers[otherIdx] ? fingers[otherIdx].touch : undefined
      }
    }

    var xavg = 0;
    var yavg = 0;
    if (activeTouchCount === 0) {
      if (lastFinger) {
        xavg = lastFinger.position[0];
        yavg = lastFinger.position[1];
      }
    } else {
      var fingerCount = 0;
      for (var i = 0; i < fingers.length; i++) {
        if (!fingers[i]) continue;
        xavg += fingers[i].position[0];
        yavg += fingers[i].position[1];
        fingerCount++;
      }
      xavg /= fingerCount;
      yavg /= fingerCount;
    }

    if (activeTouchCount < 2) {
      ev.buttons = 0;
      ev.mods = mods;
      ev.active = activeTouchCount;
      ev.x = 2 * xavg / width - 1;
      ev.y = 1 - 2 * yavg / height;
      ev.x0 = 2 * x0 / width - 1;
      ev.y0 = 1 - 2 * y0 / height;
      ev.dx = 0;
      ev.dy = 0;
      ev.dz = 0;
      ev.zoomx = 1;
      ev.zoomy = 1;
      ev.theta = 0;
      ev.dtheta = 0;
      ev.originalEvent = event;
      emitter.emit(activeTouchCount === 0 ? 'touchend' : 'pinchend', ev);
    }
    if (activeTouchCount === 0) {
      x0 = y0 = null;
    }
  }


  var enabled = false;
  function enable () {
    if (enabled) return;
    enabled = true;
    changeListener.enabled = true;
    element.addEventListener('wheel', onWheel, false);
    element.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);

    element.addEventListener('touchstart', onTouchStart, false);
    window.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('touchend', onTouchRemoved, false)
    window.addEventListener('touchcancel', onTouchRemoved, false)
  }

  function disable () {
    if (!enabled) return;
    enabled = false;
    changeListener.enabled = false;
    element.removeEventListener('wheel', onWheel, false);
    element.removeEventListener('mousedown', onMouseDown, false);
    window.removeEventListener('mousemove', onMouseMove, false);
    window.removeEventListener('mouseup', onMouseUp, false);

    element.removeEventListener('touchstart', onTouchStart, false);
    window.removeEventListener('touchmove', onTouchMove, false);
    window.removeEventListener('touchend', onTouchRemoved, false)
    window.removeEventListener('touchcancel', onTouchRemoved, false)
  }

  enable();

  emitter.enable = enable;
  emitter.disable = disable;

  return emitter;
}
