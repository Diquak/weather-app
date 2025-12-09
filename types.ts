export enum Unit {
  CELSIUS = 'celsius',
  FAHRENHEIT = 'fahrenheit'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface City {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
}

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    precipitationProb: number;
    weatherCode: number;
    isDay: number;
  };
  daily: DailyForecast[];
  units: {
    temp: string;
    speed: string;
  };
}

export interface AppSettings {
  unit: Unit;
  theme: Theme;
  rainNotification: boolean;
}
