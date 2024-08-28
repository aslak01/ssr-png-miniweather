import type { Canvas } from 'canvas';
import { CanvasRenderingContext2D } from 'canvas';
import { formatDateString } from './utils';

export function drawTheCanvas(canvas: Canvas | HTMLCanvasElement) {
  if (!canvas) {
    throw new Error('No canvas provided');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('no CanvasRenderingContext2D');
  }
  if (!(ctx instanceof CanvasRenderingContext2D)) {
    throw new Error('Provided context is not a CanvasRenderingContext2D.');
  }

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  // Define margins
  const margin = 50;
  const graphWidth = width - 2 * margin;
  const graphHeight = height - 2 * margin;

  type TimeSeriesData = {
    date: string;
    value: number;
  };

  const timeSeries: TimeSeriesData[] = [
    { date: '2023-01-01', value: 1 },
    { date: '2023-01-02', value: 3 },
    { date: '2023-01-03', value: 2 },
    { date: '2023-01-04', value: 5 },
    { date: '2023-01-05', value: 7 },
    { date: '2023-01-06', value: 8 },
    { date: '2023-01-07', value: 6 },
    { date: '2023-01-08', value: 9 },
    { date: '2023-01-09', value: 10 },
    { date: '2023-01-10', value: 12 }
  ];

  // Parse dates and find the range
  const dates = timeSeries.map((item) => new Date(item.date));
  const minDate = Math.min(...dates.map((date) => date.getTime()));
  const maxDate = Math.max(...dates.map((date) => date.getTime()));

  // Define scaling factors
  const xScale = graphWidth / (maxDate - minDate);
  const yMax = Math.max(...timeSeries.map((item) => item.value));
  const yScale = graphHeight / yMax;

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw the line graph
  ctx.beginPath();
  ctx.moveTo(margin, height - margin - timeSeries[0].value * yScale);
  for (let i = 1; i < timeSeries.length; i++) {
    const x = margin + (new Date(timeSeries[i].date).getTime() - minDate) * xScale;
    const y = height - margin - timeSeries[i].value * yScale;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Optionally, draw points on the graph
  for (let i = 0; i < timeSeries.length; i++) {
    const x = margin + (new Date(timeSeries[i].date).getTime() - minDate) * xScale;
    const y = height - margin - timeSeries[i].value * yScale;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  // Optionally, add date labels on the x-axis
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = '12px Arial';
  for (let i = 0; i < timeSeries.length; i++) {
    const x = margin + (new Date(timeSeries[i].date).getTime() - minDate) * xScale;
    ctx.fillText(formatDateString(timeSeries[i].date), x, height - margin + 20);
  }

  return canvas;
}
