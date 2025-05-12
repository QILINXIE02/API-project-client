import React, { useEffect, useState } from 'react';
import { fetchWeather } from '../utils/api';

const WeatherDisplay = ({ city }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (city) {
      fetchWeather(city).then(setWeather);
    }
  }, [city]);

  if (!weather) return <div>Loading weather...</div>;

  return (
    <div>
      <h4>Current Weather: {weather.weather.description}</h4>
      <p>Temperature: {weather.temp}°C</p>
    </div>
  );
};

export default WeatherDisplay;
