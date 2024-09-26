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
  
    function save() {
      database.ref('users/' + "test").set({
        email : "test",
        password : "test",
        username : "test",
        bio : "test",
        interest : "test"
      })
      alert("you clicked the button.")
    }  