
var App = function() {                                                          console.log("App Created!");
    
}

App.prototype.init = function() {                                               console.log("App Initiated!");
    
    var stburl = stburl || "test.php";
    
    var Q = Backbone.Model.extend({
        defaults : {
            type: "",
            val: ""
        },
        url : stburl,
        initialize : function() {
            this.set('type', "true/false");
            this.set('val', "The sky is blue:");
        }
    });
    
    var question = new Q();
    question.save();
}