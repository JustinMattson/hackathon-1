// import PostsService from "../";
import store from "../store.js";
import commentsService from "../Services/CommentsService.js";

//Private
function _draw() {
  let comments = store.State.comments;
  let activePost = store.State.activePost;
  function compare(a, b) {
    const upvoteA = (a.upvotes - a.downvotes)
    const upvoteB = (b.upvotes - b.downvotes)

    let comparison = 0;
    if (upvoteA < upvoteB) {
      comparison = 1;
    } else if (upvoteA > upvoteB) {
      comparison = -1;
    }
    return comparison;
  }
  comments.sort(compare)
  console.log(comments)
  let template = ""
  comments.forEach(c => template += c.Template)
  document.getElementById(activePost.id).innerHTML = template
}

function _drawHidden(postId) {
  let template = ''
  document.getElementById(postId).innerHTML = template
}

function _drawAllTop() {

}

//Public
export default class CommentsController {
  constructor() {
    store.subscribe("comments", _draw);
    store.subscribe("allComments", _drawAllTop)
  }

  getComments(postId) {
    commentsService.getComments(postId)
  }

  hideComments(postId) {
    _drawHidden(postId)
  }

  addComment(event, postId) {
    event.preventDefault();
    let form = event.target;
    let post = store.State.posts.find(p => p.id == postId)
    if (form.description.value.toLowerCase() != post.title.toLowerCase()) {
      let commentObj = {
        description: form.description.value,
        author: form.author.value,
        postId: postId,
      };
      console.log(commentObj);
      commentsService.addComment(commentObj);
    } else { window.alert("You can only put incorrect answers. Duh!") }

    form.reset();
  }

  upvote(commentId) {
    commentsService.upvote(commentId);
  }
  downvote(commentId) {
    commentsService.downvote(commentId);
  }

  removeComment(commentId) {
    if (window.confirm("are you sure you want to delete this comment?")) {
      commentsService.removeComment(commentId);
    }
  }
}
