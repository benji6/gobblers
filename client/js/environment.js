import './canvasView'

const {innerHeight, innerWidth} = window
const sideLength = innerHeight > innerWidth ? innerWidth : innerHeight
const initialGobblersCount = sideLength
const initialGobblerEnergy = 6

const oxygenLevel = initialGobblersCount * initialGobblerEnergy
const carbonDioxideLevel = oxygenLevel

export default {
  carbonDioxideLevel,
  increaseAtmosphereOxygenComposition (amount) {
    this.oxygenLevel += amount
    this.carbonDioxideLevel -= amount
  },
  initialGobblerEnergy,
  initialGobblersCount,
  light: () => (Math.sin(Date.now() / 10000) + 1) / 2,
  maxEvolutionPoints: 8,
  maximumSpeed: 3,
  oxygenLevel,
  sideLength,
}
