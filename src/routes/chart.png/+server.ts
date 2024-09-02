import { createChartBuffer, saveBufferToPng } from './canvasDrawer';
import { writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import type { RequestHandler } from '@sveltejs/kit';
import { Canvas } from 'canvas';
import { data, dimensions, style, yrTimeseries } from './data';

const main = async () => {
  try {
    const buffer = createChartBuffer(data, dimensions, style);
    return buffer;
  } catch (error) {
    console.error('Error creating chart:', error);
  }
};

export const GET: RequestHandler = async ({ fetch }) => {
  const drawing = await main();
  if (!drawing) {
    throw new Error('no canvas');
  }
  const tsData = await yrTimeseries();
  console.log(tsData);
  console.log(drawing);
  return new Response(drawing, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="image.png"'
    },
    status: 200
  });
};
