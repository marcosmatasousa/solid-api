import { IUsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-crendentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { id } from "zod/v4/locales";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
