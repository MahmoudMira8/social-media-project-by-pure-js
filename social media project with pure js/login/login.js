let submitBtn = document.querySelector("#submit");
let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");
let x = document.querySelector("#x");

submitBtn.addEventListener("click", function(event) {
    event.preventDefault(); // prevent form submission and page reload
    axios.post('https://tarmeezacademy.com/api/v1/login', {
        "username": usernameInput.value,
        "password": passwordInput.value,
      })
        .then(function (response) {
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user))
          window.location = '../index.html';
          //toggleLoader(false);
        })
        .catch(function (error) {
          alert(error.response.data.message);
        });
});

