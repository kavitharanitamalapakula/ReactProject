import { fetchWithToken } from '../utils/fetchWithToken';

const BASE_URL = "http://localhost:5000/api/meetings";

export const getMeetings = async () => {
  try {
    const data = await fetchWithToken(BASE_URL, {
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};
