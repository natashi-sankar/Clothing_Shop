<?php
session_start();

$customer_username = $_POST['username'] ?? '';
$customer_password = $_POST['pass'] ?? '';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ClothingStore";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT * FROM User WHERE username = :username AND pass = :pass");
    $stmt->execute([':username' => $customer_username, ':pass' => $customer_password]);

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user){
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];

            echo json_encode(["success" => true]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "msg" => "Incorrect username or password."]);
    }
} catch(PDOException $e) {
    echo json_encode(["success" => false, "msg" => "Error: " . $e->getMessage()]);
}

$conn = null;
?>