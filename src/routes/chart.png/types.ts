// TODO: centralise useful types
import type { TWeatherSymbolKey } from './data/weathericontypes';
import type { Dimensions, Styles } from './data';

export type DataPoint = {
	value: number;
	date: Date;
	icon?: TWeatherSymbolKey;
};

export type { Dimensions, Styles };
