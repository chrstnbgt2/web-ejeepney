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
var database = firebase.database();

var dataRef = database.ref("users/passenger");

const searchInput = document.querySelector(".search-input");
const filterSelect = document.querySelector(".combobox select");
const notificationButton = document.querySelector(".notification-button");

let isOriginalTable = true; // Track table state
let firebaseData = {}; // Store Firebase data for reuse

// Fetch data and render the initial table
dataRef.on("value", (snapshot) => {
  firebaseData = snapshot.val();

  // Only render the table if the original table state is active
  if (isOriginalTable) {
    renderTable(firebaseData); // Render the original table
  }
});

function renderTable(data, searchTerm = "", timeFilter = "") {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = "";

  if (data) {
    const currentDate = new Date();

    for (let id in data) {
      const user = data[id];
      const fullName = `${user.firstName || ""} ${user.middleName || ""} ${
        user.lastName || ""
      }`.toLowerCase();
      const timestamp = user.timestamp ? new Date(user.timestamp) : null;

      if (timestamp && !isWithinTimeRange(timestamp, currentDate, timeFilter)) {
        continue;
      }

      if (
        searchTerm === "" ||
        fullName.includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm)) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm))
      ) {
        let statusClass = "";

        // Set the status class based on the user status
        if (user.status === "Approved") {
          statusClass = "status-approved"; // Green
        } else if (user.status === "Pending") {
          statusClass = "status-pending"; // Grey
        } else if (user.status === "Rejected") {
          statusClass = "status-rejected"; // Red
        }

        let row = `
          <tr>
            <td>${id}</td>
            <td>${user.firstName || ""}</td>
            <td>${user.middleName || ""}</td>
            <td>${user.lastName || ""}</td>
            <td>${user.email || ""}</td>
            <td>${user.phoneNumber || ""}</td>
            <td><span class="${statusClass}">${user.status || ""}</span></td>
          </tr>`;
        tbody.innerHTML += row;
      }
    }
  } else {
    tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
  }
}

function isWithinTimeRange(timestamp, currentDate, filterType) {
  const oneDay = 24 * 60 * 60 * 1000;

  switch (filterType) {
    case "Today":
      return (
        timestamp.getFullYear() === currentDate.getFullYear() &&
        timestamp.getMonth() === currentDate.getMonth() &&
        timestamp.getDate() === currentDate.getDate()
      );
    case "This Week":
      const startOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );
      return timestamp >= startOfWeek;
    case "This Month":
      return (
        timestamp.getFullYear() === currentDate.getFullYear() &&
        timestamp.getMonth() === currentDate.getMonth()
      );
    case "This Year":
      return timestamp.getFullYear() === currentDate.getFullYear();
    default:
      return true;
  }
}

notificationButton.addEventListener("click", () => {
  isOriginalTable = !isOriginalTable; // Toggle table state

  // Toggle button style
  notificationButton.classList.toggle("active");

  // Update the text within the span (ensure it's not duplicated)
  const textNode = notificationButton.querySelector("span.text");
  if (textNode) {
    textNode.textContent = isOriginalTable ? "Request" : "User Info";
  }

  // Get the notification bubble
  const notificationBubble = document.querySelector(".notification-bubble");

  // Toggle visibility of the notification bubble based on the state
  if (isOriginalTable) {
    // Show the notification bubble when in "Request" state
    notificationBubble.style.display = "flex";

    // Change the text color to original state (when Request)
    notificationButton.style.color = "#333"; // Revert to original color
  } else {
    // Hide the notification bubble when in "User Info" state
    notificationBubble.style.display = "none";

    // Change the text color to white when in "User Info" state
    notificationButton.style.color = "white"; // Change text color to white
  }

  const tableHead = document.querySelector("table thead");
  const tbody = document.getElementById("dataTableBody");

  if (isOriginalTable) {
    // Restore original table headers
    tableHead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone No.</th>
        <th>Type</th>
      </tr>`;
    renderTable(firebaseData); // Render original data
  } else {
    // Switch to alternate table headers
    tableHead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Date</th>
        <th>Status</th>
        <th>Action</th>
      </tr>`;

    // Example data for the alternate table
    tbody.innerHTML = `
      <tr>
        <td>1</td>
        <td>John</td>
        <td>Doe</td>
        <td>Smith</td>
        <td>2024-12-01</td>
        <td><span class="status-pending">Pending</span></td>
        <td>
          <button class="request-action-icons" id="approved-icon"><i class="fi fi-bs-check-circle"></i></button>
          <button class="request-action-icons" id="rejected-icon"><i class="fi fi-bs-circle-xmark"></i></button>
          <button class="request-action-icons" id="info-icon"><i class="fi fi-ss-dot-pending"></i></button>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jane</td>
        <td>Mary</td>
        <td>Johnson</td>
        <td>2024-12-02</td>
        <td><span class="status-approved">Approved</span></td>
        <td>
          <button class="request-action-icons" id="approved-icon"><i class="fi fi-bs-check-circle"></i></button>
          <button class="request-action-icons" id="rejected-icon"><i class="fi fi-bs-circle-xmark"></i></button>
          <button class="request-action-icons" id="info-icon"><i class="fi fi-ss-dot-pending"></i></button>
        </td>
      </tr>
      <tr>
        <td>0123</td>
        <td>Ezio</td>
        <td>fzkn4</td>
        <td>Auditore</td>
        <td>2024-12-12</td>
        <td><span class="status-rejected">Rejected</span></td>
        <td>
          <button class="request-action-icons" id="approved-icon"><i class="fi fi-bs-check-circle"></i></button>
          <button class="request-action-icons" id="rejected-icon"><i class="fi fi-bs-circle-xmark"></i></button>
          <button class="request-action-icons" id="info-icon"><i class="fi fi-ss-dot-pending"></i></button>
        </td>
      </tr>`;
  }
});
