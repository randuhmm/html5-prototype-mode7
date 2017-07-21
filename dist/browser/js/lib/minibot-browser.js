require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var core, display, engine, event, geom, graphics, network, resource;

/** @namespace Core namespace */
core = {};
core.Manager = require('minibot/core/Manager').default;
core.Utils = require('minibot/core/Utils');

/** @namespace Display namespace */
display = {};
display.DisplayObject = require('minibot/display/DisplayObject').default;

/** @namespace Display.Scene namespace */
display.scene = {};
display.scene.SceneDisplayObject = require('minibot/display/scene/SceneDisplayObject').default;
display.scene.Animation = require('minibot/display/scene/Animation').default;
display.scene.Button = require('minibot/display/scene/Button').default;
display.scene.Container = require('minibot/display/scene/Container').default;
//display.scene.Mask = require('minibot/display/scene/Mask').default;
display.scene.Rect = require('minibot/display/scene/Rect').default;
//display.scene.RoundedRect = require('minibot/display/scene/RoundedRect').default;
display.scene.Sprite = require('minibot/display/scene/Sprite').default;
display.scene.Scene = require('minibot/display/scene/Scene').default;
display.scene.Text = require('minibot/display/scene/Text').default;
display.scene.TextStyle = require('minibot/display/scene/TextStyle').default;

/** @namespace Display.Html namespace */
display.html = {};
display.html.HtmlElement = require('minibot/display/html/HtmlElement').default;
display.html.CanvasScene = require('minibot/display/html/CanvasScene').default;

// /** @namespace Engine namespace */
engine = {};
engine.Engine = require('minibot/engine/Engine').default;
engine.EngineComponent = require('minibot/engine/EngineComponent').default;
engine.EngineFactory = require('minibot/engine/EngineFactory').default;
engine.EngineObject = require('minibot/engine/EngineObject').default;
engine.EngineSystem = require('minibot/engine/EngineSystem').default;

engine.component = {};
engine.component.DisplayComponent = require('minibot/engine/component/DisplayComponent').default;
engine.component.PhysicsComponent = require('minibot/engine/component/PhysicsComponent').default;
engine.component.InputComponent = require('minibot/engine/component/InputComponent').default;

engine.system = {};
engine.system.DisplaySystem = require('minibot/engine/system/DisplaySystem').default;
engine.system.InputSystem = require('minibot/engine/system/InputSystem').default;

/** @namespace Event namespace */
event = {};
event.EventDispatcher = require('minibot/event/EventDispatcher').default;
event.BaseEvent = require('minibot/event/BaseEvent').default;
event.MouseEvent = require('minibot/event/MouseEvent').default;
event.TouchEvent = require('minibot/event/TouchEvent').default;
event.ButtonEvent = require('minibot/event/ButtonEvent').default;
event.EngineEvent = require('minibot/event/EngineEvent').default;
event.KeyboardEvent = require('minibot/event/KeyboardEvent').default;

event.enum = {};
event.enum.Keyboard = require('minibot/event/enum/Keyboard').default;

/** @namespace Geom namespace */
geom = {};
geom.Vector2 = require('minibot/geom/Vector2').default;
geom.Rectangle = require('minibot/geom/Rectangle').default;

/** @namespace Graphics namespace */
graphics = {};
graphics.Color = require('minibot/graphics/Color').default;
graphics.Pattern = require('minibot/graphics/Pattern').default;

network = {};
network.Ajax = require('minibot/network/Ajax').default;

// /** @namespace Resource namespace */
resource = {};
resource.Resource = require('minibot/resource/Resource').default;
resource.ResourceManager = require('minibot/resource/ResourceManager').default;
resource.AnimationResource = require('minibot/resource/AnimationResource').default;
resource.ImageResource = require('minibot/resource/ImageResource').default;
resource.SpriteResource = require('minibot/resource/SpriteResource').default;

exports.default = {
  core: core,
  display: display,
  engine: engine,
  event: event,
  geom: geom,
  graphics: graphics,
  network: network,
  resource: resource
};

},{"minibot/core/Manager":2,"minibot/core/Utils":3,"minibot/display/DisplayObject":4,"minibot/display/html/CanvasScene":6,"minibot/display/html/HtmlElement":7,"minibot/display/scene/Animation":8,"minibot/display/scene/Button":10,"minibot/display/scene/Container":11,"minibot/display/scene/Rect":12,"minibot/display/scene/Scene":13,"minibot/display/scene/SceneDisplayObject":14,"minibot/display/scene/Sprite":15,"minibot/display/scene/Text":16,"minibot/display/scene/TextStyle":17,"minibot/engine/Engine":18,"minibot/engine/EngineComponent":19,"minibot/engine/EngineFactory":20,"minibot/engine/EngineObject":21,"minibot/engine/EngineSystem":22,"minibot/engine/component/DisplayComponent":23,"minibot/engine/component/InputComponent":24,"minibot/engine/component/PhysicsComponent":25,"minibot/engine/system/DisplaySystem":26,"minibot/engine/system/InputSystem":27,"minibot/event/BaseEvent":28,"minibot/event/ButtonEvent":29,"minibot/event/EngineEvent":30,"minibot/event/EventDispatcher":31,"minibot/event/KeyboardEvent":33,"minibot/event/MouseEvent":34,"minibot/event/TouchEvent":35,"minibot/event/enum/Keyboard":36,"minibot/geom/Rectangle":37,"minibot/geom/Vector2":38,"minibot/graphics/Color":39,"minibot/graphics/Pattern":40,"minibot/network/Ajax":41,"minibot/resource/AnimationResource":42,"minibot/resource/ImageResource":43,"minibot/resource/Resource":44,"minibot/resource/ResourceManager":45,"minibot/resource/SpriteResource":46}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager
/** @lends core.Manager# */
=

/**
 * Description of constructor.
 * @class Short description of class.
 * Long Description of class.
 * @constructs
 * @param {String} key The instance key.
 */
function Manager(key) {
  _classCallCheck(this, Manager);

  if (key in Manager.instanceMap) {
    throw new Error(Manager.MULTITON_MSG);
  }
  Manager.instanceMap[key] = this;
};

Manager.instanceMap = [];

Manager.MULTITON_MSG = "Manager instance for this Multiton key already constructed!";

Manager.getInstance = function (key) {
  if (null === key) return null;
  if (Manager.instanceMap[key] === null) {
    Manager.instanceMap[key] = new Manager(key);
  }
  return Manager.instanceMap[key];
};

Manager.hasCore = function (key) {
  return key in Manager.instanceMap;
};

Manager.removeCore = function (key) {
  if (Manager.instanceMap[key] === null) return;
  delete Manager.instanceMap[key];
};

exports.default = Manager;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var BindAsEventListener = function BindAsEventListener(fx, ctx) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function (event) {
    var a = [event];
    for (var i = args.length - 1; i >= 0; i--) {
      a[1 + i] = args[i];
    }
    fx.apply(ctx, a);
  };
};

var Bind = function Bind(fx, ctx) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function () {
    var _args;
    if (arguments.length > 0) {
      _args = args.concat(Array.prototype.slice.call(arguments));
    } else {
      _args = args;
    }
    fx.apply(ctx, _args);
  };
};

var Defer = function Defer(fx, ctx) {
  var args = Array.prototype.slice.call(arguments, 2);
  setTimeout(function () {
    fx.apply(ctx, args);
  }, 0);
};

var StringToQueryParams = function StringToQueryParams(str, separator) {
  var match = str.trim().match(/([^?#]*)(#.*)?$/);
  var params = {};
  if (match) {
    var segments = match[1].split(separator || '&');
    var pair, key, value;
    for (var i = 0; i < segments.length; i++) {
      pair = segments[i];
      if ((pair = pair.split('='))[0]) {
        key = decodeURIComponent(pair.shift());
        value = pair.length > 1 ? pair.join('=') : pair[0];
        if (key in params) {
          if (!Object.isArray(params[key])) params[key] = [params[key]];
          params[key].push(value);
        } else {
          params[key] = value;
        }
      }
    }
  }
  return params;
};

// var ParamsToQueryString = function(params) {
//   var results = [];
//   var key, value;
//   for(key in params) {
//     value = params[key];
//     key = encodeURIComponent(key);

//     if (value && typeof value == 'object') {
//       if (isArray(value)) {
//         var queryValues = [];
//         for (var i = 0, len = values.length, value; i < len; i++) {
//           value = values[i];
//           queryValues.push(toQueryPair(key, value));
//         }
//         return results.concat(queryValues);
//       }
//     } else results.push(toQueryPair(key, values));
//   }
//     return results;
//   }).join('&');
// }


exports.Bind = Bind;
exports.BindAsEventListener = BindAsEventListener;
exports.Defer = Defer;
exports.StringToQueryParams = StringToQueryParams;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventDispatcher = require('minibot/event/EventDispatcher');

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a new DisplayObject instance.
 * @class
 * @constructs
 * @name DisplayObject
 * @extends event.EventDispatcher
 */
var DisplayObject = function DisplayObject() {
  _EventDispatcher2.default.call(this);
};

DisplayObject.prototype = Object.create(_EventDispatcher2.default.prototype);
DisplayObject.prototype.constructor = DisplayObject;
DisplayObject.subclasses = [];

/**
 * The object that contains this DisplayObject.
 * @memberof DisplayObject.prototype
 * @type object
 */
DisplayObject.prototype.parent = null;

/**
 * Actions to be performed upon being added to a parent object.
 * @memberof DisplayObject.prototype
 */
DisplayObject.prototype.onAddedToParent = function () {
  // override
};

/**
 * Adds a resource to the map.
 * @param {} klass The class of the resource.
 * @param {type} type The type of the resource.
 * @param {Integer} id The id of the resource.
 */
DisplayObject.AddResource = function (klass, type, id) {
  if (klass.RESOURCES === undefined) klass.RESOURCES = {};
  if (klass.RESOURCES[type] === undefined) klass.RESOURCES[type] = {};
  klass.RESOURCES[type][id] = null;
};

/**
 * Adds an object to the map.
 * @param {} klass The class of the object.
 * @param {object} object
 */
DisplayObject.AddObject = function (klass, object) {
  if (klass.OBJECTS === undefined) klass.OBJECTS = [];
  klass.OBJECTS.push(object);
};

/**
 * Returns a resource of specified type and id.
 * @param {} klass The class of the resource.
 * @param {type} type The type of the resource.
 * @param {Integer} id The type of the resource.
 * @returns {resource} The resource. A result of null means the resource is not on the map.
 */
DisplayObject.GetResource = function (klass, type, id) {
  if (klass.RESOURCES === undefined) return null;
  if (klass.RESOURCES[type] === undefined) return null;
  if (klass.RESOURCES[type][id] === undefined) return null;
  return klass.RESOURCES[type][id];
};

DisplayObject.ALIGN_HORZ_CENTER = 1;

DisplayObject.ALIGN_VERT_CENTER = 2;

exports.default = DisplayObject;

},{"minibot/event/EventDispatcher":31}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Buffer2 = require('minibot/display/scene/Buffer');

var _Buffer3 = _interopRequireDefault(_Buffer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasBuffer = function (_Buffer) {
  _inherits(CanvasBuffer, _Buffer);

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.html.HtmlElement
   * @constructs
   */
  function CanvasBuffer(scene) {
    _classCallCheck(this, CanvasBuffer);

    return _possibleConstructorReturn(this, (CanvasBuffer.__proto__ || Object.getPrototypeOf(CanvasBuffer)).call(this, scene));
  }

  _createClass(CanvasBuffer, [{
    key: 'setWidth',
    value: function setWidth(width) {
      _get(CanvasBuffer.prototype.__proto__ || Object.getPrototypeOf(CanvasBuffer.prototype), 'setWidth', this).call(this, width);
      this.bufferScene.setWidth(width);
    }
  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      _get(CanvasBuffer.prototype.__proto__ || Object.getPrototypeOf(CanvasBuffer.prototype), 'setWidth', this).call(this, height);
      this.bufferScene.setHeight(height);
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      var element = this.bufferScene.getElement();
      this.scene.drawImage(element, x * -1, y * -1, this.scene.width, this.scene.height, 0, 0, this.scene.width, this.scene.height);
    }
  }]);

  return CanvasBuffer;
}(_Buffer3.default
/** @lends display.html.CanvasBuffer# */
);

exports.default = CanvasBuffer;

},{"minibot/display/scene/Buffer":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Scene2 = require('minibot/display/scene/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _Utils = require('minibot/core/Utils');

var _MouseEvent = require('minibot/event/MouseEvent');

var _MouseEvent2 = _interopRequireDefault(_MouseEvent);

var _TouchEvent = require('minibot/event/TouchEvent');

var _TouchEvent2 = _interopRequireDefault(_TouchEvent);

var _KeyboardEvent = require('minibot/event/KeyboardEvent');

var _KeyboardEvent2 = _interopRequireDefault(_KeyboardEvent);

var _Keyboard = require('minibot/event/enum/Keyboard');

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _Color = require('minibot/graphics/Color');

var _Color2 = _interopRequireDefault(_Color);

var _CanvasBuffer = require('minibot/display/html/CanvasBuffer');

var _CanvasBuffer2 = _interopRequireDefault(_CanvasBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasScene = function (_Scene) {
  _inherits(CanvasScene, _Scene);

  // element: null,

  // context: null,

  // ratio: null,

  // enableEvents: null,

  // eventTypes: null,

  // mouseBfx: null,

  // keyboardBfx: null,

  // touchBfx: null,

  // maxTouches: null,
  // touchMap: null,
  // touchCount: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.html.HtmlElement
   * @constructs
   */
  function CanvasScene(options) {
    _classCallCheck(this, CanvasScene);

    if (options == undefined) options = {};

    var _this = _possibleConstructorReturn(this, (CanvasScene.__proto__ || Object.getPrototypeOf(CanvasScene)).call(this, options));

    _this.element = _this.hasOption('element') ? _this.getOption('element') : new Element('canvas');
    _this.enableEvents = _this.hasOption('enableEvents') ? _this.getOption('enableEvents') : true;
    _this.eventTypes = _this.hasOption('eventTypes') ? _this.getOption('eventTypes') : _Scene3.default
    /** @lends display.html.CanvasScene# */
    .MOUSE_EVENTS;
    _this.maxTouches = _this.hasOption('maxTouches') ? _this.getOption('maxTouches') : 1;

    _this.setWidth(_this.hasOption('width') ? _this.getOption('width') : _this.element.width);
    _this.setHeight(_this.hasOption('height') ? _this.getOption('height') : _this.element.height);

    _this.ratio = 1;
    if (_this.hasOption('ratio')) {
      _this.ratio = _this.getOption('ratio');
      if (_this.ratio != 1) {
        _this.element.style.width = _this.element.width / _this.ratio + "px";
        _this.element.style.height = _this.element.height / _this.ratio + "px";
      }
    }

    _this.context = _this.element.getContext("2d");

    _this.touchMap = {};
    _this.touchCount = 0;

    if (_this.enableEvents) {

      if (_this.eventTypes & _Scene3.default.MOUSE_EVENTS) {
        // Mouse Event Handling
        _this.mouseBfx = (0, _Utils.BindAsEventListener)(_this.handleMouseEvent, _this);
        _this.element.onmousedown = _this.mouseBfx;
        _this.element.onmouseup = _this.mouseBfx;
        _this.element.onmousemove = _this.mouseBfx;
      }

      if (_this.eventTypes & _Scene3.default.TOUCH_EVENTS) {
        // Mouse Event Handling
        _this.touchBfx = (0, _Utils.BindAsEventListener)(_this.handleTouchEvent, _this);
        _this.element.ontouchstart = _this.touchBfx;
        _this.element.ontouchend = _this.touchBfx;
        _this.element.ontouchmove = _this.touchBfx;
      }

      if (_this.eventTypes & _Scene3.default.KEYBOARD_EVENTS) {
        // Keyboard Event Handling
        _this.keyboardBfx = (0, _Utils.BindAsEventListener)(_this.handleKeyboardEvent, _this);
        document.onkeydown = _this.keyboardBfx;
        document.onkeyup = _this.keyboardBfx;
      }
    }
    return _this;
  }

  _createClass(CanvasScene, [{
    key: 'setWidth',
    value: function setWidth(width) {
      _get(CanvasScene.prototype.__proto__ || Object.getPrototypeOf(CanvasScene.prototype), 'setWidth', this).call(this, width);
      this.element.width = width;
    }
  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      _get(CanvasScene.prototype.__proto__ || Object.getPrototypeOf(CanvasScene.prototype), 'setHeight', this).call(this, height);
      this.element.height = height;
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.setWidth(this.width);
    }
  }, {
    key: 'drawImage',
    value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
      this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }, {
    key: 'drawLine',
    value: function drawLine(x1, y1, x2, y2) {
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    }
  }, {
    key: 'drawPoly',
    value: function drawPoly(mode, c, closed) {
      /*
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.stroke();
      */
    }
  }, {
    key: 'drawRect',
    value: function drawRect(mode, x, y, w, h) {
      this.context.fillRect(x, y, w, h);
    }
  }, {
    key: 'drawText',
    value: function drawText(mode, text, style, x, y) {
      if (style != null) {
        this.context.font = style.getWeight() + " " + style.getSize() + "pt " + style.getFamily();
        var color = style.getColor();
        if (color) this.setFillColor(color);
        var align = style.getAlign();
        if (align) this.context.textAlign = align;
      }

      this.context.fillText(text, x, y);
    }
  }, {
    key: 'createBuffer',
    value: function createBuffer() {
      var scene = new CanvasScene();
      var buffer = new _CanvasBuffer2.default(scene);
      return buffer;
    }
  }, {
    key: 'drawBuffer',
    value: function drawBuffer(buffer) {
      // draws a buffer object to the scene
    }
  }, {
    key: 'setFillColor',
    value: function setFillColor(color) {
      this.context.fillStyle = 'rgba(' + color.getAsString(_Color2.default.RGB) + ')';
    }
  }, {
    key: 'setFillPattern',
    value: function setFillPattern(pattern) {
      if (!pattern.hasPattern()) {
        var ps = pattern.sprite;
        var scene = new CanvasScene();
        scene.setWidth(ps.w);
        scene.setHeight(ps.h);
        scene.drawImage(ps.sprite.img, ps.sprite.x, //sx,
        ps.sprite.y, //sy,
        ps.sprite.w, //sw,
        ps.sprite.h, //sh,
        ps.x, //dx,
        ps.y, //dy,
        ps.w, //dw,
        ps.h //dh
        );

        pattern.setPattern(this.context.createPattern(scene.getElement(), pattern.repeat));
      }
      this.context.fillStyle = pattern.getPattern();
    }
  }, {
    key: 'setLineColor',
    value: function setLineColor(color) {}
  }, {
    key: 'setLineStyle',
    value: function setLineStyle(style) {}
  }, {
    key: 'setLineWidth',
    value: function setLineWidth(width) {}
  }, {
    key: 'save',
    value: function save() {
      this.context.save();
    }
  }, {
    key: 'restore',
    value: function restore() {
      this.context.restore();
    }
  }, {
    key: 'translate',
    value: function translate(x, y) {
      this.context.translate(x, y);
    }
  }, {
    key: 'rotate',
    value: function rotate(a) {
      this.context.rotate(a);
    }

    // <-- Public Methods

  }, {
    key: 'handleMouseEvent',
    value: function handleMouseEvent(event) {
      event.preventDefault();

      var x = event.currentTarget.offsetLeft * -1 + event.currentTarget.offsetParent.offsetLeft * -1;
      var y = event.currentTarget.offsetTop * -1 + event.currentTarget.offsetParent.offsetTop * -1;
      var type;

      x = (x + event.clientX) * this.ratio;
      y = (y + event.clientY) * this.ratio;

      switch (event.type) {
        case 'mousedown':
          type = _MouseEvent2.default.MOUSE_DOWN;
          break;
        case 'mousemove':
          type = _MouseEvent2.default.MOUSE_MOVE;
          break;
        case 'mouseup':
          type = _MouseEvent2.default.MOUSE_UP;
          break;
        default:
          return;
      }

      var mouseEvent = new _MouseEvent2.default(type, false, false, x, y, this.container);
      this.dispatchEvent(mouseEvent);
    }
  }, {
    key: 'handleTouchEvent',
    value: function handleTouchEvent(event) {
      event.preventDefault();

      // get the touch
      var touch = event.changedTouches[0];

      // If type is touch start see if we can add identifier to touches
      if (event.type == 'touchstart') {
        if (this.touchCount >= this.maxTouches) {
          return;
        } else {
          this.touchCount += 1;
          this.touchMap[touch.identifier] = true;
        }
      } else if (event.type == 'touchend') {
        if (this.touchMap[touch.identifier] != undefined) {
          delete this.touchMap[touch.identifier];
          this.touchCount -= 1;
        } else {
          return;
        }
      } else {
        if (this.touchMap[touch.identifier] == undefined) return;
      }

      var x = event.currentTarget.offsetLeft * -1 + event.currentTarget.offsetParent.offsetLeft * -1;
      var y = event.currentTarget.offsetTop * -1 + event.currentTarget.offsetParent.offsetTop * -1;
      var type;

      x = (x + touch.clientX) * this.ratio;
      y = (y + touch.clientY) * this.ratio;

      switch (event.type) {
        case 'touchstart':
          type = _TouchEvent2.default.TOUCH_START;
          break;
        case 'touchmove':
          type = _TouchEvent2.default.TOUCH_MOVE;
          break;
        case 'touchend':
          type = _TouchEvent2.default.TOUCH_END;
          break;
        default:
          return;
      }

      var touchEvent = new _TouchEvent2.default(type, false, false, x, y, this.container);
      this.dispatchEvent(touchEvent);
    }
  }, {
    key: 'handleKeyboardEvent',
    value: function handleKeyboardEvent(event) {
      event.preventDefault();

      var type;
      var key = this.getKeyFromKeyCode(event.keyCode);
      if (key == undefined) return;

      switch (event.type) {
        case 'keydown':
          type = _KeyboardEvent2.default.KEY_DOWN;
          break;
        case 'keyup':
          type = _KeyboardEvent2.default.KEY_UP;
          break;
      }

      var keyboardEvent = new _KeyboardEvent2.default(type, false, false, key);
      this.dispatchEvent(keyboardEvent);
    }
  }, {
    key: 'getKeyFromKeyCode',
    value: function getKeyFromKeyCode(keyCode) {
      //console.log(keyCode);
      switch (keyCode) {
        case 32:
          return _Keyboard2.default.KEY_SPACE;
        case 37:
          return _Keyboard2.default.KEY_LEFT;
        case 38:
          return _Keyboard2.default.KEY_UP;
        case 39:
          return _Keyboard2.default.KEY_RIGHT;
        case 40:
          return _Keyboard2.default.KEY_DOWN;
      }
    }
  }]);

  return CanvasScene;
}(_Scene3.default);

exports.default = CanvasScene;

},{"minibot/core/Utils":3,"minibot/display/html/CanvasBuffer":5,"minibot/display/scene/Scene":13,"minibot/event/KeyboardEvent":33,"minibot/event/MouseEvent":34,"minibot/event/TouchEvent":35,"minibot/event/enum/Keyboard":36,"minibot/graphics/Color":39}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Utils = require('minibot/core/Utils');

var _DisplayObject2 = require('minibot/display/DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

var _HtmlEvent = require('minibot/event/HtmlEvent');

var _HtmlEvent2 = _interopRequireDefault(_HtmlEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlElement = function (_DisplayObject) {
  _inherits(HtmlElement, _DisplayObject);

  // element: null,
  // children: null,

  // isInDOM: false,
  // htmlListeners: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.DisplayObject
   * @constructs
   * @param
   */
  function HtmlElement() {
    _classCallCheck(this, HtmlElement);

    // Determine what the element is
    var _this = _possibleConstructorReturn(this, (HtmlElement.__proto__ || Object.getPrototypeOf(HtmlElement)).call(this));

    if (arguments[1] != undefined) {
      if (typeof arguments[1] == "string") {
        _this.element = new Element(arguments[1]);
      } else {
        _this.element = arguments[1];
      }
    } else {
      _this.element = new Element('div');
    }

    if (_this.element == undefined) {
      // TODO: throw error?
    }

    _this.htmlListeners = {};
    _this.children = new Array();

    // Wrapping element functions
    _this.writeAttribute = (0, _Utils.Bind)(_this.element.writeAttribute, _this.element);
    _this.readAttribute = (0, _Utils.Bind)(_this.element.readAttribute, _this.element);
    _this.hide = (0, _Utils.Bind)(_this.element.hide, _this.element);
    _this.show = (0, _Utils.Bind)(_this.element.show, _this.element);

    return _this;
  }

  _createClass(HtmlElement, [{
    key: 'addChild',
    value: function addChild(displayObject) {
      this.element.insert(displayObject.element);
      this.children.push(displayObject);
      if (this.isInDOM) {
        displayObject.onAddedToDOM();
      }
    }
  }, {
    key: 'removeChild',
    value: function removeChild(displayObject) {
      // Loop through children to find child then remove
      var child;
      for (var i = 0; i < this.children.length; i++) {
        child = this.children[i];
        if (displayObject === child) {
          this.children.splice(i, 1);
          displayObject.element.remove();
          displayObject.onRemovedFromDOM();
        }
      }
    }
  }, {
    key: 'onAddedToDOM',
    value: function onAddedToDOM() {
      this.isInDOM = true;

      var child;
      for (var i = 0; i < this.children.length; i++) {
        child = this.children[i];
        child.onAddedToDOM();
      }
    }
  }, {
    key: 'isHtmlObject',
    value: function isHtmlObject() {
      return true;
    }
  }, {
    key: 'addToDOM',
    value: function addToDOM(element) {
      element.insert(this.element);
      this.onAddedToDOM();
    }

    // Callback for removing from DOM

  }, {
    key: 'onRemovedFromDOM',
    value: function onRemovedFromDOM() {
      // Extend this function in subclasses when needed
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(type, callback) {
      if (this.htmlListeners[type] == undefined) {
        var htmlType = null;

        switch (type) {
          case _HtmlEvent2.default.CLICK:
            htmlType = 'click';
            break;
          case _HtmlEvent2.default.FOCUS:
            htmlType = 'focus';
            break;
          case _HtmlEvent2.default.BLUR:
            htmlType = 'blur';
            break;
          case _HtmlEvent2.default.MOUSE_DOWN:
            htmlType = 'mousedown';
            break;
          case _HtmlEvent2.default.MOUSE_MOVE:
            htmlType = 'mousemove';
            break;
          case _HtmlEvent2.default.MOUSE_UP:
            htmlType = 'mouseup';
            break;
          case _HtmlEvent2.default.KEY_DOWN:
            htmlType = 'keydown';
            break;
          case _HtmlEvent2.default.KEY_UP:
            htmlType = 'keyup';
            break;
          case _HtmlEvent2.default.DRAG_ENTER:
            htmlType = 'dragenter';
            break;
          case _HtmlEvent2.default.DRAG_EXIT:
            htmlType = 'dragexit';
            break;
          case _HtmlEvent2.default.DRAG_OVER:
            htmlType = 'dragover';
            break;
          case _HtmlEvent2.default.DROP:
            htmlType = 'drop';
            break;
          default:
            break;
        }

        if (htmlType != null) {
          this.htmlListeners[type] = (0, _Utils.BindAsEventListener)(this.handleHtmlEvent, this, type);
          this.element.observe(htmlType, this.htmlListeners[type]);
        }
      }
      _get(HtmlElement.prototype.__proto__ || Object.getPrototypeOf(HtmlElement.prototype), 'addEventListener', this).call(this, type, callback);
    }
  }, {
    key: 'handleHtmlEvent',
    value: function handleHtmlEvent(event, type) {
      this.dispatchEvent(new _HtmlEvent2.default(type, event));
    }
  }]);

  return HtmlElement;
}(_DisplayObject3.default
/** @lends display.html.HtmlElement# */
);

exports.default = HtmlElement;

},{"minibot/core/Utils":3,"minibot/display/DisplayObject":4,"minibot/event/HtmlEvent":32}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneDisplayObject2 = require('minibot/display/scene/SceneDisplayObject');

var _SceneDisplayObject3 = _interopRequireDefault(_SceneDisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Animation = function (_SceneDisplayObject) {
  _inherits(Animation, _SceneDisplayObject);

  // animation: null,

  // currentFrame: 0,

  // currentSprite: null,

  // currentDelay: null,

  // time: 0,

  // loops: 0,

  // playing: false,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.scene.SceneDisplayObject
   * @constructs
   * @param {resource.AnimationResource} animation
   * @param {bool} play
   * @param {int} loops
   * @param
   */
  function Animation(animation, play, loops) {
    _classCallCheck(this, Animation);

    var _this = _possibleConstructorReturn(this, (Animation.__proto__ || Object.getPrototypeOf(Animation)).call(this));

    _this.loops = Animation.INFINITE_LOOPS;

    _this.setAnimation(animation, play, loops);
    return _this;
  }

  _createClass(Animation, [{
    key: 'setAnimation',
    value: function setAnimation(animation, play, loops) {
      this.playing = play == undefined || play;

      if (loops == undefined) {
        this.loops == Animation.INFINITE_LOOPS;
      } else {
        this.loops = loops;
      }

      this.currentFrame = 0;
      this.time = 0;

      this.animation = animation;
      this.setupFrame();
    }
  }, {
    key: 'setupFrame',
    value: function setupFrame() {
      if (this.animation == null) return;
      this.currentSprite = this.animation.getSprite(this.currentFrame);
      this.currentDelay = this.animation.getDelay(this.currentFrame);
      if (this.w == 0) this.w = this.currentSprite.w;
      if (this.h == 0) this.h = this.currentSprite.h;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.playing = false;
      this.currentFrame = 0;
      this.time = 0;
      this.setupFrame();
    }
  }, {
    key: 'play',
    value: function play(loops) {
      this.playing = true;

      if (loops == undefined) {
        this.loops == Animation.INFINITE_LOOPS;
      } else {
        this.loops = loops;
      }
    }
  }, {
    key: 'isPlaying',
    value: function isPlaying() {
      return this.playing;
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      if (this.animation == null) return;

      if (this.playing) {
        this.time += dt;
        while (this.time >= this.currentDelay) {

          // Handle looping
          if (this.loops != Animation.INFINITE_LOOPS) {
            if (this.animation.atEnd(this.currentFrame)) {
              if (this.loops == 0) {
                this.stop();
                this.setupFrame();
                break;
              } else {
                this.loops -= 1;
              }
            }
          }

          this.time -= this.currentDelay;
          this.currentFrame = this.animation.nextFrame(this.currentFrame);
          this.setupFrame();
        }
      }

      try {
        this.scene.drawImage(this.currentSprite.img, this.currentSprite.x, //sx,
        this.currentSprite.y, //sy,
        this.currentSprite.w, //sw,
        this.currentSprite.h, //sh,
        this.x + x, //dx,
        this.y + y, //dy,
        this.w, //dw,
        this.h //dh
        );
      } catch (error) {
        console.log('Animation: Rendering Fatal Error');
      }
    }
  }]);

  return Animation;
}(_SceneDisplayObject3.default
/** @lends display.scene.Animation# */
);

exports.default = Animation;

},{"minibot/display/scene/SceneDisplayObject":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Container2 = require('./Container');

var _Container3 = _interopRequireDefault(_Container2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Buffer = function (_Container) {
  _inherits(Buffer, _Container);

  // bufferScene: null,

  function Buffer(scene) {
    _classCallCheck(this, Buffer);

    var _this = _possibleConstructorReturn(this, (Buffer.__proto__ || Object.getPrototypeOf(Buffer)).call(this));

    _this.bufferScene = scene;

    _this.resizable = false;
    return _this;
  }

  _createClass(Buffer, [{
    key: 'renderBuffer',
    value: function renderBuffer(x, y) {
      var tempScene = this.scene;
      var tempRoot = this.root;

      this.root = this;
      this.scene = this.bufferScene;
      this.onAddedToScene();

      _get(Buffer.prototype.__proto__ || Object.getPrototypeOf(Buffer.prototype), 'render', this).call(this, 0, x, y);

      this.root = tempRoot;
      this.scene = tempScene;
    }
  }, {
    key: 'render',
    value: function render() {}
  }]);

  return Buffer;
}(_Container3.default
/** @lends display.scene.Buffer# */
);

exports.default = Buffer;

},{"./Container":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SceneDisplayObject2 = require('./SceneDisplayObject');

var _SceneDisplayObject3 = _interopRequireDefault(_SceneDisplayObject2);

var _Utils = require('minibot/core/Utils');

var _MouseEvent = require('minibot/event/MouseEvent');

var _MouseEvent2 = _interopRequireDefault(_MouseEvent);

var _TouchEvent = require('minibot/event/TouchEvent');

var _TouchEvent2 = _interopRequireDefault(_TouchEvent);

var _ButtonEvent = require('minibot/event/ButtonEvent');

var _ButtonEvent2 = _interopRequireDefault(_ButtonEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_SceneDisplayObject) {
  _inherits(Button, _SceneDisplayObject);

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.scene.SceneDisplayObject
   * @constructs
   * @param
   * @param {display.DisplayObject} upState The resource to display when the button is "up".
   * @param {display.DisplayObject} downState The resource to display when the button is "down".
   * @param {display.DisplayObject} overState The resource to display when the button is "over".
   */
  function Button(upState, downState, overState) {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

    _this.upState = null;
    _this.downState = null;
    _this.overState = null;
    _this.currentState = null;
    _this.states = null;
    _this.isDown = false;
    _this.isOver = false;
    _this.mouseMoveCallback = null;
    _this.mouseUpCallback = null;
    _this.touchMoveCallback = null;
    _this.touchEndCallback = null;

    if (upState != undefined) _this.upState = upState;
    if (downState != undefined) _this.downState = downState;
    if (overState != undefined) _this.overState = overState;

    _this.currentState = _this.upState;

    _this.w = _this.upState.w;
    _this.h = _this.upState.h;

    _this.states = new Array();
    if (_this.upState != null) _this.states.push(_this.upState);
    if (_this.downState != null) _this.states.push(_this.downState);
    if (_this.overState != null) _this.states.push(_this.overState);

    //this.mouseMoveCallback = BindAsEventListener(this.handleMouseMove, this);
    //this.mouseUpCallback = BindAsEventListener(this.handleMouseUp, this);
    return _this;
  }

  /**
   * Function description.
   * @access public
   */


  _createClass(Button, [{
    key: 'render',
    value: function render(dt, x, y) {
      this.currentState.render(dt, this.x + x, this.y + y);
    }

    /**
     * Function description.
     * @access protected
     */

  }, {
    key: 'onAddedToScene',
    value: function onAddedToScene() {
      _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), 'onAddedToScene', this).call(this);
      for (var i = this.states.length - 1; i >= 0; i--) {
        var displayObject = this.states[i];
        displayObject.root = this.parent;
        displayObject.parent = this;
        displayObject.scene = this.scene;
        displayObject.onAddedToScene();
      }
    }

    /**
     * Function description.
     * @access protected
     */

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      if (!this.isDown) {
        if (event.type == _MouseEvent2.default.MOUSE_DOWN) {
          this.currentState = this.downState;
          this.isDown = true;

          if (!this.mouseMoveCallback) {
            this.mouseMoveCallback = (0, _Utils.BindAsEventListener)(this.handleMouseMove, this);
            this.parent.addEventListener(_MouseEvent2.default.MOUSE_MOVE, this.mouseMoveCallback);
          }

          if (!this.mouseUpCallback) {
            this.mouseUpCallback = (0, _Utils.BindAsEventListener)(this.handleMouseUp, this);
            this.parent.addEventListener(_MouseEvent2.default.MOUSE_UP, this.mouseUpCallback);
          }
        } else if (event.type == _TouchEvent2.default.TOUCH_START) {
          this.currentState = this.downState;
          this.isDown = true;

          if (!this.touchMoveCallback) {
            this.touchMoveCallback = (0, _Utils.BindAsEventListener)(this.handleTouchMove, this);
            this.parent.addEventListener(_TouchEvent2.default.TOUCH_MOVE, this.touchMoveCallback);
          }

          if (!this.touchEndCallback) {
            this.touchEndCallback = (0, _Utils.BindAsEventListener)(this.handleTouchEnd, this);
            this.parent.addEventListener(_TouchEvent2.default.TOUCH_END, this.touchEndCallback);
          }
        } else if (event.type == _MouseEvent2.default.MOUSE_MOVE) {
          this.currentState = this.overState;

          if (!this.mouseMoveCallback) {
            this.mouseMoveCallback = (0, _Utils.BindAsEventListener)(this.handleMouseMove, this);
            this.parent.addEventListener(_MouseEvent2.default.MOUSE_MOVE, this.mouseMoveCallback);
          }
        } else if (event.type == _TouchEvent2.default.TOUCH_MOVE) {
          this.currentState = this.overState;

          if (!this.touchMoveCallback) {
            this.touchMoveCallback = (0, _Utils.BindAsEventListener)(this.handleTouchMove, this);
            this.parent.addEventListener(_TouchEvent2.default.TOUCH_MOVE, this.touchMoveCallback);
          }
        } else if (event.type == _TouchEvent2.default.TOUCH_END) {
          this.currentState = this.upState;

          if (this.touchMoveCallback) {
            this.parent.removeEventListener(_TouchEvent2.default.TOUCH_MOVE, this.touchMoveCallback);
            this.touchMoveCallback = null;
          }
        }
      } else {
        if (event.type == _MouseEvent2.default.MOUSE_UP) {
          this.isDown = false;

          if (this.mouseMoveCallback) {
            this.parent.removeEventListener(_MouseEvent2.default.MOUSE_MOVE, this.mouseMoveCallback);
            this.mouseMoveCallback = null;
          }

          if (this.mouseUpCallback) {
            this.parent.removeEventListener(_MouseEvent2.default.MOUSE_UP, this.mouseUpCallback);
            this.mouseUpCallback = null;
          }

          this.currentState = this.upState;

          (0, _Utils.Defer)(this.select, this, event);
        } else if (event.type == _TouchEvent2.default.TOUCH_END) {
          this.isDown = false;

          if (this.touchMoveCallback) {
            this.parent.removeEventListener(_TouchEvent2.default.TOUCH_MOVE, this.touchMoveCallback);
            this.touchMoveCallback = null;
          }

          if (this.touchUpCallback) {
            this.parent.removeEventListener(_TouchEvent2.default.TOUCH_END, this.touchEndCallback);
            this.touchEndCallback = null;
          }

          this.currentState = this.upState;

          (0, _Utils.Defer)(this.select, this, event);
        }
      }
      return _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), 'dispatchEvent', this).call(this, event);
    }

    /**
     * Function description.
     * @access private
     */

  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(event) {

      this.isOver = this.isEventOver(event);

      if (this.isOver && this.isDown) {
        this.currentState = this.downState;
      } else if (this.isOver) {
        this.currentState = this.overState;
      } else if (this.isDown) {
        this.currentState = this.upState;
      } else {
        this.currentState = this.upState;
        if (this.mouseMoveCallback) {
          this.parent.removeEventListener(_MouseEvent2.default.MOUSE_MOVE, this.mouseMoveCallback);
          this.mouseMoveCallback = null;
        }
      }
    }

    /**
     * Function description.
     * @access private
     */

  }, {
    key: 'handleTouchMove',
    value: function handleTouchMove(event) {

      this.isOver = this.isEventOver(event);

      if (this.isOver && this.isDown) {
        this.currentState = this.downState;
      } else if (this.isOver) {
        this.currentState = this.overState;
      } else if (this.isDown) {
        this.currentState = this.upState;
      } else {
        this.currentState = this.upState;
        if (this.touchMoveCallback) {
          this.parent.removeEventListener(_TouchEvent2.default.TOUCH_MOVE, this.touchMoveCallback);
          this.touchMoveCallback = null;
        }
      }
    }
  }, {
    key: 'isEventOver',
    value: function isEventOver(event) {
      var sceneX = this.getSceneX();
      var sceneY = this.getSceneY();
      return event.x >= sceneX && event.x <= sceneX + this.w && event.y >= sceneY && event.y <= sceneY + this.h;
    }

    /**
     * Function description.
     * @access private
     */

  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(event) {
      this.currentState = this.upState;
      this.isDown = false;

      if (this.mouseMoveCallback) {
        this.parent.removeEventListener(_MouseEvent2.default.MOUSE_MOVE, this.mouseMoveCallback);
        this.mouseMoveCallback = null;
      }

      if (this.mouseUpCallback) {
        this.parent.removeEventListener(_MouseEvent2.default.MOUSE_UP, this.mouseUpCallback);
        this.mouseUpCallback = null;
      }
    }

    /**
     * Function description.
     * @access private
     */

  }, {
    key: 'handleTouchEnd',
    value: function handleTouchEnd(event) {
      this.currentState = this.upState;
      this.isDown = false;

      if (this.touchMoveCallback) {
        this.parent.removeEventListener(_TouchEvent2.default.TOUCH_MOVE, this.touchMoveCallback);
        this.touchMoveCallback = null;
      }

      if (this.touchUpCallback) {
        this.parent.removeEventListener(_TouchEvent2.default.TOUCH_END, this.touchEndCallback);
        this.touchEndCallback = null;
      }
    }

    /**
     * Function description.
     * @access private
     */

  }, {
    key: 'select',
    value: function select(event) {
      var x = event.x;
      var y = event.y;
      var type = _ButtonEvent2.default.SELECT;

      var buttonEvent = new _ButtonEvent2.default(type, false, false, this);
      this.dispatchEvent(buttonEvent);
    }
  }]);

  return Button;
}(_SceneDisplayObject3.default
/** @lends display.scene.Button# */
);

exports.default = Button;

},{"./SceneDisplayObject":14,"minibot/core/Utils":3,"minibot/event/ButtonEvent":29,"minibot/event/MouseEvent":34,"minibot/event/TouchEvent":35}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SceneDisplayObject2 = require('./SceneDisplayObject');

var _SceneDisplayObject3 = _interopRequireDefault(_SceneDisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = function (_SceneDisplayObject) {
  _inherits(Container, _SceneDisplayObject);

  /** Appends a child to the container.
   * @param {display.DisplayObject} displayObject The display object to be added.
   * @param {Number} layer The layer to be added.
   * @param {Number} The position of the layer.
   */
  function Container() {
    _classCallCheck(this, Container);

    /** Array containing the Container layers
     * @type Array
     */
    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

    _this.layers = new Array();
    /** Boolean indicating touch events attached.
     * @type boolean
     */
    _this.touchChildren = true;
    /** Indicates whether or not the container is able to be resized.
     * @type boolean
     */
    _this.resizable = true;

    _this.scalable = true;

    _this.scale = 1;
    return _this;
  }

  _createClass(Container, [{
    key: 'addChild',
    value: function addChild(displayObject, layer, position) {
      if (layer == undefined) layer = 0;
      while (this.layers.length <= layer) {
        this.layers.push(new Array());
      }if (position == undefined) position = this.layers[layer].length;

      //this.layers[layer].push(displayObject);
      this.layers[layer].splice(position, 0, displayObject);

      if (this.scalable && this.scale != 1) {
        displayObject.w *= this.scale;
        displayObject.h *= this.scale;
        displayObject.x *= this.scale;
        displayObject.y *= this.scale;
      }

      if (this.root != null) {
        displayObject.root = this.root;
        displayObject.scene = this.scene;
        displayObject.parent = this;
        displayObject.onAddedToScene();
      }

      if (this.resizable) {
        // Expand the container object dimensions to hold the object
        if (this.w < displayObject.x + displayObject.w) this.w = displayObject.x + displayObject.w;
        if (this.h < displayObject.y + displayObject.h) this.h = displayObject.y + displayObject.h;
      }
    }
    /** Removes a child from the container.
     * @param {display.DisplayObject} displayObject The object to be removed.
     */

  }, {
    key: 'removeChild',
    value: function removeChild(displayObject) {
      for (var l = 0; l < this.layers.length; l++) {
        var layer = this.layers[l];
        for (var d = 0; d < layer.length; d++) {
          if (displayObject === layer[d]) {
            layer.splice(d, 1);
            displayObject.onRemovedFromScene();
            return;
          }
        }
      }
    }
    /** Removes all children from the container. */

  }, {
    key: 'removeAll',
    value: function removeAll() {
      var layers = this.layers;
      var displayObject;
      for (var l = 0; l < layers.length; l++) {
        var layer = layers[l];
        for (var d = 0; d < layer.length; d++) {
          displayObject = layer[d];
          displayObject.onRemovedFromScene();
        }
      }
      this.layers = new Array();
    }
    /** Renders the objects within the container layers.
     * @param {Number} dt The change in time.
     * @param {Number} x The x position.
     * @param {Number} y The y position.
     */

  }, {
    key: 'render',
    value: function render(dt, x, y) {
      if (this.scene == null) return;
      if (x == undefined) x = 0;
      if (y == undefined) y = 0;

      var l, d, layer, displayObject, xBounds, yBounds;

      for (l = 0; l < this.layers.length; l++) {
        layer = this.layers[l];
        for (d = 0; d < layer.length; d++) {
          displayObject = layer[d];

          // check if the display object is visible
          if (!displayObject.isVisible) continue;

          // check if the display object is outside the scene
          xBounds = this.x + x + displayObject.x;
          yBounds = this.y + y + displayObject.y;
          if (xBounds >= this.root.w || xBounds < -1 * displayObject.w || yBounds >= this.root.h || yBounds < -1 * displayObject.h) continue;

          // render the display object
          displayObject.render(dt, this.x + x, this.y + y);
        }
      }
    }
    /** Sets the child objects index within the layers.
     * @param {display.DisplayObject} displayObject The display object to be modified.
     * @param {Number} index The specified index to be set.
     */

  }, {
    key: 'setChildIndex',
    value: function setChildIndex(displayObject, index) {
      for (var l = 0; l < this.layers.length; l++) {
        var layer = this.layers[l];
        for (var d = 0; d < layer.length; d++) {
          if (displayObject === layer[d]) {

            if (index >= layer.length) return;

            layer.splice(d, 1);
            layer.splice(index, 0, displayObject);

            return;
          }
        }
      }
    }
    /** Uses the event dispatcher to handle events.
     * @param {event} event The specified event.
     * @param {}
     */

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      /*
      if(event.isTouchEvent()) {
        if(!this.touchEnabled) return false;
        if(!this.touchChildren) return super(event);
      }
      */

      var captured = false;
      var dispatched = false;

      var l, d, layer, displayObject;

      if ('x' in event && 'y' in event) {
        event.x -= this.x;
        event.y -= this.y;
        for (l = this.layers.length - 1; l >= 0; l--) {
          layer = this.layers[l];
          for (d = layer.length - 1; d >= 0; d--) {
            displayObject = layer[d];

            // skip if the object is invisible
            if (!displayObject.isVisible) continue;

            if (event.x >= displayObject.x && event.x <= displayObject.x + displayObject.w && event.y >= displayObject.y && event.y <= displayObject.y + displayObject.h) {
              dispatched = displayObject.dispatchEvent(event);
              captured = true;
            }
            if (captured) break;
          }
          if (captured) break;
        }
      }

      if (!dispatched) {
        if ('x' in event && 'y' in event) {
          event.x += this.x;
          event.y += this.y;
        }
        return _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'dispatchEvent', this).call(this, event);
      } else {
        return true;
      }
    }
    /** Actions to be carried out upon being attached to a scene.
     * @param {}
     */

  }, {
    key: 'onAddedToScene',
    value: function onAddedToScene() {
      _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'onAddedToScene', this).call(this);

      var l, d, layer, displayObject;

      for (l = 0; l < this.layers.length; l++) {
        layer = this.layers[l];
        for (d = 0; d < layer.length; d++) {
          displayObject = layer[d];
          displayObject.root = this.root;
          displayObject.scene = this.scene;
          displayObject.parent = this;
          displayObject.onAddedToScene();
        }
      }
    }
    /** Actions to be carried out upon being removed from a scene.
     * @param {}
     */

  }, {
    key: 'onRemovedFromScene',
    value: function onRemovedFromScene() {
      _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'onRemovedFromScene', this).call(this);
      for (var l = 0; l < this.layers.length; l++) {
        var layer = this.layers[l];
        for (var d = 0; d < layer.length; d++) {
          layer[d].onRemovedFromScene();
        }
        this.layers[l] = null;
      }
      this.layers = new Array();
    }

    // Updated this function to scale internal components if it is scalable

  }, {
    key: 'setScale',
    value: function setScale(scale) {
      if (!this.scalable) return;

      var s = scale / this.scale;
      var d, l, layer, displayObject;

      for (l = 0; l < this.layers.length; l++) {
        layer = this.layers[l];
        for (d = 0; d < layer.length; d++) {
          displayObject = layer[d];
          displayObject.w *= s;
          displayObject.h *= s;
          displayObject.x *= s;
          displayObject.y *= s;
        }
      }
      this.w *= s;
      this.h *= s;

      this.scale = scale;
    }

    /*
    ,
      align(align, objects, recursive)
    {
      if(!(objects instanceof Array)) objects = [ objects ];
      if(recursive == undefined) recursive = false;
        var cx = this.getSceneX() + (this.getWidth()/2);
      var cy = this.getSceneY() + (this.getHeight()/2);
      var object, ox, oy;
        for(var i = 0; i < objects.length; i++) {
        object = objects[i];
        ox = object.getSceneX() + (object.getWidth()/2);
        oy = object.getSceneY() + (object.getHeight()/2);
        object.x += cx - ox;
        object.y += cy - oy;
      }
      }
    */

  }]);

  return Container;
}(_SceneDisplayObject3.default
/** @lends display.scene.Container# */
);

exports.default = Container;

},{"./SceneDisplayObject":14}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneDisplayObject2 = require('./SceneDisplayObject');

var _SceneDisplayObject3 = _interopRequireDefault(_SceneDisplayObject2);

var _Color = require('minibot/graphics/Color');

var _Color2 = _interopRequireDefault(_Color);

var _Pattern = require('minibot/graphics/Pattern');

var _Pattern2 = _interopRequireDefault(_Pattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rect = function (_SceneDisplayObject) {
  _inherits(Rect, _SceneDisplayObject);

  // mode: null,

  // fillColor: null,
  // fillPattern: null,
  // strokeColor: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.scene.SceneDisplayObject
   * @constructs
   * @param
   * @param {int} width The width of the rectangle.
   */
  function Rect(width, height, mode, fill, strokeColor) {
    _classCallCheck(this, Rect);

    var _this = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this));

    _this.w = width;
    _this.h = height;

    _this.mode = mode;

    if (fill != undefined) {
      if (fill.type == _Color2.default.TYPE) {
        _this.fillColor = fill;
      } else if (fill.type = _Pattern2.default.TYPE) {
        _this.fillPattern = fill;
      }
    }
    if (strokeColor != undefined) _this.strokeColor = strokeColor;

    return _this;
  }

  _createClass(Rect, [{
    key: 'render',
    value: function render(dt, x, y) {
      if (this.fillColor != null) this.scene.setFillColor(this.fillColor);
      if (this.fillPattern != null) this.scene.setFillPattern(this.fillPattern);

      this.scene.drawRect(this.mode, this.x + x, this.y + y, this.w, this.h);
    }
  }]);

  return Rect;
}(_SceneDisplayObject3.default
/** @lends display.scene.Rect# */
);

exports.default = Rect;

},{"./SceneDisplayObject":14,"minibot/graphics/Color":39,"minibot/graphics/Pattern":40}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventDispatcher = require('minibot/event/EventDispatcher');

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene
/** @lends display.scene.Scene# */
= function () {
  /** The scene container.
   * @type display.scene.Container
   */
  // container: null,
  /** The scene width.
   * @type Number
   */
  // width: null,
  /** The scene height.
   * @type Number
   */
  // height: null,
  /** The scene options
   * @type Object
   */
  // options: null,

  /**
   * Constructs a new scene instance.
   * @class Creates a new scene within a specified container.
   * @extends display.canvas.CanvasDisplayObject
   * @constructs
   * @param
   */
  function Scene(options) {
    _classCallCheck(this, Scene);

    this.options = options;

    this.container = new _Container2.default();
    this.container.resizable = false;
    this.container.setRoot(this.container);
    this.container.setScene(this);
  }

  // Public Methods -->

  _createClass(Scene, [{
    key: 'hasOption',
    value: function hasOption(key) {
      return this.options[key] != undefined;
    }
  }, {
    key: 'getOption',
    value: function getOption(key) {
      return this.options[key];
    }
  }, {
    key: 'getBuffer',
    value: function getBuffer() {}

    /** Set the width of the scene.
     * @param {Number} width The width desired.
     */

  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.width = width;
      this.container.setWidth(width);
    }

    /** Returns the width of the scene.
     * @returns {Number}
     */

  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }

    /** Set the height of the scene.
     * @param {Number} height The height desired.
     */

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this.height = height;
      this.container.setHeight(height);
    }

    /** Returns the height of the scene.
     * @returns {Number}
     */

  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.height;
    }

    /** Appends a child to the specified container.
       @param {display.DisplayObject} displayObject The displayObject to add.
     @param {layer} layer The layer to be added to.
     */

  }, {
    key: 'addChild',
    value: function addChild(displayObject, layer) {
      if (layer == undefined || layer == null) layer = 0;
      this.container.addChild(displayObject, layer);
    }

    /** Removes a child from the specified container.
       @param {display.DisplayObject} displayObject The displayObject to remove.
     */ /** Removes all children from the specified container. */

  }, {
    key: 'removeChild',
    value: function removeChild(displayObject) {
      this.container.removeChild(displayObject);
    }

    /** Removes all children from the specified container. */

  }, {
    key: 'removeAllChildren',
    value: function removeAllChildren() {
      this.container.removeAll();
    }

    /** Renders the scene
     * @param {Number} dt The change in time.
     */

  }, {
    key: 'render',
    value: function render(dt) {
      this.container.render(dt);
    }
  }, {
    key: 'clear',
    value: function clear() {}
    // overload in subclass


    // Graphics Methods -->

  }, {
    key: 'drawBuffer',
    value: function drawBuffer() {}

    /** Draws an image.
     * @param {resource.ImageResource} image The image to be drawn.
     * @param {Number} sx The starting x position of the image.
     * @param {Number} sy The starting y position of the image.
     * @param {Number} sw The starting width of the image.
     * @param {Number} sh The starting height of the image.
         * @param {Number} dx The x position to place the image.
     * @param {Number} dy The y position to place the image.
     * @param {Number} dw The destination width.
     * @param {Number} dh The destination height.
     */

  }, {
    key: 'drawImage',
    value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {}

    /** Draws a line.
     * @param {Number} x1 The starting x coordinate.
     * @param {Number} x2 The ending x coordinate.
     * @param {Number} y1 The starting y coordinate.
     * @param {Number} y2 The ending y coordinate.
     */

  }, {
    key: 'drawLine',
    value: function drawLine(x1, y1, x2, y2) {}

    /** Draws a Rectangle.
     * @param {Number} Mode Represents whether or not to fill the rectangle.
     * @param {Number} x The starting x coordinate.
     * @param {Number} y The starting y coordinate.
     * @param {Number} w The width of the rectangle.
     * @param {Number} h The height of the rectangle.
     */

  }, {
    key: 'drawRect',
    value: function drawRect(mode, x, y, w, h) {}

    /** Sets the fill color.
     * @param {graphics.Color} color The color to be used.
     */

  }, {
    key: 'setFillColor',
    value: function setFillColor(color) {}

    /** Sets the fill pattern.
     * @param {graphics.Pattern} pattern The pattern to be used.
     */

  }, {
    key: 'setFillPattern',
    value: function setFillPattern(pattern) {}

    /** Sets the line color.
     * @param {graphics.Color} color The color to be used.
     */

  }, {
    key: 'setLineColor',
    value: function setLineColor(color) {}

    /** Sets the line style.
     * @param {object} style The style to be used.
     */

  }, {
    key: 'setLineStyle',
    value: function setLineStyle(style) {}

    /** Sets the line width.
     * @param {Number} width The width to be used.
     */

  }, {
    key: 'setLineWidth',
    value: function setLineWidth(width) {}

    /** Save
     */

  }, {
    key: 'save',
    value: function save() {}

    /** Restore
     */

  }, {
    key: 'restore',
    value: function restore() {}

    /** Translate
     * @param {Number} x
     * @param {Number} y
     */

  }, {
    key: 'translate',
    value: function translate(x, y) {}

    /** Rotate
     * @param {Number} a
     */

  }, {
    key: 'rotate',
    value: function rotate(a) {}

    // <-- Graphics Methods

    // Event Methods -->

  }, {
    key: 'addEventListener',
    value: function addEventListener(type, callback) {
      this.container.addEventListener(type, callback);
    }
  }, {
    key: 'hasEventListener',
    value: function hasEventListener(type) {
      return this.container.addEventListener(type);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      return this.container.dispatchEvent(event);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, callback) {
      this.container.removeEventListener(type, callback);
    }
  }, {
    key: 'removeAllEventListeners',
    value: function removeAllEventListeners() {
      this.container.removeAllEventListeners();
    }

    // <-- Event Methods

    // <-- Public Methods


  }]);

  return Scene;
}();

Scene.MOUSE_EVENTS = 1;
Scene.KEYBOARD_EVENTS = 2;
Scene.TOUCH_EVENTS = 4;

exports.default = Scene;

},{"./Container":11,"minibot/event/EventDispatcher":31}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DisplayObject2 = require('minibot/display/DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SceneDisplayObject = function (_DisplayObject) {
  _inherits(SceneDisplayObject, _DisplayObject);

  /**
   * Creates a new SceneDisplayObject instance.
   * @class The scenedisplay object manages both the scene as well as the objects to be displayed.
   * Objects can be added and removed from the scene while choosing what is to be rendered.
   * @extends display.DisplayObject
   * @constructs
   * @param
   */
  function SceneDisplayObject() {
    _classCallCheck(this, SceneDisplayObject);

    var _this = _possibleConstructorReturn(this, (SceneDisplayObject.__proto__ || Object.getPrototypeOf(SceneDisplayObject)).call(this));

    _this.x = 0;
    _this.y = 0;
    _this.w = 0;
    _this.h = 0;
    _this.root = null;
    _this.scene = null;
    _this.isVisible = true;
    return _this;
  }
  /** Renders the SceneDisplayObject and its components.
   * @param {Number} dt The change in time.
   * @param {Number} x The x position at which the rendering occurs.
   * @param {Number} y The y position at which the rendering occurs.
   */


  _createClass(SceneDisplayObject, [{
    key: 'render',
    value: function render(dt, x, y) {}
    // This function must be overloaded in the sub class

    /** Actions to be triggered when a scene object is added to a scene.
     *
     */

  }, {
    key: 'onAddedToScene',
    value: function onAddedToScene() {}
    // This callback is triggered when a scene object is added to a scene

    /** Actions to be triggered when a scene object is removed from a scene.
     *
     */

  }, {
    key: 'onRemovedFromScene',
    value: function onRemovedFromScene() {}
    // This callback is triggered when a scene object is removed from a scene

    /** Retrieves the scene's X field.
     * @returns display.scene
     */

  }, {
    key: 'getScene',
    value: function getScene() {
      return this.scene;
    }
    /** Retrieves the scene object's width.
     * @returns display.scene
     */

  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.w;
    }
    /** Retrieves the scene object's height.
     * @returns display.scene
     */

  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.h;
    }
    /** Retrieves the scene's X field.
     * @returns display.scene
     */

  }, {
    key: 'getSceneX',
    value: function getSceneX() {
      var sceneX = 0;
      if (this.parent != null) {
        sceneX += this.parent.getSceneX();
      }
      sceneX += this.x;
      return sceneX;
    }
    /** Retrieves the scene's Y field.
     * @returns display.scene
     */

  }, {
    key: 'getSceneY',
    value: function getSceneY() {
      var sceneY = 0;
      if (this.parent != null) {
        sceneY += this.parent.getSceneY();
      }
      sceneY += this.y;
      return sceneY;
    }
    /** Sets a root directory.
     * @param {String} root The root specified.
     */

  }, {
    key: 'setRoot',
    value: function setRoot(root) {
      this.root = root;
    }
    /** Chooses the current scene.
     * @param {display.scene} scene The scene to be set.
     */

  }, {
    key: 'setScene',
    value: function setScene(scene) {
      this.scene = scene;
    }
    /** Sets the sceneDisplayObject's width.
     * @param {Number} width The specified width.
     */

  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.w = width;
    }
    /** Sets the sceneDisplayObject's height.
     * @param {Number} height The specified height.
     */

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this.h = height;
    }
    /** Sets the sceneDisplayObject to be invisible. */

  }, {
    key: 'hide',
    value: function hide() {
      this.isVisible = false;
    }
    /** Sets the sceneDisplayObject to be visible. */

  }, {
    key: 'show',
    value: function show() {
      this.isVisible = true;
    }
  }, {
    key: 'setAlign',
    value: function setAlign(align, objects, recursive) {
      if (!(objects instanceof Array)) objects = [objects];
      if (recursive == undefined) recursive = false;

      var object, t, o;
      switch (align) {
        case _DisplayObject3.default
        /** @lends display.scene.SceneDisplayObject# */
        .ALIGN_HORZ_CENTER:
          var t = this.getSceneX() + this.getWidth() / 2;
          for (var i = 0; i < objects.length; i++) {
            object = objects[i];
            o = object.getSceneX() + object.getWidth() / 2;
            object.x += t - o;
          }
          break;
        case _DisplayObject3.default.ALIGN_VERT_CENTER:
          var t = this.getSceneY() + this.getHeight() / 2;
          for (var i = 0; i < objects.length; i++) {
            object = objects[i];
            o = object.getSceneY() + object.getHeight() / 2;
            object.y += t - o;
          }
          break;
      }
    }
  }]);

  return SceneDisplayObject;
}(_DisplayObject3.default);

exports.default = SceneDisplayObject;

},{"minibot/display/DisplayObject":4}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneDisplayObject2 = require('minibot/display/scene/SceneDisplayObject');

var _SceneDisplayObject3 = _interopRequireDefault(_SceneDisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sprite = function (_SceneDisplayObject) {
  _inherits(Sprite, _SceneDisplayObject);

  /** The sprite object.
   * @type resource.SpriteResource
   */
  // sprite: null,
  /** Composite object.
   * @ type object
   */
  // composite: null,

  /**
   * Creates a new Sprite instance.
   * @class Creates a sprite to be rendered.
   * @extends display.scene.SceneDisplayObject
   * @constructs
   * @param {resource.SpriteResource} sprite The sprite to be used.
   * @param
   */
  function Sprite(sprite) {
    _classCallCheck(this, Sprite);

    var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this));

    _this.sprite = sprite;
    _this.w = sprite.w;
    _this.h = sprite.h;
    return _this;
  }
  /** Renders the sprite.
   * @param {Number} dt The change in time.
   * @param {Number} x The x position to render the sprite.
   * @param {Number} y The y position to render the sprite.
   */


  _createClass(Sprite, [{
    key: 'render',
    value: function render(dt, x, y) {
      try {
        this.scene.drawImage(this.sprite.img, this.sprite.x, //sx,
        this.sprite.y, //sy,
        this.sprite.w, //sw,
        this.sprite.h, //sh,
        this.x + x, //dx,
        this.y + y, //dy,
        this.w, //dw,
        this.h //dh
        );
      } catch (error) {
        console.log('SpriteObject: Fatal Error');
      }
    }
  }]);

  return Sprite;
}(_SceneDisplayObject3.default
/** @lends display.scene.Sprite# */
);

exports.default = Sprite;

},{"minibot/display/scene/SceneDisplayObject":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneDisplayObject2 = require("minibot/display/scene/SceneDisplayObject");

var _SceneDisplayObject3 = _interopRequireDefault(_SceneDisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Text = function (_SceneDisplayObject) {
  _inherits(Text, _SceneDisplayObject);

  // text: '',

  // style: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.scene.SceneDisplayObject
   * @constructs
   * @param {String} text
   * @param {display.scene.TextStyle} style
   * @param {String} textAlign
   * @param {Scene 2DContext} context
   * @param
   */
  function Text(text, style) {
    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));

    _this.text = text;

    if (style != undefined) _this.style = style;

    /*
    if(font != undefined) this.font = font;
    if(fillStyle != undefined) this.fillStyle = fillStyle;
    if(textAlign != undefined) this.textAlign = textAlign;
      if(context != undefined) {
      this.setStyle(context);
      this.metrics = context.measureText(this.text);
    }
    */
    return _this;
  }

  _createClass(Text, [{
    key: "setStyle",
    value: function setStyle() {
      /*
      if(this.font != null) context.font = this.font;
      if(this.textAlign != null) context.textAlign = this.textAlign;
      if(this.fillStyle != null) context.fillStyle = this.fillStyle;
      */
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }, {
    key: "getMetrics",
    value: function getMetrics() {
      return this.metrics;
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.text = text;
    }
  }, {
    key: "render",
    value: function render(dt, x, y) {
      this.scene.drawText("", this.text, this.style, this.x + x, this.y + y);
    }
  }]);

  return Text;
}(_SceneDisplayObject3.default
/** @lends display.scene.Text# */
);

exports.default = Text;

},{"minibot/display/scene/SceneDisplayObject":14}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = require('minibot/graphics/Color');

var _Color2 = _interopRequireDefault(_Color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextStyle
/** @lends display.scene.TextStyle# */
= function () {

  // family: null,

  // size: null,

  // align: null,

  // color: null,

  // weight: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @constructs
   * @param {String} family
   * @param {int} size
   * @param {String} color
   * @param {String} align
   * @param
   */
  function TextStyle(family, size, color, align, weight) {
    _classCallCheck(this, TextStyle);

    this.family = family;
    this.size = size;
    this.color = color;
    this.align = align;
    this.weight = weight ? weight : '';
  }

  _createClass(TextStyle, [{
    key: 'getFamily',
    value: function getFamily() {
      return this.family;
    }
  }, {
    key: 'getSize',
    value: function getSize() {
      return this.size;
    }
  }, {
    key: 'getColor',
    value: function getColor() {
      return this.color;
    }
  }, {
    key: 'getAlign',
    value: function getAlign() {
      return this.align;
    }
  }, {
    key: 'getWeight',
    value: function getWeight() {
      return this.weight;
    }
  }]);

  return TextStyle;
}();

exports.default = TextStyle;

},{"minibot/graphics/Color":39}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventDispatcher2 = require('minibot/event/EventDispatcher');

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Engine = function (_EventDispatcher) {
  _inherits(Engine, _EventDispatcher);

  function Engine(systems, updateOrder) {
    _classCallCheck(this, Engine);

    // List of all systems
    var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this));

    _this.systems = [];
    // List of all systems by type
    _this.systemsByType = {};
    // List of all objects
    _this.objects = [];
    // List of objects by type
    _this.objectsByType = {};
    // The resource map
    _this.resources = {};
    // The update order
    _this.updateOrder = updateOrder;
    // The primary camera
    _this.camera = null;
    // the player
    _this.player = null;
    // the scene
    _this.scene = null;
    // the scene
    _this.viewport = null;

    // Add the systems
    for (var i = 0; i < systems.length; i++) {
      _this.addSystem(systems[i]);
    }

    // Initialize the systems
    for (var i = 0; i < _this.systems.length; i++) {
      _this.systems[i].onInitialized();
    }
    return _this;
  }

  // Public Methods -->

  // Update/Render Methods -->

  _createClass(Engine, [{
    key: 'start',
    value: function start() {
      if (this.running) return;
      this.running = true;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      // Update the Systems in preset order
      for (var s = 0; s < this.updateOrder.length; s++) {
        this.systemsByType[this.updateOrder[s]].update(dt);
      }
    }
  }, {
    key: 'render',
    value: function render(dt) {
      // Override this in sub class
    }
  }, {
    key: 'renderPhysics',
    value: function renderPhysics(dt) {
      // Override this in sub class
    }
  }, {
    key: 'setUpdateOrder',
    value: function setUpdateOrder(updateOrder) {
      this.updateOrder = updateOrder;
    }
  }, {
    key: 'setScene',
    value: function setScene(scene) {
      this.scene = scene;
    }
  }, {
    key: 'getScene',
    value: function getScene(scene) {
      return this.scene;
    }
  }, {
    key: 'setCamera',
    value: function setCamera(camera) {
      this.camera = camera;
    }
  }, {
    key: 'getCamera',
    value: function getCamera(camera) {
      return this.camera;
    }
  }, {
    key: 'setViewport',
    value: function setViewport(viewport) {
      this.viewport = viewport;
    }

    // <-- Update/Render Methods

    // Object/System Methods -->

  }, {
    key: 'addSystem',
    value: function addSystem(sys) {
      // Get type
      var type = sys.getType();
      if (this.systemsByType[type] != undefined) {
        // ERROR?
        return;
      }

      // Add to systems
      this.systems.push(sys);

      // Add to systemsByType
      this.systemsByType[type] = sys;

      sys.setEngine(this);
      sys.onAddedToEngine();
    }
  }, {
    key: 'removeSystem',
    value: function removeSystem() {}
  }, {
    key: 'getSystem',
    value: function getSystem(type) {
      return this.systemsByType[type];
    }
  }, {
    key: 'addObject',
    value: function addObject(obj) {
      // Add to objects
      this.objects.push(obj);

      // Add to objectsByType
      var type = obj.getType();
      if (this.objectsByType[type] == undefined) {
        this.objectsByType[type] = [];
      }
      this.objectsByType[type].push(obj);

      // Add to systems if component is available
      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].addObject(obj);
      }

      obj.setEngine(this);
      obj.onAddedToEngine();
    }
  }, {
    key: 'removeObject',
    value: function removeObject() {
      var i = this.objects.indexOf(obj);
      if (i != -1) this.objects.splice(i, 1);

      var type = obj.getType();
      var arr = this.objectsByType[type];
      i = arr.indexOf(obj);
      if (i != -1) arr.splice(i, 1);

      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].removeObject(obj);
      }

      // TODO: Add Removed Hook?
      //obj.onRemovedFromEngine(this);
    }

    // <-- Object/System Methods

    // Resource Methods -->

  }, {
    key: 'getResources',
    value: function getResources() {
      return this.resources;
    }
  }, {
    key: 'getResource',
    value: function getResource(type, id) {
      if (this.resources[type] == undefined) return null;
      if (this.resources[type][id] == undefined) return null;
      return this.resources[type][id];
    }
  }, {
    key: 'addResource',
    value: function addResource(type, id) {
      if (this.resources[type] == undefined) this.resources[type] = {};
      this.resources[type][id] = null;
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {
      var i;
      for (i = 0; i < this.systems.length; i++) {
        this.systems[i].onResourcesLoaded();
      }
      for (i = 0; i < this.objects.length; i++) {
        this.objects[i].onResourcesLoaded();
      }
    }

    // <-- Resource Methods

    // <-- Public Methods


  }]);

  return Engine;
}(_EventDispatcher3.default
/** @lends engine.Engine# */
);

exports.default = Engine;

},{"minibot/event/EventDispatcher":31}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineEvent = require('minibot/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EngineComponent = function () {

  // type: null,

  // object: null,

  // system: null,

  // eventQueue: null,

  function EngineComponent(type) {
    _classCallCheck(this, EngineComponent);

    this.type = type;
    this.eventQueue = [];
  }

  _createClass(EngineComponent, [{
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'setProperty',
    value: function setProperty(key, value) {
      this.object.setProperty(key, value);
    }
  }, {
    key: 'getProperty',
    value: function getProperty(key) {
      return this.object.getProperty(key);
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(key) {
      return this.object.hasProperty(key);
    }
  }, {
    key: 'setObject',
    value: function setObject(object) {
      this.object = object;
    }
  }, {
    key: 'getObject',
    value: function getObject() {
      return this.object;
    }
  }, {
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      //-- OVERRIDE
    }
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {
      //-- OVERRIDE
    }
  }, {
    key: 'setSystem',
    value: function setSystem(system) {
      this.system = system;
    }
  }, {
    key: 'getSystem',
    value: function getSystem() {
      return this.system;
    }
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {
      //-- OVERIDE?
    }
  }, {
    key: 'buildEvent',
    value: function buildEvent(type, data) {
      return this.object.buildEvent(type, data, this);
    }
  }, {
    key: 'queueEvent',
    value: function queueEvent(event) {
      this.eventQueue.push(event);
    }
  }, {
    key: 'flushEventQueue',
    value: function flushEventQueue() {
      while (this.eventQueue.length) {
        this.dispatchEvent(this.eventQueue.pop());
      }
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      this.object.dispatchEvent(event);
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(type, callback) {
      this.object.addEventListener(type, callback);
    }
  }, {
    key: 'addResource',
    value: function addResource(type, id) {
      if (this.system == null) return;
      this.system.addResource(type, id);
    }
  }, {
    key: 'getResource',
    value: function getResource(type, id) {
      if (this.system == null) return;
      return this.system.getResource(type, id);
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {}
  }, {
    key: 'update',
    value: function update(dt) {
      //-- OVERRIDE
    }
  }]);

  return EngineComponent;
}();

exports.default = EngineComponent;

},{"minibot/event/EngineEvent":30}],20:[function(require,module,exports){
"use strict";

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventDispatcher2 = require('minibot/event/EventDispatcher');

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

var _EngineEvent = require('minibot/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EngineObject = function (_EventDispatcher) {
  _inherits(EngineObject, _EventDispatcher);

  function EngineObject(type, data) {
    _classCallCheck(this, EngineObject);

    var _this = _possibleConstructorReturn(this, (EngineObject.__proto__ || Object.getPrototypeOf(EngineObject)).call(this));

    _this.type = type;
    _this.components = {};

    if (data == undefined) data = {};
    _this.data = data;

    _this.engine = null;
    return _this;
  }

  _createClass(EngineObject, [{
    key: 'destroy',
    value: function destroy() {
      this.components = null;
      this.engine = null;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'addComponent',
    value: function addComponent(component) {
      var type = component.getType();
      if (this.components[type] == undefined) {
        this.components[type] = component;
        component.setObject(this);
        component.onAddedToObject();
      }
    }
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {
      for (var c in this.components) {
        this.components[c].onComponentsAdded();
      }
    }
  }, {
    key: 'removeComponent',
    value: function removeComponent(component) {}
  }, {
    key: 'setEngine',
    value: function setEngine(engine) {
      this.engine = engine;
    }
  }, {
    key: 'getEngine',
    value: function getEngine() {
      return this.engine;
    }
  }, {
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {
      //-- OVERRIDE
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {
      for (var c in this.components) {
        this.components[c].onResourcesLoaded();
      }
    }
  }, {
    key: 'getComponent',
    value: function getComponent(type) {
      if (this.components[type] != undefined) {
        return this.components[type];
      }
      return null;
    }
  }, {
    key: 'hasComponent',
    value: function hasComponent(type) {
      return this.components[type] != undefined;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      for (var c in this.components) {
        this.components[c].update(dt);
      }
    }
  }, {
    key: 'setProperty',
    value: function setProperty(key, value) {
      this.data[key] = value;
    }
  }, {
    key: 'getProperty',
    value: function getProperty(key) {
      return this.data[key];
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(key) {
      return this.data[key] != undefined;
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      for (var c in this.components) {
        this.components[c].receiveMessage(message);
      }
    }
  }, {
    key: 'buildEvent',
    value: function buildEvent(type, data, component) {
      if (component == undefined) component = null;
      return new _EngineEvent2.default(type, this, component, data);
    }
  }]);

  return EngineObject;
}(_EventDispatcher3.default);

exports.default = EngineObject;

},{"minibot/event/EngineEvent":30,"minibot/event/EventDispatcher":31}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EngineSystem = function () {
  function EngineSystem(type) {
    _classCallCheck(this, EngineSystem);

    this.type = type;
    this.components = [];
    this.componentsByObject = {};
    this.engine = null;
    this.initialized = false;
  }

  _createClass(EngineSystem, [{
    key: "destroy",
    value: function destroy() {
      for (var i = 0; i < this.components.length; i++) {
        this.components[i].destroy();
      }
      this.components = null;
      this.componentsByObject = null;
      this.engine = null;
    }
  }, {
    key: "onInitialized",
    value: function onInitialized() {
      this.initialized = true;
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "addObject",
    value: function addObject(obj) {
      if (obj.hasComponent(this.type)) {
        var c = obj.getComponent(this.type);
        this.components.push(c);
        this.componentsByObject[obj] = c;

        c.setSystem(this);
        c.onAddedToSystem();

        return c;
      }

      return null;
    }
  }, {
    key: "addResource",
    value: function addResource(type, id) {
      if (!this.engine) return;
      this.engine.addResource(type, id);
    }
  }, {
    key: "getResource",
    value: function getResource(type, id) {
      if (!this.engine) return;
      return this.engine.getResource(type, id);
    }
  }, {
    key: "removeObject",
    value: function removeObject(obj) {
      if (obj.hasComponent(this.type)) {
        var c = obj.getComponent(this.type);

        var i = this.components.indexOf(c);
        if (i != -1) this.components.splice(i, 1);

        if (this.componentsByObject[obj] != undefined) {
          delete this.componentsByObject[obj];
        }

        return c;
      }

      return null;
    }
  }, {
    key: "setEngine",
    value: function setEngine(engine) {
      this.engine = engine;
    }
  }, {
    key: "getEngine",
    value: function getEngine() {
      return this.engine;
    }
  }, {
    key: "onAddedToEngine",
    value: function onAddedToEngine() {
      //-- OVERRIDE
    }
  }, {
    key: "onResourcesLoaded",
    value: function onResourcesLoaded() {}
  }, {
    key: "update",
    value: function update(dt) {}
    //-- OVERRIDE


    // Helper function to update all components of the system

  }, {
    key: "updateComponents",
    value: function updateComponents(dt) {
      for (var i = 0; i < this.components.length; i++) {
        this.components[i].update(dt);
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      this.engine.dispatchEvent(event);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      this.engine.addEventListener(type, callback);
    }
  }]);

  return EngineSystem;
}();

exports.default = EngineSystem;

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineComponent2 = require('minibot/engine/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayComponent = function (_EngineComponent) {
  _inherits(DisplayComponent, _EngineComponent);

  // scene: null,

  function DisplayComponent(type) {
    _classCallCheck(this, DisplayComponent);

    return _possibleConstructorReturn(this, (DisplayComponent.__proto__ || Object.getPrototypeOf(DisplayComponent)).call(this, type));
  }

  _createClass(DisplayComponent, [{
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {
      this.scene = this.getSystem().getScene();
    }
  }, {
    key: 'render',
    value: function render(dt, layer, x, y) {
      // override
    }
  }, {
    key: 'getLayers',
    value: function getLayers() {
      // override
      return this.layers;
    }
  }, {
    key: 'setLayers',
    value: function setLayers(layers) {
      // override
      this.layers = layers;
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      // override
      return true;
    }
  }]);

  return DisplayComponent;
}(_EngineComponent3.default);

exports.default = DisplayComponent;

},{"minibot/engine/EngineComponent":19}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EngineComponent2 = require('minibot/engine/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputComponent = function (_EngineComponent) {
  _inherits(InputComponent, _EngineComponent);

  function InputComponent() {
    _classCallCheck(this, InputComponent);

    return _possibleConstructorReturn(this, (InputComponent.__proto__ || Object.getPrototypeOf(InputComponent)).apply(this, arguments));
  }

  return InputComponent;
}(_EngineComponent3.default);

exports.default = InputComponent;

},{"minibot/engine/EngineComponent":19}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EngineComponent2 = require('minibot/engine/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhysicsComponent = function (_EngineComponent) {
  _inherits(PhysicsComponent, _EngineComponent);

  function PhysicsComponent() {
    _classCallCheck(this, PhysicsComponent);

    return _possibleConstructorReturn(this, (PhysicsComponent.__proto__ || Object.getPrototypeOf(PhysicsComponent)).apply(this, arguments));
  }

  return PhysicsComponent;
}(_EngineComponent3.default);

exports.default = PhysicsComponent;

},{"minibot/engine/EngineComponent":19}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EngineSystem2 = require("minibot/engine/EngineSystem");

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplaySystem = function (_EngineSystem) {
  _inherits(DisplaySystem, _EngineSystem);

  function DisplaySystem(type) {
    _classCallCheck(this, DisplaySystem);

    var _this = _possibleConstructorReturn(this, (DisplaySystem.__proto__ || Object.getPrototypeOf(DisplaySystem)).call(this, type));

    _this.scene = null;
    _this.layers = new Array();
    return _this;
  }

  _createClass(DisplaySystem, [{
    key: "update",
    value: function update(dt) {
      this.updateComponents(dt);
    }
  }, {
    key: "addObject",
    value: function addObject(obj) {
      var c = _get(DisplaySystem.prototype.__proto__ || Object.getPrototypeOf(DisplaySystem.prototype), "addObject", this).call(this, obj);
      if (c == null) return null;

      var l = c.getLayers();
      for (var i = 0; i < l.length; i++) {
        this.addToLayer(c, l[i]);
      }
    }
  }, {
    key: "addToLayer",
    value: function addToLayer(component, layer) {
      while (!this.layers[layer]) {
        this.layers.push([]);
      }
      this.layers[layer].push(component);
    }
  }, {
    key: "onAddedToEngine",
    value: function onAddedToEngine() {
      // Setup the world?
    }
  }, {
    key: "getScene",
    value: function getScene() {
      return this.engine.getScene();
    }
  }, {
    key: "getCamera",
    value: function getCamera() {
      return this.engine.getCamera();
    }

    // render the scene layer by layer, check if each component is on screen first

  }, {
    key: "render",
    value: function render(dt) {

      var x = 0;
      var y = 0;
      var camera = this.getCamera();
      if (camera != null) {
        var x = camera.getProperty("x") * -1;
        var y = camera.getProperty("y") * -1;
      }

      var i, j, layer, component;
      for (i = 0; i < this.layers.length; i++) {
        layer = this.layers[i];
        for (j = 0; j < layer.length; j++) {
          component = layer[j];
          if (!component.isVisible()) continue;
          component.render(dt, i, x, y);
        }
      }
    }
  }]);

  return DisplaySystem;
}(_EngineSystem3.default);

exports.default = DisplaySystem;

},{"minibot/engine/EngineSystem":22}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineSystem2 = require('minibot/engine/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _EngineEvent = require('minibot/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _Utils = require('minibot/core/Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputSystem = function (_EngineSystem) {
  _inherits(InputSystem, _EngineSystem);

  function InputSystem(type) {
    _classCallCheck(this, InputSystem);

    var _this = _possibleConstructorReturn(this, (InputSystem.__proto__ || Object.getPrototypeOf(InputSystem)).call(this, type));

    _this.inputQueue = [];
    _this.inputHandlers = {};
    return _this;
  }

  _createClass(InputSystem, [{
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {
      this.addEventListener(_EngineEvent2.default.INPUT, (0, _Utils.BindAsEventListener)(this.handleInput, this));
    }
  }, {
    key: 'update',
    value: function update(dt) {
      while (this.inputQueue.length) {
        var q = this.inputQueue.shift();
        while (this.inputQueue.length && this.inputQueue[0].type == q.type) {
          q = this.inputQueue.shift();
        }
        var c = this.inputHandlers[q.type];
        if (c != null) {
          c.input(q.type, q.data);
        }
      }
    }
  }, {
    key: 'handleInput',
    value: function handleInput(event) {
      this.inputQueue.push(event.data);
    }
  }, {
    key: 'addInputHandler',
    value: function addInputHandler(component, type) {
      if (this.inputHandlers[type] != null) {
        // THROW AN ERROR HERE or change to array type...
        alert('hey fix this so it can use multiple handlers');
      } else {
        this.inputHandlers[type] = component;
      }
    }
  }, {
    key: 'removeInputHandler',
    value: function removeInputHandler(component, type) {}
  }]);

  return InputSystem;
}(_EngineSystem3.default);

exports.default = InputSystem;

},{"minibot/core/Utils":3,"minibot/engine/EngineSystem":22,"minibot/event/EngineEvent":30}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseEvent
/** @lends event.BaseEvent# */
= function () {

  /**
   * Constructs a new BaseEvent instance.
   * @class An event class that can process specific events.
   * Passes on objects to specific management events.
   * @constructs
   * @param {String} type The type of event.
   * @param {Boolean} bubbles Flags if the event bubbles after the capture phase.
   * @param {Boolean} cancelable Flags if the event is able to cancel at any point in the event cycle.
   */
  function BaseEvent(type, bubbles, cancelable) {
    _classCallCheck(this, BaseEvent);

    /** The type of event.
     * @type string
     */
    this.type = type;
    /** The event target.
     * @type object
     */
    this.target = null;
    /** The object that is actively uses an eventListener on the Event object.
     * @type object
     */
    this.currentTarget = null;
    /** Indictes a bubbling event.
     * @type bool
     */
    this.bubbles = bubbles == undefined ? false : bubbles;
    /** Indicates if the action associated with an event can be terminated.
     * @type bool
     */
    this.cancelable = cancelable == undefined ? false : cancelable;
    /** The current phase of the event flow.
     * @type object
     */
    this.currentPhase = null;
  }

  /**
   * Stops the default action of the event from being carried out.
   */


  _createClass(BaseEvent, [{
    key: "preventDefault",
    value: function preventDefault() {}
  }]);

  return BaseEvent;
}();

exports.default = BaseEvent;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseEvent2 = require("./BaseEvent");

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonEvent = function (_BaseEvent) {
  _inherits(ButtonEvent, _BaseEvent);

  /** The object upon which the mouse is displayed.
   * @type display.DisplayObject
   */
  // displayObject: null,

  /**
   * Constructs a MouseEvent instance.
   * @class Short description of class.
   * Long Description of class.
   * @constructs
   * @param {String} type The type of event.
   * @param {Boolean} bubbles Indicates a bubbling event.
   * @param {Boolean} cancelable Indicates whether the event action can be terminated.
   * @param {Number} x The x coordinate of the MouseEvent.
   * @param {Number} y The y coordinate of the MouseEvent.
   * @param {display.DisplayObject} displayObject The object upon which the mouse is displayed.
   * @param
   */
  function ButtonEvent(type, bubbles, cancelable, displayObject) {
    _classCallCheck(this, ButtonEvent);

    var _this = _possibleConstructorReturn(this, (ButtonEvent.__proto__ || Object.getPrototypeOf(ButtonEvent)).call(this, type, bubbles, cancelable));

    _this.displayObject = displayObject;
    return _this;
  }

  return ButtonEvent;
}(_BaseEvent3.default
/** @lends event.MouseEvent# */
);

ButtonEvent.SELECT = "buttonSelect";

exports.default = ButtonEvent;

},{"./BaseEvent":28}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseEvent2 = require('./BaseEvent');

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EngineEvent = function (_BaseEvent) {
  _inherits(EngineEvent, _BaseEvent);

  /** Description of object.
   * @type object
   */
  // object: null,
  /** Description of component.
   * @type object
   */
  // component: null,
  /** Description of data.
   * @type object
   */
  // data: null,

  /**
   * Creates a new EngineEvent instance.
   * @class Identifies an event and selects appropriate action.
   * Analyzes event data in order to pinpoint significant events and trigger actions.
   * @constructs
   * @param {type} type Description of type.
   * @param {object} object Description of object.
   * @param {object} Description of component.
   * @param {object} data Description of data.
   * @param
   */
  function EngineEvent(type, object, component, data) {
    _classCallCheck(this, EngineEvent);

    var _this = _possibleConstructorReturn(this, (EngineEvent.__proto__ || Object.getPrototypeOf(EngineEvent)).call(this, type, false, false));

    _this.object = object;
    _this.component = component;
    _this.data = data;
    return _this;
  }

  return EngineEvent;
}(_BaseEvent3.default
/** @lends event.EngineEvent# */
);

exports.default = EngineEvent;

},{"./BaseEvent":28}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventDispatcher
/** @lends event.EventDispatcher# */
= function () {

  /**
   * Creates a new EventDispatcher instance.
   * @class Relegates and dispatches events to a target.
   * Events can be attached to targets in order to keep the flow of processes running as intended.
   * @constructs
   */
  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);

    this.listeners = {};
  }
  /**
   * Registers an eventListener to a target.
   * @param {type} type The data type of event the specified listener is looking for.
   * @param {object} callback The listener object that recieves the specified type.
   */


  _createClass(EventDispatcher, [{
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      var callbacks;
      if (this.listeners[type] == undefined) {
        callbacks = new Array();
        this.listeners[type] = callbacks;
      } else {
        callbacks = this.listeners[type];
      }
      callbacks.push(callback);
    }
    /**
     * Returns whether or not the EventDispatcher has an event listener for the specified type.
     * @param {type} type The data type of the event the specified listener is looking for.
     * @returns {boolean} A value indicating whether or not an event listener for the specified type is available.
     */

  }, {
    key: "hasEventListener",
    value: function hasEventListener(type) {
      return this.listeners[type] != undefined;
    }
    /**
     * Sends the event to the EventDispatcher to be sent into the event flow.
     * @param {event} event The event to be sent into the event flow.
     * @returns {boolean} A value indicating whether or not the event was successfully dispatched.
     */

  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var callbacks;
      if (this.listeners[event.type] == undefined) {
        return false;
      } else {
        callbacks = this.listeners[event.type];
      }
      event.target = this;
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        callback(event);
      }
      return true;
    }
    /**
     * Gets rid of an eventListener.
     * @param {type} type The type of data the specified listener is looking for.
     * @param {object} callback The listener object that recieves the specified type.
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, callback) {
      var callbacks;
      if (this.listeners[type] == undefined) {
        return;
      } else {
        callbacks = this.listeners[type];
      }
      var i = callbacks.indexOf(callback);
      if (i == -1) return;
      callbacks.splice(i, 1);

      // Remove the callbacks array from the map if empty
      if (callbacks.length == 0) {
        delete this.listeners[type];
      }
    }
    /**
     * Gets rid of all eventListeners on the map.
     */

  }, {
    key: "removeAllEventListeners",
    value: function removeAllEventListeners() {
      this.listeners = {};
    }
  }]);

  return EventDispatcher;
}();

exports.default = EventDispatcher;

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseEvent2 = require("minibot/event/BaseEvent");

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlEvent = function (_BaseEvent) {
  _inherits(HtmlEvent, _BaseEvent);

  function HtmlEvent(type, event) {
    _classCallCheck(this, HtmlEvent);

    return _possibleConstructorReturn(this, (HtmlEvent.__proto__ || Object.getPrototypeOf(HtmlEvent)).call(this, type, event));
  }

  return HtmlEvent;
}(_BaseEvent3.default);

HtmlEvent.CLICK = "HtmlEvent_Click";
HtmlEvent.MOUSE_UP = "HtmlEvent_MouseUp";
HtmlEvent.MOUSE_DOWN = "HtmlEvent_MouseDown";
HtmlEvent.MOUSE_MOVE = "HtmlEvent_MouseMove";
HtmlEvent.KEY_DOWN = "HtmlEvent_KeyDown";
HtmlEvent.KEY_UP = "HtmlEvent_KeyUp";
HtmlEvent.FOCUS = "HtmlEvent_Focus";
HtmlEvent.BLUR = "HtmlEvent_Blur";

exports.default = HtmlEvent;

},{"minibot/event/BaseEvent":28}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseEvent2 = require("./BaseEvent");

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeyboardEvent = function (_BaseEvent) {
  _inherits(KeyboardEvent, _BaseEvent);

  // key: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @constructs
   * @param {String} type
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   * @param {Number} x
   * @param {Number} y
   * @param {display.DisplayObject} displayObject
   * @param
   */
  function KeyboardEvent(type, bubbles, cancelable, key) {
    _classCallCheck(this, KeyboardEvent);

    var _this = _possibleConstructorReturn(this, (KeyboardEvent.__proto__ || Object.getPrototypeOf(KeyboardEvent)).call(this, type, bubbles, cancelable));

    _this.key = key;
    return _this;
  }

  return KeyboardEvent;
}(_BaseEvent3.default
/** @lends event.MouseEvent# */
);

KeyboardEvent.KEY_DOWN = "keyDown";
KeyboardEvent.KEY_UP = "keyUp";

exports.default = KeyboardEvent;

},{"./BaseEvent":28}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseEvent2 = require("./BaseEvent");

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseEvent = function (_BaseEvent) {
  _inherits(MouseEvent, _BaseEvent);

  /** The x coordinate of the MouseEvent.
   * @type Integer
   */
  // x: null,
  /** The y coordinate of the MouseEvent.
   * @type Integer
   */
  // y: null,
  /** The object upon which the mouse is displayed.
   * @type display.DisplayObject
   */
  // displayObject: null,

  /**
   * Constructs a MouseEvent instance.
   * @class Short description of class.
   * Long Description of class.
   * @constructs
   * @param {String} type The type of event.
   * @param {Boolean} bubbles Indicates a bubbling event.
   * @param {Boolean} cancelable Indicates whether the event action can be terminated.
   * @param {Number} x The x coordinate of the MouseEvent.
   * @param {Number} y The y coordinate of the MouseEvent.
   * @param {display.DisplayObject} displayObject The object upon which the mouse is displayed.
   * @param
   */

  function MouseEvent(type, bubbles, cancelable, x, y, displayObject) {
    _classCallCheck(this, MouseEvent);

    var _this = _possibleConstructorReturn(this, (MouseEvent.__proto__ || Object.getPrototypeOf(MouseEvent)).call(this, type, bubbles, cancelable));

    _this.x = x;
    _this.y = y;
    _this.displayObject = displayObject;
    return _this;
  }

  return MouseEvent;
}(_BaseEvent3.default
/** @lends event.MouseEvent# */
);

MouseEvent.CLICK = "mouseClick";
MouseEvent.MOUSE_DOWN = "mouseDown";
MouseEvent.MOUSE_UP = "mouseUp";
MouseEvent.MOUSE_MOVE = "mouseMove";

exports.default = MouseEvent;

},{"./BaseEvent":28}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseEvent2 = require("./BaseEvent");

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TouchEvent = function (_BaseEvent) {
  _inherits(TouchEvent, _BaseEvent);

  // x: null,

  // y: null,

  // displayObject: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @constructs
   * @param {String} type
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   * @param {Number} x
   * @param {Number} y
   * @param {display.DisplayObject} displayObject
   * @param
   */
  function TouchEvent(type, bubbles, cancelable, x, y, displayObject) {
    _classCallCheck(this, TouchEvent);

    var _this = _possibleConstructorReturn(this, (TouchEvent.__proto__ || Object.getPrototypeOf(TouchEvent)).call(this, type, bubbles, cancelable));

    _this.x = x;
    _this.y = y;
    _this.displayObject = displayObject;
    return _this;
  }

  return TouchEvent;
}(_BaseEvent3.default
/** @lends event.MouseEvent# */
);

TouchEvent.TOUCH_START = "touchStart";
TouchEvent.TOUCH_END = "touchEnd";
TouchEvent.TOUCH_MOVE = "touchMove";

exports.default = TouchEvent;

},{"./BaseEvent":28}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  KEY_A: 'A',
  KEY_B: 'B',
  KEY_C: 'C',
  KEY_D: 'D',
  KEY_E: 'E',
  KEY_F: 'F',
  KEY_G: 'G',
  KEY_H: 'H',
  KEY_I: 'I',
  KEY_J: 'J',
  KEY_K: 'K',
  KEY_L: 'L',
  KEY_M: 'M',
  KEY_N: 'N',
  KEY_O: 'O',
  KEY_P: 'P',
  KEY_Q: 'Q',
  KEY_R: 'R',
  KEY_S: 'S',
  KEY_T: 'T',
  KEY_U: 'U',
  KEY_V: 'V',
  KEY_W: 'W',
  KEY_X: 'X',
  KEY_Y: 'Y',
  KEY_Z: 'Z',

  KEY_0: 0,
  KEY_1: 1,
  KEY_2: 2,
  KEY_3: 3,
  KEY_4: 4,
  KEY_5: 5,
  KEY_6: 6,
  KEY_7: 7,
  KEY_8: 8,
  KEY_9: 9,

  KEY_UP: 10,
  KEY_RIGHT: 11,
  KEY_DOWN: 12,
  KEY_LEFT: 13,

  KEY_SPACE: ' '

};

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rectangle
/** @lends geom.Rectangle# */
=

// x: 0,
// y: 0,
// w: 0,
// h: 0,

/**
 * Description of constructor.
 * @class Short description of class.
 * Long Description of class.
 * @constructs
 */
function Rectangle(x, y, w, h) {
  _classCallCheck(this, Rectangle);

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

exports.default = Rectangle;

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector2
/** @lends geom.Vector2# */
= function () {

  // x: 0,
  // y: 0,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @constructs
   */
  function Vector2(x, y) {
    _classCallCheck(this, Vector2);

    this.x = x || 0;
    this.y = y || 0;
  }

  _createClass(Vector2, [{
    key: "reset",
    value: function reset(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
  }, {
    key: "toString",
    value: function toString(decPlaces) {
      decPlaces = decPlaces || 3;
      var scalar = Math.pow(10, decPlaces);
      return "[" + Math.round(this.x * scalar) / scalar + ", " + Math.round(this.y * scalar) / scalar + "]";
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Vector2(this.x, this.y);
    }
  }, {
    key: "copyTo",
    value: function copyTo(v) {
      v.x = this.x;
      v.y = this.y;
    }
  }, {
    key: "copyFrom",
    value: function copyFrom(v) {
      this.x = v.x;
      this.y = v.y;
    }
  }, {
    key: "magnitude",
    value: function magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  }, {
    key: "magnitudeSquared",
    value: function magnitudeSquared() {
      return this.x * this.x + this.y * this.y;
    }
  }, {
    key: "normalise",
    value: function normalise() {
      return this.normailize();
    }
  }, {
    key: "normalize",
    value: function normalize() {

      var m = this.magnitude();
      if (m == 0) return this;

      this.x = this.x / m;
      this.y = this.y / m;

      return this;
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this.x = -this.x;
      this.y = -this.y;

      return this;
    }
  }, {
    key: "plusEq",
    value: function plusEq(v) {
      this.x += v.x;
      this.y += v.y;

      return this;
    }
  }, {
    key: "plusNew",
    value: function plusNew(v) {
      return new Vector2(this.x + v.x, this.y + v.y);
    }
  }, {
    key: "minusEq",
    value: function minusEq(v) {
      this.x -= v.x;
      this.y -= v.y;

      return this;
    }
  }, {
    key: "minusNew",
    value: function minusNew(v) {
      return new Vector2(this.x - v.x, this.y - v.y);
    }
  }, {
    key: "multiplyEq",
    value: function multiplyEq(scalar) {
      this.x *= scalar;
      this.y *= scalar;

      return this;
    }
  }, {
    key: "multiplyNew",
    value: function multiplyNew(scalar) {
      var returnvec = this.clone();
      return returnvec.multiplyEq(scalar);
    }
  }, {
    key: "divideEq",
    value: function divideEq(scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    }
  }, {
    key: "divideNew",
    value: function divideNew(scalar) {
      var returnvec = this.clone();
      return returnvec.divideEq(scalar);
    }
  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y;
    }
  }, {
    key: "angle",
    value: function angle(useRadians) {
      return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector2.TO_DEGREES);
    }
  }, {
    key: "rotate",
    value: function rotate(angle, useRadians) {
      var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2.TO_RADIANS));
      var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2.TO_RADIANS));

      Vector2.temp.copyFrom(this);

      this.x = Vector2.temp.x * cosRY - Vector2.temp.y * sinRY;
      this.y = Vector2.temp.x * sinRY + Vector2.temp.y * cosRY;

      return this;
    }
  }, {
    key: "equals",
    value: function equals(v) {
      return this.x == v.x && this.y == v.x;
    }
  }, {
    key: "isCloseTo",
    value: function isCloseTo(v, tolerance) {
      if (this.equals(v)) return true;

      Vector2.temp.copyFrom(this);
      Vector2.temp.minusEq(v);

      return Vector2.temp.magnitudeSquared() < tolerance * tolerance;
    }
  }, {
    key: "rotateAroundPoint",
    value: function rotateAroundPoint(point, angle, useRadians) {
      Vector2.temp.copyFrom(this);
      //trace("rotate around point "+t+" "+point+" " +angle);
      Vector2.temp.minusEq(point);
      //trace("after subtract "+t);
      Vector2.temp.rotate(angle, useRadians);
      //trace("after rotate "+t);
      Vector2.temp.plusEq(point);
      //trace("after add "+t);
      this.copyFrom(Vector2.temp);
    }
  }, {
    key: "isMagLessThan",
    value: function isMagLessThan(distance) {
      return this.magnitudeSquared() < distance * distance;
    }
  }, {
    key: "isMagGreaterThan",
    value: function isMagGreaterThan(distance) {
      return this.magnitudeSquared() > distance * distance;
    }

    // still AS3 to convert :
    // public function projectOnto(v:Vector2) : Vector2
    // {
    // var dp:Number = dot(v);
    //
    // var f:Number = dp / ( v.x*v.x + v.y*v.y );
    //
    // return new Vector2( f*v.x , f*v.y);
    // }
    //
    //
    // public function convertToNormal():void
    // {
    // var tempx:Number = x;
    // x = -y;
    // y = tempx;
    //
    //
    // }
    // public function getNormal():Vector2
    // {
    //
    // return new Vector2(-y,x);
    //
    // }
    //
    //
    //
    // public function getClosestPointOnLine ( vectorposition : Point, targetpoint : Point ) : Point
    // {
    // var m1 : Number = y / x ;
    // var m2 : Number = x / -y ;
    //
    // var b1 : Number = vectorposition.y - ( m1 * vectorposition.x ) ;
    // var b2 : Number = targetpoint.y - ( m2 * targetpoint.x ) ;
    //
    // var cx : Number = ( b2 - b1 ) / ( m1 - m2 ) ;
    // var cy : Number = m1 * cx + b1 ;
    //
    // return new Point ( cx, cy ) ;
    // }
    //

  }]);

  return Vector2;
}();

Vector2.TO_DEGREES = 180 / Math.PI;
Vector2.TO_RADIANS = Math.PI / 180;
Vector2.temp = new Vector2();

exports.default = Vector2;

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color
/** @lends graphics.Color# */
= function () {

  // r: null,

  // g: null,

  // b: null,

  // h: null,

  // s: null,

  // l: null,

  // a: null,

  // mode: null,

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends display.canvas.CanvasDisplayObject
   * @constructs
   * @param
   */
  function Color(mode, v1, v2, v3, a) {
    _classCallCheck(this, Color);

    this.type = Color.TYPE;
    this.setColor(mode, v1, v2, v3, a);
  }

  // Public Methods -->

  _createClass(Color, [{
    key: "setColor",
    value: function setColor(mode, v1, v2, v3, a) {
      this.mode = mode;
      this.a = a != undefined ? a : 1.0;
      if (mode == Color.RGB) {
        this.r = v1;
        this.g = v2;
        this.b = v3;
      } else if (mode == Color.HSL) {
        this.h = v1;
        this.s = v2;
        this.l = v3;
        var rgb = Color.HslToRgb(this.h, this.s, this.l);
        this.r = Math.round(rgb[0]);
        this.g = Math.round(rgb[1]);
        this.b = Math.round(rgb[2]);
      } else {
        throw new Error("Color: unrecognized color mode.");
      }
    }
  }, {
    key: "getAsArray",
    value: function getAsArray(mode) {
      if (mode == Color.RGB) {
        return [this.r, this.g, this.b, this.a];
      } else if (mode == Color.HSL) {
        return [this.h, this.s, this.l, this.a];
      } else {
        throw new Error("Color: unrecognized color mode.");
      }
    }
  }, {
    key: "getAsString",
    value: function getAsString(mode, spacer) {
      spacer = spacer == undefined ? "," : spacer;
      return this.getAsArray(mode).join(spacer);
    }

    // <-- Public Methods


  }]);

  return Color;
}();

Color.RgbToHsl = function (r, g, b) {};

Color.HslToRgb = function (h, s, l) {
  if (s <= 0) {
    return [l, l, l];
  }
  h = h / 256 * 6;
  s = s / 255;
  l = l / 255;
  var c = (1 - Math.abs(2 * l - 1)) * s,
      x = (1 - Math.abs(h % 2 - 1)) * c,
      m = l - 0.5 * c,
      r = 0,
      g = 0,
      b = 0;

  if (h < 1) {
    r = c;g = x;b = 0;
  } else if (h < 2) {
    r = x;g = c;b = 0;
  } else if (h < 3) {
    r = 0;g = c;b = x;
  } else if (h < 4) {
    r = 0;g = x;b = c;
  } else if (h < 5) {
    r = x;g = 0;b = c;
  } else {
    r = c;g = 0;b = x;
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

Color.FromHex = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return new Color(Color.RGB, parseInt(result[1], 16), // r
    parseInt(result[2], 16), // g
    parseInt(result[3], 16) // b
    );
  } else {
    return null;
  }
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

Color.RGB = "rgb";
Color.HSL = "hsl";

Color.TYPE = 'color';

exports.default = Color;

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pattern
/** @lends graphics.Pattern# */
= function () {
  /** The sprite.
   * @type resource.SpriteResource
   */
  // sprite: null,

  // pattern: null,

  // repeat: null,

  /**
   * Creates a new Pattern instance.
   * @class Creates a sprite to be rendered.
   * @constructs
   * @param {resource.SpriteResource} sprite The sprite to be used.
   * @param
   */
  function Pattern(sprite, repeat) {
    _classCallCheck(this, Pattern);

    if (repeat == undefined) repeat = Pattern.REPEAT;

    this.repeat = repeat;
    this.type = Pattern.TYPE;
    this.sprite = sprite;
  }

  _createClass(Pattern, [{
    key: "hasPattern",
    value: function hasPattern() {
      return this.pattern != null;
    }
  }, {
    key: "setPattern",
    value: function setPattern(pattern) {
      this.pattern = pattern;
    }
  }, {
    key: "getPattern",
    value: function getPattern() {
      return this.pattern;
    }
  }]);

  return Pattern;
}();

exports.default = Pattern;

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('minibot/core/Utils');

var Utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _toString = Object.prototype.toString,
    NULL_TYPE = 'Null',
    UNDEFINED_TYPE = 'Undefined',
    BOOLEAN_TYPE = 'Boolean',
    NUMBER_TYPE = 'Number',
    STRING_TYPE = 'String',
    OBJECT_TYPE = 'Object',
    FUNCTION_CLASS = '[object Function]',
    BOOLEAN_CLASS = '[object Boolean]',
    NUMBER_CLASS = '[object Number]',
    STRING_CLASS = '[object String]',
    ARRAY_CLASS = '[object Array]',
    DATE_CLASS = '[object Date]';

var $break = {};

function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }return destination;
}

function isHash(object) {
  return object instanceof Object;
}

function isFunction(object) {
  return _toString.call(object) === FUNCTION_CLASS;
}

function isString(object) {
  return _toString.call(object) === STRING_CLASS;
}

function isNumber(object) {
  return _toString.call(object) === NUMBER_CLASS;
}

function isDate(object) {
  return _toString.call(object) === DATE_CLASS;
}

function isUndefined(object) {
  return typeof object === "undefined";
}

function include(arr, object) {
  if (isFunction(arr.indexOf)) if (arr.indexOf(object) != -1) return true;

  var found = false;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == object) {
      found = true;
      break;
    }
  }
  return found;
}

function isJSON(str) {
  if (str.blank()) return false;
  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
  str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
  return (/^[\],:{}\s]*$/.test(str)
  );
}

function evalJSON(json, sanitize) {
  try {
    if (!sanitize || isJSON(json)) return eval('(' + json + ')');
  } catch (e) {}
  throw new SyntaxError('Badly formed JSON string: ' + json);
}

var Try = {
  these: function these() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
  }
};

var Ajax = {
  getTransport: function getTransport() {
    return Try.these(function () {
      return new XMLHttpRequest();
    }, function () {
      return new ActiveXObject('Msxml2.XMLHTTP');
    }, function () {
      return new ActiveXObject('Microsoft.XMLHTTP');
    }) || false;
  },

  activeRequestCount: 0
};

var Responders = {
  responders: [],

  register: function register(responder) {
    if (!include(this, responder)) this.responders.push(responder);
  },

  unregister: function unregister(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function dispatch(callback, request, transport, json) {
    var responder;
    for (var i = 0; i < this.responders.length; i++) {
      responder = this.responders[i];
      if (isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    }
  }
};

//extend(Ajax.Responders, Enumerable);

Responders.register({
  onCreate: function onCreate() {
    Ajax.activeRequestCount++;
  },
  onComplete: function onComplete() {
    Ajax.activeRequestCount--;
  }
});

var Base = function Base(options) {
  _classCallCheck(this, Base);

  this.options = {
    method: 'post',
    asynchronous: true,
    contentType: 'application/x-www-form-urlencoded',
    encoding: 'UTF-8',
    parameters: '',
    evalJSON: true,
    evalJS: true
  };
  extend(this.options, options || {});

  this.options.method = this.options.method.toLowerCase();

  if (isHash(this.options.parameters)) this.options.parameters = this.options.parameters.toObject();
};

var Request = function (_Base) {
  _inherits(Request, _Base);

  // = Class.create(Ajax.Base, {  _complete: false,

  function Request(url, options) {
    _classCallCheck(this, Request);

    var _this = _possibleConstructorReturn(this, (Request.__proto__ || Object.getPrototypeOf(Request)).call(this, options));

    _this.complete = false;
    _this.transport = Ajax.getTransport();
    _this.request(url);
    return _this;
  }

  _createClass(Request, [{
    key: 'request',
    value: function request(url) {
      this.url = url;
      this.method = this.options.method;
      var params = isString(this.options.parameters) ? this.options.parameters : toQueryString(this.options.parameters);

      if (!include(['get', 'post'], this.method)) {
        params += (params ? '&' : '') + "_method=" + this.method;
        this.method = 'post';
      }

      if (params && this.method === 'get') {
        this.url += (include(this.url, '?') ? '&' : '?') + params;
      }

      this.parameters = Utils.StringToQueryParams(params);

      try {
        var response = new Response(this);
        if (this.options.onCreate) this.options.onCreate(response);
        Responders.dispatch('onCreate', this, response);

        this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

        if (this.options.asynchronous) Utils.Defer(this.respondToReadyState, this, 1);

        this.transport.onreadystatechange = Utils.Bind(this.onStateChange, this);
        this.setRequestHeaders();

        this.body = this.method == 'post' ? this.options.postBody || params : null;
        this.transport.send(this.body);

        /* Force Firefox to handle ready state 4 for synchronous requests */
        if (!this.options.asynchronous && this.transport.overrideMimeType) this.onStateChange();
      } catch (e) {
        this.dispatchException(e);
      }
    }
  }, {
    key: 'onStateChange',
    value: function onStateChange() {
      var readyState = this.transport.readyState;
      if (readyState > 1 && !(readyState == 4 && this._complete)) this.respondToReadyState(this.transport.readyState);
    }
  }, {
    key: 'setRequestHeaders',
    value: function setRequestHeaders() {
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      };

      if (this.method == 'post') {
        headers['Content-type'] = this.options.contentType + (this.options.encoding ? '; charset=' + this.options.encoding : '');

        /* Force "Connection: close" for older Mozilla browsers to work
         * around a bug where XMLHttpRequest sends an incorrect
         * Content-length header. See Mozilla Bugzilla #246651.
         */
        if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) headers['Connection'] = 'close';
      }

      if (_typeof(this.options.requestHeaders) == 'object') {
        var extras = this.options.requestHeaders;

        if (isFunction(extras.push)) for (var i = 0, length = extras.length; i < length; i += 2) {
          headers[extras[i]] = extras[i + 1];
        } else $H(extras).each(function (pair) {
          headers[pair.key] = pair.value;
        });
      }

      for (var name in headers) {
        this.transport.setRequestHeader(name, headers[name]);
      }
    }
  }, {
    key: 'success',
    value: function success() {
      var status = this.getStatus();
      return !status || status >= 200 && status < 300 || status == 304;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      try {
        if (this.transport.status === 1223) return 204;
        return this.transport.status || 0;
      } catch (e) {
        return 0;
      }
    }
  }, {
    key: 'respondToReadyState',
    value: function respondToReadyState(readyState) {
      var state = Request.Events[readyState],
          response = new Response(this);

      if (state == 'Complete') {
        try {
          this._complete = true;
          (this.options['on' + response.status] || this.options['on' + (this.success() ? 'Success' : 'Failure')] || function () {})(response, response.headerJSON);
        } catch (e) {
          this.dispatchException(e);
        }

        var contentType = response.getHeader('Content-type');
        if (this.options.evalJS == 'force' || this.options.evalJS && this.isSameOrigin() && contentType && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)) this.evalResponse();
      }

      try {
        (this.options['on' + state] || function () {})(response, response.headerJSON);
        Responders.dispatch('on' + state, this, response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      if (state == 'Complete') {
        this.transport.onreadystatechange = function () {};
      }
    }
  }, {
    key: 'isSameOrigin',
    value: function isSameOrigin() {
      var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
      return !m || m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
        protocol: location.protocol,
        domain: document.domain,
        port: location.port ? ':' + location.port : ''
      });
    }
  }, {
    key: 'getHeader',
    value: function getHeader(name) {
      try {
        return this.transport.getResponseHeader(name) || null;
      } catch (e) {
        return null;
      }
    }
  }, {
    key: 'evalResponse',
    value: function evalResponse() {
      try {
        return eval((this.transport.responseText || '').unfilterJSON());
      } catch (e) {
        this.dispatchException(e);
      }
    }
  }, {
    key: 'dispatchException',
    value: function dispatchException(exception) {
      (this.options.onException || function () {})(this, exception);
      Responders.dispatch('onException', this, exception);
    }
  }]);

  return Request;
}(Base);

Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

var Response = function () {
  function Response(request) {
    _classCallCheck(this, Response);

    this.status = 0;
    this.statusText = '';

    this.request = request;
    var transport = this.transport = request.transport,
        readyState = this.readyState = transport.readyState;

    var BROWSER_IS_IE = false;

    if (readyState > 2 && !BROWSER_IS_IE || readyState == 4) {
      this.status = this.getStatus();
      this.statusText = this.getStatusText();
      this.responseText = transport.responseText == null ? '' : String(transport.responseText);
      this.headerJSON = this._getHeaderJSON();
    }

    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML = isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  }

  _createClass(Response, [{
    key: 'getStatus',
    value: function getStatus() {
      return Request.prototype.getStatus();
    }
  }, {
    key: 'getStatusText',
    value: function getStatusText() {
      try {
        return this.transport.statusText || '';
      } catch (e) {
        return '';
      }
    }
  }, {
    key: 'getHeader',
    value: function getHeader(name) {
      return Request.prototype.getHeader(name);
    }
  }, {
    key: 'getAllHeaders',
    value: function getAllHeaders() {
      try {
        return this.getAllResponseHeaders();
      } catch (e) {
        return null;
      }
    }
  }, {
    key: 'getResponseHeader',
    value: function getResponseHeader(name) {
      return this.transport.getResponseHeader(name);
    }
  }, {
    key: 'getAllResponseHeaders',
    value: function getAllResponseHeaders() {
      return this.transport.getAllResponseHeaders();
    }
  }, {
    key: '_getHeaderJSON',
    value: function _getHeaderJSON() {
      var json = this.getHeader('X-JSON');
      if (!json) return null;
      json = decodeURIComponent(escape(json));
      try {
        return evalJSON(json, this.request.options.sanitizeJSON || !this.request.isSameOrigin());
      } catch (e) {
        this.request.dispatchException(e);
      }
    }
  }, {
    key: '_getResponseJSON',
    value: function _getResponseJSON() {
      var options = this.request.options;
      if (!options.evalJSON || options.evalJSON != 'force' && !(include(this.getHeader('Content-type') || ''), 'application/json') || this.responseText.blank()) return null;
      try {
        return evalJSON(this.responseText, options.sanitizeJSON || !this.request.isSameOrigin());
      } catch (e) {
        this.request.dispatchException(e);
      }
    }
  }]);

  return Response;
}();

/*
Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || function(){}).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});


function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

*/

Ajax.Request = Request;
Ajax.Response = Response;

exports.default = Ajax;

},{"minibot/core/Utils":3}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Resource2 = require('minibot/resource/Resource');

var _Resource3 = _interopRequireDefault(_Resource2);

var _SpriteResource = require('minibot/resource/SpriteResource');

var _SpriteResource2 = _interopRequireDefault(_SpriteResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimationResource = function (_Resource) {
  _inherits(AnimationResource, _Resource);

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends resource.Resource
   * @constructs
   * @param {String} id The id of the Resource.
   * @param {Object} data The data associated with the Resource.
   * @param
   */
  function AnimationResource(id, data) {
    _classCallCheck(this, AnimationResource);

    var _this = _possibleConstructorReturn(this, (AnimationResource.__proto__ || Object.getPrototypeOf(AnimationResource)).call(this, id));

    _this.spriteIds = [];
    _this.delays = [];
    if (data.frames != undefined) {
      for (var i = 0; i < data.frames.length; i++) {
        _this.spriteIds.push(data.frames[i].sprite_id);
        _this.delays.push(data.frames[i].delay);
      }
    }

    _this.numberOfFrames = _this.spriteIds.length;

    _this.sprites = [];
    return _this;
  }

  _createClass(AnimationResource, [{
    key: 'load',
    value: function load(manager, callback) {
      for (var i = 0; i < this.spriteIds.length; i++) {
        var sprite = manager.getResource(_SpriteResource2.default.TYPE, this.spriteIds[i]);
        this.sprites.push(sprite);
      }

      this.loaded = true;
      callback();
    }
  }, {
    key: 'addFrame',
    value: function addFrame(sprite, delay) {
      this.sprites.push_back(sprite);
      this.delays.push_back(delay);
      this.numberOfFrames++;
    }
  }, {
    key: 'getSprite',
    value: function getSprite(index) {
      return this.sprites[index];
    }
  }, {
    key: 'getDelay',
    value: function getDelay(index) {
      return this.delays[index];
    }
  }, {
    key: 'nextFrame',
    value: function nextFrame(index) {
      return (index + 1) % this.numberOfFrames;
    }
  }, {
    key: 'atEnd',
    value: function atEnd(index) {
      return index + 1 == this.numberOfFrames;
    }
  }]);

  return AnimationResource;
}(_Resource3.default
/** @lends resource.AnimationResource# */
);

AnimationResource.TYPE = 3;

exports.default = AnimationResource;

},{"minibot/resource/Resource":44,"minibot/resource/SpriteResource":46}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Resource2 = require('minibot/resource/Resource');

var _Resource3 = _interopRequireDefault(_Resource2);

var _Utils = require('minibot/core/Utils');

var Utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageResource = function (_Resource) {
  _inherits(ImageResource, _Resource);

  /**
   * Create a new ImageResource object.
   * @class The base ImageResource object.
   * It is intended to be used as an Interface, although such types are not
   * @extends resource.Resource
   * @constructs
   * @param {String} id The id of the Resource.
   * @param {Object} data The data associated with the Resource.
   * @param
   */
  function ImageResource(id, data) {
    _classCallCheck(this, ImageResource);

    var _this = _possibleConstructorReturn(this, (ImageResource.__proto__ || Object.getPrototypeOf(ImageResource)).call(this, id));

    _this.src = null;
    _this.img = null;
    if (data.src != undefined) _this.src = data.src;
    return _this;
  }

  _createClass(ImageResource, [{
    key: 'load',
    value: function load(manager, callback) {
      this.loaded = true;
      if (this.src != null) {
        this.img = new Image();
        this.img.addEventListener("load", Utils.BindAsEventListener(this.handleLoadImageSuccess, this, callback), false);
        this.img.addEventListener("error", Utils.BindAsEventListener(this.handleLoadImageFailure, this, callback), false);
        this.img.src = this.src;
      } else {
        callback();
      }
    }
  }, {
    key: 'handleLoadImageSuccess',
    value: function handleLoadImageSuccess(event, callback) {
      callback();
    }
  }, {
    key: 'handleLoadImageFailure',
    value: function handleLoadImageFailure(event, callback) {
      // TODO: Adjust error reporting
      console.log('ImageResource: Failed to load image.');
      callback();
    }
  }]);

  return ImageResource;
}(_Resource3.default
/** @lends resource.ImageResource# */
);

ImageResource.TYPE = 1;

exports.default = ImageResource;

},{"minibot/core/Utils":3,"minibot/resource/Resource":44}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('minibot/core/Utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resource
/** @lends resource.Resource# */
= function () {

  /**
   * Create a new Resource object.
   * @class This is the basic Resource class.
   * It is intended to be used as an Interface, although such types are not
   * enforced in JavaScript.
   * @constructs
   * @param {String} id The id of the Resource.
   */
  function Resource(id) {
    _classCallCheck(this, Resource);

    this.id = id;
    this.loaded = false;
  }

  /**
   * Load the Resource
   * @param {ResourceManager} manager The ResourceManager instance.
   * @param {Function} callback The callback function to call once loaded.
   */


  _createClass(Resource, [{
    key: 'load',
    value: function load(manager, callback) {
      // Overload this function in the base class
      this.loaded = true;
      (0, _Utils.Defer)(callback, this);
    }

    /**
     * Returns if the Resource has been loaded or not.
     * @type bool
     */

  }, {
    key: 'isLoaded',
    value: function isLoaded() {
      return this.loaded;
    }
  }]);

  return Resource;
}();

exports.default = Resource;

},{"minibot/core/Utils":3}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Manager2 = require('minibot/core/Manager');

var _Manager3 = _interopRequireDefault(_Manager2);

var _Utils = require('minibot/core/Utils');

var Utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResourceManager = function (_Manager) {
  _inherits(ResourceManager, _Manager);

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends core.Manager
   * @constructs
   * @param {String} key The instance key.
   * @param
   */
  function ResourceManager(key) {
    _classCallCheck(this, ResourceManager);

    var _this = _possibleConstructorReturn(this, (ResourceManager.__proto__ || Object.getPrototypeOf(ResourceManager)).call(this, key));

    _this.resourceCount = 0;
    _this.loadedCount = 0;
    _this.typeIndex = null;
    _this.typeLoadedCount = 0;

    _this.typeOrder = [];
    _this.typeCount = [];
    _this.typeMap = {};
    _this.resourceMap = {};
    return _this;
  }

  _createClass(ResourceManager, [{
    key: 'addType',
    value: function addType(type, className) {
      if (type in this.typeMap) return;
      this.typeOrder.push(type);
      this.typeCount.push(0);
      this.typeMap[type] = className;
      this.resourceMap[type] = {};
    }
  }, {
    key: 'addResource',
    value: function addResource(type, id, data) {
      if (this.typeMap[type] == undefined) return;
      if (id in this.resourceMap[type]) return;
      var className = this.typeMap[type];
      var resource = new className(id, data);
      this.resourceMap[type][id] = resource;
      this.resourceCount += 1;

      for (var i = 0; i < this.typeOrder.length; i++) {
        if (type == this.typeOrder[i]) {
          this.typeCount[i] += 1;
          break;
        }
      }
    }
  }, {
    key: 'loadAll',
    value: function loadAll(progressCallback, completeCallback) {
      this.progressCallback = progressCallback;
      this.completeCallback = completeCallback;

      this.typeIndex = null;
      this.loadNextType();
    }
  }, {
    key: 'loadNextType',
    value: function loadNextType() {
      if (this.typeIndex == null) {
        this.typeIndex = 0;
      } else {
        this.typeIndex += 1;
      }

      if (this.typeIndex >= this.typeOrder.length) {
        Utils.Defer(this.completeCallback, this);
        return;
      }

      this.typeLoadedCount = 0;

      var type = this.typeOrder[this.typeIndex];
      var resources;
      var id;
      var count = 0;
      resources = this.resourceMap[type];

      for (id in resources) {
        this.loadResource(type, id);
        count++;
      }

      if (count == 0) {
        this.loadNextType();
      }
    }
  }, {
    key: 'loadResource',
    value: function loadResource(type, id) {
      var resource = this.resourceMap[type][id];
      if (resource.isLoaded()) {
        this.handleResourceLoaded();
      } else {
        resource.load(this, Utils.Bind(this.handleResourceLoaded, this));
      }
    }
  }, {
    key: 'handleResourceLoaded',
    value: function handleResourceLoaded() {
      this.typeLoadedCount += 1;
      var progress = Number(1 / this.resourceCount);
      this.progressCallback(progress);

      if (this.typeLoadedCount >= this.typeCount[this.typeIndex]) {
        Utils.Defer(this.loadNextType, this);
      }
    }
  }, {
    key: 'getResource',
    value: function getResource(type, id) {
      if (this.resourceMap[type] == undefined) return null;
      if (this.resourceMap[type][id] == undefined) return null;

      return this.resourceMap[type][id];
    }
  }]);

  return ResourceManager;
}(_Manager3.default
/** @lends resource.ResourceManager# */
);

ResourceManager.getInstance = function (key) {
  if (!_Manager3.default.hasCore(key)) {
    new ResourceManager(key);
  }
  var retVal = _Manager3.default.getInstance(key);
  return retVal;
};

exports.default = ResourceManager;

},{"minibot/core/Manager":2,"minibot/core/Utils":3}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Resource2 = require('minibot/resource/Resource');

var _Resource3 = _interopRequireDefault(_Resource2);

var _ImageResource = require('minibot/resource/ImageResource');

var _ImageResource2 = _interopRequireDefault(_ImageResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpriteResource = function (_Resource) {
  _inherits(SpriteResource, _Resource);

  /**
   * Description of constructor.
   * @class Short description of class.
   * Long Description of class.
   * @extends resource.Resource
   * @constructs
   * @param {String} id The id of the Resource.
   * @param {Object} data The data associated with the Resource.
   * @param
   */
  function SpriteResource(id, data) {
    _classCallCheck(this, SpriteResource);

    var _this = _possibleConstructorReturn(this, (SpriteResource.__proto__ || Object.getPrototypeOf(SpriteResource)).call(this, id));

    _this.imageId = null;
    _this.imageResource = null;
    _this.img = null;
    _this.x = 0;
    _this.y = 0;
    _this.w = -1;
    _this.h = -1;

    if (data != undefined) {
      if (data.image_id != undefined) _this.imageId = data.image_id;else if (data.imageId != undefined) _this.imageId = data.imageId;

      if (data.x != undefined) _this.x = data.x;
      if (data.y != undefined) _this.y = data.y;
      if (data.w != undefined) _this.w = data.w;
      if (data.h != undefined) _this.h = data.h;
    }
    return _this;
  }

  _createClass(SpriteResource, [{
    key: 'load',
    value: function load(manager, callback) {
      try {
        this.imageResource = manager.getResource(_ImageResource2.default.TYPE, this.imageId);

        this.img = this.imageResource.img;

        if (this.w == -1) this.w = this.img.width;
        if (this.h == -1) this.h = this.img.height;

        this.loaded = true;
      } catch (e) {
        console.log("ERROR");
      }

      callback();
    }
  }]);

  return SpriteResource;
}(_Resource3.default
/** @lends resource.SpriteResource# */
);

SpriteResource.TYPE = 2;

exports.default = SpriteResource;

},{"minibot/resource/ImageResource":43,"minibot/resource/Resource":44}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CanvasScene = require('minibot/display/html/CanvasScene');

var _CanvasScene2 = _interopRequireDefault(_CanvasScene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();

var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
var isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

function decorate(object, traits) {
  for (var accessor in traits) {
    object[accessor] = traits[accessor];
  }
  return object;
}

var system = {};

system.onUpdate = null;

system.onRender = null;

system.lastTime = null;

system.isRunning = false;

system.isRendering = false;

system.animationFrameId = null;

system.handleAnimationFrame = function (time) {
  if (!system.isRunning) return;
  if (system.isRendering) return;
  system.isRendering = true;
  system.animationFrameId = window.requestAnimationFrame(system.handleAnimationFrame.bind(this));
  var dt = 0;
  if (system.lastTime != null) dt = time - system.lastTime;
  if (system.onUpdate != null) system.onUpdate(dt);
  if (system.onRender != null) system.onRender(dt);
  system.lastTime = time;
  system.isRendering = false;
};

// --> Public System Methods

system.SetUpdateCallback = function (f) {
  system.onUpdate = f;
};

system.SetRenderCallback = function (f) {
  system.onRender = f;
};

system.Run = function () {
  // We can't run the system twice!
  if (system.isRunning) return;

  system.isRunning = true;
  system.animationFrameId = window.requestAnimationFrame(system.handleAnimationFrame.bind(system));
};

system.Stop = function () {
  // We can't stop the system if it isn't running
  if (!system.isRunning) return;

  window.cancelAnimationFrame(system.animationFrameId);
  system.isRunning = false;
};

system.CreateScene = function (options) {
  var scene = new _CanvasScene2.default(options);
  return scene;
};

// Browser | Native
system.GetWrapperType = function () {
  //
  return system.WrapperType.BROWSER;
};

// Safari | Firefox | Chrome | Explorer | Opera | Other
system.GetBrowserType = function () {
  //

};

// Desktop | Mobile
system.GetPlatformType = function () {
  if (isMobile) {
    return system.PlatformType.MOBILE;
  } else {
    return system.PlatformType.DESKTOP;
  }
};

// Desktop Values = OSX | Windows | Linux
// Mobile Values = iOS | Android
// Unknown Values = Other
system.GetPlatformName = function () {
  var name = system.PlatformName.OTHER;

  if (isMobile) {
    // Detect iOS
    if (/(ipad|iphone|ipod)/g.test(userAgent)) {
      name = system.PlatformName.IOS;
    } else if (/(android)/g.test(userAgent)) {
      name = system.PlatformName.ANDROID;
    }
  } else {}

  return name;
};

// <-- Public System Methods

system.WrapperType = {
  BROWSER: "Browser",
  NATIVE: "Native"
};

system.BrowserType = {
  SAFARI: "Safari",
  FIREFOX: "Firefox",
  CHROME: "Chrome",
  EXPLORER: "Explorer",
  OPERA: "Opera"
};

system.PlatformType = {
  DESKTOP: "Desktop",
  MOBILE: "Mobile"
};

system.PlatformName = {
  OSX: "OSX",
  WINDOWS: "Windows",
  LINUX: "Linux",
  ANDROID: "Android",
  IOS: "iOS",
  OTHER: "Other"
};

exports.default = system;

},{"minibot/display/html/CanvasScene":6}],"minibot":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseMinibot = require('base-minibot');

var _baseMinibot2 = _interopRequireDefault(_baseMinibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @namespace System namespace */
var system = require('minibot/system/browser').default;

exports.default = {
  core: _baseMinibot2.default.core,
  display: _baseMinibot2.default.display,
  engine: _baseMinibot2.default.engine,
  event: _baseMinibot2.default.event,
  geom: _baseMinibot2.default.geom,
  graphics: _baseMinibot2.default.graphics,
  network: _baseMinibot2.default.network,
  resource: _baseMinibot2.default.resource,
  system: system
};

},{"base-minibot":1,"minibot/system/browser":47}]},{},[]);
