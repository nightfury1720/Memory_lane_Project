import React, { Component } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import welcome from "../../assets/img/welcome.jpg";

class HomeModal extends Component {
  state = {
    showWelcome: true,
  };

  hideWelcome = () => {
    this.setState({ showWelcome: false });
    this.props.history.push("/posts");
  };

  render() {
    const welcomeModal = (
      <Modal show={this.state.showWelcome} size="lg" centered>
        <Modal.Body>
          <img
            src={welcome}
            style={{ width: "100%", height: "100%" }}
            alt="Welcome"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideWelcome}>Close</Button>
        </Modal.Footer>
      </Modal>
    );

    return welcomeModal;
  }
}

export default HomeModal;
