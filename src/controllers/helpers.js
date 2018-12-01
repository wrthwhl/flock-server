export const buildSuggestionsObj = (suggestions, userID) => {
  if (suggestions.length) {
    suggestions = suggestions.map((suggestion) => ({
      ...suggestion,
      voters: [ userID ],

      creator: userID
    }));
  }
  return suggestions;
};
