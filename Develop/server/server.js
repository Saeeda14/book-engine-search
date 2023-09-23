const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const server = new ApolloServer({
  typeDefs,       
  resolvers,    
  context: ({ req }) => {
    // Retrieve the authorization header from the request
    const token = req.headers.authorization || '';

    // If there's no token, return an empty context
    if (!token) {
      return {};
    }

    try {
     
      const user = jwt.verify(token, 'YOUR_SECRET_KEY');

      return { user };
    } catch (error) {
      throw new Error('Authentication failed');
    }
  },
});

server.applyMiddleware({ app });

db.once('open', () => {
  console.log('Connected to the database');

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`🌍 Server is running on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL is ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

