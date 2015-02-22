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
