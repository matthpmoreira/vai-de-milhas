import {
  applyHaversineFormula,
  calculateDistance,
  toRadius,
} from "services/distances-calculator-service";

beforeEach(jest.clearAllMocks);

describe("Tests for calculating distances", () => {
  it("should convert from degrees to radians correctly", () => {
    expect(toRadius(30)).toBeCloseTo(Math.PI / 6);
    expect(toRadius(45)).toBeCloseTo(Math.PI / 4);
    expect(toRadius(90)).toBeCloseTo(Math.PI / 2);
    expect(toRadius(180)).toBeCloseTo(Math.PI);
  });
});
