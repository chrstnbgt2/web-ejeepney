<?php
session_start();
if (isset($_SESSION['acc_name'])) {
  $acc_name = $_SESSION['acc_name'];
} else {
  $acc_name = "Guest";
}

$error = isset($_GET['error']) ? $_GET['error'] : '';
$success = isset($_GET['success']) ? $_GET['success'] : '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>Settings</title>
  <link rel="stylesheet" href="./css/style.css" />
  <link rel="stylesheet" href="./css/setting.css" />
  <link
    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    rel="stylesheet" />
</head>

<body>
  <div class="sidebar">
    <div class="logo_details" style="margin-top: 20px">
      <img src="./img/logo.png" alt="" class="jeepney-logo" />
      <div class="logo_name">E-JeepPay</div>
      <i class="bx bx-menu" id="btn"></i>
    </div>
    <ul class="nav-list" style="margin-top: 40px">
      <li>
        <a href="./index.php">
          <i class="bx bx-grid-alt"></i>
          <span class="link_name">Dashboard</span>
        </a>
        <span class="tooltip">Dashboard</span>
      </li>
      <li>
        <a href="./jeepneys.php">
          <i class="bx bx-car"></i>
          <span class="link_name">Jeepneys</span>
        </a>
        <span class="tooltip">Jeepneys</span>
      </li>
      <li>
        <a href="./drivers.php" style="height: 34px;">
          <img
            src="./img/driver.png"
            style="width: 21px; height: 21px; margin-left: 14.5px" />
          <span class="link_name">Driver</span>
        </a>
        <span class="tooltip">Driver</span>
      </li>
      <li>
        <a href="./user.php">
          <i class="bx bx-user"></i>
          <span class="link_name">User</span>
        </a>
        <span class="tooltip">User</span>
      </li>
      <li>
        <a href="./fare.php">
          <i class="bx bx-dollar"></i>
          <span class="link_name">Fare</span>
        </a>
        <span class="tooltip">Fare</span>
      </li>
      <li>
        <a href="./setting.php" id="settings-link">
          <i class="bx bx-cog"></i>
          <span class="link_name">Settings</span>
        </a>
        <span class="tooltip">Settings</span>
      </li>
    </ul>
  </div>
  <section class="home-section">
    <section class="layout">
      <div class="header">
        <div class="container">
          <input type="text" class="search-input" />
          <div class="topbar-user">
            <h5
              style="
                  margin-top: 0.9%;
                  font-size: 18px;
                  color: white;
                  font-family: Rubik, system-ui;
                ">
              Welcome <?php echo htmlspecialchars($acc_name); ?>
            </h5>
          </div>
          <div class="top-icons">
            <button style="width: 40px; height: 40px; margin-right: 10px">
              <a href="./login.php">
                <img
                  src="./img/account.png"
                  style="height: 100%; width: 100%" />
              </a>
            </button>
            <button style="width: 40px; height: 40px">
              <img src="./img/bell.png" style="height: 100%; width: 100%" />
            </button>
          </div>
        </div>
      </div>
      <div class="body">
      <div id="message" class="message <?php echo $error ? 'error' : ($success ? 'success' : 'hidden'); ?>">
    <?php
      if ($error) {
        if ($error == 'password_mismatch') {
          echo "Passwords do not match!";
        } elseif ($error == 'invalid_credentials') {
          echo "Invalid credentials!";
        } elseif ($error == 'update_failed') {
          echo "Failed to update password!";
        }
      } elseif ($success) {
        echo "Password updated successfully!";
      }
    ?>
  </div>
        <section class="settings-container">
          <div class="text">
            <h5>Account Settings</h5>
          </div>
          <form id="accountForm" action="./php/update_account.php" method="POST" class="form-group">
            <div class="username">
              <h4>Username</h4>
              <input type="text" name="username" class="in" required />
            </div>
            <div class="password">
              <h4>Password</h4>
              <input type="password" name="password" class="in" required />
            </div>
            <div class="new-password">
              <h4>New Password</h4>
              <input type="password" name="new_password" class="in" required />
            </div>
            <div class="confirm-pass">
              <h4>Confirm Password</h4>
              <input type="password" name="confirm_password" class="in" required />
            </div>
            <br><br>
            <div class="container-button">
              <input type="submit" class="settings-save" value="SAVE">
            </div>
          </form>
        </section>
      </div>
    </section>
  </section>
  </section>
  <!-- Scripts -->
  <script>
    window.onload = function() {
      var message = document.getElementById('message');
      var error = "<?php echo $error; ?>"; 
      var success = "<?php echo $success; ?>"; 

      if (error) {
        message.innerHTML = error === 'password_mismatch' ? 'Passwords do not match!' :
                            error === 'invalid_credentials' ? 'Invalid credentials!' :
                            error === 'update_failed' ? 'Failed to update password!' : '';
        message.classList.add('error');
        message.style.display = 'block';
      } else if (success) {
        message.innerHTML = 'Password updated successfully!';
        message.classList.add('success');
        message.style.display = 'block';
      }

      if (message.innerHTML.trim() !== "") {
        setTimeout(function() {
          message.style.opacity = '0';

          setTimeout(function() {
            message.style.display = 'none'; 
          }, 500); 
        }, 3000); 
      }
    };
  </script>


  <script src="./script.js"></script>
</body>

</html>