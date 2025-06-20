// Haversine formula to calculate distance between two GPS coords
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert rating (e.g. 4.2) to star HTML
export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Format opening hours
export function getOpenStatus(merchant) {
  const now = new Date();
  const currentDay = now.getDay(); // Sunday = 0
  const currentHour = now.getHours();

  const open = merchant.hours?.[currentDay]?.open ?? 0;
  const close = merchant.hours?.[currentDay]?.close ?? 0;

  if (open === 0 && close === 0) return { isOpen: false, label: "Closed Today" };

  if (currentHour >= open && currentHour < close) {
    return { isOpen: true, label: "Open Now" };
  } else {
    return { isOpen: false, label: `Closed · Opens at ${open}:00` };
  }
}