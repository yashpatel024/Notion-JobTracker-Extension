const CLIENT_ID = '5364b530-0604-4452-8d2c-e18d381cb629';
const REDIRECT_URI = chrome.identity.getRedirectURL();
const CLIENT_SECRET = ''; //TODO: Add client secret
const NOTION_AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}`;

// Function to set login status
function setLoginStatus(status) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ isLoggedIn: status }, () => {
      resolve();
    });
  });
}

// Function to get login status
function getLoginStatus() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['isLoggedIn'], (result) => {
      resolve(result.isLoggedIn);
    });
  });
}

// Handles messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'authenticateNotion') {
    // Authenticate with Notion
    chrome.identity.launchWebAuthFlow(
      {
        url: NOTION_AUTH_URL,
        interactive: true,
      },
      (redirectUrl) => {
        // Handle redirect URL
        if (chrome.runtime.lastError || !redirectUrl) {
          sendResponse({ success: false, error: 'Failed to authenticate' });
          return;
        }

        // Parse redirect URL
        const url = new URL(redirectUrl);
        const code = url.searchParams.get('code');

        // Check if code is present in redirect URL
        if (!code) {
          sendResponse({
            success: false,
            error: 'No code found in redirect URL',
          });
          return;
        }

        // Exchange code for access token
        exchangeCodeForToken(code)
          .then((tokenData) => {
            chrome.storage.sync.set(
              { notionToken: tokenData.access_token },
              () => {
                sendResponse({ success: true });
              }
            );
          })
          .catch((error) => {
            sendResponse({ success: false, error: error.message });
          });
      }
    );

    setLoginStatus(true).then(() => {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response is asynchronous
  }

  if (request.action === 'checkLoginStatus') {
    // Check login status
    getLoginStatus().then((status) => {
      sendResponse({ isLoggedIn: status });
    });
    return true;
  }

  if (request.action === 'logout') {
    setLoginStatus(false).then(() => {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response is asynchronous
  }
});

// Function to exchange code for access token
async function exchangeCodeForToken(code) {
  const response = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const tokenData = await response.json();
  return tokenData;
}
