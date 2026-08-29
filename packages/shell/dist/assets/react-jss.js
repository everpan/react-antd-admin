import React, { createContext } from "react";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/extends.js
var require_extends = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _extends() {
		return module.exports = _extends = Object.assign ? Object.assign.bind() : function(n) {
			for (var e = 1; e < arguments.length; e++) {
				var t = arguments[e];
				for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
			}
			return n;
		}, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends.apply(null, arguments);
	}
	module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js
var require_objectWithoutPropertiesLoose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _objectWithoutPropertiesLoose(r, e) {
		if (null == r) return {};
		var t = {};
		for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
			if (-1 !== e.indexOf(n)) continue;
			t[n] = r[n];
		}
		return t;
	}
	module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
}));
//#endregion
//#region ../../node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/cjs/react-is.production.min.js
/** @license React v16.13.1
* react-is.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var b = "function" === typeof Symbol && Symbol.for;
	var c = b ? Symbol.for("react.element") : 60103;
	var d = b ? Symbol.for("react.portal") : 60106;
	var e = b ? Symbol.for("react.fragment") : 60107;
	var f = b ? Symbol.for("react.strict_mode") : 60108;
	var g = b ? Symbol.for("react.profiler") : 60114;
	var h = b ? Symbol.for("react.provider") : 60109;
	var k = b ? Symbol.for("react.context") : 60110;
	var l = b ? Symbol.for("react.async_mode") : 60111;
	var m = b ? Symbol.for("react.concurrent_mode") : 60111;
	var n = b ? Symbol.for("react.forward_ref") : 60112;
	var p = b ? Symbol.for("react.suspense") : 60113;
	var q = b ? Symbol.for("react.suspense_list") : 60120;
	var r = b ? Symbol.for("react.memo") : 60115;
	var t = b ? Symbol.for("react.lazy") : 60116;
	var v = b ? Symbol.for("react.block") : 60121;
	var w = b ? Symbol.for("react.fundamental") : 60117;
	var x = b ? Symbol.for("react.responder") : 60118;
	var y = b ? Symbol.for("react.scope") : 60119;
	function z(a) {
		if ("object" === typeof a && null !== a) {
			var u = a.$$typeof;
			switch (u) {
				case c: switch (a = a.type, a) {
					case l:
					case m:
					case e:
					case g:
					case f:
					case p: return a;
					default: switch (a = a && a.$$typeof, a) {
						case k:
						case n:
						case t:
						case r:
						case h: return a;
						default: return u;
					}
				}
				case d: return u;
			}
		}
	}
	function A(a) {
		return z(a) === m;
	}
	exports.AsyncMode = l;
	exports.ConcurrentMode = m;
	exports.ContextConsumer = k;
	exports.ContextProvider = h;
	exports.Element = c;
	exports.ForwardRef = n;
	exports.Fragment = e;
	exports.Lazy = t;
	exports.Memo = r;
	exports.Portal = d;
	exports.Profiler = g;
	exports.StrictMode = f;
	exports.Suspense = p;
	exports.isAsyncMode = function(a) {
		return A(a) || z(a) === l;
	};
	exports.isConcurrentMode = A;
	exports.isContextConsumer = function(a) {
		return z(a) === k;
	};
	exports.isContextProvider = function(a) {
		return z(a) === h;
	};
	exports.isElement = function(a) {
		return "object" === typeof a && null !== a && a.$$typeof === c;
	};
	exports.isForwardRef = function(a) {
		return z(a) === n;
	};
	exports.isFragment = function(a) {
		return z(a) === e;
	};
	exports.isLazy = function(a) {
		return z(a) === t;
	};
	exports.isMemo = function(a) {
		return z(a) === r;
	};
	exports.isPortal = function(a) {
		return z(a) === d;
	};
	exports.isProfiler = function(a) {
		return z(a) === g;
	};
	exports.isStrictMode = function(a) {
		return z(a) === f;
	};
	exports.isSuspense = function(a) {
		return z(a) === p;
	};
	exports.isValidElementType = function(a) {
		return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
	};
	exports.typeOf = z;
}));
//#endregion
//#region ../../node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/index.js
var require_react_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_production_min();
}));
//#endregion
//#region ../../node_modules/.pnpm/hoist-non-react-statics@3.3.2/node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var require_hoist_non_react_statics_cjs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reactIs = require_react_is();
	/**
	* Copyright 2015, Yahoo! Inc.
	* Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	*/
	var REACT_STATICS = {
		childContextTypes: true,
		contextType: true,
		contextTypes: true,
		defaultProps: true,
		displayName: true,
		getDefaultProps: true,
		getDerivedStateFromError: true,
		getDerivedStateFromProps: true,
		mixins: true,
		propTypes: true,
		type: true
	};
	var KNOWN_STATICS = {
		name: true,
		length: true,
		prototype: true,
		caller: true,
		callee: true,
		arguments: true,
		arity: true
	};
	var FORWARD_REF_STATICS = {
		"$$typeof": true,
		render: true,
		defaultProps: true,
		displayName: true,
		propTypes: true
	};
	var MEMO_STATICS = {
		"$$typeof": true,
		compare: true,
		defaultProps: true,
		displayName: true,
		propTypes: true,
		type: true
	};
	var TYPE_STATICS = {};
	TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
	TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
	function getStatics(component) {
		if (reactIs.isMemo(component)) return MEMO_STATICS;
		return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
	}
	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = Object.prototype;
	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
		if (typeof sourceComponent !== "string") {
			if (objectPrototype) {
				var inheritedComponent = getPrototypeOf(sourceComponent);
				if (inheritedComponent && inheritedComponent !== objectPrototype) hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
			}
			var keys = getOwnPropertyNames(sourceComponent);
			if (getOwnPropertySymbols) keys = keys.concat(getOwnPropertySymbols(sourceComponent));
			var targetStatics = getStatics(targetComponent);
			var sourceStatics = getStatics(sourceComponent);
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
					var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
					try {
						defineProperty(targetComponent, key, descriptor);
					} catch (e) {}
				}
			}
		}
		return targetComponent;
	}
	module.exports = hoistNonReactStatics;
}));
var init_tiny_warning_esm = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/react-display-name@0.2.5/node_modules/react-display-name/lib/getDisplayName.js
var require_getDisplayName = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/theming@3.3.0_react@19.2.8/node_modules/theming/dist/theming.esm.js
var theming_esm_exports = /* @__PURE__ */ __exportAll({
	ThemeContext: () => ThemeContext,
	ThemeProvider: () => ThemeProvider,
	createTheming: () => createTheming,
	useTheme: () => useTheme,
	withTheme: () => withTheme
});
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _extends$1() {
	_extends$1 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function _inheritsLoose$1(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
	subClass.__proto__ = superClass;
}
function _assertThisInitialized$1(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function createThemeProvider(context) {
	return /* @__PURE__ */ function(_React$Component) {
		_inheritsLoose$1(ThemeProvider, _React$Component);
		function ThemeProvider() {
			var _this;
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			_this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
			_defineProperty(_assertThisInitialized$1(_assertThisInitialized$1(_this)), "cachedTheme", void 0);
			_defineProperty(_assertThisInitialized$1(_assertThisInitialized$1(_this)), "lastOuterTheme", void 0);
			_defineProperty(_assertThisInitialized$1(_assertThisInitialized$1(_this)), "lastTheme", void 0);
			_defineProperty(_assertThisInitialized$1(_assertThisInitialized$1(_this)), "renderProvider", function(outerTheme) {
				var children = _this.props.children;
				return React.createElement(context.Provider, { value: _this.getTheme(outerTheme) }, children);
			});
			return _this;
		}
		var _proto = ThemeProvider.prototype;
		_proto.getTheme = function getTheme(outerTheme) {
			if (this.props.theme !== this.lastTheme || outerTheme !== this.lastOuterTheme || !this.cachedTheme) {
				this.lastOuterTheme = outerTheme;
				this.lastTheme = this.props.theme;
				if (typeof this.lastTheme === "function") {
					var theme = this.props.theme;
					this.cachedTheme = theme(outerTheme);
				} else {
					var _theme = this.props.theme;
					this.cachedTheme = outerTheme ? _extends$1({}, outerTheme, _theme) : _theme;
				}
			}
			return this.cachedTheme;
		};
		_proto.render = function render() {
			if (!this.props.children) return null;
			return React.createElement(context.Consumer, null, this.renderProvider);
		};
		return ThemeProvider;
	}(React.Component);
}
function createWithTheme(context) {
	return function hoc(Component) {
		var withTheme = React.forwardRef(function(props, ref) {
			return React.createElement(context.Consumer, null, function(theme) {
				return React.createElement(Component, _extends$1({
					theme,
					ref
				}, props));
			});
		});
		(0, import_hoist_non_react_statics_cjs.default)(withTheme, Component);
		return withTheme;
	};
}
function createUseTheme(context) {
	return function useTheme() {
		return React.useContext(context);
	};
}
function createTheming(context) {
	return {
		context,
		withTheme: createWithTheme(context),
		useTheme: createUseTheme(context),
		ThemeProvider: createThemeProvider(context)
	};
}
var import_hoist_non_react_statics_cjs, ThemeContext, _createTheming, withTheme, ThemeProvider, useTheme;
var init_theming_esm = __esmMin((() => {
	import_hoist_non_react_statics_cjs = /* @__PURE__ */ __toESM(require_hoist_non_react_statics_cjs());
	require_getDisplayName();
	ThemeContext = createContext();
	_createTheming = createTheming(ThemeContext);
	withTheme = _createTheming.withTheme;
	ThemeProvider = _createTheming.ThemeProvider;
	useTheme = _createTheming.useTheme;
}));
//#endregion
//#region ../../node_modules/.pnpm/is-in-browser@1.1.3/node_modules/is-in-browser/dist/module.js
var module_exports = /* @__PURE__ */ __exportAll({
	default: () => isBrowser,
	isBrowser: () => isBrowser
});
var _typeof$1, isBrowser;
var init_module = __esmMin((() => {
	_typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
		return typeof obj;
	} : function(obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
	isBrowser = (typeof window === "undefined" ? "undefined" : _typeof$1(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof$1(document)) === "object" && document.nodeType === 9;
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
var init_extends = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
var init_typeof = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var init_toPrimitive = __esmMin((() => {
	init_typeof();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
var init_toPropertyKey = __esmMin((() => {
	init_typeof();
	init_toPrimitive();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(e, r) {
	for (var t = 0; t < r.length; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
	}
}
function _createClass(e, r, t) {
	return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
var init_createClass = __esmMin((() => {
	init_toPropertyKey();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf(t, e);
}
var init_setPrototypeOf = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
function _inheritsLoose(t, o) {
	t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
var init_inheritsLoose = __esmMin((() => {
	init_setPrototypeOf();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
var init_assertThisInitialized = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
var init_objectWithoutPropertiesLoose = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/jss@10.10.0/node_modules/jss/dist/jss.esm.js
var jss_esm_exports = /* @__PURE__ */ __exportAll({
	RuleList: () => RuleList,
	SheetsManager: () => SheetsManager,
	SheetsRegistry: () => SheetsRegistry,
	create: () => createJss,
	createGenerateId: () => createGenerateId,
	createRule: () => createRule,
	default: () => index$1,
	getDynamicStyles: () => getDynamicStyles,
	hasCSSTOMSupport: () => hasCSSTOMSupport,
	sheets: () => sheets,
	toCssValue: () => toCssValue
});
function cloneStyle(style) {
	if (style == null || typeof style !== "object") return style;
	if (Array.isArray(style)) return style.map(cloneStyle);
	if (style.constructor !== plainObjectConstrurctor) return style;
	var newStyle = {};
	for (var name in style) newStyle[name] = cloneStyle(style[name]);
	return newStyle;
}
/**
* Create a rule instance.
*/
function createRule(name, decl, options) {
	if (name === void 0) name = "unnamed";
	var jss = options.jss;
	var declCopy = cloneStyle(decl);
	var rule = jss.plugins.onCreateRule(name, declCopy, options);
	if (rule) return rule;
	if (name[0] === "@") {}
	return null;
}
function getWhitespaceSymbols(options) {
	if (options && options.format === false) return {
		linebreak: "",
		space: ""
	};
	return {
		linebreak: "\n",
		space: " "
	};
}
/**
* Indent a string.
* http://jsperf.com/array-join-vs-for
*/
function indentStr(str, indent) {
	var result = "";
	for (var index = 0; index < indent; index++) result += "  ";
	return result + str;
}
/**
* Converts a Rule to CSS string.
*/
function toCss(selector, style, options) {
	if (options === void 0) options = {};
	var result = "";
	if (!style) return result;
	var _options$indent = options.indent, indent = _options$indent === void 0 ? 0 : _options$indent;
	var fallbacks = style.fallbacks;
	if (options.format === false) indent = -Infinity;
	var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.linebreak, space = _getWhitespaceSymbols.space;
	if (selector) indent++;
	if (fallbacks) {
		if (Array.isArray(fallbacks)) for (var index = 0; index < fallbacks.length; index++) {
			var fallback = fallbacks[index];
			for (var prop in fallback) {
				var value = fallback[prop];
				if (value != null) {
					if (result) result += linebreak;
					result += indentStr(prop + ":" + space + toCssValue(value) + ";", indent);
				}
			}
		}
		else for (var _prop in fallbacks) {
			var _value = fallbacks[_prop];
			if (_value != null) {
				if (result) result += linebreak;
				result += indentStr(_prop + ":" + space + toCssValue(_value) + ";", indent);
			}
		}
	}
	for (var _prop2 in style) {
		var _value2 = style[_prop2];
		if (_value2 != null && _prop2 !== "fallbacks") {
			if (result) result += linebreak;
			result += indentStr(_prop2 + ":" + space + toCssValue(_value2) + ";", indent);
		}
	}
	if (!result && !options.allowEmpty) return result;
	if (!selector) return result;
	indent--;
	if (result) result = "" + linebreak + result + linebreak;
	return indentStr("" + selector + space + "{" + result, indent) + indentStr("}", indent);
}
/**
* Find attached sheet with an index higher than the passed one.
*/
function findHigherSheet(registry, options) {
	for (var i = 0; i < registry.length; i++) {
		var sheet = registry[i];
		if (sheet.attached && sheet.options.index > options.index && sheet.options.insertionPoint === options.insertionPoint) return sheet;
	}
	return null;
}
/**
* Find attached sheet with the highest index.
*/
function findHighestSheet(registry, options) {
	for (var i = registry.length - 1; i >= 0; i--) {
		var sheet = registry[i];
		if (sheet.attached && sheet.options.insertionPoint === options.insertionPoint) return sheet;
	}
	return null;
}
/**
* Find a comment with "jss" inside.
*/
function findCommentNode(text) {
	var head = getHead();
	for (var i = 0; i < head.childNodes.length; i++) {
		var node = head.childNodes[i];
		if (node.nodeType === 8 && node.nodeValue.trim() === text) return node;
	}
	return null;
}
/**
* Find a node before which we can insert the sheet.
*/
function findPrevNode(options) {
	var registry = sheets.registry;
	if (registry.length > 0) {
		var sheet = findHigherSheet(registry, options);
		if (sheet && sheet.renderer) return {
			parent: sheet.renderer.element.parentNode,
			node: sheet.renderer.element
		};
		sheet = findHighestSheet(registry, options);
		if (sheet && sheet.renderer) return {
			parent: sheet.renderer.element.parentNode,
			node: sheet.renderer.element.nextSibling
		};
	}
	var insertionPoint = options.insertionPoint;
	if (insertionPoint && typeof insertionPoint === "string") {
		var comment = findCommentNode(insertionPoint);
		if (comment) return {
			parent: comment.parentNode,
			node: comment.nextSibling
		};
	}
	return false;
}
/**
* Insert style element into the DOM.
*/
function insertStyle(style, options) {
	var insertionPoint = options.insertionPoint;
	var nextNode = findPrevNode(options);
	if (nextNode !== false && nextNode.parent) {
		nextNode.parent.insertBefore(style, nextNode.node);
		return;
	}
	if (insertionPoint && typeof insertionPoint.nodeType === "number") {
		var insertionPointElement = insertionPoint;
		var parentNode = insertionPointElement.parentNode;
		if (parentNode) parentNode.insertBefore(style, insertionPointElement.nextSibling);
		return;
	}
	getHead().appendChild(style);
}
/**
* Extracts a styles object with only props that contain function values.
*/
function getDynamicStyles(styles) {
	var to = null;
	for (var key in styles) {
		var value = styles[key];
		var type = typeof value;
		if (type === "function") {
			if (!to) to = {};
			to[key] = value;
		} else if (type === "object" && value !== null && !Array.isArray(value)) {
			var extracted = getDynamicStyles(value);
			if (extracted) {
				if (!to) to = {};
				to[key] = extracted;
			}
		}
	}
	return to;
}
var plainObjectConstrurctor, join, toCssValue, escapeRegex, nativeEscape, escape, BaseStyleRule, StyleRule, pluginStyleRule, defaultToStringOptions, atRegExp, ConditionalRule, keyRegExp, pluginConditionalRule, defaultToStringOptions$1, nameRegExp, KeyframesRule, keyRegExp$1, refRegExp$1, findReferencedKeyframe, replaceRef, pluginKeyframesRule, KeyframeRule, pluginKeyframeRule, FontFaceRule, keyRegExp$2, pluginFontFaceRule, ViewportRule, pluginViewportRule, SimpleRule, keysMap, plugins$1, defaultUpdateOptions, forceUpdateOptions, RuleList, StyleSheet, PluginsRegistry, SheetsRegistry, sheets, globalThis$1, ns, moduleId, maxRules, createGenerateId, memoize$1, getPropertyValue, setProperty, removeProperty, setSelector, getHead, getNonce, _insertRule, getValidRuleInsertionIndex, createStyle, DomRenderer, instanceCounter, Jss, createJss, SheetsManager, hasCSSTOMSupport, index$1;
var init_jss_esm = __esmMin((() => {
	init_extends();
	init_module();
	init_tiny_warning_esm();
	init_createClass();
	init_inheritsLoose();
	init_assertThisInitialized();
	init_objectWithoutPropertiesLoose();
	plainObjectConstrurctor = {}.constructor;
	join = function join(value, by) {
		var result = "";
		for (var i = 0; i < value.length; i++) {
			if (value[i] === "!important") break;
			if (result) result += by;
			result += value[i];
		}
		return result;
	};
	toCssValue = function toCssValue(value) {
		if (!Array.isArray(value)) return value;
		var cssValue = "";
		if (Array.isArray(value[0])) for (var i = 0; i < value.length; i++) {
			if (value[i] === "!important") break;
			if (cssValue) cssValue += ", ";
			cssValue += join(value[i], " ");
		}
		else cssValue = join(value, ", ");
		if (value[value.length - 1] === "!important") cssValue += " !important";
		return cssValue;
	};
	escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g;
	nativeEscape = typeof CSS !== "undefined" && CSS.escape;
	escape = (function(str) {
		return nativeEscape ? nativeEscape(str) : str.replace(escapeRegex, "\\$1");
	});
	BaseStyleRule = /*#__PURE__*/ function() {
		function BaseStyleRule(key, style, options) {
			this.type = "style";
			this.isProcessed = false;
			var sheet = options.sheet, Renderer = options.Renderer;
			this.key = key;
			this.options = options;
			this.style = style;
			if (sheet) this.renderer = sheet.renderer;
			else if (Renderer) this.renderer = new Renderer();
		}
		/**
		* Get or set a style property.
		*/
		var _proto = BaseStyleRule.prototype;
		_proto.prop = function prop(name, value, options) {
			if (value === void 0) return this.style[name];
			var force = options ? options.force : false;
			if (!force && this.style[name] === value) return this;
			var newValue = value;
			if (!options || options.process !== false) newValue = this.options.jss.plugins.onChangeValue(value, name, this);
			var isEmpty = newValue == null || newValue === false;
			var isDefined = name in this.style;
			if (isEmpty && !isDefined && !force) return this;
			var remove = isEmpty && isDefined;
			if (remove) delete this.style[name];
			else this.style[name] = newValue;
			if (this.renderable && this.renderer) {
				if (remove) this.renderer.removeProperty(this.renderable, name);
				else this.renderer.setProperty(this.renderable, name, newValue);
				return this;
			}
			var sheet = this.options.sheet;
			if (sheet && sheet.attached) {}
			return this;
		};
		return BaseStyleRule;
	}();
	StyleRule = /*#__PURE__*/ function(_BaseStyleRule) {
		_inheritsLoose(StyleRule, _BaseStyleRule);
		function StyleRule(key, style, options) {
			var _this = _BaseStyleRule.call(this, key, style, options) || this;
			var selector = options.selector, scoped = options.scoped, sheet = options.sheet, generateId = options.generateId;
			if (selector) _this.selectorText = selector;
			else if (scoped !== false) {
				_this.id = generateId(_assertThisInitialized(_assertThisInitialized(_this)), sheet);
				_this.selectorText = "." + escape(_this.id);
			}
			return _this;
		}
		/**
		* Set selector string.
		* Attention: use this with caution. Most browsers didn't implement
		* selectorText setter, so this may result in rerendering of entire Style Sheet.
		*/
		var _proto2 = StyleRule.prototype;
		/**
		* Apply rule to an element inline.
		*/
		_proto2.applyTo = function applyTo(renderable) {
			var renderer = this.renderer;
			if (renderer) {
				var json = this.toJSON();
				for (var prop in json) renderer.setProperty(renderable, prop, json[prop]);
			}
			return this;
		};
		_proto2.toJSON = function toJSON() {
			var json = {};
			for (var prop in this.style) {
				var value = this.style[prop];
				if (typeof value !== "object") json[prop] = value;
				else if (Array.isArray(value)) json[prop] = toCssValue(value);
			}
			return json;
		};
		_proto2.toString = function toString(options) {
			var sheet = this.options.sheet;
			var opts = (sheet ? sheet.options.link : false) ? _extends({}, options, { allowEmpty: true }) : options;
			return toCss(this.selectorText, this.style, opts);
		};
		_createClass(StyleRule, [{
			key: "selector",
			set: function set(selector) {
				if (selector === this.selectorText) return;
				this.selectorText = selector;
				var renderer = this.renderer, renderable = this.renderable;
				if (!renderable || !renderer) return;
				if (!renderer.setSelector(renderable, selector)) renderer.replaceRule(renderable, this);
			},
			get: function get() {
				return this.selectorText;
			}
		}]);
		return StyleRule;
	}(BaseStyleRule);
	pluginStyleRule = { onCreateRule: function onCreateRule(key, style, options) {
		if (key[0] === "@" || options.parent && options.parent.type === "keyframes") return null;
		return new StyleRule(key, style, options);
	} };
	defaultToStringOptions = {
		indent: 1,
		children: true
	};
	atRegExp = /@([\w-]+)/;
	ConditionalRule = /*#__PURE__*/ function() {
		function ConditionalRule(key, styles, options) {
			this.type = "conditional";
			this.isProcessed = false;
			this.key = key;
			var atMatch = key.match(atRegExp);
			this.at = atMatch ? atMatch[1] : "unknown";
			this.query = options.name || "@" + this.at;
			this.options = options;
			this.rules = new RuleList(_extends({}, options, { parent: this }));
			for (var name in styles) this.rules.add(name, styles[name]);
			this.rules.process();
		}
		/**
		* Get a rule.
		*/
		var _proto = ConditionalRule.prototype;
		_proto.getRule = function getRule(name) {
			return this.rules.get(name);
		};
		_proto.indexOf = function indexOf(rule) {
			return this.rules.indexOf(rule);
		};
		_proto.addRule = function addRule(name, style, options) {
			var rule = this.rules.add(name, style, options);
			if (!rule) return null;
			this.options.jss.plugins.onProcessRule(rule);
			return rule;
		};
		_proto.replaceRule = function replaceRule(name, style, options) {
			var newRule = this.rules.replace(name, style, options);
			if (newRule) this.options.jss.plugins.onProcessRule(newRule);
			return newRule;
		};
		_proto.toString = function toString(options) {
			if (options === void 0) options = defaultToStringOptions;
			var linebreak = getWhitespaceSymbols(options).linebreak;
			if (options.indent == null) options.indent = defaultToStringOptions.indent;
			if (options.children == null) options.children = defaultToStringOptions.children;
			if (options.children === false) return this.query + " {}";
			var children = this.rules.toString(options);
			return children ? this.query + " {" + linebreak + children + linebreak + "}" : "";
		};
		return ConditionalRule;
	}();
	keyRegExp = /@container|@media|@supports\s+/;
	pluginConditionalRule = { onCreateRule: function onCreateRule(key, styles, options) {
		return keyRegExp.test(key) ? new ConditionalRule(key, styles, options) : null;
	} };
	defaultToStringOptions$1 = {
		indent: 1,
		children: true
	};
	nameRegExp = /@keyframes\s+([\w-]+)/;
	KeyframesRule = /*#__PURE__*/ function() {
		function KeyframesRule(key, frames, options) {
			this.type = "keyframes";
			this.at = "@keyframes";
			this.isProcessed = false;
			var nameMatch = key.match(nameRegExp);
			if (nameMatch && nameMatch[1]) this.name = nameMatch[1];
			else this.name = "noname";
			this.key = this.type + "-" + this.name;
			this.options = options;
			var scoped = options.scoped, sheet = options.sheet, generateId = options.generateId;
			this.id = scoped === false ? this.name : escape(generateId(this, sheet));
			this.rules = new RuleList(_extends({}, options, { parent: this }));
			for (var name in frames) this.rules.add(name, frames[name], _extends({}, options, { parent: this }));
			this.rules.process();
		}
		/**
		* Generates a CSS string.
		*/
		var _proto = KeyframesRule.prototype;
		_proto.toString = function toString(options) {
			if (options === void 0) options = defaultToStringOptions$1;
			var linebreak = getWhitespaceSymbols(options).linebreak;
			if (options.indent == null) options.indent = defaultToStringOptions$1.indent;
			if (options.children == null) options.children = defaultToStringOptions$1.children;
			if (options.children === false) return this.at + " " + this.id + " {}";
			var children = this.rules.toString(options);
			if (children) children = "" + linebreak + children + linebreak;
			return this.at + " " + this.id + " {" + children + "}";
		};
		return KeyframesRule;
	}();
	keyRegExp$1 = /@keyframes\s+/;
	refRegExp$1 = /\$([\w-]+)/g;
	findReferencedKeyframe = function findReferencedKeyframe(val, keyframes) {
		if (typeof val === "string") return val.replace(refRegExp$1, function(match, name) {
			if (name in keyframes) return keyframes[name];
			return match;
		});
		return val;
	};
	replaceRef = function replaceRef(style, prop, keyframes) {
		var value = style[prop];
		var refKeyframe = findReferencedKeyframe(value, keyframes);
		if (refKeyframe !== value) style[prop] = refKeyframe;
	};
	pluginKeyframesRule = {
		onCreateRule: function onCreateRule(key, frames, options) {
			return typeof key === "string" && keyRegExp$1.test(key) ? new KeyframesRule(key, frames, options) : null;
		},
		onProcessStyle: function onProcessStyle(style, rule, sheet) {
			if (rule.type !== "style" || !sheet) return style;
			if ("animation-name" in style) replaceRef(style, "animation-name", sheet.keyframes);
			if ("animation" in style) replaceRef(style, "animation", sheet.keyframes);
			return style;
		},
		onChangeValue: function onChangeValue(val, prop, rule) {
			var sheet = rule.options.sheet;
			if (!sheet) return val;
			switch (prop) {
				case "animation": return findReferencedKeyframe(val, sheet.keyframes);
				case "animation-name": return findReferencedKeyframe(val, sheet.keyframes);
				default: return val;
			}
		}
	};
	KeyframeRule = /*#__PURE__*/ function(_BaseStyleRule) {
		_inheritsLoose(KeyframeRule, _BaseStyleRule);
		function KeyframeRule() {
			return _BaseStyleRule.apply(this, arguments) || this;
		}
		var _proto = KeyframeRule.prototype;
		/**
		* Generates a CSS string.
		*/
		_proto.toString = function toString(options) {
			var sheet = this.options.sheet;
			var opts = (sheet ? sheet.options.link : false) ? _extends({}, options, { allowEmpty: true }) : options;
			return toCss(this.key, this.style, opts);
		};
		return KeyframeRule;
	}(BaseStyleRule);
	pluginKeyframeRule = { onCreateRule: function onCreateRule(key, style, options) {
		if (options.parent && options.parent.type === "keyframes") return new KeyframeRule(key, style, options);
		return null;
	} };
	FontFaceRule = /*#__PURE__*/ function() {
		function FontFaceRule(key, style, options) {
			this.type = "font-face";
			this.at = "@font-face";
			this.isProcessed = false;
			this.key = key;
			this.style = style;
			this.options = options;
		}
		/**
		* Generates a CSS string.
		*/
		var _proto = FontFaceRule.prototype;
		_proto.toString = function toString(options) {
			var linebreak = getWhitespaceSymbols(options).linebreak;
			if (Array.isArray(this.style)) {
				var str = "";
				for (var index = 0; index < this.style.length; index++) {
					str += toCss(this.at, this.style[index]);
					if (this.style[index + 1]) str += linebreak;
				}
				return str;
			}
			return toCss(this.at, this.style, options);
		};
		return FontFaceRule;
	}();
	keyRegExp$2 = /@font-face/;
	pluginFontFaceRule = { onCreateRule: function onCreateRule(key, style, options) {
		return keyRegExp$2.test(key) ? new FontFaceRule(key, style, options) : null;
	} };
	ViewportRule = /*#__PURE__*/ function() {
		function ViewportRule(key, style, options) {
			this.type = "viewport";
			this.at = "@viewport";
			this.isProcessed = false;
			this.key = key;
			this.style = style;
			this.options = options;
		}
		/**
		* Generates a CSS string.
		*/
		var _proto = ViewportRule.prototype;
		_proto.toString = function toString(options) {
			return toCss(this.key, this.style, options);
		};
		return ViewportRule;
	}();
	pluginViewportRule = { onCreateRule: function onCreateRule(key, style, options) {
		return key === "@viewport" || key === "@-ms-viewport" ? new ViewportRule(key, style, options) : null;
	} };
	SimpleRule = /*#__PURE__*/ function() {
		function SimpleRule(key, value, options) {
			this.type = "simple";
			this.isProcessed = false;
			this.key = key;
			this.value = value;
			this.options = options;
		}
		/**
		* Generates a CSS string.
		*/
		var _proto = SimpleRule.prototype;
		_proto.toString = function toString(options) {
			if (Array.isArray(this.value)) {
				var str = "";
				for (var index = 0; index < this.value.length; index++) {
					str += this.key + " " + this.value[index] + ";";
					if (this.value[index + 1]) str += "\n";
				}
				return str;
			}
			return this.key + " " + this.value + ";";
		};
		return SimpleRule;
	}();
	keysMap = {
		"@charset": true,
		"@import": true,
		"@namespace": true
	};
	plugins$1 = [
		pluginStyleRule,
		pluginConditionalRule,
		pluginKeyframesRule,
		pluginKeyframeRule,
		pluginFontFaceRule,
		pluginViewportRule,
		{ onCreateRule: function onCreateRule(key, value, options) {
			return key in keysMap ? new SimpleRule(key, value, options) : null;
		} }
	];
	defaultUpdateOptions = { process: true };
	forceUpdateOptions = {
		force: true,
		process: true
	};
	RuleList = /*#__PURE__*/ function() {
		function RuleList(options) {
			this.map = {};
			this.raw = {};
			this.index = [];
			this.counter = 0;
			this.options = options;
			this.classes = options.classes;
			this.keyframes = options.keyframes;
		}
		/**
		* Create and register rule.
		*
		* Will not render after Style Sheet was rendered the first time.
		*/
		var _proto = RuleList.prototype;
		_proto.add = function add(name, decl, ruleOptions) {
			var _this$options = this.options, parent = _this$options.parent, sheet = _this$options.sheet, jss = _this$options.jss, Renderer = _this$options.Renderer, generateId = _this$options.generateId, scoped = _this$options.scoped;
			var options = _extends({
				classes: this.classes,
				parent,
				sheet,
				jss,
				Renderer,
				generateId,
				scoped,
				name,
				keyframes: this.keyframes,
				selector: void 0
			}, ruleOptions);
			var key = name;
			if (name in this.raw) key = name + "-d" + this.counter++;
			this.raw[key] = decl;
			if (key in this.classes) options.selector = "." + escape(this.classes[key]);
			var rule = createRule(key, decl, options);
			if (!rule) return null;
			this.register(rule);
			var index = options.index === void 0 ? this.index.length : options.index;
			this.index.splice(index, 0, rule);
			return rule;
		};
		_proto.replace = function replace(name, decl, ruleOptions) {
			var oldRule = this.get(name);
			var oldIndex = this.index.indexOf(oldRule);
			if (oldRule) this.remove(oldRule);
			var options = ruleOptions;
			if (oldIndex !== -1) options = _extends({}, ruleOptions, { index: oldIndex });
			return this.add(name, decl, options);
		};
		_proto.get = function get(nameOrSelector) {
			return this.map[nameOrSelector];
		};
		_proto.remove = function remove(rule) {
			this.unregister(rule);
			delete this.raw[rule.key];
			this.index.splice(this.index.indexOf(rule), 1);
		};
		_proto.indexOf = function indexOf(rule) {
			return this.index.indexOf(rule);
		};
		_proto.process = function process() {
			var plugins = this.options.jss.plugins;
			this.index.slice(0).forEach(plugins.onProcessRule, plugins);
		};
		_proto.register = function register(rule) {
			this.map[rule.key] = rule;
			if (rule instanceof StyleRule) {
				this.map[rule.selector] = rule;
				if (rule.id) this.classes[rule.key] = rule.id;
			} else if (rule instanceof KeyframesRule && this.keyframes) this.keyframes[rule.name] = rule.id;
		};
		_proto.unregister = function unregister(rule) {
			delete this.map[rule.key];
			if (rule instanceof StyleRule) {
				delete this.map[rule.selector];
				delete this.classes[rule.key];
			} else if (rule instanceof KeyframesRule) delete this.keyframes[rule.name];
		};
		_proto.update = function update() {
			var name;
			var data;
			var options;
			if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) === "string") {
				name = arguments.length <= 0 ? void 0 : arguments[0];
				data = arguments.length <= 1 ? void 0 : arguments[1];
				options = arguments.length <= 2 ? void 0 : arguments[2];
			} else {
				data = arguments.length <= 0 ? void 0 : arguments[0];
				options = arguments.length <= 1 ? void 0 : arguments[1];
				name = null;
			}
			if (name) this.updateOne(this.get(name), data, options);
			else for (var index = 0; index < this.index.length; index++) this.updateOne(this.index[index], data, options);
		};
		_proto.updateOne = function updateOne(rule, data, options) {
			if (options === void 0) options = defaultUpdateOptions;
			var _this$options2 = this.options, plugins = _this$options2.jss.plugins, sheet = _this$options2.sheet;
			if (rule.rules instanceof RuleList) {
				rule.rules.update(data, options);
				return;
			}
			var style = rule.style;
			plugins.onUpdate(data, rule, sheet, options);
			if (options.process && style && style !== rule.style) {
				plugins.onProcessStyle(rule.style, rule, sheet);
				for (var prop in rule.style) {
					var nextValue = rule.style[prop];
					if (nextValue !== style[prop]) rule.prop(prop, nextValue, forceUpdateOptions);
				}
				for (var _prop in style) {
					var _nextValue = rule.style[_prop];
					var _prevValue = style[_prop];
					if (_nextValue == null && _nextValue !== _prevValue) rule.prop(_prop, null, forceUpdateOptions);
				}
			}
		};
		_proto.toString = function toString(options) {
			var str = "";
			var sheet = this.options.sheet;
			var link = sheet ? sheet.options.link : false;
			var linebreak = getWhitespaceSymbols(options).linebreak;
			for (var index = 0; index < this.index.length; index++) {
				var css = this.index[index].toString(options);
				if (!css && !link) continue;
				if (str) str += linebreak;
				str += css;
			}
			return str;
		};
		return RuleList;
	}();
	StyleSheet = /*#__PURE__*/ function() {
		function StyleSheet(styles, options) {
			this.attached = false;
			this.deployed = false;
			this.classes = {};
			this.keyframes = {};
			this.options = _extends({}, options, {
				sheet: this,
				parent: this,
				classes: this.classes,
				keyframes: this.keyframes
			});
			if (options.Renderer) this.renderer = new options.Renderer(this);
			this.rules = new RuleList(this.options);
			for (var name in styles) this.rules.add(name, styles[name]);
			this.rules.process();
		}
		/**
		* Attach renderable to the render tree.
		*/
		var _proto = StyleSheet.prototype;
		_proto.attach = function attach() {
			if (this.attached) return this;
			if (this.renderer) this.renderer.attach();
			this.attached = true;
			if (!this.deployed) this.deploy();
			return this;
		};
		_proto.detach = function detach() {
			if (!this.attached) return this;
			if (this.renderer) this.renderer.detach();
			this.attached = false;
			return this;
		};
		_proto.addRule = function addRule(name, decl, options) {
			var queue = this.queue;
			if (this.attached && !queue) this.queue = [];
			var rule = this.rules.add(name, decl, options);
			if (!rule) return null;
			this.options.jss.plugins.onProcessRule(rule);
			if (this.attached) {
				if (!this.deployed) return rule;
				if (queue) queue.push(rule);
				else {
					this.insertRule(rule);
					if (this.queue) {
						this.queue.forEach(this.insertRule, this);
						this.queue = void 0;
					}
				}
				return rule;
			}
			this.deployed = false;
			return rule;
		};
		_proto.replaceRule = function replaceRule(nameOrSelector, decl, options) {
			var oldRule = this.rules.get(nameOrSelector);
			if (!oldRule) return this.addRule(nameOrSelector, decl, options);
			var newRule = this.rules.replace(nameOrSelector, decl, options);
			if (newRule) this.options.jss.plugins.onProcessRule(newRule);
			if (this.attached) {
				if (!this.deployed) return newRule;
				if (this.renderer) {
					if (!newRule) this.renderer.deleteRule(oldRule);
					else if (oldRule.renderable) this.renderer.replaceRule(oldRule.renderable, newRule);
				}
				return newRule;
			}
			this.deployed = false;
			return newRule;
		};
		_proto.insertRule = function insertRule(rule) {
			if (this.renderer) this.renderer.insertRule(rule);
		};
		_proto.addRules = function addRules(styles, options) {
			var added = [];
			for (var name in styles) {
				var rule = this.addRule(name, styles[name], options);
				if (rule) added.push(rule);
			}
			return added;
		};
		_proto.getRule = function getRule(nameOrSelector) {
			return this.rules.get(nameOrSelector);
		};
		_proto.deleteRule = function deleteRule(name) {
			var rule = typeof name === "object" ? name : this.rules.get(name);
			if (!rule || this.attached && !rule.renderable) return false;
			this.rules.remove(rule);
			if (this.attached && rule.renderable && this.renderer) return this.renderer.deleteRule(rule.renderable);
			return true;
		};
		_proto.indexOf = function indexOf(rule) {
			return this.rules.indexOf(rule);
		};
		_proto.deploy = function deploy() {
			if (this.renderer) this.renderer.deploy();
			this.deployed = true;
			return this;
		};
		_proto.update = function update() {
			var _this$rules;
			(_this$rules = this.rules).update.apply(_this$rules, arguments);
			return this;
		};
		_proto.updateOne = function updateOne(rule, data, options) {
			this.rules.updateOne(rule, data, options);
			return this;
		};
		_proto.toString = function toString(options) {
			return this.rules.toString(options);
		};
		return StyleSheet;
	}();
	PluginsRegistry = /*#__PURE__*/ function() {
		function PluginsRegistry() {
			this.plugins = {
				internal: [],
				external: []
			};
			this.registry = {};
		}
		var _proto = PluginsRegistry.prototype;
		/**
		* Call `onCreateRule` hooks and return an object if returned by a hook.
		*/
		_proto.onCreateRule = function onCreateRule(name, decl, options) {
			for (var i = 0; i < this.registry.onCreateRule.length; i++) {
				var rule = this.registry.onCreateRule[i](name, decl, options);
				if (rule) return rule;
			}
			return null;
		};
		_proto.onProcessRule = function onProcessRule(rule) {
			if (rule.isProcessed) return;
			var sheet = rule.options.sheet;
			for (var i = 0; i < this.registry.onProcessRule.length; i++) this.registry.onProcessRule[i](rule, sheet);
			if (rule.style) this.onProcessStyle(rule.style, rule, sheet);
			rule.isProcessed = true;
		};
		_proto.onProcessStyle = function onProcessStyle(style, rule, sheet) {
			for (var i = 0; i < this.registry.onProcessStyle.length; i++) rule.style = this.registry.onProcessStyle[i](rule.style, rule, sheet);
		};
		_proto.onProcessSheet = function onProcessSheet(sheet) {
			for (var i = 0; i < this.registry.onProcessSheet.length; i++) this.registry.onProcessSheet[i](sheet);
		};
		_proto.onUpdate = function onUpdate(data, rule, sheet, options) {
			for (var i = 0; i < this.registry.onUpdate.length; i++) this.registry.onUpdate[i](data, rule, sheet, options);
		};
		_proto.onChangeValue = function onChangeValue(value, prop, rule) {
			var processedValue = value;
			for (var i = 0; i < this.registry.onChangeValue.length; i++) processedValue = this.registry.onChangeValue[i](processedValue, prop, rule);
			return processedValue;
		};
		_proto.use = function use(newPlugin, options) {
			if (options === void 0) options = { queue: "external" };
			var plugins = this.plugins[options.queue];
			if (plugins.indexOf(newPlugin) !== -1) return;
			plugins.push(newPlugin);
			this.registry = [].concat(this.plugins.external, this.plugins.internal).reduce(function(registry, plugin) {
				for (var name in plugin) if (name in registry) registry[name].push(plugin[name]);
				return registry;
			}, {
				onCreateRule: [],
				onProcessRule: [],
				onProcessStyle: [],
				onProcessSheet: [],
				onChangeValue: [],
				onUpdate: []
			});
		};
		return PluginsRegistry;
	}();
	SheetsRegistry = /*#__PURE__*/ function() {
		function SheetsRegistry() {
			this.registry = [];
		}
		var _proto = SheetsRegistry.prototype;
		/**
		* Register a Style Sheet.
		*/
		_proto.add = function add(sheet) {
			var registry = this.registry;
			var index = sheet.options.index;
			if (registry.indexOf(sheet) !== -1) return;
			if (registry.length === 0 || index >= this.index) {
				registry.push(sheet);
				return;
			}
			for (var i = 0; i < registry.length; i++) if (registry[i].options.index > index) {
				registry.splice(i, 0, sheet);
				return;
			}
		};
		_proto.reset = function reset() {
			this.registry = [];
		};
		_proto.remove = function remove(sheet) {
			var index = this.registry.indexOf(sheet);
			this.registry.splice(index, 1);
		};
		_proto.toString = function toString(_temp) {
			var _ref = _temp === void 0 ? {} : _temp, attached = _ref.attached, options = _objectWithoutPropertiesLoose(_ref, ["attached"]);
			var linebreak = getWhitespaceSymbols(options).linebreak;
			var css = "";
			for (var i = 0; i < this.registry.length; i++) {
				var sheet = this.registry[i];
				if (attached != null && sheet.attached !== attached) continue;
				if (css) css += linebreak;
				css += sheet.toString(options);
			}
			return css;
		};
		_createClass(SheetsRegistry, [{
			key: "index",
			/**
			* Current highest index number.
			*/
			get: function get() {
				return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index;
			}
		}]);
		return SheetsRegistry;
	}();
	sheets = new SheetsRegistry();
	globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" && window.Math === Math ? window : typeof self !== "undefined" && self.Math === Math ? self : Function("return this")();
	ns = "2f1acc6c3a606b082e5eef5e54414ffb";
	if (globalThis$1[ns] == null) globalThis$1[ns] = 0;
	moduleId = globalThis$1[ns]++;
	maxRules = 1e10;
	createGenerateId = function createGenerateId(options) {
		if (options === void 0) options = {};
		var ruleCounter = 0;
		return function generateId(rule, sheet) {
			ruleCounter += 1;
			if (ruleCounter > maxRules) {}
			var jssId = "";
			var prefix = "";
			if (sheet) {
				if (sheet.options.classNamePrefix) prefix = sheet.options.classNamePrefix;
				if (sheet.options.jss.id != null) jssId = String(sheet.options.jss.id);
			}
			if (options.minify) return "" + (prefix || "c") + moduleId + jssId + ruleCounter;
			return prefix + rule.key + "-" + moduleId + (jssId ? "-" + jssId : "") + "-" + ruleCounter;
		};
	};
	memoize$1 = function memoize(fn) {
		var value;
		return function() {
			if (!value) value = fn();
			return value;
		};
	};
	getPropertyValue = function getPropertyValue(cssRule, prop) {
		try {
			if (cssRule.attributeStyleMap) return cssRule.attributeStyleMap.get(prop);
			return cssRule.style.getPropertyValue(prop);
		} catch (err) {
			return "";
		}
	};
	setProperty = function setProperty(cssRule, prop, value) {
		try {
			var cssValue = value;
			if (Array.isArray(value)) cssValue = toCssValue(value);
			if (cssRule.attributeStyleMap) cssRule.attributeStyleMap.set(prop, cssValue);
			else {
				var indexOfImportantFlag = cssValue ? cssValue.indexOf("!important") : -1;
				var cssValueWithoutImportantFlag = indexOfImportantFlag > -1 ? cssValue.substr(0, indexOfImportantFlag - 1) : cssValue;
				cssRule.style.setProperty(prop, cssValueWithoutImportantFlag, indexOfImportantFlag > -1 ? "important" : "");
			}
		} catch (err) {
			return false;
		}
		return true;
	};
	removeProperty = function removeProperty(cssRule, prop) {
		try {
			if (cssRule.attributeStyleMap) cssRule.attributeStyleMap.delete(prop);
			else cssRule.style.removeProperty(prop);
		} catch (err) {}
	};
	setSelector = function setSelector(cssRule, selectorText) {
		cssRule.selectorText = selectorText;
		return cssRule.selectorText === selectorText;
	};
	getHead = memoize$1(function() {
		return document.querySelector("head");
	});
	getNonce = memoize$1(function() {
		var node = document.querySelector("meta[property=\"csp-nonce\"]");
		return node ? node.getAttribute("content") : null;
	});
	_insertRule = function insertRule(container, rule, index) {
		try {
			if ("insertRule" in container) container.insertRule(rule, index);
			else if ("appendRule" in container) container.appendRule(rule);
		} catch (err) {
			return false;
		}
		return container.cssRules[index];
	};
	getValidRuleInsertionIndex = function getValidRuleInsertionIndex(container, index) {
		var maxIndex = container.cssRules.length;
		if (index === void 0 || index > maxIndex) return maxIndex;
		return index;
	};
	createStyle = function createStyle() {
		var el = document.createElement("style");
		el.textContent = "\n";
		return el;
	};
	DomRenderer = /*#__PURE__*/ function() {
		function DomRenderer(sheet) {
			this.getPropertyValue = getPropertyValue;
			this.setProperty = setProperty;
			this.removeProperty = removeProperty;
			this.setSelector = setSelector;
			this.hasInsertedRules = false;
			this.cssRules = [];
			if (sheet) sheets.add(sheet);
			this.sheet = sheet;
			var _ref = this.sheet ? this.sheet.options : {}, media = _ref.media, meta = _ref.meta, element = _ref.element;
			this.element = element || createStyle();
			this.element.setAttribute("data-jss", "");
			if (media) this.element.setAttribute("media", media);
			if (meta) this.element.setAttribute("data-meta", meta);
			var nonce = getNonce();
			if (nonce) this.element.setAttribute("nonce", nonce);
		}
		/**
		* Insert style element into render tree.
		*/
		var _proto = DomRenderer.prototype;
		_proto.attach = function attach() {
			if (this.element.parentNode || !this.sheet) return;
			insertStyle(this.element, this.sheet.options);
			var deployed = Boolean(this.sheet && this.sheet.deployed);
			if (this.hasInsertedRules && deployed) {
				this.hasInsertedRules = false;
				this.deploy();
			}
		};
		_proto.detach = function detach() {
			if (!this.sheet) return;
			var parentNode = this.element.parentNode;
			if (parentNode) parentNode.removeChild(this.element);
			if (this.sheet.options.link) {
				this.cssRules = [];
				this.element.textContent = "\n";
			}
		};
		_proto.deploy = function deploy() {
			var sheet = this.sheet;
			if (!sheet) return;
			if (sheet.options.link) {
				this.insertRules(sheet.rules);
				return;
			}
			this.element.textContent = "\n" + sheet.toString() + "\n";
		};
		_proto.insertRules = function insertRules(rules, nativeParent) {
			for (var i = 0; i < rules.index.length; i++) this.insertRule(rules.index[i], i, nativeParent);
		};
		_proto.insertRule = function insertRule(rule, index, nativeParent) {
			if (nativeParent === void 0) nativeParent = this.element.sheet;
			if (rule.rules) {
				var parent = rule;
				var latestNativeParent = nativeParent;
				if (rule.type === "conditional" || rule.type === "keyframes") {
					var _insertionIndex = getValidRuleInsertionIndex(nativeParent, index);
					latestNativeParent = _insertRule(nativeParent, parent.toString({ children: false }), _insertionIndex);
					if (latestNativeParent === false) return false;
					this.refCssRule(rule, _insertionIndex, latestNativeParent);
				}
				this.insertRules(parent.rules, latestNativeParent);
				return latestNativeParent;
			}
			var ruleStr = rule.toString();
			if (!ruleStr) return false;
			var insertionIndex = getValidRuleInsertionIndex(nativeParent, index);
			var nativeRule = _insertRule(nativeParent, ruleStr, insertionIndex);
			if (nativeRule === false) return false;
			this.hasInsertedRules = true;
			this.refCssRule(rule, insertionIndex, nativeRule);
			return nativeRule;
		};
		_proto.refCssRule = function refCssRule(rule, index, cssRule) {
			rule.renderable = cssRule;
			if (rule.options.parent instanceof StyleSheet) this.cssRules.splice(index, 0, cssRule);
		};
		_proto.deleteRule = function deleteRule(cssRule) {
			var sheet = this.element.sheet;
			var index = this.indexOf(cssRule);
			if (index === -1) return false;
			sheet.deleteRule(index);
			this.cssRules.splice(index, 1);
			return true;
		};
		_proto.indexOf = function indexOf(cssRule) {
			return this.cssRules.indexOf(cssRule);
		};
		_proto.replaceRule = function replaceRule(cssRule, rule) {
			var index = this.indexOf(cssRule);
			if (index === -1) return false;
			this.element.sheet.deleteRule(index);
			this.cssRules.splice(index, 1);
			return this.insertRule(rule, index);
		};
		_proto.getRules = function getRules() {
			return this.element.sheet.cssRules;
		};
		return DomRenderer;
	}();
	instanceCounter = 0;
	Jss = /*#__PURE__*/ function() {
		function Jss(options) {
			this.id = instanceCounter++;
			this.version = "10.10.0";
			this.plugins = new PluginsRegistry();
			this.options = {
				id: { minify: false },
				createGenerateId,
				Renderer: isBrowser ? DomRenderer : null,
				plugins: []
			};
			this.generateId = createGenerateId({ minify: false });
			for (var i = 0; i < plugins$1.length; i++) this.plugins.use(plugins$1[i], { queue: "internal" });
			this.setup(options);
		}
		/**
		* Prepares various options, applies plugins.
		* Should not be used twice on the same instance, because there is no plugins
		* deduplication logic.
		*/
		var _proto = Jss.prototype;
		_proto.setup = function setup(options) {
			if (options === void 0) options = {};
			if (options.createGenerateId) this.options.createGenerateId = options.createGenerateId;
			if (options.id) this.options.id = _extends({}, this.options.id, options.id);
			if (options.createGenerateId || options.id) this.generateId = this.options.createGenerateId(this.options.id);
			if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint;
			if ("Renderer" in options) this.options.Renderer = options.Renderer;
			if (options.plugins) this.use.apply(this, options.plugins);
			return this;
		};
		_proto.createStyleSheet = function createStyleSheet(styles, options) {
			if (options === void 0) options = {};
			var index = options.index;
			if (typeof index !== "number") index = sheets.index === 0 ? 0 : sheets.index + 1;
			var sheet = new StyleSheet(styles, _extends({}, options, {
				jss: this,
				generateId: options.generateId || this.generateId,
				insertionPoint: this.options.insertionPoint,
				Renderer: this.options.Renderer,
				index
			}));
			this.plugins.onProcessSheet(sheet);
			return sheet;
		};
		_proto.removeStyleSheet = function removeStyleSheet(sheet) {
			sheet.detach();
			sheets.remove(sheet);
			return this;
		};
		_proto.createRule = function createRule$1(name, style, options) {
			if (style === void 0) style = {};
			if (options === void 0) options = {};
			if (typeof name === "object") return this.createRule(void 0, name, style);
			var ruleOptions = _extends({}, options, {
				name,
				jss: this,
				Renderer: this.options.Renderer
			});
			if (!ruleOptions.generateId) ruleOptions.generateId = this.generateId;
			if (!ruleOptions.classes) ruleOptions.classes = {};
			if (!ruleOptions.keyframes) ruleOptions.keyframes = {};
			var rule = createRule(name, style, ruleOptions);
			if (rule) this.plugins.onProcessRule(rule);
			return rule;
		};
		_proto.use = function use() {
			var _this = this;
			for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) plugins[_key] = arguments[_key];
			plugins.forEach(function(plugin) {
				_this.plugins.use(plugin);
			});
			return this;
		};
		return Jss;
	}();
	createJss = function createJss(options) {
		return new Jss(options);
	};
	SheetsManager = /*#__PURE__*/ function() {
		function SheetsManager() {
			this.length = 0;
			this.sheets = /* @__PURE__ */ new WeakMap();
		}
		var _proto = SheetsManager.prototype;
		_proto.get = function get(key) {
			var entry = this.sheets.get(key);
			return entry && entry.sheet;
		};
		_proto.add = function add(key, sheet) {
			if (this.sheets.has(key)) return;
			this.length++;
			this.sheets.set(key, {
				sheet,
				refs: 0
			});
		};
		_proto.manage = function manage(key) {
			var entry = this.sheets.get(key);
			if (entry) {
				if (entry.refs === 0) entry.sheet.attach();
				entry.refs++;
				return entry.sheet;
			}
		};
		_proto.unmanage = function unmanage(key) {
			var entry = this.sheets.get(key);
			if (entry) {
				if (entry.refs > 0) {
					entry.refs--;
					if (entry.refs === 0) entry.sheet.detach();
				}
			}
		};
		_createClass(SheetsManager, [{
			key: "size",
			get: function get() {
				return this.length;
			}
		}]);
		return SheetsManager;
	}();
	hasCSSTOMSupport = typeof CSS === "object" && CSS != null && "number" in CSS;
	index$1 = createJss();
}));
/**
* A better abstraction over CSS.
*
* @copyright Oleg Isonen (Slobodskoi) / Isonen 2014-present
* @website https://github.com/cssinjs/jss
* @license MIT
*/
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-rule-value-function@10.10.0/node_modules/jss-plugin-rule-value-function/dist/jss-plugin-rule-value-function.esm.js
var now, fnValuesNs, fnRuleNs, functionPlugin;
var init_jss_plugin_rule_value_function_esm = __esmMin((() => {
	init_jss_esm();
	now = Date.now();
	fnValuesNs = "fnValues" + now;
	fnRuleNs = "fnStyle" + ++now;
	functionPlugin = function functionPlugin() {
		return {
			onCreateRule: function onCreateRule(name, decl, options) {
				if (typeof decl !== "function") return null;
				var rule = createRule(name, {}, options);
				rule[fnRuleNs] = decl;
				return rule;
			},
			onProcessStyle: function onProcessStyle(style, rule) {
				if (fnValuesNs in rule || fnRuleNs in rule) return style;
				var fnValues = {};
				for (var prop in style) {
					var value = style[prop];
					if (typeof value !== "function") continue;
					delete style[prop];
					fnValues[prop] = value;
				}
				rule[fnValuesNs] = fnValues;
				return style;
			},
			onUpdate: function onUpdate(data, rule, sheet, options) {
				var styleRule = rule;
				var fnRule = styleRule[fnRuleNs];
				if (fnRule) styleRule.style = fnRule(data) || {};
				var fnValues = styleRule[fnValuesNs];
				if (fnValues) for (var _prop in fnValues) styleRule.prop(_prop, fnValues[_prop](data), options);
			}
		};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/symbol-observable@1.2.0/node_modules/symbol-observable/es/ponyfill.js
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;
	if (typeof Symbol === "function") {
		if (Symbol.observable) result = Symbol.observable;
		else {
			result = Symbol("observable");
			Symbol.observable = result;
		}
	} else result = "@@observable";
	return result;
}
var init_ponyfill = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/symbol-observable@1.2.0/node_modules/symbol-observable/es/index.js
var root, result;
var init_es = __esmMin((() => {
	init_ponyfill();
	if (typeof self !== "undefined") root = self;
	else if (typeof window !== "undefined") root = window;
	else if (typeof global !== "undefined") root = global;
	else if (typeof module !== "undefined") root = module;
	else root = Function("return this")();
	result = symbolObservablePonyfill(root);
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-rule-value-observable@10.10.0/node_modules/jss-plugin-rule-value-observable/dist/jss-plugin-rule-value-observable.esm.js
var isObservable, observablePlugin;
var init_jss_plugin_rule_value_observable_esm = __esmMin((() => {
	init_es();
	init_jss_esm();
	isObservable = function isObservable(value) {
		return value && value[result] && value === value[result]();
	};
	observablePlugin = function observablePlugin(updateOptions) {
		return {
			onCreateRule: function onCreateRule(name, decl, options) {
				if (!isObservable(decl)) return null;
				var style$ = decl;
				var rule = createRule(name, {}, options);
				style$.subscribe(function(style) {
					for (var prop in style) rule.prop(prop, style[prop], updateOptions);
				});
				return rule;
			},
			onProcessRule: function onProcessRule(rule) {
				if (rule && rule.type !== "style") return;
				var styleRule = rule;
				var style = styleRule.style;
				var _loop = function _loop(prop) {
					var value = style[prop];
					if (!isObservable(value)) return "continue";
					delete style[prop];
					value.subscribe({ next: function next(nextValue) {
						styleRule.prop(prop, nextValue, updateOptions);
					} });
				};
				for (var prop in style) if (_loop(prop) === "continue") continue;
			}
		};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-template@10.10.0/node_modules/jss-plugin-template/dist/jss-plugin-template.esm.js
function templatePlugin() {
	return { onProcessRule };
}
var semiWithNl, parse, onProcessRule;
var init_jss_plugin_template_esm = __esmMin((() => {
	semiWithNl = /;\n/;
	parse = function parse(cssText) {
		var style = {};
		var split = cssText.split(semiWithNl);
		for (var i = 0; i < split.length; i++) {
			var decl = (split[i] || "").trim();
			if (!decl) continue;
			var colonIndex = decl.indexOf(":");
			if (colonIndex === -1) continue;
			var prop = decl.substr(0, colonIndex).trim();
			style[prop] = decl.substr(colonIndex + 1).trim();
		}
		return style;
	};
	onProcessRule = function onProcessRule(rule) {
		if (typeof rule.style === "string") rule.style = parse(rule.style);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-global@10.10.0/node_modules/jss-plugin-global/dist/jss-plugin-global.esm.js
function addScope(selector, scope) {
	var parts = selector.split(separatorRegExp$1);
	var scoped = "";
	for (var i = 0; i < parts.length; i++) {
		scoped += scope + " " + parts[i].trim();
		if (parts[i + 1]) scoped += ", ";
	}
	return scoped;
}
function handleNestedGlobalContainerRule(rule, sheet) {
	var options = rule.options, style = rule.style;
	var rules = style ? style[at] : null;
	if (!rules) return;
	for (var name in rules) sheet.addRule(name, rules[name], _extends({}, options, { selector: addScope(name, rule.selector) }));
	delete style[at];
}
function handlePrefixedGlobalRule(rule, sheet) {
	var options = rule.options, style = rule.style;
	for (var prop in style) {
		if (prop[0] !== "@" || prop.substr(0, at.length) !== at) continue;
		var selector = addScope(prop.substr(at.length), rule.selector);
		sheet.addRule(selector, style[prop], _extends({}, options, { selector }));
		delete style[prop];
	}
}
/**
* Convert nested rules to separate, remove them from original styles.
*/
function jssGlobal() {
	function onCreateRule(name, styles, options) {
		if (!name) return null;
		if (name === at) return new GlobalContainerRule(name, styles, options);
		if (name[0] === "@" && name.substr(0, atPrefix.length) === atPrefix) return new GlobalPrefixedRule(name, styles, options);
		var parent = options.parent;
		if (parent) {
			if (parent.type === "global" || parent.options.parent && parent.options.parent.type === "global") options.scoped = false;
		}
		if (!options.selector && options.scoped === false) options.selector = name;
		return null;
	}
	function onProcessRule(rule, sheet) {
		if (rule.type !== "style" || !sheet) return;
		handleNestedGlobalContainerRule(rule, sheet);
		handlePrefixedGlobalRule(rule, sheet);
	}
	return {
		onCreateRule,
		onProcessRule
	};
}
var at, atPrefix, GlobalContainerRule, GlobalPrefixedRule, separatorRegExp$1;
var init_jss_plugin_global_esm = __esmMin((() => {
	init_extends();
	init_jss_esm();
	at = "@global";
	atPrefix = "@global ";
	GlobalContainerRule = /*#__PURE__*/ function() {
		function GlobalContainerRule(key, styles, options) {
			this.type = "global";
			this.at = at;
			this.isProcessed = false;
			this.key = key;
			this.options = options;
			this.rules = new RuleList(_extends({}, options, { parent: this }));
			for (var selector in styles) this.rules.add(selector, styles[selector]);
			this.rules.process();
		}
		/**
		* Get a rule.
		*/
		var _proto = GlobalContainerRule.prototype;
		_proto.getRule = function getRule(name) {
			return this.rules.get(name);
		};
		_proto.addRule = function addRule(name, style, options) {
			var rule = this.rules.add(name, style, options);
			if (rule) this.options.jss.plugins.onProcessRule(rule);
			return rule;
		};
		_proto.replaceRule = function replaceRule(name, style, options) {
			var newRule = this.rules.replace(name, style, options);
			if (newRule) this.options.jss.plugins.onProcessRule(newRule);
			return newRule;
		};
		_proto.indexOf = function indexOf(rule) {
			return this.rules.indexOf(rule);
		};
		_proto.toString = function toString(options) {
			return this.rules.toString(options);
		};
		return GlobalContainerRule;
	}();
	GlobalPrefixedRule = /*#__PURE__*/ function() {
		function GlobalPrefixedRule(key, style, options) {
			this.type = "global";
			this.at = at;
			this.isProcessed = false;
			this.key = key;
			this.options = options;
			var selector = key.substr(atPrefix.length);
			this.rule = options.jss.createRule(selector, style, _extends({}, options, { parent: this }));
		}
		var _proto2 = GlobalPrefixedRule.prototype;
		_proto2.toString = function toString(options) {
			return this.rule ? this.rule.toString(options) : "";
		};
		return GlobalPrefixedRule;
	}();
	separatorRegExp$1 = /\s*,\s*/g;
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-extend@10.10.0/node_modules/jss-plugin-extend/dist/jss-plugin-extend.esm.js
function mergeExtend(style, rule, sheet, newStyle) {
	if (typeof style.extend === "string") {
		if (!sheet) return;
		var refRule = sheet.getRule(style.extend);
		if (!refRule) return;
		if (refRule === rule) return;
		var parent = refRule.options.parent;
		if (parent) {
			var originalStyle = parent.rules.raw[style.extend];
			extend(originalStyle, rule, sheet, newStyle);
		}
		return;
	}
	if (Array.isArray(style.extend)) {
		for (var index = 0; index < style.extend.length; index++) {
			var singleExtend = style.extend[index];
			extend(typeof singleExtend === "string" ? _extends({}, style, { extend: singleExtend }) : style.extend[index], rule, sheet, newStyle);
		}
		return;
	}
	for (var prop in style.extend) {
		if (prop === "extend") {
			extend(style.extend.extend, rule, sheet, newStyle);
			continue;
		}
		if (isObject(style.extend[prop])) {
			if (!(prop in newStyle)) newStyle[prop] = {};
			extend(style.extend[prop], rule, sheet, newStyle[prop]);
			continue;
		}
		newStyle[prop] = style.extend[prop];
	}
}
function mergeRest(style, rule, sheet, newStyle) {
	for (var prop in style) {
		if (prop === "extend") continue;
		if (isObject(newStyle[prop]) && isObject(style[prop])) {
			extend(style[prop], rule, sheet, newStyle[prop]);
			continue;
		}
		if (isObject(style[prop])) {
			newStyle[prop] = extend(style[prop], rule, sheet);
			continue;
		}
		newStyle[prop] = style[prop];
	}
}
/**
* Recursively extend styles.
*/
function extend(style, rule, sheet, newStyle) {
	if (newStyle === void 0) newStyle = {};
	mergeExtend(style, rule, sheet, newStyle);
	mergeRest(style, rule, sheet, newStyle);
	return newStyle;
}
/**
* Handle `extend` property.
*/
function jssExtend() {
	function onProcessStyle(style, rule, sheet) {
		if ("extend" in style) return extend(style, rule, sheet);
		return style;
	}
	function onChangeValue(value, prop, rule) {
		if (prop !== "extend") return value;
		if (value == null || value === false) {
			for (var key in rule[valueNs]) rule.prop(key, null);
			rule[valueNs] = null;
			return null;
		}
		if (typeof value === "object") {
			for (var _key in value) rule.prop(_key, value[_key]);
			rule[valueNs] = value;
		}
		return null;
	}
	return {
		onProcessStyle,
		onChangeValue
	};
}
var isObject, valueNs;
var init_jss_plugin_extend_esm = __esmMin((() => {
	init_extends();
	isObject = function isObject(obj) {
		return obj && typeof obj === "object" && !Array.isArray(obj);
	};
	valueNs = "extendCurrValue" + Date.now();
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-nested@10.10.0/node_modules/jss-plugin-nested/dist/jss-plugin-nested.esm.js
/**
* Convert nested rules to separate, remove them from original styles.
*/
function jssNested() {
	function getReplaceRef(container, sheet) {
		return function(match, key) {
			var rule = container.getRule(key) || sheet && sheet.getRule(key);
			if (rule) return rule.selector;
			return key;
		};
	}
	function replaceParentRefs(nestedProp, parentProp) {
		var parentSelectors = parentProp.split(separatorRegExp);
		var nestedSelectors = nestedProp.split(separatorRegExp);
		var result = "";
		for (var i = 0; i < parentSelectors.length; i++) {
			var parent = parentSelectors[i];
			for (var j = 0; j < nestedSelectors.length; j++) {
				var nested = nestedSelectors[j];
				if (result) result += ", ";
				result += nested.indexOf("&") !== -1 ? nested.replace(parentRegExp, parent) : parent + " " + nested;
			}
		}
		return result;
	}
	function getOptions(rule, container, prevOptions) {
		if (prevOptions) return _extends({}, prevOptions, { index: prevOptions.index + 1 });
		var nestingLevel = rule.options.nestingLevel;
		nestingLevel = nestingLevel === void 0 ? 1 : nestingLevel + 1;
		var options = _extends({}, rule.options, {
			nestingLevel,
			index: container.indexOf(rule) + 1
		});
		delete options.name;
		return options;
	}
	function onProcessStyle(style, rule, sheet) {
		if (rule.type !== "style") return style;
		var styleRule = rule;
		var container = styleRule.options.parent;
		var options;
		var replaceRef;
		for (var prop in style) {
			var isNested = prop.indexOf("&") !== -1;
			var isNestedConditional = prop[0] === "@";
			if (!isNested && !isNestedConditional) continue;
			options = getOptions(styleRule, container, options);
			if (isNested) {
				var selector = replaceParentRefs(prop, styleRule.selector);
				if (!replaceRef) replaceRef = getReplaceRef(container, sheet);
				selector = selector.replace(refRegExp, replaceRef);
				var name = styleRule.key + "-" + prop;
				if ("replaceRule" in container) container.replaceRule(name, style[prop], _extends({}, options, { selector }));
				else container.addRule(name, style[prop], _extends({}, options, { selector }));
			} else if (isNestedConditional) container.addRule(prop, {}, options).addRule(styleRule.key, style[prop], { selector: styleRule.selector });
			delete style[prop];
		}
		return style;
	}
	return { onProcessStyle };
}
var separatorRegExp, parentRegExp, refRegExp;
var init_jss_plugin_nested_esm = __esmMin((() => {
	init_extends();
	separatorRegExp = /\s*,\s*/g;
	parentRegExp = /&/g;
	refRegExp = /\$([\w-]+)/g;
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-compose@10.10.0/node_modules/jss-plugin-compose/dist/jss-plugin-compose.esm.js
/**
* Set selector.
*
* @param original rule
* @param className class string
* @return flag indicating function was successfull or not
*/
function registerClass(rule, className) {
	if (!className) return true;
	if (Array.isArray(className)) {
		for (var index = 0; index < className.length; index++) if (!registerClass(rule, className[index])) return false;
		return true;
	}
	if (className.indexOf(" ") > -1) return registerClass(rule, className.split(" "));
	var parent = rule.options.parent;
	if (className[0] === "$") {
		var refRule = parent.getRule(className.substr(1));
		if (!refRule) return false;
		if (refRule === rule) return false;
		parent.classes[rule.key] += " " + parent.classes[refRule.key];
		return true;
	}
	parent.classes[rule.key] += " " + className;
	return true;
}
/**
* Convert compose property to additional class, remove property from original styles.
*/
function jssCompose() {
	function onProcessStyle(style, rule) {
		if (!("composes" in style)) return style;
		registerClass(rule, style.composes);
		delete style.composes;
		return style;
	}
	return { onProcessStyle };
}
var init_jss_plugin_compose_esm = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/hyphenate-style-name@1.1.0/node_modules/hyphenate-style-name/index.js
function toHyphenLower(match) {
	return "-" + match.toLowerCase();
}
function hyphenateStyleName(name) {
	if (cache$2.hasOwnProperty(name)) return cache$2[name];
	var hName = name.replace(uppercasePattern, toHyphenLower);
	return cache$2[name] = msPattern.test(hName) ? "-" + hName : hName;
}
var uppercasePattern, msPattern, cache$2;
var init_hyphenate_style_name = __esmMin((() => {
	uppercasePattern = /[A-Z]/g;
	msPattern = /^ms-/;
	cache$2 = {};
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-camel-case@10.10.0/node_modules/jss-plugin-camel-case/dist/jss-plugin-camel-case.esm.js
/**
* Convert camel cased property names to dash separated.
*/
function convertCase(style) {
	var converted = {};
	for (var prop in style) {
		var key = prop.indexOf("--") === 0 ? prop : hyphenateStyleName(prop);
		converted[key] = style[prop];
	}
	if (style.fallbacks) {
		if (Array.isArray(style.fallbacks)) converted.fallbacks = style.fallbacks.map(convertCase);
		else converted.fallbacks = convertCase(style.fallbacks);
	}
	return converted;
}
/**
* Allow camel cased property names by converting them back to dasherized.
*/
function camelCase() {
	function onProcessStyle(style) {
		if (Array.isArray(style)) {
			for (var index = 0; index < style.length; index++) style[index] = convertCase(style[index]);
			return style;
		}
		return convertCase(style);
	}
	function onChangeValue(value, prop, rule) {
		if (prop.indexOf("--") === 0) return value;
		var hyphenatedProp = hyphenateStyleName(prop);
		if (prop === hyphenatedProp) return value;
		rule.prop(hyphenatedProp, value);
		return null;
	}
	return {
		onProcessStyle,
		onChangeValue
	};
}
var init_jss_plugin_camel_case_esm = __esmMin((() => {
	init_hyphenate_style_name();
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-default-unit@10.10.0/node_modules/jss-plugin-default-unit/dist/jss-plugin-default-unit.esm.js
/**
* Clones the object and adds a camel cased property version.
*/
function addCamelCasedVersion(obj) {
	var regExp = /(-[a-z])/g;
	var replace = function replace(str) {
		return str[1].toUpperCase();
	};
	var newObj = {};
	for (var key in obj) {
		newObj[key] = obj[key];
		newObj[key.replace(regExp, replace)] = obj[key];
	}
	return newObj;
}
/**
* Recursive deep style passing function
*/
function iterate(prop, value, options) {
	if (value == null) return value;
	if (Array.isArray(value)) for (var i = 0; i < value.length; i++) value[i] = iterate(prop, value[i], options);
	else if (typeof value === "object") {
		if (prop === "fallbacks") for (var innerProp in value) value[innerProp] = iterate(innerProp, value[innerProp], options);
		else for (var _innerProp in value) value[_innerProp] = iterate(prop + "-" + _innerProp, value[_innerProp], options);
	} else if (typeof value === "number" && isNaN(value) === false) {
		var unit = options[prop] || units[prop];
		if (unit && !(value === 0 && unit === px)) return typeof unit === "function" ? unit(value).toString() : "" + value + unit;
		return value.toString();
	}
	return value;
}
/**
* Add unit to numeric values.
*/
function defaultUnit(options) {
	if (options === void 0) options = {};
	var camelCasedOptions = addCamelCasedVersion(options);
	function onProcessStyle(style, rule) {
		if (rule.type !== "style") return style;
		for (var prop in style) style[prop] = iterate(prop, style[prop], camelCasedOptions);
		return style;
	}
	function onChangeValue(value, prop) {
		return iterate(prop, value, camelCasedOptions);
	}
	return {
		onProcessStyle,
		onChangeValue
	};
}
var px, ms, percent, defaultUnits, units;
var init_jss_plugin_default_unit_esm = __esmMin((() => {
	init_jss_esm();
	px = hasCSSTOMSupport && CSS ? CSS.px : "px";
	ms = hasCSSTOMSupport && CSS ? CSS.ms : "ms";
	percent = hasCSSTOMSupport && CSS ? CSS.percent : "%";
	defaultUnits = {
		"animation-delay": ms,
		"animation-duration": ms,
		"background-position": px,
		"background-position-x": px,
		"background-position-y": px,
		"background-size": px,
		border: px,
		"border-bottom": px,
		"border-bottom-left-radius": px,
		"border-bottom-right-radius": px,
		"border-bottom-width": px,
		"border-left": px,
		"border-left-width": px,
		"border-radius": px,
		"border-right": px,
		"border-right-width": px,
		"border-top": px,
		"border-top-left-radius": px,
		"border-top-right-radius": px,
		"border-top-width": px,
		"border-width": px,
		"border-block": px,
		"border-block-end": px,
		"border-block-end-width": px,
		"border-block-start": px,
		"border-block-start-width": px,
		"border-block-width": px,
		"border-inline": px,
		"border-inline-end": px,
		"border-inline-end-width": px,
		"border-inline-start": px,
		"border-inline-start-width": px,
		"border-inline-width": px,
		"border-start-start-radius": px,
		"border-start-end-radius": px,
		"border-end-start-radius": px,
		"border-end-end-radius": px,
		margin: px,
		"margin-bottom": px,
		"margin-left": px,
		"margin-right": px,
		"margin-top": px,
		"margin-block": px,
		"margin-block-end": px,
		"margin-block-start": px,
		"margin-inline": px,
		"margin-inline-end": px,
		"margin-inline-start": px,
		padding: px,
		"padding-bottom": px,
		"padding-left": px,
		"padding-right": px,
		"padding-top": px,
		"padding-block": px,
		"padding-block-end": px,
		"padding-block-start": px,
		"padding-inline": px,
		"padding-inline-end": px,
		"padding-inline-start": px,
		"mask-position-x": px,
		"mask-position-y": px,
		"mask-size": px,
		height: px,
		width: px,
		"min-height": px,
		"max-height": px,
		"min-width": px,
		"max-width": px,
		bottom: px,
		left: px,
		top: px,
		right: px,
		inset: px,
		"inset-block": px,
		"inset-block-end": px,
		"inset-block-start": px,
		"inset-inline": px,
		"inset-inline-end": px,
		"inset-inline-start": px,
		"box-shadow": px,
		"text-shadow": px,
		"column-gap": px,
		"column-rule": px,
		"column-rule-width": px,
		"column-width": px,
		"font-size": px,
		"font-size-delta": px,
		"letter-spacing": px,
		"text-decoration-thickness": px,
		"text-indent": px,
		"text-stroke": px,
		"text-stroke-width": px,
		"word-spacing": px,
		motion: px,
		"motion-offset": px,
		outline: px,
		"outline-offset": px,
		"outline-width": px,
		perspective: px,
		"perspective-origin-x": percent,
		"perspective-origin-y": percent,
		"transform-origin": percent,
		"transform-origin-x": percent,
		"transform-origin-y": percent,
		"transform-origin-z": percent,
		"transition-delay": ms,
		"transition-duration": ms,
		"vertical-align": px,
		"flex-basis": px,
		"shape-margin": px,
		size: px,
		gap: px,
		grid: px,
		"grid-gap": px,
		"row-gap": px,
		"grid-row-gap": px,
		"grid-column-gap": px,
		"grid-template-rows": px,
		"grid-template-columns": px,
		"grid-auto-rows": px,
		"grid-auto-columns": px,
		"box-shadow-x": px,
		"box-shadow-y": px,
		"box-shadow-blur": px,
		"box-shadow-spread": px,
		"font-line-height": px,
		"text-shadow-x": px,
		"text-shadow-y": px,
		"text-shadow-blur": px
	};
	units = addCamelCasedVersion(defaultUnits);
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-expand@10.10.0/node_modules/jss-plugin-expand/dist/jss-plugin-expand.esm.js
/**
* Map values by given prop.
*
* @param {Array} array of values
* @param {String} original property
* @param {String} original rule
* @return {String} mapped values
*/
function mapValuesByProp(value, prop, rule) {
	return value.map(function(item) {
		return objectToArray(item, prop, rule, false, true);
	});
}
/**
* Convert array to nested array, if needed
*/
function processArray(value, prop, scheme, rule) {
	if (scheme[prop] == null) return value;
	if (value.length === 0) return [];
	if (Array.isArray(value[0])) return processArray(value[0], prop, scheme, rule);
	if (typeof value[0] === "object") return mapValuesByProp(value, prop, rule);
	return [value];
}
/**
* Convert object to array.
*/
function objectToArray(value, prop, rule, isFallback, isInArray) {
	if (!(propObj[prop] || customPropObj[prop])) return [];
	var result = [];
	if (customPropObj[prop]) value = customPropsToStyle(value, rule, customPropObj[prop], isFallback);
	if (Object.keys(value).length) for (var baseProp in propObj[prop]) {
		if (value[baseProp]) {
			if (Array.isArray(value[baseProp])) result.push(propArrayInObj[baseProp] === null ? value[baseProp] : value[baseProp].join(" "));
			else result.push(value[baseProp]);
			continue;
		}
		if (propObj[prop][baseProp] != null) result.push(propObj[prop][baseProp]);
	}
	if (!result.length || isInArray) return result;
	return [result];
}
/**
* Convert custom properties values to styles adding them to rule directly
*/
function customPropsToStyle(value, rule, customProps, isFallback) {
	for (var prop in customProps) {
		var propName = customProps[prop];
		if (typeof value[prop] !== "undefined" && (isFallback || !rule.prop(propName))) {
			var _styleDetector;
			var appendedValue = styleDetector((_styleDetector = {}, _styleDetector[propName] = value[prop], _styleDetector), rule)[propName];
			if (isFallback) rule.style.fallbacks[propName] = appendedValue;
			else rule.style[propName] = appendedValue;
		}
		delete value[prop];
	}
	return value;
}
/**
* Detect if a style needs to be converted.
*/
function styleDetector(style, rule, isFallback) {
	for (var prop in style) {
		var value = style[prop];
		if (Array.isArray(value)) {
			if (!Array.isArray(value[0])) {
				if (prop === "fallbacks") {
					for (var index = 0; index < style.fallbacks.length; index++) style.fallbacks[index] = styleDetector(style.fallbacks[index], rule, true);
					continue;
				}
				style[prop] = processArray(value, prop, propArray, rule);
				if (!style[prop].length) delete style[prop];
			}
		} else if (typeof value === "object") {
			if (prop === "fallbacks") {
				style.fallbacks = styleDetector(style.fallbacks, rule, true);
				continue;
			}
			style[prop] = objectToArray(value, prop, rule, isFallback);
			if (!style[prop].length) delete style[prop];
		} else if (style[prop] === "") delete style[prop];
	}
	return style;
}
/**
* Adds possibility to write expanded styles.
*/
function jssExpand() {
	function onProcessStyle(style, rule) {
		if (!style || rule.type !== "style") return style;
		if (Array.isArray(style)) {
			for (var index = 0; index < style.length; index++) style[index] = styleDetector(style[index], rule);
			return style;
		}
		return styleDetector(style, rule);
	}
	return { onProcessStyle };
}
var propArray, propArrayInObj, propObj, customPropObj;
var init_jss_plugin_expand_esm = __esmMin((() => {
	propArray = {
		"background-size": true,
		"background-position": true,
		border: true,
		"border-bottom": true,
		"border-left": true,
		"border-top": true,
		"border-right": true,
		"border-radius": true,
		"border-image": true,
		"border-width": true,
		"border-style": true,
		"border-color": true,
		"box-shadow": true,
		flex: true,
		margin: true,
		padding: true,
		outline: true,
		"transform-origin": true,
		transform: true,
		transition: true
	};
	propArrayInObj = {
		position: true,
		size: true
	};
	propObj = {
		padding: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		},
		margin: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		},
		background: {
			attachment: null,
			color: null,
			image: null,
			position: null,
			repeat: null
		},
		border: {
			width: null,
			style: null,
			color: null
		},
		"border-top": {
			width: null,
			style: null,
			color: null
		},
		"border-right": {
			width: null,
			style: null,
			color: null
		},
		"border-bottom": {
			width: null,
			style: null,
			color: null
		},
		"border-left": {
			width: null,
			style: null,
			color: null
		},
		outline: {
			width: null,
			style: null,
			color: null
		},
		"list-style": {
			type: null,
			position: null,
			image: null
		},
		transition: {
			property: null,
			duration: null,
			"timing-function": null,
			timingFunction: null,
			delay: null
		},
		animation: {
			name: null,
			duration: null,
			"timing-function": null,
			timingFunction: null,
			delay: null,
			"iteration-count": null,
			iterationCount: null,
			direction: null,
			"fill-mode": null,
			fillMode: null,
			"play-state": null,
			playState: null
		},
		"box-shadow": {
			x: 0,
			y: 0,
			blur: 0,
			spread: 0,
			color: null,
			inset: null
		},
		"text-shadow": {
			x: 0,
			y: 0,
			blur: null,
			color: null
		}
	};
	customPropObj = {
		border: {
			radius: "border-radius",
			image: "border-image",
			width: "border-width",
			style: "border-style",
			color: "border-color"
		},
		"border-bottom": {
			width: "border-bottom-width",
			style: "border-bottom-style",
			color: "border-bottom-color"
		},
		"border-top": {
			width: "border-top-width",
			style: "border-top-style",
			color: "border-top-color"
		},
		"border-left": {
			width: "border-left-width",
			style: "border-left-style",
			color: "border-left-color"
		},
		"border-right": {
			width: "border-right-width",
			style: "border-right-style",
			color: "border-right-color"
		},
		background: {
			size: "background-size",
			image: "background-image"
		},
		font: {
			style: "font-style",
			variant: "font-variant",
			weight: "font-weight",
			stretch: "font-stretch",
			size: "font-size",
			family: "font-family",
			lineHeight: "line-height",
			"line-height": "line-height"
		},
		flex: {
			grow: "flex-grow",
			basis: "flex-basis",
			direction: "flex-direction",
			wrap: "flex-wrap",
			flow: "flex-flow",
			shrink: "flex-shrink"
		},
		align: {
			self: "align-self",
			items: "align-items",
			content: "align-content"
		},
		grid: {
			"template-columns": "grid-template-columns",
			templateColumns: "grid-template-columns",
			"template-rows": "grid-template-rows",
			templateRows: "grid-template-rows",
			"template-areas": "grid-template-areas",
			templateAreas: "grid-template-areas",
			template: "grid-template",
			"auto-columns": "grid-auto-columns",
			autoColumns: "grid-auto-columns",
			"auto-rows": "grid-auto-rows",
			autoRows: "grid-auto-rows",
			"auto-flow": "grid-auto-flow",
			autoFlow: "grid-auto-flow",
			row: "grid-row",
			column: "grid-column",
			"row-start": "grid-row-start",
			rowStart: "grid-row-start",
			"row-end": "grid-row-end",
			rowEnd: "grid-row-end",
			"column-start": "grid-column-start",
			columnStart: "grid-column-start",
			"column-end": "grid-column-end",
			columnEnd: "grid-column-end",
			area: "grid-area",
			gap: "grid-gap",
			"row-gap": "grid-row-gap",
			rowGap: "grid-row-gap",
			"column-gap": "grid-column-gap",
			columnGap: "grid-column-gap"
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
var init_arrayLikeToArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
var init_arrayWithoutHoles = __esmMin((() => {
	init_arrayLikeToArray();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
var init_iterableToArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
var init_unsupportedIterableToArray = __esmMin((() => {
	init_arrayLikeToArray();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var init_nonIterableSpread = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
var init_toConsumableArray = __esmMin((() => {
	init_arrayWithoutHoles();
	init_iterableToArray();
	init_unsupportedIterableToArray();
	init_nonIterableSpread();
}));
//#endregion
//#region ../../node_modules/.pnpm/css-vendor@2.0.8/node_modules/css-vendor/dist/css-vendor.esm.js
/**
* Test if a keyframe at-rule should be prefixed or not
*
* @param {String} vendor prefix string for the current browser.
* @return {String}
* @api public
*/
function supportedKeyframes(key) {
	if (key[1] === "-") return key;
	if (prefix.js === "ms") return key;
	return "@" + prefix.css + "keyframes" + key.substr(10);
}
/**
* Replaces the letter with the capital letter
*
* @param {String} match
* @param {String} c
* @return {String}
* @api private
*/
function toUpper(match, c) {
	return c ? c.toUpperCase() : "";
}
/**
* Convert dash separated strings to camel-cased.
*
* @param {String} str
* @return {String}
* @api private
*/
function camelize(str) {
	return str.replace(regExp, toUpper);
}
/**
* Convert dash separated strings to pascal cased.
*
* @param {String} str
* @return {String}
* @api private
*/
function pascalize(str) {
	return camelize("-" + str);
}
/**
* Test if a property is supported, returns supported property with vendor
* prefix if required. Returns `false` if not supported.
*
* @param {String} prop dash separated
* @param {Object} [options]
* @return {String|Boolean}
* @api public
*/
function supportedProperty(prop, options) {
	if (options === void 0) options = {};
	if (!el) return prop;
	if (cache[prop] != null) return cache[prop];
	if (prop === "transition" || prop === "transform") options[prop] = prop in el.style;
	for (var i = 0; i < propertyDetectors.length; i++) {
		cache[prop] = propertyDetectors[i](prop, el.style, options);
		if (cache[prop]) break;
	}
	try {
		el.style[prop] = "";
	} catch (err) {
		return false;
	}
	return cache[prop];
}
/**
* Returns prefixed value transition/transform if needed.
*
* @param {String} match
* @param {String} p1
* @param {String} p2
* @return {String}
* @api private
*/
function prefixTransitionCallback(match, p1, p2) {
	if (p1 === "var") return "var";
	if (p1 === "all") return "all";
	if (p2 === "all") return ", all";
	var prefixedValue = p1 ? supportedProperty(p1) : ", " + supportedProperty(p2);
	if (!prefixedValue) return p1 || p2;
	return prefixedValue;
}
/**
* Returns prefixed value if needed. Returns `false` if value is not supported.
*
* @param {String} property
* @param {String} value
* @return {String|Boolean}
* @api public
*/
function supportedValue(property, value) {
	var prefixedValue = value;
	if (!el$1 || property === "content") return value;
	if (typeof prefixedValue !== "string" || !isNaN(parseInt(prefixedValue, 10))) return prefixedValue;
	var cacheKey = property + prefixedValue;
	if (cache$1[cacheKey] != null) return cache$1[cacheKey];
	try {
		el$1.style[property] = prefixedValue;
	} catch (err) {
		cache$1[cacheKey] = false;
		return false;
	}
	if (transitionProperties[property]) prefixedValue = prefixedValue.replace(transPropsRegExp, prefixTransitionCallback);
	else if (el$1.style[property] === "") {
		prefixedValue = prefix.css + prefixedValue;
		if (prefixedValue === "-ms-flex") el$1.style[property] = "-ms-flexbox";
		el$1.style[property] = prefixedValue;
		if (el$1.style[property] === "") {
			cache$1[cacheKey] = false;
			return false;
		}
	}
	el$1.style[property] = "";
	cache$1[cacheKey] = prefixedValue;
	return cache$1[cacheKey];
}
var js, css$1, vendor, browser, isTouch, jsCssMap, style, testProp, prefix, appearence, colorAdjust, regExp, mask, textOrientation, transform, transition, writingMode, userSelect, breakPropsOld, inlineLogicalOld, unprefixed, prefixed, scrollSnap, overscrollBehavior, propMap, flex2012, propMap$1, propKeys, prefixCss, plugins, propertyDetectors, noPrefill, el, cache, computed, cache$1, transitionProperties, transPropsRegExp, el$1;
var init_css_vendor_esm = __esmMin((() => {
	init_module();
	init_toConsumableArray();
	js = "";
	css$1 = "";
	vendor = "";
	browser = "";
	isTouch = isBrowser && "ontouchstart" in document.documentElement;
	if (isBrowser) {
		jsCssMap = {
			Moz: "-moz-",
			ms: "-ms-",
			O: "-o-",
			Webkit: "-webkit-"
		};
		style = document.createElement("p").style;
		testProp = "Transform";
		for (var key in jsCssMap) if (key + testProp in style) {
			js = key;
			css$1 = jsCssMap[key];
			break;
		}
		if (js === "Webkit" && "msHyphens" in style) {
			js = "ms";
			css$1 = jsCssMap.ms;
			browser = "edge";
		}
		if (js === "Webkit" && "-apple-trailing-word" in style) vendor = "apple";
	}
	prefix = {
		js,
		css: css$1,
		vendor,
		browser,
		isTouch
	};
	appearence = {
		noPrefill: ["appearance"],
		supportedProperty: function supportedProperty(prop) {
			if (prop !== "appearance") return false;
			if (prefix.js === "ms") return "-webkit-" + prop;
			return prefix.css + prop;
		}
	};
	colorAdjust = {
		noPrefill: ["color-adjust"],
		supportedProperty: function supportedProperty(prop) {
			if (prop !== "color-adjust") return false;
			if (prefix.js === "Webkit") return prefix.css + "print-" + prop;
			return prop;
		}
	};
	regExp = /[-\s]+(.)?/g;
	mask = {
		noPrefill: ["mask"],
		supportedProperty: function supportedProperty(prop, style) {
			if (!/^mask/.test(prop)) return false;
			if (prefix.js === "Webkit") {
				var longhand = "mask-image";
				if (camelize(longhand) in style) return prop;
				if (prefix.js + pascalize(longhand) in style) return prefix.css + prop;
			}
			return prop;
		}
	};
	textOrientation = {
		noPrefill: ["text-orientation"],
		supportedProperty: function supportedProperty(prop) {
			if (prop !== "text-orientation") return false;
			if (prefix.vendor === "apple" && !prefix.isTouch) return prefix.css + prop;
			return prop;
		}
	};
	transform = {
		noPrefill: ["transform"],
		supportedProperty: function supportedProperty(prop, style, options) {
			if (prop !== "transform") return false;
			if (options.transform) return prop;
			return prefix.css + prop;
		}
	};
	transition = {
		noPrefill: ["transition"],
		supportedProperty: function supportedProperty(prop, style, options) {
			if (prop !== "transition") return false;
			if (options.transition) return prop;
			return prefix.css + prop;
		}
	};
	writingMode = {
		noPrefill: ["writing-mode"],
		supportedProperty: function supportedProperty(prop) {
			if (prop !== "writing-mode") return false;
			if (prefix.js === "Webkit" || prefix.js === "ms" && prefix.browser !== "edge") return prefix.css + prop;
			return prop;
		}
	};
	userSelect = {
		noPrefill: ["user-select"],
		supportedProperty: function supportedProperty(prop) {
			if (prop !== "user-select") return false;
			if (prefix.js === "Moz" || prefix.js === "ms" || prefix.vendor === "apple") return prefix.css + prop;
			return prop;
		}
	};
	breakPropsOld = { supportedProperty: function supportedProperty(prop, style) {
		if (!/^break-/.test(prop)) return false;
		if (prefix.js === "Webkit") return "WebkitColumn" + pascalize(prop) in style ? prefix.css + "column-" + prop : false;
		if (prefix.js === "Moz") return "page" + pascalize(prop) in style ? "page-" + prop : false;
		return false;
	} };
	inlineLogicalOld = { supportedProperty: function supportedProperty(prop, style) {
		if (!/^(border|margin|padding)-inline/.test(prop)) return false;
		if (prefix.js === "Moz") return prop;
		var newProp = prop.replace("-inline", "");
		return prefix.js + pascalize(newProp) in style ? prefix.css + newProp : false;
	} };
	unprefixed = { supportedProperty: function supportedProperty(prop, style) {
		return camelize(prop) in style ? prop : false;
	} };
	prefixed = { supportedProperty: function supportedProperty(prop, style) {
		var pascalized = pascalize(prop);
		if (prop[0] === "-") return prop;
		if (prop[0] === "-" && prop[1] === "-") return prop;
		if (prefix.js + pascalized in style) return prefix.css + prop;
		if (prefix.js !== "Webkit" && "Webkit" + pascalized in style) return "-webkit-" + prop;
		return false;
	} };
	scrollSnap = { supportedProperty: function supportedProperty(prop) {
		if (prop.substring(0, 11) !== "scroll-snap") return false;
		if (prefix.js === "ms") return "" + prefix.css + prop;
		return prop;
	} };
	overscrollBehavior = { supportedProperty: function supportedProperty(prop) {
		if (prop !== "overscroll-behavior") return false;
		if (prefix.js === "ms") return prefix.css + "scroll-chaining";
		return prop;
	} };
	propMap = {
		"flex-grow": "flex-positive",
		"flex-shrink": "flex-negative",
		"flex-basis": "flex-preferred-size",
		"justify-content": "flex-pack",
		order: "flex-order",
		"align-items": "flex-align",
		"align-content": "flex-line-pack"
	};
	flex2012 = { supportedProperty: function supportedProperty(prop, style) {
		var newProp = propMap[prop];
		if (!newProp) return false;
		return prefix.js + pascalize(newProp) in style ? prefix.css + newProp : false;
	} };
	propMap$1 = {
		flex: "box-flex",
		"flex-grow": "box-flex",
		"flex-direction": ["box-orient", "box-direction"],
		order: "box-ordinal-group",
		"align-items": "box-align",
		"flex-flow": ["box-orient", "box-direction"],
		"justify-content": "box-pack"
	};
	propKeys = Object.keys(propMap$1);
	prefixCss = function prefixCss(p) {
		return prefix.css + p;
	};
	plugins = [
		appearence,
		colorAdjust,
		mask,
		textOrientation,
		transform,
		transition,
		writingMode,
		userSelect,
		breakPropsOld,
		inlineLogicalOld,
		unprefixed,
		prefixed,
		scrollSnap,
		overscrollBehavior,
		flex2012,
		{ supportedProperty: function supportedProperty(prop, style, _ref) {
			var multiple = _ref.multiple;
			if (propKeys.indexOf(prop) > -1) {
				var newProp = propMap$1[prop];
				if (!Array.isArray(newProp)) return prefix.js + pascalize(newProp) in style ? prefix.css + newProp : false;
				if (!multiple) return false;
				for (var i = 0; i < newProp.length; i++) if (!(prefix.js + pascalize(newProp[0]) in style)) return false;
				return newProp.map(prefixCss);
			}
			return false;
		} }
	];
	propertyDetectors = plugins.filter(function(p) {
		return p.supportedProperty;
	}).map(function(p) {
		return p.supportedProperty;
	});
	noPrefill = plugins.filter(function(p) {
		return p.noPrefill;
	}).reduce(function(a, p) {
		a.push.apply(a, _toConsumableArray(p.noPrefill));
		return a;
	}, []);
	cache = {};
	if (isBrowser) {
		el = document.createElement("p");
		computed = window.getComputedStyle(document.documentElement, "");
		for (var key$1 in computed) if (!isNaN(key$1)) cache[computed[key$1]] = computed[key$1];
		noPrefill.forEach(function(x) {
			return delete cache[x];
		});
	}
	cache$1 = {};
	transitionProperties = {
		transition: 1,
		"transition-property": 1,
		"-webkit-transition": 1,
		"-webkit-transition-property": 1
	};
	transPropsRegExp = /(^\s*[\w-]+)|, (\s*[\w-]+)(?![^()]*\))/g;
	if (isBrowser) el$1 = document.createElement("p");
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-vendor-prefixer@10.10.0/node_modules/jss-plugin-vendor-prefixer/dist/jss-plugin-vendor-prefixer.esm.js
/**
* Add vendor prefix to a property name when needed.
*/
function jssVendorPrefixer() {
	function onProcessRule(rule) {
		if (rule.type === "keyframes") {
			var atRule = rule;
			atRule.at = supportedKeyframes(atRule.at);
		}
	}
	function prefixStyle(style) {
		for (var prop in style) {
			var value = style[prop];
			if (prop === "fallbacks" && Array.isArray(value)) {
				style[prop] = value.map(prefixStyle);
				continue;
			}
			var changeProp = false;
			var supportedProp = supportedProperty(prop);
			if (supportedProp && supportedProp !== prop) changeProp = true;
			var changeValue = false;
			var supportedValue$1 = supportedValue(supportedProp, toCssValue(value));
			if (supportedValue$1 && supportedValue$1 !== value) changeValue = true;
			if (changeProp || changeValue) {
				if (changeProp) delete style[prop];
				style[supportedProp || prop] = supportedValue$1 || value;
			}
		}
		return style;
	}
	function onProcessStyle(style, rule) {
		if (rule.type !== "style") return style;
		return prefixStyle(style);
	}
	function onChangeValue(value, prop) {
		return supportedValue(prop, toCssValue(value)) || value;
	}
	return {
		onProcessRule,
		onProcessStyle,
		onChangeValue
	};
}
var init_jss_plugin_vendor_prefixer_esm = __esmMin((() => {
	init_css_vendor_esm();
	init_jss_esm();
}));
//#endregion
//#region ../../node_modules/.pnpm/jss-plugin-props-sort@10.10.0/node_modules/jss-plugin-props-sort/dist/jss-plugin-props-sort.esm.js
/**
* Sort props by length.
*/
function jssPropsSort() {
	var sort = function sort(prop0, prop1) {
		if (prop0.length === prop1.length) return prop0 > prop1 ? 1 : -1;
		return prop0.length - prop1.length;
	};
	return { onProcessStyle: function onProcessStyle(style, rule) {
		if (rule.type !== "style") return style;
		var newStyle = {};
		var props = Object.keys(style).sort(sort);
		for (var i = 0; i < props.length; i++) newStyle[props[i]] = style[props[i]];
		return newStyle;
	} };
}
var init_jss_plugin_props_sort_esm = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/jss-preset-default@10.10.0/node_modules/jss-preset-default/dist/jss-preset-default.esm.js
var jss_preset_default_esm_exports = /* @__PURE__ */ __exportAll({ default: () => create });
var create;
var init_jss_preset_default_esm = __esmMin((() => {
	init_jss_plugin_rule_value_function_esm();
	init_jss_plugin_rule_value_observable_esm();
	init_jss_plugin_template_esm();
	init_jss_plugin_global_esm();
	init_jss_plugin_extend_esm();
	init_jss_plugin_nested_esm();
	init_jss_plugin_compose_esm();
	init_jss_plugin_camel_case_esm();
	init_jss_plugin_default_unit_esm();
	init_jss_plugin_expand_esm();
	init_jss_plugin_vendor_prefixer_esm();
	init_jss_plugin_props_sort_esm();
	create = function create(options) {
		if (options === void 0) options = {};
		return { plugins: [
			functionPlugin(),
			observablePlugin(options.observable),
			templatePlugin(),
			jssGlobal(),
			jssExtend(),
			jssNested(),
			jssCompose(),
			camelCase(),
			defaultUnit(options.defaultUnit),
			jssExpand(),
			jssVendorPrefixer(),
			jssPropsSort()
		] };
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/shallow-equal@1.2.1/node_modules/shallow-equal/dist/index.esm.js
var index_esm_exports = /* @__PURE__ */ __exportAll({
	shallowEqualArrays: () => shallowEqualArrays,
	shallowEqualObjects: () => shallowEqualObjects
});
function shallowEqualObjects(objA, objB) {
	if (objA === objB) return true;
	if (!objA || !objB) return false;
	var aKeys = Object.keys(objA);
	var bKeys = Object.keys(objB);
	var len = aKeys.length;
	if (bKeys.length !== len) return false;
	for (var i = 0; i < len; i++) {
		var key = aKeys[i];
		if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) return false;
	}
	return true;
}
function shallowEqualArrays(arrA, arrB) {
	if (arrA === arrB) return true;
	if (!arrA || !arrB) return false;
	var len = arrA.length;
	if (arrB.length !== len) return false;
	for (var i = 0; i < len; i++) if (arrA[i] !== arrB[i]) return false;
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/@emotion+memoize@0.7.1/node_modules/@emotion/memoize/dist/memoize.browser.esm.js
function memoize(fn) {
	var cache = {};
	return function(arg) {
		if (cache[arg] === void 0) cache[arg] = fn(arg);
		return cache[arg];
	};
}
var init_memoize_browser_esm = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/.pnpm/@emotion+is-prop-valid@0.7.3/node_modules/@emotion/is-prop-valid/dist/is-prop-valid.browser.esm.js
var is_prop_valid_browser_esm_exports = /* @__PURE__ */ __exportAll({ default: () => index });
var reactPropsRegex, index;
var init_is_prop_valid_browser_esm = __esmMin((() => {
	init_memoize_browser_esm();
	reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
	index = memoize(function(prop) {
		return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/css-jss@10.10.0/node_modules/css-jss/dist/css-jss.esm.js
var css_jss_esm_exports = /* @__PURE__ */ __exportAll({
	create: () => createCss,
	default: () => css
});
var MAX_RULES_PER_SHEET, defaultJss, createCss, css;
var init_css_jss_esm = __esmMin((() => {
	init_jss_esm();
	init_jss_preset_default_esm();
	MAX_RULES_PER_SHEET = 1e4;
	defaultJss = createJss(create());
	createCss = function createCss(jss) {
		if (jss === void 0) jss = defaultJss;
		var cache = /* @__PURE__ */ new Map();
		var ruleIndex = 0;
		var sheet;
		var getSheet = function getSheet() {
			if (!sheet || sheet.rules.index.length > MAX_RULES_PER_SHEET) sheet = jss.createStyleSheet().attach();
			return sheet;
		};
		function css() {
			var args = arguments;
			var argsStr = JSON.stringify(args);
			var cached = cache.get(argsStr);
			if (cached) return cached.className;
			var flatArgs = [];
			for (var argIndex in args) {
				var arg = args[argIndex];
				if (!Array.isArray(arg)) {
					flatArgs.push(arg);
					continue;
				}
				for (var innerArgIndex = 0; innerArgIndex < arg.length; innerArgIndex++) flatArgs.push(arg[innerArgIndex]);
			}
			var mergedStyle = {};
			var labels = [];
			for (var i = 0; i < flatArgs.length; i++) {
				var style = flatArgs[i];
				if (!style) continue;
				var styleObject = style;
				if (typeof style === "string") {
					var _cached = cache.get(style);
					if (_cached) {
						if (_cached.labels.length) labels.push.apply(labels, _cached.labels);
						styleObject = _cached.style;
					}
				}
				if (styleObject.label && labels.indexOf(styleObject.label) === -1) labels.push(styleObject.label);
				Object.assign(mergedStyle, styleObject);
			}
			delete mergedStyle.label;
			var key = (labels.length === 0 ? "css" : labels.join("-")) + "-" + ruleIndex++;
			getSheet().addRule(key, mergedStyle);
			var className = getSheet().classes[key];
			var cacheValue = {
				style: mergedStyle,
				labels,
				className
			};
			cache.set(argsStr, cacheValue);
			cache.set(className, cacheValue);
			return className;
		}
		css.getSheet = getSheet;
		return css;
	};
	css = createCss();
}));
//#endregion
//#region ../../node_modules/.pnpm/react-jss@10.10.0_react@19.2.8/node_modules/react-jss/dist/react-jss.cjs.js
var require_react_jss_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _extends = require_extends();
	var _objectWithoutPropertiesLoose = require_objectWithoutPropertiesLoose();
	var React$1 = __require("react");
	var hoistNonReactStatics = require_hoist_non_react_statics_cjs();
	var theming = (init_theming_esm(), __toCommonJS(theming_esm_exports));
	var isInBrowser = (init_module(), __toCommonJS(module_exports));
	init_tiny_warning_esm();
	var jss = (init_jss_esm(), __toCommonJS(jss_esm_exports));
	var preset = (init_jss_preset_default_esm(), __toCommonJS(jss_preset_default_esm_exports));
	var shallowEqual = __toCommonJS(index_esm_exports);
	var isPropValid = (init_is_prop_valid_browser_esm(), __toCommonJS(is_prop_valid_browser_esm_exports));
	var defaultCss = (init_css_jss_esm(), __toCommonJS(css_jss_esm_exports));
	function _interopDefaultLegacy(e) {
		return e && typeof e === "object" && "default" in e ? e : { "default": e };
	}
	var _extends__default = /*#__PURE__*/ _interopDefaultLegacy(_extends);
	var _objectWithoutPropertiesLoose__default = /*#__PURE__*/ _interopDefaultLegacy(_objectWithoutPropertiesLoose);
	var React__default = /*#__PURE__*/ _interopDefaultLegacy(React$1);
	var hoistNonReactStatics__default = /*#__PURE__*/ _interopDefaultLegacy(hoistNonReactStatics);
	var isInBrowser__default = /*#__PURE__*/ _interopDefaultLegacy(isInBrowser);
	var preset__default = /*#__PURE__*/ _interopDefaultLegacy(preset);
	var isPropValid__default = /*#__PURE__*/ _interopDefaultLegacy(isPropValid);
	var defaultCss__default = /*#__PURE__*/ _interopDefaultLegacy(defaultCss);
	var getDisplayName = function getDisplayName(Component) {
		return Component.displayName || Component.name || "Component";
	};
	var memoize = function memoize(fn) {
		var lastArgs;
		var lastResult;
		return function() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			if (Array.isArray(lastArgs) && args.length === lastArgs.length) {
				var isSame = true;
				for (var i = 0; i < args.length; i++) if (args[i] !== lastArgs[i]) isSame = false;
				if (isSame) return lastResult;
			}
			lastArgs = args;
			lastResult = fn.apply(void 0, args);
			return lastResult;
		};
	};
	var mergeClasses = function mergeClasses(baseClasses, additionalClasses) {
		var combinedClasses = _extends__default["default"]({}, baseClasses);
		for (var name in additionalClasses) combinedClasses[name] = name in combinedClasses ? combinedClasses[name] + " " + additionalClasses[name] : additionalClasses[name];
		return combinedClasses;
	};
	/**
	* Global index counter to preserve source order.
	* As we create the style sheet during componentWillMount lifecycle,
	* children are handled after the parents, so the order of style elements would
	* be parent->child. It is a problem though when a parent passes a className
	* which needs to override any childs styles. StyleSheet of the child has a higher
	* specificity, because of the source order.
	* So our solution is to render sheets them in the reverse order child->sheet, so
	* that parent has a higher specificity.
	*
	* We start at [Number.MIN_SAFE_INTEGER] to always insert sheets from react-jss first before any
	* sheet which might be inserted manually by the user.
	*/
	var index = Number.MIN_SAFE_INTEGER || -1e9;
	var getSheetIndex = function getSheetIndex() {
		return index++;
	};
	var JssContext = React$1.createContext({
		classNamePrefix: "",
		disableStylesGeneration: false,
		isSSR: !isInBrowser__default["default"]
	});
	var defaultManagers = /* @__PURE__ */ new Map();
	var getManager = function getManager(context, managerId) {
		var managers = context.managers;
		if (managers) {
			if (!managers[managerId]) managers[managerId] = new jss.SheetsManager();
			return managers[managerId];
		}
		var manager = defaultManagers.get(managerId);
		if (!manager) {
			manager = new jss.SheetsManager();
			defaultManagers.set(managerId, manager);
		}
		return manager;
	};
	var manageSheet = function manageSheet(options) {
		var sheet = options.sheet, context = options.context, index = options.index, theme = options.theme;
		if (!sheet) return;
		getManager(context, index).manage(theme);
		if (context.registry) context.registry.add(sheet);
	};
	var unmanageSheet = function unmanageSheet(options) {
		if (!options.sheet) return;
		getManager(options.context, options.index).unmanage(options.theme);
	};
	var defaultJss = jss.create(preset__default["default"]());
	var sheetsMeta = /* @__PURE__ */ new WeakMap();
	var getMeta = function getMeta(sheet) {
		return sheetsMeta.get(sheet);
	};
	var addMeta = function addMeta(sheet, meta) {
		sheetsMeta.set(sheet, meta);
	};
	var getStyles = function getStyles(options) {
		var styles = options.styles;
		if (typeof styles !== "function") return styles;
		return styles(options.theme);
	};
	function getSheetOptions(options, link) {
		var minify;
		if (options.context.id && options.context.id.minify != null) minify = options.context.id.minify;
		var classNamePrefix = options.context.classNamePrefix || "";
		if (options.name && !minify) classNamePrefix += options.name.replace(/\s/g, "-") + "-";
		var meta = "";
		if (options.name) meta = options.name + ", ";
		meta += typeof options.styles === "function" ? "Themed" : "Unthemed";
		return _extends__default["default"]({}, options.sheetOptions, {
			index: options.index,
			meta,
			classNamePrefix,
			link,
			generateId: options.sheetOptions && options.sheetOptions.generateId ? options.sheetOptions.generateId : options.context.generateId
		});
	}
	var createStyleSheet = function createStyleSheet(options) {
		if (options.context.disableStylesGeneration) return;
		var manager = getManager(options.context, options.index);
		var existingSheet = manager.get(options.theme);
		if (existingSheet) return existingSheet;
		var jss$1 = options.context.jss || defaultJss;
		var styles = getStyles(options);
		var dynamicStyles = jss.getDynamicStyles(styles);
		var sheet = jss$1.createStyleSheet(styles, getSheetOptions(options, dynamicStyles !== null));
		addMeta(sheet, {
			dynamicStyles,
			styles
		});
		manager.add(options.theme, sheet);
		return sheet;
	};
	var removeDynamicRules = function removeDynamicRules(sheet, rules) {
		for (var key in rules) sheet.deleteRule(rules[key]);
	};
	var updateDynamicRules = function updateDynamicRules(data, sheet, rules) {
		for (var key in rules) sheet.updateOne(rules[key], data);
	};
	var addDynamicRules = function addDynamicRules(sheet, data) {
		var meta = getMeta(sheet);
		if (!meta) return;
		var rules = {};
		for (var key in meta.dynamicStyles) {
			var initialRuleCount = sheet.rules.index.length;
			var originalRule = sheet.addRule(key, meta.dynamicStyles[key]);
			for (var i = initialRuleCount; i < sheet.rules.index.length; i++) {
				var rule = sheet.rules.index[i];
				sheet.updateOne(rule, data);
				rules[originalRule === rule ? key : rule.key] = rule;
			}
		}
		return rules;
	};
	var getSheetClasses = function getSheetClasses(sheet, dynamicRules) {
		if (!dynamicRules) return sheet.classes;
		var meta = getMeta(sheet);
		if (!meta) return sheet.classes;
		var classes = {};
		for (var key in meta.styles) {
			classes[key] = sheet.classes[key];
			if (key in dynamicRules) classes[key] += " " + sheet.classes[dynamicRules[key].key];
		}
		return classes;
	};
	function getUseInsertionEffect(isSSR) {
		return isSSR ? React$1.useEffect : React__default["default"].useInsertionEffect || React$1.useLayoutEffect;
	}
	var noTheme = {};
	var createUseStyles = function createUseStyles(styles, options) {
		if (options === void 0) options = {};
		var _options = options, _options$index = _options.index, index = _options$index === void 0 ? getSheetIndex() : _options$index, theming$1 = _options.theming, name = _options.name, sheetOptions = _objectWithoutPropertiesLoose__default["default"](_options, [
			"index",
			"theming",
			"name"
		]);
		var ThemeContext = theming$1 && theming$1.context || theming.ThemeContext;
		var useTheme = function useTheme(theme) {
			if (typeof styles === "function") return theme || React$1.useContext(ThemeContext) || noTheme;
			return noTheme;
		};
		var emptyObject = {};
		return function useStyles(data) {
			var isFirstMount = React$1.useRef(true);
			var context = React$1.useContext(JssContext);
			var theme = useTheme(data && data.theme);
			var _useMemo = React$1.useMemo(function() {
				var newSheet = createStyleSheet({
					context,
					styles,
					name,
					theme,
					index,
					sheetOptions
				});
				if (newSheet && context.isSSR) manageSheet({
					index,
					context,
					sheet: newSheet,
					theme
				});
				return [newSheet, newSheet ? addDynamicRules(newSheet, data) : null];
			}, [context, theme]), sheet = _useMemo[0], dynamicRules = _useMemo[1];
			getUseInsertionEffect(context.isSSR)(function() {
				if (sheet && dynamicRules && !isFirstMount.current) updateDynamicRules(data, sheet, dynamicRules);
			}, [data]);
			getUseInsertionEffect(context.isSSR)(function() {
				if (sheet) manageSheet({
					index,
					context,
					sheet,
					theme
				});
				return function() {
					if (sheet) {
						unmanageSheet({
							index,
							context,
							sheet,
							theme
						});
						if (dynamicRules) removeDynamicRules(sheet, dynamicRules);
					}
				};
			}, [sheet]);
			var classes = React$1.useMemo(function() {
				return sheet && dynamicRules ? getSheetClasses(sheet, dynamicRules) : emptyObject;
			}, [sheet, dynamicRules]);
			React$1.useDebugValue(classes);
			React$1.useDebugValue(theme === noTheme ? "No theme" : theme);
			React$1.useEffect(function() {
				isFirstMount.current = false;
			});
			return classes;
		};
	};
	var NoRenderer = function NoRenderer(props) {
		return props.children || null;
	};
	/**
	* HOC creator function that wrapps the user component.
	*
	* `withStyles(styles, [options])(Component)`
	*/
	var createWithStyles = function createWithStyles(styles, options) {
		if (options === void 0) options = {};
		var _options = options, _options$index = _options.index, index = _options$index === void 0 ? getSheetIndex() : _options$index, theming$1 = _options.theming, injectTheme = _options.injectTheme, sheetOptions = _objectWithoutPropertiesLoose__default["default"](_options, [
			"index",
			"theming",
			"injectTheme"
		]);
		var ThemeContext = theming$1 ? theming$1.context : theming.ThemeContext;
		return function(InnerComponent) {
			if (InnerComponent === void 0) InnerComponent = NoRenderer;
			var displayName = getDisplayName(InnerComponent);
			var mergeClassesProp = memoize(function(sheetClasses, classesProp) {
				return classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses;
			});
			var useStyles = createUseStyles(styles, Object.assign(sheetOptions, {
				theming: theming$1,
				index,
				name: displayName
			}));
			var WithStyles = React$1.forwardRef(function(props, ref) {
				var theme = React$1.useContext(ThemeContext);
				var newProps = _extends__default["default"]({}, props);
				if (injectTheme && newProps.theme == null) newProps.theme = theme;
				var classes = mergeClassesProp(useStyles(newProps), props.classes);
				return React$1.createElement(InnerComponent, _extends__default["default"]({}, newProps, {
					classes,
					ref
				}));
			});
			WithStyles.displayName = "WithStyles(" + displayName + ")";
			WithStyles.defaultProps = _extends__default["default"]({}, InnerComponent.defaultProps);
			WithStyles.InnerComponent = InnerComponent;
			return hoistNonReactStatics__default["default"](WithStyles, InnerComponent);
		};
	};
	var initialContext = {};
	function JssProvider(props) {
		var managersRef = React$1.useRef({});
		var prevContextRef = React$1.useRef();
		var registryRef = React$1.useRef(null);
		var createContext = function createContext(parentContext, prevContext) {
			if (prevContext === void 0) prevContext = initialContext;
			var registry = props.registry, classNamePrefix = props.classNamePrefix, jss$1 = props.jss, generateId = props.generateId, disableStylesGeneration = props.disableStylesGeneration, media = props.media, id = props.id, isSSR = props.isSSR;
			var context = _extends__default["default"]({}, parentContext);
			if (registry) {
				context.registry = registry;
				if (registry !== registryRef.current) {
					managersRef.current = {};
					registryRef.current = registry;
				}
			}
			context.managers = managersRef.current;
			if (id !== void 0) context.id = id;
			if (generateId !== void 0) context.generateId = generateId;
			else if (!context.generateId || !prevContext || context.id !== prevContext.id) context.generateId = jss.createGenerateId(context.id);
			if (classNamePrefix) context.classNamePrefix = (context.classNamePrefix || "") + classNamePrefix;
			if (media !== void 0) context.media = media;
			if (jss$1) context.jss = jss$1;
			if (disableStylesGeneration !== void 0) context.disableStylesGeneration = disableStylesGeneration;
			if (isSSR !== void 0) context.isSSR = isSSR;
			if (prevContext && shallowEqual.shallowEqualObjects(prevContext, context)) return prevContext;
			return context;
		};
		return React$1.createElement(JssContext.Consumer, null, function renderProvider(parentContext) {
			var children = props.children;
			var context = createContext(parentContext, prevContextRef.current);
			prevContextRef.current = context;
			return React$1.createElement(JssContext.Provider, { value: context }, children);
		});
	}
	var parseStyles = function parseStyles(args) {
		var dynamicStyles = [];
		var staticStyle;
		var labels = [];
		for (var key in args) {
			var style = args[key];
			if (!style) continue;
			if (typeof style === "function") dynamicStyles.push(style);
			else {
				if (!staticStyle) staticStyle = {};
				Object.assign(staticStyle, style);
				var _label = staticStyle.label;
				if (_label) {
					if (labels.indexOf(_label) === -1) labels.push(_label);
				}
			}
		}
		var styles = {};
		var label = labels.length === 0 ? "sc" : labels.join("-");
		if (staticStyle) {
			if ("label" in staticStyle) delete staticStyle.label;
			styles[label] = staticStyle;
		}
		if (dynamicStyles.length === 1) styles.scd = dynamicStyles[0];
		if (dynamicStyles.length > 1) styles.scd = function(props) {
			var merged = {};
			for (var i = 0; i < dynamicStyles.length; i++) {
				var dynamicStyle = dynamicStyles[i](props);
				if (dynamicStyle) Object.assign(merged, dynamicStyle);
			}
			return merged;
		};
		return {
			styles,
			label
		};
	};
	var shouldForwardPropSymbol = Symbol("react-jss-styled");
	var getShouldForwardProp = function getShouldForwardProp(tagOrComponent, options) {
		var shouldForwardProp = options.shouldForwardProp;
		var childShouldForwardProp = tagOrComponent[shouldForwardPropSymbol];
		var finalShouldForwardProp = shouldForwardProp || childShouldForwardProp;
		if (shouldForwardProp && childShouldForwardProp) finalShouldForwardProp = function finalShouldForwardProp(prop) {
			return childShouldForwardProp(prop) && shouldForwardProp(prop);
		};
		return finalShouldForwardProp;
	};
	var getChildProps = function getChildProps(props, shouldForwardProp, isTag) {
		var childProps = {};
		for (var prop in props) {
			if (shouldForwardProp) {
				if (shouldForwardProp(prop) === true) childProps[prop] = props[prop];
				continue;
			}
			if (isTag) {
				if (isPropValid__default["default"](prop)) childProps[prop] = props[prop];
				continue;
			}
			childProps[prop] = props[prop];
		}
		return childProps;
	};
	var configureStyled = function configureStyled(tagOrComponent, options) {
		if (options === void 0) options = {};
		var theming$1 = options.theming;
		var isTag = typeof tagOrComponent === "string";
		var ThemeContext = theming$1 ? theming$1.context : theming.ThemeContext;
		var shouldForwardProp = getShouldForwardProp(tagOrComponent, options), _options2 = options;
		_options2.shouldForwardProp;
		var hookOptions = _objectWithoutPropertiesLoose__default["default"](_options2, ["shouldForwardProp"]);
		return function createStyledComponent() {
			var _parseStyles = parseStyles(arguments), styles = _parseStyles.styles, label = _parseStyles.label;
			var useStyles = createUseStyles(styles, hookOptions);
			return function Styled(props) {
				var as = props.as, className = props.className;
				var theme = React$1.useContext(ThemeContext);
				var classes = useStyles(Object.assign({ theme }, props));
				var childProps = getChildProps(props, shouldForwardProp, isTag);
				var classNames = ((classes[label] || classes.sc || "") + " " + (classes.scd || "")).trim();
				childProps.className = className ? className + " " + classNames : classNames;
				if (!isTag && shouldForwardProp) tagOrComponent[shouldForwardPropSymbol] = shouldForwardProp;
				if (isTag && as) return React$1.createElement(as, childProps);
				return React$1.createElement(tagOrComponent, childProps);
			};
		};
	};
	var create = function create(css) {
		if (css === void 0) css = defaultCss__default["default"];
		return function createElement(type, props) {
			var args = arguments;
			if (props && props.css) {
				var className = css(props.css);
				var newProps = Object.assign({}, props);
				newProps.className = props.className ? props.className + " " + className : className;
				delete newProps.css;
				args[1] = newProps;
			}
			return React$1.createElement.apply(void 0, args);
		};
	};
	var jsx = create();
	Object.defineProperty(exports, "ThemeProvider", {
		enumerable: true,
		get: function() {
			return theming.ThemeProvider;
		}
	});
	Object.defineProperty(exports, "createTheming", {
		enumerable: true,
		get: function() {
			return theming.createTheming;
		}
	});
	Object.defineProperty(exports, "useTheme", {
		enumerable: true,
		get: function() {
			return theming.useTheme;
		}
	});
	Object.defineProperty(exports, "withTheme", {
		enumerable: true,
		get: function() {
			return theming.withTheme;
		}
	});
	Object.defineProperty(exports, "SheetsRegistry", {
		enumerable: true,
		get: function() {
			return jss.SheetsRegistry;
		}
	});
	Object.defineProperty(exports, "createGenerateId", {
		enumerable: true,
		get: function() {
			return jss.createGenerateId;
		}
	});
	exports.JssContext = JssContext;
	exports.JssProvider = JssProvider;
	exports.createJsx = create;
	exports.createUseStyles = createUseStyles;
	exports.default = createWithStyles;
	exports.jss = defaultJss;
	exports.jsx = jsx;
	exports.styled = configureStyled;
	exports.withStyles = createWithStyles;
}));
//#endregion
export default require_react_jss_cjs();
