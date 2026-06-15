export const API_KEY = import.meta.env.VITE_API_KEY;

export const BASE_URL = "https://api.restcountries.com/countries/v5";

export const fetchOptions = {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
};

