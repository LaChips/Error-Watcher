export const name = 'error-watcher';

import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { check, Match } from 'meteor/check'
import { Tracker } from 'meteor/tracker'

if (Meteor.isClient) {
  function sendError(error) {
    Meteor.call("logWatchError", error, function(err, res) {
      if (!err) {
        Bert.alert(res.msg, "danger");
      }
    });
  }

  function makeError(error, self) {
    if (self != null && Meteor.isDevelopment)
      console.log(error);
    let tmpl = (Template.instance() != null) ? Template.instance().view : self;
    let trace = error.stack.split('\n').map(function (line) { return line.trim(); });
    let where = (Template.instance() != null) ? trace[0].split('@')[0] : trace[0].split('/')[0] + " onRendered";
    let obj = {
      text: "" + error,
      date: parseInt(Date.now() / 1000),
      function: where,
      template: tmpl.name.split('.')[1],
      trace: trace.slice(0, trace.length - 1)
    }
    return obj;
  }

  Blaze._wrapCatchingExceptions = function (f, where) {
    if (typeof f !== 'function')
      return f;
    return function () {
      try {
        return f.apply(this, arguments);
      } catch (error) {
        sendError(makeError(error));
        Blaze._reportException(error, 'Exception in ' + where + ':');
      }
    };
  };

  Blaze.View.prototype.onViewReady = function (cb) {
    var self = this;
    var fire = function () {
      Tracker.afterFlush(function () {
        if (! self.isDestroyed) {
          Blaze._withCurrentView(self, function () {
            try {
              cb.call(self);
            } catch(error) {
              sendError(makeError(error, self));
            }
          });
        }
      });
    };
    self._onViewRendered(function onViewRendered() {
      if (self.isDestroyed)
        return;
      if (! self._domrange.attached) {
        try {
          self._domrange.onAttached(fire);
        } catch(error) {
            sendError(makeError(error, self));
        }
      }
      else {
        try {
          fire();
        } catch(error) {
            sendError(makeError(error, self));
        }
      }
    });
  };
}

if (Meteor.isServer) {

  export var ErrorWatcher = {
    msg: "",
    func: function(data) {
      console.log(data);
    }
  };

  Meteor.methods({
    logWatchError(data) {
      ErrorWatcher.func(data);
      return {msg: ErrorWatcher.msg};
    }
  })
}

