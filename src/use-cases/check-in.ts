import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckinUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkinsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkinsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
