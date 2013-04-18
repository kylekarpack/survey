
requirejs.config({
    paths: {
//        'backbone':     'libs/backbone.min.js',
//        'underscore':   'libs/underscore.min.js',
//        'text':         'libs/text.min.js',
//        'jquery':       'libs/jquery.min.js'
    },
    baseUrl: 'js/libs'
});

requirejs(['underscore', 'jquery', 'backbone', 'text'], function(_, $, Backbone, TEXT) {
    console.log(_);
    console.log($(window));
    console.log(Backbone);
    console.log(TEXT);
});

//define(['underscore', 'backbone'], function(_, Backbone) {
//    console.log(Backbone);
//});
//
