import React from "react";

//bootstrap
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const userCard = (props) => {
  return (
    <Card style={{ width: "25rem", margin: "25px", marginBottom: "10px" }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          Role : {props.role} <br />
          Email : {props.email} <br />
          {props.status ? (
            <span style={{ color: "Red" }}> Blacklisted</span>
          ) : null}
        </Card.Text>
        {!props.status ? (
          <Button
            variant="dark"
            onClick={props.blacklist}
            style={{ margin: "5px" }}
          >
            Blacklist
          </Button>
        ) : (
          <Button onClick={props.whitelist}>WhiteList</Button>
        )}
        {props.role === "admin" && !props.status ? (
          <Button variant="danger" onClick={props.removeAdmin}>
            Remove Admin
          </Button>
        ) : props.role === "user" && !props.status ? (
          <Button variant="success" onClick={props.makeAdmin}>
            Make Admin
          </Button>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default userCard;
