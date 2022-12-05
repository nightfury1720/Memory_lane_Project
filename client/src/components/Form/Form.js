import React from "react";

//react components
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import InputElements from "./InputElements/InputElements.js";

//css
import styles from "./Form.module.css";

//images
import Login from "../../assets/img/login.png";
import signUp from "../../assets/img/signin.png";
import Auth from "../../assets/img/auth.png";
import Forgot from "../../assets/img/forgot_password.png";
import Post from "../../assets/img/newPost.png";
import ModifyPost from "../../assets/img/modifyPost.png";
import SignUpCNF from "../../assets/img/SignUpCNF.png";
import Guest from "../../assets/img/guest.png";
import ChangePassword from "../../assets/img/reset_pass.jpg";

const form = (props) => {
  //img switcher
  let img = null;
  switch (props.img) {
    case "SignUp":
      img = signUp;
      break;

    case "Login":
      img = Login;
      break;
    case "Auth":
      img = Auth;
      break;
    case "Forgot":
      img = Forgot;
      break;
    case "newPost":
      img = Post;
      break;
    case "modifyPost":
      img = ModifyPost;
      break;
    case "signupCNF":
      img = SignUpCNF;
      break;
    case "Guest":
      img = Guest;
      break;
    case "ChangePass":
      img = ChangePassword;
      break;
    default:
      img = null;
  }

  return (
    <Container>
      <Row>
        <Col lg={6} md={6} sm={12} xs={12}>
          <div className={styles.SignUpForm}>
            <h2 className={styles.Title}>{props.title}</h2>
            <h6 className={styles.Des}>{props.Description}</h6>
            <Form onSubmit={props.submitAction} className={styles.RegisterForm}>
              {props.elements.map((formElement) => (
                <InputElements
                  key={formElement.id}
                  element={formElement}
                  changeHandler={props.changeHandler}
                />
              ))}
              <a href={props.linkData2} className={styles.Link}>
                {props.link2}
              </a>
              <Button
                variant="outline-primary"
                type="submit"
                className={styles.Button}
                disabled={!props.btnState}
              >
                Submit
              </Button>
            </Form>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <div>
            <img src={img} alt="Sign" className={styles.SignUpImg} />
            <a href={props.linkData} className={styles.Link}>
              {props.link}
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default form;
