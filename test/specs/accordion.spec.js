document.body.innerHTML = __html__['_site/index.html'];
function appendCSS(fileObj){
    var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
}
window.turnOffAnimation = function(selector){
    var offTime = '10ms'; //can't be zero as we still need the 'end' events to fire.
    if (selector){
        $("<style type='text/css' class='turnOffAnimation'> body " + selector + "{ transition-duration:" + offTime + "!important;-webkit-transition-duration:" + offTime + "!important; -webkit-animation-duration: " + offTime + "!important;animation-duration:" + offTime + "!important;} </style>").appendTo("head");
    } else {
        $('.turnOffAnimation').remove();
    }
};
appendCSS({path: '_site/styles/demo.css'});
appendCSS({path: '_site/styles/accordion.css'});

var $ = require('../../bower_components/jquery/dist/jquery.js');

var accordion = skyComponents['accordion'];

var describeSpec = 'Accordion module should';

var fixtures = {
    accordion: document.getElementsByClassName('accordion')[0].outerHTML
};

$('.accordion').accordion();

describe(describeSpec, function () {

    var $first = $('.view-container').first();
    var $firstLink = $('.accordion-heading').first();
    var $firstContent = $('#first-accordion-content');
    var $last = $('.view-container').last();
    var $lastLink = $('.accordion-heading').last();
    var $lastContent = $('#fourth-accordion-content');

    function closeAllAccordians(){
        if (!$first.hasClass('toggle-hidden')){
            $firstLink.click();
            expect($first.hasClass('toggle-hidden')).toBe(true);
        }
        if (!$last.hasClass('toggle-hidden')){
            $lastLink.click();
            expect($last.hasClass('toggle-hidden')).toBe(true);
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
        expect($('.view-container.toggle-hidden').length).toBe(4);
        //            screenshot('accordion', 'default', $first.closest('.sub-section'));
    });

    it('open when clicked', function(done){
        expect($first.hasClass('toggle-hidden')).toBe(true);
        expect($first.parent().find('> a i').hasClass('accordion--rotate')).toBe(false);
        $firstLink.click();
        expect($first.hasClass('toggle-hidden')).toBe(false);
        expect($first.parent().find('> a i').hasClass('accordion--rotate')).toBe(true);
        expect($last.hasClass('toggle-hidden')).toBe(true);
        setTimeout(function() {
            //                screenshot('accordion', 'open', $first.closest('.sub-section'));
            done();
        }, 1000);
    });

    it('keep markup when open and then closed', function() {
        expect($firstLink.first().find('strong').length).toBe(1);
        $firstLink.click();
        expect($firstLink.first().find('strong').length).toBe(1);
        $firstLink.click();
        expect($firstLink.first().find('strong').length).toBe(1);
    });

    it('open and close when a user clicks an accordion item twice', function () {
        $firstLink.click();
        expect($first.hasClass('toggle-hidden')).toBe(false);
        $firstLink.click();
        expect($first.hasClass('toggle-hidden')).toBe(true);
        expect($first.parent().find('> a i').hasClass('accordion--rotate')).toBe(false);
    });

    it('be left open when clicking a different accordion item', function () {
        $firstLink.click();
        $lastLink.click();
        expect($first.hasClass('toggle-hidden')).toBe(false);
        expect($last.hasClass('toggle-hidden')).toBe(false);
        expect($last.parent().find('> a i').hasClass('accordion--rotate')).toBe(true);
        $lastLink.click();
        expect($first.hasClass('toggle-hidden')).toBe(false);
        expect($last.hasClass('toggle-hidden')).toBe(true);
        expect($last.parent().find('> a i').hasClass('accordion--rotate')).toBe(false);
    });

    it('allow images inside of the content area and display these without cropping', function(done){
        $lastLink.click();
        setTimeout(function(){
            expect($('#fourth-accordion-content').height()).toBe(20 + 340 + 16 + 2);
            done();
        }, 1000);
    })

    it('open to the height of its content', function (done) {
        var css =$("<style type='text/css'> #first-accordion-content .accordion-content{ height: 600px; margin:10px 0; padding:8px; border:1px} </style>");
        css.appendTo("head");
        $firstContent.removeData('openHeight');

        $firstLink.click();
        setTimeout(function(){
            expect($firstContent.height()).toBe(600 + 20 + 16 + 2);
            css.remove();
            $firstContent.removeData('openHeight');
            done();
        },250);
    });
    it('close to the height of zero', function (done) {
        var css =$("<style type='text/css'> #first-accordion-content .accordion-content{ height: 600px; margin:10px 0; padding:8px; border:1px} </style>");
        css.appendTo("head");
        $firstContent.removeData('openHeight');

        $firstLink.click();
        setTimeout(function(){
            $firstLink.click();
            setTimeout(function(){
                expect($firstContent.height()).toBe(0);
                css.remove();
                $firstContent.removeData('openHeight');
                done();
            },250);
        },25);
    });
});
