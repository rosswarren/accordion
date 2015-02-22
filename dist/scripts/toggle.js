(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./polyfills/Array":2,"./polyfills/Function":3,"./polyfills/Object":4,"./polyfills/String":5,"./polyfills/events":6,"./polyfills/hasOwnProperty":7,"./polyfills/whichIE":8}],2:[function(require,module,exports){

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
},{}],3:[function(require,module,exports){

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
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){

module.exports = function() {
    window.hasOwnProperty = window.hasOwnProperty || Object.prototype.hasOwnProperty;
}
},{}],8:[function(require,module,exports){

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
},{}],9:[function(require,module,exports){
/*
returns toggle(); function
this should be passed:
$elClicked: the element clicked that caused the toggle.
If this is used, this element could have datatoggle which is the selector of what needs to be toggled.
If this is used, this element could have datatogglestate which is either 'hidden' or 'shown'.
$container: The element to be toggled. Use this if $elClicked and 'data' attributes have not been used.
action:      The state to toggle to  'show' or 'hide'. Use this if $elClicked and 'data' attributes have not been used.

*/
require('../../bower_components/bskyb-polyfill/src/scripts/polyfill.js');


function toggle(options) {
    var elClicked = options.elClicked,
    elementToToggle = options.container || document.querySelector(elClicked.dataset.toggle),
    action = options.action,
    state = elClicked && elClicked.dataset.toggleState;
    if (state === 'shown' || action == 'hide') {
        hide(elementToToggle);
        state = 'hidden';
    } else {
        show(elementToToggle);
        state = 'shown';
    }

    if (!elClicked) {
        elClicked = document.querySelector('[datatoggle="#' + elementToToggle.id + '"]');
    }
    if (elClicked && state !== elClicked.dataset.toggleState) {
        updateText(elClicked, state);
        elClicked.dataset.toggleState = state;
    }
}


function remove(element) {
    if (element === undefined || element === null) return;

    element.parentNode.removeChild(element);
}

function containsSafeHtmlTags(text){
    var allTags = /<\w+>.+?<\/\w+>|<.+\/?>/;

    return (text.match(allTags) || []).length === text.indexOf('strong','b','i','em').length
}

function updateText(elClicked) {
    if (elClicked.dataset.toggleText === undefined) {
        return;
    }

    var spans = elClicked.querySelectorAll('span');

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
    elToToggle.style.height = getOpenHeight(elToToggle) + 'px';
    elToToggle.classList.remove('toggle-hidden');
}

function hide(elToToggle) {
    elToToggle.classList.add('toggle-hidden');
}

function getOpenHeight(el) {
    var openHeight = getHeightUsingTemporaryElement(el);

    if (el.querySelector('img') !== undefined) {
        var originalHeightWithImages = el.querySelector('.accordion-content').offsetHeight - 2;

        if (openHeight < originalHeightWithImages) {
            return originalHeightWithImages;
        }
    }

    return openHeight;
}

function getHeightUsingTemporaryElement(el) {
    var divElement = document.createElement('div');
    divElement.id = 'toggle-tmp-height';

    var clonedEl = el.cloneNode(true);
    clonedEl.removeAttribute('style');
    clonedEl.style.visibility = 'hidden';
    clonedEl.classList.remove('toggle-hidden');

    clonedEl.appendChild(createClearfixElement());
    clonedEl.insertBefore(createClearfixElement(), clonedEl.firstChild);

    divElement.appendChild(clonedEl);

    el.parentNode.appendChild(divElement);

    var openHeight = document.querySelector('#toggle-tmp-height > div').offsetHeight - 2;

    remove(document.querySelector('#toggle-tmp-height'));
    remove(document.querySelector('.toggle-clearfix-div'));

    return openHeight;
}


function createClearfixElement() {
    var divElement = document.createElement('div');
    divElement.classList.add('toggle-clearfix-div');
    divElement.classList.add('clearfix');
    divElement.classList.add('clear');

    divElement.style.padding = '1px';

    return divElement;
}

module.exports = toggle;

},{"../../bower_components/bskyb-polyfill/src/scripts/polyfill.js":1}]},{},[9]);
