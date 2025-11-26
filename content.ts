import { MessagePayload, ScrapeResponse } from './types';

// Fix: Add declaration for chrome namespace to resolve type errors
declare const chrome: any;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  (message: MessagePayload, sender: any, sendResponse: any) => {
    if (message.action === 'SCRAPE_TEXT') {
      const text = scrapeContent();
      const response: ScrapeResponse = { text };
      sendResponse(response);
    }
    // Return true to indicate we wish to send a response asynchronously (optional here as we are sync, but good practice)
    return true; 
  }
);

function scrapeContent(): string {
  let text = '';
  
  // 1. Try to get main post content
  const postSelectors = [
    '[data-pagelet="VideoPlayer"]',
    '[role="article"]',
    'article',
    '[data-ad-preview="message"]',
    '.userContent',
    'main',
    '[role="main"]'
  ];
  
  let postText = '';
  for (const selector of postSelectors) {
    const el = document.querySelector(selector) as HTMLElement;
    if (el && el.innerText && el.innerText.length > 20) {
      postText = el.innerText;
      break;
    }
  }
  
  // 2. Try to get comments (especially for Facebook)
  const commentSelectors = [
    '[data-testid="UFI2Comment/root"]',
    '[data-testid="comment"]',
    '[role="article"] [data-testid]',
    '.UFICommentBody',
    '[data-ad-comet-preview="message"]'
  ];
  
  let commentsText = '';
  const comments: string[] = [];
  
  // Try Facebook-specific comment selectors
  commentSelectors.forEach(selector => {
    const commentElements = document.querySelectorAll(selector);
    commentElements.forEach((el: Element) => {
      const commentText = (el as HTMLElement).innerText?.trim();
      if (commentText && commentText.length > 10 && !comments.includes(commentText)) {
        comments.push(commentText);
      }
    });
  });
  
  // If no specific comments found, try to get all visible text from comment sections
  if (comments.length === 0) {
    const allElements = document.querySelectorAll('[role="article"], [data-testid*="comment"], [class*="comment"]');
    allElements.forEach((el: Element) => {
      const elText = (el as HTMLElement).innerText?.trim();
      if (elText && elText.length > 20 && elText.length < 500) {
        // Likely a comment if it's between 20-500 chars
        if (!comments.includes(elText) && comments.length < 20) {
          comments.push(elText);
        }
      }
    });
  }
  
  commentsText = comments.join(' | ');
  
  // 3. Combine post and comments
  if (postText) {
    text = postText;
    if (commentsText) {
      text += '\n\n--- COMMENTS ---\n' + commentsText;
    }
  } else {
    // Fallback: get all visible text from body
    const body = document.body.cloneNode(true) as HTMLElement;
    const junkTags = ['script', 'style', 'nav', 'footer', 'iframe', 'noscript', 'svg'];
    junkTags.forEach(tag => {
      const junkElements = body.querySelectorAll(tag);
      junkElements.forEach(el => el.remove());
    });
    text = body.innerText || '';
  }
  
  // 4. Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // 5. Truncate to 4000 characters (prioritize keeping comments if they exist)
  if (text.length > 4000) {
    // Try to keep both post and some comments
    if (postText && commentsText) {
      const postLength = Math.min(postText.length, 2000);
      const commentsLength = 4000 - postLength - 50; // 50 for separator
      text = postText.substring(0, postLength) + '\n\n--- COMMENTS ---\n' + commentsText.substring(0, commentsLength);
    } else {
      text = text.substring(0, 4000);
    }
  }
  
  return text;
}