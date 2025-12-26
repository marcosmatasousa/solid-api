import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: ICheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Register Check-in Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Academia da boa",
      description: "Uma boa academia",
      latitude: new Decimal(-22.900338),
      longitude: new Decimal(-47.07729),
      phone: "281-330-8004",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2025, 11, 20, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.900338,
      userLongitude: -47.07729,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 11, 20, 12, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.900338,
      userLongitude: -47.07729,
    });

    await expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -22.900338,
        userLongitude: -47.07729,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in in different dates", async () => {
    vi.setSystemTime(new Date(2025, 11, 20, 12, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.900338,
      userLongitude: -47.07729,
    });

    vi.setSystemTime(new Date(2025, 11, 21, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.900338,
      userLongitude: -47.07729,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.create({
      id: "gym-02",
      title: "Academia da boa",
      description: "Uma boa academia",
      latitude: new Decimal(22.8940549),
      longitude: new Decimal(-47.0798433),
      phone: "281-330-8004",
    });

    await expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -22.900338,
        userLongitude: -47.07729,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
