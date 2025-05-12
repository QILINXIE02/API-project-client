import React from 'react';

const MoodSelector = ({ setMood }) => {
  const moods = ['happy', 'sad', 'romantic', 'chill', 'energetic'];

  return (
    <div>
      <h2>Select Mood</h2>
      <select onChange={(e) => setMood(e.target.value)} defaultValue="">
        <option value="" disabled>--Choose mood--</option>
        {moods.map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MoodSelector;
