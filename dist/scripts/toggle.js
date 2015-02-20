(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var state = { css: {} };
var html = document.documentElement;
var toolkitClasses = ["no-touch", "touch-device"];
var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
var classes = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };

function attachClasses() {
    var arrClasses = html.className.split(' ');
    arrClasses.push(touch() ? classes.has : classes.hasNot);
    html.className = arrClasses.join(' ');
}

function translate3d() {
    var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        },
        body = document.body || document.documentElement,
        has3d,
        div = document.createElement('div'),
        t;
    body.insertBefore(div, null);
    for (t in transforms) {
        if (transforms.hasOwnProperty(t)) {
            if (div.style[t] !== undefined) {
                div.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(div).getPropertyValue(transforms[t]);
            }
        }
    }
    body.removeChild(div);
    state.css.translate3d = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    return state.css.translate3d;
}

function supportsCSS(property) {
    if (state.css[property]) {
        return state.css[property];
    }
    if (property === 'translate3d') {
        return translate3d(property);
    }
    var style = html.style;
    if (typeof style[property] == 'string') {
        state.css[property] = true;
        return true;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    for (var i = 0; i < vendorPrefix.length; i++) {
        if (typeof style[vendorPrefix[i] + property] == 'string') {
            state.css[property] = true;
            return state.css[property];
        }
    }
    state.css[property] = false;
    return state.css[property];
}

function css(el, property) {
    if (!property) {
        return supportsCSS(el);
    }
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
    } else if (el.currentStyle) {
        property = property.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = el.currentStyle[property];
    }
    return strValue;
}

function touch() {
    state.touch = (typeof window.ontouchstart !== "undefined");
    return state.touch;
}

function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

attachClasses();

module.exports = {
    _attachClasses: attachClasses,
    _state: state,
    css: css,
    touch: touch,
    elementVisibleBottom: elementVisibleBottom,
    elementVisibleRight: elementVisibleRight
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.detect = module.exports;
},{}],2:[function(require,module,exports){
var utils = require('../utils/event-helpers');
var timeout = { resize: null };

function bindEvents() {
    on(window, 'resize', initResizeEnd);
}

function initResizeEnd() {
    clearTimeout(timeout.resize);
    timeout.resize = setTimeout(function triggerResizeEnd() {
        trigger(window, 'resizeend');
    }, 200);
}


function ready(exec) {
    if (/in/.test(document.readyState)) {
        setTimeout(function () {
            ready(exec);
        }, 9);
    } else {
        exec();
    }
}

function trigger(el, eventName) {
    utils.dispatchEvent(el, eventName);
}

function live(events, selector, eventHandler){
    events.split(' ').forEach(function(eventName){
        utils.attachEvent(eventName, selector, eventHandler);
    });
}

function off(el, eventNames, eventHandler) {
    eventNames.split(' ').forEach(function(eventName) {
        if (el.isNodeList) {
            Array.prototype.forEach.call(el, function (element, i) {
                utils.removeEventListener(element, eventName, eventHandler);
            });
        } else {
            utils.removeEventListener(el, eventName, eventHandler);
        }
    });
}

function on(el, eventNames, eventHandler, useCapture) {
    eventNames.split(' ').forEach(function(eventName) {
        if (el.isNodeList){
            Array.prototype.forEach.call(el, function(element, i){
                utils.addEventListener(element, eventName, eventHandler, useCapture);
            });
        } else {
            utils.addEventListener(el, eventName, eventHandler, useCapture);
        }
    });
}

bindEvents();

module.exports = {
    live: live,
    on: on,
    off: off,
    emit: trigger, //deprecate me
    trigger: trigger,
    ready: ready
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.event = module.exports;

},{"../utils/event-helpers":4}],3:[function(require,module,exports){
var version  = require('./utils/version');
var event  = require('./api/event');
var detect  = require('./api/detect');

module.exports = {
    version: version,
    event: event,
    detect: detect
}

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['version'] = version;
skyComponents['event'] = event;
skyComponents['detect'] = detect;
},{"./api/detect":1,"./api/event":2,"./utils/version":5}],4:[function(require,module,exports){
var eventRegistry = {};
var state = {    };
var browserSpecificEvents = {
    'transitionend': 'transition',
    'animationend': 'animation'
};
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = true;

function capitalise(str) {
    return str.replace(/\b[a-z]/g, function () {
        return arguments[0].toUpperCase();
    });
}

function check(eventName) {
    var type = '';
    if (browserSpecificEvents[eventName]){
        eventName =  browserSpecificEvents[eventName];
        type = 'end';
    }
    var result = false,
        eventType = eventName.toLowerCase() + type.toLowerCase(),
        eventTypeCaps = capitalise(eventName.toLowerCase()) + capitalise(type.toLowerCase());
    if (state[eventType]) {
        return state[eventType];
    }
    ['ms', 'moz', 'webkit', 'o', ''].forEach(function(prefix){
        if (('on' + prefix + eventType in window) ||
            ('on' + prefix + eventType in document.documentElement)) {
            result = (!!prefix) ? prefix + eventTypeCaps : eventType;
        }
    });
    state[eventType] = result;
    return result;
}

function dispatchEvent(el, eventName){
    eventName = check(eventName) || eventName;
    var event;
    if (document.createEvent) {
        event = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        event.initCustomEvent(eventName, false, false, null);
        el.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        el.fireEvent('on' + eventName, event);
    }
}

function addEventListener(el, eventName, eventHandler, useCapture){
    eventName = check(eventName) || eventName;
    if (el.addEventListener) {
        el.addEventListener(eventName, eventHandler, !!useCapture);
    } else {
        el.attachEvent('on' + eventName, eventHandler);
    }
}

function removeEventListener(el, eventName, eventHandler){
    eventName = check(eventName) || eventName;
    if (el.removeEventListener) {
        el.removeEventListener(eventName, eventHandler, false);
    } else {
        el.detachEvent('on' + eventName, eventHandler);
    }
}

function dispatchLiveEvent(event) {
    var targetElement = event.target;

    eventRegistry[event.type].forEach(function (entry) {
        var potentialElements = document.querySelectorAll(entry.selector);
        var hasMatch = false;
        Array.prototype.forEach.call(potentialElements, function(el){
            if (el.contains(targetElement) || el === targetElement){
                hasMatch = true;
                return;
            }
        });

        if (hasMatch) {
            entry.handler.call(targetElement, event);
        }
    });

}

function attachEvent(eventName, selector, eventHandler){
    if (!eventRegistry[eventName]) {
        eventRegistry[eventName] = [];
        addEventListener(document.documentElement, eventName, dispatchLiveEvent, true);
    }

    eventRegistry[eventName].push({
        selector: selector,
        handler: eventHandler
    });
}


module.exports = {
    dispatchEvent: dispatchEvent,
    attachEvent: attachEvent,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
};
},{}],5:[function(require,module,exports){
module.exports = "0.0.1";
},{}],6:[function(require,module,exports){
require('./polyfills/Array')();
require('./polyfills/events')();
require('./polyfills/Function')();
require('./polyfills/hasOwnProperty')();
require('./polyfills/Object')();
require('./polyfills/String')();
require('./polyfills/whichIE')();

module.exports = {}

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.polyfill = module.exports;

},{"./polyfills/Array":7,"./polyfills/Function":8,"./polyfills/Object":9,"./polyfills/String":10,"./polyfills/events":11,"./polyfills/hasOwnProperty":12,"./polyfills/whichIE":13}],7:[function(require,module,exports){

module.exports = function(){

    // ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun /*, thisp */) {
            if (this === void 0 || this === null) { throw TypeError(); }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") { throw TypeError(); }

            var thisp = arguments[1], i;
            for (i = 0; i < len; i++) {
                if (i in t) {
                    fun.call(thisp, t[i], i, t);
                }
            }
        };
    }


    if (!Array.prototype.indexOf){
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0){
                from += len;
            }
            for (; from < len; from++) {
                if (from in this && this[from] === elt) return from;
            }
            return -1;
        };
    }
};
},{}],8:[function(require,module,exports){

module.exports = function(){

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            FNOP.prototype = this.prototype;
            fBound.prototype = new FNOP();
            return fBound;
        };
    }
};
},{}],9:[function(require,module,exports){
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
module.exports = function() {
    if (!Object.keys) {
        Object.keys = (function() {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
            ],
            dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }
}

},{}],10:[function(require,module,exports){

module.exports = function() {

    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

}
},{}],11:[function(require,module,exports){
module.exports = function(){

    // from Jonathan Neal's Gist https://gist.github.com/jonathantneal/3748027
    !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
            var target = this;

            if (type === 'DOMContentLoaded') {
                type = 'readystatechange';
            }

            registry.unshift([target, type, listener, function (event) {
                event.currentTarget = target;
                event.preventDefault = function () { event.returnValue = false };
                event.stopPropagation = function () { event.cancelBubble = true };
                event.target = event.srcElement || target;

                listener.call(target, event);
            }]);

            this.attachEvent("on" + type, registry[0][3]);
        };

        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
            for (var index = 0, register; register = registry[index]; ++index) {
                if (register[0] == this && register[1] == type && register[2] == listener) {
                    return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
                }
            }
        };

        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
            return this.fireEvent("on" + eventObject.type, eventObject);
        };
    })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);


};
},{}],12:[function(require,module,exports){

module.exports = function() {
    window.hasOwnProperty = window.hasOwnProperty || Object.prototype.hasOwnProperty;
}
},{}],13:[function(require,module,exports){

module.exports = function() {

    var nav = navigator.appName,
        version = navigator.appVersion,
        ie = (nav == 'Microsoft Internet Explorer');
    if (ie) {
        var match = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
        version = match ? parseFloat(match[1]) : 0;
    }
    var ieObj = {
        name: nav,
        version: version,
        ie: ie,
        ie12: false,
        ie11: false,
        ie10: false,
        ie9: false,
        ie8: false,
        ie7: false,
        ie6: false
    };
    ieObj['ie' + parseInt(version,10)] = ie;
    window.whichIE = ieObj;

};
},{}],14:[function(require,module,exports){
/*
returns toggle(); function
this should be passed:
$elClicked: the element clicked that caused the toggle.
If this is used, this element could have data-toggle which is the selector of what needs to be toggled.
If this is used, this element could have data-toggle-state which is either 'hidden' or 'shown'.
$container: The element to be toggled. Use this if $elClicked and 'data-' attributes have not been used.
action:      The state to toggle to - 'show' or 'hide'. Use this if $elClicked and 'data-' attributes have not been used.


*/

var core = require('../../bower_components/bskyb-core/src/scripts/core');
require('../../bower_components/bskyb-polyfill/src/scripts/polyfill.js');
var detect = core.detect;
var event = core.event;

var hasResized = false,
hasContentChanged = false,
elementsToToggle = {},
hiddenClass = 'toggle-hidden',
supportTransition = detect.css('transition');

var elementIdentifierCount = 0;

function animate(el, to) {
    if (supportTransition) {
        //$el.css({'height':to, overflow:'hidden', 'transition': 'height 0.5s ease-in-out'});

        el.style.transition = 'height 0.5s ease-in-out';
        el.style.height = to + "px";
        el.style.overflow = 'hidden';
    }
    //$el.toggleClass(hiddenClass, (to === 0));

    if (to === 0) {
        el.classList.add('toggle-hidden');
    } else {
        el.classList.remove('toggle-hidden');
    }


    return el;
}

function getOpenHeight(el) {
    if (el.dataset.openHeight !== undefined && !hasResized && !hasContentChanged) {
        return el.dataset.openHeight;
    }

    var divElement = document.createElement('div');
    divElement.id = 'toggle-tmp-height';

    var clonedEl = el.cloneNode(true);
    clonedEl.removeAttribute('style');
    clonedEl.classList.remove(hiddenClass);
    clonedEl.classList.remove('transition');

    clonedEl.appendChild(createClearfixElement());
    clonedEl.insertBefore(createClearfixElement(), clonedEl.firstChild);

    divElement.appendChild(clonedEl);

    el.parentNode.appendChild(divElement);

    var openHeight  = document.querySelector('#toggle-tmp-height > div').offsetHeight - 2;


    if (el.querySelector('img') !== undefined) {
        var originalHeightWithImages = el.querySelector('.accordion-content').offsetHeight - 2;

        if(openHeight < originalHeightWithImages){
            openHeight = originalHeightWithImages;
        }
    }

    el.dataset.openHeight = openHeight;

    remove(document.querySelector('#toggle-tmp-height'));
    remove(document.querySelector('.toggle-clearfix-div'));

    return openHeight;
}

function remove(element) {
    if (element === undefined || element === null) return;

    element.parentNode.removeChild(element);
}

function containsSafeHtmlTags(text){
    // var allTags = /<\w+>.+?<\/\w+>|<.+\/?>/;
    //
    //
    //
    // if((text.match(allTags) || []).length === text.indexOf('strong','b','i','em').length) {
    //     return true;
    // } else {
    //     return false;
    // }

    return true;
}

function updateText(elClicked) {
    if (elClicked.dataset.toggleText === undefined) {
        return;
    }

    var spans = elClicked.querySelector('span');

    var textElement = spans.length > 0 ? spans[0] : elClicked;

    var oldText = containsSafeHtmlTags(textElement) ? textElement.innerHTML : textElement.innerText;

    textElement.html(oldText);

    if(containsSafeHtmlTags(textElement)){
        textElement.innerHTML = elClicked.dataset.toggleText;
    } else {
        textElement.innerText = elClicked.dataset.toggleText;
    }

    elClicked.dataset.toggleText = oldText;
    elClicked.dataset.trackingLabel = oldText;
}

function show(elToToggle) {
    var openHeight = getOpenHeight(elToToggle);
    animate(elToToggle, openHeight);
}

function hide(elToToggle) {
//    setOpenHeight(elToToggle);
    animate(elToToggle, 0);
}

function updateToggledElements(state, elementToToggle, identifier) {
    if (state == 'shown') {
        elementsToToggle[identifier] = {state:state, elementToToggle:elementToToggle};
    } else {
        delete elementsToToggle[identifier];
    }
}

function toggle(options) {
    var elClicked = options.elClicked,
    elementToToggle = options.container || document.querySelector(elClicked.dataset.toggle),
    action = options.action,
    state = elClicked && elClicked.dataset.toggleState;
    hasContentChanged = (options.contentChanged !== undefined) ? options.contentChanged : false;
    if (state === 'shown' || action == 'hide') {
        hide(elementToToggle);
        state = 'hidden';
    } else {
        show(elementToToggle);
        state = 'shown';
    }


    var identifier = elementToToggle.dataset.identifier;

    if (identifier === undefined) {
        identifier = "elementIdentifier_" + elementIdentifierCount;
    }

    updateToggledElements(state, elementToToggle, identifier);
    if (!elClicked) {
        elClicked = document.querySelector('[data-toggle="#' + elementToToggle.id + '"]');
    }
    if (elClicked && state !== elClicked.dataset.toggleState) {
        updateText(elClicked, state);
        elClicked.dataset.toggleState = state;
    }
}

function createClearfixElement() {
    var divElement = document.createElement('div');
    divElement.classList.add('toggle-clearfix-div');
    divElement.classList.add('clearfix');
    divElement.classList.add('clear');

    divElement.style.padding = '1px';

    return divElement;
}

event.on(window,'resizeend', function () {
    hasResized = true;
    var item, i;
    for (i in elementsToToggle) {
        item = elementsToToggle[i];
        if (item.state === 'shown') {
            var openHeight = getOpenHeight(item.elementToToggle);
            animate(item.elementToToggle, openHeight);
        }
    }
    hasResized = false;
});

module.exports = toggle;

},{"../../bower_components/bskyb-core/src/scripts/core":3,"../../bower_components/bskyb-polyfill/src/scripts/polyfill.js":6}]},{},[14]);
