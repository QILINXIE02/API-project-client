// src/utils/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, { params: { city } });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const fetchTracksByMood = async (mood, city) => {
  try {
    const response = await axios.get(`${BASE_URL}/music`, {
      params: { mood, city },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
};
