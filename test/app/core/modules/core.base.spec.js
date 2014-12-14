(function() {
  'use strict';

  function resetCoreBase() {
    this.box = {};
    CoreSandbox.modules.core_base(this.box);
  }

  describe('core.base', function() {
    it('should exist', function() {
      chai.assert.isFunction(CoreSandbox.modules.core_base);
    });

    describe('methods', function() {

      describe('.module', function() {
        before(function() {
          resetCoreBase.call(this);
        });

        it('should be function', function() {
          chai.assert.isFunction(this.box.module);
        });

        it('should not register if module id already exist', function() {
          this.box.module('same_id', function() {});

          chai.expect(function() {
            this.box.module('same_id', function() {});
          }.bind(this)).to.throw('module same_id already exist');
        });

        it('should throw if no id', function() {
          chai.expect(function() {
            this.box.module();
          }.bind(this)).to.throw(/no valid id/);
        });

        it('should throw if id is empty', function() {
          chai.expect(function() {
            this.box.module('');
          }.bind(this)).to.throw(/no valid id/);
        });

        it('should throw if no function', function() {
          chai.expect(function() {
            this.box.module('id');
          }.bind(this)).to.throw(/no register function specified/);
        });
      });

      describe('.start', function() {

        before(function() {
          resetCoreBase.call(this);

          this.modules = [];

          var returnObj;
          for(var i = 0; i < 3; i++) {
            returnObj = {
              initialize: sinon.spy()
            };

            this.modules.push({
              returnObj: returnObj,
              module: sinon.stub().returns(returnObj)
            });

            this.box.module('id'+i, this.modules[i].module);
          }

          this.box.start();
        });

        it('should be function', function() {
          chai.assert.isFunction(this.box.start);
        });

        it('should invoke register function', function() {
          for(var i = 0; i < this.modules.length; i++) {
            chai.assert.ok(this.modules[i].module.called);
          }

        });

        it('should call initialize on registered module function', function() {
          for(var i = 0; i < this.modules.length; i++) {
            chai.assert.ok(this.modules[i].returnObj.initialize.called);
          }
        });

        it('should not invoke multiple times', function() {
          this.box.start();

          for(var i = 0; i < this.modules.length; i++) {
            chai.assert.notOk(this.modules[i].module.calledTwice);
            chai.assert.notOk(this.modules[i].returnObj.initialize.calledTwice);
          }

        });

        it('should throw if no initialize function', function() {
          this.box.module('another', function() {});
          chai.expect(this.box.start).to.throw(/no initialize found on module function/);
        });
      });

      describe('.stop', function() {

        before(function() {
          resetCoreBase.call(this);

          this.modules = [];

          var returnObj;
          for(var i = 0; i < 3; i++) {
            returnObj = {
              initialize: sinon.spy(),
              destroy: sinon.spy()
            };

            this.modules.push({
              returnObj: returnObj,
              module: sinon.stub().returns(returnObj)
            });

            this.box.module('id'+i, this.modules[i].module);
          }
        });

        it('should be function', function() {
          chai.assert.isFunction(this.box.stop);
        });

        it('should not invoke destroy if module has not started', function() {
          this.box.stop();

          for(var i = 0; i < this.modules.length; i++) {
            chai.assert.notOk(this.modules[i].returnObj.destroy.called);
          }

        });

        it('should invoke destroy function if module has been started', function() {
          this.box.start();
          this.box.stop();

          for(var i = 0; i < this.modules.length; i++) {
            chai.assert.ok(this.modules[i].returnObj.destroy.called);
          }
        });

        it('should not invoke multiple times', function() {
          this.box.stop();

          for(var i = 0; i < this.modules.length; i++) {
            chai.assert.notOk(this.modules[i].returnObj.destroy.calledTwice);
          }
        });

        it('should throw if no destroy function', function() {
          this.box.module('another', function() {
            return {
              initialize: function() {}
            };
          });
          this.box.start();
          chai.expect(this.box.stop).to.throw(/no destroy found on module function/);
        });
      });
    });
  });
})();
