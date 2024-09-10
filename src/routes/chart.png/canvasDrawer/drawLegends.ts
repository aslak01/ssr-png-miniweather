// const drawAxes = (context: CanvasRenderingContext2D, dimensions: Dimensions, style: Styles) => {
//   context.beginPath();
//   context.moveTo(dimensions.left, dimensions.top);
//   context.lineTo(dimensions.left, dimensions.height - dimensions.bottom);
//   context.lineTo(dimensions.width - dimensions.right, dimensions.height - dimensions.bottom);
//   context.lineWidth = style.axisWidth;
//   context.strokeStyle = style.axisColor;
//   context.stroke();
// };
//
// const addLabels = (context: CanvasRenderingContext2D, dimensions: Dimensions, style: Styles) => {
//   context.font = style.labelFont;
//   context.fillStyle = style.labelColor;
//   context.fillText('Date', dimensions.width / 2, dimensions.height - 5);
//   context.save();
//   context.translate(15, dimensions.height / 2);
//   context.rotate(-Math.PI / 2);
//   context.fillText('Value', 0, 0);
//   context.restore();
// };
