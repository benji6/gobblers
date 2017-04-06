/* global R */
import MovementStrategy from './MovementStrategy'
import plusOrMinus from './plusOrMinus'
import environment from './environment'
const {
  curry,
  forEach,
  sum,
  props,
} = R

const mutationCoefficientProperties = [
  'v', 'attackCoefficient', 'defenceCoefficient', 'photosynthesisCoefficient',
]

const evolutionPointProperties = [
  'attackCoefficient', 'defenceCoefficient', 'photosynthesisCoefficient',
]

const mutateProperty = curry((gobbler, propertyKey) => {
  const property = gobbler[propertyKey]
  const newProperty = property * (1 + (Math.random() - 0.5) * gobbler.mutationCoefficient)
  gobbler[propertyKey] = property < 0 ? 0.000001 : newProperty
})

const calculateChildCoords = function () {
  const separationDist = 4 * this.radius
  const {x, y} = this
  if (x <= separationDist) return {x: x + separationDist, y}
  if (x >= environment.sideLength - separationDist) return {x: x - separationDist, y}
  if (y <= separationDist) return {x, y: y + separationDist}
  if (y >= environment.sideLength - separationDist) return {x, y: y - separationDist}
  const childXSeparation = 2 * (Math.random() - 0.5) * separationDist
  return {
    x: x + childXSeparation,
    y: y + plusOrMinus(Math.pow(Math.pow(separationDist, 2) - Math.pow(childXSeparation, 2), 0.5)),
  }
}

export default class Gobbler {
  constructor ({
    energy,
    x,
    y,
    v,
    attackCoefficient,
    defenceCoefficient,
    photosynthesisCoefficient,
    generation,
    movementStrategy,
  }) {
    this.attackCoefficient = attackCoefficient
    this.defenceCoefficient = defenceCoefficient
    this.energy = energy
    this.generation = generation
    this.metabolism = 0.001
    this.movementStrategy = new MovementStrategy(this, movementStrategy)
    this.mutationCoefficient = 0.3
    this.photosynthesisCoefficient = photosynthesisCoefficient
    this.threshold = 12
    this.v = v
    this.x = x
    this.y = y
  }

  get radius () {
    return Math.sqrt(this.energy)
  }

  move (environment) {
    return this.movementStrategy.move(environment)
  }

  mutate () {
    forEach(mutateProperty(this), mutationCoefficientProperties)

    const currentEvolutionPoints = sum(props(evolutionPointProperties, this))
    const mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints

    currentEvolutionPoints > environment.maxEvolutionPoints &&
      forEach(property => this[property] *= mutationEnforcementRatio, evolutionPointProperties)

    this.movementStrategy = Math.random() < Math.pow(this.mutationCoefficient, 2)
      ? new MovementStrategy(this)
      : this.movementStrategy

    this.v = this.v > environment.maximumSpeed ? environment.maximumSpeed : this.v

    return this
  }

  photosynthesize (environment) {
    const energyProduced = this.photosynthesisCoefficient * this.radius * environment.light() *
      environment.carbonDioxideLevel / environment.initialGobblersCount / 1000
    this.energy += energyProduced
    environment.increaseAtmosphereOxygenComposition(energyProduced)
    return this
  }

  reproduce (stats, gobblers) {
    if (this.energy > this.threshold) {
      const childCoords = calculateChildCoords.call(this)
      stats.reproductionCount++
      this.generation++
      gobblers.push(new Gobbler({
        attackCoefficient: this.attackCoefficient,
        defenceCoefficient: this.defenceCoefficient,
        energy: this.energy / 2,
        generation: this.generation,
        movementStrategy: this.movementStrategy,
        photosynthesisCoefficient: this.photosynthesisCoefficient,
        v: this.v,
        x: childCoords.x,
        y: childCoords.y,
      }).mutate())
      this.energy = this.energy / 2
      if (stats.intYoungestGen < this.generation) {
        stats.intYoungestGen = this.generation
      }
    }
    return this
  }

  respire (environment) {
    const energyUsed = this.energy * this.metabolism
    this.energy -= energyUsed
    environment.increaseAtmosphereOxygenComposition(-energyUsed)
    return this
  }
}
