import React, { useEffect } from "react";
import { useAuth0 } from "./auth";

function App() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && loginWithRedirect) {
      loginWithRedirect({});
    }
  }, [isAuthenticated]); // eslint-disable-line

  return (
    <>
      {isAuthenticated && (
        <>
          {user && <p>{user.email}</p>}
          <button onClick={() => logout()}>Log out</button>
        </>
      )}
    </>
  );
}

export default App;
