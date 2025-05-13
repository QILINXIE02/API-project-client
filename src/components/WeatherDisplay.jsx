import React from 'react';

const WeatherDisplay = ({ weather }) => (
  weather ? (
    <div className="weather">
      <h4>Current Weather: {weather.weather.description}</h4>
      <p>Temperature: {weather.temp}°C</p>
    </div>
  ) : null
);

export default WeatherDisplay;