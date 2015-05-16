const React = require('react');

module.exports = function () {
  var i = 0;
  const View = React.createClass({
    render: function () {
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
            React.DOM.td({key: i++}, this.props.lightLevel),
            React.DOM.td({key: i++}, "Average Energy"),
            React.DOM.td({key: i++}, this.props.averageEnergy),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Oxygen Level"),
            React.DOM.td({key: i++}, this.props.oxygenLevel),
            React.DOM.td({key: i++}, "Average Velocity Coefficient"),
            React.DOM.td({key: i++}, this.props.averageVelocityCoefficient),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Carbon Dioxide Level"),
            React.DOM.td({key: i++}, this.props.carbonDioxideLevel),
            React.DOM.td({key: i++}, "Average Attack Coefficient"),
            React.DOM.td({key: i++}, this.props.averageAttackCoefficient),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Total Energy"),
            React.DOM.td({key: i++}, this.props.totalEnergy),
            React.DOM.td({key: i++}, "Average Defence Coefficient"),
            React.DOM.td({key: i++}, this.props.averageDefenceCoefficient),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Number of Gobblers"),
            React.DOM.td({key: i++}, this.props.numberOfGobblers),
            React.DOM.td({key: i++}, "Average Photosynthesis Coefficient"),
            React.DOM.td({key: i++}, this.props.averagePhotosynthesisCoefficient),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Number of Eatings"),
            React.DOM.td({key: i++}, this.props.eatCount),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Reproduction Count"),
            React.DOM.td({key: i++}, this.props.reproductionCount),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Death Count"),
            React.DOM.td({key: i++}, this.props.deathCount),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Youngest Generation"),
            React.DOM.td({key: i++}, this.props.intYoungestGen),
          ]),
          React.DOM.tr({key: i++}, [
            React.DOM.td({key: i++}, "Oldest Generation"),
            React.DOM.td({key: i++}, this.props.intOldestGen),
          ]),
        ])
      ]);
    }
  });

  const ViewFactory = React.createFactory(View);
  const container = document.body.appendChild(document.createElement("div"));

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
