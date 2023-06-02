const profileImg = document.getElementById("user-img");
const profileName = document.getElementById("profile-name");
const homeProfile = document.getElementById("home");
const email = document.getElementById("email");
const name = document.getElementById("name");
const userName = document.getElementById("user-name");
const postsNumber = document.getElementById("posts-number");
const commentsNumber = document.getElementById("comments-number");
const basicURL = "https://tarmeezacademy.com/api/v1";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
axios
  .get(`https://tarmeezacademy.com/api/v1/users/${id}`)
  .then((response) => {
    // Handle success
    profileImg.src = response.data.data.profile_image;
    profileName.innerHTML = response.data.data.name;
    email.innerHTML = response.data.data.email;
    name.innerHTML = response.data.data.name;
    userName.innerHTML = response.data.data.username;
    postsNumber.innerHTML = `posts: ${response.data.data.posts_count}`;
    commentsNumber.innerHTML = `comments:${response.data.data.comments_count}`;
  })
  .catch((error) => {
    // Handle error
    alert(error);
  });

console.log("welcoem");

homeProfile.addEventListener("click", (event) => {
  window.location = "/";
});

function getPosts() {
  axios
    .get(`${basicURL}/users/${id}/posts`)
    .then(({ data }) => {
      const posts = data.data;
      console.log(posts);
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);

      document.getElementById("user-posts").innerHTML += posts
        .map((post) => {
          // Check if the user is the owner of the post
          const isOwner = user && post.author.id === user.id;
          console.log(isOwner);
          // Hide the edit button for posts that are not owned by the user
          const editButtonStyle = isOwner ? "block" : "none";
          const deleteButtonStyle = isOwner ? "block" : "none";

          const tagsDiv = document.createElement("div");
          tagsDiv.id = "tags";
          post.tags.forEach((tag) => {
            const spanElement = document.createElement("span");
            spanElement.textContent = tag;
            tagsDiv.appendChild(spanElement);
          });

          return `
          <div class="post">
          <div class="publisher">
            <a href="#"
              ><img
                src=${post.author.profile_image}
                alt="Profile Picture"
                class="publisher-img"
            /></a>
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

          <span class="post-time">${post.created_at}</span>
          <p class="post-p">
          ${post.body}
          </p>
          <img
            src=${post.image}
            alt="post image"
            class="post-img"
          />
          <div class="post-icons">
            <span><i class="far fa-thumbs-up"></i> Like</span>
            <span><i class="far fa-comment"></i> Comment</span>
            <span><i class="fas fa-share"></i> Share</span>
          </div>
        </div>
            `;
        })
        .join("");
    })
    .catch((error) => {
      alert(error.message);
    });
}

getPosts();

function editPost(postObject) {
  const post = JSON.parse(decodeURIComponent(postObject));
  console.log(post.id);
  console.log(post.body);
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
      .then((response) => {
        console.log(response.data);
        editPostAlert.style.display = "none";
        getPosts();
      })
      .catch((error) => {
        console.log(error.response);
        alert("Error editing post!");
      });
  });
}


function deletePost(postObject) {
  const post = JSON.parse(decodeURIComponent(postObject));
  let token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${basicURL}/posts/${post.id}`, { headers })
    .then(({ data }) => {
      getPosts();
    })
    .catch((err) => {
      console.log(err.response);
      alert(err.response);
    });
}
