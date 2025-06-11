import React, { useEffect, useState, useRef } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthButtons from './Auth/AuthButtons';
import Login from './Auth/Login';
import LogoutButton from './Auth/Logout';
import Profile from './Profile';
import Contact from './components/Contact';
import FeaturedSong from './components/FeaturedSong';

import MoodSelector from './components/MoodSelector';
import CityInput from './components/CityInput';
import WeatherDisplay from './components/WeatherDisplay';
import MusicTrackList from './components/MusicTrackList';
import FavoritesPage from './components/FavoritesPage';

import Header from './Header';
import Footer from './Footer';

import { fetchWeather, fetchTracksByMood } from './utils/api';
import './index.css';

const App = (props) => {
  const { auth0 } = props;

  const [mood, setMood] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [displayedTracks, setDisplayedTracks] = useState([]);
  const [favorites, setFavorites] = useState(() => {
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
          if (cityName) setCity(cityName);
        } catch (err) {
          console.error('Location fetch error:', err);
        }
      }, (error) => {
        console.warn('Geolocation error:', error.message);
      });
    }
  }, [city, LOCATIONIQ_API_KEY]);

  useEffect(() => {
    if (city) fetchWeather(city).then(setWeather);
  }, [city]);

  useEffect(() => {
    if (weather && !mood) {
      const desc = weather.weather.description.toLowerCase();
      let moodFromWeather = 'chill';

      if (desc.includes('clear') || desc.includes('sun')) moodFromWeather = 'happy';
      else if (desc.includes('rain')) moodFromWeather = 'chill';
      else if (desc.includes('snow')) moodFromWeather = 'romantic';
      else if (desc.includes('cloud')) moodFromWeather = 'sad';
      else if (desc.includes('thunder')) moodFromWeather = 'energetic';

      setMood(moodFromWeather);
    }
  }, [weather, mood]);

  useEffect(() => {
    if (mood && city) {
      fetchTracksByMood(mood, city)
        .then((res) => {
          setTracks(res);
          setDisplayedTracks(res.slice(0, 5));
        })
        .catch((err) => {
          console.error('Error fetching tracks:', err);
          setTracks([]);
        });
    } else {
      setTracks([]);
      setDisplayedTracks([]);
    }
  }, [mood, city]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    if (!audio || !canvas || !currentTrack) {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    cancelAnimationFrame(animationRef.current);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    try {
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    } catch (e) {
      console.error('Error connecting audio source:', e);
      audioContext.close();
      return;
    }

    analyser.fftSize = 256;
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = '#0ed2f7';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 - (250 * (i / bufferLength));
        const b = 50 + (200 * (i / bufferLength));

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    if (audio.readyState >= 2) {
      draw();
    } else {
      audio.addEventListener('canplaythrough', draw, { once: true });
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      audio.removeEventListener('canplaythrough', draw);
    };
  }, [currentTrack]);

  const toggleFavorite = (track) => {
    const exists = favorites.some(fav => fav.id === track.id);
    if (exists) {
      setFavorites(favorites.filter(fav => fav.id !== track.id));
    } else {
      setFavorites([...favorites, track]);
    }
  };

  const showMoreTracks = () => {
    const next = displayedTracks.length + 5;
    setDisplayedTracks(tracks.slice(0, next));
  };

  const generateShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (mood) params.append('mood', mood);
    if (city) params.append('city', city);
    return `${base}?${params.toString()}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMood = params.get('mood');
    const urlCity = params.get('city');
    if (urlMood) setMood(urlMood);
    if (urlCity) setCity(urlCity);
  }, []);

  return (
    <Router>
      <Header />
      <div className="app-container">
        <Login />
                        <LogoutButton />
        {auth0.isAuthenticated ? (
          <>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Profile />
                    <h1 className="title">TravelTunes</h1>
                    <MoodSelector mood={mood} setMood={setMood} />
                    <CityInput city={city} setCity={setCity} />
                    <WeatherDisplay weather={weather} />

                    <FeaturedSong tracks={tracks} />

                    <button onClick={() => navigator.clipboard.writeText(generateShareUrl())}>
                      Share Playlist Link
                    </button>

                    <canvas
                      ref={canvasRef}
                      width="600"
                      height="100"
                      style={{
                        margin: '20px auto',
                        display: currentTrack ? 'block' : 'none',
                        borderRadius: '8px',
                        backgroundColor: '#0ed2f7',
                      }}
                    />

                    <MusicTrackList
                      tracks={displayedTracks}
                      mood={mood}
                      onPlayTrack={setCurrentTrack}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      showMore={showMoreTracks}
                    />

                    {currentTrack && (
                      <audio
                        ref={audioRef}
                        src={currentTrack.preview_url}
                        controls
                        autoPlay
                        onEnded={() => setCurrentTrack(null)}
                        style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }}
                        crossOrigin="anonymous"
                      />
                    )}
                  </>
                }
              />
              <Route path="/favorites" element={<FavoritesPage favorites={favorites} />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </>
        ) : (
          <p>Please login to use the app.</p>
        )}

      </div>
      <Footer />
    </Router>
  );
};

export default withAuth0(App);
