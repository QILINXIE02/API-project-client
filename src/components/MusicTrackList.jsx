import React, { useState } from 'react';

const MusicTrackList = ({ tracks, mood, favorites, toggleFavorite, onPlayTrack }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const showMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <div className="music">
      <h2>Tracks for your mood: {mood}</h2>
      <ul>
        {tracks.slice(0, visibleCount).map((track, index) => (
          <li key={track.id || index}>
            <p>{track.name || 'Unknown Title'} - {track.artist_name || 'Unknown Artist'}</p>
            {track.audio && (
              <audio controls src={track.audio} onPlay={() => onPlayTrack(track)} />
            )}
            <button onClick={() => toggleFavorite(track)}>
              {favorites.some(fav => fav.id === track.id) ? '💖' : '🤍'}
            </button>
          </li>
        ))}
      </ul>
      {visibleCount < tracks.length && (
        <button onClick={showMore}>Show More</button>
      )}
    </div>
  );
};

export default MusicTrackList;
