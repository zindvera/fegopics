const PLATFORM_INFO = {
  "JioHotstar": {
    name: "JioHotstar",
    url: "https://www.jiocinema.com",
    defaultNote: "Free to watch with ads. Free signup required. No app install required."
  },
  "Zee5": {
    name: "Zee5",
    url: "https://www.zee5.com",
    defaultNote: "Free to watch with ads. Free signup required. No app install required."
  },
  "MXPlayer": {
    name: "MX Player",
    url: "https://www.mxplayer.in",
    defaultNote: "Free to watch with ads. No signup required. No app install required."
  },
  "Fawesome": {
    name: "Fawesome",
    url: "https://fawesome.tv",
    defaultNote: "Free to watch with ads. No signup required. No app install required."
  },
  "Filmzie": {
    name: "Filmzie",
    url: "https://filmzie.com",
    defaultNote: "Free to watch with ads. Signup optional. No app install required."
  },
  "FreeMoviesPlus": {
    name: "Free Movies Plus",
    url: "https://www.freemoviesplus.com",
    defaultNote: "Free to watch with ads. No signup required. No app install required."
  }
};



// Platforms and pagination - dynamic based on country (SAME as index.html)
let platforms = ["MXPlayer", "JioHotstar", "Zee5", "Fawesome", "Filmzie", "FreeMoviesPlus"];

// INDIA-ONLY platforms
const indiaOnlyPlatforms = ["JioHotstar"];