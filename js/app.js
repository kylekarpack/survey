
var App = {
    init: function() {                                                          console.log("App Initiated!");
        var stburl = stburl || "wp-survey-toolbox-api.php";
        
        var Q = Backbone.Model.extend({
            defaults : {
                type: "",
                val: ""
            },
            url : stburl,
            //sync: this.sync,
            initialize : function() {
                this.set('type', "true/false");
                this.set('val', {name:"The sky is blue:", creator:"Wiley"});
            }
        });
        
        var Qview = Backbone.View.extend({
            tagName: "a",
            className: "question",
            events: {
                "click .icon": "open"
            },
            initialize: function() {
                this.listenTo(this.model, "change", this.render)
            },
            render: function() {
                
            }
        });
        
        var question = new Q();
        
        question.save(question.attributes, {
            success: function(m, r, o) {
                console.log("success");
                console.log({m: m});
                console.log({r: r});
                console.log({o: o});
            }, error: function(m, x, o) {
                console.log("error");
                console.log({m: m});
                console.log({x: x});
                console.log({o: o});
            }
        });
    }
}