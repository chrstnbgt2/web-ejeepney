<?php
session_start();

include './config/db.php';
 
if (isset($_SESSION['user_id']) || isset($_SESSION['user_email'])) {
    header('Location: dashboard.php');
    exit;  
}



 ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <title>E-JeepPay Login</title>
    <link rel="stylesheet" href="./css/login.css" />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css"
    />
    <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
/>

    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css"
    />
  </head>
  <body>
    <div id="popupModal" class="modal">
      <div class="modal-content">
        <span id="closeModal" class="close">&times;</span>
        <p id="popupMessage"></p>
      </div>
    </div>
    
    
    <div class="container">
      <!-- Left section -->
      <div class="welcome-section">
        <h1 style="padding-bottom: 70%">Welcome to E-JeepPay!</h1>
      </div>

      <!-- Right section -->
      <div class="login-section">
        <div class="logo-container">
          <img
            src="img/logo-login.png"
            alt="Logo"
            class="logo"
            style="padding-bottom: 10px"
          />
        </div>
        <h2 style="margin-top: -20px">ADMIN LOGIN</h2>

        <div class="input-container">
          <i class="fas fa-user icon"></i>
          <input
            type="text"
            name="email"
            placeholder="Email"
            id="email"
            required
          />
        </div>
        <div class="input-container">
          <i class="fas fa-lock icon"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            id="password"
            required
          />
          <i
            class="fi fi-ss-eye-crossed toggle_password"
            onclick="show_hide_passwordField()"
          ></i>
        </div>
        <input
        type="button"
        class="login-button"
        value="LOGIN"
        id="login"
        onclick="loginUser()"
      />
        <a href="#" class="forgot-password">Forget Password?</a>
      </div>
    </div>
  
 <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  

  <script>
   function loginUser() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === '' || password === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill in all fields.',
    });
    return;
  }

  // AJAX request
  fetch('./config/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Redirecting to the dashboard...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          // Redirect to the dashboard
          window.location.href = data.redirect_url;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid email or password.',
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
      });
      console.error('Error:', error);
    });
}

  </script>
  <script>
  function show_hide_passwordField() {
    const passwordField = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle_password");

    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.classList.remove("fi-ss-eye-crossed");
      toggleIcon.classList.add("fi-ss-eye");
    } else {
      passwordField.type = "password";
      toggleIcon.classList.remove("fi-ss-eye");
      toggleIcon.classList.add("fi-ss-eye-crossed");
    }
  }
</script>

  </body>
</html>
