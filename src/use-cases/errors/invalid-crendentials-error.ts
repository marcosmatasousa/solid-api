import { AppError } from "./app-error";

export class InvalidCredentialsError extends AppError {
  statusCode = 401;
  constructor() {
    super("Invalid credentials.");
  }
}
