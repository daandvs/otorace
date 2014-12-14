(function() {
  'use strict';

  describe('core.communicator', function() {
    it('should exist', function() {
      chai.assert.isFunction(CoreSandbox.modules.core_communicator);
    });

    describe('methods', function() {
      before(function() {
        this.box = {};
        CoreSandbox.modules.core_communicator(this.box);
      });

      describe('.subscribe', function() {
        it('should be function', function() {
          chai.assert.isFunction(this.box.subscribe);
        });
      });

      describe('.notify', function() {
        it('should be function', function() {
          chai.assert.isFunction(this.box.notify);
        });


      });
    });
  });
})();
