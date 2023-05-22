import fastify from "fastify"

const app = fastify()

app.get('/hello', () => {
  return 'oi'
})

app.listen({
  port: 3333,
}).then(() => console.log('http server running 🤖'))