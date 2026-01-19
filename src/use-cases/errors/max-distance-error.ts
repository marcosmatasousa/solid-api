import { AppError } from "./app-error";

export class MaxDistanceError extends AppError {
  statusCode = 409;
  constructor() {
    super("Max distance reached.");
  }
}
