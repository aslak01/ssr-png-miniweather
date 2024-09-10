import { createCanvas, Canvas } from 'canvas';
import * as d3 from 'd3';
import { writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import { dev } from '$app/environment';

import type { Dimensions, Styles, YrTSData } from '../data';
import { drawRain } from './drawRain';
import { drawTemps } from './drawTemps';
import { drawTimeMarkerLines, drawTimeTicks } from './drawTime';
import { multiplyNumberValues } from '$lib/utils';

const createChart = (
	data: YrTSData[],
	dimensions: Dimensions,
	style: Styles
): Canvas => {
	const ratio = dev ? 2 : 1;
	const dims = multiplyNumberValues(dimensions, ratio);
	const styles = multiplyNumberValues(style, ratio);

	const canvas = createCanvas(dims.width, dims.height);
	const context = canvas.getContext('2d');

	drawTimeMarkerLines(context, data, dims, styles);
	drawTimeTicks(context, data, dims, styles);
	drawTemps(context, data, dims, styles);
	drawRain(context, data, dims, styles);

	return canvas;
};

const createChartBuffer = (
	data: YrTSData[],
	dimensions: Dimensions,
	style: Styles
): Buffer => {
	const chart = createChart(data, dimensions, style);
	return chart.toBuffer('image/png');
};

const saveBufferToPng = async (
	buffer: Buffer,
	filePath: string
): Promise<void> => {
	try {
		await writeFile(filePath, buffer);
		console.log(`PNG file saved successfully to ${filePath}`);
	} catch (error) {
		console.error('Error saving PNG file:', error);
	}
};

const createAndSaveChart = (
	data: YrTSData[],
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
