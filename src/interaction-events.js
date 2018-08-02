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

module.exports = interactionEvents;

var extend = require('util-extend');
var mouse = require('mouse-event');
var mouseChange = require('mouse-change');
var eventOffset = require('mouse-event-offset');
var eventEmitter = require('event-emitter');

function Finger () {
  this.position = [0, 0];
  this.touch = null;
}

// can pass in callback as second argument
function interactionEvents (opts) {
  var options = extend({
    element: window,
    constrainZoom: false,
  }, opts || {});

  var emitter = eventEmitter({});

  var element = options.element;

  var enabled = false;
  // var mouseDown = false;
  // var wheelSpeed = 0.01;
  var pPos = [null, null];
  var fingers = [null, null];
  var ended = false;
  var activeCount = 0;
  var xprev;
  var yprev;

  var ev = {};

  var buttons = 0;
  var mods = {};
  var changeListener = mouseChange(element, function(pbuttons, px, py, pmods) {
    buttons = pbuttons;
    mods = pmods;
  });

  function forward(evOut, evIn) {
    evOut.preventDefault = evIn.preventDefault.bind(evIn);
    evOut.stopPropagation = evIn.stopPropagation.bind(evIn);
    return evOut;
  }

  function onWheel (event) {
    // var dx, dy, dz, x0, y0;

    /*
    Working on improving behavior for offset canvas
    */


    // var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    // try to better define canvas position
    // inst_canvas = document.querySelector('#something canvas')
    // console.log('THIS', this)
    var canvas_rect = this.getBoundingClientRect();


    ev.type = 'wheel';
    ev.buttons = buttons;
    ev.mods = mods;

    // ev.x0 = event.x - event.target.offsetLeft;
    // ev.y0 = event.y - event.target.offsetTop + scrollTop;


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

    emitter.emit('interaction', forward(ev, event));
  }

  function onMouseDown (event) {
    xprev = mouse.x(event);
    yprev = mouse.y(event);

    ev.type = 'mousedown';
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

    emitter.emit('interactionend', forward(ev, event));
  }

  function onMouseMove (event) {
    var x = mouse.x(event);
    var y = mouse.y(event);

    ev.type = 'mousemove';
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

    emitter.emit('interaction', forward(ev, event));
  }

  function indexOfTouch (touch) {
    var id = touch.identifier;
    for (var i = 0; i < fingers.length; i++) {
      if (fingers[i] &&
        fingers[i].touch &&
        fingers[i].touch.identifier === id) {
        return i;
      }
    }
    return -1;
  }

  function onTouchStart (event) {
    pPos = [null, null];
    for (var i = 0; i < event.changedTouches.length; i++) {
      var newTouch = event.changedTouches[i];
      var id = newTouch.identifier;
      var idx = indexOfTouch(id);

      if (idx === -1 && activeCount < 2) {
        var first = activeCount === 0;

        // newest and previous finger (previous may be undefined)
        var newIndex = fingers[0] ? 1 : 0;
        // var oldIndex = fingers[0] ? 0 : 1;
        var newFinger = new Finger();

        // add to stack
        fingers[newIndex] = newFinger;

        // activeCount++
        activeCount = activeCount + 1;

        // update touch event & position
        newFinger.touch = newTouch;
        eventOffset(newTouch, element, newFinger.position);

        // var oldTouch = fingers[oldIndex] ? fingers[oldIndex].touch : undefined;

        if (!first) {
          ended = false;
        }
      }
    }

    if (activeCount > 0) {
      ev.type = activeCount === 1 ? 'touchstart' : 'pinchstart';
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

      emitter.emit('interactionstart', forward(ev, event));
    }
  }

  // var px0 = null;
  // var py0 = null;

  function onTouchMove (event) {
    var idx;
    var changed = false;
    for (var i = 0; i < event.changedTouches.length; i++) {
      var movedTouch = event.changedTouches[i];
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
          if (fingers[idx]) {break;}
        }

        if (fingers[idx] && pPos[idx]) {
          var x = fingers[idx].position[0];
          var y = fingers[idx].position[1];

          var dx = x - pPos[idx][0];
          var dy = y - pPos[idx][1];

          ev.type = 'touch';
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

          emitter.emit('interaction', forward(ev, event));
        }
      } else if (activeCount === 2) {
        if (pPos[0] && pPos[1]) {
          // Previous two-finger vector:
          var pos0A = pPos[0];
          var pos0B = pPos[1];
          var dx0 = pos0B[0] - pos0A[0];
          var dy0 = pos0B[1] - pos0A[1];

          // Current two-finger vector:
          var pos1A = fingers[0].position;
          var pos1B = fingers[1].position;
          var dx1 = pos1B[0] - pos1A[0];
          var dy1 = pos1B[1] - pos1A[1];

          // r, theta for the previous two-finger touch:
          var r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
          var theta0 = Math.atan2(dy0, dx0);

          // r, theta for the current two-finger touch:
          var r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          var theta1 = Math.atan2(dy1, dx1);

          var x0 = (pos0B[0] + pos0A[0]) * 0.5;
          var y0 = (pos0B[1] + pos0A[1]) * 0.5;
          dx = 0.5 * (pos1B[0] + pos1A[0] - pos0A[0] - pos0B[0]);
          dy = 0.5 * (pos1B[1] + pos1A[1] - pos0A[1] - pos0B[1]);
          var dr = r1 / r0;
          var dtheta = theta1 - theta0;

          ev.type = 'pinch';
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

          emitter.emit('interaction', forward(ev, event));

          // var px0 = x0;
          // var py0 = y0;
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

  function onTouchRemoved (event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      var removed = event.changedTouches[i];
      var idx = indexOfTouch(removed);

      if (idx !== -1) {
        fingers[idx] = null;

        // activeCount--
        activeCount = activeCount - 1;

        // var otherIdx = idx === 0 ? 1 : 0;
        // var otherTouch = fingers[otherIdx] ? fingers[otherIdx].touch : undefined;
      }
    }

    if (!ended && activeCount !== 2) {
      ended = true;
    }

    if (activeCount < 2) {
      ev.type = activeCount === 0 ? 'touchend' : 'pinchend';
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

      emitter.emit('interactionend', forward(ev, event));
    }
  }


  function enable () {
    if (enabled) {return;}
    enabled = true;
    changeListener.enabled = true;
    element.addEventListener('wheel', onWheel, false);
    element.addEventListener('mousedown', onMouseDown, false);
    element.addEventListener('mousemove', onMouseMove, false);

    element.addEventListener('touchstart', onTouchStart, false);
    element.addEventListener('touchmove', onTouchMove, false);
    element.addEventListener('touchend', onTouchRemoved, false);
    element.addEventListener('touchcancel', onTouchRemoved, false);
  }

  function disable () {
    if (!enabled) {return;}
    enabled = false;
    changeListener.enabled = false;
    element.removeEventListener('wheel', onWheel, false);
    element.removeEventListener('mousedown', onMouseDown, false);
    element.removeEventListener('mousemove', onMouseMove, false);

    element.removeEventListener('touchstart', onTouchStart, false);
    element.removeEventListener('touchmove', onTouchMove, false);
    element.removeEventListener('touchend', onTouchRemoved, false);
    element.removeEventListener('touchcancel', onTouchRemoved, false);
  }

  enable();

  emitter.enable = enable;
  emitter.disable = disable;

  return emitter;
}
