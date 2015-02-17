var version  = require('./utils/version.js');
var $ = require('../../bower_components/jquery/dist/jquery.js');
var toggle = require('./toggle');

// By default JS dependency is handled using browserify
// please see 'GULP-TASKS.md#js' for more info
//
// You may need another component:
// run : $ bower install bskyb-core --save
// then add
// var core = require('../../bower_components/bskyb-core/src/scripts/core');
// var event = core.event;

//example function and export
/*global jQuery:false */


function Accordion($element){
    this.$container = $element;
    this.$headings = $element.find('.accordion-heading');
    this.bindEvents();
}

function rotateIcon($elClicked) {
    $elClicked.find('i').toggleClass('accordion--rotate');
}

Accordion.prototype = {
    bindEvents:function(){
        this.$headings.on("click",this.toggleContent.bind(this));
    },
    toggleContent:function(e){
        e.preventDefault();
        var $heading = $(e.currentTarget);
        toggle({$elClicked:$heading});
        rotateIcon($heading);
    }
};

$.fn.accordion = function() {
    return this.each(function() {
        var accordion = new Accordion($(this));
    });
};


module.exports = {
    version: version
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['accordion'] = module.exports;
