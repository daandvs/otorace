function CoreSandbox() {
  // turning arguments into an array
  var args = Array.prototype.slice.call(arguments),
  // the last argument is the callback
  callback = args.pop(),
  // modules can be passed as an array or as individual parameters
  modules = (args[0] && typeof args[0] === 'string') ? args : args[0],
  i;
  // make sure the function is called
  // as a constructor
  if (!(this instanceof CoreSandbox)) {
    return new CoreSandbox(modules, callback);
  }
  // add properties to `this` as needed:

  // now add modules to the core `this` object
  // no modules or "*" both mean "use all modules"
  if (!modules || modules == '*') {
    modules = [];
    for (i in CoreSandbox.modules) {
      if (CoreSandbox.modules.hasOwnProperty(i)) {
        modules.push(i);
      }
    }
  }
  // initialize the required modules
  for (i = 0; i < modules.length; i += 1) {
    CoreSandbox.modules[modules[i]](this);
  }
  // call the callback
  callback(this);
}
// any prototype properties as needed
CoreSandbox.prototype = {
  name: '',
  version: '',
  getName:function () {
    return this.name;
  }
};

CoreSandbox.modules = {};
