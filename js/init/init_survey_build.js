//var STBurl = "http://localhost/wp-survey-toolbox/wp-content/plugins/wp-survey-toolbox/js"

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery", "jquery-ui", "text", "util"],
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
require(['backbone', 'app/survey_build'], function () {
    BuildSurvey.init();
});

