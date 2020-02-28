import React, { useEffect } from "react";
import { Info, ShoppingCart } from "react-feather";
import { BrowserRouter, Route } from "react-router-dom";
import { useAuth0 } from "./auth";
import { ApiProvider } from "./api";
import { ViewContainer, InfoView, PurchaseView } from "./views";
import { Toolbar, ToolbarItem } from "./components/common";

function App() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && loginWithRedirect) {
      loginWithRedirect({});
    }
  }, [isAuthenticated]); // eslint-disable-line

  return (
    <>
      {isAuthenticated && (
        <ApiProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ViewContainer>
              <button onClick={() => logout()}>Log out</button>
              <Route path="/" exact>
                <InfoView />
              </Route>
              <Route path="/purchase" exact>
                <PurchaseView />
              </Route>
            </ViewContainer>
            <Toolbar>
              <ToolbarItem icon={<Info />} path="/" />
              <ToolbarItem icon={<ShoppingCart />} path="/purchase" />
            </Toolbar>
          </BrowserRouter>
        </ApiProvider>
      )}
    </>
  );
}

export default App;
