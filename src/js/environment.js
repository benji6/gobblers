const canvasView = require('./canvasView.js');

const sideLength = window.innerHeight > window.innerWidth ?
	window.innerWidth :
	window.innerHeight;
const initialGobblersCount = sideLength;
const initialGobblerEnergy = 6;

const oxygenLevel = initialGobblersCount * initialGobblerEnergy;
const carbonDioxideLevel = oxygenLevel;

module.exports = {
	carbonDioxideLevel,
	increaseAtmosphereOxygenComposition: function (amount) {
		this.oxygenLevel += amount;
		this.carbonDioxideLevel -= amount;
	},
	initialGobblerEnergy,
	initialGobblersCount,
	light: () => (Math.sin(Date.now() / 10000) + 1) / 2,
	maximumSpeed: 3,
	oxygenLevel,
	maxEvolutionPoints: 8,
	sideLength: window.innerHeight > window.innerWidth ?
	  window.innerWidth :
	  window.innerHeight,
};
