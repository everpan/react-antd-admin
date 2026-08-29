import * as React from "react";
import { useContext } from "react";
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
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
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/objectSpread2.js
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
//#endregion
//#region ../../node_modules/.pnpm/@emotion+hash@0.8.0/node_modules/@emotion/hash/dist/hash.browser.esm.js
function murmur2(str) {
	var h = 0;
	var k, i = 0, len = str.length;
	for (; len >= 4; ++i, len -= 4) {
		k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
		k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
		k ^= k >>> 24;
		h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	switch (len) {
		case 3: h ^= (str.charCodeAt(i + 2) & 255) << 16;
		case 2: h ^= (str.charCodeAt(i + 1) & 255) << 8;
		case 1:
			h ^= str.charCodeAt(i) & 255;
			h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	h ^= h >>> 13;
	h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	return ((h ^ h >>> 15) >>> 0).toString(36);
}
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/Dom/canUseDom.js
function canUseDom() {
	return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/Dom/contains.js
function contains(root, n) {
	if (!root) return false;
	if (root.contains) return root.contains(n);
	var node = n;
	while (node) {
		if (node === root) return true;
		node = node.parentNode;
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/Dom/dynamicCSS.js
var APPEND_ORDER = "data-rc-order";
var APPEND_PRIORITY = "data-rc-priority";
var MARK_KEY = "rc-util-key";
var containerCache = /* @__PURE__ */ new Map();
function getMark() {
	var mark = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).mark;
	if (mark) return mark.startsWith("data-") ? mark : "data-".concat(mark);
	return MARK_KEY;
}
function getContainer(option) {
	if (option.attachTo) return option.attachTo;
	return document.querySelector("head") || document.body;
}
function getOrder(prepend) {
	if (prepend === "queue") return "prependQueue";
	return prepend ? "prepend" : "append";
}
/**
* Find style which inject by rc-util
*/
function findStyles(container) {
	return Array.from((containerCache.get(container) || container).children).filter(function(node) {
		return node.tagName === "STYLE";
	});
}
function injectCSS(css) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	if (!canUseDom()) return null;
	var csp = option.csp, prepend = option.prepend, _option$priority = option.priority, priority = _option$priority === void 0 ? 0 : _option$priority;
	var mergedOrder = getOrder(prepend);
	var isPrependQueue = mergedOrder === "prependQueue";
	var styleNode = document.createElement("style");
	styleNode.setAttribute(APPEND_ORDER, mergedOrder);
	if (isPrependQueue && priority) styleNode.setAttribute(APPEND_PRIORITY, "".concat(priority));
	if (csp !== null && csp !== void 0 && csp.nonce) styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
	styleNode.innerHTML = css;
	var container = getContainer(option);
	var firstChild = container.firstChild;
	if (prepend) {
		if (isPrependQueue) {
			var existStyle = (option.styles || findStyles(container)).filter(function(node) {
				if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER))) return false;
				return priority >= Number(node.getAttribute(APPEND_PRIORITY) || 0);
			});
			if (existStyle.length) {
				container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
				return styleNode;
			}
		}
		container.insertBefore(styleNode, firstChild);
	} else container.appendChild(styleNode);
	return styleNode;
}
function findExistNode(key) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var container = getContainer(option);
	return (option.styles || findStyles(container)).find(function(node) {
		return node.getAttribute(getMark(option)) === key;
	});
}
function removeCSS(key) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var existNode = findExistNode(key, option);
	if (existNode) getContainer(option).removeChild(existNode);
}
/**
* qiankun will inject `appendChild` to insert into other
*/
function syncRealContainer(container, option) {
	var cachedRealContainer = containerCache.get(container);
	if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
		var placeholderStyle = injectCSS("", option);
		var parentNode = placeholderStyle.parentNode;
		containerCache.set(container, parentNode);
		container.removeChild(placeholderStyle);
	}
}
function updateCSS(css, key) {
	var originOption = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
	var container = getContainer(originOption);
	var styles = findStyles(container);
	var option = _objectSpread2(_objectSpread2({}, originOption), {}, { styles });
	syncRealContainer(container, option);
	var existNode = findExistNode(key, option);
	if (existNode) {
		var _option$csp, _option$csp2;
		if ((_option$csp = option.csp) !== null && _option$csp !== void 0 && _option$csp.nonce && existNode.nonce !== ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)) {
			var _option$csp3;
			existNode.nonce = (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
		}
		if (existNode.innerHTML !== css) existNode.innerHTML = css;
		return existNode;
	}
	var newNode = injectCSS(css, option);
	newNode.setAttribute(getMark(option), key);
	return newNode;
}
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
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/hooks/useMemo.js
function useMemo(getValue, condition, shouldUpdate) {
	var cacheRef = React.useRef({});
	if (!("value" in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
		cacheRef.current.value = getValue();
		cacheRef.current.condition = condition;
	}
	return cacheRef.current.value;
}
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/warning.js
var warned = {};
var preWarningFns = [];
/**
* Pre warning enable you to parse content before console.error.
* Modify to null will prevent warning.
*/
var preMessage = function preMessage(fn) {
	preWarningFns.push(fn);
};
/**
* Warning if condition not match.
* @param valid Condition
* @param message Warning message
* @example
* ```js
* warning(false, 'some error'); // print some error
* warning(true, 'some error'); // print nothing
* warning(1 === 2, 'some error'); // print some error
* ```
*/
function warning(valid, message) {}
/** @see Similar to {@link warning} */
function note(valid, message) {}
function resetWarned() {
	warned = {};
}
function call(method, valid, message) {
	if (!valid && !warned[message]) {
		method(false, message);
		warned[message] = true;
	}
}
/** @see Same as {@link warning}, but only warn once for the same message */
function warningOnce(valid, message) {
	call(warning, valid, message);
}
/** @see Same as {@link warning}, but only warn once for the same message */
function noteOnce(valid, message) {
	call(note, valid, message);
}
warningOnce.preMessage = preMessage;
warningOnce.resetWarned = resetWarned;
warningOnce.noteOnce = noteOnce;
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/isEqual.js
/**
* Deeply compares two object literals.
* @param obj1 object 1
* @param obj2 object 2
* @param shallow shallow compare
* @returns
*/
function isEqual(obj1, obj2) {
	var shallow = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
	var refSet = /* @__PURE__ */ new Set();
	function deepEqual(a, b) {
		var level = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
		var circular = refSet.has(a);
		warningOnce(!circular, "Warning: There may be circular references");
		if (circular) return false;
		if (a === b) return true;
		if (shallow && level > 1) return false;
		refSet.add(a);
		var newLevel = level + 1;
		if (Array.isArray(a)) {
			if (!Array.isArray(b) || a.length !== b.length) return false;
			for (var i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i], newLevel)) return false;
			return true;
		}
		if (a && b && _typeof(a) === "object" && _typeof(b) === "object") {
			var keys = Object.keys(a);
			if (keys.length !== Object.keys(b).length) return false;
			return keys.every(function(key) {
				return deepEqual(a[key], b[key], newLevel);
			});
		}
		return false;
	}
	return deepEqual(obj1, obj2);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
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
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/Cache.js
var SPLIT = "%";
/** Connect key with `SPLIT` */
function pathKey(keys) {
	return keys.join(SPLIT);
}
var Entity = /*#__PURE__*/ function() {
	function Entity(instanceId) {
		_classCallCheck(this, Entity);
		_defineProperty(this, "instanceId", void 0);
		/** @private Internal cache map. Do not access this directly */
		_defineProperty(this, "cache", /* @__PURE__ */ new Map());
		_defineProperty(this, "extracted", /* @__PURE__ */ new Set());
		this.instanceId = instanceId;
	}
	_createClass(Entity, [
		{
			key: "get",
			value: function get(keys) {
				return this.opGet(pathKey(keys));
			}
		},
		{
			key: "opGet",
			value: function opGet(keyPathStr) {
				return this.cache.get(keyPathStr) || null;
			}
		},
		{
			key: "update",
			value: function update(keys, valueFn) {
				return this.opUpdate(pathKey(keys), valueFn);
			}
		},
		{
			key: "opUpdate",
			value: function opUpdate(keyPathStr, valueFn) {
				var nextValue = valueFn(this.cache.get(keyPathStr));
				if (nextValue === null) this.cache.delete(keyPathStr);
				else this.cache.set(keyPathStr, nextValue);
			}
		}
	]);
	return Entity;
}();
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/StyleContext.js
var _excluded = ["children"];
var ATTR_TOKEN = "data-token-hash";
var ATTR_MARK = "data-css-hash";
var CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
function createCache() {
	var cssinjsInstanceId = Math.random().toString(12).slice(2);
	if (typeof document !== "undefined" && document.head && document.body) {
		var styles = document.body.querySelectorAll("style[".concat("data-css-hash", "]")) || [];
		var firstChild = document.head.firstChild;
		Array.from(styles).forEach(function(style) {
			style[CSS_IN_JS_INSTANCE] = style["__cssinjs_instance__"] || cssinjsInstanceId;
			if (style["__cssinjs_instance__"] === cssinjsInstanceId) document.head.insertBefore(style, firstChild);
		});
		var styleHash = {};
		Array.from(document.querySelectorAll("style[".concat(ATTR_MARK, "]"))).forEach(function(style) {
			var hash = style.getAttribute(ATTR_MARK);
			if (styleHash[hash]) {
				if (style["__cssinjs_instance__"] === cssinjsInstanceId) {
					var _style$parentNode;
					(_style$parentNode = style.parentNode) === null || _style$parentNode === void 0 || _style$parentNode.removeChild(style);
				}
			} else styleHash[hash] = true;
		});
	}
	return new Entity(cssinjsInstanceId);
}
var StyleContext = /*#__PURE__*/ React.createContext({
	hashPriority: "low",
	cache: createCache(),
	defaultCache: true
});
var StyleProvider = function StyleProvider(props) {
	var children = props.children, restProps = _objectWithoutProperties(props, _excluded);
	var parentContext = React.useContext(StyleContext);
	var context = useMemo(function() {
		var mergedContext = _objectSpread2({}, parentContext);
		Object.keys(restProps).forEach(function(key) {
			var value = restProps[key];
			if (restProps[key] !== void 0) mergedContext[key] = value;
		});
		var cache = restProps.cache;
		mergedContext.cache = mergedContext.cache || createCache();
		mergedContext.defaultCache = !cache && parentContext.defaultCache;
		return mergedContext;
	}, [parentContext, restProps], function(prev, next) {
		return !isEqual(prev[0], next[0], true) || !isEqual(prev[1], next[1], true);
	});
	return /*#__PURE__*/ React.createElement(StyleContext.Provider, { value: context }, children);
};
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf(t, e);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/inherits.js
function _inherits(t, e) {
	if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
	t.prototype = Object.create(e && e.prototype, { constructor: {
		value: t,
		writable: !0,
		configurable: !0
	} }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(t) {
	return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
		return t.__proto__ || Object.getPrototypeOf(t);
	}, _getPrototypeOf(t);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function _possibleConstructorReturn(t, e) {
	if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
	if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(t);
}
//#endregion
//#region ../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/createSuper.js
function _createSuper(t) {
	var r = _isNativeReflectConstruct();
	return function() {
		var e, o = _getPrototypeOf(t);
		if (r) {
			var s = _getPrototypeOf(this).constructor;
			e = Reflect.construct(o, arguments, s);
		} else e = o.apply(this, arguments);
		return _possibleConstructorReturn(this, e);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/calc/calculator.js
var AbstractCalculator = /*#__PURE__*/ _createClass(function AbstractCalculator() {
	_classCallCheck(this, AbstractCalculator);
});
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/calc/CSSCalculator.js
var CALC_UNIT = "CALC_UNIT";
var regexp = new RegExp(CALC_UNIT, "g");
function unit$1(value) {
	if (typeof value === "number") return "".concat(value).concat(CALC_UNIT);
	return value;
}
var CSSCalculator = /*#__PURE__*/ function(_AbstractCalculator) {
	_inherits(CSSCalculator, _AbstractCalculator);
	var _super = _createSuper(CSSCalculator);
	function CSSCalculator(num, unitlessCssVar) {
		var _this;
		_classCallCheck(this, CSSCalculator);
		_this = _super.call(this);
		_defineProperty(_assertThisInitialized(_this), "result", "");
		_defineProperty(_assertThisInitialized(_this), "unitlessCssVar", void 0);
		_defineProperty(_assertThisInitialized(_this), "lowPriority", void 0);
		var numType = _typeof(num);
		_this.unitlessCssVar = unitlessCssVar;
		if (num instanceof CSSCalculator) _this.result = "(".concat(num.result, ")");
		else if (numType === "number") _this.result = unit$1(num);
		else if (numType === "string") _this.result = num;
		return _this;
	}
	_createClass(CSSCalculator, [
		{
			key: "add",
			value: function add(num) {
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " + ").concat(num.getResult());
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " + ").concat(unit$1(num));
				this.lowPriority = true;
				return this;
			}
		},
		{
			key: "sub",
			value: function sub(num) {
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " - ").concat(num.getResult());
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " - ").concat(unit$1(num));
				this.lowPriority = true;
				return this;
			}
		},
		{
			key: "mul",
			value: function mul(num) {
				if (this.lowPriority) this.result = "(".concat(this.result, ")");
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " * ").concat(num.getResult(true));
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " * ").concat(num);
				this.lowPriority = false;
				return this;
			}
		},
		{
			key: "div",
			value: function div(num) {
				if (this.lowPriority) this.result = "(".concat(this.result, ")");
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " / ").concat(num.getResult(true));
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " / ").concat(num);
				this.lowPriority = false;
				return this;
			}
		},
		{
			key: "getResult",
			value: function getResult(force) {
				return this.lowPriority || force ? "(".concat(this.result, ")") : this.result;
			}
		},
		{
			key: "equal",
			value: function equal(options) {
				var _this2 = this;
				var cssUnit = (options || {}).unit;
				var mergedUnit = true;
				if (typeof cssUnit === "boolean") mergedUnit = cssUnit;
				else if (Array.from(this.unitlessCssVar).some(function(cssVar) {
					return _this2.result.includes(cssVar);
				})) mergedUnit = false;
				this.result = this.result.replace(regexp, mergedUnit ? "px" : "");
				if (typeof this.lowPriority !== "undefined") return "calc(".concat(this.result, ")");
				return this.result;
			}
		}
	]);
	return CSSCalculator;
}(AbstractCalculator);
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/calc/NumCalculator.js
var NumCalculator = /*#__PURE__*/ function(_AbstractCalculator) {
	_inherits(NumCalculator, _AbstractCalculator);
	var _super = _createSuper(NumCalculator);
	function NumCalculator(num) {
		var _this;
		_classCallCheck(this, NumCalculator);
		_this = _super.call(this);
		_defineProperty(_assertThisInitialized(_this), "result", 0);
		if (num instanceof NumCalculator) _this.result = num.result;
		else if (typeof num === "number") _this.result = num;
		return _this;
	}
	_createClass(NumCalculator, [
		{
			key: "add",
			value: function add(num) {
				if (num instanceof NumCalculator) this.result += num.result;
				else if (typeof num === "number") this.result += num;
				return this;
			}
		},
		{
			key: "sub",
			value: function sub(num) {
				if (num instanceof NumCalculator) this.result -= num.result;
				else if (typeof num === "number") this.result -= num;
				return this;
			}
		},
		{
			key: "mul",
			value: function mul(num) {
				if (num instanceof NumCalculator) this.result *= num.result;
				else if (typeof num === "number") this.result *= num;
				return this;
			}
		},
		{
			key: "div",
			value: function div(num) {
				if (num instanceof NumCalculator) this.result /= num.result;
				else if (typeof num === "number") this.result /= num;
				return this;
			}
		},
		{
			key: "equal",
			value: function equal() {
				return this.result;
			}
		}
	]);
	return NumCalculator;
}(AbstractCalculator);
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/calc/index.js
var genCalc = function genCalc(type, unitlessCssVar) {
	var Calculator = type === "css" ? CSSCalculator : NumCalculator;
	return function(num) {
		return new Calculator(num, unitlessCssVar);
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/ThemeCache.js
function sameDerivativeOption(left, right) {
	if (left.length !== right.length) return false;
	for (var i = 0; i < left.length; i++) if (left[i] !== right[i]) return false;
	return true;
}
var ThemeCache = /*#__PURE__*/ function() {
	function ThemeCache() {
		_classCallCheck(this, ThemeCache);
		_defineProperty(this, "cache", void 0);
		_defineProperty(this, "keys", void 0);
		_defineProperty(this, "cacheCallTimes", void 0);
		this.cache = /* @__PURE__ */ new Map();
		this.keys = [];
		this.cacheCallTimes = 0;
	}
	_createClass(ThemeCache, [
		{
			key: "size",
			value: function size() {
				return this.keys.length;
			}
		},
		{
			key: "internalGet",
			value: function internalGet(derivativeOption) {
				var _cache2, _cache3;
				var updateCallTimes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
				var cache = { map: this.cache };
				derivativeOption.forEach(function(derivative) {
					if (!cache) cache = void 0;
					else {
						var _cache;
						cache = (_cache = cache) === null || _cache === void 0 || (_cache = _cache.map) === null || _cache === void 0 ? void 0 : _cache.get(derivative);
					}
				});
				if ((_cache2 = cache) !== null && _cache2 !== void 0 && _cache2.value && updateCallTimes) cache.value[1] = this.cacheCallTimes++;
				return (_cache3 = cache) === null || _cache3 === void 0 ? void 0 : _cache3.value;
			}
		},
		{
			key: "get",
			value: function get(derivativeOption) {
				var _this$internalGet;
				return (_this$internalGet = this.internalGet(derivativeOption, true)) === null || _this$internalGet === void 0 ? void 0 : _this$internalGet[0];
			}
		},
		{
			key: "has",
			value: function has(derivativeOption) {
				return !!this.internalGet(derivativeOption);
			}
		},
		{
			key: "set",
			value: function set(derivativeOption, value) {
				var _this = this;
				if (!this.has(derivativeOption)) {
					if (this.size() + 1 > ThemeCache.MAX_CACHE_SIZE + ThemeCache.MAX_CACHE_OFFSET) {
						var targetKey = _slicedToArray(this.keys.reduce(function(result, key) {
							var callTimes = _slicedToArray(result, 2)[1];
							if (_this.internalGet(key)[1] < callTimes) return [key, _this.internalGet(key)[1]];
							return result;
						}, [this.keys[0], this.cacheCallTimes]), 1)[0];
						this.delete(targetKey);
					}
					this.keys.push(derivativeOption);
				}
				var cache = this.cache;
				derivativeOption.forEach(function(derivative, index) {
					if (index === derivativeOption.length - 1) cache.set(derivative, { value: [value, _this.cacheCallTimes++] });
					else {
						var cacheValue = cache.get(derivative);
						if (!cacheValue) cache.set(derivative, { map: /* @__PURE__ */ new Map() });
						else if (!cacheValue.map) cacheValue.map = /* @__PURE__ */ new Map();
						cache = cache.get(derivative).map;
					}
				});
			}
		},
		{
			key: "deleteByPath",
			value: function deleteByPath(currentCache, derivatives) {
				var cache = currentCache.get(derivatives[0]);
				if (derivatives.length === 1) {
					var _cache$value;
					if (!cache.map) currentCache.delete(derivatives[0]);
					else currentCache.set(derivatives[0], { map: cache.map });
					return (_cache$value = cache.value) === null || _cache$value === void 0 ? void 0 : _cache$value[0];
				}
				var result = this.deleteByPath(cache.map, derivatives.slice(1));
				if ((!cache.map || cache.map.size === 0) && !cache.value) currentCache.delete(derivatives[0]);
				return result;
			}
		},
		{
			key: "delete",
			value: function _delete(derivativeOption) {
				if (this.has(derivativeOption)) {
					this.keys = this.keys.filter(function(item) {
						return !sameDerivativeOption(item, derivativeOption);
					});
					return this.deleteByPath(this.cache, derivativeOption);
				}
			}
		}
	]);
	return ThemeCache;
}();
_defineProperty(ThemeCache, "MAX_CACHE_SIZE", 20);
_defineProperty(ThemeCache, "MAX_CACHE_OFFSET", 5);
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/Theme.js
var uuid = 0;
/**
* Theme with algorithms to derive tokens from design tokens.
* Use `createTheme` first which will help to manage the theme instance cache.
*/
var Theme = /*#__PURE__*/ function() {
	function Theme(derivatives) {
		_classCallCheck(this, Theme);
		_defineProperty(this, "derivatives", void 0);
		_defineProperty(this, "id", void 0);
		this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
		this.id = uuid;
		if (derivatives.length === 0) derivatives.length;
		uuid += 1;
	}
	_createClass(Theme, [{
		key: "getDerivativeToken",
		value: function getDerivativeToken(token) {
			return this.derivatives.reduce(function(result, derivative) {
				return derivative(token, result);
			}, void 0);
		}
	}]);
	return Theme;
}();
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/theme/createTheme.js
var cacheThemes = new ThemeCache();
/**
* Same as new Theme, but will always return same one if `derivative` not changed.
*/
function createTheme(derivatives) {
	var derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
	if (!cacheThemes.has(derivativeArr)) cacheThemes.set(derivativeArr, new Theme(derivativeArr));
	return cacheThemes.get(derivativeArr);
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/util/index.js
var resultCache = /* @__PURE__ */ new WeakMap();
var RESULT_VALUE = {};
function memoResult(callback, deps) {
	var current = resultCache;
	for (var i = 0; i < deps.length; i += 1) {
		var dep = deps[i];
		if (!current.has(dep)) current.set(dep, /* @__PURE__ */ new WeakMap());
		current = current.get(dep);
	}
	if (!current.has(RESULT_VALUE)) current.set(RESULT_VALUE, callback());
	return current.get(RESULT_VALUE);
}
var flattenTokenCache = /* @__PURE__ */ new WeakMap();
/**
* Flatten token to string, this will auto cache the result when token not change
*/
function flattenToken(token) {
	var str = flattenTokenCache.get(token) || "";
	if (!str) {
		Object.keys(token).forEach(function(key) {
			var value = token[key];
			str += key;
			if (value instanceof Theme) str += value.id;
			else if (value && _typeof(value) === "object") str += flattenToken(value);
			else str += value;
		});
		str = murmur2(str);
		flattenTokenCache.set(token, str);
	}
	return str;
}
/**
* Convert derivative token to key string
*/
function token2key(token, salt) {
	return murmur2("".concat(salt, "_").concat(flattenToken(token)));
}
var randomSelectorKey = "random-".concat(Date.now(), "-").concat(Math.random()).replace(/\./g, "");
var checkContent = "_bAmBoO_";
function supportSelector(styleStr, handleElement, supportCheck) {
	if (canUseDom()) {
		var _getComputedStyle$con, _ele$parentNode;
		updateCSS(styleStr, randomSelectorKey);
		var _ele = document.createElement("div");
		_ele.style.position = "fixed";
		_ele.style.left = "0";
		_ele.style.top = "0";
		handleElement === null || handleElement === void 0 || handleElement(_ele);
		document.body.appendChild(_ele);
		var support = supportCheck ? supportCheck(_ele) : (_getComputedStyle$con = getComputedStyle(_ele).content) === null || _getComputedStyle$con === void 0 ? void 0 : _getComputedStyle$con.includes(checkContent);
		(_ele$parentNode = _ele.parentNode) === null || _ele$parentNode === void 0 || _ele$parentNode.removeChild(_ele);
		removeCSS(randomSelectorKey);
		return support;
	}
	return false;
}
var canWhere = void 0;
function supportWhere() {
	if (canWhere === void 0) canWhere = supportSelector(":where(.".concat(randomSelectorKey, ") { content: \"").concat(checkContent, "\"!important; }"), function(ele) {
		ele.className = randomSelectorKey;
	});
	return canWhere;
}
var canLogic = void 0;
function supportLogicProps() {
	if (canLogic === void 0) canLogic = supportSelector(".".concat(randomSelectorKey, " { inset-block: 93px !important; }"), function(ele) {
		ele.className = randomSelectorKey;
	}, function(ele) {
		return getComputedStyle(ele).bottom === "93px";
	});
	return canLogic;
}
var isClientSide = canUseDom();
function unit(num) {
	if (typeof num === "number") return "".concat(num, "px");
	return num;
}
function toStyleStr(style, tokenKey, styleId) {
	var customizeAttrs = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
	if (arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false) return style;
	var attrs = _objectSpread2(_objectSpread2({}, customizeAttrs), {}, _defineProperty(_defineProperty({}, ATTR_TOKEN, tokenKey), ATTR_MARK, styleId));
	var attrStr = Object.keys(attrs).map(function(attr) {
		var val = attrs[attr];
		return val ? "".concat(attr, "=\"").concat(val, "\"") : null;
	}).filter(function(v) {
		return v;
	}).join(" ");
	return "<style ".concat(attrStr, ">").concat(style, "</style>");
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/util/css-variables.js
var token2CSSVar = function token2CSSVar(token) {
	var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
	return "--".concat(prefix ? "".concat(prefix, "-") : "").concat(token).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2").replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
};
var serializeCSSVar = function serializeCSSVar(cssVars, hashId, options) {
	if (!Object.keys(cssVars).length) return "";
	return ".".concat(hashId).concat(options !== null && options !== void 0 && options.scope ? ".".concat(options.scope) : "", "{").concat(Object.entries(cssVars).map(function(_ref) {
		var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
		return "".concat(key, ":").concat(value, ";");
	}).join(""), "}");
};
var transformToken = function transformToken(token, themeKey, config) {
	var cssVars = {};
	var result = {};
	Object.entries(token).forEach(function(_ref3) {
		var _config$preserve, _config$ignore;
		var _ref4 = _slicedToArray(_ref3, 2), key = _ref4[0], value = _ref4[1];
		if (config !== null && config !== void 0 && (_config$preserve = config.preserve) !== null && _config$preserve !== void 0 && _config$preserve[key]) result[key] = value;
		else if ((typeof value === "string" || typeof value === "number") && !(config !== null && config !== void 0 && (_config$ignore = config.ignore) !== null && _config$ignore !== void 0 && _config$ignore[key])) {
			var _config$unitless;
			var cssVar = token2CSSVar(key, config === null || config === void 0 ? void 0 : config.prefix);
			cssVars[cssVar] = typeof value === "number" && !(config !== null && config !== void 0 && (_config$unitless = config.unitless) !== null && _config$unitless !== void 0 && _config$unitless[key]) ? "".concat(value, "px") : String(value);
			result[key] = "var(".concat(cssVar, ")");
		}
	});
	return [result, serializeCSSVar(cssVars, themeKey, { scope: config === null || config === void 0 ? void 0 : config.scope })];
};
//#endregion
//#region ../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/rc-util/es/hooks/useLayoutEffect.js
/**
* Wrap `React.useLayoutEffect` which will not throw warning message in test env
*/
var useInternalLayoutEffect = canUseDom() ? React.useLayoutEffect : React.useEffect;
var useLayoutEffect = function useLayoutEffect(callback, deps) {
	var firstMountRef = React.useRef(true);
	useInternalLayoutEffect(function() {
		return callback(firstMountRef.current);
	}, deps);
	useInternalLayoutEffect(function() {
		firstMountRef.current = false;
		return function() {
			firstMountRef.current = true;
		};
	}, []);
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/hooks/useCompatibleInsertionEffect.js
var useInsertionEffect = _objectSpread2({}, React).useInsertionEffect;
/**
* Compatible `useInsertionEffect`
* will use `useInsertionEffect` if React version >= 18,
* otherwise use `useInsertionEffectPolyfill`.
*/
var useCompatibleInsertionEffect = useInsertionEffect ? function(renderEffect, effect, deps) {
	return useInsertionEffect(function() {
		renderEffect();
		return effect();
	}, deps);
} : function useInsertionEffectPolyfill(renderEffect, effect, deps) {
	React.useMemo(renderEffect, deps);
	useLayoutEffect(function() {
		return effect(true);
	}, deps);
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/hooks/useEffectCleanupRegister.js
var useEffectCleanupRegister = typeof _objectSpread2({}, React).useInsertionEffect !== "undefined" ? function useCleanupRegister(deps) {
	var effectCleanups = [];
	var cleanupFlag = false;
	function register(fn) {
		if (cleanupFlag) return;
		effectCleanups.push(fn);
	}
	React.useEffect(function() {
		cleanupFlag = false;
		return function() {
			cleanupFlag = true;
			if (effectCleanups.length) effectCleanups.forEach(function(fn) {
				return fn();
			});
		};
	}, deps);
	return register;
} : function useRun() {
	return function(fn) {
		fn();
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/hooks/useGlobalCache.js
function useGlobalCache(prefix, keyPath, cacheFn, onCacheRemove, onCacheEffect) {
	var globalCache = React.useContext(StyleContext).cache;
	var fullPathStr = pathKey([prefix].concat(_toConsumableArray(keyPath)));
	var register = useEffectCleanupRegister([fullPathStr]);
	var buildCache = function buildCache(updater) {
		globalCache.opUpdate(fullPathStr, function(prevCache) {
			var _ref2 = _slicedToArray(prevCache || [void 0, void 0], 2), _ref2$ = _ref2[0];
			var data = [_ref2$ === void 0 ? 0 : _ref2$, _ref2[1] || cacheFn()];
			return updater ? updater(data) : data;
		});
	};
	React.useMemo(function() {
		buildCache();
	}, [fullPathStr]);
	var cacheContent = globalCache.opGet(fullPathStr)[1];
	useCompatibleInsertionEffect(function() {
		onCacheEffect === null || onCacheEffect === void 0 || onCacheEffect(cacheContent);
	}, function(polyfill) {
		buildCache(function(_ref3) {
			var _ref4 = _slicedToArray(_ref3, 2), times = _ref4[0], cache = _ref4[1];
			if (polyfill && times === 0) onCacheEffect === null || onCacheEffect === void 0 || onCacheEffect(cacheContent);
			return [times + 1, cache];
		});
		return function() {
			globalCache.opUpdate(fullPathStr, function(prevCache) {
				var _ref6 = _slicedToArray(prevCache || [], 2), _ref6$ = _ref6[0], times = _ref6$ === void 0 ? 0 : _ref6$, cache = _ref6[1];
				if (times - 1 === 0) {
					register(function() {
						if (polyfill || !globalCache.opGet(fullPathStr)) onCacheRemove === null || onCacheRemove === void 0 || onCacheRemove(cache, false);
					});
					return null;
				}
				return [times - 1, cache];
			});
		};
	}, [fullPathStr]);
	return cacheContent;
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/hooks/useCacheToken.js
var EMPTY_OVERRIDE = {};
var hashPrefix = "css";
var tokenKeys = /* @__PURE__ */ new Map();
function recordCleanToken(tokenKey) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}
function removeStyleTags(key, instanceId) {
	if (typeof document !== "undefined") document.querySelectorAll("style[".concat(ATTR_TOKEN, "=\"").concat(key, "\"]")).forEach(function(style) {
		if (style["__cssinjs_instance__"] === instanceId) {
			var _style$parentNode;
			(_style$parentNode = style.parentNode) === null || _style$parentNode === void 0 || _style$parentNode.removeChild(style);
		}
	});
}
var TOKEN_THRESHOLD = 0;
function cleanTokenStyle(tokenKey, instanceId) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
	var cleanableKeyList = /* @__PURE__ */ new Set();
	tokenKeys.forEach(function(value, key) {
		if (value <= 0) cleanableKeyList.add(key);
	});
	if (tokenKeys.size - cleanableKeyList.size > TOKEN_THRESHOLD) cleanableKeyList.forEach(function(key) {
		removeStyleTags(key, instanceId);
		tokenKeys.delete(key);
	});
}
var getComputedToken = function getComputedToken(originToken, overrideToken, theme, format) {
	var mergedDerivativeToken = _objectSpread2(_objectSpread2({}, theme.getDerivativeToken(originToken)), overrideToken);
	if (format) mergedDerivativeToken = format(mergedDerivativeToken);
	return mergedDerivativeToken;
};
var TOKEN_PREFIX = "token";
/**
* Cache theme derivative token as global shared one
* @param theme Theme entity
* @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
* @param option Additional config
* @returns Call Theme.getDerivativeToken(tokenObject) to get token
*/
function useCacheToken(theme, tokens) {
	var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
	var _useContext = useContext(StyleContext), instanceId = _useContext.cache.instanceId, container = _useContext.container;
	var _option$salt = option.salt, salt = _option$salt === void 0 ? "" : _option$salt, _option$override = option.override, override = _option$override === void 0 ? EMPTY_OVERRIDE : _option$override, formatToken = option.formatToken, compute = option.getComputedToken, cssVar = option.cssVar;
	var mergedToken = memoResult(function() {
		return Object.assign.apply(Object, [{}].concat(_toConsumableArray(tokens)));
	}, tokens);
	var tokenStr = flattenToken(mergedToken);
	var overrideTokenStr = flattenToken(override);
	var cssVarStr = cssVar ? flattenToken(cssVar) : "";
	return useGlobalCache(TOKEN_PREFIX, [
		salt,
		theme.id,
		tokenStr,
		overrideTokenStr,
		cssVarStr
	], function() {
		var _cssVar$key;
		var mergedDerivativeToken = compute ? compute(mergedToken, override, theme) : getComputedToken(mergedToken, override, theme, formatToken);
		var actualToken = _objectSpread2({}, mergedDerivativeToken);
		var cssVarsStr = "";
		if (!!cssVar) {
			var _transformToken2 = _slicedToArray(transformToken(mergedDerivativeToken, cssVar.key, {
				prefix: cssVar.prefix,
				ignore: cssVar.ignore,
				unitless: cssVar.unitless,
				preserve: cssVar.preserve
			}), 2);
			mergedDerivativeToken = _transformToken2[0];
			cssVarsStr = _transformToken2[1];
		}
		var tokenKey = token2key(mergedDerivativeToken, salt);
		mergedDerivativeToken._tokenKey = tokenKey;
		actualToken._tokenKey = token2key(actualToken, salt);
		var themeKey = (_cssVar$key = cssVar === null || cssVar === void 0 ? void 0 : cssVar.key) !== null && _cssVar$key !== void 0 ? _cssVar$key : tokenKey;
		mergedDerivativeToken._themeKey = themeKey;
		recordCleanToken(themeKey);
		var hashId = "".concat(hashPrefix, "-").concat(murmur2(tokenKey));
		mergedDerivativeToken._hashId = hashId;
		return [
			mergedDerivativeToken,
			hashId,
			actualToken,
			cssVarsStr,
			(cssVar === null || cssVar === void 0 ? void 0 : cssVar.key) || ""
		];
	}, function(cache) {
		cleanTokenStyle(cache[0]._themeKey, instanceId);
	}, function(_ref) {
		var _ref2 = _slicedToArray(_ref, 4), token = _ref2[0], cssVarsStr = _ref2[3];
		if (cssVar && cssVarsStr) {
			var style = updateCSS(cssVarsStr, murmur2("css-variables-".concat(token._themeKey)), {
				mark: ATTR_MARK,
				prepend: "queue",
				attachTo: container,
				priority: -999
			});
			style[CSS_IN_JS_INSTANCE] = instanceId;
			style.setAttribute(ATTR_TOKEN, token._themeKey);
		}
	});
}
var extract$2 = function extract(cache, effectStyles, options) {
	var _cache = _slicedToArray(cache, 5), realToken = _cache[2], styleStr = _cache[3], cssVarKey = _cache[4];
	var plain = (options || {}).plain;
	if (!styleStr) return null;
	var styleId = realToken._tokenKey;
	var order = -999;
	return [
		order,
		styleId,
		toStyleStr(styleStr, cssVarKey, styleId, {
			"data-rc-order": "prependQueue",
			"data-rc-priority": "".concat(order)
		}, plain)
	];
};
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
//#endregion
//#region ../../node_modules/.pnpm/@emotion+unitless@0.7.5/node_modules/@emotion/unitless/dist/unitless.browser.esm.js
var unitlessKeys = {
	animationIterationCount: 1,
	borderImageOutset: 1,
	borderImageSlice: 1,
	borderImageWidth: 1,
	boxFlex: 1,
	boxFlexGroup: 1,
	boxOrdinalGroup: 1,
	columnCount: 1,
	columns: 1,
	flex: 1,
	flexGrow: 1,
	flexPositive: 1,
	flexShrink: 1,
	flexNegative: 1,
	flexOrder: 1,
	gridRow: 1,
	gridRowEnd: 1,
	gridRowSpan: 1,
	gridRowStart: 1,
	gridColumn: 1,
	gridColumnEnd: 1,
	gridColumnSpan: 1,
	gridColumnStart: 1,
	msGridRow: 1,
	msGridRowSpan: 1,
	msGridColumn: 1,
	msGridColumnSpan: 1,
	fontWeight: 1,
	lineHeight: 1,
	opacity: 1,
	order: 1,
	orphans: 1,
	tabSize: 1,
	widows: 1,
	zIndex: 1,
	zoom: 1,
	WebkitLineClamp: 1,
	fillOpacity: 1,
	floodOpacity: 1,
	stopOpacity: 1,
	strokeDasharray: 1,
	strokeDashoffset: 1,
	strokeMiterlimit: 1,
	strokeOpacity: 1,
	strokeWidth: 1
};
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Enum.js
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var NAMESPACE = "@namespace";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Utility.js
/**
* @param {number}
* @return {number}
*/
var abs = Math.abs;
/**
* @param {number}
* @return {string}
*/
var from = String.fromCharCode;
/**
* @param {string} value
* @return {string}
*/
function trim(value) {
	return value.trim();
}
/**
* @param {string} value
* @param {(string|RegExp)} pattern
* @param {string} replacement
* @return {string}
*/
function replace(value, pattern, replacement) {
	return value.replace(pattern, replacement);
}
/**
* @param {string} value
* @param {number} index
* @return {number}
*/
function charat(value, index) {
	return value.charCodeAt(index) | 0;
}
/**
* @param {string} value
* @param {number} begin
* @param {number} end
* @return {string}
*/
function substr(value, begin, end) {
	return value.slice(begin, end);
}
/**
* @param {string} value
* @return {number}
*/
function strlen(value) {
	return value.length;
}
/**
* @param {any[]} value
* @return {number}
*/
function sizeof(value) {
	return value.length;
}
/**
* @param {any} value
* @param {any[]} array
* @return {any}
*/
function append(value, array) {
	return array.push(value), value;
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
/**
* @param {string} value
* @param {object | null} root
* @param {object | null} parent
* @param {string} type
* @param {string[] | string} props
* @param {object[] | string} children
* @param {object[]} siblings
* @param {number} length
*/
function node(value, root, parent, type, props, children, length, siblings) {
	return {
		value,
		root,
		parent,
		type,
		props,
		children,
		line,
		column,
		length,
		return: "",
		siblings
	};
}
/**
* @return {number}
*/
function char() {
	return character;
}
/**
* @return {number}
*/
function prev() {
	character = position > 0 ? charat(characters, --position) : 0;
	if (column--, character === 10) column = 1, line--;
	return character;
}
/**
* @return {number}
*/
function next() {
	character = position < length ? charat(characters, position++) : 0;
	if (column++, character === 10) column = 1, line++;
	return character;
}
/**
* @return {number}
*/
function peek() {
	return charat(characters, position);
}
/**
* @return {number}
*/
function caret() {
	return position;
}
/**
* @param {number} begin
* @param {number} end
* @return {string}
*/
function slice(begin, end) {
	return substr(characters, begin, end);
}
/**
* @param {number} type
* @return {number}
*/
function token(type) {
	switch (type) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
/**
* @param {string} value
* @return {any[]}
*/
function alloc(value) {
	return line = column = 1, length = strlen(characters = value), position = 0, [];
}
/**
* @param {any} value
* @return {any}
*/
function dealloc(value) {
	return characters = "", value;
}
/**
* @param {number} type
* @return {string}
*/
function delimit(type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
/**
* @param {number} type
* @return {string}
*/
function whitespace(type) {
	while (character = peek()) if (character < 33) next();
	else break;
	return token(type) > 2 || token(character) > 3 ? "" : " ";
}
/**
* @param {number} index
* @param {number} count
* @return {string}
*/
function escaping(index, count) {
	while (--count && next()) if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
/**
* @param {number} type
* @return {number}
*/
function delimiter(type) {
	while (next()) switch (character) {
		case type: return position;
		case 34:
		case 39:
			if (type !== 34 && type !== 39) delimiter(character);
			break;
		case 40:
			if (type === 41) delimiter(type);
			break;
		case 92: next();
	}
	return position;
}
/**
* @param {number} type
* @param {number} index
* @return {number}
*/
function commenter(type, index) {
	while (next()) if (type + character === 57) break;
	else if (type + character === 84 && peek() === 47) break;
	return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
/**
* @param {number} index
* @return {string}
*/
function identifier(index) {
	while (!token(peek())) next();
	return slice(index, position);
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Parser.js
/**
* @param {string} value
* @return {object[]}
*/
function compile(value) {
	return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {string[]} rule
* @param {string[]} rules
* @param {string[]} rulesets
* @param {number[]} pseudo
* @param {number[]} points
* @param {string[]} declarations
* @return {object}
*/
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var parens = 0;
	var character = 0;
	var type = "";
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;
	while (scanning) switch (previous = character, character = next()) {
		case 40:
			if (previous != 108 && charat(characters, length - 1) == 58) parens++, characters += "(";
			else characters += delimit(character);
			break;
		case 41:
			parens--, characters += ")";
			break;
		case 34:
		case 39:
		case 91:
			characters += delimit(character);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (parens > 0) {
				characters += from(character);
				break;
			}
			characters += whitespace(previous);
			break;
		case 92:
			characters += escaping(caret() - 1, 7);
			continue;
		case 47:
			switch (peek()) {
				case 42:
				case 47:
					append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
					if ((token(previous || 1) == 5 || token(peek() || 1) == 5) && strlen(characters) && substr(characters, -1, void 0) !== " ") characters += " ";
					break;
				default: characters += "/";
			}
			break;
		case 123 * variable: points[index++] = strlen(characters) * ampersand;
		case 125 * variable:
		case 59:
		case 0:
			if (parens > 0 && character) {
				characters += from(character);
				break;
			}
			switch (character) {
				case 0:
				case 125: scanning = 0;
				case 59 + offset:
					if (ampersand == -1) characters = replace(characters, /\f/g, "");
					if (property > 0 && (strlen(characters) - length || variable === 0)) append(property > 32 ? declaration(characters + ";", rule, parent, length - 1, declarations) : declaration(replace(characters, " ", "") + ";", rule, parent, length - 2, declarations), declarations);
					break;
				case 59: characters += ";";
				default:
					append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);
					if (character === 123) if (offset === 0) parse(characters, root, reference, reference, props, rulesets, length, points, children);
					else {
						switch (atrule) {
							case 99: if (charat(characters, 3) === 110) break;
							case 108: if (charat(characters, 2) === 97) break;
							default: offset = 0;
							case 100:
							case 109:
							case 115:
						}
						if (offset) parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
						else parse(characters, reference, reference, reference, [""], children, 0, points, children);
					}
			}
			index = offset = property = 0, variable = ampersand = 1, type = characters = "", length = pseudo;
			break;
		case 58: length = 1 + strlen(characters), property = previous;
		default:
			if (variable < 1) {
				if (character == 123) --variable;
				else if (character == 125 && variable++ == 0 && prev() == 125) continue;
			}
			switch (characters += from(character), character * variable) {
				case 38:
					ampersand = offset > 0 ? 1 : (characters += "\f", -1);
					break;
				case 44:
					if (parens > 0) break;
					points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
					break;
				case 64:
					if (peek() === 45) characters += delimit(next());
					atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
					break;
				case 45: if (previous === 45 && strlen(characters) == 2) variable = 0;
			}
	}
	return rulesets;
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} index
* @param {number} offset
* @param {string[]} rules
* @param {number[]} points
* @param {string} type
* @param {string[]} props
* @param {string[]} children
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [""];
	var size = sizeof(rule);
	for (var i = 0, j = 0, k = 0; i < index; ++i) for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x) if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x]))) props[k++] = z;
	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length, siblings);
}
/**
* @param {number} value
* @param {object} root
* @param {object?} parent
* @param {object[]} siblings
* @return {object}
*/
function comment(value, root, parent, siblings) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function declaration(value, root, parent, length, siblings) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length, siblings);
}
//#endregion
//#region ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Serializer.js
/**
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function serialize$1(children, callback) {
	var output = "";
	for (var i = 0; i < children.length; i++) output += callback(children[i], i, children, callback) || "";
	return output;
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function stringify(element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break;
		case IMPORT:
		case NAMESPACE:
		case DECLARATION: return element.return = element.return || element.value;
		case COMMENT: return "";
		case KEYFRAMES: return element.return = element.value + "{" + serialize$1(element.children, callback) + "}";
		case RULESET: if (!strlen(element.value = element.props.join(","))) return "";
	}
	return strlen(children = serialize$1(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/linters/utils.js
function lintWarning(message, info) {
	var path = info.path, parentSelectors = info.parentSelectors;
	warningOnce(false, "[Ant Design CSS-in-JS] ".concat(path ? "Error in ".concat(path, ": ") : "").concat(message).concat(parentSelectors.length ? " Selector: ".concat(parentSelectors.join(" | ")) : ""));
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/linters/legacyNotSelectorLinter.js
function isConcatSelector(selector) {
	var _selector$match;
	return (((_selector$match = selector.match(/:not\(([^)]*)\)/)) === null || _selector$match === void 0 ? void 0 : _selector$match[1]) || "").split(/(\[[^[]*])|(?=[.#])/).filter(function(str) {
		return str;
	}).length > 1;
}
function parsePath(info) {
	return info.parentSelectors.reduce(function(prev, cur) {
		if (!prev) return cur;
		return cur.includes("&") ? cur.replace(/&/g, prev) : "".concat(prev, " ").concat(cur);
	}, "");
}
var linter$1 = function linter(key, value, info) {
	var notList = parsePath(info).match(/:not\([^)]*\)/g) || [];
	if (notList.length > 0 && notList.some(isConcatSelector)) lintWarning("Concat ':not' selector not support in legacy browsers.", info);
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/linters/logicalPropertiesLinter.js
var linter$2 = function linter(key, value, info) {
	switch (key) {
		case "marginLeft":
		case "marginRight":
		case "paddingLeft":
		case "paddingRight":
		case "left":
		case "right":
		case "borderLeft":
		case "borderLeftWidth":
		case "borderLeftStyle":
		case "borderLeftColor":
		case "borderRight":
		case "borderRightWidth":
		case "borderRightStyle":
		case "borderRightColor":
		case "borderTopLeftRadius":
		case "borderTopRightRadius":
		case "borderBottomLeftRadius":
		case "borderBottomRightRadius":
			lintWarning("You seem to be using non-logical property '".concat(key, "' which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties."), info);
			return;
		case "margin":
		case "padding":
		case "borderWidth":
		case "borderStyle":
			if (typeof value === "string") {
				var valueArr = value.split(" ").map(function(item) {
					return item.trim();
				});
				if (valueArr.length === 4 && valueArr[1] !== valueArr[3]) lintWarning("You seem to be using '".concat(key, "' property with different left ").concat(key, " and right ").concat(key, ", which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties."), info);
			}
			return;
		case "clear":
		case "textAlign":
			if (value === "left" || value === "right") lintWarning("You seem to be using non-logical value '".concat(value, "' of ").concat(key, ", which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties."), info);
			return;
		case "borderRadius":
			if (typeof value === "string") {
				if (value.split("/").map(function(item) {
					return item.trim();
				}).reduce(function(result, group) {
					if (result) return result;
					var radiusArr = group.split(" ").map(function(item) {
						return item.trim();
					});
					if (radiusArr.length >= 2 && radiusArr[0] !== radiusArr[1]) return true;
					if (radiusArr.length === 3 && radiusArr[1] !== radiusArr[2]) return true;
					if (radiusArr.length === 4 && radiusArr[2] !== radiusArr[3]) return true;
					return result;
				}, false)) lintWarning("You seem to be using non-logical value '".concat(value, "' of ").concat(key, ", which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties."), info);
			}
			return;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/linters/NaNLinter.js
var linter = function linter(key, value, info) {
	if (typeof value === "string" && /NaN/g.test(value) || Number.isNaN(value)) lintWarning("Unexpected 'NaN' in property '".concat(key, ": ").concat(value, "'."), info);
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/linters/parentSelectorLinter.js
var linter$3 = function linter(key, value, info) {
	if (info.parentSelectors.some(function(selector) {
		return selector.split(",").some(function(item) {
			return item.split("&").length > 2;
		});
	})) lintWarning("Should not use more than one `&` in a selector.", info);
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/util/cacheMapUtil.js
var ATTR_CACHE_MAP = "data-ant-cssinjs-cache-path";
/**
* This marks style from the css file.
* Which means not exist in `<style />` tag.
*/
var CSS_FILE_STYLE = "_FILE_STYLE__";
function serialize(cachePathMap) {
	return Object.keys(cachePathMap).map(function(path) {
		var hash = cachePathMap[path];
		return "".concat(path, ":").concat(hash);
	}).join(";");
}
var cachePathMap;
var fromCSSFile = true;
function prepare() {
	if (!cachePathMap) {
		cachePathMap = {};
		if (canUseDom()) {
			var div = document.createElement("div");
			div.className = ATTR_CACHE_MAP;
			div.style.position = "fixed";
			div.style.visibility = "hidden";
			div.style.top = "-9999px";
			document.body.appendChild(div);
			var content = getComputedStyle(div).content || "";
			content = content.replace(/^"/, "").replace(/"$/, "");
			content.split(";").forEach(function(item) {
				var _item$split2 = _slicedToArray(item.split(":"), 2), path = _item$split2[0], hash = _item$split2[1];
				cachePathMap[path] = hash;
			});
			var inlineMapStyle = document.querySelector("style[".concat(ATTR_CACHE_MAP, "]"));
			if (inlineMapStyle) {
				var _inlineMapStyle$paren;
				fromCSSFile = false;
				(_inlineMapStyle$paren = inlineMapStyle.parentNode) === null || _inlineMapStyle$paren === void 0 || _inlineMapStyle$paren.removeChild(inlineMapStyle);
			}
			document.body.removeChild(div);
		}
	}
}
function existPath(path) {
	prepare();
	return !!cachePathMap[path];
}
function getStyleAndHash(path) {
	var hash = cachePathMap[path];
	var styleStr = null;
	if (hash && canUseDom()) {
		if (fromCSSFile) styleStr = CSS_FILE_STYLE;
		else {
			var _style = document.querySelector("style[".concat(ATTR_MARK, "=\"").concat(cachePathMap[path], "\"]"));
			if (_style) styleStr = _style.innerHTML;
			else delete cachePathMap[path];
		}
	}
	return [styleStr, hash];
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/hooks/useStyleRegister.js
var SKIP_CHECK = "_skip_check_";
var MULTI_VALUE = "_multi_value_";
function normalizeStyle(styleStr) {
	return serialize$1(compile(styleStr), stringify).replace(/\{%%%\:[^;];}/g, ";");
}
function isCompoundCSSProperty(value) {
	return _typeof(value) === "object" && value && (SKIP_CHECK in value || MULTI_VALUE in value);
}
function injectSelectorHash(key, hashId, hashPriority) {
	if (!hashId) return key;
	var hashClassName = ".".concat(hashId);
	var hashSelector = hashPriority === "low" ? ":where(".concat(hashClassName, ")") : hashClassName;
	return key.split(",").map(function(k) {
		var _firstPath$match;
		var fullPath = k.trim().split(/\s+/);
		var firstPath = fullPath[0] || "";
		var htmlElement = ((_firstPath$match = firstPath.match(/^\w+/)) === null || _firstPath$match === void 0 ? void 0 : _firstPath$match[0]) || "";
		firstPath = "".concat(htmlElement).concat(hashSelector).concat(firstPath.slice(htmlElement.length));
		return [firstPath].concat(_toConsumableArray(fullPath.slice(1))).join(" ");
	}).join(",");
}
var parseStyle = function parseStyle(interpolation) {
	var config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
		root: true,
		parentSelectors: []
	}, root = _ref.root, injectHash = _ref.injectHash, parentSelectors = _ref.parentSelectors, hashId = config.hashId, layer = config.layer;
	config.path;
	var hashPriority = config.hashPriority, _config$transformers = config.transformers, transformers = _config$transformers === void 0 ? [] : _config$transformers;
	config.linters;
	var styleStr = "";
	var effectStyle = {};
	function parseKeyframes(keyframes) {
		var animationName = keyframes.getName(hashId);
		if (!effectStyle[animationName]) {
			var _parsedStr = _slicedToArray(parseStyle(keyframes.style, config, {
				root: false,
				parentSelectors
			}), 1)[0];
			effectStyle[animationName] = "@keyframes ".concat(keyframes.getName(hashId)).concat(_parsedStr);
		}
	}
	function flattenList(list) {
		var fullList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
		list.forEach(function(item) {
			if (Array.isArray(item)) flattenList(item, fullList);
			else if (item) fullList.push(item);
		});
		return fullList;
	}
	flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]).forEach(function(originStyle) {
		var style = typeof originStyle === "string" && !root ? {} : originStyle;
		if (typeof style === "string") styleStr += "".concat(style, "\n");
		else if (style._keyframe) parseKeyframes(style);
		else {
			var mergedStyle = transformers.reduce(function(prev, trans) {
				var _trans$visit;
				return (trans === null || trans === void 0 || (_trans$visit = trans.visit) === null || _trans$visit === void 0 ? void 0 : _trans$visit.call(trans, prev)) || prev;
			}, style);
			Object.keys(mergedStyle).forEach(function(key) {
				var value = mergedStyle[key];
				if (_typeof(value) === "object" && value && (key !== "animationName" || !value._keyframe) && !isCompoundCSSProperty(value)) {
					var subInjectHash = false;
					var mergedKey = key.trim();
					var nextRoot = false;
					if ((root || injectHash) && hashId) {
						if (mergedKey.startsWith("@")) subInjectHash = true;
						else if (mergedKey === "&") mergedKey = injectSelectorHash("", hashId, hashPriority);
						else mergedKey = injectSelectorHash(key, hashId, hashPriority);
					} else if (root && !hashId && (mergedKey === "&" || mergedKey === "")) {
						mergedKey = "";
						nextRoot = true;
					}
					var _parseStyle4 = _slicedToArray(parseStyle(value, config, {
						root: nextRoot,
						injectHash: subInjectHash,
						parentSelectors: [].concat(_toConsumableArray(parentSelectors), [mergedKey])
					}), 2), _parsedStr2 = _parseStyle4[0], childEffectStyle = _parseStyle4[1];
					effectStyle = _objectSpread2(_objectSpread2({}, effectStyle), childEffectStyle);
					styleStr += "".concat(mergedKey).concat(_parsedStr2);
				} else {
					var _value;
					function appendStyle(cssKey, cssValue) {
						var styleName = cssKey.replace(/[A-Z]/g, function(match) {
							return "-".concat(match.toLowerCase());
						});
						var formatValue = cssValue;
						if (!unitlessKeys[cssKey] && typeof formatValue === "number" && formatValue !== 0) formatValue = "".concat(formatValue, "px");
						if (cssKey === "animationName" && cssValue !== null && cssValue !== void 0 && cssValue._keyframe) {
							parseKeyframes(cssValue);
							formatValue = cssValue.getName(hashId);
						}
						styleStr += "".concat(styleName, ":").concat(formatValue, ";");
					}
					var actualValue = (_value = value === null || value === void 0 ? void 0 : value.value) !== null && _value !== void 0 ? _value : value;
					if (_typeof(value) === "object" && value !== null && value !== void 0 && value[MULTI_VALUE] && Array.isArray(actualValue)) actualValue.forEach(function(item) {
						appendStyle(key, item);
					});
					else appendStyle(key, actualValue);
				}
			});
		}
	});
	if (!root) styleStr = "{".concat(styleStr, "}");
	else if (layer) {
		if (styleStr) styleStr = "@layer ".concat(layer.name, " {").concat(styleStr, "}");
		if (layer.dependencies) effectStyle["@layer ".concat(layer.name)] = layer.dependencies.map(function(deps) {
			return "@layer ".concat(deps, ", ").concat(layer.name, ";");
		}).join("\n");
	}
	return [styleStr, effectStyle];
};
function uniqueHash(path, styleStr) {
	return murmur2("".concat(path.join("%")).concat(styleStr));
}
function Empty() {
	return null;
}
var STYLE_PREFIX = "style";
/**
* Register a style to the global style sheet.
*/
function useStyleRegister(info, styleFn) {
	var token = info.token, path = info.path, hashId = info.hashId, layer = info.layer, nonce = info.nonce, clientOnly = info.clientOnly, _info$order = info.order, order = _info$order === void 0 ? 0 : _info$order, _React$useContext = React.useContext(StyleContext), autoClear = _React$useContext.autoClear;
	_React$useContext.mock;
	var defaultCache = _React$useContext.defaultCache, hashPriority = _React$useContext.hashPriority, container = _React$useContext.container, ssrInline = _React$useContext.ssrInline, transformers = _React$useContext.transformers, linters = _React$useContext.linters, cache = _React$useContext.cache, enableLayer = _React$useContext.layer;
	var tokenKey = token._tokenKey;
	var fullPath = [tokenKey];
	if (enableLayer) fullPath.push("layer");
	fullPath.push.apply(fullPath, _toConsumableArray(path));
	var isMergedClientSide = isClientSide;
	var _useGlobalCache2 = _slicedToArray(useGlobalCache(STYLE_PREFIX, fullPath, function() {
		var cachePath = fullPath.join("|");
		if (existPath(cachePath)) {
			var _getStyleAndHash2 = _slicedToArray(getStyleAndHash(cachePath), 2), inlineCacheStyleStr = _getStyleAndHash2[0], styleHash = _getStyleAndHash2[1];
			if (inlineCacheStyleStr) return [
				inlineCacheStyleStr,
				tokenKey,
				styleHash,
				{},
				clientOnly,
				order
			];
		}
		var _parseStyle6 = _slicedToArray(parseStyle(styleFn(), {
			hashId,
			hashPriority,
			layer: enableLayer ? layer : void 0,
			path: path.join("-"),
			transformers,
			linters
		}), 2), parsedStyle = _parseStyle6[0], effectStyle = _parseStyle6[1];
		var styleStr = normalizeStyle(parsedStyle);
		return [
			styleStr,
			tokenKey,
			uniqueHash(fullPath, styleStr),
			effectStyle,
			clientOnly,
			order
		];
	}, function(_ref2, fromHMR) {
		var styleId = _slicedToArray(_ref2, 3)[2];
		if ((fromHMR || autoClear) && isClientSide) removeCSS(styleId, {
			mark: ATTR_MARK,
			attachTo: container
		});
	}, function(_ref4) {
		var _ref5 = _slicedToArray(_ref4, 4), styleStr = _ref5[0];
		_ref5[1];
		var styleId = _ref5[2], effectStyle = _ref5[3];
		if (isMergedClientSide && styleStr !== "_FILE_STYLE__") {
			var mergedCSSConfig = {
				mark: ATTR_MARK,
				prepend: enableLayer ? false : "queue",
				attachTo: container,
				priority: order
			};
			var nonceStr = typeof nonce === "function" ? nonce() : nonce;
			if (nonceStr) mergedCSSConfig.csp = { nonce: nonceStr };
			var effectLayerKeys = [];
			var effectRestKeys = [];
			Object.keys(effectStyle).forEach(function(key) {
				if (key.startsWith("@layer")) effectLayerKeys.push(key);
				else effectRestKeys.push(key);
			});
			effectLayerKeys.forEach(function(effectKey) {
				updateCSS(normalizeStyle(effectStyle[effectKey]), "_layer-".concat(effectKey), _objectSpread2(_objectSpread2({}, mergedCSSConfig), {}, { prepend: true }));
			});
			var style = updateCSS(styleStr, styleId, mergedCSSConfig);
			style[CSS_IN_JS_INSTANCE] = cache.instanceId;
			style.setAttribute(ATTR_TOKEN, tokenKey);
			effectRestKeys.forEach(function(effectKey) {
				updateCSS(normalizeStyle(effectStyle[effectKey]), "_effect-".concat(effectKey), mergedCSSConfig);
			});
		}
	}), 3), cachedStyleStr = _useGlobalCache2[0], cachedTokenKey = _useGlobalCache2[1], cachedStyleId = _useGlobalCache2[2];
	return function(node) {
		var styleNode;
		if (!ssrInline || isMergedClientSide || !defaultCache) styleNode = /*#__PURE__*/ React.createElement(Empty, null);
		else styleNode = /*#__PURE__*/ React.createElement("style", _extends({}, _defineProperty(_defineProperty({}, ATTR_TOKEN, cachedTokenKey), ATTR_MARK, cachedStyleId), { dangerouslySetInnerHTML: { __html: cachedStyleStr } }));
		return /*#__PURE__*/ React.createElement(React.Fragment, null, styleNode, node);
	};
}
var extract$1 = function extract(cache, effectStyles, options) {
	var _cache = _slicedToArray(cache, 6), styleStr = _cache[0], tokenKey = _cache[1], styleId = _cache[2], effectStyle = _cache[3], clientOnly = _cache[4], order = _cache[5];
	var plain = (options || {}).plain;
	if (clientOnly) return null;
	var keyStyleText = styleStr;
	var sharedAttrs = {
		"data-rc-order": "prependQueue",
		"data-rc-priority": "".concat(order)
	};
	keyStyleText = toStyleStr(styleStr, tokenKey, styleId, sharedAttrs, plain);
	if (effectStyle) Object.keys(effectStyle).forEach(function(effectKey) {
		if (!effectStyles[effectKey]) {
			effectStyles[effectKey] = true;
			var effectStyleHTML = toStyleStr(normalizeStyle(effectStyle[effectKey]), tokenKey, "_effect-".concat(effectKey), sharedAttrs, plain);
			if (effectKey.startsWith("@layer")) keyStyleText = effectStyleHTML + keyStyleText;
			else keyStyleText += effectStyleHTML;
		}
	});
	return [
		order,
		styleId,
		keyStyleText
	];
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/hooks/useCSSVarRegister.js
var CSS_VAR_PREFIX = "cssVar";
var useCSSVarRegister = function useCSSVarRegister(config, fn) {
	var key = config.key, prefix = config.prefix, unitless = config.unitless, ignore = config.ignore, token = config.token, _config$scope = config.scope, scope = _config$scope === void 0 ? "" : _config$scope;
	var _useContext = useContext(StyleContext), instanceId = _useContext.cache.instanceId, container = _useContext.container;
	var tokenKey = token._tokenKey;
	var stylePath = [].concat(_toConsumableArray(config.path), [
		key,
		scope,
		tokenKey
	]);
	return useGlobalCache(CSS_VAR_PREFIX, stylePath, function() {
		var _transformToken2 = _slicedToArray(transformToken(fn(), key, {
			prefix,
			unitless,
			ignore,
			scope
		}), 2), mergedToken = _transformToken2[0], cssVarsStr = _transformToken2[1];
		return [
			mergedToken,
			cssVarsStr,
			uniqueHash(stylePath, cssVarsStr),
			key
		];
	}, function(_ref) {
		var styleId = _slicedToArray(_ref, 3)[2];
		if (isClientSide) removeCSS(styleId, {
			mark: ATTR_MARK,
			attachTo: container
		});
	}, function(_ref3) {
		var _ref4 = _slicedToArray(_ref3, 3), cssVarsStr = _ref4[1], styleId = _ref4[2];
		if (!cssVarsStr) return;
		var style = updateCSS(cssVarsStr, styleId, {
			mark: ATTR_MARK,
			prepend: "queue",
			attachTo: container,
			priority: -999
		});
		style[CSS_IN_JS_INSTANCE] = instanceId;
		style.setAttribute(ATTR_TOKEN, key);
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/extractStyle.js
var ExtractStyleFns = _defineProperty(_defineProperty(_defineProperty({}, STYLE_PREFIX, extract$1), TOKEN_PREFIX, extract$2), CSS_VAR_PREFIX, function extract(cache, effectStyles, options) {
	var _cache = _slicedToArray(cache, 4), styleStr = _cache[1], styleId = _cache[2], cssVarKey = _cache[3];
	var plain = (options || {}).plain;
	if (!styleStr) return null;
	var order = -999;
	return [
		order,
		styleId,
		toStyleStr(styleStr, cssVarKey, styleId, {
			"data-rc-order": "prependQueue",
			"data-rc-priority": "".concat(order)
		}, plain)
	];
});
function isNotNull(value) {
	return value !== null;
}
function extractStyle(cache, options) {
	var _ref = typeof options === "boolean" ? { plain: options } : options || {}, _ref$plain = _ref.plain, plain = _ref$plain === void 0 ? false : _ref$plain, _ref$types = _ref.types, types = _ref$types === void 0 ? [
		"style",
		"token",
		"cssVar"
	] : _ref$types, _ref$once = _ref.once, once = _ref$once === void 0 ? false : _ref$once;
	var matchPrefixRegexp = new RegExp("^(".concat((typeof types === "string" ? [types] : types).join("|"), ")%"));
	var styleKeys = Array.from(cache.cache.keys()).filter(function(key) {
		return matchPrefixRegexp.test(key);
	});
	var effectStyles = {};
	var cachePathMap = {};
	var styleText = "";
	styleKeys.map(function(key) {
		if (once && cache.extracted.has(key)) return null;
		var cachePath = key.replace(matchPrefixRegexp, "").replace(/%/g, "|");
		var extractFn = ExtractStyleFns[_slicedToArray(key.split("%"), 1)[0]];
		var extractedStyle = extractFn(cache.cache.get(key)[1], effectStyles, { plain });
		if (!extractedStyle) return null;
		var _extractedStyle = _slicedToArray(extractedStyle, 3), order = _extractedStyle[0], styleId = _extractedStyle[1], styleStr = _extractedStyle[2];
		if (key.startsWith("style")) cachePathMap[cachePath] = styleId;
		cache.extracted.add(key);
		return [order, styleStr];
	}).filter(isNotNull).sort(function(_ref2, _ref3) {
		return _slicedToArray(_ref2, 1)[0] - _slicedToArray(_ref3, 1)[0];
	}).forEach(function(_ref6) {
		var style = _slicedToArray(_ref6, 2)[1];
		styleText += style;
	});
	styleText += toStyleStr(".".concat(ATTR_CACHE_MAP, "{content:\"").concat(serialize(cachePathMap), "\";}"), void 0, void 0, _defineProperty({}, ATTR_CACHE_MAP, ATTR_CACHE_MAP), plain);
	return styleText;
}
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/Keyframes.js
var Keyframe = /*#__PURE__*/ function() {
	function Keyframe(name, style) {
		_classCallCheck(this, Keyframe);
		_defineProperty(this, "name", void 0);
		_defineProperty(this, "style", void 0);
		_defineProperty(this, "_keyframe", true);
		this.name = name;
		this.style = style;
	}
	_createClass(Keyframe, [{
		key: "getName",
		value: function getName() {
			var hashId = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
			return hashId ? "".concat(hashId, "-").concat(this.name) : this.name;
		}
	}]);
	return Keyframe;
}();
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/transformers/legacyLogicalProperties.js
function splitValues(value) {
	if (typeof value === "number") return [[value], false];
	var rawStyle = String(value).trim();
	var importantCells = rawStyle.match(/(.*)(!important)/);
	var splitStyle = (importantCells ? importantCells[1] : rawStyle).trim().split(/\s+/);
	var temp = [];
	var brackets = 0;
	return [splitStyle.reduce(function(list, item) {
		if (item.includes("(") || item.includes(")")) {
			var left = item.split("(").length - 1;
			var right = item.split(")").length - 1;
			brackets += left - right;
		}
		if (brackets >= 0) temp.push(item);
		if (brackets === 0) {
			list.push(temp.join(" "));
			temp = [];
		}
		return list;
	}, []), !!importantCells];
}
function noSplit(list) {
	list.notSplit = true;
	return list;
}
var keyMap = {
	inset: [
		"top",
		"right",
		"bottom",
		"left"
	],
	insetBlock: ["top", "bottom"],
	insetBlockStart: ["top"],
	insetBlockEnd: ["bottom"],
	insetInline: ["left", "right"],
	insetInlineStart: ["left"],
	insetInlineEnd: ["right"],
	marginBlock: ["marginTop", "marginBottom"],
	marginBlockStart: ["marginTop"],
	marginBlockEnd: ["marginBottom"],
	marginInline: ["marginLeft", "marginRight"],
	marginInlineStart: ["marginLeft"],
	marginInlineEnd: ["marginRight"],
	paddingBlock: ["paddingTop", "paddingBottom"],
	paddingBlockStart: ["paddingTop"],
	paddingBlockEnd: ["paddingBottom"],
	paddingInline: ["paddingLeft", "paddingRight"],
	paddingInlineStart: ["paddingLeft"],
	paddingInlineEnd: ["paddingRight"],
	borderBlock: noSplit(["borderTop", "borderBottom"]),
	borderBlockStart: noSplit(["borderTop"]),
	borderBlockEnd: noSplit(["borderBottom"]),
	borderInline: noSplit(["borderLeft", "borderRight"]),
	borderInlineStart: noSplit(["borderLeft"]),
	borderInlineEnd: noSplit(["borderRight"]),
	borderBlockWidth: ["borderTopWidth", "borderBottomWidth"],
	borderBlockStartWidth: ["borderTopWidth"],
	borderBlockEndWidth: ["borderBottomWidth"],
	borderInlineWidth: ["borderLeftWidth", "borderRightWidth"],
	borderInlineStartWidth: ["borderLeftWidth"],
	borderInlineEndWidth: ["borderRightWidth"],
	borderBlockStyle: ["borderTopStyle", "borderBottomStyle"],
	borderBlockStartStyle: ["borderTopStyle"],
	borderBlockEndStyle: ["borderBottomStyle"],
	borderInlineStyle: ["borderLeftStyle", "borderRightStyle"],
	borderInlineStartStyle: ["borderLeftStyle"],
	borderInlineEndStyle: ["borderRightStyle"],
	borderBlockColor: ["borderTopColor", "borderBottomColor"],
	borderBlockStartColor: ["borderTopColor"],
	borderBlockEndColor: ["borderBottomColor"],
	borderInlineColor: ["borderLeftColor", "borderRightColor"],
	borderInlineStartColor: ["borderLeftColor"],
	borderInlineEndColor: ["borderRightColor"],
	borderStartStartRadius: ["borderTopLeftRadius"],
	borderStartEndRadius: ["borderTopRightRadius"],
	borderEndStartRadius: ["borderBottomLeftRadius"],
	borderEndEndRadius: ["borderBottomRightRadius"]
};
function wrapImportantAndSkipCheck(value, important) {
	var parsedValue = value;
	if (important) parsedValue = "".concat(parsedValue, " !important");
	return {
		_skip_check_: true,
		value: parsedValue
	};
}
/**
* Convert css logical properties to legacy properties.
* Such as: `margin-block-start` to `margin-top`.
* Transform list:
* - inset
* - margin
* - padding
* - border
*/
var transform = { visit: function visit(cssObj) {
	var clone = {};
	Object.keys(cssObj).forEach(function(key) {
		var value = cssObj[key];
		var matchValue = keyMap[key];
		if (matchValue && (typeof value === "number" || typeof value === "string")) {
			var _splitValues2 = _slicedToArray(splitValues(value), 2), _values = _splitValues2[0], _important = _splitValues2[1];
			if (matchValue.length && matchValue.notSplit) matchValue.forEach(function(matchKey) {
				clone[matchKey] = wrapImportantAndSkipCheck(value, _important);
			});
			else if (matchValue.length === 1) clone[matchValue[0]] = wrapImportantAndSkipCheck(_values[0], _important);
			else if (matchValue.length === 2) matchValue.forEach(function(matchKey, index) {
				var _values$index;
				clone[matchKey] = wrapImportantAndSkipCheck((_values$index = _values[index]) !== null && _values$index !== void 0 ? _values$index : _values[0], _important);
			});
			else if (matchValue.length === 4) matchValue.forEach(function(matchKey, index) {
				var _ref, _values$index2;
				clone[matchKey] = wrapImportantAndSkipCheck((_ref = (_values$index2 = _values[index]) !== null && _values$index2 !== void 0 ? _values$index2 : _values[index - 2]) !== null && _ref !== void 0 ? _ref : _values[0], _important);
			});
			else clone[key] = value;
		} else clone[key] = value;
	});
	return clone;
} };
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/transformers/px2rem.js
/**
* respect https://github.com/cuth/postcss-pxtorem
*/
var pxRegex = /url\([^)]+\)|var\([^)]+\)|(\d*\.?\d+)px/g;
function toFixed(number, precision) {
	var multiplier = Math.pow(10, precision + 1), wholeNumber = Math.floor(number * multiplier);
	return Math.round(wholeNumber / 10) * 10 / multiplier;
}
var transform$1 = function transform() {
	var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	var _options$rootValue = options.rootValue, rootValue = _options$rootValue === void 0 ? 16 : _options$rootValue, _options$precision = options.precision, precision = _options$precision === void 0 ? 5 : _options$precision, _options$mediaQuery = options.mediaQuery, mediaQuery = _options$mediaQuery === void 0 ? false : _options$mediaQuery;
	var pxReplace = function pxReplace(m, $1) {
		if (!$1) return m;
		var pixels = parseFloat($1);
		if (pixels <= 1) return m;
		var fixedVal = toFixed(pixels / rootValue, precision);
		return "".concat(fixedVal, "rem");
	};
	return { visit: function visit(cssObj) {
		var clone = _objectSpread2({}, cssObj);
		Object.entries(cssObj).forEach(function(_ref) {
			var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
			if (typeof value === "string" && value.includes("px")) clone[key] = value.replace(pxRegex, pxReplace);
			if (!unitlessKeys[key] && typeof value === "number" && value !== 0) clone[key] = "".concat(value, "px").replace(pxRegex, pxReplace);
			var mergedKey = key.trim();
			if (mergedKey.startsWith("@") && mergedKey.includes("px") && mediaQuery) {
				var newKey = key.replace(pxRegex, pxReplace);
				clone[newKey] = clone[key];
				delete clone[key];
			}
		});
		return clone;
	} };
};
//#endregion
//#region ../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@ant-design/cssinjs/es/index.js
var _experimental = { supportModernCSS: function supportModernCSS() {
	return supportWhere() && supportLogicProps();
} };
//#endregion
export { Keyframe as Keyframes, linter as NaNLinter, StyleContext, StyleProvider, Theme, _experimental, createCache, createTheme, extractStyle, genCalc, getComputedToken, transform as legacyLogicalPropertiesTransformer, linter$1 as legacyNotSelectorLinter, linter$2 as logicalPropertiesLinter, linter$3 as parentSelectorLinter, transform$1 as px2remTransformer, token2CSSVar, unit, useCSSVarRegister, useCacheToken, useStyleRegister };
