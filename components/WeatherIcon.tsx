import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Moon } from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = 1, className = "", size = 24 }) => {
  const iconProps = { className, size };

  // WMO Code mapping
  if (code === 0) {
    return isDay ? <Sun {...iconProps} className={`${className} text-orange-500`} /> : <Moon {...iconProps} className={`${className} text-yellow-300`} />;
  }
  if (code >= 1 && code <= 3) return <Cloud {...iconProps} className={`${className} text-gray-400`} />;
  if (code >= 45 && code <= 48) return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle {...iconProps} className={`${className} text-blue-300`} />;
  if (code >= 61 && code <= 65) return <CloudRain {...iconProps} className={`${className} text-blue-500`} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...iconProps} className={`${className} text-sky-200`} />;
  if (code >= 80 && code <= 82) return <CloudRain {...iconProps} className={`${className} text-blue-600`} />;
  if (code >= 95 && code <= 99) return <CloudLightning {...iconProps} className={`${className} text-yellow-500`} />;

  return <Sun {...iconProps} />;
};

export default WeatherIcon;
