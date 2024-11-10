// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbKR42baFMFZSKbE63pr8cKE8IJ-6iVeY",
    authDomain: "e-jeepney-8fe2e.firebaseapp.com",
    databaseURL: "https://e-jeepney-8fe2e-default-rtdb.firebaseio.com",
    projectId: "e-jeepney-8fe2e",
    storageBucket: "e-jeepney-8fe2e.appspot.com",
    messagingSenderId: "70390538365",
    appId: "1:70390538365:web:59ffb8bac69c67db491114",
    measurementId: "G-VJH1K6M4T2"
  };
  
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  
  var dataRef = database.ref("users/passenger");
  
  const searchInput = document.querySelector('.search-input');
  
  const filterSelect = document.querySelector('.combobox select');
  
  dataRef.on("value", (snapshot) => {
    const data = snapshot.val();
    const tbody = document.getElementById("dataTableBody");
    tbody.innerHTML = ""; 
  
    renderData(data);
  
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        renderData(data, searchTerm, filterSelect.value);
    });
  
    filterSelect.addEventListener('change', () => {
        renderData(data, searchInput.value.trim().toLowerCase(), filterSelect.value);
    });
  });
  
  function renderData(data, searchTerm = "", timeFilter = "") {
    const tbody = document.getElementById("dataTableBody");
    tbody.innerHTML = ""; 
  
    if (data) {
        const currentDate = new Date();
  
        for (let id in data) {
            const user = data[id];
            const fullName = `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.toLowerCase();
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
                let row = `
                    <tr>
                        <td>${id}</td>
                        <td>${user.firstName || ''}</td>
                        <td>${user.middleName || ''}</td>
                        <td>${user.lastName || ''}</td>
                        <td>${user.email || ''}</td>
                        <td>${user.phoneNumber || ''}</td>
                        <td>${user.role || ''}</td>
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
        case 'Today':
            return (
                timestamp.getFullYear() === currentDate.getFullYear() &&
                timestamp.getMonth() === currentDate.getMonth() &&
                timestamp.getDate() === currentDate.getDate()
            );
        case 'This Week':
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            return timestamp >= startOfWeek;
        case 'This Month':
            return (
                timestamp.getFullYear() === currentDate.getFullYear() &&
                timestamp.getMonth() === currentDate.getMonth()
            );
        case 'This Year':
            return timestamp.getFullYear() === currentDate.getFullYear();
        default:
            return true;
    }
  }
  