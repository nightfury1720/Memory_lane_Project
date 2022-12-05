import React, { Component } from "react";

//css
import classes from "./Posts.module.css";

//react components
import Post from "../../components/Post/Post";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";

import Container from "react-bootstrap/Container";

//axios
import axios from "../../axios-root";

//react router
import { Redirect } from "react-router-dom";

class Posts extends Component {
  state = {
    posts: null,
    error: false,
    redirectPath: null,
    loading: false,
    showModal: false,
    modalData: null,
  };

  componentDidMount() {
    let path = this.props.getPath;
    if (this.props.match.params.id)
      path = `/posts/${this.props.match.params.id}/userPosts`;
    axios
      .get(path)
      .then((response) => {
        if (response.data)
          this.setState({
            posts: response.data.data.doc,
            user: response.data.data.user,
          });
        else this.setState({ error: true });
      })
      .catch((error) => {
        // console.log(error.message);
        this.setState({ error: true });
      });
  }

  blacklistHandler = (id) => {
    this.setState({ loading: true });
    axios
      .patch(`/posts/${id}/blacklist`, null)
      .then((res) => {
        // console.log(res);
        const modalData = {
          message: res.data.message,
        };
        this.setState({
          loading: false,
          showModal: true,
          modalData: modalData,
        });
        // console.log(res);
        const updatedPosts = [...this.state.posts];
        const myPostIndex = updatedPosts.indexOf(
          updatedPosts.find((x) => x.id === id)
        );

        updatedPosts.splice(myPostIndex, 1);
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => console.log(err));
  };

  whitelistHandler = (id) => {
    this.setState({ loading: true });
    axios
      .patch(`/posts/${id}/whitelist`, null)
      .then((res) => {
        // console.log(res);
        const modalData = {
          message: res.data.message,
        };
        this.setState({
          loading: false,
          showModal: true,
          modalData: modalData,
        });
        // console.log(res);
        const updatedPosts = [...this.state.posts];
        const myPostIndex = updatedPosts.indexOf(
          updatedPosts.find((x) => x.id === id)
        );

        updatedPosts.splice(myPostIndex, 1);
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => console.log(err));
  };

  voteHandler = (id, action) => {
    axios
      .post(`/posts/${id}/${action}`, null)
      .then((res) => {
        if (res.data) {
          const responseData = res.data.data;
          const updatedData = {
            upvotes: responseData.upvotes,
            upvotedBy: responseData.upvotedBy,
            downvotes: responseData.downvotes,
            downvotedBy: responseData.downvotedBy,
          };
          const updatedPosts = [...this.state.posts];
          const myPostIndex = updatedPosts.indexOf(
            updatedPosts.find((x) => x.id === responseData.id)
          );
          const updatedPost = {
            ...updatedPosts[myPostIndex],
            upvotes: updatedData.upvotes,
            downvotes: updatedData.downvotes,
            upvotedBy: updatedData.upvotedBy,
            downvotedBy: updatedData.downvotedBy,
          };
          updatedPosts[myPostIndex] = updatedPost;
          this.setState({ posts: updatedPosts });
        } else {
          console.log(res.response.data.message);
          if (
            res.response.data.message === "jwt malformed" ||
            "You are not logged in"
          )
            this.setState({ redirectPath: "/users/login" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  modifyHandler = (id) => {
    this.setState({
      redirectPath: `/posts/modify/${id}`,
    });
  };

  deleteHandler = (id) => {
    this.setState({ loading: true });
    axios
      .delete(`/posts/${id}`)
      .then((res) => {
        const modalData = {
          message: "Post deleted successfully",
        };
        this.setState({
          loading: false,
          showModal: true,
          modalData: modalData,
        });
        console.log(res);
        const updatedPosts = [...this.state.posts];
        const myPostIndex = updatedPosts.indexOf(
          updatedPosts.find((x) => x.id === id)
        );
        updatedPosts.splice(myPostIndex, 1);
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => console.log(err));
  };

  render() {
    //redirect
    if (this.state.redirectPath)
      return <Redirect to={this.state.redirectPath} />;

    //set Heading
    let heading = <h1 className="PageTitle">Recent Posts</h1>;
    if (this.props.getPath === "/posts/blacklisted")
      heading = <h1 className="PageTitle">Blacklisted Posts</h1>;

    //noPosts
    let noPosts = null;

    //error
    let posts = this.state.error ? (
      <h2
        style={{
          margin: "10%",
          fontFamily: '"Gentium Basic", serif',
          color: "salmon",
        }}
      >
        Some error occurred
      </h2>
    ) : (
      <Spinner />
    );
    if (this.state.posts) {
      posts = this.state.posts.map((post) => {
        return (
          <Post
            key={post.id}
            title={post.title}
            user={post.user}
            createdAt={post.createdAt}
            body={post.text}
            upvotedBy={post.upvotedBy}
            downvotedBy={post.downvotedBy}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            upvoteClick={() => this.voteHandler(post.id, "upvote")}
            downvoteClick={() => this.voteHandler(post.id, "downvote")}
            cookies={this.props.cookies}
            blacklisted={post.blacklisted}
            blacklistClick={() => this.blacklistHandler(post.id)}
            whitelistClick={() => this.whitelistHandler(post.id)}
            modifyClick={() => this.modifyHandler(post.id)}
            deleteClick={() => this.deleteHandler(post.id)}
          />
        );
      });

      if (this.props.match.params.id) {
        heading = (
          <h1 className="PageTitle">{`Posts by ${this.state.user}`}</h1>
        );
        if (!this.state.posts.length)
          noPosts = <h2 className="Subtitle">No Posts Yet !!</h2>;
      }
    }
    let loader = null;
    if (this.state.loading) loader = <Spinner />;

    if (this.state.showModal)
      loader = (
        <Modal
          show={this.state.showModal}
          onHide={this.hideModal}
          title="Success"
          body={this.state.modalData.message}
          button="success"
        />
      );

    // console.log(this.props.getPath);
    return (
      <section className={classes.Posts}>
        <Container>
          {heading}
          {loader}
          {noPosts}
          {posts}
        </Container>
      </section>
    );
  }
}

export default Posts;
