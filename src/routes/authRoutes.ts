import axios from "axios";
import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string()
    })

    const { code } = bodySchema.parse(request.body)

    const acessTokenResponse = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id: process.env.GIT_HUB_CLIENT_ID,
        client_secret: process.env.GIT_HUB_CLIENT_SECRET,
        code
      },
      headers: {
        Accept: 'application/json'
      }
    })

    const { access_token } = acessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const userSchema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      avatar_url: z.string().url()
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          avatar: userInfo.avatar_url,
          email: userInfo.email,
          githubId: userInfo.id,
          name: userInfo.name
        }
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatar
      }, {
      sub: user.id,
      expiresIn: '30 days'
    })

    return {
      token
    }
  })


}