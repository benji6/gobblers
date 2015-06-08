const R = require('ramda');

const plusOrMinus = require('./plusOrMinus.js');

const movementAlgorithmNames = [
  "backAndForth",
  "edge",
  "immobile",
  "random",
  "upAndDown",
  "wander",
];

class MovementStrategy {
  constructor (gobbler, movementStrategy) {
    this.currentDirection = null;
    this.phi = null;
    this.gobbler = gobbler;
    this.movementAlgorithmName = movementStrategy &&
      movementStrategy.movementAlgorithmName ||
      movementAlgorithmNames[Math.floor(Math.random() * movementAlgorithmNames.length)];
  }

  get maxSpeed () {
    const {v, energy} = this.gobbler;
    return v * energy / 2;
  }

  calculateEffectsOnEnergyAndAtmosphere (environment, xDistance, yDistance) {
    const totalDistance = Math.pow((Math.pow(xDistance, 2), Math.pow(yDistance, 2)), 0.5);
    const energyUsed = totalDistance / environment.sideLength;
    this.gobbler.energy -= energyUsed;
    environment.increaseAtmosphereOxygenComposition(-energyUsed);
    return this.gobbler;
  }

  edge (environment) {
    const {radius, x, y} = this.gobbler;
    const {maxSpeed} = this;
    const distance = Math.random() * maxSpeed;

    R.minBy((obj) => obj.dist, [
      {
        dist: x,
        fn: () => this.gobbler.x += x <= radius + maxSpeed ?
          distance :
          -distance,
      },
      {
        dist: environment.sideLength - x,
        fn: () => this.gobbler.x += x >= environment.sideLength - radius - maxSpeed ?
          -distance :
          distance,
      },
      {
        dist: y,
        fn: () => this.gobbler.y += y <= radius + maxSpeed ?
          distance :
          -distance,
      },
      {
        dist: environment.sideLength - y,
        fn: () => this.gobbler.y += y >= environment.sideLength - radius - maxSpeed ?
          -distance :
          distance,
      },
    ]).fn();

    return this.calculateEffectsOnEnergyAndAtmosphere(environment, distance, 0);
  }

  move (environment) {
    return this[this.movementAlgorithmName](environment);
  }

  backAndForth (environment) {
    const {maxSpeed} = this;
    const {radius, x} = this.gobbler;
    const xDistance = Math.random() * maxSpeed;

    if (x >= environment.sideLength - radius - maxSpeed) {
      this.currentDirection = -1;
    } else if (x <= radius + maxSpeed) {
      this.currentDirection = 1;
    } else {
      this.currentDirection = this.currentDirection || plusOrMinus(1);
    }

    this.gobbler.x += xDistance * this.currentDirection;

    return this.calculateEffectsOnEnergyAndAtmosphere(environment, xDistance, 0);
  }

  immobile () {
    return this.gobbler;
  }

  random (environment) {
    const {maxSpeed} = this;
    const {radius, x, y} = this.gobbler;
    const xDistance = Math.random() * maxSpeed;
    const yDistance = Math.random() * maxSpeed;

  	if (x <= radius + maxSpeed) {
  		this.gobbler.x += xDistance;
  	} else {
      this.gobbler.x += x >= environment.sideLength - radius - maxSpeed ?
        -xDistance :
        plusOrMinus(xDistance);
  	}

  	if (y <= radius + maxSpeed) {
  		this.gobbler.y += yDistance;
  	} else {
  		if (y >= environment.sideLength - radius - maxSpeed) {
  			this.gobbler.y -= yDistance;
  		} else {
  			this.gobbler.y += plusOrMinus(yDistance);
  		}
  	}

    return this.calculateEffectsOnEnergyAndAtmosphere(environment, xDistance, yDistance);
  }

  upAndDown (environment) {
    const {maxSpeed} = this;
    const {radius, y} = this.gobbler;
    const yDistance = Math.random() * maxSpeed;

    if (y >= environment.sideLength - radius - maxSpeed) {
      this.currentDirection = -1;
    } else if (y <= radius + maxSpeed) {
      this.currentDirection = 1;
    } else {
      this.currentDirection = this.currentDirection || plusOrMinus(1);
    }

    this.gobbler.y += yDistance * this.currentDirection;
    return this.calculateEffectsOnEnergyAndAtmosphere(environment, 0, yDistance);
  }

  wander (environment) {
    const {maxSpeed} = this;
    const {radius, x, y} = this.gobbler;
    const distance = Math.random() * maxSpeed;
    const spread = 0.1;

    if (this.phi === null) {
      this.phi = 2 * Math.PI * Math.random();
    }
    if (x >= environment.sideLength - radius - maxSpeed) {
      if (Math.cos(this.phi) > 0) {
        this.phi = Math.PI - this.phi;
      }
    } else if (x <= radius + maxSpeed) {
      if (Math.cos(this.phi) < 0) {
        this.phi = Math.PI - this.phi;
      }
    } else if (y >= environment.sideLength - radius - maxSpeed) {
      if (Math.sin(this.phi) > 0) {
        this.phi = - this.phi;
      }
    } else if (y <= radius + maxSpeed) {
      if (Math.sin(this.phi) < 0) {
        this.phi = - this.phi;
      }
    } else {
      this.phi += plusOrMinus(spread);
    }

    this.gobbler.x += distance * Math.cos(this.phi);
    this.gobbler.y += distance * Math.sin(this.phi);

    return this.calculateEffectsOnEnergyAndAtmosphere(environment, distance, 0);
  }
}

module.exports = MovementStrategy;
