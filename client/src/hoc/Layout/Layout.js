import React, { Component } from "react";

import Auxillary from "../Auxillary/Auxillary";
import Nav from "../../components/UI/Nav/Nav";
import classes from "./Layout.module.css";

class Layout extends Component {
  state = {};
  render() {
    return (
      <Auxillary>
        <Nav cookies={this.props.cookies} />

        <main className={classes.Main}>
          <div className={classes.Container}>{this.props.children}</div>
        </main>
      </Auxillary>
    );
  }
}

export default Layout;
