import { db } from "./firebase-init.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { calculateDistance, getOpenStatus, renderStars } from "./utils.js";

// Load merchants from Firestore and filter/sort based on input
export async function loadMerchants({ zip = "", coords = null, category = "" }) {
  const merchantSnap = await getDocs(collection(db, "merchants"));
  let merchants = [];

  merchantSnap.forEach(doc => {
    const data = doc.data();
    data.id = doc.id;

    // Category filter
    if (category && data.category !== category) return;

    // ZIP filter
    if (zip && data.zip !== zip) return;

    // GPS filter with 10km radius
    if (coords && data.location?.lat && data.location?.lng) {
      const dist = calculateDistance(
        coords.lat,
        coords.lng,
        data.location.lat,
        data.location.lng
      );
      if (dist > 10) return;
      data.distance = dist;
    }

    // Status
    const status = getOpenStatus(data);
    data.isOpen = status.isOpen;
    data.openLabel = status.label;

    merchants.push(data);
  });

  // Sort: distance if GPS, else name
  if (coords) {
    merchants.sort((a, b) => a.distance - b.distance);
  } else {
    merchants.sort((a, b) => a.name.localeCompare(b.name));
  }

  return merchants;
}