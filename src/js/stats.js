const resetValuesCalculatedEachIteration = function () {
	this.totalAttackCoefficient =
		this.totalDefenceCoefficient =
		this.totalPhotosynthesisCoefficient =
		this.totalVelocityCoefficient =
		this.totalEnergy = 0;
	this.intOldestGen = this.intYoungestGen;
};

const recordGobblerPropertiesForThisIteration = function (gobbler) {
	this.totalEnergy += gobbler.energy;
	this.intOldestGen = this.intOldestGen > gobbler.generation ?
		gobbler.generation :
		this.intOldestGen;
	this.totalVelocityCoefficient += gobbler.v;
	this.totalAttackCoefficient += gobbler.attackCoefficient;
	this.totalDefenceCoefficient += gobbler.defenceCoefficient;
	this.totalPhotosynthesisCoefficient += gobbler.photosynthesisCoefficient;
};

module.exports = {
	totalEnergy: 0,
	eatCount: 0,
	intYoungestGen: 0,
	intOldestGen: 0,
	reproductionCount: 0,
	deathCount: 0,
	recordGobblerPropertiesForThisIteration,
	resetValuesCalculatedEachIteration,
	totalVelocityCoefficient: 0,
	totalAttackCoefficient: 0,
	totalDefenceCoefficient: 0,
	totalPhotosynthesisCoefficient: 0,
};
