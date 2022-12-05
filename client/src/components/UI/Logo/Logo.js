import React from "react";

//img
import deathlyHallows from "../../../assets/img/deathly.png";

//css
import classes from "./Logo.module.css";

const logo = (props) => (
  <div className={classes.Logo} style={{ height: props.height }}>
    <img src={deathlyHallows} alt="Hallows" />
  </div>
);

export default logo;
