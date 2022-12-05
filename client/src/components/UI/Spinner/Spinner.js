import React from "react";
import Spinner from "react-bootstrap/Spinner";

const spinner = () => {
  return (
    <div className="d-flex justify-content-center" style={{ margin: "7em" }}>
      <Spinner
        animation="border"
        size="lg"
        style={{ height: "5em", width: "5em" }}
      />
    </div>
  );
};

export default spinner;
