// Background script for the Article Summarizer extension

// This script runs in the background and can handle events like installation,
// browser action clicks, or any background processing

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Article Summarizer extension installed!");
});

// Listen for browser action clicks (if needed for functionality beyond the popup)
chrome.action.onClicked.addListener((tab) => {
  // This will only fire if the popup fails to open or if the popup is disabled
  console.log("Browser action clicked on tab:", tab.url);
});
