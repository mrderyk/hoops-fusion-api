export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    players: () => [
      {
        firstName: 'Michael',
        lastName: 'Jordan',
      },
      {
        firstName: 'Stephen',
        lastName: 'Curry',
      }
    ]
  },
};