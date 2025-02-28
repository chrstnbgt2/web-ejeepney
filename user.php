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
    <title>User</title>
    <!-- Link Styles -->
    <link rel="stylesheet" href="./css/jeepneys.css" />
    <link rel="stylesheet" href="./css/style.css" />
    <link
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-straight/css/uicons-bold-straight.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-straight/css/uicons-bold-straight.css"
    />

    
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
/* Discount Modal Styling */
.discount-modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

/* Discount Modal Content Box */
.discount-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  max-width: 600px;
  text-align: center;
  position: relative;
}

/* Close Button */
.discount-close-modal {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 25px;
  cursor: pointer;
}

/* Discount Modal Rows */
.discount-modal-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

/* Columns Inside Rows */
.discount-modal-col {
  width: 50%;
  text-align: left;
  font-size: 16px;
}

/* File Link */
#discountModalFileUrl {
  color: blue;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .discount-modal-content {
    width: 90%;
  }
}
/* Style the select dropdown */
#statusFilter {
  appearance: none; /* Removes default browser styles */
  background-color: white;
  border: 1px solid #d1d1d1;
  border-radius: 10px; /* Rounded corners */
  padding: 10px 30px 10px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  outline: none;
  width: 150px; /* Set width */
  text-align: left;
  transition: 0.3s ease-in-out;
  position: relative;
  margin-right: 25px;
}
#statusesFilter {
  appearance: none; /* Removes default browser styles */
  background-color: white;
  border: 1px solid #d1d1d1;
  border-radius: 10px; /* Rounded corners */
  padding: 10px 30px 10px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  outline: none;
  width: 150px; /* Set width */
  text-align: left;
  transition: 0.3s ease-in-out;
  position: relative;
  margin-right: 25px;
}

/* Add a custom dropdown arrow */
#statusesFilter {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23222222"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
}

/* Hover Effect */
#statusesFilter:hover {
  border-color: #aaa;
}

/* Focus Effect */
#statusesFilter:focus {
  border-color: #888;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}

/* Make sure it looks good on smaller screens */
@media screen and (max-width: 768px) {
  #statusesFilter {
    width: 120px;
    font-size: 12px;
  }
}

/* Add a custom dropdown arrow */
#statusFilter {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23222222"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
}

/* Hover Effect */
#statusFilter:hover {
  border-color: #aaa;
}

/* Focus Effect */
#statusFilter:focus {
  border-color: #888;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}

/* Make sure it looks good on smaller screens */
@media screen and (max-width: 768px) {
  #statusFilter {
    width: 120px;
    font-size: 12px;
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
          <a href="dashboard.php"  >
            <i class="bx bx-grid-alt" ></i>
            <span class="link_name" >Dashboard</span>
          </a>
          <span class="tooltip">Dashboard</span>
        </li>
        <li>
          <a href="jeepneys.php">
            <i class="bx bx-car"></i>
            <span class="link_name">Jeepneys</span>
          </a>
          <span class="tooltip">Jeepneys</span>
            <span class="display_count"></span>

        </li>
        <li>
          <a href="drivers.php" style="height: 34px">
             <i class="fi fi-br-driver-man"></i>
            <span class="link_name">Driver</span>
          </a>
          <span class="tooltip">Driver</span>
        </li>
        <li>
          <a href="user.php" id="active">
            <i class="bx bx-user" id="active-icon"></i>
            <span class="link_name" id="active-name">User</span>
          </a>
          <span class="tooltip">User</span>
        </li>
        <li>
          <a href="fare.php">
            <i class="bx bx-dollar"></i>
            <span class="link_name">Fare</span>
          </a>
          <span class="tooltip">Fare</span>
        </li>
        <li>
          <a href="setting.php" id="settings-link">
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
       
            <div class="topbar-user">
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
          <div class="container">
            <h1 id="tableHeader" class="text-left">DATA RECORDS</h1>

            <section class="components-layout">
              <div class="grow1" style="display: flex; align-items: center">
                <div class="combobox">
                  <select id="dateFilter">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>
                  <div class=" ">
                  <select id="statusFilter">
                    <option value="">All Type</option>
                    <option value="Discounted">Discounted</option>
                    <option value="Not Discounted">Not Discounted</option>
                    
                  </select>
                </div>
                     <div class=" ">
                  <select id="statusesFilter">
                    <option value="">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                    
                  </select>
                </div>
                <div class="request-notification-form">
                  <button class="notification-button">
                    <span class="text">Request</span>
                    <!-- Text now dynamically controlled -->
                    <span class="notification-bubble" id="notification-count"
                      >0</span
                    >
                    <i
                      class="fi fi-rr-poll-h"
                      style="padding-left: 8px; margin-top: 3px"
                    ></i>
                  </button>
                </div>
                     <input type="text" class="search-input" placeholder="Search.." style="margin-left: 15px;"/>
                <!-- Confirmation Modal -->
                <div id="confirmationModal" class="modal" >
                  <div class="modal-content" style="width: 30%;">
                    <span class="close" id="actionClose">&times;</span>
                    <h3>Confirm Action</h3>
                    <p id="modalMessage">
                      Are you sure you want to perform this action?
                    </p>
                    <div class="modal-buttons">
                      <button id="confirmButton" class="confirm">Yes</button>
                      <button id="cancelButton" class="cancel">No</button>
                    </div>
                  </div>
                </div>
                <!-- confirmation modal ends -->
                <!-- Details Modal -->
                <div id="detailsModal" class="modal">
                  <div class="modal-content" style="width: 30%;">
                    <span class="close">&times;</span>
                    <h3>Passenger Details</h3>
                    <div id="detailsContent">
                      <!-- Dynamic content will be populated here -->
                    </div>
                    <div class="modal-buttons">
                      <button id="closeDetailsButton" class="cancel">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
                <!-- details modal ends -->
              </div>
        
            </section>

     <!-- Discount Request Modal -->
<div id="discountRequestModal" class="discount-modal">
  <div class="discount-modal-content">
    <span class="discount-close-modal" onclick="closeDiscountModal()">&times;</span>
    <h2>Discount Request Details</h2>
    <div id="discount-modal-body">
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Full Name:</strong></div>
        <div class="discount-modal-col"><span id="discountModalFullName"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Email:</strong></div>
        <div class="discount-modal-col"><span id="discountModalEmail"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Phone:</strong></div>
        <div class="discount-modal-col"><span id="discountModalPhone"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Birth Date:</strong></div>
        <div class="discount-modal-col"><span id="discountModalBirthDate"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Address:</strong></div>
        <div class="discount-modal-col"><span id="discountModalAddress"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>City:</strong></div>
        <div class="discount-modal-col"><span id="discountModalCity"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>State:</strong></div>
        <div class="discount-modal-col"><span id="discountModalState"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Status:</strong></div>
        <div class="discount-modal-col"><span id="discountModalStatus"></span></div>
      </div>
      <div class="discount-modal-row">
        <div class="discount-modal-col"><strong>Uploaded File:</strong></div>
        <div class="discount-modal-col">
          <a id="discountModalFileUrl" href="#" target="_blank">View File</a>
        </div>
      </div>
    </div>
  </div>
</div>

            <!-- table -->
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                     <th>ID</th>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone No.</th>
                    <th>Type</th>
                    <th>Date Registered</th>
                  </tr>
                </thead>
                <tbody id="dataTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>
    <!-- Scripts -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js"></script>
    <script src="./js/script.js"></script>
    <script src="./js/user.js"></script> 
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
        <script src="./js/logout.js"></script> 

 
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
