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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);






var database = firebase.database();
var auth = firebase.auth();
 


// Reference the 'drivers' node
var accountsRef = database.ref("users/accounts");

// Reference the search input element
const searchInput = document.querySelector(".search-input");

// Fetch Data from Firebase and Render it into the Table
accountsRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the existing table content before rendering new data

  // Render only drivers initially (with no filter)
  renderData(data, "driver");

  // Add a search filter
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase(); // Trim spaces
    renderData(data, "driver", searchTerm);
  });
});

// Function to handle showing the driver-edit-container
function showAddContainer() {
  const addContaienr = document.querySelector(".add-driver-jeep-container");
  addContaienr.style.display = "flex";
}



 


// Function to handle showing the driver-edit-container
function showEditContainer() {
  const editContainer = document.querySelector(".driver-edit-container");
  editContainer.style.display = "flex";
}

 
document
  .querySelector(".add-button")
  .addEventListener("click", showAddContainer);

// Function to close the active container
function closeActiveContainer() {
  const editContainer = document.querySelector(".driver-edit-container");
   const addContainer = document.querySelector(".add-driver-jeep-container");

  // Hide both containers
  editContainer.style.display = "none";
 
  addContainer.style.display = "none";
}

function formatTimestamp(timestamp) {
  if (!timestamp || isNaN(timestamp)) return "N/A"; // Handle missing timestamps
  const date = new Date(Number(timestamp)); // Convert to Date using Number()
  return date.toLocaleDateString("en-US"); // Converts to MM/DD/YYYY format
}
function sanitizeHTML(str) {
  if (!str) return ""; // Ensure input is always a string

  let temp = document.createElement("div");
  temp.textContent = str; // Convert to plain text, escaping any HTML tags

  return temp.innerHTML
    .replace(/javascript:/gi, "")  
    .replace(/<script.*?>.*?<\/script>/gi, "")  
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "");  
}


// Function to render the data into the table
function renderData(data, roleFilter, searchTerm = "", startTime = 0, endTime = Infinity) {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the table content

  if (data) {
    let rows = [];

    for (let id in data) {
      const account = data[id];

      if (account.role === roleFilter) {
        const fullName = `${account.firstName || ""} ${account.middleName || ""} ${account.lastName || ""}`.toLowerCase();
        const recordTimestamp = account.timestamp || 0; // Default to 0 if timestamp is missing
        const formattedTimestamp = formatTimestamp(recordTimestamp);  

        if (
          (searchTerm === "" || 
            fullName.includes(searchTerm) || 
            formattedTimestamp.includes(searchTerm) ||
            (account.email && account.email.toLowerCase().includes(searchTerm)) ||
            (account.phone && account.phone.includes(searchTerm))) &&
          recordTimestamp >= startTime &&
          recordTimestamp <= endTime
        ) {
          // Store row in an array for sorting, without the id count yet
          rows.push({
            id,
            timestamp: recordTimestamp,
            account
          });
        }
      }
    }

    // ✅ Step 1: Sort rows by timestamp (Oldest to Newest)
    rows.sort((a, b) => a.timestamp - b.timestamp);

    // ✅ Step 2: Assign proper ID numbers after sorting
    let id_name = 1; // Reset ID counter

    // ✅ Step 3: Generate the HTML content
    tbody.innerHTML = rows.map(row => {
      const account = row.account;
      return `
        <tr data-id="${sanitizeHTML(row.id)}" data-timestamp="${sanitizeHTML(row.timestamp)}">
    <td>${id_name++}</td>  <!-- ✅ Now properly incremented after sorting -->
    <td>${sanitizeHTML(account.firstName || "")}</td>
    <td>${sanitizeHTML(account.middleName || "")}</td>
    <td>${sanitizeHTML(account.lastName || "")}</td>
    <td>${sanitizeHTML(account.email || "")}</td>
    <td>${sanitizeHTML(account.phoneNumber || "")}</td>
    <td>${sanitizeHTML(formatTimestamp(row.timestamp))}</td>  
    <td>
        <div class="action-icons">
             <img src="./img/trash-bin.png" alt="delete" class="delete-icon">
        </div>
    </td>
</tr>
`;
    }).join(""); 

    // ✅ Step 4: Attach event listeners after rendering
    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", showEditContainer);
    });

    document.querySelectorAll(".more-icon").forEach((icon) => {
      icon.addEventListener("click", showViewContainer);
    });
  } else {
    tbody.innerHTML = "<tr><td colspan='8'>No drivers found</td></tr>";
  }
}





// Close the active container when the close icon is clicked
document.querySelectorAll(".close-icon").forEach((icon) => {
  icon.addEventListener("click", closeActiveContainer);
});

// Add event listener to the table body to handle click events on the edit, delete, and more icons
const confirmDelete = document.querySelector(".confirm-delete");
document
  .getElementById("dataTableBody")
  .addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    const driverID = row ? row.getAttribute("data-id") : null;
    const deleteContainer = document.querySelector(".delete-jeep-container");
    if (event.target && event.target.classList.contains("delete-icon")) {
      deleteContainer.style.display = "flex";
      // Wait for confirmation button click to delete the record
      const confirmDelete = document.querySelector(".confirm-delete");
      confirmDelete.addEventListener(
        "click",
        () => {
          if (driverID) {
            // Delete the record from Firebase
            dataRef
              .child(driverID)
              .remove()
              .then(() => {
                alert("Record deleted successfully.");
              })
              .catch((error) => {
                console.error("Error deleting record: ", error);
              });
          }
          deleteContainer.style.display = "none";
        },
        { once: true }
      );
    }
  });

const timestampFilter = document.getElementById("timestampFilter");

// Listen for changes in the filter dropdown
timestampFilter.addEventListener("change", () => {
  const selectedFilter = timestampFilter.value;
  const currentTimestamp = Date.now();

  let startTime = 0; // Default to show all records
  switch (selectedFilter) {
    case "today":
      startTime = new Date().setHours(0, 0, 0, 0); // Start of today
      break;
    case "thisWeek":
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
      startTime = new Date(today.setDate(today.getDate() - dayOfWeek)).setHours(
        0,
        0,
        0,
        0
      ); // Start of the week
      break;
    case "thisMonth":
      startTime = new Date(new Date().setDate(1)).setHours(0, 0, 0, 0); // Start of the month
      break;
    case "thisYear":
      startTime = new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0); // Start of the year
      break;
    default:
      startTime = 0; // Show all data
  }

  // Refetch and re-render data based on the selected time filter
  dataRef.once("value", (snapshot) => {
    const data = snapshot.val();
    renderData(
      data,
      searchInput.value.trim().toLowerCase(),
      startTime,
      currentTimestamp
    );
  });
});

function addDriver() {
  // Get the form values
  const firstName = document.getElementById("fname").value.trim();
  const middleName = document.getElementById("mname").value.trim();
  const lastName = document.getElementById("lname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phoneNumber").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("cpassword").value;

  // ✅ Validate required fields
  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    alert("❌ Please fill in all required fields!");
    return;
  }

  // ✅ Validate password match
  if (password !== confirmPassword) {
    alert("❌ Passwords do not match! Please try again.");
    return;
  }

  // ✅ Validate only letters for name fields
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    alert("❌ Name fields should contain only letters!");
    return;
  }

  // ✅ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("❌ Invalid email format!");
    return;
  }

  // ✅ Validate phone number (10-15 digits)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    alert("❌ Please enter a valid phone number (10-15 digits)!");
    return;
  }

  // ✅ Prepare driver data for the database
  const driverData = {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    email: email,
    phoneNumber: phone,
    role: "driver",
    wallet_balance: 0,
    timestamp: Date.now(),
  };

  // ✅ Create a user in Firebase Authentication
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid; // Get generated UID from Firebase Auth

      return database
        .ref(`users/accounts/${uid}`)
        .set(driverData)
        .then(() => {
          // ✅ Clear form fields after successful submission
          document.getElementById("fname").value = "";
          document.getElementById("mname").value = "";
          document.getElementById("lname").value = "";
          document.getElementById("email").value = "";
          document.getElementById("phoneNumber").value = "";
          document.getElementById("password").value = "";
          document.getElementById("cpassword").value = "";

          // ✅ Close modal safely if it exists
          const modal = document.querySelector(".add-driver-jeep-container");
          if (modal) {
            modal.style.display = "none";
          } else {
            console.warn("⚠️ Modal not found: .add-driver-jeep-container");
          }

          alert("✅ Driver added successfully.");
        });
    })
    .catch((error) => {
      console.error("❌ Failed to add driver:", error);

      let errorMessage = "❌ Failed to add driver.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "❌ Email is already in use! Try another email.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "❌ Password is too weak! Use at least 6 characters.";
      }

      alert(errorMessage);
    });
}


function fetchDriverDataAndView(driverID) {
  dataRef
    .child(driverID)
    .once("value", (snapshot) => {
      const driver = snapshot.val();
      if (driver) {
        // Populate the edit container with driver data
        document.getElementById("view-fname").value = driver.firstName || "";
        document.getElementById("view-mname").value = driver.middleName || "";
        document.getElementById("view-lname").value = driver.lastName || "";
        document.getElementById("view-email").value = driver.email || "";
        document.getElementById("view-phoneNumber").value = driver.phoneNumber|| "";
        document.getElementById("view-password").value = driver.password; // Leave password blank for security

        // Show the edit container
        showViewContainer();
      } else {
        alert("Driver data not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching driver data:", error);
      alert("Failed to fetch driver data. Please try again.");
    });
}

document.getElementById("dataTableBody").addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-icon")) {
    const row = event.target.closest("tr");

    if (!row) {
      alert("❌ Error: No row found!");
      return;
    }

    const driverID = row.getAttribute("data-id");

    if (driverID) {
      fetchDriverData(driverID); // ✅ Fetch driver details
    } else {
      alert("❌ Driver ID not found in row.");
    }
  }
});


function editDriverData() {
  // ✅ Get the driver ID from the edit modal
  const editContainer = document.querySelector(".edit-driver-modal");
  const driverID = editContainer.getAttribute("data-id");

  if (!driverID) {
    console.error("❌ Driver ID not found in modal.");
    alert("❌ Driver ID not found!");
    return;
  }

  // ✅ Collect updated values
  const firstName = document.getElementById("edit-fname").value.trim();
  const middleName = document.getElementById("edit-mname").value.trim();
  const lastName = document.getElementById("edit-lname").value.trim();
  const phone = document.getElementById("edit-phoneNumber").value.trim();
  const email = document.getElementById("edit-email").value.trim();

  if (!firstName || !lastName || !email || !phone) {
    alert("❌ Please fill in all required fields!");
    return;
  }

  const updatedData = {
    firstName,
    middleName,
    lastName,
    phone,
    email,
  };

  // ✅ Update driver data in Firebase
  firebase.database().ref(`users/accounts/${driverID}`).update(updatedData)
    .then(() => {
      alert("✅ Driver details updated successfully!");
      editContainer.style.display = "none"; // ✅ Close modal
      fetchAndRenderDrivers(); // ✅ Refresh the driver list
    })
    .catch((error) => {
      console.error("❌ Error updating driver:", error);
      alert("❌ Failed to update driver details.");
    });
}



// ✅ Fix refresh function
function fetchAndRenderDrivers() {
  firebase.database().ref("users/accounts").once("value", (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      renderData(data, "driver"); // ✅ Refresh driver list
    }
  });
}

// ✅ Event Listener for Save Button
document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("driver-edit");

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const driverID = getSelectedDriverID();
      if (driverID) {
        editDriverData(driverID);
      } else {
        alert("❌ Driver ID not found. Unable to save changes.");
      }
    });
  } else {
    console.error("❌ ERROR: Save button (#driver-edit) not found in the DOM!");
  }
});

// ✅ Function to get selected Driver ID
function getSelectedDriverID() {
  const editContainer = document.querySelector(".driver-edit-container");
  return editContainer ? editContainer.getAttribute("data-id") : null;
}
 
// Function to refresh the driver list (optional)
function refreshDriverList() {
  // Your logic to refresh the displayed list of drivers after an update
  fetchAllDrivers(); // Example placeholder function, replace with your actual function
}

 function fetchDriverData(driverID) {
  if (!driverID) {
    console.error("❌ Driver ID is undefined or null.");
    alert("❌ Driver ID not found!");
    return;
  }

  const editContainer = document.querySelector(".edit-driver-modal");

  if (!editContainer) {
    console.error("❌ Error: Edit modal (.edit-driver-modal) not found in the DOM!");
    return;
  }

  // ✅ Set the driver ID inside the modal
  editContainer.setAttribute("data-id", driverID);

  // ✅ Fetch driver data from Firebase
  const driverRef = firebase.database().ref(`users/accounts/${driverID}`);
  driverRef
    .once("value")
    .then((snapshot) => {
      const driver = snapshot.val();
      if (driver) {
        document.getElementById("edit-fname").value = driver.firstName || "";
        document.getElementById("edit-mname").value = driver.middleName || "";
        document.getElementById("edit-lname").value = driver.lastName || "";
        document.getElementById("edit-phoneNumber").value = driver.phoneNumber || "";
        document.getElementById("edit-email").value = driver.email || "";

        // ✅ Show the modal
        editContainer.style.display = "flex";
      } else {
        alert("❌ Driver data not found.");
      }
    })
    .catch((error) => {
      console.error("❌ Error fetching driver data:", error);
      alert("❌ Failed to fetch driver data.");
    });
}




// Delete a driver
// Delete a driver
function deleteDriver(driverID) {
  const driverRef = firebase.database().ref(`users/accounts/${driverID}`);
  const usersRef = firebase.database().ref("users/accounts");

  // Display confirmation dialog
  const deleteContainer = document.querySelector(".delete-jeep-container");
  deleteContainer.style.display = "flex";

  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");

  confirmDelete.addEventListener(
    "click",
    async () => {
      try {
        // Step 1: Get all users whose creatorUid matches driverID
        const usersSnapshot = await usersRef.once("value");
        const usersData = usersSnapshot.val();

        if (usersData) {
          const updates = {};
          Object.keys(usersData).forEach((userId) => {
            if (usersData[userId].creatorUid === driverID) {
              // Step 2: Update creatorUid to "unassigned" and status to "Deactivated"
              updates[`users/accounts/${userId}/creatorUid`] = "unassigned";
              updates[`users/accounts/${userId}/status`] = "Deactivated";
            }
          });

          // Step 3: Apply updates
          await firebase.database().ref().update(updates);
          console.log("Updated creatorUid and status for affected users.");
        }

        // Step 4: Delete the driver
        await driverRef.remove();
        alert("Driver deleted successfully.");
        deleteContainer.style.display = "none";

        // Refresh the driver list
        accountsRef.once("value").then((snapshot) => {
          const data = snapshot.val();
          renderData(data, "driver"); // Re-render the driver list
        });
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("Failed to delete driver. Please try again.");
      }
    },
    { once: true }
  );

  cancelDelete.addEventListener(
    "click",
    () => {
      deleteContainer.style.display = "none";
    },
    { once: true }
  );
}

// Attach delete functionality to delete icons
document.getElementById("dataTableBody").addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("delete-icon")) {
    const row = event.target.closest("tr");
    const driverID = row ? row.getAttribute("data-id") : null;
    if (driverID) {
      deleteDriver(driverID); // Call the delete function
    } else {
      alert("Driver ID not found. Unable to delete.");
    }
  }
});

/**
 * Logout function to log out the user and redirect to the login page.
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        console.log("User logged out successfully.");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Logout failed. Redirecting to the login page.");
        window.location.href = "index.html";
      }
    });
  }
}
/**
 * ✅ Check if user is logged in
 */
function checkUserLoggedIn() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("✅ User logged in:", user.email);

      const welcomeMessage = document.getElementById("welcomeMessage");
      if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.email}`;
      }
    } else {
      console.warn("⚠️ No user found! Redirecting to login.");
      window.location.href = "index.html";
    }
  });
}

/**
 * ✅ Logout user when clicking "Sign Out"
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");

  if (!logoutButton) {
    console.warn("❌ Logout button not found!");
    return;
  }

  logoutButton.addEventListener("click", async () => {
    try {
      console.log("🔑 Logging out...");
      await auth.signOut();
      console.log("✅ Successfully logged out.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "index.html";
    } catch (error) {
      console.error("❌ Error logging out:", error);
      alert("Logout failed!");
      window.location.href = "index.html";
    }
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
      //console.log("✅ Database data loaded:", snapshot.val());
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