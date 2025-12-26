import { expect, describe, it, beforeEach } from "vitest";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: IGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "My Hero Academia",
      description: "Very good gym",
      phone: "333-333-333",
      latitude: -22.8940549,
      longitude: -47.0798433,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
