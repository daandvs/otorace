(function(global) {
  function handleInit() {
    CoreSandbox([
      'core_communicator'
    ], function(core) {
      global.Core = core;
    });
  }

  global.App = {
    initialize: handleInit
  };
})(this);
