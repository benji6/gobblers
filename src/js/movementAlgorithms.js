const calculateRadius = require('./calculateRadius.js');
const canvasView = require('./canvasView.js');

const random = (gobbler, environment) => {
	const speed = gobbler.v * gobbler.energy * environment.oxygenLevel / environment.initialGobblersCount;
	const radius = calculateRadius(gobbler);

	if (gobbler.x <= radius + speed) {
		gobbler.x += Math.random() / 2 * speed;
	} else {
		if (gobbler.x >= canvasView.canvas.width - radius - speed / 2) {
			gobbler.x -= Math.random() / 2 * speed;
		} else {
			gobbler.x += (Math.random() - 0.5) * speed;
		}
	}
	if (gobbler.y <= radius + speed) {
		gobbler.y += Math.random() / 2 * speed;
	} else {
		if (gobbler.y>=canvasView.canvas.height- radius -speed/2) {
			gobbler.y-=Math.random() / 2 * speed;
		} else {
			gobbler.y+=(Math.random() - 0.5) * speed;
		}
	}
	const energyUsed = gobbler.energy * speed / canvasView.canvas.width / 8;
	gobbler.energy -= energyUsed;
	environment.increaseAtmosphereOxygenComposition(-energyUsed);
	return gobbler;
};

module.exports = [
  random
];
