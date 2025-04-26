document.addEventListener("DOMContentLoaded", function () {
  const summarizeBtn = document.getElementById("summarize-btn");
  const loader = document.getElementById("loader");
  const results = document.getElementById("results");
  const summaryDiv = document.getElementById("summary");
  const sentimentDiv = document.getElementById("sentiment");
  const relatedNewsDiv = document.getElementById("related-news");

  summarizeBtn.addEventListener("click", async function () {
    // Show loader and hide previous results
    loader.style.display = "block";
    results.style.display = "none";
    summaryDiv.textContent = "Processing...";
    results.style.display = "block";

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Execute content script to extract article content
      const response = await chrome.tabs
        .sendMessage(tab.id, {
          action: "extractArticle",
        })
        .catch((error) => {
          throw new Error(
            `Content script error: ${error.message}. Make sure you're on a webpage with article content.`
          );
        });

      if (response && response.success) {
        summaryDiv.textContent = "Sending to API...";

        // Process the article with OpenAI
        const apiResponse = await processArticle(
          response.articleContent,
          response.title,
          tab.url
        );

        // Display results
        displayResults(apiResponse);

        // Get related news
        getRelatedNews(response.title);
      } else {
        summaryDiv.textContent =
          response?.error ||
          "Failed to extract article content. Try refreshing the page.";
      }
    } catch (error) {
      console.error("Error:", error);
      summaryDiv.textContent = "An error occurred: " + error.message;

      // Add additional debugging info
      if (error.message.includes("403")) {
        summaryDiv.textContent +=
          "\n\nPossible causes: \n1. Server is not running\n2. CORS is blocked\n3. OpenAI API key is invalid\n\nCheck the server logs for more details.";
      }
    } finally {
      loader.style.display = "none";
    }
  });

  async function processArticle(articleContent, title, url) {
    try {
      console.log("Sending request to server...");
      const response = await fetch("http://localhost:5005/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: chrome.runtime.getURL("/"),
        },
        body: JSON.stringify({
          content: articleContent,
          title: title,
          url: url,
        }),
      });

      console.log("Server response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Failed to process article: " + error.message);
    }
  }

  async function getRelatedNews(title) {
    try {
      const response = await fetch("http://localhost:5005/related-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const relatedNews = await response.json();
      displayRelatedNews(relatedNews);
    } catch (error) {
      console.error("Failed to get related news:", error);
      relatedNewsDiv.textContent = "Failed to fetch related news";
    }
  }

  function displayResults(apiResponse) {
    // Display summary
    summaryDiv.textContent = apiResponse.summary;

    // Display sentiment
    sentimentDiv.textContent = apiResponse.sentiment;
    sentimentDiv.className = "";
    sentimentDiv.classList.add(apiResponse.sentiment.toLowerCase());

    // Show results
    results.style.display = "block";
  }

  function displayRelatedNews(news) {
    relatedNewsDiv.innerHTML = "";

    if (news.length === 0) {
      relatedNewsDiv.textContent = "No related news found";
      return;
    }

    news.forEach((article) => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("related-article");

      const titleElement = document.createElement("a");
      titleElement.textContent = article.title;
      titleElement.href = article.url;
      titleElement.target = "_blank";

      const sourceElement = document.createElement("p");
      sourceElement.textContent = `Source: ${article.source}`;

      articleElement.appendChild(titleElement);
      articleElement.appendChild(sourceElement);
      relatedNewsDiv.appendChild(articleElement);
    });
  }
});
