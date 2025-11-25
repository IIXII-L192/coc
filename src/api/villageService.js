export async function fetchVillageFromApi(path) {
  const resp = await fetch(`/api/proxy?path=${encodeURIComponent(path)}`);
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  return await resp.json();
}

export function normalizeVillage(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Invalid village JSON");

  const resources = raw.resources || raw.player?.resources || raw.base?.resources || {};
  const gold = Number(resources.gold ?? raw.gold ?? 0);
  const elixir = Number(resources.elixir ?? raw.elixir ?? 0);
  const darkElixir = Number(resources.darkElixir ?? 0);
  const gems = Number(resources.gems ?? 0);
  const townHallLevel = Number(
    raw.townHallLevel ?? raw.town_hall_level ?? raw.townHall ?? raw.townhall ?? 0
  );

  const ongoing = raw.ongoing || raw.builderQueue || raw.inProgress || raw.upgrades || [];
  const buildings = raw.buildings || raw.structures || raw.defenses || [];

  return {
    metadata: {
      villageName: raw.name || raw.player?.name || null,
      clan: raw.clan || raw.player?.clanName || null,
      lastSaved: raw.saved_at || raw.updated_at || null,
      raw
    },
    resources: { gold, elixir, darkElixir, gems, townHallLevel },
    ongoing: Array.isArray(ongoing) ? ongoing : [ongoing],
    buildings: Array.isArray(buildings) ? buildings : [buildings],
    raw
  };
}

export function computeRecommendations(v) {
  const recs = [];
  const { gold, elixir } = v.resources;

  for (const b of v.buildings || []) {
    const costGold = Number(b.cost?.gold ?? 0);
    const costElixir = Number(b.cost?.elixir ?? 0);

    const name = b.name || b.type || "unknown";

    if ((costGold && costGold <= gold) || (costElixir && costElixir <= elixir)) {
      recs.push({
        name,
        cost: { gold: costGold, elixir: costElixir },
        reason: "Affordable now"
      });
    }
  }

  return recs;
}
