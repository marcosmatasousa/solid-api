import { AppError } from "./app-error";

export class ResourceNotFoundError extends AppError {
  statusCode = 409;
  constructor() {
    super("Resource not found.");
  }
}
