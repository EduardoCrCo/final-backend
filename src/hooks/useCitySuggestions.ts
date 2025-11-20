import { useState, useCallback } from 'react';

interface CitySuggestion {
  id: number;
  name: string;
  country: string;
}

interface UseCitySuggestionsReturn {
  suggestions: CitySuggestion[];
  loading: boolean;
  fetchSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

const API_KEY = "1754ac1ac1824d7f9a525648251211"; // TODO: Move to environment variables
const API_BASE_URL = "https://api.weatherapi.com/v1";

export const useCitySuggestions = (): UseCitySuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/search.json?key=${API_KEY}&q=${query}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('City suggestions error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    loading,
    fetchSuggestions,
    clearSuggestions
  };
};