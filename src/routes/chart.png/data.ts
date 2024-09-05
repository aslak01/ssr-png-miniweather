export const dimensions = {
  width: 480,
  height: 220,
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
};

export type Dimensions = typeof dimensions;

// barColor: string;
// barWidth: number;

export const style = {
  lineColor: '#007bff',
  lineWidth: 2,
  axisColor: '#000000',
  axisWidth: 1,
  labelColor: '#333333',
  labelFont: '12px Arial',
  barColor: 'rgba(70, 130, 180, 0.5)',
  barWidth: 8
};

export type Styles = typeof style;

const data = [
  { date: new Date('2023-01-01'), value: 10 },
  { date: new Date('2023-02-01'), value: 15 },
  { date: new Date('2023-03-01'), value: 20 },
  { date: new Date('2023-04-01'), value: 18 },
  { date: new Date('2023-05-01'), value: 25 }
];

export type YrWeather = {
  time: string;
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number;
        air_temperature: number;
        cloud_area_fraction: number;
        relative_humidity: number;
        wind_from_direction: number;
        wind_speed: number;
      };
    };
    next_12_hours: {
      summary: {
        symbol_code: string;
      };
    };
    next_1_hours: {
      summary: {
        symbol_code: string;
      };
      details: {
        precipitation_amount: number;
      };
    };
    next_6_hours: {
      summary: {
        symbol_code: string;
      };
      details: {
        precipitation_amount: number;
      };
    };
  };
};

async function getYrData(lat: string, lon: string): Promise<YrWeather[]> {
  const req = await fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`
  );
  const data = await req.json();
  return data.properties.timeseries;
}

function getNextNHrs(data: YrWeather[], n = 10) {
  const now = new Date(new Date().setMinutes(0, 0, 0)).getTime();

  const nHrsInMs = n * 60 * 60 * 1000;

  const nextNhours = data.filter(
    (t: YrWeather) =>
      new Date(t.time).getTime() >= now && new Date(t.time).getTime() <= now + nHrsInMs
  );
  return nextNhours;
}

import type { TWeatherSymbolKey } from './weathericontypes';
import type { DataPoint } from './types';

function getTemps(w: YrWeather[]): DataPoint[] {
  return w.map((t: YrWeather) => ({
    value: t.data.instant.details.air_temperature,
    icon: t.data.next_1_hours.summary.symbol_code as TWeatherSymbolKey,
    date: new Date(t.time)
  }));
}

function getRain(w: YrWeather[]): DataPoint[] {
  return w.map((t: YrWeather) => ({
    value: t.data.next_1_hours.details.precipitation_amount,
    date: new Date(t.time)
  }));
}

type TempAndRainTS = {
  temps: DataPoint[];
  rain: DataPoint[];
};

export async function yrTimeseries(lat = '59', lon = '11', hrs = 8) {
  const response = await getYrData(lat, lon);
  const trimmedResponse = getNextNHrs(response, hrs);
  return {
    temps: getTemps(trimmedResponse),
    rain: getRain(trimmedResponse)
  };
}

export type YrData = {
  temps: DataPoint[];
  rain: DataPoint[];
};
