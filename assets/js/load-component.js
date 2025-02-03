function loadHTML(selector, url) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
      })
      .catch(error => console.error('Error loading content:', error));
  }

  // Load header and footer
  loadHTML("#header-placeholder", "header.html");
  loadHTML("#footer-placeholder", "footer.html");