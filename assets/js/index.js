import { loadMerchants } from "./db.js";

// DOM elements
const zipInput = document.getElementById("zip-input");
const searchBtn = document.getElementById("search-zip");
const gpsBtn = document.getElementById("use-gps");
const categorySelect = document.getElementById("category-filter");
const list = document.getElementById("merchant-list");

let lastCoords = null;

// Skeleton loader
function showSkeletons(count = 4) {
  list.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skel = document.createElement("div");
    skel.className = "card skeleton";
    list.appendChild(skel);
  }
}

// Render merchant cards
function renderMerchants(merchants) {
  list.innerHTML = "";

  if (merchants.length === 0) {
    list.innerHTML = "<p>No merchants found in this area.</p>";
    return;
  }

  merchants.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    if (!m.isOpen) card.classList.add("closed");

    const distance = m.distance ? `<div class="badge">${m.distance.toFixed(1)} km</div>` : "";
    const featured = m.featured ? `<div class="badge featured">★ Featured</div>` : "";

    card.innerHTML = `
      <img src="${m.logo || 'https://via.placeholder.com/300x140'}" alt="${m.name}" />
      <h3>${m.name}</h3>
      <div class="badges">
        <div class="badge">${m.dinein ? "Dine-in" : ""}</div>
        <div class="badge">${m.takeaway ? "Takeaway" : ""}</div>
        ${distance}
        ${featured}
      </div>
      <div style="margin-top:0.5rem;">
        ${m.openLabel} · ${renderStars(m.avgRating || 0)} (${m.ratingCount || 0})
      </div>
    `;

    card.onclick = () => {
      window.location.href = `/browse.html?merchant=${m.id}`;
    };

    list.appendChild(card);
  });
}

// Load based on ZIP
async function loadByZip() {
  showSkeletons();
  const zip = zipInput.value.trim();
  const category = categorySelect.value;
  const merchants = await loadMerchants({ zip, category });
  renderMerchants(merchants);
}

// Load based on GPS
function loadByLocation() {
  showSkeletons();
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const coords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    lastCoords = coords;
    const category = categorySelect.value;
    const merchants = await loadMerchants({ coords, category });
    renderMerchants(merchants);
  }, err => {
    alert("Could not access your location.");
  });
}

// Filter on category change
categorySelect.addEventListener("change", () => {
  if (lastCoords) {
    loadByLocation();
  } else {
    loadByZip();
  }
});

searchBtn.addEventListener("click", loadByZip);
gpsBtn.addEventListener("click", loadByLocation);