const React = require('react');

module.exports = function () {
  const container = document.body.appendChild(document.createElement("div"));

  const View = React.createClass({
    render: function () {
      return React.DOM.div(null, [
        React.DOM.h2(null, "Gobblers Evolution Simulator"),
        React.DOM.h3(null, "About"),
        React.DOM.p(null, `Below is an evolution simulator.
      		The canvas is populated with objects called gobblers.
      		Gobblers require energy to survive and can get energy by photosynthesizing or eating other gobblers.
      		The environment has a light level and oxygen and carbon dioxide levels.
      		The gobblers have a number of parameters which influence their behaviour and which can mutate with each successive generation.`),
        React.DOM.h3(null, "Key"),
        React.DOM.p(null, "The environment light level is visualized by the background color of the canvas."),
        React.DOM.p(null, "The more red a gobbler is the more it leans towards attacking."),
        React.DOM.p(null, "The more blue a gobbler is the more it leans towards defence."),
        React.DOM.p(null, "The more green a gobbler is the more it leans towards photosynthesizing."),
      ]);
    }
  });

  const ViewFactory = React.createFactory(View);

  React.render(ViewFactory(), container);
};
