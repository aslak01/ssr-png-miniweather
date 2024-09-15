import { createChartBuffer } from './canvasDrawer';
import type { RequestHandler } from '@sveltejs/kit';
import { dimensions, style, getYrTimeseries } from './data';
import { getTransports } from './data/transit';

export const GET: RequestHandler = async ({ url }) => {
	const mock = !!url.searchParams.get('mock');
	const tsData = await getYrTimeseries(mock);
	const transitData = await getTransports();
	if (!transitData) {
		throw new Error('no canvas');
	}
	const drawing = await createChartBuffer(
		tsData,
		transitData,
		dimensions,
		style
	);
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
