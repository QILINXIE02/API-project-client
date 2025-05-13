import React from 'react';

const MoodSelector = ({ mood, setMood }) => (
  <div className="selector">
    <label htmlFor="mood">Select Mood:</label>
    <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
      <option value="">--Choose a mood--</option>
      {['happy', 'sad', 'romantic', 'chill', 'energetic'].map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  </div>
);

export default MoodSelector;