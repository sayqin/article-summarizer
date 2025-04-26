// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractArticle") {
    const articleData = extractArticleContent();
    sendResponse(articleData);
  }
  // Required to use sendResponse asynchronously
  return true;
});

function extractArticleContent() {
  try {
    // Common selectors for article content on news websites
    const possibleContentSelectors = [
      "article",
      ".article-content",
      ".article-body",
      ".story-body",
      ".entry-content",
      ".post-content",
      "#article-body",
      ".content-article",
      // Specific selectors for lemonde.fr
      ".article__content",
      ".article__paragraph",
      // Specific selectors for lefigaro.fr
      ".fig-content",
      ".fig-paragraph",
    ];

    // Try to find article content using selectors
    let contentElement = null;
    for (const selector of possibleContentSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Find the largest text content element as it likely contains the article
        contentElement = Array.from(elements).reduce((largest, current) => {
          return current.textContent.length > largest.textContent.length
            ? current
            : largest;
        }, elements[0]);

        if (contentElement.textContent.length > 500) {
          break; // We've found a substantial content element
        }
      }
    }

    // Extract title
    const title =
      document.title ||
      document.querySelector("h1")?.textContent ||
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content") ||
      "Untitled Article";

    // If we found content
    if (contentElement && contentElement.textContent.trim().length > 0) {
      // Clean up the text (remove extra spaces, newlines, etc.)
      const cleanContent = contentElement.textContent
        .replace(/\s+/g, " ")
        .trim();

      return {
        success: true,
        articleContent: cleanContent,
        title: title,
      };
    } else {
      // Fallback: try to extract paragraphs
      const paragraphs = document.querySelectorAll("p");
      if (paragraphs.length > 0) {
        // Combine all paragraphs with more than 100 characters (likely content, not navigation)
        const content = Array.from(paragraphs)
          .filter((p) => p.textContent.length > 100)
          .map((p) => p.textContent)
          .join(" ");

        if (content.length > 500) {
          return {
            success: true,
            articleContent: content,
            title: title,
          };
        }
      }
    }

    return {
      success: false,
      error: "Could not find article content",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
