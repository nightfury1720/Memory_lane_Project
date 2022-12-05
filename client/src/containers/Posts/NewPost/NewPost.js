import React, { Component } from "react";
import { newPost } from "../../Authentication/Forms";
import Form from "../../../components/Form/Form";
import Modal from "../../../components/UI/Modal/Modal";
import axios from "../../../axios-root";
import Spinner from "../../../components/UI/Spinner/Spinner";

class NewPostForm extends Component {
  state = {
    newPostForm: newPost,
    loading: false,
    showModal: false,
    modalData: null,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.newPostForm) {
      formData[formElementIdentifier] = this.state.newPostForm[
        formElementIdentifier
      ].value;
    }

    axios
      .post("/posts", formData)
      .then((response) => {
        // console.log(response);
        if (response.data) {
          if (response.data.status === "success") {
            const modalData = {
              title: "Success",
              message: `Post Succesfully created`,
              Button: "success",
              img: "post_success",
            };
            this.setState({
              loading: false,
              showModal: true,
              modalData: modalData,
            });
          }
        } else {
          const modalData = {
            title: "Failed",
            message: response.response.data.message,
            Button: "danger",
            img: "empty_post",
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = {
      ...this.state.newPostForm,
    };
    const updatedFormElement = {
      ...updatedForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedForm[inputIdentifier] = updatedFormElement;
    this.setState({ newPostForm: updatedForm });
  };

  hideModal = () => {
    this.setState({ showModal: false, modalData: null });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.newPostForm) {
      formElementsArray.push({
        id: key,
        config: this.state.newPostForm[key],
      });
    }

    let form = (
      <Form
        img="newPost"
        title="Create a Post"
        submitAction={this.orderHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Write down your views here...."
        link=""
        linkData=""
        link2=""
        linkData2=""
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

export default NewPostForm;
