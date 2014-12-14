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

        it('throw if no type', function() {
          expect(this.box.subscribe).to.throw(/subscribe requires type string/);
        });

        it('should throw if type is empty', function() {
          expect(function() {
            this.box.subscribe('');
          }.bind(this)).to.throw(/subscribe requires type string/);
        });

        it('should throw if no callback', function() {
          expect(function() {
            this.box.subscribe('event');
          }.bind(this)).to.throw(/subscribe requires callback function/);
        });
      });

      describe('.notify', function() {
        before(function() {
          this.subscriber1 = sinon.spy();
          this.subscriber2 = sinon.spy();

          this.box.subscribe('event', this.subscriber1);
          this.box.subscribe('another_event', this.subscriber2);
        });

        it('should be function', function() {
          chai.assert.isFunction(this.box.notify);
        });

        it('should notify all subscribers of event type', function() {
          this.box.notify('event');

          chai.assert.ok(this.subscriber1.called);
          chai.assert.notOk(this.subscriber2.called);
        });

        it('should send data to subscribers on notify', function() {
          var dataObj = {
            data: 'data'
          };

          this.box.notify('another_event', dataObj);

          chai.assert.ok(this.subscriber2.calledWith(dataObj));
        });

        it('should throw if no type is given', function() {
          chai.expect(this.box.notify).to.throw(/notify requires type/);
        });

        it('should throw if type is empty', function() {
          chai.expect(function() {
            this.box.notify('');
          }.bind(this)).to.throw(/notify requires type/);
        })
      });
    });
  });
})();
