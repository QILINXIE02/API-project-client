import React, { useEffect, useState } from 'react';
import { fetchTracksByMood } from '../utils/api';

const MusicTrackList = ({ mood, city }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (mood && city) {
      fetchTracksByMood(mood, city).then(setTracks);
    }
  }, [mood, city]);

  if (!mood || !city) return null;

  return (
    <div>
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
  );
};

export default MusicTrackList;
