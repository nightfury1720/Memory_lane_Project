import React, { Component } from "react";

// react bootstrap components
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

//logo
import Logo from "../Logo/Logo";

class Navigation extends Component {
  render() {
    //cookies imported
    const cookies = this.props.cookies.cookies;

    // navigation w/o authentication
    let rightItems = (
      <Nav>
        <NavDropdown title="Authentication">
          <NavDropdown.Item href="/users/login">Login</NavDropdown.Item>
          <NavDropdown.Item href="/users/signup">SignUp</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/users/guestSession">
            Continue <br /> as Guest
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    );

    const auth = cookies.isAuthenticated;
    const userData = cookies.userData;

    if (auth && userData && userData !== "undefined") {
      const authJSON = JSON.parse(auth);
      const userDataJSON = JSON.parse(userData);
      if (authJSON && userDataJSON) {
        const userName = userDataJSON.user.name;
        const userRole = userDataJSON.user.role;
        const userID = userDataJSON.user._id;

        //if authenticated as a user

        rightItems = (
          <Nav>
            <NavDropdown title={userName}>
              <NavDropdown.Item href={`/posts/userName/${userID}`}>
                My Posts
              </NavDropdown.Item>
              <NavDropdown.Item href="/users/changePassword">
                Change Password
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/createPost">New Post</Nav.Link>
            <Nav.Link href="/users/logout">Logout</Nav.Link>
          </Nav>
        );

        // if authenticated as an admin
        if (userRole === "admin") {
          rightItems = (
            <Nav>
              <NavDropdown title={userName}>
                <NavDropdown.Item href={`/posts/userName/${userID}`}>
                  My Posts
                </NavDropdown.Item>
                <NavDropdown.Item href="/users/changePassword">
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Admin Actions">
                <NavDropdown.Item href="/users">Get All Users</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/posts/blacklisted">
                  View Blacklisted Posts
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/createPost">New Post</Nav.Link>
              <Nav.Link href="/users/logout">Logout</Nav.Link>
            </Nav>
          );
        }

        // if authenticated as guest
        if (userName === "Guest") {
          rightItems = (
            <Nav>
              <Nav.Link disabled href="#">
                Guest Session
              </Nav.Link>
              <Nav.Link href="/createPost">New Post</Nav.Link>
              <Nav.Link href="/users/logout">End Guest Session</Nav.Link>
            </Nav>
          );
        }
      }
    }

    return (
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" fixed="top">
        <Navbar.Brand href="/posts">
          <Logo height="76px" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="/posts">Chamber of Secrets</Nav.Link>
            <Nav.Link></Nav.Link>
          </Nav>
          {rightItems}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default Navigation;
