import { AppError } from "./app-error";

export class LateCheckInValidationError extends AppError {
  statusCode = 409;
  constructor() {
    super("Check-in cannot be validated after 20 minutes of its creation.");
  }
}
