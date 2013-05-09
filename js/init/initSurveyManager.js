

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
        'templates': "../templates",
        'app': "../app"
    },
    baseUrl: STBroot+'js/libs'
});

//the "main" function to bootstrap your code
require(['jquery', 'underscore', 'backbone', 'text', 'app/survey'], function ($, _, Backbone, TEXT, appEngine) {   // or, you could use these deps in a separate module using define
    SurveyManager.init();
});

