// Sandbox(['dom'], function(dom) {
//   describe('dom', function() {
//     it('should exist', function() {
//       chai.assert.isObject(dom);
//     });
//
//     describe('.addEvent', function() {
//       it('should be function', function() {
//         chai.assert.isFunction(dom.addEvent);
//       });
//
//       it('should call addEventListener on object', sinon.test(function() {
//         var eventSpy = {
//           addEventListener: this.spy()
//         },
//         handlerSpy = this.spy();
//
//         dom.addEvent('event', eventSpy, handlerSpy);
//
//         chai.assert.ok(eventSpy.addEventListener.calledWith('event', handlerSpy));
//       }));
//
//       it('should throw if eventType is not string', function() {
//         chai.expect(function() {
//           dom.addEvent();
//         }.bind(this)).to.throw(/event type must be string/);
//       });
//
//       it('should throw if object has no method addEventListener', function() {
//         chai.expect(function() {
//           dom.addEvent('event');
//         }.bind(this)).to.throw(/object has no method addEventListener/);
//       });
//
//       it('should throw if handler is no function', function() {
//         chai.expect(function() {
//           dom.addEvent('event', {addEventListener: function() {}});
//         }.bind(this)).to.throw(/handler must be function/);
//       });
//     });
//   });
// });

// (function() {
//
// })();
