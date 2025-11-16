<?php

$customer_username = $_POST['username'] ?? '';
$customer_password = $_POST['pass'] ?? '';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ClothingStore";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT * FROM User WHERE username = :username");
    $stmt->execute([':username' => $customer_username]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "msg" => "An account already exists with that username."]);
    } else {
        $createAccountQuery = $conn->prepare("INSERT INTO User (email, username, pass)
        VALUES (:email, :username, :pass)");

        $createAccountQuery->execute([
            ':username' => $customer_username,
            ':pass' => $customer_password,
            ':email' => $customer_username . '@email.com'
        ]);

        echo json_encode(["success" => true, "msg" => "Account successfully created."]);
    }
} catch(PDOException $e) {
    echo json_encode(["success" => false, "msg" => "Error: " . $e->getMessage()]);
}

$conn = null;
?>