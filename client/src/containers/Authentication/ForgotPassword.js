import React, { Component } from "react";

//form requirements
import { ForgotPass } from "./Forms";
import checkValidity from "./validityRules";

//axios
import axios from "../../axios-root";

//react components
import Spinner from "../../components/UI/Spinner/Spinner";
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";

class ForgotPasswordForm extends Component {
  state = {
    forgotPasswordForm: ForgotPass,
    loading: false,
    showModal: false,
    modalData: null,
    formisValid: false,
  };
  forgotPassHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.forgotPasswordForm) {
      formData[formElementIdentifier] = this.state.forgotPasswordForm[
        formElementIdentifier
      ].value;
    }

    axios
      .post("/users/forgotPassword", formData)
      .then((response) => {
        // console.log(response.response);
        // console.log(response.data);
        if (response.data) {
          const modalData = {
            title: "Please Check Your Email",
            message: `We have sent a code to your Email address \n ${formData["email"]}.\n  Paste it in the next screen appearing.`,
            Button: "success",
            hide: this.forgotToResetPassword,
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
        } else {
          const modalData = {
            title: "Email Does not Exist",
            message: `Please check email provided. Please give a valid email address`,
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
      ...this.state.forgotPasswordForm,
    };
    const updatedFormElement = {
      ...updatedForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
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
    updatedForm[inputIdentifier] = updatedFormElement;
    this.setState({ forgotPasswordForm: updatedForm });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  forgotToResetPassword = () => {
    this.setState({ showModal: false });
    this.props.history.push("/users/resetPassword");
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.forgotPasswordForm) {
      formElementsArray.push({
        id: key,
        config: this.state.forgotPasswordForm[key],
      });
    }

    let form = (
      <Form
        img="Forgot"
        title="Forgot Password"
        submitAction={this.forgotPassHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Enter your E-mail here to reset your Password"
        link="Already have a Reset Token ?"
        linkData="/users/ResetPassword"
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

export default ForgotPasswordForm;
