import { type CanvasRenderingContext2D } from 'canvas';
import { formatDateLegend, formatDateString, isTruthy } from '$lib/utils';
import type { Dimensions, Styles, YrTSData } from '../data';
import * as d3 from 'd3';

function getXScale(data: YrTSData[], dimensions: Dimensions) {
  const extent = d3.extent(data, (d) => d.date).filter(isTruthy);
  return d3
    .scaleTime()
    .domain(extent)
    .range([dimensions.left, dimensions.width - dimensions.right]);
}

export const drawTimeMarkerLines = (
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles
) => {
  const xScale = getXScale(data, dimensions);
  const drawLine = (date: Date, isStrong: boolean) => {
    const lineX = xScale(date);
    context.beginPath();
    context.moveTo(lineX, dimensions.top);
    context.lineTo(lineX, dimensions.height - dimensions.bottom);
    context.strokeStyle = isStrong ? style.strongLineColor : style.weakLineColor;
    context.lineWidth = isStrong ? style.strongLineWidth : style.weakLineWidth;
    context.stroke();
  };

  const startDate = data[0].date;
  const endDate = data[data.length - 1].date;

  // Generate time markers for the entire day containing the data
  const dayStart = new Date(startDate);
  dayStart.setHours(0, 0, 0, 0);
  const markers = [0, 6, 12, 18].map((hour) => {
    const date = new Date(dayStart);
    date.setHours(hour);
    return date;
  });

  // Draw markers that fall within the data range
  markers.forEach((date) => {
    if (date >= startDate && date <= endDate) {
      const hour = date.getHours();
      drawLine(date, hour === 0 || hour === 12);
    }
  });
};

export const drawTimeTicks = (
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles
) => {
  const xScale = getXScale(data, dimensions);
  const xTicks = xScale.ticks(5);

  context.beginPath();
  context.strokeStyle = style.tickColor;
  context.lineWidth = style.tickWidth;
  context.font = style.tickLabelFont;
  context.fillStyle = style.tickLabelColor;
  context.textAlign = 'center';
  context.textBaseline = 'top';

  xTicks.forEach((tick) => {
    const x = xScale(tick);
    context.moveTo(x, dimensions.height - dimensions.bottom);
    context.lineTo(x, dimensions.height - dimensions.bottom + style.tickLength);
    context.stroke();
    context.fillText(
      String(formatDateLegend(tick)),
      x,
      dimensions.height - dimensions.bottom + style.tickLength + 2
    );
  });
};
