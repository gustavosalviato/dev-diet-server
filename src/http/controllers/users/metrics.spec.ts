import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Metrics', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to get user metrics', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/user/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.metrics).toBeTruthy()
  })

})