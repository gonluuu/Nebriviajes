const API_URL = import.meta.env.VITE_API_URL;

export const searchFlights = async (params) => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${API_URL}/flights?${query}`);

  if (!response.ok) {
    throw new Error("Failed to fetch flights");
  }

  return response.json();
};
