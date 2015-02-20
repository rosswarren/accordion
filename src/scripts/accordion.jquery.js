var Accordion = require('./accordion');
var $ = require('../../bower_components/jquery/dist/jquery.js');

$.fn.accordion = function() {
    return this.each(function() {
        var accordion = new Accordion(this);
    });
};
