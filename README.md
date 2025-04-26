# Article Summarizer Chrome Extension

A Chrome extension that extracts article content from web pages, summarizes it using OpenAI's API, and finds related news from other websites.

## Features

- Extract article content from any news website
- Summarize articles using OpenAI's API
- Analyze article sentiment (positive/negative/neutral)
- Find related news from web scraped from other websites (Le Monde and Le Figaro for now)

## Installation

### Chrome Extension Setup

1. Clone this repository or download it
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `extension` folder from this project
5. The extension should now appear in your Chrome toolbar

### Server Setup

1. Navigate to the `server` directory
2. Create a `.env` file based on the `.env.template` file:
   ```
   cp .env.template .env
   ```
3. Add your OpenAI API key to the `.env` file
4. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
5. Start the server:
   ```
   python app.py
   ```


## Usage

1. Navigate to any news article
2. Click on the Article Summarizer extension icon in your Chrome toolbar
3. Click the "Summarize Article" button
4. View the article summary, sentiment analysis, and related news

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Chrome Extensions API
- **Backend**: Python with Flask library for the API and Beautiful Soup for web scraping
- **APIs**: OpenAI API

## Note

This extension is designed to work with most news websites. The article extraction might not work perfectly on all websites due to differences in HTML structure.

## Future Improvements

- Add more news sources for related articles
- Add translation feature for international news
