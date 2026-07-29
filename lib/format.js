export function formatFCFA(n) {
  return Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";
}

export function genOrderNumber() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(2);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${y}${m}${day}-${rand}`;
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
