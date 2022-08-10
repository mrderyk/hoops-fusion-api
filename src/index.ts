import { createServer } from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import cors from 'cors';

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  app.use(cors());

  const apolloServer = new ApolloServer({
    schema,
    resolvers,
    csrfPrevention: true,
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
      app,
      path: '/api',
      cors: false,
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  )
};

startServer()