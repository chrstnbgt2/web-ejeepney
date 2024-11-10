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
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); 
}

const database = firebase.database();
const auth = firebase.auth(); 

const roleSelect = document.getElementById('editAdminSelect');
const emailSelect = document.getElementById('emailSelect');
const accountForm = document.getElementById('accountForm');

function fetchUsersByRole(role) {
    console.log(`Fetching users for role: ${role}`); 
    const usersRef = database.ref('users/' + role.toLowerCase()); 
    usersRef.once('value', function(snapshot) {
        emailSelect.innerHTML = ''; 
        if (snapshot.exists()) {
            console.log('Snapshot exists'); 
            snapshot.forEach(function(childSnapshot) {
                const userData = childSnapshot.val();
                console.log('User Data:', userData); 
                const email = userData.email;
                const option = document.createElement('option');
                option.value = email;
                option.textContent = email;
                emailSelect.appendChild(option);
            });
        } else {
            console.log('No users found for this role'); 
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No users found for this role';
            emailSelect.appendChild(option);
        }
    }, function(error) {
        console.error('Error fetching users:', error);
    });
}

roleSelect.addEventListener('change', function() {
    const selectedRole = roleSelect.value;
    fetchUsersByRole(selectedRole);
});

fetchUsersByRole('admin');

accountForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const email = emailSelect.value;
    if (email) {
        sendPasswordResetEmail(email);
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please select an email from the list.',
        });
    }
});

function sendPasswordResetEmail(email) {
    auth.sendPasswordResetEmail(email).then(function() {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Password reset email sent to ' + email,
        });
    }).catch(function(error) {
        console.error('Error sending password reset email:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error sending password reset email: ' + error.message,
        });
    });
}