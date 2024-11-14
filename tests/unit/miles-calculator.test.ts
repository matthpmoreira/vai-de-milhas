import { TripFactory } from "./factories";
import { AffiliateStatus, ServiceClass } from "protocols";
import { calculateMiles } from "services/miles-calculator-service";
import * as DistanceCalculator from "services/distances-calculator-service";

beforeEach(jest.clearAllMocks);

describe("Tests for calculating miles", () => {
  it("should correctly calculate miles when given a Trip schema", () => {
    const trips = [
      TripFactory({
        origin: { lat: -28, long: -48 },
        destination: { lat: 48, long: 16 },
        service: ServiceClass.EXECUTIVE,
        affiliate: AffiliateStatus.GOLD,
        date: "2023-05-17",
      }),
      TripFactory({
        origin: { lat: -28, long: -48 },
        destination: { lat: 48, long: 16 },
        service: ServiceClass.EXECUTIVE,
        affiliate: AffiliateStatus.GOLD,
        date: "2023-04-17",
      }),
    ];

    jest.spyOn(DistanceCalculator, "calculateDistance").mockReturnValue(98);

    const miles = trips.map((trip) => calculateMiles(trip));

    expect(miles).toEqual([202, 184]);
    expect(DistanceCalculator.calculateDistance).toHaveBeenCalledTimes(2);
  });

  it("should not calculate if trip was paid in miles", () => {
    const trip = TripFactory({ miles: true });

    const miles = calculateMiles(trip);

    expect(miles).toEqual(0);
  });
});
