import { createChartBuffer } from './canvasDrawer';
import type { RequestHandler } from '@sveltejs/kit';
import { dimensions, style, getYrTimeseries } from './data';
import { getTransports } from './data/transit';

export const GET: RequestHandler = async ({ url }) => {
	const mock = !!url.searchParams.get('mock');
	const weatherData = await getYrTimeseries(mock);
	const transitData = await getTransports();

	if (!weatherData) {
		throw new Error('no weather data');
	}

	if (!transitData) {
		throw new Error('no transit data');
	}

	const drawing = await createChartBuffer(
		weatherData,
		transitData,
		dimensions,
		style
	);

	if (!drawing) {
		throw new Error('no canvas drawing');
	}

	return new Response(drawing, {
		headers: {
			'Content-Type': 'image/png',
			'Content-Disposition': 'inline; filename="image.png"'
		},
		status: 200
	});
};
