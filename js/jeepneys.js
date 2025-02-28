// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbKR42baFMFZSKbE63pr8cKE8IJ-6iVeY",
  authDomain: "e-jeepney-8fe2e.firebaseapp.com",
  databaseURL: "https://e-jeepney-8fe2e-default-rtdb.firebaseio.com",
  projectId: "e-jeepney-8fe2e",
  storageBucket: "e-jeepney-8fe2e.appspot.com",
  messagingSenderId: "70390538365",
  appId: "1:70390538365:web:59ffb8bac69c67db491114",
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const jeepneyRef = database.ref("jeepneys");
const usersRef = database.ref("users/accounts");
let driverMap = {};

 
/** 🚀 Fetch Unassigned Drivers & Preserve Current Assigned Driver */
function fetchUnassignedDriversForSelect(currentDriverId) {
  return new Promise((resolve, reject) => {
    Promise.all([
      usersRef.orderByChild("role").equalTo("driver").once("value"),
      jeepneyRef.once("value"),
    ])
      .then(([driverSnapshot, jeepneySnapshot]) => {
        const assignedDrivers = new Set();

        // ✅ Step 1: Collect assigned drivers from jeepneys
        if (jeepneySnapshot.exists()) {
          jeepneySnapshot.forEach((childSnapshot) => {
            const jeepneyData = childSnapshot.val();
            if (jeepneyData.driver && jeepneyData.driver !== "") {
              assignedDrivers.add(jeepneyData.driver);
            }
          });
        }

        // ✅ Step 2: Populate unassigned drivers (except for the current driver)
        const editDriverSelect = document.getElementById("editDriverSelect");
        if (!editDriverSelect) {
          console.error("❌ 'editDriverSelect' dropdown not found in DOM!");
          return reject("Dropdown not found");
        }

        // Clear existing options
        editDriverSelect.innerHTML = `<option value="">Select a Driver</option>`; // Default option

        driverSnapshot.forEach((childSnapshot) => {
          const driverData = childSnapshot.val();
          const driverId = childSnapshot.key;
          const driverName = `${driverData.firstName || ""} ${driverData.middleName || ""} ${driverData.lastName || ""}`.trim();

          // ✅ Only add unassigned drivers OR the current assigned driver
          if (!assignedDrivers.has(driverId) || driverId === currentDriverId) {
            editDriverSelect.innerHTML += `<option value="${driverId}">${driverName}</option>`;
          }
        });

        console.log("✅ Unassigned drivers loaded for edit dropdown.");
        resolve();
      })
      .catch((error) => {
        console.error("❌ Error fetching unassigned drivers:", error);
        reject(error);
      });
  });
}


/** 🚀 Fetch Drivers and Populate Dropdown */
function fetchDrivers() {
  usersRef
    .orderByChild("role")
    .equalTo("driver")
    .once("value")
    .then((snapshot) => {
      driverMap = {};
      
      // Get both Add & Edit select dropdowns
      const driverSelects = document.querySelectorAll(".driver-select");

      // Clear existing options in dropdowns
      driverSelects.forEach((select) => {
        select.innerHTML = `<option value="">Select a Driver</option>`; // Default option
      });

      snapshot.forEach((childSnapshot) => {
        const driverData = childSnapshot.val();
        const driverId = childSnapshot.key; // Get driver UID
        const driverName = `${driverData.firstName || ""} ${driverData.middleName || ""} ${driverData.lastName || ""}`.trim();

        driverMap[driverId] = driverName || "Unknown Driver"; // Store driver in map

        // Append driver options to both Add & Edit dropdowns
        driverSelects.forEach((select) => {
          select.innerHTML += `<option value="${driverId}">${driverName}</option>`;
        });
      });

      console.log("✅ Drivers loaded and dropdowns populated:", driverMap);
      fetchAndRenderJeepneys(); // Continue rendering jeepneys after drivers are loaded
    })
    .catch((error) => console.error("❌ Error fetching drivers:", error));
}

/** 🚗 Fetch Jeepneys and Render into Table */
function fetchAndRenderJeepneys() {
  jeepneyRef.on("value", (snapshot) => {
    const data = snapshot.val();
    renderJeepneyData(data);
  });
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "N/A"; // Handle missing timestamps
  const date = new Date(timestamp);
  return date.toLocaleDateString(); // Converts to MM/DD/YYYY format
}


function viewJeepneyDetails(jeepneyId) {
  const jeepneyModal = document.getElementById("jeepneyModalContainer");
  if (!jeepneyModal) {
    console.error("Error: jeepneyModalContainer not found in the DOM.");
    return;
  }

  const jeepneyRef = firebase.database().ref(`jeepneys/${jeepneyId}`);

  jeepneyRef.once("value").then((snapshot) => {
    if (!snapshot.exists()) {
      alert("Jeepney not found.");
      return;
    }

    const jeepneyData = snapshot.val();

    // // ✅ Populate modal with jeepney details
    // document.getElementById("viewPlateNumber").textContent = jeepneyData.plateNumber || "N/A";
    // document.getElementById("viewCapacity").textContent = jeepneyData.capacity || "N/A";
    // document.getElementById("viewRoute").textContent = jeepneyData.route || "N/A";
    // document.getElementById("viewStatus").textContent = jeepneyData.status || "N/A";

    // ✅ Fetch Driver History from `jeepneys/{jeepneyId}/history_driver`
    const historyRef = firebase.database().ref(`jeepneys/${jeepneyId}/history_driver`);

    historyRef.once("value").then((historySnapshot) => {
      const historyList = document.getElementById("viewDriverHistory");
      historyList.innerHTML = ""; // Clear previous content

      if (historySnapshot.exists()) {
        let foundHistory = false; // Track if at least one valid history entry is found

        historySnapshot.forEach((childSnapshot) => {
          const history = childSnapshot.val();

          if (history.driverName && history.dateAssigned) { // Ensure valid data
            foundHistory = true;
            const driverName = history.driverName;
            const dateAssigned = new Date(history.dateAssigned).toLocaleString();

            const historyItem = document.createElement("li");
            historyItem.textContent = `${driverName} (Assigned: ${dateAssigned})`;
            historyList.appendChild(historyItem);
          }
        });

        // If no valid history found, display a default message
        if (!foundHistory) {
          historyList.innerHTML = "<li>No previous drivers assigned.</li>";
        }
      } else {
        historyList.innerHTML = "<li>No previous drivers assigned.</li>";
      }
    }).catch((error) => {
      console.error("❌ Error fetching driver history:", error);
      historyList.innerHTML = "<li>Error loading driver history.</li>";
    });

    // ✅ Show modal
    jeepneyModal.style.display = "block";
  }).catch((error) => {
    console.error("❌ Error fetching jeepney details:", error);
    alert("❌ Error fetching jeepney details.");
  });
}



// Function to close the modal
function closeJeepneyModal() {
  document.getElementById("jeepneyModalContainer").style.display = "none";
}

function sanitizeHTML(str) {
  if (!str) return ""; // Ensure input is always a string

  let temp = document.createElement("div");
  temp.textContent = str; // Convert to plain text, escaping any HTML tags

  return temp.innerHTML
    .replace(/javascript:/gi, "") // Remove `javascript:` URLs
    .replace(/<script.*?>.*?<\/script>/gi, "") // Remove <script> tags
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, ""); // Remove inline event handlers (onclick, onerror)
}


function renderJeepneyData(data) {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = "";

  if (data) {
    const sortedData = Object.entries(data).sort((b, a) => {
      const timestampA = a[1].timestamp || 0;
      const timestampB = b[1].timestamp || 0;
      return timestampB - timestampA;
    });

    let idnumber = 1;
    for (let [id, jeepney] of sortedData) {
      const driverName = driverMap[jeepney.driver] || "Unassigned";
      const formattedTimestamp = formatTimestamp(jeepney.timestamp);

      const row = `
       <tr data-id="${sanitizeHTML(id)}">
    <td>${sanitizeHTML(idnumber.toString())}</td>
    <td>${sanitizeHTML(jeepney.plateNumber || "")}</td>
    <td>${sanitizeHTML(jeepney.capacity || "")}</td>
    <td>${sanitizeHTML(jeepney.route || "")}</td>
    <td>${sanitizeHTML(jeepney.status || "")}</td>
    <td>${sanitizeHTML(driverName)}</td>
    <td>${sanitizeHTML(formattedTimestamp)}</td>
    <td>
        <img src="./img/edit.png" alt="edit" class="edit-icon" data-id="${sanitizeHTML(id)}">
        <img src="./img/trash-bin.png" alt="delete" class="delete-icon" data-id="${sanitizeHTML(id)}">
        <img src="./img/more.png" alt="view" class="view-icon" data-id="${sanitizeHTML(id)}" onclick="viewJeepneyDetails('${sanitizeHTML(id)}')">
    </td>
</tr>

      `;

      tbody.innerHTML += row;
      idnumber++;
    }

    attachActionListeners(data);
  } else {
    tbody.innerHTML = "<tr><td colspan='8'>No data available</td></tr>";
  }
}

/**
 * 📌 Function to Display Jeepney Details in a Modal
 */
function showJeepneyDetails(jeepney) {
  const modalContainer = document.getElementById("jeepneyModalContainer");
  const modalContent = document.getElementById("jeepneyModalContent");

  // ✅ Populate Modal with Jeepney Data
  modalContent.innerHTML = `
    <h2>Jeepney Details</h2>
    <p><strong>Plate Number:</strong> ${jeepney.plateNumber || "N/A"}</p>
    <p><strong>Capacity:</strong> ${jeepney.capacity || "N/A"}</p>
    <p><strong>Route:</strong> ${jeepney.route || "N/A"}</p>
    <p><strong>Status:</strong> ${jeepney.status || "N/A"}</p>
    <p><strong>Driver:</strong> ${driverMap[jeepney.driver] || "Unassigned"}</p>
    <p><strong>Last Updated:</strong> ${formatTimestamp(jeepney.timestamp)}</p>
    <button class="close-modal">Close</button>
  `;

  // ✅ Show the modal
  modalContainer.style.display = "block";

  // ✅ Close the modal when clicking "Close" button
  document.querySelector(".close-modal").addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
}



/** 🔗 Attach Event Listeners for Edit and Delete */
function attachActionListeners(data) {
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      openEditModal(id);
    });
  });

  document.querySelectorAll(".delete-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      confirmDelete(id);
    });
  });
}

/** ✏️ Open Edit Modal & Populate Data */
function openEditModal(id) {
  console.log(`✏️ Editing Jeepney: ${id}`);

  const jeepneyRef = database.ref(`jeepneys/${id}`);
  jeepneyRef.once("value").then((snapshot) => {
    if (!snapshot.exists()) {
      alert("Jeepney not found!");
      return;
    }

    const jeepneyData = snapshot.val();

    // ✅ Populate fields
    document.getElementById("editJeepId").value = id;
    document.getElementById("editPlateNumber").value = jeepneyData.plateNumber || "";
    document.getElementById("editCapacity").value = jeepneyData.capacity || "";
    document.getElementById("editRoute").value = jeepneyData.route || "";
    document.getElementById("editStatus").value = jeepneyData.status || "";

    const currentDriverId = jeepneyData.driver || "";

    // ✅ Fetch unassigned drivers first, THEN set the selected driver
    fetchUnassignedDriversForSelect(currentDriverId).then(() => {
      const editDriverSelect = document.getElementById("editDriverSelect");
      if (editDriverSelect) {
        editDriverSelect.value = currentDriverId; // Ensure the current driver is still assigned
      }
    });

    document.getElementById("editJeepContainer").style.display = "flex";
  }).catch(error => console.error("❌ Error fetching jeepney details:", error));
}

 

/** ✅ Open & Close Add Jeepney Modal */
document.querySelector(".add-button").addEventListener("click", () => {
  document.querySelector(".info-jeep-container").style.display = "flex";
});

document.querySelector(".close-icon").addEventListener("click", () => {
  document.querySelector(".info-jeep-container").style.display = "none";
});
 

/** 🚮 Delete Confirmation Modal Logic */
let deleteModal = document.querySelector(".delete-jeep-container");
let confirmDeleteBtn = document.querySelector(".confirm-delete");
let cancelDeleteBtn = document.querySelector(".cancel-delete");
let closeDeleteIcon = document.querySelector(".delete-close-icon");
let jeepneyToDelete = null;

// Show Delete Modal
function confirmDelete(id) {
  jeepneyToDelete = id;
  deleteModal.style.display = "flex"; // Show modal
}

// Close the modal without deleting
cancelDeleteBtn.addEventListener("click", function () {
  deleteModal.style.display = "none";
  jeepneyToDelete = null;
});

closeDeleteIcon.addEventListener("click", function () {
  deleteModal.style.display = "none";
  jeepneyToDelete = null;
});

// Confirm delete
confirmDeleteBtn.addEventListener("click", function () {
  if (jeepneyToDelete) {
    deleteJeepney(jeepneyToDelete);
    deleteModal.style.display = "none";
    jeepneyToDelete = null;
  }
});

/** 🗑️ Function to Delete Jeepney from Firebase */
function deleteJeepney(id) {
  jeepneyRef.child(id)
    .remove()
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The Jeepney has been successfully removed.",
        timer: 2000,
        showConfirmButton: false
      });

      fetchAndRenderJeepneys(); // Refresh table
    })
    .catch((error) => {
      console.error("❌ Error deleting jeepney:", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "An error occurred while deleting the Jeepney. Please try again.",
      });
    });
}

/** ✅ Save Jeepney Data to Firebase */
/** ✅ Save Jeepney Data to Firebase with Duplicate Plate Number Validation */
function saveJeepney() {
  const plateNumber = document.getElementById("add-plateNumber").value.trim();
  const capacity = document.getElementById("add-capacity").value.trim();
  const route = document.getElementById("add-route").value.trim();
  const status = document.getElementById("status").value.trim();
  const driverId = ""; // No driver assigned initially

  if (!plateNumber || !capacity || !route || !status) {
    alert("❌ Please fill in all fields!");
    return;
  }

  // ✅ Check if plate number already exists
  jeepneyRef.orderByChild("plateNumber").equalTo(plateNumber).once("value", (snapshot) => {
    if (snapshot.exists()) {
      alert("❌ This Plate Number already exists! Please use a different one.");
      return;
    }

    const newJeepneyRef = jeepneyRef.push(); // Generates a unique ID
    const newJeepneyId = newJeepneyRef.key; // Get generated ID

    const newJeepneyData = {
      availableSeats: parseInt(capacity), // Integer
      capacity: capacity, // String
      currentCapacity: parseInt(capacity), // Integer
      driver: driverId, // Initially empty
      plateNumber: plateNumber,
      route: route,
      status: status,
      timestamp: Date.now(),
    };

    newJeepneyRef
      .set(newJeepneyData)
      .then(() => {
        console.log("✅ Jeepney Added Successfully!", newJeepneyData);
        alert("🚗 Jeepney successfully added!");

        // Close modal and clear input fields
        document.querySelector(".info-jeep-container").style.display = "none";
        document.getElementById("add-plateNumber").value = "";
        document.getElementById("add-capacity").value = "";
        document.getElementById("add-route").value = "";
        document.getElementById("status").value = "in-service";

        fetchAndRenderJeepneys(); // Refresh table
      })
      .catch((error) => {
        console.error("❌ Error adding jeepney:", error);
        alert("❌ Error saving data. Please try again.");
      });
  });
}


/** ✅ Update Jeepney Data in Firebase */
/** ✅ Update Jeepney Data in Firebase with Duplicate Plate Number Validation */
function updateJeepney() {
  const jeepneyId = document.getElementById("editJeepId").value;
  const plateNumber = document.getElementById("editPlateNumber").value.trim();
  const capacity = document.getElementById("editCapacity").value.trim();
  const route = document.getElementById("editRoute").value.trim();
  const status = document.getElementById("editStatus").value.trim();
  const driverId = document.getElementById("editDriverSelect").value; // Selected driver UID

  if (!jeepneyId || !plateNumber || !capacity || !route || !status) {
    alert("❌ Please fill in all fields!");
    return;
  }

  // ✅ Reference to Jeepneys
  const jeepneyRef = firebase.database().ref(`jeepneys`);

  // ✅ Check if another jeepney already has this plate number
  jeepneyRef.orderByChild("plateNumber").equalTo(plateNumber).once("value", (snapshot) => {
    let duplicateFound = false;

    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.key !== jeepneyId) {
        duplicateFound = true;
      }
    });

    if (duplicateFound) {
      alert("❌ This Plate Number is already assigned to another Jeepney! Please use a different one.");
      return;
    }

    const updatedJeepneyData = {
      availableSeats: parseInt(capacity), // Convert to integer
      capacity: capacity, // String
      currentCapacity: parseInt(capacity), // Convert to integer
      driver: driverId || "", // Update the driver (can be empty)
      plateNumber: plateNumber,
      route: route,
      status: status,
    };

    // ✅ Update Jeepney Data
    jeepneyRef.child(jeepneyId)
      .update(updatedJeepneyData)
      .then(() => {
        console.log("✅ Jeepney Updated Successfully!", updatedJeepneyData);
        alert("🚗 Jeepney successfully updated!");

        if (driverId) {
          const driverRef = firebase.database().ref(`users/accounts/${driverId}`);

          driverRef.once("value").then((snapshot) => {
            if (snapshot.exists()) {
              const driverData = snapshot.val();
              const driverName = `${driverData.firstName || ""} ${driverData.lastName || ""}`.trim();
              const currentDate = new Date().toISOString(); // Current Date (ISO format)

              // ✅ Update the driver's assigned jeepney
              driverRef.update({ jeep_assigned: jeepneyId })
                .then(() => {
                  console.log("✅ Jeepney assigned to driver:", driverId);
                })
                .catch((error) => {
                  console.error("❌ Error assigning jeepney to driver:", error);
                });

              // ✅ Save History Log Inside `jeepneys/{jeepneyId}/history_driver`
              const historyRef = firebase.database().ref(`jeepneys/${jeepneyId}/history_driver`).push();
              historyRef.set({
                driverId: driverId,
                driverName: driverName,
                dateAssigned: currentDate,
              }).then(() => {
                console.log("✅ Driver history recorded successfully inside jeepneys node!");
              }).catch((error) => {
                console.error("❌ Error saving driver history inside jeepneys node:", error);
              });
            }
          });
        }

        // Close modal
        document.getElementById("editJeepContainer").style.display = "none";

        // Refresh the table
        fetchAndRenderJeepneys();
      })
      .catch((error) => {
        console.error("❌ Error updating jeepney:", error);
        alert("❌ Error updating data. Please try again.");
      });
  });
}



/** ✅ Load Everything on Page Load */
document.addEventListener("DOMContentLoaded", () => {
  fetchDrivers();
  fetchUnassignedDriversForSelect();
});

