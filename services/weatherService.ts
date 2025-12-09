import { WeatherData, Unit } from '../types';

export const getWeather = async (lat: number, lng: number, unit: Unit): Promise<WeatherData> => {
  const tempUnitParam = unit === Unit.FAHRENHEIT ? '&temperature_unit=fahrenheit' : '';
  const windUnitParam = unit === Unit.FAHRENHEIT ? '&wind_speed_unit=mph' : '&wind_speed_unit=kmh';
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto${tempUnitParam}${windUnitParam}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    const data = await response.json();

    const daily: any[] = [];
    const dailyData = data.daily;
    
    // Process next 7 days
    for (let i = 0; i < 7; i++) {
      if (dailyData.time[i]) {
        daily.push({
          date: dailyData.time[i],
          weatherCode: dailyData.weather_code[i],
          minTemp: dailyData.temperature_2m_min[i],
          maxTemp: dailyData.temperature_2m_max[i],
        });
      }
    }

    return {
      current: {
        temp: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        precipitationProb: data.daily.precipitation_probability_max?.[0] || 0, // Using daily max as proxy for "current" prob if realtime not avail
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day,
      },
      daily: daily,
      units: {
        temp: data.current_units.temperature_2m,
        speed: data.current_units.wind_speed_10m
      }
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};
