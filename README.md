# TravelTunes

A React app that generates mood-based music playlists synced to the weather and location. Perfect for travelers or anyone wanting music that matches their vibe and surroundings.

---

## Features

- **Mood Selector:** Choose your mood manually or let the app auto-select based on current weather.
- **City Input & Auto-detect:** Enter a city or use geolocation to get your current location.
- **Weather Display:** Shows current weather info for the selected city.
- **Mood-based Music Tracks:** Fetches and displays music tracks tailored to your mood and location.
- **Responsive Design:** Works well on desktop and mobile devices.
- **Audio Player:** Play music tracks directly inside the app.
- **Favorites:** Save your favorite tracks locally (using `localStorage`).
- **Share Playlist:** Generate shareable URLs with your mood and city settings.

---

## Technologies Used

- React (with hooks)
- CSS for styling with responsive and modern design
- External APIs for weather and music data
- Browser Geolocation API
- Local Storage for saving favorites

---

## Getting Started

1. Clone the repo  
   `git clone https://github.com/yourusername/traveltunes.git`

2. Install dependencies  
   `npm install`

3. Create a `.env` file and add your API keys for LocationIQ, weather, and music services.

4. Run the app  
   `npm start`

---

## Future Improvements

- Add an audio visualizer synced with music playback  
- Enhance shareable links with more detailed playlist info  
- Add user authentication for saving favorites across devices  

---

## License
