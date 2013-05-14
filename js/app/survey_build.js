
var BuildSurvey = {
    init: function() {
        
//        $('#question-container').html('<img class="loading-img" src="'+STBroot+'images/loader.gif" />');
        
        var GET = fetchGETvars();
        
        var indexQ = function() {
            $('.q-index').each(function() {
                $(this).html((1+$(this).parents('.question').index()));
            });
            $.each(viewCollection, function(k,v) {
                v.updateIndex();
            });
        }
        var stburl = stburl || "wp-survey-toolbox-api.php";
        
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
                title: null,
                description: null,
                author: author
            },
            url: STBroot+stburl,
            initialize: function() {
                var this_ = this;
                if (GET.sid) {
                    this.fetch({success: function() {
                        $.each(this_.attributes, function(k,v) {
                            if (v.sid == GET.sid) {
                                this_.clear();
                                this_.set(v);
                                var sync = new QSync();
                                var v = new SurveyMetaView({model: this_});
                                return false;
                            }
                        });
                    }});
                } else {
                    var v = new SurveyMetaView({model: this});
                    questionsLoadedIn();
                }
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
                "keyup input#survey-title": "updateTitle",
                "focus input#survey-title": "effects",
                "blur input#survey-title": "effects",
                "click button#save-survey": "saveSurvey"
            },
            render: function() {
                var data = this.model.attributes;
                _.extend(data, util);
                var html = this.tmplt(data);
                this.$el.prepend(html);
            },
            effects: function(event) {
                if (event.type == "focusin") {
                    $(event.currentTarget).css({"border-color": "#CCC"});
                } else {
                    $(event.currentTarget).css({"border-color": "#FFF"});
                }
            },
            updateTitle: function(event) {
                this.model.set({title:$(event.currentTarget).val()});
            },
            saveSurvey: function() {
                var this_ = this;
                this.model.save(this.model.attributes, {success: function(m, r) {
                        questions.each(function(q) {
                            if (!q.attributes.sid) {
                                q.set({sid:r.sid});
                            }
                            q.save();
                        });
                }});
            }
        });
        
        var survey = new S();
        
        
        var QSync = Backbone.Model.extend({
            url: STBroot+stburl+"?sid="+GET.sid,
            initialize: function() {
                var this_ = this;
                this.fetch({success: function() {
                        $.each(this_.attributes, function(k,v) {
                            v.answers = unserialize(v.answers);
                            v.loadedIn = true;
                            questions.add([new Q(v)]);
                        });
                }});
            }
        });
        
        var Q = Backbone.Model.extend({
            defaults: {
                type: "blank",
                question: "",
                answers: []
            },
            url:STBroot+stburl,
            initialize: function() {
                var this_ = this;
                //this.attributes.answers = [];
                viewCollection.push(new QuestionView({model: this_, collID:viewCollection.length}));
            }
        });
        
        viewCollection = [];
        var QuestionView = Backbone.View.extend({
            el:$("#question-container"),
            initialize: function() {
                var this_ = this;
                require(['text!templates/q_build.html', 'text!templates/q_build_sub.html'], function(tmplt, pieces) {
                    this_.tmplt = _.template(tmplt);
                    var tmpltOb = {};
                    var temps = pieces.split("||");
                    tmpltOb.shortanswer = temps[0];
                    tmpltOb.checkbox = temps[1];
                    tmpltOb.radio = temps[2];
                    this_.tmplts = tmpltOb;
                    util.tmplts = tmpltOb;
                    this_.render();
                    this_.div = $('#'+this_.cid);
                    this_.model.set({index:this_.div.index()});
                    this_.div.find('.q-text').focus();
                    this_.update();
                    indexQ();
                    if (this_.model.attributes.loadedIn) {
                        this_.div.hide();
                        this_.save();
                    }
                    this_.div.find('.q-answer-box').sortable({stop: function(){this_.updateAnswers()},distance: 10});
                });
                this_.bindEvents();
            },
            bindEvents: function() {
                var id = "#"+this.cid;
                this.events = {};
                
                this.events["click "+id+" button.save-question"] = "save";
                this.events["click "+id+" button.cancel-question"] = "cancel";
                this.events["click "+id] = "edit";
                this.events["click "+id+" button.view-model"] = "logModelAttr";
                
                this.events["mouseenter "+id] = "showEditOptions";
                this.events["mouseleave "+id] = "showEditOptions";
                
                this.events["keyup "+id+" input.q-text"] = "textChange";
                this.events["change "+id+" select.q-type"] = "typeChange";
                
                this.events["click "+id+" button.q-add-field"] = "addField";
                this.events["click "+id+" button.q-remove-field"] = "removeField";
                
                this.events["keyup "+id+" input.answer-field"] = "updateAnswers";
            },
            render: function() {
                var data = this.model.attributes;
                data.divID = this.cid;
                _.extend(data, util);
                var html = this.tmplt(data);
                this.$el.append(html);
            },
            update: function() {
                //this.updateAnswers();
                var this_ = this;
                var answers = "";
                var ext = false;
                _.each(this.model.attributes.answers, function(answer) {
                    if (!ext) {
                        answers += _.template(util.tmplts[this_.model.attributes.type], {val:answer});
                        if (this_.model.attributes.type == "shortanswer") {
                            ext = true;
                        }
                    }
                });
                this.div.find('.q-answer-box').html(answers);
                this.div.find('.q-add-field').hide();
                this.div.find('.q-remove-field').show();
                this.div.find('.q-add-field:last').show();
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
                this.model.set({type: val});
                if (this.model.attributes.answers.length < 1) {
                    this.model.set({answers:[""]});
                }
                this.update();
            },
            updateAnswers: function(event) {
                if (event) {
                    if (event.keyCode == 13 || event.keyCode == 9) {
                        $(event.currentTarget).siblings('.q-add-field').click();
                    } else {
                        if ($(event.currentTarget).parents('.field-row').find('.answer-field').val()) {
                            this.div.find('.field-row').last().find('.q-remove-field').show('fast');
                        } else {
                            this.div.find('.field-row').last().find('.q-remove-field').hide();
                        }
                    }
                }
                
                this.div.find('.q-add-field').hide();
                this.div.find('.field-row').last().find('.q-add-field').show();
                
                var a = [];
                this.div.find('.answer-field').each(function() {
                    a.push(trim($(this).val()));
                });
                this.model.set({answers:a});
            },
            addField: function(event) {
                // only add if current input has val
                var val = trim($(event.currentTarget).parents('.field-row').find('.answer-field').val());
                console.log(val);
                if (val) {
                    var a = this.model.attributes.answers;
                    a.push("");
                    this.model.set({answers:a});
                    this.update();
                    this.div.find('.field-row:last')
                        .css({"margin-left":"40px", opacity:"0"})
                        .animate({"margin-left":"0px", opacity:"1"}, 200, function() {$(this).find('.answer-field:last').focus()})
                      .find('.answer-field:last')
                        .focus()
                      .parents('.field-row').find('.q-remove-field')
                        .hide();
                } else {
                    var parent = $(event.currentTarget).parents('.field-row');
                    parent.find('.answer-field').val("");
                    parent.find('.q-field-error').html("Please enter an answer").stop(true,true).show().delay(1000).fadeOut();
                }
            },
            removeField: function(event) {
                var index = $(event.currentTarget).parents('.field-row').index();
                if (index == 0 && this.div.find('.field-row').length == 1) {
                    $(event.currentTarget).parents('.field-row').find('.answer-field').val("");
                    this.model.set({answers:[""]});
                } else {
                    $(event.currentTarget).parents('.field-row').remove();
                    var a = [];
                    this.div.find('.answer-field').each(function() {
                        a.push($(this).val());
                    });
                    this.model.set({answers:a});
                    this.div.find('.field-row').last().find('.q-add-field').show();
                }
            },
            showEditOptions: function(event) {
                if (this.saved) {
                    if (event.type == "mouseenter") {
                        if (this.div.find('.q-render-box').is(":visible")) {
                            this.div.css({background:"#F9F9F9", "border-color":"rgb(137, 175, 223)"});
                            this.div.find('.q-edit-box').stop(true, true).show();
                        }
                    } else {
                        this.div.css({background:"#FFF", "border-color":"#FFF"});
                        this.div.find('.q-edit-box').stop(true).fadeOut("fast");
                    }
                }
            },
            updateIndex: function() {
                if (this.div) {
                    var index = this.div.index();
                    this.model.set({index:index});
                }
            },
            cancel: function(event) {
                var this_ = this;
                questions.remove(this.model);
                var index;
                $.each(viewCollection, function(k,v) {
                    if (v.cid == this_.cid) {
                        index = k;
                    }
                });
                viewCollection.splice(index, 1);
                $(event.currentTarget).parents('.question').remove();
                indexQ();
            },
            logModelAttr: function() {
                console.log(this.model.attributes);
            },
            edit: function() {
                var this_ = this;
                if (this.saved) {
                    $.each(viewCollection, function(k,v) {
                        if (v.cid != this_.cid) {
                            v.save();
                        }
                    });
                    
//                    autoCollapse(this_.div.find('.q-render-box'));
//                    autoExpand(this_.div.find('.q-build-box'));
//                    
                    var h = this_.div.height();
                    
                    this_.div.find('.q-render-box').hide();
                    this_.div.find('.q-build-box').show();
                    
                    transition(this_.div, h);
                    
                    this.div.attr({title:""});
                    this.div.css({background:"#ECECEC", "border-color":"#FFF"});
                    this.saved = false;
                }
            },
            save: function() {
                var this_ = this;
                if (this.model.attributes.answers) {
                    this.model.attributes.answers = arrayClean(this.model.attributes.answers, "");
                }
                if (!this.saved) {
                    if (this.model.attributes.type) {
                        require(['text!templates/q_'+this.model.attributes.type+'.html'], function(tmplt) {
                            var data = _.extend(this_.model.attributes, util);
                            var html = _.template(tmplt, data);
                            
                            var h = this_.div.height();
                            
                            this_.div.find('.q-render').html(html);
                            
                            this_.div.find('.q-render-box').show();
                            this_.div.find('.q-build-box').hide();
                            
                            transition(this_.div, h);
                            
                            if (this_.model.attributes.loadedIn) {
                                this_.div.show();
                                questionsLoadedIn();
                                this_.model.attributes.loadedIn = false;
                            }
                            this_.div.attr({title:"Click to edit\n&\nDrag to reorder"});
                            this_.div.css({background:"#FFF", "border-color":"#FFF"});
                            indexQ();
                            this_.saved = true;
                        });
                    }
                }
            }
        });
        
        function questionsLoadedIn() {
            if ($('#question-container').length) {
                if (!$('#question-container').hasClass('ui-sortable')) {
                    console.log($('#question-container'));
                    $('#question-container').sortable({stop: function(){indexQ()},distance: 20});
                }
            }
        }
    }
}