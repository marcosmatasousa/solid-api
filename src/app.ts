import fastify from "fastify";
import { usersRoutes } from "@/http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import { ZodError, z } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { healthRoutes } from "./http/controllers/health/routes";
import { seed } from "../prisma/seed";
import { AppError } from "./use-cases/errors/app-error";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie);
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);
app.register(healthRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: z.treeifyError(error) });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  if (env.NODE_ENV !== "production") {
    console.log(error);
  }
  return reply.status(500).send({ message: "Internal server error." });
});

seed();
