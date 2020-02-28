// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See error-watcher-tests.js for an example of importing.
export const name = 'error-watcher';

import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { check, Match } from 'meteor/check'

var configuration = {
  method : "logWatchError",
};

(function(onCreated){
  var debugFunc;
  Blaze._throwNextException = false;

  Blaze._reportException = function (e, msg) {
    if (Blaze._throwNextException) {
      Blaze._throwNextException = false;
      throw e;
    }
    if (! debugFunc)
      // adapted from Tracker
      debugFunc = function () {
        return (typeof Meteor !== "undefined" ? Meteor._debug :
                ((typeof console !== "undefined") && console.log ? console.log :
                 function () {}));
      };
    debugFunc()(msg || 'Exception caught in template:', e.stack || e.message || e);
  };

  Blaze._wrapCatchingExceptions = function (f, where) {
    if (typeof f !== 'function')
      return f;
    return function () {
      try {
        return f.apply(this, arguments);
      } catch (error) {
        let trace = error.stack.split('\n').map(function (line) { return line.trim(); })
        let obj = {
          text: "" + error,
          date: parseInt(Date.now() / 1000),
          function: trace[0].split('@')[0],
          template: Template.instance().view.name.split('.')[0],
          trace: trace.slice(0, trace.length -1)
        }
        console.log(configuration);
        Meteor.call(configuration.method, obj, function(err, res) {
          if (!err) {
            Bert.alert(res.msg, "danger");
          }
        });
        Blaze._reportException(error, 'Exception in ' + where + ':');
      }
    };
  };
}).call(this);