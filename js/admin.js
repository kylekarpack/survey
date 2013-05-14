    Quiz.Model = Backbone.Model.extend({
        defaults : {
            'correct' : false
        },
        url : ajaxurl+'?action=save_answer',
        toJSON : function() {
            var attrs = _.clone( this.attributes );
            attrs.post_id = wpq.post_id;
            return attrs;
        },
        initialize : function() {
            if ( this.get( 'answer_id' ) === wpq.answers.correct ) {
                this.set( 'correct', true );
            }
        }
    });