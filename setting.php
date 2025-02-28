<?php
session_start();

include './config/db.php';

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    header('Location: index.php');
    exit;  
}


$email = $_SESSION['user_email'];


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
  <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css'>
  <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
 
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
 <style type="text/css">
 .notif-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #fff;
}
 
.modal {
  display: none; /* Hidden by default */
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  margin: 10% auto;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

#notifList {
  max-height: 400px;
  overflow-y: auto;
}
.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px;
  border-radius: 50%;
  display: none; /* Hidden by default */
}
 

.text h3 {
  font-size: 22px;
  font-weight: bold;
}

.account-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.container-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.settings-save {
  background-color: #2c3836;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.settings-save:hover {
  background-color: #1e2826;
}
.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 10px;
  padding-right: 40px; /* Space for the eye icon */
  border-radius: 5px;
  border: 1px solid #ccc;
}

.toggle-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #555;
}

.toggle-password:hover {
  color: black;
}
/* Notification list */
    #notifList {
      max-height: 400px;
      overflow-y: auto; /* Scroll if content exceeds max height */
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    /* Individual notification items */
    .notif-item {
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f4f4f4;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .notif-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Notification header */
    .notif-header {
      font-weight: bold;
      margin-bottom: 5px;
    }

    /* Notification timestamp */
    .notif-timestamp {
      font-size: 12px;
      color: #999;
    }
/* Center the entire form */
.form-wrapper {
  display: flex;
  justify-content: flex-start; /* Aligns the form to the left */
  align-items: flex-start; 
  height: 100vh;
  width: 100%;
  padding-left: 80px; /* Adjust spacing from sidebar */
  padding-top: 50px;
  margin: auto;
}

/* Updated form container */
.account-form-box {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 70%; /* Increased width */
  max-width: 900px; /* Prevents excessive stretching */
  text-align: left;
  border: 1px solid #e0e0e0;
}
.account-input {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
  background-color: white;
}

/* ✅ Labels */
.account-form-box label {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

/* Updated password container */
.password-box {
  display: flex;
  align-items: center;
  position: relative;
}

.password-toggle-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

/* Center the SAVE button */
.button-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.save-btn {
  width: 150px;
  padding: 12px;
  font-size: 16px;
  background-color: #2B393B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  float: right; /* Moves button to the right */
}

.save-btn:hover {
  background-color: #1e2826;
}
 

/* Title styling */
.settings-title {
  font-size: 2vw;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
  margin-left: 15px;
}

/* Input fields */
.input-field {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
}

/* Password container with toggle eye icon */
.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

/* Password toggle button */
.toggle-password {
  position: absolute;
  right: 12px;
  cursor: pointer;
  font-size: 20px;
  color: #555;
}

.toggle-password:hover {
  color: black;
}

/* Save Button */
.save-btn {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #2c3836;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-btn:hover {
  background-color: #1e2826;
}

/* Responsive Styling */
@media screen and (max-width: 768px) {
  .settings-container {
    max-width: 90%;
  }

  .input-field {
    font-size: 14px;
    padding: 10px;
  }

  
}

 
 .account-input {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
  background-color: white;
}

/* ✅ Labels */
.account-form-box label {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

/* Password container with toggle eye icon */
.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

/* Password toggle button */
.toggle-password {
  position: absolute;
  right: 15px;
  cursor: pointer;
  font-size: 20px;
  color: #555;
}

.toggle-password:hover {
  color: black;
}

/* Center the SAVE button */
.button-wrapper {
  display: flex;
  justify-content: flex-end; /* Align button to the right */
  margin-top: 15px;
}

/* Save Button */
.save-button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #2B393B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #1e2826;
}

/* Responsive Styling */
@media screen and (max-width: 768px) {
  .form-wrapper {
    height: auto; /* Allow scrolling */
    padding: 30px 0;
  }

 

  .save-button {
    font-size: 14px;
    padding: 10px;
  }
}




/* Ensure the full section occupies the entire width */
.home-section {
  position: relative;
  min-height: 100vh;
  width: calc(100% - 250px); /* Adjust for sidebar width */
  left: 250px;
  transition: all 0.5s ease;
   display: flex;
  justify-content: center; /* Center the form */
 
}

/* When sidebar is collapsed */
.sidebar:not(.open) ~ .home-section {
  width: calc(100% - 78px);
  left: 78px;
}

/* Make the gray background stretch fully */
.settings-container {
  width: 1200px; /* Take full width */
   background: #f8f9fa; /* Gray background */
  padding: 40px;
  display: flex;
  justify-content: center; /* Center the form inside */
 
}

/* Ensure form is properly centered */
.settings-box {
  width: 50%; /* Adjust width to preference */
  max-width: 800px; /* Limit max width */
  background: white; /* White form background */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Form input fields */
.input-field {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* Ensure the save button is aligned */
.save-btn {
  width: 150px;
  padding: 12px;
  font-size: 16px;
  background-color: #2B393B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  float: right;
}

.save-btn:hover {
  background-color: #1e2826;
}

/* Responsive Fix */
@media screen and (max-width: 1024px) {
  .settings-box {
    width: 80%;
  }
}

@media screen and (max-width: 768px) {
  .settings-box {
    width: 90%;
  }

  .home-section {
    left: 78px;
    width: calc(100% - 78px);
  }
}


    </style>
</head>

<body>
 <!-- SIDE BAR -->
    <div class="sidebar">
      <div class="logo_details" style="margin-top: 20px">
        <img src="./img/logo.png" alt="" class="jeepney-logo" />
        <div class="logo_name">E-JeepPay</div>
        <i class="bx bx-menu" id="btn"></i>
      </div>
      <ul class="nav-list" style="margin-top: 40px">
        <li>
          <a href="./dashboard.php" >
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
            <span class="display_count"></span>

        </li>
        <li>
          <a href="./drivers.php" style="height: 34px">
            <!-- <img src="./img/driver.png" style="width:21px; height:21px; margin-left: 14.5px;"> -->
            <i class="fi fi-br-driver-man"></i>
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
          <a href="./setting.php"   id="active">
            <i class="bx bx-cog"  id="active-icon"></i>
            <span class="link_name"  id="active-name">Settings</span>
          </a>
          <span class="tooltip">Settings</span>
        </li>
            <li>
        <a href="#" id="logoutButton">
          <i class="bx bx-log-out"></i>
          <span class="link_name">Sign Out</span>
        </a>
      </li>

      </ul>
    </div>
<!-- SIDE BAR ENDS  -->
  <section class="home-section">
    <section class="layout">
      <div class="header">
        <div class="container">
 
          <div class="topbar-user" style="margin-left: 500px;">
                <h5 style="
   
            font-size: 18px;
            color: white;
            font-family: Rubik, system-ui;
        ">
            Welcome <?php echo htmlspecialchars($email); ?>
        </h5>
            <div class="top-icons">
              <button style="width: 40px; height: 40px; margin-right: 10px">
                <a href="./dashboard.php">
                  <img
                    src="./img/account.png"
                    style="height: 100%; width: 100%"
                  />
                </a>
              </button>
    </div>
        
           
          
<button class="notif-btn" onclick="showNotifications()">
  <i class="bx bx-bell" style="font-size: 40px;"></i>
  <span class="notif-badge" id="notifBadge" style="display: none;">0</span>
</button>

<div id="notifModal" class="modal">
  <div class="modal-content">
    <span class="close" id="closeModal">&times;</span>
 
    <div id="notifList"></div>
  </div>
</div>


          </div>
        </div>
      </div>
 

 <div class="body">
      

      <div id="message" class="message">
  </div>
   
  <h2 class="settings-title">Account Settings</h2>
<div class="settings-container" style="margin-right:0px;height:390px;margin-left: 30px;">

     <form id="accountForm" style="margin-top:20px" >
 
    <input type="email" id="email" class="input-field" value="<?php echo $email ?? ''; ?>" readonly hidden/>

    <label for="currentPassword">Current Password :</label>
    <div class="password-container">
      <input type="password" id="currentPassword" class="input-field" />
      <i class="fi fi-rr-eye-crossed toggle-password" onclick="togglePassword('currentPassword', this)"></i>
    </div>

    <label for="newPassword">New Password :</label>
    <div class="password-container">
      <input type="password" id="newPassword" class="input-field" />
      <i class="fi fi-rr-eye-crossed toggle-password" onclick="togglePassword('newPassword', this)"></i>
    </div>

    <label for="confirmPassword">Confirm Password :</label>
    <div class="password-container">
      <input type="password" id="confirmPassword" class="input-field" />
      <i class="fi fi-rr-eye-crossed toggle-password" onclick="togglePassword('confirmPassword', this)"></i>
    </div>

    <button type="submit"  class="save-btn" style="width:100px;margin-left:900px;">SAVE</button>
  </form>
 
</div>


      </div>
    </section>
  </section>
  </section>
  <!-- Scripts -->
  <script src="./js/settings.js"></script> 
 <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
        <script src="./js/logout.js"></script> 

<script type="text/javascript">
   const firebaseConfig = {
    apiKey: "AIzaSyAbKR42baFMFZSKbE63pr8cKE8IJ-6iVeY",
    authDomain: "e-jeepney-8fe2e.firebaseapp.com",
    databaseURL: "https://e-jeepney-8fe2e-default-rtdb.firebaseio.com",
    projectId: "e-jeepney-8fe2e",
    storageBucket: "e-jeepney-8fe2e.appspot.com",
    messagingSenderId: "70390538365",
    appId: "1:70390538365:web:59ffb8bac69c67db491114",
    measurementId: "G-VJH1K6M4T2",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); 
}

const database = firebase.database();
</script>
  <script>
  // Function to update the notification badge count
// Function to update the notification badge count
  function updateNotifBadge() {
    const notifBadge = document.getElementById("notifBadge");
    const notificationRef = database.ref("notification_web");

    // Fetch unread notifications count
    notificationRef.once("value", (snapshot) => {
      if (snapshot.exists()) {
        const notifications = Object.values(snapshot.val());
        const unreadCount = notifications.filter((notif) => notif.status === "unread").length;

        // Update the badge
        if (unreadCount > 0) {
          notifBadge.style.display = "inline-block";
          notifBadge.textContent = unreadCount > 99 ? "99+" : unreadCount; // Display "99+" for large counts
        } else {
          notifBadge.style.display = "none"; // Hide badge if no unread notifications
        }
      } else {
        notifBadge.style.display = "none"; // Hide badge if no notifications exist
      }
    });
  }

  // Show notifications and mark as read
 function showNotifications() {
  const notifModal = document.getElementById("notifModal");
  const notifList = document.getElementById("notifList");

  // Check if modal element exists
  if (!notifModal) {
    console.error("Modal element with ID 'notifModal' not found!");
    return;
  }

  // Open modal
  notifModal.style.display = "block";

  // Fetch notifications
  const notificationRef = database.ref("notification_web");
  notificationRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      const notifications = Object.entries(snapshot.val()).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      // Get the current date and time
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Subtract 7 days

      // Filter notifications (only include those from the past week)
      const recentNotifications = notifications.filter((notif) => 
        new Date(notif.timestamp) >= oneWeekAgo
      );

      // Sort notifications by timestamp (latest first)
      recentNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      notifList.innerHTML = "<h3>Notifications</h3>";

      if (recentNotifications.length > 0) {
        // Populate modal with sorted notifications and mark them as read
        recentNotifications.forEach((notif) => {
          const notifItem = document.createElement("div");
          notifItem.classList.add("notif-item");
          notifItem.innerHTML = `
            <p>${notif.message}</p>
            <p><small>${new Date(notif.timestamp).toLocaleString()}</small></p>
          `;
          notifList.appendChild(notifItem);

          // Mark as read
          database.ref(`notification_web/${notif.id}`).update({ status: "read" });
        });

        // Update badge after marking notifications as read
        updateNotifBadge();
      } else {
        notifList.innerHTML = "<p>No recent notifications available.</p>";
      }
    } else {
      notifList.innerHTML = "<p>No notifications available.</p>";
    }
  });
}


// Close modal when clicking outside content
window.onclick = function (event) {
    const notifModal = document.getElementById("notifModal");
    if (event.target === notifModal) {
        notifModal.style.display = "none";
    }
};

// Close modal when clicking close button
document.getElementById("closeModal").onclick = function () {
    document.getElementById("notifModal").style.display = "none";
};

// Initialize notification badge update
document.addEventListener("DOMContentLoaded", updateNotifBadge);


  // Close modal
  document.getElementById("closeModal").onclick = function () {
    const notifModal = document.getElementById("notifModal");
    if (notifModal) notifModal.style.display = "none";
  };

  // Close modal when clicking outside content
  window.onclick = function (event) {
    const notifModal = document.getElementById("notifModal");
    if (event.target === notifModal) {
      notifModal.style.display = "none";
    }
  };

  // Initialize badge update on DOM load
  document.addEventListener("DOMContentLoaded", updateNotifBadge);


 

function togglePassword(inputId, icon) {
  const inputField = document.getElementById(inputId);
  
  if (inputField.type === "password") {
    inputField.type = "text";
    icon.classList.remove("fi-rr-eye-crossed");
    icon.classList.add("fi-rr-eye");
  } else {
    inputField.type = "password";
    icon.classList.remove("fi-rr-eye");
    icon.classList.add("fi-rr-eye-crossed");
  }
}

</script>
<script>
$(document).ready(function () {
    $("#accountForm").submit(function (e) {
        e.preventDefault(); // Prevent default form submission

        var formData = {

            currentPassword: $("#currentPassword").val(),
            newPassword: $("#newPassword").val(),
            confirmPassword: $("#confirmPassword").val()
        };

        $.ajax({
            type: "POST",
            url: "./config/update_password.php",  
            data: formData,
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: response.message,
                        confirmButtonText: "OK",
                    }).then(() => {
                        $("#accountForm")[0].reset(); // Reset form
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: response.message,
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Something went wrong. Try again!",
                });
            },
        });
    });
});
</script>

<script>
function togglePassword(fieldId, icon) {
    var inputField = document.getElementById(fieldId);
    if (inputField.type === "password") {
        inputField.type = "text";
        icon.classList.remove("fi-rr-eye-crossed");
        icon.classList.add("fi-rr-eye");
    } else {
        inputField.type = "password";
        icon.classList.remove("fi-rr-eye");
        icon.classList.add("fi-rr-eye-crossed");
    }
}
document.addEventListener("DOMContentLoaded", function () {
  let sidebar = document.querySelector(".sidebar");
  let menuButton = document.querySelector("#btn");

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", function () {
      sidebar.classList.toggle("open");

      // Adjust content width when sidebar toggles
      let homeSection = document.querySelector(".home-section");
      if (sidebar.classList.contains("open")) {
        homeSection.style.width = "calc(100% - 250px)";
        homeSection.style.left = "250px";
      } else {
        homeSection.style.width = "calc(100% - 78px)";
        homeSection.style.left = "78px";
      }
    });
  } else {
    console.error("Sidebar or menu button not found");
  }
});


</script>

</body>

</html>