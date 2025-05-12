const API_URL = "http://localhost:3001/api";

export const fetchTracksByMood = async (mood, city) => {
  try {
    const res = await fetch(`${API_URL}/music/tracks?mood=${mood}&city=${city}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }
};

export const fetchWeather = async (city) => {
  try {
    const res = await fetch(`${API_URL}/weather?city=${city}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
