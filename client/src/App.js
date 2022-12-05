import React, { Component } from "react";

//import title css
import "./App.css";

//hoc
import Auxillary from "./hoc/Auxillary/Auxillary";
import Layout from "./hoc/Layout/Layout";
import ErrorHandler from "./hoc/ErrorHandler/ErrorHandler";

import HomeModal from "./components/HomeModal/HomeModal";

//components 1) Posts
import Posts from "./containers/Posts/Posts";
import NewPostForm from "./containers/Posts/NewPost/NewPost";
import ModifyPost from "./containers/Posts/ModifyPost/ModifyPost";

//components 2) Authentication
import LoginForm from "./containers/Authentication/Login";
import SignUpForm from "./containers/Authentication/SignUp";
import SignUpConfirmForm from "./containers/Authentication/SignUpConfirm";
import ResetPasswordForm from "./containers/Authentication/ResetPassword";
import ForgotPasswordForm from "./containers/Authentication/ForgotPassword";
import GuestSession from "./containers/Authentication/GuestSession";
import Logout from "./containers/Authentication/Logout";
import ChangePasswordForm from "./containers/Authentication/ChangePassword";

//compoents 3) Users for Admin Only
import Users from "./containers/Users/Users";

// React Router
import { Route, Switch } from "react-router-dom";

//Cookies
import { withCookies } from "react-cookie";

//axios
import axios from "./axios-root";

class App extends Component {
  render() {
    return (
      <Auxillary>
        <Layout cookies={this.props.cookies}>
          <Switch>
            <Route exact path="/" component={HomeModal} />

            <Route
              exact
              path="/posts"
              render={(props) => (
                <Posts
                  cookies={this.props.cookies}
                  {...props}
                  getPath="/posts?blacklisted=false"
                />
              )}
            />
            <Route
              path="/users/login"
              exact
              render={() => <LoginForm cookies={this.props.cookies} />}
            />
            <Route path="/users/signup" exact component={SignUpForm} />
            <Route
              path="/users/signupConfirm"
              exact
              render={() => <SignUpConfirmForm cookies={this.props.cookies} />}
            />
            <Route
              path="/users/resetPassword"
              exact
              render={(props) => (
                <ResetPasswordForm cookies={this.props.cookies} {...props} />
              )}
            />
            <Route
              path="/users/forgotPassword"
              exact
              component={ForgotPasswordForm}
              // cookies={this.props.cookies}
            />

            <Route
              path="/users/changePassword"
              exact
              component={ChangePasswordForm}
              // cookies={this.props.cookies}
            />

            <Route
              path="/users/logout"
              exact
              render={() => <Logout cookies={this.props.cookies} />}
            />

            <Route
              path="/users/guestSession"
              exact
              render={() => <GuestSession cookies={this.props.cookies} />}
            />

            <Route
              path="/createPost"
              component={NewPostForm}
              // cookies={this.props.cookies}
            />

            <Route
              path="/users"
              exact
              render={() => <Users cookies={this.props.cookies} />}
            />

            <Route
              path="/posts/userName/:id"
              exact
              render={(props) => (
                <Posts cookies={this.props.cookies} {...props} />
              )}
            />

            <Route path="/posts/modify/:postId" component={ModifyPost} />
            <Route
              path="/posts/blacklisted"
              exact
              render={(props) => (
                <Posts
                  cookies={this.props.cookies}
                  {...props}
                  getPath="/posts/blacklisted"
                />
              )}
            />
          </Switch>
        </Layout>
      </Auxillary>
    );
  }
}

export default withCookies(ErrorHandler(App, axios));
