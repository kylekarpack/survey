
var SurveyPage = {
    init: function() {                                                          console.log("App Initiated!");
        
        var stburl = stburl || "wp-survey-toolbox-api.php";
        var questions = new Array();
        var Survey = Backbone.Model.extend({
            url : stburl+"?sid=1",
            initialize : function() {
                this.fetch({success: function() {
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
            defaults: {
                create: "q"
            },
            //sync: this.sync,
            initialize: function() {
                var this_ = this;
                var question_view = new QuestionView({ el: $("#question-container"), model: this_ });
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
                data.answers = unserialize(data.answers);
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












/*!
 * php-unserialize-js JavaScript Library
 * https://github.com/bd808/php-unserialize-js
 *
 * Copyright 2013 Bryan Davis and contributors
 * Released under the MIT license
 * http://www.opensource.org/licenses/MIT
 */

/**
 * Parse php serialized data into js objects.
 *
 * @param {String} phpstr Php serialized string to parse
 * @return {mixed} Parsed result
 */
function unserialize (phpstr) {
  var idx = 0
    , rstack = []
    , ridx = 0

    , readLength = function () {
        var del = phpstr.indexOf(':', idx)
          , val = phpstr.substring(idx, del);
        idx = del + 2;
        return parseInt(val);
      } //end readLength

    , parseAsInt = function () {
        var del = phpstr.indexOf(';', idx)
          , val = phpstr.substring(idx, del);
        idx = del + 1;
        return parseInt(val);
      } //end parseAsInt

    , parseAsFloat = function () {
        var del = phpstr.indexOf(';', idx)
          , val = phpstr.substring(idx, del);
        idx = del + 1;
        return parseFloat(val);
      } //end parseAsFloat

    , parseAsBoolean = function () {
        var del = phpstr.indexOf(';', idx)
          , val = phpstr.substring(idx, del);
        idx = del + 1;
        return ("1" === val)? true: false;
      } //end parseAsBoolean

    , parseAsString = function () {
        var len = readLength()
          , utfLen = 0
          , bytes = 0
          , ch
          , val;
        while (bytes < len) {
          ch = phpstr.charCodeAt(idx + utfLen++);
          if (ch <= 0x007F) {
            bytes++;
          } else if (ch > 0x07FF) {
            bytes += 3;
          } else {
            bytes += 2;
          }
        }
        val = phpstr.substring(idx, idx + utfLen);
        idx += utfLen + 2;
        return val;
      } //end parseAsString

    , parseAsArray = function () {
        var len = readLength()
          , resultArray = []
          , resultHash = {}
          , keep = resultArray
          , lref = ridx++
          , key
          , val;

        rstack[lref] = keep;
        for (var i = 0; i < len; i++) {
          key = parseNext();
          val = parseNext();
          if (keep === resultArray && parseInt(key) == i) {
            // store in array version
            resultArray.push(val);
          } else {
            if (keep !== resultHash) {
              // found first non-sequential numeric key
              // convert existing data to hash
              for (var j = 0, alen = resultArray.length; j < alen; j++) {
                resultHash[j] = resultArray[j];
              }
              keep = resultHash;
              rstack[lref] = keep;
            }
            resultHash[key] = val;
          } //end if
        } //end for

        idx++;
        return keep;
      } //end parseAsArray

    , parseAsObject = function () {
        var len = readLength()
          , obj = {}
          , lref = ridx++
          , clazzname = phpstr.substring(idx, idx + len)
          , re_strip = new RegExp("^\u0000(\\*|" + clazzname + ")\u0000")
          , key
          , val;

        rstack[lref] = obj;
        idx += len + 2;
        len = readLength();
        for (var i = 0; i < len; i++) {
          key = parseNext();
          // private members start with "\u0000CLASSNAME\u0000"
          // protected members start with "\u0000*\u0000"
          // we will strip these prefixes
          key = key.replace(re_strip, '');
          val = parseNext();
          obj[key] = val;
        }
        idx++;
        return obj;
      } //end parseAsObject

    , parseAsRef = function () {
        var ref = parseAsInt();
        // php's ref counter is 1-based; our stack is 0-based.
        return rstack[ref - 1];
      } //end parseAsRef

    , readType = function () {
        var type = phpstr.charAt(idx);
        idx += 2;
        return type;
      } //end readType

    , parseNext = function () {
        var type = readType();
        switch (type) {
          case 'i': return parseAsInt();
          case 'd': return parseAsFloat();
          case 'b': return parseAsBoolean();
          case 's': return parseAsString();
          case 'a': return parseAsArray();
          case 'O': return parseAsObject();
          case 'r': return parseAsRef();
          case 'R': return parseAsRef();
          case 'N': return null;
          default:
            throw {
              name: "Parse Error",
              message: "Unknown type '" + type + "' at postion " + (idx - 2)
            }
        } //end switch
    }; //end parseNext

    return parseNext();
} //end phpUnserialize