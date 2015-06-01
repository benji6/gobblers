const React = require('react');

module.exports = function () {
  var i = 0;
  const View = React.createClass({
    render: function () {
      const {
        deathCount,
        eatCount,
        intYoungestGen,
        intOldestGen,
        reproductionCount,
        totalEnergy,
        totalAttackCoefficient,
        totalDefenceCoefficient,
        totalGobblers,
        totalPhotosynthesisCoefficient,
        totalVelocityCoefficient,
      } = this.props.stats;

      const environment = this.props.environment;
      const lightLevel = this.props.environment.light().toFixed(2);
      const {
        carbonDioxideLevel,
        oxygenLevel,
      } = environment;

      return React.DOM.table(null, [
        React.DOM.thead({key: i++}, [
          React.DOM.th({key: i++}, "High-Level Analysis"),
          React.DOM.th({key: i++}, "Output"),
          React.DOM.th({key: i++}, "Gobbler Analysis"),
          React.DOM.th({key: i++}, "Output"),
        ]),
        React.DOM.tbody({key: i++}, [
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Light Level"),
            React.DOM.td({key: i++}, lightLevel),
            React.DOM.td({key: i++}, "Average Energy"),
            React.DOM.td({key: i++}, (totalEnergy / totalGobblers).toFixed(2)),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Oxygen Level"),
            React.DOM.td({key: i++}, oxygenLevel.toFixed(0)),
            React.DOM.td({key: i++}, "Average Velocity Coefficient"),
            React.DOM.td({key: i++}, (totalVelocityCoefficient / totalGobblers).toFixed(2)),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Carbon Dioxide Level"),
            React.DOM.td({key: i++}, carbonDioxideLevel.toFixed(0)),
            React.DOM.td({key: i++}, "Average Attack Coefficient"),
            React.DOM.td({key: i++}, (totalAttackCoefficient / totalGobblers).toFixed(2)),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Total Energy"),
            React.DOM.td({key: i++}, totalEnergy.toFixed(0)),
            React.DOM.td({key: i++}, "Average Defence Coefficient"),
            React.DOM.td({key: i++}, (totalDefenceCoefficient / totalGobblers).toFixed(2)),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Number of Gobblers"),
            React.DOM.td({key: i++}, totalGobblers),
            React.DOM.td({key: i++}, "Average Photosynthesis Coefficient"),
            React.DOM.td({key: i++}, (totalPhotosynthesisCoefficient / totalGobblers).toFixed(2)),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Number of Eatings"),
            React.DOM.td({key: i++}, eatCount),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Reproduction Count"),
            React.DOM.td({key: i++}, reproductionCount),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Death Count"),
            React.DOM.td({key: i++}, deathCount),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Youngest Generation"),
            React.DOM.td({key: i++}, intYoungestGen),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Oldest Generation"),
            React.DOM.td({key: i++}, intOldestGen),
          ]),
        ])
      ]);
    }
  });

  const ViewFactory = React.createFactory(View);
  const container = document.querySelector("#stats_container");

  return {
    container,
    render: function (params) {
      React.render(
        ViewFactory(params),
        container
      );
    }
  };
};
