<?php 
if($_SERVER["REQUEST_METHOD"] == "POST"){  
    $username = $_POST['email'];
    $password = $_POST['password'];

    $host = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "ejeepsdb";

    $conn = new mysqli($host, $dbuser, $dbpass, $dbname);

    if($conn->connect_error){
        die("Connection Failed: ". $conn->connect_error);
    }
    $stmt = $conn->prepare("SELECT * FROM accounts WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows == 1){
        header("Location: /web-final/index.php");
        exit();
    } else{
        header("Location: /web-final/login.php?error=1");
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
