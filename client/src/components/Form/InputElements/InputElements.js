import React from "react";

//bootstrap
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

//css
import styles from "./InputElements.module.css";

//icons
import { BsLock, BsLockFill } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaUser, FaKey } from "react-icons/fa";

const inputElement = (props) => {
  //styles from icons
  const iconStyle = {
    padding: "0",
    marginTop: "10px",
    height: "1.2em",
    width: "1.2em",
    borderBottom: "1px solid #ccc",
  };

  //styles for input elements border lines
  const invalidStyle = {
    border: "none",
    borderBottom: "2px solid salmon",
    marginBottom: "10px",
  };

  const validStyle = {
    border: "none",
    borderBottom: "2px solid lightgreen",
    marginBottom: "10px",
  };

  const normalStyle = {
    border: "none",
    borderBottom: "1.5px solid black",
    marginBottom: "10px",
  };

  // selecting icons a/c to input
  const iconSwitch = (input) => {
    let icon = null;
    switch (input) {
      case "email":
        icon = <AiOutlineMail style={iconStyle} />;
        break;

      case "lock":
        icon = <BsLock style={iconStyle} />;
        break;

      case "user":
        icon = <FaUser style={iconStyle} />;
        break;

      case "lockFill":
        icon = <BsLockFill style={iconStyle} />;
        break;

      case "key":
        icon = <FaKey style={iconStyle} />;
        break;

      default:
        icon = null;
    }

    return icon;
  };

  // selecting input Elements
  const elementSwitch = (formElement) => {
    let element;

    switch (formElement.config.elementType) {
      case "input":
        // making invalid and valid comparision previously only
        const invalid =
          formElement.config.touched &&
          !formElement.config.valid &&
          formElement.config.validation;

        const valid =
          formElement.config.touched &&
          formElement.config.valid &&
          formElement.config.validation;

        element = (
          <InputGroup key={formElement.id}>
            <InputGroup.Prepend>
              {iconSwitch(formElement.config.icon)}
            </InputGroup.Prepend>

            <Form.Control
              // style={invalid ? invalidStyle : valid ? validStyle : normalStyle}
              style={
                formElement.config.touched
                  ? valid
                    ? validStyle
                    : invalidStyle
                  : normalStyle
              }
              className={styles.Input} //css
              bsClass={styles.Input}
              type={formElement.config.elementConfig.type} // type of input {text, password, email}
              placeholder={formElement.config.elementConfig.placeholder}
              value={formElement.config.elementConfig.value}
              defaultValue={formElement.config.default}
              onChange={(event) => props.changeHandler(event, formElement.id)}
            />
          </InputGroup>
        );
        break;

      case "textarea":
        element = (
          <Form.Control
            className={styles.Textarea}
            as="textarea"
            rows="6"
            defaultValue={formElement.config.default} //default value
            placeholder={formElement.config.elementConfig.placeholder}
            value={formElement.config.elementConfig.value}
            onChange={(event) => props.changeHandler(event, formElement.id)}
          />
        );
        break;

      default:
        element = null;
    }

    return element;
  };

  return elementSwitch(props.element);
};

export default inputElement;
