/* */ 
var tinytic = (function() {
	var getNow = typeof performance === "object" && typeof performance.now === "function" && performance.now.bind(performance) ||
		Date.now ||
		function() {return new Date().getTime();};

	var t0 = getNow(),
		then = t0,
		now = then;

	var toc = function(maxDT) {
		then = now;
		now = getNow();
		var dT = now - then;
		if (maxDT < dT) {
			return maxDT;
		}
		return dT;
	};

	var total = function(maxDT) {
		var dT = getNow() - t0;
		if (maxDT < dT) {
			return maxDT;
		}
		return dT;
	};

	var reset = function() {
		t0 = then = now = getNow();
	};

	return {
		toc: toc,
		total: total,
		reset: reset
	};
}());

if (typeof module === 'object') {
	module.exports = tinytic;
}
