"use client";
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region ../../node_modules/.pnpm/react-error-boundary@6.1.3_@types+react@19.2.18_react@19.2.8/node_modules/react-error-boundary/dist/react-error-boundary.cjs
var require_react_error_boundary = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	var s = __require("react");
	var c = s.createContext(null);
	var u = {
		didCatch: !1,
		error: null
	};
	var y = class extends s.Component {
		constructor(e) {
			super(e), this.resetErrorBoundary = this.resetErrorBoundary.bind(this), this.state = u;
		}
		static getDerivedStateFromError(e) {
			return {
				didCatch: !0,
				error: e
			};
		}
		resetErrorBoundary(...e) {
			const { error: t } = this.state;
			t !== null && (this.props.onReset?.({
				args: e,
				reason: "imperative-api"
			}), this.setState(u));
		}
		componentDidCatch(e, t) {
			this.props.onError?.(e, t);
		}
		componentDidUpdate(e, t) {
			const { didCatch: o } = this.state, { resetKeys: n } = this.props;
			o && t.error !== null && h(e.resetKeys, n) && (this.props.onReset?.({
				next: n,
				prev: e.resetKeys,
				reason: "keys"
			}), this.setState(u));
		}
		render() {
			const { children: e, fallbackRender: t, FallbackComponent: o, fallback: n } = this.props, { didCatch: a, error: i } = this.state;
			let d = e;
			if (a) {
				const l = {
					error: i,
					resetErrorBoundary: this.resetErrorBoundary
				};
				if (typeof t == "function") d = t(l);
				else if (o) d = s.createElement(o, l);
				else if (n !== void 0) d = n;
				else throw i;
			}
			return s.createElement(c.Provider, { value: {
				didCatch: a,
				error: i,
				resetErrorBoundary: this.resetErrorBoundary
			} }, d);
		}
	};
	function h(r = [], e = []) {
		return r.length !== e.length || r.some((t, o) => !Object.is(t, e[o]));
	}
	function E(r) {
		return r !== null && typeof r == "object" && "didCatch" in r && typeof r.didCatch == "boolean" && "error" in r && "resetErrorBoundary" in r && typeof r.resetErrorBoundary == "function";
	}
	function f(r) {
		if (!E(r)) throw new Error("ErrorBoundaryContext not found");
	}
	function p() {
		const r = s.useContext(c);
		f(r);
		const { error: e, resetErrorBoundary: t } = r, [o, n] = s.useState({
			error: null,
			hasError: !1
		}), a = s.useMemo(() => ({
			error: e,
			resetBoundary: () => {
				t(), n({
					error: null,
					hasError: !1
				});
			},
			showBoundary: (i) => n({
				error: i,
				hasError: !0
			})
		}), [e, t]);
		if (o.hasError) throw o.error;
		return a;
	}
	function B(r) {
		switch (typeof r) {
			case "object":
				if (r !== null && "message" in r && typeof r.message == "string") return r.message;
				break;
			case "string": return r;
		}
	}
	function m(r, e) {
		const t = s.forwardRef((n, a) => s.createElement(y, e, s.createElement(r, {
			...n,
			ref: a
		})));
		return t.displayName = `withErrorBoundary(${r.displayName || r.name || "Unknown"})`, t;
	}
	exports.ErrorBoundary = y;
	exports.ErrorBoundaryContext = c;
	exports.getErrorMessage = B;
	exports.useErrorBoundary = p;
	exports.withErrorBoundary = m;
}));
//#endregion
export default require_react_error_boundary();
