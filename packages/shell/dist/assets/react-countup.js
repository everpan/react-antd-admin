//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region ../../node_modules/.pnpm/countup.js@2.10.1/node_modules/countup.js/dist/countUp.umd.js
var require_countUp_umd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, i) {
		"object" == typeof exports && "undefined" != typeof module ? i(exports) : "function" == typeof define && define.amd ? define(["exports"], i) : i((t = "undefined" != typeof globalThis ? globalThis : t || self).countUp = {});
	})(exports, (function(t) {
		"use strict";
		var i = function() {
			return i = Object.assign || function(t) {
				for (var i, e = 1, s = arguments.length; e < s; e++) for (var n in i = arguments[e]) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
				return t;
			}, i.apply(this, arguments);
		};
		t.CountUp = function() {
			function t(t, e, s) {
				var n = this;
				this.endVal = e, this.options = s, this.version = "2.10.1", this.defaults = {
					startVal: 0,
					decimalPlaces: 0,
					duration: 2,
					useEasing: !0,
					useGrouping: !0,
					useIndianSeparators: !1,
					smartEasingThreshold: 999,
					smartEasingAmount: 333,
					separator: ",",
					decimal: ".",
					prefix: "",
					suffix: "",
					autoAnimate: !1,
					autoAnimateDelay: 200,
					autoAnimateOnce: !1
				}, this.finalEndVal = null, this.useEasing = !0, this.countDown = !1, this.error = "", this.startVal = 0, this.paused = !0, this.once = !1, this.count = function(t) {
					n.startTime || (n.startTime = t);
					var i = t - n.startTime;
					n.remaining = n.duration - i, n.useEasing ? n.countDown ? n.frameVal = n.startVal - n.easingFn(i, 0, n.startVal - n.endVal, n.duration) : n.frameVal = n.easingFn(i, n.startVal, n.endVal - n.startVal, n.duration) : n.frameVal = n.startVal + (n.endVal - n.startVal) * (i / n.duration);
					n.frameVal = (n.countDown ? n.frameVal < n.endVal : n.frameVal > n.endVal) ? n.endVal : n.frameVal, n.frameVal = Number(n.frameVal.toFixed(n.options.decimalPlaces)), n.printValue(n.frameVal), i < n.duration ? n.rAF = requestAnimationFrame(n.count) : null !== n.finalEndVal ? n.update(n.finalEndVal) : n.options.onCompleteCallback && n.options.onCompleteCallback();
				}, this.formatNumber = function(t) {
					var i, e, s, a, o = t < 0 ? "-" : "";
					i = Math.abs(t).toFixed(n.options.decimalPlaces);
					var r = (i += "").split(".");
					if (e = r[0], s = r.length > 1 ? n.options.decimal + r[1] : "", n.options.useGrouping) {
						a = "";
						for (var l = 3, u = 0, h = 0, p = e.length; h < p; ++h) n.options.useIndianSeparators && 4 === h && (l = 2, u = 1), 0 !== h && u % l == 0 && (a = n.options.separator + a), u++, a = e[p - h - 1] + a;
						e = a;
					}
					return n.options.numerals && n.options.numerals.length && (e = e.replace(/[0-9]/g, (function(t) {
						return n.options.numerals[+t];
					})), s = s.replace(/[0-9]/g, (function(t) {
						return n.options.numerals[+t];
					}))), o + n.options.prefix + e + s + n.options.suffix;
				}, this.easeOutExpo = function(t, i, e, s) {
					return e * (1 - Math.pow(2, -10 * t / s)) * 1024 / 1023 + i;
				}, this.options = i(i({}, this.defaults), s), this.options.enableScrollSpy && (this.options.autoAnimate = !0), void 0 !== this.options.scrollSpyDelay && (this.options.autoAnimateDelay = this.options.scrollSpyDelay), this.options.scrollSpyOnce && (this.options.autoAnimateOnce = !0), this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber, this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo, this.el = "string" == typeof t ? document.getElementById(t) : t, e = null == e ? this.parse(this.el.innerHTML) : e, this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.endVal = this.validateValue(e), this.options.decimalPlaces = Math.max(this.options.decimalPlaces), this.resetDuration(), this.options.separator = String(this.options.separator), this.useEasing = this.options.useEasing, "" === this.options.separator && (this.options.useGrouping = !1), this.el ? this.printValue(this.startVal) : this.error = "[CountUp] target is null or undefined", "undefined" != typeof window && this.options.autoAnimate && (this.error || "undefined" == typeof IntersectionObserver ? this.error ? console.error(this.error, t) : console.error("IntersectionObserver is not supported by this browser") : this.setupObserver());
			}
			return t.prototype.setupObserver = function() {
				var i = this, e = t.observedElements.get(this.el);
				e && e.unobserve(), t.observedElements.set(this.el, this), this.observer = new IntersectionObserver((function(t) {
					for (var e = 0, s = t; e < s.length; e++) {
						var n = s[e];
						n.isIntersecting && i.paused && !i.once ? (i.paused = !1, i.autoAnimateTimeout = setTimeout((function() {
							return i.start();
						}), i.options.autoAnimateDelay), i.options.autoAnimateOnce && (i.once = !0, i.observer.disconnect())) : n.isIntersecting || i.paused || (clearTimeout(i.autoAnimateTimeout), i.reset());
					}
				}), { threshold: 0 }), this.observer.observe(this.el);
			}, t.prototype.unobserve = function() {
				var i;
				clearTimeout(this.autoAnimateTimeout), null === (i = this.observer) || void 0 === i || i.disconnect(), t.observedElements.delete(this.el);
			}, t.prototype.onDestroy = function() {
				clearTimeout(this.autoAnimateTimeout), cancelAnimationFrame(this.rAF), this.paused = !0, this.unobserve(), this.options.onCompleteCallback = null, this.options.onStartCallback = null;
			}, t.prototype.determineDirectionAndSmartEasing = function() {
				var t = null !== this.finalEndVal ? this.finalEndVal : this.endVal;
				this.countDown = this.startVal > t;
				var i = t - this.startVal;
				if (Math.abs(i) > this.options.smartEasingThreshold && this.options.useEasing) {
					this.finalEndVal = t;
					var e = this.countDown ? 1 : -1;
					this.endVal = t + e * this.options.smartEasingAmount, this.duration = this.duration / 2;
				} else this.endVal = t, this.finalEndVal = null;
				null !== this.finalEndVal ? this.useEasing = !1 : this.useEasing = this.options.useEasing;
			}, t.prototype.start = function(t) {
				this.error || (this.options.onStartCallback && this.options.onStartCallback(), t && (this.options.onCompleteCallback = t), this.duration > 0 ? (this.determineDirectionAndSmartEasing(), this.paused = !1, this.rAF = requestAnimationFrame(this.count)) : this.printValue(this.endVal));
			}, t.prototype.pauseResume = function() {
				if (this.paused) this.startTime = null, this.duration = this.remaining, this.startVal = this.frameVal, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count);
				else {
					cancelAnimationFrame(this.rAF);
					var t = null !== this.finalEndVal ? this.duration + this.remaining : this.remaining;
					this.remaining = t;
				}
				this.paused = !this.paused;
			}, t.prototype.reset = function() {
				clearTimeout(this.autoAnimateTimeout), cancelAnimationFrame(this.rAF), this.paused = !0, this.once = !1, this.resetDuration(), this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.printValue(this.startVal);
			}, t.prototype.update = function(t) {
				cancelAnimationFrame(this.rAF), this.startTime = null, this.endVal = this.validateValue(t), this.endVal !== this.frameVal && (this.startVal = this.frameVal, this.finalEndVal ?? this.resetDuration(), this.finalEndVal = null, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count));
			}, t.prototype.printValue = function(t) {
				var i;
				if (this.el) {
					var e = this.formattingFn(t);
					if (null === (i = this.options.plugin) || void 0 === i ? void 0 : i.render) this.options.plugin.render(this.el, e);
					else if ("INPUT" === this.el.tagName) this.el.value = e;
					else "text" === this.el.tagName || "tspan" === this.el.tagName ? this.el.textContent = e : this.el.innerHTML = e;
				}
			}, t.prototype.ensureNumber = function(t) {
				return "number" == typeof t && !isNaN(t);
			}, t.prototype.validateValue = function(t) {
				var i = Number(t);
				return this.ensureNumber(i) ? i : (this.error = "[CountUp] invalid start or end value: ".concat(t), null);
			}, t.prototype.resetDuration = function() {
				this.startTime = null, this.duration = 1e3 * Number(this.options.duration), this.remaining = this.duration;
			}, t.prototype.parse = function(t) {
				var i = function(t) {
					return t.replace(/([.,'  ])/g, "\\$1");
				}, e = i(this.options.separator), s = i(this.options.decimal), n = t.replace(new RegExp(e, "g"), "").replace(new RegExp(s, "g"), ".");
				return parseFloat(n);
			}, t.observedElements = /* @__PURE__ */ new WeakMap(), t;
		}();
	}));
}));
//#endregion
//#region ../../node_modules/.pnpm/react-countup@6.5.3_react@19.2.8/node_modules/react-countup/build/index.js
var require_build = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __require("react");
	var countup_js = require_countUp_umd();
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
					if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
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
	function _toPrimitive(t, r) {
		if ("object" != typeof t || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != typeof i) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == typeof i ? i : String(i);
	}
	function _defineProperty(obj, key, value) {
		key = _toPropertyKey(key);
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function _extends() {
		_extends = Object.assign ? Object.assign.bind() : function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
			}
			return target;
		};
		return _extends.apply(this, arguments);
	}
	function _objectWithoutPropertiesLoose(source, excluded) {
		if (source == null) return {};
		var target = {};
		var sourceKeys = Object.keys(source);
		var key, i;
		for (i = 0; i < sourceKeys.length; i++) {
			key = sourceKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			target[key] = source[key];
		}
		return target;
	}
	function _objectWithoutProperties(source, excluded) {
		if (source == null) return {};
		var target = _objectWithoutPropertiesLoose(source, excluded);
		var key, i;
		if (Object.getOwnPropertySymbols) {
			var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
			for (i = 0; i < sourceSymbolKeys.length; i++) {
				key = sourceSymbolKeys[i];
				if (excluded.indexOf(key) >= 0) continue;
				if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
				target[key] = source[key];
			}
		}
		return target;
	}
	function _slicedToArray(arr, i) {
		return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}
	function _arrayWithHoles(arr) {
		if (Array.isArray(arr)) return arr;
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	/**
	* Silence SSR Warnings.
	* Borrowed from Formik v2.1.1, Licensed MIT.
	*
	* https://github.com/formium/formik/blob/9316a864478f8fcd4fa99a0735b1d37afdf507dc/LICENSE
	*/
	var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? React.useLayoutEffect : React.useEffect;
	/**
	* Create a stable reference to a callback which is updated after each render is committed.
	* Typed version borrowed from Formik v2.2.1. Licensed MIT.
	*
	* https://github.com/formium/formik/blob/9316a864478f8fcd4fa99a0735b1d37afdf507dc/LICENSE
	*/
	function useEventCallback(fn) {
		var ref = React.useRef(fn);
		useIsomorphicLayoutEffect(function() {
			ref.current = fn;
		});
		return React.useCallback(function() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			return ref.current.apply(void 0, args);
		}, []);
	}
	var createCountUpInstance = function createCountUpInstance(el, props) {
		var decimal = props.decimal, decimals = props.decimals, duration = props.duration, easingFn = props.easingFn, end = props.end, formattingFn = props.formattingFn, numerals = props.numerals, prefix = props.prefix, separator = props.separator, start = props.start, suffix = props.suffix, useEasing = props.useEasing, useGrouping = props.useGrouping, useIndianSeparators = props.useIndianSeparators, enableScrollSpy = props.enableScrollSpy, scrollSpyDelay = props.scrollSpyDelay, scrollSpyOnce = props.scrollSpyOnce, plugin = props.plugin;
		return new countup_js.CountUp(el, end, {
			startVal: start,
			duration,
			decimal,
			decimalPlaces: decimals,
			easingFn,
			formattingFn,
			numerals,
			separator,
			prefix,
			suffix,
			plugin,
			useEasing,
			useIndianSeparators,
			useGrouping,
			enableScrollSpy,
			scrollSpyDelay,
			scrollSpyOnce
		});
	};
	var _excluded$1 = [
		"ref",
		"startOnMount",
		"enableReinitialize",
		"delay",
		"onEnd",
		"onStart",
		"onPauseResume",
		"onReset",
		"onUpdate"
	];
	var DEFAULTS = {
		decimal: ".",
		separator: ",",
		delay: null,
		prefix: "",
		suffix: "",
		duration: 2,
		start: 0,
		decimals: 0,
		startOnMount: true,
		enableReinitialize: true,
		useEasing: true,
		useGrouping: true,
		useIndianSeparators: false
	};
	var useCountUp = function useCountUp(props) {
		var filteredProps = Object.fromEntries(Object.entries(props).filter(function(_ref) {
			return _slicedToArray(_ref, 2)[1] !== void 0;
		}));
		var _useMemo = React.useMemo(function() {
			return _objectSpread2(_objectSpread2({}, DEFAULTS), filteredProps);
		}, [props]), ref = _useMemo.ref, startOnMount = _useMemo.startOnMount, enableReinitialize = _useMemo.enableReinitialize, delay = _useMemo.delay, onEnd = _useMemo.onEnd, onStart = _useMemo.onStart, onPauseResume = _useMemo.onPauseResume, onReset = _useMemo.onReset, onUpdate = _useMemo.onUpdate, instanceProps = _objectWithoutProperties(_useMemo, _excluded$1);
		var countUpRef = React.useRef();
		var timerRef = React.useRef();
		var isInitializedRef = React.useRef(false);
		var createInstance = useEventCallback(function() {
			return createCountUpInstance(typeof ref === "string" ? ref : ref.current, instanceProps);
		});
		var getCountUp = useEventCallback(function(recreate) {
			var countUp = countUpRef.current;
			if (countUp && !recreate) return countUp;
			var newCountUp = createInstance();
			countUpRef.current = newCountUp;
			return newCountUp;
		});
		var start = useEventCallback(function() {
			var run = function run() {
				return getCountUp(true).start(function() {
					onEnd === null || onEnd === void 0 || onEnd({
						pauseResume,
						reset,
						start: restart,
						update
					});
				});
			};
			if (delay && delay > 0) timerRef.current = setTimeout(run, delay * 1e3);
			else run();
			onStart === null || onStart === void 0 || onStart({
				pauseResume,
				reset,
				update
			});
		});
		var pauseResume = useEventCallback(function() {
			getCountUp().pauseResume();
			onPauseResume === null || onPauseResume === void 0 || onPauseResume({
				reset,
				start: restart,
				update
			});
		});
		var reset = useEventCallback(function() {
			if (getCountUp().el) {
				timerRef.current && clearTimeout(timerRef.current);
				getCountUp().reset();
				onReset === null || onReset === void 0 || onReset({
					pauseResume,
					start: restart,
					update
				});
			}
		});
		var update = useEventCallback(function(newEnd) {
			getCountUp().update(newEnd);
			onUpdate === null || onUpdate === void 0 || onUpdate({
				pauseResume,
				reset,
				start: restart
			});
		});
		var restart = useEventCallback(function() {
			reset();
			start();
		});
		var maybeInitialize = useEventCallback(function(shouldReset) {
			if (startOnMount) {
				if (shouldReset) reset();
				start();
			}
		});
		React.useEffect(function() {
			if (!isInitializedRef.current) {
				isInitializedRef.current = true;
				maybeInitialize();
			} else if (enableReinitialize) maybeInitialize(true);
		}, [
			enableReinitialize,
			isInitializedRef,
			maybeInitialize,
			delay,
			props.start,
			props.suffix,
			props.prefix,
			props.duration,
			props.separator,
			props.decimals,
			props.decimal,
			props.formattingFn
		]);
		React.useEffect(function() {
			return function() {
				reset();
			};
		}, [reset]);
		return {
			start: restart,
			pauseResume,
			reset,
			update,
			getCountUp
		};
	};
	var _excluded = [
		"className",
		"redraw",
		"containerProps",
		"children",
		"style"
	];
	exports.default = function CountUp(props) {
		var className = props.className, redraw = props.redraw, containerProps = props.containerProps, children = props.children, style = props.style, useCountUpProps = _objectWithoutProperties(props, _excluded);
		var containerRef = React.useRef(null);
		var isInitializedRef = React.useRef(false);
		var _useCountUp = useCountUp(_objectSpread2(_objectSpread2({}, useCountUpProps), {}, {
			ref: containerRef,
			startOnMount: typeof children !== "function" || props.delay === 0,
			enableReinitialize: false
		})), start = _useCountUp.start, reset = _useCountUp.reset, updateCountUp = _useCountUp.update, pauseResume = _useCountUp.pauseResume, getCountUp = _useCountUp.getCountUp;
		var restart = useEventCallback(function() {
			start();
		});
		var update = useEventCallback(function(end) {
			if (!props.preserveValue) reset();
			updateCountUp(end);
		});
		var initializeOnMount = useEventCallback(function() {
			if (typeof props.children === "function") {
				if (!(containerRef.current instanceof Element)) {
					console.error("Couldn't find attached element to hook the CountUp instance into! Try to attach \"containerRef\" from the render prop to a an Element, eg. <span ref={containerRef} />.");
					return;
				}
			}
			getCountUp();
		});
		React.useEffect(function() {
			initializeOnMount();
		}, [initializeOnMount]);
		React.useEffect(function() {
			if (isInitializedRef.current) update(props.end);
		}, [props.end, update]);
		var redrawDependencies = redraw && props;
		React.useEffect(function() {
			if (redraw && isInitializedRef.current) restart();
		}, [
			restart,
			redraw,
			redrawDependencies
		]);
		React.useEffect(function() {
			if (!redraw && isInitializedRef.current) restart();
		}, [
			restart,
			redraw,
			props.start,
			props.suffix,
			props.prefix,
			props.duration,
			props.separator,
			props.decimals,
			props.decimal,
			props.className,
			props.formattingFn
		]);
		React.useEffect(function() {
			isInitializedRef.current = true;
		}, []);
		if (typeof children === "function") return children({
			countUpRef: containerRef,
			start,
			reset,
			update: updateCountUp,
			pauseResume,
			getCountUp
		});
		return /*#__PURE__*/ React.createElement("span", _extends({
			className,
			ref: containerRef,
			style
		}, containerProps), typeof props.start !== "undefined" ? getCountUp().formattingFn(props.start) : "");
	};
	exports.useCountUp = useCountUp;
}));
//#endregion
export default require_build();
