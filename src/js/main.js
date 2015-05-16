const R = require('ramda');

const DescriptionView = require('./DescriptionView.js');
const AnalysisView = require('./AnalysisView.js');
const CanvasView = require('./CanvasView.js');

DescriptionView();

const analysisView = AnalysisView();
const canvasView = CanvasView();

//model
//declaration and initialization
const intStartingGobblers = 256;
const intStartingGobblerEnergy = 6;
var environment = {
	light: function() {
		return (Math.sin(Date.now() / 10000) + 1) / 2;
	},
	oxygenLevel: intStartingGobblers * intStartingGobblerEnergy,
	carbonDioxideLevel: intStartingGobblers * intStartingGobblerEnergy,
	maxEvolutionPoints: 8
};

//analysis
var totalEnergy = 0;
var eatCount = 0;
var intYoungestGen = 0;
var intOldestGen = 0;
var reproductionCount = 0;
var deathCount = 0;
var totalVelocityCoefficient = 0;
var totalAttackCoefficient = 0;
var totalDefenceCoefficient = 0;
var totalPhotosynthesisCoefficient = 0;

var i;

function Gobbler(params) {
	this.energy = params.energy;
	this.x = params.x;
	this.y = params.y;
	this.v = params.v;
	this.attackCoefficient = params.attackCoefficient;
	this.defenceCoefficient = params.defenceCoefficient;
	this.photosynthesisCoefficient = params.photosynthesisCoefficient;
	this.generation = params.generation;
}

Gobbler.prototype.init = function () {
	this.x = Math.random() * (canvasView.canvas.width - 2 * this.radius()) + this.radius();
	this.y = Math.random() * (canvasView.canvas.height - 2 * this.radius()) + this.radius();
	this.mutate();
	return this;
};
Gobbler.prototype.metabolism = 0.001;
Gobbler.prototype.threshold = 12;
Gobbler.prototype.mutationCoefficient = 0.5;
Gobbler.prototype.radius = function() {
	return Math.sqrt(this.energy);
};
Gobbler.prototype.attack = function() {
	return this.attackCoefficient * this.energy;
};
Gobbler.prototype.defence = function() {
	return this.defenceCoefficient * this.energy;
};
Gobbler.prototype.color = function() {
	var r = (this.attackCoefficient / totalAttackCoefficient * gobblers.length * 127).toFixed(0);
	var b = (this.defenceCoefficient / totalDefenceCoefficient * gobblers.length * 127).toFixed(0);
	var g = (this.photosynthesisCoefficient / totalPhotosynthesisCoefficient * gobblers.length * 127).toFixed(0);
	return 'rgb('+r+','+g+','+b+')';
};
Gobbler.prototype.photosynthesize = function() {
	var energyProduced = this.photosynthesisCoefficient * this.radius() * environment.light() * environment.carbonDioxideLevel / intStartingGobblers / 1000;
	this.energy += energyProduced;
	environment.oxygenLevel += energyProduced;
	environment.carbonDioxideLevel -= energyProduced;
};
Gobbler.prototype.move = function() {
	//set properties
	var dblVel = this.v * this.energy * environment.oxygenLevel / intStartingGobblers;
	//x movement rules
	if (this.x<=this.radius()+dblVel) {
		this.x+=Math.random()/2*dblVel;
	} else {
		if (this.x>=canvasView.canvas.width-this.radius()-dblVel/2) {
			this.x-=Math.random()/2*dblVel;
		} else {
			this.x+=(Math.random() - 0.5) * dblVel;
		}
	}
	//y movement rules
	if (this.y<=this.radius()+dblVel) {
		this.y+=Math.random()/2*dblVel;
	} else {
		if (this.y>=canvasView.canvas.height-this.radius()-dblVel/2) {
			this.y-=Math.random()/2*dblVel;
		}
		else {
			this.y+=(Math.random() - 0.5) * dblVel;
		}
	}
	//reduce energy
	var energyUsed = this.energy * dblVel / canvasView.canvas.width / 8;
	this.energy -= energyUsed;
	environment.oxygenLevel -= energyUsed;
	environment.carbonDioxideLevel += energyUsed;
};
Gobbler.prototype.eat = function() {
	for (var j = i + 1; j < gobblers.length; j++) {
		//check contact
		if(this.x>=gobblers[j].x-gobblers[j].radius()-this.radius() &&
			this.x<=gobblers[j].x+gobblers[j].radius()+this.radius() &&
			this.y>=gobblers[j].y-gobblers[j].radius()-this.radius() &&
			this.y<=gobblers[j].y+gobblers[j].radius()+this.radius()) {
			//check attack and defense stats
			if (this.attack()>=gobblers[j].defence()) {
				//analysis
				eatCount++;
				deathCount++;
				//eat
				this.energy += gobblers[j].energy;
				gobblers.splice(j, 1);
				this.eat();
				break;
			}
		}
	}
};
Gobbler.prototype.reproduce = function() {
	if (this.energy > this.threshold) {
		//analysis
		reproductionCount++;
		//reproduce
		this.generation++;
		//separate children
		var displacementRadius = this.radius() * 2;
		var xDisplacement = (Math.random() - 0.5) * 2 * displacementRadius;
		var yDisplacement = Math.sqrt(Math.pow(displacementRadius,2) - Math.pow(xDisplacement,2));
		//new Gobbler
		var parentGobbler = this;
		var gobblerParams = {
			x: parentGobbler.x - xDisplacement,
			y: parentGobbler.y - yDisplacement,
			energy: parentGobbler.energy / 2,
			v: parentGobbler.v,
			attackCoefficient: parentGobbler.attackCoefficient,
			defenceCoefficient: parentGobbler.defenceCoefficient,
			generation: parentGobbler.generation,
			photosynthesisCoefficient: parentGobbler.photosynthesisCoefficient
		};
		gobblers[gobblers.length] = new Gobbler(gobblerParams);
		this.x += xDisplacement;
		this.y += yDisplacement;
		//split energy
		this.energy = this.energy/2;
		//mutate
		this.mutate();
		gobblers[gobblers.length - 1].mutate();
		//analysis
		if (intYoungestGen < this.generation) {
			intYoungestGen = gobblers[i].generation;
		}
	}
};
Gobbler.prototype.mutate = function() {
	var obj = this;
	function subMutate(prop) {
		prop += prop * (Math.random() - 0.5) * obj.mutationCoefficient;
		if (prop < 0) {
			prop = 0.000001;
		}
		return prop;
	}
	this.v = subMutate(this.v);
	this.attackCoefficient = subMutate(this.attackCoefficient);
	this.defenceCoefficient = subMutate(this.defenceCoefficient);
	this.photosynthesisCoefficient = subMutate(this.photosynthesisCoefficient);
	var currentEvolutionPoints = this.v + this.attackCoefficient + this.defenceCoefficient + this.photosynthesisCoefficient;
	var mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints;
	if (currentEvolutionPoints > environment.maxEvolutionPoints) {
		this.v = this.v * mutationEnforcementRatio;
		this.attackCoefficient = this.attackCoefficient * mutationEnforcementRatio;
		this.defenceCoefficient = this.defenceCoefficient * mutationEnforcementRatio;
		this.photosynthesisCoefficient = this.photosynthesisCoefficient * mutationEnforcementRatio;
	}
};
Gobbler.prototype.die = function() {
	var energyUsed = this.energy * this.metabolism;
	this.energy -= energyUsed;
	environment.oxygenLevel -= energyUsed;
	environment.carbonDioxideLevel += energyUsed;
	if (this.energy < 0.1) {
		deathCount++;
		environment.oxygenLevel += this.energy;
		gobblers.splice(i,1);
	}
};
//initial spawn
var gobblerParams = {
	x: 0,
	y: 0,
	energy: intStartingGobblerEnergy,
	v: 1,
	attackCoefficient: 0.5,
	defenceCoefficient: 0.5,
	generation: 0,
	photosynthesisCoefficient: 1
};

const gobblers = R.map(() =>
	new Gobbler(gobblerParams).init(), R.repeat(0, intStartingGobblers));


(function loop () {
	window.requestAnimationFrame(loop);
	totalEnergy = 0;
	intOldestGen = intYoungestGen;
	totalVelocityCoefficient = 0;
	totalPhotosynthesisCoefficient = 0;
	totalAttackCoefficient = 0;
	totalDefenceCoefficient = 0;

	R.forEach((gobbler) => {
		gobbler.photosynthesize();
		gobbler.move();
		gobbler.eat();
		gobbler.reproduce();
		totalEnergy += gobbler.energy;
		intOldestGen = intOldestGen > gobbler.generation ?
			gobbler.generation :
			intOldestGen;
		totalVelocityCoefficient += gobbler.v;
		totalAttackCoefficient += gobbler.attackCoefficient;
		totalDefenceCoefficient += gobbler.defenceCoefficient;
		totalPhotosynthesisCoefficient += gobbler.photosynthesisCoefficient;
		gobbler.die();
	}, gobblers);

	analysisView.render({
		lightLevel: environment.light().toFixed(2),
		oxygenLevel: environment.oxygenLevel.toFixed(0),
		averageEnergy: (totalEnergy / gobblers.length).toFixed(2),
		averageVelocityCoefficient: (totalVelocityCoefficient / gobblers.length).toFixed(2),
		carbonDioxideLevel: environment.carbonDioxideLevel.toFixed(0),
		averageAttackCoefficient: (totalAttackCoefficient / gobblers.length).toFixed(2),
		totalEnergy: totalEnergy.toFixed(0),
		averageDefenceCoefficient: (totalDefenceCoefficient / gobblers.length).toFixed(2),
		numberOfGobblers: gobblers.length,
		averagePhotosynthesisCoefficient: (totalPhotosynthesisCoefficient / gobblers.length).toFixed(2),
		eatCount,
		reproductionCount,
		deathCount,
		intYoungestGen,
		intOldestGen,
	});

	canvasView.render({
		gobblers,
		lightLevel: (environment.light() * 255).toFixed(0),
	});
}());
