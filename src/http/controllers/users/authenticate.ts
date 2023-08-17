import { z } from "zod";
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { MakeAuthenticateUserUseCase } from "@/use-case/factories/make-authenticate-user-use-case";
import { InvalidCredentialsError } from "@/error/invalid-credential.error";

export async function authenticate(
  request: FastifyRequest,
  response: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = MakeAuthenticateUserUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await response.jwtSign(
      {
        email: user.email,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "1h",
          aud: "accessToken.API",
        },
      }
    );

    const refreshToken = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: "30d",
          aud: "refreshToken.API",
        },
      }
    );

    return response.status(200).send({
      token,
      refreshToken,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return response.status(400).send({
        message: err.message,
      });
    }

    throw err;
  }
}
