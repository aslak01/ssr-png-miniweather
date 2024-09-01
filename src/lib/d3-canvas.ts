import type { Canvas } from 'canvas';
import d3 from 'd3';

function drawD3Canvas(canvas: HTMLCanvasElement | Canvas.Canvas) {
  const timeSeries = [
    { date: '2024-01-01', value: 30 },
    { date: '2024-01-02', value: 80 },
    { date: '2024-01-03', value: 45 },
    { date: '2024-01-04', value: 60 },
    { date: '2024-01-05', value: 20 },
    { date: '2024-01-06', value: 90 },
    { date: '2024-01-07', value: 55 }
  ];

  const ctx = canvas.getContext('2d');

  // Set margins and dimensions
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = canvas.width - margin.left - margin.right;
  const height = canvas.height - margin.top - margin.bottom;

  // Parse dates using D3
  const parseDate = d3.timeParse('%Y-%m-%d');
  timeSeries.forEach((d) => (d.date = parseDate(d.date)));

  // Define scales using D3
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(timeSeries, (d) => d.date))
    .range([margin.left, width + margin.left]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(timeSeries, (d) => d.value)])
    .range([height + margin.top, margin.top]);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw axes
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

  // Y Axis
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, height + margin.top);

  // X Axis
  ctx.moveTo(margin.left, height + margin.top);
  ctx.lineTo(width + margin.left, height + margin.top);
  ctx.stroke();

  // Draw grid lines and labels using D3
  const xAxis = d3.axisBottom(xScale).ticks(5);
  const yAxis = d3.axisLeft(yScale).ticks(5);

  // Render the axes manually on canvas
  function drawAxis(axis, context, translation, orientation = 'bottom') {
    axis(context);
    context.save();
    context.translate(...translation);
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = orientation === 'bottom' ? 'top' : 'middle';
    axis(context);
    context.restore();
  }

  // Function to render axis to canvas
  function renderAxisToCanvas(axis, ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    axis(ctx);
    ctx.restore();
  }

  // Use d3 to draw axes
  const canvasAxis = d3.axisBottom(xScale);
  canvasAxis(ctx);
  renderAxisToCanvas(canvasAxis, ctx, margin.left, height + margin.top);

  // Draw the line using D3 line generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .context(ctx);

  // Draw the line on the canvas
  ctx.beginPath();
  lineGenerator(timeSeries);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}
