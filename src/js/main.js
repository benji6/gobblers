const AnalysisView = require('./AnalysisView.js');
const canvasView = require('./canvasView.js');
const environment = require('./environment.js');

const analysisView = AnalysisView();
const gobblers = [];

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

init();
var i;
function init() {
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

	Gobbler.prototype = {
		radius: function () {
			return Math.sqrt(this.energy);
		},

		attack: function () {
			return this.attackCoefficient * this.energy;
		},

		defence: function () {
			return this.defenceCoefficient * this.energy;
		},

		color: function () {
			const totalGobblers = gobblers.length;
			return `rgb(${(this.attackCoefficient / totalAttackCoefficient * totalGobblers * 127).toFixed(0)},
				${(this.defenceCoefficient / totalDefenceCoefficient * totalGobblers * 127).toFixed(0)},
				${(this.photosynthesisCoefficient / totalPhotosynthesisCoefficient * totalGobblers * 127).toFixed(0)})`;
		},

		photosynthesize: function () {
			var energyProduced = this.photosynthesisCoefficient * this.radius() * environment.light() *
				environment.carbonDioxideLevel / environment.initialGobblersCount / 1000;
			this.energy += energyProduced;
			environment.oxygenLevel += energyProduced;
			environment.carbonDioxideLevel -= energyProduced;
		},

		move: function () {
			const speed = this.v * this.energy * environment.oxygenLevel / environment.initialGobblersCount;
			//x movement rules
			if (this.x <= this.radius() + speed) {
				this.x += Math.random() / 2 * speed;
			} else {
				if (this.x >= canvasView.canvas.width - this.radius() - speed / 2) {
					this.x -= Math.random() / 2 * speed;
				} else {
					this.x += (Math.random() - 0.5) * speed;
				}
			}
			//y movement rules
			if (this.y<=this.radius()+speed) {
				this.y+=Math.random()/2*speed;
			} else {
				if (this.y>=canvasView.canvas.height-this.radius()-speed/2) {
					this.y-=Math.random()/2*speed;
				}
				else {
					this.y+=(Math.random() - 0.5) * speed;
				}
			}
			const energyUsed = this.energy * speed / canvasView.canvas.width / 8;
			this.energy -= energyUsed;
			environment.oxygenLevel -= energyUsed;
			environment.carbonDioxideLevel += energyUsed;
		},

		eat: function () {
			for (var j = i + 1; j < gobblers.length; j++) {
				//check contact
				if(this.x>=gobblers[j].x-gobblers[j].radius()-this.radius() && this.x<=gobblers[j].x+gobblers[j].radius()+this.radius() && this.y>=gobblers[j].y-gobblers[j].radius()-this.radius() && this.y<=gobblers[j].y+gobblers[j].radius()+this.radius()) {
					//check attack and defense stats
					if (this.attack()>=gobblers[j].defence()) {
						//analysis
						eatCount++;
						deathCount++;
						//eat
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
		},

		mutate: function() {
			//mutate properties
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
			environment.oxygenLevel -= energyUsed;
			environment.carbonDioxideLevel += energyUsed;

			if (this.energy < 0.1) {
				deathCount++;
				environment.oxygenLevel += this.energy;
				gobblers.splice(i,1);
			}
		},
	};

	//initial spawn
	for (i=0; i < environment.initialGobblersCount; i++) {
		var gobblerParams = {
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
		gobblers[i].x = Math.random()*(canvasView.canvas.width-2*gobblers[i].radius())+gobblers[i].radius();
		gobblers[i].y = Math.random()*(canvasView.canvas.height-2*gobblers[i].radius())+gobblers[i].radius();
		gobblers[i].mutate();
	}
}

function run() {
	window.requestAnimationFrame(run);
	totalEnergy = 0;
	intOldestGen = intYoungestGen;
	totalVelocityCoefficient = 0;
	totalPhotosynthesisCoefficient = 0;
	totalAttackCoefficient = 0;
	totalDefenceCoefficient = 0;

	for (i=0; i < gobblers.length; i++) {
		gobblers[i].photosynthesize();
		gobblers[i].move();
		gobblers[i].eat();
		gobblers[i].reproduce();
		totalEnergy += gobblers[i].energy;
		intOldestGen = intOldestGen > gobblers[i].generation ?
			gobblers[i].generation :
			intOldestGen;
		totalVelocityCoefficient += gobblers[i].v;
		totalAttackCoefficient += gobblers[i].attackCoefficient;
		totalDefenceCoefficient += gobblers[i].defenceCoefficient;
		totalPhotosynthesisCoefficient += gobblers[i].photosynthesisCoefficient;
		gobblers[i].die();
	}

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
}

run();
