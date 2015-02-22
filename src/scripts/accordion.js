var version  = require('./utils/version.js');
var toggle = require('./toggle');
var core = require('../../bower_components/bskyb-core/src/scripts/core');
var event = core.event;

function Accordion(element) {
    this.version = version;
    this.container = element;
    this.headings = document.querySelectorAll('.accordion-heading');
    this.bindEvents();
}

function rotateIcon(elClicked) {
    elClicked.querySelectorAll('i')[0].classList.toggle('accordion-rotate');
}

Accordion.prototype = {
    bindEvents:function() {
        for (var i = 0; i < this.headings.length; i++) {
            event.on(this.headings[i], 'click', this.toggleContent.bind(this));
        }
    },
    toggleContent:function(e) {
        e.preventDefault();
        var heading = e.currentTarget;
        toggle({elClicked: heading});
        rotateIcon(heading);
    }
};

module.exports = Accordion;

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['accordion'] = module.exports;
