const resetValuesCalculatedEachIteration = function () {
  this.totalAttackCoefficient =
		this.totalDefenceCoefficient =
		this.totalPhotosynthesisCoefficient =
		this.totalVelocityCoefficient =
		this.totalEnergy = 0
  this.intOldestGen = this.intYoungestGen
  this.movementStrategies = {}
}

const recordGobblerPropertiesForThisIteration = function ({
	attackCoefficient,
	defenceCoefficient,
	energy,
	generation,
	movementStrategy,
	photosynthesisCoefficient,
	v,
}) {
  this.totalEnergy += energy
  this.intOldestGen = this.intOldestGen > generation
		? generation
		: this.intOldestGen
  this.totalVelocityCoefficient += v
  this.totalAttackCoefficient += attackCoefficient
  this.totalDefenceCoefficient += defenceCoefficient
  this.totalPhotosynthesisCoefficient += photosynthesisCoefficient
  this.movementStrategies[movementStrategy.movementAlgorithmName] = this.movementStrategies[movementStrategy.movementAlgorithmName]
		? ++this.movementStrategies[movementStrategy.movementAlgorithmName]
		: 1
}

export default {
  deathCount: 0,
  eatCount: 0,
  intOldestGen: 0,
  intYoungestGen: 0,
  movementStrategies: {},
  recordGobblerPropertiesForThisIteration,
  reproductionCount: 0,
  resetValuesCalculatedEachIteration,
  totalAttackCoefficient: 0,
  totalDefenceCoefficient: 0,
  totalEnergy: 0,
  totalPhotosynthesisCoefficient: 0,
  totalVelocityCoefficient: 0,
}
