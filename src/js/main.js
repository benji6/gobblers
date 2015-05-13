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
//view
//Text View
var viewHolder = document.createElement('div');
var controller = document.createElement('div');
var analysisDisplay = document.createElement('table');
var outputLightLevel = document.createElement('output');
var outputOxygenLevel = document.createElement('output');
var outputCO2Level = document.createElement('output');
var outputTotalEnergy = document.createElement('output');
var outputIntGobblers = document.createElement('output');
var outputEnergyPerGobbler = document.createElement('output');
var outputEatCount = document.createElement('output');
var outputReprCount = document.createElement('output');
var outputDeathCount = document.createElement('output');
var outputYoungestGen = document.createElement('output');
var outputOldestGen = document.createElement('output');
var outputAvgVel = document.createElement('output');
var outputAvgAtt = document.createElement('output');
var outputAvgDef = document.createElement('output');
var outputAvgPhot = document.createElement('output');

(function initView() {
	var curry = function(func) {
		var curried = function(args) {
			if (args.length >= func.length) {
				return func.apply(null, args);
			}
			return function() {
				return curried(args.concat(Array.prototype.slice.apply(arguments)));
			};
		};
		return curried(Array.prototype.slice.apply(arguments, [1]));
	};
	var addView = function(parentEl, childEl, txtNode) {
		var childElement = document.createElement(childEl);
		childElement.appendChild(document.createTextNode(txtNode));
		parentEl.appendChild(childElement);
	};
	var curryAddView = curry(addView);

	var addViewToVH = curryAddView(viewHolder);
	var addH2 = addViewToVH('h2');
	var addH3 = addViewToVH('h3');
	var addP = addViewToVH('P');
	var addDiv = addViewToVH('div');

	addH2('Gobblers Evolution Simulator');
	addH3('About');
	addP('Below is an evolution simulator. ' +
		'The canvas is populated with objects called gobblers. ' +
		'Gobblers require energy to survive and can get energy by photosynthesizing or eating other gobblers. ' +
		'The environment has a light level and oxygen and carbon dioxide levels. ' +
		'The gobblers have a number of parameters which influence their behaviour and which can mutate with each successive generation.');
	addH3('Key');
	addP('The environment light level is visualized by the background color of the canvas.');
	addP('The more red a gobbler is the more it leans towards attacking.');
	addP('The more blue a gobbler is the more it leans towards defence.');
	addP('The more green a gobbler is the more it leans towards photosynthesizing.');

	var thead = analysisDisplay.appendChild(document.createElement('thead'));
	var tr = thead.appendChild(document.createElement('tr'));
	var addToTr = curryAddView(tr);
	var addTh = addToTr('th');

	addTh('High-Level Analysis');
	addTh('Output');
	addTh('Gobbler Analysis');
	addTh('Output');

	var tbody = analysisDisplay.appendChild(document.createElement('tbody'));
	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	var addTd = addToTr('td');
	addTd('Light Level');
	tr.appendChild(outputLightLevel);
	addTd('Average Energy');
	tr.appendChild(outputEnergyPerGobbler);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Oxygen Level');
	tr.appendChild(outputOxygenLevel);
	addTd('Average Velocity Coefficient');
	tr.appendChild(outputAvgVel);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Carbon Dioxide Level');
	tr.appendChild(outputCO2Level);
	addTd('Average Attack Coefficient');
	tr.appendChild(outputAvgAtt);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Total Energy');
	tr.appendChild(outputTotalEnergy);
	addTd('Average Defence Coefficient');
	tr.appendChild(outputAvgDef);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Number of Gobblers');
	tr.appendChild(outputIntGobblers);
	addTd('Average Photosynthesis Coefficient');
	tr.appendChild(outputAvgPhot);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Number of Eatings');
	tr.appendChild(outputEatCount);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Reproduction Count');
	tr.appendChild(outputReprCount);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Death Count');
	tr.appendChild(outputDeathCount);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Youngest Generation');
	tr.appendChild(outputYoungestGen);

	tr = tbody.appendChild(document.createElement('tr'));
	addToTr = curryAddView(tr);
	addTd = addToTr('td');
	addTd('Oldest Generation');
	tr.appendChild(outputOldestGen);

	viewHolder.appendChild(controller);
	controller.appendChild(analysisDisplay);
}());

var animateStyle = false;
//analysis
var analysisOn = true;
//controller
var analysisSwitch = document.createElement('button');
var animateStyleSwitch = document.createElement('button');
analysisSwitch.onfocus = function () {
	if (this.blur) {
		this.blur();
	}
};
animateStyleSwitch.onfocus = function () {
	if (this.blur) {
		this.blur();
	}
};
analysisSwitch.innerHTML = 'Analysis Switch';
analysisSwitch.onclick = function () {
	analysisOn = !analysisOn;
	if (analysisOn) {
		analysisDisplay.style.display = '';
	} else {
		analysisDisplay.style.display = 'none';
	}
};

animateStyleSwitch.innerHTML = 'Animation Blur Effect';
animateStyleSwitch.onclick = function() {
	animateStyle = !animateStyle;
};
controller.appendChild(analysisSwitch);
controller.appendChild(animateStyleSwitch);

//view
//canvas

var canvas = document.createElement('canvas');
canvas.width = intStartingGobblers * 2;
canvas.height = canvas.width;
var context = canvas.getContext('2d');
viewHolder.appendChild(canvas);
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

//model
//init
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
	Gobbler.prototype.metabolism = .001;
	Gobbler.prototype.threshold = 12;
	Gobbler.prototype.mutationCoefficient = .5;
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
			if (this.x>=canvas.width-this.radius()-dblVel/2) {
				this.x-=Math.random()/2*dblVel;
			} else {
				this.x+=(Math.random()-.5)*dblVel;
			}
		}
		//y movement rules
		if (this.y<=this.radius()+dblVel) {
			this.y+=Math.random()/2*dblVel;
		} else {
			if (this.y>=canvas.height-this.radius()-dblVel/2) {
				this.y-=Math.random()/2*dblVel;
			}
			else {
				this.y+=(Math.random()-.5)*dblVel;
			}
		}
		//reduce energy
		var energyUsed = this.energy * dblVel / canvas.width / 8;
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
			var xDisplacement = (Math.random()-.5) * 2 * displacementRadius;
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
			prop += prop * (Math.random()-.5) * obj.mutationCoefficient;
			if (prop < 0) {
				prop = .000001;
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
		if (this.energy < .1) {
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
			attackCoefficient: .5,
			defenceCoefficient: .5,
			generation: 0,
			photosynthesisCoefficient: 1
		};
		gobbler[i] = new Gobbler(gobblerParams);
		//initial position (dependent on radius method of object)
		gobbler[i].x = Math.random()*(canvas.width-2*gobbler[i].radius())+gobbler[i].radius();
		gobbler[i].y = Math.random()*(canvas.height-2*gobbler[i].radius())+gobbler[i].radius();
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
	}
	for (i=0; i < gobbler.length; i++) {
		gobbler[i].move();
	}
	for (i=0; i < gobbler.length; i++) {
		gobbler[i].eat();
	}
	for (i=0; i < gobbler.length; i++) {
		gobbler[i].reproduce();
	}
	for (i=0; i < gobbler.length; i++) {
		//analysis
		if (analysisOn) {
			totalEnergy += gobbler[i].energy;
			if (intOldestGen > gobbler[i].generation) {
				intOldestGen = gobbler[i].generation;
			}
			totalVelocityCoefficient += gobbler[i].v;

		}
		//required for color()
		totalAttackCoefficient += gobbler[i].attackCoefficient;
		totalDefenceCoefficient += gobbler[i].defenceCoefficient;
		totalPhotosynthesisCoefficient += gobbler[i].photosynthesisCoefficient;
		//die
		gobbler[i].die();
	}
	if (analysisOn) {
		outputLightLevel.innerHTML = environment.light().toFixed(2);
		outputOxygenLevel.innerHTML = environment.oxygenLevel.toFixed(0);
		outputCO2Level.innerHTML = environment.carbonDioxideLevel.toFixed(0);
		outputTotalEnergy.innerHTML = totalEnergy.toFixed(0);
		outputIntGobblers.innerHTML = gobbler.length;
		outputEnergyPerGobbler.innerHTML = (totalEnergy/gobbler.length).toFixed(2);
		outputEatCount.innerHTML = eatCount;
		outputReprCount.innerHTML = reproductionCount;
		outputDeathCount.innerHTML = deathCount;
		outputYoungestGen.innerHTML = intYoungestGen;
		outputOldestGen.innerHTML = intOldestGen;
		outputAvgVel.innerHTML = (totalVelocityCoefficient / gobbler.length).toFixed(2);
		outputAvgAtt.innerHTML = (totalAttackCoefficient / gobbler.length).toFixed(2);
		outputAvgDef.innerHTML = (totalDefenceCoefficient / gobbler.length).toFixed(2);
		outputAvgPhot.innerHTML = (totalPhotosynthesisCoefficient / gobbler.length).toFixed(2);
	}
	draw();
}
function draw() {
	var lightLevel = ((environment.light())*255).toFixed(0);
	//clear canvas
	if(animateStyle) {
		context.fillStyle = 'rgba('+lightLevel+','+lightLevel+','+lightLevel+', .17)';
		context.fillRect(0, 0, canvas.width, canvas.height);
	} else {
		context.clearRect(0,0,canvas.width,canvas.height);
	}
	//lightLevel
	canvas.style.background='rgb('+lightLevel+','+lightLevel+','+lightLevel+')';
	//draw gobblers
	for (i=0; i < gobbler.length; i++) {
		context.fillStyle=gobbler[i].color();
		context.beginPath();
		context.arc(gobbler[i].x,gobbler[i].y,gobbler[i].radius(),0,Math.PI*2,true);
		context.closePath();
		context.fill();
	}
}

document.body.appendChild(viewHolder);
run();
