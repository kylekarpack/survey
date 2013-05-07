
var BuildSurvey = {
    init: function() {                                                          console.log("App Initiated!");
        
        window.questions = new Array();
        
        $('#add-question').on("click", function() {
            questions.push(new Q());
        });
        
        var stburl = stburl || "wp-survey-toolbox-api.php";
        
        var util = {
            toUpper: function(str) {
                return str.charAt(0).toUpperCase()+str.substr(1);
            }
        }
                
        var Q = Backbone.Model.extend({
            defaults: {
                create: "q",
                type: null,
                question: null,
                answers: []
            },
            initialize: function() {
                var this_ = this;
                var qView = new QuestionView({model: this_});
            }
        });
        
        var QuestionView = Backbone.View.extend({
            el:$("#question-container"),
            initialize: function() {
                var this_ = this;
                require(['text!templates/q_build.html'], function(tmplt) {
                    this_.tmplt = _.template(tmplt);
                    this_.render();
                    this_.div = $('#'+this_.cid);
                    this_.checkboxTmplt = this_.div.find('.action-checkbox').html();
                    this_.radioTmplt = this_.div.find('.action-radio').html();
                });
                var id = "#"+this.cid;
                this.events = {};
                
                this.events["click "+id+" button.cancel-question"] = "cancel";
                this.events["click "+id+" button.view-model"] = "logModelAttr";
                
                this.events["change "+id+" input.q-text"] = "textChange";
                this.events["change "+id+" select.q-type"] = "typeChange";
                
                this.events["click "+id+" button.q-action-add-checkbox"] = "addCheckbox";
                this.events["click "+id+" button.q-action-add-radio"] = "addRadio";
            },
            render: function() {
                var data = this.model.attributes;
                data.divID = this.cid;
                _.extend(data, util);
                var html = this.tmplt(data);
                this.$el.append(html);
            },
            textChange: function(event) {
                var val = this.div.find('.q-text').val();
                if (!val) {
                    val = null;
                }
                this.model.set({question: val});
            },
            typeChange: function(event) {
                var val = this.div.find('.q-type').val();
                $(event.currentTarget).parent('.question').find('.q-action').hide();
                if (val != "null") {
                    $(event.currentTarget).parent('.question').find('.q-action-box').show();
                    $(event.currentTarget).parent('.question').find('.action-'+val).show();
                } else {
                    $(event.currentTarget).parent('.question').find('.q-action-box').hide();
                }
                this.model.set({type: val});
            },
            addRadio: function(event) {
                var val = $(event.currentTarget).parent('.action-radio-tmplt').find('.action-radio-text').val();
                if (val) {
                    this.div.find('.action-radio').append(this.radioTmplt);
                    
                    var answers = this.model.get("answers");
                    answers.push(val);
                    this.model.set({answers: answers});
                } else {
                    console.log("error");
                }
            },
            addCheckbox: function(event) {
                var val = $(event.currentTarget).parent('.action-checkbox-tmplt').find('.action-checkbox-text').val();
                if (val) {
                    this.div.find('.action-checkbox').append(this.checkboxTmplt);
                    
                    var answers = this.model.get("answers");
                    answers.push(val);
                    this.model.set({answers: answers});
                } else {
                    console.log("error");
                }
            },
            cancel: function(event) {
                $(event.currentTarget).parent('.question').remove();
            },
            logModelAttr: function() {
                console.log(this.model.attributes);
            }
        });
    }
}