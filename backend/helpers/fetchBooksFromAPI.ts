import axios from "axios";

const randomTopics = [
  "history",
  "science",
  "technology",
  "art",
  "love",
  "space",
  "music",
  "math",
  "nature",
  "fiction",
  "robots",
  "design",
  "philosophy",
  "biology",
  "travel",
];

function getRandomTopic(): string {
  return randomTopics[Math.floor(Math.random() * randomTopics.length)];
}

export interface APIBook {
  title: string;
  author: string;
  description: string;
}

export async function fetchBooksFromAPI(targetCount = 50): Promise<APIBook[]> {
  const addedTitles = new Set<string>();
  const result: APIBook[] = [];

  while (result.length < targetCount) {
    const topic = getRandomTopic();
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      topic
    )}&language=eng&limit=10`;
    const response = await axios.get(url);
    const books = response.data.docs || [];

    for (const book of books) {
      if (result.length >= targetCount) break;

      const title = book.title?.trim();
      const author = book.author_name?.[0] || "Unknown";

      if (!title || addedTitles.has(title)) continue;

      result.push({
        title,
        author,
        description: `This is ${title} written by ${author}`,
      });

      addedTitles.add(title);
    }
  }

  return result;
}
