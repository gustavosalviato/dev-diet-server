import { FastifyInstance } from "fastify";

export async function verifyRefreshToken(
  token: string,
  fastify: FastifyInstance
): Promise<string> {
  return new Promise((resolve, reject) => {
    fastify.jwt.verify(
      token,
      {
        allowedAud: "refreshToken.API",
      },
      (err, decoded: any) => {
        if (err) {
          return reject(new Error("Invalid RefreshToken"));
        }
        resolve(decoded.sub);
      }
    );
  });
}
