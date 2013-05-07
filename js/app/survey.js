
var SurveyPage = {
    init: function() {                                                          console.log("App Initiated!");
        
        var stburl = stburl || "wp-survey-toolbox-api.php";
        var questions = new Array();
        var Survey = Backbone.Model.extend({
            url : stburl+"?sid=1",
            initialize : function() {
                this.fetch({success: function() {
                    $.each(survey.attributes, function(k,v) {
                        questions.push(new Q({query: v}));
                    });
                }, error: function(a, b, c) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                }});
            }
        });
        
        var survey = new Survey();
        
        var Q = Backbone.Model.extend({
            defaults: {
                create: "q"
            },
            //sync: this.sync,
            initialize: function() {
                var this_ = this;
                this.url = stburl+"?qid="+this.attributes.query,
                this.fetch({success: function(m, x, r) {
                    var question_view = new QuestionView({ el: $("#question-container"), model: this_ });
                }, error: function(a, b, c) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                }});
            }
        });
        
        var util = {
            toUpper: function(str) {
                return str.charAt(0).toUpperCase()+str.substr(1);
            }
        }
        
        var QuestionView = Backbone.View.extend({
            initialize: function() {
                var this_ = this;
                require(['text!templates/q_'+this.model.attributes.type+'.html'], function(tmplt) {
                    this_.tmplt = _.template(tmplt);
                    this_.render();
                });
            },
            render: function() {     
                var data  = this.model.attributes;
                data.answers = data.answers.split("||");
                _.extend(data, util);
                var html = this.tmplt(data)
                this.$el.append( html );
            }//,
//            events: {
//                "click input[type=button]": "doSearch"
//            },
//            doSearch: function( event ){
//                // Button clicked, you can access the element that was clicked with event.currentTarget
//                alert( "Search for " + $("#search_input").val() );
//            }
        });
        
//        var Questions = new Backbone.Collection.extend({
//            model: Q
//        });
//        
//        var survey = new Questions([question]);
        
//        question.save();
//        question.destroy({error: function(){
//                console.log("error");
//        }});
        
    }
}