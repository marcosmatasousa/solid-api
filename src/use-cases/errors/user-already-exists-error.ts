import { AppError } from "./app-error";

export class UserAlreadyExistsError extends AppError {
  statusCode = 409;
  constructor() {
    super("E-mail already exists.");
  }
}
