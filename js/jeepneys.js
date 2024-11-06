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
const jeepneyRef = database.ref("jeepneys");
const latestJeepIdRef = database.ref("latestJeepId");
let currentData = {};
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  renderJeepneyData(currentData, searchTerm);
});

jeepneyRef.on("value", (snapshot) => {
  currentData = snapshot.val();
  renderJeepneyData(currentData); 
});

function fetchAndRenderFilteredData() {
  const timeFilter = document.getElementById("timeFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;
  const currentDate = new Date();
  
  let query = firebase.database().ref("jeepneys");

  // Apply status filter to Firebase query
  if (statusFilter !== "allStatus") {
    const statusValue = statusFilter === "inService" ? "in-service" : "out-of-service"; // Match the Firebase format
    query = query.orderByChild("status").equalTo(statusValue);
  }

  // Fetch data from Firebase
  query.once("value").then((snapshot) => {
    const data = snapshot.val();
    const filteredData = {};

    // Filter data based on time period
    for (let id in data) {
      const jeepney = data[id];
      const timestamp = new Date(jeepney.timestamp); // Convert timestamp to Date

      const matchesTime = (function () {
        switch (timeFilter) {
          case "today":
            return (
              timestamp.getDate() === currentDate.getDate() &&
              timestamp.getMonth() === currentDate.getMonth() &&
              timestamp.getFullYear() === currentDate.getFullYear()
            );
          case "thisWeek":
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - currentDate.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return timestamp >= weekStart && timestamp <= weekEnd;
          case "thisMonth":
            return (
              timestamp.getMonth() === currentDate.getMonth() &&
              timestamp.getFullYear() === currentDate.getFullYear()
            );
          case "thisYear":
            return timestamp.getFullYear() === currentDate.getFullYear();
          default: // allTime
            return true;
        }
      })();

      // Only add jeepneys matching the time filter
      if (matchesTime) {
        filteredData[id] = jeepney;
      }
    }

    // Render only filtered data
    renderJeepneyData(filteredData);
  });
}

// Event listeners to re-fetch and render data when filters change
document.getElementById("timeFilter").addEventListener("change", fetchAndRenderFilteredData);
document.getElementById("statusFilter").addEventListener("change", fetchAndRenderFilteredData);

// Function to render the jeepney data
function renderJeepneyData(data, searchTerm = "") {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; 

  if (data) {
    for (let id in data) {
      const jeepney = data[id];
      const plateNumber = (jeepney.plateNumber || "").toString().toLowerCase();
      const capacity = (jeepney.capacity || "").toString().toLowerCase();
      const route = (jeepney.route || "").toString().toLowerCase();
      const status = (jeepney.status || "").toString().toLowerCase();

      if (
        searchTerm === "" ||
        plateNumber.includes(searchTerm) ||
        capacity.includes(searchTerm) ||
        route.includes(searchTerm) ||
        status.includes(searchTerm)
      ) {
        const row = `
          <tr data-id="${id}">
            <td>${id}</td>
            <td>${jeepney.plateNumber || ""}</td>
            <td>${jeepney.capacity || ""}</td>
            <td>${jeepney.route || ""}</td>
            <td>${jeepney.status || ""}</td>
            <td>
              <div class="action-icons">
                <img src="./img/edit.png" alt="edit" class="edit-icon" data-id="${id}">
                <img src="./img/trash-bin.png" alt="delete" class="delete-icon">
                <img src="./img/more.png" alt="view" class="view-icon" data-id="${id}">
              </div>
            </td>
          </tr>`;
        tbody.innerHTML += row;
      }
    }
    
    // Attach event listeners to edit and view icons
    const editIcons = document.querySelectorAll(".edit-icon");
    editIcons.forEach(icon => {
      icon.addEventListener("click", (event) => {
        const id = event.target.getAttribute("data-id");
        const jeepney = data[id];
        populateEditForm(jeepney, id); 
      });
    });

    const viewIcons = document.querySelectorAll(".view-icon");
    viewIcons.forEach(icon => {
      icon.addEventListener("click", (event) => {
        const id = event.target.getAttribute("data-id");
        const jeepney = data[id];
        populateViewForm(jeepney, id); 
      });
    });
  } else {
    tbody.innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
  }
}

function populateEditForm(jeepney, id) {
  document.getElementById("editPlateNumber").value = jeepney.plateNumber || "";
  document.getElementById("editCapacity").value = jeepney.capacity || ""; 
  document.getElementById("editRoute").value = jeepney.route || "";
  document.getElementById("editStatus").value = jeepney.status || "";
  document.getElementById("editDriverSelect").value = jeepney.driver || "";

  document.getElementById("editJeepId").value = id; 
  document.getElementById("editJeepContainer").style.display = "block";
}

function populateViewForm(jeepney, id) {
  document.getElementById("viewPlateNumber").value = jeepney.plateNumber || "";
  document.getElementById("viewCapacity").value = jeepney.capacity || ""; 
  document.getElementById("viewRoute").value = jeepney.route || "";
  document.getElementById("viewStatus").value = jeepney.status || "";
  document.getElementById("viewJeepId").value = id; 
  document.getElementById("viewJeepContainer").style.display = "flex";

  const driverId = jeepney.driver;
  if (driverId) {
    firebase.database().ref(`users/driver/${driverId}`).once('value').then(snapshot => {
      const driverData = snapshot.val();
      if (driverData) {
        const driverFullName = `${driverData.firstName || ""} ${driverData.middleName || ""} ${driverData.lastName || ""}`.trim();
        document.getElementById("viewSelect").value = driverFullName;
      } else {
        console.log("Driver data not found for ID:", driverId);
      }
    }).catch(error => {
      console.error("Error fetching driver data:", error);
    });
  } else {
    document.getElementById("viewSelect").value = "";
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const infoJeepContainer = document.getElementById("editJeepContainer");
  const viewJeepContainer = document.getElementById("viewJeepContainer");
  const editCloseIcon = document.getElementById("editCloseIcon");
  const viewCloseIcon = document.getElementById("viewCloseIcon");

  editCloseIcon.addEventListener("click", function () {
    infoJeepContainer.style.display = "none";
  });

  viewCloseIcon.addEventListener("click", function () {
    viewJeepContainer.style.display = "none";
  });

const confirmDelete = document.querySelector(".confirm-delete");
  document
    .getElementById("dataTableBody")
    .addEventListener("click", function (event) {
      const row = event.target.closest("tr");
      const jeepneyId = row ? row.getAttribute("data-id") : null;
      const deleteContainer = document.querySelector(".delete-jeep-container");

      if (event.target && event.target.classList.contains("edit-icon")) {
        infoJeepContainer.style.display = "flex";
        const cells = row.getElementsByTagName("td");
        document.getElementById("plateNumber").value = cells[1].innerText;
        document.getElementById("capacity").value = cells[2].innerText;
        document.getElementById("route").value = cells[3].innerText;
        document.getElementById("status").value = cells[4].innerText;
      } else if (
        event.target &&
        event.target.classList.contains("delete-icon")
      ) {
        deleteContainer.style.display = "flex";

        const confirmDelete = document.querySelector(".confirm-delete");

        confirmDelete.addEventListener(
          "click",
          () => {
            if (jeepneyId) {
              jeepneyRef
                .child(jeepneyId)
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
      } else if (event.target && event.target.alt === "more") {
        viewJeepContainer.style.display = "flex";
        const cells = row.getElementsByTagName("td");
        document.getElementById("plateNumber").value = cells[1].innerText;
        document.getElementById("capacity").value = cells[2].innerText;
        document.getElementById("route").value = cells[3].innerText;
        document.getElementById("status").value = cells[4].innerText;
        document.getElementById("driver").value = "Sample Driver";
      }
    });
});

function fetchDrivers() {
  var driverSelect = document.getElementById("editDriverSelect");
  var driverRef = database.ref("users/driver");
  driverRef.once("value", function(snapshot) {
    driverSelect.innerHTML = '<option value="">Select a Driver</option>';
    snapshot.forEach(function(childSnapshot) {
      var driver = childSnapshot.val();
      var driverId = childSnapshot.key;
      var driverName = `${driver.firstName || ""} ${driver.middleName || ""} ${driver.lastName || ""}`.trim();
      
      var option = document.createElement("option");
      option.value = driverId;
      option.text = driverName;
      driverSelect.appendChild(option);
    });
  }).catch(function(error) {
    console.error("Error fetching drivers: ", error);
  });
}
document.addEventListener("DOMContentLoaded", function() {
  fetchDrivers();
});

function showEditForm(jeepneyId) {
  // Hide view form, show edit form
  document.getElementById("viewJeepContainer").style.display = "none";
  document.getElementById("editJeepContainer").style.display = "block";

  // Fetch and populate data in edit form
  jeepneyRef.child(jeepneyId).once("value").then((snapshot) => {
    const jeepneyData = snapshot.val();
    document.getElementById("editPlateNumber").value = jeepneyData.plateNumber || "";
    // Populate other fields as necessary
  });
}


function save() {
  const plateNumber = document.getElementById("plateNumber").value;
  const capacity = document.getElementById("capacity").value;
  const route = document.getElementById("route").value;
  const status = document.getElementById("status").value;

  if (!plateNumber || !capacity || !route || !status) {
    alert("Please fill in all the fields.");
    return;
  }

  latestJeepIdRef.transaction((currentId) => {
    return (currentId || 0) + 1; 
  }).then((result) => {
    const newJeepId = result.snapshot.val(); 
    const timestamp = Date.now();

    jeepneyRef.child(newJeepId).set({
      id: newJeepId,
      plateNumber: plateNumber,
      capacity: capacity,
      route: route,
      status: status,
      timestamp: timestamp 
    }).then(() => {
      document.getElementById("plateNumber").value = "";
      document.getElementById("capacity").value = "";
      document.getElementById("route").value = "";
      document.getElementById("status").value = "";
      document.querySelector(".info-jeep-container").style.display = "none";
    }).catch((error) => {
      console.error("Error adding jeepney: ", error);
    });
  }).catch((error) => {
    console.error("Error fetching latest Jeepney ID: ", error);
  });
}

function updateJeepney() {
  const jeepneyId = document.getElementById("editJeepId").value;
  const plateNumber = document.getElementById("editPlateNumber").value;
  const capacity = document.getElementById("editCapacity").value;
  const route = document.getElementById("editRoute").value;
  const status = document.getElementById("editStatus").value;
  const driver = document.getElementById("editDriverSelect").value;

  if (!plateNumber || !capacity || !route || !status || !driver) {
    alert("Please fill in all the fields.");
    return;
  }

  const timestamp = Date.now();

  jeepneyRef.child(jeepneyId).update({
    plateNumber: plateNumber,
    capacity: capacity,
    route: route,
    status: status,
    driver: driver,
    timestamp: timestamp 
  }).then(() => {
    alert("Jeepney information updated successfully.");
    document.getElementById("editJeepContainer").style.display = "none";
    fetchAndRenderJeepneyData(); // Fetch and render the latest data
  }).catch((error) => {
    console.error("Error updating jeepney: ", error);
  });
}


function fetchAndRenderJeepneyData() {
  jeepneyRef.once('value', (snapshot) => {
    const data = snapshot.val();
    renderJeepneyData(data);
  }).catch((error) => {
    console.error("Error fetching jeepney data: ", error);
  });
}
