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
    // Only attempt to get location if city is not already set and geolocation is available
    if (!city && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          // Prefer city, then town, then state as city name
          const cityName = data.address.city || data.address.town || data.address.state;
          if (cityName) { // Only set if a valid city name is found
            setCity(cityName);
          }
        } catch (err) {
          console.error('Location fetch error:', err);
        }
      }, (error) => {
        console.warn('Geolocation error:', error.message);
        // Fallback or leave city empty for manual input if permission denied/error
      });
    }
  }, [city, LOCATIONIQ_API_KEY]); // Dependency on city ensures it only runs if city is not set

  // Fetch weather when city changes
  useEffect(() => {
    if (city) {
      fetchWeather(city).then(setWeather);
    }
  }, [city]);

  // Set mood based on weather (only if mood not set manually)
  useEffect(() => {
    if (weather && !mood) { // Only set mood if weather is available AND mood is not already set
      const weatherDescription = weather.weather.description.toLowerCase(); // Use lower case for consistent matching
      let moodFromWeather = 'chill'; // Default fallback mood

      if (weatherDescription.includes('clear') || weatherDescription.includes('sun')) {
        moodFromWeather = 'happy';
      } else if (weatherDescription.includes('rain')) {
        moodFromWeather = 'chill';
      } else if (weatherDescription.includes('snow')) {
        moodFromWeather = 'romantic';
      } else if (weatherDescription.includes('cloud')) { // Covers 'clouds', 'cloudy', etc.
        moodFromWeather = 'sad';
      } else if (weatherDescription.includes('thunder')) {
        moodFromWeather = 'energetic';
      }

      setMood(moodFromWeather);
    }
  }, [weather, mood]); // Depend on weather and mood to re-evaluate if mood is still empty

  // Fetch tracks when mood or city changes
  useEffect(() => {
    if (mood && city) {
      console.log(`Fetching tracks for mood: ${mood}, city: ${city}`); // Debugging line
      fetchTracksByMood(mood, city)
        .then(data => {
          setTracks(data);
          console.log('Fetched tracks:', data); // Debugging line
        })
        .catch(err => {
          console.error('Error fetching tracks in App.js:', err);
          setTracks([]); // Clear tracks on error
        });
    } else {
      setTracks([]); // Clear tracks if mood or city is not set
    }
  }, [mood, city]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Audio visualizer setup
  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    if (!audio || !canvas || !currentTrack) { // Only proceed if audio, canvas, and a track are available
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null; // Clear context
      }
      return;
    }

    // Close previous context if it exists to prevent multiple contexts
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    cancelAnimationFrame(animationRef.current);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    // Connect source to analyser
    try {
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    } catch (e) {
      console.error("Error connecting audio source to analyser:", e);
      // Clean up if connection fails
      audioContext.close();
      return;
    }

    analyser.fftSize = 256; // Standard size

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount; // Number of data points
    const dataArray = new Uint8Array(bufferLength); // Array to hold frequency data

    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray); // Get frequency data

      ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear canvas for redraw
      ctx.fillStyle = '#0ed2f7'; // Background color for the visualizer
      ctx.fillRect(0, 0, WIDTH, HEIGHT); // Draw background

      const barWidth = (WIDTH / bufferLength) * 2.5; // Calculate bar width
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i]; // Height of the current bar

        // Dynamic color based on frequency and bar height
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 - (250 * (i / bufferLength)); // Inverted green for more dynamic effect
        const b = 50 + (200 * (i / bufferLength));

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2); // Draw bar from bottom up
        x += barWidth + 1; // Move to next bar position
      }
    };

    // Start drawing only if audio is playing or ready
    if (audio.readyState >= 2) { // Check if audio is ready (HAVE_CURRENT_DATA or more)
      draw();
    } else {
      audio.addEventListener('canplaythrough', draw, { once: true }); // Start drawing when audio can play
    }

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      // Remove the event listener if it was added
      audio.removeEventListener('canplaythrough', draw);
    };
  }, [currentTrack]); // Rerun effect when currentTrack changes

  // Toggle favorite track
  const toggleFavorite = (track) => {
    const exists = favorites.some(fav => fav.id === track.id); // Assuming tracks have unique 'id'
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
  }, []); // Run once on component mount

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
        onPlayTrack={setCurrentTrack} // Pass setCurrentTrack to play a track
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.preview_url} // Ensure this is the correct audio URL property
          controls
          autoPlay
          onEnded={() => setCurrentTrack(null)} // Clear currentTrack when audio ends
          style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }}
          crossOrigin="anonymous" // Required for audio visualization
        />
      )}
    </div>
  );
};

export default App;