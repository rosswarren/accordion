var local = {}; local['accordion'] = require('./accordion');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-accordion/dist/scripts/accordion.requirejs', [], function() {
        'use strict';
        return local['accordion'];
    });
}