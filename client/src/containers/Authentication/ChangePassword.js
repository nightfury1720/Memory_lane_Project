import React, { Component } from "react";

//form requirements
import { ChangePassword } from "./Forms";
import checkValidity from "./validityRules";

//axios
import axios from "../../axios-root";

//react components
import Spinner from "../../components/UI/Spinner/Spinner";
import Form from "../../components/Form/Form";
import Modal from "../../components/UI/Modal/Modal";

class ChangePasswordForm extends Component {
  state = {
    changePasswordForm: ChangePassword,
    loading: false,
    showModal: false,
    modalData: null,
    formisValid: false,
  };
  changePassHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.changePasswordForm) {
      formData[formElementIdentifier] = this.state.changePasswordForm[
        formElementIdentifier
      ].value;
    }

    axios
      .patch("/users/changePassword", formData)
      .then((response) => {
        if (response.data) {
          const modalData = {
            title: "Password Change Successful",
            message: `You will be redirected to HomePage`,
            Button: "success",
            hide: this.forwardToHome,
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
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
      ...this.state.changePasswordForm,
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
    this.setState({ changePasswordForm: updatedForm });
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
    for (let key in this.state.changePasswordForm) {
      formElementsArray.push({
        id: key,
        config: this.state.changePasswordForm[key],
      });
    }

    let form = (
      <Form
        img="ChangePass"
        title="Change Password"
        submitAction={this.changePassHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Enter and Confirm Your New Password Here"
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

export default ChangePasswordForm;
