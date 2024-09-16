export const dimensions = {
	width: 480,
	height: 220,
	top: 20,
	right: 25,
	bottom: 30,
	left: 40,
	weatherHeight: 220 * 0.8,
	transitHeight: 220 * 0.2
};

export type Dimensions = typeof dimensions;

export const style = {
	lineColor: '#007bff',
	axisColor: '#000',
	labelColor: '#333',
	lineWidth: 2,
	axisWidth: 1,
	labelFont: '12px sans-serif',
	barColor: '#007bff',
	barWidth: 40,
	tickColor: '#000',
	tickWidth: 1,
	tickLength: 5,
	tickLabelFont: '16px sans-serif',
	tickLabelColor: '#000',
	strongLineColor: '#000',
	weakLineColor: '#777',
	strongLineWidth: 1,
	weakLineWidth: 0.5,
	circleColor: 'black',
	textColor: 'white'
};

export type Styles = typeof style;

export type DataPoint = { value: number } & YrTSData;

import { getYrTimeseries, type YrTSData } from './weather';
export { getYrTimeseries, type YrTSData };
