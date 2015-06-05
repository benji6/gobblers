const R = require('ramda');

const calculateMaxSpeed = ({v, energy}) => v * energy / 2;
const plusOrMinus = (x) => Math.round(Math.random()) ? x : -x;

const calculateEffectsOnEnergyAndAtmosphere = (gobbler, environment, xDistance, yDistance) => {
  const totalDistance = Math.pow((Math.pow(xDistance, 2), Math.pow(yDistance, 2)), 0.5);
  const energyUsed = totalDistance / environment.sideLength;
  gobbler.energy -= energyUsed;
  environment.increaseAtmosphereOxygenComposition(-energyUsed);
  return gobbler;
};

const random = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = gobbler.calculateRadius();
  const xDistance = Math.random() * speed;
  const yDistance = Math.random() * speed;

	if (gobbler.x <= radius + speed) {
		gobbler.x += xDistance;
	} else {
    gobbler.x += gobbler.x >= environment.sideLength - radius - speed ?
      -xDistance :
      plusOrMinus(xDistance);
	}

	if (gobbler.y <= radius + speed) {
		gobbler.y += yDistance;
	} else {
		if (gobbler.y >= environment.sideLength - radius - speed) {
			gobbler.y -= yDistance;
		} else {
			gobbler.y += plusOrMinus(yDistance);
		}
	}

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, xDistance, yDistance);
};

const right = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = gobbler.calculateRadius();
  const xDistance = Math.random() * speed;

  gobbler.x += gobbler.x >= environment.sideLength - radius - speed ?
    -xDistance :
    xDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, xDistance, 0);
};

const left = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = gobbler.calculateRadius();
  const xDistance = Math.random() * speed;

  gobbler.x += gobbler.x <= radius + speed ?
    xDistance :
    -xDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, xDistance, 0);
};

const top = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = gobbler.calculateRadius();
  const yDistance = Math.random() * speed;

  gobbler.y += gobbler.y <= radius + speed ?
    yDistance :
    -yDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, 0, yDistance);
};

const bottom = (gobbler, environment) => {
	const speed = calculateMaxSpeed(gobbler);
	const radius = gobbler.calculateRadius();
  const yDistance = Math.random() * speed;

  gobbler.y += gobbler.y >= environment.sideLength - radius - speed ?
    -yDistance :
    yDistance;

  return calculateEffectsOnEnergyAndAtmosphere(gobbler, environment, 0, yDistance);
};

const immobile = (x) => x;

const edge = (gobbler, environment) => {
  const {x, y} = gobbler;

  return R.minBy((obj) => obj.dist, [
    {
      dist: x,
      fn: left,
    },
    {
      dist: environment.sideLength - x,
      fn: right,
    },
    {
      dist: y,
      fn: top,
    },
    {
      dist: environment.sideLength - y,
      fn: bottom,
    },
  ]).fn(gobbler, environment);
};

module.exports = [
  edge,
  immobile,
  random,
];
