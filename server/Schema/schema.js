const { projects, clients } = require('../sampleData');

const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema, 
        GraphQLID,
        GraphQLList,
    } = require('graphql');

// Client Type

const ClientType = new GraphQLObjectType({       // this is the client type that will be used in the schema
    name: 'Client',
    fields: () => ({         // this is a function because we want to make sure that the fields are defined before they are used
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
});

// Project Type

const ProjectType = new GraphQLObjectType({       // this is the project type that will be used in the schema
    name: 'Project',
    fields: () => ({         // this is a function because we want to make sure that the fields are defined before they are used
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
    })
});


// root query - this is how we initially jump into the graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        // project query

        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects;        // we don't need to pass any arguments because we want to return all the clients
            }
            
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db / other source
                return projects.find(project => project.id === args.id);
            }
        },

        // client query

        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return clients;        // we don't need to pass any arguments because we want to return all the clients
            }
            
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db / other source
                return clients.find(client => client.id === args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});