import fastify from "fastify"

const app = fastify()

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP Server running")
    console.log("🔗 http://localhost:3333")
  })
