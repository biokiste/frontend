import React, { useEffect } from "react";
import { Info, ShoppingCart, LogOut } from "react-feather";
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
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <ViewContainer>
            <ApiProvider>
              <Route path="/" exact>
                <InfoView />
              </Route>
              <Route path="/purchase" exact>
                <PurchaseView />
              </Route>
            </ApiProvider>
          </ViewContainer>
          <Toolbar>
            <ToolbarItem icon={<Info />} path="/" />
            <ToolbarItem icon={<ShoppingCart />} path="/purchase" />
            <ToolbarItem icon={<LogOut />} onClick={logout} />
          </Toolbar>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
