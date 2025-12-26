import { Prisma, Gym } from "@prisma/client";
import { IGymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/client";

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const newGym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ? data.description : "",
      phone: data.phone ? data.phone : "",
      latitude: new Decimal(Number(data.latitude)),
      longitude: new Decimal(Number(data.longitude)),
    };

    this.gyms.push(newGym);

    return newGym;
  }

  async findById(gymId: string): Promise<Gym | null> {
    const checkIn = this.gyms.find((item) => gymId === item.id);

    if (checkIn) {
      return checkIn;
    }
    return null;
  }
}
