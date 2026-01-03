import { prisma } from "@/lib/prisma";
import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, IGymsRepository } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";

export class PrismaGymsRepository implements IGymsRepository {
  async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data: {
        title: data.title,
        description: data.description ? data.description : "",
        phone: data.phone ? data.phone : "",
        latitude: new Decimal(Number(data.latitude)),
        longitude: new Decimal(Number(data.longitude)),
      },
    });

    return gym;
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    });

    return gym;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const PAGE_SIZE = 20;
    const SKIP_AMOUNT = (page - 1) * PAGE_SIZE;

    const gyms = await prisma.gym.findMany({
      where: {
        title: query,
      },
      skip: SKIP_AMOUNT,
      take: PAGE_SIZE,
    });

    return gyms;
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 10;
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT *
      FROM "Gym"
      WHERE (
        6371 * acos(
          cos(radians(${latitude})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(latitude))
        )
      ) <= ${MAX_DISTANCE_IN_KILOMETERS}
    `;

    return gyms;
  }
}
