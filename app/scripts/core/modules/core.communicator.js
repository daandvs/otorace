CoreSandbox.modules.core_communicator = function(box) {
  var subscribers = {};

  function handleSubscribe(type, func) {
    type = type || '';

    if(typeof type !== 'string' || type.length === 0) {
      throw(/subscribe requires type string/);
    }

    if(typeof func !== 'function') {
      throw(/subscribe requires callback function/);
    }

    if(!subscribers[type]) {
      subscribers[type] = [];
    }

    subscribers[type].push(func);
  }

  function handleNotify(type, data) {
    data = data || {};

    if(typeof type !== 'string' || type.length === 0) {
      throw(/notify requires type/);
    }

    var notifiers = subscribers[type];
    for(var i = 0; i < notifiers.length; i++) {
      notifiers[i](data);
    }
  }

  box.subscribe = handleSubscribe;
  box.notify = handleNotify;
};
