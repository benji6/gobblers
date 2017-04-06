/* global React */
const capitalizeFirst = str => str[0].toUpperCase() + str.slice(1)

export default () => {
  const View = React.createClass({
    render () {
      const {
        deathCount,
        eatCount,
        intYoungestGen,
        intOldestGen,
        movementStrategies,
        reproductionCount,
        totalEnergy,
        totalAttackCoefficient,
        totalDefenceCoefficient,
        totalGobblers,
        totalPhotosynthesisCoefficient,
        totalVelocityCoefficient,
      } = this.props.stats

      const environment = this.props.environment
      const lightLevel = this.props.environment.light().toFixed(2)
      const {
        carbonDioxideLevel,
        oxygenLevel,
      } = environment

      return <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <table className="table-condensed">
              <thead>
                <tr>
                  <th>Environment Analysis</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Light Level</td>
                  <td>{lightLevel}</td>
                </tr>
                <tr>
                  <td>Oxygen Level</td>
                  <td>{oxygenLevel.toFixed(0)}</td>
                </tr>
                <tr>
                  <td>Carbon Dioxide Level</td>
                  <td>{carbonDioxideLevel.toFixed(0)}</td>
                </tr>
                <tr>
                  <td>Seconds Elapsed</td>
                  <td>{this.props.secondsElapsed}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm-3">
            <table className="table-condensed">
              <thead>
                <tr>
                  <th>High-Level Analysis</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Number of Gobblers</td>
                  <td>{totalGobblers}</td>
                </tr>
                <tr>
                  <td>Total Energy</td>
                  <td>{totalEnergy.toFixed(0)}</td>
                </tr>
                <tr>
                  <td>Number of Eatings</td>
                  <td>{eatCount}</td>
                </tr>
                <tr>
                  <td>Starvation Count</td>
                  <td>{eatCount - deathCount}</td>
                </tr>
                <tr>
                  <td>Death Count</td>
                  <td>{deathCount}</td>
                </tr>
                <tr>
                  <td>Reproduction Count</td>
                  <td>{reproductionCount}</td>
                </tr>
                <tr>
                  <td>Youngest Generation</td>
                  <td>{intYoungestGen}</td>
                </tr>
                <tr>
                  <td>Oldest Generation</td>
                  <td>{intOldestGen}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm-3">
            <table className="table-condensed">
              <thead>
                <tr>
                  <th>Gobbler Analysis</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average Energy</td>
                  <td>{(totalEnergy / totalGobblers).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average Velocity Coefficient</td>
                  <td>{(totalVelocityCoefficient / totalGobblers).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average Attack Coefficient</td>
                  <td>{(totalAttackCoefficient / totalGobblers).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average Defence Coefficient</td>
                  <td>{(totalDefenceCoefficient / totalGobblers).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average Photosynthesis Coefficient</td>
                  <td>{(totalPhotosynthesisCoefficient / totalGobblers).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm-3">
            <table className="table-condensed">
              <thead>
                <tr>
                  <th>Movement Strategy</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(movementStrategies).sort().map(strategyName => <tr>
                    <td>{capitalizeFirst(strategyName)}</td>
                    <td>{`${(movementStrategies[strategyName] / totalGobblers * 100).toFixed(0)}%`}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    },
  })

  const ViewFactory = React.createFactory(View)
  const container = document.querySelector('#stats_container')

  return {
    render (params) {
      React.render(
        ViewFactory(params),
        container
      )
    },
  }
}
