import React, { Component } from "react";

//react router
import { Redirect } from "react-router-dom";

//axios
import axios from "../../axios-root";

//react components
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";

class Logout extends Component {
  state = {
    loading: false,
    showModal: false,
    redirectPath: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .post("/users/logout")
      .then((response) => {
        if (response.data) {
          const cookies = this.props.cookies;
          cookies.set("isAuthenticated", false, { path: "/" });
          cookies.set("userData", null, { path: "/" });
          this.setState({ laoding: false, showModal: true });
        } else {
          this.setState({ laoding: false });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  handleModalHide = () => {
    this.setState({ showModal: false, redirectPath: "/posts" });
  };

  render() {
    let logout = null;
    if (this.state.loading) logout = <Spinner />;

    let modal = (
      <Modal
        show={this.state.showModal}
        onHide={this.handleModalHide}
        title=" Success"
        body="Logout Successful"
        button="success"
      />
    );

    if (this.state.redirectPath) {
      return <Redirect to={this.state.redirectPath} />;
    }

    return (
      <div>
        {logout}
        {modal}
      </div>
    );
  }
}

export default Logout;
