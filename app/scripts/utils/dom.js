(function(global) {
  function addEventHandler(eventType, node, handler) {
    node = node || {};

    if(typeof eventType !== 'string') {
      throw 'event type must be string';
    }

    if(typeof node.addEventListener !== 'function') {
      throw 'object has no method addEventListener';
    }

    if(typeof handler !== 'function') {
      throw 'handler must be function';
    }

    node.addEventListener(eventType, handler);
  }

  var publicAPI = {
    addEvent: addEventHandler
  };

  this.dom = publicAPI;
})(this);
