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
var gobbler = [];
var environment = {
	light: function() {
		return (Math.sin(Date.now() / 10000) + 1) / 2;
	},
	oxygenLevel: intStartingGobblers * intStartingGobblerEnergy,
	carbonDioxideLevel: intStartingGobblers * intStartingGobblerEnergy,
	maxEvolutionPoints: 8
};

var viewHolder = document.createElement('div');
var controller = document.createElement('div');

viewHolder.appendChild(controller);

var animateStyle = false;
var analysisOn = true;
//controller
var analysisSwitch = document.createElement('button');
var animateStyleSwitch = document.createElement('button');
analysisSwitch.onfocus = function () {
	this.blur && this.blur();
};
animateStyleSwitch.onfocus = function () {
	this.blur && this.blur();
};
analysisSwitch.innerHTML = 'Analysis Switch';
analysisSwitch.onclick = function () {
	analysisOn = !analysisOn;
	if (analysisOn) {
		analysisView.container.className = "";
	} else {
		analysisView.container.className = "hidden";
	}
};

animateStyleSwitch.innerHTML = 'Animation Blur Effect';
animateStyleSwitch.onclick = function() {
	animateStyle = !animateStyle;
};

const buttonsContainer = document.createElement("div");
buttonsContainer.className = "center";

buttonsContainer.appendChild(analysisSwitch);
buttonsContainer.appendChild(animateStyleSwitch);
controller.appendChild(buttonsContainer);

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
//i is currently at this level as run funciton and methods in gobbler prototype require it... needs to change...
var i;
function init() {
	//Gobbler constructor
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
	//Gobbler prototype
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
		var r = (this.attackCoefficient / totalAttackCoefficient * gobbler.length * 127).toFixed(0);
		var b = (this.defenceCoefficient / totalDefenceCoefficient * gobbler.length * 127).toFixed(0);
		var g = (this.photosynthesisCoefficient / totalPhotosynthesisCoefficient * gobbler.length * 127).toFixed(0);
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
		//check against all gobblers not yet checked against
		for (var j = i + 1; j < gobbler.length; j++) {
			//check contact
			if(this.x>=gobbler[j].x-gobbler[j].radius()-this.radius() && this.x<=gobbler[j].x+gobbler[j].radius()+this.radius() && this.y>=gobbler[j].y-gobbler[j].radius()-this.radius() && this.y<=gobbler[j].y+gobbler[j].radius()+this.radius()) {
				//check attack and defense stats
				if (this.attack()>=gobbler[j].defence()) {
					//analysis
					eatCount++;
					deathCount++;
					//eat
					this.energy += gobbler[j].energy;
					gobbler.splice(j, 1);
					gobbler.length = gobbler.length;
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
			gobbler[gobbler.length] = new Gobbler(gobblerParams);
			this.x += xDisplacement;
			this.y += yDisplacement;
			//split energy
			this.energy = this.energy/2;
			//mutate
			this.mutate();
			gobbler[gobbler.length - 1].mutate();
			//analysis
			if (intYoungestGen < this.generation) {
				intYoungestGen = gobbler[i].generation;
			}
		}
	};
	Gobbler.prototype.mutate = function() {
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
	};
	Gobbler.prototype.die = function() {
		//reduce energy
		var energyUsed = this.energy * this.metabolism;
		this.energy -= energyUsed;
		environment.oxygenLevel -= energyUsed;
		environment.carbonDioxideLevel += energyUsed;
		//check for death
		if (this.energy < 0.1) {
			//analysis
			deathCount++;
			//release oxygen
			environment.oxygenLevel += this.energy;
			//remove gobbler
			gobbler.splice(i,1);
		}
	};
	//initial spawn
	for (i=0;i<intStartingGobblers;i++) {
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
		gobbler[i] = new Gobbler(gobblerParams);
		//initial position (dependent on radius method of object)
		gobbler[i].x = Math.random()*(canvasView.canvas.width-2*gobbler[i].radius())+gobbler[i].radius();
		gobbler[i].y = Math.random()*(canvasView.canvas.height-2*gobbler[i].radius())+gobbler[i].radius();
		//initial variation
		gobbler[i].mutate();
	}
}

function run() {
	window.requestAnimationFrame(run);
	//variable for analysis
	if (analysisOn) {
		totalEnergy = 0;
		intOldestGen = intYoungestGen;
		totalVelocityCoefficient = 0;
	}
	//required for color()
	totalPhotosynthesisCoefficient = 0;
	totalAttackCoefficient = 0;
	totalDefenceCoefficient = 0;
	//run methods
	for (i=0; i < gobbler.length; i++) {
		gobbler[i].photosynthesize();
		gobbler[i].move();
		gobbler[i].eat();
		gobbler[i].reproduce();
		if (analysisOn) {
			totalEnergy += gobbler[i].energy;
			intOldestGen = intOldestGen > gobbler[i].generation ?
				gobbler[i].generation :
				intOldestGen;
			totalVelocityCoefficient += gobbler[i].v;
		}
		totalAttackCoefficient += gobbler[i].attackCoefficient;
		totalDefenceCoefficient += gobbler[i].defenceCoefficient;
		totalPhotosynthesisCoefficient += gobbler[i].photosynthesisCoefficient;
		gobbler[i].die();
	}
	if (analysisOn) {
		analysisView.render({
			lightLevel: environment.light().toFixed(2),
			oxygenLevel: environment.oxygenLevel.toFixed(0),
			averageEnergy: (totalEnergy / gobbler.length).toFixed(2),
			averageVelocityCoefficient: (totalVelocityCoefficient / gobbler.length).toFixed(2),
			carbonDioxideLevel: environment.carbonDioxideLevel.toFixed(0),
			averageAttackCoefficient: (totalAttackCoefficient / gobbler.length).toFixed(2),
			totalEnergy: totalEnergy.toFixed(0),
			averageDefenceCoefficient: (totalDefenceCoefficient / gobbler.length).toFixed(2),
			numberOfGobblers: gobbler.length,
			averagePhotosynthesisCoefficient: (totalPhotosynthesisCoefficient / gobbler.length).toFixed(2),
			eatCount,
			reproductionCount,
			deathCount,
			intYoungestGen,
			intOldestGen,
		});
	}
	canvasView.render(function (context) {
		var lightLevel = ((environment.light())*255).toFixed(0);
		if(animateStyle) {
			context.fillStyle = 'rgba('+lightLevel+','+lightLevel+','+lightLevel+', .17)';
			context.fillRect(0, 0, canvasView.canvas.width, canvasView.canvas.height);
		} else {
			context.clearRect(0,0,canvasView.canvas.width,canvasView.canvas.height);
		}
		//lightLevel
		canvasView.canvas.style.background='rgb('+lightLevel+','+lightLevel+','+lightLevel+')';
		for (i=0; i < gobbler.length; i++) {
			context.fillStyle=gobbler[i].color();
			context.beginPath();
			context.arc(gobbler[i].x,gobbler[i].y,gobbler[i].radius(),0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
	});
}

document.body.appendChild(viewHolder);
run();
