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
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
      
          // Set database variable
          var database = firebase.database();
          console.log('Firebase initialized:', firebase);
          console.log('Database reference:', database);
      
          function toggleEdit(type) {
            const firstKmInput = document.getElementById(`${type}-first-km`);
            const succeedingKmInput = document.getElementById(`${type}-succeeding-km`);
            const saveButton = document.getElementById(`${type}-save-button`);
      
            if (firstKmInput.readOnly) {
              firstKmInput.readOnly = false;
              succeedingKmInput.readOnly = false;
              saveButton.style.display = 'inline-block';
              firstKmInput.style.backgroundColor = '#fff';
              succeedingKmInput.style.backgroundColor = '#fff';
            } else {
              firstKmInput.readOnly = true;
              succeedingKmInput.readOnly = true;
              saveButton.style.display = 'none';
              firstKmInput.style.backgroundColor = '';
              succeedingKmInput.style.backgroundColor = '';
            }
          }
      
          function saveFare(type) {
            const firstKmInput = document.getElementById(`${type}-first-km`);
            const succeedingKmInput = document.getElementById(`${type}-succeeding-km`);
      
            const fareData = {
              firstKm: parseFloat(firstKmInput.value),
              succeedingKm: parseFloat(succeedingKmInput.value)
            };
      
            database.ref('fares/' + type).set(fareData, (error) => {
              if (error) {
                alert('Error saving data: ' + error.message);
              } else {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} fare saved successfully!`);
                firstKmInput.readOnly = true;
                succeedingKmInput.readOnly = true;
                firstKmInput.style.backgroundColor = '';
                succeedingKmInput.style.backgroundColor = '';
              }
            });

            // Update discount fare if regular fare is updated
            if (type === 'regular') {
              updateDiscountFare(fareData);
            }
          }

          function updateDiscountFare(regularFare) {
            const discountFare = {
              firstKm: parseFloat((regularFare.firstKm * 0.8).toFixed(2)),
              succeedingKm: parseFloat((regularFare.succeedingKm * 0.8).toFixed(2))
            };

            database.ref('fares/discount').set(discountFare, (error) => {
              if (error) {
                alert('Error saving discount fare: ' + error.message);
              } else {
                document.getElementById('discount-first-km').value = discountFare.firstKm.toFixed(2);
                document.getElementById('discount-succeeding-km').value = discountFare.succeedingKm.toFixed(2);
                console.log('Discount fare updated successfully!');
              }
            });
          }

          function loadFareData(type) {
            database.ref('fares/' + type).once('value').then((snapshot) => {
              const fareData = snapshot.val();
              if (fareData) {
                document.getElementById(`${type}-first-km`).value = fareData.firstKm.toFixed(2);
                document.getElementById(`${type}-succeeding-km`).value = fareData.succeedingKm.toFixed(2);
              }
            }).catch((error) => {
              console.log('Error fetching data: ' + error.message);
            });
          }
      
          // Load initial data
          loadFareData('regular');
          loadFareData('discount');