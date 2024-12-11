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
var storage = firebase.storage();

// Reference the 'drivers' node
var dataRef = database.ref("users/driver");

// Reference the search input element
const searchInput = document.querySelector(".search-input");

// Fetch Data from Firebase and Render it into the Table
dataRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the existing table content before rendering new data

  // Render the data initially (with no filter)
  renderData(data);

  // Add a search filter
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase(); // Trim spaces
    renderData(data, searchTerm);
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

// Function to handle showing the driver-view-container
function showViewContainer() {
  const viewContainer = document.querySelector(".driver-view-container");
  viewContainer.style.display = "flex";
}

document
  .querySelector(".add-button")
  .addEventListener("click", showAddContainer);

// Function to close the active container
function closeActiveContainer() {
  const editContainer = document.querySelector(".driver-edit-container");
  const viewContainer = document.querySelector(".driver-view-container");
  const addContainer = document.querySelector(".add-driver-jeep-container");

  // Hide both containers
  editContainer.style.display = "none";
  viewContainer.style.display = "none";
  addContainer.style.display = "none";
}

// Function to render the data into the table
function renderData(data, searchTerm = "", startTime = 0, endTime = Infinity) {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the table content

  if (data) {
    // Loop through the data and construct each row
    for (let id in data) {
      const driver = data[id];
      const fullName = `${driver.firstName || ""} ${driver.middleName || ""} ${
        driver.lastName || ""
      }`.toLowerCase();

      const recordTimestamp = driver.timestamp || 0; // Default to 0 if timestamp is missing

      // Apply both the search and timestamp filter
      if (
        (searchTerm === "" || // If searchTerm is empty, show all data
          fullName.includes(searchTerm) ||
          (driver.email && driver.email.toLowerCase().includes(searchTerm)) ||
          (driver.phone && driver.phone.includes(searchTerm))) &&
        recordTimestamp >= startTime &&
        recordTimestamp <= endTime
      ) {
        // Create a new table row with the fetched data
        let row = `
            <tr data-id=${id}>
                <td style="font-size:10px;">${id}</td>
                <td>${driver.firstName || ""}</td>
                <td>${driver.middleName || ""}</td>
                <td>${driver.lastName || ""}</td>
                <td>${driver.email || ""}</td>
                <td>${driver.phone || ""}</td>
                <td>${driver.role || ""}</td>
                <td>
                    <div class="action-icons">
                        <img src="./img/edit.png" alt="edit" class="edit-icon">
                        <img src="./img/trash-bin.png" alt="delete" class="delete-icon">
                        <img src="./img/more.png" alt="more" class="more-icon">
                    </div>
                </td>
            </tr>`;
        tbody.innerHTML += row;
      }
    }

    // Add event listeners to the edit and more icons after rendering
    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", showEditContainer);
    });

    document.querySelectorAll(".more-icon").forEach((icon) => {
      icon.addEventListener("click", showViewContainer);
    });
  } else {
    tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
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

// ADDING OF DRIVERS
function addDriver() {
  // Get the form values
  const firstName = document.getElementById("fname").value;
  const middleName = document.getElementById("mname").value;
  const lastName = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phoneNumber").value;
  const password = document.getElementById("password").value;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !password) {
    alert("Please fill in all required fields!");
    return;
  }

  // Fetch the latestUserID from the database
  database
    .ref("/latestUserId")
    .once("value")
    .then((snapshot) => {
      let latestUserID = snapshot.val() || 0; // Default to 0 if not set

      // Increment latestUserID by 1 to generate the new UID
      const newUserID = latestUserID + 1;
      const uid = newUserID; // Use plain number as UID

      // Driver data to store in the database
      const driverData = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        phone: phone,
        role: "Driver",
        wallet_balance: 0,
        timestamp: Date.now(),
        userID: newUserID, // Add the new userID
      };

      // Create a user in Firebase Authentication
      return auth.createUserWithEmailAndPassword(email, password).then(() => {
        // Save driver data in the Realtime Database with the new UID
        return database
          .ref(`users/driver/${uid}`)
          .set(driverData)
          .then(() => {
            // Generate QR code content
            const qrContent = `Driver Name: ${firstName} ${lastName}\nUID: ${uid}`;
            const qrCanvas = document.createElement("canvas");

            return new Promise((resolve, reject) => {
              QRCode.toCanvas(qrCanvas, qrContent, (err) => {
                if (err) {
                  reject(err);
                } else {
                  qrCanvas.toBlob((blob) => resolve(blob));
                }
              });
            });
          })
          .then((blob) => {
            // Upload QR code Blob to Firebase Storage
            const storageRef = storage.ref(`qrcodes/driver/${uid}.png`);
            return storageRef.put(blob).then(() => storageRef.getDownloadURL());
          })
          .then((downloadURL) => {
            // Update the Realtime Database with the QR code link
            return database
              .ref(`users/driver/${uid}`)
              .update({ qr: downloadURL })
              .then(() => {
                // Update the latestUserID in the database
                return database
                  .ref("/latestUserId")
                  .set(newUserID)
                  .then(() => {
                    console.log("QR Code URL:", downloadURL);

                    // Optionally, clear the form
                    document.getElementById("fname").value = "";
                    document.getElementById("mname").value = "";
                    document.getElementById("lname").value = "";
                    document.getElementById("email").value = "";
                    document.getElementById("phoneNumber").value = "";
                    document.getElementById("password").value = "";
                    closeActiveContainer();
                  });
              });
          });
      });
    })
    .catch((error) => {
      console.error("Error adding driver:", error);
      alert(`Failed to add driver: ${error.message}`);
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
        document.getElementById("view-phoneNumber").value = driver.phone || "";
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

// Delegate the click event to the table body for dynamically generated rows
document.getElementById("dataTableBody").addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("edit-icon")) {
    const row = event.target.closest("tr");
    const driverID = row ? row.getAttribute("data-id") : null;
    if (driverID) {
      fetchDriverData(driverID);
    } else {
      alert("Driver ID not found.");
    }
  }
  if (event.target && event.target.classList.contains("more-icon")) {
    const row = event.target.closest("tr");
    const driverID = row ? row.getAttribute("data-id") : null;
    if (driverID) {
      fetchDriverDataAndView(driverID);
    } else {
      alert("Driver ID not found.");
    }
  }
});

// Function to handle editing driver data
function editDriverData(driverID) {
  // Collect data from the input fields
  const updatedData = {
    firstName: document.getElementById("edit-fname").value.trim(),
    middleName: document.getElementById("edit-mname").value.trim(),
    lastName: document.getElementById("edit-lname").value.trim(),
    phone: document.getElementById("edit-phoneNumber").value.trim(),
  };

  // Reference to the driver's data in the Firebase database (users/driver/{driverID})
  const driverRef = firebase.database().ref(`users/driver/${driverID}`);

  // Update the data
  driverRef
    .update(updatedData)
    .then(() => {
      closeActiveContainer(); // Hide the edit container
      refreshDriverList(); // Optional: Refresh the displayed list of drivers
    })
    .catch((error) => {
      console.error("Error updating driver data:", error);
    });
}

// Add an event listener to the SAVE button
document.getElementById("driver-edit").addEventListener("click", () => {
  const driverID = getSelectedDriverID(); // Retrieve the current driver ID
  if (driverID) {
    editDriverData(driverID);
  } else {
    alert("Driver ID not found. Unable to save changes.");
  }
});

// Function to retrieve the selected driver ID
function getSelectedDriverID() {
  // Ensure that the driver-edit container has the data-id attribute set
  const editContainer = document.querySelector(".driver-edit-container");
  return editContainer ? editContainer.getAttribute("data-id") : null;
}

// Function to refresh the driver list (optional)
function refreshDriverList() {
  // Your logic to refresh the displayed list of drivers after an update
  fetchAllDrivers(); // Example placeholder function, replace with your actual function
}

// Function to fetch and display driver data for editing (this function should be called when editing a driver)
function fetchDriverData(driverID) {
  const editContainer = document.querySelector(".driver-edit-container");

  // Set the driver ID in the edit container's data-id attribute
  editContainer.setAttribute("data-id", driverID);

  // Fetch driver data from Firebase
  const driverRef = firebase.database().ref(`users/driver/${driverID}`);
  driverRef.once("value", (snapshot) => {
    const driver = snapshot.val();
    if (driver) {
      // Populate the form fields with the driver data
      document.getElementById("edit-fname").value = driver.firstName || "";
      document.getElementById("edit-mname").value = driver.middleName || "";
      document.getElementById("edit-lname").value = driver.lastName || "";
      document.getElementById("edit-phoneNumber").value = driver.phone || "";
    } else {
      alert("Driver data not found.");
    }
  });
}
