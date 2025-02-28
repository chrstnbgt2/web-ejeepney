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
  <title>E-Jeep Fare</title>
  <!-- Link Styles -->
  <link rel="stylesheet" href="./css/style.css" />
  <link rel="stylesheet" href="./css/fare.css" />
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
  <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css'>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Firebase App (the core Firebase SDK) -->
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
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
          <a href="./dashboard.php">
            <i class="bx bx-grid-alt" ></i>
            <span class="link_name" >Dashboard</span>
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
          <a href="./fare.php"  id="active">
            <i class="bx bx-dollar" id="active-icon"></i>
            <span class="link_name" id="active-name">Fare</span>
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
            <li>
        <a href="#" id="logoutButton">
          <i class="bx bx-log-out"></i>
          <span class="link_name">Sign Out</span>
        </a>
      </li>

      </ul>
    </div>
  <!-- SIDE BAR ENDS -->
  <section class="home-section">
    <section class="layout">
      <div class="header">
        <div class="container">
      
          <div class="topbar-user" style="margin-left:500px;">
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
  <div class="modal-content text-left">
    <span class="close" id="closeModal">&times;</span>
 
    <div id="notifList"></div>
  </div>
</div>

          </div>
        </div>
      </div>
      <div class="body">
        <div  class="container">
        <h1   class="text-left" style="font-size:2vw;margin-left: 20px;">
          COMPUTATION OF FARES
        </h1>
        <div class="fare-container">
          <div class="fare-box">
            <h3 class="fare-title">
              Regular Fare
              <span class="edit-icon" onclick="toggleEdit('regular')">✎</span>
            </h3>
            <div class="fare-details">
              <p>First Four (4) kilometers:</p>
              <div class="input-container">
                <span class="peso-sign">₱</span>
                <input type="number" id="regular-first-km" value="14.00" readonly>
              </div>
            </div>
            <div class="fare-details">
              <p>Succeeding kilometers:</p>
              <div class="input-container" style="margin-left: 4.5px;">
                <span class="peso-sign">₱</span>
                <input type="number" id="regular-succeeding-km" value="2.20" readonly>
              </div>
            </div>
            <div class="butt-con">
              <button class="fare-button butt-icon" id="regular-save-button" onclick="saveFare('regular')" style="display: none;">Save</button>
            </div>
          </div>

          <div class="fare-box">
            <h3 class="fare-title">
              Discount (20%) Fare
             </h3>
            <div class="fare-details">
              <p>First Four (4) kilometers:</p>
              <div class="input-container">
                <span class="peso-sign">₱</span>
                <input type="number" id="discount-first-km" readonly>
              </div>
            </div>
            <div class="fare-details">
              <p>Succeeding kilometers:</p>
              <div class="input-container" style="margin-left: 4.5px;">
                <span class="peso-sign">₱</span>
                <input type="number" id="discount-succeeding-km" readonly>
              </div>
            </div>
            <div class="butt-con">
             </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  </section>
  <!-- Scripts -->
  <script src="./js/script.js"></script>
  <script src="./js/fare.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
        <script src="./js/logout.js"></script> 

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const username = localStorage.getItem("username");
      if (username) {
        document.getElementById("welcomeMessage").textContent = "Welcome " + username;
      } else {
        document.getElementById("welcomeMessage").textContent = "Welcome";
      }
    });
  </script> 
  <script>
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
</script>

</body>

</html>
