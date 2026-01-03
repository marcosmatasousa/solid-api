import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";

let gymsRepository: IGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to get gyms with a given query", async () => {
    await gymsRepository.create({
      id: "gym-01",
      title: "Academia da boa",
      description: "Uma boa academia",
      latitude: new Decimal(-22.900338),
      longitude: new Decimal(-47.07729),
      phone: "281-330-8004",
    });

    await gymsRepository.create({
      id: "gym-02",
      title: "Academia mais ou menos",
      description: "Uma academia mediana",
      latitude: new Decimal(-22.900338),
      longitude: new Decimal(-47.07729),
      phone: "281-330-8004",
    });

    const { gyms } = await sut.execute({
      query: "Academia da boa",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia da boa", id: "gym-01" }),
    ]);
  });

  it("should be able to get gyms with a given query", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `Academia ${i}`,
        description: "Definitivamente uma academia",
        latitude: new Decimal(-22.900338),
        longitude: new Decimal(-47.07729),
        phone: "281-330-8004",
      });
    }

    const { gyms } = await sut.execute({
      query: "Academia",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia 21", id: "gym-21" }),
      expect.objectContaining({ title: "Academia 22", id: "gym-22" }),
    ]);
  });
});
