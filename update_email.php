<?php
require __DIR__ . '/vendor/autoload.php'; // ✅ Ensure Firebase SDK is loaded

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Kreait\Firebase\Database;

try {
    // ✅ Initialize Firebase Services
    $factory = (new Factory)
        ->withServiceAccount(__DIR__ . '/firebase-admin-sdk.json')
        ->withDatabaseUri('https://e-jeepney-8fe2e-default-rtdb.firebaseio.com');

    $auth = $factory->createAuth();         // ✅ Firebase Authentication
    $database = $factory->createDatabase(); // ✅ Firebase Realtime Database

    // ✅ Retrieve POST data
    $driverID = $_POST['driverID'] ?? null;
    $newEmail = $_POST['email'] ?? null;

    if (!$driverID || !$newEmail) {
        throw new Exception("Missing driver ID or email.");
    }

    // ✅ Update email in Firebase Authentication
    $auth->updateUser($driverID, ['email' => $newEmail]);

    // ✅ Update email in Firebase Realtime Database (`users/accounts/{uid}/email`)
    $database->getReference("users/accounts/{$driverID}/email")->set($newEmail);

    // ✅ Send JSON response back to JavaScript
    echo json_encode(["success" => true, "message" => "Email updated successfully!"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "❌ Firebase Error: " . $e->getMessage()]);
}
?>
