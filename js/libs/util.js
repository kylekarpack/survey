

var util = {
            toUpper: function(str) {
                return str.charAt(0).toUpperCase()+str.substr(1);
            }
        }
        
function fetchGETvars() {
    var vars = {};
    var GET = window.location.search.substr(1).split("&");
    $.each(GET, function(k,v) {
        var x = v.split("=");
        vars[x[0]] = x[1];
    });
    return vars;
}

function arrayClean(arr, deleteValue) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == deleteValue) {         
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}

var transition = function(div, prevH) {
    div.find('.q-meta-box').css({opacity:0, "margin-right":"-10px"});
    div.find('.q-meta-box').stop(true).animate({opacity:1, "margin-right":"0px"}, 350);
    var nextH = div.height();
    div.height(prevH);
    div.stop(true).animate({height:nextH+"px"}, 180, function() {
        div.height("auto");
    });
}

function trim(str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
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