import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Header from "./components/Header";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Home from './pages/Home';
import Project from './pages/Project';
import NotFound from './pages/NotFound';


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});


const client = new ApolloClient({           // Apollo Client is a state management library used to worked with graphql api
  uri: 'http://localhost:5000/graphql',
  cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
        <Header />
        <div className="container">
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path='*' element={<NotFound/>}/>
              <Route path="/projects/:id" element={<Project/>} />
              {/* <Route path="/clients" element={<h1>Clients</h1>} />
              <Route path="/projects" element={<h1>Projects</h1>} /> */}
            </Routes>
        </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
