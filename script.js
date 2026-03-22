// =============================================================
//  TuniBless — script.js  (shared utilities + i18n + init)
// =============================================================

// ── Constants ─────────────────────────────────────────────────
const STATES = [
  "tunis","ariana","ben_arous","manouba","nabeul","zaghouan",
  "bizerte","beja","jendouba","kef","siliana","sousse","monastir",
  "mahdia","sfax","kairouan","kasserine","sidi_bouzid",
  "gabes","mednine","tataouine","gafsa","tozeur","kebili"
];
const POINTS_MAP = { normal: 10, big: 20, special: 30 };
const BADGE_RULES = {
  topState:     { icon: "🥇", key: "topState"     },
  mostActive:   { icon: "🔥", key: "mostActive"   },
  risingStar:   { icon: "🚀", key: "risingStar"   },
  impactLeader: { icon: "💎", key: "impactLeader" }
};

// ── i18n ───────────────────────────────────────────────────────
let translations = {};
let currentLang = localStorage.getItem("tbLang") || "ar";

async function loadTranslations(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem("tbLang", lang);
    applyTranslations();
    applyDir();
  } catch(e) { console.error("Failed to load translations:", e); }
}

function t(path) {
  const keys = path.split(".");
  let obj = translations;
  for (const k of keys) {
    if (!obj || typeof obj !== "object") return path;
    obj = obj[k];
  }
  return obj ?? path;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    const val = t(key);
    if (val) el.placeholder = val;
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    const val = t(key);
    if (val) el.title = val;
  });
}

function applyDir() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir  = currentLang === "ar" ? "rtl" : "ltr";
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.innerHTML = currentLang === "ar"
    ? '<span>🇩🇪</span> DE'
    : '<span>🇹🇳</span> عربي';
}

function toggleLang() {
  const next = currentLang === "ar" ? "de" : "ar";
  loadTranslations(next);
}

// ── Toast Notifications ────────────────────────────────────────
function showToast(msgKey, type = "success", rawMsg = null) {
  const msg = rawMsg || t(`toast.${msgKey}`);
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = { success: "✅", error: "❌", warning: "⚠️" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "fadeOut .4s ease forwards";
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ── Loading helpers ────────────────────────────────────────────
function showLoading(containerId, text = "") {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><p>${text || "Loading..."}</p></div>`;
}
function showEmpty(containerId, label = "") {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>${label || t("activity.noActivities")}</p></div>`;
}

// ── Badge assignment ───────────────────────────────────────────
function assignBadges(regions) {
  if (!regions.length) return regions;
  const sorted = [...regions].sort((a,b) => b.points - a.points);
  const maxActs = Math.max(...regions.map(r => r.activities));
  return regions.map(r => {
    const badges = [];
    if (r.state === sorted[0]?.state) badges.push("topState");
    if (r.activities === maxActs)     badges.push("mostActive");
    if (r.points >= 100 && r.points < 300) badges.push("risingStar");
    if (r.points >= 300)              badges.push("impactLeader");
    return { ...r, badges };
  });
}

function renderBadges(badges, lang) {
  if (!badges || !badges.length) return "";
  return badges.map(b => {
    const info = BADGE_RULES[b];
    if (!info) return "";
    const cls = b === "topState" ? "badge-top"
              : b === "mostActive" ? "badge-active"
              : b === "risingStar" ? "badge-rising" : "badge-impact";
    return `<span class="badge-chip ${cls}">${info.icon} ${t("badges."+info.key)}</span>`;
  }).join(" ");
}

// ── Hamburger menu ─────────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("navLinks");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
  document.addEventListener("click", e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove("open");
    }
  });
}

// ── Format date ────────────────────────────────────────────────
function fmtDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString(currentLang === "ar" ? "ar-TN" : "de-DE", {
    year: "numeric", month: "short", day: "numeric"
  });
}

// ── URL validation ─────────────────────────────────────────────
function isValidFbUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.includes("facebook.com") || u.hostname.includes("fb.com");
  } catch { return false; }
}

// ── DOM ready helper ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  await loadTranslations(currentLang);
  initHamburger();

  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);
});
