import React, { Component } from "react";

//form requirements
import { ResetPassword } from "./Forms";
import checkValidity from "./validityRules";

//axios
import axios from "../../axios-root";

//react components
import Spinner from "../../components/UI/Spinner/Spinner";
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";

class ResetPasswordForm extends Component {
  state = {
    resetPasswordForm: ResetPassword,
    loading: false,
    showModal: false,
    modalData: null,
    formisValid: false,
  };
  resetPassHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.resetPasswordForm) {
      formData[formElementIdentifier] = this.state.resetPasswordForm[
        formElementIdentifier
      ].value;
    }

    axios
      .patch("/users/resetPassword", formData)
      .then((response) => {
        if (response.data) {
          const modalData = {
            title: "Password Reset Succesful",
            message: `You will be redirected to HomePage`,
            Button: "success",
            hide: this.forwardToHome,
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
          const cookies = this.props.cookies;
          cookies.set("isAuthenticated", true, { path: "/" });
          cookies.set("userData", response.data.data, { path: "/" });
          // console.log(response.data);
        } else {
          const modalData = {
            title: "Error",
            message: `${response.response.data.message}`,
            Button: "danger",
            hide: this.hideModal,
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
          // console.log(response.response);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = {
      ...this.state.resetPasswordForm,
    };
    const updatedFormElement = {
      ...updatedForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedForm[inputIdentifier] = updatedFormElement;
    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    let formIsValid = true;
    updatedForm[inputIdentifier] = updatedFormElement;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ resetPasswordForm: updatedForm });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  forwardToHome = () => {
    this.setState({ showModal: false });
    this.props.history.push("/");
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.resetPasswordForm) {
      formElementsArray.push({
        id: key,
        config: this.state.resetPasswordForm[key],
      });
    }

    let form = (
      <Form
        img="Auth"
        title="Reset Password"
        submitAction={this.resetPassHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Reset Your Password"
        link=""
        linkData={null}
        btnState={this.state.formisValid}
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
          onHide={this.state.modalData.hide}
          title={this.state.modalData.title}
          body={this.state.modalData.message}
          button={this.state.modalData.Button}
        />
      );

    return (
      <div>
        {modal}
        {form}
      </div>
    );
  }
}

export default ResetPasswordForm;
