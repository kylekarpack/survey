
var BuildSurvey = {
    init: function() {                                                          console.log("App Initiated!");
        
        
        // Utility functions
        
        var util = {
            toUpper: function(str) {
                return str.charAt(0).toUpperCase()+str.substr(1);
            }
        }
        var indexQ = function() {
            $('.q-index').each(function() {
                $(this).html((1+$(this).parents('.question').index()));
            });
            $.each(viewCollection, function(k,v) {
                v.updateIndex();
            });
        }
        var stburl = stburl || "wp-survey-toolbox-api.php";
        
        
        
        $('#question-container').sortable({
            stop: function(){indexQ()}
        });
        $('#add-question').animate({opacity:1}, 200).on("click", function() {
            if (questions.length > 0) {
                $.each(viewCollection, function(k,v) {
                    v.save();
                });
            }
            questions.add([new Q()]);
        });
        
        var QuestionsCollection = Backbone.Collection.extend({
            model: Q
        });
        questions = new QuestionsCollection();
        

        var S = Backbone.Model.extend({
            defaults: {
                create: "s",
                sid: null,
                title: null,
                description: null
            },
            url: "",
            initialize: function() {
                var v = new SurveyMetaView({model: this});
            }
        });
        
        var SurveyMetaView = Backbone.View.extend({
            el:$('#container'),
            initialize: function() {
                var this_ = this;
                require(['text!templates/s_main.html'], function(tmplt) {
                    this_.tmplt = _.template(tmplt);
                    this_.render();
                });
            },
            events: {
                "change input#survey-title": "updateTitle",
                "click button#save-survey": "saveSurvey"
            },
            render: function() {
                var data = this.model.attributes;
                _.extend(data, util);
                var html = this.tmplt(data);
                this.$el.prepend(html);
            },
            updateTitle: function(event) {
                this.model.set({title:$(event.currentTarget).val()});
                console.log(this.model.attributes.title);
            },
            saveSurvey: function() {
                var this_ = this;
                this.model.save({success: function(m, r) {
                        this_.attributes.sid = r;
                        questions.each(function(q) {
                            q.attributes.sid = r;
                            q.save();
                        })
                }});
            }
        });
        
        var survey = new S();
        
        var viewCollection = [];
        
        var Q = Backbone.Model.extend({
            defaults: {
                create: "q",
                sid: null,
                index: null,
                type: "blank",
                question: null,
                answers: new Array()
            },
            url:STBroot+stburl,
            initialize: function() {
                var this_ = this;
                this.attributes.answers = [];
                viewCollection.push(new QuestionView({model: this_, collID:viewCollection.length}));
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
                    this_.model.set({index:this_.div.index()});
                    this_.checkboxTmplt = this_.div.find('.action-checkbox').html();
                    this_.radioTmplt = this_.div.find('.action-radio').html();
                    
                    indexQ();
                });
                var id = "#"+this.cid;
                this.events = {};
                
                this.events["click "+id+" button.save-question"] = "save";
                this.events["click "+id+" button.cancel-question"] = "cancel";
                this.events["click "+id] = "edit";
                this.events["click "+id+" button.view-model"] = "logModelAttr";
                
                this.events["mouseenter "+id] = "showEditOptions";
                this.events["mouseleave "+id] = "showEditOptions";
                
                this.events["change "+id+" input.q-text"] = "textChange";
                this.events["change "+id+" select.q-type"] = "typeChange";
                
                this.events["click "+id+" button.q-action-add-checkbox"] = "addCheckbox";
                this.events["change "+id+" input.action-checkbox-text"] = "saveCheckbox";
                this.events["click "+id+" button.q-action-add-radio"] = "addRadio";
                this.events["change "+id+" input.action-radio-text"] = "saveRadio";
                
                this.events["keydown "+id+" input.answer-field"] = "addTextField";
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
                $(event.currentTarget).parents('.question').find('.q-action').hide();
                if (val != "blank") {
                    $(event.currentTarget).parents('.question').find('.q-action-box').show();
                    $(event.currentTarget).parents('.question').find('.action-'+val).show();
                } else {
                    $(event.currentTarget).parents('.question').find('.q-action-box').hide();
                }
                this.model.set({type: val});
            },
            addTextField: function(event) {
                if (event.keyCode == 13 || event.keyCode == 9) {
                    $(event.currentTarget).siblings('.q-add-field').click();
                }
            },
            addRadio: function(event) {
                var val = $(event.currentTarget).parents('.action-radio-tmplt').find('.action-radio-text').val();
                if (val) {
                    this.div.find('.q-action-add-radio').hide();
                    this.div.find('.action-radio').append(this.radioTmplt);
                    this.div.find('.action-radio-tmplt:last')
                        .css({"margin-left":"40px", opacity:"0"})
                        .animate({"margin-left":"0px", opacity:"1"}, 200, function() {$(this).find('.answer-field:last').focus()})
                      .find('.answer-field:last')
                        .focus();
                } else {
                    console.log("error");
                }
            },
            saveRadio: function(event) {
                var val = $(event.currentTarget).parents('.action-radio-tmplt').find('.action-radio-text').val();
                if (val) {                    
                    var answers = this.model.get("answers");
                    answers.push(val);
                    this.model.set({answers: answers});
                }
            },
            addCheckbox: function(event) {
                var val = $(event.currentTarget).parents('.action-checkbox-tmplt').find('.action-checkbox-text').val();
                if (val) {
                    this.div.find('.q-action-add-checkbox').hide();
                    this.div.find('.action-checkbox').append(this.checkboxTmplt);
                    this.div.find('.action-checkbox-tmplt:last')
                        .css({"margin-left":"40px", opacity:"0"})
                        .animate({"margin-left":"0px", opacity:"1"}, 200, function() {$(this).find('.answer-field:last').focus()})
                      .find('.answer-field:last')
                        .focus();
                } else {
                    console.log("error");
                }
            },
            saveCheckbox: function(event) {
                var this_ = this;
                var val = $(event.currentTarget).parents('.action-checkbox-tmplt').find('.action-checkbox-text').val();
                if (val) {
                    (function() {
                        var answers = this_.model.get("answers");
                        answers.push(val);
                        this_.model.set({answers: answers});
                    }());
                }
            },
            showEditOptions: function(event) {
                if (event.type == "mouseenter") {
                    if (this.div.find('.q-render-box').is(":visible")) {
                        this.div.css({background:"#F9F9F9", "border-color":"rgb(137, 175, 223)"});
                        this.div.find('.q-edit-box').stop(true, true).show();
                    }
                } else {
                    this.div.css({background:"#FFF", "border-color":"#CCC"});
                    this.div.find('.q-edit-box').stop(true).fadeOut("fast");
                }
            },
            updateIndex: function() {
                if (this.div) {
                    var index = this.div.index();
                    this.model.set({index:index});
                }
            },
            cancel: function(event) {
                $(event.currentTarget).parents('.question').remove();
                viewCollection.splice(this.collID, 1);
                //questions.remove(this.collID, 1);
                indexQ();
            },
            logModelAttr: function() {
                console.log(this.model.attributes);
            },
            edit: function() {
                var this_ = this;
                if (this.saved) {
                    $.each(viewCollection, function(k,v) {
                        v.save();
                    });
                    this.div.find('.q-render-box').hide();
                    this.div.find('.q-build-box').show();
                    this.div.attr({title:""});
                    this.div.css({background:"#FFF", "border-color":"#CCC"});
                    this.saved = false;
                }
            },
            save: function() {
                var this_ = this;
                if (!this.saved) {
                    if (this.model.attributes.type) {
                        this.div.find('.q-build-box').hide();
                        require(['text!templates/q_'+this.model.attributes.type+'.html'], function(tmplt) {
                            var data = _.extend(this_.model.attributes, util);
                            var html = _.template(tmplt, data);
                            this_.div.find('.q-render').html(html);
                            this_.div.find('.q-render-box').show();
                            this_.div.attr({title:"Click to edit & drag to reorder"});
                            indexQ();
                            this_.saved = true;
                        });
                    }
                }
                //this.model.save();
            }
        });
    }
}