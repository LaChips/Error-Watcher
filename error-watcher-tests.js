// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by error-watcher.js.
import { name as packageName } from "meteor/lachips:error-watcher";

// Write your tests here!
// Here is an example.
Tinytest.add('error-watcher - example', function (test) {
  test.equal(packageName, "error-watcher");
});
