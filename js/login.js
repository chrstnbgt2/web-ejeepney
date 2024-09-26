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
  // initialize config
  firebase.initializeApp(firebaseConfig);

    // Set database variable
    var database = firebase.database()
  
    function get() {
        var email = document.getElementById('email').value
        var password = document.getElementById('email').value
      
        var user_ref = database.ref('users/' + email)
        user_ref.on('value', function(snapshot) {
        var data = snapshot.val()
            
            if (data.password == password){
                window.location.href ="./index.html"
                alert(data.email)
            }
            else{
                alert("something")
            }
        })
      
      }