import { createChartBuffer, saveBufferToPng } from './canvasDrawer';
import { writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import type { RequestHandler } from '@sveltejs/kit';
import { Canvas } from 'canvas';
import { dimensions, style, yrTimeseries } from './data';
import type { YrTSData } from './data';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const mock = !!url.searchParams.get('mock');
	const tsData = await yrTimeseries(mock);
	const drawing = createChartBuffer(tsData, dimensions, style);
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
