import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: ICheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Fetch User Check-In History Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get check-in count for a given user", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
    });

    expect(checkIns).toEqual(2);
  });
});
