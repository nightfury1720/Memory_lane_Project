import React from "react";

//hoc
import Auxillary from "../../../hoc/Auxillary/Auxillary";

//react components
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Figure from "react-bootstrap/Figure";

//images
import mail_img from "../../../assets/img/mail_sent.png";
import signUp_img from "../../../assets/img/celebrate.png";
import postSuccess from "../../../assets/img/post_sucess.png";
import net_error from "../../../assets/img/network_error.png";
import successful from "../../../assets/img/success.png";
import emptyPost from "../../../assets/img/empty_post.png";
import wrongToken from "../../../assets/img/wrong_token.jpg";
import forbidden from "../../../assets/img/forbidden.jpg";
import unauthorized from "../../../assets/img/unauthorized.png";

const modal = (props) => {
  let modalBody = <p>{props.body}</p>;
  let img = null;

  //styles if image is there
  const p_styles = {
    textAlign: "left",
    display: "inline-block",
    padding: "8%",
    wordWrap: "break-word",
    width: "60%",
    height: "60%",
  };
  const figure_styles = {
    float: "right",
    width: "40%",
    height: "40%",
    display: "inline-block",
  };

  // check is a success post w/o image if yes then success photo
  if (props.button === "success" && props.img === undefined) {
    modalBody = (
      <Auxillary>
        <p style={p_styles}>{props.body}</p>
        <Figure.Image
          src={successful}
          alt="Modal Image"
          style={figure_styles}
        />
      </Auxillary>
    );
  }

  //  check if img is there
  if (props.img) {
    switch (props.img) {
      case "mail":
        img = mail_img;
        break;
      case "celebrate":
        img = signUp_img;
        break;
      case "post_success":
        img = postSuccess;
        break;
      case "net_error":
        img = net_error;
        break;
      case "empty_post":
        img = emptyPost;
        break;
      case "wrong_token":
        img = wrongToken;
        break;
      case "forbidden":
        img = forbidden;
        break;
      case "unauthorized":
        img = unauthorized;
        break;
      default:
        img = null;
    }
    modalBody = (
      <Auxillary>
        <p style={p_styles}>{props.body}</p>
        <Figure.Image src={img} alt="Modal Image" style={figure_styles} />
      </Auxillary>
    );
  }

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant={props.button}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default modal;
