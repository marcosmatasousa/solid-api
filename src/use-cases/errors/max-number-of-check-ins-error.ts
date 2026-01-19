import { AppError } from "./app-error";

export class MaxNumberOfCheckInsError extends AppError {
  statusCode = 409;
  constructor() {
    super("Maximum number of check-ins exceeded.");
  }
}
