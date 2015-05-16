const React = require('react');

module.exports = function () {
  const container = document.body.appendChild(document.createElement("div"));
  var i = 0;

  const View = React.createClass({
    render: function () {
      return React.DOM.div(null, [
        React.DOM.h1({key: i++}, "Gobblers Evolution Simulator"),
        React.DOM.h3({key: i++}, "About"),
        React.DOM.p({key: i++}, `Below is an evolution simulator.
      		The canvas is populated with objects called gobblers.
      		Gobblers require energy to survive and can get energy by photosynthesizing or eating other gobblers.
      		The environment has a light level and oxygen and carbon dioxide levels.
      		The gobblers have a number of parameters which influence their behaviour and which can mutate with each successive generation.`),
        React.DOM.h3({key: i++}, "Key"),
        React.DOM.p({key: i++}, "The environment light level is visualized by the background color of the canvas."),
        React.DOM.p({key: i++}, "The more red a gobbler is the more it leans towards attacking."),
        React.DOM.p({key: i++}, "The more blue a gobbler is the more it leans towards defence."),
        React.DOM.p({key: i++}, "The more green a gobbler is the more it leans towards photosynthesizing."),
      ]);
    }
  });

  const ViewFactory = React.createFactory(View);

  React.render(ViewFactory(), container);
};
