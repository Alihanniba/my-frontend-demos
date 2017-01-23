import React from 'react';
import Nav from './Nav/Nav';
import Footer from './Footer/Footer';

/*
const renderPage = (route, navigator) => (
  <route.component key={route.key} navigator={navigator} />
);
*/

const App = ({children}) => (
  <div>
    <Nav />
      { children }
    <Footer />
  </div>
);

export default App;
