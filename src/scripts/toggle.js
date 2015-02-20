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
