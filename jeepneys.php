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
    <title>Jeepneys</title>
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

 <style type="text/css">
  
.form-group {
  text-align: left;
  margin-bottom: 10px;
}

.form-group label {
  font-weight: bold;
  font-size: 14px;
}

/* 🟡 Input Fields */
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* ✅ Buttons */
.jeep-save {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  width: 100%;
  font-weight: bold;
  margin-top: 10px;
}

.jeep-save:hover {
  background-color: #0056b3;
}
 
 

    </style>
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

    /* Fade-in animation */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
/* Center the modal and improve spacing */
.modal-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Dim background */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Style modal content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px; /* Adjust width */
  max-width: 90%;
  text-align: center; /* Center align text */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* Close button styling */
.close-modal {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
  color: red;
}

/* Header styling */
.modal-content h2 {
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: bold;
}

/* Align details properly */
.modal-content p {
  font-size: 16px;
  margin: 5px 0;
}

/* Highlighted labels */
.modal-content strong {
  font-weight: bold;
  color: #333;
}

/* Driver History Styling */
#viewDriverHistory {
  list-style-type: none;
  padding: 0;
  text-align: left;
  margin-top: 10px;
}

#viewDriverHistory li {
  background: #f9f9f9;
  padding: 8px 10px;
  margin: 5px 0;
  border-radius: 5px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Dotted bullet points for driver history */
#viewDriverHistory li::before {
  content: "•";
  color: #007bff;
  font-size: 16px;
  padding-right: 8px;
}

    </style>
  </head>
  <body>


    <!-- POP-UP WINDOW FORM -->
    <div class="info-jeep-container" style="display: none">
      <section class="add-container">
        <div class="text">
          <h1>Jeepney Information</h1>
          <i class="bx bx-x close-icon"></i>
        </div>
        <div class="form-group">
          <div class="semi-con">
            <div class="jeep-plate">
              <h4>Plate No. :</h4>
              <input
                type="text"
                name="plate-jeep"
                class="in"
                required
                id="add-plateNumber"
              />
            </div>
            <div class="jeep-capacity">
              <h4>Capacity :</h4>
              <input
                type="number"
                name="capacity-jeep"
                class="in"
                required
                id="add-capacity"
              />
            </div>
            <div class="jeep-route">
              <h4>Route :</h4>
              <input
                type="text"
                name="route-jeep"
                class="in"
                required
                id="add-route"
              />
            </div>
            <div class="jeep-status">
              <h4>Status :</h4>
              <select
                name="status-jeep"
                class="in"
                required
                id="status"
                style="margin-right: 10px"
              >
                <option value="in-service">In Service</option>
                <option value="out-of-service">Out Of Service</option>
              </select>
            </div>
            <br />
            <input
              type="submit"
              class="jeep-save"
              style="width: 100px;background-color: #2B393B ;"
              value="SAVE"
              onclick="saveJeepney()"
            />
          </div>
        </div>
      </section>
    </div>
    
 <!-- ✏️ EDIT JEEPNEY MODAL -->
<div class="info-jeep-container" id="editJeepContainer" style="display: none">
  <section class="add-container">
    <div class="text">
      <h1>Jeepney Information</h1>
      <i class="bx bx-x close-icon" id="editCloseIcon"></i>
    </div>
    <div class="form-group">
      <div class="semi-con">
        <input type="hidden" id="editJeepId" />

        <!-- Plate Number -->
        <div class="jeep-plate">
          <h4>Plate No. :</h4>
          <input type="text" name="edit-plate-jeep" class="in" required id="editPlateNumber" />
        </div>

        <!-- Capacity -->
        <div class="jeep-capacity">
          <h4>Capacity :</h4>
          <input type="number" name="edit-capacity-jeep" class="in" required id="editCapacity" />
        </div>

        <!-- Route -->
        <div class="jeep-route">
          <h4>Route :</h4>
          <input type="text" name="edit-route-jeep" class="in" required id="editRoute" />
        </div>

        <!-- Status Dropdown -->
        <div class="jeep-status">
          <h4>Status :</h4>
          <select name="edit-status-jeep" class="in" required id="editStatus" style="margin-right: 10px">
            <option value="in-service">In Service</option>
            <option value="out-of-service">Out Of Service</option>
          </select>
        </div>
        <div class="jeep-driver">
  <h4>Driver :</h4>
  <select name="edit-driver-jeep" class="in driver-select" required id="editDriverSelect">
    <option value="">Select a Driver</option>
  </select>
</div>

        <br />

        <!-- Save Button -->
        <input type="submit" class="jeep-save" style="width: 100px; background-color: #2B393B;" value="Update" onclick="updateJeepney()" />
      </div>
    </div>
  </section>
</div>

<!-- POP-UP DELETE CONFIRMATION WINDOW -->
<div class="delete-jeep-container" style="display: none;">
  <section class="add-container" style="width:40%">
    <div class="text text-right">
      
      <i class="bx bx-x delete-close-icon"></i>
    </div>
    <h1>Are you sure you want to delete this Jeepney?</h1>
    <div class="container" style="padding: 20px; padding-bottom: 40px">
      <button class="confirm-delete">Yes</button>
      <button class="cancel-delete">No</button>
    </div>
  </section>
</div>

    <!-- POP-UP WINDOW FORM ENDS -->

    <!-- SIDE BAR -->
    <div class="sidebar">
      <div class="logo_details" style="margin-top: 20px">
        <img src="./img/logo.png" alt="" class="jeepney-logo" />
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
          <a href="jeepneys.php"  id="active">
            <i class="bx bx-car"  id="active-icon"></i>
            <span class="link_name"  id="active-name">Jeepneys</span>
          </a>
          <span class="tooltip">Jeepneys</span>
            <span class="display_count" ></span>

        </li>
        <li>
          <a href="drivers.php" style="height: 34px">
            <!-- <img src="./img/driver.png" style="width:21px; height:21px; margin-left: 14.5px;"> -->
            <i class="fi fi-br-driver-man"></i>
            <span class="link_name">Driver</span>
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

    <!-- BODY  -->
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
        
<div id="jeepneyModalContainer" class="modal-container" style="display:none;">
  <div class="modal-content">
    <span class="close-modal" onclick="closeJeepneyModal()">&times;</span>
 <!--    <h2>Jeepney Details</h2>
    <p><strong>Plate Number:</strong> <span id="viewPlateNumber"></span></p>
    <p><strong>Capacity:</strong> <span id="viewCapacity"></span></p>
    <p><strong>Route:</strong> <span id="viewRoute"></span></p>
    <p><strong>Status:</strong> <span id="viewStatus"></span></p>
     -->
    <h3>Driver History</h3>
    <ul id="viewDriverHistory"></ul>
  </div>
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
            <h1 class="text-left">DATA RECORDS</h1>
            <section class="components-layout">
              <div class="grow1">
                <div class="combobox">
                  <select  id="timeFilter" onchange="filterTable()" >
                    <option value="allTime">All Time</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>
             <div class="combobox">
  <select id="statusFilter" onchange="filterTable()" style="margin-right: 10px;">
    <option value="allStatus">All status</option>
    <option value="in-service">In Service</option>   
    <option value="out-of-service">Out Of Service</option>  
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
                    <th>Plate No.</th>
                    <th>Capacity</th>
                    <th>Route</th>
                    <th>Status</th>
                     <th>Driver Assigned</th>
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

    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
    <script src="./js/script.js"></script> 
    <script src="./js/jeepneys.js"></script> 
   <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
        <script src="./js/logout.js"></script> 


 <!-- JAVASCRIPT TO OPEN AND CLOSE MODAL -->
<script>
  document.getElementById("editCloseIcon").addEventListener("click", function () {
    document.getElementById("editJeepContainer").style.display = "none";
  });

function filterTable() {
  const statusFilter = document.getElementById("statusFilter").value.toLowerCase().trim();
  const timeFilter = document.getElementById("timeFilter").value;
  const searchQuery = document.getElementById("searchbar").value.trim().toLowerCase();
  const table = document.getElementById("dataTableBody");
  const rows = table.getElementsByTagName("tr");

  // ✅ Get timestamps for filtering
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];

    // ✅ Extract values from correct table columns
    let id_tb = row.cells[0]?.textContent.trim().toLowerCase();
    let plateNo = row.cells[1]?.textContent.trim().toLowerCase();
    let capacity = row.cells[2]?.textContent.trim().toLowerCase();
    let route = row.cells[3]?.textContent.trim().toLowerCase();
    let status = row.cells[4]?.textContent.trim().toLowerCase();  // ✅ Status column at index 4
    let driverAssigned = row.cells[5]?.textContent.trim().toLowerCase();
    let dateadded = row.cells[6]?.textContent.trim().toLowerCase();  
    let timestamp = parseInt(row.getAttribute("data-timestamp")) || 0;  

    console.log(`Row ${i + 1} - Status: "${status}" | Selected Filter: "${statusFilter}"`);

    // ✅ Status filtering
    let matchesStatus = statusFilter === "allstatus" || statusFilter === "all status" || statusFilter === "" || status === statusFilter;
    
    // ✅ Time filtering
    let matchesTime = false;
    switch (timeFilter) {
      case "allTime":
        matchesTime = true;
        break;
      case "today":
        matchesTime = timestamp >= startOfToday;
        break;
      case "thisWeek":
        matchesTime = timestamp >= startOfWeek;
        break;
      case "thisMonth":
        matchesTime = timestamp >= startOfMonth;
        break;
      case "thisYear":
        matchesTime = timestamp >= startOfYear;
        break;
    }

    // ✅ Extract Month, Day, and Year for better Date Searching
    let matchesDate = false;
    if (dateadded) {
      let [month, day, year] = dateadded.split("/");
      matchesDate = dateadded.includes(searchQuery) || 
                    (month && month.includes(searchQuery)) ||
                    (day && day.includes(searchQuery)) ||
                    (year && year.includes(searchQuery));
    }

    // ✅ Apply search filter (match Plate No., Route, Driver, Status, or Date)
    let matchesSearch = searchQuery === "" ||    
                        id_tb.includes(searchQuery) || 
                        plateNo.includes(searchQuery) ||
                        capacity.includes(searchQuery) ||
                        route.includes(searchQuery) ||
                        status.includes(searchQuery) ||  
                        driverAssigned.includes(searchQuery) ||
                        matchesDate;

    // ✅ Show/Hide row based on all filters
    row.style.display = matchesStatus && matchesTime && matchesSearch ? "" : "none";
  }
}

// ✅ Attach Event Listeners for Real-time Filtering
document.getElementById("timeFilter").addEventListener("change", filterTable);
document.getElementById("statusFilter").addEventListener("change", filterTable);
document.getElementById("searchbar").addEventListener("keyup", filterTable);

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
