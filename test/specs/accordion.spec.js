document.body.innerHTML = __html__['_site/index.html'].replace('images/nic-cage-twilight.jpg', '/base/_site/images/nic-cage-twilight.jpg');
function appendCSS(fileObj){
    var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
}
window.turnOffAnimation = function(selector){
    var offTime = '0'; //can't be zero as we still need the 'end' events to fire.
    if (selector) {
        var css = ".view-container { transition: height 0.1s ease-in-out !important; -webkit-transition: height 0.1s ease-in-out !important; }";

        var styleElement = document.createElement('style');
        styleElement.classList.add('turnOffAnimation');
        styleElement.appendChild(document.createTextNode(css));
        document.head.appendChild(styleElement);
    } else {
        var element = document.querySelector('.turnOffAnimation');

        if (element !== null) {
            element.parentNode.removeChild(element);
        }
    }
};
appendCSS({path: '_site/styles/demo.css'});
appendCSS({path: '_site/styles/accordion.css'});

var Accordion = skyComponents['accordion'];

var describeSpec = 'Accordion module should';

function triggerClickEvent(element) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    element.dispatchEvent(event);
}

new Accordion(document.querySelector('.accordion'));

describe(describeSpec, function () {
    var viewContainers = document.querySelectorAll('.view-container');
    var accordionHeadings = document.querySelectorAll('.accordion-heading');

    var first = viewContainers[0];
    var firstLink = accordionHeadings[0];
    var firstContent = document.querySelector('#first-accordion-content');

    var last = viewContainers[viewContainers.length - 1];
    var lastLink = accordionHeadings[accordionHeadings.length - 1];
    var lastContent = document.querySelector('#fourth-accordion-content');

    function closeAllAccordians() {
        if (!first.classList.contains('toggle-hidden')) {
            triggerClickEvent(firstLink);
            expect(first.classList.contains('toggle-hidden')).toBe(true);
        }
        if (!last.classList.contains('toggle-hidden')) {
            triggerClickEvent(lastLink);
            expect(last.classList.contains('toggle-hidden')).toBe(true);
        }
    }

    beforeEach(function(){
        turnOffAnimation('.view-container');
    });

    afterEach(function(){
        turnOffAnimation(false);
        closeAllAccordians();
    });

    it('be closed by default', function () {
        expect(document.querySelectorAll('.view-container.toggle-hidden').length).toBe(4);
    });

    it('open when clicked', function(done){
        expect(first.classList.contains('toggle-hidden')).toBe(true);
        expect(first.parentNode.querySelector('a i').classList.contains('accordion-rotate')).toBe(false);
        triggerClickEvent(firstLink);
        expect(first.classList.contains('toggle-hidden')).toBe(false);
        expect(first.parentNode.querySelector('a i').classList.contains('accordion-rotate')).toBe(true);
        expect(last.classList.contains('toggle-hidden')).toBe(true);
        setTimeout(function() {
            done();
        }, 1000);
    });

    it('keep markup when open and then closed', function() {
        expect(firstLink.querySelectorAll('strong').length).toBe(1);
        triggerClickEvent(firstLink);
        expect(firstLink.querySelectorAll('strong').length).toBe(1);
        triggerClickEvent(firstLink);
        expect(firstLink.querySelectorAll('strong').length).toBe(1);
    });

    it('open and close when a user clicks an accordion item twice', function () {
        triggerClickEvent(firstLink);
        expect(first.classList.contains('toggle-hidden')).toBe(false);
        triggerClickEvent(firstLink);
        expect(first.classList.contains('toggle-hidden')).toBe(true);
        expect(first.parentNode.querySelector('a i').classList.contains('accordion-rotate')).toBe(false);
    });

    it('be left open when clicking a different accordion item', function () {
        triggerClickEvent(firstLink);
        triggerClickEvent(lastLink);
        expect(first.classList.contains('toggle-hidden')).toBe(false);
        expect(last.classList.contains('toggle-hidden')).toBe(false);
        expect(last.parentNode.querySelector('a i').classList.contains('accordion-rotate')).toBe(true);
        triggerClickEvent(lastLink);
        expect(first.classList.contains('toggle-hidden')).toBe(false);
        expect(last.classList.contains('toggle-hidden')).toBe(true);
        expect(last.parentNode.querySelector('a i').classList.contains('accordion-rotate')).toBe(false);
    });

    it('allow images inside of the content area and display these without cropping', function(done){
        triggerClickEvent(lastLink);
        setTimeout(function(){
            expect(window.getComputedStyle(document.querySelector('#fourth-accordion-content'),null).getPropertyValue("height")).toBe('379px');
            done();
        }, 1000);
    })

    it('open to the height of its content', function (done) {
        var css ="#first-accordion-content .accordion-content{ height: 600px; margin:10px 0; padding:8px; border:1px}";

        var styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(css));

        document.head.appendChild(styleElement);

        triggerClickEvent(firstLink);
        setTimeout(function(){
            expect(window.getComputedStyle(firstContent,null).getPropertyValue("height")).toBe('639px');
            styleElement.parentNode.removeChild(styleElement);
            done();
        },250);
    });
    it('close to the height of zero', function (done) {
        triggerClickEvent(firstLink);
        setTimeout(function(){
            triggerClickEvent(firstLink);
            setTimeout(function(){
                expect(window.getComputedStyle(firstContent,null).getPropertyValue("height")).toBe('0px');
                done();
            },250);
        },25);
    });
});
