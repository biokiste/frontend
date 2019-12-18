import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppHeader from "./components/AppHeader";

function App() {
  return (
    <div className="App">
      <AppHeader logo={logo} link="https://reactjs.org" />
    </div>
  );
}

export default App;
