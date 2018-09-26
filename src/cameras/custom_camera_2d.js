// © 2016 Ricky Reusser. MIT License.
// 'use strict';

var interactionEvents = require('./../interactions/interaction-events');
var extend = require('xtend/mutable');
var mat4 = require('gl-mat4');
var EventEmitter = require('event-emitter');
var camera_interaction = require('./camera_interaction');

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

module.exports = function makeCamera2D (regl, params, opts, zoom_data, viz_component) {

  opts = opts || {};

  var options = extend({
    element: opts.element || regl._gl.canvas,
  }, opts || {});

  var element = options.element;

  var dirty = true;

  var getWidth = element === window ?


  function () { return element.innerWidth; } : function () { return element.offsetWidth; };

  var getHeight = element === window ?

  function () { return element.innerHeight; } : function () { return element.offsetHeight; };

  var xrange = opts.xrange === undefined ? [-1, 1] : opts.xrange;
  var yrange = opts.yrange === undefined ? [-1, 1] : opts.yrange;
  var aspectRatio = opts.aspectRatio === undefined ? 1 : opts.aspectRatio;

  var width = getWidth();
  var height = getHeight();

  var xcen = 0.5 * (xrange[1] + xrange[0]) + params.viz_dim.shift_camera.x;
  var ycen = 0.5 * (yrange[1] + yrange[0]) + params.viz_dim.shift_camera.y;
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

  var emitter = new EventEmitter();

  /////////////////////////////////////////
  // Original interaction tracking
  /////////////////////////////////////////
  interactionEvents({
    element: element,
  }).on('interactionstart', function (ev) {
    ev.preventDefault();
  }).on('interactionend', function (ev) {
    ev.preventDefault();
  }).on('interaction', function (ev) {
    if (params.viz_interact){
      camera_interaction(zoom_data, ev, viz_component, mInvViewport, mat4, mView,
                         emitter, dViewport, mViewport);
    }
  });

  // /////////////////////////////////////////
  // // Alternate interaction tracking
  // /////////////////////////////////////////
  // normalizedInteractionEvents({
  //   element: element
  // })
  // .on('wheel', function (ev) {
  //   console.log('norm interact: camera');
  //   if (params.viz_interact){
  //     camera_interaction(zoom_data, ev, viz_component, mInvViewport, mat4, mView,
  //                        emitter, dViewport, mViewport);
  //   }
  // });

  var setProps = regl({
    context: {
      view: regl.prop('view'),
    }
  });

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

      // Reapply the aspect ratio:
      mView[5] = mView[0] * aspectRatio * width / height;
      dirty = true;

    }
  };

  return inst_camera;

};