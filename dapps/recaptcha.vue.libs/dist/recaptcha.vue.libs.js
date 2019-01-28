(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("dapp-browser"));
	else if(typeof define === 'function' && define.amd)
		define("recaptcha.vue.libs.js", ["dapp-browser"], factory);
	else if(typeof exports === 'object')
		exports["recaptcha.vue.libs.js"] = factory(require("dapp-browser"));
	else
		root["recaptcha.vue.libs.js"] = factory(root["dapp-browser"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_dapp_browser__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/vue-recaptcha/dist/vue-recaptcha.es.js":
/*!***************************************************************************************************************!*\
  !*** /Users/tschuck/projects/evan.network/ui/ui-vue-core/node_modules/vue-recaptcha/dist/vue-recaptcha.es.js ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar defer = function defer() {\n  var state = false; // Resolved or not\n  var callbacks = [];\n  var resolve = function resolve(val) {\n    if (state) {\n      return;\n    }\n\n    state = true;\n    for (var i = 0, len = callbacks.length; i < len; i++) {\n      callbacks[i](val);\n    }\n  };\n\n  var then = function then(cb) {\n    if (!state) {\n      callbacks.push(cb);\n      return;\n    }\n    cb();\n  };\n\n  var deferred = {\n    resolved: function resolved() {\n      return state;\n    },\n\n    resolve: resolve,\n    promise: {\n      then: then\n    }\n  };\n  return deferred;\n};\n\nfunction createRecaptcha() {\n  var deferred = defer();\n\n  return {\n    notify: function notify() {\n      deferred.resolve();\n    },\n    wait: function wait() {\n      return deferred.promise;\n    },\n    render: function render(ele, options, cb) {\n      this.wait().then(function () {\n        cb(window.grecaptcha.render(ele, options));\n      });\n    },\n    reset: function reset(widgetId) {\n      if (typeof widgetId === 'undefined') {\n        return;\n      }\n\n      this.assertLoaded();\n      this.wait().then(function () {\n        return window.grecaptcha.reset(widgetId);\n      });\n    },\n    execute: function execute(widgetId) {\n      if (typeof widgetId === 'undefined') {\n        return;\n      }\n\n      this.assertLoaded();\n      this.wait().then(function () {\n        return window.grecaptcha.execute(widgetId);\n      });\n    },\n    checkRecaptchaLoad: function checkRecaptchaLoad() {\n      if (window.hasOwnProperty('grecaptcha') && window.grecaptcha.hasOwnProperty('render')) {\n        this.notify();\n      }\n    },\n    assertLoaded: function assertLoaded() {\n      if (!deferred.resolved()) {\n        throw new Error('ReCAPTCHA has not been loaded');\n      }\n    }\n  };\n}\n\nvar recaptcha = createRecaptcha();\n\nif (typeof window !== 'undefined') {\n  window.vueRecaptchaApiLoaded = recaptcha.notify;\n}\n\nvar _extends = Object.assign || function (target) {\n  for (var i = 1; i < arguments.length; i++) {\n    var source = arguments[i];\n\n    for (var key in source) {\n      if (Object.prototype.hasOwnProperty.call(source, key)) {\n        target[key] = source[key];\n      }\n    }\n  }\n\n  return target;\n};\n\nvar VueRecaptcha = {\n  name: 'VueRecaptcha',\n  props: {\n    sitekey: {\n      type: String,\n      required: true\n    },\n    theme: {\n      type: String\n    },\n    badge: {\n      type: String\n    },\n    type: {\n      type: String\n    },\n    size: {\n      type: String\n    },\n    tabindex: {\n      type: String\n    }\n  },\n  mounted: function mounted() {\n    var _this = this;\n\n    recaptcha.checkRecaptchaLoad();\n    var opts = _extends({}, this.$props, {\n      callback: this.emitVerify,\n      'expired-callback': this.emitExpired\n    });\n    var container = this.$slots.default ? this.$el.children[0] : this.$el;\n    recaptcha.render(container, opts, function (id) {\n      _this.$widgetId = id;\n      _this.$emit('render', id);\n    });\n  },\n\n  methods: {\n    reset: function reset() {\n      recaptcha.reset(this.$widgetId);\n    },\n    execute: function execute() {\n      recaptcha.execute(this.$widgetId);\n    },\n    emitVerify: function emitVerify(response) {\n      this.$emit('verify', response);\n    },\n    emitExpired: function emitExpired() {\n      this.$emit('expired');\n    }\n  },\n  render: function render(h) {\n    return h('div', {}, this.$slots.default);\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (VueRecaptcha);\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWNhcHRjaGEudnVlLmxpYnMuanMvL1VzZXJzL3RzY2h1Y2svcHJvamVjdHMvZXZhbi5uZXR3b3JrL3VpL3VpLXZ1ZS1jb3JlL25vZGVfbW9kdWxlcy92dWUtcmVjYXB0Y2hhL2Rpc3QvdnVlLXJlY2FwdGNoYS5lcy5qcz9kZjdmIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEyQyxTQUFTO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTs7QUFFZSwyRUFBWSxFQUFDIiwiZmlsZSI6Ii4uLy4uL25vZGVfbW9kdWxlcy92dWUtcmVjYXB0Y2hhL2Rpc3QvdnVlLXJlY2FwdGNoYS5lcy5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBkZWZlciA9IGZ1bmN0aW9uIGRlZmVyKCkge1xuICB2YXIgc3RhdGUgPSBmYWxzZTsgLy8gUmVzb2x2ZWQgb3Igbm90XG4gIHZhciBjYWxsYmFja3MgPSBbXTtcbiAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiByZXNvbHZlKHZhbCkge1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0YXRlID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjYWxsYmFja3NbaV0odmFsKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHRoZW4gPSBmdW5jdGlvbiB0aGVuKGNiKSB7XG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgY2FsbGJhY2tzLnB1c2goY2IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYigpO1xuICB9O1xuXG4gIHZhciBkZWZlcnJlZCA9IHtcbiAgICByZXNvbHZlZDogZnVuY3Rpb24gcmVzb2x2ZWQoKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcblxuICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgcHJvbWlzZToge1xuICAgICAgdGhlbjogdGhlblxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGRlZmVycmVkO1xufTtcblxuZnVuY3Rpb24gY3JlYXRlUmVjYXB0Y2hhKCkge1xuICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuXG4gIHJldHVybiB7XG4gICAgbm90aWZ5OiBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgfSxcbiAgICB3YWl0OiBmdW5jdGlvbiB3YWl0KCkge1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihlbGUsIG9wdGlvbnMsIGNiKSB7XG4gICAgICB0aGlzLndhaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Iod2luZG93LmdyZWNhcHRjaGEucmVuZGVyKGVsZSwgb3B0aW9ucykpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQod2lkZ2V0SWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygd2lkZ2V0SWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hc3NlcnRMb2FkZWQoKTtcbiAgICAgIHRoaXMud2FpdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmdyZWNhcHRjaGEucmVzZXQod2lkZ2V0SWQpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBleGVjdXRlOiBmdW5jdGlvbiBleGVjdXRlKHdpZGdldElkKSB7XG4gICAgICBpZiAodHlwZW9mIHdpZGdldElkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXNzZXJ0TG9hZGVkKCk7XG4gICAgICB0aGlzLndhaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5ncmVjYXB0Y2hhLmV4ZWN1dGUod2lkZ2V0SWQpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBjaGVja1JlY2FwdGNoYUxvYWQ6IGZ1bmN0aW9uIGNoZWNrUmVjYXB0Y2hhTG9hZCgpIHtcbiAgICAgIGlmICh3aW5kb3cuaGFzT3duUHJvcGVydHkoJ2dyZWNhcHRjaGEnKSAmJiB3aW5kb3cuZ3JlY2FwdGNoYS5oYXNPd25Qcm9wZXJ0eSgncmVuZGVyJykpIHtcbiAgICAgICAgdGhpcy5ub3RpZnkoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzc2VydExvYWRlZDogZnVuY3Rpb24gYXNzZXJ0TG9hZGVkKCkge1xuICAgICAgaWYgKCFkZWZlcnJlZC5yZXNvbHZlZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmVDQVBUQ0hBIGhhcyBub3QgYmVlbiBsb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbnZhciByZWNhcHRjaGEgPSBjcmVhdGVSZWNhcHRjaGEoKTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy52dWVSZWNhcHRjaGFBcGlMb2FkZWQgPSByZWNhcHRjaGEubm90aWZ5O1xufVxuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxudmFyIFZ1ZVJlY2FwdGNoYSA9IHtcbiAgbmFtZTogJ1Z1ZVJlY2FwdGNoYScsXG4gIHByb3BzOiB7XG4gICAgc2l0ZWtleToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICB9LFxuICAgIHRoZW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIGJhZGdlOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgc2l6ZToge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfSxcbiAgICB0YWJpbmRleDoge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICByZWNhcHRjaGEuY2hlY2tSZWNhcHRjaGFMb2FkKCk7XG4gICAgdmFyIG9wdHMgPSBfZXh0ZW5kcyh7fSwgdGhpcy4kcHJvcHMsIHtcbiAgICAgIGNhbGxiYWNrOiB0aGlzLmVtaXRWZXJpZnksXG4gICAgICAnZXhwaXJlZC1jYWxsYmFjayc6IHRoaXMuZW1pdEV4cGlyZWRcbiAgICB9KTtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy4kc2xvdHMuZGVmYXVsdCA/IHRoaXMuJGVsLmNoaWxkcmVuWzBdIDogdGhpcy4kZWw7XG4gICAgcmVjYXB0Y2hhLnJlbmRlcihjb250YWluZXIsIG9wdHMsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgX3RoaXMuJHdpZGdldElkID0gaWQ7XG4gICAgICBfdGhpcy4kZW1pdCgncmVuZGVyJywgaWQpO1xuICAgIH0pO1xuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICByZWNhcHRjaGEucmVzZXQodGhpcy4kd2lkZ2V0SWQpO1xuICAgIH0sXG4gICAgZXhlY3V0ZTogZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgICAgIHJlY2FwdGNoYS5leGVjdXRlKHRoaXMuJHdpZGdldElkKTtcbiAgICB9LFxuICAgIGVtaXRWZXJpZnk6IGZ1bmN0aW9uIGVtaXRWZXJpZnkocmVzcG9uc2UpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ3ZlcmlmeScsIHJlc3BvbnNlKTtcbiAgICB9LFxuICAgIGVtaXRFeHBpcmVkOiBmdW5jdGlvbiBlbWl0RXhwaXJlZCgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2V4cGlyZWQnKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgpIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge30sIHRoaXMuJHNsb3RzLmRlZmF1bHQpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBWdWVSZWNhcHRjaGE7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../../node_modules/vue-recaptcha/dist/vue-recaptcha.es.js\n");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dapp_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dapp-browser */ \"dapp-browser\");\n/* harmony import */ var dapp_browser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dapp_browser__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var vue_recaptcha__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-recaptcha */ \"../../node_modules/vue-recaptcha/dist/vue-recaptcha.es.js\");\n/*\n  Copyright (C) 2018-present evan GmbH.\n\n  This program is free software: you can redistribute it and/or modify it\n  under the terms of the GNU Affero General Public License, version 3,\n  as published by the Free Software Foundation.\n\n  This program is distributed in the hope that it will be useful,\n  but WITHOUT ANY WARRANTY; without even the implied warranty of\n  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n  See the GNU Affero General Public License for more details.\n\n  You should have received a copy of the GNU Affero General Public License\n  along with this program. If not, see http://www.gnu.org/licenses/ or\n  write to the Free Software Foundation, Inc., 51 Franklin Street,\n  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from\n  the following URL: https://evan.network/license/\n\n  You can be released from the requirements of the GNU Affero General Public\n  License by purchasing a commercial license.\n  Buying such a license is mandatory as soon as you use this software or parts\n  of it on other blockchains than evan.network.\n\n  For more information, please contact evan GmbH at this address:\n  https://evan.network/license/\n*/\n// map the original vue path to recaptcha.vue.libs\n\ndapp_browser__WEBPACK_IMPORTED_MODULE_0__[\"System\"].map['vue-recaptcha'] = \"recaptcha.vue.libs.\" + Object(dapp_browser__WEBPACK_IMPORTED_MODULE_0__[\"getDomainName\"])() + \"!dapp-content\";\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (vue_recaptcha__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWNhcHRjaGEudnVlLmxpYnMuanMvLi9zcmMvaW5kZXgudHM/ZmZiNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBeUJFO0FBQ0Ysa0RBQWtEO0FBQ0c7QUFDckQsbURBQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsd0JBQXVCLGtFQUFhLEVBQUUsa0JBQWdCLENBQUM7QUFFNUM7QUFDMUIsb0hBQVksRUFBQyIsImZpbGUiOiIuL3NyYy9pbmRleC50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIENvcHlyaWdodCAoQykgMjAxOC1wcmVzZW50IGV2YW4gR21iSC5cblxuICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdFxuICB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSwgdmVyc2lvbiAzLFxuICBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cblxuICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLlxuICBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gSWYgbm90LCBzZWUgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLyBvclxuICB3cml0ZSB0byB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBJbmMuLCA1MSBGcmFua2xpbiBTdHJlZXQsXG4gIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BLCAwMjExMC0xMzAxIFVTQSwgb3IgZG93bmxvYWQgdGhlIGxpY2Vuc2UgZnJvbVxuICB0aGUgZm9sbG93aW5nIFVSTDogaHR0cHM6Ly9ldmFuLm5ldHdvcmsvbGljZW5zZS9cblxuICBZb3UgY2FuIGJlIHJlbGVhc2VkIGZyb20gdGhlIHJlcXVpcmVtZW50cyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpY1xuICBMaWNlbnNlIGJ5IHB1cmNoYXNpbmcgYSBjb21tZXJjaWFsIGxpY2Vuc2UuXG4gIEJ1eWluZyBzdWNoIGEgbGljZW5zZSBpcyBtYW5kYXRvcnkgYXMgc29vbiBhcyB5b3UgdXNlIHRoaXMgc29mdHdhcmUgb3IgcGFydHNcbiAgb2YgaXQgb24gb3RoZXIgYmxvY2tjaGFpbnMgdGhhbiBldmFuLm5ldHdvcmsuXG5cbiAgRm9yIG1vcmUgaW5mb3JtYXRpb24sIHBsZWFzZSBjb250YWN0IGV2YW4gR21iSCBhdCB0aGlzIGFkZHJlc3M6XG4gIGh0dHBzOi8vZXZhbi5uZXR3b3JrL2xpY2Vuc2UvXG4qL1xuLy8gbWFwIHRoZSBvcmlnaW5hbCB2dWUgcGF0aCB0byByZWNhcHRjaGEudnVlLmxpYnNcbmltcG9ydCB7IFN5c3RlbSwgZ2V0RG9tYWluTmFtZSB9IGZyb20gJ2RhcHAtYnJvd3Nlcic7XG5TeXN0ZW0ubWFwWyd2dWUtcmVjYXB0Y2hhJ10gPSBgcmVjYXB0Y2hhLnZ1ZS5saWJzLiR7IGdldERvbWFpbk5hbWUoKSB9IWRhcHAtY29udGVudGA7XG5cbmltcG9ydCBWdWVSZWNhcHRjaGEgZnJvbSAndnVlLXJlY2FwdGNoYSc7XG5leHBvcnQgZGVmYXVsdCBWdWVSZWNhcHRjaGE7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/index.ts\n");

/***/ }),

/***/ "dapp-browser":
/*!*******************************!*\
  !*** external "dapp-browser" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_dapp_browser__;\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWNhcHRjaGEudnVlLmxpYnMuanMvZXh0ZXJuYWwgXCJkYXBwLWJyb3dzZXJcIj80ZGM4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImRhcHAtYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9kYXBwX2Jyb3dzZXJfXzsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///dapp-browser\n");

/***/ })

/******/ });
});