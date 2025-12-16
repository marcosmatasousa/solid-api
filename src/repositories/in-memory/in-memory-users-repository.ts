import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const newUser = {
      id: "userid-1",
      password_hash: data.password_hash,
      name: data.name,
      email: data.email,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => email === item.email);

    if (!user) {
      return null;
    }
    return user;
  }
}
