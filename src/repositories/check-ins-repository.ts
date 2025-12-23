import { Prisma, CheckIn } from "@prisma/client";

export interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findById(id: string): Promise<CheckIn | null>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
