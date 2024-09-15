import { type CanvasRenderingContext2D } from 'canvas';
import { formatDateLegend, isTruthy } from '$lib/utils';
import type { Dimensions, Styles, YrTSData } from '../data';
import * as d3 from 'd3';

function getXScale(data: YrTSData[], dimensions: Dimensions) {
	const extent = d3.extent(data, (d) => d.date).filter(isTruthy);
	return d3
		.scaleTime()
		.domain(extent)
		.range([dimensions.left, dimensions.width - dimensions.right]);
}

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

	const longTickTimes = [0, 6, 12, 18];

	xTicks.forEach((tick) => {
		const hr = tick.getHours();
		if (longTickTimes.includes(hr)) {
			drawLongTick(tick);
			return;
		}
		drawNormalTick(tick);
	});

	function drawNormalTick(tick: Date) {
		const x = xScale(tick);
		context.moveTo(x, dimensions.height - dimensions.bottom);
		context.lineTo(x, dimensions.height - dimensions.bottom + style.tickLength);
		context.stroke();
		context.fillText(
			formatDateLegend(tick),
			x,
			dimensions.height - dimensions.bottom + style.tickLength + 2
		);
	}

	function drawLongTick(tick: Date) {
		const x = xScale(tick);
		context.moveTo(x, dimensions.top - dimensions.bottom);
		context.lineTo(x, dimensions.height - dimensions.bottom + style.tickLength);
		context.stroke();
		context.fillText(
			formatDateLegend(tick),
			x,
			dimensions.height - dimensions.bottom + style.tickLength + 2
		);
	}
};
