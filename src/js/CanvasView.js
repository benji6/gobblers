module.exports = function () {
  const centerDiv = document.createElement("div");
  centerDiv.className = "center";
  document.body.appendChild(centerDiv);
  const canvas = centerDiv.appendChild(document.createElement('canvas'));
  canvas.width = 512;
  canvas.height = canvas.width;
  var context = canvas.getContext('2d');

  return {
    canvas,
    render: function (fn) {
      fn(context);
    }
  };
};
