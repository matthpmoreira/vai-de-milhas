import { faker } from "@faker-js/faker";
import { MilesFactory, TripFactory } from "./factories";
import { generateMilesForTrip, getMilesFromCode } from "services/miles-service";
import * as MilesRepository from "repositories/miles-repository";
import * as MilesCalculator from "services/miles-calculator-service";

beforeEach(jest.clearAllMocks);

describe("Tests for retrieving a Miles schema", () => {
  it("should return a Miles schema when given a code", async () => {
    const miles = MilesFactory();

    jest.spyOn(MilesRepository, "findMiles").mockResolvedValueOnce(miles);

    const schema = await getMilesFromCode(miles.code);

    expect(schema).toEqual(miles);
    expect(MilesRepository.findMiles).toHaveBeenCalledTimes(1);
  });

  it("should throw 'not_found' if code does not exist in database", async () => {
    const code = faker.commerce.isbn();

    jest.spyOn(MilesRepository, "findMiles").mockResolvedValueOnce(null);

    const promise = getMilesFromCode(code);

    expect(MilesRepository.findMiles).toHaveBeenCalledTimes(1);
    expect(promise).rejects.toEqual({
      type: "not_found",
      message: `Miles not found for code ${code}`,
    });
  });
});

describe("Tests for creating a Miles schema", () => {
  it("should generate a Miles schema when given a Trip schema", async () => {
    const trip = TripFactory();
    const miles = faker.number.int();

    jest.spyOn(MilesRepository, "findMiles").mockResolvedValueOnce(null);
    jest.spyOn(MilesRepository, "saveMiles").mockResolvedValueOnce(null);
    jest.spyOn(MilesCalculator, "calculateMiles").mockReturnValueOnce(miles);

    const result = await generateMilesForTrip(trip);

    expect(result).toEqual(miles);
    expect(MilesRepository.findMiles).toHaveBeenCalledTimes(1);
    expect(MilesRepository.saveMiles).toHaveBeenCalledTimes(1);
    expect(MilesCalculator.calculateMiles).toHaveBeenCalledTimes(1);
  });

  it("should throw 'conflict' if code is already in database", async () => {
    const trip = TripFactory();
    const miles = MilesFactory();

    jest.spyOn(MilesRepository, "findMiles").mockResolvedValueOnce(miles);

    const promise = generateMilesForTrip(trip);
    expect(MilesRepository.findMiles).toHaveBeenCalledTimes(1);
    expect(promise).rejects.toEqual({
      type: "conflict",
      message: `Miles already registered for code ${trip.code}`,
    });
  });
});
