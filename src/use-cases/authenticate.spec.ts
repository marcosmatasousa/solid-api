import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { IUsersRepository } from "@/repositories/users-repository";
import { compare, hash } from "bcryptjs";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-crendentials-error";

let usersRepository: IUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "fulano@exemplo.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "fulano@exemplo.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong e-mail", async () => {
    await expect(async () => {
      await sut.execute({
        email: "fulano@exemplo.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "fulano@exemplo.com",
      password_hash: await hash("123456", 6),
    });

    await expect(async () => {
      await sut.execute({
        email: "fulano@exemplo.com",
        password: "123457",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
