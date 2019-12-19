import React from 'react';
import logo from './logo.svg';
import AppHeader from "./components/AppHeader";

function App() {
  return (
    <div className="container mx-auto m-4 p-2 border rounded-lg">
      <AppHeader logo={logo} link="https://reactjs.org" />
    </div>
  );
}

export default App;
