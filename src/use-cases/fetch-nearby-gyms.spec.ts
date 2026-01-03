import { expect, describe, it, beforeEach } from "vitest";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { Decimal } from "@prisma/client/runtime/client";
import { log } from "node:console";

let gymsRepository: IGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch User Check-In History Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("Should be able to fetch gym in under 10 kilometers", async () => {
    await gymsRepository.create({
      id: "gym-01",
      title: "Close Gym",
      description: "There's a gym nearby!",
      latitude: new Decimal(-22.8781902),
      longitude: new Decimal(-47.1228163),
      phone: "281-330-8004",
    });

    await gymsRepository.create({
      id: "gym-02",
      title: "Far Away Gym",
      description: "Definetly not a close gym.",
      latitude: new Decimal(-22.9983799),
      longitude: new Decimal(-47.0931523),
      phone: "281-330-8004",
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.878859,
      userLongitude: -47.123208,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ id: "gym-01", title: "Close Gym" }),
    ]);
  });
});
