const express = require('express');
require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./Schema/schema');

const port = process.env.PORT || 5000;
// Create express instnace
const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development', // use this so that when the app is in production, the graphiql is not available
}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// connect to database
connectDB();

