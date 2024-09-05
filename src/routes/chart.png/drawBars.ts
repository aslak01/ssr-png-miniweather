import { isTruthy } from '$lib/utils';
import type { DataPoint, Dimensions, Styles } from './types';
import * as d3 from 'd3';

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
  data.forEach((d) => {
    const x = xScale(d.date);
    const y = yScale(d.value);
    context.fillRect(x - barWidth / 2, y, barWidth, dimensions.height - dimensions.bottom - y);
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
};

export { addBarsToChart };
