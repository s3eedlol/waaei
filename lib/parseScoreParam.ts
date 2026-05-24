export function parseScoreParam(search: string, maxScore: number): number | null {
  const raw = new URLSearchParams(search).get("score");
  if (raw === null) return null;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n >= 0 && n <= maxScore ? n : null;
}
