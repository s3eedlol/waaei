import { describe, it, expect } from "vitest";
import { parseScoreParam } from "../parseScoreParam";

describe("parseScoreParam", () => {
  it("returns null when no score param present", () => {
    expect(parseScoreParam("", 27)).toBeNull();
  });
  it("parses a valid score", () => {
    expect(parseScoreParam("?score=12", 27)).toBe(12);
  });
  it("accepts score=0", () => {
    expect(parseScoreParam("?score=0", 27)).toBe(0);
  });
  it("accepts score equal to maxScore", () => {
    expect(parseScoreParam("?score=27", 27)).toBe(27);
  });
  it("returns null when score exceeds maxScore", () => {
    expect(parseScoreParam("?score=28", 27)).toBeNull();
  });
  it("returns null for non-numeric value", () => {
    expect(parseScoreParam("?score=abc", 27)).toBeNull();
  });
});
