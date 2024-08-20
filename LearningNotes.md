## Learning Notes

### Chrome Extension

#### Manifest
- Basic Manifest File
```json
{
  "manifest_version": 3,
  "name": "Hi, Boss",
  "description": "Base Level Extension",
  "version": "1.0",
  "action": {
    "default_popup": "hello.html",
    "default_icon": "hello_extensions.png"
  }
}
```

- Manifest File with Content Scripts
```json
{
  "manifest_version": 3,
  "name": "Hi, Boss",
  "description": "Base Level Extension",
  "version": "1.0",
  "content_scripts": [
    {
      "matches": ["https://www.google.com/*"], // Matching URLs
      "js": ["content.js"] // Content Scripts - Scripts to be injected into the webpage
    }
  ]
} 
```

- Manifest File with Event Listeners
```json
{
  "manifest_version": 3,
  "name": "Hi, Boss",
  "description": "Base Level Extension",
  "version": "1.0",
  "background": {
    "service_worker": "background.js" // Background Scripts - Scripts to be injected into the background page
  }
}
```

# Enable the extension action
```json
"action": {
    "default_popup": "hello.html",
    "default_icon": "hello_extensions.png",
    "default_title": "Hello Extensions"
  }
```

# Permissions
```json
{
  "permissions": [
    "tabs", // Access to the tabs
    "storage", // Access to the browser storage
    "activeTab", // Access to the active tab
    "scripting" // Access to the scripting API - Insert or remove the style sheet using the Scripting API.
  ]
```

# Keyboard Shortcuts
```json
{
  "commands": {
    "toggle-feature": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
      }
    }
  }
} 
```

# Persistence Storage
- Local Storage - chrome.storage API
```js
// Save default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      apiSuggestions: ['tabs', 'storage', 'scripting']
    });
  }
});

  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
```


## Content Scripts vs Service Workers
- Content Scripts
  - Direct access to the web page's DOM
  - Runs in the context of the web page
  - Limited to DOM-related events
  - Always active when the page is loaded
  - Modifying web pages, extracting data

- Service Workers
  - No direct access to the DOM
  - Runs in the background, independent of web pages
  - Handles extension-specific events
  - Runs only when needed, conserving resources
  - Background tasks, event handling, state management

- In summary, use content scripts when you need to interact with the web page's content, and use service workers for handling background tasks and managing events that do not require DOM access.

