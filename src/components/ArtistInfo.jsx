import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArtistInfo = ({ artistName }) => {
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const res = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
          params: {
            method: 'artist.getinfo',
            artist: artistName,
            api_key: process.env.REACT_APP_LASTFM_API_KEY,
            format: 'json',
          },
        });
        setArtistInfo(res.data.artist);
      } catch (err) {
        console.error(err);
      }
    };

    if (artistName) fetchArtistInfo();
  }, [artistName]);

  if (!artistInfo) return <div>Loading artist info...</div>;

  return (
    <div>
      <h3>{artistInfo.name}</h3>
      <p>{artistInfo.bio.summary}</p>
      <p>Genre: {artistInfo.tags.tag[0].name}</p>
    </div>
  );
};

export default ArtistInfo;
