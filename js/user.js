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

// Function to render the original table
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

        // Check if the role field exists and render conditionally
        const roleColumn = user.role ? `<td>${user.role}</td>` : "<td></td>";

        // Render each row
        let row = `
          <tr>
            <td>${user.user_id}</td>
            <td>${user.firstName || ""}</td>
            <td>${user.middleName || ""}</td>
            <td>${user.lastName || ""}</td>
            <td>${user.email || ""}</td>
            <td>${user.phoneNumber || ""}</td>
            ${roleColumn}
          </tr>`;
        tbody.innerHTML += row;
      }
    }
  } else {
    tbody.innerHTML = "<tr><td colspan='8'>No data available</td></tr>";
  }
}

// Create an object to store the key-value pairs
const passengerKeyValuePairs = {};

// Function to get key by value
function getKeyByValue(object, value) {
  for (let key in object) {
    if (object[key] === value) {
      return key;
    }
  }
  return null; // Return null if no matching value is found
}

// Function to get value by key
function getValueByKey(object, key) {
  return object[key] || null; // Return null if no matching key is found
}

// Function to render the discount table
function renderDiscountTable(searchTerm = "", timeFilter = "") {
  const passengerDataRef = database.ref("users/passenger");

  passengerDataRef.on("value", (snapshot) => {
    const passengers = snapshot.val();
    const tbody = document.getElementById("dataTableBody");
    tbody.innerHTML = ""; // Clear existing table rows

    if (passengers) {
      const currentDate = new Date();

      // Iterate through the passengers in the database
      for (let passengerId in passengers) {
        const passenger = passengers[passengerId];

        // Add passengerId and user_id to the key-value pair object
        if (passenger.user_id) {
          passengerKeyValuePairs[passengerId] = passenger.user_id;
        }

        // Ensure that discount_details exists for this passenger
        if (passenger.discount_details) {
          const discount = passenger.discount_details;
          const fullName = `${discount.firstName || ""} ${
            discount.middleName || ""
          } ${discount.lastName || ""}`.toLowerCase();
          const timestamp = discount.timestamp
            ? new Date(discount.timestamp)
            : null;

          // Debugging output to check the data structure
          console.log(
            "Passenger ID:",
            passengerId,
            "Discount Details:",
            discount
          );

          // Apply search term filter (e.g., firstName, lastName, email, etc.)
          if (
            searchTerm === "" ||
            fullName.includes(searchTerm) ||
            (discount.email &&
              discount.email.toLowerCase().includes(searchTerm)) ||
            (discount.contact_number &&
              discount.contact_number.includes(searchTerm))
          ) {
            // Apply time filter if necessary
            if (
              timestamp &&
              !isWithinTimeRange(timestamp, currentDate, timeFilter)
            ) {
              continue;
            }

            let statusClass = "";

            // Set the status class based on the discount status
            if (discount.status === "Approved") {
              statusClass = "status-approved"; // Green
            } else if (discount.status === "Pending") {
              statusClass = "status-pending"; // Grey
            } else if (discount.status === "Rejected") {
              statusClass = "status-rejected"; // Red
            }

            // Render each row with the discount details
            let row = `
              <tr>
                <td>${passenger.user_id}</td>
                <td>${discount.firstname || "N/A"}</td>
                <td>${discount.middlename || "N/A"}</td>
                <td>${discount.lastname || "N/A"}</td>
                <td>${
                  discount.birthday || "N/A"
                }</td> <!-- Assuming birthday is available -->
                <td><span class="${statusClass}">${
              discount.status || "N/A"
            }</span></td>
                <td>
                  <button class="request-action-icons" id="approved-icon"><i class="fi fi-bs-check-circle"></i></button>
                  <button class="request-action-icons" id="rejected-icon"><i class="fi fi-bs-circle-xmark"></i></button>
                  <button class="request-action-icons" id="info-icon"><i class="fi fi-ss-dot-pending"></i></button>
                </td>
              </tr>`;
            tbody.innerHTML += row;
          }
        } else {
          // If discount_details is missing, log a warning
          console.warn("Missing discount_details for passenger:", passengerId);
        }
      }

      // Debugging output for the key-value pairs
      console.log("Passenger Key-Value Pairs:", passengerKeyValuePairs);
    } else {
      tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
    }
  });
}

// Check if timestamp is within the filter's time range
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

// Toggle between the tables
notificationButton.addEventListener("click", () => {
  isOriginalTable = !isOriginalTable; // Toggle table state

  notificationButton.classList.toggle("active");

  const textNode = notificationButton.querySelector("span.text");
  if (textNode) {
    textNode.textContent = isOriginalTable ? "Request" : "User Info";
  }

  const bubble = notificationButton.querySelector(".notification-bubble");
  if (bubble) {
    bubble.style.display = isOriginalTable ? "flex" : "none"; // Hide bubble in "User Info" state
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
      </tr>`;
    renderTable(firebaseData); // Render original data
  } else {
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
    renderDiscountTable(); // Render discount data
  }
});

function countPendingStatus() {
  const passengerDataRef = database.ref("users/passenger");

  passengerDataRef.on("value", (snapshot) => {
    const passengers = snapshot.val();
    let pendingCount = 0; // Initialize counter

    if (passengers) {
      // Loop through each passenger
      for (let passengerId in passengers) {
        const passenger = passengers[passengerId];

        // Check if discount_details and status exist
        if (
          passenger.discount_details &&
          passenger.discount_details.status &&
          passenger.discount_details.status.toLowerCase() === "pending" // Case-insensitive comparison
        ) {
          pendingCount++;
        }
      }
    }

    // Update the notification bubble with the count
    const notificationBubble = document.getElementById("notification-count");
    if (notificationBubble) {
      notificationBubble.textContent = pendingCount;
    }

    console.log("Total pending count:", pendingCount); // Log the count for debugging
  });
}

// Add event listeners for buttons in the "Action" column
document.addEventListener("click", (event) => {
  if (event.target.closest(".request-action-icons")) {
    const button = event.target.closest(".request-action-icons");
    const action = button.id; // Get the button's ID
    const row = button.closest("tr"); // Get the parent row

    // Extract passenger ID from data attribute or text content
    const passengerId =
      row.cells[0].dataset.passengerId || row.cells[0].textContent.trim();

    // Ensure passengerKeyValuePairs is ready
    if (
      !passengerKeyValuePairs ||
      Object.keys(passengerKeyValuePairs).length === 0
    ) {
      console.error("Passenger Key-Value Pairs not ready");
      return;
    }

    if (action === "info-icon") {
      // Directly fetch and display details for "view-info"
      const key = getKeyByValue(passengerKeyValuePairs, passengerId);
      console.log("Fetching details for Passenger ID:", key);
      fetchAndShowDetails(key);
    } else {
      // Show confirmation modal for other actions
      const key = getKeyByValue(passengerKeyValuePairs, passengerId);
      console.log("Showing confirmation for Passenger ID:", key);
      showConfirmationModal(action, key);
    }
  }
});

// Show the confirmation modal
function showConfirmationModal(action, passengerId) {
  const modal = document.getElementById("confirmationModal");
  const modalMessage = document.getElementById("modalMessage");
  const confirmButton = document.getElementById("confirmButton");

  // Map action IDs to proper text
  const actionTextMap = {
    "approved-icon": "approve",
    "rejected-icon": "reject",
  };

  // Get action text or use default
  const actionText = actionTextMap[action] || action.replace("-icon", "");

  // Set modal message
  modalMessage.textContent = `Are you sure you want to ${actionText} this request for Passenger ID: ${passengerId}?`;

  // Display the modal
  modal.style.display = "block";

  // Confirm button click handler
  confirmButton.onclick = () => {
    handleAction(action, passengerId); // Perform the action
    modal.style.display = "none"; // Close modal
  };
}

// Fetch and display discount details directly
function fetchAndShowDetails(passengerId) {
  if (!passengerId) {
    console.error("Passenger ID is null or undefined");
    return;
  }

  const passengerRef = database.ref(
    `users/passenger/${passengerId}/discount_details`
  );

  passengerRef.once("value", (snapshot) => {
    const details = snapshot.val();
    if (details) {
      showDetailsModal(details, passengerId);
    } else {
      alert("No details found for this passenger.");
    }
  });
}

// Handle the action
function handleAction(action, passengerId) {
  if (!passengerId) {
    console.error("Passenger ID is null or undefined");
    return;
  }

  const passengerRef = database.ref(
    `users/passenger/${passengerId}/discount_details`
  );

  if (action === "approved-icon") {
    // Handle approval
    passengerRef
      .update({ status: "Approved" })
      .then(() => {
        alert(`Passenger ID: ${passengerId} has been approved.`);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update the status. Please try again.");
      });
  } else if (action === "rejected-icon") {
    // Handle rejection
    passengerRef
      .update({ status: "Rejected" })
      .then(() => {
        alert(`Passenger ID: ${passengerId} has been rejected.`);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update the status. Please try again.");
      });
  }
}

// Show details modal with data
function showDetailsModal(details, passengerId) {
  const modal = document.getElementById("detailsModal");
  const detailsContent = document.getElementById("detailsContent");

  // Populate modal content with the fields from discount_details
  detailsContent.innerHTML = `
    <p><strong>ID: </strong>${getValueByKey(
      passengerKeyValuePairs,
      passengerId
    )}</p>
    <p>
      ${
        details.file_url
          ? `<div style="text-align: center; border-bottom: 1px solid #696969">
               <img src="${details.file_url}" alt="Uploaded File" style="max-width: 40%; height: auto;" />
             </div>`
          : "No File Available"
      }
    </p>
    <p style="padding: 5px;"><strong>First Name:</strong> ${
      details.firstname || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Middle Name:</strong> ${
      details.middlename || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Last Name:</strong> ${
      details.lastname || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Birthday:</strong> ${
      details.birthday || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Gender:</strong> ${
      details.gender || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Address:</strong> ${
      details.address || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>City:</strong> ${details.city || "N/A"}</p>
    <p style="padding: 5px;"><strong>Province:</strong> ${
      details.province || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Postal ID:</strong> ${
      details.postal_id || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Contact Number:</strong> ${
      details.contact_number || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Email:</strong> ${
      details.email || "N/A"
    }</p>
    <p style="padding: 5px;"><strong>Status:</strong> ${
      details.status || "N/A"
    }</p>
  `;

  // Display the modal
  modal.style.display = "block";
}

// Close the details modal using the "x" close icon
document.querySelector("#detailsModal .close").addEventListener("click", () => {
  document.getElementById("detailsModal").style.display = "none";
});

// Close the details modal using the "Close" button
document.getElementById("closeDetailsButton").addEventListener("click", () => {
  document.getElementById("detailsModal").style.display = "none";
});

// Close the confirmation modal using the "x" close icon
document
  .querySelector("#confirmationModal #actionClose")
  .addEventListener("click", () => {
    document.getElementById("confirmationModal").style.display = "none";
  });

// Close the confirmation modal using the "No" button
document.getElementById("cancelButton").addEventListener("click", () => {
  document.getElementById("confirmationModal").style.display = "none";
});

// Close modals when clicking outside of them
window.addEventListener("click", (event) => {
  const detailsModal = document.getElementById("detailsModal");
  const confirmationModal = document.getElementById("confirmationModal");

  if (event.target === detailsModal) {
    detailsModal.style.display = "none";
  }
  if (event.target === confirmationModal) {
    confirmationModal.style.display = "none";
  }
});

// Call the function to initialize the count
countPendingStatus();
