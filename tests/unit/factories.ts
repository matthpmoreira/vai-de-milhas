import { faker } from "@faker-js/faker";
import { Miles } from "@prisma/client";
import { AffiliateStatus, Location, ServiceClass, Trip } from "protocols";

function fakeLocation(): Location {
  const lat = faker.location.latitude();
  const long = faker.location.longitude();

  return { lat, long };
}

function fakeServiceClass(): ServiceClass {
  const index = faker.number.int(3);
  return Object.values(ServiceClass)[index];
}

function fakeAffiliateStatus(): AffiliateStatus {
  const index = faker.number.int(3);
  return Object.values(AffiliateStatus)[index];
}

export function TripFactory(data: Partial<Trip> = {}): Trip {
  const code = faker.commerce.isbn();
  const origin = fakeLocation();
  const destination = fakeLocation();
  const miles = false;
  const plane = faker.airline.airplane().name;
  const service = fakeServiceClass();
  const affiliate = fakeAffiliateStatus();
  const date = faker.date.past().toISOString().slice(0, 10);

  return {
    code,
    origin,
    destination,
    miles,
    plane,
    service,
    affiliate,
    date,
    ...data,
  };
}

export function MilesFactory(): Miles {
  const id = faker.number.int();
  const code = faker.commerce.isbn();
  const miles = faker.number.int(2 ^ 31);

  return { id, code, miles };
}
