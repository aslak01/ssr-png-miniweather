import { drawTheCanvas } from '$lib/canvas';
import * as fs from 'node:fs';
import Canvas from 'canvas';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ReadableStream } from 'stream/web';

export const GET: RequestHandler = async ({ fetch }) => {
  const height = 220;
  const width = 480;
  const canvas = Canvas.createCanvas(width, height);
  const drawing = drawTheCanvas(canvas);
  if (!drawing) {
    throw new Error('no canvas');
  }
  if (!(drawing instanceof Canvas.Canvas)) {
    throw new Error('');
  }
  const pngStream = drawing.createPNGStream();
  console.log('made a png stream');

  const readableStream = new ReadableStream<Uint8Array>({
    start(controller) {
      pngStream.on('data', (chunk: Buffer) => {
        // Enqueue each chunk as Uint8Array to be compatible with Web Streams API
        controller.enqueue(new Uint8Array(chunk));
      });

      pngStream.on('end', () => {
        // Close the stream when PNG stream ends
        controller.close();
      });

      pngStream.on('error', (err: Error) => {
        console.error('Stream error:', err);
        // Handle errors appropriately
        controller.error(err);
      });
    }
  });
  console.log(JSON.stringify(readableStream));
  return new Response(readableStream, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="image.png"'
    },
    status: 200
  });
};
