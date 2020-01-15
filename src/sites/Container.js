import React from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Home from "./Home";
import News from "./News";
import Contact from "./Contact";
import Imprint from "./Imprint";
import DataSecurity from "./DataSecurity";

function Container() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/imprint">Imprint</Link></li>
            <li><Link to="/datasecurity">DataSecurity</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route path="/news">
            <News />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/imprint">
            <Imprint />
          </Route>
          <Route path="/datasecurity">
            <DataSecurity />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default Container;