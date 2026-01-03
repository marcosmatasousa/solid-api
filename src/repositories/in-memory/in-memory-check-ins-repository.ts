import { Prisma, CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkins: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const newCheckIn: CheckIn = {
      id: randomUUID(),
      create_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.checkins.push(newCheckIn);

    return newCheckIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkins.find((item) => id === item.id);

    if (checkIn) {
      return checkIn;
    }
    return null;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const checkIn = this.checkins.find(
      (item) =>
        item.user_id === userId &&
        item.create_at.getFullYear() === date.getFullYear() &&
        item.create_at.getMonth() === date.getMonth() &&
        item.create_at.getDate() === date.getDate()
    );

    if (checkIn) {
      return checkIn;
    }
    return null;
  }

  async findManyByUserId(userId: string): Promise<CheckIn[]> {
    return this.checkins.filter((item) => item.user_id === userId);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkins.filter((item) => item.user_id === userId).length;
  }
}
