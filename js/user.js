// Firebase configuration
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage(); 
// References
const usersRef = database.ref("users/accounts");
const discountRequestsRef = database.ref("discountRequests");

const searchInput = document.querySelector(".search-input");
const filterSelect = document.querySelector(".combobox select");
const notificationButton = document.querySelector(".notification-button");
const timestampFilter = document.getElementById("timestampFilter");

let isOriginalTable = true; // Track table state
let firebaseData = {}; // Store Firebase data
// Function to check if the user is logged in
 

 

// Fetch users and render initial table
usersRef.on("value", (snapshot) => {
  const allUsers = snapshot.val() || {};
  firebaseData = {};

  for (let userId in allUsers) {
    if (allUsers[userId].role === "user") {
      firebaseData[userId] = allUsers[userId];
    }
  }

  if (isOriginalTable) {
    renderTable(firebaseData);
  }
});

// Toggle between Users and Requests
notificationButton.addEventListener("click", () => {
  isOriginalTable = !isOriginalTable;
  notificationButton.classList.toggle("active");

  const textNode = notificationButton.querySelector("span.text");
  if (textNode) {
    textNode.textContent = isOriginalTable ? "Request" : "User Info";
  }

  const bubble = notificationButton.querySelector(".notification-bubble");
  if (bubble) {
    bubble.style.display = isOriginalTable ? "flex" : "none";
  }

  const tableHead = document.querySelector("table thead");
  if (isOriginalTable) {
    tableHead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone No.</th>
        <th>Type</th>
        <th>Date Registered</th>
      </tr>`;
    renderTable(firebaseData);
  } else {
    tableHead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Date Requested</th>
        <th>Status</th>
        <th>Action</th>
      </tr>`;
    renderDiscountTable();
  }

  toggleStatusFilter(); // ✅ Ensure correct filter is shown
});

// Function to Update Header Title
function updateHeaderTitle(title) {
  document.getElementById("tableHeader").innerText = title;
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const statusFilter = document.getElementById("statusFilter");
  const dateFilter = document.getElementById("dateFilter");
 const statusesFilter = document.getElementById("statusesFilter");

  if (!searchInput || !statusFilter || !dateFilter) {
    console.error("❌ ERROR: One or more filter elements not found!");
    return;
  }

  // ✅ Attach event listeners to all filters
  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  dateFilter.addEventListener("change", applyFilters);
 statusesFilter.addEventListener("change", applyFilters);
 
  // ✅ Hide Status Filter when viewing the Discount Passenger Request table
function toggleStatusFilter() {
  const tableHeader = document.getElementById("tableHeader").innerText;
  const statusesFilter = document.getElementById("statusesFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (tableHeader === "DISCOUNT PASSENGER REQUEST") {
    statusesFilter.style.display = "block"; // ✅ Show status filter for discount table
    statusFilter.style.display = "none"; // ❌ Hide user table status filter
  } else {
    statusesFilter.style.display = "none"; // ❌ Hide discount status filter
    statusFilter.style.display = "block"; // ✅ Show user table status filter
  }
}


  // ✅ Apply filters when the table is updated
 function applyFilters() {
  const searchTerm = document.querySelector(".search-input").value.trim().toLowerCase();
  const selectedStatus = document.getElementById("statusFilter").value.toLowerCase();
  const selectedDateFilter = document.getElementById("dateFilter").value;
  const selectedStatusesFilter = document.getElementById("statusesFilter").value.toLowerCase(); // ✅ Get statusesFilter value

  if (document.getElementById("tableHeader").innerText === "DATA RECORDS") {
    renderTable(firebaseData, selectedDateFilter, searchTerm, selectedStatus);
  } else {
    renderDiscountTable(searchTerm, selectedDateFilter, selectedStatusesFilter); // ✅ Pass statusesFilter for Discount Table
  }
}

  // ✅ Run filter toggle function initially
  toggleStatusFilter();
});


/**
 * ✅ Apply filters to both Users Table and Discount Table
 */


/**
 * ✅ Function to check if a timestamp falls within a selected time range
 */
function isWithinTimeRange(timestamp, timeFilter) {
  const currentTime = Date.now();
  let startTime = 0;

  switch (timeFilter) {
    case "today":
      startTime = new Date().setHours(0, 0, 0, 0);
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
      return true; // No filter applied
  }

  return timestamp >= startTime && timestamp <= currentTime;
}


function sanitizeHTML(str) {
  if (!str) return ""; // Ensure input is always a string

  // Remove script and event-handler attributes
  let temp = document.createElement("div");
  temp.textContent = str; // Convert to text, escaping any tags

  return temp.innerHTML
    .replace(/javascript:/gi, "") 
    .replace(/<script.*?>.*?<\/script>/gi, "")  
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, ""); 
}


function renderDiscountTable(searchTerm = "", timeFilter = "", statusFilter = "") {
  updateHeaderTitle("DISCOUNT PASSENGER REQUEST");

  // ✅ Hide the user status filter and show the statusesFilter
  document.getElementById("statusFilter").style.display = "none";
  document.getElementById("statusesFilter").style.display = "block";

  discountRequestsRef.once("value", (snapshot) => {
    const requestsData = snapshot.val();
    const tbody = document.getElementById("dataTableBody");
    tbody.innerHTML = "";

    if (requestsData) {
      let rows = [];

      for (let userId in requestsData) {
        for (let requestId in requestsData[userId]) {
          const request = requestsData[userId][requestId];
          const timestamp = request.timestamp || 0;
          const formattedDate = timestamp ? new Date(timestamp).toLocaleDateString() : "N/A";

          // ✅ Apply search filter
          const fullName = `${request.firstName || ""} ${request.middleName || ""} ${request.lastName || ""}`.toLowerCase();
          if (
            searchTerm &&
            !fullName.includes(searchTerm) &&
            !(request.email && request.email.toLowerCase().includes(searchTerm)) &&
            !(request.phone && request.phone.includes(searchTerm)) &&
            !(formattedDate.includes(searchTerm))
          ) continue;

          // ✅ Apply date filter
          if (timeFilter && timestamp && !isWithinTimeRange(timestamp, timeFilter)) continue;

          // ✅ Apply statuses filter (Pending, Approved, Rejected)
          if (statusFilter && request.status.toLowerCase() !== statusFilter) continue;

          let statusClass = `status-${request.status.toLowerCase()}`;
          const isPending = request.status === "Pending";
          const approveDisabled = isPending ? "" : "disabled";
          const rejectDisabled = isPending ? "" : "disabled";

          rows.push({
            timestamp,
            request,
            userId,
            requestId,
          });
        }
      }

      // ✅ Sort rows by timestamp (Newest to Oldest)
      rows.sort((a, b) => b.timestamp - a.timestamp);

      let id_number = 1;
      tbody.innerHTML = rows.map(row => {
        const request = row.request;
        return `
<tr>
  <td>${id_number++}</td>
  <td>${sanitizeHTML(request.firstName || "N/A")}</td>
  <td>${sanitizeHTML(request.middleName || "N/A")}</td>
  <td>${sanitizeHTML(request.lastName || "N/A")}</td>
  <td>${sanitizeHTML(request.email || "N/A")}</td>
  <td>${new Date(row.timestamp).toLocaleDateString()}</td>
  <td><span class="status-${sanitizeHTML(request.status.toLowerCase())}">${sanitizeHTML(request.status || "N/A")}</span></td>
  <td>
    <button class="request-action-icons" onclick="showConfirmationModal('approve', '${sanitizeHTML(row.userId)}', '${sanitizeHTML(row.requestId)}')" ${request.status === "Pending" ? "" : "disabled"}>
      <i class="fi fi-bs-check-circle"></i>
    </button>
    <button class="request-action-icons" onclick="showConfirmationModal('reject', '${sanitizeHTML(row.userId)}', '${sanitizeHTML(row.requestId)}')" ${request.status === "Pending" ? "" : "disabled"}>
      <i class="fi fi-bs-circle-xmark"></i>
    </button>
    <button class="request-action-icons" onclick="showConfirmationModal('delete', '${sanitizeHTML(row.userId)}', '${sanitizeHTML(row.requestId)}')">
      <i class="fi fi-ss-trash"></i>
    </button>
    <button class="request-action-icons" onclick="viewDiscountRequest('${sanitizeHTML(row.userId)}', '${sanitizeHTML(row.requestId)}')">
      <i class="fi fi-ss-dot-pending"></i>
    </button>
  </td>
</tr>

`;
      }).join("");

    } else {
      tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
    }
  });
}




/**
 * ✅ Render Discount Table with Filters
 */
function renderTable(data, timeFilter = "", searchTerm = "", statusFilter = "") {
  updateHeaderTitle("DATA RECORDS");
  
  // ✅ Show the status filter dropdown when viewing User Data
  document.getElementById("statusFilter").style.display = "block";
  
  // ✅ Hide the statusesFilter dropdown
  document.getElementById("statusesFilter").style.display = "none";

  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = "";

  if (data) {
    let rows = [];

    for (let id in data) {
      const user = data[id];

      const timestamp = user.createdAt ? Date.parse(user.createdAt) : 0; // Convert ISO date string (Firebase) to timestamp
      const formattedDate = timestamp ? new Date(timestamp).toLocaleDateString() : "N/A";

      if (user.role !== "user") continue;
      if (timeFilter && timestamp && !isWithinTimeRange(timestamp, timeFilter)) continue;

      let discountStatus = user.acc_type === "Discount" ? "Discounted" : "Not Discounted";
      if (statusFilter && discountStatus.toLowerCase() !== statusFilter) continue;

      const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
      if (
        searchTerm &&
        !fullName.includes(searchTerm) &&
        !(user.email && user.email.toLowerCase().includes(searchTerm)) &&
        !(user.phoneNumber && user.phoneNumber.includes(searchTerm)) &&
        !(formattedDate.includes(searchTerm))
      ) continue;

      rows.push({
        timestamp,
        user,
        html: ``
      });
    }

    rows.sort((a, b) => b.timestamp - a.timestamp);

    let id_number = 1;
    tbody.innerHTML = rows.map(row => {
      const user = row.user;
      return `
        <tr>
         <td>${id_number++}</td>
<td>${sanitizeHTML(user.firstName || "")}</td>
<td>${sanitizeHTML(user.middleName || "")}</td>
<td>${sanitizeHTML(user.lastName || "")}</td>
<td>${sanitizeHTML(user.email || "")}</td>
<td>${sanitizeHTML(user.phoneNumber || "")}</td>
<td>${sanitizeHTML(user.acc_type === "Discount" ? "Discounted" : "Not Discounted")}</td>
<td>${new Date(row.timestamp).toLocaleDateString()}</td>

        </tr>`;
    }).join("");

  } else {
    tbody.innerHTML = "<tr><td colspan='8'>No data available</td></tr>";
  }
}






function viewDiscountRequest(userID, requestID) {
  const requestRef = firebase.database().ref(`discountRequests/${userID}/${requestID}`);

  requestRef.once("value")
    .then((snapshot) => {
      if (!snapshot.exists()) {
        Swal.fire({
          icon: "info",
          title: "No Data Found",
          text: "No details available for this request.",
        });
        return;
      }

      const requestData = snapshot.val();
      
      // ✅ Populate the modal with retrieved data
      document.getElementById("discountModalFullName").innerText = `${requestData.firstName || "N/A"} ${requestData.middleName || ""} ${requestData.lastName || "N/A"}`;
      document.getElementById("discountModalEmail").innerText = requestData.email || "N/A";
      document.getElementById("discountModalPhone").innerText = requestData.phone || "N/A";
      document.getElementById("discountModalBirthDate").innerText = requestData.birthDate ? new Date(requestData.birthDate).toLocaleDateString() : "N/A";
      document.getElementById("discountModalAddress").innerText = requestData.address || "N/A";
      document.getElementById("discountModalCity").innerText = requestData.city || "N/A";
      document.getElementById("discountModalState").innerText = requestData.state || "N/A";
      document.getElementById("discountModalStatus").innerText = requestData.status || "N/A";

      // ✅ Handle File URL
      if (requestData.fileUrl) {
        document.getElementById("discountModalFileUrl").href = requestData.fileUrl;
        document.getElementById("discountModalFileUrl").innerText = "View File";
      } else {
        document.getElementById("discountModalFileUrl").innerText = "No File Uploaded";
        document.getElementById("discountModalFileUrl").removeAttribute("href");
      }

      // ✅ Show the modal
      document.getElementById("discountRequestModal").style.display = "flex";

    })
    .catch((error) => {
      console.error("❌ Error retrieving request details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not retrieve request details. Please check Firebase rules.",
      });
    });
}

// ✅ Function to Close the Modal
function closeDiscountModal() {
  document.getElementById("discountRequestModal").style.display = "none";
}


// ✅ Function to Close the Modal
function closeDiscountModal() {
  document.getElementById("discountRequestModal").style.display = "none";
}


// Show Confirmation Modal
function showConfirmationModal(action, userId, requestId) {
  const modal = document.getElementById("confirmationModal");
  const modalMessage = document.getElementById("modalMessage");

  let actionText = "";
  if (action === "approve") actionText = "approve";
  else if (action === "reject") actionText = "reject";
  else if (action === "delete") actionText = "delete";

  modalMessage.textContent = `Are you sure you want to ${actionText} this request?`;
  modal.style.display = "block";

  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");
  const closeModal = document.getElementById("closeModal");

  // Confirm action
  confirmButton.onclick = () => {
    handleAction(action, userId, requestId);
    modal.style.display = "none";
  };

  // Cancel or close modal
  cancelButton.onclick = () => {
    modal.style.display = "none";
  };
  closeModal.onclick = () => {
    modal.style.display = "none";
  };
}

 
function handleAction(action, userId, requestId) {
  // ✅ Reference to the request in discountRequests
  const requestRef = discountRequestsRef.child(`${userId}/${requestId}`);

  // ✅ Reference to the user's account in users/accounts
  const userAccountRef = firebase.database().ref(`users/accounts/${userId}`);

  if (action === "approve") {
    // ✅ Update request status to "Approved"
    requestRef.update({ status: "Approved" }).then(() => {
      // ✅ Update the user's account type to "Discounted"
      userAccountRef.update({ acc_type: "Discount" })
        .then(() => {
          alert("✅ Request approved & user updated to 'Discounted'.");
          renderDiscountTable();
        })
        .catch((error) => {
          console.error("❌ Error updating user account:", error);
          alert("❌ Failed to update user account.");
        });
    }).catch((error) => {
      console.error("❌ Error approving request:", error);
      alert("❌ Failed to approve request.");
    });

  } else if (action === "reject") {
    // ✅ Update request status to "Rejected"
    requestRef.update({ status: "Rejected" }).then(() => {
      alert("❌ Request rejected.");
      renderDiscountTable();
    }).catch((error) => {
      console.error("❌ Error rejecting request:", error);
      alert("❌ Failed to reject request.");
    });

  } else if (action === "delete") {
    // ✅ Remove request from discountRequests
    requestRef.remove().then(() => {
      alert("🗑️ Request deleted successfully.");
      renderDiscountTable();
    }).catch((error) => {
      console.error("❌ Error deleting request:", error);
      alert("❌ Failed to delete request.");
    });
  } else {
    alert("❌ Invalid action.");
  }
}


// Close Modal on Outside Click
window.onclick = function (event) {
  const modal = document.getElementById("confirmationModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Count Pending Requests
function countPendingStatus() {
  discountRequestsRef.on("value", (snapshot) => {
    let pendingCount = 0;
    snapshot.forEach((userSnapshot) => {
      userSnapshot.forEach((requestSnapshot) => {
        if (requestSnapshot.val().status?.toLowerCase() === "pending") {
          pendingCount++;
        }
      });
    });

    const notificationBubble = document.getElementById("notification-count");
    if (notificationBubble) {
      notificationBubble.textContent = pendingCount;
      notificationBubble.style.display = pendingCount > 0 ? "flex" : "none";
    }
  });
}

// Run pending count after DOM loads
document.addEventListener("DOMContentLoaded", countPendingStatus);
/**
 * Check if a user is logged in, otherwise redirect to the login page.
 */
 
/**
 * Updates counts for each role: driver, conductor, user, and jeepneys.
 */
function updateCounts() {
  const roleCounts = {
    driver: 0,
    conductor: 0,
    user: 0,
  };
  let jeepneyCount = 0;

  const accountsPromise = database
    .ref("users/accounts")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const role = user.role;

        if (roleCounts.hasOwnProperty(role)) {
          roleCounts[role]++;
        }
      });
    });

  const jeepneysPromise = database
    .ref("jeepneys")
    .once("value")
    .then((snapshot) => {
      jeepneyCount = snapshot.numChildren();
    });

  Promise.all([accountsPromise, jeepneysPromise])
    .then(() => {
      document.querySelector(".driver .display_count").textContent =
        roleCounts.driver;
      document.querySelector(".conduc .display_count").textContent =
        roleCounts.conductor;
      document.querySelector(".users .display_count").textContent =
        roleCounts.user;
      document.querySelector(".jeep .display_count").textContent = jeepneyCount;

      console.log("Counts Updated:", {
        drivers: roleCounts.driver,
        conductors: roleCounts.conductor,
        users: roleCounts.user,
        jeepneys: jeepneyCount,
      });
    })
    .catch((error) => {
      console.error("Error updating counts:", error);
    });
}

/**
 * Fetch and display users with valid roles.
 */
function displayUsers() {
  const usersContainer = document.getElementById("usersContainer");
  usersContainer.innerHTML = "";

  database
    .ref("users/accounts")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();

        if (user.role && user.timestamp) {
          const userDiv = document.createElement("div");
          userDiv.classList.add("item1");

          userDiv.innerHTML = `
            <p><strong>Name:</strong> ${user.firstName || "N/A"} ${
            user.middleName || ""
          } ${user.lastName || "N/A"}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Registered on:</strong> ${new Date(
              user.timestamp
            ).toLocaleString()}</p>
          `;

          usersContainer.appendChild(userDiv);
        }
      });
    })
    .catch((error) => {
      console.error("Error displaying users:", error);
    });
}
 
/**
 * ✅ Initialize Dashboard
 */
function initializeDashboard() {
  console.log("📊 Initializing dashboard...");

  const dbRef = database.ref("users/accounts");
  dbRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      console.log("✅ Database data loaded:", snapshot.val());
    } else {
      console.warn("⚠️ No data found in Firebase.");
    }
  });
}

// ✅ Run Functions on Page Load
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOM loaded, running functions...");
 
  initializeDashboard();
});

// Run the functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
 
  updateCounts();
  displayUsers(); 
});
