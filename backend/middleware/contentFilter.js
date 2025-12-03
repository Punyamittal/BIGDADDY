const Filter = require('bad-words');
const filter = new Filter();

// List of additional words to filter (customize as needed)
const customBadWords = [
  // Add custom words here
];

customBadWords.forEach(word => filter.addWords(word));

const filterContent = (text) => {
  if (!text) return text;
  return filter.clean(text);
};

const checkContent = (text) => {
  if (!text) return { isClean: true, filteredText: text };
  
  const filteredText = filter.clean(text);
  const isClean = filteredText === text;
  
  return { isClean, filteredText };
};

module.exports = { filterContent, checkContent };


