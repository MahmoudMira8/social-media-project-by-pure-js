const postsContainer = document.getElementById("posts-container");
const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");
const logOut = document.getElementById("log-out");
const anchorLoginRegisterLogout = document.querySelectorAll(".right-nav a");
const userContainerImg = document.querySelector(".left-nav .user-img");
const userImg = document.querySelector(".left-nav .user-img img");
const userName = document.querySelector(".logo");
const createPostButton = document.getElementById("create-post-button");
const showProfileButton = document.getElementById("show-profile");
const homeButton = document.getElementById("home-button");

let globalToken;
const basicURL = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let last_page = 1;

function goprofile(id) {
  window.location.href = `/showprofile/showprofile.html?id=${id}`;
}

//loader function
function toggleLoader(show) {
  if (show) {
    document.getElementById("loader").style.display = "inline-flex";
  } else {
    document.getElementById("loader").style.display = "none";
  }
}
//end of loader function

//go to personal profile when clicked on user name
userName.addEventListener("click", () => {
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  let id = user.id;
  window.location.href = `/showprofile/showprofile.html?id=${id}`;
});

const onScroll = () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && currentPage < last_page) {
    currentPage += 1;
    getPosts(false, currentPage);
  } else {
    window.removeEventListener("scroll", onScroll); // Remove the event listener
  }
};

window.addEventListener("scroll", onScroll);

loginButton.addEventListener("click", () => {
  window.location.href = "/login/login.html";
});

registerButton.addEventListener("click", () => {
  window.location.href = "/register/register.html";
});

logOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  location.reload();
});

//to show profile page
showProfileButton.addEventListener("click", (e) => {
  e.preventDefault();
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  let id = user.id;
  window.location.href = `/showprofile/showprofile.html?id=${id}`;
});
//end to show profile page

//go to home page when clicked on home button
homeButton.addEventListener("click", () => {
  window.location = "/";
});

let lastPostId;

function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios
    .get(`${basicURL}/posts?page=${page}&limit=5`)
    .then(({ data }) => {
      toggleLoader(false);
      const posts = data.data;
      // Update globalLastPage only when the function is called with page = 1
      if (page === 1) {
        last_page = data.meta.last_page;
      }

      if (reload) {
        postsContainer.innerHTML = "";
        lastPostId = null; // Reset last post ID
      }

      const newPosts = posts.filter((post) => post.id !== lastPostId);

      if (newPosts.length === 0) {
        return; // No new posts to load, so return from the function
      }

      lastPostId = posts[posts.length - 1].id;

      postsContainer.innerHTML += newPosts.map((post) => {
          const tagsDiv = document.createElement("div");
          tagsDiv.id = "tags";
          post.tags.forEach((tag) => {
            const spanElement = document.createElement("span");
            spanElement.textContent = tag;
            tagsDiv.appendChild(spanElement);
          });

          // Check if the user is the owner of the post
          const user = JSON.parse(localStorage.getItem("user"));
          const isOwner = user && post.author.id === user.id;

          // Hide the edit button for posts that are not owned by the user
          const editButtonStyle = isOwner ? "block" : "none";
          const deleteButtonStyle = isOwner ? "block" : "none";

          // iterate over each element in anchorLoginRegisterLogout and set its style.display to "block"
          anchorLoginRegisterLogout.forEach((anchor) => {
            anchor.style.display = "block";
          });

          return `<div class="post">
            <div class="post-header">
              <div class="publisher" onclick="goprofile(${
                post.author.id
              })" style="cursor: pointer">
                <a href="#"><img src=${
                  post.author.profile_image
                } alt="Profile Picture" class="publisher-img"></a>
                <b>${post.author.name}</b>
              </div>
              <div class="edit-section" style = "display: flex">
                <button id="edit-button-${
                  post.id
                }" class="edit-button" style="display: ${editButtonStyle}" onclick="editPost('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>
                <button id="delete-button-${
                  post.id
                }" class="delete-button" style="display: ${deleteButtonStyle}" onclick="deletePost('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</button>
              </div>
            </div>
            <div onclick="showPostDetails(${post.id})" style="cursor: pointer;">
            <div class="post-body" style="display: flex; justify-content: space-between;">
            <div>
              <span class="post-time">${post.created_at} </span>
              <p class="post-p">${post.body}</p>
            </div>
            ${tagsDiv.outerHTML}
          </div>
          <img src="${post.image}" alt="post image" class="post-img">
          <div class="post-icons">
            <span><i class="far fa-thumbs-up"></i> Like</span>
            <span><i class="far fa-comment"></i> Comment</span>
            <span><i class="fas fa-share"></i> Share</span>
          </div>
            </div>
          </div>`;
        })
        .join("");
    })
    .catch((error) => {
      alert(error.message);
    });
}

getPosts();

const setupUi = () => {
  const token = localStorage.getItem("token");

  if (token == null || token == "undefined") {
    loginButton.style.display = "block";
    registerButton.style.display = "block";
    logOut.style.display = "none";
    userContainerImg.style.display = "none";
    createPostButton.style.display = "none";
  } else {
    loginButton.style.display = "none";
    registerButton.style.display = "none";
    logOut.style.display = "block";
    userContainerImg.style.display = "block";
    createPostButton.style.display = "block";

    //todo
    //get name from when login
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      userName.innerHTML = user.name;
      userImg.src = user.profile_image;
    }
  }
};

setupUi();

//create post function

createPostButton.addEventListener("click", function () {
  const createPostAlert = document.querySelector(".create-post-alert");
  createPostAlert.style.display = "block";

  // add event listener to close create post window when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      !createPostAlert.contains(event.target) &&
      event.target !== createPostButton
    ) {
      createPostAlert.style.display = "none";
    }
  });
});

const submitToCreatePostButton = document.getElementById("submitPostButton");
submitToCreatePostButton.addEventListener("click", createPostAlert);

function createPostAlert() {
  const inputPostTitle = document.getElementById("postTitle").value;
  const inputPostImage = document.getElementById("postImage").files[0];
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const formData = new FormData();
  formData.append("body", inputPostTitle);
  formData.append("image", inputPostImage);

  axios
    .post(`${basicURL}/posts`, formData, { headers })
    .then(({ data }) => {
      console.log(data);
      getPosts(true, currentPage);
      const createPostAlert = document.querySelector(".create-post-alert");
      createPostAlert.style.display = "none";
    })
    .catch((error) => {
      console.log(error.response);
    });
}

// ... edit post function

// Add event listener to the document object

function editPost(postObject) {
  const post = JSON.parse(decodeURIComponent(postObject));
  console.log(post.id);
  const editPostAlert = document.getElementById("editPostAlert");
  document.getElementById("editPostTitle").value = post.body;

  document.addEventListener("click", (event) => {
    // Check if the clicked element is the edit button or one of its children
    if (
      (event.target.classList.contains("edit-button") ||
        event.target.classList.contains("edit-post-alert")) &&
      !editPostAlert.contains(event.target)
    ) {
      // If it is and not clicked within the edit-post-alert section, then show the edit post section
      editPostAlert.style.display = "block";
    }
  });

  let token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  const submitToEditPostButton = document.getElementById(
    "editSubmitPostButton"
  );
  submitToEditPostButton.addEventListener("click", () => {
    const newTitle = document.getElementById("editPostTitle").value;
    const newImg = document.getElementById("editPostImg").files[0];
    const formData = new FormData();
    formData.append("body", newTitle);
    if (newImg) formData.append("image", newImg);
    formData.append("_method", "put");

    axios
      .post(`${basicURL}/posts/${post.id}`, formData, { headers })
      .then(({ data }) => {
        console.log(data);
        getPosts(true, currentPage);
        editPostAlert.style.display = "none";
      })
      .catch((err) => {
        console.log(err.response);
        alert("Error editing post!");
      });
  });
}

// ...end of edit post function

//end edit post
function deletePost(postObject) {
  const post = JSON.parse(decodeURIComponent(postObject));
  let token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${basicURL}/posts/${post.id}`, { headers })
    .then(({ data }) => {
      getPosts(true, currentPage);
      editPostAlert.style.display = "none";
    })
    .catch((err) => {
      console.log(err.response);
      alert("Error editing post!");
    });
}
//delete post function

//end of delete post function

function showPostDetails(id) {
  window.location.href = `/showpost/postdetails.html?id=${id}`;
}
