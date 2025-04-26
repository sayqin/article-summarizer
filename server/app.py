from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import logging
from openai import OpenAI
import urllib.parse

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI client 
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/summarize', methods=['POST'])
def summarize_article():
    try:
        data = request.json
        content = data.get('content', '')
        title = data.get('title', '')
        url = data.get('url', '')
        
        if not content:
            return jsonify({"error": "No content provided"}), 400
        
        # Truncate content if it's too long (OpenAI has token limits)
        max_content_length = 4000 
        truncated_content = content[:max_content_length] if len(content) > max_content_length else content
        
        # Call OpenAI for summarization and sentiment analysis
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes articles and analyzes their sentiment."},
                {"role": "user", "content": f"Title: {title}\n\nContent: {truncated_content}\n\nPlease provide:\n1. A concise summary (max 150 words)\n2. The overall sentiment (Positive, Negative, or Neutral)"}
            ]
        )
        
        # Extract the response text
        assistant_response = response.choices[0].message.content
        
        # Parse the response to extract summary and sentiment
        summary_match = re.search(r"(?:Summary:|1\.)(.*?)(?:Sentiment:|2\.)", assistant_response, re.DOTALL)
        sentiment_match = re.search(r"(?:Sentiment:|2\.)(.*?)(?:$)", assistant_response, re.DOTALL)
        
        summary = summary_match.group(1).strip() if summary_match else "Summary not available."
        sentiment_text = sentiment_match.group(1).strip() if sentiment_match else "Neutral"
        
        # Normalize sentiment to one of: Positive, Negative, Neutral
        sentiment = "Positive" if "positive" in sentiment_text.lower() else "Negative" if "negative" in sentiment_text.lower() else "Neutral"
        
        return jsonify({
            "summary": summary,
            "sentiment": sentiment
        })
        
    except Exception as e:
        logger.error(f"Error in summarize_article: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/related-news", methods=["POST"])
def find_related_news():
    try:
        data = request.json
        query = data.get("title", "")
        if not query:
            return jsonify({"error": "No query provided"}), 400

        # Get related news from Le Monde, Le Figaro, and Google News
        lefigaro_articles = search_lefigaro(query)
        lemonde_articles = search_lemonde(query)

        # Combine results, limiting to 5 articles total
        combined_results = (lefigaro_articles + lemonde_articles)[:10]
        return jsonify(combined_results)
    except Exception as e:
        logger.error(f"Error in find_related_news: {str(e)}")
        return jsonify({"error": str(e)}), 500


def search_lemonde(query):
    try:
        # Format query for URL
        formatted_query = query.replace(" ", "+")
        url = f"https://www.lemonde.fr/recherche/?search_keywords={formatted_query}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        articles = []
        # Adjust the selectors based on Le Monde's actual HTML structure
        for article in soup.select(".teaser")[:3]:  # Limit to 3 articles
            title_element = article.select_one(".teaser__title")
            link_element = article.select_one("a")

            if title_element and link_element:
                title = title_element.text.strip()
                link = link_element.get("href")

                # Ensure the link is absolute
                if link and not link.startswith("http"):
                    link = f"https://www.lemonde.fr{link}"

                articles.append({"title": title, "url": link, "source": "Le Monde"})

        return articles
    except Exception as e:
        logger.error(f"Error searching Le Monde: {str(e)}")
        return []


def search_lefigaro(query):
    try:
        # Format query for URL
        formatted_query = query.replace(" ", "+")
        url = f"https://recherche.lefigaro.fr/recherche/{formatted_query}"
        logger.debug(f"Searching Le Figaro with URL: {url}")

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            logger.warning(f"Le Figaro returned non-200 status code: {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.text, "html.parser")

        articles = []
        # Select articles using the new structure
        article_elements = soup.select("article.fig-profil")
        
        for article in article_elements[:3]:  # Limit to 3 articles
            title_element = article.select_one("h2.fig-profil-headline a")
            if not title_element:
                continue
                
            title = title_element.get_text(strip=True)
            link = title_element.get("href")
            
            if link and not link.startswith("http"):
                original_link = link
                link = f"https://www.lefigaro.fr{link}" if link.startswith("/") else link

            # Try to get the source from the fig-profil-source or fallback
            source = "Le Figaro"
            source_element = article.select_one("li.fig-profil-source")
            if source_element:
                # Try to get the text of the <a> inside, or fallback to text
                a = source_element.select_one("a")
                if a:
                    source = a.get_text(strip=True)
                else:
                    source = source_element.get_text(strip=True)

            articles.append({"title": title, "url": link, "source": source})

        return articles
    except Exception as e:
        logger.error(f"Error searching Le Figaro: {str(e)}")
        return []

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5005)
