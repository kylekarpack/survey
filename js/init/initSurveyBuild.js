//var STBurl = "http://localhost/wp-survey-toolbox/wp-content/plugins/wp-survey-toolbox/js"

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
require(['jquery', 'jquery-ui', 'underscore', 'backbone', 'text', 'app/survey_build'], function ($, ui, _, Backbone, TEXT, appEngine) {   // or, you could use these deps in a separate module using define
    BuildSurvey.init();
});

