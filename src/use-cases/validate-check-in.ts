import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckinUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckinUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckinUseCase {
  constructor(private checkinsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const MAX_ALIVE_TIME_IN_MINUTES = 20;
    const now = new Date();
    const timeAliveInMs = Math.abs(now.getTime() - checkIn.create_at.getTime());
    const timeAliveInMinutes = timeAliveInMs / (1000 * 60);

    if (timeAliveInMinutes >= MAX_ALIVE_TIME_IN_MINUTES) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkinsRepository.save(checkIn);

    return { checkIn };
  }
}
