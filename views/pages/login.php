<div class="login-container">
    <h2>Login</h2>
    <form id="loginForm">
        <div class="input-group">
            <label for="email">Email</label>
            <input type="text" id="email" name="email" required>
        </div>
        <div class="input-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            <span class="material-symbols-outlined toggle-password" id="toggle-password-account">visibility</span>
        </div>
        <div class="login-button" id="loginButton">
            <p>Login</p>
        </div>
        <a href="/register" style="margin-left: auto;">Register</a>
        <div class="error-message" id="errorMessage"></div>
    </form>
</div>