// This script will be injected into job application pages
// It will extract the necessary data from the page and send it to the background script

// Matches Object in Manifest.json - matches the URL pattern of the job application page

const article = document.querySelector('article');

if (article) {
  const text = article.textContent;
  const url = window.location.href;
  
  console.log(url);
  const wordMatchRegExp = /[^\s]+/g; // Regular expression

  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}