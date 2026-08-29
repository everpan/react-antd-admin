import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { version } from "antd";
import AntModal from "antd/es/modal";
import AntUpload from "antd/es/upload";
import * as React from "react";
import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import AntButton from "antd/es/button";
import AntSlider from "antd/es/slider";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
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
//#endregion
//#region ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
	extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	};
	return extendStatics(d, b);
};
function __extends(d, b) {
	if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
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
//#endregion
//#region ../../node_modules/.pnpm/normalize-wheel@1.0.1/node_modules/normalize-wheel/src/UserAgent_DEPRECATED.js
var require_UserAgent_DEPRECATED = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Copyright 2004-present Facebook. All Rights Reserved.
	*
	* @providesModule UserAgent_DEPRECATED
	*/
	/**
	*  Provides entirely client-side User Agent and OS detection. You should prefer
	*  the non-deprecated UserAgent module when possible, which exposes our
	*  authoritative server-side PHP-based detection to the client.
	*
	*  Usage is straightforward:
	*
	*    if (UserAgent_DEPRECATED.ie()) {
	*      //  IE
	*    }
	*
	*  You can also do version checks:
	*
	*    if (UserAgent_DEPRECATED.ie() >= 7) {
	*      //  IE7 or better
	*    }
	*
	*  The browser functions will return NaN if the browser does not match, so
	*  you can also do version compares the other way:
	*
	*    if (UserAgent_DEPRECATED.ie() < 7) {
	*      //  IE6 or worse
	*    }
	*
	*  Note that the version is a float and may include a minor version number,
	*  so you should always use range operators to perform comparisons, not
	*  strict equality.
	*
	*  **Note:** You should **strongly** prefer capability detection to browser
	*  version detection where it's reasonable:
	*
	*    http://www.quirksmode.org/js/support.html
	*
	*  Further, we have a large number of mature wrapper functions and classes
	*  which abstract away many browser irregularities. Check the documentation,
	*  grep for things, or ask on javascript@lists.facebook.com before writing yet
	*  another copy of "event || window.event".
	*
	*/
	var _populated = false;
	var _ie;
	var _firefox;
	var _opera;
	var _webkit;
	var _chrome;
	var _ie_real_version;
	var _osx;
	var _windows;
	var _linux;
	var _android;
	var _win64;
	var _iphone;
	var _ipad;
	var _native;
	var _mobile;
	function _populate() {
		if (_populated) return;
		_populated = true;
		var uas = navigator.userAgent;
		var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
		var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);
		_iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
		_ipad = /\b(iP[ao]d)/.exec(uas);
		_android = /Android/i.exec(uas);
		_native = /FBAN\/\w+;/i.exec(uas);
		_mobile = /Mobile/i.exec(uas);
		_win64 = !!/Win64/.exec(uas);
		if (agent) {
			_ie = agent[1] ? parseFloat(agent[1]) : agent[5] ? parseFloat(agent[5]) : NaN;
			if (_ie && document && document.documentMode) _ie = document.documentMode;
			var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
			_ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;
			_firefox = agent[2] ? parseFloat(agent[2]) : NaN;
			_opera = agent[3] ? parseFloat(agent[3]) : NaN;
			_webkit = agent[4] ? parseFloat(agent[4]) : NaN;
			if (_webkit) {
				agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
				_chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
			} else _chrome = NaN;
		} else _ie = _firefox = _opera = _chrome = _webkit = NaN;
		if (os) {
			if (os[1]) {
				var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
				_osx = ver ? parseFloat(ver[1].replace("_", ".")) : true;
			} else _osx = false;
			_windows = !!os[2];
			_linux = !!os[3];
		} else _osx = _windows = _linux = false;
	}
	var UserAgent_DEPRECATED = {
		/**
		*  Check if the UA is Internet Explorer.
		*
		*
		*  @return float|NaN Version number (if match) or NaN.
		*/
		ie: function() {
			return _populate() || _ie;
		},
		/**
		* Check if we're in Internet Explorer compatibility mode.
		*
		* @return bool true if in compatibility mode, false if
		* not compatibility mode or not ie
		*/
		ieCompatibilityMode: function() {
			return _populate() || _ie_real_version > _ie;
		},
		/**
		* Whether the browser is 64-bit IE.  Really, this is kind of weak sauce;  we
		* only need this because Skype can't handle 64-bit IE yet.  We need to remove
		* this when we don't need it -- tracked by #601957.
		*/
		ie64: function() {
			return UserAgent_DEPRECATED.ie() && _win64;
		},
		/**
		*  Check if the UA is Firefox.
		*
		*
		*  @return float|NaN Version number (if match) or NaN.
		*/
		firefox: function() {
			return _populate() || _firefox;
		},
		/**
		*  Check if the UA is Opera.
		*
		*
		*  @return float|NaN Version number (if match) or NaN.
		*/
		opera: function() {
			return _populate() || _opera;
		},
		/**
		*  Check if the UA is WebKit.
		*
		*
		*  @return float|NaN Version number (if match) or NaN.
		*/
		webkit: function() {
			return _populate() || _webkit;
		},
		/**
		*  For Push
		*  WILL BE REMOVED VERY SOON. Use UserAgent_DEPRECATED.webkit
		*/
		safari: function() {
			return UserAgent_DEPRECATED.webkit();
		},
		/**
		*  Check if the UA is a Chrome browser.
		*
		*
		*  @return float|NaN Version number (if match) or NaN.
		*/
		chrome: function() {
			return _populate() || _chrome;
		},
		/**
		*  Check if the user is running Windows.
		*
		*  @return bool `true' if the user's OS is Windows.
		*/
		windows: function() {
			return _populate() || _windows;
		},
		/**
		*  Check if the user is running Mac OS X.
		*
		*  @return float|bool   Returns a float if a version number is detected,
		*                       otherwise true/false.
		*/
		osx: function() {
			return _populate() || _osx;
		},
		/**
		* Check if the user is running Linux.
		*
		* @return bool `true' if the user's OS is some flavor of Linux.
		*/
		linux: function() {
			return _populate() || _linux;
		},
		/**
		* Check if the user is running on an iPhone or iPod platform.
		*
		* @return bool `true' if the user is running some flavor of the
		*    iPhone OS.
		*/
		iphone: function() {
			return _populate() || _iphone;
		},
		mobile: function() {
			return _populate() || _iphone || _ipad || _android || _mobile;
		},
		nativeApp: function() {
			return _populate() || _native;
		},
		android: function() {
			return _populate() || _android;
		},
		ipad: function() {
			return _populate() || _ipad;
		}
	};
	module.exports = UserAgent_DEPRECATED;
}));
//#endregion
//#region ../../node_modules/.pnpm/normalize-wheel@1.0.1/node_modules/normalize-wheel/src/ExecutionEnvironment.js
/**
* Copyright (c) 2015, Facebook, Inc.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree. An additional grant
* of patent rights can be found in the PATENTS file in the same directory.
*
* @providesModule ExecutionEnvironment
*/
var require_ExecutionEnvironment = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
	module.exports = {
		canUseDOM,
		canUseWorkers: typeof Worker !== "undefined",
		canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
		canUseViewport: canUseDOM && !!window.screen,
		isInWorker: !canUseDOM
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/normalize-wheel@1.0.1/node_modules/normalize-wheel/src/isEventSupported.js
/**
* Copyright 2013-2015, Facebook, Inc.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree. An additional grant
* of patent rights can be found in the PATENTS file in the same directory.
*
* @providesModule isEventSupported
*/
var require_isEventSupported = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ExecutionEnvironment = require_ExecutionEnvironment();
	var useHasFeature;
	if (ExecutionEnvironment.canUseDOM) useHasFeature = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true;
	/**
	* Checks if an event is supported in the current execution environment.
	*
	* NOTE: This will not work correctly for non-generic events such as `change`,
	* `reset`, `load`, `error`, and `select`.
	*
	* Borrows from Modernizr.
	*
	* @param {string} eventNameSuffix Event name, e.g. "click".
	* @param {?boolean} capture Check if the capture phase is supported.
	* @return {boolean} True if the event is supported.
	* @internal
	* @license Modernizr 3.0.0pre (Custom Build) | MIT
	*/
	function isEventSupported(eventNameSuffix, capture) {
		if (!ExecutionEnvironment.canUseDOM || capture && !("addEventListener" in document)) return false;
		var eventName = "on" + eventNameSuffix;
		var isSupported = eventName in document;
		if (!isSupported) {
			var element = document.createElement("div");
			element.setAttribute(eventName, "return;");
			isSupported = typeof element[eventName] === "function";
		}
		if (!isSupported && useHasFeature && eventNameSuffix === "wheel") isSupported = document.implementation.hasFeature("Events.wheel", "3.0");
		return isSupported;
	}
	module.exports = isEventSupported;
}));
//#endregion
//#region ../../node_modules/.pnpm/normalize-wheel@1.0.1/node_modules/normalize-wheel/src/normalizeWheel.js
/**
* Copyright (c) 2015, Facebook, Inc.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree. An additional grant
* of patent rights can be found in the PATENTS file in the same directory.
*
* @providesModule normalizeWheel
* @typechecks
*/
var require_normalizeWheel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var UserAgent_DEPRECATED = require_UserAgent_DEPRECATED();
	var isEventSupported = require_isEventSupported();
	var PIXEL_STEP = 10;
	var LINE_HEIGHT = 40;
	var PAGE_HEIGHT = 800;
	/**
	* Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
	* complicated, thus this doc is long and (hopefully) detailed enough to answer
	* your questions.
	*
	* If you need to react to the mouse wheel in a predictable way, this code is
	* like your bestest friend. * hugs *
	*
	* As of today, there are 4 DOM event types you can listen to:
	*
	*   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
	*   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
	*   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
	*   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
	*
	* So what to do?  The is the best:
	*
	*   normalizeWheel.getEventType();
	*
	* In your event callback, use this code to get sane interpretation of the
	* deltas.  This code will return an object with properties:
	*
	*   spinX   -- normalized spin speed (use for zoom) - x plane
	*   spinY   -- " - y plane
	*   pixelX  -- normalized distance (to pixels) - x plane
	*   pixelY  -- " - y plane
	*
	* Wheel values are provided by the browser assuming you are using the wheel to
	* scroll a web page by a number of lines or pixels (or pages).  Values can vary
	* significantly on different platforms and browsers, forgetting that you can
	* scroll at different speeds.  Some devices (like trackpads) emit more events
	* at smaller increments with fine granularity, and some emit massive jumps with
	* linear speed or acceleration.
	*
	* This code does its best to normalize the deltas for you:
	*
	*   - spin is trying to normalize how far the wheel was spun (or trackpad
	*     dragged).  This is super useful for zoom support where you want to
	*     throw away the chunky scroll steps on the PC and make those equal to
	*     the slow and smooth tiny steps on the Mac. Key data: This code tries to
	*     resolve a single slow step on a wheel to 1.
	*
	*   - pixel is normalizing the desired scroll delta in pixel units.  You'll
	*     get the crazy differences between browsers, but at least it'll be in
	*     pixels!
	*
	*   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
	*     should translate to positive value zooming IN, negative zooming OUT.
	*     This matches the newer 'wheel' event.
	*
	* Why are there spinX, spinY (or pixels)?
	*
	*   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
	*     with a mouse.  It results in side-scrolling in the browser by default.
	*
	*   - spinY is what you expect -- it's the classic axis of a mouse wheel.
	*
	*   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
	*     probably is by browsers in conjunction with fancy 3D controllers .. but
	*     you know.
	*
	* Implementation info:
	*
	* Examples of 'wheel' event if you scroll slowly (down) by one step with an
	* average mouse:
	*
	*   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
	*   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
	*   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
	*   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
	*   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
	*
	* On the trackpad:
	*
	*   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
	*   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
	*
	* On other/older browsers.. it's more complicated as there can be multiple and
	* also missing delta values.
	*
	* The 'wheel' event is more standard:
	*
	* http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
	*
	* The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
	* deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
	* backward compatibility with older events.  Those other values help us
	* better normalize spin speed.  Example of what the browsers provide:
	*
	*                          | event.wheelDelta | event.detail
	*        ------------------+------------------+--------------
	*          Safari v5/OS X  |       -120       |       0
	*          Safari v5/Win7  |       -120       |       0
	*         Chrome v17/OS X  |       -120       |       0
	*         Chrome v17/Win7  |       -120       |       0
	*                IE9/Win7  |       -120       |   undefined
	*         Firefox v4/OS X  |     undefined    |       1
	*         Firefox v4/Win7  |     undefined    |       3
	*
	*/
	function normalizeWheel(event) {
		var sX = 0, sY = 0, pX = 0, pY = 0;
		if ("detail" in event) sY = event.detail;
		if ("wheelDelta" in event) sY = -event.wheelDelta / 120;
		if ("wheelDeltaY" in event) sY = -event.wheelDeltaY / 120;
		if ("wheelDeltaX" in event) sX = -event.wheelDeltaX / 120;
		if ("axis" in event && event.axis === event.HORIZONTAL_AXIS) {
			sX = sY;
			sY = 0;
		}
		pX = sX * PIXEL_STEP;
		pY = sY * PIXEL_STEP;
		if ("deltaY" in event) pY = event.deltaY;
		if ("deltaX" in event) pX = event.deltaX;
		if ((pX || pY) && event.deltaMode) {
			if (event.deltaMode == 1) {
				pX *= LINE_HEIGHT;
				pY *= LINE_HEIGHT;
			} else {
				pX *= PAGE_HEIGHT;
				pY *= PAGE_HEIGHT;
			}
		}
		if (pX && !sX) sX = pX < 1 ? -1 : 1;
		if (pY && !sY) sY = pY < 1 ? -1 : 1;
		return {
			spinX: sX,
			spinY: sY,
			pixelX: pX,
			pixelY: pY
		};
	}
	/**
	* The best combination if you prefer spinX + spinY normalization.  It favors
	* the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
	* 'wheel' event, making spin speed determination impossible.
	*/
	normalizeWheel.getEventType = function() {
		return UserAgent_DEPRECATED.firefox() ? "DOMMouseScroll" : isEventSupported("wheel") ? "wheel" : "mousewheel";
	};
	module.exports = normalizeWheel;
}));
//#endregion
//#region ../../node_modules/.pnpm/react-easy-crop@5.5.7_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-easy-crop/index.module.mjs
var import_normalize_wheel = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_normalizeWheel();
})))(), 1);
/**
* Compute the dimension of the crop area based on media size,
* aspect ratio and optionally rotation
*/
function getCropSize(mediaWidth, mediaHeight, containerWidth, containerHeight, aspect, rotation) {
	if (rotation === void 0) rotation = 0;
	var _a = rotateSize(mediaWidth, mediaHeight, rotation), width = _a.width, height = _a.height;
	var fittingWidth = Math.min(width, containerWidth);
	var fittingHeight = Math.min(height, containerHeight);
	if (fittingWidth > fittingHeight * aspect) return {
		width: fittingHeight * aspect,
		height: fittingHeight
	};
	return {
		width: fittingWidth,
		height: fittingWidth / aspect
	};
}
/**
* Compute media zoom.
* We fit the media into the container with "max-width: 100%; max-height: 100%;"
*/
function getMediaZoom(mediaSize) {
	return mediaSize.width > mediaSize.height ? mediaSize.width / mediaSize.naturalWidth : mediaSize.height / mediaSize.naturalHeight;
}
/**
* Ensure a new media position stays in the crop area.
*/
function restrictPosition(position, mediaSize, cropSize, zoom, rotation) {
	if (rotation === void 0) rotation = 0;
	var _a = rotateSize(mediaSize.width, mediaSize.height, rotation), width = _a.width, height = _a.height;
	return {
		x: restrictPositionCoord(position.x, width, cropSize.width, zoom),
		y: restrictPositionCoord(position.y, height, cropSize.height, zoom)
	};
}
function restrictPositionCoord(position, mediaSize, cropSize, zoom) {
	var maxPosition = Math.abs(mediaSize * zoom / 2 - cropSize / 2);
	return clamp(position, -maxPosition, maxPosition);
}
function getDistanceBetweenPoints(pointA, pointB) {
	return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
}
function getRotationBetweenPoints(pointA, pointB) {
	return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI;
}
/**
* Compute the output cropped area of the media in percentages and pixels.
* x/y are the top-left coordinates on the src media
*/
function computeCroppedArea(crop, mediaSize, cropSize, aspect, zoom, rotation, restrictPosition) {
	if (rotation === void 0) rotation = 0;
	if (restrictPosition === void 0) restrictPosition = true;
	var limitAreaFn = restrictPosition ? limitArea : noOp;
	var mediaBBoxSize = rotateSize(mediaSize.width, mediaSize.height, rotation);
	var mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);
	var croppedAreaPercentages = {
		x: limitAreaFn(100, ((mediaBBoxSize.width - cropSize.width / zoom) / 2 - crop.x / zoom) / mediaBBoxSize.width * 100),
		y: limitAreaFn(100, ((mediaBBoxSize.height - cropSize.height / zoom) / 2 - crop.y / zoom) / mediaBBoxSize.height * 100),
		width: limitAreaFn(100, cropSize.width / mediaBBoxSize.width * 100 / zoom),
		height: limitAreaFn(100, cropSize.height / mediaBBoxSize.height * 100 / zoom)
	};
	var widthInPixels = Math.round(limitAreaFn(mediaNaturalBBoxSize.width, croppedAreaPercentages.width * mediaNaturalBBoxSize.width / 100));
	var heightInPixels = Math.round(limitAreaFn(mediaNaturalBBoxSize.height, croppedAreaPercentages.height * mediaNaturalBBoxSize.height / 100));
	var sizePixels = mediaNaturalBBoxSize.width >= mediaNaturalBBoxSize.height * aspect ? {
		width: Math.round(heightInPixels * aspect),
		height: heightInPixels
	} : {
		width: widthInPixels,
		height: Math.round(widthInPixels / aspect)
	};
	return {
		croppedAreaPercentages,
		croppedAreaPixels: __assign(__assign({}, sizePixels), {
			x: Math.round(limitAreaFn(mediaNaturalBBoxSize.width - sizePixels.width, croppedAreaPercentages.x * mediaNaturalBBoxSize.width / 100)),
			y: Math.round(limitAreaFn(mediaNaturalBBoxSize.height - sizePixels.height, croppedAreaPercentages.y * mediaNaturalBBoxSize.height / 100))
		})
	};
}
/**
* Ensure the returned value is between 0 and max
*/
function limitArea(max, value) {
	return Math.min(max, Math.max(0, value));
}
function noOp(_max, value) {
	return value;
}
/**
* Compute crop and zoom from the croppedAreaPercentages.
*/
function getInitialCropFromCroppedAreaPercentages(croppedAreaPercentages, mediaSize, rotation, cropSize, minZoom, maxZoom) {
	var mediaBBoxSize = rotateSize(mediaSize.width, mediaSize.height, rotation);
	var zoom = clamp(cropSize.width / mediaBBoxSize.width * (100 / croppedAreaPercentages.width), minZoom, maxZoom);
	return {
		crop: {
			x: zoom * mediaBBoxSize.width / 2 - cropSize.width / 2 - mediaBBoxSize.width * zoom * (croppedAreaPercentages.x / 100),
			y: zoom * mediaBBoxSize.height / 2 - cropSize.height / 2 - mediaBBoxSize.height * zoom * (croppedAreaPercentages.y / 100)
		},
		zoom
	};
}
/**
* Compute zoom from the croppedAreaPixels
*/
function getZoomFromCroppedAreaPixels(croppedAreaPixels, mediaSize, cropSize) {
	var mediaZoom = getMediaZoom(mediaSize);
	return cropSize.height > cropSize.width ? cropSize.height / (croppedAreaPixels.height * mediaZoom) : cropSize.width / (croppedAreaPixels.width * mediaZoom);
}
/**
* Compute crop and zoom from the croppedAreaPixels
*/
function getInitialCropFromCroppedAreaPixels(croppedAreaPixels, mediaSize, rotation, cropSize, minZoom, maxZoom) {
	if (rotation === void 0) rotation = 0;
	var mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);
	var zoom = clamp(getZoomFromCroppedAreaPixels(croppedAreaPixels, mediaSize, cropSize), minZoom, maxZoom);
	var cropZoom = cropSize.height > cropSize.width ? cropSize.height / croppedAreaPixels.height : cropSize.width / croppedAreaPixels.width;
	return {
		crop: {
			x: ((mediaNaturalBBoxSize.width - croppedAreaPixels.width) / 2 - croppedAreaPixels.x) * cropZoom,
			y: ((mediaNaturalBBoxSize.height - croppedAreaPixels.height) / 2 - croppedAreaPixels.y) * cropZoom
		},
		zoom
	};
}
/**
* Return the point that is the center of point a and b
*/
function getCenter(a, b) {
	return {
		x: (b.x + a.x) / 2,
		y: (b.y + a.y) / 2
	};
}
function getRadianAngle(degreeValue) {
	return degreeValue * Math.PI / 180;
}
/**
* Returns the new bounding area of a rotated rectangle.
*/
function rotateSize(width, height, rotation) {
	var rotRad = getRadianAngle(rotation);
	return {
		width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
	};
}
/**
* Clamp value between min and max
*/
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}
/**
* Combine multiple class names into a single string.
*/
function classNames() {
	var args = [];
	for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
	return args.filter(function(value) {
		if (typeof value === "string" && value.length > 0) return true;
		return false;
	}).join(" ").trim();
}
var css_248z$1 = ".reactEasyCrop_Container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n  user-select: none;\n  touch-action: none;\n  cursor: move;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.reactEasyCrop_Image,\n.reactEasyCrop_Video {\n  will-change: transform; /* this improves performances and prevent painting issues on iOS Chrome */\n}\n\n.reactEasyCrop_Contain {\n  max-width: 100%;\n  max-height: 100%;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n.reactEasyCrop_Cover_Horizontal {\n  width: 100%;\n  height: auto;\n}\n.reactEasyCrop_Cover_Vertical {\n  width: auto;\n  height: 100%;\n}\n\n.reactEasyCrop_CropArea {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  box-sizing: border-box;\n  box-shadow: 0 0 0 9999em;\n  color: rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n}\n\n.reactEasyCrop_CropAreaRound {\n  border-radius: 50%;\n}\n\n.reactEasyCrop_CropAreaGrid::before {\n  content: ' ';\n  box-sizing: border-box;\n  position: absolute;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  top: 0;\n  bottom: 0;\n  left: 33.33%;\n  right: 33.33%;\n  border-top: 0;\n  border-bottom: 0;\n}\n\n.reactEasyCrop_CropAreaGrid::after {\n  content: ' ';\n  box-sizing: border-box;\n  position: absolute;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  top: 33.33%;\n  bottom: 33.33%;\n  left: 0;\n  right: 0;\n  border-left: 0;\n  border-right: 0;\n}\n";
var MIN_ZOOM = 1;
var MAX_ZOOM = 3;
var KEYBOARD_STEP = 1;
var Cropper = function(_super) {
	__extends(Cropper, _super);
	function Cropper() {
		var _this = _super !== null && _super.apply(this, arguments) || this;
		_this.cropperRef = React.createRef();
		_this.imageRef = React.createRef();
		_this.videoRef = React.createRef();
		_this.containerPosition = {
			x: 0,
			y: 0
		};
		_this.containerRef = null;
		_this.styleRef = null;
		_this.containerRect = null;
		_this.mediaSize = {
			width: 0,
			height: 0,
			naturalWidth: 0,
			naturalHeight: 0
		};
		_this.dragStartPosition = {
			x: 0,
			y: 0
		};
		_this.dragStartCrop = {
			x: 0,
			y: 0
		};
		_this.gestureZoomStart = 0;
		_this.gestureRotationStart = 0;
		_this.isTouching = false;
		_this.lastPinchDistance = 0;
		_this.lastPinchRotation = 0;
		_this.rafDragTimeout = null;
		_this.rafPinchTimeout = null;
		_this.wheelTimer = null;
		_this.currentDoc = typeof document !== "undefined" ? document : null;
		_this.currentWindow = typeof window !== "undefined" ? window : null;
		_this.resizeObserver = null;
		_this.previousCropSize = null;
		_this.isInitialized = false;
		_this.state = {
			cropSize: null,
			hasWheelJustStarted: false,
			mediaObjectFit: void 0
		};
		_this.initResizeObserver = function() {
			if (typeof window.ResizeObserver === "undefined" || !_this.containerRef) return;
			var isFirstResize = true;
			_this.resizeObserver = new window.ResizeObserver(function(entries) {
				if (isFirstResize) {
					isFirstResize = false;
					return;
				}
				_this.computeSizes();
			});
			_this.resizeObserver.observe(_this.containerRef);
		};
		_this.preventZoomSafari = function(e) {
			return e.preventDefault();
		};
		_this.cleanEvents = function() {
			if (!_this.currentDoc) return;
			_this.currentDoc.removeEventListener("mousemove", _this.onMouseMove);
			_this.currentDoc.removeEventListener("mouseup", _this.onDragStopped);
			_this.currentDoc.removeEventListener("touchmove", _this.onTouchMove);
			_this.currentDoc.removeEventListener("touchend", _this.onDragStopped);
			_this.currentDoc.removeEventListener("gesturechange", _this.onGestureChange);
			_this.currentDoc.removeEventListener("gestureend", _this.onGestureEnd);
			_this.currentDoc.removeEventListener("scroll", _this.onScroll);
		};
		_this.clearScrollEvent = function() {
			if (_this.containerRef) _this.containerRef.removeEventListener("wheel", _this.onWheel);
			if (_this.wheelTimer) clearTimeout(_this.wheelTimer);
		};
		_this.onMediaLoad = function() {
			var cropSize = _this.computeSizes();
			if (cropSize) {
				_this.previousCropSize = cropSize;
				_this.emitCropData();
				_this.setInitialCrop(cropSize);
				_this.isInitialized = true;
			}
			if (_this.props.onMediaLoaded) _this.props.onMediaLoaded(_this.mediaSize);
		};
		_this.setInitialCrop = function(cropSize) {
			if (_this.props.initialCroppedAreaPercentages) {
				var _a = getInitialCropFromCroppedAreaPercentages(_this.props.initialCroppedAreaPercentages, _this.mediaSize, _this.props.rotation, cropSize, _this.props.minZoom, _this.props.maxZoom), crop = _a.crop, zoom = _a.zoom;
				_this.props.onCropChange(crop);
				_this.props.onZoomChange && _this.props.onZoomChange(zoom);
			} else if (_this.props.initialCroppedAreaPixels) {
				var _b = getInitialCropFromCroppedAreaPixels(_this.props.initialCroppedAreaPixels, _this.mediaSize, _this.props.rotation, cropSize, _this.props.minZoom, _this.props.maxZoom), crop = _b.crop, zoom = _b.zoom;
				_this.props.onCropChange(crop);
				_this.props.onZoomChange && _this.props.onZoomChange(zoom);
			}
		};
		_this.computeSizes = function() {
			var _a, _b, _c, _d, _e, _f;
			var mediaRef = _this.imageRef.current || _this.videoRef.current;
			if (mediaRef && _this.containerRef) {
				_this.containerRect = _this.containerRef.getBoundingClientRect();
				_this.saveContainerPosition();
				var containerAspect = _this.containerRect.width / _this.containerRect.height;
				var naturalWidth = ((_a = _this.imageRef.current) === null || _a === void 0 ? void 0 : _a.naturalWidth) || ((_b = _this.videoRef.current) === null || _b === void 0 ? void 0 : _b.videoWidth) || 0;
				var naturalHeight = ((_c = _this.imageRef.current) === null || _c === void 0 ? void 0 : _c.naturalHeight) || ((_d = _this.videoRef.current) === null || _d === void 0 ? void 0 : _d.videoHeight) || 0;
				var isMediaScaledDown = mediaRef.offsetWidth < naturalWidth || mediaRef.offsetHeight < naturalHeight;
				var mediaAspect = naturalWidth / naturalHeight;
				var renderedMediaSize = void 0;
				if (isMediaScaledDown) switch (_this.state.mediaObjectFit) {
					default:
					case "contain":
						renderedMediaSize = containerAspect > mediaAspect ? {
							width: _this.containerRect.height * mediaAspect,
							height: _this.containerRect.height
						} : {
							width: _this.containerRect.width,
							height: _this.containerRect.width / mediaAspect
						};
						break;
					case "horizontal-cover":
						renderedMediaSize = {
							width: _this.containerRect.width,
							height: _this.containerRect.width / mediaAspect
						};
						break;
					case "vertical-cover": renderedMediaSize = {
						width: _this.containerRect.height * mediaAspect,
						height: _this.containerRect.height
					};
				}
				else renderedMediaSize = {
					width: mediaRef.offsetWidth,
					height: mediaRef.offsetHeight
				};
				_this.mediaSize = __assign(__assign({}, renderedMediaSize), {
					naturalWidth,
					naturalHeight
				});
				if (_this.props.setMediaSize) _this.props.setMediaSize(_this.mediaSize);
				var cropSize = _this.props.cropSize ? _this.props.cropSize : getCropSize(_this.mediaSize.width, _this.mediaSize.height, _this.containerRect.width, _this.containerRect.height, _this.props.aspect, _this.props.rotation);
				if (((_e = _this.state.cropSize) === null || _e === void 0 ? void 0 : _e.height) !== cropSize.height || ((_f = _this.state.cropSize) === null || _f === void 0 ? void 0 : _f.width) !== cropSize.width) _this.props.onCropSizeChange && _this.props.onCropSizeChange(cropSize);
				_this.setState({ cropSize }, _this.recomputeCropPosition);
				if (_this.props.setCropSize) _this.props.setCropSize(cropSize);
				return cropSize;
			}
		};
		_this.saveContainerPosition = function() {
			if (_this.containerRef) {
				var bounds = _this.containerRef.getBoundingClientRect();
				_this.containerPosition = {
					x: bounds.left,
					y: bounds.top
				};
			}
		};
		_this.onMouseDown = function(e) {
			if (!_this.currentDoc) return;
			e.preventDefault();
			_this.currentDoc.addEventListener("mousemove", _this.onMouseMove);
			_this.currentDoc.addEventListener("mouseup", _this.onDragStopped);
			_this.saveContainerPosition();
			_this.onDragStart(Cropper.getMousePoint(e));
		};
		_this.onMouseMove = function(e) {
			return _this.onDrag(Cropper.getMousePoint(e));
		};
		_this.onScroll = function(e) {
			if (!_this.currentDoc) return;
			e.preventDefault();
			_this.saveContainerPosition();
		};
		_this.onTouchStart = function(e) {
			if (!_this.currentDoc) return;
			_this.isTouching = true;
			if (_this.props.onTouchRequest && !_this.props.onTouchRequest(e)) return;
			_this.currentDoc.addEventListener("touchmove", _this.onTouchMove, { passive: false });
			_this.currentDoc.addEventListener("touchend", _this.onDragStopped);
			_this.saveContainerPosition();
			if (e.touches.length === 2) _this.onPinchStart(e);
			else if (e.touches.length === 1) _this.onDragStart(Cropper.getTouchPoint(e.touches[0]));
		};
		_this.onTouchMove = function(e) {
			e.preventDefault();
			if (e.touches.length === 2) _this.onPinchMove(e);
			else if (e.touches.length === 1) _this.onDrag(Cropper.getTouchPoint(e.touches[0]));
		};
		_this.onGestureStart = function(e) {
			if (!_this.currentDoc) return;
			e.preventDefault();
			_this.currentDoc.addEventListener("gesturechange", _this.onGestureChange);
			_this.currentDoc.addEventListener("gestureend", _this.onGestureEnd);
			_this.gestureZoomStart = _this.props.zoom;
			_this.gestureRotationStart = _this.props.rotation;
		};
		_this.onGestureChange = function(e) {
			e.preventDefault();
			if (_this.isTouching) return;
			var point = Cropper.getMousePoint(e);
			var newZoom = _this.gestureZoomStart - 1 + e.scale;
			_this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
			if (_this.props.onRotationChange) {
				var newRotation = _this.gestureRotationStart + e.rotation;
				_this.props.onRotationChange(newRotation);
			}
		};
		_this.onGestureEnd = function(e) {
			_this.cleanEvents();
		};
		_this.onDragStart = function(_a) {
			var _b, _c;
			_this.dragStartPosition = {
				x: _a.x,
				y: _a.y
			};
			_this.dragStartCrop = __assign({}, _this.props.crop);
			(_c = (_b = _this.props).onInteractionStart) === null || _c === void 0 || _c.call(_b);
		};
		_this.onDrag = function(_a) {
			var x = _a.x, y = _a.y;
			if (!_this.currentWindow) return;
			if (_this.rafDragTimeout) _this.currentWindow.cancelAnimationFrame(_this.rafDragTimeout);
			_this.rafDragTimeout = _this.currentWindow.requestAnimationFrame(function() {
				if (!_this.state.cropSize) return;
				if (x === void 0 || y === void 0) return;
				var offsetX = x - _this.dragStartPosition.x;
				var offsetY = y - _this.dragStartPosition.y;
				var requestedPosition = {
					x: _this.dragStartCrop.x + offsetX,
					y: _this.dragStartCrop.y + offsetY
				};
				var newPosition = _this.props.restrictPosition ? restrictPosition(requestedPosition, _this.mediaSize, _this.state.cropSize, _this.props.zoom, _this.props.rotation) : requestedPosition;
				_this.props.onCropChange(newPosition);
			});
		};
		_this.onDragStopped = function() {
			var _a, _b;
			_this.isTouching = false;
			_this.cleanEvents();
			_this.emitCropData();
			(_b = (_a = _this.props).onInteractionEnd) === null || _b === void 0 || _b.call(_a);
		};
		_this.onWheel = function(e) {
			if (!_this.currentWindow) return;
			if (_this.props.onWheelRequest && !_this.props.onWheelRequest(e)) return;
			e.preventDefault();
			var point = Cropper.getMousePoint(e);
			var pixelY = (0, import_normalize_wheel.default)(e).pixelY;
			var newZoom = _this.props.zoom - pixelY * _this.props.zoomSpeed / 200;
			_this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
			if (!_this.state.hasWheelJustStarted) _this.setState({ hasWheelJustStarted: true }, function() {
				var _a, _b;
				return (_b = (_a = _this.props).onInteractionStart) === null || _b === void 0 ? void 0 : _b.call(_a);
			});
			if (_this.wheelTimer) clearTimeout(_this.wheelTimer);
			_this.wheelTimer = _this.currentWindow.setTimeout(function() {
				return _this.setState({ hasWheelJustStarted: false }, function() {
					var _a, _b;
					return (_b = (_a = _this.props).onInteractionEnd) === null || _b === void 0 ? void 0 : _b.call(_a);
				});
			}, 250);
		};
		_this.getPointOnContainer = function(_a, containerTopLeft) {
			var x = _a.x, y = _a.y;
			if (!_this.containerRect) throw new Error("The Cropper is not mounted");
			return {
				x: _this.containerRect.width / 2 - (x - containerTopLeft.x),
				y: _this.containerRect.height / 2 - (y - containerTopLeft.y)
			};
		};
		_this.getPointOnMedia = function(_a) {
			var x = _a.x, y = _a.y;
			var _b = _this.props, crop = _b.crop, zoom = _b.zoom;
			return {
				x: (x + crop.x) / zoom,
				y: (y + crop.y) / zoom
			};
		};
		_this.setNewZoom = function(zoom, point, _a) {
			var _c = (_a === void 0 ? {} : _a).shouldUpdatePosition, shouldUpdatePosition = _c === void 0 ? true : _c;
			if (!_this.state.cropSize || !_this.props.onZoomChange) return;
			var newZoom = clamp(zoom, _this.props.minZoom, _this.props.maxZoom);
			if (shouldUpdatePosition) {
				var zoomPoint = _this.getPointOnContainer(point, _this.containerPosition);
				var zoomTarget = _this.getPointOnMedia(zoomPoint);
				var requestedPosition = {
					x: zoomTarget.x * newZoom - zoomPoint.x,
					y: zoomTarget.y * newZoom - zoomPoint.y
				};
				var newPosition = _this.props.restrictPosition ? restrictPosition(requestedPosition, _this.mediaSize, _this.state.cropSize, newZoom, _this.props.rotation) : requestedPosition;
				_this.props.onCropChange(newPosition);
			}
			_this.props.onZoomChange(newZoom);
		};
		_this.getCropData = function() {
			if (!_this.state.cropSize) return null;
			return computeCroppedArea(_this.props.restrictPosition ? restrictPosition(_this.props.crop, _this.mediaSize, _this.state.cropSize, _this.props.zoom, _this.props.rotation) : _this.props.crop, _this.mediaSize, _this.state.cropSize, _this.getAspect(), _this.props.zoom, _this.props.rotation, _this.props.restrictPosition);
		};
		_this.emitCropData = function() {
			var cropData = _this.getCropData();
			if (!cropData) return;
			var croppedAreaPercentages = cropData.croppedAreaPercentages, croppedAreaPixels = cropData.croppedAreaPixels;
			if (_this.props.onCropComplete) _this.props.onCropComplete(croppedAreaPercentages, croppedAreaPixels);
			if (_this.props.onCropAreaChange) _this.props.onCropAreaChange(croppedAreaPercentages, croppedAreaPixels);
		};
		_this.emitCropAreaChange = function() {
			var cropData = _this.getCropData();
			if (!cropData) return;
			var croppedAreaPercentages = cropData.croppedAreaPercentages, croppedAreaPixels = cropData.croppedAreaPixels;
			if (_this.props.onCropAreaChange) _this.props.onCropAreaChange(croppedAreaPercentages, croppedAreaPixels);
		};
		_this.recomputeCropPosition = function() {
			var _a, _b;
			if (!_this.state.cropSize) return;
			var adjustedCrop = _this.props.crop;
			if (_this.isInitialized && ((_a = _this.previousCropSize) === null || _a === void 0 ? void 0 : _a.width) && ((_b = _this.previousCropSize) === null || _b === void 0 ? void 0 : _b.height)) {
				if (Math.abs(_this.previousCropSize.width - _this.state.cropSize.width) > 1e-6 || Math.abs(_this.previousCropSize.height - _this.state.cropSize.height) > 1e-6) {
					var scaleX = _this.state.cropSize.width / _this.previousCropSize.width;
					var scaleY = _this.state.cropSize.height / _this.previousCropSize.height;
					adjustedCrop = {
						x: _this.props.crop.x * scaleX,
						y: _this.props.crop.y * scaleY
					};
				}
			}
			var newPosition = _this.props.restrictPosition ? restrictPosition(adjustedCrop, _this.mediaSize, _this.state.cropSize, _this.props.zoom, _this.props.rotation) : adjustedCrop;
			_this.previousCropSize = _this.state.cropSize;
			_this.props.onCropChange(newPosition);
			_this.emitCropData();
		};
		_this.onKeyDown = function(event) {
			var _a, _b;
			var _c = _this.props, crop = _c.crop, onCropChange = _c.onCropChange, keyboardStep = _c.keyboardStep, zoom = _c.zoom, rotation = _c.rotation;
			var step = keyboardStep;
			if (!_this.state.cropSize) return;
			if (event.shiftKey) step *= .2;
			var newCrop = __assign({}, crop);
			switch (event.key) {
				case "ArrowUp":
					newCrop.y -= step;
					event.preventDefault();
					break;
				case "ArrowDown":
					newCrop.y += step;
					event.preventDefault();
					break;
				case "ArrowLeft":
					newCrop.x -= step;
					event.preventDefault();
					break;
				case "ArrowRight":
					newCrop.x += step;
					event.preventDefault();
					break;
				default: return;
			}
			if (_this.props.restrictPosition) newCrop = restrictPosition(newCrop, _this.mediaSize, _this.state.cropSize, zoom, rotation);
			if (!event.repeat) (_b = (_a = _this.props).onInteractionStart) === null || _b === void 0 || _b.call(_a);
			onCropChange(newCrop);
		};
		_this.onKeyUp = function(event) {
			var _a, _b;
			switch (event.key) {
				case "ArrowUp":
				case "ArrowDown":
				case "ArrowLeft":
				case "ArrowRight":
					event.preventDefault();
					break;
				default: return;
			}
			_this.emitCropData();
			(_b = (_a = _this.props).onInteractionEnd) === null || _b === void 0 || _b.call(_a);
		};
		return _this;
	}
	Cropper.prototype.componentDidMount = function() {
		if (!this.currentDoc || !this.currentWindow) return;
		if (this.containerRef) {
			if (this.containerRef.ownerDocument) this.currentDoc = this.containerRef.ownerDocument;
			if (this.currentDoc.defaultView) this.currentWindow = this.currentDoc.defaultView;
			this.initResizeObserver();
			if (typeof window.ResizeObserver === "undefined") this.currentWindow.addEventListener("resize", this.computeSizes);
			this.props.zoomWithScroll && this.containerRef.addEventListener("wheel", this.onWheel, { passive: false });
			this.containerRef.addEventListener("gesturestart", this.onGestureStart);
		}
		this.currentDoc.addEventListener("scroll", this.onScroll);
		if (!this.props.disableAutomaticStylesInjection) {
			this.styleRef = this.currentDoc.createElement("style");
			this.styleRef.setAttribute("type", "text/css");
			if (this.props.nonce) this.styleRef.setAttribute("nonce", this.props.nonce);
			this.styleRef.innerHTML = css_248z$1;
			this.currentDoc.head.appendChild(this.styleRef);
		}
		if (this.imageRef.current && this.imageRef.current.complete) this.onMediaLoad();
		if (this.props.setImageRef) this.props.setImageRef(this.imageRef);
		if (this.props.setVideoRef) this.props.setVideoRef(this.videoRef);
		if (this.props.setCropperRef) this.props.setCropperRef(this.cropperRef);
	};
	Cropper.prototype.componentWillUnmount = function() {
		var _a, _b;
		if (!this.currentDoc || !this.currentWindow) return;
		if (typeof window.ResizeObserver === "undefined") this.currentWindow.removeEventListener("resize", this.computeSizes);
		(_a = this.resizeObserver) === null || _a === void 0 || _a.disconnect();
		if (this.containerRef) this.containerRef.removeEventListener("gesturestart", this.preventZoomSafari);
		if (this.styleRef) (_b = this.styleRef.parentNode) === null || _b === void 0 || _b.removeChild(this.styleRef);
		this.cleanEvents();
		this.props.zoomWithScroll && this.clearScrollEvent();
	};
	Cropper.prototype.componentDidUpdate = function(prevProps) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j;
		if (prevProps.rotation !== this.props.rotation) {
			this.computeSizes();
			this.recomputeCropPosition();
		} else if (prevProps.aspect !== this.props.aspect) this.computeSizes();
		else if (prevProps.objectFit !== this.props.objectFit) this.computeSizes();
		else if (prevProps.zoom !== this.props.zoom) this.recomputeCropPosition();
		else if (((_a = prevProps.cropSize) === null || _a === void 0 ? void 0 : _a.height) !== ((_b = this.props.cropSize) === null || _b === void 0 ? void 0 : _b.height) || ((_c = prevProps.cropSize) === null || _c === void 0 ? void 0 : _c.width) !== ((_d = this.props.cropSize) === null || _d === void 0 ? void 0 : _d.width)) this.computeSizes();
		else if (((_e = prevProps.crop) === null || _e === void 0 ? void 0 : _e.x) !== ((_f = this.props.crop) === null || _f === void 0 ? void 0 : _f.x) || ((_g = prevProps.crop) === null || _g === void 0 ? void 0 : _g.y) !== ((_h = this.props.crop) === null || _h === void 0 ? void 0 : _h.y)) this.emitCropAreaChange();
		if (prevProps.zoomWithScroll !== this.props.zoomWithScroll && this.containerRef) this.props.zoomWithScroll ? this.containerRef.addEventListener("wheel", this.onWheel, { passive: false }) : this.clearScrollEvent();
		if (prevProps.video !== this.props.video) (_j = this.videoRef.current) === null || _j === void 0 || _j.load();
		var objectFit = this.getObjectFit();
		if (objectFit !== this.state.mediaObjectFit) this.setState({ mediaObjectFit: objectFit }, this.computeSizes);
	};
	Cropper.prototype.getAspect = function() {
		var _a = this.props, cropSize = _a.cropSize, aspect = _a.aspect;
		if (cropSize) return cropSize.width / cropSize.height;
		return aspect;
	};
	Cropper.prototype.getObjectFit = function() {
		var _a, _b, _c, _d;
		if (this.props.objectFit === "cover") {
			if ((this.imageRef.current || this.videoRef.current) && this.containerRef) {
				this.containerRect = this.containerRef.getBoundingClientRect();
				var containerAspect = this.containerRect.width / this.containerRect.height;
				return (((_a = this.imageRef.current) === null || _a === void 0 ? void 0 : _a.naturalWidth) || ((_b = this.videoRef.current) === null || _b === void 0 ? void 0 : _b.videoWidth) || 0) / (((_c = this.imageRef.current) === null || _c === void 0 ? void 0 : _c.naturalHeight) || ((_d = this.videoRef.current) === null || _d === void 0 ? void 0 : _d.videoHeight) || 0) < containerAspect ? "horizontal-cover" : "vertical-cover";
			}
			return "horizontal-cover";
		}
		return this.props.objectFit;
	};
	Cropper.prototype.onPinchStart = function(e) {
		var pointA = Cropper.getTouchPoint(e.touches[0]);
		var pointB = Cropper.getTouchPoint(e.touches[1]);
		this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB);
		this.lastPinchRotation = getRotationBetweenPoints(pointA, pointB);
		this.onDragStart(getCenter(pointA, pointB));
	};
	Cropper.prototype.onPinchMove = function(e) {
		var _this = this;
		if (!this.currentDoc || !this.currentWindow) return;
		var pointA = Cropper.getTouchPoint(e.touches[0]);
		var pointB = Cropper.getTouchPoint(e.touches[1]);
		var center = getCenter(pointA, pointB);
		this.onDrag(center);
		if (this.rafPinchTimeout) this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout);
		this.rafPinchTimeout = this.currentWindow.requestAnimationFrame(function() {
			var distance = getDistanceBetweenPoints(pointA, pointB);
			var newZoom = _this.props.zoom * (distance / _this.lastPinchDistance);
			_this.setNewZoom(newZoom, center, { shouldUpdatePosition: false });
			_this.lastPinchDistance = distance;
			var rotation = getRotationBetweenPoints(pointA, pointB);
			var newRotation = _this.props.rotation + (rotation - _this.lastPinchRotation);
			_this.props.onRotationChange && _this.props.onRotationChange(newRotation);
			_this.lastPinchRotation = rotation;
		});
	};
	Cropper.prototype.render = function() {
		var _this = this;
		var _a;
		var _b = this.props, image = _b.image, video = _b.video, mediaProps = _b.mediaProps, cropperProps = _b.cropperProps, transform = _b.transform, _c = _b.crop, x = _c.x, y = _c.y, rotation = _b.rotation, zoom = _b.zoom, cropShape = _b.cropShape, showGrid = _b.showGrid, roundCropAreaPixels = _b.roundCropAreaPixels, _d = _b.style, containerStyle = _d.containerStyle, cropAreaStyle = _d.cropAreaStyle, mediaStyle = _d.mediaStyle, _e = _b.classes, containerClassName = _e.containerClassName, cropAreaClassName = _e.cropAreaClassName, mediaClassName = _e.mediaClassName;
		var objectFit = (_a = this.state.mediaObjectFit) !== null && _a !== void 0 ? _a : this.getObjectFit();
		return React.createElement("div", {
			onMouseDown: this.onMouseDown,
			onTouchStart: this.onTouchStart,
			ref: function ref(el) {
				return _this.containerRef = el;
			},
			"data-testid": "container",
			style: containerStyle,
			className: classNames("reactEasyCrop_Container", containerClassName)
		}, image ? React.createElement("img", __assign({
			alt: "",
			className: classNames("reactEasyCrop_Image", objectFit === "contain" && "reactEasyCrop_Contain", objectFit === "horizontal-cover" && "reactEasyCrop_Cover_Horizontal", objectFit === "vertical-cover" && "reactEasyCrop_Cover_Vertical", mediaClassName)
		}, mediaProps, {
			src: image,
			ref: this.imageRef,
			style: __assign(__assign({}, mediaStyle), { transform: transform || "translate(".concat(x, "px, ").concat(y, "px) rotate(").concat(rotation, "deg) scale(").concat(zoom, ")") }),
			onLoad: this.onMediaLoad
		})) : video && React.createElement("video", __assign({
			autoPlay: true,
			playsInline: true,
			loop: true,
			muted: true,
			className: classNames("reactEasyCrop_Video", objectFit === "contain" && "reactEasyCrop_Contain", objectFit === "horizontal-cover" && "reactEasyCrop_Cover_Horizontal", objectFit === "vertical-cover" && "reactEasyCrop_Cover_Vertical", mediaClassName)
		}, mediaProps, {
			ref: this.videoRef,
			onLoadedMetadata: this.onMediaLoad,
			style: __assign(__assign({}, mediaStyle), { transform: transform || "translate(".concat(x, "px, ").concat(y, "px) rotate(").concat(rotation, "deg) scale(").concat(zoom, ")") }),
			controls: false
		}), (Array.isArray(video) ? video : [{ src: video }]).map(function(item) {
			return React.createElement("source", __assign({ key: item.src }, item));
		})), this.state.cropSize && React.createElement("div", __assign({
			ref: this.cropperRef,
			style: __assign(__assign({}, cropAreaStyle), {
				width: roundCropAreaPixels ? Math.round(this.state.cropSize.width) : this.state.cropSize.width,
				height: roundCropAreaPixels ? Math.round(this.state.cropSize.height) : this.state.cropSize.height
			}),
			tabIndex: 0,
			onKeyDown: this.onKeyDown,
			onKeyUp: this.onKeyUp,
			"data-testid": "cropper",
			className: classNames("reactEasyCrop_CropArea", cropShape === "round" && "reactEasyCrop_CropAreaRound", showGrid && "reactEasyCrop_CropAreaGrid", cropAreaClassName)
		}, cropperProps)));
	};
	Cropper.defaultProps = {
		zoom: 1,
		rotation: 0,
		aspect: 4 / 3,
		maxZoom: MAX_ZOOM,
		minZoom: MIN_ZOOM,
		cropShape: "rect",
		objectFit: "contain",
		showGrid: true,
		style: {},
		classes: {},
		mediaProps: {},
		cropperProps: {},
		zoomSpeed: 1,
		restrictPosition: true,
		zoomWithScroll: true,
		keyboardStep: KEYBOARD_STEP
	};
	Cropper.getMousePoint = function(e) {
		return {
			x: Number(e.clientX),
			y: Number(e.clientY)
		};
	};
	Cropper.getTouchPoint = function(touch) {
		return {
			x: Number(touch.clientX),
			y: Number(touch.clientY)
		};
	};
	return Cropper;
}(React.Component);
//#endregion
//#region ../../node_modules/.pnpm/antd-img-crop@4.30.0_antd@6.6.1_react-dom@19.2.8_react@19.2.8__react@19.2.8__react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd-img-crop/dist/antd-img-crop.esm.js
var PREFIX = "img-crop";
var ZOOM_INITIAL = 1;
var ZOOM_STEP = .1;
var ROTATION_INITIAL = 0;
var ROTATION_MIN = -180;
var ROTATION_MAX = 180;
var ROTATION_STEP = 1;
var ASPECT_STEP = .01;
var EasyCrop = forwardRef((props, ref) => {
	const { cropperRef, zoomSlider, rotationSlider, aspectSlider, showReset, resetBtnText, modalImage, aspect: propAspect, minZoom, maxZoom, minAspect, maxAspect, cropShape, showGrid, cropperProps } = props;
	const [crop, setCrop] = useState({
		x: 0,
		y: 0
	});
	const [zoom, setZoom] = useState(ZOOM_INITIAL);
	const [rotation, setRotation] = useState(ROTATION_INITIAL);
	const [aspect, setAspect] = useState(propAspect);
	const cropPixelsRef = useRef({
		width: 0,
		height: 0,
		x: 0,
		y: 0
	});
	const onCropComplete = useCallback((_, croppedAreaPixels) => {
		cropPixelsRef.current = croppedAreaPixels;
	}, []);
	const prevPropAspect = useRef(propAspect);
	if (prevPropAspect.current !== propAspect) {
		prevPropAspect.current = propAspect;
		setAspect(propAspect);
	}
	const isResetActive = zoom !== ZOOM_INITIAL || rotation !== ROTATION_INITIAL || aspect !== propAspect;
	const onReset = () => {
		setZoom(ZOOM_INITIAL);
		setRotation(ROTATION_INITIAL);
		setAspect(propAspect);
	};
	useImperativeHandle(ref, () => ({
		rotation,
		cropPixelsRef,
		onReset
	}));
	const wrapperClass = "[display:flex] [align-items:center] [width:60%] [margin-inline:auto]";
	const buttonClass = "[display:flex] [align-items:center] [justify-content:center] [height:32px] [width:32px] [background:transparent] [border:0] [font-family:inherit] [font-size:18px] [cursor:pointer] disabled:[opacity:20%] disabled:[cursor:default]";
	const sliderClass = "[flex:1]";
	return jsxs(Fragment, { children: [
		jsx(Cropper, Object.assign({}, cropperProps, {
			ref: cropperRef,
			image: modalImage,
			crop,
			zoom,
			rotation,
			aspect,
			minZoom,
			maxZoom,
			zoomWithScroll: zoomSlider,
			cropShape,
			showGrid,
			onCropChange: setCrop,
			onZoomChange: setZoom,
			onRotationChange: setRotation,
			onCropComplete,
			classes: {
				containerClassName: `${PREFIX}-container ![position:relative] [width:100%] [height:40vh] [&~section:first-of-type]:[margin-top:16px] [&~section:last-of-type]:[margin-bottom:16px]`,
				mediaClassName: `${PREFIX}-media`
			}
		})),
		zoomSlider && jsxs("section", {
			className: `${PREFIX}-control ${PREFIX}-control-zoom ${wrapperClass}`,
			children: [
				jsx("button", {
					className: buttonClass,
					onClick: () => setZoom(+(zoom - ZOOM_STEP).toFixed(1)),
					disabled: zoom - ZOOM_STEP < minZoom,
					children: "－"
				}),
				jsx(AntSlider, {
					className: sliderClass,
					min: minZoom,
					max: maxZoom,
					step: ZOOM_STEP,
					value: zoom,
					onChange: setZoom
				}),
				jsx("button", {
					className: buttonClass,
					onClick: () => setZoom(+(zoom + ZOOM_STEP).toFixed(1)),
					disabled: zoom + ZOOM_STEP > maxZoom,
					children: "＋"
				})
			]
		}),
		rotationSlider && jsxs("section", {
			className: `${PREFIX}-control ${PREFIX}-control-rotation ${wrapperClass}`,
			children: [
				jsx("button", {
					className: `${buttonClass} [font-size:16px]`,
					onClick: () => setRotation(rotation - ROTATION_STEP),
					disabled: rotation === ROTATION_MIN,
					children: "↺"
				}),
				jsx(AntSlider, {
					className: sliderClass,
					min: ROTATION_MIN,
					max: ROTATION_MAX,
					step: ROTATION_STEP,
					value: rotation,
					onChange: setRotation
				}),
				jsx("button", {
					className: `${buttonClass} [font-size:16px]`,
					onClick: () => setRotation(rotation + ROTATION_STEP),
					disabled: rotation === ROTATION_MAX,
					children: "↻"
				})
			]
		}),
		aspectSlider && jsxs("section", {
			className: `${PREFIX}-control ${PREFIX}-control-aspect ${wrapperClass}`,
			children: [
				jsx("button", {
					className: buttonClass,
					onClick: () => setAspect(+(aspect - ASPECT_STEP).toFixed(2)),
					disabled: aspect - ASPECT_STEP < minAspect,
					children: "↕"
				}),
				jsx(AntSlider, {
					className: sliderClass,
					min: minAspect,
					max: maxAspect,
					step: ASPECT_STEP,
					value: aspect,
					onChange: setAspect
				}),
				jsx("button", {
					className: buttonClass,
					onClick: () => setAspect(+(aspect + ASPECT_STEP).toFixed(2)),
					disabled: aspect + ASPECT_STEP > maxAspect,
					children: "↔"
				})
			]
		}),
		showReset && (zoomSlider || rotationSlider || aspectSlider) && jsx(AntButton, {
			className: "[position:absolute] [bottom:20px]",
			style: isResetActive ? {} : {
				opacity: .3,
				pointerEvents: "none"
			},
			onClick: onReset,
			children: resetBtnText
		})
	] });
});
var EasyCrop$1 = memo(EasyCrop);
var css_248z = "/*! tailwindcss v4.2.1 | MIT License | https://tailwindcss.com */.visible{visibility:visible}.\\!\\[position\\:relative\\]{position:relative!important}.\\[position\\:absolute\\]{position:absolute}.\\[bottom\\:20px\\]{bottom:20px}.container{width:100%}.\\[margin-inline\\:auto\\]{margin-inline:auto}.\\[display\\:flex\\]{display:flex}.grid{display:grid}.\\[height\\:32px\\]{height:32px}.\\[height\\:40vh\\]{height:40vh}.\\[width\\:32px\\]{width:32px}.\\[width\\:60\\%\\]{width:60%}.\\[width\\:100\\%\\]{width:100%}.\\[flex\\:1\\]{flex:1}.\\[cursor\\:pointer\\]{cursor:pointer}.\\[align-items\\:center\\]{align-items:center}.\\[justify-content\\:center\\]{justify-content:center}.\\[font-family\\:inherit\\]{font-family:inherit}.\\[font-size\\:16px\\]{font-size:16px}.\\[font-size\\:18px\\]{font-size:18px}.\\[background\\:transparent\\]{background:transparent}.\\[border\\:0\\]{border:0}.disabled\\:\\[cursor\\:default\\]{&:disabled{cursor:default}}.disabled\\:\\[opacity\\:20\\%\\]{&:disabled{opacity:20%}}.\\[\\&\\~section\\:first-of-type\\]\\:\\[margin-top\\:16px\\]{&~section:first-of-type{margin-top:16px}}.\\[\\&\\~section\\:last-of-type\\]\\:\\[margin-bottom\\:16px\\]{&~section:last-of-type{margin-bottom:16px}}";
(function() {
	if (typeof document === "undefined") return;
	const style = document.createElement("style");
	const meta = document.querySelector("meta[name=\"csp-nonce\"]");
	if (meta && meta.content) style.setAttribute("nonce", meta.content);
	style.textContent = css_248z;
	document.head.appendChild(style);
})();
var isGeThan = (v1, v2) => {
	var _a, _b;
	const arr1 = v1.split(".").map(Number);
	const arr2 = v2.split(".").map(Number);
	const len = Math.max(arr1.length, arr2.length);
	for (let i = 0; i < len; i++) {
		const a = (_a = arr1[i]) !== null && _a !== void 0 ? _a : 0;
		const b = (_b = arr2[i]) !== null && _b !== void 0 ? _b : 0;
		if (a > b) return true;
		if (a < b) return false;
	}
	return true;
};
var ImgCrop = forwardRef((props, cropperRef) => {
	const { quality = .4, fillColor = "white", zoomSlider = true, rotationSlider = false, aspectSlider = false, showReset = false, resetText, aspect = 1, minZoom = 1, maxZoom = 3, minAspect = .5, maxAspect = 2, cropShape = "rect", showGrid = false, cropperProps, modalClassName, modalTitle, modalWidth, modalOk, modalCancel, onModalOk, onModalCancel, modalProps, beforeCrop, children } = props;
	const cb = useRef({});
	cb.current.onModalOk = onModalOk;
	cb.current.onModalCancel = onModalCancel;
	cb.current.beforeCrop = beforeCrop;
	/**
	* crop
	*/
	const easyCropRef = useRef(null);
	const getCropCanvas = useCallback((target) => {
		var _a;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const imgSource = (((_a = target === null || target === void 0 ? void 0 : target.getRootNode) === null || _a === void 0 ? void 0 : _a.call(target)) || document).querySelector(`.${PREFIX}-media`);
		const { width: cropWidth, height: cropHeight, x: cropX, y: cropY } = easyCropRef.current.cropPixelsRef.current;
		if (rotationSlider && easyCropRef.current.rotation !== ROTATION_INITIAL) {
			const { naturalWidth: imgWidth, naturalHeight: imgHeight } = imgSource;
			const angle = easyCropRef.current.rotation * (Math.PI / 180);
			const sine = Math.abs(Math.sin(angle));
			const cosine = Math.abs(Math.cos(angle));
			const squareWidth = imgWidth * cosine + imgHeight * sine;
			const squareHeight = imgHeight * cosine + imgWidth * sine;
			canvas.width = squareWidth;
			canvas.height = squareHeight;
			ctx.fillStyle = fillColor;
			ctx.fillRect(0, 0, squareWidth, squareHeight);
			const squareHalfWidth = squareWidth / 2;
			const squareHalfHeight = squareHeight / 2;
			ctx.translate(squareHalfWidth, squareHalfHeight);
			ctx.rotate(angle);
			ctx.translate(-squareHalfWidth, -squareHalfHeight);
			const imgX = (squareWidth - imgWidth) / 2;
			const imgY = (squareHeight - imgHeight) / 2;
			ctx.drawImage(imgSource, 0, 0, imgWidth, imgHeight, imgX, imgY, imgWidth, imgHeight);
			const imgData = ctx.getImageData(0, 0, squareWidth, squareHeight);
			canvas.width = cropWidth;
			canvas.height = cropHeight;
			ctx.putImageData(imgData, -cropX, -cropY);
		} else {
			canvas.width = cropWidth;
			canvas.height = cropHeight;
			ctx.fillStyle = fillColor;
			ctx.fillRect(0, 0, cropWidth, cropHeight);
			ctx.drawImage(imgSource, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
		}
		return canvas;
	}, [fillColor, rotationSlider]);
	/**
	* upload
	*/
	const [modalOpen, setModalOpen] = useState(false);
	const [modalImage, setModalImage] = useState("");
	const onCancel = useRef(void 0);
	const onOk = useRef(void 0);
	const runBeforeUpload = useCallback((_a) => __awaiter(void 0, [_a], void 0, function* ({ beforeUpload, file, resolve, reject }) {
		const rawFile = file;
		if (typeof beforeUpload !== "function") {
			resolve(rawFile);
			return;
		}
		try {
			const result = yield beforeUpload(file, [file]);
			if (result === false) resolve(false);
			else resolve(result !== true && result || rawFile);
		} catch (err) {
			reject(err);
		}
	}), []);
	const getNewBeforeUpload = useCallback((beforeUpload) => {
		return ((file, fileList) => {
			return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
				let processedFile = file;
				if (typeof cb.current.beforeCrop === "function") try {
					const result = yield cb.current.beforeCrop(file, fileList);
					if (result === false) return runBeforeUpload({
						beforeUpload,
						file,
						resolve,
						reject
					});
					if (result !== true) processedFile = result || file;
				} catch (err) {
					return runBeforeUpload({
						beforeUpload,
						file,
						resolve,
						reject
					});
				}
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					if (typeof reader.result === "string") {
						setModalOpen(true);
						setTimeout(() => {
							setModalImage(reader.result);
						}, 10);
					}
				});
				reader.readAsDataURL(processedFile);
				onCancel.current = () => {
					var _a, _b;
					setModalOpen(false);
					setModalImage("");
					easyCropRef.current.onReset();
					let hasResolveCalled = false;
					(_b = (_a = cb.current).onModalCancel) === null || _b === void 0 || _b.call(_a, (LIST_IGNORE) => {
						resolve(LIST_IGNORE);
						hasResolveCalled = true;
					});
					if (!hasResolveCalled) resolve(AntUpload.LIST_IGNORE);
				};
				onOk.current = (event) => __awaiter(void 0, void 0, void 0, function* () {
					setModalOpen(false);
					setModalImage("");
					easyCropRef.current.onReset();
					const canvas = getCropCanvas(event.target);
					const { type, name, uid } = processedFile;
					canvas.toBlob((blob) => __awaiter(void 0, void 0, void 0, function* () {
						const newFile = new File([blob], name, { type });
						Object.assign(newFile, { uid });
						runBeforeUpload({
							beforeUpload,
							file: newFile,
							resolve: (file) => {
								var _a, _b;
								resolve(file);
								(_b = (_a = cb.current).onModalOk) === null || _b === void 0 || _b.call(_a, file);
							},
							reject: (err) => {
								var _a, _b;
								reject(err);
								(_b = (_a = cb.current).onModalOk) === null || _b === void 0 || _b.call(_a, err);
							}
						});
					}), type, quality);
				});
			}));
		});
	}, [
		getCropCanvas,
		quality,
		runBeforeUpload
	]);
	const getNewUpload = useCallback((children) => {
		const upload = Array.isArray(children) ? children[0] : children;
		const _a = upload.props, { beforeUpload, accept } = _a, restUploadProps = __rest(_a, ["beforeUpload", "accept"]);
		return Object.assign(Object.assign({}, upload), { props: Object.assign(Object.assign({}, restUploadProps), {
			accept: accept || "image/*",
			beforeUpload: getNewBeforeUpload(beforeUpload)
		}) });
	}, [getNewBeforeUpload]);
	/**
	* modal
	*/
	const modalBaseProps = useMemo(() => {
		const obj = {};
		if (modalWidth !== void 0) obj.width = modalWidth;
		if (modalOk !== void 0) obj.okText = modalOk;
		if (modalCancel !== void 0) obj.cancelText = modalCancel;
		return obj;
	}, [
		modalCancel,
		modalOk,
		modalWidth
	]);
	const wrapClassName = `${PREFIX}-modal${modalClassName ? ` ${modalClassName}` : ""}`;
	const isCN = (typeof window === "undefined" ? "" : window.navigator.language) === "zh-CN";
	const title = modalTitle || (isCN ? "编辑图片" : "Edit image");
	const resetBtnText = resetText || (isCN ? "重置" : "Reset");
	return jsxs(Fragment, { children: [getNewUpload(children), jsx(AntModal, Object.assign({}, modalProps, modalBaseProps, {
		open: modalOpen,
		title,
		onCancel: onCancel.current,
		onOk: onOk.current,
		wrapClassName,
		destroyOnHidden: true
	}, isGeThan(version, "6.3.1") ? { mask: { closable: false } } : { maskClosable: true }, { children: jsx(EasyCrop$1, {
		ref: easyCropRef,
		cropperRef,
		zoomSlider,
		rotationSlider,
		aspectSlider,
		showReset,
		resetBtnText,
		modalImage,
		aspect,
		minZoom,
		maxZoom,
		minAspect,
		maxAspect,
		cropShape,
		showGrid,
		cropperProps
	}) }))] });
});
//#endregion
export { ImgCrop as default };
