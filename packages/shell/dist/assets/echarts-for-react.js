//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = /* @__PURE__ */ __exportAll({
	__addDisposableResource: () => __addDisposableResource,
	__assign: () => __assign,
	__asyncDelegator: () => __asyncDelegator,
	__asyncGenerator: () => __asyncGenerator,
	__asyncValues: () => __asyncValues,
	__await: () => __await,
	__awaiter: () => __awaiter,
	__classPrivateFieldGet: () => __classPrivateFieldGet,
	__classPrivateFieldIn: () => __classPrivateFieldIn,
	__classPrivateFieldSet: () => __classPrivateFieldSet,
	__createBinding: () => __createBinding,
	__decorate: () => __decorate,
	__disposeResources: () => __disposeResources,
	__esDecorate: () => __esDecorate,
	__exportStar: () => __exportStar,
	__extends: () => __extends,
	__generator: () => __generator,
	__importDefault: () => __importDefault,
	__importStar: () => __importStar,
	__makeTemplateObject: () => __makeTemplateObject,
	__metadata: () => __metadata,
	__param: () => __param,
	__propKey: () => __propKey,
	__read: () => __read,
	__rest: () => __rest,
	__rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
	__runInitializers: () => __runInitializers,
	__setFunctionName: () => __setFunctionName,
	__spread: () => __spread,
	__spreadArray: () => __spreadArray,
	__spreadArrays: () => __spreadArrays,
	__values: () => __values,
	default: () => tslib_es6_default
});
function __extends(d, b) {
	if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
}
function __runInitializers(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
}
function __propKey(x) {
	return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
	if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
	return Object.defineProperty(f, "name", {
		configurable: true,
		value: prefix ? "".concat(prefix, " ", name) : name
	});
}
function __metadata(metadataKey, metadataValue) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
	return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (g && (g = 0, op[0] && (_ = 0)), _) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
}
function __exportStar(m, o) {
	for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
}
/** @deprecated */
function __spread() {
	for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	return ar;
}
/** @deprecated */
function __spreadArrays() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
	return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var g = generator.apply(thisArg, _arguments || []), i, q = [];
	return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function awaitReturn(f) {
		return function(v) {
			return Promise.resolve(v).then(f, reject);
		};
	}
	function verb(n, f) {
		if (g[n]) {
			i[n] = function(v) {
				return new Promise(function(a, b) {
					q.push([
						n,
						v,
						a,
						b
					]) > 1 || resume(n, v);
				});
			};
			if (f) i[n] = f(i[n]);
		}
	}
	function resume(n, v) {
		try {
			step(g[n](v));
		} catch (e) {
			settle(q[0][3], e);
		}
	}
	function step(r) {
		r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
	}
	function fulfill(value) {
		resume("next", value);
	}
	function reject(value) {
		resume("throw", value);
	}
	function settle(f, v) {
		if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
	}
}
function __asyncDelegator(o) {
	var i, p;
	return i = {}, verb("next"), verb("throw", function(e) {
		throw e;
	}), verb("return"), i[Symbol.iterator] = function() {
		return this;
	}, i;
	function verb(n, f) {
		i[n] = o[n] ? function(v) {
			return (p = !p) ? {
				value: __await(o[n](v)),
				done: false
			} : f ? f(v) : v;
		} : f;
	}
}
function __asyncValues(o) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var m = o[Symbol.asyncIterator], i;
	return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i);
	function verb(n) {
		i[n] = o[n] && function(v) {
			return new Promise(function(resolve, reject) {
				v = o[n](v), settle(resolve, reject, v.done, v.value);
			});
		};
	}
	function settle(resolve, reject, d, v) {
		Promise.resolve(v).then(function(v) {
			resolve({
				value: v,
				done: d
			});
		}, reject);
	}
}
function __makeTemplateObject(cooked, raw) {
	if (Object.defineProperty) Object.defineProperty(cooked, "raw", { value: raw });
	else cooked.raw = raw;
	return cooked;
}
function __importStar(mod) {
	if (mod && mod.__esModule) return mod;
	var result = {};
	if (mod != null) {
		for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	}
	__setModuleDefault(result, mod);
	return result;
}
function __importDefault(mod) {
	return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
	if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
	return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
}
function __disposeResources(env) {
	function fail(e) {
		env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
		env.hasError = true;
	}
	var r, s = 0;
	function next() {
		while (r = env.stack.pop()) try {
			if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
			if (r.dispose) {
				var result = r.dispose.call(r.value);
				if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
					fail(e);
					return next();
				});
			} else s |= 1;
		} catch (e) {
			fail(e);
		}
		if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
		if (env.hasError) throw env.error;
	}
	return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
}
var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esmMin((() => {
	extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
		};
		return extendStatics(d, b);
	};
	__assign = function() {
		__assign = Object.assign || function __assign(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	__createBinding = Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	__setModuleDefault = Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	};
	ownKeys = function(o) {
		ownKeys = Object.getOwnPropertyNames || function(o) {
			var ar = [];
			for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
			return ar;
		};
		return ownKeys(o);
	};
	_SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
		var e = new Error(message);
		return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
	};
	tslib_es6_default = {
		__extends,
		__assign,
		__rest,
		__decorate,
		__param,
		__esDecorate,
		__runInitializers,
		__propKey,
		__setFunctionName,
		__metadata,
		__awaiter,
		__generator,
		__createBinding,
		__exportStar,
		__values,
		__read,
		__spread,
		__spreadArrays,
		__spreadArray,
		__await,
		__asyncGenerator,
		__asyncDelegator,
		__asyncValues,
		__makeTemplateObject,
		__importStar,
		__importDefault,
		__classPrivateFieldGet,
		__classPrivateFieldSet,
		__classPrivateFieldIn,
		__addDisposableResource,
		__disposeResources,
		__rewriteRelativeImportExtension
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	/**
	* Created by hustcc on 18/6/9.
	* Contract: i@hust.cc
	*/
	var id = 1;
	exports["default"] = function _default() {
		return "".concat(id++);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/debounce.js
var require_debounce = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	exports["default"] = function _default(fn) {
		var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 60;
		var timer = null;
		return function() {
			var _this = this;
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			clearTimeout(timer);
			timer = setTimeout(function() {
				fn.apply(_this, args);
			}, delay);
		};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/constant.js
var require_constant = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SizeSensorId = exports.SensorTabIndex = exports.SensorClassName = void 0;
	exports.SizeSensorId = "size-sensor-id";
	exports.SensorClassName = "size-sensor-object";
	exports.SensorTabIndex = "-1";
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/sensors/object.js
var require_object = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createSensor = void 0;
	var _debounce = _interopRequireDefault(require_debounce());
	var _constant = require_constant();
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { "default": e };
	}
	exports.createSensor = function createSensor(element, whenDestroy) {
		var sensor = void 0;
		var listeners = [];
		/**
		* create object DOM of sensor
		* @returns {HTMLObjectElement}
		*/
		var newSensor = function newSensor() {
			if (getComputedStyle(element).position === "static") element.style.position = "relative";
			var obj = document.createElement("object");
			obj.onload = function() {
				obj.contentDocument.defaultView.addEventListener("resize", resizeListener);
				resizeListener();
			};
			obj.style.display = "block";
			obj.style.position = "absolute";
			obj.style.top = "0";
			obj.style.left = "0";
			obj.style.height = "100%";
			obj.style.width = "100%";
			obj.style.overflow = "hidden";
			obj.style.pointerEvents = "none";
			obj.style.zIndex = "-1";
			obj.style.opacity = "0";
			obj.setAttribute("class", _constant.SensorClassName);
			obj.setAttribute("tabindex", _constant.SensorTabIndex);
			obj.type = "text/html";
			element.appendChild(obj);
			obj.data = "about:blank";
			return obj;
		};
		/**
		* trigger listeners
		*/
		var resizeListener = (0, _debounce["default"])(function() {
			listeners.forEach(function(listener) {
				listener(element);
			});
		});
		/**
		* listen with one callback function
		* @param cb
		*/
		var bind = function bind(cb) {
			if (!sensor) sensor = newSensor();
			if (listeners.indexOf(cb) === -1) listeners.push(cb);
		};
		/**
		* destroy all
		*/
		var destroy = function destroy() {
			if (sensor && sensor.parentNode) {
				if (sensor.contentDocument) sensor.contentDocument.defaultView.removeEventListener("resize", resizeListener);
				sensor.parentNode.removeChild(sensor);
				element.removeAttribute(_constant.SizeSensorId);
				sensor = void 0;
				listeners = [];
				whenDestroy && whenDestroy();
			}
		};
		return {
			element,
			bind,
			destroy,
			unbind: function unbind(cb) {
				var idx = listeners.indexOf(cb);
				if (idx !== -1) listeners.splice(idx, 1);
				if (listeners.length === 0 && sensor) destroy();
			}
		};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/sensors/resizeObserver.js
var require_resizeObserver = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createSensor = void 0;
	var _constant = require_constant();
	var _debounce = _interopRequireDefault(require_debounce());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { "default": e };
	}
	exports.createSensor = function createSensor(element, whenDestroy) {
		var sensor = void 0;
		var listeners = [];
		/**
		* trigger listeners
		*/
		var resizeListener = (0, _debounce["default"])(function() {
			listeners.forEach(function(listener) {
				listener(element);
			});
		});
		/**
		* create ResizeObserver sensor
		* @returns
		*/
		var newSensor = function newSensor() {
			var s = new ResizeObserver(resizeListener);
			s.observe(element);
			resizeListener();
			return s;
		};
		/**
		* listen with callback
		* @param cb
		*/
		var bind = function bind(cb) {
			if (!sensor) sensor = newSensor();
			if (listeners.indexOf(cb) === -1) listeners.push(cb);
		};
		/**
		* destroy
		*/
		var destroy = function destroy() {
			if (sensor) sensor.disconnect();
			listeners = [];
			sensor = void 0;
			element.removeAttribute(_constant.SizeSensorId);
			whenDestroy && whenDestroy();
		};
		return {
			element,
			bind,
			destroy,
			unbind: function unbind(cb) {
				var idx = listeners.indexOf(cb);
				if (idx !== -1) listeners.splice(idx, 1);
				if (listeners.length === 0 && sensor) destroy();
			}
		};
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/sensors/index.js
var require_sensors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createSensor = void 0;
	var _object = require_object();
	var _resizeObserver = require_resizeObserver();
	exports.createSensor = typeof ResizeObserver !== "undefined" ? _resizeObserver.createSensor : _object.createSensor;
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/sensorPool.js
var require_sensorPool = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.removeSensor = exports.getSensor = exports.Sensors = void 0;
	var _id = _interopRequireDefault(require_id());
	var _sensors = require_sensors();
	var _constant = require_constant();
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { "default": e };
	}
	/**
	* Created by hustcc on 18/6/9.
	* Contract: i@hust.cc
	*/
	/**
	* all the sensor objects.
	* sensor pool
	*/
	var Sensors = exports.Sensors = {};
	/**
	* When destroy the sensor, remove it from the pool
	*/
	function clean(sensorId) {
		if (sensorId && Sensors[sensorId]) delete Sensors[sensorId];
	}
	exports.getSensor = function getSensor(element) {
		var sensorId = element.getAttribute(_constant.SizeSensorId);
		if (sensorId && Sensors[sensorId]) return Sensors[sensorId];
		var newId = (0, _id["default"])();
		element.setAttribute(_constant.SizeSensorId, newId);
		var sensor = (0, _sensors.createSensor)(element, function() {
			return clean(newId);
		});
		Sensors[newId] = sensor;
		return sensor;
	};
	exports.removeSensor = function removeSensor(sensor) {
		var sensorId = sensor.element.getAttribute(_constant.SizeSensorId);
		sensor.destroy();
		clean(sensorId);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/size-sensor@1.0.3/node_modules/size-sensor/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ver = exports.clear = exports.bind = void 0;
	var _sensorPool = require_sensorPool();
	exports.bind = function bind(element, cb) {
		var sensor = (0, _sensorPool.getSensor)(element);
		sensor.bind(cb);
		return function() {
			sensor.unbind(cb);
		};
	};
	exports.clear = function clear(element) {
		var sensor = (0, _sensorPool.getSensor)(element);
		(0, _sensorPool.removeSensor)(sensor);
	};
	exports.ver = "1.0.3";
}));
//#endregion
//#region ../../node_modules/.pnpm/echarts-for-react@3.0.6_echarts@6.1.0_react@19.2.8/node_modules/echarts-for-react/lib/helper/pick.js
var require_pick = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pick = void 0;
	/**
	* 保留 object 中的部分内容
	* @param obj
	* @param keys
	*/
	function pick(obj, keys) {
		var r = {};
		keys.forEach(function(key) {
			r[key] = obj[key];
		});
		return r;
	}
	exports.pick = pick;
}));
//#endregion
//#region ../../node_modules/.pnpm/echarts-for-react@3.0.6_echarts@6.1.0_react@19.2.8/node_modules/echarts-for-react/lib/helper/is-function.js
var require_is_function = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isFunction = void 0;
	function isFunction(v) {
		return typeof v === "function";
	}
	exports.isFunction = isFunction;
}));
//#endregion
//#region ../../node_modules/.pnpm/echarts-for-react@3.0.6_echarts@6.1.0_react@19.2.8/node_modules/echarts-for-react/lib/helper/is-string.js
var require_is_string = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isString = void 0;
	function isString(v) {
		return typeof v === "string";
	}
	exports.isString = isString;
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/echarts-for-react@3.0.6_echarts@6.1.0_react@19.2.8/node_modules/echarts-for-react/lib/helper/is-equal.js
var require_is_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEqual = void 0;
	exports.isEqual = (init_tslib_es6(), __toCommonJS(tslib_es6_exports)).__importDefault(require_fast_deep_equal()).default;
}));
//#endregion
//#region ../../node_modules/.pnpm/echarts-for-react@3.0.6_echarts@6.1.0_react@19.2.8/node_modules/echarts-for-react/lib/core.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
	var react_1 = tslib_1.__importStar(__require("react"));
	var size_sensor_1 = require_lib$1();
	var pick_1 = require_pick();
	var is_function_1 = require_is_function();
	var is_string_1 = require_is_string();
	var is_equal_1 = require_is_equal();
	exports.default = function(_super) {
		tslib_1.__extends(EChartsReactCore, _super);
		function EChartsReactCore(props) {
			var _this = _super.call(this, props) || this;
			_this.echarts = props.echarts;
			_this.ele = null;
			_this.isInitialResize = true;
			_this.eventHandlerRefs = {};
			return _this;
		}
		EChartsReactCore.prototype.componentDidMount = function() {
			this.renderNewEcharts();
		};
		EChartsReactCore.prototype.componentDidUpdate = function(prevProps) {
			/**
			* if shouldSetOption return false, then return, not update echarts options
			* default is true
			*/
			var shouldSetOption = this.props.shouldSetOption;
			if ((0, is_function_1.isFunction)(shouldSetOption) && !shouldSetOption(prevProps, this.props)) return;
			if (!(0, is_equal_1.isEqual)(prevProps.theme, this.props.theme) || !(0, is_equal_1.isEqual)(prevProps.opts, this.props.opts)) {
				this.dispose();
				this.renderNewEcharts();
				return;
			}
			var echartsInstance = this.getEchartsInstance();
			if (!(0, is_equal_1.isEqual)(prevProps.onEvents, this.props.onEvents)) {
				this.unbindEvents(echartsInstance);
				this.bindEvents(echartsInstance, this.props.onEvents);
			}
			var pickKeys = [
				"option",
				"notMerge",
				"replaceMerge",
				"lazyUpdate",
				"showLoading",
				"loadingOption"
			];
			if (!(0, is_equal_1.isEqual)((0, pick_1.pick)(this.props, pickKeys), (0, pick_1.pick)(prevProps, pickKeys))) this.updateEChartsOption();
			/**
			* when style or class name updated, change size.
			*/
			if (!(0, is_equal_1.isEqual)(prevProps.style, this.props.style) || !(0, is_equal_1.isEqual)(prevProps.className, this.props.className)) this.resize();
		};
		EChartsReactCore.prototype.componentWillUnmount = function() {
			this.dispose();
		};
		EChartsReactCore.prototype.initEchartsInstance = function() {
			return tslib_1.__awaiter(this, void 0, void 0, function() {
				var _this = this;
				return tslib_1.__generator(this, function(_a) {
					return [2, new Promise(function(resolve) {
						_this.echarts.init(_this.ele, _this.props.theme, _this.props.opts);
						_this.getEchartsInstance().on("finished", function() {
							var width = _this.ele.clientWidth;
							var height = _this.ele.clientHeight;
							_this.echarts.dispose(_this.ele);
							var opts = tslib_1.__assign({
								width,
								height
							}, _this.props.opts);
							resolve(_this.echarts.init(_this.ele, _this.props.theme, opts));
						});
					})];
				});
			});
		};
		/**
		* return the existing echart object
		*/
		EChartsReactCore.prototype.getEchartsInstance = function() {
			return this.echarts.getInstanceByDom(this.ele);
		};
		/**
		* dispose echarts and clear size-sensor
		*/
		EChartsReactCore.prototype.dispose = function() {
			if (this.ele) {
				try {
					(0, size_sensor_1.clear)(this.ele);
				} catch (e) {
					console.warn(e);
				}
				this.echarts.dispose(this.ele);
			}
		};
		/**
		* render a new echarts instance
		*/
		EChartsReactCore.prototype.renderNewEcharts = function() {
			return tslib_1.__awaiter(this, void 0, void 0, function() {
				var _a, onEvents, onChartReady, _b, autoResize, echartsInstance;
				var _this = this;
				return tslib_1.__generator(this, function(_c) {
					switch (_c.label) {
						case 0:
							_a = this.props, onEvents = _a.onEvents, onChartReady = _a.onChartReady, _b = _a.autoResize, autoResize = _b === void 0 ? true : _b;
							return [4, this.initEchartsInstance()];
						case 1:
							_c.sent();
							echartsInstance = this.updateEChartsOption();
							this.bindEvents(echartsInstance, onEvents || {});
							if ((0, is_function_1.isFunction)(onChartReady)) onChartReady(echartsInstance);
							if (this.ele && autoResize) (0, size_sensor_1.bind)(this.ele, function() {
								_this.resize();
							});
							return [2];
					}
				});
			});
		};
		EChartsReactCore.prototype.bindEvents = function(instance, events) {
			var _this = this;
			var _bindEvent = function(eventName, func) {
				if ((0, is_string_1.isString)(eventName) && (0, is_function_1.isFunction)(func)) {
					var handler = function(param) {
						func(param, instance);
					};
					instance.on(eventName, handler);
					_this.eventHandlerRefs[eventName] = handler;
				}
			};
			for (var eventName in events) if (Object.prototype.hasOwnProperty.call(events, eventName)) _bindEvent(eventName, events[eventName]);
		};
		/**
		* Unbind all currently bound event handlers. Importantly, this does not
		* unbind the `"finished"` event that is used for chart initialization.
		*/
		EChartsReactCore.prototype.unbindEvents = function(instance) {
			for (var _i = 0, _a = Object.entries(this.eventHandlerRefs); _i < _a.length; _i++) {
				var _b = _a[_i], eventName = _b[0], listener = _b[1];
				instance.off(eventName, listener);
			}
			this.eventHandlerRefs = {};
		};
		/**
		* render the echarts
		*/
		EChartsReactCore.prototype.updateEChartsOption = function() {
			var _a = this.props, option = _a.option, _b = _a.notMerge, notMerge = _b === void 0 ? false : _b, _c = _a.replaceMerge, replaceMerge = _c === void 0 ? null : _c, _d = _a.lazyUpdate, lazyUpdate = _d === void 0 ? false : _d, showLoading = _a.showLoading, _e = _a.loadingOption, loadingOption = _e === void 0 ? null : _e;
			var echartInstance = this.getEchartsInstance();
			echartInstance.setOption(option, {
				notMerge,
				replaceMerge,
				lazyUpdate
			});
			if (showLoading) echartInstance.showLoading(loadingOption);
			else echartInstance.hideLoading();
			return echartInstance;
		};
		/**
		* resize wrapper
		*/
		EChartsReactCore.prototype.resize = function() {
			var echartsInstance = this.getEchartsInstance();
			if (!this.isInitialResize) try {
				echartsInstance.resize({
					width: "auto",
					height: "auto"
				});
			} catch (e) {
				console.warn(e);
			}
			this.isInitialResize = false;
		};
		EChartsReactCore.prototype.render = function() {
			var _this = this, _a = this.props, style = _a.style, _b = _a.className, className = _b === void 0 ? "" : _b;
			_a.echarts;
			_a.option;
			_a.theme;
			_a.notMerge;
			_a.replaceMerge;
			_a.lazyUpdate;
			_a.showLoading;
			_a.loadingOption;
			_a.opts;
			_a.onChartReady;
			_a.onEvents;
			_a.shouldSetOption;
			_a.autoResize;
			var divHTMLAttributes = tslib_1.__rest(_a, [
				"style",
				"className",
				"echarts",
				"option",
				"theme",
				"notMerge",
				"replaceMerge",
				"lazyUpdate",
				"showLoading",
				"loadingOption",
				"opts",
				"onChartReady",
				"onEvents",
				"shouldSetOption",
				"autoResize"
			]);
			var newStyle = tslib_1.__assign({ height: 300 }, style);
			return react_1.default.createElement("div", tslib_1.__assign({
				ref: function(e) {
					_this.ele = e;
				},
				style: newStyle,
				className: "echarts-for-react ".concat(className)
			}, divHTMLAttributes));
		};
		return EChartsReactCore;
	}(react_1.PureComponent);
}));
//#endregion
//#region ../../node_modules/.pnpm/echarts-for-react@3.0.6_echarts@6.1.0_react@19.2.8/node_modules/echarts-for-react/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
	var echarts = tslib_1.__importStar(__require("echarts"));
	exports.default = function(_super) {
		tslib_1.__extends(EChartsReact, _super);
		function EChartsReact(props) {
			var _this = _super.call(this, props) || this;
			_this.echarts = echarts;
			return _this;
		}
		return EChartsReact;
	}(tslib_1.__importDefault(require_core()).default);
}));
//#endregion
export default require_lib();
