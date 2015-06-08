const R = require('ramda');

const plusOrMinus = require('./plusOrMinus.js');

const movementAlgorithmNames = [
  "edge",
  "immobile",
  "random",
  "straightLines",
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

  straightLines (environment) {
    const {maxSpeed} = this;
    const {radius, x, y} = this.gobbler;
    const distance = Math.random() * maxSpeed;
    const bounceDistance = radius + maxSpeed;

    if (this.currentDirection === null) {
      this.currentDirection = {
        x: Math.floor(3 * Math.random()) - 1,
        y: Math.floor(3 * Math.random()) - 1,
      };
    }

    if (this.currentDirection.y) {
      if (y + bounceDistance >= environment.sideLength) {
        this.currentDirection.y = -1;
      } else if (y <= bounceDistance) {
        this.currentDirection.y = 1;
      }
    }

    if (this.currentDirection.x) {
      if (x + bounceDistance >= environment.sideLength) {
        this.currentDirection.x = -1;
      } else if (x <= bounceDistance) {
        this.currentDirection.x = 1;
      }
    }

    if (this.currentDirection.x && this.currentDirection.y) {
      const axisDistance = Math.pow(distance, 0.5) / 2;
      this.gobbler.x += axisDistance * this.currentDirection.x;
      this.gobbler.y += axisDistance * this.currentDirection.y;
    } else {
      this.gobbler.x += distance * this.currentDirection.x;
      this.gobbler.y += distance * this.currentDirection.y;
    }

    return this.calculateEffectsOnEnergyAndAtmosphere(environment, 0, distance);
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
