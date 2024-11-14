import app from "app";
import prisma from "database";
import supertest from "supertest";
import httpStatus from "http-status";
import { MilesFactory, TripFactory } from "../unit/factories";

const api = supertest(app);

beforeEach(() => {
  jest.clearAllMocks();
  prisma.miles.deleteMany();
});

describe("GET /miles/:code", () => {
  it("should return a Miles schema with code 200", async () => {
    const { id, ...miles } = MilesFactory();
    await prisma.miles.create({ data: miles });

    const { status, body } = await api.get("/miles/" + miles.code);

    expect(status).toEqual(httpStatus.OK);
    expect(body).toEqual({ id: expect.any(Number), ...miles });
  });

  it("should return code 404 if code is not in database", async () => {
    const { status } = await api.get("/miles/1");
    expect(status).toEqual(httpStatus.NOT_FOUND);
  });
});

describe("POST /miles", () => {
  it("should generate and return miles from a Trip schema with code 201", async () => {
    const trip = TripFactory();

    const { status, body } = await api.post("/miles").send(trip);

    expect(status).toEqual(httpStatus.CREATED);
    expect(body).toEqual({
      miles: expect.any(Number),
      code: trip.code,
    });
  });

  it("should return code 409 if trip has already had miles generated", async () => {
    const { id, ...miles } = MilesFactory();
    const trip = TripFactory({ code: miles.code });
    await prisma.miles.create({ data: miles });

    const { status } = await api.post("/miles").send(trip);

    expect(status).toEqual(httpStatus.CONFLICT);
  });

  it("should return code 422 if Trip schema has invalid values", async () => {
    const status = [] as number[];
    const trips = [
      TripFactory({ code: "" }),
      TripFactory({ origin: {} as any }),
      TripFactory({ destination: {} as any }),
      TripFactory({ miles: 99 as any }),
      TripFactory({ plane: "" }),
      TripFactory({ service: "INVALID" as any }),
      TripFactory({ affiliate: "INVALID" as any }),
      TripFactory({ date: "" }),
    ];

    for (const trip of trips) {
      const { status: code } = await api.post("/miles").send(trip);
      status.push(code);
    }

    expect(status).toEqual(
      Array(trips.length).fill(httpStatus.UNPROCESSABLE_ENTITY),
    );
  });
});
