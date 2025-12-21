// --- Global Fuzzy Search Utility ---
const FuzzySearcher = {
  levenshtein: function(a, b) {
    const tmp = [];
    for (let i = 0; i <= a.length; i++) tmp[i] = [i];
    for (let j = 0; j <= b.length; j++) tmp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        tmp[i][j] = a[i - 1] === b[j - 1] 
          ? tmp[i - 1][j - 1] 
          : Math.min(tmp[i - 1][j - 1] + 1, tmp[i][j - 1] + 1, tmp[i - 1][j] + 1);
      }
    }
    return tmp[a.length][b.length];
  },

  getScore: function(text, keyword) {
    if (!text || !keyword) return Infinity;
    const target = text.toLowerCase().trim();
    const query = keyword.toLowerCase().trim();
    
    // 1. Exact Full Match (Highest Priority)
    if (target === query) return 0;
    
    // 2. Substring Match (Includes "Baaghi" matches "Baaghi 3")
    if (target.includes(query)) return 0.1;

    // 3. Exact Word Match (Handles multi-word queries like "tamil movie dev")
    const targetWords = target.split(/[\s()\-]+/); 
    const queryWords = query.split(/\s+/);
    
    for (const qWord of queryWords) {
      if (qWord.length < 3) continue; 
      if (targetWords.includes(qWord)) return 0.3; // Found a key word in title
    }

    // 4. Word-by-Word Fuzzy Match (Handles "baghi" -> "baaghi")
    for (const tWord of targetWords) {
      if (tWord.length < 3) continue;
      const dist = this.levenshtein(tWord, query);
      // Allow 1 mistake for every 3 characters
      if (dist <= Math.max(1, Math.floor(tWord.length / 3))) {
        return dist + 1; // Fuzzy word hit
      }
    }

    // 5. Full String Fuzzy (Backup for complex queries)
    const fullDist = this.levenshtein(target, query);
    const maxAllowed = Math.max(2, Math.floor(target.length / 3));
    return fullDist <= maxAllowed ? fullDist + 2 : Infinity;
  }
};

static_search();

function static_search() {
  const MAX_RESULTS = 6;

  async function searchPlatform(platformId, keyword, sharedResults) {
    let fileNum = 1;
    while (true) {
      if (sharedResults.length >= MAX_RESULTS * 5) break; 
      try {
        const response = await fetch(`./data/movies/${platformId}/movies-${fileNum}.json`);
        if (!response.ok) break;
        const movies = await response.json();

        for (const movie of movies) {
          const titleScore = FuzzySearcher.getScore(movie.title || "", keyword);
          const descScore = FuzzySearcher.getScore(movie.description || "", keyword);

          // Priority: Title is always better than description
          let finalScore = Math.min(titleScore, descScore + 5);

          if (finalScore !== Infinity) {
            if (!sharedResults.some(m => m.id === movie.id && m.platform === platformId)) {
              sharedResults.push({ ...movie, platform: platformId, searchScore: finalScore });
            }
          }
        }
        fileNum++;
      } catch { break; }
    }
  }

  async function searchMovies(keyword) {
    const container = document.querySelector(".search-results");
    const searchContainer = document.getElementById("search-movies-container");

    container.innerHTML = "";
    removeElementById("searchResultsHrBottom");
    removeElementById("searchResultsHrTopWrapper");

    if (!keyword) {
      alert("Please enter a search keyword");
      return;
    }

    searchContainer.style.display = "block";

    const heading = searchContainer.querySelector("h4");
    if (heading) {
      const wrapperDiv = document.createElement("div");
      wrapperDiv.id = "searchResultsHrTopWrapper";
      wrapperDiv.style.display = "flex";
      wrapperDiv.style.alignItems = "center";
      wrapperDiv.style.justifyContent = "space-between";
      wrapperDiv.style.marginBottom = "15px";

      const hrTop = document.createElement("hr");
      hrTop.style.flexGrow = "1";
      wrapperDiv.appendChild(hrTop);

      const closeBtn = document.createElement("button");
      closeBtn.id = "fcloseSearchResultsBtn";
      closeBtn.textContent = "×";
      closeBtn.style.fontSize = "60px";
      closeBtn.style.lineHeight = "1";
      closeBtn.style.background = "transparent";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.marginTop = "-20px";

      wrapperDiv.appendChild(closeBtn);
      heading.insertAdjacentElement("afterend", wrapperDiv);

      closeBtn.addEventListener("click", () => {
        container.innerHTML = "";
        searchContainer.style.display = "none";
        document.getElementById("searchMovieKeyword").value = "";
        wrapperDiv.remove();
        removeElementById("searchResultsHrBottom");
        document.body.style.overflowY = 'auto';
      });
    }

    const sharedResults = [];
    const platformIds = Object.keys(PLATFORM_INFO);
    await Promise.all(platformIds.map(id => searchPlatform(id, keyword, sharedResults)));

    const sortedResults = sharedResults
      .sort((a, b) => a.searchScore - b.searchScore)
      .slice(0, MAX_RESULTS);

    displaySearchResults(sortedResults);
  }

  function displaySearchResults(movies) {
    const container = document.querySelector(".search-results");
    container.innerHTML = "";

    if (movies.length === 0) {
      container.innerHTML = "<p>No movies found matching your search.</p>";
      return;
    }

    movies.forEach(m => {
      const titleForUrl = (m.title || "Untitled").replace(/\s+/g, "+");
      const movieCard = document.createElement("div");
      movieCard.classList.add("col-6", "col-md-3", "col-lg-2", "movie-card");
      movieCard.innerHTML = `
        <a href="detail.html?name=${titleForUrl}&id=${m.id}&platformID=${m.platform}" class="text-decoration-none text-dark">
          <img src="${m.posterImg}" alt="${m.title || 'Movie'}" class="poster" />
          <h5 class="mt-2">${m.title || "Untitled"}</h5>
          <p class="text-muted">${m.genres || ""}</p>
        </a>`;
      container.appendChild(movieCard);
    });

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
  });

  document.getElementById("search-movies-container").style.display = "none";
}

scroll_search();

function scroll_search() {
  const FMAX_RESULTS = 6;

  async function searchPlatform(platformId, keyword, sharedResults) {
    let fileNum = 1;
    while (true) {
      if (sharedResults.length >= FMAX_RESULTS * 5) break;
      try {
        const response = await fetch(`./data/movies/${platformId}/movies-${fileNum}.json`);
        if (!response.ok) break;
        const movies = await response.json();

        for (const movie of movies) {
          const titleScore = FuzzySearcher.getScore(movie.title || "", keyword);
          const descScore = FuzzySearcher.getScore(movie.description || "", keyword);

          let finalScore = Math.min(titleScore, descScore + 5);

          if (finalScore !== Infinity) {
            if (!sharedResults.some(m => m.id === movie.id && m.platform === platformId)) {
              sharedResults.push({ ...movie, platform: platformId, searchScore: finalScore });
            }
          }
        }
        fileNum++;
      } catch { break; }
    }
  }

  async function searchMovies(keyword) {
    const container = document.querySelector(".fsearch-results");
    const searchContainer = document.getElementById("fsearch-movies-container");

    container.innerHTML = "";
    removeElementById("fsearchResultsHrBottom");
    removeElementById("fsearchResultsHrTopWrapper");

    if (!keyword) {
      alert("Please enter a search keyword");
      return;
    }

    searchContainer.style.display = "block";

    const heading = searchContainer.querySelector("h4");
    if (heading) {
      const wrapperDiv = document.createElement("div");
      wrapperDiv.id = "fsearchResultsHrTopWrapper";
      wrapperDiv.style = "display:flex; align-items:center; justify-content:space-between; margin-bottom:15px;";

      const hrTop = document.createElement("hr");
      hrTop.style.flexGrow = "1";
      hrTop.style.margin = "0 10px";
      wrapperDiv.appendChild(hrTop);

      const closeBtn = document.createElement("button");
      closeBtn.id = "fcloseSearchResultsBtn";
      closeBtn.textContent = "×";
      closeBtn.style.fontSize = "60px";
      closeBtn.style.lineHeight = "1";
      closeBtn.style.background = "transparent";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.marginTop = "-20px";

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
    await Promise.all(platformIds.map(id => searchPlatform(id, keyword, sharedResults)));

    const sortedResults = sharedResults
      .sort((a, b) => a.searchScore - b.searchScore)
      .slice(0, FMAX_RESULTS);

    displaySearchResults(sortedResults);
  }

  function displaySearchResults(movies) {
    const container = document.querySelector(".fsearch-results");
    container.innerHTML = "";

    if (movies.length === 0) {
      container.innerHTML = "<p>No movies found matching your search.</p>";
      return;
    }

    movies.forEach(m => {
      const titleForUrl = (m.title || "Untitled").replace(/\s+/g, "+");
      const movieCard = document.createElement("div");
      movieCard.classList.add("col-6", "col-md-3", "col-lg-2", "movie-card");
      movieCard.innerHTML = `
        <a href="detail.html?name=${titleForUrl}&id=${m.id}&platformID=${m.platform}" class="text-decoration-none text-dark">
          <img src="${m.posterImg}" alt="${m.title || 'Movie'}" class="poster" />
          <h5 class="mt-2">${m.title || "Untitled"}</h5>
          <p class="text-muted">${m.genres || ""}</p>
        </a>`;
      container.appendChild(movieCard);
    });

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
  });

  document.getElementById("fsearch-movies-container").style.display = "none";
}