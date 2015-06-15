/* */ 
"format cjs";
var totalIterations = 16;
var totalTimesToTest = 4;
var frameRate = 1000 / 60;

runSpec(frameRate / 4);
runSpec(frameRate / 2);
runSpec(frameRate);
runSpec(frameRate * 2);
runSpec(frameRate * 4);

function runSpec (dT) {
  describe("tinytic.toc", function() {
    beforeAll(function() {
      tinytic.reset();
    });
    beforeEach(function (done) {
      window.setTimeout(function() {
        done();
      }, dT);
    });

    it("returns 0 when passed as an argument", function (done) {
      expect(tinytic.toc(0)).toEqual(0);
      done();
    });
    it("returns " + dT / 2 + " when passed as an argument", function (done) {
      expect(tinytic.toc(dT / 2)).toEqual(dT / 2);
      done();
    });
    it("returns " + dT + " to precision -1 when passed " + 2 * dT + " as an argument", function (done) {
      expect(tinytic.toc(2 * dT)).toBeCloseTo(dT, -1);
      done();
    });

    var i;
    for (i = 0; i < totalIterations; i++) {
      it("returns " + dT + " to precision -1", function (done) {
        expect(tinytic.toc()).toBeCloseTo(dT, -1);
        done();
      });
    }
  });

  describe("tinytic.total", function() {
    beforeAll(function() {
      tinytic.reset();
    });
    beforeEach(function (done) {
      window.setTimeout(function() {
        done();
      }, dT);
    });

    var idx = 0;
    for (var i = 0; i < totalIterations; i++) {
      it("returns total time elapsed to precision -2", function (done) {
        expect(tinytic.total()).toBeCloseTo(dT * ++idx, -2);
        done();
      });
    }
  });

  describe("tinytic.reset", function() {
    beforeEach(function () {
      tinytic.reset();
    });

    it("returns undefined", function () {
      expect(tinytic.reset()).not.toBeDefined();
    });

    for (i = 0; i < totalIterations / 4; i++) {
      it("resets tinytic.toc", function () {
        expect(tinytic.toc()).toBeCloseTo(0, -1);
      });
    }
    for (i = 0; i < totalIterations / 4; i++) {
      it("resets tinytic.total", function () {
        expect(tinytic.total()).toBeCloseTo(0, -1);
      });
    }
  });
}
