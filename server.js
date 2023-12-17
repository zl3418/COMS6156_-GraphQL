const { ApolloServer, gql } = require('apollo-server');
const mysql = require('mysql');

// Establish a connection to your MySQL database
const db = mysql.createConnection({
  host: 'adopter-1.ccixfecy4h7f.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Yy@2152215',
  database: 'ebdb'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Define your GraphQL schema
const typeDefs = gql`
  type Pet {
    PetID: Int
    Name: String
    Owner: String
    OwnerID: Int
    Category: String
    Age: Int
    Color: String
    Breeds: String
    Gender: String
    Height: Float
    Length: Float
    Weight: Float
    Picture: String
    Conditions: String
  }

  type Query {
    getPets: [Pet]
    getPet(PetID: Int!): Pet
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    getPets: () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Pets', (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
    },
    getPet: (_, { PetID }) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Pets WHERE PetID = ?', [PetID], (error, results) => {
          if (error) reject(error);
          else resolve(results[0]);
        });
      });
    },
  },
};

// Create the Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
