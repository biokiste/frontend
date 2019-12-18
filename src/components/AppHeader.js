import React from "react";
import PropTypes from "prop-types";

function AppHeader(props) {
  const { logo, link } = props;
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
      <a
        className="App-link"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
        </a>
    </header>
  )
}

AppHeader.propTypes = {
  /** Image shown before header text */
  logo: PropTypes.string.isRequired,
  /** Link provided in header text */
  link: PropTypes.string.isRequired,
};

export default AppHeader;