import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { MakeRefreshTokenUseCase } from "@/use-case/factories/make-refresh-token-use-case";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const refreshBodySchema = z.object({
    refreshToken: z.string(),
  });

  const { refreshToken } = refreshBodySchema.parse(request.body);

  try {
    const refreshTokenUseCase = MakeRefreshTokenUseCase();

    const user = await refreshTokenUseCase.execute({
      refreshToken,
    });

    const newAccessToken = await reply.jwtSign(
      {
        email: user?.email,
      },
      {
        sign: {
          sub: user?.id,
          expiresIn: "1m",
          aud: "accessToken.API",
        },
      }
    );

    const newRefreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user?.id,
          expiresIn: "30d",
          aud: "refreshToken.API",
        },
      }
    );

    return reply.status(200).send({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    reply.status(401).send({ err });

    throw err;
  }
}
