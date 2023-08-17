import { app } from "@/app";
import { InvalidTokenError } from "@/error/invalid-token-error";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";
import { verifyRefreshToken } from "@/utils/verify-refresh-token";

interface RefreshTokenUseCaseRequest {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ refreshToken }: RefreshTokenUseCaseRequest) {
    const userId = await verifyRefreshToken(refreshToken, app);

    if (!userId) {
      throw new InvalidTokenError();
    }

    const user = await this.usersRepository.findUserById(userId);

    return user;
  }
}
