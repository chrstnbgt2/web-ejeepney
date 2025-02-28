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
    <title>Drivers</title>
    <!-- Link Styles -->
    <link rel="stylesheet" href="./css/drivers.css" />
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
}/* Notification list */
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
    }/* 🚗 Driver Information Modal */
.driver-modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.driver-modal-content {
  background: #ffffff;
  width: 600px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: bold;
}

.close-modal {
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.close-modal:hover {
  color: black;
}

/* Form Layout */
.modal-body {
  padding: 15px 0;
}

.driver-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Name Fields */
.driver-name-container {
  display: flex;
  gap: 10px;
}

.driver-field {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.driver-field label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* Password Fields */
.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 35px;
  cursor: pointer;
  font-size: 18px;
  color: #777;
}

/* Error Message */
.error-message {
  color: red;
  font-size: 14px;
  display: none;
}

/* Footer */
.modal-footer {
  text-align: center;
  margin-top: 15px;
}

.save-button {
  background-color: #2B393B;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  width: 100%;
  font-weight: bold;
}

.save-button:hover {
  background-color: #1e2a2c;
}

/* Fade-in Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.input-field {
  width: 100%;
  padding: 8px;
  border: 2px solid black;  /* ✅ Thicker border */
  border-radius: 5px;
  font-size: 14px;
  outline: none; /* Prevents default blue outline */
  transition: border-color 0.3s ease-in-out;
}

/* 🔵 Highlight border when input is focused */
.input-field:focus {
  border-color: black; /* Change to your preferred focus color */
}
 

 /* ✅ MODAL OVERLAY */
 

/* ✅ MODAL CONTAINER */
.edit-container {
  padding: 20px;
}

/* ✅ Close Button */
.close-icon {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 22px;
  cursor: pointer;
}

/* ✅ INPUT FIELDS */
.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 2px solid #000;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

/* ✅ FLEXBOX FOR NAME FIELDS */
.name-container {
  display: flex;
  gap: 10px;
}

/* ✅ Make all Name Fields Equal */
.name-container div {
  flex: 1;
}

/* ✅ BUTTON STYLE */
.driver-save {
  width: 100%;
  padding: 12px;
  background-color: #1d1d1d;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.driver-save:hover {
  background-color: #444;
}


    </style>
  </head>

  <body>
    <!-- 🚗 Driver Information Modal -->
<div class="driver-modal" id="driverModal" style="display: none;">
  <section class="driver-modal-content">
    <div class="modal-header ">
      <h2 style="margin-left:200px">Driver Information</h2>
      <i class="bx bx-x close-modal" onclick="closeDriverModal()"></i>
    </div>
    
    <div class="modal-body">
      <div class="driver-form">
        
        <div class="driver-name-container">
          <div class="driver-field">
            <label>First Name</label>
            <input type="text" id="fname" class="input-field" required oninput="validateTextInput(this)">
          </div>
          <div class="driver-field">
            <label>Middle Name</label>
            <input type="text" id="mname" class="input-field" oninput="validateTextInput(this)">
          </div>
          <div class="driver-field">
            <label>Last Name</label>
            <input type="text" id="lname" class="input-field" required oninput="validateTextInput(this)">
          </div>
        </div>

        <div class="driver-field">
          <label>Email</label>
          <input type="email" id="email" class="input-field" required>
        </div>

        <div class="driver-field">
          <label>Phone Number</label>
          <input type="number" id="phoneNumber" class="input-field" required>
        </div>

        <div class="driver-field password-container">
          <label>Password</label>
          <input type="password" id="password" class="input-field" required oninput="validatePasswordMatch()">
          <i class="fi fi-rr-eye-crossed password-toggle" onclick="togglePasswordVisibility(event)"></i>
        </div>

        <div class="driver-field password-container">
          <label>Confirm Password</label>
          <input type="password" id="cpassword" class="input-field" required oninput="validatePasswordMatch()">
          <i class="fi fi-rr-eye-crossed password-toggle" onclick="togglePasswordVisibility(event)"></i>
        </div>

        <p id="passwordError" class="error-message">❌ Passwords do not match!</p>

      </div>
    </div>

    <div class="modal-footer">
      <button class="save-button" onclick="addDriver()">SAVE</button>
    </div>
  </section>
</div>

    <!-- POP-UP DELETE CONFIRMATION WINDOW -->
<div class="delete-jeep-container" style="display: none; ">
  <section class="add-container" style="width: 30%;">
    <div class="text">
    
      <i class="bx bx-x delete-close-icon"></i>
    </div>
    <h1>Are you sure you want to delete this driver?</h1>
    <div class="container" style="padding: 20px; padding-bottom: 40px">
      <button class="confirm-delete">Yes</button>
      <button class="cancel-delete">No</button>
    </div>
  </section>
</div>
<!-- ✏️ EDIT DRIVER MODAL -->
<div class="driver-modal edit-driver-modal" id="editDriverModal" style="display: none;">
  <section class="driver-modal-content">
    <div class="modal-header">
      <h2>Driver Information</h2>
      <i class="bx bx-x close-modal" onclick="closeEditModal()"></i>
    </div>

    <div class="modal-body">
      <div class="driver-form">
        
        <!-- Name Fields -->
        <div class="driver-name-container">
          <div class="driver-field">
            <label>First Name</label>
            <input type="text" id="edit-fname" class="input-field" required>
          </div>
          <div class="driver-field">
            <label>Middle Name</label>
            <input type="text" id="edit-mname" class="input-field">
          </div>
          <div class="driver-field">
            <label>Last Name</label>
            <input type="text" id="edit-lname" class="input-field" required>
          </div>
        </div>

        <!-- Email & Phone -->
        <div class="driver-field">
          <label>Email</label>
          <input type="email" id="edit-email" class="input-field" required>
        </div>

        <div class="driver-field">
          <label>Phone Number</label>
          <input type="number" id="edit-phoneNumber" class="input-field" required>
        </div>
        
      </div>
    </div>

    <!-- Footer - Save Button -->
    <div class="modal-footer">
      <button class="save-button" onclick="editDriverData()">SAVE</button>
    </div>
  </section>
</div>



    <!-- POP-UP WINDOW FORM ENDS -->

     <!-- SIDE BAR -->
    <div class="sidebar">
      <div class="logo_details" style="margin-top: 20px">
        <img src="./img/logo.png" alt="" class="jeepney-logo"/>
        <div class="logo_name">E-JeepPay</div>
        <i class="bx bx-menu" id="btn"></i>
      </div>
      <ul class="nav-list" style="margin-top: 40px">
        <li>
          <a href="dashboard.php" >
            <i class="bx bx-grid-alt" ></i>
            <span class="link_name"  >Dashboard</span>
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
          <a href="drivers.php" style="height: 34px" id="active">
            <!-- <img src="./img/driver.png" style="width:21px; height:21px; margin-left: 14.5px;"> -->
            <i class="fi fi-br-driver-man" id="active-icon"></i>
            <span class="link_name"  id="active-name">Driver</span>
          </a>
          <span class="tooltip">Driver</span>
        </li>
        <li>
          <a href="user.php">
            <i class="bx bx-user"></i>
            <span class="link_name">User</span>
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
          
        <div class="topbar-user" style="margin-left: 0; text-align: left;">
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
          <div class="container">
            <h1 class="text-left">DATA RECORDS</h1>
            <section class="components-layout">
              <div class="grow1">
                <div class="combobox">
                  <select id="timestampFilter">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>
             <input type="text" class="search-input" name="searchbar" id="searchbar" placeholder="Search..." >

              </div>
              <div class="grow1"></div>
              <div class="grow1">
                <button class="add-button">
                  <img src="./img/plus.png" alt="" />
                  <p>Add</p>
                </button>
              </div>
            </section>
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
                    <th>Phone Number</th>
                    <th>Date Added</th>
                    <th>Action</th>
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
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>  
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="./js/logout.js"></script> 

    <script src="./js/script.js"></script>
    <script src="./js/drivers.js"></script> 
    <script>
      const addButton = document.querySelector(".add-button");
      const closeIcon = document.querySelector(".close-icon");
      const jeepContainer = document.querySelector(".driver-jeep-container");

      addButton.addEventListener("click", () => {
        jeepContainer.style.display = "flex";
      });
      closeIcon.addEventListener("click", () => {
        jeepContainer.style.display = "none";
      });

     
 

      const deleteButton = document.querySelector(".delete-close-icon");
      const deleteContainer = document.querySelector(".delete-jeep-container");
      const cancelDelete = document.querySelector(".cancel-delete");

      deleteButton.addEventListener("click", () => {
        deleteContainer.style.display = "none";
      });
      cancelDelete.addEventListener("click", () => {
        deleteContainer.style.display = "none";
      });
    </script> 
 

     <script>
function validateTextInput(input) {
  input.value = input.value.replace(/[^A-Za-z\s]/g, ""); 
}

      function togglePasswordVisibility(event) {
  const passwordInput = event.target.previousElementSibling;
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    event.target.classList.remove("fi-rr-eye-crossed");
    event.target.classList.add("fi-rr-eye");
  } else {
    passwordInput.type = "password";
    event.target.classList.remove("fi-rr-eye");
    event.target.classList.add("fi-rr-eye-crossed");
  }
}

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
<script type="text/javascript">
 


document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");

  if (!searchInput) {
    console.error("❌ ERROR: Search input not found!");
    return;
  }

  // Event listener for search input
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterTable(searchTerm);
  });
});

/**
 * ✅ Filters the driver table based on search input
 */
function filterTable(searchTerm) {
  const rows = document.querySelectorAll("#dataTableBody tr");
  searchTerm = searchTerm.trim().toLowerCase(); // Normalize search term

  rows.forEach((row, index) => {
  
    const firstName = row.children[1]?.textContent.trim().toLowerCase() || "";
    const middleName = row.children[2]?.textContent.trim().toLowerCase() || "";
    const lastName = row.children[3]?.textContent.trim().toLowerCase() || "";
    const email = row.children[4]?.textContent.trim().toLowerCase() || "";
    const phone = row.children[5]?.textContent.trim().toLowerCase() || "";
    const timestampStr = row.getAttribute("data-timestamp") || "";

    let matchesDate = false;

    if (timestampStr) {
      let dateObj = new Date(Number(timestampStr)); // Convert timestamp to Date
      let formattedDate = dateObj.toLocaleDateString("en-US"); // MM/DD/YYYY format
      let monthStr = (dateObj.getMonth() + 1).toString(); // Month (1-12)
      let dayStr = dateObj.getDate().toString(); // Day (1-31)
      let yearStr = dateObj.getFullYear().toString(); // Year

      console.log(
        `🔍 Row ${index + 1} - Checking Date: ${formattedDate} | Month: ${monthStr} | Day: ${dayStr} | Year: ${yearStr} | Search Term: "${searchTerm}"`
      );

      console.log(
        `👉 Comparing "${searchTerm}" with:
         - Formatted Date: ${formattedDate.includes(searchTerm)}
         - Year: ${yearStr.includes(searchTerm)}
         - Month: ${monthStr.includes(searchTerm)}
         - Day: ${dayStr.includes(searchTerm)}`
      );

      matchesDate =
        formattedDate.includes(searchTerm) ||
        yearStr.includes(searchTerm) ||
        monthStr.includes(searchTerm) ||
        dayStr.includes(searchTerm);
    }

   let matchesSearch =
  searchTerm === "" ||
  firstName.includes(searchTerm) ||
  middleName.includes(searchTerm) ||
  lastName.includes(searchTerm) ||
  email.includes(searchTerm) ||
  phone.includes(searchTerm) ||
  matchesDate; // ✅ Ensure this correctly includes date matching

    if (searchTerm === "") {
      row.style.display = ""; // ✅ Show all when input is empty
      console.log(`✅ Row ${index + 1}: SHOW (No Filter)`);
      return;
    }

    if (matchesSearch) {
      console.log(`✅ Row ${index + 1}: SHOW (Matches ${searchTerm})`);
      row.style.display = ""; 
    } else {
      console.log(`❌ Row ${index + 1}: HIDE (Does NOT Match ${searchTerm})`);
      row.style.display = "none";
    }
  });
}



document.addEventListener("DOMContentLoaded", function () {
  const timestampFilter = document.getElementById("timestampFilter");

  if (!timestampFilter) {
    console.error("❌ ERROR: Timestamp filter dropdown not found!");
    return;
  }

  // Event listener for timestamp filter dropdown
  timestampFilter.addEventListener("change", function () {
    const selectedFilter = timestampFilter.value;
    filterTableByDate(selectedFilter);
  });
});

/**
 * ✅ Function to filter table rows based on timestamp
 */
function filterTableByDate(filterType) {
  const rows = document.querySelectorAll("#dataTableBody tr");
  const currentTime = Date.now();

  let startTime = 0;

  switch (filterType) {
    case "today":
      startTime = new Date().setHours(0, 0, 0, 0); // Midnight today
      break;
    case "thisWeek":
      const today = new Date();
      const firstDayOfWeek = today.getDate() - today.getDay(); 
      startTime = new Date(today.setDate(firstDayOfWeek)).setHours(0, 0, 0, 0);
      break;
    case "thisMonth":
      startTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      break;
    case "thisYear":
      startTime = new Date(new Date().getFullYear(), 0, 1).getTime();
      break;
    default:
      startTime = 0; // Show all records
  }

  // ✅ Filter table rows based on timestamp
  rows.forEach((row) => {
    const timestampCell = row.getAttribute("data-timestamp");  
    const rowTimestamp = timestampCell ? parseInt(timestampCell, 10) : 0; // ✅ Default to 0 if missing

    row.style.display = (rowTimestamp >= startTime && rowTimestamp <= currentTime) ? "" : "none";
  });
}

// ✅ Close Modal
function closeDriverModal() {
  document.getElementById("driverModal").style.display = "none";
}
function closeDriverModalEdit() {
  document.getElementById("driverModalEdit").style.display = "none";
}
// ✅ Toggle Password Visibility
function togglePasswordVisibility(event) {
  const inputField = event.target.previousElementSibling;
  if (inputField.type === "password") {
    inputField.type = "text";
    event.target.classList.replace("fi-rr-eye-crossed", "fi-rr-eye");
  } else {
    inputField.type = "password";
    event.target.classList.replace("fi-rr-eye", "fi-rr-eye-crossed");
  }
}

 function validatePasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("cpassword").value;
  const errorText = document.getElementById("passwordError");

  // ✅ Show error ONLY when the confirm password field is NOT empty
  if (confirmPassword.length > 0 && password !== confirmPassword) {
    errorText.style.display = "block";
  } else {
    errorText.style.display = "none";
  }
}

// ✅ Attach Event Listeners to Both Inputs
document.getElementById("password").addEventListener("input", validatePasswordMatch);
document.getElementById("cpassword").addEventListener("input", validatePasswordMatch);


// ✅ Show Modal
function showDriverModal() {
  document.getElementById("driverModal").style.display = "flex";
}

// ✅ Call showDriverModal() when needed
document.querySelector(".add-button").addEventListener("click", showDriverModal);
function showEditContainer() {
  const editContainer = document.querySelector(".edit-driver-modal");
  if (editContainer) {
    editContainer.style.display = "flex";
  } else {
    console.error("❌ Error: Edit modal not found in the DOM.");
  }
}

function closeEditModal() {
  const editContainer = document.querySelector(".edit-driver-modal");
  if (editContainer) {
    editContainer.style.display = "none";
  }
}

document.getElementById("dataTableBody").addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-icon")) {
    const row = event.target.closest("tr");
    const driverID = row ? row.getAttribute("data-id") : null;

    if (driverID) {
      fetchDriverData(driverID);
      showEditContainer(); // ✅ Show modal after fetching data
    } else {
      alert("❌ Driver ID not found.");
    }
  }
});

</script>


  </body>
</html>
