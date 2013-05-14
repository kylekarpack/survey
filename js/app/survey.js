
var SurveyPage = {
    init: function() {                                                          console.log("App Initiated!");
        
        var GET = fetchGETvars();
        
        var stburl = stburl || "wp-survey-toolbox-api.php";
        
        $('.s-submit').click(function() {
            $('#container').html("Thank you for your feedback!");
        });
        
        var SMeta = Backbone.Model.extend({
            defaults: {
                title: null,
                description: null
            },
            url: stburl,
            initialize: function() {
                var this_ = this;
                this.fetch({success: function() {
                    $.each(this_.attributes, function(k,v) {
                        if (v.sid == GET.sid) {
                            this_.clear();
                            this_.set(v);
                            var v = new SurveyMetaView({model: this_});
                            return false;
                        }
                    });
                }});
            }
        });
        var surveyMetaData = new SMeta();
        
        var SurveyMetaView = Backbone.View.extend({
            el:$('#container'),
            initialize: function() {
                var this_ = this;
                require(['text!templates/s_title.html'], function(tmplt) {
                    this_.tmplt = _.template(tmplt);
                    this_.render();
                });
            },
            render: function() {
                var data = this.model.attributes;
                _.extend(data, util);
                var html = this.tmplt(data);
                this.$el.prepend(html);
            }
        });
        
        
        var questions = new Array();
        var Survey = Backbone.Model.extend({
            url : stburl+"?sid="+GET.sid,
            initialize : function() {
                this.fetch({success: function() {
                    $('#question-container').html("");
                    $.each(survey.attributes, function(k,v) {
                        questions.push(new Q(v));
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
            initialize: function() {
                var this_ = this;
                var question_view = new QuestionView({model: this_ });
            }
        });
        
        var util = {
            toUpper: function(str) {
                return str.charAt(0).toUpperCase()+str.substr(1);
            }
        }
        
        var QuestionView = Backbone.View.extend({
            el: $("#question-container"),
            initialize: function() {
                var this_ = this;
                require(['text!templates/q_'+this.model.attributes.type+'.html'], function(tmplt) {
                    this_.tmplt = _.template(tmplt);
                    this_.render();
                });
            },
            render: function() {     
                var data  = this.model.attributes;
                data.answers = unserialize(data.answers);
                _.extend(data, util);
                var html = this.tmplt(data)
                this.$el.append( html );
                $('.s-question').css({"margin-top":"50px"});
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