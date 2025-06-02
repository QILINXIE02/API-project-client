import React, { useEffect, useState, useRef } from 'react';
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
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTrack, setCurrentTrack] = useState(null);

  const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Location detection (requires user gesture to avoid warnings)
  useEffect(() => {
    if (!city && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityName = data.address.city || data.address.town || data.address.state;
          setCity(cityName);
        } catch (err) {
          console.error('Location fetch error:', err);
        }
      });
    }
  }, [city, LOCATIONIQ_API_KEY]);

  // Fetch weather when city changes
  useEffect(() => {
    if (city) {
      fetchWeather(city).then(setWeather);
    }
  }, [city]);

  // Set mood based on weather (only if mood not set manually)
  useEffect(() => {
    if (weather && !mood) {
      const weatherMoodMap = {
        Clear: 'happy',
        Rain: 'chill',
        Snow: 'romantic',
        Clouds: 'sad',
        Thunderstorm: 'energetic',
      };
      const moodFromWeather = weather.weather.description;
      setMood(weatherMoodMap[moodFromWeather] || 'chill');
    }
  }, [weather, mood]);

  // Fetch tracks when mood or city changes
  useEffect(() => {
    if (mood && city) {
      fetchTracksByMood(mood, city).then(setTracks);
    }
  }, [mood, city]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Audio visualizer setup
  useEffect(() => {
    if (!audioRef.current) return;

    if (audioContextRef.current) {
      audioContextRef.current.close();
      cancelAnimationFrame(animationRef.current);
    }

    const audio = audioRef.current;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0ed2f7';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [currentTrack]);

  // Toggle favorite track
  const toggleFavorite = (track) => {
    const exists = favorites.some(fav => fav.id === track.id);
    if (exists) {
      setFavorites(favorites.filter(fav => fav.id !== track.id));
    } else {
      setFavorites([...favorites, track]);
    }
  };

  // Generate shareable URL with current mood & city
  const generateShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (mood) params.append('mood', mood);
    if (city) params.append('city', city);
    return `${base}?${params.toString()}`;
  };

  // On load, parse URL params to set mood and city
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMood = params.get('mood');
    const urlCity = params.get('city');
    if (urlMood) setMood(urlMood);
    if (urlCity) setCity(urlCity);
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">TravelTunes</h1>

      <MoodSelector mood={mood} setMood={setMood} />
      <CityInput city={city} setCity={setCity} />
      <WeatherDisplay weather={weather} />

      <div>
        <button onClick={() => navigator.clipboard.writeText(generateShareUrl())}>
          Share Playlist Link
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width="600"
        height="100"
        style={{ margin: '20px auto', display: currentTrack ? 'block' : 'none', borderRadius: '8px', backgroundColor: '#0ed2f7' }}
      />

      <MusicTrackList
        tracks={tracks}
        mood={mood}
        onPlayTrack={setCurrentTrack}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        audioRef={audioRef}
      />

      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.preview_url}
          controls
          autoPlay
          onEnded={() => setCurrentTrack(null)}
          style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }}
        />
      )}
    </div>
  );
};

export default App;
