import React, { Component } from "react";

//react router
import { Redirect } from "react-router-dom";

//from requirements
import { Login } from "./Forms";
import checkValidity from "./validityRules";

//axios
import axios from "../../axios-root";

//react components
import Spinner from "../../components/UI/Spinner/Spinner";
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";

class LoginForm extends Component {
  state = {
    loginForm: Login,
    loading: false,
    showModal: false,
    modalData: null,
    redirectPath: null,
    formIsValid: false,
  };

  loginHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.loginForm) {
      formData[formElementIdentifier] =
        this.state.loginForm[formElementIdentifier].value;
    }

    axios
      .post("/users/login", formData)

      .then((response) => {
        if (response.data) {
          const modalData = {
            title: "Log In Succesful",
            message: `Welcome ${response.data.data.user.name}`,
            Button: "success",
            hide: this.fowardToHome,
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
            title: "Log In Failed",
            message: response.response.data.message,
            Button: "danger",
            hide: this.hideModal,
          };

          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = {
      ...this.state.loginForm,
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
    this.setState({ loginForm: updatedForm, formIsValid: formIsValid });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  fowardToHome = () => {
    this.setState({ showModal: false, redirectPath: "/posts" });
    // this.props.history.push("/");
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.loginForm) {
      formElementsArray.push({
        id: key,
        config: this.state.loginForm[key],
      });
    }

    let form = (
      <Form
        img="Login"
        title="Login"
        submitAction={this.loginHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Log into Your Account"
        link="Not A Member? 
        Join Us Today"
        linkData="/users/signup"
        link2="Forgot Password ?"
        linkData2="/users/forgotPassword"
        btnState={this.state.formIsValid}
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

export default LoginForm;
