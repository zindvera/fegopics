

static_search();


function static_search() {



  const MAX_RESULTS = 6;

  async function searchPlatform(platformId, keyword, sharedResults) {
    let fileNum = 1;
    while (true) {
      if (sharedResults.length >= MAX_RESULTS) break;
      try {
        const response = await fetch(`./data/movies/${platformId}/movies-${fileNum}.json`);
        if (!response.ok) break;
        const movies = await response.json();

        for (const movie of movies) {
          if (sharedResults.length >= MAX_RESULTS) break;
          if (movie.title && movie.title.toLowerCase().includes(keyword.toLowerCase())) {
            if (!sharedResults.some(m => m.id === movie.id && m.platform === platformId)) {
              sharedResults.push({ ...movie, platform: platformId });
            }
          }
        }
        fileNum++;
      } catch {
        break;
      }
    }
  }

  async function searchMovies(keyword) {
    const container = document.querySelector(".search-results");
    const searchContainer = document.getElementById("search-movies-container");

    // Clear previous results and remove dynamic elements
    container.innerHTML = "";
    removeElementById("searchResultsHrBottom");
    removeElementById("searchResultsHrTopWrapper");

    if (!keyword) {
      alert("Please enter a search keyword");
      return;
    }

    // Show container
    searchContainer.style.display = "block";

    // Insert close button and top HR wrapped in flex container after heading
    const heading = searchContainer.querySelector("h4");
    if (heading) {
      const wrapperDiv = document.createElement("div");
      wrapperDiv.id = "searchResultsHrTopWrapper";
      wrapperDiv.style.display = "flex";
      wrapperDiv.style.alignItems = "center";
      wrapperDiv.style.justifyContent = "space-between";
      wrapperDiv.style.marginBottom = "15px";

      // Create hr
      const hrTop = document.createElement("hr");
      hrTop.style.flexGrow = "1";
      wrapperDiv.appendChild(hrTop);

      // Create close button
      const closeBtn = document.createElement("button");
      closeBtn.id = "fcloseSearchResultsBtn";
      closeBtn.textContent = "×";  // simple close character

      closeBtn.setAttribute("aria-label", "Close Search Results");

      // Style button to remove extra margins and spacing
      closeBtn.style.fontSize = "60px";   // reasonable size
      closeBtn.style.lineHeight = "1";    // remove extra line height space
      closeBtn.style.background = "transparent";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.flexShrink = "0";
      closeBtn.style.padding = "0";
      closeBtn.style.margin = "0";
      closeBtn.style.marginTop = "-20px";  // or any value like "5px", "1em"
      closeBtn.style.height = "auto";
      closeBtn.style.width = "auto";
      closeBtn.style.display = "inline-flex";
      closeBtn.style.alignItems = "center";
      closeBtn.style.justifyContent = "center";

      // Append and add event listener as before
      wrapperDiv.appendChild(closeBtn);
      heading.insertAdjacentElement("afterend", wrapperDiv);

      closeBtn.addEventListener("click", () => {
        container.innerHTML = "";
        searchContainer.style.display = "none";
        document.getElementById("fsearchMovieKeyword").value = "";
        wrapperDiv.remove();
        removeElementById("fsearchResultsHrBottom");
        document.body.style.overflowY = 'auto';
      });

    }

    const sharedResults = [];
    const platformIds = Object.keys(PLATFORM_INFO);
    const searchPromises = platformIds.map(platformId =>
      searchPlatform(platformId, keyword, sharedResults)
    );
    await Promise.all(searchPromises);
    displaySearchResults(sharedResults.slice(0, MAX_RESULTS));
  }

  function displaySearchResults(movies) {
    const container = document.querySelector(".search-results");
    container.innerHTML = "";

    if (movies.length === 0) {
      container.innerHTML = "<p>No movies found matching your search.</p>";
      return;
    }

    movies.forEach(m => {
      const titleForUrl = m.title.replace(/\s+/g, "+");
      const movieCard = document.createElement("div");
      movieCard.classList.add("col-6", "col-md-3", "col-lg-2", "movie-card");
      movieCard.innerHTML = `
      <a href="detail.html?name=${titleForUrl}&id=${m.id}&platformID=${m.platform}" class="text-decoration-none text-dark">
        <img src="${m.posterImg}" alt="${m.title}" class="poster" />
        <h5 class="mt-2">${m.title}</h5>
        <p class="text-muted">${m.genres}</p>
      </a>
    `;
      container.appendChild(movieCard);
    });

    // Add HR below results inside searchContainer
    const searchContainer = document.getElementById("search-movies-container");
    if (!document.getElementById("searchResultsHrBottom")) {
      const hrBottom = document.createElement("hr");
      hrBottom.id = "searchResultsHrBottom";
      searchContainer.appendChild(hrBottom);
    }
  }

  function removeElementById(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  document.getElementById('searchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('searchMovieKeyword').value.trim();
    searchMovies(keyword);
    document.getElementById("search-movies-container").style.display = "block";
  });

  // Initially hide search results container
  document.getElementById("search-movies-container").style.display = "none";


}


scroll_search();

function scroll_search() {



  const FMAX_RESULTS = 6;

  async function searchPlatform(platformId, keyword, sharedResults) {
    let fileNum = 1;
    while (true) {
      if (sharedResults.length >= FMAX_RESULTS) break;
      try {
        const response = await fetch(`./data/movies/${platformId}/movies-${fileNum}.json`);
        if (!response.ok) break;
        const movies = await response.json();

        for (const movie of movies) {
          if (sharedResults.length >= FMAX_RESULTS) break;
          if (movie.title && movie.title.toLowerCase().includes(keyword.toLowerCase())) {
            if (!sharedResults.some(m => m.id === movie.id && m.platform === platformId)) {
              sharedResults.push({ ...movie, platform: platformId });
            }
          }
        }
        fileNum++;
      } catch {
        break;
      }
    }
  }

  async function searchMovies(keyword) {
    const container = document.querySelector(".fsearch-results");
    const searchContainer = document.getElementById("fsearch-movies-container");

    // Clear previous results and remove dynamic elements
    container.innerHTML = "";
    removeElementById("fsearchResultsHrBottom");
    removeElementById("fsearchResultsHrTopWrapper");

    if (!keyword) {
      alert("Please enter a search keyword");
      return;
    }

    // Show container
    searchContainer.style.display = "block";

    // Insert close button and top HR wrapped in flex container after heading
    const heading = searchContainer.querySelector("h4");
    if (heading) {
      const wrapperDiv = document.createElement("div");
      wrapperDiv.id = "fsearchResultsHrTopWrapper";
      wrapperDiv.style.display = "flex";
      wrapperDiv.style.alignItems = "center";
      wrapperDiv.style.justifyContent = "space-between";
      wrapperDiv.style.marginBottom = "15px";

      // Create hr
      const hrTop = document.createElement("hr");
      hrTop.style.flexGrow = "1";
      hrTop.style.margin = "0 10px";
      wrapperDiv.appendChild(hrTop);

      // Create close button
      const closeBtn = document.createElement("button");
      closeBtn.id = "fcloseSearchResultsBtn";
      closeBtn.textContent = "×";  // simple close character

      closeBtn.setAttribute("aria-label", "Close Search Results");

      // Style button to remove extra margins and spacing
      closeBtn.style.fontSize = "60px";   // reasonable size
      closeBtn.style.lineHeight = "1";    // remove extra line height space
      closeBtn.style.background = "transparent";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.flexShrink = "0";
      closeBtn.style.padding = "0";
      closeBtn.style.margin = "0";
      closeBtn.style.marginTop = "-20px";  // or any value like "5px", "1em"

      closeBtn.style.height = "auto";
      closeBtn.style.width = "auto";
      closeBtn.style.display = "inline-flex";
      closeBtn.style.alignItems = "center";
      closeBtn.style.justifyContent = "center";

      // Append and add event listener as before
      wrapperDiv.appendChild(closeBtn);
      heading.insertAdjacentElement("afterend", wrapperDiv);

      closeBtn.addEventListener("click", () => {
        container.innerHTML = "";
        searchContainer.style.display = "none";
        document.getElementById("fsearchMovieKeyword").value = "";
        wrapperDiv.remove();
        removeElementById("fsearchResultsHrBottom");
        document.body.style.overflowY = 'auto';
      });

    }

    const sharedResults = [];
    const platformIds = Object.keys(PLATFORM_INFO);
    const searchPromises = platformIds.map(platformId =>
      searchPlatform(platformId, keyword, sharedResults)
    );
    await Promise.all(searchPromises);
    displaySearchResults(sharedResults.slice(0, FMAX_RESULTS));
  }

  function displaySearchResults(movies) {
    const container = document.querySelector(".fsearch-results");
    container.innerHTML = "";

    if (movies.length === 0) {
      container.innerHTML = "<p>No movies found matching your search.</p>";
      return;
    }

    movies.forEach(m => {
      const titleForUrl = m.title.replace(/\s+/g, "+");
      const movieCard = document.createElement("div");
      movieCard.classList.add("col-6", "col-md-3", "col-lg-2", "movie-card");
      movieCard.innerHTML = `
      <a href="detail.html?name=${titleForUrl}&id=${m.id}&platformID=${m.platform}" class="text-decoration-none text-dark">
        <img src="${m.posterImg}" alt="${m.title}" class="poster" />
        <h5 class="mt-2">${m.title}</h5>
        <p class="text-muted">${m.genres}</p>
      </a>
    `;
      container.appendChild(movieCard);
    });

    // Add HR below results inside searchContainer
    const searchContainer = document.getElementById("fsearch-movies-container");
    if (!document.getElementById("fsearchResultsHrBottom")) {
      const hrBottom = document.createElement("hr");
      hrBottom.id = "fsearchResultsHrBottom";
      searchContainer.appendChild(hrBottom);
    }
  }

  function removeElementById(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  document.getElementById('fsearchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('fsearchMovieKeyword').value.trim();
    searchMovies(keyword);
    document.getElementById("fsearch-movies-container").style.display = "block";
  });

  // Initially hide search results container
  document.getElementById("fsearch-movies-container").style.display = "none";


}