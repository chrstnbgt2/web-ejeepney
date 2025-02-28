<?php

$name='castro';
 

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration</title>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> <!-- SweetAlert2 -->
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 50px;
    }
    .container {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
    }
    .container h2 {
      text-align: center;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .btn {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn:hover {
      background-color: #218838;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Register</h2>
    <form id="registrationForm">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required >
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required >
      </div>
      <button type="button" class="btn" onclick="registerUser()">Register</button>
    </form>

  
  </div>

  <script>
    function registerUser() {
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

      fetch('./config/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Registration Successful',
              text: data.message,
            }).then(() => {
              document.getElementById('registrationForm').reset();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: data.message,
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
</body>
</html>
