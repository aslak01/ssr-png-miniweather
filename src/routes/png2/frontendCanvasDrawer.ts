const createScales = (data, dimensions) => {
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([dimensions.left, dimensions.width - dimensions.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([dimensions.height - dimensions.bottom, dimensions.top]);
  return { xScale, yScale };
};

const createLineGenerator = (xScale, yScale) => {
  return d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .context(context);
};

const drawLine = (context, lineGenerator, data, style) => {
  context.beginPath();
  lineGenerator(data);
  context.lineWidth = style.lineWidth;
  context.strokeStyle = style.lineColor;
  context.stroke();
};

const drawAxes = (context, dimensions, style) => {
  context.beginPath();
  context.moveTo(dimensions.left, dimensions.top);
  context.lineTo(dimensions.left, dimensions.height - dimensions.bottom);
  context.lineTo(dimensions.width - dimensions.right, dimensions.height - dimensions.bottom);
  context.lineWidth = style.axisWidth;
  context.strokeStyle = style.axisColor;
  context.stroke();
};

const addLabels = (context, dimensions, style) => {
  context.font = style.labelFont;
  context.fillStyle = style.labelColor;
  context.fillText('Date', dimensions.width / 2, dimensions.height - 5);
  context.save();
  context.translate(15, dimensions.height / 2);
  context.rotate(-Math.PI / 2);
  context.fillText('Value', 0, 0);
  context.restore();
};

const createChart = (data, dimensions, style) => {
  const canvas = document.getElementById('chartCanvas');
  const context = canvas.getContext('2d');
  const { xScale, yScale } = createScales(data, dimensions);
  const lineGenerator = createLineGenerator(xScale, yScale);
  drawLine(context, lineGenerator, data, style);
  drawAxes(context, dimensions, style);
  addLabels(context, dimensions, style);
};

// Sample data
const data = [
  { date: new Date('2023-01-01'), value: 10 },
  { date: new Date('2023-02-01'), value: 20 },
  { date: new Date('2023-03-01'), value: 15 },
  { date: new Date('2023-04-01'), value: 25 },
  { date: new Date('2023-05-01'), value: 30 }
];

const dimensions = {
  width: 800,
  height: 400,
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
};

const style = {
  lineColor: 'blue',
  lineWidth: 2,
  axisColor: 'black',
  axisWidth: 1,
  labelColor: 'black',
  labelFont: '12px Arial'
};
