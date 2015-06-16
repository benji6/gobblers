"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),_plusOrMinus=require("./plusOrMinus"),_plusOrMinus2=_interopRequireDefault(_plusOrMinus),movementAlgorithmNames=["edge","immobile","random","straightLines","wander"],MovementStrategy=function(){function e(t,i){_classCallCheck(this,e),this.currentDirection=null,this.phi=null,this.gobbler=t,this.movementAlgorithmName=i&&i.movementAlgorithmName||movementAlgorithmNames[Math.floor(Math.random()*movementAlgorithmNames.length)]}return _createClass(e,[{key:"calculateEffectsOnEnergyAndAtmosphere",value:function(e,t){var i=t/e.sideLength;return this.gobbler.energy-=i,e.increaseAtmosphereOxygenComposition(-i),this.gobbler}},{key:"edge",value:function(e){var t=this,i=this.gobbler,r=i.radius,n=i.x,s=i.y,h=this.maxSpeed,o=Math.random()*h,a=r+h;return R.minBy(function(e){return e.dist},[{dist:n,fn:function(){return t.gobbler.x+=a>=n?0:-o}},{dist:e.sideLength-n,fn:function(){return t.gobbler.x+=n>=e.sideLength-a?0:o}},{dist:s,fn:function(){return t.gobbler.y+=a>=s?0:-o}},{dist:e.sideLength-s,fn:function(){return t.gobbler.y+=s>=e.sideLength-a?0:o}}]).fn(),this.calculateEffectsOnEnergyAndAtmosphere(e,o)}},{key:"move",value:function(e){return this[this.movementAlgorithmName](e)}},{key:"immobile",value:function(){return this.gobbler}},{key:"random",value:function(e){var t=this.maxSpeed,i=this.gobbler,r=i.radius,n=i.x,s=i.y,h=Math.random()*t,o=Math.random()*h,a=Math.pow(Math.pow(h,2)-Math.pow(o,2),.5);return this.gobbler.x+=r+t>=n?o:n>=e.sideLength-r-t?-o:_plusOrMinus2["default"](o),r+t>=s?this.gobbler.y+=a:s>=e.sideLength-r-t?this.gobbler.y-=a:this.gobbler.y+=_plusOrMinus2["default"](a),this.calculateEffectsOnEnergyAndAtmosphere(e,h)}},{key:"straightLines",value:function(e){var t=this.maxSpeed,i=this.gobbler,r=i.radius,n=i.x,s=i.y,h=Math.random()*t,o=r+t;if(null===this.currentDirection&&(this.currentDirection={x:Math.floor(3*Math.random())-1,y:Math.floor(3*Math.random())-1}),this.currentDirection.y&&(s+o>=e.sideLength?this.currentDirection.y=-1:o>=s&&(this.currentDirection.y=1)),this.currentDirection.x&&(n+o>=e.sideLength?this.currentDirection.x=-1:o>=n&&(this.currentDirection.x=1)),this.currentDirection.x&&this.currentDirection.y){var a=Math.pow(h,.5)/2;this.gobbler.x+=a*this.currentDirection.x,this.gobbler.y+=a*this.currentDirection.y}else this.gobbler.x+=h*this.currentDirection.x,this.gobbler.y+=h*this.currentDirection.y;return this.calculateEffectsOnEnergyAndAtmosphere(e,h)}},{key:"wander",value:function(e){var t=this.maxSpeed,i=this.gobbler,r=i.radius,n=i.x,s=i.y,h=Math.random()*t,o=.1;return null===this.phi&&(this.phi=2*Math.PI*Math.random()),n>=e.sideLength-r-t?Math.cos(this.phi)>0&&(this.phi=Math.PI-this.phi):r+t>=n?Math.cos(this.phi)<0&&(this.phi=Math.PI-this.phi):s>=e.sideLength-r-t?Math.sin(this.phi)>0&&(this.phi=-this.phi):r+t>=s?Math.sin(this.phi)<0&&(this.phi=-this.phi):this.phi+=_plusOrMinus2["default"](o),this.gobbler.x+=h*Math.cos(this.phi),this.gobbler.y+=h*Math.sin(this.phi),this.calculateEffectsOnEnergyAndAtmosphere(e,h)}},{key:"maxSpeed",get:function(){var e=this.gobbler,t=e.v,i=e.energy;return t*i/2}}]),e}();exports["default"]=MovementStrategy,module.exports=exports["default"];