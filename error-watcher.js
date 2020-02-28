// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See error-watcher-tests.js for an example of importing.
export const name = 'error-watcher';

import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { check, Match } from 'meteor/check'

const isDefined = x => typeof x !== 'undefined' && x !== null;

(function(onCreated){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/exceptions.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var debugFunc;

// We call into user code in many places, and it's nice to catch exceptions
// propagated from user code immediately so that the whole system doesn't just
// break.  Catching exceptions is easy; reporting them is hard.  This helper
// reports exceptions.
//
// Usage:
//
// ```
// try {
//   // ... someStuff ...
// } catch (e) {
//   reportUIException(e);
// }
// ```
//
// An optional second argument overrides the default message.

// Set this to `true` to cause `reportException` to throw
// the next exception rather than reporting it.  This is
// useful in unit tests that test error messages.
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

  // In Chrome, `e.stack` is a multiline string that starts with the message
  // and contains a stack trace.  Furthermore, `console.log` makes it clickable.
  // `console.log` supplies the space between the two arguments.
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
      Meteor.call("logNewCrash", obj, function(err, res) {
        if (!err) {
          Bert.alert("Une erreur est survenue et à été communiquée à un administrateur. Elle sera traitée dans les plus brefs délais.", "danger");
        }
      });
      Blaze._reportException(error, 'Exception in ' + where + ':');
    }
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);