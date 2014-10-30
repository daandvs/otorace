(function() {
  'use strict';
  describe('Client', function() {
    it('should exist', function() {
      assert.ok(Otorace);
    });

    it('should have a submit function', function() {
      assert.ok(Otorace.submit);
    });
  });
})();
