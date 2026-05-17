import { TestConfig, Question } from "./types";

export function calculateScore(
  answers: Record<number, number>,
  questions?: Question[],
  maxValue = 3
): number {
  return Object.entries(answers).reduce((sum, [idStr, value]) => {
    const id = Number(idStr);
    const question = questions?.find((q) => q.id === id);
    const score = question?.reversed ? maxValue - value : value;
    return sum + score;
  }, 0);
}

export function getScoreRange(score: number, config: TestConfig) {
  const range = config.scoreRanges.find(
    (r) => score >= r.min && score <= r.max
  );
  if (!range) throw new Error(`No score range found for score ${score}`);
  return range;
}
