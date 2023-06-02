const registerForm = document.querySelector('#register-form');
const registerbtn = document.querySelector('#registerbtn');
const name = document.querySelector('#name-input');
const username = document.querySelector('#username-input');
const password = document.querySelector('#password-input');
const image = document.getElementById('personal-image');

registerbtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(registerForm);
    formData.append('name', name.value);
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('image', image.files[0]);
    
    try {
        const response = await axios.post('https://tarmeezacademy.com/api/v1/register', formData);
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user))
        window.location = "/";
    } catch (error) {
        alert(error.response.data.message);
    }
});

console.log(localStorage.getItem('token'));
