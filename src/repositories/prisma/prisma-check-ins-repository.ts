import { Prisma, CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = prisma.checkIn.create({
      data: {
        user_id: data.user_id,
        gym_id: data.gym_id,
      },
    });

    return checkIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        create_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const PAGE_SIZE = 20;
    const SKIP_AMOUNT = (page - 1) * PAGE_SIZE;

    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: SKIP_AMOUNT,
      take: PAGE_SIZE,
    });

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    const nums = await prisma.checkIn.count({ where: { user_id: userId } });

    return nums;
  }
}
