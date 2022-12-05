import React, { Component } from "react";

//react router
import { Redirect } from "react-router-dom";

//form requirements
import { SignUpConfirm } from "./Forms";
import checkValidity from "./validityRules";

//axios
import axios from "../../axios-root";

//react components
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";

class SignUpConfirmForm extends Component {
  state = {
    signUpConfirmForm: SignUpConfirm,
    loading: false,
    showModal: false,
    modalData: null,
    redirectPath: null,
    formisValid: false,
  };

  signUpCnfHandler = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.signUpConfirmForm) {
      formData[formElementIdentifier] = this.state.signUpConfirmForm[
        formElementIdentifier
      ].value;
    }
    try {
      axios.patch("/users/signUpConfirm", formData).then((response) => {
        if (response.data) {
          const modalData = {
            title: "SignUp Done",
            message: "Welcome My Friend !! \n You're one of us now.",
            Button: "success",
            hide: this.forwardToHome,
            img: "celebrate",
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
          const cookies = this.props.cookies;
          cookies.set("isAuthenticated", true, { path: "/" });
          cookies.set("userData", response.data.data, { path: "/" });
        } else {
          const modalData = {
            title: "Sign Up Failed",
            message: response.response.data.message,
            Button: "danger",
            hide: this.hideModal,
            img: "wrong_token",
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
        }
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = {
      ...this.state.signUpConfirmForm,
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
    this.setState({ signUpConfirmForm: updatedForm });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  forwardToHome = () => {
    this.setState({ showModal: false, redirectPath: "/posts" });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.signUpConfirmForm) {
      formElementsArray.push({
        id: key,
        config: this.state.signUpConfirmForm[key],
      });
    }

    let form = (
      <Form
        img="signupCNF"
        title="Sign Up Confirm"
        submitAction={this.signUpCnfHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="You are just one Step to begin your fabulous journey on Chamber Of Secrets"
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
          img={this.state.modalData.img}
        />
      );

    if (this.state.redirectPath) {
      return <Redirect to={this.state.redirectPath} />;
    }

    return (
      <div>
        {modal}
        {form}
      </div>
    );
  }
}

export default SignUpConfirmForm;
