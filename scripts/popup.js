document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  // OAuth 2.0 Button for Notion API
  const loginButton = document.getElementById('oauth-login-button-btn');
  const logoutButton = document.getElementById('oauth-logout-button-btn');
  const loginStatus = document.getElementById('login-status');

  function updateUI(response) {
    console.log('updateUI', response);
    if (response) {
      loginStatus.textContent = 'Logged in to Notion';
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
      // Show other logged-in content...
    } else {
      loginStatus.textContent = 'Not logged in';
      loginButton.style.display = 'block';
      logoutButton.style.display = 'none';
      // Hide logged-in content...
    }
  }

  // Check login status when popup opens
  chrome.runtime.sendMessage({action: "checkLoginStatus"}, function(response) {
    if (response && response.isLoggedIn !== undefined) {
      updateUI(response.isLoggedIn);
    } else {
      console.error('Invalid response from checkLoginStatus');
      updateUI(false);
    }
  });

  // Handle login
  loginButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "authenticateNotion"}, function(response) {
      if (response && response.success !== undefined && response.success) {
        updateUI(true);
      } else {
        loginStatus.textContent = 'Login failed: ' + (response.error || 'Unknown error');
      }
    });
  });

  
  // Handle logout
  logoutButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "logout"}, function(response) {
      if (response && response.success !== undefined && response.success) {
        updateUI(false);
      } else {
        loginStatus.textContent = 'Logout failed';
      }
    });
  });

  const tabs = document.querySelectorAll('.navtab');
  const contents = document.querySelectorAll('.content');
  const underline = document.querySelector('.underline');

  function updateUnderline() {
    const activeTab = document.querySelector('.navtab.active');
    underline.style.width = `${activeTab.offsetWidth}px`;
    underline.style.left = `${activeTab.offsetLeft}px`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      contents.forEach(content => {
        if (content.id === target) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
      updateUnderline();
    });
  });

  window.addEventListener('resize', updateUnderline);
  updateUnderline();
});