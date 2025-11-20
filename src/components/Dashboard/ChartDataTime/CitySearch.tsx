import React from 'react';

interface CitySuggestion {
  id: number;
  name: string;
  country: string;
}

interface CitySearchProps {
  city: string;
  onCityChange: (city: string) => void;
  onCitySelect: (cityName: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  suggestions: CitySuggestion[];
  onSuggestionsFetch: (query: string) => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  city,
  onCityChange,
  onCitySelect,
  onSearch,
  suggestions,
  onSuggestionsFetch
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCityChange(value);
    onSuggestionsFetch(value);
  };

  return (
    <form onSubmit={onSearch} className="relative w-full max-w-md flex-shrink-0">
      <input
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder="Buscar ciudad..."
        className="border rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring focus:ring-blue-400"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
      >
        Buscar
      </button>

      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => onCitySelect(suggestion.name)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};