import React, { Component } from "react";

//components
import Form from "../../../components/Form/Form";
import Modal from "../../../components/UI/Modal/Modal";
import axios from "../../../axios-root";
import Spinner from "../../../components/UI/Spinner/Spinner";

//react router
import { Redirect } from "react-router-dom";

class NewPostForm extends Component {
  state = {
    newPostForm: null,
    loading: false,
    showModal: false,
    modalData: null,
    redirectPath: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    //getting the data from post
    axios
      .get(`/posts/${this.props.match.params.postId}`)
      .then((response) => {
        // console.log(response.data.data);

        let initial = {
          title: {
            elementType: "input",
            elementConfig: {
              type: "text",
              id: "PostTitle",
              placeholder: "Post Title",
            },
            value: "",
          },

          text: {
            elementType: "textarea",
            elementConfig: {
              id: "PostData",
              placeholder: "Start Writing Here",
            },
            value: "",
          },
        };
        initial.title.default = response.data.data.title;
        initial.title.value = response.data.data.title;
        initial.text.default = response.data.data.text;
        initial.text.value = response.data.data.text;
        this.setState({ newPostForm: initial });
        console.log(this.state.newPostForm);
        this.setState({ loading: false });
      })
      .catch((error) => console.log(error));
  }

  orderHandler = (event) => {
    //posting updated Data
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.newPostForm) {
      formData[formElementIdentifier] = this.state.newPostForm[
        formElementIdentifier
      ].value;
    }

    axios
      .post(`/posts/${this.props.match.params.postId}`, formData)

      .then((response) => {
        if (response.data) {
          // console.log(response.data.data);
          const modalData = {
            title: "Success",
            message: `Post Succesfully Updated`,
            Button: "success",
          };
          this.setState({
            loading: false,
            showModal: true,
            modalData: modalData,
          });
        } else {
          const modalData = {
            title: "Failed",
            message: response.response.data.message,
            Button: "danger",
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
    this.setState({ showModal: false, redirectPath: "/posts" });
  };

  render() {
    if (this.state.redirectPath)
      return <Redirect to={this.state.redirectPath} />;

    const formElementsArray = [];
    if (this.state.newPostForm) {
      for (let key in this.state.newPostForm) {
        formElementsArray.push({
          id: key,
          config: this.state.newPostForm[key],
        });
      }
    }
    let form = (
      <Form
        img="modifyPost"
        title="Modify Post"
        submitAction={this.orderHandler}
        elements={formElementsArray}
        changeHandler={this.inputChangedHandler}
        Description="Change your post here ...."
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
