import { ValidateCheckinUseCase } from "../validate-check-in";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeValidateCheckInUseCase() {
  const checkinsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckinUseCase(checkinsRepository);

  return useCase;
}
