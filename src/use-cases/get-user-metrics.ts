import { ICheckInsRepository } from "../repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkIns: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkinsRepository: ICheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkIns = await this.checkinsRepository.countByUserId(userId);

    return { checkIns };
  }
}
