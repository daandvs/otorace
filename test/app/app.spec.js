(function() {
  describe('App', function() {
    it('should be object', function() {
      chai.assert.isObject(App);
    });

    describe('.init', function() {
      it('should be function', function() {
        chai.assert.isFunction(App.initialize);
      });

      describe('Core', function() {
        before(function() {
          this.CoreSandboxStub = sinon.stub(window, 'CoreSandbox');
          App.initialize();
        });

        after(function() {
          this.CoreSandboxStub.restore();
        });

        it('should call CoreSandbox', function() {
          chai.assert.deepEqual(['core_communicator'], this.CoreSandboxStub.args[0][0]);
        });

        it('should set Core', function() {
          var returnVal = {
            value: 'some_val'
          };

          this.CoreSandboxStub.args[0][1](returnVal);

          chai.assert.isObject(Core);
          chai.assert.deepEqual(returnVal, Core);
        });
      });
    });
  });
})();
