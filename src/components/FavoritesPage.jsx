import React, { useState } from 'react';

const FavoritesPage = ({ favorites = [], toggleFavorite, suggestedTracks = [], onAddToFavorites }) => {
  const [sortBy, setSortBy] = useState('name');
  const [filterText, setFilterText] = useState('');

  const sortedFavorites = [...favorites]
    .filter(track => track.name?.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      const fieldA = a[sortBy]?.toLowerCase() || '';
      const fieldB = b[sortBy]?.toLowerCase() || '';
      return fieldA.localeCompare(fieldB);
    });

  return (
    <div className="favorites-page">
      <h2>Your Favorite Songs</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Filter by name:
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="name">Name</option>
            <option value="artist_name">Artist</option>
          </select>
        </label>
      </div>

      <ul className="favorites-list">
        {sortedFavorites.length > 0 ? (
          sortedFavorites.map((track, index) => (
            <li key={track.id || index}>
              <p>{track.name || 'Unknown Title'} - {track.artist_name || 'Unknown Artist'}</p>
              {track.audio && <audio controls src={track.audio} />}
              {typeof toggleFavorite === 'function' && (
                <button onClick={() => toggleFavorite(track)}>💔 Remove</button>
              )}
            </li>
          ))
        ) : (
          <p>No favorite songs yet.</p>
        )}
      </ul>

      <h3>Suggested Tracks to Add</h3>
      <ul className="suggested-list">
        {suggestedTracks.slice(0, 3).map((track, index) => (
          <li key={track.id || index}>
            <p>{track.name} - {track.artist_name}</p>
            {track.audio && <audio controls src={track.audio} />}
            <button onClick={() => onAddToFavorites(track)}>➕ Add to Favorites</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
