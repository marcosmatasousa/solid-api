import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: ICheckInsRepository;
let sut: CheckInUseCase;

describe("Register Check-in Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

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
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 11, 20, 12, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    await expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-01",
      });
    }).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in in different dates", async () => {
    vi.setSystemTime(new Date(2025, 11, 20, 12, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    vi.setSystemTime(new Date(2025, 11, 21, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
