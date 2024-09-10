import { type CanvasRenderingContext2D } from 'canvas';
import { isTruthy } from '$lib/utils';
import type { YrTSData } from '../data';
import type { DataPoint, Dimensions, Styles } from '../types';
import * as d3 from 'd3';

export function drawRain(
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles
) {
  const rain = data.map((d) => ({ ...d, value: d.rain }));
  addBarsToChart(context, rain, dimensions, style);
}

const createBarScales = (data: DataPoint[], dimensions: Dimensions) => {
  const extent = d3.extent(data, (d) => d.date).filter((d): d is Date => d !== undefined);
  const max = d3.max(data, (d) => d.value) || 0;
  const xScale = d3
    .scaleTime()
    .domain(extent)
    .range([dimensions.left, dimensions.width - dimensions.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, max])
    .range([dimensions.height - dimensions.bottom, dimensions.top]);
  return { xScale, yScale };
};

const drawBars = (
  context: CanvasRenderingContext2D,
  data: DataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  dimensions: Dimensions,
  style: Styles
) => {
  const barWidth =
    style.barWidth ||
    Math.max(1, (dimensions.width - dimensions.left - dimensions.right) / data.length - 1);

  context.fillStyle = style.barColor;
  data
    .filter((d) => d.value > 0)
    .forEach((d) => {
      const x = xScale(d.date);
      const y = yScale(d.value);
      context.fillRect(x - barWidth / 2, y, barWidth, dimensions.height - dimensions.bottom - y);
    });
};

const drawAxisTicks = (
  context: CanvasRenderingContext2D,
  yScale: d3.ScaleLinear<number, number>,
  dimensions: Dimensions,
  style: Styles
) => {
  const yTicks = yScale.ticks(5);

  context.beginPath();
  context.strokeStyle = style.tickColor;
  context.lineWidth = style.tickWidth;
  context.font = style.tickLabelFont;
  context.fillStyle = style.tickLabelColor;

  context.textAlign = 'right';
  context.textBaseline = 'middle';
  yTicks.forEach((tick) => {
    const y = yScale(tick);
    context.moveTo(dimensions.left - style.tickLength, y);
    context.lineTo(dimensions.left, y);
    context.stroke();
    context.fillText(tick.toString(), dimensions.left - style.tickLength - 2, y);
  });
};

const addBarsToChart = (
  context: CanvasRenderingContext2D,
  data: DataPoint[],
  dimensions: Dimensions,
  style: Styles
) => {
  const { xScale, yScale } = createBarScales(data, dimensions);
  drawBars(context, data, xScale, yScale, dimensions, style);
  drawAxisTicks(context, yScale, dimensions, style);
};

export { addBarsToChart };
