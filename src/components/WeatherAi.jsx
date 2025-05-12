import React from "react";

const WeatherAi = ({ weather }) => {
  if (!weather) return null;

  return (
    <div>
      <h2>Weather</h2>
      <p>{weather.city}: {weather.temp}°C</p>
      <p>{weather.description}</p>
    </div>
  );
};

export default WeatherAi;
