import React, { Component } from "react";

//react router
import { Redirect } from "react-router-dom";

//axios
import axios from "../../axios-root";

//react compponenets
import Spinner from "../../components/UI/Spinner/Spinner";
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";
import Auxillary from "../../hoc/Auxillary/Auxillary";

class GuestSession extends Component {
  state = {
    guestForm: null,
    loading: false,
    showModal: false,
    modalData: null,
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    axios
      .post("/users/guestSession", null)
      .then((response) => {
        // console.log(response);
        const modalData = {
          title: "Guest Session",
          message:
            "Guest Session has been created. \n You can create posts but not manage them.",
          Button: "success",
        };
        this.setState({
          loading: false,
          showModal: true,
          modalData: modalData,
        });
        const cookies = this.props.cookies;
        cookies.set("isAuthenticated", true, { path: "/" });
        cookies.set("userData", { user: { name: "Guest" } }, { path: "/" });
      })
      .catch((error) => {
        // console.log(error.message);

        const modalData = {
          title: "Guest Session Failed",
          // message: error.response,
          Button: "danger",
        };

        this.setState({
          loading: false,
          showModal: true,
          modalData: modalData,
        });
      });
  };

  hideModal = () => {
    this.setState({ showModal: false, redirectPath: "/posts" });
  };

  render() {
    if (this.state.redirectPath)
      return <Redirect to={this.state.redirectPath} />;

    const formElementsArray = [];

    let form = (
      <Form
        img="Guest"
        title="Continue As Guest"
        submitAction={this.submitHandler}
        elements={[]}
        Description="You can only create Posts anonymously not modify and delete them"
        link="Join Us Today !!"
        linkData="/users/signup"
        link2=""
        linkData2=""
        btnState={true}
      />
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    let modal = null;
    if (this.state.modalData)
      modal = (
        <Modal
          show={this.state.showModal}
          onHide={this.hideModal}
          title={this.state.modalData.title}
          body={this.state.modalData.message}
          button={this.state.modalData.Button}
        />
      );

    return (
      <Auxillary>
        {modal}
        {form}
      </Auxillary>
    );
  }
}

export default GuestSession;
