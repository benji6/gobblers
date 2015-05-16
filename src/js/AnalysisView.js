const React = require('react');

module.exports = function () {
  const View = React.createClass({
    render: function () {
      return React.DOM.table(null, [
        React.DOM.thead(null, [
          React.DOM.th(null, "High-Level Analysis"),
          React.DOM.th(null, "Output"),
          React.DOM.th(null, "Gobbler Analysis"),
          React.DOM.th(null, "Output"),
        ]),
        React.DOM.tbody(null, [
          React.DOM.tr(null, [
            React.DOM.td(null, "Light Level"),
            React.DOM.td(null, this.props.lightLevel),
            React.DOM.td(null, "Average Energy"),
            React.DOM.td(null, this.props.averageEnergy),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Oxygen Level"),
            React.DOM.td(null, this.props.oxygenLevel),
            React.DOM.td(null, "Average Velocity Coefficient"),
            React.DOM.td(null, this.props.averageVelocityCoefficient),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Carbon Dioxide Level"),
            React.DOM.td(null, this.props.carbonDioxideLevel),
            React.DOM.td(null, "Average Attack Coefficient"),
            React.DOM.td(null, this.props.averageAttackCoefficient),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Total Energy"),
            React.DOM.td(null, this.props.totalEnergy),
            React.DOM.td(null, "Average Defence Coefficient"),
            React.DOM.td(null, this.props.averageDefenceCoefficient),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Number of Gobblers"),
            React.DOM.td(null, this.props.numberOfGobblers),
            React.DOM.td(null, "Average Photosynthesis Coefficient"),
            React.DOM.td(null, this.props.averagePhotosynthesisCoefficient),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Number of Eatings"),
            React.DOM.td(null, this.props.eatCount),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Reproduction Count"),
            React.DOM.td(null, this.props.reproductionCount),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Death Count"),
            React.DOM.td(null, this.props.deathCount),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Youngest Generation"),
            React.DOM.td(null, this.props.intYoungestGen),
          ]),
          React.DOM.tr(null, [
            React.DOM.td(null, "Oldest Generation"),
            React.DOM.td(null, this.props.intOldestGen),
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
