const calculateRadius = require('./calculateRadius.js');
const canvasView = require('./canvasView.js');

const calculateMaxSpeed = ({v, energy}) => v * energy / 2;
const plusOrMinus = (x) => Math.round(Math.random()) ? x : -x;

const calculateEffectsOnEnergyAndAtmosphere = (gobbler, environment, xDistance, yDistance) => {
  const totalDistance = Math.pow((Math.pow(xDistance, 2), Math.pow(yDistance, 2)), 0.5);
  const energyUsed = totalDistance / canvasView.canvas.width / 8;
  gobbler.energy -= energyUsed;
  environment.increaseAtmosphereOxygenComposition(-energyUsed);
  return gobbler;
};

const random = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = calculateRadius(gobbler);
  const xDistance = Math.random() * speed;
  const yDistance = Math.random() * speed;

	if (gobbler.x <= radius + speed) {
		gobbler.x += xDistance;
	} else {
    gobbler.x += gobbler.x >= canvasView.canvas.width - radius - speed ?
      -xDistance :
      plusOrMinus(xDistance);
	}

	if (gobbler.y <= radius + speed) {
		gobbler.y += yDistance;
	} else {
		if (gobbler.y >= canvasView.canvas.height - radius - speed) {
			gobbler.y -= yDistance;
		} else {
			gobbler.y += plusOrMinus(yDistance);
		}
	}

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, xDistance, yDistance);
};

const right = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = calculateRadius(gobbler);
  const xDistance = Math.random() * speed;

  gobbler.x += gobbler.x >= canvasView.canvas.width - radius - speed ?
    -xDistance :
    xDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, xDistance, 0);
};

const left = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = calculateRadius(gobbler);
  const xDistance = Math.random() * speed;

  gobbler.x += gobbler.x <= radius + speed ?
    xDistance :
    -xDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, xDistance, 0);
};

const bottom = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = calculateRadius(gobbler);
  const yDistance = Math.random() * speed;

  gobbler.y += gobbler.y <= radius + speed ?
    yDistance :
    -yDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, 0, yDistance);
};

const top = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = calculateRadius(gobbler);
  const yDistance = Math.random() * speed;

  gobbler.y += gobbler.y >= canvasView.canvas.width - radius - speed ?
    -yDistance :
    yDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, 0, yDistance);
};

module.exports = [
  random,
  right,
  left,
  top,
  bottom,
];
