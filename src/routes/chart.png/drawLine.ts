import { isTruthy } from '$lib/utils';
import type { DataPoint, Dimensions, Styles } from './types';
import * as d3 from 'd3';

export const createLineGenerator = (
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return d3
    .line<DataPoint>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
};

export const drawLine = (
  context: CanvasRenderingContext2D,
  lineGenerator: d3.Line<DataPoint>,
  data: DataPoint[],
  style: Styles
) => {
  context.beginPath();
  lineGenerator.context(context)(data);
  context.lineWidth = style.lineWidth;
  context.strokeStyle = style.lineColor;
  context.stroke();
};
