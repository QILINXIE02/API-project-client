const API_URL = "http://localhost:3001";

export const fetchTracksByMood = async (mood) => {
  try {
    const response = await fetch(`${API_URL}/api/music/mood/${mood}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }
};

export const fetchWeather = async (city) => {
  try {
    const response = await fetch(`${API_URL}/api/weather/${city}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
