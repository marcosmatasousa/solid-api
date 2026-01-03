import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckinUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: ICheckInsRepository;
let sut: ValidateCheckinUseCase;

describe("Validate Check-in Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckinUseCase(checkInsRepository);

    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate check in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });

  it("should be able to validate inexistent check in", async () => {
    await expect(async () => {
      await sut.execute({
        checkInId: "inexistent-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate check in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2026, 0, 1, 20, 30));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const TWENTY_FIVE_MINUTES_IN_MS = 1000 * 60 * 25;
    vi.advanceTimersByTime(TWENTY_FIVE_MINUTES_IN_MS);

    await expect(async () => {
      await sut.execute({ checkInId: createdCheckIn.id });
    }).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
