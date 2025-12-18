import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { IUsersRepository } from "@/repositories/users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-crendentials-error";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { create } from "domain";
import { ResourceNotFoundError } from "./errors/resource-not-found";

let usersRepository: IUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to retrieve user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "fulano@exemplo.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("Should throw an error for resource not found", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "fulano@exemplo.com",
      password_hash: await hash("123456", 6),
    });

    await expect(async () => {
      await sut.execute({
        userId: "any-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
