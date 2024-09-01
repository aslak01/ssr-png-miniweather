import { createChartBuffer, saveBufferToPng } from './canvasDrawer';
import { writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import type { RequestHandler } from '@sveltejs/kit';
import { Canvas } from 'canvas';

const main = async () => {
  const dimensions = {
    width: 480,
    height: 220,
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  };

  const style = {
    lineColor: '#007bff',
    lineWidth: 2,
    axisColor: '#000000',
    axisWidth: 1,
    labelColor: '#333333',
    labelFont: '12px Arial'
  };

  const data = [
    { date: new Date('2023-01-01'), value: 10 },
    { date: new Date('2023-02-01'), value: 15 },
    { date: new Date('2023-03-01'), value: 20 },
    { date: new Date('2023-04-01'), value: 18 },
    { date: new Date('2023-05-01'), value: 25 }
  ];

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
  console.log(drawing);
  return new Response(drawing, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="image.png"'
    },
    status: 200
  });
};
