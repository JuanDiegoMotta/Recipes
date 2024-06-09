document.addEventListener('DOMContentLoaded', function() {
    pwdVisibilityListener();
    loginListener();
});

function pwdVisibilityListener() {
    const togglePassword = document.getElementById('toggle-password-account');
    const passwordField = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.innerText = type === 'password' ? 'visibility' : 'visibility_off';
    });
}

function loginListener() {
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        handleLogin();
    });
}

function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.style.display = 'none';

    if (!email || !password) {
        showError('Please fill in all fields.');
        return;
    }

    if(password.length < 8){
        showError('Password must be at least 8 characters')
        return;
    }

    if (!validateEmail(email)) {
        showError('Invalid email format.');
        return;
    }

    // Simular la solicitud al servidor para autenticación
    fetch('../../api/procesar_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location = '/recipe-discovery';
        } else {
            showError(data.message || 'Login failed. Please try again.');
        }
    })
    .catch(error => {
        showError('An error occurred. Please try again.');
        console.error('Error:', error);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function clearChangePassword() {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    document.getElementById('errorMessage').style.display = 'none';
}