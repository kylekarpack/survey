var SurveyManager = {
    init: function() {
        var stburl = stburl || "wp-survey-toolbox-api.php";
        
        var SurveyCollection = Backbone.Collection.extend({
            model: Survey
        });
        var surveyCollection = new SurveyCollection();
        
        var SurveyGroup = Backbone.Model.extend({
            url : STBroot+stburl,
            initialize : function() {
                var this_ = this;
                this.fetch({success: function() {
                    $.each(this_.attributes, function(k,v) {
                        surveyCollection.add(new Survey(v));
                    });
                }, error: function(a, b, c) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                }});
            }
        });
        
        var surveyGroup = new SurveyGroup();
        
        var Survey = Backbone.Model.extend({
            initialize: function() {
                this.set({
                    edit: "?page=wp-survey-toolbox/wp-survey-toolbox-builder.php&sid="+this.attributes.sid,
                    take: STBroot+"survey.php?sid="+this.attributes.sid
                });
                var v = new SurveyView({model: this});
            }
        });
        
        var SurveyView = Backbone.View.extend({
            el: $('.survey-table'),
            initialize: function() {
                var this_ = this;
                require(['text!templates/s_manage.html'], function(tmplt) {
                    this_.tmplt = _.template(tmplt);
                    this_.render();
                });
            },
            render: function() {
                var data = this.model.attributes;
                var html = this.tmplt(data);
                this.$el.append(html);
            }
        });
    }
}