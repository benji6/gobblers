const AnalysisView = require('./AnalysisView.js');
const canvasView = require('./canvasView.js');
const environment = require('./environment.js');

const analysisView = AnalysisView();
const gobblers = [];

const stats = {
	totalEnergy: 0,
	eatCount: 0,
	intYoungestGen: 0,
	intOldestGen: 0,
	reproductionCount: 0,
	deathCount: 0,
	totalVelocityCoefficient: 0,
	totalAttackCoefficient: 0,
	totalDefenceCoefficient: 0,
	totalPhotosynthesisCoefficient: 0,
};

var i;
function Gobbler({
	energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation
}) {
	this.attackCoefficient = attackCoefficient;
	this.defenceCoefficient = defenceCoefficient;
	this.energy = energy;
	this.generation = generation;
	this.metabolism = 0.001;
	this.mutationCoefficient = 0.5;
	this.photosynthesisCoefficient = photosynthesisCoefficient;
	this.threshold = 12;
	this.v = v;
	this.x = x;
	this.y = y;
}

var calculateRadius = ({energy}) => Math.sqrt(energy);
var calculateAttackStrength = ({attackCoefficient, energy}) => attackCoefficient * energy;
var calculateDefenceStrength = ({defenceCoefficient, energy}) => defenceCoefficient * energy;

Gobbler.prototype = {
	photosynthesize: function () {
		var energyProduced = this.photosynthesisCoefficient * calculateRadius(this) * environment.light() *
			environment.carbonDioxideLevel / environment.initialGobblersCount / 1000;
		this.energy += energyProduced;
		environment.increaseAtmosphereOxygenComposition(energyProduced);
	},

	move: function () {
		const speed = this.v * this.energy * environment.oxygenLevel / environment.initialGobblersCount;
		const radius = calculateRadius(this);

		if (this.x <= radius + speed) {
			this.x += Math.random() / 2 * speed;
		} else {
			if (this.x >= canvasView.canvas.width - radius - speed / 2) {
				this.x -= Math.random() / 2 * speed;
			} else {
				this.x += (Math.random() - 0.5) * speed;
			}
		}
		//y movement rules
		if (this.y<= radius +speed) {
			this.y+=Math.random()/2*speed;
		} else {
			if (this.y>=canvasView.canvas.height- radius -speed/2) {
				this.y-=Math.random()/2*speed;
			}
			else {
				this.y+=(Math.random() - 0.5) * speed;
			}
		}
		const energyUsed = this.energy * speed / canvasView.canvas.width / 8;
		this.energy -= energyUsed;
		environment.increaseAtmosphereOxygenComposition(-energyUsed);
	},

	eat: function () {
		for (var j = i + 1; j < gobblers.length; j++) {
			let thisGobblerRadius = calculateRadius(this);
			let thatGobblerRadius = calculateRadius(gobblers[j]);
			if(this.x>=gobblers[j].x - thatGobblerRadius - thisGobblerRadius &&
				this.x<=gobblers[j].x+ thatGobblerRadius + thisGobblerRadius &&
				this.y>=gobblers[j].y- thatGobblerRadius - thisGobblerRadius &&
				this.y<=gobblers[j].y+ thatGobblerRadius + thisGobblerRadius) {
				if (calculateAttackStrength(this) >= calculateDefenceStrength(gobblers[j])) {
					stats.eatCount++;
					stats.deathCount++;
					this.energy += gobblers[j].energy;
					gobblers.splice(j, 1);
					gobblers.length = gobblers.length;
					this.eat();
					break;
				}
			}
		}
	},

	reproduce: function() {
		if (this.energy > this.threshold) {
			stats.reproductionCount++;
			this.generation++;
			const displacementRadius = calculateRadius(this) * 2;
			const xDisplacement = (Math.random() - 0.5) * 2 * displacementRadius;
			const yDisplacement = Math.sqrt(Math.pow(displacementRadius,2) - Math.pow(xDisplacement,2));
			const parentGobbler = this;
			const gobblerParams = {
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
			this.energy = this.energy/2;
			this.mutate();
			gobblers[gobblers.length - 1].mutate();
			if (stats.intYoungestGen < this.generation) {
				stats.intYoungestGen = gobblers[i].generation;
			}
		}
	},

	mutate: function() {
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
		//enforce restrictions
		var currentEvolutionPoints = this.v + this.attackCoefficient + this.defenceCoefficient + this.photosynthesisCoefficient;
		var mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints;
		if (currentEvolutionPoints > environment.maxEvolutionPoints) {
			this.v = this.v * mutationEnforcementRatio;
			this.attackCoefficient = this.attackCoefficient * mutationEnforcementRatio;
			this.defenceCoefficient = this.defenceCoefficient * mutationEnforcementRatio;
			this.photosynthesisCoefficient = this.photosynthesisCoefficient * mutationEnforcementRatio;
		}
	},

	die: function () {
		const energyUsed = this.energy * this.metabolism;

		this.energy -= energyUsed;
		environment.increaseAtmosphereOxygenComposition(-energyUsed);

		if (this.energy < 0.1) {
			stats.deathCount++;
			environment.increaseAtmosphereOxygenComposition(-this.energy);
			gobblers.splice(i,1);
		}
	},
};

//initial spawn
for (i = 0; i < environment.initialGobblersCount; i++) {
	let gobblerParams = {
		x: 0,
		y: 0,
		energy: environment.initialGobblerEnergy,
		v: 1,
		attackCoefficient: 0.5,
		defenceCoefficient: 0.5,
		generation: 0,
		photosynthesisCoefficient: 1
	};
	gobblers[i] = new Gobbler(gobblerParams);
	let radius = calculateRadius(gobblers[i]);
	gobblers[i].x = Math.random()*(canvasView.canvas.width-2* radius) + radius;
	gobblers[i].y = Math.random()*(canvasView.canvas.height-2* radius) + radius;
	gobblers[i].mutate();
}

function run() {
	window.requestAnimationFrame(run);
	stats.totalEnergy = 0;
	stats.intOldestGen = stats.intYoungestGen;
	stats.totalVelocityCoefficient = 0;
	stats.totalPhotosynthesisCoefficient = 0;
	stats.totalAttackCoefficient = 0;
	stats.totalDefenceCoefficient = 0;

	for (i=0; i < gobblers.length; i++) {
		gobblers[i].photosynthesize();
		gobblers[i].move();
		gobblers[i].eat();
		gobblers[i].reproduce();
		stats.totalEnergy += gobblers[i].energy;
		stats.intOldestGen = stats.intOldestGen > gobblers[i].generation ?
			gobblers[i].generation :
			stats.intOldestGen;
		stats.totalVelocityCoefficient += gobblers[i].v;
		stats.totalAttackCoefficient += gobblers[i].attackCoefficient;
		stats.totalDefenceCoefficient += gobblers[i].defenceCoefficient;
		stats.totalPhotosynthesisCoefficient += gobblers[i].photosynthesisCoefficient;
		gobblers[i].die();
	}

	analysisView.render({
		averageAttackCoefficient: (stats.totalAttackCoefficient / gobblers.length).toFixed(2),
		averageDefenceCoefficient: (stats.totalDefenceCoefficient / gobblers.length).toFixed(2),
		averageEnergy: (stats.totalEnergy / gobblers.length).toFixed(2),
		averagePhotosynthesisCoefficient: (stats.totalPhotosynthesisCoefficient / gobblers.length).toFixed(2),
		averageVelocityCoefficient: (stats.totalVelocityCoefficient / gobblers.length).toFixed(2),
		environment,
		lightLevel: environment.light().toFixed(2),
		numberOfGobblers: gobblers.length,
		stats,
	});

	canvasView.render({
		gobblers,
		lightLevel: (environment.light() * 255).toFixed(0),
		totalAttackCoefficient: stats.totalAttackCoefficient,
		totalDefenceCoefficient: stats.totalDefenceCoefficient,
		totalPhotosynthesisCoefficient: stats.totalPhotosynthesisCoefficient,
	});
}
run();
