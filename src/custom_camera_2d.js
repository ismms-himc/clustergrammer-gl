// © 2016 Ricky Reusser. MIT License.
// 'use strict';

var interactionEvents = require('./interaction-events');
var extend = require('xtend/mutable');
var mat4 = require('gl-mat4');
var EventEmitter = require('event-emitter');
var vec4 = require('gl-vec4');
// var $ = require('jquery');

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

module.exports = function makeCamera2D (regl, opts, zoom_data, viz_component) {

  // var zoom_data = $.extend(true, {}, zoom_data_ini);
  // var zoom_data = $.extend(true, {}, zoom_data_ini);

  opts = opts || {};

  var options = extend({
    element: opts.element || regl._gl.canvas,
  }, opts || {});

  var element = options.element;

  var dirty = true;

  var getWidth = element === window ?


    // function () { return element.innerWidth } :
    // function () { return element.offsetWidth }


    function () { return element.innerWidth; } : function () { return element.offsetWidth; };

  var getHeight = element === window ?

    // function () { return element.innerHeight } :
    // function () { return element.offsetHeight }

    function () { return element.innerHeight; } : function () { return element.offsetHeight; };

  var xrange = opts.xrange === undefined ? [-1, 1] : opts.xrange;
  var yrange = opts.yrange === undefined ? [-1, 1] : opts.yrange;
  var aspectRatio = opts.aspectRatio === undefined ? 1 : opts.aspectRatio;

  var width = getWidth();
  var height = getHeight();

  var xcen = 0.5 * (xrange[1] + xrange[0]);
  var ycen = 0.5 * (yrange[1] + yrange[0]);
  var xrng = 0.5 * (xrange[1] - xrange[0]);
  var yrng = xrng / aspectRatio / width * height;

  var mView = mat4.identity([]);
  mView[0] = 1 / xrng;
  mView[5] = 1 / yrng;
  mView[12] = -xcen / xrng;
  mView[13] = -ycen / yrng;

  var mViewport = mat4.identity([]);
  var mInvViewport = mat4.identity([]);

  function computeViewport () {
    width = getWidth();
    height = getHeight();

    mat4.viewport(mViewport, 0, height, width, -height, 0, 1);
    mat4.invert(mInvViewport, mViewport);
  }

  computeViewport();

  var dViewport = [];

  interactionEvents({
    element: element,
  }).on('interactionstart', function (ev) {
    ev.preventDefault();
  }).on('interactionend', function (ev) {
    ev.preventDefault();
  }).on('interaction', function (ev) {

    //ev.dtheta = 0;
    //var c = Math.cos(ev.dtheta);
    //var s = Math.sin(ev.dtheta);

    switch (ev.type) {
      case 'wheel':
        ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
        ev.dx = ev.dy = 0;
        break;
    }

    if (ev.buttons || ['wheel', 'touch', 'pinch'].indexOf(ev.type) !== -1)  {

      // console.log('viz_component: ' + viz_component);

      /*
      Sanitize zoom data components
      */

      var inst_x_zoom = zoom_data.x.inst_zoom;
      var inst_x_pan_by_zoom = zoom_data.x.pan_by_zoom;
      var inst_x_pan_by_drag = zoom_data.x.pan_by_drag;

      var inst_y_zoom = zoom_data.y.inst_zoom;
      var inst_y_pan_by_zoom = zoom_data.y.pan_by_zoom;
      var inst_y_pan_by_drag = zoom_data.y.pan_by_drag;

      if (viz_component === 'row-labels'){
        inst_x_zoom = 1;
        inst_x_pan_by_drag = 0;
        inst_x_pan_by_zoom = 0;
      }

      if (viz_component === 'col-labels'){
        inst_y_zoom = 1;
        inst_y_pan_by_drag = 0;
        inst_y_pan_by_zoom = 0;
      }

      if (viz_component === 'static'){
        inst_x_zoom = 1;
        inst_x_pan_by_drag = 0;
        inst_x_pan_by_zoom = 0;
        inst_y_zoom = 1;
        inst_y_pan_by_drag = 0;
        inst_y_pan_by_zoom = 0;
      }

      ev.preventDefault();

      dViewport[0] = inst_x_zoom;
      dViewport[1] = 0;
      dViewport[2] = 0;
      dViewport[3] = 0;
      dViewport[4] = 0;
      dViewport[5] = inst_y_zoom;
      dViewport[6] = 0;
      dViewport[7] = 0;
      dViewport[8] = 0;
      dViewport[9] = 0;
      dViewport[10] = 1;
      dViewport[11] = 0;
      dViewport[12] = inst_x_pan_by_zoom + inst_x_pan_by_drag;
      dViewport[13] = inst_y_pan_by_zoom + inst_y_pan_by_drag;
      dViewport[14] = 0;
      dViewport[15] = 1;

      mat4.multiply(dViewport, dViewport, mViewport);
      mat4.multiply(dViewport, mInvViewport, dViewport);
      mat4.multiply(mView, dViewport, mView);
      dirty = true;

    }

    var xy = vec4.transformMat4([],
      vec4.transformMat4([], [ev.x0, ev.y0, 0, 1], mInvViewport),
      mat4.invert([], mView)
    );

    ev.x = xy[0];
    ev.y = xy[1];

    emitter.emit('move', ev);
  });

  var setProps = regl({
    context: {
      view: regl.prop('view'),
    }
  });

  var emitter = new EventEmitter();

  var inst_camera = {
    draw: function (cb) {
      setProps({
        view: mView,
      }, function () {
        cb({
          dirty: dirty
        });
      });
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

      // console.log('resizing');

      // Reapply the aspect ratio:
      mView[5] = mView[0] * aspectRatio * width / height;
      dirty = true;
    }
  };

  return inst_camera;

};