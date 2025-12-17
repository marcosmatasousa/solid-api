import { expect, describe, it, beforeAll, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register";
import { IUsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: IUsersRepository;
let registerUserUseCase: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUserUseCase = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await registerUserUseCase.execute({
      name: "Fulano",
      email: "fulano@exemplo.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerUserUseCase.execute({
      name: "Fulano",
      email: "fulano@exemplo.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to registrate with same email twice", async () => {
    const { user } = await registerUserUseCase.execute({
      name: "Fulano",
      email: "fulano@exemplo.com",
      password: "123456",
    });

    await expect(async () => {
      await registerUserUseCase.execute({
        name: "Fulano",
        email: "fulano@exemplo.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
