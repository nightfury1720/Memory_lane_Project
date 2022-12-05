import React, { Component } from "react";

//form requirements
import { SignUp } from "./Forms";
import checkValidity from "./validityRules";

//axios
import axios from "../../axios-root";

//react components
import Spinner from "../../components/UI/Spinner/Spinner";
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";

class SignUpForm extends Component {
  state = {
    signUpForm: SignUp,
    loading: false,
    showModal: false,
    modalData: null,
  };

  signUpHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.signUpForm) {
      formData[formElementIdentifier] = this.state.signUpForm[
        formElementIdentifier
      ].value;
    }
    axios
      .post("/users/signup", formData)
      .then((response) => {
        // console.log(response.response);
        // console.log(response.data);
        if (response.data) {
          const modalData = {
            title: "SignUp Step One Done",
            message: `${response.data.message} \n ${formData["email"]}`,
            Button: "success",
            hide: this.forwardToConfirm,
            img: "mail",
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
        } else {
          const modalData = {
            title: "Sign Up Failed",
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
      ...this.state.signUpForm,
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
    this.setState({ signUpForm: updatedForm });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  forwardToConfirm = () => {
    this.setState({ showModal: false });
    this.props.history.push("/posts");
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.signUpForm) {
      formElementsArray.push({
        id: key,
        config: this.state.signUpForm[key],
      });
    }

    let form = (
      <Form
        img="SignUp"
        title="SignUp"
        submitAction={this.signUpHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Join Us Today"
        link="Already a Member ?"
        linkData="/users/login"
        link2="Already Have a Confirmation Token?"
        linkData2="/users/signupConfirm"
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

    return (
      <div>
        {modal}
        {form}
      </div>
    );
  }
}

export default SignUpForm;
