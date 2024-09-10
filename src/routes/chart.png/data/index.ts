export const dimensions = {
	width: 480,
	height: 220,
	top: 20,
	right: 20,
	bottom: 30,
	left: 40
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
	barWidth: 8,
	tickColor: '#000',
	tickWidth: 1,
	tickLength: 5,
	tickLabelFont: '16px sans-serif',
	tickLabelColor: '#000',
	strongLineColor: '#000',
	weakLineColor: '#777',
	strongLineWidth: 1,
	weakLineWidth: 0.5
};

export type Styles = typeof style;

import { Convert, type RawYrData, type Timesery } from './yrQuicktype';

async function getYrData(lat: string, lon: string): Promise<Timesery[]> {
	const req = await fetch(
		`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`
	);
	const data = await req.json();
	const rawYrData = Convert.toRawYrData(JSON.stringify(data));
	return rawYrData.properties.timeseries;
}

function getNextNHrs(data: Timesery[], n = 10) {
	const now = new Date(new Date().setMinutes(0, 0, 0)).getTime();

	const nHrsInMs = n * 60 * 60 * 1000;

	const nextNhours = data.filter(
		(t: Timesery) =>
			new Date(t.time).getTime() >= now &&
			new Date(t.time).getTime() <= now + nHrsInMs
	);
	return nextNhours;
}

import type { TWeatherSymbolKey } from './weathericontypes';

function getTSData(w: Timesery[]): YrTSData[] {
	return w.map((t: Timesery) => ({
		temp: t.data.instant.details.air_temperature,
		rain: t?.data?.next_1_hours?.details.precipitation_amount || 0,
		date: new Date(t.time),
		icon: t?.data?.next_1_hours?.summary.symbol_code as TWeatherSymbolKey
	}));
}

import { mockRawData } from './mockData';

export async function yrTimeseries(
	mock = false,
	options = { lat: '59', lon: '11', hrs: 8 }
) {
	const { lat, lon, hrs } = options;
	const response = mock ? mockRawData : await getYrData(lat, lon);
	const trimmedResponse = getNextNHrs(response, hrs);
	const tsData = getTSData(trimmedResponse);
	return tsData;
}

export type YrTSData = {
	temp: number;
	rain: number;
	date: Date;
	icon?: TWeatherSymbolKey;
};

export type DataPoint = {
	value: number;
	date: Date;
};
