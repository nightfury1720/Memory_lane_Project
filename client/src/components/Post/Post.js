import React from "react";

//css
import classes from "./Post.module.css";

//react Component
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

//icons
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";

const post = (props) => {
  let dropdown = null;
  let like = <AiOutlineLike />;
  let dislike = <AiOutlineDislike />;

  const date = new Date(props.createdAt).toDateString();

  const cookies = props.cookies.cookies;

  const auth = cookies.isAuthenticated;
  const userData = cookies.userData;

  if (auth && userData && userData !== "undefined") {
    const authJSON = JSON.parse(auth);
    const userDataJSON = JSON.parse(userData);

    if (authJSON && userDataJSON) {
      const userRole = userDataJSON.user.role;
      const userId = userDataJSON.user._id;

      if ("admin" === userRole) {
        dropdown = (
          <DropdownButton
            id="dropdown-button"
            title=""
            variant=""
            style={{ display: "block", float: "right" }}
          >
            <Dropdown.Item onClick={props.blacklistClick}>
              Blacklist
            </Dropdown.Item>
          </DropdownButton>
        );
      }

      if ("admin" === userRole && props.blacklisted) {
        dropdown = (
          <DropdownButton
            id="dropdown-button"
            title=""
            variant=""
            style={{ display: "block", float: "right" }}
          >
            <Dropdown.Item onClick={props.whitelistClick}>
              Whitelist
            </Dropdown.Item>
          </DropdownButton>
        );
      }

      if (userId === props.user._id) {
        dropdown = (
          <DropdownButton
            id="dropdown-button"
            title=""
            variant=""
            style={{ display: "block", float: "right" }}
          >
            <Dropdown.Item onClick={props.modifyClick}>Modify</Dropdown.Item>
            <Dropdown.Item onClick={props.deleteClick}>Delete</Dropdown.Item>
          </DropdownButton>
        );
      }

      if (props.upvotedBy.includes(userId)) {
        // console.log("Upvoted yes");
        like = <AiFillLike />;
      }
      if (props.downvotedBy.includes(userId)) {
        // console.log("Downvoted Yes");
        dislike = <AiFillDislike />;
      }
    }
  }

  return (
    <Col lg={12} md={12} xs={12} sm={12}>
      <Card
        style={{
          margin: "20px 0px",
          marginBottom: "10px",
        }}
      >
        <div className={classes.Post}>
          <div className={classes.PostContent}>
            <Card.Title>
              <h4 className={classes.Title}>{props.title}</h4>
              {dropdown}
            </Card.Title>
            <Card.Body>
              <p>{props.body}</p>
            </Card.Body>

            <div className={classes.User}>
              <h6>
                <a
                  href={
                    props.user.name === "Guest"
                      ? null
                      : `/posts/userName/${props.user._id}`
                  }
                >
                  <b>{props.user.name}</b>
                </a>
              </h6>
              <h6>on {date}</h6>
            </div>
            <Card.Footer>
              <ul className={classes.Votes}>
                <li>
                  <button onClick={props.upvoteClick}>
                    {like}
                    {props.upvotes}
                  </button>
                </li>

                <li>
                  <button onClick={props.downvoteClick}>
                    {dislike}
                    {props.downvotes}
                  </button>
                </li>
              </ul>
            </Card.Footer>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default post;
