import React from 'react';

const MusicTrackList = ({ tracks, mood }) => (
  tracks.length > 0 ? (
    <div className="music">
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
  ) : null
);

export default MusicTrackList;