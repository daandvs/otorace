CoreSandbox.modules.core_base = function(box) {
  var modules = [];

  function handleModule(id, func) {
    id = id || '';
    func = func || {};

    if(typeof id !== 'string' || id.length === 0) {
      throw('no valid id');
    }

    if(typeof func !== 'function') {
      throw('no register function specified');
    }

    if(moduleExist(id)) {
      throw('module ' + id + ' already exist');
    }

    modules.push({
      id: id,
      func: func,
      instance: undefined
    });
  }

  function moduleExist(id) {
    var module;
    for(var i = 0; i < modules.length; i++) {
      module = modules[i];

      if(module.id === id) {
        return true;
      }
    }

    return false;
  }

  function handleStart() {
    var module;
    for(var i = 0; i < modules.length; i++) {
      module = modules[i];

      if(!module.instance) {
        module.instance = module.func() || {};

        if(typeof module.instance.initialize !== 'function') {
          throw(/no initialize found on module function/);
        }

        module.instance.initialize();
      }
    }
  }

  function handleStop() {
    var module;
    for(var i = 0; i < modules.length; i++) {
      module = modules[i];

      if(module.instance) {
        if(typeof module.instance.destroy !== 'function') {
          throw(/no destroy found on module function/);
        }

        module.instance.destroy();
        module.instance = undefined;
      }
    }
  }

  box.module = handleModule;
  box.start = handleStart;
  box.stop = handleStop;
};
