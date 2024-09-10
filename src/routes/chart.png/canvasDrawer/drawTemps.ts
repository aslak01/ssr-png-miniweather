import { type CanvasRenderingContext2D } from 'canvas';
import { isTruthy } from '$lib/utils';
import type { Dimensions, Styles, YrTSData, DataPoint } from '../data';
import * as d3 from 'd3';

const createScales = (data: DataPoint[], dimensions: Dimensions) => {
  const extent = d3.extent(data, (d) => d.date).filter(isTruthy);
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

export function drawTemps(
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles
) {
  const temps = data.map((d) => ({ ...d, value: d.temp }));
  const { xScale, yScale } = createScales(temps, dimensions);

  const lineGenerator = createLineGenerator(xScale, yScale);

  drawLine(context, lineGenerator, temps, style);
}

const createLineGenerator = (
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return d3
    .line<DataPoint>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
};

const drawLine = (
  context: CanvasRenderingContext2D,
  lineGenerator: d3.Line<DataPoint>,
  data: DataPoint[],
  style: Styles
) => {
  context.beginPath();
  // @ts-expect-error d3 doesn't expect context to be of node-canvas variant
  lineGenerator.context(context)(data);
  context.lineWidth = style.lineWidth;
  context.strokeStyle = style.lineColor;
  context.stroke();
};
