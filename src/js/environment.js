const canvasView = require('./canvasView.js');

const initialGobblersCount = (canvasView.canvas.height > canvasView.canvas.width ?
	canvasView.canvas.width : canvasView.canvas.height) * 2 / 3;
const initialGobblerEnergy = 6;

const oxygenLevel = initialGobblersCount * initialGobblerEnergy;
const carbonDioxideLevel = oxygenLevel;

module.exports = {
	carbonDioxideLevel,
	initialGobblerEnergy,
	initialGobblersCount,
	light: () => (Math.sin(Date.now() / 10000) + 1) / 2,
	increaseAtmosphereOxygenComposition: function (amount) {
		this.oxygenLevel += amount;
		this.carbonDioxideLevel -= amount;
	},
	oxygenLevel,
	maxEvolutionPoints: 8,
};
