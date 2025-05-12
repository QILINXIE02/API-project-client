import React, { useEffect, useState } from 'react';
import { fetchWeather, fetchTracksByMood } from './utils/api';

const App = () => {
  const [mood, setMood] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (city) {
      fetchWeather(city).then(setWeather);
    }
  }, [city]);

  useEffect(() => {
    if (mood && city) {
      fetchTracksByMood(mood, city).then(setTracks);
    }
  }, [mood, city]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>TravelTunes</h1>

      <h2>Select Mood</h2>
      <select onChange={(e) => setMood(e.target.value)} defaultValue="">
        <option value="" disabled>--Choose mood--</option>
        {['happy', 'sad', 'romantic', 'chill', 'energetic'].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
      </div>

      {weather && (
        <div>
          <h4>Current Weather: {weather.weather.description}</h4>
          <p>Temperature: {weather.temp}°C</p>
        </div>
      )}

      {tracks.length > 0 && (
        <div>
          <h3>Music for {mood}</h3>
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>
                <strong>{track.name}</strong> by {track.artist_name}
                <br />
                <audio controls>
                  <source src={track.audio} type="audio/mpeg" />
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
