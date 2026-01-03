import { Prisma, Gym } from "@prisma/client";
import { FindManyNearbyParams, IGymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/client";
import { getDistanceBetweenCoordinates } from "../../utils/get-distance-between-cordinates";

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

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );
      return distance < 10;
    });
  }
}
