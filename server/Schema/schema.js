// Mongoose models

const Project = require('../models/Project');
const Client = require('../models/Client');


const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
  } = require('graphql');
  
  // Project Type
  const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      client: {
        type: ClientType,          //this is the client type that we defined above
        resolve(parent, args) {
          return Client.findById(parent.clientId); // parent is the project object
        },
      },
    }),
  });
  
  // Client Type
  const ClientType = new GraphQLObjectType({   // this is the client type that will be used in the schema
    name: 'Client',
    fields: () => ({                    // this is a function because we want to make sure that the fields are defined before they are used
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString },
    }),
  });
  
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      projects: {
        type: new GraphQLList(ProjectType),
        resolve(parent, args) {
          return Project.find();        // we don't need to pass any arguments because we want to return all the clients
        },
      },
      project: {
        type: ProjectType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return Project.findById(args.id);
        },
      },
      clients: {
        type: new GraphQLList(ClientType),
        resolve(parent, args) {
          return Client.find();
        },
      },
      client: {
        type: ClientType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return Client.findById(args.id);
        },
      },
    },
  });
  
  // Mutations
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      // Add a client
      addClient: {
        type: ClientType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
          phone: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve(parent, args) {
          const client = new Client({
            name: args.name,
            email: args.email,
            phone: args.phone,
          });
  
          return client.save();
        },
      },
      // Delete a client
      deleteClient: {
        type: ClientType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          Project.find({ clientId: args.id }).then((projects) => {
            projects.forEach(project => {
              project.remove()  // remove all the projects that belong to the client;
            });
          });
  
          return Client.findByIdAndRemove(args.id);
        },
      },
      // Add a project
      addProject: {
        type: ProjectType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          description: { type: GraphQLNonNull(GraphQLString) },
          status: {
            type: new GraphQLEnumType({
              name: 'ProjectStatus',
              values: {
                new: { value: 'Not Started' },
                progress: { value: 'In Progress' },
                completed: { value: 'Completed' },
              },
            }),
            defaultValue: 'Not Started',
          },
          clientId: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          const project = new Project({
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
          });
  
          return project.save();
        },
      },
      // Delete a project
      deleteProject: {
        type: ProjectType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          return Project.findByIdAndRemove(args.id);
        },
      },
      // Update a project
      updateProject: {
        type: ProjectType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          description: { type: GraphQLString },
          status: {
            type: new GraphQLEnumType({
              name: 'ProjectStatusUpdate',
              values: {
                new: { value: 'Not Started' },
                progress: { value: 'In Progress' },
                completed: { value: 'Completed' },
              },
            }),
          },
        },
        resolve(parent, args) {
          return Project.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name,
                description: args.description,
                status: args.status,
              },
            },
            { new: true }
          );
        },
      },
    },
  });

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});