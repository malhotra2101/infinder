// Temporary dashboard API stub. Replaces removed DB-backed endpoints.
// Tries backend first; falls back to mocked values.

import { API_CONFIG } from '../config/config.js';
const API_BASE = `${API_CONFIG.BASE_URL}/api`;

async function safeFetchJson(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (_e) {
    return null;
  }
}

export async function getDashboardMetrics() {
  // Dead endpoint disabled; return safe defaults
  return {
    total_revenue: 0,
    total_campaigns: 0,
    active_influencers: 0,
    avg_engagement: 0,
  };
}

export async function getTopInfluencers(limit = 5) {
  // Dead endpoint disabled; return empty list
  return [];
}


