import React, { useEffect, useState } from 'react';
import './index.css';
import MoodSelector from './components/MoodSelector';
import CityInput from './components/CityInput';
import WeatherDisplay from './components/WeatherDisplay';
import MusicTrackList from './components/MusicTrackList';
import { fetchWeather, fetchTracksByMood } from './utils/api';

const App = () => {
  const [mood, setMood] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (city) fetchWeather(city).then(setWeather);
  }, [city]);

  useEffect(() => {
    if (mood && city) fetchTracksByMood(mood, city).then(setTracks);
  }, [mood, city]);

  return (
    <div className="app-container">
      <h1 className="title">TravelTunes</h1>
      <MoodSelector mood={mood} setMood={setMood} />
      <CityInput city={city} setCity={setCity} />
      <WeatherDisplay weather={weather} />
      <MusicTrackList tracks={tracks} mood={mood} />
    </div>
  );
};

export default App;
