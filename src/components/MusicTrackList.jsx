import React, { useEffect, useState } from 'react';

const MusicTrackList = ({ tracks, mood }) => {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  });

  const toggleFavorite = (track) => {
    const exists = favorites.find(t => t.url === track.url);
    const updated = exists
      ? favorites.filter(t => t.url !== track.url)
      : [...favorites, track];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="music">
      <h2>Tracks for your mood: {mood}</h2>
      <ul>
        {tracks.map((track, index) => (
          <li key={index}>
            <p>{track.name} - {track.artist_name}</p>
            <audio controls src={track.audio} />
<button onClick={() => toggleFavorite(track)}>
  {favorites.some(fav => fav.id === track.id) ? '💖' : '🤍'}
</button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicTrackList;