

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    },
    paths: {
        'templates': "../../templates",
        'app': "../app"
    },
    baseUrl: 'js/libs'
});

//the "main" function to bootstrap your code
require(['jquery', 'underscore', 'backbone', 'text', 'app'], function ($, _, Backbone, TEXT) {   // or, you could use these deps in a separate module using define
    console.log(Backbone);
    console.log(TEXT);
    var app = new App();
    app.init();
});
