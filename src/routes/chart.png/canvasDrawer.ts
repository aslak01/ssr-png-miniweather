import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
import * as d3 from 'd3';
import { writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import type { Dimensions, Styles, YrData } from './data';
import type { DataPoint } from './types';
import { isTruthy } from '$lib/utils';
import { createLineGenerator, drawLine } from './drawLine';
import { addBarsToChart } from './drawBars';

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

const drawAxes = (context: CanvasRenderingContext2D, dimensions: Dimensions, style: Styles) => {
  context.beginPath();
  context.moveTo(dimensions.left, dimensions.top);
  context.lineTo(dimensions.left, dimensions.height - dimensions.bottom);
  context.lineTo(dimensions.width - dimensions.right, dimensions.height - dimensions.bottom);
  context.lineWidth = style.axisWidth;
  context.strokeStyle = style.axisColor;
  context.stroke();
};

const addLabels = (context: CanvasRenderingContext2D, dimensions: Dimensions, style: Styles) => {
  context.font = style.labelFont;
  context.fillStyle = style.labelColor;
  context.fillText('Date', dimensions.width / 2, dimensions.height - 5);
  context.save();
  context.translate(15, dimensions.height / 2);
  context.rotate(-Math.PI / 2);
  context.fillText('Value', 0, 0);
  context.restore();
};

const createChart = (data: YrData, dimensions: Dimensions, style: Styles): Canvas => {
  const canvas = createCanvas(dimensions.width, dimensions.height);
  const context = canvas.getContext('2d');

  const { temps, rain } = data;
  console.log(temps, rain);

  drawTemps(temps, context, dimensions, style);
  drawRain(rain, context, dimensions, style);

  return canvas;
};

function drawRain(
  data: DataPoint[],
  context: CanvasRenderingContext2D,
  dimensions: Dimensions,
  style: Styles
) {
  addBarsToChart(context, data, dimensions, style);
}
function drawTemps(
  data: DataPoint[],
  context: CanvasRenderingContext2D,
  dimensions: Dimensions,
  style: Styles
) {
  const { xScale, yScale } = createScales(data, dimensions);
  const lineGenerator = createLineGenerator(xScale, yScale);

  drawLine(context, lineGenerator, data, style);
  drawAxes(context, dimensions, style);
  addLabels(context, dimensions, style);
}

const createChartBuffer = (data: DataPoint[], dimensions: Dimensions, style: Styles): Buffer => {
  const chart = createChart(data, dimensions, style);
  return chart.toBuffer('image/png');
};

const saveBufferToPng = async (buffer: Buffer, filePath: string): Promise<void> => {
  try {
    await writeFile(filePath, buffer);
    console.log(`PNG file saved successfully to ${filePath}`);
  } catch (error) {
    console.error('Error saving PNG file:', error);
  }
};

const createAndSaveChart = (
  data: DataPoint[],
  dimensions: Dimensions,
  style: Styles,
  outputPath: string
) => {
  const chart = createChart(data, dimensions, style);
  const out = createWriteStream(outputPath);
  const stream = chart.createPNGStream();
  stream.pipe(out);
  return new Promise((resolve, reject) => {
    out.on('finish', resolve);
    out.on('error', reject);
  });
};

export { createChartBuffer, saveBufferToPng };
