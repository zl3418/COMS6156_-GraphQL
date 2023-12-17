const mysql = require('mysql');
const { ApolloServer, gql } = require('apollo-server');

// Database connection setup
const db = mysql.createConnection({
  host: 'podb.cejivocpp17r.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '12345678',
  database: 'podb',
  port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to database');
});

// Define your GraphQL schema
const typeDefs = gql`
  type PetOwner {
    PetOwnerID: String
    Name: String
    Email: String
    Telephone: String
    State: String
    City: String
    Pets: [Pet]
  }

  type Pet {
    // Define the fields for the Pet type based on your FastAPI model
  }

  input PetOwnerInput {
    Name: String
    Email: String
    Telephone: String
    State: String
    City: String
  }

  type Query {
    getOwner(id: String!): PetOwner
  }

  type Mutation {
    createPetOwner(petOwnerInput: PetOwnerInput!): PetOwner
    updatePetOwner(id: String!, petOwnerInput: PetOwnerInput!): PetOwner
    deletePetOwner(id: String!): String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    getOwner: async (_, { id }, { db }) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM PetOwners WHERE PetOwnerID = ?', [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
  },
  Mutation: {
    createPetOwner: async (_, { petOwnerInput }, { db }) => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO PetOwners (Name, Email, Telephone, State, City) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [petOwnerInput.Name, petOwnerInput.Email, petOwnerInput.Telephone, petOwnerInput.State, petOwnerInput.City], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ ...petOwnerInput, PetOwnerID: results.insertId });
          }
        });
      });
    },
    updatePetOwner: async (_, { id, petOwnerInput }, { db }) => {
      return new Promise((resolve, reject) => {
        const query = 'UPDATE PetOwners SET Name = ?, Email = ?, Telephone = ?, State = ?, City = ? WHERE PetOwnerID = ?';
        db.query(query, [petOwnerInput.Name, petOwnerInput.Email, petOwnerInput.Telephone, petOwnerInput.State, petOwnerInput.City, id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ ...petOwnerInput, PetOwnerID: id });
          }
        });
      });
    },
    deletePetOwner: async (_, { id }, { db }) => {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM PetOwners WHERE PetOwnerID = ?', [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(`Pet Owner ${id} deleted successfully`);
          }
        });
      });
    },
  },
};

// Create the Apollo Server instance
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: () => ({ db }) // Pass the db connection to resolvers
});

// Start the server
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});