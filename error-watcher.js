export const name = 'error-watcher';

import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { check, Match } from 'meteor/check'
import { Tracker } from 'meteor/tracker'

if (Meteor.isClient) {
  function sendError(error) {
    Meteor.call("logWatchError", error, function(err, res) {
      if (!err && res.msg.length > 0 && res.) {
        Bert.alert(res.msg, "danger", res.position, res.icon);
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

  Blaze.View.prototype.autorun = function (f, _inViewScope, displayName) {
    var self = this;

    // The restrictions on when View#autorun can be called are in order
    // to avoid bad patterns, like creating a Blaze.View and immediately
    // calling autorun on it.  A freshly created View is not ready to
    // have logic run on it; it doesn't have a parentView, for example.
    // It's when the View is materialized or expanded that the onViewCreated
    // handlers are fired and the View starts up.
    //
    // Letting the render() method call `this.autorun()` is problematic
    // because of re-render.  The best we can do is to stop the old
    // autorun and start a new one for each render, but that's a pattern
    // we try to avoid internally because it leads to helpers being
    // called extra times, in the case where the autorun causes the
    // view to re-render (and thus the autorun to be torn down and a
    // new one established).
    //
    // We could lift these restrictions in various ways.  One interesting
    // idea is to allow you to call `view.autorun` after instantiating
    // `view`, and automatically wrap it in `view.onViewCreated`, deferring
    // the autorun so that it starts at an appropriate time.  However,
    // then we can't return the Computation object to the caller, because
    // it doesn't exist yet.
    if (! self.isCreated) {
      throw new Error("View#autorun must be called from the created callback at the earliest");
    }
    if (this._isInRender) {
      throw new Error("Can't call View#autorun from inside render(); try calling it from the created or rendered callback");
    }

    var templateInstanceFunc = Blaze.Template._currentTemplateInstanceFunc;

    var func = function viewAutorun(c) {
      return Blaze._withCurrentView(_inViewScope || self, function () {
        return Blaze.Template._withTemplateInstanceFunc(
          templateInstanceFunc, function () {
            try {
              return f.call(self, c);
            } catch(error) {
              sendError(makeError(error, self));
            }
          });
      });
    };

    // Give the autorun function a better name for debugging and profiling.
    // The `displayName` property is not part of the spec but browsers like Chrome
    // and Firefox prefer it in debuggers over the name function was declared by.
    func.displayName =
      (self.name || 'anonymous') + ':' + (displayName || 'anonymous');
    var comp = Tracker.autorun(func);

    var stopComputation = function () { comp.stop(); };
    self.onViewDestroyed(stopComputation);
    comp.onStop(function () {
      self.removeViewDestroyedListener(stopComputation);
    });

    return comp;
  };
}

if (Meteor.isServer) {

  export var ErrorWatcher = {
    msg: "",
    showClientAlert: true,
    position: "fixed-top",
    icon: "fas fa-exclamation-triangle",
    func: function(data) {
      console.log(data);
    }
  };

  Meteor.methods({
    logWatchError(data) {
      ErrorWatcher.func(data);
      if (ErrorWatcher.showClientAlert == false)
        return {msg: "", position: ErrorWatcher.position, icon: ErrorWatcher.icon};
      return {msg: ErrorWatcher.msg, position: ErrorWatcher.position, icon: ErrorWatcher.icon};
    }
  })
}

