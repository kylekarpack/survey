
var Profile = Backbone.Model.extend();

var ProfileList = Backbone.Collection.extend({
    model: Profile
});

var Photo = Backbone.Model.extend({
    validate: function(attrs) {
        if (attrs.src === undefined) {
            return "Rember to set a source for your image!";
        }
    },
    initialize: function() {
        console.log('this model has been initialized'); 
        this.on("invalid", function(model, error) {
            console.log(error);
        });
        this.on("change:title", function() {
            console.log("My title has been changed to.. "+this.get("title"));
        });
    }
});

var myPhoto = new Photo();
myPhoto.save({title:'Fishing at the sea'});

var PhotoSearch = Backbone.View.extend({
    el: $('#results'),
    render: function(event) {
        var compiled_template = _.template($('#results-template').html());
        this.$el.html(compiled_template(this.model.toJSON()));
        return this;
    },
    events: {
        "submit #searchForm": "search",
        "click .reset": "reset",
        "click .advanced": "switchContext"
    },
    search: function(event) {
        console.log("search");
    },
    reset: function(event) {
        console.log("reset");
    },
    switchContext: function(event) {
        console.log("switchContext");
    }
});

var PhotoCollection = new Backbone.Collection();
PhotoCollection.on("add", function(photo) {
    console.log('I liked '+photo.get("title")+' its this one right? '+photo.get("src"));
});

PhotoCollection.add([
    {title:"My Trip to Bali", src:"bali-trip.jpg"},
    {title:"The Flight Home", src:"long-flights-oofa.jpg"},
    {title:"Uploading Pics", src:"too-many-pics.jpg"}
]);

