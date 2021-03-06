import environment from './environment'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const calculateColor = (totalGobblers, totalAttackCoefficient, totalDefenceCoefficient, totalPhotosynthesisCoefficient, {
  attackCoefficient, defenceCoefficient, photosynthesisCoefficient,
}) => `rgb(${(attackCoefficient / totalAttackCoefficient * totalGobblers * 127).toFixed(0)},
    ${(defenceCoefficient / totalDefenceCoefficient * totalGobblers * 127).toFixed(0)},
    ${(photosynthesisCoefficient / totalPhotosynthesisCoefficient * totalGobblers * 127).toFixed(0)})`

canvas.height = canvas.width = environment.sideLength

canvas.onclick = () => {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen()
  } else if (canvas.mozRequestFullScreen) {
    canvas.mozRequestFullScreen()
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen()
  }
}

export default {
  render: ({gobblers, lightLevel, totalAttackCoefficient, totalDefenceCoefficient, totalPhotosynthesisCoefficient}) => {
    context.fillStyle = `rgb(${lightLevel}, ${lightLevel}, ${lightLevel})`
    context.fillRect(0, 0, canvas.width, canvas.height)
    for (const gobbler of gobblers) {
      context.fillStyle = calculateColor(gobblers.length, totalAttackCoefficient, totalDefenceCoefficient, totalPhotosynthesisCoefficient, gobbler)
      context.beginPath()
      context.arc(gobbler.x, gobbler.y, gobbler.radius, 0, 2 * Math.PI, true)
      context.closePath()
      context.fill()
    }
  },
}
