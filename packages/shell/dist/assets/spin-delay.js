//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region ../../node_modules/.pnpm/spin-delay@2.0.1_react@19.2.8/node_modules/spin-delay/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports, __require("react")) : typeof define === "function" && define.amd ? define(["exports", "react"], factory) : (global = global || self, factory(global.spinDelay = {}, global.react));
	})(exports, (function(exports$1, react) {
		const defaultOptions = {
			delay: 500,
			minDuration: 200,
			ssr: true
		};
		function useIsSSR() {
			const [isSSR, setIsSSR] = react.useState(true);
			react.useEffect(() => {
				setIsSSR(false);
			}, []);
			return isSSR;
		}
		function useSpinDelay(loading, options) {
			options = Object.assign({}, defaultOptions, options);
			const isSSR = useIsSSR() && options.ssr;
			const initialState = isSSR && loading ? "DISPLAY" : "IDLE";
			const [state, setState] = react.useState(initialState);
			const timeout = react.useRef(null);
			react.useEffect(() => {
				if (loading && (state === "IDLE" || isSSR)) {
					clearTimeout(timeout.current);
					const delay = isSSR ? 0 : options.delay;
					timeout.current = setTimeout(() => {
						if (!loading) return setState("IDLE");
						timeout.current = setTimeout(() => {
							setState("EXPIRE");
						}, options.minDuration);
						setState("DISPLAY");
					}, delay);
					if (!isSSR) setState("DELAY");
				}
				if (!loading && state !== "DISPLAY") {
					clearTimeout(timeout.current);
					setState("IDLE");
				}
			}, [
				loading,
				state,
				options.delay,
				options.minDuration,
				isSSR
			]);
			react.useEffect(() => {
				return () => clearTimeout(timeout.current);
			}, []);
			return state === "DISPLAY" || state === "EXPIRE";
		}
		exports$1.defaultOptions = defaultOptions;
		exports$1.useSpinDelay = useSpinDelay;
	}));
}));
//#endregion
export default require_dist();
