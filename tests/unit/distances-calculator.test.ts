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

  it("should calculate Haversine formula correctly", () => {
    const distanceKm = applyHaversineFormula(-1.5, 0.5, 2, 3.3, 6371);
    const distanceMiles = applyHaversineFormula(-1.5, 0.5, 2, 3.3, 3958.8);

    expect(distanceKm).toBeCloseTo(13638.2);
    expect(distanceMiles).toBeCloseTo(8474.48493319017);
  });
});
