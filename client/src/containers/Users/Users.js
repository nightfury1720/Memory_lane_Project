import React, { Component } from "react";
import User from "../../components/UserCard/UserCard";
import axios from "../../axios-root";
import Auxillary from "../../hoc/Auxillary/Auxillary";

import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

class Users extends Component {
  state = {
    users: null,
    error: false,
    loading: false,
    showModal: false,
  };

  componentDidMount() {
    axios
      .get("/users")
      .then((res) => {
        this.setState({ users: res.data.data.doc });
      })
      .catch((err) => console.log(err));
  }

  hideModal = () => {
    this.setState({ showModal: false });
  };

  listingHandler = (id, action) => {
    this.setState({ loading: true });
    console.log("request sent");
    axios
      .patch(`/users/${id}/${action}`, null)
      .then((res) => {
        if (res.data) {
          this.setState({
            loading: false,
            message: res.data.message,
            showModal: true,
          });
          // console.log(res);
          const updatedUsers = [...this.state.users];
          // console.log(updatedUsers);

          const myUserIndex = updatedUsers.indexOf(
            updatedUsers.find((x) => x._id === id)
          );
          // console.log(myUserIndex);
          let option = null;
          if (action === "blacklist") option = true;
          else option = false;
          const updatedUser = {
            ...updatedUsers[myUserIndex],
            blacklisted: option,
          };
          updatedUsers[myUserIndex] = updatedUser;
          this.setState({ users: updatedUsers });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  adminChangeHandler = (id, action) => {
    this.setState({ loading: true });
    // console.log("request sent");
    axios
      .patch(`/users/${id}/${action}Admin`, null)
      .then((res) => {
        if (res.data) {
          this.setState({
            loading: false,
            message: res.data.message,
            showModal: true,
          });
          // console.log(res);
          const updatedUsers = [...this.state.users];
          // console.log(updatedUsers);

          const myUserIndex = updatedUsers.indexOf(
            updatedUsers.find((x) => x._id === id)
          );
          // console.log(myUserIndex);
          let option = null;
          if (action === "make") option = "admin";
          else option = "user";
          const updatedUser = {
            ...updatedUsers[myUserIndex],
            role: option,
          };
          updatedUsers[myUserIndex] = updatedUser;
          this.setState({ users: updatedUsers });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  render() {
    let loader = null;
    if (this.state.error) loader = <h1>Some Error Ocuccred</h1>;
    if (this.state.loading) loader = <Spinner />;
    if (this.state.showModal)
      loader = (
        <Modal
          show={this.state.showModal}
          onHide={this.hideModal}
          title="Success"
          body={this.state.message}
          button="success"
        />
      );

    let users = null;
    if (this.state.users) {
      users = this.state.users.map((user) => {
        return (
          <User
            key={user._id}
            name={user.name}
            email={user.email}
            role={user.role}
            status={user.blacklisted}
            blacklist={() => this.listingHandler(user._id, "blacklist")}
            whitelist={() => this.listingHandler(user._id, "whitelist")}
            makeAdmin={() => this.adminChangeHandler(user._id, "make")}
            removeAdmin={() => this.adminChangeHandler(user._id, "remove")}
          />
        );
      });
    }
    return (
      <Auxillary>
        <Container>
          <h1 style={{ textAlign: "center" }} className="PageTitle">
            Users
          </h1>
          <Row>
            {loader}
            {users}
          </Row>
        </Container>
      </Auxillary>
    );
  }
}

export default Users;
