require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  STARTUP: "Startup",
  UPDATE_PROGRESS: "UpdateProgress"
};

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ApplicationConstants = require('loader/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _ScriptsProxy = require('loader/model/ScriptsProxy');

var _ScriptsProxy2 = _interopRequireDefault(_ScriptsProxy);

var _StartupCommand = require('loader/controller/StartupCommand');

var _StartupCommand2 = _interopRequireDefault(_StartupCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApplicationFacade = function (_puremvc$Facade) {
  _inherits(ApplicationFacade, _puremvc$Facade);

  function ApplicationFacade(key) {
    _classCallCheck(this, ApplicationFacade);

    return _possibleConstructorReturn(this, (ApplicationFacade.__proto__ || Object.getPrototypeOf(ApplicationFacade)).call(this, key));
  }

  _createClass(ApplicationFacade, [{
    key: 'initializeController',
    value: function initializeController() {
      _get(ApplicationFacade.prototype.__proto__ || Object.getPrototypeOf(ApplicationFacade.prototype), 'initializeController', this).call(this);
      this.registerCommand(_ApplicationConstants2.default.STARTUP, _StartupCommand2.default);
    }
  }, {
    key: 'startup',
    value: function startup(viewComponent, head, scriptsArray, startupCallback) {
      var data = {};
      data.viewComponent = viewComponent;
      data.head = head;
      data.scriptsArray = scriptsArray;
      data.startupCallback = startupCallback;

      this.sendNotification(_ApplicationConstants2.default.STARTUP, data);
    }
  }, {
    key: 'loadScripts',
    value: function loadScripts(scriptsLoadedCallback) {
      var scriptsProxy = this.retrieveProxy(_ScriptsProxy2.default.NAME);
      scriptsProxy.loadScripts(scriptsLoadedCallback);
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress(progress) {
      this.sendNotification(_ApplicationConstants2.default.UPDATE_PROGRESS, { progress: progress });
    }
  }]);

  return ApplicationFacade;
}(_puremvc2.default.Facade);

ApplicationFacade.getInstance = function (key) {
  if (!_puremvc2.default.Facade.hasCore(key)) {
    new ApplicationFacade(key);
  }
  var retVal = _puremvc2.default.Facade.getInstance(key);
  return retVal;
};

ApplicationFacade.KEY = "Loader.Shell";

exports.default = ApplicationFacade;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"loader/ApplicationConstants":1,"loader/controller/StartupCommand":4,"loader/model/ScriptsProxy":6}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ScriptsProxy = require('loader/model/ScriptsProxy');

var _ScriptsProxy2 = _interopRequireDefault(_ScriptsProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModelPrepCommand = function (_puremvc$SimpleComman) {
  _inherits(ModelPrepCommand, _puremvc$SimpleComman);

  function ModelPrepCommand() {
    _classCallCheck(this, ModelPrepCommand);

    return _possibleConstructorReturn(this, (ModelPrepCommand.__proto__ || Object.getPrototypeOf(ModelPrepCommand)).apply(this, arguments));
  }

  _createClass(ModelPrepCommand, [{
    key: 'execute',
    value: function execute(notification) {
      var data = notification.getBody();

      var head = data.head;
      var scriptsArray = data.scriptsArray;

      // Load and initialize the data
      if (!this.facade.hasProxy(_ScriptsProxy2.default.NAME)) {
        var scriptsProxy = new _ScriptsProxy2.default(head, scriptsArray);
        this.facade.registerProxy(scriptsProxy);
      }
    }
  }]);

  return ModelPrepCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ModelPrepCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"loader/model/ScriptsProxy":6}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ModelPrepCommand = require('loader/controller/ModelPrepCommand');

var _ModelPrepCommand2 = _interopRequireDefault(_ModelPrepCommand);

var _ViewPrepCommand = require('loader/controller/ViewPrepCommand');

var _ViewPrepCommand2 = _interopRequireDefault(_ViewPrepCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StartupCommand = function (_puremvc$MacroCommand) {
  _inherits(StartupCommand, _puremvc$MacroCommand);

  function StartupCommand() {
    _classCallCheck(this, StartupCommand);

    return _possibleConstructorReturn(this, (StartupCommand.__proto__ || Object.getPrototypeOf(StartupCommand)).apply(this, arguments));
  }

  _createClass(StartupCommand, [{
    key: 'initializeMacroCommand',
    value: function initializeMacroCommand() {
      this.addSubCommand(_ModelPrepCommand2.default);
      this.addSubCommand(_ViewPrepCommand2.default);
    }
  }]);

  return StartupCommand;
}(_puremvc2.default.MacroCommand);

exports.default = StartupCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"loader/controller/ModelPrepCommand":3,"loader/controller/ViewPrepCommand":5}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _LoaderMediator = require('loader/view/LoaderMediator');

var _LoaderMediator2 = _interopRequireDefault(_LoaderMediator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewPrepCommand = function (_puremvc$SimpleComman) {
  _inherits(ViewPrepCommand, _puremvc$SimpleComman);

  function ViewPrepCommand() {
    _classCallCheck(this, ViewPrepCommand);

    return _possibleConstructorReturn(this, (ViewPrepCommand.__proto__ || Object.getPrototypeOf(ViewPrepCommand)).apply(this, arguments));
  }

  _createClass(ViewPrepCommand, [{
    key: 'execute',
    value: function execute(notification) {
      var data = notification.getBody();

      var viewComponent = data.viewComponent;
      var startupCallback = data.startupCallback;

      this.facade.registerMediator(new _LoaderMediator2.default(viewComponent));

      startupCallback();
    }
  }]);

  return ViewPrepCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ViewPrepCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"loader/view/LoaderMediator":7}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScriptsProxy = function (_puremvc$Proxy) {
  _inherits(ScriptsProxy, _puremvc$Proxy);

  // index: 0,
  // scriptsLoadedCallback: null,
  // head: null,

  function ScriptsProxy(head, scriptsArray, scriptsLoadedCallback) {
    _classCallCheck(this, ScriptsProxy);

    var _this = _possibleConstructorReturn(this, (ScriptsProxy.__proto__ || Object.getPrototypeOf(ScriptsProxy)).call(this, ScriptsProxy.NAME, scriptsArray));

    _this.head = head;
    _this.index = 0;
    _this.scriptsLoadedCallback = scriptsLoadedCallback;
    return _this;
  }

  _createClass(ScriptsProxy, [{
    key: 'loadScripts',
    value: function loadScripts(scriptsLoadedCallback) {
      this.scriptsLoadedCallback = scriptsLoadedCallback;
      this.loadScript();
    }
  }, {
    key: 'loadScript',
    value: function loadScript() {
      if (this.index >= this.data.length) {
        this.scriptsLoadedCallback();
        return;
      }

      var url = this.data[this.index];
      var script = new Element('script', {
        //     type: 'text/javascript',
        //     charset: 'utf-8',
        src: url
      });
      script.observe('load', this.onScriptLoadSuccess.bindAsEventListener(this));
      this.head.appendChild(script);
    }
  }, {
    key: 'onScriptLoadSuccess',
    value: function onScriptLoadSuccess() {
      this.index += 1;
      var progress = 0.25 / this.data.length;
      this.sendNotification(ApplicationConstants.UPDATE_PROGRESS, { progress: progress });

      this.loadScript();
    }
  }]);

  return ScriptsProxy;
}(_puremvc2.default.Proxy);

exports.default = ScriptsProxy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"minibot":"minibot"}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ApplicationConstants = require('loader/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoaderMediator = function (_puremvc$Mediator) {
  _inherits(LoaderMediator, _puremvc$Mediator);

  function LoaderMediator(viewComponent) {
    _classCallCheck(this, LoaderMediator);

    return _possibleConstructorReturn(this, (LoaderMediator.__proto__ || Object.getPrototypeOf(LoaderMediator)).call(this, LoaderMediator.NAME, viewComponent));
  }

  _createClass(LoaderMediator, [{
    key: 'listNotificationInterests',
    value: function listNotificationInterests() {
      return [_ApplicationConstants2.default.UPDATE_PROGRESS];
    }
  }, {
    key: 'handleNotification',
    value: function handleNotification(notification) {
      var name = notification.getName();
      var body = notification.getBody();
      switch (name) {
        case _ApplicationConstants2.default.UPDATE_PROGRESS:
          this.handleUpdateProgress(body);
      }
    }
  }, {
    key: 'handleUpdateProgress',
    value: function handleUpdateProgress(data) {
      this.viewComponent.update(data.progress);
    }
  }]);

  return LoaderMediator;
}(_puremvc2.default.Mediator);

exports.default = LoaderMediator;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"loader/ApplicationConstants":1}],"loader":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var loader = {};

loader.ApplicationFacade = require('loader/ApplicationFacade').default;

// Controller
loader.controller = {};
loader.controller.ModelPrepCommand = require('loader/controller/ModelPrepCommand').default;
loader.controller.StartupCommand = require('loader/controller/StartupCommand').default;
loader.controller.ViewPrepCommand = require('loader/controller/ViewPrepCommand').default;

// Models
loader.model = {};
loader.model.ScriptsProxy = require('loader/model/ScriptsProxy').default;

// Views
loader.view = {};
loader.view.LoaderMediator = require('loader/view/LoaderMediator').default;

exports.default = loader;

},{"loader/ApplicationFacade":2,"loader/controller/ModelPrepCommand":3,"loader/controller/StartupCommand":4,"loader/controller/ViewPrepCommand":5,"loader/model/ScriptsProxy":6,"loader/view/LoaderMediator":7}]},{},[]);
