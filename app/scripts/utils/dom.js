// (function(modules) {
//   function addEventHandler(eventType, node, handler) {
//     node = node || {};
//
//     if(typeof eventType !== 'string') {
//       throw 'event type must be string';
//     }
//
//     if(typeof node.addEventListener !== 'function') {
//       throw 'object has no method addEventListener';
//     }
//
//     if(typeof handler !== 'function') {
//       throw 'handler must be function';
//     }
//
//     node.addEventListener(eventType, handler);
//   }
//
//   // var publicAPI = {
//   //   addEvent: addEventHandler
//   // };
//
//   modules.dom = function(box) {
//     box.addEvent = addEventHandler
//   };
// })(Sandbox.modules);
