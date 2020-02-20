import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import { useAuth0 } from "./context/AuthContext";
import { history } from "./utils/router";

function Test(props) {
  const { path } = props;
  const {
    user,
    loading,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  console.log(loading, user);
  console.log("isAuthenticated", isAuthenticated);

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
}

function App() {
  const {
    user,
    loading,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl:  },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);
  return (
    <Router history={history}>
      <Route path="/" exact />
      <Route path="/test">
        <Test path="/test" />
      </Route>
    </Router>
  );
}

export default App;
