import React, { useState, useEffect } from 'react';

const FeaturedSong = ({ tracks }) => {
  const [featured, setFeatured] = useState(null);

  const pickRandom = () => {
    console.log('pickRandom called', tracks);
    if (tracks && tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setFeatured(randomTrack);
    }
  };

  useEffect(() => {
    if (tracks && tracks.length > 0) {
      pickRandom();
    }
  }, [tracks]);

  return (
    <div className="featured-song">
      <button
        onClick={pickRandom}
        aria-label="Pick a random featured song"
        style={{ cursor: 'pointer', marginBottom: '1rem' }}
      >
        🎶 Featured Song of the Day
      </button>

      {featured ? (
        <section id="results">
          <p>{featured.name} by {featured.artist_name}</p>
          {featured.preview_url ? (
            <audio controls src={featured.preview_url} crossOrigin="anonymous" />
          ) : (
            <p>No audio preview available.</p>
          )}
        </section>
      ) : (
        <p>No featured song yet.</p>
      )}
    </div>
  );
};

export default FeaturedSong;
