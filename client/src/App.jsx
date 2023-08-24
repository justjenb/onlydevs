// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
// import Navbar from './components/Navbar';

// function App() {
//   return (
//     <Router>
//       <>
//         <Navbar />
//         <Routes>
//           <Route path='/' element={<Home />} />
//           <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} />
//         </Routes>
//       </>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
     <Router>
       <>
         <Navbar />
         <Routes>
           <Route path='/' element={<Home />} />
           <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} />
         </Routes>
       </>
     </Router>
    </ApolloProvider>
  );
}

export default App;
