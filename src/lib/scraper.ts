/*import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export interface ScrapedContent {
  title: string;
  textContent: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; VaporBot/1.0; +https://vapor.app)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error("Could not extract article content from URL");
  }

  return {
    title: article.title || "Untitled",
    textContent: (article.textContent || "").trim(),
  };
}
*/

import axios from "axios";

export interface ScrapedContent {
  title: string;
  textContent: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  console.log(`[Axios Scraper] Attempting to extract: ${url}`);
  const targetUrl = `https://r.jina.ai/${url}`;

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        "X-Return-Format": "markdown",
        "User-Agent": "VaporApp/1.0",
      },
      // Axios timeout is in milliseconds
      timeout: 20000,
    });

    // console.log(`[Axios Scraper] Jina API Status: ${response.status}`);

    const textContent = response.data;

    if (!textContent || typeof textContent !== 'string' || textContent.trim() === "") {
      throw new Error("Jina API returned an empty or invalid response.");
    }

    // console.log(`[Axios Scraper] Successfully extracted ${textContent.length} characters.`);

    return {
      title: "Extracted Document",
      textContent: textContent.trim(),
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.error(`[Axios Scraper] API Error: ${error.response?.status} - ${error.response?.statusText}`);
      // console.error(`[Axios Scraper] Response Data:`, error.response?.data);
    } else {
      // console.error("[Axios Scraper] Network or Execution Failure:", error);
    }
    throw error;
  }
}